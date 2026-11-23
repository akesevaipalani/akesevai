// server/cleanup/expiredExamCleanupHelper.js
// ============================================================================
// AK E-SEVAI — 10-DAY AUTOMATIC EXPIRED EXAM NOTIFICATION CLEANUP SYSTEM
// Schedule: Every 10 Days at 02:00:00 AM Asia/Kolkata (IST = UTC+05:30)
// Concurrency: Distributed Singleton Locking with Lease & Monotonic Fencing Token
// Safety: Default DRY-RUN mode (ENABLE_EXPIRED_EXAM_PURGE !== 'true')
// Multi-Stage & Review Guard: Strict protection for interviews, doc
// verification, subsequent stages, pending reviews, and unresolved corrigenda.
// ============================================================================

import mongoose from 'mongoose';
import crypto from 'crypto';
import os from 'os';
import {
  getKolkataToday,
  calculateExamStatus,
  calculateApplicationStatus,
  calculateInterviewStatus,
  calculateSelectionStatus,
  calculateResultStatus,
  extractExamStages,
  isInterviewOrScheduleText,
  parseAllDatesDetailed
} from '../../src/utils/notificationDateHelper.js';
import {
  isCleanupSchedulerAllowedInEnvironment,
  extractMongoDatabaseName
} from '../db/databaseIsolation.js';

export const CLEANUP_TASK_KEY = 'expired_exam_cleanup';
export const CLEANUP_LEASE_DURATION_MS = 5 * 60 * 1000; // 5 minutes lease
export const CLEANUP_INTERVAL_DAYS = 10;
export const CLEANUP_TARGET_HOUR_IST = 2; // 02:00 AM Asia/Kolkata

/**
 * Mongoose Schema for persistent singleton lock and 10-day schedule state.
 * Collection: cleanup_schedule_state
 * Preserves monotonic fencingToken and records execution telemetry.
 */
