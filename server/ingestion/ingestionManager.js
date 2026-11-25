// server/ingestion/ingestionManager.js
// Durable, Fenced, Trust-Scored Notification Ingestion Orchestrator

import { OFFICIAL_EXAM_SOURCES, INGESTION_CONFIG } from './sourcesConfig.js';
import {
  generateNotificationFingerprint,
  buildDeterministicId,
  isDuplicateNotification
} from './deduplicationHelper.js';
import {
  buildIdentityFingerprint,
  computeContentHash,
  evaluateCorrigendumUpdate
} from './corrigendumHelper.js';
import { safeVerifyOfficialDocument } from './fetchHelper.js';
import { evaluateCandidateTrust } from './trustScoringEngine.js';
import {
  DEFAULT_LOCK_KEY,
  LEASE_DURATION_MS,
  HEARTBEAT_INTERVAL_MS,
  generateRunId,
  generateJobId,
  supportsMongoTransactions,
  acquireIngestionLock,
  renewIngestionLock,
  assertLockOwnership,
  releaseIngestionLock,
  recoverStaleIngestionJobs
} from './ingestionLockHelper.js';
import { getKolkataToday } from '../../src/utils/notificationDateHelper.js';

import { scrapeTnpscNotifications, scrapeTnusrbNotifications, scrapeTrbNotifications, scrapeMrbNotifications } from './scrapers/tnStateScraper.js';
import { scrapeIbpsNotifications, scrapeSbiNotifications, scrapeRbiNotifications } from './scrapers/bankingScraper.js';
import { scrapeUpscNotifications, scrapeSscNotifications, scrapeRrbNotifications, scrapeIndiaPostNotifications } from './scrapers/centralGovtScraper.js';
import {
  scrapeIndianArmyNotifications,
  scrapeIndianNavyNotifications,
  scrapeIndianAirforceNotifications,
  scrapeCtetNotifications,
  scrapeKvsNotifications
} from './scrapers/defenceTeachingScraper.js';
import {
  scrapeLicNotifications,
  scrapeNiaclNotifications,
  scrapeBelNotifications,
  scrapeBhelNotifications
} from './scrapers/insurancePsuScraper.js';
import { scrapePilotDistrictSource } from './scrapers/districtRecruitmentScraper.js';

// Handler map from source key to scraper function
const SCRAPER_MAP = {
  tnpsc: scrapeTnpscNotifications,
  tnusrb: scrapeTnusrbNotifications,
  trb_tn: scrapeTrbNotifications,
  mrb_tn: scrapeMrbNotifications,
  ibps: scrapeIbpsNotifications,
  sbi_careers: scrapeSbiNotifications,
  rbi_vacancies: scrapeRbiNotifications,
  upsc_active: scrapeUpscNotifications,
  ssc_notices: scrapeSscNotifications,
  rrb_chennai: scrapeRrbNotifications,
  rrb_central: scrapeRrbNotifications,
  india_post_gds: scrapeIndiaPostNotifications,
  indian_army: scrapeIndianArmyNotifications,
  indian_navy: scrapeIndianNavyNotifications,
  indian_airforce: scrapeIndianAirforceNotifications,
  ctet_cbse: scrapeCtetNotifications,
  kvs_delhi: scrapeKvsNotifications,
  lic_careers: scrapeLicNotifications,
  niacl_careers: scrapeNiaclNotifications,
  bel_psu: scrapeBelNotifications,
  bhel_psu: scrapeBhelNotifications
};

// Fallback in-memory diagnostics cache (supplemented by persistent MongoDB models when available)
let lastIngestionState = {
  lastRunAt: null,
  lastJobId: null,
  lastRunId: null,
  lastFencingToken: 0,
  durationMs: 0,
  sourcesAttempted: 0,
  sourcesSucceeded: 0,
  sourcesFailed: 0,
  newRecordsInserted: 0,
  autoPublishedCount: 0,
  pendingReviewCount: 0,
  quarantinedCount: 0,
  corrigendaUpdatedCount: 0,
  duplicatesSkipped: 0,
  rejectedSkipped: 0,
  errors: [],
  sourceResults: {}
};

// In-process concurrency fallback when running without IngestionLock model
let isInMemoryRunning = false;
let currentRunStartedAt = null;

export function isIngestionInProgress() {
  return isInMemoryRunning;
}

export function getIngestionStatus() {
  return {
    isIngestionRunning: isInMemoryRunning,
    currentRunStartedAt,
    ...lastIngestionState
  };
}

function emptySourceStats() {
  return {
    itemsFound: 0,
    newlyInserted: 0,
    autoPublished: 0,
    pendingReview: 0,
    quarantined: 0,
    corrigendaUpdated: 0,
    duplicatesSkipped: 0,
    rejectedSkipped: 0
  };
}

/**
 * Recomputes aggregate job summary strictly from current per-source checkpoints.
 * Prevents cumulative += double-counting if any interrupted source is retried after crash.
 */
export function recomputeJobSummary(sourceQueue = []) {
  const agg = {
    sourcesQueued: sourceQueue.length,
    sourcesRemaining: 0,
    sourcesAttempted: 0,
    sourcesSucceeded: 0,
    sourcesFailed: 0,
    newRecordsInserted: 0,
    autoPublishedCount: 0,
    pendingReviewCount: 0,
    quarantinedCount: 0,
    corrigendaUpdatedCount: 0,
    duplicatesSkipped: 0,
    rejectedSkipped: 0
  };

  for (const slot of sourceQueue) {
    if (slot.status === 'completed' || slot.status === 'failed') {
      agg.sourcesAttempted++;
    } else {
      agg.sourcesRemaining++;
    }
    if (slot.status === 'completed') {
      agg.sourcesSucceeded++;
    } else if (slot.status === 'failed') {
      agg.sourcesFailed++;
    }
    const st = slot.stats || {};
    agg.newRecordsInserted += st.newlyInserted || 0;
    agg.autoPublishedCount += st.autoPublished || 0;
    agg.pendingReviewCount += st.pendingReview || 0;
    agg.quarantinedCount += st.quarantined || 0;
    agg.corrigendaUpdatedCount += st.corrigendaUpdated || 0;
    agg.duplicatesSkipped += st.duplicatesSkipped || 0;
    agg.rejectedSkipped += st.rejectedSkipped || 0;
  }

  return agg;
}

