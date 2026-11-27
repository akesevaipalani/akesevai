// server/ingestion/trustScoringEngine.js
// Official-Source Trust Scoring, Notice-Type Date Validation & Fail-Closed Publication Gate
// Mandatory Safe Defaults: AUTO_PUBLISH_ENABLED=false, AUTO_PUBLISH_RESULTS=false

import net from 'net';
import {
  getKolkataToday,
  parseDateDetailed,
  isGenericRootHomepage,
  calculateApplicationStatus,
  calculateExamStatus,
  evaluateNotificationDateConsistency
} from '../../src/utils/notificationDateHelper.js';
import {
  EXPLICIT_SOURCE_DOMAIN_MAP,
  getRegisteredSourceConfig,
  isShortenerHost,
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

  // Check for strictly invalid calendar dates (e.g. 30-02-2026) on any field, including scraper-rejected invalid dates
  if (pubDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_PUBLICATION_CALENDAR_DATE');
  if (openDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_OPENING_CALENDAR_DATE');
  if (closeDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_CLOSING_CALENDAR_DATE');
  if (examDetailed.kind === 'invalid_calendar') quarantineReasons.push('INVALID_EXAM_CALENDAR_DATE');

  const rejectedDateFields = Array.isArray(candidate.invalidDateFields) ? candidate.invalidDateFields : [];
  if (rejectedDateFields.includes('sourcePublishedAt') || rejectedDateFields.includes('notificationDate')) {
    quarantineReasons.push('INVALID_PUBLICATION_CALENDAR_DATE');
  }
  if (rejectedDateFields.includes('openingDate')) {
    quarantineReasons.push('INVALID_OPENING_CALENDAR_DATE');
  }
  if (rejectedDateFields.includes('closingDate')) {
    quarantineReasons.push('INVALID_CLOSING_CALENDAR_DATE');
  }
  if (rejectedDateFields.includes('examDate')) {
    quarantineReasons.push('INVALID_EXAM_CALENDAR_DATE');
  }
  if (rejectedDateFields.includes('closingDate_before_openingDate')) {
    quarantineReasons.push('DATE_CONFLICT_CLOSING_BEFORE_OPENING');
  }
  if (rejectedDateFields.includes('examDate_before_openingDate')) {
    quarantineReasons.push('DATE_CONFLICT_EXAM_BEFORE_OPENING');
  }

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

  const noticeType = context.noticeType || inferNoticeType(candidate, sourceConfig);
  const noticeUrlCheck = validateExplicitSourceUrl(candidate.detailsLink, sourceKey, 'notice', { allowHttpForLocalMock });
  const hasApplyLink = Boolean(candidate.applyLink && String(candidate.applyLink).trim());
  const applyUrlCheck = hasApplyLink
    ? validateExplicitSourceUrl(candidate.applyLink, sourceKey, 'apply', { allowHttpForLocalMock })
    : { valid: true };
  const isApplyGeneric = hasApplyLink && (
    isGenericRootHomepage(candidate.applyLink) ||
    isGenericListingOrDirectoryUrl(candidate.applyLink)
  );
  let applyLinkSpecific = true;

  if (!noticeUrlCheck.valid) {
    if (noticeUrlCheck.severity === 'quarantine') {
      quarantineReasons.push(`NOTICE_URL_${noticeUrlCheck.reason}`);
    } else {
      reviewReasons.push(`NOTICE_URL_${noticeUrlCheck.reason}`);
    }
    unmetGates.push('EXPLICIT_NOTICE_HOST_FAILED');
  }

  if (!applyUrlCheck.valid) {
    applyLinkSpecific = false;
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
  } else if (isApplyGeneric) {
    applyLinkSpecific = false;
    reviewReasons.push('GENERIC_APPLY_HOMEPAGE');
    unmetGates.push('SPECIFIC_APPLY_LINK_REQUIRED');
  } else if (!hasApplyLink && noticeType !== 'result_key') {
    applyLinkSpecific = false;
    reviewReasons.push('MISSING_GENUINE_APPLY_URL');
    unmetGates.push('GENUINE_APPLY_LINK_REQUIRED');
  }

  if (noticeUrlCheck.valid && applyUrlCheck.valid) {
    sourceAuthPoints += 20;
  } else if (noticeUrlCheck.valid && applyUrlCheck.reviewOnlyVendor) {
    sourceAuthPoints += 15; // Legitimate official source using sanctioned third-party application vendor
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
    applyLinkSpecific &&
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

  const verificationEval = evaluateNotificationVerificationFlags(
    {
      ...candidate,
      sourceKey: context.sourceKey || candidate.sourceKey || '',
      ingestionStatus,
      quarantineReason,
      docVerificationStatus: docState,
      isVerified,
      sourceIntegrityVerified: autoPublished ? true : undefined,
      applicationDatesVerified: autoPublished ? true : undefined
    },
    {
      ...context,
      allowPromotionEvaluation: autoPublished === true
    }
  );

  return {
    trustScore,
    trustTier,
    noticeType,
    ingestionStatus,
    isVerified,
    autoPublished,
    sourceIntegrityVerified: Boolean(autoPublished && verificationEval.sourceIntegrityVerified),
    applicationDatesVerified: Boolean(autoPublished && verificationEval.applicationDatesVerified),
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

const REGISTERED_OFFICIAL_HOSTS = new Set(
  Object.values(EXPLICIT_SOURCE_DOMAIN_MAP || {})
    .flatMap((policy) => [
      ...(policy?.allowedNoticeHosts || []),
      ...(policy?.allowedApplyHosts || [])
    ])
    .map((h) => String(h || '').trim().toLowerCase())
    .filter(Boolean)
);

// Explicit institutional allowlist for verified exam agencies & universities outside .gov.in/.nic.in
const EXPLICIT_INSTITUTIONAL_ALLOWLIST = new Set([
  // AIIMS
  'aiimsexams.ac.in',
  'www.aiimsexams.ac.in',
  'aiims.edu',
  'www.aiims.edu',
  // NTA
  'nta.ac.in',
  'www.nta.ac.in',
  'exams.nta.ac.in',
  'cuetug.ntaonline.in',
  // IIT / IISc / GATE / JAM
  'iitr.ac.in',
  'www.iitr.ac.in',
  'gate2026.iitr.ac.in',
  'goaps.iitr.ac.in',
  'iitm.ac.in',
  'www.iitm.ac.in',
  'gate.iitm.ac.in',
  'iitb.ac.in',
  'www.iitb.ac.in',
  'iitd.ac.in',
  'www.iitd.ac.in',
  'iitk.ac.in',
  'www.iitk.ac.in',
  'gate.iitk.ac.in',
  'iitkgp.ac.in',
  'www.iitkgp.ac.in',
  'iitg.ac.in',
  'www.iitg.ac.in',
  'gate.iitg.ac.in',
  'iisc.ac.in',
  'www.iisc.ac.in',
  // Tamil Nadu & State Universities
  'annauniv.edu',
  'www.annauniv.edu',
  'tancet.annauniv.edu',
  'unom.ac.in',
  'www.unom.ac.in',
  'bdu.ac.in',
  'www.bdu.ac.in',
  'b-u.ac.in',
  'www.b-u.ac.in',
  'mkuniversity.ac.in',
  'www.mkuniversity.ac.in',
  // Major Central PSUs & Municipal Corporations
  'iocl.com',
  'www.iocl.com',
  'ongcindia.com',
  'www.ongcindia.com',
  'ongcrecruit.in',
  'www.ongcrecruit.in',
  'maduraicorporation.co.in',
  'www.maduraicorporation.co.in'
]);

// Explicitly authorized cross-host agency notice -> apply portal pairs outside EXPLICIT_SOURCE_DOMAIN_MAP
const EXPLICIT_INSTITUTIONAL_CROSS_HOST_GROUPS = [
  {
    noticeHosts: new Set(['nta.ac.in', 'www.nta.ac.in', 'exams.nta.ac.in', 'jeemain.nta.nic.in', 'neet.nta.nic.in']),
    applyHosts: new Set(['nta.ac.in', 'www.nta.ac.in', 'exams.nta.ac.in', 'cuetug.ntaonline.in', 'jeemain.nta.nic.in', 'neet.nta.nic.in', 'examinationservices.nic.in'])
  },
  {
    noticeHosts: new Set(['ongcindia.com', 'www.ongcindia.com']),
    applyHosts: new Set(['ongcindia.com', 'www.ongcindia.com', 'ongcrecruit.in', 'www.ongcrecruit.in'])
  }
];

const TWO_LETTER_STATE_GOV_CODES = new Set([
  'tn', 'ka', 'kl', 'ap', 'ts', 'mh', 'up', 'mp', 'rj', 'gj', 'wb', 'br', 'or', 'od', 'dl', 'pb', 'hr', 'jh', 'cg', 'uk', 'hp', 'jk', 'as', 'ga', 'tr', 'mn', 'ml', 'mz', 'nl', 'ar', 'sk', 'py', 'ch', 'an', 'ld', 'dn', 'dd'
]);

const MULTI_PART_PUBLIC_SUFFIXES = new Set([
  'gov.in', 'nic.in', 'ac.in', 'edu.in', 'res.in', 'org.in', 'co.in', 'bank.in'
]);

function extractAgencyDomainRoot(rawHost) {
  const host = String(rawHost || '').toLowerCase().replace(/^www\./, '').replace(/\.+$/, '');
  const parts = host.split('.').filter(Boolean);
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join('.');
  if (MULTI_PART_PUBLIC_SUFFIXES.has(lastTwo)) {
    if ((lastTwo === 'gov.in' || lastTwo === 'nic.in') && parts.length >= 4 && TWO_LETTER_STATE_GOV_CODES.has(parts[parts.length - 3])) {
      return parts.slice(-4).join('.');
    }
    return parts.slice(-3).join('.');
  }
  return lastTwo;
}

export function isAuthorizedAgencyHostPair(noticeHostRaw, applyHostRaw, sourceKey = '') {
  const noticeHost = String(noticeHostRaw || '').trim().toLowerCase().replace(/\.+$/, '');
  const applyHost = String(applyHostRaw || '').trim().toLowerCase().replace(/\.+$/, '');
  if (!noticeHost) return false;
  if (!applyHost) return true;

  // When sourceKey is provided, explicit source policy already enforces both hosts against the same sourceKey
  if (sourceKey) {
    const policy = EXPLICIT_SOURCE_DOMAIN_MAP?.[sourceKey];
    if (policy) {
      const noticeSet = new Set((policy.allowedNoticeHosts || []).map((h) => h.toLowerCase()));
      const applySet = new Set((policy.allowedApplyHosts || policy.allowedNoticeHosts || []).map((h) => h.toLowerCase()));
      return noticeSet.has(noticeHost) && applySet.has(applyHost);
    }
    return true;
  }

  // Same normalized host or same agency domain root (never collapses across distinct .gov.in / .tn.gov.in agencies)
  if (noticeHost.replace(/^www\./, '') === applyHost.replace(/^www\./, '')) {
    return true;
  }
  const noticeRoot = extractAgencyDomainRoot(noticeHost);
  const applyRoot = extractAgencyDomainRoot(applyHost);
  if (noticeRoot && applyRoot && noticeRoot === applyRoot) {
    return true;
  }

  // Explicitly authorized cross-host relationships in EXPLICIT_SOURCE_DOMAIN_MAP (e.g. tnpsc.gov.in -> apply.tnpscexams.in, sbi.co.in -> ibpsonline.ibps.in)
  for (const policy of Object.values(EXPLICIT_SOURCE_DOMAIN_MAP || {})) {
    const noticeSet = new Set((policy?.allowedNoticeHosts || []).map((h) => h.toLowerCase()));
    const applySet = new Set((policy?.allowedApplyHosts || policy?.allowedNoticeHosts || []).map((h) => h.toLowerCase()));
    if (noticeSet.has(noticeHost) && applySet.has(applyHost)) {
      return true;
    }
  }

  // Explicitly authorized institutional cross-host groups (NTA, ONGC)
  for (const group of EXPLICIT_INSTITUTIONAL_CROSS_HOST_GROUPS) {
    if (group.noticeHosts.has(noticeHost) && group.applyHosts.has(applyHost)) {
      return true;
    }
  }

  return false;
}

/**
 * Strict PDF pathname validator: parses URL and inspects ONLY parsed.pathname.
 * Query strings (?x=fake.pdf) and fragments (#fake.pdf) never count as PDF evidence.
 */
export function isPdfPathname(rawUrl, options = {}) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (!trimmed || /[\\\u0000-\u001F\u007F]/.test(trimmed)) return false;
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return false;
  }
  const protocol = parsed.protocol.toLowerCase();
  const allowHttpForLocalMock = Boolean(options.allowHttpForLocalMock);
  if (protocol !== 'https:' && !(allowHttpForLocalMock && protocol === 'http:')) {
    return false;
  }
  const pathname = String(parsed.pathname || '').trim();
  return pathname.startsWith('/') && /\.pdf$/i.test(pathname);
}

const KNOWN_THIRD_PARTY_AGGREGATOR_RE =
  /(^|\.)(sarkariresult|freejobalert|freshersnow|fresherslive|testbook|adda247|oliveboard|byjus|gradeup|jagranjosh|careerpower|govtjobsportal|indgovtjobs|jobsarkari|blogspot|wordpress|github\.io)\./i;

const STRICT_INDIAN_GOV_HOST_RE = /^[a-z0-9-]+(\.[a-z0-9-]+)*\.(gov|nic)\.in$/i;

const REDIRECT_PATH_SEGMENT_RE = /(^|\/)(redirect|redir|out|away|exit|goto|jump|forward)(\/|$)/i;
const REDIRECT_QUERY_KEYS = new Set(['redirect', 'redir', 'url', 'next', 'target', 'dest', 'destination', 'return', 'returnurl', 'continue', 'goto', 'out']);

const GENERIC_LISTING_PATH_RE =
  /^\/((english|en|tamil|ta)\/)?((examinations?|web|site|portal)\/)?(notifications?|notices?|recruitments?|recruitment[-_]?notices?|careers?(\/current[-_]?openings?)?|current[-_]?openings?|active[-_]?exams?|latest[-_]?news?|announcements?|vacancies?|jobs?|apprenticeships?|home[-_]?notices?|portal|login|dashboard|results?|whats[-_]?new|archive[s]?)(\.(aspx?|html?|php|jsp))?\/?$/i;

// Non-overridable historical/calendar classifications (remain blocked even on re-approve)
const HARD_BLOCKED_EVIDENCE_CLASSIFICATIONS = new Set([
  'OFFICIAL_CALENDAR_ONLY',
  'OLD_RECRUITMENT_CYCLE',
  'HISTORICAL_CYCLE'
]);

// Soft review-pending classifications (cleared only when fresh verified evidence passes on promotion/re-approve)
const SOFT_REVIEW_EVIDENCE_CLASSIFICATIONS = new Set([
  'NEEDS_OFFICIAL_SOURCE',
  'NEEDS_REVIEW_DISABLED'
]);

function isSuspiciousRedirectUrl(parsed, host) {
  if (REDIRECT_PATH_SEGMENT_RE.test(parsed.pathname || '')) {
    return true;
  }
  for (const [k, v] of parsed.searchParams.entries()) {
    const keyLower = String(k || '').trim().toLowerCase();
    const valTrim = String(v || '').trim();
    if (!valTrim) continue;
    if (/^(https?:)?\/\//i.test(valTrim) || REDIRECT_QUERY_KEYS.has(keyLower)) {
      if (/^(https?:)?\/\//i.test(valTrim)) {
        try {
          const targetUrl = new URL(valTrim.startsWith('//') ? `https:${valTrim}` : valTrim);
          const targetHost = targetUrl.hostname.toLowerCase().replace(/\.+$/, '');
          if (targetHost && targetHost !== host) return true;
        } catch {
          return true;
        }
      } else if (REDIRECT_QUERY_KEYS.has(keyLower) && /%2f%2f|https?%3a/i.test(valTrim)) {
        return true;
      }
    }
  }
  return false;
}

export function isGenericListingOrDirectoryUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return true;
  const trimmed = rawUrl.trim();
  if (!trimmed || isGenericRootHomepage(trimmed)) return true;
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return true;
  }
  const pathname = parsed.pathname || '/';
  if (isPdfPathname(trimmed)) return false;

  // Specific document/notice query identifiers distinguish a notice page from a bare directory listing
  const hasSpecificDocParam = ['id', 'notice', 'noticeid', 'advt', 'file', 'doc', 'pdf', 'notification', 'notifid', 'postid'].some((k) => {
    const v = parsed.searchParams.get(k);
    return Boolean(v && String(v).trim().length >= 2);
  });
  if (hasSpecificDocParam) return false;

  if (GENERIC_LISTING_PATH_RE.test(pathname)) return true;
  if (/\/wps\/wcm\/connect\/[^/]+\/career\/recruitment-notice\/?$/i.test(pathname)) return true;
  return false;
}

export function evaluateOfficialDomainUrl(rawUrl, sourceKey = '', linkKind = 'notice', options = {}) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, reason: 'MISSING_URL' };
  }
  const trimmed = rawUrl.trim();
  if (!trimmed || /[\\\u0000-\u001F\u007F]/.test(trimmed)) {
    return { valid: false, reason: 'MALFORMED_URL' };
  }
  if (isGenericRootHomepage(trimmed)) {
    return { valid: false, reason: 'GENERIC_ROOT_HOMEPAGE' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, reason: 'MALFORMED_URL' };
  }

  const protocol = parsed.protocol.toLowerCase();
  const allowHttpForLocalMock = Boolean(options.allowHttpForLocalMock);
  if (protocol !== 'https:' && !(allowHttpForLocalMock && protocol === 'http:')) {
    return { valid: false, reason: 'NON_HTTPS_URL' };
  }
  if (parsed.username || parsed.password) {
    return { valid: false, reason: 'URL_CREDENTIALS_FORBIDDEN' };
  }
  if (parsed.port && parsed.port !== '443' && !allowHttpForLocalMock) {
    return { valid: false, reason: 'NON_STANDARD_PORT' };
  }

  const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.+$/, '');
  if (
    !host ||
    host === 'localhost' ||
    host.includes('xn--') ||
    net.isIP(host) !== 0 ||
    isShortenerHost(host) ||
    KNOWN_THIRD_PARTY_AGGREGATOR_RE.test(host)
  ) {
    return { valid: false, reason: 'UNTRUSTED_OR_THIRD_PARTY_HOST' };
  }

  if (isSuspiciousRedirectUrl(parsed, host)) {
    return { valid: false, reason: 'SUSPICIOUS_REDIRECT_URL' };
  }

  if (sourceKey) {
    const policyRes = validateExplicitSourceUrl(trimmed, sourceKey, linkKind, options);
    return policyRes.valid
      ? { valid: true, host }
      : { valid: false, reason: policyRes.reason || 'SOURCE_DOMAIN_MISMATCH' };
  }

  // Exact match against registered official hosts or explicit institutional allowlist (no wildcard subdomain confusion)
  if (REGISTERED_OFFICIAL_HOSTS.has(host) || EXPLICIT_INSTITUTIONAL_ALLOWLIST.has(host)) {
    return { valid: true, host };
  }

  // Strictly government-restricted Indian TLDs ONLY (.gov.in / .nic.in) — NO .org.in, .edu.in, .ac.in, .res.in wildcards
  if (STRICT_INDIAN_GOV_HOST_RE.test(host)) {
    return { valid: true, host };
  }

  return { valid: false, reason: 'UNVERIFIED_EXTERNAL_DOMAIN' };
}

