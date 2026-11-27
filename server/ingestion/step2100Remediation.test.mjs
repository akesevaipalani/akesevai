// server/ingestion/step2100Remediation.test.mjs
// Offline Regression & Security Verification Suite for Step 2.100 (H-1, H-2, H-3, M-1, M-2, M-4, L-1)
// Strictly offline: zero live network calls, zero MongoDB connections, zero DB writes, zero open ports.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { spawnSync } from 'node:child_process';
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';

import {
  PRODUCTION_DB_NAME,
  STAGING_DB_NAME,
  DEVELOPMENT_DB_NAME,
  VERIFIED_PRODUCTION_HOSTNAMES,
  VERIFIED_STAGING_HOSTNAMES,
  normalizeRenderHostname,
  resolveRenderCloudIdentity,
  resolveAppEnvironment,
  validateDatabaseEnvironmentIsolation,
  validateActualConnectedDatabase,
  isCleanupSchedulerAllowedInEnvironment
} from '../db/databaseIsolation.js';
import {
  notificationSchema,
  extractSafeShortGitCommit,
  buildHealthStatusPayload
} from '../../server.js';
import { INITIAL_NOTIFICATIONS } from '../../src/data/initialNotifications.js';
import {
  enrichNotificationWithDateStatus,
  getKolkataToday
} from '../../src/utils/notificationDateHelper.js';
import {
  BACKFILL_BUCKETS,
  classifyLegacyNotificationForBackfill,
  buildLegacyBackfillDryRunReport
} from './legacyBackfillEvaluator.js';
import {
  resolveSafeSscAttachmentUrl,
  scrapeSscNotifications
} from './scrapers/centralGovtScraper.js';
import {
  extractExplicitVacancies,
  resolveDistrictUrlSafe,
  isValidDistrictApplyUrl,
  extractS3waasTableNotifications,
  extractEcourtTableNotifications,
  extractMunicipalCorpNotifications
} from './scrapers/districtRecruitmentScraper.js';
import { OFFICIAL_EXAM_SOURCES } from './sourcesConfig.js';
import { DISTRICT_OFFICIAL_SOURCES_REGISTRY } from './districtSourcesInventory.js';
import {
  evaluateCandidateTrust,
  evaluateNotificationVerificationFlags
} from './trustScoringEngine.js';
import { evaluateCorrigendumUpdate } from './corrigendumHelper.js';
import { runAllIngestionJobs } from './ingestionManager.js';
import { registerNotificationAndIngestionRoutes } from './ingestionRoutes.js';
import { shouldDeleteExpiredExamNotification } from '../cleanup/expiredExamCleanupHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..', '..');

const PUBLIC_TEST_DNS = async () => [{ address: '93.184.216.34', family: 4 }];
const FIXED_TODAY = getKolkataToday(new Date('2026-11-27T06:00:00.000Z'));

async function withMockHttpsRequest(handler, fn) {
  const originalRequest = https.request;
  const calls = [];

  https.request = (reqOptions, cb) => {
    calls.push(reqOptions);
    const req = new EventEmitter();
    req.destroyed = false;
    req.destroy = () => {
      req.destroyed = true;
    };
    req.end = () => {
      queueMicrotask(() => {
        const spec = handler(reqOptions, calls.length);
        const res = new EventEmitter();
        res.statusCode = spec.statusCode ?? 200;
        res.headers = spec.headers ?? { 'content-type': 'application/json; charset=utf-8' };
        res.resume = () => {};
        res.destroy = () => {};
        cb(res);
        if (spec.body !== undefined) {
          res.emit('data', Buffer.from(spec.body, 'utf8'));
        }
        res.emit('end');
      });
    };
    return req;
  };

  try {
    return await fn(calls);
  } finally {
    https.request = originalRequest;
  }
}

/**
 * Mirrors exact GitHub Actions env expressions + shell pre-flight guard from scheduled_exam_ingestion.yml
 */
function simulateScheduledWorkflowSecretAndUrlResolution({
  githubRef,
  eventName = 'workflow_dispatch',
  inputDryRun = 'true',
  secrets = {},
  vars = {}
}) {
  const PRODUCTION_BASE_URL = 'https://akesevai.onrender.com';
  const PROD_INGESTION_SECRET =
    githubRef === 'refs/heads/main'
      ? (secrets.INGESTION_SECRET_KEY || secrets.INGESTION_SECRET || '')
      : '';
  const STAGING_INGESTION_SECRET =
    githubRef !== 'refs/heads/main'
      ? (secrets.STAGING_INGESTION_SECRET_KEY || '')
      : '';
  const BASE_URL =
    githubRef === 'refs/heads/main'
      ? PRODUCTION_BASE_URL
      : (vars.STAGING_BASE_URL || '');

  // Step 0: Staging vs Production BASE_URL separation guard
  if (githubRef !== 'refs/heads/main') {
    if (!BASE_URL || BASE_URL === PRODUCTION_BASE_URL) {
      return { ok: false, errorCode: 'STAGING_WORKFLOW_BLOCKED', baseUrl: BASE_URL, activeSecret: '' };
    }
  }

  // Step 0B: Manual workflow_dispatch live-run guard
  let dryRunMode = false;
  if (eventName === 'workflow_dispatch') {
    const normDry = String(inputDryRun ?? '').trim().toLowerCase() || 'true';
    if (normDry !== 'true') {
      return { ok: false, errorCode: 'MANUAL_DISPATCH_LIVE_BLOCKED', baseUrl: BASE_URL, activeSecret: '' };
    }
    dryRunMode = true;
  }

  // Step 1: Isolated secret resolution with zero cross-environment fallback
  let targetEnv;
  let activeSecret;
  if (githubRef === 'refs/heads/main') {
    targetEnv = 'production';
    activeSecret = PROD_INGESTION_SECRET;
    if (STAGING_INGESTION_SECRET) {
      return { ok: false, errorCode: 'SECRET_ISOLATION_VIOLATION', baseUrl: BASE_URL, activeSecret: '' };
    }
  } else {
    targetEnv = 'staging';
    activeSecret = STAGING_INGESTION_SECRET;
    if (PROD_INGESTION_SECRET) {
      return { ok: false, errorCode: 'SECRET_ISOLATION_VIOLATION', baseUrl: BASE_URL, activeSecret: '' };
    }
  }

  if (!activeSecret) {
    return {
      ok: false,
      errorCode: targetEnv === 'staging' ? 'STAGING_SECRET_MISSING' : 'PRODUCTION_SECRET_MISSING',
      baseUrl: BASE_URL,
      activeSecret: ''
    };
  }

  return {
    ok: true,
    targetEnv,
    baseUrl: BASE_URL,
    dryRunMode,
    activeSecret
  };
}