/**
 * Executes a callback inside a MongoDB transaction when replica-set transactions are supported,
 * verifying lock ownership on every retry, or executes directly in standalone/mock mode.
 */
async function executeWithTransactionOrStandalone({
  useTransactions,
  mongooseConnection,
  IngestionLock,
  lockKey,
  runId,
  fencingToken,
  getNow,
  workFn
}) {
  if (!useTransactions || !mongooseConnection || typeof mongooseConnection.startSession !== 'function') {
    await assertLockOwnership(IngestionLock, { lockKey, runId, fencingToken, now: getNow() });
    return await workFn(null);
  }

  const maxTxAttempts = 2;
  for (let attempt = 1; attempt <= maxTxAttempts; attempt++) {
    const session = await mongooseConnection.startSession();
    try {
      let result;
      await session.withTransaction(async () => {
        await assertLockOwnership(IngestionLock, { lockKey, runId, fencingToken, now: getNow(), session });
        result = await workFn(session);
      });
      return result;
    } catch (txErr) {
      if (txErr?.code === 'FENCING_OWNERSHIP_LOST') {
        throw txErr;
      }
      const isTransient =
        txErr?.errorLabels?.includes('TransientTransactionError') ||
        txErr?.code === 112 ||
        String(txErr?.message || '').includes('WriteConflict');

      if (!isTransient || attempt >= maxTxAttempts) {
        throw txErr;
      }
      // Verify ownership BEFORE retrying a TransientTransactionError
      await assertLockOwnership(IngestionLock, { lockKey, runId, fencingToken, now: getNow() });
    } finally {
      await session.endSession();
    }
  }
}

/**
 * Idempotently updates persistent IngestionSourceHealth telemetry using fencing guard
 * and per-job once-only counter tracking (`lastCountedJobId !== jobId`).
 */
async function persistSourceHealthTelemetry(IngestionSourceHealth, params) {
  if (!IngestionSourceHealth || params?.dryRun) return;
  const {
    source,
    jobId,
    runId,
    fencingToken,
    ranAt,
    durationMs,
    status,
    error = '',
    stats = {}
  } = params;

  const baseSet = {
    sourceName: source.name,
    category: source.category,
    url: source.url,
    enabled: Boolean(source.enabled),
    lastAttemptAt: ranAt,
    lastStatus: status,
    lastError: status === 'ok' ? '' : String(error || '').slice(0, 500),
    lastDurationMs: durationMs,
    lastItemsExtracted: stats.itemsFound || 0,
    lastInserted: stats.newlyInserted || 0,
    lastUpdated: stats.corrigendaUpdated || 0,
    lastQuarantined: stats.quarantined || 0,
    lastRunId: runId,
    lastJobId: jobId,
    lastWriteFencingToken: fencingToken,
    updatedAt: ranAt,
    ...(status === 'ok' ? { lastSuccessAt: ranAt } : { lastFailureAt: ranAt })
  };

  // Update metadata fenced by lastWriteFencingToken <= fencingToken
  await IngestionSourceHealth.updateOne(
    {
      sourceKey: source.key,
      $or: [
        { lastWriteFencingToken: { $exists: false } },
        { lastWriteFencingToken: { $lte: fencingToken } }
      ]
    },
    {
      $setOnInsert: {
        sourceKey: source.key,
        totalRuns: 0,
        totalSuccesses: 0,
        totalFailures: 0,
        consecutiveFailures: 0,
        recentRuns: []
      },
      $set: baseSet
    },
    { upsert: true }
  ).catch(async (err) => {
    if (err?.code === 11000) {
      await IngestionSourceHealth.updateOne(
        {
          sourceKey: source.key,
          $or: [
            { lastWriteFencingToken: { $exists: false } },
            { lastWriteFencingToken: { $lte: fencingToken } }
          ]
        },
        { $set: baseSet }
      );
    }
  });

  // Increment cumulative counters AT MOST ONCE per jobId even if source is retried after crash
  const runEntry = {
    jobId,
    runId,
    ranAt,
    status,
    durationMs,
    itemsFound: stats.itemsFound || 0,
    inserted: stats.newlyInserted || 0,
    updated: stats.corrigendaUpdated || 0,
    quarantined: stats.quarantined || 0,
    error: status === 'ok' ? '' : String(error || '').slice(0, 300)
  };

  const counterSet = {
    lastCountedJobId: jobId
  };
  if (status === 'ok') {
    counterSet.consecutiveFailures = 0;
  }

  await IngestionSourceHealth.updateOne(
    {
      sourceKey: source.key,
      lastCountedJobId: { $ne: jobId },
      $or: [
        { lastWriteFencingToken: { $exists: false } },
        { lastWriteFencingToken: { $lte: fencingToken } }
      ]
    },
    {
      $inc: {
        totalRuns: 1,
        totalSuccesses: status === 'ok' ? 1 : 0,
        totalFailures: status === 'ok' ? 0 : 1,
        ...(status !== 'ok' ? { consecutiveFailures: 1 } : {})
      },
      $set: counterSet,
      $push: {
        recentRuns: { $each: [runEntry], $slice: -10 }
      }
    }
  );
}

