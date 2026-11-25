// server/ingestion/ingestionRoutes.js
// Modular Express Routes for Notifications, Trust-Gated Approval/Quarantine & Durable Ingestion

import crypto from 'crypto';
import {
  getKolkataToday,
  enrichNotificationWithDateStatus
} from '../../src/utils/notificationDateHelper.js';
import { OFFICIAL_EXAM_SOURCES } from './sourcesConfig.js';
import {
  generateNotificationFingerprint,
  buildIdentityFingerprint,
  computeContentHash
} from './deduplicationHelper.js';
import { extractSnapshotValues } from './corrigendumHelper.js';
import { generateJobId, recoverStaleIngestionJobs } from './ingestionLockHelper.js';
import { evaluateNotificationVerificationFlags } from './trustScoringEngine.js';
import {
  runAllIngestionJobs,
  getIngestionStatus,
  recomputeJobSummary
} from './ingestionManager.js';
import {
  isCleanupSchedulerAllowedInEnvironment,
  resolveAppEnvironment
} from '../db/databaseIsolation.js';

export const normalizeCategoryStr = (cat) => {
  if (!cat) return 'all';
  const c = String(cat).toLowerCase().replace(/[^a-z]/g, '');
  if (c.includes('bank')) return 'banking';
  if (c.includes('upsc') || c.includes('central') || c.includes('ias')) return 'upsc';
  if (c.includes('ssc') || c.includes('cgl') || c.includes('chsl')) return 'ssc';
  if (c.includes('rail') || c.includes('rrb') || c.includes('rrc')) return 'railway';
  if (c.includes('tnpsc') || c.includes('state') || c.includes('vao')) return 'tnpsc';
  if (c.includes('police') || c.includes('defence') || c.includes('army') || c.includes('tnusrb')) return 'police_defence';
  if (c.includes('teach') || c.includes('trb') || c.includes('tet') || c.includes('school')) return 'teaching';
  if (c.includes('med') || c.includes('nurse') || c.includes('mrb') || c.includes('doctor') || c.includes('health') || c.includes('hospital')) return 'medical';
  if (c.includes('enter') || c.includes('entrance') || c.includes('jee') || c.includes('neet') || c.includes('cuet') || c.includes('gate') || c.includes('tancet')) return 'entrance';
  if (c.includes('psu') || c.includes('iocl') || c.includes('ongc') || c.includes('bhel') || c.includes('tneb') || c.includes('tech')) return 'psu';
  return cat;
};

/**
 * Constant-time X-Ingestion-Secret / X-Cron-Secret validation (fail-closed if unset).
 */
