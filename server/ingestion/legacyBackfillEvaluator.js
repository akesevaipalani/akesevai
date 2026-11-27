// server/ingestion/legacyBackfillEvaluator.js
// Strictly Read-Only Legacy Notification & Master Seed Backfill Dry-Run Evaluator
// ZERO database imports, ZERO write capability, ZERO blanket mass verification.

import {
  evaluateNotificationVerificationFlags,
  isGenericListingOrDirectoryUrl
} from './trustScoringEngine.js';
import {
  enrichNotificationWithDateStatus,
  getKolkataToday,
  isGenericRootHomepage
} from '../../src/utils/notificationDateHelper.js';

export const BACKFILL_BUCKETS = Object.freeze({
  ALREADY_VERIFIED: 'ALREADY_VERIFIED',
  ELIGIBLE_FOR_EVIDENCE_BACKFILL: 'ELIGIBLE_FOR_EVIDENCE_BACKFILL',
  ARCHIVED_OR_EXPIRED_CYCLE: 'ARCHIVED_OR_EXPIRED_CYCLE',
  NEEDS_ADMIN_EVIDENCE_REMEDIATION: 'NEEDS_ADMIN_EVIDENCE_REMEDIATION'
});

function isPdfApplyUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return /\.pdf$/i.test(parsed.pathname || '');
  } catch {
    return /\.pdf(?:$|\?|#)/i.test(trimmed);
  }
}

/**
 * Classifies a single legacy or seed notification document strictly read-only.
 * Never mutates input; never promotes unverified, unpublished/pending_review/draft,
 * generic-URL, PDF-applyLink, third-party, quarantined, rejected, missing-date, or historical records.
 *
 * @param {Object} doc
 * @param {Object} [options={}]
 * @returns {Object} Structured classification & dry-run recommendation
 */