/**
 * Shared fail-closed verification evaluator for master feed, Admin create/approve,
 * and scraped auto-publish flows. Never marks arbitrary, unverified, third-party,
 * generic homepage/listing, missing-date, invalid-date, or quarantined records as verified.
 */
export function evaluateNotificationVerificationFlags(candidate = {}, options = {}) {
  const allowPromotionEvaluation = Boolean(options.allowPromotionEvaluation);
  const allowVerifiedDocState = options.allowVerifiedDocState !== false;
  const reasons = [];

  const ingestionStatus = String(candidate.ingestionStatus || 'published').trim().toLowerCase();
  const statusVal = String(candidate.status || 'active').trim().toLowerCase();
  const noticeType = String(candidate.noticeType || '').trim().toLowerCase();
  const isResultNotice = noticeType === 'result_key';
  const evidenceClass = String(candidate.evidenceClassification || '').trim();
  const quarantineReason = String(candidate.quarantineReason || '').trim();

  if (candidate.isThirdParty === true || candidate.sourceType === 'third_party') {
    reasons.push('THIRD_PARTY_SOURCE');
  }
  if (ingestionStatus === 'quarantined' || quarantineReason) {
    reasons.push('QUARANTINED_RECORD');
  }
  if (ingestionStatus === 'rejected') {
    reasons.push('REJECTED_RECORD');
  }
  if (!allowPromotionEvaluation && ingestionStatus !== 'published') {
    reasons.push('NOT_PUBLISHED');
  }
  // Soft review markers block direct evaluation, but are re-evaluated fresh on legitimate re-approval/promotion
  if (!allowPromotionEvaluation && (candidate.hasSourceIntegrityIssue === true || candidate.needsOfficialSource === true)) {
    reasons.push('SOURCE_INTEGRITY_ISSUE_FLAGGED');
  }
  if (!allowPromotionEvaluation && statusVal === 'under_review') {
    reasons.push('STATUS_UNDER_REVIEW');
  }
  if (candidate.isHistoricalCycle === true || HARD_BLOCKED_EVIDENCE_CLASSIFICATIONS.has(evidenceClass)) {
    reasons.push(`EVIDENCE_CLASSIFICATION_BLOCKED:${evidenceClass || 'HISTORICAL'}`);
  } else if (!allowPromotionEvaluation && SOFT_REVIEW_EVIDENCE_CLASSIFICATIONS.has(evidenceClass)) {
    reasons.push(`EVIDENCE_CLASSIFICATION_BLOCKED:${evidenceClass}`);
  }
  if (!allowPromotionEvaluation && (candidate.sourceIntegrityVerified === false || candidate.isVerified === false)) {
    reasons.push('EXPLICIT_UNVERIFIED_FLAG');
  }

  const sourceKey = String(candidate.sourceKey || '').trim();
  const detailsLinkRaw = String(candidate.detailsLink || '').trim();
  const applyLinkRaw = String(candidate.applyLink || '').trim();

  const detailsUrlCheck = evaluateOfficialDomainUrl(detailsLinkRaw, sourceKey, 'notice', options);
  if (!detailsUrlCheck.valid) {
    reasons.push(`DETAILS_LINK:${detailsUrlCheck.reason}`);
  } else if (isGenericListingOrDirectoryUrl(detailsLinkRaw)) {
    reasons.push('DETAILS_LINK:GENERIC_LISTING_PAGE');
  }

  const applyUrlCheck = applyLinkRaw
    ? evaluateOfficialDomainUrl(applyLinkRaw, sourceKey, 'apply', options)
    : (isResultNotice ? { valid: true, host: '' } : { valid: false, reason: 'MISSING_URL' });
  if (!applyUrlCheck.valid) {
    reasons.push(`APPLY_LINK:${applyUrlCheck.reason}`);
  } else if (
    detailsUrlCheck.valid &&
    applyUrlCheck.host &&
    !isAuthorizedAgencyHostPair(detailsUrlCheck.host, applyUrlCheck.host, sourceKey)
  ) {
    reasons.push('CROSS_AGENCY_URL_MISMATCH');
  }

  const docStatus = String(candidate.docVerificationStatus || '').trim();
  if (docStatus === 'malformed') {
    reasons.push('MALFORMED_DOCUMENT');
  }
  const hasVerifiedDocState = Boolean(
    allowVerifiedDocState &&
    (docStatus === 'structurally_verified' || docStatus === 'html_notice_verified') &&
    detailsUrlCheck.valid &&
    !isGenericListingOrDirectoryUrl(detailsLinkRaw)
  );

  const docEvidenceUrl = String(candidate.officialPdfUrl || candidate.officialNotificationUrl || '').trim();
  const officialDocCheck = docEvidenceUrl
    ? evaluateOfficialDomainUrl(docEvidenceUrl, sourceKey, 'notice', options)
    : { valid: false, reason: 'MISSING_OFFICIAL_DOC_URL' };
  const docEvidenceHostConsistent = Boolean(
    officialDocCheck.valid &&
    (!detailsUrlCheck.valid ||
      isAuthorizedAgencyHostPair(detailsUrlCheck.host, officialDocCheck.host, sourceKey) ||
      isAuthorizedAgencyHostPair(officialDocCheck.host, detailsUrlCheck.host, sourceKey))
  );
  if (officialDocCheck.valid && detailsUrlCheck.valid && !docEvidenceHostConsistent) {
    reasons.push('CROSS_AGENCY_DOC_URL_MISMATCH');
  }
  const docEvidenceIsPdf = isPdfPathname(docEvidenceUrl, options);
  const docEvidenceIsSpecific = Boolean(
    officialDocCheck.valid &&
    docEvidenceHostConsistent &&
    !isGenericListingOrDirectoryUrl(docEvidenceUrl) &&
    docEvidenceIsPdf
  );

  const noticeNo = String(candidate.officialNotificationNumber || candidate.notificationNo || '').trim();
  const hasValidNoticeNo = Boolean(
    noticeNo.length >= 3 &&
    /\d/.test(noticeNo) &&
    !/^(n\/a|na|tba|none|pending|unknown|test|0+|123|-+)$/i.test(noticeNo)
  );
  const detailsLooksLikePdf = isPdfPathname(detailsLinkRaw, options);
  const detailsIsSpecificPdf = Boolean(
    detailsUrlCheck.valid &&
    !isGenericListingOrDirectoryUrl(detailsLinkRaw) &&
    detailsLooksLikePdf
  );

  // Strict official evidence: server-verified document state OR verified official PDF + valid notification number
  const hasOfficialEvidence = Boolean(
    hasVerifiedDocState ||
    (docEvidenceIsSpecific && hasValidNoticeNo) ||
    (detailsIsSpecificPdf && hasValidNoticeNo)
  );
  if (!hasOfficialEvidence) {
    reasons.push('MISSING_OFFICIAL_SOURCE_EVIDENCE');
  }

  const openRaw = String(candidate.openingDate || candidate.applicationStartDate || '').trim();
  const closeRaw = String(candidate.closingDate || candidate.applicationEndDate || '').trim();
  const openDetailed = openRaw ? parseDateDetailed(openRaw) : { valid: false, kind: 'empty' };
  const closeDetailed = closeRaw ? parseDateDetailed(closeRaw) : { valid: false, kind: 'empty' };
  const examRaw = String(candidate.examDate || '').trim();
  const examDetailed = examRaw ? parseDateDetailed(examRaw) : null;

  const hasValidOpenAndClose = Boolean(
    openRaw &&
    closeRaw &&
    openDetailed.valid &&
    closeDetailed.valid &&
    openDetailed.components &&
    closeDetailed.components &&
    closeDetailed.components.epochDays >= openDetailed.components.epochDays &&
    (!examDetailed || examDetailed.kind !== 'invalid_calendar')
  );
  if (!hasValidOpenAndClose && !isResultNotice) {
    reasons.push('MISSING_OR_INVALID_APPLICATION_DATES');
  }

  const todayObj = options.today || getKolkataToday(options.now instanceof Date ? options.now : new Date());
  const appStatus = calculateApplicationStatus(openRaw, closeRaw, todayObj);
  const examStatus = calculateExamStatus(examRaw, todayObj);
  const dateConsistency = evaluateNotificationDateConsistency(
    candidate,
    appStatus,
    examStatus,
    {},
    todayObj,
    { lang: 'en' }
  );

  const hasDateConflict = Boolean(
    !hasValidOpenAndClose ||
    appStatus.isInvalid ||
    dateConsistency.requiresCtaBlock ||
    dateConsistency.issues.includes('MISSING_CLOSING_DATE') ||
    dateConsistency.issues.includes('INVALID_CLOSING_DATE') ||
    dateConsistency.issues.includes('MISSING_OPENING_DATE') ||
    dateConsistency.issues.includes('INVALID_OPENING_DATE') ||
    dateConsistency.issues.includes('CLOSING_BEFORE_OPENING')
  );
  if (hasDateConflict && hasValidOpenAndClose && !isResultNotice) {
    reasons.push('DATE_CONSISTENCY_CONFLICT');
  }

  const integrityBlockerReasons = reasons.filter(
    (r) => r !== 'MISSING_OR_INVALID_APPLICATION_DATES' && r !== 'DATE_CONSISTENCY_CONFLICT'
  );

  const sourceIntegrityVerified = Boolean(
    integrityBlockerReasons.length === 0 &&
    detailsUrlCheck.valid &&
    !isGenericListingOrDirectoryUrl(detailsLinkRaw) &&
    applyUrlCheck.valid &&
    hasOfficialEvidence
  );

  const explicitDatesBlocked = !allowPromotionEvaluation && candidate.applicationDatesVerified === false;
  if (explicitDatesBlocked && !isResultNotice) {
    reasons.push('EXPLICIT_APPLICATION_DATES_UNVERIFIED');
  }

  const applicationDatesVerified = Boolean(
    !isResultNotice &&
    sourceIntegrityVerified &&
    !hasDateConflict &&
    !explicitDatesBlocked
  );

  const isVerified = isResultNotice
    ? Boolean(sourceIntegrityVerified)
    : Boolean(sourceIntegrityVerified && applicationDatesVerified);

  return {
    sourceIntegrityVerified,
    applicationDatesVerified,
    isVerified,
    isResultNotice,
    hasOfficialEvidence,
    hasValidApplicationDates: !hasDateConflict,
    reasons: [...new Set(reasons)]
  };
}
