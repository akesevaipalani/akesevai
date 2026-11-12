// server/ingestion/corrigendumHelper.js
// Identity vs Content Hashing, Safe Corrigendum / Deadline-Extension Detection & Revision History

import crypto from 'crypto';
import {
  getKolkataToday,
  parseDateDetailed
} from '../../src/utils/notificationDateHelper.js';
import { validateExplicitSourceUrl } from './officialDomainPolicy.js';

export function normalizeCleanText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Strips corrigendum / addendum / date-extension wrappers from titles so an
 * updated announcement links back deterministically to its parent exam notice.
 */
export function stripCorrigendumMarkers(title) {
  if (!title) return '';
  return String(title)
    .replace(/\b(corrigendum|addendum|extension notice|last date extended|date extended|revised notice|updated notice|notice regarding extension)\b\s*[:\-–—]?\s*/gi, ' ')
    .replace(/\(\s*(corrigendum|addendum|date extended|extended|revised|updated)\s*\)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Builds an immutable identity fingerprint (explicitly excludes mutable deadlines & querystrings).
 */
export function buildIdentityFingerprint(item = {}) {
  const normSourceKey = normalizeCleanText(item.sourceKey || '');
  const normCategory = normalizeCleanText(item.category || 'other');
  const normOrg = normalizeCleanText(item.organization || '');
  const normNotifNo = normalizeCleanText(item.notificationNo || '');
  const normBaseService = normalizeCleanText(stripCorrigendumMarkers(item.service || ''));
  const normBaseLink = String(item.detailsLink || '').split('#')[0].split('?')[0].trim().toLowerCase();

  // When an official notificationNo is available within the org/category, key identity cleanly
  // around (category|org|notifNo) or canonical link/title fallback.
  const payload = normNotifNo && normNotifNo.length > 2
    ? `${normSourceKey}|${normCategory}|${normOrg}|NO:${normNotifNo}`
    : `${normSourceKey}|${normCategory}|${normOrg}|SVC:${normBaseService}|LNK:${normBaseLink}`;

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Computes full content hash over all mutable notification fields so any change
 * (closingDate extension, examDate reschedule, link or vacancy update) is detected.
 */
export function computeContentHash(item = {}) {
  const canonical = {
    service: normalizeCleanText(item.service || ''),
    postName: normalizeCleanText(item.postName || ''),
    notificationNo: normalizeCleanText(item.notificationNo || ''),
    openingDate: normalizeCleanText(item.openingDate || ''),
    closingDate: normalizeCleanText(item.closingDate || ''),
    examDate: normalizeCleanText(item.examDate || ''),
    posts: normalizeCleanText(item.posts || ''),
    detailsLink: String(item.detailsLink || '').split('#')[0].trim().toLowerCase(),
    applyLink: String(item.applyLink || '').split('#')[0].trim().toLowerCase(),
    sourcePublishedAt: normalizeCleanText(item.sourcePublishedAt || '')
  };
  return crypto.createHash('sha256').update(JSON.stringify(canonical)).digest('hex');
}

const SNAPSHOT_FIELDS = [
  'service',
  'postName',
  'notificationNo',
  'openingDate',
  'closingDate',
  'examDate',
  'posts',
  'detailsLink',
  'applyLink',
  'sourcePublishedAt',
  'contentHash'
];

export function extractSnapshotValues(doc = {}) {
  const snap = {};
  for (const field of SNAPSHOT_FIELDS) {
    snap[field] = doc[field] ?? '';
  }
  return snap;
}

function isPlaceholderValue(field, val) {
  const str = String(val || '').trim();
  if (!str) return true;
  if (field === 'examDate' && str.toLowerCase() === 'announced soon') return true;
  return false;
}

/**
 * Safely merges non-empty candidate fields onto existing doc without ever overwriting
 * populated dates/metadata with blanks or "Announced Soon".
 */
export function buildNonDestructiveMerge(existing = {}, candidate = {}) {
  const merged = {};
  const changedFields = [];
  const previousValues = extractSnapshotValues(existing);

  const trackFields = ['service', 'postName', 'notificationNo', 'openingDate', 'closingDate', 'examDate', 'posts', 'detailsLink', 'applyLink', 'sourcePublishedAt'];

  for (const field of trackFields) {
    const newVal = String(candidate[field] ?? '').trim();
    const oldVal = String(existing[field] ?? '').trim();

    if (isPlaceholderValue(field, newVal)) {
      // Never erase valid existing field with empty or placeholder
      continue;
    }

    if (normalizeCleanText(newVal) !== normalizeCleanText(oldVal) && newVal !== oldVal) {
      merged[field] = newVal;
      changedFields.push(field);
    }
  }

  return { merged, changedFields, previousValues };
}

/**
 * Evaluates a candidate against a matched parent record when contentHash differs.
 * Enforces manualOverrideLock protection, official document verification,
 * non-shortening closingDate rule, and complete revision history preservation.
 */
export function evaluateCorrigendumUpdate(params = {}) {
  const {
    existing,
    candidate,
    ambiguousMatchCount = 1,
    docVerification = { docState: 'unavailable', reason: 'NOT_RUN' },
    runId = '',
    fencingToken = 0,
    jobId = '',
    now = new Date(),
    today = getKolkataToday(now),
    env = process.env,
    allowHttpForLocalMock = false
  } = params;

  const autoPublishEnabled = String(env?.AUTO_PUBLISH_ENABLED || '').trim().toLowerCase() === 'true';
  const candidateContentHash = computeContentHash(candidate);
  const existingContentHash = existing.contentHash || computeContentHash(existing);

  if (candidateContentHash === existingContentHash) {
    return { decision: 'exact_duplicate', reason: 'CONTENT_HASH_MATCH' };
  }

  // Same-job crash recovery safeguard: do not misclassify partial retry as corrigendum
  if (existing.originJobId && jobId && existing.originJobId === jobId) {
    return { decision: 'exact_duplicate', reason: 'SAME_JOB_IDEMPOTENT_RETRY' };
  }

  if (ambiguousMatchCount > 1) {
    return { decision: 'pending_corrigendum_review', reason: 'AMBIGUOUS_PARENT_MATCH' };
  }

  const { merged, changedFields, previousValues } = buildNonDestructiveMerge(existing, candidate);
  if (changedFields.length === 0) {
    return { decision: 'exact_duplicate', reason: 'NO_MATERIAL_FIELD_CHANGES' };
  }

  // Check if a populated closingDate/openingDate would be cleared (blocker)
  const existingClose = parseDateDetailed(existing.closingDate);
  const candClose = parseDateDetailed(candidate.closingDate);
  const candOpen = parseDateDetailed(candidate.openingDate || existing.openingDate);
  const candExam = parseDateDetailed(candidate.examDate || existing.examDate);
  const candPub = parseDateDetailed(candidate.sourcePublishedAt || '');

  // Reject invalid calendar dates immediately
  if (
    candClose.kind === 'invalid_calendar' ||
    candOpen.kind === 'invalid_calendar' ||
    candExam.kind === 'invalid_calendar' ||
    candPub.kind === 'invalid_calendar'
  ) {
    return { decision: 'quarantined_corrigendum', reason: 'CORRIGENDUM_INVALID_CALENDAR_DATE', changedFields, previousValues };
  }

  // Chronological conflicts
  if (candOpen.valid && candClose.valid && candClose.components.epochDays < candOpen.components.epochDays) {
    return { decision: 'quarantined_corrigendum', reason: 'CORRIGENDUM_CLOSING_BEFORE_OPENING', changedFields, previousValues };
  }
  if (candOpen.valid && candExam.valid && candExam.components.epochDays < candOpen.components.epochDays) {
    return { decision: 'quarantined_corrigendum', reason: 'CORRIGENDUM_EXAM_BEFORE_OPENING', changedFields, previousValues };
  }

  // Future publication timestamp
  if (candPub.valid && (candPub.components.epochDays > today.epochDays || (candPub.instantMs !== null && candPub.instantMs > now.getTime()))) {
    return { decision: 'pending_corrigendum_review', reason: 'CORRIGENDUM_FUTURE_PUBLICATION_DATE', changedFields, previousValues, proposedFields: merged };
  }

  // Manual Admin protection — NEVER overwrite Admin edits
  if (existing.manualOverrideLock) {
    return { decision: 'pending_corrigendum_review', reason: 'MANUAL_OVERRIDE_LOCKED', changedFields, previousValues, proposedFields: merged };
  }

  // Prevent empty/placeholder replacement when candidate dropped closingDate while changing title
  if (existingClose.valid && !candClose.valid && candidate.closingDate !== undefined && String(candidate.closingDate).trim() === '') {
    // Still merged is non-destructive, but missing closingDate in updated notice warrants review
    return { decision: 'pending_corrigendum_review', reason: 'CANDIDATE_MISSING_PREVIOUS_CLOSING_DATE', changedFields, previousValues, proposedFields: merged };
  }

  // Never silently shorten an existing closing date
  let isDateExtended = false;
  if (existingClose.valid && candClose.valid) {
    if (candClose.components.epochDays < existingClose.components.epochDays) {
      return {
        decision: 'pending_corrigendum_review',
        reason: 'CLOSING_DATE_SHORTENED_REQUIRES_REVIEW',
        changedFields,
        previousValues,
        proposedFields: merged
      };
    }
    if (candClose.components.epochDays > existingClose.components.epochDays) {
      isDateExtended = true;
    }
  } else if (!existingClose.valid && candClose.valid && candClose.components.epochDays >= today.epochDays) {
    isDateExtended = true;
  }

  // Official host + document verification required for automatic update
  const sourceKey = candidate.sourceKey || existing.sourceKey || '';
  const urlCheck = validateExplicitSourceUrl(candidate.detailsLink || existing.detailsLink, sourceKey, 'notice', { allowHttpForLocalMock });
  if (!urlCheck.valid) {
    return {
      decision: urlCheck.severity === 'quarantine' ? 'quarantined_corrigendum' : 'pending_corrigendum_review',
      reason: `CORRIGENDUM_URL_${urlCheck.reason}`,
      changedFields,
      previousValues
    };
  }

  const docState = docVerification?.docState || 'unavailable';
  const docVerified = docState === 'structurally_verified' || docState === 'html_notice_verified';
  if (!docVerified) {
    return {
      decision: docState === 'malformed' ? 'quarantined_corrigendum' : 'pending_corrigendum_review',
      reason: `CORRIGENDUM_DOC_${docState.toUpperCase()}`,
      changedFields,
      previousValues,
      proposedFields: merged
    };
  }

  const nextSnapshot = extractSnapshotValues({ ...existing, ...merged, contentHash: candidateContentHash });
  const changeType = isDateExtended
    ? 'deadline_extended'
    : (changedFields.includes('examDate') ? 'exam_rescheduled' : 'corrigendum_update');

  const summaryParts = [];
  if (merged.closingDate && existing.closingDate) {
    summaryParts.push(`Closing date extended: ${existing.closingDate} -> ${merged.closingDate}`);
  } else if (merged.closingDate) {
    summaryParts.push(`Closing date updated: ${merged.closingDate}`);
  }
  if (merged.examDate && existing.examDate) {
    summaryParts.push(`Exam date updated: ${existing.examDate} -> ${merged.examDate}`);
  }
  if (summaryParts.length === 0) {
    summaryParts.push(`Corrigendum updated fields: ${changedFields.join(', ')}`);
  }
  const corrigendumSummary = summaryParts.join(' | ');

  const nextRevisionNo = (existing.revisionCount || 0) + 1;
  const revisionEntry = {
    revisionNo: nextRevisionNo,
    revisedAt: now,
    changeType,
    triggerSource: `scraper_${sourceKey}`,
    runId,
    fencingToken,
    verifiedDocUrl: candidate.detailsLink || existing.detailsLink,
    summary: corrigendumSummary,
    changedFields,
    previousValues,
    newValues: nextSnapshot,
    actor: 'automated_ingestion'
  };

  if (!autoPublishEnabled) {
    return {
      decision: 'pending_corrigendum_review',
      reason: 'AUTO_PUBLISH_DISABLED_PROPOSAL',
      changedFields,
      previousValues,
      proposedFields: merged,
      revisionEntry,
      corrigendumSummary
    };
  }

  return {
    decision: 'apply_corrigendum_update',
    changeType,
    isDateExtended,
    corrigendumSummary,
    changedFields,
    mergedFields: {
      ...merged,
      contentHash: candidateContentHash,
      hasCorrigendum: true,
      corrigendumSummary,
      corrigendumDetectedAt: now,
      lastScrapedAt: now,
      updatedAt: now
    },
    revisionEntry,
    expectedRevisionCount: existing.revisionCount || 0
  };
}