// ============================================================================
// 1. PHASE A (H-2): STAGING / PRODUCTION WORKFLOW SECRET ISOLATION TESTS
// ============================================================================
test('Phase A (H-2): scheduled_exam_ingestion.yml enforces strict staging/production secret separation with zero fallback', () => {
  const workflowPath = path.join(REPO_ROOT, '.github', 'workflows', 'scheduled_exam_ingestion.yml');
  const yaml = fs.readFileSync(workflowPath, 'utf8');

  // Verify exact ref-isolated expressions in workflow YAML
  assert.match(
    yaml,
    /PROD_INGESTION_SECRET:\s*\$\{\{\s*github\.ref == 'refs\/heads\/main' && \(secrets\.INGESTION_SECRET_KEY \|\| secrets\.INGESTION_SECRET\) \|\| ''\s*\}\}/
  );
  assert.match(
    yaml,
    /STAGING_INGESTION_SECRET:\s*\$\{\{\s*github\.ref != 'refs\/heads\/main' && secrets\.STAGING_INGESTION_SECRET_KEY \|\| ''\s*\}\}/
  );
  assert.match(
    yaml,
    /BASE_URL:\s*\$\{\{\s*github\.ref == 'refs\/heads\/main' && 'https:\/\/akesevai\.onrender\.com' \|\| vars\.STAGING_BASE_URL \|\| ''\s*\}\}/
  );

  // Verify old shared secret assignment is completely gone
  assert.doesNotMatch(
    yaml,
    /^\s*INGESTION_SECRET:\s*\$\{\{\s*secrets\.INGESTION_SECRET_KEY/m
  );

  // Verify no shell echo/printf ever logs secret values
  assert.doesNotMatch(yaml, /echo[^\n]*\$(?:ACTIVE_INGESTION_SECRET|PROD_INGESTION_SECRET|STAGING_INGESTION_SECRET)/);
  assert.doesNotMatch(yaml, /printf[^\n]*\$(?:ACTIVE_INGESTION_SECRET|PROD_INGESTION_SECRET|STAGING_INGESTION_SECRET)/);

  // Verify unused secret vars are cleared and fail-closed codes exist
  assert.match(yaml, /unset PROD_INGESTION_SECRET STAGING_INGESTION_SECRET/);
  assert.match(yaml, /STAGING_SECRET_MISSING/);
  assert.match(yaml, /PRODUCTION_SECRET_MISSING/);
  assert.match(yaml, /SECRET_ISOLATION_VIOLATION/);
  assert.match(yaml, /-H "x-ingestion-secret: \$ACTIVE_INGESTION_SECRET"/);

  // Behavioral simulation matrix
  const prodPrimary = simulateScheduledWorkflowSecretAndUrlResolution({
    githubRef: 'refs/heads/main',
    eventName: 'schedule',
    secrets: { INGESTION_SECRET_KEY: 'prod-primary', STAGING_INGESTION_SECRET_KEY: 'stg-only' },
    vars: { STAGING_BASE_URL: 'https://akesevai-staging-api-jqp2.onrender.com' }
  });
  assert.equal(prodPrimary.ok, true);
  assert.equal(prodPrimary.targetEnv, 'production');
  assert.equal(prodPrimary.baseUrl, 'https://akesevai.onrender.com');
  assert.equal(prodPrimary.activeSecret, 'prod-primary');

  const prodLegacy = simulateScheduledWorkflowSecretAndUrlResolution({
    githubRef: 'refs/heads/main',
    eventName: 'schedule',
    secrets: { INGESTION_SECRET: 'prod-legacy', STAGING_INGESTION_SECRET_KEY: 'stg-only' }
  });
  assert.equal(prodLegacy.ok, true);
  assert.equal(prodLegacy.activeSecret, 'prod-legacy');

  // Production missing secrets MUST NOT fall back to Staging secret
  const prodMissing = simulateScheduledWorkflowSecretAndUrlResolution({
    githubRef: 'refs/heads/main',
    eventName: 'schedule',
    secrets: { STAGING_INGESTION_SECRET_KEY: 'stg-only' }
  });
  assert.equal(prodMissing.ok, false);
  assert.equal(prodMissing.errorCode, 'PRODUCTION_SECRET_MISSING');

  // Staging non-main ref with dedicated staging secret succeeds (dry-run only)
  const stgOk = simulateScheduledWorkflowSecretAndUrlResolution({
    githubRef: 'refs/heads/release/ingestion-v1',
    eventName: 'workflow_dispatch',
    inputDryRun: 'true',
    secrets: { INGESTION_SECRET_KEY: 'prod-secret-must-never-leak', STAGING_INGESTION_SECRET_KEY: 'stg-only' },
    vars: { STAGING_BASE_URL: 'https://akesevai-staging-api-jqp2.onrender.com' }
  });
  assert.equal(stgOk.ok, true);
  assert.equal(stgOk.targetEnv, 'staging');
  assert.equal(stgOk.baseUrl, 'https://akesevai-staging-api-jqp2.onrender.com');
  assert.equal(stgOk.activeSecret, 'stg-only');
  assert.equal(stgOk.dryRunMode, true);

  // Staging missing STAGING_INGESTION_SECRET_KEY MUST FAIL CLOSED and NEVER fall back to Prod secret
  const stgMissingSecret = simulateScheduledWorkflowSecretAndUrlResolution({
    githubRef: 'refs/heads/release/ingestion-v1',
    eventName: 'workflow_dispatch',
    inputDryRun: 'true',
    secrets: { INGESTION_SECRET_KEY: 'prod-secret-must-never-leak', INGESTION_SECRET: 'prod-legacy' },
    vars: { STAGING_BASE_URL: 'https://akesevai-staging-api-jqp2.onrender.com' }
  });
  assert.equal(stgMissingSecret.ok, false);
  assert.equal(stgMissingSecret.errorCode, 'STAGING_SECRET_MISSING');
  assert.equal(stgMissingSecret.activeSecret, '');

  // Staging targeting production URL MUST FAIL CLOSED
  const stgProdUrl = simulateScheduledWorkflowSecretAndUrlResolution({
    githubRef: 'refs/heads/release/ingestion-v1',
    eventName: 'workflow_dispatch',
    inputDryRun: 'true',
    secrets: { STAGING_INGESTION_SECRET_KEY: 'stg-only' },
    vars: { STAGING_BASE_URL: 'https://akesevai.onrender.com' }
  });
  assert.equal(stgProdUrl.ok, false);
  assert.equal(stgProdUrl.errorCode, 'STAGING_WORKFLOW_BLOCKED');

  // Manual workflow_dispatch live run MUST FAIL CLOSED
  const manualLive = simulateScheduledWorkflowSecretAndUrlResolution({
    githubRef: 'refs/heads/release/ingestion-v1',
    eventName: 'workflow_dispatch',
    inputDryRun: 'false',
    secrets: { STAGING_INGESTION_SECRET_KEY: 'stg-only' },
    vars: { STAGING_BASE_URL: 'https://akesevai-staging-api-jqp2.onrender.com' }
  });
  assert.equal(manualLive.ok, false);
  assert.equal(manualLive.errorCode, 'MANUAL_DISPATCH_LIVE_BLOCKED');
});

// ============================================================================
// 2. PHASE B (H-3): RENDER PRODUCTION / STAGING IDENTITY & DB ISOLATION TESTS
// ============================================================================
test('Phase B (H-3): Render identity & database isolation validates verified prod/staging hostnames and fails closed on unknown/missing/wrong DB', () => {
  const PROD_URI = `mongodb+srv://u:p@cluster0.example.mongodb.net/${PRODUCTION_DB_NAME}?retryWrites=true`;
  const STG_URI = `mongodb+srv://u:p@cluster0.example.mongodb.net/${STAGING_DB_NAME}?retryWrites=true`;
  const DEV_URI = `mongodb+srv://u:p@cluster0.example.mongodb.net/${DEVELOPMENT_DB_NAME}?retryWrites=true`;

  assert.deepEqual([...VERIFIED_PRODUCTION_HOSTNAMES], ['akesevai.onrender.com']);
  assert.deepEqual([...VERIFIED_STAGING_HOSTNAMES], ['akesevai-staging-api-jqp2.onrender.com']);
  assert.equal(normalizeRenderHostname('  AKESEVAI.ONRENDER.COM. ').hostname, 'akesevai.onrender.com');
  assert.equal(normalizeRenderHostname('https://akesevai.onrender.com').valid, false);

  // 1) Verified Production hostname PASS (even when RENDER_SERVICE_NAME has a Render suffix)
  const prodRes = validateDatabaseEnvironmentIsolation({
    uri: PROD_URI,
    env: {
      RENDER: 'true',
      APP_ENV: 'production',
      RENDER_EXTERNAL_HOSTNAME: 'akesevai.onrender.com',
      RENDER_SERVICE_NAME: 'akesevai-api-prod-x7k2',
      RENDER_GIT_BRANCH: 'main'
    },
    exitOnError: false
  });
  assert.equal(prodRes.ok, true);
  assert.equal(prodRes.appEnv, 'production');
  assert.equal(prodRes.targetDb, PRODUCTION_DB_NAME);
  assert.equal(prodRes.isIsolated, true);
  assert.equal(prodRes.renderIdentity.isVerifiedRenderProd, true);

  // 2) Verified Staging hostname -> Staging PASS (never classified as Production)
  const stgEnv = {
    RENDER: 'true',
    APP_ENV: 'staging',
    RENDER_EXTERNAL_HOSTNAME: 'akesevai-staging-api-jqp2.onrender.com',
    RENDER_SERVICE_NAME: 'akesevai-staging-api-jqp2',
    RENDER_GIT_BRANCH: 'release/ingestion-v1'
  };
  const stgIdentity = resolveRenderCloudIdentity(stgEnv);
  assert.equal(stgIdentity.isVerifiedRenderStaging, true);
  assert.equal(stgIdentity.isVerifiedRenderProd, false);
  const stgRes = validateDatabaseEnvironmentIsolation({
    uri: STG_URI,
    env: stgEnv,
    exitOnError: false
  });
  assert.equal(stgRes.ok, true);
  assert.equal(stgRes.appEnv, 'staging');
  assert.equal(stgRes.targetDb, STAGING_DB_NAME);

  // 3) Staging service akesevai-staging-api-jqp2 MUST NEVER be accepted as Production (even with spoofed prod hostname)
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: {
          RENDER: 'true',
          APP_ENV: 'production',
          RENDER_EXTERNAL_HOSTNAME: 'akesevai.onrender.com',
          RENDER_SERVICE_NAME: 'akesevai-staging-api-jqp2'
        },
        exitOnError: false
      }),
    /ENVIRONMENT_CONFLICT/
  );
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: {
          RENDER: 'true',
          APP_ENV: 'production',
          RENDER_EXTERNAL_HOSTNAME: 'akesevai-staging-api-jqp2.onrender.com',
          RENDER_SERVICE_NAME: 'akesevai-staging-api-jqp2'
        },
        exitOnError: false
      }),
    /ENVIRONMENT_CONFLICT/
  );

  // 4) Unknown hostname -> FAIL CLOSED (both production & staging)
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: {
          RENDER: 'true',
          APP_ENV: 'production',
          RENDER_EXTERNAL_HOSTNAME: 'unknown-clone-123.onrender.com',
          RENDER_SERVICE_NAME: 'akesevai'
        },
        exitOnError: false
      }),
    /UNKNOWN_RENDER_SERVICE/
  );
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: STG_URI,
        env: {
          RENDER: 'true',
          APP_ENV: 'staging',
          RENDER_EXTERNAL_HOSTNAME: 'random-preview.onrender.com',
          RENDER_SERVICE_NAME: 'akesevai-staging-api-jqp2'
        },
        exitOnError: false
      }),
    /UNKNOWN_RENDER_SERVICE/
  );

  // 5) Missing identity metadata -> FAIL CLOSED
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: { RENDER: 'true', APP_ENV: 'production' },
        exitOnError: false
      }),
    /UNVERIFIED_RENDER_PRODUCTION_IDENTITY/
  );
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: { RENDER: 'true', APP_ENV: 'production', RENDER_SERVICE_NAME: 'akesevai' },
        exitOnError: false
      }),
    /UNVERIFIED_RENDER_PRODUCTION_IDENTITY/
  );
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: STG_URI,
        env: { RENDER: 'true', APP_ENV: 'staging' },
        exitOnError: false
      }),
    /UNVERIFIED_RENDER_STAGING_IDENTITY/
  );
  assert.throws(
    () => resolveAppEnvironment({ RENDER: 'true' }),
    /MISSING_APP_ENV/
  );

  // Spoofed hostname locally without RENDER=true -> FAIL CLOSED
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: { APP_ENV: 'production', RENDER_EXTERNAL_HOSTNAME: 'akesevai.onrender.com' },
        exitOnError: false
      }),
    /LOCAL_PRODUCTION_DB_BLOCKED/
  );

  // 6) Wrong database name -> FAIL CLOSED
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: STG_URI,
        env: {
          RENDER: 'true',
          APP_ENV: 'production',
          RENDER_EXTERNAL_HOSTNAME: 'akesevai.onrender.com'
        },
        exitOnError: false
      }),
    /PRODUCTION_DATABASE_MISMATCH/
  );
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: stgEnv,
        exitOnError: false
      }),
    /CRITICAL_DATABASE_ISOLATION_VIOLATION/
  );
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: DEV_URI,
        env: stgEnv,
        exitOnError: false
      }),
    /STAGING_DATABASE_MISMATCH/
  );
  assert.throws(
    () =>
      validateDatabaseEnvironmentIsolation({
        uri: PROD_URI,
        env: {},
        exitOnError: false
      }),
    /CRITICAL_DATABASE_ISOLATION_VIOLATION/
  );
  assert.throws(
    () =>
      validateActualConnectedDatabase({
        connectedDbName: PRODUCTION_DB_NAME,
        appEnv: 'staging',
        exitOnError: false
      }),
    /RUNTIME_DATABASE_MISMATCH/
  );

  // Valid local development DB passes
  const devRes = validateDatabaseEnvironmentIsolation({
    uri: DEV_URI,
    env: {},
    exitOnError: false
  });
  assert.equal(devRes.ok, true);
  assert.equal(devRes.appEnv, 'development');
});

