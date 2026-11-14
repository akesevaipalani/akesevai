// server/ingestion/ingestionRoutes.js
// Modular Express Routes for Notifications, Trust-Gated Approval/Quarantine & Durable Ingestion

import crypto from 'crypto';
import {
  getKolkataToday,
  enrichNotificationWithDateStatus
} from '../../src/utils/notificationDateHelper.js';
import { OFFICIAL_EXAM_SOURCES } from './sourcesConfig.js';
import {
  generateNotificationFingerprint,
  buildIdentityFingerprint,
  computeContentHash
} from './deduplicationHelper.js';
import { extractSnapshotValues } from './corrigendumHelper.js';
import { generateJobId } from './ingestionLockHelper.js';
import {
  runAllIngestionJobs,
  getIngestionStatus,
  recomputeJobSummary
} from './ingestionManager.js';

export const normalizeCategoryStr = (cat) => {
  if (!cat) return 'all';
  const c = String(cat).toLowerCase().replace(/[^a-z]/g, '');
  if (c.includes('bank')) return 'banking';
  if (c.includes('upsc') || c.includes('central') || c.includes('ias')) return 'upsc';
  if (c.includes('ssc') || c.includes('cgl') || c.includes('chsl')) return 'ssc';
  if (c.includes('rail') || c.includes('rrb') || c.includes('rrc')) return 'railway';
  if (c.includes('tnpsc') || c.includes('state') || c.includes('vao')) return 'tnpsc';
  if (c.includes('police') || c.includes('defence') || c.includes('army') || c.includes('tnusrb')) return 'police_defence';
  if (c.includes('teach') || c.includes('trb') || c.includes('tet') || c.includes('school')) return 'teaching';
  if (c.includes('med') || c.includes('nurse') || c.includes('mrb') || c.includes('doctor') || c.includes('health') || c.includes('hospital')) return 'medical';
  if (c.includes('enter') || c.includes('entrance') || c.includes('jee') || c.includes('neet') || c.includes('cuet') || c.includes('gate') || c.includes('tancet')) return 'entrance';
  if (c.includes('psu') || c.includes('iocl') || c.includes('ongc') || c.includes('bhel') || c.includes('tneb') || c.includes('tech')) return 'psu';
  return cat;
};

/**
 * Constant-time X-Ingestion-Secret / X-Cron-Secret validation (fail-closed if unset).
 */
