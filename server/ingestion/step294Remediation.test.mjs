// server/ingestion/step294Remediation.test.mjs
// Targeted offline regression tests for Step 2.94 remediation of Step 2.93 findings (M-1, M-2, L-1)
// plus all-19 enabled source compatibility checks.
// Strictly offline: zero live HTTP, zero live scraping, zero DB connections.

import test from 'node:test';
import assert from 'node:assert/strict';

import { OFFICIAL_EXAM_SOURCES } from './sourcesConfig.js';
import { extractVacancyCount } from './scrapers/tnStateScraper.js';
import {
  buildIdentityFingerprint,
  computeContentHash,
  evaluateCorrigendumUpdate
} from './corrigendumHelper.js';
import { evaluateCandidateTrust } from './trustScoringEngine.js';

const FIXED_NOW = new Date('2026-11-27T06:00:00.000Z'); // 2026-11-27 IST

function getSource(key) {
  const cfg = OFFICIAL_EXAM_SOURCES.find((s) => s.key === key);
  assert.ok(cfg, `Missing source config for ${key}`);
  return cfg;
}

test('M-1: extractVacancyCount rejects group/stage/year false positives while preserving valid positive vacancy counts', () => {
  // False positives reported in Step 2.93 + expanded prefix exclusions
  const falsePositives = [
    'TNPSC Group 4 Posts Notification 2026',
    'TNPSC Group-4 Posts Notification 2026',
    'Combined Engineering Services Group 2 Posts',
    'TRB Recruitment 2026 Posts',
    'TNUSRB Category 1 Posts Notification',
    'MRB Stage 2 Posts Circular',
    'Tier 1 Posts Recruitment Notice',
    'Phase 3 Posts Schedule',
    'Class 2 Posts Advertisement',
    'Part 1 Posts Notification',
    'Paper 2 Posts Exam Notice',
    'Batch 4 Posts Allocation',
    'Division 3 Posts List',
    'Exam 1 Posts Notice',
    'Examination 2 Posts Notice',
    'TNPSC 2020 Posts Notification',
    'TNPSC 2026 Posts Notification',
    'TNPSC 2035 Posts Notification',
    // Unknown / zero vacancies must NEVER become '0'
    '0',
    '0 Vacancies',
    'Vacancies: 0 Posts',
    '-',
    'TBA',
    ''
  ];

  for (const input of falsePositives) {
    assert.equal(
      extractVacancyCount(input),
      'Not Specified',
      `Expected 'Not Specified' for false-positive/unknown input: ${JSON.stringify(input)}`
    );
  }
  assert.equal(extractVacancyCount('0', { isDedicatedColumn: true }), 'Not Specified');

  // Valid positive phrases MUST still extract accurately
  const validCases = [
    ['Total Vacancies: 250', '250'],
    ['250 Posts', '250'],
    ['Total Vacancies: 6,244 Posts', '6244'],
    ['(2,553 Posts)', '2553'],
    ['TNPSC Group 4 Posts Notification 2026 (Total Vacancies: 6,244)', '6244'],
    ['TNPSC Group 4 Posts - 6,244 Vacancies', '6244'],
    ['No. of Posts - 1,299', '1299'],
    ['621+ Openings', '621'],
    ['Total 2026 Posts', '2026'],
    ['2,026 Posts', '2026']
  ];

  for (const [input, expected] of validCases) {
    assert.equal(
      extractVacancyCount(input),
      expected,
      `Expected '${expected}' for valid input: ${JSON.stringify(input)}`
    );
  }
  assert.equal(extractVacancyCount('6,244', { isDedicatedColumn: true }), '6244');
});