// ============================================================================
// 3. PHASE C (H-1): LEGACY NOTIFICATION CTA & 40-RECORD SEED REGRESSION TESTS
// ============================================================================
test('Phase C (H-1): Legacy CTA gating stays fail-closed for unverified records and read-only backfill classifies evidence strictly', () => {
  // A) Unverified legacy doc (missing new PR #2 booleans + generic URLs) MUST NOT show Apply CTA
  const unverifiedLegacy = {
    id: 'legacy-unverified-01',
    category: 'tnpsc',
    organization: 'TNPSC',
    service: 'TNPSC Group 4 Recruitment 2026',
    openingDate: '01/11/2026',
    closingDate: '20/12/2026',
    detailsLink: 'https://www.tnpsc.gov.in/',
    applyLink: 'https://www.tnpscexams.in/',
    isVerified: true,
    status: 'active',
    ingestionStatus: 'published'
  };
  const enrichedUnverified = enrichNotificationWithDateStatus(unverifiedLegacy, FIXED_TODAY);
  assert.equal(enrichedUnverified.canShowApplyCta, false);
  assert.equal(enrichedUnverified.isActiveApplication, false);
  assert.equal(enrichedUnverified.applyCtaState, 'NEEDS_REVIEW_DISABLED');

  const unverifiedEval = classifyLegacyNotificationForBackfill(unverifiedLegacy, { today: FIXED_TODAY });
  assert.equal(unverifiedEval.bucket, BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION);
  assert.equal(unverifiedEval.proposedBackfillFields, null);

  // B) Legacy doc WITH concrete official PDF + notice no + specific official applyLink + valid dates
  const evidenceRichLegacy = {
    id: 'legacy-evidenced-02',
    category: 'tnpsc',
    sourceKey: 'tnpsc',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Combined Civil Services Examination IV 2026',
    notificationNo: '01/2026',
    officialNotificationNumber: '01/2026',
    openingDate: '01/11/2026',
    closingDate: '20/12/2026',
    examDate: '10/01/2027',
    detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026_Group4.pdf',
    officialPdfUrl: 'https://www.tnpsc.gov.in/Document/english/01_2026_Group4.pdf',
    applyLink: 'https://apply.tnpscexams.in/notification-2026/apply',
    isVerified: true,
    status: 'active',
    ingestionStatus: 'published'
  };
  // Pre-backfill: still fail-closed until Admin applies evidence backfill
  const preBackfillEnriched = enrichNotificationWithDateStatus(evidenceRichLegacy, FIXED_TODAY);
  assert.equal(preBackfillEnriched.canShowApplyCta, false);
  assert.equal(preBackfillEnriched.applyCtaState, 'NEEDS_REVIEW_DISABLED');

  const evidencedEval = classifyLegacyNotificationForBackfill(evidenceRichLegacy, { today: FIXED_TODAY });
  assert.equal(evidencedEval.bucket, BACKFILL_BUCKETS.ELIGIBLE_FOR_EVIDENCE_BACKFILL);
  assert.equal(evidencedEval.proposedBackfillFields.sourceIntegrityVerified, true);
  assert.equal(evidencedEval.proposedBackfillFields.applicationDatesVerified, true);

  // Simulated post-backfill (in-memory only): Apply CTA becomes ACTIVE
  const postBackfillEnriched = enrichNotificationWithDateStatus(
    { ...evidenceRichLegacy, ...evidencedEval.proposedBackfillFields },
    FIXED_TODAY
  );
  assert.equal(postBackfillEnriched.canShowApplyCta, true);
  assert.equal(postBackfillEnriched.applyCtaState, 'ACTIVE');

  // C) Legacy doc with missing closing date MUST NEVER become eligible
  const missingDatesLegacy = { ...evidenceRichLegacy, id: 'legacy-nodate-03', closingDate: '' };
  const missingDatesEval = classifyLegacyNotificationForBackfill(missingDatesLegacy, { today: FIXED_TODAY });
  assert.equal(missingDatesEval.bucket, BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION);
  assert.equal(missingDatesEval.proposedBackfillFields, null);

  // D) Third-party legacy doc MUST NEVER become eligible
  const thirdPartyLegacy = { ...evidenceRichLegacy, id: 'legacy-3p-04', isThirdParty: true, sourceType: 'third_party' };
  const thirdPartyEval = classifyLegacyNotificationForBackfill(thirdPartyLegacy, { today: FIXED_TODAY });
  assert.equal(thirdPartyEval.bucket, BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION);
  assert.equal(thirdPartyEval.proposedBackfillFields, null);
});