export const cleanupScheduleSchema = new mongoose.Schema({
  taskKey: {
    type: String,
    required: true,
    unique: true,
    default: CLEANUP_TASK_KEY
  },
  fencingToken: {
    type: Number,
    required: true,
    default: 0
  },
  ownerInstance: {
    type: String,
    default: null
  },
  ownerRunId: {
    type: String,
    default: null
  },
  acquiredAt: {
    type: Date,
    default: null
  },
  leaseExpiresAt: {
    type: Date,
    default: null
  },
  lastRunAt: {
    type: Date,
    default: null
  },
  lastRunIstDate: {
    type: String,
    default: null
  },
  nextScheduledRunAt: {
    type: Date,
    default: null
  },
  lastExecutionStatus: {
    type: String,
    enum: ['idle', 'running', 'completed', 'completed_dry_run', 'failed'],
    default: 'idle'
  },
  lastExecutionSummary: {
    dryRun: { type: Boolean, default: true },
    candidatesFound: { type: Number, default: 0 },
    deletedCount: { type: Number, default: 0 },
    candidateIds: { type: [String], default: [] },
    durationMs: { type: Number, default: 0 },
    executedAt: { type: Date, default: null },
    errorMessage: { type: String, default: '' }
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'cleanup_schedule_state' });

export const CleanupScheduleState =
  mongoose.models.CleanupScheduleState ||
  mongoose.model('CleanupScheduleState', cleanupScheduleSchema);

/**
 * Comprehensive projection ensuring every safety-related field is fetched
 * from MongoDB prior to cleanup evaluation.
 */
export const EXPIRED_EXAM_SAFETY_PROJECTION = {
  id: 1,
  title: 1,
  category: 1,
  organization: 1,
  service: 1,
  postName: 1,
  status: 1,
  openingDate: 1,
  closingDate: 1,
  examDate: 1,
  interviewDate: 1,
  walkInDate: 1,
  documentVerificationDate: 1,
  dvDate: 1,
  selectionDate: 1,
  counsellingDate: 1,
  resultDate: 1,
  extendedClosingDate: 1,
  extendedLastDate: 1,
  revisedClosingDate: 1,
  isExtensionVerified: 1,
  extensionVerified: 1,
  corrigendumVerified: 1,
  corrigendumResolved: 1,
  interviewApplicable: 1,
  interviewNotApplicable: 1,
  ingestionStatus: 1,
  hasCorrigendum: 1,
  corrigendumSummary: 1,
  corrigendumDetectedAt: 1,
  corrigendumStatus: 1,
  corrigendumDecision: 1,
  pendingCorrigendum: 1,
  manualOverrideLock: 1,
  evidenceClassification: 1,
  docVerificationStatus: 1,
  quarantineReason: 1,
  needsOfficialSource: 1,
  sourceIntegrityVerified: 1,
  hasSourceIntegrityIssue: 1,
  isVerified: 1,
  applicationStartDate: 1,
  applicationEndDate: 1,
  applicationLastDate: 1,
  mainsExamDate: 1,
  mainsDate: 1,
  tier2ExamDate: 1,
  tier2Date: 1,
  stage2ExamDate: 1,
  stage2Date: 1,
  prelimsExamDate: 1,
  prelimsDate: 1,
  tier1ExamDate: 1,
  tier1Date: 1,
  stage1ExamDate: 1,
  stage1Date: 1,
  lifecycleStage: 1,
  selectionStage: 1,
  updatedAt: 1
};

/**
 * Returns a unique execution run ID.
 */
export function generateCleanupRunId() {
  return `cleanup_run_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

/**
 * Returns host and process identifier for telemetry.
 */
export function getOwnerInstanceId() {
  return `${os.hostname()}:${process.pid}`;
}

/**
 * Converts a specific calendar day in Asia/Kolkata (IST = UTC+05:30)
 * at a given target hour, minute, second into an exact UTC Date object.
 *
 * IST = UTC + 5h30m  ==>  UTC = IST - 5h30m
 * Formula: Date.UTC(year, month - 1, day, hour, minute, second) - 5.5 hours.
 *
 * @param {number} year
 * @param {number} month (1-12)
 * @param {number} day (1-31)
 * @param {number} [hour=2]
 * @param {number} [minute=0]
 * @param {number} [second=0]
 * @returns {Date}
 */
export function getKolkataTargetTime(year, month, day, hour = 2, minute = 0, second = 0) {
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second, 0) - (5.5 * 3600 * 1000);
  return new Date(utcMs);
}

/**
 * Calculates the next 10-day run date at 02:00:00 AM Asia/Kolkata.
 * Given a reference instant (e.g. timestamp of completion or now),
 * takes the current IST calendar date, adds intervalDays (default: 10),
 * and targets 02:00:00 AM IST on that future calendar day.
 *
 * Handles month roll-overs, year boundaries, and leap years accurately.
 *
 * @param {Date|string|number} [referenceInstant=new Date()]
 * @param {Object} [options]
 * @param {number} [options.intervalDays=10]
 * @param {number} [options.targetHourIst=2]
 * @returns {Date}
 */
export function calculateNextTenDayRunDate(referenceInstant = new Date(), options = {}) {
  const intervalDays = options.intervalDays || CLEANUP_INTERVAL_DAYS;
  const targetHour = options.targetHourIst !== undefined ? options.targetHourIst : CLEANUP_TARGET_HOUR_IST;

  const refKolkata = getKolkataToday(referenceInstant);
  // Add intervalDays via UTC day offset to let JavaScript Date roll over months/years cleanly
  const targetDayUtc = new Date(Date.UTC(refKolkata.year, refKolkata.month - 1, refKolkata.day + intervalDays));
  const targetYear = targetDayUtc.getUTCFullYear();
  const targetMonth = targetDayUtc.getUTCMonth() + 1;
  const targetDay = targetDayUtc.getUTCDate();

  return getKolkataTargetTime(targetYear, targetMonth, targetDay, targetHour, 0, 0);
}

/**
 * Calculates the initial upcoming run date at 02:00:00 AM Asia/Kolkata
 * for cold bootstrap when no prior run has occurred.
 *
 * If current time is strictly before today's 02:00 AM IST, returns today's 02:00 AM IST.
 * If current time is on or after today's 02:00 AM IST, returns tomorrow's 02:00 AM IST.
 *
 * @param {Date|string|number} [nowInstant=new Date()]
 * @returns {Date}
 */
export function calculateInitialUpcomingRunDate(nowInstant = new Date()) {
  const now = nowInstant instanceof Date ? nowInstant : new Date(nowInstant);
  const nowKolkata = getKolkataToday(now);

  const todayTarget = getKolkataTargetTime(
    nowKolkata.year,
    nowKolkata.month,
    nowKolkata.day,
    CLEANUP_TARGET_HOUR_IST,
    0,
    0
  );

  if (now.getTime() < todayTarget.getTime()) {
    return todayTarget;
  }

  // Today's 02:00 AM IST has passed -> schedule for tomorrow at 02:00 AM IST
  const tomorrowUtc = new Date(Date.UTC(nowKolkata.year, nowKolkata.month - 1, nowKolkata.day + 1));
  return getKolkataTargetTime(
    tomorrowUtc.getUTCFullYear(),
    tomorrowUtc.getUTCMonth() + 1,
    tomorrowUtc.getUTCDate(),
    CLEANUP_TARGET_HOUR_IST,
    0,
    0
  );
}

/**
 * Evaluates whether a notification is in an unresolved review or quarantine state.
 *
 * @param {Object} notif
 * @returns {boolean}
 */
export function isUnresolvedReviewState(notif) {
  if (!notif) return true;

  const UNRESOLVED_INGESTION_STATUSES = new Set([
    'pending_review',
    'needs_review',
    'quarantined',
    'rejected_pending_correction',
    'pending_corrigendum_review',
    'quarantined_corrigendum',
    'under_review',
    'draft'
  ]);

  if (notif.ingestionStatus && UNRESOLVED_INGESTION_STATUSES.has(String(notif.ingestionStatus).toLowerCase().trim())) {
    return true;
  }

  const UNRESOLVED_RECORD_STATUSES = new Set([
    'under_review',
    'draft',
    'quarantined',
    'needs_review'
  ]);

  if (notif.status && UNRESOLVED_RECORD_STATUSES.has(String(notif.status).toLowerCase().trim())) {
    return true;
  }

  if (
    notif.evidenceClassification === 'NEEDS_OFFICIAL_SOURCE' ||
    notif.evidenceClassification === 'NEEDS_REVIEW_DISABLED'
  ) {
    return true;
  }

  if (notif.needsOfficialSource === true || notif.hasSourceIntegrityIssue === true) {
    return true;
  }

  if (notif.isVerified === false || notif.sourceIntegrityVerified === false) {
    return true;
  }

  if (notif.manualOverrideLock === true) {
    return true;
  }

  if (notif.docVerificationStatus) {
    const dvs = String(notif.docVerificationStatus).toLowerCase().trim();
    if (dvs.includes('pending') || dvs === 'quarantined' || dvs === 'failed') {
      return true;
    }
  }

  return false;
}

/**
 * Evaluates whether a notification has an unresolved corrigendum or pending update.
 *
 * @param {Object} notif
 * @returns {boolean}
 */
export function hasUnresolvedCorrigendumOrUpdate(notif) {
  if (!notif) return false;

  if (notif.hasCorrigendum === true) {
    if (notif.corrigendumResolved !== true && notif.corrigendumVerified !== true) {
      return true;
    }
  }

  if (notif.corrigendumStatus) {
    const cs = String(notif.corrigendumStatus).toLowerCase().trim();
    if (cs === 'pending' || cs === 'pending_review' || cs === 'unresolved') {
      return true;
    }
  }

  if (
    notif.corrigendumDecision === 'pending_corrigendum_review' ||
    notif.corrigendumDecision === 'quarantined_corrigendum'
  ) {
    return true;
  }

  if (notif.pendingCorrigendum) {
    return true;
  }

  return false;
}

/**
 * Evaluates whether the application window is still active, open, or invalid/ambiguous.
 *
 * @param {Object} notif
 * @param {Object} todayObj
 * @returns {boolean}
 */
export function isApplicationStillOpenOrActive(notif, todayObj) {
  if (!notif) return false;

  const openInput = notif.openingDate || notif.applicationStartDate || '';
  const closeInput = notif.closingDate || notif.applicationEndDate || '';
  if (!closeInput) {
    return false;
  }

  const appStatus = calculateApplicationStatus(openInput, closeInput, todayObj, {
    extendedClosingDate: notif.extendedClosingDate || notif.extendedLastDate || notif.revisedClosingDate || '',
    isExtensionVerified: notif.isExtensionVerified,
    extensionVerified: notif.extensionVerified,
    corrigendumVerified: notif.corrigendumVerified,
    lang: 'en'
  });

  // Invalid application dates -> ambiguous/invalid information -> protect!
  if (appStatus.isInvalid) {
    return true;
  }

  // Registration window currently open
  if (appStatus.isOpen && !appStatus.isExpired) {
    return true;
  }

  // If effective closing date is today or future
  if (appStatus.effectiveClosingDate) {
    const closeParsed = parseAllDatesDetailed(appStatus.effectiveClosingDate);
    if (closeParsed.hasInvalidCalendarDate) return true;
    if (closeParsed.endDate && typeof closeParsed.endDate.epochDays === 'number') {
      if (todayObj.epochDays <= closeParsed.endDate.epochDays) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Evaluates whether any subsequent selection stage or recruitment event
 * (interview, document verification, mains exam, or pending results) is still active.
 *
 * @param {Object} notif
 * @param {Object} todayObj
 * @returns {boolean}
 */
export function hasPendingSubsequentStageOrEvent(notif, todayObj) {
  if (!notif) return false;

  const rawExamDate = notif.examDate || '';

  // 1. Multi-Stage Exam Guard (Mains)
  const examStages = extractExamStages(rawExamDate, notif);
  if (examStages.mainsRaw && typeof examStages.mainsRaw === 'string' && examStages.mainsRaw.trim()) {
    const mainsStatus = calculateExamStatus(examStages.mainsRaw, todayObj, { lang: 'en' });
    if (mainsStatus.isInvalid) return true;
    if (mainsStatus.isUpcoming || mainsStatus.isToday) return true;
    if (mainsStatus.code === 'NOT_ANNOUNCED') return true;
    if (typeof mainsStatus.latestEpochDays === 'number' && todayObj.epochDays <= mainsStatus.latestEpochDays) {
      return true;
    }
  } else if (examStages.isMultiStage && !examStages.mainsRaw) {
    // Multi-stage exam noted, but Mains date not announced yet -> protect
    return true;
  }

  // 2. Interview / Personality Test / Walk-in Guard
  const isInterviewApplicable = notif.interviewApplicable !== false && notif.interviewNotApplicable !== true;
  const interviewCandidate = notif.interviewDate || notif.walkInDate || (isInterviewOrScheduleText(rawExamDate) ? rawExamDate : '');

  if (isInterviewApplicable && interviewCandidate && typeof interviewCandidate === 'string' && interviewCandidate.trim()) {
    const interviewStatus = calculateInterviewStatus(interviewCandidate, todayObj, { lang: 'en' });
    // Invalid interview date -> protect (ambiguous/invalid info)
    if (interviewStatus.isInvalid) return true;
    // Interview is upcoming or today -> protect
    if (interviewStatus.isUpcoming || interviewStatus.isToday) return true;
    // Interview has specific calendar date today or in future -> protect
    if (interviewStatus.hasDate && typeof interviewStatus.earliestEpochDays === 'number' && todayObj.epochDays <= interviewStatus.earliestEpochDays) {
      return true;
    }
    // Date pending / announced without calendar day -> protect
    if (interviewStatus.isDatePending || interviewStatus.status === 'DATE_PENDING') {
      return true;
    }
  }

  // 3. DV Verification / Counselling / Selection Date Guard
  const selCandidate = notif.documentVerificationDate || notif.dvDate || notif.selectionDate || notif.counsellingDate || '';
  if (selCandidate && typeof selCandidate === 'string' && selCandidate.trim()) {
    const selStatus = calculateSelectionStatus(selCandidate, todayObj, { lang: 'en' });
    if (selStatus.isInvalid) return true;
    if (selStatus.isUpcoming || selStatus.isToday) return true;
    if (selStatus.hasDate && typeof selStatus.earliestEpochDays === 'number' && todayObj.epochDays <= selStatus.earliestEpochDays) {
      return true;
    }
  }

  // 4. Lifecycle / selection stage flags
  if (notif.lifecycleStage) {
    const ls = String(notif.lifecycleStage).toUpperCase().trim();
    if (
      ls === 'INTERVIEW_UPCOMING' ||
      ls === 'DV_UPCOMING' ||
      ls === 'SELECTION_PENDING' ||
      ls === 'EXAM_UPCOMING' ||
      ls === 'RESULTS_PENDING' ||
      ls === 'ADMISSION_PENDING' ||
      ls === 'APPLICATION_OPEN'
    ) {
      return true;
    }
  }

  if (notif.selectionStage) {
    const ss = String(notif.selectionStage).toUpperCase().trim();
    if (ss === 'PENDING' || ss === 'IN_PROGRESS' || ss === 'UPCOMING') {
      return true;
    }
  }

  // 5. Result date in future
  if (notif.resultDate && typeof notif.resultDate === 'string' && notif.resultDate.trim()) {
    const resultStatus = calculateResultStatus(notif, todayObj, { lang: 'en' });
    if (resultStatus.isUpcoming || resultStatus.isToday) {
      return true;
    }
  }

  return false;
}

/**
 * Pure predicate evaluating whether a notification qualifies for expired exam deletion.
 *
 * STRICT REFINED SAFETY POLICY (Step 2.54-N):
 * 1. Must NOT be null/undefined.
 * 2. Unresolved Review & Ingestion State Guard:
 *    - Must NOT be in 'pending_review', 'quarantined', 'needs_review', 'rejected_pending_correction',
 *      'pending_corrigendum_review', 'quarantined_corrigendum', or any unresolved review state.
 *    - Must NOT have status 'under_review', 'draft', 'quarantined', or 'needs_review'.
 *    - Must NOT have docVerificationStatus 'pending' or 'quarantined'.
 *    - Must NOT have evidenceClassification 'NEEDS_OFFICIAL_SOURCE' or 'NEEDS_REVIEW_DISABLED'.
 *    - Must NOT have manualOverrideLock === true.
 * 3. Unresolved Corrigendum Guard:
 *    - Must NOT have an unresolved corrigendum (hasCorrigendum === true without explicit resolution).
 *    - Must NOT have pendingCorrigendum or corrigendumStatus === 'pending' or decision === 'pending_corrigendum_review'.
 * 4. Registration Window Period Guard:
 *    - If application deadline (closingDate) is active, open, or in the future/today -> NOT ELIGIBLE.
 *    - If application date is invalid -> NOT ELIGIBLE.
 * 5. Primary Exam Date Guard:
 *    - examDate must be a non-empty string.
 *    - examStatus must NOT be invalid (isInvalid === true -> false).
 *    - examStatus must NOT be 'NOT_ANNOUNCED', text estimate, or tentative -> false.
 *    - Must have a valid numeric latestEpochDays.
 *    - Must NOT be scheduled for today (isToday === true -> false).
 *    - Must NOT be upcoming (isUpcoming === true -> false).
 *    - todayObj.epochDays MUST be strictly greater than examStatus.latestEpochDays.
 * 6. Multi-Stage Exam Guard (e.g. Prelims / Mains):
 *    - If Mains exam exists:
 *      - If Mains is upcoming or today -> NOT ELIGIBLE.
 *      - If Mains is announced but date is pending (NOT_ANNOUNCED) -> NOT ELIGIBLE.
 *      - If Mains has a future/today epochDays -> NOT ELIGIBLE.
 * 7. Interview / Personality Test Guard:
 *    - If interview date or walk-in date exists (and interview is applicable):
 *      - If interview date is in the future or today -> NOT ELIGIBLE.
 *      - If interview date is invalid or ambiguous -> NOT ELIGIBLE.
 *      - If interview is announced/pending date -> NOT ELIGIBLE.
 * 8. DV Verification / Counselling / Selection Stage Guard:
 *    - If document verification / dvDate / selectionDate / counsellingDate exists:
 *      - If DV date is in the future or today -> NOT ELIGIBLE.
 *      - If DV date is invalid or ambiguous -> NOT ELIGIBLE.
 * 9. Subsequent Selection Stage / Event Guard:
 *    - If lifecycleStage indicates pending recruitment events (e.g. INTERVIEW_UPCOMING, DV_UPCOMING, SELECTION_PENDING, RESULTS_PENDING) -> NOT ELIGIBLE.
 *    - If resultDate exists and resultStatus is upcoming or today -> NOT ELIGIBLE.
 * 10. Ambiguous / Invalid Date Guard:
 *     - If any date field contains invalid calendar dates or requires review -> NOT ELIGIBLE.
 *
 * ONLY when all exams and subsequent recruitment stages are fully completed in the past
 * AND the record is in a stable, resolved state, this returns true.
 *
 * @param {Object} notif
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {boolean}
 */
export function shouldDeleteExpiredExamNotification(notif, todayObj = getKolkataToday()) {
  if (!notif) return false;

  // 1. Guard against unresolved review & ingestion states
  if (isUnresolvedReviewState(notif)) {
    return false;
  }

  // 2. Guard against unresolved corrigenda or updates
  if (hasUnresolvedCorrigendumOrUpdate(notif)) {
    return false;
  }

  // 3. Guard against open or active application period
  if (isApplicationStillOpenOrActive(notif, todayObj)) {
    return false;
  }

  // 4. Primary exam date evaluation
  const rawExamDate = notif.examDate;
  if (!rawExamDate || typeof rawExamDate !== 'string' || !rawExamDate.trim()) {
    return false;
  }

  const examStatus = calculateExamStatus(rawExamDate, todayObj, { lang: 'en' });

  // 4a. Must NOT be invalid exam date
  if (examStatus.isInvalid) return false;

  // 4b. Must NOT be unannounced, tentative, seasonal estimate, or textual without date
  if (examStatus.code === 'NOT_ANNOUNCED') return false;

  // 4c. Must have a valid numeric latestEpochDays
  if (typeof examStatus.latestEpochDays !== 'number' || isNaN(examStatus.latestEpochDays)) {
    return false;
  }

  // 4d. Must NOT be scheduled for today
  if (examStatus.isToday === true) return false;

  // 4e. Must NOT be upcoming
  if (examStatus.isUpcoming === true) return false;

  // 4f. Must be marked completed AND today strictly greater than latestEpochDays
  if (examStatus.isCompleted !== true || todayObj.epochDays <= examStatus.latestEpochDays) {
    return false;
  }

  // 5. Guard against future or pending subsequent selection stages (interview, DV, mains, etc.)
  if (hasPendingSubsequentStageOrEvent(notif, todayObj)) {
    return false;
  }

  return true;
}

/**
 * Checks whether the cleanup execution is due based on persistent schedule state.
 *
 * @param {Object|null} scheduleState
 * @param {Date} [nowInstant=new Date()]
 * @returns {boolean}
 */
export function isCleanupDue(scheduleState, nowInstant = new Date()) {
  if (!scheduleState || !scheduleState.nextScheduledRunAt) {
    return false;
  }
  const nowMs = nowInstant instanceof Date ? nowInstant.getTime() : new Date(nowInstant).getTime();
  const scheduledMs = new Date(scheduleState.nextScheduledRunAt).getTime();
  return nowMs >= scheduledMs;
}

/**
 * Atomically acquires distributed singleton lock in MongoDB for cleanup execution.
 * Increments monotonic fencingToken and sets a 5-minute lease.
 *
 * @param {Object} CleanupScheduleModel
 * @param {Object} [options]
 * @returns {Promise<{ acquired: boolean, runId?: string, fencingToken?: number, leaseExpiresAt?: Date, taskKey?: string, reason?: string, existingOwner?: string, scheduleState?: Object }>}
 */
export async function acquireCleanupLock(CleanupScheduleModel, options = {}) {
  if (!CleanupScheduleModel) {
    return { acquired: false, reason: 'MODEL_REQUIRED' };
  }

  const taskKey = options.taskKey || CLEANUP_TASK_KEY;
  const leaseMs = options.leaseMs || CLEANUP_LEASE_DURATION_MS;
  const ownerInstance = options.ownerInstance || getOwnerInstanceId();
  const runId = options.runId || generateCleanupRunId();
  const now = options.now instanceof Date ? options.now : new Date();
  const leaseExpiresAt = new Date(now.getTime() + leaseMs);

  // Step 1: Claim existing unlocked or expired lock document
  const claimed = await CleanupScheduleModel.findOneAndUpdate(
    {
      taskKey,
      $or: [
        { ownerRunId: null },
        { ownerRunId: '' },
        { leaseExpiresAt: { $lte: now } }
      ]
    },
    {
      $inc: { fencingToken: 1 },
      $set: {
        ownerRunId: runId,
        ownerInstance,
        acquiredAt: now,
        leaseExpiresAt,
        lastExecutionStatus: 'running',
        updatedAt: now
      }
    },
    { new: true }
  );

  if (claimed && claimed.ownerRunId === runId) {
    return {
      acquired: true,
      runId,
      taskKey,
      fencingToken: claimed.fencingToken,
      leaseExpiresAt: claimed.leaseExpiresAt,
      scheduleState: claimed
    };
  }

  // Step 2: Check whether document exists with active lease
  const existing = await CleanupScheduleModel.findOne({ taskKey }).lean();
  if (existing) {
    return {
      acquired: false,
      reason: 'LOCKED_BY_ANOTHER_INSTANCE',
      existingOwner: existing.ownerRunId,
      existingExpiresAt: existing.leaseExpiresAt,
      scheduleState: existing
    };
  }

  // Step 3: Cold bootstrap insert race
  try {
    const initialNextRun = calculateInitialUpcomingRunDate(now);
    const created = await CleanupScheduleModel.create({
      taskKey,
      fencingToken: 1,
      ownerRunId: runId,
      ownerInstance,
      acquiredAt: now,
      leaseExpiresAt,
      nextScheduledRunAt: initialNextRun,
      lastExecutionStatus: 'running',
      updatedAt: now
    });

    return {
      acquired: true,
      runId,
      taskKey,
      fencingToken: created.fencingToken,
      leaseExpiresAt: created.leaseExpiresAt,
      scheduleState: created
    };
  } catch (err) {
    // E11000 duplicate key -> another concurrent instance won the bootstrap race
    const winner = await CleanupScheduleModel.findOne({ taskKey }).lean();
    return {
      acquired: false,
      reason: 'CONCURRENT_BOOTSTRAP_RACE',
      existingOwner: winner?.ownerRunId,
      existingExpiresAt: winner?.leaseExpiresAt,
      scheduleState: winner
    };
  }
}

/**
 * Atomically renews the cleanup lock lease while cleanup is in progress.
 * Guarantees ownership fencing: if another worker has incremented the fencingToken
 * or taken ownership, renewal fails and signals the current worker to abort.
 *
 * @param {Object} CleanupScheduleModel
 * @param {Object} lockData
 * @param {number} [additionalLeaseMs=CLEANUP_LEASE_DURATION_MS]
 * @returns {Promise<{ renewed: boolean, leaseExpiresAt?: Date, reason?: string, scheduleState?: Object }>}
 */
export async function renewCleanupLease(CleanupScheduleModel, lockData, additionalLeaseMs = CLEANUP_LEASE_DURATION_MS) {
  if (!CleanupScheduleModel || !lockData || !lockData.runId) {
    return { renewed: false, reason: 'INVALID_LOCK_DATA' };
  }

  const taskKey = lockData.taskKey || lockData.scheduleState?.taskKey || CLEANUP_TASK_KEY;
  const now = new Date();
  const newLeaseExpiresAt = new Date(now.getTime() + additionalLeaseMs);

  const updateQuery = CleanupScheduleModel.findOneAndUpdate(
    {
      taskKey,
      ownerRunId: lockData.runId,
      fencingToken: lockData.fencingToken
    },
    {
      $set: {
        leaseExpiresAt: newLeaseExpiresAt,
        updatedAt: now
      }
    },
    { new: true }
  );

  const updated = typeof updateQuery?.lean === 'function' ? await updateQuery.lean() : await updateQuery;

  if (updated && updated.ownerRunId === lockData.runId) {
    lockData.leaseExpiresAt = newLeaseExpiresAt;
    return { renewed: true, leaseExpiresAt: newLeaseExpiresAt, scheduleState: updated };
  }

  return { renewed: false, reason: 'LEASE_LOST_OR_PREEMPTED' };
}

/**
 * Starts a background heartbeat timer to periodically renew the cleanup lock lease
 * for long-running cleanup jobs. Guarantees immediate failure propagation.
 *
 * @param {Object} CleanupScheduleModel
 * @param {Object} lockData
 * @param {number} [intervalMs=60000] (Default 1 minute)
 * @returns {{ stop: Function, isStillValid: Function, hasFailed: Function, getFailureReason: Function, getLastError: Function }}
 */
export function startCleanupHeartbeat(CleanupScheduleModel, lockData, intervalMs = 60000) {
  let isAlive = true;
  let hasFailed = false;
  let failureReason = '';
  let lastError = null;
  let currentRenewalPromise = null;

  const intervalId = setInterval(async () => {
    if (!isAlive || hasFailed) return;
    try {
      currentRenewalPromise = renewCleanupLease(CleanupScheduleModel, lockData);
      const res = await currentRenewalPromise;
      if (!res.renewed) {
        hasFailed = true;
        failureReason = res.reason || 'LEASE_RENEWAL_REJECTED';
        lastError = new Error(failureReason);
        isAlive = false;
        console.warn(`⚠️ [Cleanup Heartbeat]: Lease renewal failed for runId ${lockData.runId}: ${failureReason}`);
      }
    } catch (err) {
      hasFailed = true;
      failureReason = err.message || 'LEASE_RENEWAL_EXCEPTION';
      lastError = err;
      isAlive = false;
      console.warn(`⚠️ [Cleanup Heartbeat]: Exception during lease renewal:`, err.message);
    } finally {
      currentRenewalPromise = null;
    }
  }, intervalMs);

  if (typeof intervalId.unref === 'function') {
    intervalId.unref();
  }

  return {
    stop: async () => {
      isAlive = false;
      clearInterval(intervalId);
      if (currentRenewalPromise) {
        try {
          await currentRenewalPromise;
        } catch (_) {}
      }
    },
    isStillValid: () => isAlive && !hasFailed && !lastError,
    hasFailed: () => hasFailed || Boolean(lastError),
    getFailureReason: () => failureReason || (lastError ? lastError.message : ''),
    getLastError: () => lastError
  };
}

/**
 * Releases distributed singleton lock and updates persistent schedule state.
 * Sets nextScheduledRunAt exactly 10 days in the future at 02:00:00 AM IST.
 *
 * @param {Object} CleanupScheduleModel
 * @param {Object} lockData
 * @param {Object} [summary={}]
 */
export async function releaseCleanupLock(CleanupScheduleModel, lockData, summary = {}) {
  if (!CleanupScheduleModel || !lockData || !lockData.runId) {
    return;
  }

  const now = new Date();
  const nextScheduledRunAt = summary.nextScheduledRunAt || calculateNextTenDayRunDate(now);
  const todayObj = summary.todayObj || getKolkataToday(now);

  await CleanupScheduleModel.updateOne(
    {
      taskKey: lockData.taskKey || lockData.scheduleState?.taskKey || CLEANUP_TASK_KEY,
      ownerRunId: lockData.runId,
      fencingToken: lockData.fencingToken
    },
    {
      $set: {
        ownerRunId: null,
        ownerInstance: null,
        leaseExpiresAt: null,
        lastRunAt: now,
        lastRunIstDate: todayObj.isoDate,
        nextScheduledRunAt,
        lastExecutionStatus: summary.status || (summary.dryRun ? 'completed_dry_run' : 'completed'),
        lastExecutionSummary: {
          dryRun: Boolean(summary.dryRun),
          candidatesFound: summary.candidatesFound || 0,
          deletedCount: summary.deletedCount || 0,
          candidateIds: summary.candidateIds || [],
          durationMs: summary.durationMs || 0,
          executedAt: now,
          errorMessage: summary.errorMessage || ''
        },
        updatedAt: now
      }
    }
  );
}

/**
 * Finds all notifications that qualify for expired exam deletion based on current IST date.
 * Strictly read-only query using full safety projection.
 *
 * @param {Object} NotificationModel
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Promise<Array<Object>>}
 */
export async function findExpiredExamCandidates(NotificationModel, todayObj = getKolkataToday()) {
  if (!NotificationModel) return [];

  // Narrow query to notifications with non-empty examDate using full safety projection
  const rawDocs = await NotificationModel.find(
    {
      examDate: { $exists: true, $nin: [null, ''] }
    },
    EXPIRED_EXAM_SAFETY_PROJECTION
  ).lean();

  const candidates = [];
  for (const doc of rawDocs) {
    if (shouldDeleteExpiredExamNotification(doc, todayObj)) {
      const examStatus = calculateExamStatus(doc.examDate, todayObj, { lang: 'en' });
      const daysExpired = examStatus.latestEpochDays
        ? todayObj.epochDays - examStatus.latestEpochDays
        : 0;

      candidates.push({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        organization: doc.organization,
        examDate: doc.examDate,
        closingDate: doc.closingDate,
        interviewDate: doc.interviewDate,
        documentVerificationDate: doc.documentVerificationDate,
        latestEpochDays: examStatus.latestEpochDays,
        daysExpired,
        ingestionStatus: doc.ingestionStatus,
        status: doc.status
      });
    }
  }

  return candidates;
}

/**
 * Constructs a strict, schema-aware atomic conditional deletion filter for a verified candidate record.
 * Protects against ANY concurrency race condition occurring between fresh revalidation and deletion.
 *
 * Guarantees that if ANY safety field was mutated in MongoDB (by an admin, user, or scraper):
 * - interviewDate, walkInDate
 * - documentVerificationDate, dvDate, selectionDate, counsellingDate
 * - resultDate
 * - extendedClosingDate, extendedLastDate, revisedClosingDate
 * - closingDate, examDate
 * - lifecycleStage, selectionStage
 * - pendingCorrigendum, corrigendumStatus, corrigendumDecision, hasCorrigendum
 * - needsOfficialSource, hasSourceIntegrityIssue, manualOverrideLock, docVerificationStatus, evidenceClassification
 * - ingestionStatus, status
 * - updatedAt (Optimistic Concurrency Control timestamp fence)
 *
 * The conditional query will match 0 records in MongoDB, aborting deletion for that record.
 *
 * @param {Object} doc - Freshly revalidated candidate record
 * @returns {Object} MongoDB atomic deletion filter
 */
export function buildConditionalDeletionFilter(doc) {
  if (!doc || !doc.id) {
    throw new Error('INVALID_CANDIDATE: Candidate record with id is required to build deletion filter');
  }

  const filter = {
    id: doc.id,

    // 1. Exact Exam & Registration Dates (prevents deletion if dates were changed or rescheduled)
    examDate: doc.examDate,
    closingDate: doc.closingDate !== undefined ? doc.closingDate : { $in: [null, '', undefined] },
    openingDate: doc.openingDate ? doc.openingDate : { $in: [null, '', undefined] },
    applicationStartDate: doc.applicationStartDate ? doc.applicationStartDate : { $in: [null, '', undefined] },
    applicationEndDate: doc.applicationEndDate ? doc.applicationEndDate : { $in: [null, '', undefined] },
    applicationLastDate: doc.applicationLastDate ? doc.applicationLastDate : { $in: [null, '', undefined] },

    // 2. Multi-Stage Exam Dates (Prelims & Mains)
    mainsExamDate: doc.mainsExamDate ? doc.mainsExamDate : { $in: [null, '', undefined] },
    mainsDate: doc.mainsDate ? doc.mainsDate : { $in: [null, '', undefined] },
    tier2ExamDate: doc.tier2ExamDate ? doc.tier2ExamDate : { $in: [null, '', undefined] },
    tier2Date: doc.tier2Date ? doc.tier2Date : { $in: [null, '', undefined] },
    stage2ExamDate: doc.stage2ExamDate ? doc.stage2ExamDate : { $in: [null, '', undefined] },
    stage2Date: doc.stage2Date ? doc.stage2Date : { $in: [null, '', undefined] },
    prelimsExamDate: doc.prelimsExamDate ? doc.prelimsExamDate : { $in: [null, '', undefined] },
    prelimsDate: doc.prelimsDate ? doc.prelimsDate : { $in: [null, '', undefined] },
    tier1ExamDate: doc.tier1ExamDate ? doc.tier1ExamDate : { $in: [null, '', undefined] },
    tier1Date: doc.tier1Date ? doc.tier1Date : { $in: [null, '', undefined] },
    stage1ExamDate: doc.stage1ExamDate ? doc.stage1ExamDate : { $in: [null, '', undefined] },
    stage1Date: doc.stage1Date ? doc.stage1Date : { $in: [null, '', undefined] },

    // 3. Subsequent Selection Stage Dates: Must match verified snapshot (null/empty/unchanged)
    interviewDate: doc.interviewDate ? doc.interviewDate : { $in: [null, '', undefined] },
    walkInDate: doc.walkInDate ? doc.walkInDate : { $in: [null, '', undefined] },
    documentVerificationDate: doc.documentVerificationDate ? doc.documentVerificationDate : { $in: [null, '', undefined] },
    dvDate: doc.dvDate ? doc.dvDate : { $in: [null, '', undefined] },
    selectionDate: doc.selectionDate ? doc.selectionDate : { $in: [null, '', undefined] },
    counsellingDate: doc.counsellingDate ? doc.counsellingDate : { $in: [null, '', undefined] },
    resultDate: doc.resultDate ? doc.resultDate : { $in: [null, '', undefined] },

    // 4. Deadline Extension Dates: Must match verified snapshot (null/empty/unchanged)
    extendedClosingDate: doc.extendedClosingDate ? doc.extendedClosingDate : { $in: [null, '', undefined] },
    extendedLastDate: doc.extendedLastDate ? doc.extendedLastDate : { $in: [null, '', undefined] },
    revisedClosingDate: doc.revisedClosingDate ? doc.revisedClosingDate : { $in: [null, '', undefined] },

    // 5. Lifecycle & Selection Stages: Must NOT indicate any pending recruitment events
    lifecycleStage: {
      $nin: [
        'INTERVIEW_UPCOMING',
        'DV_UPCOMING',
        'SELECTION_PENDING',
        'EXAM_UPCOMING',
        'RESULTS_PENDING',
        'ADMISSION_PENDING',
        'APPLICATION_OPEN'
      ]
    },
    selectionStage: {
      $nin: ['PENDING', 'IN_PROGRESS', 'UPCOMING', 'pending', 'in_progress', 'upcoming']
    },

    // 6. Corrigenda & Pending Updates: Absolute guard against any unresolved corrigendum
    hasCorrigendum: { $ne: true },
    pendingCorrigendum: { $nin: [true, 'true'] },
    corrigendumStatus: { $nin: ['pending', 'pending_review', 'unresolved'] },
    corrigendumDecision: { $nin: ['pending_corrigendum_review', 'quarantined_corrigendum'] },

    // 7. Source Trust & Classification Integrity
    needsOfficialSource: { $ne: true },
    hasSourceIntegrityIssue: { $ne: true },
    manualOverrideLock: { $ne: true },
    docVerificationStatus: { $nin: ['pending', 'pending_doc_verification', 'quarantined', 'failed'] },
    evidenceClassification: { $nin: ['NEEDS_OFFICIAL_SOURCE', 'NEEDS_REVIEW_DISABLED'] },
    isVerified: { $ne: false },
    sourceIntegrityVerified: { $ne: false },

    // 8. Ingestion & Record Status: Must NOT be in any review, quarantined, or draft state
    ingestionStatus: {
      $nin: [
        'pending_review',
        'quarantined',
        'needs_review',
        'rejected_pending_correction',
        'pending_corrigendum_review',
        'quarantined_corrigendum',
        'under_review',
        'draft'
      ]
    },
    status: {
      $nin: ['under_review', 'draft', 'quarantined', 'needs_review']
    }
  };

  // 9. Exact stage/interview applicability assertions if explicitly set
  if (doc.interviewApplicable !== undefined) {
    filter.interviewApplicable = doc.interviewApplicable;
  }
  if (doc.interviewNotApplicable !== undefined) {
    filter.interviewNotApplicable = doc.interviewNotApplicable;
  }
  if (doc.isExtensionVerified !== undefined) {
    filter.isExtensionVerified = doc.isExtensionVerified;
  }
  if (doc.extensionVerified !== undefined) {
    filter.extensionVerified = doc.extensionVerified;
  }
  if (doc.corrigendumVerified !== undefined) {
    filter.corrigendumVerified = doc.corrigendumVerified;
  }

  // 10. Optimistic Concurrency Control (OCC) Timestamp Assertion
  if (doc.updatedAt) {
    filter.updatedAt = doc.updatedAt;
  }

  return filter;
}

/**
 * Executes the expired exam cleanup logic.
 *
 * SAFETY GUARANTEES:
 * - Default mode is DRY-RUN (isDryRun = true when ENABLE_EXPIRED_EXAM_PURGE !== 'true').
 * - In dry-run mode: deletedCount is ALWAYS 0; no documents are modified or removed.
 * - Permanent deletion runs ONLY if dryRun is explicitly false AND process.env.ENABLE_EXPIRED_EXAM_PURGE === 'true'.
 * - Pre-deletion Lock Verification: checks lease validity and fencingToken before deletion.
 * - Pre-deletion Fresh Revalidation: re-reads fresh records from MongoDB to ensure state did not change.
 * - Guarded Deletion Query: database-level filtering against pending review, quarantine, corrigendum, or manual locks.
 * - Background lease renewal heartbeat maintains lock lease during execution.
 * - Calculates nextScheduledRunAt 10 days in the future at 02:00:00 AM IST.
 * - Releasing lock updates MongoDB schedule state.
 *
 * @param {Object} params
 * @param {Object} params.NotificationModel
 * @param {Object} params.CleanupScheduleModel
 * @param {boolean} [params.dryRun]
 * @param {Date} [params.nowInstant=new Date()]
 * @param {Object} [params.lockData]
 * @returns {Promise<Object>}
 */
export async function executeExpiredExamCleanup({
  NotificationModel,
  CleanupScheduleModel,
  dryRun,
  nowInstant = new Date(),
  lockData = null
}) {
  const startTime = Date.now();
  const now = nowInstant instanceof Date ? nowInstant : new Date(nowInstant);
  const todayObj = getKolkataToday(now);

  // Environment & Database Isolation Gate
  const activeDbName = mongoose.connection.name ||
    CleanupScheduleModel?.db?.name ||
    extractMongoDatabaseName(process.env.MONGODB_URI);

  const schedulerGate = isCleanupSchedulerAllowedInEnvironment({
    env: process.env,
    activeDbName
  });

  if (!schedulerGate.allowed) {
    throw new Error(`CLEANUP_EXECUTION_BLOCKED: ${schedulerGate.reason} (Database: ${activeDbName || 'unknown'})`);
  }

  // Strict safety check: purge requires explicit ENABLE_EXPIRED_EXAM_PURGE === 'true'
  const purgeEnvAllowed = process.env.ENABLE_EXPIRED_EXAM_PURGE === 'true';
  const isDryRun = dryRun !== undefined ? Boolean(dryRun) : !purgeEnvAllowed;

  console.log(`🧹 [Expired Exam Cleanup]: Starting execution (Dry-Run: ${isDryRun}, IST Date: ${todayObj.isoDate})...`);

  // Start background lease renewal heartbeat if lockData is provided
  let heartbeat = null;
  if (CleanupScheduleModel && lockData && lockData.runId) {
    heartbeat = startCleanupHeartbeat(CleanupScheduleModel, lockData, 60000);
  }

  let candidates = [];
  let deletedCount = 0;
  let status = isDryRun ? 'completed_dry_run' : 'completed';
  let errorMessage = '';

  try {
    candidates = await findExpiredExamCandidates(NotificationModel, todayObj);
    const candidateIds = candidates.map((c) => c.id);

    console.log(`🧹 [Expired Exam Cleanup]: Identified ${candidates.length} candidate(s) with confirmed expired exam dates:`);
    for (const c of candidates) {
      console.log(`   - [${c.id}] "${c.title}" (Exam Date: ${c.examDate}, Expired: ${c.daysExpired} days ago)`);
    }

    if (isDryRun) {
      console.log(`🔒 [Expired Exam Cleanup]: DRY-RUN ONLY. Zero records deleted. ENABLE_EXPIRED_EXAM_PURGE is false.`);
      deletedCount = 0;
    } else {
      if (!purgeEnvAllowed) {
        throw new Error('SECURITY_BLOCK: Permanent deletion blocked because ENABLE_EXPIRED_EXAM_PURGE !== "true"');
      }

      if (candidateIds.length > 0) {
        // Step 3a: Verify lock lease is still valid and actively held before deletion
        if (CleanupScheduleModel && lockData) {
          if (heartbeat && !heartbeat.isStillValid()) {
            throw new Error(`CONCURRENCY_ABORT: Cleanup lease renewal failed or expired during execution (${heartbeat.getFailureReason()}). Halting deletion.`);
          }
          const taskKey = lockData.taskKey || lockData.scheduleState?.taskKey || CLEANUP_TASK_KEY;
          const verifiedLock = await CleanupScheduleModel.findOne({
            taskKey,
            ownerRunId: lockData.runId,
            fencingToken: lockData.fencingToken,
            leaseExpiresAt: { $gt: new Date() }
          }).lean();

          if (!verifiedLock) {
            throw new Error(`CONCURRENCY_ABORT: Active lock lease expired or was preempted by another worker. Halting deletion.`);
          }
        }

        // Step 3b: Fresh Revalidation - re-read fresh records from MongoDB and re-verify safety predicate
        const freshDocs = await NotificationModel.find(
          { id: { $in: candidateIds } },
          EXPIRED_EXAM_SAFETY_PROJECTION
        ).lean();

        const verifiedCandidates = [];
        for (const doc of freshDocs) {
          if (shouldDeleteExpiredExamNotification(doc, todayObj)) {
            verifiedCandidates.push(doc);
          } else {
            console.warn(`🛡️ [Safety Guard]: Candidate ${doc.id} changed state after candidate discovery. Protected from deletion.`);
          }
        }

        if (verifiedCandidates.length > 0) {
          // Step 3c: Atomic per-record conditional deletion with field-level assertions & OCC
          console.log(`🧹 [Expired Exam Cleanup]: Commencing atomic per-record conditional deletion for ${verifiedCandidates.length} candidate(s)...`);

          for (const doc of verifiedCandidates) {
            // Heartbeat & Lease check before EACH record deletion
            if (CleanupScheduleModel && lockData) {
              if (heartbeat && !heartbeat.isStillValid()) {
                throw new Error(`CONCURRENCY_ABORT: Cleanup lease renewal failed or expired during deletion (${heartbeat.getFailureReason()}). Halting deletion.`);
              }
            }

            const condition = buildConditionalDeletionFilter(doc);
            let deleteRes;
            if (typeof NotificationModel.deleteOne === 'function') {
              deleteRes = await NotificationModel.deleteOne(condition);
            } else {
              deleteRes = await NotificationModel.deleteMany(condition);
            }

            const count = deleteRes?.deletedCount || 0;
            if (count > 0) {
              deletedCount += count;
              console.log(`   🗑️ [Deleted]: Candidate [${doc.id}] permanently deleted with atomic concurrency guard.`);
            } else {
              console.warn(`   🛡️ [Race Guard Protected]: Candidate [${doc.id}] was modified in database between fresh revalidation and deletion. Atomic condition failed; record preserved.`);
            }
          }
        } else {
          console.log(`✨ [Expired Exam Cleanup]: All candidates became ineligible during fresh revalidation. Zero records deleted.`);
        }
      } else {
        console.log(`✨ [Expired Exam Cleanup]: No expired notification candidates to delete.`);
      }
    }
  } catch (err) {
    status = 'failed';
    errorMessage = err.message;
    console.error(`⚠️ [Expired Exam Cleanup Error]:`, err.message);
  } finally {
    if (heartbeat) {
      await heartbeat.stop();
    }
  }

  const durationMs = Date.now() - startTime;
  const nextScheduledRunAt = calculateNextTenDayRunDate(now);

  const summary = {
    status,
    dryRun: isDryRun,
    candidatesFound: candidates.length,
    deletedCount,
    candidateIds: candidates.map((c) => c.id),
    candidates,
    durationMs,
    nextScheduledRunAt,
    todayObj,
    errorMessage
  };

  if (CleanupScheduleModel && lockData) {
    await releaseCleanupLock(CleanupScheduleModel, lockData, summary);
  }

  console.log(`📅 [Expired Exam Cleanup]: Next run scheduled for ${nextScheduledRunAt.toISOString()} (02:00:00 AM IST)`);
  return summary;
}

/**
 * Main Scheduler Tick function.
 * Called periodically (e.g. every 15 minutes or on startup).
 *
 * Logic:
 * 1. Checks if cleanup schedule state exists. If not, boots state with initial nextScheduledRunAt.
 * 2. Checks if cleanup is due (now >= nextScheduledRunAt). If not, skips without DB writes.
 * 3. Atomically acquires singleton lock. If locked by another instance, skips safely.
 * 4. Runs executeExpiredExamCleanup in dry-run mode (or live if authorized).
 *
 * @param {Object} params
 * @param {Object} params.NotificationModel
 * @param {Object} params.CleanupScheduleModel
 * @param {Date} [params.nowInstant=new Date()]
 * @param {boolean} [params.dryRunOverride]
 * @param {boolean} [params.force=false] Bypasses isCleanupDue check for manual/test triggers
 * @returns {Promise<Object>}
 */
export async function runExpiredExamCleanupSchedulerTick({
  NotificationModel,
  CleanupScheduleModel = CleanupScheduleState,
  nowInstant = new Date(),
  dryRunOverride,
  force = false
}) {
  if (!CleanupScheduleModel) {
    return { ran: false, reason: 'CLEANUP_MODEL_REQUIRED' };
  }

  // 0. Environment & Database Isolation Gate
  const activeDbName = mongoose.connection.name ||
    CleanupScheduleModel?.db?.name ||
    extractMongoDatabaseName(process.env.MONGODB_URI);

  const schedulerGate = isCleanupSchedulerAllowedInEnvironment({
    env: process.env,
    activeDbName
  });

  if (!schedulerGate.allowed) {
    console.warn(`🛑 [Cleanup Scheduler Blocked]: ${schedulerGate.reason} (Environment: ${schedulerGate.appEnv || 'unknown'}, Database: ${activeDbName || 'unknown'})`);
    return {
      ran: false,
      reason: schedulerGate.reason,
      allowed: false,
      appEnv: schedulerGate.appEnv,
      database: activeDbName
    };
  }

  const now = nowInstant instanceof Date ? nowInstant : new Date(nowInstant);

  // 1. Fetch current schedule state
  let state = await CleanupScheduleModel.findOne({ taskKey: CLEANUP_TASK_KEY }).lean();

  if (!state) {
    // Cold bootstrap: initialize state with next 02:00 AM IST
    const initialNextRun = calculateInitialUpcomingRunDate(now);
    try {
      state = await CleanupScheduleModel.create({
        taskKey: CLEANUP_TASK_KEY,
        fencingToken: 0,
        nextScheduledRunAt: initialNextRun,
        lastExecutionStatus: 'idle',
        lastExecutionSummary: {
          dryRun: true,
          candidatesFound: 0,
          deletedCount: 0,
          candidateIds: []
        }
      });
      console.log(`🌱 [Cleanup Scheduler]: Initialized schedule state. First run scheduled at: ${initialNextRun.toISOString()} (02:00 AM IST)`);
    } catch (_) {
      state = await CleanupScheduleModel.findOne({ taskKey: CLEANUP_TASK_KEY }).lean();
    }
  }

  // 2. Due check
  const due = force || isCleanupDue(state, now);
  if (!due) {
    return {
      ran: false,
      reason: 'NOT_DUE',
      nextScheduledRunAt: state?.nextScheduledRunAt,
      lastRunAt: state?.lastRunAt
    };
  }

  // 3. Atomic singleton lock acquisition
  const lock = await acquireCleanupLock(CleanupScheduleModel, { now });
  if (!lock.acquired) {
    return {
      ran: false,
      reason: lock.reason || 'LOCK_NOT_ACQUIRED',
      existingOwner: lock.existingOwner,
      existingExpiresAt: lock.existingExpiresAt
    };
  }

  // 4. Execute cleanup
  try {
    const result = await executeExpiredExamCleanup({
      NotificationModel,
      CleanupScheduleModel,
      dryRun: dryRunOverride,
      nowInstant: now,
      lockData: lock
    });

    return {
      ran: true,
      ...result
    };
  } catch (err) {
    // Ensure lock is released in case of uncaught error
    await releaseCleanupLock(CleanupScheduleModel, lock, {
      status: 'failed',
      errorMessage: err.message,
      dryRun: true
    }).catch(() => {});
    throw err;
  }
}
