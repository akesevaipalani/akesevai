// server/ingestion/ingestionManager.js
import { OFFICIAL_EXAM_SOURCES, INGESTION_CONFIG } from './sourcesConfig.js';
import {
  generateNotificationFingerprint,
  buildDeterministicId,
  isDuplicateNotification
} from './deduplicationHelper.js';
import { scrapeTnpscNotifications, scrapeTnusrbNotifications, scrapeTrbNotifications, scrapeMrbNotifications } from './scrapers/tnStateScraper.js';
import { scrapeIbpsNotifications, scrapeSbiNotifications, scrapeRbiNotifications } from './scrapers/bankingScraper.js';
import { scrapeUpscNotifications, scrapeSscNotifications, scrapeRrbNotifications, scrapeIndiaPostNotifications } from './scrapers/centralGovtScraper.js';
import {
  scrapeIndianArmyNotifications,
  scrapeIndianNavyNotifications,
  scrapeIndianAirforceNotifications,
  scrapeCtetNotifications,
  scrapeKvsNotifications
} from './scrapers/defenceTeachingScraper.js';
import {
  scrapeLicNotifications,
  scrapeNiaclNotifications,
  scrapeBelNotifications,
  scrapeBhelNotifications
} from './scrapers/insurancePsuScraper.js';

// Handler map from source key to scraper function
const SCRAPER_MAP = {
  tnpsc: scrapeTnpscNotifications,
  tnusrb: scrapeTnusrbNotifications,
  trb_tn: scrapeTrbNotifications,
  mrb_tn: scrapeMrbNotifications,
  ibps: scrapeIbpsNotifications,
  sbi_careers: scrapeSbiNotifications,
  rbi_vacancies: scrapeRbiNotifications,
  upsc_active: scrapeUpscNotifications,
  ssc_notices: scrapeSscNotifications,
  rrb_chennai: scrapeRrbNotifications,
  rrb_central: scrapeRrbNotifications,
  india_post_gds: scrapeIndiaPostNotifications,
  indian_army: scrapeIndianArmyNotifications,
  indian_navy: scrapeIndianNavyNotifications,
  indian_airforce: scrapeIndianAirforceNotifications,
  ctet_cbse: scrapeCtetNotifications,
  kvs_delhi: scrapeKvsNotifications,
  lic_careers: scrapeLicNotifications,
  niacl_careers: scrapeNiaclNotifications,
  bel_psu: scrapeBelNotifications,
  bhel_psu: scrapeBhelNotifications
};

// Global state tracking sync runs
let lastIngestionState = {
  lastRunAt: null,
  durationMs: 0,
  sourcesAttempted: 0,
  sourcesSucceeded: 0,
  sourcesFailed: 0,
  newRecordsInserted: 0,
  duplicatesSkipped: 0,
  errors: [],
  sourceResults: {}
};

// In-process concurrency mutex for ingestion job (Single-process protection)
let isIngestionRunning = false;
let currentRunStartedAt = null;

/**
 * Returns true if an ingestion job is currently executing
 */
export function isIngestionInProgress() {
  return isIngestionRunning;
}

/**
 * Returns latest ingestion diagnostics and status
 */
export function getIngestionStatus() {
  return {
    isIngestionRunning,
    currentRunStartedAt,
    ...lastIngestionState
  };
}

/**
 * Runs ingestion across all registered official exam sources
 * @param {Object} NotificationModel - Mongoose Notification model
 * @param {Object} [options] - Ingestion options (e.g. forceSource, dryRun)
 * @returns {Promise<Object>}
 */
