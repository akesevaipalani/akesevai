// server/ingestion/ingestionLockHelper.js
// Durable Monotonic Fencing-Token Lease Manager & Crash Recovery Helper
// Note: IngestionLock documents are NEVER TTL-deleted so fencingToken grows monotonically forever.

import crypto from 'crypto';
import os from 'os';

export const DEFAULT_LOCK_KEY = 'global_notification_ingestion';
export const LEASE_DURATION_MS = 180000; // 180 seconds
export const HEARTBEAT_INTERVAL_MS = 45000; // 45 seconds

export function generateRunId() {
  return `run_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

export function generateJobId() {
  return `job_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

export function getOwnerInstanceId() {
  return `${os.hostname()}:${process.pid}`;
}

/**
 * Checks whether the current MongoDB connection supports multi-document ACID transactions
 * (replica set or mongos). Standalone mongod or unit mock falls back gracefully.
 */
export async function supportsMongoTransactions(mongooseConnection, options = {}) {
  if (options.forceStandaloneMode) {
    return false;
  }
  if (!mongooseConnection || mongooseConnection.readyState !== 1 || !mongooseConnection.db) {
    return false;
  }
  try {
    const admin = mongooseConnection.db.admin();
    const hello = await admin.command({ hello: 1 }).catch(() => admin.command({ isMaster: 1 }));
    return Boolean(hello && (hello.setName || hello.msg === 'isdbgrid'));
  } catch (_) {
    return false;
  }
}

/**
 * Atomically acquires the distributed ingestion lock and increments the monotonic fencingToken.
 * Handles cold bootstrap E11000 duplicate-key races safely without overwriting a concurrent winner.
 *
 * @param {Object} IngestionLockModel
 * @param {Object} [options]
 * @returns {Promise<{ acquired: boolean, runId?: string, fencingToken?: number, reason?: string, existingOwnerRunId?: string, existingExpiresAt?: Date }>}
 */
export async function acquireIngestionLock(IngestionLockModel, options = {}) {
  if (!IngestionLockModel) {
    return { acquired: false, reason: 'LOCK_MODEL_REQUIRED' };
  }

  const lockKey = options.lockKey || DEFAULT_LOCK_KEY;
  const leaseMs = options.leaseMs || LEASE_DURATION_MS;
  const runId = options.runId || generateRunId();
  const ownerInstance = options.ownerInstance || getOwnerInstanceId();
  const now = options.now instanceof Date ? options.now : new Date();
  const expiresAt = new Date(now.getTime() + leaseMs);

  // Step 1: Atomically claim an existing unlocked (ownerRunId === null) or expired (leaseExpiresAt <= now) lock doc
  const claimed = await IngestionLockModel.findOneAndUpdate(
    {
      lockKey,
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
        heartbeatAt: now,
        leaseExpiresAt: expiresAt
      }
    },
    { new: true }
  );

  if (claimed && claimed.ownerRunId === runId && typeof claimed.fencingToken === 'number') {
    return {
      acquired: true,
      lockKey,
      runId,
      fencingToken: claimed.fencingToken,
      expiresAt: claimed.leaseExpiresAt
    };
  }

  // Step 2: Check whether lock document already exists (active unexpired lock vs cold bootstrap)
  const existing = await IngestionLockModel.findOne({ lockKey }).lean();
  if (existing) {
    if (existing.ownerRunId && existing.leaseExpiresAt && new Date(existing.leaseExpiresAt) > now) {
      return {
        acquired: false,
        reason: 'LOCK_HELD',
        existingOwnerRunId: existing.ownerRunId,
        existingFencingToken: existing.fencingToken,
        existingExpiresAt: existing.leaseExpiresAt
      };
    }

    // Rare boundary race where lock expired right between Step 1 & Step 2 -> retry Step 1 once
    const retryClaim = await IngestionLockModel.findOneAndUpdate(
      {
        lockKey,
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
          heartbeatAt: now,
          leaseExpiresAt: expiresAt
        }
      },
      { new: true }
    );

    if (retryClaim && retryClaim.ownerRunId === runId) {
      return {
        acquired: true,
        lockKey,
        runId,
        fencingToken: retryClaim.fencingToken,
        expiresAt: retryClaim.leaseExpiresAt
      };
    }

    return {
      acquired: false,
      reason: 'LOCK_HELD_RACE',
      existingOwnerRunId: existing.ownerRunId,
      existingFencingToken: existing.fencingToken,
      existingExpiresAt: existing.leaseExpiresAt
    };
  }

  // Step 3: Cold bootstrap (first run ever when no lock document exists yet)
  try {
    const bootstrapped = await IngestionLockModel.create({
      lockKey,
      fencingToken: 1,
      ownerRunId: runId,
      ownerInstance,
      acquiredAt: now,
      heartbeatAt: now,
      leaseExpiresAt: expiresAt
    });
    return {
      acquired: true,
      lockKey,
      runId,
      fencingToken: bootstrapped.fencingToken,
      expiresAt: bootstrapped.leaseExpiresAt
    };
  } catch (err) {
    // Handle concurrent bootstrap E11000 DuplicateKey safely — winner keeps the lock
    if (err?.code === 11000 || String(err?.message || '').includes('E11000')) {
      return {
        acquired: false,
        reason: 'BOOTSTRAP_RACE_LOST'
      };
    }
    throw err;
  }
}