test('Phase C (H-1): All 40 seed notifications in initialNotifications.js fail-closed with 0 false Apply CTAs', () => {
  assert.equal(INITIAL_NOTIFICATIONS.length, 40, 'Expected exactly 40 master seed notifications');

  const dryRunReport = buildLegacyBackfillDryRunReport(INITIAL_NOTIFICATIONS, { today: FIXED_TODAY });
  assert.equal(dryRunReport.dryRun, true);
  assert.equal(dryRunReport.persisted, false);
  assert.equal(dryRunReport.counts.total, 40);
  assert.equal(dryRunReport.counts[BACKFILL_BUCKETS.ALREADY_VERIFIED], 0);
  assert.equal(dryRunReport.counts[BACKFILL_BUCKETS.ELIGIBLE_FOR_EVIDENCE_BACKFILL], 0);
  assert.equal(dryRunReport.counts[BACKFILL_BUCKETS.ARCHIVED_OR_EXPIRED_CYCLE], 11);
  assert.equal(dryRunReport.counts[BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION], 29);

  for (const r of dryRunReport.records) {
    assert.equal(r.currentCanShowApplyCta, false, `Seed record ${r.id} must NOT expose an active Apply CTA without official evidence`);
    assert.equal(r.proposedBackfillFields, null, `Seed record ${r.id} must NOT auto-qualify for backfill without real PDF & URL`);
  }

  const aiimsLegacy = INITIAL_NOTIFICATIONS.find((n) => n.id === 'aiims-norcet-7-2026');
  assert.ok(aiimsLegacy);
  assert.equal(aiimsLegacy.isLegacy, true);
  assert.equal(aiimsLegacy.status, 'closed');
  assert.equal(aiimsLegacy.evidenceClassification, 'OLD_RECRUITMENT_CYCLE');
});

// ============================================================================
// 4. PHASE D (M-2): EMPTY applyLink / detailsLink HANDLING TESTS
// ============================================================================
test('Phase D (M-2): Mongoose schema and Admin Add Form default missing applyLink/detailsLink to empty string with no generic homepage fallback', () => {
  assert.equal(notificationSchema.path('applyLink').defaultValue, '');
  assert.equal(notificationSchema.path('detailsLink').defaultValue, '');

  // Verify NotificationTables.jsx Admin Add Form has zero india.gov.in generic homepage fallback
  const tablesSrc = fs.readFileSync(
    path.join(REPO_ROOT, 'src', 'components', 'NotificationTables.jsx'),
    'utf8'
  );
  assert.doesNotMatch(tablesSrc, /india\.gov\.in/i);
  assert.match(tablesSrc, /detailsLink:\s*\(formData\.detailsLink \|\| ''\)\.trim\(\)/);
  assert.match(tablesSrc, /applyLink:\s*\(formData\.applyLink \|\| ''\)\.trim\(\)/);

  // Empty applyLink must produce clean MISSING_URL (not CROSS_AGENCY_URL_MISMATCH) and disable Apply CTA
  const flags = evaluateNotificationVerificationFlags(
    {
      sourceKey: 'tnpsc',
      service: 'TNPSC Combined Civil Services Examination 2026',
      notificationNo: '01/2026',
      detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026.pdf',
      applyLink: '',
      openingDate: '01/11/2026',
      closingDate: '20/12/2026',
      ingestionStatus: 'published'
    },
    { allowPromotionEvaluation: true, today: FIXED_TODAY }
  );
  assert.equal(flags.reasons.includes('APPLY_LINK:MISSING_URL'), true);
  assert.equal(flags.reasons.includes('CROSS_AGENCY_URL_MISMATCH'), false);
  assert.equal(flags.isVerified, false);

  const enrichedEmptyApply = enrichNotificationWithDateStatus(
    {
      service: 'TNPSC Combined Civil Services Examination 2026',
      openingDate: '01/11/2026',
      closingDate: '20/12/2026',
      detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026.pdf',
      applyLink: '',
      sourceIntegrityVerified: false,
      applicationDatesVerified: false
    },
    FIXED_TODAY
  );
  assert.equal(enrichedEmptyApply.canShowApplyCta, false);
  assert.equal(enrichedEmptyApply.applyCtaState, 'NEEDS_REVIEW_DISABLED');
});

// ============================================================================
// 5. PHASE D (M-4): SSC UNSAFE ATTACHMENT URL HARDENING TESTS
// ============================================================================
test('Phase D (M-4): resolveSafeSscAttachmentUrl & scrapeSscNotifications reject unsafe schemes/hosts/non-PDFs and accept only official PDFs', async () => {
  const rejectedPaths = [
    '',
    '   ',
    null,
    undefined,
    'javascript:alert(1).pdf',
    'JAVASCRIPT:void(0)',
    'vbscript:msgbox(1).pdf',
    'data:application/pdf;base64,JVBERi0xLjQ=',
    'file:///etc/passwd.pdf',
    'ftp://ssc.gov.in/notice.pdf',
    '//evil.example.com/phish.pdf',
    'https://evil.example.com/phish.pdf',
    'https://ssc.gov.in.evil.com/notice.pdf',
    'http://ssc.gov.in/api/attachment/notice.pdf',
    '../../../etc/passwd.pdf',
    'notice/%2e%2e/secret.pdf',
    'folder\\notice.pdf',
    'notice\n2026.pdf',
    'notices/landing.html',
    'notices/installer.exe',
    'https://ssc.gov.in/notices',
    'https://127.0.0.1/notice.pdf'
  ];
  for (const bad of rejectedPaths) {
    assert.equal(
      resolveSafeSscAttachmentUrl(bad),
      '',
      `Expected resolveSafeSscAttachmentUrl to reject ${JSON.stringify(bad)}`
    );
  }

  // Valid official SSC PDF attachments pass
  assert.equal(
    resolveSafeSscAttachmentUrl('notice_boards/CGL_2026.pdf'),
    'https://ssc.gov.in/api/attachment/notice_boards/CGL_2026.pdf'
  );
  assert.equal(
    resolveSafeSscAttachmentUrl('/api/attachment/notice_boards/CHSL_2026.pdf'),
    'https://ssc.gov.in/api/attachment/notice_boards/CHSL_2026.pdf'
  );
  assert.equal(
    resolveSafeSscAttachmentUrl('https://ssc.gov.in/api/attachment/notice_boards/MTS_2026.pdf'),
    'https://ssc.gov.in/api/attachment/notice_boards/MTS_2026.pdf'
  );
  assert.equal(
    resolveSafeSscAttachmentUrl('https://cdnbbsr.s3waas.gov.in/s3abc/uploads/ssc_2026.pdf'),
    'https://cdnbbsr.s3waas.gov.in/s3abc/uploads/ssc_2026.pdf'
  );

  // End-to-end scrapeSscNotifications integration check
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rows: [
          {
            id: 9001,
            headline: 'SSC Combined Graduate Level Examination 2026 Official Notice',
            attachments: [{ path: 'javascript:alert(1).pdf' }, { path: '//evil.com/x.pdf' }],
            redirectUrl: 'https://evil.example.com/phish',
            createdAt: '2026-11-26T09:00:00.000Z'
          },
          {
            id: 9002,
            headline: 'SSC CHSL Examination 2026 Detailed Advertisement',
            attachments: [{ path: 'notice_boards/CHSL_2026_Advt.pdf' }],
            createdAt: '2026-11-26T10:00:00.000Z'
          }
        ]
      })
    }),
    async () => {
      const res = await scrapeSscNotifications(
        { key: 'ssc_notices', url: 'https://ssc.gov.in/api/general-website/portal/notice-boards' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(res.success, true);
      assert.equal(res.items.length, 2);
      assert.equal(res.items[0].detailsLink, 'https://ssc.gov.in/notices');
      assert.equal(res.items[1].detailsLink, 'https://ssc.gov.in/api/attachment/notice_boards/CHSL_2026_Advt.pdf');
    }
  );
});

