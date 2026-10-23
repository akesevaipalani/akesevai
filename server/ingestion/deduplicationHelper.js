// server/ingestion/deduplicationHelper.js
import crypto from 'crypto';

/**
 * Normalizes text for robust deduplication (removes extra spaces, punctuation, lowercase)
 */
export function normalizeText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates a deterministic SHA-256 fingerprint for a notification candidate
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
 * Checks whether candidate is a duplicate of any existing notification in the database
 * @param {Object} candidate - Ingested notification candidate
 * @param {Array<Object>} existingList - Existing notifications from MongoDB
 * @returns {{ isDuplicate: boolean, matchedExistingId: string | null, reason: string }}
 */
export function isDuplicateNotification(candidate, existingList = []) {
  if (!candidate || !existingList || existingList.length === 0) {
    return { isDuplicate: false, matchedExistingId: null, reason: 'NEW_RECORD' };
  }

  const candidateId = candidate.id;
  const candidateFingerprint = candidate.fingerprint || generateNotificationFingerprint(candidate);
  const candidateNormService = normalizeText(candidate.service);
  const candidateNotifNo = candidate.notificationNo ? candidate.notificationNo.trim().toLowerCase() : '';
  const candidateLink = candidate.detailsLink ? candidate.detailsLink.trim().toLowerCase() : '';

  for (const existing of existingList) {
    // 1. Exact ID Match
    if (existing.id && existing.id === candidateId) {
      return { isDuplicate: true, matchedExistingId: existing.id, reason: 'EXACT_ID_MATCH' };
    }

    // 2. Exact Fingerprint Match
    const existingFingerprint = existing.fingerprint || generateNotificationFingerprint(existing);
    if (existingFingerprint === candidateFingerprint) {
      return { isDuplicate: true, matchedExistingId: existing.id, reason: 'FINGERPRINT_MATCH' };
    }

    // 3. Official Notification Number match within same organization
    if (
      candidateNotifNo &&
      existing.notificationNo &&
      candidateNotifNo.length > 2 &&
      existing.notificationNo.trim().toLowerCase() === candidateNotifNo &&
      normalizeText(existing.organization) === normalizeText(candidate.organization)
    ) {
      return { isDuplicate: true, matchedExistingId: existing.id, reason: 'NOTIFICATION_NUMBER_MATCH' };
    }

    // 4. Exact PDF / detailsLink match (if not generic homepage)
    if (
      candidateLink &&
      candidateLink.endsWith('.pdf') &&
      existing.detailsLink &&
      existing.detailsLink.trim().toLowerCase() === candidateLink
    ) {
      return { isDuplicate: true, matchedExistingId: existing.id, reason: 'DIRECT_PDF_LINK_MATCH' };
    }

    // 5. Very high title similarity within same organization
    if (
      candidateNormService &&
      candidateNormService.length > 15 &&
      normalizeText(existing.service) === candidateNormService &&
      normalizeText(existing.organization) === normalizeText(candidate.organization)
    ) {
      return { isDuplicate: true, matchedExistingId: existing.id, reason: 'TITLE_AND_ORG_MATCH' };
    }
  }

  return { isDuplicate: false, matchedExistingId: null, reason: 'UNIQUE_RECORD' };
}
