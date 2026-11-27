// server/ingestion/tnStateExtraction.test.mjs
// Offline HTML fixture & end-to-end extraction tests for Step 2.92:
// Tamil Nadu Government Sources (tnpsc, tnusrb, trb_tn, mrb_tn).
// Strictly offline: reads local HTML fixtures and stubs https.request & dnsLookup; zero live HTTP/DB writes.

import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { EventEmitter } from 'node:events';
import { fileURLToPath } from 'node:url';

import { OFFICIAL_EXAM_SOURCES } from './sourcesConfig.js';
import {
  scrapeTnpscNotifications,
  scrapeTnusrbNotifications,
  scrapeTrbNotifications,
  scrapeMrbNotifications,
  extractVacancyCount,
  extractValidatedDate,
  isValidSpecificApplyUrl,
  isValidSpecificDetailsUrl
} from './scrapers/tnStateScraper.js';
import { runAllIngestionJobs } from './ingestionManager.js';
import { evaluateCandidateTrust } from './trustScoringEngine.js';
import { isDuplicateNotification } from './deduplicationHelper.js';
import {
  buildIdentityFingerprint,
  computeContentHash,
  evaluateCorrigendumUpdate
} from './corrigendumHelper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FIXTURES_DIR = path.join(__dirname, 'fixtures', 'tn');
const PUBLIC_TEST_DNS = async () => [{ address: '93.184.216.34', family: 4 }];
const FIXED_NOW = new Date('2026-11-27T06:00:00.000Z'); // 2026-11-27 IST

function loadFixture(fileName) {
  return fs.readFileSync(path.join(FIXTURES_DIR, fileName), 'utf8');
}

function getSourceConfig(key) {
  const cfg = OFFICIAL_EXAM_SOURCES.find((s) => s.key === key);
  assert.ok(cfg, `Expected sourceConfig for ${key}`);
  return cfg;
}

async function withFixtureHttps(htmlBody, fn) {
  const originalRequest = https.request;
  https.request = (_reqOptions, cb) => {
    const req = new EventEmitter();
    req.destroyed = false;
    req.destroy = () => {
      req.destroyed = true;
    };
    req.end = () => {
      queueMicrotask(() => {
        const res = new EventEmitter();
        res.statusCode = 200;
        res.headers = { 'content-type': 'text/html; charset=utf-8' };
        res.resume = () => {};
        res.destroy = () => {};
        cb(res);
        res.emit('data', Buffer.from(htmlBody, 'utf8'));
        res.emit('end');
      });
    };
    return req;
  };
  try {
    return await fn();
  } finally {
    https.request = originalRequest;
  }
}

function createReadOnlyMockNotificationModel(existingDocs = []) {
  return {
    find() {
      return {
        lean: async () => existingDocs.map((d) => ({ ...d }))
      };
    },
    create() {
      throw new Error('DB_WRITE_FORBIDDEN_IN_OFFLINE_TEST');
    },
    updateOne() {
      throw new Error('DB_WRITE_FORBIDDEN_IN_OFFLINE_TEST');
    }
  };
}