// ============================================================================
// 6. PHASE D (L-1): /api/health SAFE SHORT GIT COMMIT SHA TESTS
// ============================================================================
test('Phase D (L-1): /api/health exposes safe short RENDER_GIT_COMMIT SHA or null without leaking secrets', () => {
  assert.equal(
    extractSafeShortGitCommit({ RENDER_GIT_COMMIT: '5e532bb428f5e1042b1e2fe302a7324dd89769d6' }),
    '5e532bb'
  );
  assert.equal(extractSafeShortGitCommit({}), null);
  assert.equal(extractSafeShortGitCommit({ RENDER_GIT_COMMIT: '   ' }), null);
  assert.equal(
    extractSafeShortGitCommit({ RENDER_GIT_COMMIT: 'mongodb+srv://user:pass@cluster.mongodb.net/akesevai' }),
    null
  );
  assert.equal(extractSafeShortGitCommit({ RENDER_GIT_COMMIT: 'not-a-hex-sha!' }), null);

  const healthWithCommit = buildHealthStatusPayload({
    env: {
      NODE_ENV: 'production',
      RENDER: 'true',
      APP_ENV: 'staging',
      RENDER_SERVICE_NAME: 'akesevai-staging-api-jqp2',
      RENDER_EXTERNAL_HOSTNAME: 'akesevai-staging-api-jqp2.onrender.com',
      RENDER_GIT_COMMIT: '5e532bb428f5e1042b1e2fe302a7324dd89769d6',
      FAST2SMS_API_KEY: 'super_secret_sms_token_value',
      INGESTION_SECRET_KEY: 'super_secret_ingestion_key'
    },
    mongooseConnection: { readyState: 1, name: STAGING_DB_NAME },
    mongoUri: `mongodb+srv://dbuser:dbpass@cluster0.example.mongodb.net/${STAGING_DB_NAME}`
  });
  assert.equal(healthWithCommit.status, 'ok');
  assert.equal(healthWithCommit.commitSha, '5e532bb');
  assert.equal(healthWithCommit.database.name, STAGING_DB_NAME);
  assert.equal(healthWithCommit.database.isIsolated, true);
  assert.equal(healthWithCommit.environmentDetails.externalHostname, 'akesevai-staging-api-jqp2.onrender.com');
  assert.equal(healthWithCommit.environmentDetails.identityVerified, true);

  const serialized = JSON.stringify(healthWithCommit);
  assert.equal(serialized.includes('dbpass'), false);
  assert.equal(serialized.includes('mongodb+srv://'), false);
  assert.equal(serialized.includes('super_secret_sms_token_value'), false);
  assert.equal(serialized.includes('super_secret_ingestion_key'), false);

  const healthWithoutCommit = buildHealthStatusPayload({
    env: { APP_ENV: 'development' },
    mongooseConnection: { readyState: 1, name: DEVELOPMENT_DB_NAME },
    mongoUri: `mongodb://127.0.0.1:27017/${DEVELOPMENT_DB_NAME}`
  });
  assert.equal(healthWithoutCommit.commitSha, null);
});

// ============================================================================
// 7. PHASE D (M-1): DISTRICT SCRAPER HARDENING & DISABLED-SOURCE INVARIANT
// ============================================================================
test('Phase D (M-1): districtRecruitmentScraper hardens URL/vacancy/apply validation while all district sources stay disabled', () => {
  // Verify ZERO district sources enabled in sourcesConfig.js or districtSourcesInventory.js
  assert.equal(
    OFFICIAL_EXAM_SOURCES.some((s) => s.key.startsWith('dist_') || s.key.startsWith('corp_')),
    false
  );
  assert.ok(DISTRICT_OFFICIAL_SOURCES_REGISTRY.length > 0);
  for (const distSource of DISTRICT_OFFICIAL_SOURCES_REGISTRY) {
    assert.equal(distSource.enabled, false, `District source ${distSource.sourceKey} must remain enabled: false`);
  }

  // Hardened URL checks
  const distSourceCfg = {
    sourceKey: 'dist_dindigul_collectorate',
    districtId: 'dindigul',
    departmentId: 'district_collectorate',
    departmentNameEn: 'District Collector Office',
    organization: 'Dindigul District Administration',
    officialWebsiteUrl: 'https://dindigul.nic.in/',
    recruitmentUrl: 'https://dindigul.nic.in/notice_category/recruitment/',
    officialDomainPattern: 'dindigul.nic.in'
  };

  for (const bad of [
    'javascript:alert(1)',
    'JAVASCRIPT:void(0)',
    'java\tscript:alert(1)',
    'vbscript:msgbox(1)',
    'data:text/html,<script>alert(1)</script>',
    '//evil.example.com/fake.pdf',
    'https://evil.example.com/fake.pdf',
    'http://dindigul.nic.in/uploads/notice.pdf',
    'uploads\\notice.pdf'
  ]) {
    assert.equal(
      resolveDistrictUrlSafe(bad, distSourceCfg.recruitmentUrl, distSourceCfg.sourceKey, 'notice'),
      '',
      `Expected resolveDistrictUrlSafe to reject ${JSON.stringify(bad)}`
    );
  }
  assert.equal(
    resolveDistrictUrlSafe('/uploads/dindigul_2026.pdf', distSourceCfg.recruitmentUrl, distSourceCfg.sourceKey, 'notice'),
    'https://dindigul.nic.in/uploads/dindigul_2026.pdf'
  );
  assert.equal(
    resolveDistrictUrlSafe(
      'uploads/court_2026.pdf',
      'https://districts.ecourts.gov.in/madurai/recruitment/',
      'dist_madurai_ecourts',
      'notice'
    ),
    'https://districts.ecourts.gov.in/madurai/uploads/court_2026.pdf'
  );

  // Hardened vacancy extraction checks
  assert.equal(extractExplicitVacancies('0 Posts'), '');
  assert.equal(extractExplicitVacancies('TNPSC Group 4 Posts Notification 2026'), '');
  assert.equal(extractExplicitVacancies('District Recruitment 2026 Posts'), '');
  assert.equal(extractExplicitVacancies('Pay Level 10 Assistants Recruitment'), '');
  assert.equal(extractExplicitVacancies('Grade 2 Medical Officers Notification'), '');
  assert.equal(extractExplicitVacancies('Total Vacancies: 45 Staff Nurses'), '45 Posts');
  assert.equal(extractExplicitVacancies('Recruitment of 12 Staff Nurses in Dindigul'), '12 Posts');

  // Apply URL validator rejects generic listing URLs & PDFs
  assert.equal(isValidDistrictApplyUrl('https://dindigul.nic.in/', distSourceCfg), false);
  assert.equal(isValidDistrictApplyUrl('https://dindigul.nic.in/notice_category/recruitment/', distSourceCfg), false);
  assert.equal(isValidDistrictApplyUrl('https://dindigul.nic.in/uploads/notice.pdf', distSourceCfg), false);
  assert.equal(isValidDistrictApplyUrl('https://evil.example.com/apply/123', distSourceCfg), false);
  assert.equal(isValidDistrictApplyUrl('https://dindigul.nic.in/apply-online/dhs-2026', distSourceCfg), true);

  // S3WaaS / eCourts / Municipal extractors reject unsafe URLs and never hardcode baseUrl into applyLink
  const unsafeTableHtml = `
    <table><tbody>
      <tr>
        <td>District Group 4 Posts Recruitment 2026</td>
        <td><a href="JAVASCRIPT:alert(1)">Download PDF</a> <a href="https://evil.example.com/fake.pdf">View PDF</a></td>
        <td>01-11-2026</td>
        <td>20-12-2026</td>
      </tr>
      <tr>
        <td>Recruitment of 15 Staff Nurses in Dindigul DHS</td>
        <td><a href="/uploads/dhs_nurses_2026.pdf">Download PDF</a></td>
        <td>01-11-2026</td>
        <td>20-12-2026</td>
      </tr>
    </tbody></table>
  `;
  const s3waasRes = extractS3waasTableNotifications(unsafeTableHtml, distSourceCfg, { todayIso: '2026-11-27' });
  assert.equal(s3waasRes.items.length, 2);
  assert.equal(s3waasRes.items[0].posts, 'Not Specified');
  assert.equal(s3waasRes.items[0].pdfUrl, '');
  assert.equal(s3waasRes.items[0].detailsLink, '');
  assert.equal(s3waasRes.items[0].applyLink, '');
  assert.equal(s3waasRes.items[0].ingestionStatus, 'quarantined');
  assert.equal(s3waasRes.items[1].posts, '15 Posts');
  assert.equal(s3waasRes.items[1].pdfUrl, 'https://dindigul.nic.in/uploads/dhs_nurses_2026.pdf');
  assert.equal(s3waasRes.items[1].applyLink, '');
  assert.equal(s3waasRes.items[1].ingestionStatus, 'pending_review');

  const ecourtCfg = {
    sourceKey: 'dist_madurai_ecourts',
    districtId: 'madurai',
    departmentId: 'other_institutions',
    departmentNameEn: 'District & Sessions Court (eCourts)',
    organization: 'Madurai District Judiciary',
    officialWebsiteUrl: 'https://districts.ecourts.gov.in/madurai',
    recruitmentUrl: 'https://districts.ecourts.gov.in/madurai/recruitment/',
    officialDomainPattern: 'districts.ecourts.gov.in'
  };
  const ecourtRes = extractEcourtTableNotifications(
    `<table><tbody><tr><td>1</td><td>Office Assistant 8 Posts</td><td>01-11-2026</td><td>25-12-2026</td><td><a href="//evil.com/x.pdf">PDF</a></td></tr></tbody></table>`,
    ecourtCfg,
    { todayIso: '2026-11-27' }
  );
  assert.equal(ecourtRes.items.length, 1);
  assert.equal(ecourtRes.items[0].pdfUrl, '');
  assert.equal(ecourtRes.items[0].applyLink, '');
  assert.equal(ecourtRes.items[0].ingestionStatus, 'quarantined');

  const corpCfg = {
    sourceKey: 'corp_gcc_chennai',
    districtId: 'chennai',
    departmentId: 'municipal_corporation',
    departmentNameEn: 'Municipal Corporation',
    organization: 'Greater Chennai Corporation (GCC)',
    officialWebsiteUrl: 'https://chennaicorporation.gov.in/',
    recruitmentUrl: 'https://chennaicorporation.gov.in/gcc/recruitment/',
    officialDomainPattern: 'chennaicorporation.gov.in'
  };
  const corpRes = extractMunicipalCorpNotifications(
    `<div class="recruitment-card"><h3>Urban Health Nurse 10 Posts</h3><p>01-11-2026 to 22-12-2026</p><a href="data:application/pdf,bad">Download PDF</a></div>`,
    corpCfg,
    { todayIso: '2026-11-27' }
  );
  assert.equal(corpRes.items.length, 1);
  assert.equal(corpRes.items[0].pdfUrl, '');
  assert.equal(corpRes.items[0].applyLink, '');
  assert.equal(corpRes.items[0].ingestionStatus, 'quarantined');
});

