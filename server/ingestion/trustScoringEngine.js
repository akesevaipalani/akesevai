// server/ingestion/trustScoringEngine.js
// Official-Source Trust Scoring, Notice-Type Date Validation & Fail-Closed Publication Gate
// Mandatory Safe Defaults: AUTO_PUBLISH_ENABLED=false, AUTO_PUBLISH_RESULTS=false

import {
  getKolkataToday,
  parseDateDetailed
} from '../../src/utils/notificationDateHelper.js';
import {
  getRegisteredSourceConfig,
  validateExplicitSourceUrl
} from './officialDomainPolicy.js';

const STRUCTURED_PARSERS = new Set(['rest_api_json', 'html_table', 'views_rows']);

const BOILERPLATE_PATTERNS = [
  /^home$/i,
  /^privacy policy$/i,
  /^disclaimer$/i,
  /^terms (and|&) conditions$/i,
  /^terms of use$/i,
  /^contact us$/i,
  /^about us$/i,
  /^sitemap$/i,
  /^click here$/i,
  /^read more$/i,
  /^view all$/i,
  /^download$/i,
  /^archive[s]?$/i,
  /^old notifications?$/i,
  /\btender\b/i,
  /\bquotation\b/i,
  /\be-?tender\b/i,
  /\bexpression of interest\b/i,
  /\bdebarment\b/i,
  /\bauction notice\b/i
];

const CAPTCHA_OR_HTML_INJECTION_PATTERNS = [
  /<script\b/i,
  /<iframe\b/i,
  /\bonerror\s*=/i,
  /\bonload\s*=/i,
  /javascript:/i,
  /authentication\.aspx/i,
  /enter the characters shown in the image/i
];

export function isAutoPublishEnabled(options = {}) {
  const val = options.env?.AUTO_PUBLISH_ENABLED ?? process.env.AUTO_PUBLISH_ENABLED;
  return String(val || '').trim().toLowerCase() === 'true';
}

export function isAutoPublishResultsEnabled(options = {}) {
  const val = options.env?.AUTO_PUBLISH_RESULTS ?? process.env.AUTO_PUBLISH_RESULTS;
  return String(val || '').trim().toLowerCase() === 'true';
}

/**
 * Classifies extracted candidate into a notification type for type-aware validation.
 * @returns {'recruitment'|'admission'|'examination'|'schedule_admit'|'result_key'|'corrigendum'|'unknown'}
 */
export function inferNoticeType(candidate = {}, sourceConfig = null) {
  const title = `${candidate.service || ''} ${candidate.postName || ''}`.toLowerCase();
  const cat = String(candidate.category || sourceConfig?.category || '').toLowerCase();

  if (/\b(corrigendum|addendum|last date extended|date extended|extension of last date|deadline extended|revised notice|revised schedule)\b/i.test(title)) {
    return 'corrigendum';
  }

  if (/\b(final result|written result|result of|merit list|cut[- ]?off|answer key|provisional key|score ?card|marks obtained|provisionally selected|candidature cancelled)\b/i.test(title)) {
    return 'result_key';
  }

  // Only treat as schedule_admit when specifically announcing admit card / timetable / interview dates
  // rather than a full application notification
  const isScheduleKeywords = /\b(admit card|hall ticket|call letter|e-?admit|interview schedule|time ?table|exam schedule|physical efficiency test schedule|calendar of examinations)\b/i.test(title);
  const isNewApplyKeywords = /\b(apply online|applications invited|online application|recruitment notification|common recruitment)\b/i.test(title);
  if (isScheduleKeywords && !isNewApplyKeywords) {
    return 'schedule_admit';
  }

  if (cat === 'entrance' || /\b(admission|counselling|counseling|seat allotment|cuet|neet|jee|tnea|tancet|ceeta|gate)\b/i.test(title)) {
    return 'admission';
  }

  if (sourceConfig?.key === 'ctet_cbse' || /\b(eligibility test|ctet|tntet|tet paper|ugc net|csir net|entrance exam)\b/i.test(title)) {
    return 'examination';
  }

  if (
    ['upsc', 'ssc', 'banking', 'railway', 'tnpsc', 'police_defence', 'teaching', 'medical', 'psu'].includes(cat) &&
    /\b(recruit|vacancy|vacancies|engagement|probationary|clerk|officer|constable|inspector|assistant|apprentice|post|cgl|chsl|mts|cen|crp|group|combined|civil service|scientist|engineer|surgeon|nurse|agniveer|vayu|ssc|course|entry)\b/i.test(title)
  ) {
    return 'recruitment';
  }

  return 'unknown';
}

