// server/ingestion/deduplicationHelper.js
import crypto from 'crypto';
import {
  normalizeCleanText,
  stripCorrigendumMarkers,
  buildIdentityFingerprint,
  computeContentHash
} from './corrigendumHelper.js';

export { buildIdentityFingerprint, computeContentHash };

/**
 * Normalizes text for robust deduplication (removes extra spaces, punctuation, lowercase)
 */
export function normalizeText(str) {
  return normalizeCleanText(str);
}

/**
 * Generates a deterministic SHA-256 fingerprint for a notification candidate
 * (Preserved for deterministic ID generation and backwards compatibility)
 */
export function generateNotificationFingerprint(item) {
  const normCategory = normalizeText(item.category || 'other');
  const normOrg = normalizeText(item.organization || '');
  const normService = normalizeText(item.service || '');
  const normNotifNo = normalizeText(item.notificationNo || '');
  const normClosing = normalizeText(item.closingDate || '');
  const normLink = (item.detailsLink || '').split('#')[0].split('?')[0].trim().toLowerCase();

  const payload = `${normCategory}|${normOrg}|${normService}|${normNotifNo}|${normClosing}|${normLink}`;
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Builds a deterministic, unique ID for the notification candidate
 */
export function buildDeterministicId(sourceKey, item) {
  const hash = generateNotificationFingerprint(item);
  const prefix = sourceKey ? `notif-${sourceKey}` : 'notif-ingest';
  return `${prefix}-${hash.slice(0, 16)}`;
}

/**
 * Checks whether candidate matches an existing notification (published, pending, quarantined, or rejected)
 * and distinguishes exact duplicates, rejection memory hits, and corrigendum/update matches.
 *
 * @param {Object} candidate - Ingested notification candidate
 * @param {Array<Object>} existingList - Existing notifications from MongoDB
 * @returns {{ isDuplicate: boolean, isCorrigendumCandidate?: boolean, isRejectedHit?: boolean, matchedExistingId: string | null, matchedExisting: Object | null, ambiguousCount?: number, reason: string }}
 */
export function isDuplicateNotification(candidate, existingList = []) {
  if (!candidate || !existingList || existingList.length === 0) {
    return {
      isDuplicate: false,
      isCorrigendumCandidate: false,
      isRejectedHit: false,
      matchedExistingId: null,
      matchedExisting: null,
      ambiguousCount: 0,
      reason: 'NEW_RECORD'
    };
  }

  const candidateId = candidate.id;
  const candidateFingerprint = candidate.fingerprint || generateNotificationFingerprint(candidate);
  const candidateIdentity = candidate.identityFingerprint || buildIdentityFingerprint(candidate);
  const candidateContentHash = candidate.contentHash || computeContentHash(candidate);
  const candidateNormService = normalizeText(candidate.service);
  const candidateBaseService = normalizeText(stripCorrigendumMarkers(candidate.service));
  const candidateNotifNo = candidate.notificationNo ? candidate.notificationNo.trim().toLowerCase() : '';
  const candidateLink = candidate.detailsLink ? candidate.detailsLink.split('#')[0].split('?')[0].trim().toLowerCase() : '';

  const matchedParents = [];

  for (const existing of existingList) {
    let matchReason = null;

    // 1. Exact ID Match
    if (existing.id && existing.id === candidateId) {
      matchReason = 'EXACT_ID_MATCH';
    }

    // 2. Exact Legacy Fingerprint Match
    if (!matchReason) {
      const existingFingerprint = existing.fingerprint || generateNotificationFingerprint(existing);
      if (existingFingerprint === candidateFingerprint) {
        matchReason = 'FINGERPRINT_MATCH';
      }
    }

    // 3. Identity Fingerprint Match
    if (!matchReason && existing.identityFingerprint && existing.identityFingerprint === candidateIdentity) {
      matchReason = 'IDENTITY_FINGERPRINT_MATCH';
    }

    // 4. Official Notification Number match within same organization
    if (
      !matchReason &&
      candidateNotifNo &&
      existing.notificationNo &&
      candidateNotifNo.length > 2 &&
      existing.notificationNo.trim().toLowerCase() === candidateNotifNo &&
      normalizeText(existing.organization) === normalizeText(candidate.organization)
    ) {
      matchReason = 'NOTIFICATION_NUMBER_MATCH';
    }

    // 5. Exact PDF link match
    if (
      !matchReason &&
      candidateLink &&
      candidateLink.endsWith('.pdf') &&
      existing.detailsLink &&
      existing.detailsLink.split('#')[0].split('?')[0].trim().toLowerCase() === candidateLink
    ) {
      matchReason = 'DIRECT_PDF_LINK_MATCH';
    }

    // 6. Exact or Corrigendum-stripped title similarity within same organization
    if (!matchReason && candidateNormService && candidateNormService.length > 15 && normalizeText(existing.organization) === normalizeText(candidate.organization)) {
      if (normalizeText(existing.service) === candidateNormService) {
        matchReason = 'TITLE_AND_ORG_MATCH';
      } else if (
        candidateBaseService.length > 15 &&
        normalizeText(stripCorrigendumMarkers(existing.service)) === candidateBaseService &&
        candidateBaseService !== candidateNormService
      ) {
        matchReason = 'CORRIGENDUM_BASE_TITLE_MATCH';
      }
    }

    if (matchReason) {
      matchedParents.push({ existing, matchReason });
    }
  }

  if (matchedParents.length === 0) {
    return {
      isDuplicate: false,
      isCorrigendumCandidate: false,
      isRejectedHit: false,
      matchedExistingId: null,
      matchedExisting: null,
      ambiguousCount: 0,
      reason: 'UNIQUE_RECORD'
    };
  }

  // Prefer exact ID / rejected / published match deterministically
  const primary = matchedParents.find((m) => m.matchReason === 'EXACT_ID_MATCH')
    || matchedParents.find((m) => m.existing.ingestionStatus === 'rejected')
    || matchedParents[0];

  const { existing, matchReason } = primary;
  const existingContentHash = existing.contentHash || computeContentHash(existing);

  // Check rejection memory FIRST
  if (existing.ingestionStatus === 'rejected') {
    const rejectedHash = existing.rejectedContentHash || existingContentHash;
    if (rejectedHash === candidateContentHash || matchReason === 'EXACT_ID_MATCH' || matchReason === 'FINGERPRINT_MATCH') {
      return {
        isDuplicate: true,
        isCorrigendumCandidate: false,
        isRejectedHit: true,
        matchedExistingId: existing.id,
        matchedExisting: existing,
        ambiguousCount: matchedParents.length,
        reason: 'REJECTED_MEMORY_SKIP'
      };
    }
  }

  // Exact match (identical content hash or exact legacy duplicate without field changes)
  if (existingContentHash === candidateContentHash || matchReason === 'EXACT_ID_MATCH' || matchReason === 'FINGERPRINT_MATCH') {
    return {
      isDuplicate: true,
      isCorrigendumCandidate: false,
      isRejectedHit: false,
      matchedExistingId: existing.id,
      matchedExisting: existing,
      ambiguousCount: matchedParents.length,
      reason: matchReason
    };
  }

  // Matched same parent notification via notificationNo / PDF / base title,
  // AND contentHash changed -> classify as corrigendum/update reconciliation candidate
  return {
    isDuplicate: true,
    isCorrigendumCandidate: true,
    isRejectedHit: false,
    matchedExistingId: existing.id,
    matchedExisting: existing,
    ambiguousCount: matchedParents.length,
    reason: matchReason
  };
}