// ============================================================================
// 8. PHASE E: MANDATORY CORE SAFETY INVARIANTS
// ============================================================================
test('Phase E invariants: AUTO_PUBLISH_ENABLED=false, dry-run 0 DB writes, and expired cleanup safety hold simultaneously', async () => {
  // 1) AUTO_PUBLISH_ENABLED=false blocks all auto-publish
  const trustDecision = evaluateCandidateTrust(
    {
      sourceKey: 'tnpsc',
      category: 'tnpsc',
      organization: 'Tamil Nadu Public Service Commission (TNPSC)',
      service: 'TNPSC Combined Civil Services Examination Group IV 2026',
      notificationNo: '01/2026',
      openingDate: '01-11-2026',
      closingDate: '25-12-2026',
      sourcePublishedAt: '01-11-2026',
      detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026.pdf',
      applyLink: 'https://apply.tnpscexams.in/notification-2026/apply'
    },
    {
      sourceKey: 'tnpsc',
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      env: { AUTO_PUBLISH_ENABLED: 'false', AUTO_PUBLISH_RESULTS: 'false' },
      now: new Date('2026-11-27T06:00:00.000Z')
    }
  );
  assert.equal(trustDecision.autoPublished, false);
  assert.equal(trustDecision.ingestionStatus, 'pending_review');

  const corrDecision = evaluateCorrigendumUpdate({
    existing: {
      id: 'notif-tnpsc-1',
      sourceKey: 'tnpsc',
      service: 'TNPSC Combined Civil Services Examination Group IV 2026',
      closingDate: '20-12-2026',
      detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026.pdf'
    },
    candidate: {
      sourceKey: 'tnpsc',
      service: 'TNPSC Combined Civil Services Examination Group IV 2026',
      closingDate: '28-12-2026',
      detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026_corr.pdf'
    },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    env: { AUTO_PUBLISH_ENABLED: 'false' }
  });
  assert.equal(corrDecision.decision, 'pending_corrigendum_review');

  // 2) Dry-run executes 0 MongoDB writes (both orchestrator & enqueue route)
  let dbWrites = 0;
  const strictReadOnlyModel = {
    find: () => ({ lean: async () => [] }),
    findOne: () => ({ lean: async () => null }),
    create: async () => { dbWrites++; throw new Error('WRITE_FORBIDDEN'); },
    updateOne: async () => { dbWrites++; throw new Error('WRITE_FORBIDDEN'); },
    findOneAndUpdate: async () => { dbWrites++; throw new Error('WRITE_FORBIDDEN'); }
  };
  const dryRunSummary = await runAllIngestionJobs(strictReadOnlyModel, {
    dryRun: true,
    sourceKey: 'tnpsc',
    skipDocVerification: true,
    skipRateLimit: true,
    scraperOverrides: {
      tnpsc: async () => ({
        success: true,
        source: 'tnpsc',
        items: [
          {
            sourceKey: 'tnpsc',
            category: 'tnpsc',
            organization: 'TNPSC',
            service: 'TNPSC Combined Civil Services Examination Group IV 2026',
            detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026.pdf',
            applyLink: ''
          }
        ]
      })
    }
  });
  assert.equal(dryRunSummary.dryRun, true);
  assert.equal(dbWrites, 0);

  const routes = new Map();
  const mockApp = {
    get: (p, h) => routes.set(`GET:${p}`, h),
    post: (p, h) => routes.set(`POST:${p}`, h),
    put: (p, h) => routes.set(`PUT:${p}`, h),
    delete: (p, h) => routes.set(`DELETE:${p}`, h)
  };
  registerNotificationAndIngestionRoutes(mockApp, {
    Notification: strictReadOnlyModel,
    IngestionJob: strictReadOnlyModel,
    resolveAuthContext: () => ({ isAdmin: false }),
    syncAllVerifiedNotificationsFeed: async () => ({}),
    env: { INGESTION_SECRET_KEY: 'test-step2100-secret' }
  });
  let enqueueStatus = 200;
  let enqueueBody = null;
  await routes.get('POST:/api/notifications/ingest-job')(
    {
      headers: { 'x-ingestion-secret': 'test-step2100-secret' },
      query: { enqueueOnly: 'true', dryRun: 'true', sourceKey: 'tnpsc' },
      body: {}
    },
    {
      status(c) { enqueueStatus = c; return this; },
      json(b) { enqueueBody = b; return this; }
    }
  );
  assert.equal(enqueueStatus, 202);
  assert.equal(enqueueBody.dryRun, true);
  assert.equal(enqueueBody.persisted, false);
  assert.equal(dbWrites, 0);

  // 3) Expired cleanup safety invariant: disabled by default in Prod & protects pending/locked/future/same-day records
  const prodCleanupGate = isCleanupSchedulerAllowedInEnvironment({
    env: {
      RENDER: 'true',
      APP_ENV: 'production',
      RENDER_EXTERNAL_HOSTNAME: 'akesevai.onrender.com',
      MONGODB_URI: `mongodb+srv://u:p@cluster0.example.mongodb.net/${PRODUCTION_DB_NAME}`
    },
    activeDbName: PRODUCTION_DB_NAME
  });
  assert.equal(prodCleanupGate.allowed, false);
  assert.equal(prodCleanupGate.dryRun, true);
  assert.equal(prodCleanupGate.reason, 'PRODUCTION_SCHEDULER_DISABLED_BY_DEFAULT');

  assert.equal(
    shouldDeleteExpiredExamNotification(
      {
        ingestionStatus: 'pending_review',
        isVerified: true,
        sourceIntegrityVerified: true,
        openingDate: '01/01/2026',
        closingDate: '15/01/2026',
        examDate: '01/02/2026'
      },
      FIXED_TODAY
    ),
    false
  );
  assert.equal(
    shouldDeleteExpiredExamNotification(
      {
        ingestionStatus: 'published',
        manualOverrideLock: true,
        isVerified: true,
        sourceIntegrityVerified: true,
        openingDate: '01/01/2026',
        closingDate: '15/01/2026',
        examDate: '01/02/2026'
      },
      FIXED_TODAY
    ),
    false
  );
  assert.equal(
    shouldDeleteExpiredExamNotification(
      {
        ingestionStatus: 'published',
        isVerified: true,
        sourceIntegrityVerified: true,
        openingDate: '01/01/2026',
        closingDate: '15/01/2026',
        examDate: '01/02/2026',
        interviewDate: '20/12/2026'
      },
      FIXED_TODAY
    ),
    false
  );
  assert.equal(
    shouldDeleteExpiredExamNotification(
      {
        ingestionStatus: 'published',
        isVerified: true,
        sourceIntegrityVerified: true,
        openingDate: '01/01/2026',
        closingDate: '15/01/2026',
        examDate: '27/11/2026'
      },
      FIXED_TODAY
    ),
    false
  );
});