export async function runAllIngestionJobs(NotificationModel, options = {}) {
  // Concurrency guard: Fail-fast if an ingestion run is already in progress
  if (isIngestionRunning) {
    const error = new Error('INGESTION_IN_PROGRESS');
    error.code = 'CONCURRENT_INGESTION_LOCKED';
    error.status = 409;
    error.startedAt = currentRunStartedAt;
    throw error;
  }

  isIngestionRunning = true;
  currentRunStartedAt = new Date().toISOString();

  try {
    const startTime = Date.now();
    const summary = {
      startedAt: new Date(startTime).toISOString(),
      completedAt: null,
      durationMs: 0,
      sourcesAttempted: 0,
      sourcesSucceeded: 0,
      sourcesFailed: 0,
      newRecordsInserted: 0,
      duplicatesSkipped: 0,
      errors: [],
      sourceResults: {}
    };

    if (!NotificationModel) {
      summary.errors.push('NotificationModel is required for persistence');
      return summary;
    }

    // Fetch all existing notifications from DB to perform memory-safe deduplication
    let existingList = [];
    try {
      existingList = await NotificationModel.find({}, {
        id: 1,
        service: 1,
        organization: 1,
        notificationNo: 1,
        detailsLink: 1,
        category: 1,
        closingDate: 1,
        ingestionStatus: 1
      }).lean();
    } catch (err) {
      summary.errors.push(`Failed to fetch existing records for deduplication: ${err.message}`);
    }

    const sourcesToRun = options.sourceKey
      ? OFFICIAL_EXAM_SOURCES.filter(s => s.key === options.sourceKey)
      : OFFICIAL_EXAM_SOURCES.filter(s => s.enabled);

    summary.sourcesAttempted = sourcesToRun.length;

    for (const source of sourcesToRun) {
      const scraperFn = SCRAPER_MAP[source.key];
      if (!scraperFn) {
        summary.sourceResults[source.key] = { success: false, error: 'No scraper implemented' };
        summary.sourcesFailed++;
        continue;
      }

      try {
        const result = await scraperFn(source);
        if (!result.success) {
          summary.sourcesFailed++;
          summary.sourceResults[source.key] = { success: false, error: result.error, itemsFound: 0 };
          summary.errors.push(`[${source.key}] ${result.error || 'Scrape failed'}`);
          continue;
        }

        summary.sourcesSucceeded++;
        const extractedItems = result.items || [];
        let sourceInserted = 0;
        let sourceDupes = 0;

        for (const item of extractedItems) {
          const fingerprint = generateNotificationFingerprint(item);
          const stableId = buildDeterministicId(source.key, item);

          const candidate = {
            ...item,
            id: stableId,
            fingerprint,
            ingestionStatus: 'pending_review', // STRICT: Always enters pending_review
            isVerified: false,
            isNew: true,
            status: 'active',
            ingestionSource: `scraper_${source.key}`,
            firstDetectedAt: new Date(),
            lastScrapedAt: new Date(),
            updatedAt: new Date()
          };

          const dupCheck = isDuplicateNotification(candidate, existingList);
          if (dupCheck.isDuplicate) {
            sourceDupes++;
            summary.duplicatesSkipped++;
            // Update lastScrapedAt timestamp on existing record without overwriting verified content
            try {
              await NotificationModel.updateOne(
                { id: dupCheck.matchedExistingId },
                { $set: { lastScrapedAt: new Date() } }
              );
            } catch (e) {}
          } else {
            // Unique new record: Insert as pending_review
            try {
              if (!options.dryRun) {
                await NotificationModel.create(candidate);
                existingList.push(candidate); // Add to local cache for intra-batch deduplication
              }
              sourceInserted++;
              summary.newRecordsInserted++;
            } catch (createErr) {
              summary.errors.push(`[${source.key}] Failed to insert candidate ${stableId}: ${createErr.message}`);
            }
          }
        }

        summary.sourceResults[source.key] = {
          success: true,
          itemsFound: extractedItems.length,
          inserted: sourceInserted,
          duplicates: sourceDupes
        };
      } catch (sourceErr) {
        summary.sourcesFailed++;
        summary.sourceResults[source.key] = { success: false, error: sourceErr.message };
        summary.errors.push(`[${source.key}] Unexpected exception: ${sourceErr.message}`);
      }
    }

    const endTime = Date.now();
    summary.completedAt = new Date(endTime).toISOString();
    summary.durationMs = endTime - startTime;

    lastIngestionState = {
      lastRunAt: summary.completedAt,
      ...summary
    };

    return summary;
  } finally {
    // Guarantees lock release under all circumstances (normal return, exception, or timeout)
    isIngestionRunning = false;
    currentRunStartedAt = null;
  }
}