export function classifyFailureStatus(result = {}) {
  const errLower = String(result.error || '').toLowerCase();
  const failureCode = String(result.failureCode || '').toUpperCase();
  const status = Number(result.status);

  // 1. CAPTCHA challenges & Bot detection walls
  if (result.requiresCaptcha || /captcha|challenge-running|cf-turnstile|recaptcha/i.test(errLower)) {
    return 'captcha_blocked';
  }

  // 2. DNS Resolution failures
  if (
    failureCode === 'ENOTFOUND' ||
    failureCode === 'EAI_AGAIN' ||
    failureCode === 'DNS_EMPTY' ||
    /getaddrinfo\s+enotfound|dns resolution returned no addresses|dns_empty/i.test(errLower)
  ) {
    return 'dns_failed';
  }

  // 3. TCP Connection failures (refused, unreachable host/network, connection reset)
  if (
    failureCode === 'ECONNREFUSED' ||
    failureCode === 'EHOSTUNREACH' ||
    failureCode === 'ENETUNREACH' ||
    failureCode === 'ECONNRESET' ||
    /econnrefused|ehostunreach|enetunreach|econnreset|connection refused|host unreachable/i.test(errLower)
  ) {
    return 'tcp_failed';
  }

  // 4. TLS / SSL Certificate / Handshake failures
  if (
    failureCode === 'CERT_HAS_EXPIRED' ||
    failureCode === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
    failureCode === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
    failureCode === 'ERR_TLS_CERT_ALTNAME_INVALID' ||
    failureCode === 'CERT_UNTRUSTED' ||
    /tls|ssl|handshake|certificate|unable to verify leaf|cert_has_expired/i.test(errLower)
  ) {
    return 'tls_failed';
  }

  // 5. Geographic / IP Blocking
  if (/geo[-_]?block|geographic|region[-_]?block|country[-_]?block/i.test(errLower)) {
    return 'geo_blocked';
  }

  // 6. HTTP 403 Forbidden
  if (status === 403 || /\b403\b|forbidden/i.test(errLower)) {
    return 'http_403';
  }

  // 7. HTTP 404 Not Found
  if (status === 404 || /\b404\b|not found/i.test(errLower)) {
    return 'http_404';
  }

  // 8. Timeouts (Socket, Wall-clock, Connect)
  if (
    failureCode === 'ETIMEDOUT' ||
    failureCode === 'WALL_CLOCK_TIMEOUT' ||
    failureCode === 'SOCKET_TIMEOUT' ||
    status === 408 ||
    /timed out|timeout|etimedout/i.test(errLower)
  ) {
    return 'timeout';
  }

  // 9. Server 5xx Errors
  if ((status >= 500 && status < 600) || /internal server error|\b502\b|\b503\b|\b504\b|bad gateway|service unavailable/i.test(errLower)) {
    return 'server_error';
  }

  return 'failed';
}

/**
 * Loads existing notifications with all fields required for deduplication,
 * rejection memory, corrigendum comparison, manual override protection, and fencing.
 */
async function loadExistingNotifications(NotificationModel) {
  return NotificationModel.find({}, {
    id: 1,
    category: 1,
    sourceKey: 1,
    organization: 1,
    service: 1,
    postName: 1,
    notificationNo: 1,
    openingDate: 1,
    closingDate: 1,
    examDate: 1,
    posts: 1,
    detailsLink: 1,
    applyLink: 1,
    sourcePublishedAt: 1,
    ingestionStatus: 1,
    isVerified: 1,
    fingerprint: 1,
    identityFingerprint: 1,
    contentHash: 1,
    rejectedContentHash: 1,
    manualOverrideLock: 1,
    revisionCount: 1,
    originJobId: 1,
    lastWriteFencingToken: 1
  }).lean();
}

/**
 * Runs durable ingestion across registered official exam sources.
 * Supports crash-resumable source checkpoints, monotonic fencing-token locks,
 * SSRF/PDF verification, trust scoring, corrigendum reconciliation, and telemetry.
 */
