// server/cleanup/expiredExamCleanupHelper.js
// ============================================================================
// AK E-SEVAI — 10-DAY AUTOMATIC EXPIRED EXAM NOTIFICATION CLEANUP SYSTEM
// Schedule: Every 10 Days at 02:00:00 AM Asia/Kolkata (IST = UTC+05:30)
// Concurrency: Distributed Singleton Locking with Lease & Monotonic Fencing Token
// Safety: Default DRY-RUN mode (ENABLE_EXPIRED_EXAM_PURGE !== 'true')
// ============================================================================

import mongoose from 'mongoose';
import crypto from 'crypto';
import os from 'os';
import {
  getKolkataToday,
  calculateExamStatus
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
 * Pure predicate evaluating whether a notification qualifies for expired exam deletion.
 *
 * STRICT VERIFIED POLICY:
 * 1. Must NOT be null/undefined.
 * 2. examDate must be a non-empty string.
 * 3. examStatus must NOT be invalid (isInvalid === true -> false).
 * 4. examStatus code must NOT be 'NOT_ANNOUNCED' (unannounced/textual dates -> false).
 * 5. Must have a valid numeric latestEpochDays.
 * 6. Must NOT be scheduled for today (isToday === true -> false).
 * 7. Must NOT be upcoming (isUpcoming === true -> false).
 * 8. Must be marked completed AND todayObj.epochDays > examStatus.latestEpochDays.
 *
 * NEVER deletes notifications merely because their application deadline (closingDate) has passed.
 * NEVER deletes unannounced, tentative, missing, or invalid dates.
 *
 * @param {Object} notif
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {boolean}
 */
export function shouldDeleteExpiredExamNotification(notif, todayObj = getKolkataToday()) {
  if (!notif) return false;
  const rawExamDate = notif.examDate;
  if (!rawExamDate || typeof rawExamDate !== 'string' || !rawExamDate.trim()) {
    return false;
  }

  const examStatus = calculateExamStatus(rawExamDate, todayObj, { lang: 'en' });

  // 1. Must NOT be invalid
  if (examStatus.isInvalid) return false;

  // 2. Must NOT be unannounced, seasonal estimate, or text without specific calendar date
  if (examStatus.code === 'NOT_ANNOUNCED') return false;

  // 3. Must have a valid numeric epochDays for the latest exam session
  if (typeof examStatus.latestEpochDays !== 'number' || isNaN(examStatus.latestEpochDays)) {
    return false;
  }

  // 4. Must NOT be scheduled for today
  if (examStatus.isToday === true) return false;

  // 5. Must NOT be upcoming
  if (examStatus.isUpcoming === true) return false;

  // 6. Must be marked completed AND today > latestEpochDays
  if (examStatus.isCompleted === true && todayObj.epochDays > examStatus.latestEpochDays) {
    return true;
  }

  return false;
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
 * @returns {Promise<{ acquired: boolean, runId?: string, fencingToken?: number, leaseExpiresAt?: Date, reason?: string, existingOwner?: string, scheduleState?: Object }>}
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
      taskKey: lockData.scheduleState?.taskKey || CLEANUP_TASK_KEY,
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
 * Strictly read-only query.
 *
 * @param {Object} NotificationModel
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Promise<Array<Object>>}
 */
export async function findExpiredExamCandidates(NotificationModel, todayObj = getKolkataToday()) {
  if (!NotificationModel) return [];

  // Narrow query to notifications with non-empty examDate
  const rawDocs = await NotificationModel.find(
    {
      examDate: { $exists: true, $nin: [null, ''] }
    },
    {
      id: 1,
      title: 1,
      category: 1,
      organization: 1,
      examDate: 1,
      closingDate: 1,
      ingestionStatus: 1
    }
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
        latestEpochDays: examStatus.latestEpochDays,
        daysExpired,
        ingestionStatus: doc.ingestionStatus
      });
    }
  }

  return candidates;
}

/**
 * Executes the expired exam cleanup logic.
 *
 * SAFETY GUARANTEES:
 * - Default mode is DRY-RUN (isDryRun = true when ENABLE_EXPIRED_EXAM_PURGE !== 'true').
 * - In dry-run mode: deletedCount is ALWAYS 0; no documents are modified or removed.
 * - Permanent deletion runs ONLY if dryRun is explicitly false AND process.env.ENABLE_EXPIRED_EXAM_PURGE === 'true'.
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
        const deleteRes = await NotificationModel.deleteMany({ id: { $in: candidateIds } });
        deletedCount = deleteRes.deletedCount || 0;
        console.log(`🗑️ [Expired Exam Cleanup]: Permanently deleted ${deletedCount} expired notification record(s).`);
      } else {
        console.log(`✨ [Expired Exam Cleanup]: No expired notification candidates to delete.`);
      }
    }
  } catch (err) {
    status = 'failed';
    errorMessage = err.message;
    console.error(`⚠️ [Expired Exam Cleanup Error]:`, err.message);
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