test('M-2: corrigendumHelper rejects generic homepages, generic listing URLs, and PDFs as applyLink while allowing genuine Apply URLs and preserving manualOverrideLock', () => {
  const existing = {
    id: 'notif-trb_tn-step294',
    sourceKey: 'trb_tn',
    category: 'teaching',
    organization: 'Teachers Recruitment Board (TRB Tamil Nadu)',
    service: 'Direct Recruitment of Post Graduate Assistants 2026',
    postName: 'Direct Recruitment of Post Graduate Assistants 2026',
    notificationNo: '02/2026',
    sourcePublishedAt: '12-11-2026',
    openingDate: '16-11-2026',
    closingDate: '24-12-2026',
    examDate: '21-02-2027',
    posts: '2207',
    detailsLink: 'https://trb.tn.gov.in/uploads/notifications/trb_pg_02_2026.pdf',
    applyLink: '',
    ingestionStatus: 'published',
    isVerified: true,
    manualOverrideLock: false,
    revisionCount: 0
  };
  existing.identityFingerprint = buildIdentityFingerprint(existing);
  existing.contentHash = computeContentHash(existing);

  const baseCandidate = {
    sourceKey: existing.sourceKey,
    category: existing.category,
    organization: existing.organization,
    service: existing.service,
    postName: existing.postName,
    notificationNo: existing.notificationNo,
    sourcePublishedAt: existing.sourcePublishedAt,
    openingDate: existing.openingDate,
    closingDate: existing.closingDate,
    examDate: existing.examDate,
    posts: existing.posts,
    detailsLink: existing.detailsLink
  };

  // 1) Generic root homepage rejected
  const homeEval = evaluateCorrigendumUpdate({
    existing,
    candidate: { ...baseCandidate, applyLink: 'https://trb.tn.gov.in/' },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(homeEval.decision, 'pending_corrigendum_review');
  assert.equal(homeEval.reason, 'CORRIGENDUM_GENERIC_APPLY_HOMEPAGE');

  // 2) Generic listing/directory URL rejected
  const listingEval = evaluateCorrigendumUpdate({
    existing,
    candidate: { ...baseCandidate, applyLink: 'https://trb.tn.gov.in/notification.php?language=LG-1&status=Active' },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(listingEval.decision, 'pending_corrigendum_review');
  assert.equal(listingEval.reason, 'CORRIGENDUM_GENERIC_APPLY_LISTING_URL');

  // 3) PDF document URL rejected as applyLink
  const pdfEval = evaluateCorrigendumUpdate({
    existing,
    candidate: { ...baseCandidate, applyLink: 'https://trb.tn.gov.in/uploads/notifications/trb_pg_02_2026.pdf' },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(pdfEval.decision, 'pending_corrigendum_review');
  assert.equal(pdfEval.reason, 'CORRIGENDUM_APPLY_URL_IS_PDF');

  // 4) Genuine notification-specific Apply URL accepted when AUTO_PUBLISH_ENABLED=true and unlocked
  const genuineEval = evaluateCorrigendumUpdate({
    existing,
    candidate: { ...baseCandidate, applyLink: 'https://trb.tn.gov.in/apply_online.php?notif_id=02-2026' },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(genuineEval.decision, 'apply_corrigendum_update');
  assert.equal(genuineEval.mergedFields.applyLink, 'https://trb.tn.gov.in/apply_online.php?notif_id=02-2026');

  // 5) Manual override lock preserved even for genuine Apply URL update
  const lockedEval = evaluateCorrigendumUpdate({
    existing: { ...existing, manualOverrideLock: true },
    candidate: { ...baseCandidate, applyLink: 'https://trb.tn.gov.in/apply_online.php?notif_id=02-2026' },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    now: FIXED_NOW,
    env: { AUTO_PUBLISH_ENABLED: 'true' }
  });
  assert.equal(lockedEval.decision, 'pending_corrigendum_review');
  assert.equal(lockedEval.reason, 'MANUAL_OVERRIDE_LOCKED');
});

test('L-1: trustScoringEngine preserves pending_review on borderline titles while keeping generic/missing Apply URLs blocked from auto-publish', () => {
  // 1) CTET 2026 short title (9 chars) with generic root applyLink MUST stay pending_review (score=53, NOT quarantined)
  const ctetCfg = getSource('ctet_cbse');
  const ctetShort = evaluateCandidateTrust(
    {
      sourceKey: 'ctet_cbse',
      category: 'teaching',
      service: 'CTET 2026',
      detailsLink: 'https://ctet.nic.in/document/bulletin-2026.pdf',
      applyLink: 'https://ctet.nic.in/'
    },
    {
      sourceKey: 'ctet_cbse',
      sourceConfig: ctetCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'true' }
    }
  );
  assert.equal(ctetShort.ingestionStatus, 'pending_review');
  assert.equal(ctetShort.trustScore, 53);
  assert.equal(ctetShort.autoPublished, false);
  assert.ok(ctetShort.reviewReasons.includes('GENERIC_APPLY_HOMEPAGE'));
  assert.ok(ctetShort.unmetGates.includes('SPECIFIC_APPLY_LINK_REQUIRED'));

  // 2) Oversized title (>260 chars) on html_links source with generic root applyLink MUST stay pending_review (NOT quarantined)
  const gdsCfg = getSource('india_post_gds');
  const oversizedTitle = `Gramin Dak Sevak Online Engagement Special Recruitment Drive 2026 ${'Detailed Circle Notice '.repeat(12)}`;
  assert.ok(oversizedTitle.length > 260);
  const gdsOversized = evaluateCandidateTrust(
    {
      sourceKey: 'india_post_gds',
      category: 'psu',
      service: oversizedTitle,
      detailsLink: 'https://indiapostgdsonline.gov.in/notifications/gds-2026.pdf',
      applyLink: 'https://indiapostgdsonline.gov.in/'
    },
    {
      sourceKey: 'india_post_gds',
      sourceConfig: gdsCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'true' }
    }
  );
  assert.equal(gdsOversized.ingestionStatus, 'pending_review');
  assert.equal(gdsOversized.trustScore, 53);
  assert.equal(gdsOversized.autoPublished, false);
  assert.ok(gdsOversized.reviewReasons.includes('TITLE_OVERSIZED'));
  assert.ok(gdsOversized.reviewReasons.includes('GENERIC_APPLY_HOMEPAGE'));

  // 3) SSC generic homepage MUST remain blocked from auto-publishing even when AUTO_PUBLISH_ENABLED=true and all dates/PDF valid
  const sscCfg = getSource('ssc_notices');
  const sscGeneric = evaluateCandidateTrust(
    {
      sourceKey: 'ssc_notices',
      category: 'ssc',
      service: 'Combined Graduate Level Examination 2026 Recruitment Notice',
      notificationNo: '4207',
      sourcePublishedAt: '2026-11-20',
      openingDate: '2026-11-20',
      closingDate: '2026-12-20',
      detailsLink: 'https://ssc.gov.in/api/attachment/cgl-2026.pdf',
      applyLink: 'https://ssc.gov.in/'
    },
    {
      sourceKey: 'ssc_notices',
      sourceConfig: sscCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'true' }
    }
  );
  assert.equal(sscGeneric.ingestionStatus, 'pending_review');
  assert.equal(sscGeneric.autoPublished, false);
  assert.equal(sscGeneric.wouldAutoPublishIfEnabled, false);
  assert.ok(sscGeneric.reviewReasons.includes('GENERIC_APPLY_HOMEPAGE'));
  assert.ok(sscGeneric.unmetGates.includes('SPECIFIC_APPLY_LINK_REQUIRED'));

  // 4) Genuine Apply URL with full verified evidence remains eligible for gate (score=100, pending_review when AUTO_PUBLISH_ENABLED=false)
  const tnpscCfg = getSource('tnpsc');
  const genuineTnpsc = evaluateCandidateTrust(
    {
      sourceKey: 'tnpsc',
      category: 'tnpsc',
      service: 'TNPSC Combined Civil Services Examination - IV (Group IV) 2026',
      notificationNo: '01/2026',
      sourcePublishedAt: '15-11-2026',
      openingDate: '18-11-2026',
      closingDate: '20-12-2026',
      examDate: '14-03-2027',
      detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026_group4.pdf',
      applyLink: 'https://apply.tnpscexams.in/apply-now?id=01-2026'
    },
    {
      sourceKey: 'tnpsc',
      sourceConfig: tnpscCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'false' }
    }
  );
  assert.equal(genuineTnpsc.ingestionStatus, 'pending_review');
  assert.equal(genuineTnpsc.trustScore, 100);
  assert.equal(genuineTnpsc.wouldAutoPublishIfEnabled, true);
  assert.equal(genuineTnpsc.autoPublished, false);

  // 5) Missing Apply URL on existing pending_review case stays pending_review and blocked from auto-publish
  const missingApplyEval = evaluateCandidateTrust(
    {
      sourceKey: 'tnpsc',
      category: 'tnpsc',
      service: 'TNPSC Combined Civil Services Examination - IV (Group IV) 2026',
      notificationNo: '01/2026',
      sourcePublishedAt: '15-11-2026',
      openingDate: '18-11-2026',
      closingDate: '20-12-2026',
      detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026_group4.pdf',
      applyLink: ''
    },
    {
      sourceKey: 'tnpsc',
      sourceConfig: tnpscCfg,
      docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
      now: FIXED_NOW,
      env: { AUTO_PUBLISH_ENABLED: 'true' }
    }
  );
  assert.equal(missingApplyEval.ingestionStatus, 'pending_review');
  assert.equal(missingApplyEval.autoPublished, false);
  assert.equal(missingApplyEval.wouldAutoPublishIfEnabled, false);
  assert.ok(missingApplyEval.reviewReasons.includes('MISSING_GENUINE_APPLY_URL'));
});

test('All 19 Enabled Sources Compatibility: every enabled source routes safely to pending_review with zero unexpected quarantines', () => {
  const enabledSources = OFFICIAL_EXAM_SOURCES.filter((s) => s.enabled);
  assert.equal(enabledSources.length, 19);

  const samples = [
    { key: 'tnpsc', service: 'TNPSC Combined Civil Services Group IV 2026', notificationNo: '01/2026', detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026.pdf', applyLink: 'https://apply.tnpscexams.in/apply-now?id=01-2026', sourcePublishedAt: '15-11-2026', openingDate: '18-11-2026', closingDate: '20-12-2026' },
    { key: 'tnusrb', service: 'Joint Recruitment of Sub-Inspectors of Police 2026', notificationNo: '01/2026', detailsLink: 'https://tnusrb.tn.gov.in/notifications/si-2026.pdf', applyLink: 'https://tnusrb.tn.gov.in/online-application/si-2026', sourcePublishedAt: '10-11-2026', openingDate: '15-11-2026', closingDate: '22-12-2026' },
    { key: 'trb_tn', service: 'Direct Recruitment of Post Graduate Assistants 2026', notificationNo: '02/2026', detailsLink: 'https://trb.tn.gov.in/uploads/notifications/trb_pg_02_2026.pdf', applyLink: 'https://trb.tn.gov.in/apply_online.php?notif_id=02-2026', sourcePublishedAt: '12-11-2026', openingDate: '16-11-2026', closingDate: '24-12-2026' },
    { key: 'mrb_tn', service: 'MRB 04/MRB/2026: Assistant Surgeon Recruitment', notificationNo: '04/MRB/2026', detailsLink: 'https://www.mrb.tn.gov.in/pdf/2026/04_MRB_2026.PDF', applyLink: 'https://www.mrb.tn.gov.in/apply_online.php?advt=04-MRB-2026', sourcePublishedAt: '10-11-2026', openingDate: '12-11-2026', closingDate: '28-12-2026' },
    { key: 'ibps', service: 'CRP PO/MT-XV Probationary Officers Recruitment 2026', detailsLink: 'https://www.ibps.in/crp-po-2026.pdf', applyLink: 'https://www.ibps.in/crp-po-2026.pdf', openingDate: '', closingDate: '' },
    { key: 'sbi_careers', service: 'Recruitment of Probationary Officers 2026', notificationNo: 'CRPD/PO/2026-27/01', detailsLink: 'https://sbi.co.in/documents/po-2026.pdf', applyLink: 'https://ibpsonline.ibps.in/sbipo26/', openingDate: '15-11-2026', closingDate: '20-12-2026' },
    { key: 'rbi_vacancies', service: 'Recruitment of Officers in Grade B 2026', detailsLink: 'https://opportunities.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4501', applyLink: 'https://opportunities.rbi.org.in/scripts/bs_viewcontent.aspx?Id=4501', openingDate: '15-11-2026', closingDate: '' },
    { key: 'rrb_chennai', service: 'Indian Railways CEN 09/2025 Recruitment Notification: NTPC Graduate', notificationNo: 'CEN 09/2025', detailsLink: 'https://rrbchennai.gov.in/notice.php?cenum=09/2025&category=Notification', applyLink: 'https://rrbchennai.gov.in/', openingDate: '21-10-2026', closingDate: '' },
    { key: 'upsc_active', service: 'Civil Services Examination 2026', notificationNo: '05/2026-CSP', detailsLink: 'https://upsc.gov.in/examinations/civil-services-2026', applyLink: 'https://upsconline.nic.in/', openingDate: '', closingDate: '20-12-2026', examDate: '24-05-2027' },
    { key: 'ssc_notices', service: 'Combined Graduate Level Examination 2026 Notice', notificationNo: '4207', detailsLink: 'https://ssc.gov.in/api/attachment/cgl-2026.pdf', applyLink: 'https://ssc.gov.in/', sourcePublishedAt: '2026-11-20', openingDate: '2026-11-20', closingDate: '2026-12-20' },
    { key: 'india_post_gds', service: 'Gramin Dak Sevak Online Engagement Special Drive 2026', detailsLink: 'https://indiapostgdsonline.gov.in/notifications/gds-2026.pdf', applyLink: 'https://indiapostgdsonline.gov.in/', openingDate: '', closingDate: '' },
    { key: 'indian_navy', service: 'SSC Officer Entry Application Window 2026', detailsLink: 'https://www.joinindiannavy.gov.in/en/page/ssc-officer-2026.html', applyLink: 'https://www.joinindiannavy.gov.in/en/account/login', openingDate: '', closingDate: '' },
    { key: 'indian_airforce', service: 'Agniveervayu Intake 01/2027 Recruitment Notification', detailsLink: 'https://agnipathvayu.cdac.in/AV/img/upcoming/agniveer-2027.pdf', applyLink: 'https://agnipathvayu.cdac.in/', openingDate: '', closingDate: '' },
    { key: 'ctet_cbse', service: 'CTET December 2026 Information Bulletin', detailsLink: 'https://ctet.nic.in/document/bulletin-2026.pdf', applyLink: 'https://ctet.nic.in/', openingDate: '', closingDate: '' },
    { key: 'kvs_delhi', service: 'KVS Recruitment Notice for PGT TGT PRT Teachers 2026', detailsLink: 'https://kvs.gov.in/sites/default/files/kvs-recruit-2026.pdf', applyLink: 'https://kvs.gov.in/', openingDate: '15-11-2026', closingDate: '' },
    { key: 'lic_careers', service: 'Recruitment of Assistant Administrative Officers (AAO) 2026', detailsLink: 'https://licindia.in/documents/aao-2026.pdf', applyLink: 'https://licindia.in/documents/aao-2026.pdf', openingDate: '', closingDate: '' },
    { key: 'niacl_careers', service: 'Recruitment of Administrative Officers Scale I 2026', detailsLink: 'https://www.newindia.co.in/assets/docs/ao-2026.pdf', applyLink: 'https://www.newindia.co.in/recruitment/list', openingDate: '', closingDate: '' },
    { key: 'bel_psu', service: 'BEL Recruitment: Project Engineer Electronics 2026', detailsLink: 'https://bel-india.in/wp-content/uploads/2026/11/pe-2026.pdf', applyLink: 'https://jobapply.in/bel2026', openingDate: '', closingDate: '' },
    { key: 'bhel_psu', service: 'BHEL Engineer Trainee Recruitment 2026', detailsLink: 'https://careers.bhel.in/bhel/static/et-2026.pdf', applyLink: 'https://careers.bhel.in/', openingDate: '', closingDate: '' }
  ];

  assert.equal(samples.length, 19);
  for (const sample of samples) {
    const cfg = getSource(sample.key);
    const ev = evaluateCandidateTrust(
      { ...sample, sourceKey: sample.key, category: cfg.category },
      {
        sourceKey: sample.key,
        sourceConfig: cfg,
        docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
        now: FIXED_NOW,
        env: { AUTO_PUBLISH_ENABLED: 'false' }
      }
    );
    assert.equal(ev.ingestionStatus, 'pending_review', `${sample.key} must land in pending_review`);
    assert.equal(ev.autoPublished, false, `${sample.key} must not auto-publish`);
    assert.equal(ev.quarantineReasons.length, 0, `${sample.key} must have zero quarantine reasons`);
    assert.ok(ev.trustScore >= 50, `${sample.key} trustScore (${ev.trustScore}) must remain >= 50`);
  }
});