export async function runAllIngestionJobs(NotificationModel, options = {}) {
  const models = options.models || {};
  const IngestionJob = models.IngestionJob || null;
  const IngestionLock = models.IngestionLock || null;
  const IngestionSourceHealth = models.IngestionSourceHealth || null;
  const IngestionRunLog = models.IngestionRunLog || null;
  const mongooseConnection = models.mongooseConnection || null;

  const getNow = typeof options.now === 'function'
    ? options.now
    : () => (options.now instanceof Date ? options.now : new Date());

  const isStrictReadOnlyDryRun = options.dryRun === true || String(options.dryRun ?? '').trim().toLowerCase() === 'true';
  const lockKey = options.lockKey || DEFAULT_LOCK_KEY;
  const leaseMs = options.leaseMs || LEASE_DURATION_MS;
  const heartbeatMs = options.heartbeatMs || HEARTBEAT_INTERVAL_MS;
  const runId = options.runId || generateRunId();

  // In-memory lock fallback if no distributed lock model is supplied (skipped in strict read-only dry-run)
  if (!isStrictReadOnlyDryRun && !IngestionLock && isInMemoryRunning) {
    const error = new Error('INGESTION_IN_PROGRESS');
    error.code = 'CONCURRENT_INGESTION_LOCKED';
    error.status = 409;
    error.startedAt = currentRunStartedAt;
    throw error;
  }

  let fencingToken = isStrictReadOnlyDryRun ? 0 : 1;
  let acquiredLock = false;
  let heartbeatTimer = null;
  let leaseLost = false;
  let leaseLostReason = '';

  const startTime = getNow().getTime();
  const runStartedIso = new Date(startTime).toISOString();
  if (!isStrictReadOnlyDryRun) {
    isInMemoryRunning = true;
    currentRunStartedAt = runStartedIso;
  }

  try {
    // 1. Recover any crashed stale jobs whose leases expired before acquiring lock
    if (!isStrictReadOnlyDryRun && IngestionJob) {
      await recoverStaleIngestionJobs(IngestionJob, { now: getNow(), maxAttempts: options.maxAttempts || 3 });
    }

    // 2. Acquire durable distributed lock (monotonic fencingToken)
    if (!isStrictReadOnlyDryRun && IngestionLock) {
      const lockRes = await acquireIngestionLock(IngestionLock, {
        lockKey,
        leaseMs,
        runId,
        now: getNow()
      });
      if (!lockRes.acquired) {
        const error = new Error('INGESTION_IN_PROGRESS');
        error.code = 'CONCURRENT_INGESTION_LOCKED';
        error.status = 409;
        error.reason = lockRes.reason;
        error.startedAt = lockRes.existingExpiresAt ? new Date(lockRes.existingExpiresAt).toISOString() : runStartedIso;
        throw error;
      }
      fencingToken = lockRes.fencingToken;
      acquiredLock = true;
    }

    // Check replica-set transaction capability once per run (never needed in read-only dry-run)
    const useTransactions = isStrictReadOnlyDryRun
      ? false
      : await supportsMongoTransactions(mongooseConnection, {
        forceStandaloneMode: Boolean(options.forceStandaloneMode)
      });

    if (!NotificationModel) {
      return {
        runId,
        fencingToken,
        dryRun: isStrictReadOnlyDryRun,
        readOnly: isStrictReadOnlyDryRun,
        persisted: false,
        startedAt: runStartedIso,
        completedAt: getNow().toISOString(),
        durationMs: 0,
        sourcesQueued: 0,
        sourcesRemaining: 0,
        sourcesAttempted: 0,
        sourcesSucceeded: 0,
        sourcesFailed: 0,
        newRecordsInserted: 0,
        autoPublishedCount: 0,
        pendingReviewCount: 0,
        quarantinedCount: 0,
        corrigendaUpdatedCount: 0,
        duplicatesSkipped: 0,
        rejectedSkipped: 0,
        errors: ['NotificationModel is required for persistence'],
        sourceResults: {}
      };
    }

    const allMatchingSources = options.sourceKey
      ? OFFICIAL_EXAM_SOURCES.filter((s) => s.key === options.sourceKey)
      : OFFICIAL_EXAM_SOURCES.filter((s) => s.enabled);
    const totalSourcesMatching = allMatchingSources.length;
    const rawOffset = Number(options.sourceOffset);
    const effectiveOffset = isStrictReadOnlyDryRun && Number.isInteger(rawOffset) && rawOffset >= 0
      ? Math.min(rawOffset, totalSourcesMatching)
      : 0;
    const sourcesToRun = effectiveOffset > 0
      ? allMatchingSources.slice(effectiveOffset)
      : allMatchingSources;

    // 3. Create or resume durable IngestionJob bound with same (runId, fencingToken)
    let activeJob = null;
    let jobId = options.jobId || (isStrictReadOnlyDryRun ? `dryrun_${generateJobId()}` : generateJobId());
    let isDryRun = isStrictReadOnlyDryRun;

    if (!isStrictReadOnlyDryRun && IngestionJob) {
      if (!options.sourceKey && !isStrictReadOnlyDryRun) {
        // Attempt to resume oldest recovered pending or retry_pending job first
        const pendingJob = await IngestionJob.findOne({ status: { $in: ['pending', 'retry_pending'] } })
          .sort({ createdAt: 1 })
          .lean();
        if (pendingJob) {
          const resetQueue = (pendingJob.sourceQueue || []).map((slot) =>
            slot.status === 'running' ? { ...slot, status: 'pending' } : slot
          );
          const claimFilter = {
            jobId: pendingJob.jobId,
            status: { $in: ['pending', 'retry_pending'] }
          };
          if (IngestionLock) {
            claimFilter.$or = [{ fencingToken: { $lt: fencingToken } }, { fencingToken: null }];
          } else {
            claimFilter.$or = [{ fencingToken: { $lte: fencingToken } }, { fencingToken: null }];
          }
          const claimedJob = await IngestionJob.findOneAndUpdate(
            claimFilter,
            {
              $set: {
                status: 'running',
                ownerRunId: runId,
                fencingToken,
                sourceQueue: resetQueue,
                lastResumedAt: getNow(),
                heartbeatAt: getNow(),
                leaseExpiresAt: new Date(getNow().getTime() + leaseMs)
              },
              $inc: { attemptCount: 1 }
            },
            { new: true }
          );
          if (claimedJob) {
            activeJob = claimedJob.toObject ? claimedJob.toObject() : claimedJob;
            jobId = activeJob.jobId;
            isDryRun = options.dryRun !== undefined ? Boolean(options.dryRun) : Boolean(activeJob.dryRun);
          }
        }
      }

      if (!activeJob) {
        const initialQueue = sourcesToRun.map((src) => ({
          sourceKey: src.key,
          status: 'pending',
          attempts: 0,
          stats: emptySourceStats(),
          lastError: '',
          startedAt: null,
          completedAt: null,
          durationMs: 0
        }));

        const created = await IngestionJob.create({
          jobId,
          triggerType: options.triggerType || 'manual_admin',
          status: 'running',
          dryRun: isDryRun,
          sourceKeyFilter: options.sourceKey || '',
          ownerRunId: runId,
          fencingToken,
          attemptCount: 1,
          maxAttempts: options.maxAttempts || 3,
          sourceQueue: initialQueue,
          summary: recomputeJobSummary(initialQueue),
          errors: [],
          startedAt: getNow(),
          heartbeatAt: getNow(),
          leaseExpiresAt: new Date(getNow().getTime() + leaseMs),
          createdAt: getNow()
        });
        activeJob = created.toObject ? created.toObject() : created;
      }
    }

    // 4. Start periodic 45-second lease renewal heartbeat (live runs only)
    if (!isStrictReadOnlyDryRun && IngestionLock && heartbeatMs > 0) {
      heartbeatTimer = setInterval(async () => {
        try {
          const nowDt = getNow();
          const renewed = await renewIngestionLock(IngestionLock, {
            lockKey,
            runId,
            fencingToken,
            leaseMs,
            now: nowDt
          });
          if (!renewed.renewed) {
            leaseLost = true;
            leaseLostReason = renewed.reason || 'HEARTBEAT_RENEWAL_FAILED';
            return;
          }
          if (IngestionJob) {
            const jobMirror = await IngestionJob.findOneAndUpdate(
              { jobId, ownerRunId: runId, fencingToken, status: 'running' },
              { $set: { heartbeatAt: nowDt, leaseExpiresAt: renewed.leaseExpiresAt } },
              { new: true }
            );
            if (!jobMirror) {
              leaseLost = true;
              leaseLostReason = 'JOB_OWNERSHIP_LOST';
            }
          }
        } catch (hbErr) {
          leaseLost = true;
          leaseLostReason = hbErr.message;
        }
      }, heartbeatMs);
    }

    const errors = [...(activeJob?.errors || [])];
    const sourceResults = {};
    let sourceQueue = activeJob?.sourceQueue
      ? activeJob.sourceQueue.map((s) => ({ ...s, stats: { ...emptySourceStats(), ...(s.stats || {}) } }))
      : sourcesToRun.map((s) => ({ sourceKey: s.key, status: 'pending', attempts: 0, stats: emptySourceStats() }));

    // Preserve completed checkpoints from earlier crash recovery runs
    for (const slot of sourceQueue) {
      if (slot.status === 'completed' || slot.status === 'failed') {
        sourceResults[slot.sourceKey] = {
          success: slot.status === 'completed',
          resumedFromCheckpoint: true,
          ...(slot.stats || {}),
          error: slot.lastError || undefined
        };
      }
    }

    // Fetch existing notifications index once and refresh incrementally in memory
    let existingList = await loadExistingNotifications(NotificationModel);

    const verifyDocFn = options.verifyDocumentFn
      || (options.skipDocVerification
        ? async () => ({ docState: 'unavailable', reason: 'DOC_VERIFICATION_SKIPPED' })
        : (url, sKey, meta) => safeVerifyOfficialDocument(url, sKey, {
          ...meta,
          dnsLookup: options.dnsLookup,
          allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock),
          skipRateLimit: Boolean(options.skipRateLimit)
        }));

    // 5. Iterate ONLY incomplete ('pending') source checkpoints
    const maxSourcesThisTick = typeof options.maxSources === 'number' && options.maxSources > 0
      ? options.maxSources
      : sourceQueue.length;
    let processedThisTick = 0;

    for (let idx = 0; idx < sourceQueue.length; idx++) {
      const slot = sourceQueue[idx];
      if (slot.status === 'completed' || slot.status === 'failed') {
        continue; // STRICT: Never re-execute completed checkpoints
      }
      if (processedThisTick >= maxSourcesThisTick) {
        break;
      }

      if (leaseLost) {
        const err = new Error(`FENCING_OWNERSHIP_LOST: ${leaseLostReason}`);
        err.code = 'FENCING_OWNERSHIP_LOST';
        throw err;
      }

      // Authoritative check before touching next source
      if (!isStrictReadOnlyDryRun) {
        await assertLockOwnership(IngestionLock, { lockKey, runId, fencingToken, now: getNow() });
      }

      const source = OFFICIAL_EXAM_SOURCES.find((s) => s.key === slot.sourceKey);
      if (!source) {
        slot.status = 'failed';
        slot.lastError = 'Source missing from registry';
        continue;
      }

      processedThisTick++;
      const srcStartTime = getNow();

      // Mark slot running in durable job checkpoint
      slot.status = 'running';
      slot.attempts = (slot.attempts || 0) + 1;
      slot.startedAt = srcStartTime;
      if (!isStrictReadOnlyDryRun && IngestionJob) {
        const markRes = await IngestionJob.updateOne(
          { jobId, ownerRunId: runId, fencingToken, status: 'running' },
          { $set: { [`sourceQueue.${idx}.status`]: 'running', [`sourceQueue.${idx}.attempts`]: slot.attempts, [`sourceQueue.${idx}.startedAt`]: srcStartTime, currentSourceKey: source.key, heartbeatAt: srcStartTime } }
        );
        if ((markRes?.matchedCount ?? markRes?.n ?? 1) === 0) {
          const err = new Error(`FENCING_OWNERSHIP_LOST while marking source ${source.key} running`);
          err.code = 'FENCING_OWNERSHIP_LOST';
          throw err;
        }
      }

      const scraperFn = options.scraperOverrides?.[source.key] || SCRAPER_MAP[source.key] || ((source.districtId || source.key?.startsWith('dist_') || source.key?.startsWith('corp_')) ? scrapePilotDistrictSource : null);
      if (!scraperFn) {
        const failErr = 'No scraper implemented';
        slot.status = 'failed';
        slot.lastError = failErr;
        slot.completedAt = getNow();
        sourceResults[source.key] = { success: false, error: failErr, itemsFound: 0 };
        errors.push(`[${source.key}] ${failErr}`);
        if (!isDryRun) {
          await persistSourceHealthTelemetry(IngestionSourceHealth, {
            source, jobId, runId, fencingToken, ranAt: getNow(), durationMs: 0, status: 'failed', error: failErr, dryRun: isDryRun
          });
        }
        continue;
      }

      try {
        const scrapeResult = await scraperFn(source, { dnsLookup: options.dnsLookup, allowHttpForLocalMock: options.allowHttpForLocalMock });

        if (!scrapeResult || !scrapeResult.success) {
          const failStatus = classifyFailureStatus(scrapeResult);
          const failErr = scrapeResult?.error || 'Scrape failed';
          const srcDur = getNow().getTime() - srcStartTime.getTime();
          slot.status = 'failed';
          slot.lastError = failErr;
          slot.completedAt = getNow();
          slot.durationMs = srcDur;
          slot.stats = emptySourceStats();
          sourceResults[source.key] = { success: false, error: failErr, status: failStatus, itemsFound: 0 };
          errors.push(`[${source.key}] ${failErr}`);

          if (!isStrictReadOnlyDryRun) {
            await assertLockOwnership(IngestionLock, { lockKey, runId, fencingToken, now: getNow() });
          }
          if (!isDryRun) {
            await persistSourceHealthTelemetry(IngestionSourceHealth, {
              source, jobId, runId, fencingToken, ranAt: getNow(), durationMs: srcDur, status: failStatus, error: failErr, stats: slot.stats, dryRun: isDryRun
            });
          }
          if (!isStrictReadOnlyDryRun && IngestionJob) {
            const recomputed = recomputeJobSummary(sourceQueue);
            const cpRes = await IngestionJob.updateOne(
              { jobId, ownerRunId: runId, fencingToken, status: 'running' },
              { $set: { [`sourceQueue.${idx}`]: slot, summary: recomputed, heartbeatAt: getNow() }, $push: { errors: `[${source.key}] ${failErr}` } }
            );
            if ((cpRes?.matchedCount ?? cpRes?.n ?? 1) === 0) {
              const fenceErr = new Error(`FENCING_OWNERSHIP_LOST on checkpoint for ${source.key}`);
              fenceErr.code = 'FENCING_OWNERSHIP_LOST';
              throw fenceErr;
            }
          }
          continue;
        }

        const extractedItems = scrapeResult.items || [];
        const srcStats = emptySourceStats();
        srcStats.itemsFound = extractedItems.length;

        const nowDt = getNow();
        const todayKolkata = getKolkataToday(nowDt);

        for (const rawItem of extractedItems) {
          if (leaseLost) {
            const err = new Error(`FENCING_OWNERSHIP_LOST: ${leaseLostReason}`);
            err.code = 'FENCING_OWNERSHIP_LOST';
            throw err;
          }

          const item = { ...rawItem, sourceKey: rawItem.sourceKey || source.key };
          const fingerprint = generateNotificationFingerprint(item);
          const identityFingerprint = buildIdentityFingerprint(item);
          const contentHash = computeContentHash(item);
          const stableId = buildDeterministicId(source.key, item);

          const enrichedCandidate = {
            ...item,
            id: stableId,
            fingerprint,
            identityFingerprint,
            contentHash
          };

          const dupCheck = isDuplicateNotification(enrichedCandidate, existingList);

          // A. Rejection Memory Hit -> skip without re-inserting
          if (dupCheck.isRejectedHit) {
            srcStats.rejectedSkipped++;
            continue;
          }

          // B. Exact content duplicate (or same-job retry) -> touch lastScrapedAt safely with fence
          if (dupCheck.isDuplicate && !dupCheck.isCorrigendumCandidate) {
            const matched = dupCheck.matchedExisting;
            // If item was inserted in an interrupted attempt of THIS SAME jobId, preserve accurate count once
            if (matched?.originJobId && matched.originJobId === jobId) {
              srcStats.newlyInserted++;
              if (matched.autoPublished) srcStats.autoPublished++;
              else if (matched.ingestionStatus === 'quarantined') srcStats.quarantined++;
              else srcStats.pendingReview++;
            } else {
              srcStats.duplicatesSkipped++;
              if (!isDryRun && dupCheck.matchedExistingId) {
                await NotificationModel.updateOne(
                  {
                    id: dupCheck.matchedExistingId,
                    $or: [
                      { lastWriteFencingToken: { $exists: false } },
                      { lastWriteFencingToken: { $lte: fencingToken } }
                    ]
                  },
                  { $set: { lastScrapedAt: nowDt, lastWriteFencingToken: fencingToken } }
                ).catch(() => {});
              }
            }
            continue;
          }

          // Run bounded SSRF-safe document verification for new items & corrigenda
          const docVerification = await verifyDocFn(item.detailsLink, source.key, {
            expectedTitle: item.service,
            notificationNo: item.notificationNo
          });

          // C. Corrigendum / Deadline-Extension / Update Reconciliation
          if (dupCheck.isDuplicate && dupCheck.isCorrigendumCandidate && dupCheck.matchedExisting) {
            const existingDoc = dupCheck.matchedExisting;
            const corrDecision = evaluateCorrigendumUpdate({
              existing: existingDoc,
              candidate: enrichedCandidate,
              ambiguousMatchCount: dupCheck.ambiguousCount || 1,
              docVerification,
              runId,
              fencingToken,
              jobId,
              now: nowDt,
              today: todayKolkata,
              env: options.env || process.env,
              allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
            });

            if (corrDecision.decision === 'exact_duplicate') {
              srcStats.duplicatesSkipped++;
              continue;
            }

            if (corrDecision.decision === 'apply_corrigendum_update') {
              if (!isDryRun) {
                await executeWithTransactionOrStandalone({
                  useTransactions,
                  mongooseConnection,
                  IngestionLock,
                  lockKey,
                  runId,
                  fencingToken,
                  getNow,
                  workFn: async (session) => {
                    const updateQuery = {
                      id: existingDoc.id,
                      manualOverrideLock: { $ne: true },
                      revisionCount: corrDecision.expectedRevisionCount,
                      $or: [
                        { lastWriteFencingToken: { $exists: false } },
                        { lastWriteFencingToken: { $lt: fencingToken } },
                        { lastWriteFencingToken: fencingToken, lastIngestedJobId: jobId }
                      ]
                    };
                    const updateOp = {
                      $set: {
                        ...corrDecision.mergedFields,
                        lastWriteFencingToken: fencingToken,
                        lastIngestedJobId: jobId
                      },
                      $inc: { revisionCount: 1 },
                      $push: {
                        revisionHistory: {
                          $each: [corrDecision.revisionEntry],
                          $slice: -20
                        }
                      }
                    };
                    const call = session
                      ? NotificationModel.updateOne(updateQuery, updateOp, { session })
                      : NotificationModel.updateOne(updateQuery, updateOp);
                    const updRes = await call;
                    if ((updRes?.matchedCount ?? updRes?.n ?? 0) === 0) {
                      const conflictErr = new Error(`FENCED_CORRIGENDUM_CONFLICT for ${existingDoc.id}`);
                      conflictErr.code = 'CORRIGENDUM_CONFLICT';
                      throw conflictErr;
                    }
                  }
                });
                // Update local index copy
                Object.assign(existingDoc, corrDecision.mergedFields, {
                  revisionCount: (existingDoc.revisionCount || 0) + 1
                });
              }
              srcStats.corrigendaUpdated++;
              continue;
            }

            // Conflicting / Manual-Locked / AUTO_PUBLISH_ENABLED=false corrigendum -> queue isolated proposal
            const isQuarantineCorr = corrDecision.decision === 'quarantined_corrigendum';
            const revProposalId = `${stableId}-rev-${contentHash.slice(0, 8)}`;
            const existingProposal = existingList.find((e) => e.id === revProposalId);
            if (existingProposal) {
              if (existingProposal.originJobId && existingProposal.originJobId === jobId) {
                srcStats.newlyInserted++;
                if (existingProposal.ingestionStatus === 'quarantined') srcStats.quarantined++;
                else srcStats.pendingReview++;
              } else {
                srcStats.duplicatesSkipped++;
              }
              continue;
            }

            const proposalPayload = {
              ...enrichedCandidate,
              id: revProposalId,
              parentNotificationId: existingDoc.id,
              ingestionStatus: isQuarantineCorr ? 'quarantined' : 'pending_review',
              isVerified: false,
              sourceIntegrityVerified: false,
              applicationDatesVerified: false,
              autoPublished: false,
              quarantineReason: isQuarantineCorr ? corrDecision.reason : '',
              hasCorrigendum: true,
              corrigendumSummary: corrDecision.corrigendumSummary || `Pending update (${corrDecision.reason})`,
              corrigendumDetectedAt: nowDt,
              noticeType: 'corrigendum',
              docVerificationStatus: docVerification.docState,
              ingestionSource: `scraper_${source.key}_corrigendum`,
              originJobId: jobId,
              originFencingToken: fencingToken,
              lastWriteFencingToken: fencingToken,
              lastIngestedJobId: jobId,
              firstDetectedAt: nowDt,
              lastScrapedAt: nowDt,
              updatedAt: nowDt
            };

            if (!isDryRun) {
              await insertNotificationIdempotently({
                NotificationModel,
                candidate: proposalPayload,
                existingList,
                useTransactions,
                mongooseConnection,
                IngestionLock,
                lockKey,
                runId,
                fencingToken,
                getNow
              });
            } else {
              existingList.push({ ...proposalPayload });
            }
            if (isQuarantineCorr) srcStats.quarantined++;
            else srcStats.pendingReview++;
            srcStats.newlyInserted++;
            continue;
          }

          // D. Brand-New Candidate -> Trust Score & Non-Compensatory Hard Gate Evaluation
          const trustEval = evaluateCandidateTrust(enrichedCandidate, {
            sourceKey: source.key,
            sourceConfig: source,
            docVerification,
            today: todayKolkata,
            now: nowDt,
            env: options.env || process.env,
            allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
          });

          const recordToPersist = {
            ...enrichedCandidate,
            sourceKey: source.key,
            noticeType: trustEval.noticeType,
            ingestionStatus: trustEval.ingestionStatus,
            isVerified: trustEval.isVerified,
            sourceIntegrityVerified: Boolean(trustEval.sourceIntegrityVerified),
            applicationDatesVerified: Boolean(trustEval.applicationDatesVerified),
            autoPublished: trustEval.autoPublished,
            trustScore: trustEval.trustScore,
            trustTier: trustEval.trustTier,
            trustBreakdown: trustEval.breakdown,
            quarantineReason: trustEval.quarantineReason,
            docVerificationStatus: trustEval.docVerificationStatus,
            docVerificationReason: trustEval.docVerificationReason,
            publishRunId: trustEval.autoPublished ? runId : '',
            originJobId: jobId,
            originFencingToken: fencingToken,
            lastWriteFencingToken: fencingToken,
            lastIngestedJobId: jobId,
            isNew: true,
            status: 'active',
            ingestionSource: `scraper_${source.key}`,
            firstDetectedAt: nowDt,
            lastScrapedAt: nowDt,
            updatedAt: nowDt
          };

          if (!isDryRun) {
            const insRes = await insertNotificationIdempotently({
              NotificationModel,
              candidate: recordToPersist,
              existingList,
              useTransactions,
              mongooseConnection,
              IngestionLock,
              lockKey,
              runId,
              fencingToken,
              getNow
            });
            if (insRes.duplicateRace) {
              srcStats.duplicatesSkipped++;
              continue;
            }
          } else {
            existingList.push({ ...recordToPersist });
          }

          srcStats.newlyInserted++;
          if (trustEval.ingestionStatus === 'published') srcStats.autoPublished++;
          else if (trustEval.ingestionStatus === 'quarantined') srcStats.quarantined++;
          else srcStats.pendingReview++;
        }

        // Source completed cleanly -> Step 2 (SourceHealth) then Step 3 (Job Checkpoint LAST)
        const srcDur = getNow().getTime() - srcStartTime.getTime();
        slot.status = 'completed';
        slot.stats = srcStats;
        slot.lastError = '';
        slot.completedAt = getNow();
        slot.durationMs = srcDur;
        sourceResults[source.key] = {
          success: true,
          ...srcStats,
          inserted: srcStats.newlyInserted,
          duplicates: srcStats.duplicatesSkipped
        };

        if (!isStrictReadOnlyDryRun) {
          await assertLockOwnership(IngestionLock, { lockKey, runId, fencingToken, now: getNow() });
        }

        if (!isDryRun) {
          await persistSourceHealthTelemetry(IngestionSourceHealth, {
            source, jobId, runId, fencingToken, ranAt: getNow(), durationMs: srcDur, status: 'ok', stats: srcStats, dryRun: isDryRun
          });
        }

        if (!isStrictReadOnlyDryRun && IngestionJob) {
          const recomputed = recomputeJobSummary(sourceQueue);
          const cpRes = await IngestionJob.updateOne(
            { jobId, ownerRunId: runId, fencingToken, status: 'running' },
            {
              $set: {
                [`sourceQueue.${idx}`]: slot,
                summary: recomputed,
                currentSourceKey: '',
                heartbeatAt: getNow()
              }
            }
          );
          if ((cpRes?.matchedCount ?? cpRes?.n ?? 1) === 0) {
            const fenceErr = new Error(`FENCING_OWNERSHIP_LOST on checkpoint commit for ${source.key}`);
            fenceErr.code = 'FENCING_OWNERSHIP_LOST';
            throw fenceErr;
          }
        }
      } catch (sourceErr) {
        if (sourceErr?.code === 'FENCING_OWNERSHIP_LOST') {
          throw sourceErr;
        }
        const srcDur = getNow().getTime() - srcStartTime.getTime();
        slot.status = 'failed';
        slot.lastError = sourceErr.message;
        slot.completedAt = getNow();
        slot.durationMs = srcDur;
        sourceResults[source.key] = { success: false, error: sourceErr.message, itemsFound: 0 };
        errors.push(`[${source.key}] Unexpected exception: ${sourceErr.message}`);

        if (!isDryRun) {
          await persistSourceHealthTelemetry(IngestionSourceHealth, {
            source, jobId, runId, fencingToken, ranAt: getNow(), durationMs: srcDur, status: 'failed', error: sourceErr.message, dryRun: isDryRun
          }).catch(() => {});
        }

        if (!isStrictReadOnlyDryRun && IngestionJob) {
          const recomputed = recomputeJobSummary(sourceQueue);
          await IngestionJob.updateOne(
            { jobId, ownerRunId: runId, fencingToken, status: 'running' },
            { $set: { [`sourceQueue.${idx}`]: slot, summary: recomputed, heartbeatAt: getNow() }, $push: { errors: `[${source.key}] ${sourceErr.message}` } }
          ).catch(() => {});
        }
      }
    }

    const endTime = getNow().getTime();
    const finalAgg = recomputeJobSummary(sourceQueue);
    const hasRemainingPending = sourceQueue.some((s) => s.status === 'pending' || s.status === 'running');
    const finalJobStatus = hasRemainingPending
      ? 'pending'
      : (finalAgg.sourcesFailed === 0 ? 'completed' : (finalAgg.sourcesSucceeded === 0 ? 'failed' : 'completed_with_errors'));

    const nextOffset = effectiveOffset + finalAgg.sourcesAttempted;
    const summary = {
      jobId,
      runId,
      fencingToken,
      dryRun: isDryRun,
      readOnly: isDryRun,
      persisted: !isDryRun && !isStrictReadOnlyDryRun,
      status: finalJobStatus,
      startedAt: runStartedIso,
      completedAt: new Date(endTime).toISOString(),
      durationMs: endTime - startTime,
      totalSourcesMatching,
      sourceOffset: effectiveOffset,
      nextOffset,
      hasMoreSources: isStrictReadOnlyDryRun ? nextOffset < totalSourcesMatching : hasRemainingPending,
      ...finalAgg,
      errors,
      sourceResults
    };

    if (!isStrictReadOnlyDryRun && IngestionJob) {
      const finalJobRes = await IngestionJob.updateOne(
        { jobId, ownerRunId: runId, fencingToken, status: 'running' },
        {
          $set: {
            status: finalJobStatus,
            summary: finalAgg,
            completedAt: hasRemainingPending ? null : new Date(endTime),
            heartbeatAt: new Date(endTime)
          }
        }
      );
      if ((finalJobRes?.matchedCount ?? finalJobRes?.n ?? 1) === 0) {
        const fenceErr = new Error('FENCING_OWNERSHIP_LOST on final job status commit');
        fenceErr.code = 'FENCING_OWNERSHIP_LOST';
        throw fenceErr;
      }
    }

    if (IngestionRunLog && !isDryRun) {
      await IngestionRunLog.create({
        runId,
        jobId,
        fencingToken,
        triggerType: options.triggerType || 'manual_admin',
        status: finalJobStatus === 'pending' ? 'partial' : finalJobStatus,
        startedAt: new Date(startTime),
        completedAt: new Date(endTime),
        durationMs: endTime - startTime,
        sourcesAttempted: finalAgg.sourcesAttempted,
        sourcesSucceeded: finalAgg.sourcesSucceeded,
        sourcesFailed: finalAgg.sourcesFailed,
        autoPublishedCount: finalAgg.autoPublishedCount,
        pendingReviewCount: finalAgg.pendingReviewCount,
        quarantinedCount: finalAgg.quarantinedCount,
        corrigendaUpdatedCount: finalAgg.corrigendaUpdatedCount,
        duplicatesSkipped: finalAgg.duplicatesSkipped,
        rejectedSkipped: finalAgg.rejectedSkipped,
        errors: errors.slice(0, 50),
        createdAt: new Date(endTime)
      }).catch(() => {});
    }

    if (!isDryRun && !isStrictReadOnlyDryRun) {
      lastIngestionState = {
        lastRunAt: summary.completedAt,
        lastJobId: jobId,
        lastRunId: runId,
        lastFencingToken: fencingToken,
        ...summary
      };
    }

    return summary;
  } finally {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
    }
    if (!isStrictReadOnlyDryRun && IngestionLock && acquiredLock) {
      await releaseIngestionLock(IngestionLock, {
        lockKey,
        runId,
        fencingToken,
        now: getNow()
      }).catch(() => {});
    }
    if (!isStrictReadOnlyDryRun) {
      isInMemoryRunning = false;
      currentRunStartedAt = null;
    }
  }
}

/**
 * Inserts a new notification with transaction fencing + E11000 duplicate-key safety.
 */
async function insertNotificationIdempotently({
  NotificationModel,
  candidate,
  existingList,
  useTransactions,
  mongooseConnection,
  IngestionLock,
  lockKey,
  runId,
  fencingToken,
  getNow
}) {
  try {
    await executeWithTransactionOrStandalone({
      useTransactions,
      mongooseConnection,
      IngestionLock,
      lockKey,
      runId,
      fencingToken,
      getNow,
      workFn: async (session) => {
        if (session) {
          await NotificationModel.create([candidate], { session });
        } else {
          await NotificationModel.create(candidate);
        }
      }
    });
    existingList.push(candidate);
    return { inserted: true, duplicateRace: false };
  } catch (err) {
    if (err?.code === 11000 || String(err?.message || '').includes('E11000')) {
      const existing = await NotificationModel.findOne({ id: candidate.id }).lean();
      if (existing) existingList.push(existing);
      return { inserted: false, duplicateRace: true };
    }
    throw err;
  }
}