// ============================================================================
// 9. STEP 2.102 REMEDIATION TESTS: S101-1, S101-2, S101-3, S101-4
// ============================================================================
test('S101-1: legacyBackfillEvaluator rejects pending_review, quarantined, rejected, draft, unpublished, generic listing Apply URL, and PDF Apply URL', () => {
  const validLegacyPublished = {
    id: 's101-1-valid',
    category: 'tnpsc',
    sourceKey: 'tnpsc',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Combined Civil Services Examination IV 2026',
    notificationNo: '01/2026',
    officialNotificationNumber: '01/2026',
    openingDate: '01/11/2026',
    closingDate: '20/12/2026',
    examDate: '10/01/2027',
    detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026_Group4.pdf',
    officialPdfUrl: 'https://www.tnpsc.gov.in/Document/english/01_2026_Group4.pdf',
    applyLink: 'https://apply.tnpscexams.in/notification-2026/apply',
    status: 'active',
    ingestionStatus: 'published'
  };

  // Valid legacy published record (explicit 'published' or pre-PR #2 missing ingestionStatus) qualifies
  const okPublished = classifyLegacyNotificationForBackfill(validLegacyPublished, { today: FIXED_TODAY });
  assert.equal(okPublished.bucket, BACKFILL_BUCKETS.ELIGIBLE_FOR_EVIDENCE_BACKFILL);
  assert.equal(okPublished.proposedBackfillFields?.sourceIntegrityVerified, true);
  assert.equal(okPublished.proposedBackfillFields?.applicationDatesVerified, true);

  const legacyWithoutIngestionStatus = { ...validLegacyPublished, id: 's101-1-legacy-undef' };
  delete legacyWithoutIngestionStatus.ingestionStatus;
  const okLegacyUndef = classifyLegacyNotificationForBackfill(legacyWithoutIngestionStatus, { today: FIXED_TODAY });
  assert.equal(okLegacyUndef.bucket, BACKFILL_BUCKETS.ELIGIBLE_FOR_EVIDENCE_BACKFILL);

  // Blocked lifecycle & non-published statuses
  const blockedLifecycleCases = [
    ['pending_review', { ...validLegacyPublished, ingestionStatus: 'pending_review' }, /INGESTION_STATUS_NOT_PUBLISHED:pending_review/],
    ['quarantined', { ...validLegacyPublished, ingestionStatus: 'quarantined', quarantineReason: 'BAD_DOC' }, /QUARANTINED_RECORD/],
    ['rejected', { ...validLegacyPublished, ingestionStatus: 'rejected' }, /REJECTED_RECORD/],
    ['draft', { ...validLegacyPublished, status: 'draft' }, /STATUS_NOT_PUBLISHABLE:draft/],
    ['published_false', { ...validLegacyPublished, published: false }, /EXPLICIT_UNPUBLISHED_FLAG/],
    ['isPublished_false', { ...validLegacyPublished, isPublished: false }, /EXPLICIT_UNPUBLISHED_FLAG/]
  ];
  for (const [label, doc, expectedReasonRe] of blockedLifecycleCases) {
    const res = classifyLegacyNotificationForBackfill(doc, { today: FIXED_TODAY });
    assert.equal(
      res.bucket,
      BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION,
      `S101-1: ${label} must NOT qualify for ELIGIBLE_FOR_EVIDENCE_BACKFILL`
    );
    assert.equal(res.proposedBackfillFields, null, `S101-1: ${label} must have proposedBackfillFields=null`);
    assert.equal(res.evidencePassed, false);
    assert.match(res.missingEvidenceReasons.join(','), expectedReasonRe);
  }

  // Blocked generic listing Apply URLs & PDF Apply URL on non-result notices
  const blockedApplyCases = [
    ['generic_listing_tnpsc', 'https://www.tnpsc.gov.in/English/Notification.aspx', /APPLY_LINK:GENERIC_LISTING_PAGE/],
    ['pdf_as_apply_url', 'https://www.tnpsc.gov.in/Document/english/01_2026_Group4.pdf', /APPLY_LINK:PDF_URL_FORBIDDEN/],
    ['generic_root_apply_url', 'https://apply.tnpscexams.in/', /APPLY_LINK:GENERIC_ROOT_HOMEPAGE/]
  ];
  for (const [label, badApplyUrl, expectedReasonRe] of blockedApplyCases) {
    const res = classifyLegacyNotificationForBackfill(
      { ...validLegacyPublished, applyLink: badApplyUrl },
      { today: FIXED_TODAY }
    );
    assert.equal(res.bucket, BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION, `S101-1: ${label} must be blocked`);
    assert.equal(res.proposedBackfillFields, null);
    assert.match(res.missingEvidenceReasons.join(','), expectedReasonRe);
  }

  // Existing result-notice behavior preserved (official PDF + notice no, empty applyLink allowed)
  const validResultNotice = {
    id: 's101-1-result-notice',
    category: 'tnpsc',
    sourceKey: 'tnpsc',
    noticeType: 'result_key',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Group IV Written Examination Result 2026',
    notificationNo: '01/2026',
    officialNotificationNumber: '01/2026',
    detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026_Result.pdf',
    officialPdfUrl: 'https://www.tnpsc.gov.in/Document/english/01_2026_Result.pdf',
    applyLink: '',
    status: 'active',
    ingestionStatus: 'published'
  };
  const okResult = classifyLegacyNotificationForBackfill(validResultNotice, { today: FIXED_TODAY });
  assert.equal(okResult.bucket, BACKFILL_BUCKETS.ELIGIBLE_FOR_EVIDENCE_BACKFILL);
  assert.equal(okResult.proposedBackfillFields?.sourceIntegrityVerified, true);
  assert.equal(okResult.proposedBackfillFields?.applicationDatesVerified, false);
  assert.equal(okResult.proposedBackfillFields?.evidenceClassification, 'VERIFIED_OFFICIAL_RESULT');
});

test('S101-2: resolveSafeSscAttachmentUrl rejects %5c, encoded/double-encoded traversal, and malformed encoding while accepting official PDFs', () => {
  const maliciousInputs = [
    'notice_boards%5C..%5Csecret.pdf',
    'notice_boards%5cfile.pdf',
    'notice_boards%255C..%255Csecret.pdf',
    'notice_boards/%2e%2e/secret.pdf',
    'notice_boards/%252e%252e/secret.pdf',
    'notice_boards/%2e./secret.pdf',
    'notice_boards/.%2e/secret.pdf',
    'notice_boards/%ZZinvalid.pdf',
    'notice_boards/%E0%A4%A.pdf',
    'notice_boards/CGL%00.pdf'
  ];
  for (const bad of maliciousInputs) {
    assert.equal(
      resolveSafeSscAttachmentUrl(bad),
      '',
      `S101-2: Expected resolveSafeSscAttachmentUrl to reject ${JSON.stringify(bad)}`
    );
  }

  // Valid official SSC PDF attachments continue to pass cleanly
  assert.equal(
    resolveSafeSscAttachmentUrl('notice_boards/CGL_2026.pdf'),
    'https://ssc.gov.in/api/attachment/notice_boards/CGL_2026.pdf'
  );
  assert.equal(
    resolveSafeSscAttachmentUrl('notice_boards/CGL.2026.PDF'),
    'https://ssc.gov.in/api/attachment/notice_boards/CGL.2026.PDF'
  );
  assert.equal(
    resolveSafeSscAttachmentUrl('notice_boards/CGL%202026.pdf'),
    'https://ssc.gov.in/api/attachment/notice_boards/CGL%202026.pdf'
  );
  assert.equal(
    resolveSafeSscAttachmentUrl('https://cdnbbsr.s3waas.gov.in/s3abc/uploads/notice_2026.pdf'),
    'https://cdnbbsr.s3waas.gov.in/s3abc/uploads/notice_2026.pdf'
  );
});