test('TN Shared Helpers: vacancy extraction never emits 0, invalid dates rejected, generic Apply URLs rejected', () => {
  // Vacancies: unknown or zero MUST return 'Not Specified' (never '0' or 0)
  assert.equal(extractVacancyCount('0', { isDedicatedColumn: true }), 'Not Specified');
  assert.equal(extractVacancyCount('00 Posts', { isDedicatedColumn: true }), 'Not Specified');
  assert.equal(extractVacancyCount('Vacancies: 0 Posts'), 'Not Specified');
  assert.equal(extractVacancyCount('-'), 'Not Specified');
  assert.equal(extractVacancyCount('TBA'), 'Not Specified');
  assert.equal(extractVacancyCount(''), 'Not Specified');
  assert.equal(extractVacancyCount('Pay Level Rs. 36,900/- Advt 01/2026'), 'Not Specified');
  assert.equal(extractVacancyCount('6,244', { isDedicatedColumn: true }), '6244');
  assert.equal(extractVacancyCount('Total Vacancies: 1,299 Posts'), '1299');
  assert.equal(extractVacancyCount('(2,553 Posts)'), '2553');

  // Invalid dates rejected cleanly
  assert.deepEqual(extractValidatedDate('30-02-2026').invalidCalendar, true);
  assert.equal(extractValidatedDate('30-02-2026').value, '');
  assert.equal(extractValidatedDate('31-04-2026').invalidCalendar, true);
  assert.equal(extractValidatedDate('29-02-2026').invalidCalendar, true);
  assert.equal(extractValidatedDate('32-13-2026').invalidCalendar, true);
  assert.equal(extractValidatedDate('TBA').valid, false);
  assert.equal(extractValidatedDate('TBA').invalidCalendar, false);
  assert.equal(extractValidatedDate('15-11-2026').value, '15-11-2026');

  // Generic homepages, generic listing pages, PDFs, and external URLs rejected as applyLink
  const tnpscCfg = getSourceConfig('tnpsc');
  assert.equal(isValidSpecificApplyUrl('https://apply.tnpscexams.in/', 'tnpsc', tnpscCfg), false);
  assert.equal(isValidSpecificApplyUrl('https://apply.tnpscexams.in/index.php', 'tnpsc', tnpscCfg), false);
  assert.equal(isValidSpecificApplyUrl('https://www.tnpsc.gov.in/English/Notification.aspx', 'tnpsc', tnpscCfg), false);
  assert.equal(isValidSpecificApplyUrl('https://www.tnpsc.gov.in/Document/english/01_2026.pdf', 'tnpsc', tnpscCfg), false);
  assert.equal(isValidSpecificApplyUrl('https://apply.tnpscexams.in/apply-now?id=01-2026', 'tnpsc', tnpscCfg), true);

  // Notification-specific detailsLink validation
  assert.equal(isValidSpecificDetailsUrl('https://www.tnpsc.gov.in/Document/english/01_2026.pdf', 'tnpsc', tnpscCfg), true);
  assert.equal(isValidSpecificDetailsUrl('https://www.tnpsc.gov.in/', 'tnpsc', tnpscCfg), false);
  assert.equal(isValidSpecificDetailsUrl('https://www.tnpsc.gov.in/English/Notification.aspx', 'tnpsc', tnpscCfg), false);
});