export function verifyIngestionSecretHeader(req, env = process.env) {
  const secretHeader = req?.headers?.['x-ingestion-secret'] || req?.headers?.['x-cron-secret'];
  const rawEnvSecret = typeof env.INGESTION_SECRET_KEY === 'string' && env.INGESTION_SECRET_KEY.trim().length > 0
    ? env.INGESTION_SECRET_KEY.trim()
    : (typeof env.INGESTION_SECRET === 'string' ? env.INGESTION_SECRET.trim() : '');

  if (!rawEnvSecret || typeof secretHeader !== 'string' || secretHeader.trim().length === 0) {
    return false;
  }

  const headerBuf = Buffer.from(secretHeader.trim(), 'utf8');
  const envBuf = Buffer.from(rawEnvSecret, 'utf8');
  if (headerBuf.length !== envBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(headerBuf, envBuf);
}

function parseDryRunParam(val) {
  if (val === undefined) {
    return { valid: true, provided: false, value: false };
  }
  if (typeof val === 'boolean') {
    return { valid: true, provided: true, value: val };
  }
  if (typeof val === 'string') {
    const normalized = val.trim().toLowerCase();
    if (normalized === 'true') {
      return { valid: true, provided: true, value: true };
    }
    if (normalized === 'false') {
      return { valid: true, provided: true, value: false };
    }
  }
  return {
    valid: false,
    provided: true,
    value: undefined,
    status: 400,
    body: {
      success: false,
      error: 'INVALID_DRY_RUN_PARAM',
      message: 'Invalid dryRun parameter. Allowed values are boolean true/false or string "true"/"false".'
    }
  };
}

function resolveDryRunParam(req) {
  const hasQuery = Boolean(
    req?.query &&
    Object.prototype.hasOwnProperty.call(req.query, 'dryRun') &&
    req.query.dryRun !== undefined
  );
  const hasBody = Boolean(
    req?.body &&
    typeof req.body === 'object' &&
    !Array.isArray(req.body) &&
    Object.prototype.hasOwnProperty.call(req.body, 'dryRun') &&
    req.body.dryRun !== undefined
  );

  if (hasQuery) {
    const queryCheck = parseDryRunParam(req.query.dryRun);
    if (!queryCheck.valid) return queryCheck;
    if (hasBody) {
      const bodyCheck = parseDryRunParam(req.body.dryRun);
      if (!bodyCheck.valid) return bodyCheck;
      if (queryCheck.value !== bodyCheck.value) {
        return {
          valid: false,
          provided: true,
          value: undefined,
          status: 400,
          body: {
            success: false,
            error: 'INVALID_DRY_RUN_PARAM',
            message: 'Conflicting dryRun values supplied in query and request body.'
          }
        };
      }
    }
    return queryCheck;
  }

  if (hasBody) {
    return parseDryRunParam(req.body.dryRun);
  }

  return parseDryRunParam(undefined);
}

function getRequestParam(req, key) {
  if (req?.query && req.query[key] !== undefined) return req.query[key];
  if (req?.body && typeof req.body === 'object' && req.body[key] !== undefined) return req.body[key];
  return undefined;
}

function resolveValidatedSourceKey(sourceKey) {
  if (sourceKey === undefined) {
    return { valid: true, normalized: '', sources: OFFICIAL_EXAM_SOURCES.filter((s) => s.enabled) };
  }
  const normalized = String(sourceKey).trim();
  const matched = normalized
    ? OFFICIAL_EXAM_SOURCES.filter((s) => s.key === normalized && s.enabled !== false)
    : [];
  if (matched.length === 0) {
    return {
      valid: false,
      status: 400,
      body: {
        success: false,
        error: 'INVALID_SOURCE_KEY',
        code: 'INVALID_SOURCE_KEY',
        message: normalized
          ? `Unknown or disabled sourceKey '${normalized}'. Provide a valid enabled sourceKey or omit sourceKey.`
          : 'sourceKey query parameter cannot be empty when explicitly supplied.',
        validSourceKeys: OFFICIAL_EXAM_SOURCES.filter((s) => s.enabled !== false).map((s) => s.key)
      }
    };
  }
  return { valid: true, normalized, sources: matched };
}

/**
 * Registers notification & automated ingestion endpoints on Express app.
 * Separated so synthetic unit/integration tests can verify HTTP behavior in isolation.
 */
export function registerNotificationAndIngestionRoutes(app, deps) {
  const {
    Notification,
    IngestionJob = null,
    IngestionLock = null,
    IngestionSourceHealth = null,
    IngestionRunLog = null,
    CleanupScheduleModel = null,
    mongooseConnection = null,
    resolveAuthContext,
    syncAllVerifiedNotificationsFeed,
    VERIFIED_ALL_EXAM_NOTIFICATIONS = [],
    env = process.env,
    ingestionRunner = runAllIngestionJobs
  } = deps;

  const isDbReady = () => !mongooseConnection || mongooseConnection.readyState === 1;

  async function executeWorkerTickRequest(req, res, { isSecretValid }) {
    const rawSourceKey = getRequestParam(req, 'sourceKey');
    const sourceCheck = resolveValidatedSourceKey(rawSourceKey);
    if (!sourceCheck.valid) {
      return res.status(sourceCheck.status).json(sourceCheck.body);
    }

    const dryRunCheck = resolveDryRunParam(req);
    if (!dryRunCheck.valid) {
      return res.status(dryRunCheck.status).json(dryRunCheck.body);
    }
    const parsedDryRun = dryRunCheck.provided ? dryRunCheck.value : undefined;
    const isDryRunRequest = dryRunCheck.value === true;
    const rawMaxSources = getRequestParam(req, 'maxSources');
    const rawBatchSize = getRequestParam(req, 'batchSize');
    const rawOffset = getRequestParam(req, 'offset');

    const parsedBatch = parseInt(String(rawBatchSize || rawMaxSources || '3'), 10);
    const batchLimit = Number.isFinite(parsedBatch) && parsedBatch > 0 ? Math.min(parsedBatch, 10) : 3;
    const parsedOffset = parseInt(String(rawOffset ?? '0'), 10);
    const sourceOffset = Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : 0;

    if (isDryRunRequest) {
      // Strictly read-only dry-run: zero DB recovery, zero job/lock creation, zero persistence
      const summary = await ingestionRunner(Notification, {
        sourceKey: sourceCheck.normalized || undefined,
        sourceOffset,
        dryRun: true,
        maxSources: batchLimit,
        triggerType: isSecretValid ? 'worker_cron' : 'manual_admin',
        env,
        models: {
          IngestionJob,
          IngestionLock,
          IngestionSourceHealth,
          IngestionRunLog,
          mongooseConnection
        }
      });

      const remainingSources = typeof summary.sourcesRemaining === 'number'
        ? summary.sourcesRemaining
        : Math.max(0, (summary.sourcesQueued || 0) - (summary.sourcesAttempted || 0));
      const isCompleted =
        summary.status === 'completed' ||
        summary.status === 'completed_with_errors' ||
        summary.status === 'failed' ||
        remainingSources === 0;

      return res.json({
        success: true,
        dryRun: true,
        readOnly: true,
        persisted: false,
        status: isCompleted ? (summary.status === 'pending' ? 'completed' : summary.status) : 'in_progress',
        jobId: summary.jobId,
        runId: summary.runId,
        sourceOffset: summary.sourceOffset ?? sourceOffset,
        nextOffset: summary.nextOffset ?? (sourceOffset + (summary.sourcesAttempted || 0)),
        sourcesProcessedThisTick: summary.sourcesAttempted,
        remainingSources,
        totalSourcesMatching: summary.totalSourcesMatching ?? sourceCheck.sources.length,
        isCompleted,
        recoveredCount: 0,
        summary
      });
    }

    // 1. Live mode: Auto-recover crashed/stale jobs whose lease expired
    let recoveredInfo = { recoveredCount: 0 };
    if (IngestionJob) {
      recoveredInfo = await recoverStaleIngestionJobs(IngestionJob, { maxAttempts: 3 });
    }

    // 2. Check if there are pending jobs to process
    let pendingJob = null;
    if (IngestionJob) {
      pendingJob = await IngestionJob.findOne({ status: { $in: ['pending', 'retry_pending'] } })
        .sort({ createdAt: 1 })
        .lean();
    }

    if (!pendingJob && IngestionJob) {
      const runningJob = await IngestionJob.findOne({ status: 'running' })
        .sort({ createdAt: -1 })
        .lean();
      if (runningJob) {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'INGESTION_IN_PROGRESS',
          message: 'An automated ingestion job is currently running. Please retry once the active lease advances.',
          activeJobDetails: {
            reason: 'JOB_RUNNING',
            jobId: runningJob.jobId,
            startedAt: runningJob.startedAt || null,
            leaseExpiresAt: runningJob.leaseExpiresAt || null,
            ownerRunId: runningJob.ownerRunId || null
          }
        });
      }

      return res.json({
        success: true,
        status: 'idle',
        message: 'No pending ingestion jobs in queue.',
        recoveredCount: recoveredInfo.recoveredCount
      });
    }

    // 3. Execute bounded live worker tick using ingestionRunner
    const summary = await ingestionRunner(Notification, {
      sourceKey: sourceCheck.normalized || undefined,
      dryRun: parsedDryRun,
      maxSources: batchLimit,
      triggerType: isSecretValid ? 'worker_cron' : 'manual_admin',
      env,
      models: {
        IngestionJob,
        IngestionLock,
        IngestionSourceHealth,
        IngestionRunLog,
        mongooseConnection
      }
    });

    const isCompleted = summary.status === 'completed' || summary.status === 'completed_with_errors' || summary.status === 'failed';
    const remainingSources = typeof summary.sourcesRemaining === 'number'
      ? summary.sourcesRemaining
      : Math.max(0, (summary.sourcesQueued || 0) - (summary.sourcesAttempted || 0));

    return res.json({
      success: true,
      status: isCompleted ? summary.status : 'in_progress',
      jobId: summary.jobId,
      runId: summary.runId,
      sourcesProcessedThisTick: summary.sourcesAttempted,
      remainingSources,
      isCompleted,
      recoveredCount: recoveredInfo.recoveredCount,
      summary
    });
  }

  // 1. GET all notifications (Public only sees 'published' or legacy; pending/quarantined/rejected isolated)
  app.get('/api/notifications', async (req, res) => {
    const { category, status, search, includePending } = req.query || {};
    const today = getKolkataToday();
    const auth = resolveAuthContext(req);

    let rawList = [];
    try {
      if (isDbReady()) {
        const filter = {};
        if (category && category !== 'all') {
          const norm = normalizeCategoryStr(category);
          filter.$or = [{ category }, { category: norm }];
        }

        if (!auth.isAdmin || includePending !== 'true') {
          const publishedCondition = {
            $or: [
              { ingestionStatus: 'published' },
              { ingestionStatus: { $exists: false } },
              { ingestionStatus: null },
              { ingestionStatus: '' }
            ]
          };
          if (filter.$or) {
            filter.$and = [{ $or: filter.$or }, publishedCondition];
            delete filter.$or;
          } else {
            filter.$or = publishedCondition.$or;
          }
        } else if (req.query.ingestionStatus && req.query.ingestionStatus !== 'all') {
          filter.ingestionStatus = req.query.ingestionStatus;
        }

        rawList = await Notification.find(filter).sort({ updatedAt: -1, _id: -1 }).maxTimeMS(4000).lean();
      }
    } catch (dbErr) {
      console.warn('⚠️ [MongoDB Read Warning]: Falling back to local verified notifications registry.', dbErr.message);
    }

    if (!rawList || rawList.length === 0) {
      rawList = VERIFIED_ALL_EXAM_NOTIFICATIONS.filter((item) => {
        if (!category || category === 'all') return true;
        return normalizeCategoryStr(item.category) === normalizeCategoryStr(category);
      });
      if (!auth.isAdmin || includePending !== 'true') {
        rawList = rawList.filter((item) => !item.ingestionStatus || item.ingestionStatus === 'published');
      }
    }

    let processedList = rawList.map((item) => enrichNotificationWithDateStatus(item, today));

    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      processedList = processedList.filter((item) => {
        const text = `${item.service} ${item.organization || ''} ${item.postName || ''} ${item.qualification || ''} ${item.importantDetails || ''} ${item.category || ''} ${item.formattedExamDate} ${item.formattedClosingDate}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (status === 'active' || status === 'active_app' || status === 'active_jobs' || status === 'open') {
      processedList = processedList.filter((n) => n.isActiveApplication === true);
    } else if (status === 'upcoming_exams' || status === 'upcoming') {
      processedList = processedList.filter((n) => n.examStatus.isUpcoming || n.examStatus.isToday);
    } else if (status === 'upcoming_interviews' || status === 'interviews') {
      processedList = processedList.filter((n) => n.interviewStatus?.isUpcoming || n.interviewStatus?.isToday);
    } else if (status === 'closing_soon') {
      processedList = processedList.filter((n) => n.isClosingSoon);
    } else if (status === 'expired' || status === 'app_closed' || status === 'archived') {
      processedList = processedList.filter((n) => !n.isNotificationActive || n.appStatus.isExpired);
    } else if (status === 'exam_completed') {
      processedList = processedList.filter((n) => n.examStatus.isCompleted);
    } else if (req.query.includeExpired !== 'true') {
      // By default for public feed, show ONLY current active notifications (no past 2015-2018 leaks)
      processedList = processedList.filter((n) => n.isNotificationActive);
    }

    processedList.sort((a, b) => {
      if (a.appStatus.isOpen !== b.appStatus.isOpen) {
        return a.appStatus.isOpen ? -1 : 1;
      }
      if (a.examStatus.isUpcoming !== b.examStatus.isUpcoming) {
        return a.examStatus.isUpcoming ? -1 : 1;
      }
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

    return res.json(processedList);
  });

  // 2. Sync Master Exam Registry (Admin Only)
  app.post('/api/notifications/sync-all', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      await syncAllVerifiedNotificationsFeed();
      const all = await Notification.find({
        $or: [{ ingestionStatus: 'published' }, { ingestionStatus: { $exists: false } }, { ingestionStatus: null }, { ingestionStatus: '' }]
      }).sort({ updatedAt: -1 }).lean();
      res.json({
        success: true,
        message: '✅ All Official Govt & Competitive Exam Notifications synced successfully to MongoDB Atlas!',
        count: all.length,
        notifications: all
      });
    } catch (err) {
      res.status(500).json({ error: 'SYNC_ERROR', message: err.message });
    }
  });

  // 3. Sync Banking Exam Feed Endpoint (Admin Only)
  app.post('/api/notifications/sync-banking', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      await syncAllVerifiedNotificationsFeed();
      const all = await Notification.find({
        $or: [{ ingestionStatus: 'published' }, { ingestionStatus: { $exists: false } }, { ingestionStatus: null }, { ingestionStatus: '' }]
      }).sort({ updatedAt: -1 }).lean();
      res.json({
        success: true,
        message: '✅ Verified Banking & Govt Exam Notifications synced successfully to MongoDB Atlas!',
        count: all.length,
        notifications: all
      });
    } catch (err) {
      res.status(500).json({ error: 'SYNC_ERROR', message: err.message });
    }
  });

  // 4. Create / Update Notification (Admin Only — sets manualOverrideLock: true)
  const ALLOWED_ADMIN_INGESTION_STATUSES = new Set(['published', 'pending_review']);
  const ADMIN_EDITABLE_NOTIFICATION_FIELDS = [
    'category',
    'organization',
    'service',
    'postName',
    'qualification',
    'ageLimit',
    'posts',
    'openingDate',
    'closingDate',
    'examDate',
    'applicationFee',
    'notificationDate',
    'importantDetails',
    'detailsLink',
    'applyLink',
    'source',
    'isNew',
    'status',
    'sourceKey',
    'noticeType',
    'notificationNo',
    'officialNotificationNumber',
    'officialNotificationUrl',
    'officialPdfUrl',
    'sourcePublishedDate',
    'sourcePublishedAt',
    'sourceUrl',
    'auditNote',
    'isThirdParty',
    'sourceType',
    'isExpired',
    'isLegacy'
  ];

  function buildAtomicStateGuards(doc) {
    const rev = Number(doc.revisionCount ?? 0);
    const andConditions = [
      {
        $or: [
          { quarantineReason: '' },
          { quarantineReason: null },
          { quarantineReason: { $exists: false } }
        ]
      }
    ];
    if (rev === 0) {
      andConditions.push({ $or: [{ revisionCount: 0 }, { revisionCount: { $exists: false } }] });
    } else {
      andConditions.push({ revisionCount: rev });
    }
    const guardedFields = ['detailsLink', 'docVerificationStatus', 'officialPdfUrl', 'officialNotificationNumber'];
    for (const field of guardedFields) {
      const val = doc[field];
      if (val === undefined || val === null || val === '') {
        andConditions.push({ $or: [{ [field]: '' }, { [field]: null }, { [field]: { $exists: false } }] });
      } else {
        andConditions.push({ [field]: val });
      }
    }
    return {
      ingestionStatus: doc.ingestionStatus
        ? doc.ingestionStatus
        : { $nin: ['quarantined', 'rejected'] },
      $and: andConditions
    };
  }

  app.post('/api/notifications', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const rawData = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
      if (!rawData.service || typeof rawData.service !== 'string' || !rawData.service.trim()) {
        return res.status(400).json({ error: 'Notification service/title is required' });
      }

      // Explicitly validate ingestionStatus against strict allowlist ('published' | 'pending_review')
      let targetIngestionStatus = 'published';
      if (rawData.ingestionStatus !== undefined) {
        const normalizedStatus = typeof rawData.ingestionStatus === 'string' ? rawData.ingestionStatus.trim() : '';
        if (!ALLOWED_ADMIN_INGESTION_STATUSES.has(normalizedStatus)) {
          return res.status(400).json({
            success: false,
            error: 'INVALID_INGESTION_STATUS',
            message: 'Invalid ingestionStatus. Allowed values are "published" or "pending_review".'
          });
        }
        targetIngestionStatus = normalizedStatus;
      }

      // Extract ONLY explicitly allowlisted admin-editable content fields (prevents mass assignment of _id, __v, corrigendum, trust, scraper metadata)
      const data = {};
      for (const field of ADMIN_EDITABLE_NOTIFICATION_FIELDS) {
        if (Object.prototype.hasOwnProperty.call(rawData, field) && rawData[field] !== undefined) {
          data[field] = rawData[field];
        }
      }

      const rawId = typeof rawData.id === 'string' ? rawData.id.trim() : '';
      const id = rawId || `notif-${Date.now()}`;
      const keyFilter = rawId
        ? { id: rawId }
        : { service: data.service, organization: data.organization || '' };

      // Check existing DB state — quarantined & rejected records must never be overwritten via POST /api/notifications.
      const existingDoc = await Notification.findOne(keyFilter).lean();
      if (existingDoc) {
        if (existingDoc.ingestionStatus === 'quarantined' || String(existingDoc.quarantineReason || '').trim()) {
          return res.status(400).json({
            success: false,
            error: 'QUARANTINED_RECORD_CANNOT_BE_OVERWRITTEN',
            message: 'Quarantined notifications cannot be overwritten or published via POST /api/notifications.'
          });
        }
        if (existingDoc.ingestionStatus === 'rejected') {
          return res.status(400).json({
            success: false,
            error: 'REJECTED_RECORD_CANNOT_BE_OVERWRITTEN',
            message: 'Rejected notifications cannot be overwritten via POST /api/notifications.'
          });
        }
      }

      // Preserve explicit fail-closed client assertions (clients may force unverified, never force verified).
      const clientForcedUnverified = rawData.isVerified === false || rawData.sourceIntegrityVerified === false;
      const clientForcedUnverifiedDates = rawData.applicationDatesVerified === false;
      const clientForcedIntegrityIssue = rawData.hasSourceIntegrityIssue === true || rawData.needsOfficialSource === true;
      const clientBlockedClassification = ['OFFICIAL_CALENDAR_ONLY', 'OLD_RECRUITMENT_CYCLE', 'HISTORICAL_CYCLE'].includes(
        String(rawData.evidenceClassification || '').trim()
      )
        ? String(rawData.evidenceClassification).trim()
        : '';

      const effectiveId = existingDoc?.id || id;
      const mergedContent = { ...(existingDoc || {}), ...data, id: effectiveId };
      const contentHash = computeContentHash(mergedContent);
      const identityFingerprint = buildIdentityFingerprint(mergedContent);
      const fingerprint = generateNotificationFingerprint(mergedContent);

      // Preserve server-owned docVerificationStatus from existingDoc ONLY when detailsLink did not change.
      const incomingDetailsLink = String(data.detailsLink ?? existingDoc?.detailsLink ?? '').trim();
      const existingDetailsLink = String(existingDoc?.detailsLink || '').trim();
      const canReuseServerDocState = Boolean(
        existingDoc &&
        existingDoc.docVerificationStatus &&
        incomingDetailsLink &&
        incomingDetailsLink === existingDetailsLink
      );
      const trustedDocVerificationStatus = canReuseServerDocState ? existingDoc.docVerificationStatus : '';

      const mergedForEval = {
        ...mergedContent,
        ingestionStatus: targetIngestionStatus,
        docVerificationStatus: trustedDocVerificationStatus,
        hasSourceIntegrityIssue: clientForcedIntegrityIssue,
        needsOfficialSource: rawData.needsOfficialSource === true,
        evidenceClassification: clientBlockedClassification || (existingDoc?.isHistoricalCycle ? existingDoc.evidenceClassification : '')
      };

      // Evaluate official-source evidence and date validity fail-closed without trusting raw client verification flags.
      const evidenceEval = evaluateNotificationVerificationFlags(
        mergedForEval,
        {
          allowPromotionEvaluation: !clientForcedIntegrityIssue && !clientForcedUnverified,
          allowVerifiedDocState: canReuseServerDocState
        }
      );

      const isPublishedTarget = targetIngestionStatus === 'published';
      const sourceIntegrityVerified = Boolean(
        isPublishedTarget &&
        evidenceEval.sourceIntegrityVerified &&
        !clientForcedUnverified &&
        !clientForcedIntegrityIssue
      );
      const applicationDatesVerified = Boolean(
        sourceIntegrityVerified &&
        evidenceEval.applicationDatesVerified &&
        !clientForcedUnverifiedDates
      );
      const canVerifyOnCreate = evidenceEval.isResultNotice
        ? Boolean(sourceIntegrityVerified)
        : Boolean(sourceIntegrityVerified && applicationDatesVerified);
      const hasIntegrityGap = evidenceEval.isResultNotice
        ? !evidenceEval.sourceIntegrityVerified
        : (!evidenceEval.sourceIntegrityVerified || !evidenceEval.applicationDatesVerified);
      const requestedStatus = data.status ?? existingDoc?.status ?? 'active';
      const resolvedStatus = (!hasIntegrityGap && !clientForcedUnverified && !clientForcedIntegrityIssue)
        ? (requestedStatus === 'under_review' ? 'active' : (requestedStatus || 'active'))
        : (requestedStatus === 'closed' || requestedStatus === 'expired' ? requestedStatus : 'under_review');

      const now = new Date();
      const updatePayload = {
        ...data,
        id: effectiveId,
        contentHash,
        identityFingerprint,
        fingerprint,
        manualOverrideLock: true,
        ingestionStatus: targetIngestionStatus,
        ingestionSource: existingDoc?.ingestionSource || 'manual_admin',
        docVerificationStatus: trustedDocVerificationStatus,
        status: resolvedStatus,
        isVerified: canVerifyOnCreate,
        sourceIntegrityVerified,
        applicationDatesVerified,
        hasSourceIntegrityIssue: !evidenceEval.sourceIntegrityVerified || clientForcedIntegrityIssue,
        needsOfficialSource: !evidenceEval.hasOfficialEvidence || rawData.needsOfficialSource === true,
        evidenceClassification: clientBlockedClassification || (!evidenceEval.sourceIntegrityVerified
          ? 'NEEDS_OFFICIAL_SOURCE'
          : (canVerifyOnCreate
            ? (evidenceEval.isResultNotice ? 'VERIFIED_OFFICIAL_RESULT' : 'VERIFIED_OFFICIAL_NOTICE')
            : '')),
        evidenceVerifiedAt: canVerifyOnCreate ? now : null,
        updatedAt: now
      };

      let result;
      if (existingDoc) {
        // Atomic conditional update (upsert: false) — prevents overwriting concurrent quarantine/rejection/evidence changes
        const atomicUpdateFilter = {
          id: existingDoc.id,
          ...buildAtomicStateGuards(existingDoc)
        };
        result = await Notification.findOneAndUpdate(
          atomicUpdateFilter,
          { $set: updatePayload, $inc: { revisionCount: 1 } },
          { new: true }
        );
        if (!result) {
          return res.status(409).json({
            success: false,
            error: 'CONCURRENT_MODIFICATION_CONFLICT',
            message: 'Notification changed concurrently (e.g. quarantined, rejected, or updated). Refresh and retry.'
          });
        }
      } else {
        // Atomic create path guarded against concurrent insert/quarantine on same key
        const atomicCreateFilter = {
          ...keyFilter,
          ingestionStatus: { $nin: ['quarantined', 'rejected'] },
          $and: [
            {
              $or: [
                { quarantineReason: '' },
                { quarantineReason: null },
                { quarantineReason: { $exists: false } }
              ]
            },
            { revisionCount: { $exists: false } }
          ]
        };
        try {
          result = await Notification.findOneAndUpdate(
            atomicCreateFilter,
            { $set: updatePayload, $inc: { revisionCount: 1 } },
            { upsert: true, new: true }
          );
        } catch (upsertErr) {
          if (upsertErr?.code === 11000) {
            return res.status(409).json({
              success: false,
              error: 'CONCURRENT_CREATE_CONFLICT',
              message: 'A notification with this identifier was created or modified concurrently. Refresh and retry.'
            });
          }
          throw upsertErr;
        }
        if (!result) {
          return res.status(409).json({
            success: false,
            error: 'CONCURRENT_CREATE_CONFLICT',
            message: 'Notification could not be created due to a concurrent state conflict.'
          });
        }
      }

      const obj = result.toObject ? result.toObject() : result;
      res.json({ success: true, ...obj });
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({
          success: false,
          error: 'CONCURRENT_CREATE_CONFLICT',
          message: 'A notification with this identifier already exists.'
        });
      }
      res.status(500).json({ error: 'SAVE_ERROR', message: err.message });
    }
  });

  // 5. Delete Notification (Admin Only)
  app.delete('/api/notifications/:id', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      await Notification.deleteMany({ id: req.params.id });
      res.json({ success: true, message: `Notification ${req.params.id} deleted` });
    } catch (err) {
      res.status(500).json({ error: 'DELETE_ERROR', message: err.message });
    }
  });

  // 6. Trigger Automated Ingestion Job (Admin OR valid X-Ingestion-Secret)
  // Supports decoupled lifecycle:
  // - Enqueue Only: ?enqueueOnly=true or ?action=enqueue (creates/coalesces job)
  // - Worker Execution: POST /api/notifications/worker-tick or ?action=work (processes bounded batch)
  // - Synchronous Run: default (processes with optional ?maxSources limit)
  app.post('/api/notifications/ingest-job', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      const isSecretValid = verifyIngestionSecretHeader(req, env);

      if (!auth.isAdmin && !isSecretValid) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Admin authorization or valid X-Ingestion-Secret header is required to trigger ingestion.'
        });
      }

      const sourceKey = getRequestParam(req, 'sourceKey');
      const dryRun = getRequestParam(req, 'dryRun');
      const enqueueOnly = getRequestParam(req, 'enqueueOnly');
      const action = getRequestParam(req, 'action');
      const maxSources = getRequestParam(req, 'maxSources');
      const rawOffset = getRequestParam(req, 'offset');

      // Route 6A: Worker processing action (?action=work or ?action=worker_tick)
      if (action === 'work' || action === 'worker_tick') {
        return await executeWorkerTickRequest(req, res, { isSecretValid });
      }

      const sourceCheck = resolveValidatedSourceKey(sourceKey);
      if (!sourceCheck.valid) {
        return res.status(sourceCheck.status).json(sourceCheck.body);
      }

      const dryRunCheck = resolveDryRunParam(req);
      if (!dryRunCheck.valid) {
        return res.status(dryRunCheck.status).json(dryRunCheck.body);
      }
      const parsedDryRun = dryRunCheck.provided ? dryRunCheck.value : undefined;
      const isDryRunRequest = dryRunCheck.value === true;

      // Route 6B: Pure durable enqueue mode (creates/coalesces DB job ONLY when NOT dryRun)
      if (String(enqueueOnly) === 'true' || action === 'enqueue') {
        if (isDryRunRequest) {
          return res.status(202).json({
            success: true,
            dryRun: true,
            readOnly: true,
            persisted: false,
            simulated: true,
            jobId: `dryrun_${generateJobId()}`,
            status: 'dry_run_ready',
            sourceKeyFilter: sourceCheck.normalized,
            sourcesQueued: sourceCheck.sources.length,
            message: `Dry-run enqueue validated cleanly (${sourceCheck.sources.length} source(s)); 0 database records created.`
          });
        }

        if (!IngestionJob) {
          return res.status(503).json({
            success: false,
            error: 'SERVICE_UNAVAILABLE',
            message: 'Durable queue model is not initialized.'
          });
        }
        const existingPending = await IngestionJob.findOne({ status: { $in: ['pending', 'running', 'retry_pending'] } }).lean();
        if (existingPending) {
          return res.status(202).json({
            success: true,
            coalesced: true,
            jobId: existingPending.jobId,
            status: existingPending.status,
            message: 'An active durable ingestion job already exists.'
          });
        }

        const jobId = generateJobId();
        const queue = sourceCheck.sources.map((s) => ({
          sourceKey: s.key,
          status: 'pending',
          attempts: 0,
          stats: { itemsFound: 0, newlyInserted: 0, autoPublished: 0, pendingReview: 0, quarantined: 0, corrigendaUpdated: 0, duplicatesSkipped: 0, rejectedSkipped: 0 },
          lastError: ''
        }));

        await IngestionJob.create({
          jobId,
          triggerType: isSecretValid ? 'external_cron' : 'manual_admin',
          status: 'pending',
          dryRun: false,
          sourceKeyFilter: sourceCheck.normalized,
          sourceQueue: queue,
          summary: recomputeJobSummary(queue),
          errors: [],
          createdAt: new Date()
        });

        return res.status(202).json({
          success: true,
          jobId,
          status: 'pending',
          sourcesQueued: queue.length,
          message: `Durable ingestion job ${jobId} enqueued.`
        });
      }

      const parsedMax = maxSources ? parseInt(String(maxSources), 10) : undefined;
      const parsedOffset = rawOffset !== undefined ? parseInt(String(rawOffset), 10) : undefined;
      console.log(`📡 [Ingestion Trigger]: Running durable ingestion job (source: ${sourceCheck.normalized || 'ALL'}, dryRun: ${isDryRunRequest})...`);

      const summary = await ingestionRunner(Notification, {
        sourceKey: sourceCheck.normalized || undefined,
        sourceOffset: Number.isInteger(parsedOffset) && parsedOffset >= 0 ? parsedOffset : undefined,
        dryRun: isDryRunRequest,
        maxSources: Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : undefined,
        triggerType: isSecretValid ? 'external_cron' : 'manual_admin',
        env,
        models: {
          IngestionJob,
          IngestionLock,
          IngestionSourceHealth,
          IngestionRunLog,
          mongooseConnection
        }
      });

      res.json({
        success: true,
        dryRun: isDryRunRequest,
        readOnly: isDryRunRequest,
        persisted: !isDryRunRequest,
        message: `Ingestion job ${summary.status || 'completed'}. New: ${summary.newRecordsInserted}, Updated: ${summary.corrigendaUpdatedCount || 0}, Quarantined: ${summary.quarantinedCount || 0}, Duplicates: ${summary.duplicatesSkipped}.`,
        summary
      });
    } catch (err) {
      if (err.code === 'CONCURRENT_INGESTION_LOCKED' || err.message === 'INGESTION_IN_PROGRESS') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'INGESTION_IN_PROGRESS',
          message: 'An automated ingestion job already holds the distributed lock. Please wait for it to finish.',
          activeJobDetails: {
            reason: err.reason || 'LOCK_HELD',
            startedAt: err.startedAt || null,
            leaseExpiresAt: err.existingExpiresAt || null,
            ownerRunId: err.existingOwnerRunId || null
          }
        });
      }
      if (err.code === 'FENCING_OWNERSHIP_LOST') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'FENCING_OWNERSHIP_LOST',
          message: 'Worker lease expired or was fenced out by a newer job.'
        });
      }
      if (err.code === 'DATA_CONFLICT') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'DATA_CONFLICT',
          message: err.message || 'A data state conflict occurred during ingestion.'
        });
      }
      console.error('Ingestion job error:', err.message);
      res.status(500).json({ success: false, error: 'INGESTION_ERROR', message: err.message });
    }
  });

  // 6B. Dedicated Background Worker Consumer Endpoint
  // Decoupled from Enqueue: Picks up oldest pending job, processes a bounded batch (default: 3 sources),
  // persists progress checkpoints, and returns status: idle | in_progress | completed
  app.post(['/api/notifications/worker-tick', '/api/notifications/ingest-worker'], async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      const isSecretValid = verifyIngestionSecretHeader(req, env);

      if (!auth.isAdmin && !isSecretValid) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Admin authorization or valid X-Ingestion-Secret header is required to run the worker.'
        });
      }

      return await executeWorkerTickRequest(req, res, { isSecretValid });
    } catch (err) {
      if (err.code === 'CONCURRENT_INGESTION_LOCKED' || err.message === 'INGESTION_IN_PROGRESS') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'INGESTION_IN_PROGRESS',
          message: 'An automated ingestion worker already holds the distributed lock. Please wait for it to finish.',
          activeJobDetails: {
            reason: err.reason || 'LOCK_HELD',
            startedAt: err.startedAt || null,
            leaseExpiresAt: err.existingExpiresAt || null,
            ownerRunId: err.existingOwnerRunId || null
          }
        });
      }
      if (err.code === 'FENCING_OWNERSHIP_LOST') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'FENCING_OWNERSHIP_LOST',
          message: 'Worker lease expired or was fenced out by a newer worker.'
        });
      }
      if (err.code === 'DATA_CONFLICT') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'DATA_CONFLICT',
          message: err.message || 'A data state conflict occurred during worker execution.'
        });
      }
      console.error('Worker tick error:', err.message);
      res.status(500).json({ success: false, error: 'WORKER_ERROR', message: err.message });
    }
  });

  // 7. Fetch Pending Review Notifications (Admin Only — partitioned by current, expired, missing date)
  app.get('/api/notifications/pending', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const today = getKolkataToday();
      const pendingList = await Notification.find({ ingestionStatus: 'pending_review' })
        .sort({ updatedAt: -1, _id: -1 })
        .maxTimeMS(4000)
        .lean();

      const enriched = (pendingList || []).map((item) => enrichNotificationWithDateStatus(item, today));

      const type = String(req.query?.type || 'all').toLowerCase();
      let filtered = enriched;
      if (type === 'current') {
        filtered = enriched.filter((n) => n.isNotificationActive && !n.needsDateVerification);
      } else if (type === 'expired' || type === 'expired_pending') {
        filtered = enriched.filter((n) => !n.isNotificationActive);
      } else if (type === 'missing_date') {
        filtered = enriched.filter((n) => n.needsDateVerification);
      }

      const currentCount = enriched.filter((n) => n.isNotificationActive && !n.needsDateVerification).length;
      const expiredCount = enriched.filter((n) => !n.isNotificationActive).length;
      const missingDateCount = enriched.filter((n) => n.needsDateVerification).length;

      res.json({
        success: true,
        count: filtered.length,
        totalPending: enriched.length,
        currentCount,
        expiredCount,
        missingDateCount,
        notifications: filtered
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 8. Fetch Quarantined Notifications (Admin Only)
  app.get('/api/notifications/quarantined', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const today = getKolkataToday();
      const quarantinedList = await Notification.find({ ingestionStatus: 'quarantined' })
        .sort({ updatedAt: -1, _id: -1 })
        .maxTimeMS(4000)
        .lean();

      const enriched = (quarantinedList || []).map((item) => enrichNotificationWithDateStatus(item, today));
      res.json({ success: true, count: enriched.length, notifications: enriched });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 9. Fetch Revision History for a Notification (Admin Only)
  app.get('/api/notifications/:id/revisions', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const doc = await Notification.findOne(
        { id: req.params.id },
        {
          id: 1,
          service: 1,
          revisionCount: 1,
          hasCorrigendum: 1,
          corrigendumSummary: 1,
          manualOverrideLock: 1,
          revisionHistory: 1
        }
      ).lean();
      if (!doc) {
        return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found' });
      }
      res.json({
        success: true,
        id: doc.id,
        service: doc.service,
        revisionCount: doc.revisionCount || 0,
        hasCorrigendum: Boolean(doc.hasCorrigendum),
        corrigendumSummary: doc.corrigendumSummary || '',
        manualOverrideLock: Boolean(doc.manualOverrideLock),
        revisionHistory: doc.revisionHistory || []
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 10. Approve Pending / Quarantined Notification & Publish to Public Feed (Admin Only)
  app.post('/api/notifications/:id/approve', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const existing = await Notification.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found' });
      }

      if (existing.ingestionStatus === 'quarantined' || String(existing.quarantineReason || '').trim()) {
        return res.status(400).json({
          success: false,
          error: 'QUARANTINED_RECORD_CANNOT_BE_VERIFIED',
          message: 'Quarantined notifications cannot be verified or published by blind approval. Resolve source integrity, document verification, and application dates first.'
        });
      }

      if (existing.ingestionStatus === 'rejected') {
        return res.status(400).json({
          success: false,
          error: 'REJECTED_RECORD_CANNOT_BE_APPROVED',
          message: 'Rejected notifications cannot be approved directly.'
        });
      }

      const verification = evaluateNotificationVerificationFlags(
        { ...existing, ingestionStatus: 'published' },
        { allowPromotionEvaluation: true, allowVerifiedDocState: true }
      );
      const canVerifyOnApprove = Boolean(verification.isVerified);
      const resolvedStatus = canVerifyOnApprove
        ? (existing.status === 'under_review' ? 'active' : (existing.status || 'active'))
        : (existing.status === 'closed' || existing.status === 'expired' ? existing.status : 'under_review');
      const resolvedClassification = canVerifyOnApprove
        ? (verification.isResultNotice ? 'VERIFIED_OFFICIAL_RESULT' : 'VERIFIED_OFFICIAL_NOTICE')
        : (existing.evidenceClassification && !['VERIFIED_OFFICIAL_NOTICE', 'VERIFIED_OFFICIAL_RESULT'].includes(existing.evidenceClassification)
          ? existing.evidenceClassification
          : 'NEEDS_OFFICIAL_SOURCE');

      const now = new Date();
      const prevSnap = extractSnapshotValues(existing);
      const revEntry = {
        revisionNo: (existing.revisionCount || 0) + 1,
        revisedAt: now,
        changeType: 'manual_approve',
        triggerSource: 'admin_panel',
        verifiedDocUrl: existing.detailsLink || '',
        summary: canVerifyOnApprove
          ? `Approved and verified from ${existing.ingestionStatus || 'pending_review'} by Admin`
          : `Manually published as unverified/review-only from ${existing.ingestionStatus || 'pending_review'} (${verification.reasons.join(', ') || 'INSUFFICIENT_EVIDENCE'})`,
        changedFields: [
          'ingestionStatus',
          'isVerified',
          'sourceIntegrityVerified',
          'applicationDatesVerified',
          'status'
        ],
        previousValues: prevSnap,
        newValues: prevSnap,
        actor: 'admin'
      };

      const atomicApproveFilter = {
        id: req.params.id,
        ...buildAtomicStateGuards(existing)
      };

      const notif = await Notification.findOneAndUpdate(
        atomicApproveFilter,
        {
          $set: {
            ingestionStatus: 'published',
            status: resolvedStatus,
            isVerified: canVerifyOnApprove,
            sourceIntegrityVerified: verification.sourceIntegrityVerified,
            applicationDatesVerified: verification.applicationDatesVerified,
            hasSourceIntegrityIssue: !verification.sourceIntegrityVerified,
            needsOfficialSource: !verification.hasOfficialEvidence,
            evidenceClassification: resolvedClassification,
            evidenceVerifiedAt: canVerifyOnApprove ? now : null,
            autoPublished: false,
            quarantineReason: '',
            manualOverrideLock: true,
            updatedAt: now
          },
          $inc: { revisionCount: 1 },
          $push: { revisionHistory: { $each: [revEntry], $slice: -20 } }
        },
        { new: true }
      );

      if (!notif) {
        return res.status(409).json({
          success: false,
          error: 'CONCURRENT_APPROVAL_CONFLICT',
          message: 'Notification state or evidence changed concurrently during approval. Refresh and retry.'
        });
      }

      res.json({
        success: true,
        message: '✅ Notification approved and published to live /notifications page!',
        notification: notif
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 11. Reject Candidate with Soft-Tombstone Memory (Admin Only)
  // Prevents rejected notices with unchanged contentHash from being re-ingested every run.
  app.post('/api/notifications/:id/reject', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }

      if (req.query?.purge === 'true') {
        await Notification.deleteMany({ id: req.params.id });
        return res.json({
          success: true,
          purged: true,
          message: `Notification ${req.params.id} permanently purged.`
        });
      }

      const existing = await Notification.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found' });
      }

      const now = new Date();
      const rejectedHash = existing.contentHash || computeContentHash(existing);
      const reason = String(req.body?.reason || 'Rejected by Admin review').slice(0, 300);

      await Notification.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            ingestionStatus: 'rejected',
            isVerified: false,
            autoPublished: false,
            status: 'inactive',
            rejectedAt: now,
            rejectedReason: reason,
            rejectedContentHash: rejectedHash,
            updatedAt: now
          }
        },
        { new: true }
      );

      res.json({
        success: true,
        message: `Notification ${req.params.id} rejected and stored in rejection memory.`
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 12. Ingestion Diagnostics & Persistent Source-Health Endpoint (SECURED: Admin OR Ingestion Secret)
  app.get('/api/notifications/ingestion-status', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      const isSecretValid = verifyIngestionSecretHeader(req, env);
      if (!auth.isAdmin && !isSecretValid) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Admin authorization or valid X-Ingestion-Secret header is required.'
        });
      }

      const memoryStatus = getIngestionStatus();
      let publishedCount = 0;
      let pendingCount = 0;
      let quarantinedCount = 0;
      let rejectedCount = 0;
      let totalCount = 0;
      let persistentSourceHealth = [];
      let latestRuns = [];
      let activeJob = null;
      let lockState = null;

      if (isDbReady()) {
        const countPromises = [
          Notification.countDocuments({
            $or: [
              { ingestionStatus: 'published' },
              { ingestionStatus: { $exists: false } },
              { ingestionStatus: null },
              { ingestionStatus: '' }
            ]
          }),
          Notification.countDocuments({ ingestionStatus: 'pending_review' }),
          Notification.countDocuments({ ingestionStatus: 'quarantined' }),
          Notification.countDocuments({ ingestionStatus: 'rejected' }),
          Notification.countDocuments({})
        ];

        const [pub, pend, quar, rej, tot] = await Promise.all(countPromises);
        publishedCount = pub;
        pendingCount = pend;
        quarantinedCount = quar;
        rejectedCount = rej;
        totalCount = tot;

        if (IngestionSourceHealth) {
          persistentSourceHealth = await IngestionSourceHealth.find({}, {
            _id: 0,
            sourceKey: 1,
            sourceName: 1,
            category: 1,
            lastAttemptAt: 1,
            lastSuccessAt: 1,
            lastFailureAt: 1,
            lastStatus: 1,
            lastDurationMs: 1,
            lastItemsExtracted: 1,
            lastInserted: 1,
            lastUpdated: 1,
            lastQuarantined: 1,
            consecutiveFailures: 1,
            totalRuns: 1,
            totalSuccesses: 1,
            totalFailures: 1
          }).sort({ sourceKey: 1 }).lean();
        }

        if (IngestionRunLog) {
          latestRuns = await IngestionRunLog.find({}, { _id: 0, errors: 0 })
            .sort({ startedAt: -1 })
            .limit(10)
            .lean();
        }

        if (IngestionJob) {
          activeJob = await IngestionJob.findOne(
            { status: { $in: ['running', 'pending'] } },
            { _id: 0, jobId: 1, status: 1, triggerType: 1, attemptCount: 1, startedAt: 1, heartbeatAt: 1, summary: 1, currentSourceKey: 1 }
          ).sort({ createdAt: -1 }).lean();
        }

        if (IngestionLock) {
          const lockDoc = await IngestionLock.findOne({}, { _id: 0, lockKey: 1, fencingToken: 1, ownerRunId: 1, heartbeatAt: 1, leaseExpiresAt: 1 }).lean();
          if (lockDoc) {
            lockState = {
              lockKey: lockDoc.lockKey,
              fencingToken: lockDoc.fencingToken,
              locked: Boolean(lockDoc.ownerRunId && lockDoc.leaseExpiresAt && new Date(lockDoc.leaseExpiresAt) > new Date()),
              heartbeatAt: lockDoc.heartbeatAt,
              leaseExpiresAt: lockDoc.leaseExpiresAt
            };
          }
        }
      }

      res.json({
        status: 'ok',
        safetyFlags: {
          autoPublishEnabled: String(env.AUTO_PUBLISH_ENABLED || '').trim().toLowerCase() === 'true',
          autoPublishResults: String(env.AUTO_PUBLISH_RESULTS || '').trim().toLowerCase() === 'true'
        },
        diagnostics: memoryStatus,
        lockState,
        activeJob,
        sourceHealth: persistentSourceHealth,
        recentRuns: latestRuns,
        counts: {
          published: publishedCount,
          pending: pendingCount,
          quarantined: quarantinedCount,
          rejected: rejectedCount,
          total: totalCount
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'STATUS_ERROR' });
    }
  });

  // 12. 10-Day Expired Exam Cleanup Status Endpoint (Strictly Read-Only Telemetry)
  app.get('/api/notifications/cleanup-status', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      const isSecretValid = verifyIngestionSecretHeader(req, env);
      if (!auth.isAdmin && !isSecretValid) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Admin authorization or valid X-Ingestion-Secret header is required.'
        });
      }

      const purgeEnabled = String(env.ENABLE_EXPIRED_EXAM_PURGE || '').trim().toLowerCase() === 'true';
      let scheduleState = null;

      if (CleanupScheduleModel && isDbReady()) {
        scheduleState = await CleanupScheduleModel.findOne({ taskKey: 'expired_exam_cleanup' }).lean();
      }

      const activeDbName = (CleanupScheduleModel?.db?.name) || 'unknown';
      let appEnv = 'development';
      try {
        appEnv = resolveAppEnvironment(env);
      } catch (_) {
        appEnv = 'misconfigured';
      }
      const schedulerGate = isCleanupSchedulerAllowedInEnvironment({
        env,
        activeDbName
      });

      res.json({
        success: true,
        purgeEnabled,
        mode: purgeEnabled ? 'live_deletion' : 'dry_run',
        scheduleIntervalDays: 10,
        scheduleTargetIst: '02:00:00 AM IST',
        database: {
          name: activeDbName,
          isIsolated: activeDbName === 'akesevai_staging' || activeDbName === 'akesevai_dev' || activeDbName === 'akesevai'
        },
        schedulerGate: {
          allowed: schedulerGate.allowed,
          appEnv: schedulerGate.appEnv,
          reason: schedulerGate.reason || 'ALLOWED'
        },
        scheduleState: scheduleState || {
          taskKey: 'expired_exam_cleanup',
          status: 'not_initialized'
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'CLEANUP_STATUS_ERROR', message: err.message });
    }
  });
}