/**
 * Renews an active lease strictly verifying lockKey, ownerRunId, fencingToken, and valid expiry.
 */
export async function renewIngestionLock(IngestionLockModel, { lockKey = DEFAULT_LOCK_KEY, runId, fencingToken, leaseMs = LEASE_DURATION_MS, now = new Date() }) {
  if (!IngestionLockModel || !runId || typeof fencingToken !== 'number') {
    return { renewed: false, reason: 'INVALID_LOCK_PARAMS' };
  }

  const nextExpiry = new Date(now.getTime() + leaseMs);
  const updated = await IngestionLockModel.findOneAndUpdate(
    {
      lockKey,
      ownerRunId: runId,
      fencingToken,
      leaseExpiresAt: { $gt: now }
    },
    {
      $set: {
        heartbeatAt: now,
        leaseExpiresAt: nextExpiry
      }
    },
    { new: true }
  );

  if (!updated) {
    return { renewed: false, reason: 'LEASE_LOST_OR_FENCED' };
  }
  return { renewed: true, leaseExpiresAt: nextExpiry, fencingToken: updated.fencingToken };
}

/**
 * Authoritative ownership verification helper (also usable inside a MongoDB session).
 */
export async function assertLockOwnership(IngestionLockModel, { lockKey = DEFAULT_LOCK_KEY, runId, fencingToken, now = new Date(), session = null }) {
  if (!IngestionLockModel) return true; // Unit-test mock without lock model
  const query = {
    lockKey,
    ownerRunId: runId,
    fencingToken,
    leaseExpiresAt: { $gt: now }
  };
  const findCall = IngestionLockModel.findOne(query);
  const doc = session && typeof findCall?.session === 'function' ? await findCall.session(session) : await findCall;
  if (!doc) {
    const err = new Error(`FENCING_OWNERSHIP_LOST: Lock not held by runId=${runId}, token=${fencingToken}`);
    err.code = 'FENCING_OWNERSHIP_LOST';
    throw err;
  }
  return true;
}

/**
 * Safely releases the lock ONLY if owned by the exact (ownerRunId, fencingToken).
 * Clears ownership without deleting the lock document so fencingToken never resets.
 */
export async function releaseIngestionLock(IngestionLockModel, { lockKey = DEFAULT_LOCK_KEY, runId, fencingToken, now = new Date() }) {
  if (!IngestionLockModel || !runId || typeof fencingToken !== 'number') {
    return { released: false };
  }
  const res = await IngestionLockModel.updateOne(
    {
      lockKey,
      ownerRunId: runId,
      fencingToken
    },
    {
      $set: {
        ownerRunId: null,
        leaseExpiresAt: now,
        releasedAt: now
      }
    }
  );
  return { released: (res?.modifiedCount ?? res?.nModified ?? 0) > 0 };
}

/**
 * Recovers crashed/stale IngestionJob documents whose lease expired mid-run.
 * - Preserves 'completed' source checkpoints strictly untouched.
 * - Resets ONLY 'running' checkpoints back to 'pending' so interrupted source retries idempotently.
 * - Leaves 'pending' checkpoints intact.
 */
export async function recoverStaleIngestionJobs(IngestionJobModel, options = {}) {
  if (!IngestionJobModel) {
    return { recoveredCount: 0, failedCount: 0, recoveredJobIds: [] };
  }

  const now = options.now instanceof Date ? options.now : new Date();
  const maxAttempts = options.maxAttempts || 3;

  const staleJobs = await IngestionJobModel.find({
    status: 'running',
    leaseExpiresAt: { $lte: now }
  }).lean();

  let recoveredCount = 0;
  let failedCount = 0;
  const recoveredJobIds = [];

  for (const job of staleJobs) {
    const attempts = job.attemptCount || 1;
    const nextQueue = (job.sourceQueue || []).map((slot) => {
      if (slot.status === 'running') {
        return {
          ...slot,
          status: 'pending',
          lastError: slot.lastError || 'Reset to pending after worker crash/lease expiry'
        };
      }
      return slot;
    });

    const nextStatus = attempts < maxAttempts ? 'pending' : 'failed';
    const crashNote = `Recovered from stale lease (runId=${job.ownerRunId || 'unknown'}, token=${job.fencingToken ?? 0}) at ${now.toISOString()}`;

    const res = await IngestionJobModel.updateOne(
      {
        jobId: job.jobId,
        status: 'running',
        ownerRunId: job.ownerRunId,
        fencingToken: job.fencingToken
      },
      {
        $set: {
          status: nextStatus,
          sourceQueue: nextQueue,
          currentSourceKey: '',
          lastRecoveredAt: now,
          completedAt: nextStatus === 'failed' ? now : null
        },
        $push: {
          errors: crashNote
        }
      }
    );

    if ((res?.modifiedCount ?? res?.nModified ?? 0) > 0) {
      if (nextStatus === 'pending') recoveredCount++;
      else failedCount++;
      recoveredJobIds.push(job.jobId);
    }
  }

  return { recoveredCount, failedCount, recoveredJobIds };
}