/**
 * Validates dates strictly using Asia/Kolkata calendar math and official pub-date evidence rules.
 * Never defaults missing publication dates to runtime Date.now().
 */
export function validateNoticeDates(candidate = {}, noticeType = 'unknown', options = {}) {
  const nowInstant = options.now instanceof Date ? options.now : new Date();
  const today = options.today || getKolkataToday(nowInstant);
  const issues = [];
  const quarantineReasons = [];
  const reviewReasons = [];

  const pubDetailed = parseDateDetailed(candidate.sourcePublishedAt || candidate.notificationDate || '');
  const openDetailed = parseDateDetailed(candidate.openingDate || candidate.applicationStartDate || '');
  const closeDetailed = parseDateDetailed(candidate.closingDate || candidate.applicationEndDate || '');
  const examDetailed = parseDateDetailed(candidate.examDate || '');

  // Check for strictly invalid calendar dates (e.g. 30-02-2026) on any field
  if (pubDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_PUBLICATION_CALENDAR_DATE');
  if (openDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_OPENING_CALENDAR_DATE');
  if (closeDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_CLOSING_CALENDAR_DATE');
  if (examDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_EXAM_CALENDAR_DATE');

  // Strict Future Publication Guard (MUST reject future timestamps/dates)
  let explicitPubValid = false;
  let explicitPubDaysAge = null;
  if (pubDetailed.valid && pubDetailed.components) {
    const pubEpoch = pubDetailed.components.epochDays;
    const isFutureDay = pubEpoch > today.epochDays;
    const isFutureInstant = pubDetailed.instantMs !== null && pubDetailed.instantMs > nowInstant.getTime();
    if (isFutureDay || isFutureInstant) {
      const daysAhead = pubEpoch - today.epochDays;
      issues.push('FUTURE_PUBLICATION_DATE');
      if (daysAhead > 7) {
        quarantineReasons.push('ANOMALOUS_FUTURE_PUBLICATION_DATE');
      } else {
        reviewReasons.push('FUTURE_PUBLICATION_TIMESTAMP');
      }
    } else {
      explicitPubValid = true;
      explicitPubDaysAge = today.epochDays - pubEpoch;
    }
  }

  // Chronological cross-field integrity checks
  if (openDetailed.valid && closeDetailed.valid) {
    if (closeDetailed.components.epochDays < openDetailed.components.epochDays) {
      quarantineReasons.push('DATE_CONFLICT_CLOSING_BEFORE_OPENING');
    }
  }
  if (openDetailed.valid && examDetailed.valid) {
    if (examDetailed.components.epochDays < openDetailed.components.epochDays) {
      quarantineReasons.push('DATE_CONFLICT_EXAM_BEFORE_OPENING');
    }
  }

  // Genuine publication evidence: explicit valid non-future sourcePublishedAt
  // OR valid non-future openingDate (never runtime Date.now() and never CDN HTTP Date header!)
  const openingIsNonFuture = openDetailed.valid && openDetailed.components.epochDays <= today.epochDays;
  const hasGenuinePubEvidence = explicitPubValid || openingIsNonFuture;

  if (!hasGenuinePubEvidence) {
    reviewReasons.push('MISSING_GENUINE_PUBLICATION_EVIDENCE');
  }

  const closeIsFutureOrToday = closeDetailed.valid && closeDetailed.components.epochDays >= today.epochDays;
  const closeDaysPast = closeDetailed.valid && !closeIsFutureOrToday ? (today.epochDays - closeDetailed.components.epochDays) : 0;
  const examIsFutureOrRecent = examDetailed.valid && examDetailed.components.epochDays >= (today.epochDays - 1);
  const examDaysPast = examDetailed.valid && !examIsFutureOrRecent ? (today.epochDays - examDetailed.components.epochDays) : 0;

  // Type-specific validation
  let typeDatePass = false;

  switch (noticeType) {
    case 'recruitment':
    case 'admission': {
      if (!closeDetailed.valid) {
        reviewReasons.push(noticeType === 'admission' ? 'MISSING_ADMISSION_DEADLINE' : 'MISSING_CLOSING_DATE');
      } else if (!closeIsFutureOrToday) {
        reviewReasons.push(closeDaysPast > 7 ? 'EXPIRED_APPLICATION_DEADLINE' : 'RECENTLY_CLOSED_DEADLINE');
      } else if (hasGenuinePubEvidence) {
        typeDatePass = true;
      }
      break;
    }

    case 'examination': {
      // Path A: valid future/today closingDate + genuine pub evidence
      if (closeIsFutureOrToday && hasGenuinePubEvidence) {
        typeDatePass = true;
      } else if (examDetailed.valid && examDetailed.components.epochDays >= today.epochDays) {
        // Path B: valid future examDate + explicit sourcePublishedAt (<= 60 days)
        if (explicitPubValid && explicitPubDaysAge !== null && explicitPubDaysAge <= 60) {
          typeDatePass = true;
        } else {
          reviewReasons.push('EXAMINATION_MISSING_EXPLICIT_RECENT_PUB_DATE');
        }
      } else {
        reviewReasons.push('EXAMINATION_MISSING_VALID_CLOSING_OR_EXAM_DATE');
      }
      break;
    }

    case 'schedule_admit': {
      // Closing date is NOT mandatory for schedules / admit cards / timetables
      if (!explicitPubValid && !openingIsNonFuture) {
        reviewReasons.push('SCHEDULE_MISSING_PUBLICATION_EVIDENCE');
      } else if (explicitPubValid && explicitPubDaysAge > 30) {
        reviewReasons.push('SCHEDULE_PUBLICATION_TOO_OLD');
      } else if (examDetailed.valid) {
        if (examIsFutureOrRecent) {
          typeDatePass = true;
        } else if (examDaysPast > 7) {
          reviewReasons.push('PAST_EXAM_SCHEDULE_DATE');
        } else {
          typeDatePass = true;
        }
      } else if (explicitPubValid && explicitPubDaysAge <= 30) {
        // Valid published calendar/schedule notice even when exact single examDate isn't tabular
        typeDatePass = true;
      } else {
        reviewReasons.push('SCHEDULE_MISSING_EXAM_OR_RECENT_PUB_DATE');
      }
      break;
    }

    case 'result_key': {
      if (!explicitPubValid) {
        reviewReasons.push('RESULT_MISSING_EXPLICIT_PUBLICATION_DATE');
      } else if (explicitPubDaysAge > 14) {
        reviewReasons.push('RESULT_PUBLICATION_OLDER_THAN_14_DAYS');
      } else {
        typeDatePass = true;
      }
      break;
    }

    case 'corrigendum': {
      // Evaluated by corrigendumHelper when matched to parent; standalone corrigenda go to review
      reviewReasons.push('CORRIGENDUM_REQUIRES_PARENT_RECONCILIATION');
      break;
    }

    default: {
      reviewReasons.push('UNKNOWN_NOTICE_TYPE');
      break;
    }
  }

  return {
    passed: quarantineReasons.length === 0 && reviewReasons.length === 0 && typeDatePass,
    hasDateConflict: quarantineReasons.length > 0,
    quarantineReasons,
    reviewReasons,
    hasGenuinePubEvidence,
    closeIsFutureOrToday,
    examIsFutureOrRecent,
    parsed: {
      pub: pubDetailed.components,
      open: openDetailed.components,
      close: closeDetailed.components,
      exam: examDetailed.components
    },
    diagnostics: issues
  };
}

/**
 * Evaluates candidate title/content hygiene and detects XSS, CAPTCHA or non-recruitment noise.
 */
export function evaluateContentHygiene(candidate = {}) {
  const title = String(candidate.service || '').replace(/\s+/g, ' ').trim();
  const combined = `${title} ${candidate.postName || ''} ${candidate.importantDetails || ''}`;
  const quarantineReasons = [];
  const reviewReasons = [];

  for (const pat of CAPTCHA_OR_HTML_INJECTION_PATTERNS) {
    if (pat.test(combined)) {
      quarantineReasons.push('SUSPICIOUS_OR_CAPTCHA_CONTENT');
      break;
    }
  }

  if (title.length < 8) {
    quarantineReasons.push('TITLE_TOO_SHORT_NOISE');
  } else if (title.length < 12) {
    reviewReasons.push('TITLE_BORDERLINE_SHORT');
  } else if (title.length > 260) {
    reviewReasons.push('TITLE_OVERSIZED');
  }

  if (BOILERPLATE_PATTERNS.some((pat) => pat.test(title))) {
    quarantineReasons.push('BOILERPLATE_OR_NON_RECRUITMENT_NOISE');
  }

  return {
    clean: quarantineReasons.length === 0 && reviewReasons.length === 0,
    quarantineReasons,
    reviewReasons
  };
}

/**
 * Evaluates Trust Score (0-100) AND all non-compensatory Auto-Publish hard gates.
 *
 * Score Weights (Max = 100):
 * - Official source authenticity: 35 (15 source config + 20 explicit domain match)
 * - Title / content hygiene:    25 (15 structured parser or 8 heuristic + 10 clean title)
 * - Metadata completeness:      25 (10 specific notice link + 5 notice ID + 10 full/4 partial valid dates)
 * - Freshness / actionability:  15 (15 active deadline/future schedule or 8 recent pub)
 *
 * IMPORTANT: A score >= 85 NEVER authorizes auto-publishing by itself.
 * ALL mandatory gates + AUTO_PUBLISH_ENABLED=true must hold simultaneously.
 *
 * @param {Object} candidate
 * @param {Object} [context]
 * @returns {Object} Evaluation decision and breakdown
 */
export function evaluateCandidateTrust(candidate = {}, context = {}) {
  const sourceKey = candidate.sourceKey || context.sourceKey || '';
  const sourceConfig = context.sourceConfig || getRegisteredSourceConfig(sourceKey);
  const docVerification = context.docVerification || { docState: 'unavailable', reason: 'DOC_VERIFICATION_NOT_RUN' };
  const allowHttpForLocalMock = Boolean(context.allowHttpForLocalMock);

  const quarantineReasons = [];
  const reviewReasons = [];
  const unmetGates = [];

  // 1. Source & Explicit Domain Authenticity (Max 35)
  let sourceAuthPoints = 0;
  const sourceRegistered = Boolean(sourceConfig && sourceConfig.enabled && !sourceConfig.requiresCaptcha);
  if (sourceConfig?.requiresCaptcha) {
    quarantineReasons.push('CAPTCHA_PROTECTED_SOURCE');
  }
  if (sourceRegistered) {
    sourceAuthPoints += 15;
  } else {
    unmetGates.push('SOURCE_NOT_VERIFIED');
  }

  const noticeUrlCheck = validateExplicitSourceUrl(candidate.detailsLink, sourceKey, 'notice', { allowHttpForLocalMock });
  const applyUrlCheck = candidate.applyLink
    ? validateExplicitSourceUrl(candidate.applyLink, sourceKey, 'apply', { allowHttpForLocalMock })
    : { valid: true };

  if (!noticeUrlCheck.valid) {
    if (noticeUrlCheck.severity === 'quarantine') {
      quarantineReasons.push(`NOTICE_URL_${noticeUrlCheck.reason}`);
    } else {
      reviewReasons.push(`NOTICE_URL_${noticeUrlCheck.reason}`);
    }
    unmetGates.push('EXPLICIT_NOTICE_HOST_FAILED');
  }

  if (!applyUrlCheck.valid) {
    if (applyUrlCheck.reviewOnlyVendor) {
      reviewReasons.push(applyUrlCheck.reason);
      unmetGates.push('THIRD_PARTY_APPLY_HOST_REQUIRES_REVIEW');
    } else if (applyUrlCheck.severity === 'quarantine') {
      quarantineReasons.push(`APPLY_URL_${applyUrlCheck.reason}`);
      unmetGates.push('EXPLICIT_APPLY_HOST_FAILED');
    } else {
      reviewReasons.push(`APPLY_URL_${applyUrlCheck.reason}`);
      unmetGates.push('EXPLICIT_APPLY_HOST_FAILED');
    }
  }

  if (noticeUrlCheck.valid && applyUrlCheck.valid) {
    sourceAuthPoints += 20;
  }

  // 2. Title & Content Hygiene (Max 25)
  const contentEval = evaluateContentHygiene(candidate);
  quarantineReasons.push(...contentEval.quarantineReasons);
  reviewReasons.push(...contentEval.reviewReasons);

  let hygienePoints = 0;
  const parserType = sourceConfig?.parserType || '';
  if (STRUCTURED_PARSERS.has(parserType)) {
    hygienePoints += 15;
  } else if (parserType) {
    hygienePoints += 8;
  }
  if (contentEval.clean) {
    hygienePoints += 10;
  } else {
    unmetGates.push('CONTENT_HYGIENE_FAILED');
  }

  // 3. Notice Type & Date Consistency (Feeds Metadata + Freshness)
  const noticeType = context.noticeType || inferNoticeType(candidate, sourceConfig);
  const dateEval = validateNoticeDates(candidate, noticeType, {
    today: context.today,
    now: context.now
  });
  quarantineReasons.push(...dateEval.quarantineReasons);
  reviewReasons.push(...dateEval.reviewReasons);

  // 4. Document Verification State Separation Check
  const docState = docVerification.docState || 'unavailable';
  const docVerifiedForAutoPublish = docState === 'structurally_verified' || docState === 'html_notice_verified';
  if (docState === 'malformed') {
    quarantineReasons.push(`DOCUMENT_MALFORMED:${docVerification.reason || 'INVALID'}`);
    unmetGates.push('DOCUMENT_MALFORMED');
  } else if (!docVerifiedForAutoPublish) {
    // 'signature_checked' (partial 206 or cap-truncated 200) and 'unavailable' MUST block auto-publish -> Admin Review
    reviewReasons.push(`DOC_${docState.toUpperCase()}:${docVerification.reason || 'INCOMPLETE'}`);
    unmetGates.push(`DOCUMENT_NOT_COMPLETELY_VERIFIED:${docState}`);
  }

  // 5. Metadata Completeness (Max 25)
  let metadataPoints = 0;
  const cleanDetails = String(candidate.detailsLink || '').split('#')[0].split('?')[0].replace(/\/+$/, '').toLowerCase();
  const cleanSource = String(sourceConfig?.url || '').split('#')[0].split('?')[0].replace(/\/+$/, '').toLowerCase();
  const cleanHome = String(sourceConfig?.homepage || '').split('#')[0].split('?')[0].replace(/\/+$/, '').toLowerCase();
  const hasSpecificNoticeUrl = Boolean(
    cleanDetails &&
    cleanDetails !== cleanHome &&
    (cleanDetails !== cleanSource || String(candidate.detailsLink || '').includes('?') || Boolean(candidate.notificationNo))
  );

  if (hasSpecificNoticeUrl) {
    metadataPoints += 10;
  } else {
    reviewReasons.push('GENERIC_PORTAL_ROOT_LINK');
    unmetGates.push('SPECIFIC_NOTICE_LINK_REQUIRED');
  }

  if (candidate.notificationNo && String(candidate.notificationNo).trim().length >= 2) {
    metadataPoints += 5;
  }

  if (dateEval.passed) {
    metadataPoints += 10;
  } else if (dateEval.hasGenuinePubEvidence || dateEval.parsed.close) {
    metadataPoints += 4;
  }

  // 6. Freshness & Actionability (Max 15)
  let freshnessPoints = 0;
  if (dateEval.passed && (dateEval.closeIsFutureOrToday || dateEval.examIsFutureOrRecent)) {
    freshnessPoints += 15;
  } else if (dateEval.passed && dateEval.hasGenuinePubEvidence) {
    freshnessPoints += 12;
  } else if (dateEval.hasGenuinePubEvidence) {
    freshnessPoints += 6;
  }

  const trustScore = Math.max(0, Math.min(100, sourceAuthPoints + hygienePoints + metadataPoints + freshnessPoints));

  // Gate Evaluation
  if (!dateEval.passed || noticeType === 'unknown') {
    unmetGates.push('NOTICE_TYPE_AND_DATE_VALIDATION_FAILED');
  }
  if (noticeType === 'result_key' && !isAutoPublishResultsEnabled(context)) {
    reviewReasons.push('RESULT_KEY_AUTO_PUBLISH_DISABLED');
    unmetGates.push('AUTO_PUBLISH_RESULTS_DISABLED');
  }
  if (candidate.manualOverrideLock || context.existingManualOverrideLock) {
    reviewReasons.push('MANUAL_OVERRIDE_LOCK_ACTIVE');
    unmetGates.push('MANUAL_OVERRIDE_LOCK');
  }

  const autoPublishFlagActive = isAutoPublishEnabled(context);
  if (!autoPublishFlagActive) {
    unmetGates.push('AUTO_PUBLISH_DISABLED_BY_DEFAULT');
  }

  const uniqueQuarantine = [...new Set(quarantineReasons)];
  const uniqueReview = [...new Set(reviewReasons)];
  const uniqueUnmet = [...new Set(unmetGates)];

  let ingestionStatus = 'pending_review';
  let trustTier = trustScore >= 85 ? 'high' : (trustScore >= 50 ? 'medium' : 'low');
  let isVerified = false;
  let autoPublished = false;
  let quarantineReason = '';

  const eligibleForGate =
    uniqueQuarantine.length === 0 &&
    trustScore >= 85 &&
    sourceRegistered &&
    noticeUrlCheck.valid &&
    applyUrlCheck.valid &&
    docVerifiedForAutoPublish &&
    contentEval.clean &&
    dateEval.passed &&
    noticeType !== 'unknown' &&
    noticeType !== 'corrigendum' &&
    !(noticeType === 'result_key' && !isAutoPublishResultsEnabled(context)) &&
    !(candidate.manualOverrideLock || context.existingManualOverrideLock);

  if (uniqueQuarantine.length > 0 || trustScore < 50) {
    ingestionStatus = 'quarantined';
    trustTier = 'low';
    quarantineReason = uniqueQuarantine[0] || `LOW_TRUST_SCORE:${trustScore}`;
  } else if (eligibleForGate && autoPublishFlagActive) {
    ingestionStatus = 'published';
    isVerified = true;
    autoPublished = true;
  } else {
    ingestionStatus = 'pending_review';
  }

  return {
    trustScore,
    trustTier,
    noticeType,
    ingestionStatus,
    isVerified,
    autoPublished,
    wouldAutoPublishIfEnabled: eligibleForGate,
    quarantineReason,
    docVerificationStatus: docState,
    docVerificationReason: docVerification.reason || '',
    unmetGates: uniqueUnmet,
    reviewReasons: uniqueReview,
    quarantineReasons: uniqueQuarantine,
    breakdown: {
      sourceAuthenticity: sourceAuthPoints,
      contentHygiene: hygienePoints,
      metadataCompleteness: metadataPoints,
      freshnessActionability: freshnessPoints
    }
  };
}