export function verifyIngestionSecretHeader(req, env = process.env) {
  const secretHeader = req?.headers?.['x-ingestion-secret'] || req?.headers?.['x-cron-secret'];
  const rawEnvSecret = typeof env.INGESTION_SECRET_KEY === 'string' && env.INGESTION_SECRET_KEY.trim().length > 0
    ? env.INGESTION_SECRET_KEY.trim()
    : (typeof env.INGESTION_SECRET === 'string' ? env.INGESTION_SECRET.trim() : '');

  if (!rawEnvSecret || typeof secretHeader !== 'string' || secretHeader.trim().length === 0) {
    return false;
  }

  const headerBuf = Buffer.from(secretHeader.trim(), 'utf8');
  const envBuf = Buffer.from(rawEnvSecret, 'utf8');
  if (headerBuf.length !== envBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(headerBuf, envBuf);
}

/**
 * Registers notification & automated ingestion endpoints on Express app.
 * Separated so synthetic unit/integration tests can verify HTTP behavior in isolation.
 */
export function registerNotificationAndIngestionRoutes(app, deps) {
  const {
    Notification,
    IngestionJob = null,
    IngestionLock = null,
    IngestionSourceHealth = null,
    IngestionRunLog = null,
    mongooseConnection = null,
    resolveAuthContext,
    syncAllVerifiedNotificationsFeed,
    VERIFIED_ALL_EXAM_NOTIFICATIONS = [],
    env = process.env,
    ingestionRunner = runAllIngestionJobs
  } = deps;

  const isDbReady = () => !mongooseConnection || mongooseConnection.readyState === 1;

  // 1. GET all notifications (Public only sees 'published' or legacy; pending/quarantined/rejected isolated)
  app.get('/api/notifications', async (req, res) => {
    const { category, status, search, includePending } = req.query || {};
    const today = getKolkataToday();
    const auth = resolveAuthContext(req);

    let rawList = [];
    try {
      if (isDbReady()) {
        const filter = {};
        if (category && category !== 'all') {
          const norm = normalizeCategoryStr(category);
          filter.$or = [{ category }, { category: norm }];
        }

        if (!auth.isAdmin || includePending !== 'true') {
          const publishedCondition = {
            $or: [
              { ingestionStatus: 'published' },
              { ingestionStatus: { $exists: false } },
              { ingestionStatus: null },
              { ingestionStatus: '' }
            ]
          };
          if (filter.$or) {
            filter.$and = [{ $or: filter.$or }, publishedCondition];
            delete filter.$or;
          } else {
            filter.$or = publishedCondition.$or;
          }
        } else if (req.query.ingestionStatus && req.query.ingestionStatus !== 'all') {
          filter.ingestionStatus = req.query.ingestionStatus;
        }

        rawList = await Notification.find(filter).sort({ updatedAt: -1, _id: -1 }).maxTimeMS(4000).lean();
      }
    } catch (dbErr) {
      console.warn('⚠️ [MongoDB Read Warning]: Falling back to local verified notifications registry.', dbErr.message);
    }

    if (!rawList || rawList.length === 0) {
      rawList = VERIFIED_ALL_EXAM_NOTIFICATIONS.filter((item) => {
        if (!category || category === 'all') return true;
        return normalizeCategoryStr(item.category) === normalizeCategoryStr(category);
      });
      if (!auth.isAdmin || includePending !== 'true') {
        rawList = rawList.filter((item) => !item.ingestionStatus || item.ingestionStatus === 'published');
      }
    }

    let processedList = rawList.map((item) => enrichNotificationWithDateStatus(item, today));

    if (search && String(search).trim()) {
      const q = String(search).trim().toLowerCase();
      processedList = processedList.filter((item) => {
        const text = `${item.service} ${item.organization || ''} ${item.postName || ''} ${item.qualification || ''} ${item.importantDetails || ''} ${item.category || ''} ${item.formattedExamDate} ${item.formattedClosingDate}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (status === 'active' || status === 'active_app' || status === 'open') {
      processedList = processedList.filter((n) => n.appStatus.isOpen);
    } else if (status === 'upcoming_exams' || status === 'upcoming') {
      processedList = processedList.filter((n) => n.examStatus.isUpcoming || n.examStatus.isToday);
    } else if (status === 'expired' || status === 'app_closed') {
      processedList = processedList.filter((n) => n.appStatus.isExpired);
    } else if (status === 'exam_completed') {
      processedList = processedList.filter((n) => n.examStatus.isCompleted);
    }

    processedList.sort((a, b) => {
      if (a.appStatus.isOpen !== b.appStatus.isOpen) {
        return a.appStatus.isOpen ? -1 : 1;
      }
      if (a.examStatus.isUpcoming !== b.examStatus.isUpcoming) {
        return a.examStatus.isUpcoming ? -1 : 1;
      }
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });

    return res.json(processedList);
  });

  // 2. Sync Master Exam Registry (Admin Only)
  app.post('/api/notifications/sync-all', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      await syncAllVerifiedNotificationsFeed();
      const all = await Notification.find({
        $or: [{ ingestionStatus: 'published' }, { ingestionStatus: { $exists: false } }, { ingestionStatus: null }, { ingestionStatus: '' }]
      }).sort({ updatedAt: -1 }).lean();
      res.json({
        success: true,
        message: '✅ All Official Govt & Competitive Exam Notifications synced successfully to MongoDB Atlas!',
        count: all.length,
        notifications: all
      });
    } catch (err) {
      res.status(500).json({ error: 'SYNC_ERROR', message: err.message });
    }
  });

  // 3. Sync Banking Exam Feed Endpoint (Admin Only)
  app.post('/api/notifications/sync-banking', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      await syncAllVerifiedNotificationsFeed();
      const all = await Notification.find({
        $or: [{ ingestionStatus: 'published' }, { ingestionStatus: { $exists: false } }, { ingestionStatus: null }, { ingestionStatus: '' }]
      }).sort({ updatedAt: -1 }).lean();
      res.json({
        success: true,
        message: '✅ Verified Banking & Govt Exam Notifications synced successfully to MongoDB Atlas!',
        count: all.length,
        notifications: all
      });
    } catch (err) {
      res.status(500).json({ error: 'SYNC_ERROR', message: err.message });
    }
  });

  // 4. Create / Update Notification (Admin Only — sets manualOverrideLock: true)
  app.post('/api/notifications', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const data = req.body || {};
      if (!data.service) {
        return res.status(400).json({ error: 'Notification service/title is required' });
      }

      const id = data.id || `notif-${Date.now()}`;
      const keyFilter = data.id
        ? { id: data.id }
        : { service: data.service, organization: data.organization || '' };

      const contentHash = computeContentHash(data);
      const identityFingerprint = buildIdentityFingerprint({ ...data, id });
      const fingerprint = generateNotificationFingerprint(data);

      const updatePayload = {
        ...data,
        id,
        contentHash,
        identityFingerprint,
        fingerprint,
        manualOverrideLock: true,
        ingestionStatus: data.ingestionStatus || 'published',
        ingestionSource: data.ingestionSource || 'manual_admin',
        updatedAt: new Date()
      };

      const result = await Notification.findOneAndUpdate(
        keyFilter,
        { $set: updatePayload },
        { upsert: true, new: true }
      );
      const obj = result.toObject ? result.toObject() : result;
      res.json({ success: true, ...obj });
    } catch (err) {
      res.status(500).json({ error: 'SAVE_ERROR', message: err.message });
    }
  });

  // 5. Delete Notification (Admin Only)
  app.delete('/api/notifications/:id', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      await Notification.deleteMany({ id: req.params.id });
      res.json({ success: true, message: `Notification ${req.params.id} deleted` });
    } catch (err) {
      res.status(500).json({ error: 'DELETE_ERROR', message: err.message });
    }
  });

  // 6. Trigger Automated Ingestion Job (Admin OR valid X-Ingestion-Secret)
  app.post('/api/notifications/ingest-job', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      const isSecretValid = verifyIngestionSecretHeader(req, env);

      if (!auth.isAdmin && !isSecretValid) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Admin authorization or valid X-Ingestion-Secret header is required to trigger ingestion.'
        });
      }

      const { sourceKey, dryRun, enqueueOnly, maxSources } = req.query || {};

      // Pure durable enqueue mode (creates/coalesces DB job without running detached background promises)
      if (enqueueOnly === 'true' && IngestionJob) {
        const existingPending = await IngestionJob.findOne({ status: { $in: ['pending', 'running'] } }).lean();
        if (existingPending) {
          return res.status(202).json({
            success: true,
            coalesced: true,
            jobId: existingPending.jobId,
            status: existingPending.status,
            message: 'An active durable ingestion job already exists.'
          });
        }

        const sources = sourceKey
          ? OFFICIAL_EXAM_SOURCES.filter((s) => s.key === sourceKey)
          : OFFICIAL_EXAM_SOURCES.filter((s) => s.enabled);

        const jobId = generateJobId();
        const queue = sources.map((s) => ({
          sourceKey: s.key,
          status: 'pending',
          attempts: 0,
          stats: { itemsFound: 0, newlyInserted: 0, autoPublished: 0, pendingReview: 0, quarantined: 0, corrigendaUpdated: 0, duplicatesSkipped: 0, rejectedSkipped: 0 },
          lastError: ''
        }));

        await IngestionJob.create({
          jobId,
          triggerType: isSecretValid ? 'external_cron' : 'manual_admin',
          status: 'pending',
          dryRun: dryRun === 'true',
          sourceKeyFilter: sourceKey || '',
          sourceQueue: queue,
          summary: recomputeJobSummary(queue),
          errors: [],
          createdAt: new Date()
        });

        return res.status(202).json({
          success: true,
          jobId,
          status: 'pending',
          sourcesQueued: queue.length,
          message: `Durable ingestion job ${jobId} enqueued.`
        });
      }

      const parsedMax = maxSources ? parseInt(String(maxSources), 10) : undefined;
      console.log(`📡 [Ingestion Trigger]: Running durable ingestion job (source: ${sourceKey || 'ALL'}, dryRun: ${dryRun || 'false'})...`);

      const summary = await ingestionRunner(Notification, {
        sourceKey,
        dryRun: dryRun === 'true',
        maxSources: Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : undefined,
        triggerType: isSecretValid ? 'external_cron' : 'manual_admin',
        env,
        models: {
          IngestionJob,
          IngestionLock,
          IngestionSourceHealth,
          IngestionRunLog,
          mongooseConnection
        }
      });

      res.json({
        success: true,
        message: `Ingestion job ${summary.status || 'completed'}. New: ${summary.newRecordsInserted}, Updated: ${summary.corrigendaUpdatedCount || 0}, Quarantined: ${summary.quarantinedCount || 0}, Duplicates: ${summary.duplicatesSkipped}.`,
        summary
      });
    } catch (err) {
      if (err.code === 'CONCURRENT_INGESTION_LOCKED' || err.message === 'INGESTION_IN_PROGRESS') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'INGESTION_IN_PROGRESS',
          message: 'An automated ingestion job already holds the distributed lock. Please wait for it to finish.'
        });
      }
      if (err.code === 'FENCING_OWNERSHIP_LOST') {
        return res.status(409).json({
          success: false,
          error: 'CONFLICT',
          code: 'FENCING_OWNERSHIP_LOST',
          message: 'Worker lease expired or was fenced out by a newer job.'
        });
      }
      console.error('Ingestion job error:', err.message);
      res.status(500).json({ success: false, error: 'INGESTION_ERROR' });
    }
  });

  // 7. Fetch Pending Review Notifications (Admin Only)
  app.get('/api/notifications/pending', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const today = getKolkataToday();
      const pendingList = await Notification.find({ ingestionStatus: 'pending_review' })
        .sort({ updatedAt: -1, _id: -1 })
        .maxTimeMS(4000)
        .lean();

      const enriched = (pendingList || []).map((item) => enrichNotificationWithDateStatus(item, today));
      res.json({ success: true, count: enriched.length, notifications: enriched });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 8. Fetch Quarantined Notifications (Admin Only)
  app.get('/api/notifications/quarantined', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const today = getKolkataToday();
      const quarantinedList = await Notification.find({ ingestionStatus: 'quarantined' })
        .sort({ updatedAt: -1, _id: -1 })
        .maxTimeMS(4000)
        .lean();

      const enriched = (quarantinedList || []).map((item) => enrichNotificationWithDateStatus(item, today));
      res.json({ success: true, count: enriched.length, notifications: enriched });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 9. Fetch Revision History for a Notification (Admin Only)
  app.get('/api/notifications/:id/revisions', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const doc = await Notification.findOne(
        { id: req.params.id },
        {
          id: 1,
          service: 1,
          revisionCount: 1,
          hasCorrigendum: 1,
          corrigendumSummary: 1,
          manualOverrideLock: 1,
          revisionHistory: 1
        }
      ).lean();
      if (!doc) {
        return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found' });
      }
      res.json({
        success: true,
        id: doc.id,
        service: doc.service,
        revisionCount: doc.revisionCount || 0,
        hasCorrigendum: Boolean(doc.hasCorrigendum),
        corrigendumSummary: doc.corrigendumSummary || '',
        manualOverrideLock: Boolean(doc.manualOverrideLock),
        revisionHistory: doc.revisionHistory || []
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 10. Approve Pending / Quarantined Notification & Publish to Public Feed (Admin Only)
  app.post('/api/notifications/:id/approve', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }
      const existing = await Notification.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found' });
      }

      const now = new Date();
      const prevSnap = extractSnapshotValues(existing);
      const revEntry = {
        revisionNo: (existing.revisionCount || 0) + 1,
        revisedAt: now,
        changeType: 'manual_approve',
        triggerSource: 'admin_panel',
        verifiedDocUrl: existing.detailsLink || '',
        summary: `Approved from ${existing.ingestionStatus || 'pending_review'} by Admin`,
        changedFields: ['ingestionStatus', 'isVerified'],
        previousValues: prevSnap,
        newValues: prevSnap,
        actor: 'admin'
      };

      const notif = await Notification.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            ingestionStatus: 'published',
            isVerified: true,
            autoPublished: false,
            quarantineReason: '',
            manualOverrideLock: true,
            updatedAt: now
          },
          $inc: { revisionCount: 1 },
          $push: { revisionHistory: { $each: [revEntry], $slice: -20 } }
        },
        { new: true }
      );

      res.json({
        success: true,
        message: '✅ Notification approved and published to live /notifications page!',
        notification: notif
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 11. Reject Candidate with Soft-Tombstone Memory (Admin Only)
  // Prevents rejected notices with unchanged contentHash from being re-ingested every run.
  app.post('/api/notifications/:id/reject', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      if (!auth.isAdmin) {
        return res.status(403).json({ success: false, error: 'FORBIDDEN', message: 'Admin authorization required.' });
      }

      if (req.query?.purge === 'true') {
        await Notification.deleteMany({ id: req.params.id });
        return res.json({
          success: true,
          purged: true,
          message: `Notification ${req.params.id} permanently purged.`
        });
      }

      const existing = await Notification.findOne({ id: req.params.id }).lean();
      if (!existing) {
        return res.status(404).json({ success: false, error: 'NOT_FOUND', message: 'Notification not found' });
      }

      const now = new Date();
      const rejectedHash = existing.contentHash || computeContentHash(existing);
      const reason = String(req.body?.reason || 'Rejected by Admin review').slice(0, 300);

      await Notification.findOneAndUpdate(
        { id: req.params.id },
        {
          $set: {
            ingestionStatus: 'rejected',
            isVerified: false,
            autoPublished: false,
            status: 'inactive',
            rejectedAt: now,
            rejectedReason: reason,
            rejectedContentHash: rejectedHash,
            updatedAt: now
          }
        },
        { new: true }
      );

      res.json({
        success: true,
        message: `Notification ${req.params.id} rejected and stored in rejection memory.`
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'INTERNAL_ERROR' });
    }
  });

  // 12. Ingestion Diagnostics & Persistent Source-Health Endpoint (SECURED: Admin OR Ingestion Secret)
  app.get('/api/notifications/ingestion-status', async (req, res) => {
    try {
      const auth = resolveAuthContext(req);
      const isSecretValid = verifyIngestionSecretHeader(req, env);
      if (!auth.isAdmin && !isSecretValid) {
        return res.status(403).json({
          success: false,
          error: 'FORBIDDEN',
          message: 'Admin authorization or valid X-Ingestion-Secret header is required.'
        });
      }

      const memoryStatus = getIngestionStatus();
      let publishedCount = 0;
      let pendingCount = 0;
      let quarantinedCount = 0;
      let rejectedCount = 0;
      let totalCount = 0;
      let persistentSourceHealth = [];
      let latestRuns = [];
      let activeJob = null;
      let lockState = null;

      if (isDbReady()) {
        const countPromises = [
          Notification.countDocuments({
            $or: [
              { ingestionStatus: 'published' },
              { ingestionStatus: { $exists: false } },
              { ingestionStatus: null },
              { ingestionStatus: '' }
            ]
          }),
          Notification.countDocuments({ ingestionStatus: 'pending_review' }),
          Notification.countDocuments({ ingestionStatus: 'quarantined' }),
          Notification.countDocuments({ ingestionStatus: 'rejected' }),
          Notification.countDocuments({})
        ];

        const [pub, pend, quar, rej, tot] = await Promise.all(countPromises);
        publishedCount = pub;
        pendingCount = pend;
        quarantinedCount = quar;
        rejectedCount = rej;
        totalCount = tot;

        if (IngestionSourceHealth) {
          persistentSourceHealth = await IngestionSourceHealth.find({}, {
            _id: 0,
            sourceKey: 1,
            sourceName: 1,
            category: 1,
            lastAttemptAt: 1,
            lastSuccessAt: 1,
            lastFailureAt: 1,
            lastStatus: 1,
            lastDurationMs: 1,
            lastItemsExtracted: 1,
            lastInserted: 1,
            lastUpdated: 1,
            lastQuarantined: 1,
            consecutiveFailures: 1,
            totalRuns: 1,
            totalSuccesses: 1,
            totalFailures: 1
          }).sort({ sourceKey: 1 }).lean();
        }

        if (IngestionRunLog) {
          latestRuns = await IngestionRunLog.find({}, { _id: 0, errors: 0 })
            .sort({ startedAt: -1 })
            .limit(10)
            .lean();
        }

        if (IngestionJob) {
          activeJob = await IngestionJob.findOne(
            { status: { $in: ['running', 'pending'] } },
            { _id: 0, jobId: 1, status: 1, triggerType: 1, attemptCount: 1, startedAt: 1, heartbeatAt: 1, summary: 1, currentSourceKey: 1 }
          ).sort({ createdAt: -1 }).lean();
        }

        if (IngestionLock) {
          const lockDoc = await IngestionLock.findOne({}, { _id: 0, lockKey: 1, fencingToken: 1, ownerRunId: 1, heartbeatAt: 1, leaseExpiresAt: 1 }).lean();
          if (lockDoc) {
            lockState = {
              lockKey: lockDoc.lockKey,
              fencingToken: lockDoc.fencingToken,
              locked: Boolean(lockDoc.ownerRunId && lockDoc.leaseExpiresAt && new Date(lockDoc.leaseExpiresAt) > new Date()),
              heartbeatAt: lockDoc.heartbeatAt,
              leaseExpiresAt: lockDoc.leaseExpiresAt
            };
          }
        }
      }

      res.json({
        status: 'ok',
        safetyFlags: {
          autoPublishEnabled: String(env.AUTO_PUBLISH_ENABLED || '').trim().toLowerCase() === 'true',
          autoPublishResults: String(env.AUTO_PUBLISH_RESULTS || '').trim().toLowerCase() === 'true'
        },
        diagnostics: memoryStatus,
        lockState,
        activeJob,
        sourceHealth: persistentSourceHealth,
        recentRuns: latestRuns,
        counts: {
          published: publishedCount,
          pending: pendingCount,
          quarantined: quarantinedCount,
          rejected: rejectedCount,
          total: totalCount
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, error: 'STATUS_ERROR' });
    }
  });
}