test('S101-3: isCleanupSchedulerAllowedInEnvironment enforces verified Render Production identity and preserves staging/local/test policies', () => {
  const prodUri = `mongodb+srv://u:p@cluster0.example.mongodb.net/${PRODUCTION_DB_NAME}`;
  const stgUri = `mongodb+srv://u:p@cluster0.example.mongodb.net/${STAGING_DB_NAME}`;
  const devUri = `mongodb+srv://u:p@cluster0.example.mongodb.net/${DEVELOPMENT_DB_NAME}`;

  // 1) Local Production without Render identity MUST be rejected even with ENABLE_PROD_CLEANUP_SCHEDULER=true
  const localProd = isCleanupSchedulerAllowedInEnvironment({
    env: { APP_ENV: 'production', ENABLE_PROD_CLEANUP_SCHEDULER: 'true', MONGODB_URI: prodUri },
    activeDbName: PRODUCTION_DB_NAME
  });
  assert.equal(localProd.allowed, false);
  assert.equal(localProd.dryRun, true);
  assert.equal(localProd.reason, 'PRODUCTION_SCHEDULER_BLOCKED_UNVERIFIED_RENDER_IDENTITY');

  // 2) Render Production missing verified hostname MUST be rejected
  const renderProdNoHost = isCleanupSchedulerAllowedInEnvironment({
    env: { RENDER: 'true', APP_ENV: 'production', RENDER_SERVICE_NAME: 'akesevai', ENABLE_PROD_CLEANUP_SCHEDULER: 'true', MONGODB_URI: prodUri },
    activeDbName: PRODUCTION_DB_NAME
  });
  assert.equal(renderProdNoHost.allowed, false);
  assert.equal(renderProdNoHost.reason, 'PRODUCTION_SCHEDULER_BLOCKED_UNVERIFIED_RENDER_IDENTITY');

  // 3) Verified Render Production: disabled by default; allowed in dry-run when explicitly enabled on akesevai; blocked on wrong DB
  const verifiedProdEnv = {
    RENDER: 'true',
    APP_ENV: 'production',
    RENDER_EXTERNAL_HOSTNAME: 'akesevai.onrender.com',
    MONGODB_URI: prodUri
  };
  const verifiedProdDefault = isCleanupSchedulerAllowedInEnvironment({ env: verifiedProdEnv, activeDbName: PRODUCTION_DB_NAME });
  assert.equal(verifiedProdDefault.allowed, false);
  assert.equal(verifiedProdDefault.reason, 'PRODUCTION_SCHEDULER_DISABLED_BY_DEFAULT');

  const verifiedProdEnabled = isCleanupSchedulerAllowedInEnvironment({
    env: { ...verifiedProdEnv, ENABLE_PROD_CLEANUP_SCHEDULER: 'true' },
    activeDbName: PRODUCTION_DB_NAME
  });
  assert.equal(verifiedProdEnabled.allowed, true);
  assert.equal(verifiedProdEnabled.dryRun, true);
  assert.equal(verifiedProdEnabled.reason, 'PRODUCTION_SCHEDULER_EXPLICITLY_ENABLED');

  const verifiedProdWrongDb = isCleanupSchedulerAllowedInEnvironment({
    env: { ...verifiedProdEnv, ENABLE_PROD_CLEANUP_SCHEDULER: 'true' },
    activeDbName: STAGING_DB_NAME
  });
  assert.equal(verifiedProdWrongDb.allowed, false);
  assert.match(verifiedProdWrongDb.reason, /PRODUCTION_SCHEDULER_BLOCKED_DB_MISMATCH/);

  // 4) Staging cleanup rejected on production DB or unverified Render staging identity; permitted on verified staging DB
  const stagingWrongDb = isCleanupSchedulerAllowedInEnvironment({
    env: {
      RENDER: 'true',
      APP_ENV: 'staging',
      RENDER_EXTERNAL_HOSTNAME: 'akesevai-staging-api-jqp2.onrender.com',
      MONGODB_URI: stgUri
    },
    activeDbName: PRODUCTION_DB_NAME
  });
  assert.equal(stagingWrongDb.allowed, false);
  assert.match(stagingWrongDb.reason, /SCHEDULER_BLOCKED_STAGING_DB_MISMATCH/);

  const stagingOk = isCleanupSchedulerAllowedInEnvironment({
    env: {
      RENDER: 'true',
      APP_ENV: 'staging',
      RENDER_EXTERNAL_HOSTNAME: 'akesevai-staging-api-jqp2.onrender.com',
      MONGODB_URI: stgUri
    },
    activeDbName: STAGING_DB_NAME
  });
  assert.equal(stagingOk.allowed, true);
  assert.equal(stagingOk.dryRun, true);

  // 5) Local development & test safety behavior preserved
  const devBlockedProd = isCleanupSchedulerAllowedInEnvironment({ env: { MONGODB_URI: devUri }, activeDbName: PRODUCTION_DB_NAME });
  assert.equal(devBlockedProd.allowed, false);
  const devAllowed = isCleanupSchedulerAllowedInEnvironment({ env: { MONGODB_URI: devUri }, activeDbName: DEVELOPMENT_DB_NAME });
  assert.equal(devAllowed.allowed, true);
  const testAllowed = isCleanupSchedulerAllowedInEnvironment({ env: { NODE_ENV: 'test' }, activeDbName: 'akesevai_test' });
  assert.equal(testAllowed.allowed, true);
  assert.equal(testAllowed.dryRun, true);
});

test('S101-4: scheduled_exam_ingestion.yml BASE_URL guard normalizes trailing slashes/case and rejects prod-targeting or malformed URLs', () => {
  const workflowPath = path.join(REPO_ROOT, '.github', 'workflows', 'scheduled_exam_ingestion.yml');
  const yaml = fs.readFileSync(workflowPath, 'utf8');

  // Extract the exact live node -e script from Step 0 of scheduled_exam_ingestion.yml
  const scriptMatch = yaml.match(/NORMALIZED_BASE_URL=\$\([^)]*node -e '([\s\S]*?)'\)/);
  assert.ok(scriptMatch && scriptMatch[1], 'Expected live Step 0 BASE_URL normalization node -e script in workflow');
  const liveNodeScript = scriptMatch[1];

  const runLiveGuard = ({ baseUrl, workflowRef }) =>
    spawnSync(process.execPath, ['-e', liveNodeScript], {
      env: {
        ...process.env,
        BASE_URL: baseUrl,
        PRODUCTION_BASE_URL: 'https://akesevai.onrender.com',
        WORKFLOW_REF: workflowRef
      },
      encoding: 'utf8'
    });

  // 1) Trailing slashes & uppercase staging hostname normalize cleanly
  const normStg = runLiveGuard({
    baseUrl: 'https://AKESEVAI-STAGING-API-JQP2.ONRENDER.COM///',
    workflowRef: 'refs/heads/release/ingestion-v1'
  });
  assert.equal(normStg.status, 0);
  assert.equal(normStg.stdout, 'https://akesevai-staging-api-jqp2.onrender.com');

  // 2) Production on refs/heads/main normalizes cleanly
  const normProd = runLiveGuard({
    baseUrl: 'https://akesevai.onrender.com/',
    workflowRef: 'refs/heads/main'
  });
  assert.equal(normProd.status, 0);
  assert.equal(normProd.stdout, 'https://akesevai.onrender.com');

  // 3) Staging targeting production (trailing slash, uppercase, trailing dot, subpath) MUST fail closed
  const blockedProdTargets = [
    'https://akesevai.onrender.com',
    'https://akesevai.onrender.com/',
    'https://akesevai.onrender.com///',
    'HTTPS://AKESEVAI.ONRENDER.COM',
    'https://akesevai.onrender.com./',
    'https://akesevai.onrender.com/custom-prefix'
  ];
  for (const target of blockedProdTargets) {
    const res = runLiveGuard({ baseUrl: target, workflowRef: 'refs/heads/release/ingestion-v1' });
    assert.notEqual(res.status, 0, `S101-4: Non-main ref must reject production-targeting URL ${target}`);
    assert.match(res.stderr, /STAGING_TARGETS_PRODUCTION/);
  }

  // 4) Malformed, empty, non-HTTPS, credentialed, or query/hash BASE_URLs MUST fail closed
  const malformedUrls = [
    '',
    '   ',
    'not-a-valid-url',
    'http://akesevai-staging-api-jqp2.onrender.com',
    'javascript:alert(1)',
    'https://user:pass@akesevai-staging-api-jqp2.onrender.com',
    'https://akesevai-staging-api-jqp2.onrender.com?foo=bar',
    'https://akesevai-staging-api-jqp2.onrender.com#frag'
  ];
  for (const badUrl of malformedUrls) {
    const res = runLiveGuard({ baseUrl: badUrl, workflowRef: 'refs/heads/release/ingestion-v1' });
    assert.notEqual(res.status, 0, `S101-4: Expected malformed BASE_URL to fail closed: ${JSON.stringify(badUrl)}`);
  }

  // Confirm H-2 secret separation lines remain intact
  assert.match(
    yaml,
    /PROD_INGESTION_SECRET:\s*\$\{\{\s*github\.ref == 'refs\/heads\/main' && \(secrets\.INGESTION_SECRET_KEY \|\| secrets\.INGESTION_SECRET\) \|\| ''\s*\}\}/
  );
  assert.match(
    yaml,
    /STAGING_INGESTION_SECRET:\s*\$\{\{\s*github\.ref != 'refs\/heads\/main' && secrets\.STAGING_INGESTION_SECRET_KEY \|\| ''\s*\}\}/
  );
});