test('TNPSC fixture: valid extraction, date separation, missing closingDate, zero vacancies, invalid date, generic Apply rejection, planner & dedup', async () => {
  const cfg = getSourceConfig('tnpsc');
  const html = loadFixture('tnpsc.html');

  const res = await withFixtureHttps(html, () =>
    scrapeTnpscNotifications(cfg, { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS })
  );

  assert.equal(res.success, true);
  // 4 distinct items: 01/2026 (deduped from 2 rows), 02/2026, 03/2026, plus 1 Annual Planner row
  assert.equal(res.items.length, 4);

  // 1) Complete valid notification 01/2026
  const validItem = res.items.find((i) => i.notificationNo === '01/2026');
  assert.ok(validItem);
  assert.equal(validItem.organization, 'Tamil Nadu Public Service Commission (TNPSC)');
  assert.equal(validItem.department, 'Revenue and Disaster Management Department');
  assert.match(validItem.service, /Combined Civil Services Examination - IV/i);
  assert.equal(validItem.vacancies, '6244');
  assert.equal(validItem.posts, '6244');
  assert.equal(validItem.sourcePublishedAt, '15-11-2026');
  assert.equal(validItem.notificationDate, '15-11-2026');
  assert.equal(validItem.openingDate, '18-11-2026');
  assert.equal(validItem.closingDate, '20-12-2026');
  assert.equal(validItem.examDate, '14-03-2027');
  assert.equal(validItem.detailsLink, 'https://www.tnpsc.gov.in/Document/english/01_2026_group4.pdf');
  assert.equal(validItem.applyLink, 'https://apply.tnpscexams.in/apply-now?id=01-2026');
  assert.notEqual(validItem.detailsLink, validItem.applyLink);

  const validTrust = evaluateCandidateTrust(validItem, {
    sourceKey: 'tnpsc',
    sourceConfig: cfg,
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'false' }
  });
  assert.equal(validTrust.ingestionStatus, 'pending_review');
  assert.equal(validTrust.wouldAutoPublishIfEnabled, true);
  assert.equal(validTrust.trustScore, 100);

  // 2) Missing closingDate + zero vacancies + Published Date must NOT become Opening Date + generic Apply rejected
  const missingItem = res.items.find((i) => i.notificationNo === '02/2026');
  assert.ok(missingItem);
  assert.equal(missingItem.vacancies, 'Not Specified');
  assert.equal(missingItem.posts, 'Not Specified');
  assert.equal(missingItem.sourcePublishedAt, '20-11-2026');
  assert.equal(missingItem.openingDate, '', 'Published Date must never be copied into openingDate');
  assert.equal(missingItem.closingDate, '', 'Missing closingDate must stay empty');
  assert.equal(missingItem.detailsLink, 'https://www.tnpsc.gov.in/Document/english/02_2026_cese.pdf');
  assert.equal(missingItem.applyLink, '', 'Generic root homepage https://apply.tnpscexams.in/ must be rejected');

  const missingTrust = evaluateCandidateTrust(missingItem, {
    sourceKey: 'tnpsc',
    sourceConfig: cfg,
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(missingTrust.ingestionStatus, 'pending_review');
  assert.equal(missingTrust.autoPublished, false);
  assert.ok(missingTrust.reviewReasons.includes('MISSING_CLOSING_DATE'));
  assert.ok(missingTrust.reviewReasons.includes('MISSING_GENUINE_APPLY_URL'));

  // 3) Invalid date (30-02-2026) rejected & unsafe javascript: applyLink rejected
  const invalidItem = res.items.find((i) => i.notificationNo === '03/2026');
  assert.ok(invalidItem);
  assert.equal(invalidItem.closingDate, '', 'Invalid calendar date 30-02-2026 must be rejected');
  assert.ok(invalidItem.invalidDateFields.includes('closingDate'));
  assert.equal(invalidItem.vacancies, 'Not Specified');
  assert.equal(invalidItem.applyLink, '');

  const invalidTrust = evaluateCandidateTrust(invalidItem, {
    sourceKey: 'tnpsc',
    sourceConfig: cfg,
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(invalidTrust.ingestionStatus, 'quarantined');
  assert.match(invalidTrust.quarantineReason, /INVALID_CLOSING_CALENDAR_DATE/);

  // 4) Annual Planner extracts vacancies & Exam Month cleanly without inventing opening/published dates
  const plannerItem = res.items.find((i) => i.isTentativePlanner === true);
  assert.ok(plannerItem);
  assert.equal(plannerItem.vacancies, '425');
  assert.equal(plannerItem.posts, '425');
  assert.equal(plannerItem.examDate, 'May 2027');
  assert.equal(plannerItem.openingDate, '');
  assert.equal(plannerItem.closingDate, '');
  assert.equal(plannerItem.sourcePublishedAt, '');
  assert.equal(plannerItem.applyLink, '');
});

test('TNUSRB fixture: valid extraction, missing closingDate, zero vacancies, invalid date, generic Apply rejection, dedup & unsafe links', async () => {
  const cfg = getSourceConfig('tnusrb');
  const html = loadFixture('tnusrb.html');

  const res = await withFixtureHttps(html, () =>
    scrapeTnusrbNotifications(cfg, { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS })
  );

  assert.equal(res.success, true);
  // 3 valid recruitment cards (duplicate SI card deduped, final selection list excluded, unsafe JS/data links excluded)
  assert.equal(res.items.length, 3);

  // 1) Complete valid recruitment card
  const validItem = res.items.find((i) => i.notificationNo === '01/2026');
  assert.ok(validItem);
  assert.equal(validItem.organization, 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)');
  assert.match(validItem.department, /Home Department/i);
  assert.equal(validItem.vacancies, '1299');
  assert.equal(validItem.posts, '1299');
  assert.equal(validItem.sourcePublishedAt, '10-11-2026');
  assert.equal(validItem.openingDate, '15-11-2026');
  assert.equal(validItem.closingDate, '22-12-2026');
  assert.equal(validItem.examDate, '18-04-2027');
  assert.equal(validItem.detailsLink, 'https://tnusrb.tn.gov.in/notifications/2026/si_notification_01_2026.pdf');
  assert.equal(validItem.applyLink, 'https://tnusrb.tn.gov.in/online-application/si-2026');

  // 2) Missing closingDate + zero vacancies + Published Date only + generic root Apply URL rejected
  const missingItem = res.items.find((i) => i.notificationNo === '02/2026');
  assert.ok(missingItem);
  assert.equal(missingItem.vacancies, 'Not Specified');
  assert.equal(missingItem.sourcePublishedAt, '19-11-2026');
  assert.equal(missingItem.openingDate, '');
  assert.equal(missingItem.closingDate, '');
  assert.equal(missingItem.detailsLink, 'https://tnusrb.tn.gov.in/notifications/2026/pc_constable_02_2026.pdf');
  assert.equal(missingItem.applyLink, '', 'Generic homepage https://tnusrb.tn.gov.in/ must be rejected');

  // 3) Invalid date (31-04-2026) & external apply URL rejected
  const invalidItem = res.items.find((i) => i.notificationNo === '03/2026');
  assert.ok(invalidItem);
  assert.equal(invalidItem.closingDate, '');
  assert.ok(invalidItem.invalidDateFields.includes('closingDate'));
  assert.equal(invalidItem.applyLink, '', 'External untrusted apply URL must be rejected');
});

test('TRB TN fixture: valid extraction, missing closingDate, missing/zero vacancies, invalid leap date, generic Apply rejection & dedup', async () => {
  const cfg = getSourceConfig('trb_tn');
  const html = loadFixture('trb_tn.html');

  const res = await withFixtureHttps(html, () =>
    scrapeTrbNotifications(cfg, { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS })
  );

  assert.equal(res.success, true);
  assert.equal(res.items.length, 3);

  // 1) Complete valid TRB notification
  const validItem = res.items.find((i) => i.notificationNo === '02/2026');
  assert.ok(validItem);
  assert.equal(validItem.organization, 'Teachers Recruitment Board (TRB Tamil Nadu)');
  assert.equal(validItem.department, 'School Education Department');
  assert.equal(validItem.vacancies, '2207');
  assert.equal(validItem.posts, '2207');
  assert.equal(validItem.sourcePublishedAt, '12-11-2026');
  assert.equal(validItem.openingDate, '16-11-2026');
  assert.equal(validItem.closingDate, '24-12-2026');
  assert.equal(validItem.examDate, '21-02-2027');
  assert.equal(validItem.detailsLink, 'https://trb.tn.gov.in/uploads/notifications/trb_pg_02_2026.pdf');
  assert.equal(validItem.applyLink, 'https://trb.tn.gov.in/apply_online.php?notif_id=02-2026');

  // 2) Missing closingDate, missing vacancies (-), generic listing Apply URL rejected
  const missingItem = res.items.find((i) => i.notificationNo === '03/2026');
  assert.ok(missingItem);
  assert.equal(missingItem.vacancies, 'Not Specified');
  assert.equal(missingItem.sourcePublishedAt, '18-11-2026');
  assert.equal(missingItem.openingDate, '');
  assert.equal(missingItem.closingDate, '');
  assert.equal(missingItem.detailsLink, 'https://trb.tn.gov.in/uploads/notifications/trb_ap_03_2026.pdf');
  assert.equal(missingItem.applyLink, '', 'Generic TRB listing page must not be emitted as applyLink');

  // 3) Invalid calendar date (29-02-2026) & zero vacancies & generic root Apply URL rejected
  const invalidItem = res.items.find((i) => i.notificationNo === '04/2026');
  assert.ok(invalidItem);
  assert.equal(invalidItem.vacancies, 'Not Specified');
  assert.equal(invalidItem.closingDate, '');
  assert.ok(invalidItem.invalidDateFields.includes('closingDate'));
  assert.equal(invalidItem.applyLink, '', 'Generic root TRB homepage must not be emitted as applyLink');
});

test('MRB TN fixture: uppercase .PDF extraction, inline dates/vacancies, missing closingDate, zero vacancies, invalid date, generic Apply rejection & dedup', async () => {
  const cfg = getSourceConfig('mrb_tn');
  const html = loadFixture('mrb_tn.html');

  const res = await withFixtureHttps(html, () =>
    scrapeMrbNotifications(cfg, { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS })
  );

  assert.equal(res.success, true);
  assert.equal(res.items.length, 3);

  // 1) Classic 3-col MRB notification with uppercase .PDF & inline metadata
  const validItem = res.items.find((i) => i.notificationNo === '04/MRB/2026');
  assert.ok(validItem);
  assert.equal(validItem.organization, 'Medical Services Recruitment Board (MRB Tamil Nadu)');
  assert.match(validItem.department, /Health and Family Welfare/i);
  assert.equal(validItem.service, 'MRB 04/MRB/2026: Assistant Surgeon');
  assert.equal(validItem.vacancies, '2553');
  assert.equal(validItem.posts, '2553');
  assert.equal(validItem.sourcePublishedAt, '10-11-2026');
  assert.equal(validItem.openingDate, '12-11-2026');
  assert.equal(validItem.closingDate, '28-12-2026');
  assert.equal(validItem.examDate, '28-02-2027');
  assert.equal(validItem.detailsLink, 'https://www.mrb.tn.gov.in/pdf/2026/04_MRB_2026_Assistant_Surgeon.PDF');
  assert.equal(validItem.applyLink, 'https://www.mrb.tn.gov.in/apply_online.php?advt=04-MRB-2026');

  // 2) Missing closingDate + zero vacancies + generic listing page Apply URL rejected
  const missingItem = res.items.find((i) => i.notificationNo === '05/MRB/2026');
  assert.ok(missingItem);
  assert.equal(missingItem.vacancies, 'Not Specified');
  assert.equal(missingItem.sourcePublishedAt, '19-11-2026');
  assert.equal(missingItem.openingDate, '');
  assert.equal(missingItem.closingDate, '');
  assert.equal(missingItem.detailsLink, 'https://www.mrb.tn.gov.in/pdf/2026/05_MRB_2026_Pharmacist.pdf');
  assert.equal(missingItem.applyLink, '', 'Generic MRB content.php listing URL must not be emitted as applyLink');

  // 3) Invalid calendar date (32-13-2026) & generic root Apply URL rejected
  const invalidItem = res.items.find((i) => i.notificationNo === '06/MRB/2026');
  assert.ok(invalidItem);
  assert.equal(invalidItem.vacancies, '180');
  assert.equal(invalidItem.openingDate, '22-11-2026');
  assert.equal(invalidItem.closingDate, '');
  assert.ok(invalidItem.invalidDateFields.includes('closingDate'));
  assert.equal(invalidItem.applyLink, '');
});

test('Trust Gate: Generic Apply URL & missing Apply URL never auto-publish; closingDate < openingDate quarantined', () => {
  const tnpscCfg = getSourceConfig('tnpsc');
  const baseCandidate = {
    sourceKey: 'tnpsc',
    category: 'tnpsc',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Combined Civil Services Examination Group IV 2026',
    postName: 'Group IV',
    notificationNo: '01/2026',
    sourcePublishedAt: '15-11-2026',
    openingDate: '18-11-2026',
    closingDate: '20-12-2026',
    examDate: '14-03-2027',
    posts: '6244',
    detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026_group4.pdf'
  };

  // Generic root homepage applyLink MUST NOT pass auto-publish gate -> pending_review
  const genericApplyEval = evaluateCandidateTrust(
    { ...baseCandidate, applyLink: 'https://apply.tnpscexams.in/' },
    {
      sourceKey: 'tnpsc',
      sourceConfig: tnpscCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'true' }
    }
  );
  assert.equal(genericApplyEval.ingestionStatus, 'pending_review');
  assert.equal(genericApplyEval.autoPublished, false);
  assert.ok(genericApplyEval.reviewReasons.includes('GENERIC_APPLY_HOMEPAGE'));

  // Empty applyLink MUST NOT pass auto-publish gate -> pending_review
  const emptyApplyEval = evaluateCandidateTrust(
    { ...baseCandidate, applyLink: '' },
    {
      sourceKey: 'tnpsc',
      sourceConfig: tnpscCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'true' }
    }
  );
  assert.equal(emptyApplyEval.ingestionStatus, 'pending_review');
  assert.equal(emptyApplyEval.autoPublished, false);
  assert.ok(emptyApplyEval.reviewReasons.includes('MISSING_GENUINE_APPLY_URL'));

  // Chronological conflict (closingDate before openingDate) quarantined
  const invertedDatesEval = evaluateCandidateTrust(
    {
      ...baseCandidate,
      openingDate: '25-12-2026',
      closingDate: '10-12-2026',
      applyLink: 'https://apply.tnpscexams.in/apply-now?id=01-2026'
    },
    {
      sourceKey: 'tnpsc',
      sourceConfig: tnpscCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'true' }
    }
  );
  assert.equal(invertedDatesEval.ingestionStatus, 'quarantined');
  assert.match(invertedDatesEval.quarantineReason, /DATE_CONFLICT_CLOSING_BEFORE_OPENING/);
});