export function classifyLegacyNotificationForBackfill(doc, options = {}) {
  const todayObj = options.today || getKolkataToday(options.now instanceof Date ? options.now : new Date());
  const enriched = enrichNotificationWithDateStatus(doc, todayObj, { lang: 'en' });

  const statusVal = String(doc?.status || '').trim().toLowerCase();
  const rawIngestionStatus = String(doc?.ingestionStatus ?? '').trim().toLowerCase();
  const evidenceClass = String(doc?.evidenceClassification || '').trim();
  const isArchivedOrExpired = Boolean(
    doc?.isLegacy === true ||
    doc?.isExpired === true ||
    doc?.isHistoricalCycle === true ||
    statusVal === 'closed' ||
    statusVal === 'expired' ||
    statusVal === 'archived' ||
    evidenceClass === 'OLD_RECRUITMENT_CYCLE' ||
    evidenceClass === 'HISTORICAL_CYCLE' ||
    enriched?.appStatus?.isExpired === true ||
    enriched?.appStatus?.status === 'CLOSED'
  );

  // Strict fresh evidence evaluation (never trusts client/legacy isVerified without concrete official proof)
  const allowVerifiedDocState = options.allowVerifiedDocState !== false;
  const evidenceEval = evaluateNotificationVerificationFlags(doc, {
    allowPromotionEvaluation: true,
    allowVerifiedDocState,
    today: todayObj
  });

  // Strict lifecycle & non-result Apply URL guards (S101-1):
  // Only legacy published records may qualify; never promote pending_review, quarantined, rejected, draft, or unpublished records.
  const extraReasons = [];
  if (rawIngestionStatus && rawIngestionStatus !== 'published') {
    extraReasons.push(`INGESTION_STATUS_NOT_PUBLISHED:${rawIngestionStatus}`);
  }
  if (statusVal === 'draft' || statusVal === 'rejected' || statusVal === 'quarantined') {
    extraReasons.push(`STATUS_NOT_PUBLISHABLE:${statusVal}`);
  }
  if (doc?.published === false || doc?.isPublished === false) {
    extraReasons.push('EXPLICIT_UNPUBLISHED_FLAG');
  }
  if (doc?.isQuarantined === true || doc?.quarantined === true || String(doc?.quarantineReason || '').trim()) {
    extraReasons.push('QUARANTINED_RECORD');
  }

  // Non-result notices MUST carry a genuine non-generic, non-PDF official Apply URL
  if (!evidenceEval.isResultNotice) {
    const applyLinkRaw = String(doc?.applyLink || '').trim();
    if (applyLinkRaw) {
      if (isPdfApplyUrl(applyLinkRaw)) {
        extraReasons.push('APPLY_LINK:PDF_URL_FORBIDDEN');
      } else if (isGenericRootHomepage(applyLinkRaw)) {
        extraReasons.push('APPLY_LINK:GENERIC_ROOT_HOMEPAGE');
      } else if (isGenericListingOrDirectoryUrl(applyLinkRaw)) {
        extraReasons.push('APPLY_LINK:GENERIC_LISTING_PAGE');
      }
    }
  }

  const allMissingReasons = [...new Set([...evidenceEval.reasons, ...extraReasons])];
  const qualifiesWithStrictEvidence = Boolean(
    allMissingReasons.length === 0 &&
    evidenceEval.isVerified === true &&
    evidenceEval.sourceIntegrityVerified === true &&
    (evidenceEval.isResultNotice || evidenceEval.applicationDatesVerified === true)
  );

  const hasLegacyMissingFlags =
    doc?.sourceIntegrityVerified === undefined ||
    doc?.applicationDatesVerified === undefined;

  let bucket = BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION;
  let recommendedAction = 'BLOCK_CTA_UNTIL_ADMIN_SUPPLIES_EVIDENCE';
  let proposedBackfillFields = null;

  if (isArchivedOrExpired) {
    bucket = BACKFILL_BUCKETS.ARCHIVED_OR_EXPIRED_CYCLE;
    recommendedAction = 'KEEP_ARCHIVED_NO_CTA';
  } else if (
    qualifiesWithStrictEvidence &&
    doc?.sourceIntegrityVerified === true &&
    (evidenceEval.isResultNotice || doc?.applicationDatesVerified === true)
  ) {
    bucket = BACKFILL_BUCKETS.ALREADY_VERIFIED;
    recommendedAction = 'NO_CHANGE';
  } else if (qualifiesWithStrictEvidence) {
    bucket = BACKFILL_BUCKETS.ELIGIBLE_FOR_EVIDENCE_BACKFILL;
    recommendedAction = 'ELIGIBLE_FOR_ADMIN_REVIEWED_BACKFILL';
    proposedBackfillFields = {
      isVerified: true,
      sourceIntegrityVerified: true,
      applicationDatesVerified: evidenceEval.isResultNotice ? false : true,
      hasSourceIntegrityIssue: false,
      needsOfficialSource: false,
      evidenceClassification: evidenceEval.isResultNotice
        ? 'VERIFIED_OFFICIAL_RESULT'
        : 'VERIFIED_OFFICIAL_NOTICE'
    };
  }

  return {
    id: doc?.id || '',
    category: doc?.category || '',
    organization: doc?.organization || '',
    service: doc?.service || '',
    bucket,
    recommendedAction,
    hasLegacyMissingFlags,
    currentApplyCtaState: enriched?.applyCtaState || 'UNAVAILABLE',
    currentCanShowApplyCta: Boolean(enriched?.canShowApplyCta),
    isNotificationActive: Boolean(enriched?.isNotificationActive),
    appStatus: enriched?.appStatus?.status || 'UNKNOWN',
    evidencePassed: qualifiesWithStrictEvidence,
    hasOfficialEvidence: evidenceEval.hasOfficialEvidence,
    hasValidApplicationDates: evidenceEval.hasValidApplicationDates,
    missingEvidenceReasons: allMissingReasons,
    proposedBackfillFields
  };
}

/**
 * Generates a read-only dry-run migration summary across a collection snapshot of notifications.
 * Guaranteed 0 database reads/writes — operates strictly on an in-memory array.
 *
 * @param {Array<Object>} docs
 * @param {Object} [options={}]
 */
export function buildLegacyBackfillDryRunReport(docs = [], options = {}) {
  const list = Array.isArray(docs) ? docs : [];
  const todayObj = options.today || getKolkataToday(options.now instanceof Date ? options.now : new Date());
  const records = list.map((doc) => classifyLegacyNotificationForBackfill(doc, { ...options, today: todayObj }));

  const counts = {
    total: records.length,
    [BACKFILL_BUCKETS.ALREADY_VERIFIED]: 0,
    [BACKFILL_BUCKETS.ELIGIBLE_FOR_EVIDENCE_BACKFILL]: 0,
    [BACKFILL_BUCKETS.ARCHIVED_OR_EXPIRED_CYCLE]: 0,
    [BACKFILL_BUCKETS.NEEDS_ADMIN_EVIDENCE_REMEDIATION]: 0
  };

  for (const r of records) {
    counts[r.bucket] = (counts[r.bucket] || 0) + 1;
  }

  return {
    dryRun: true,
    persisted: false,
    evaluatedAtIst: todayObj.isoDate,
    counts,
    records
  };
}