test('End-to-End Dry-Run: Duplicate handling, Corrigendum/Update detection (including EXACT_ID_MATCH), and Admin manualOverrideLock protection', async () => {
  const trbCfg = getSourceConfig('trb_tn');
  const existingRecord = {
    id: 'notif-trb_tn-seed-022026',
    sourceKey: 'trb_tn',
    category: 'teaching',
    organization: 'Teachers Recruitment Board (TRB Tamil Nadu)',
    service: 'Direct Recruitment of Post Graduate Assistants 2026',
    postName: 'Direct Recruitment of Post Graduate Assistants 2026',
    notificationNo: '02/2026',
    sourcePublishedAt: '12-11-2026',
    openingDate: '16-11-2026',
    closingDate: '24-12-2026',
    examDate: 'To Be Announced',
    posts: '2000',
    detailsLink: 'https://trb.tn.gov.in/uploads/notifications/trb_pg_02_2026.pdf',
    applyLink: '',
    ingestionStatus: 'published',
    isVerified: true,
    manualOverrideLock: false,
    revisionCount: 0
  };
  existingRecord.identityFingerprint = buildIdentityFingerprint(existingRecord);
  existingRecord.contentHash = computeContentHash(existingRecord);

  // 1) Exact duplicate -> skipped cleanly without calling verifyDocumentFn
  let docVerifyCalls = 0;
  const freshScrapedSame = {
    sourceKey: 'trb_tn',
    category: 'teaching',
    organization: existingRecord.organization,
    service: existingRecord.service,
    postName: existingRecord.postName,
    notificationNo: existingRecord.notificationNo,
    sourcePublishedAt: existingRecord.sourcePublishedAt,
    openingDate: existingRecord.openingDate,
    closingDate: existingRecord.closingDate,
    examDate: existingRecord.examDate,
    vacancies: '2000',
    posts: '2000',
    detailsLink: existingRecord.detailsLink,
    applyLink: ''
  };
  const dupRun = await runAllIngestionJobs(createReadOnlyMockNotificationModel([existingRecord]), {
    dryRun: true,
    sourceKey: 'trb_tn',
    now: FIXED_NOW,
    skipRateLimit: true,
    verifyDocumentFn: async () => {
      docVerifyCalls++;
      return { docState: 'structurally_verified', reason: 'PDF_OK' };
    },
    scraperOverrides: {
      trb_tn: async () => ({
        success: true,
        source: 'trb_tn',
        items: [freshScrapedSame]
      })
    }
  });
  assert.equal(docVerifyCalls, 0);
  assert.equal(dupRun.sourceResults.trb_tn.duplicatesSkipped, 1);
  assert.equal(dupRun.sourceResults.trb_tn.newlyInserted, 0);

  // 2) Update on fields outside legacy fingerprint (examDate + posts + genuine applyLink) MUST NOT be dropped by EXACT_ID_MATCH
  const updatedCandidate = {
    ...freshScrapedSame,
    id: existingRecord.id,
    examDate: '21-02-2027',
    posts: '2207',
    vacancies: '2207',
    applyLink: 'https://trb.tn.gov.in/apply_online.php?notif_id=02-2026'
  };
  const dupCheckExactId = isDuplicateNotification(updatedCandidate, [existingRecord]);
  assert.equal(dupCheckExactId.isDuplicate, true);
  assert.equal(dupCheckExactId.isCorrigendumCandidate, true, 'Updated posts/examDate/applyLink must trigger corrigendum evaluation even on EXACT_ID_MATCH');

  const updateRun = await runAllIngestionJobs(createReadOnlyMockNotificationModel([existingRecord]), {
    dryRun: true,
    sourceKey: 'trb_tn',
    now: FIXED_NOW,
    skipRateLimit: true,
    env: { AUTO_PUBLISH_ENABLED: 'false' },
    verifyDocumentFn: async () => ({ docState: 'structurally_verified', reason: 'PDF_OK' }),
    scraperOverrides: {
      trb_tn: async () => ({
        success: true,
        source: 'trb_tn',
        items: [updatedCandidate]
      })
    }
  });
  assert.equal(updateRun.sourceResults.trb_tn.newlyInserted, 1);
  assert.equal(updateRun.sourceResults.trb_tn.pendingReview, 1);
  assert.equal(updateRun.sourceResults.trb_tn.autoPublished, 0);

  // 3) Deadline extension corrigendum with Admin manualOverrideLock=true MUST preserve Admin override -> pending_corrigendum_review
  const lockedRecord = { ...existingRecord, manualOverrideLock: true };
  const extendedCandidate = { ...freshScrapedSame, closingDate: '05-01-2027' };
  const lockedCorrEval = evaluateCorrigendumUpdate({
    existing: lockedRecord,
    candidate: extendedCandidate,
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(lockedCorrEval.decision, 'pending_corrigendum_review');
  assert.equal(lockedCorrEval.reason, 'MANUAL_OVERRIDE_LOCKED');

  // 4) Corrigendum proposing generic homepage applyLink MUST NOT auto-apply even when AUTO_PUBLISH_ENABLED=true
  const genericApplyCorr = evaluateCorrigendumUpdate({
    existing: existingRecord,
    candidate: { ...freshScrapedSame, applyLink: 'https://trb.tn.gov.in/' },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(genericApplyCorr.decision, 'pending_corrigendum_review');
  assert.equal(genericApplyCorr.reason, 'CORRIGENDUM_GENERIC_APPLY_HOMEPAGE');
  assert.equal(trbCfg.enabled, true);

  // 5) Full fixture dry-run through ingestionManager for all 4 TN sources (zero DB writes, fail-closed gating)
  const fixtureMap = {
    // tnpsc: 01/2026 (pending), 02/2026 missing close/apply (pending), 03/2026 invalid date (quarantined), tentative planner without doc URL (quarantined low trust)
    tnpsc: { file: 'tnpsc.html', expectedItems: 4, expectedQuarantined: 2, expectedPending: 2 },
    tnusrb: { file: 'tnusrb.html', expectedItems: 3, expectedQuarantined: 1, expectedPending: 2 },
    trb_tn: { file: 'trb_tn.html', expectedItems: 3, expectedQuarantined: 1, expectedPending: 2 },
    mrb_tn: { file: 'mrb_tn.html', expectedItems: 3, expectedQuarantined: 1, expectedPending: 2 }
  };

  for (const [sKey, spec] of Object.entries(fixtureMap)) {
    const html = loadFixture(spec.file);
    const runRes = await withFixtureHttps(html, () =>
      runAllIngestionJobs(createReadOnlyMockNotificationModel([]), {
        dryRun: true,
        sourceKey: sKey,
        now: FIXED_NOW,
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS,
        env: { AUTO_PUBLISH_ENABLED: 'false' },
        verifyDocumentFn: async (docUrl) => (
          docUrl
            ? { docState: 'structurally_verified', reason: 'PDF_OK' }
            : { docState: 'unavailable', reason: 'MISSING_URL' }
        )
      })
    );
    const st = runRes.sourceResults[sKey];
    assert.equal(st.success, true, `${sKey} dry-run should succeed`);
    assert.equal(st.itemsFound, spec.expectedItems, `${sKey} itemsFound mismatch`);
    assert.equal(st.quarantined, spec.expectedQuarantined, `${sKey} invalid-date row must quarantine`);
    assert.equal(st.pendingReview, spec.expectedPending, `${sKey} non-quarantined items must land in pending_review`);
    assert.equal(st.autoPublished, 0, `${sKey} must never auto-publish under AUTO_PUBLISH_ENABLED=false`);
  }
});
