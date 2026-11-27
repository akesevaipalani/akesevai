// server/ingestion/scrapers/districtRecruitmentScraper.js
// AK E-SEVAI 2 — PHASE B2-C: Reusable Controlled Pilot & Expansion District Recruitment Scraper Engine
// Supports 15 approved Tamil Nadu districts (all 38 districts & 21 corps cataloged in districtSourcesInventory.js; not yet enabled in sourcesConfig.js).
// Strict Official Government Domain Policy, SSRF Protection, Dual HTML/PDF Support, and Zero-Guessing Rule.

import * as cheerio from 'cheerio';
import { safeFetchHtml, classifyPdfBuffer } from '../fetchHelper.js';
import { validateExplicitSourceUrl } from '../officialDomainPolicy.js';
import { isGenericListingOrDirectoryUrl } from '../trustScoringEngine.js';
import {
  parseDateDetailed,
  isKnownDescriptiveDateText,
  getKolkataToday,
  isGenericRootHomepage
} from '../../../src/utils/notificationDateHelper.js';

/**
 * STRICT PILOT & CONTROLLED EXPANSION BOUNDARY: 15 Approved Districts
 * Original 5 Pilot Districts + 10 Controlled Expansion Districts
 * (Note: Full 38-district inventory is cataloged in districtSourcesInventory.js and not yet enabled in sourcesConfig.js)
 */
export const PILOT_DISTRICT_IDS = new Set([
  'dindigul',
  'chennai',
  'coimbatore',
  'tiruchirappalli',
  'madurai',
  'salem',
  'tirunelveli',
  'erode',
  'vellore',
  'thanjavur',
  'cuddalore',
  'kancheepuram',
  'thoothukudi',
  'tiruppur',
  'tiruvallur'
]);

/**
 * Polite Jittered Request Interval: 2000ms – 3000ms
 */
export async function applyJitteredDelay(minMs = 2000, maxMs = 3000, skipDelay = false) {
  if (skipDelay) return 0;
  const jitter = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  await new Promise((resolve) => setTimeout(resolve, jitter));
  return jitter;
}

/**
 * Computes deterministic identity fingerprint for duplicate prevention
 */
export function computeIdentityFingerprint(org, post, closingDate) {
  const norm = (str) =>
    String(str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  return `${norm(org)}|${norm(post)}|${norm(closingDate)}`;
}

/**
 * Extracts explicit positive vacancy count without guessing.
 * Rejects zero counts, calendar years (2020-2035) before "Posts", and non-vacancy prefixes
 * such as "Group 4 Posts", "Grade 2 Medical Officers", "Pay Level 10 Assistants", or "Recruitment 2026 Posts".
 */
export function extractExplicitVacancies(rawText) {
  const text = String(rawText ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return '';

  // 1. Keyword-before-number: "Total Vacancies: 45", "No. of Posts - 12", "Vacancies: 25"
  const kwBefore = text.match(
    /(?:total\s+(?:no\.?\s*of\s*)?(?:vacanc(?:y|ies)|posts?|பணியிடங்கள்)|no\.?\s*of\s*(?:vacanc(?:y|ies)|posts?)|vacanc(?:y|ies)|total\s+posts?)\s*[:\-–=]?\s*(?:approx\.?\s*)?(\d{1,3}(?:,\d{3})+|\d{1,6})\b/i
  );
  if (kwBefore) {
    const n = parseInt(kwBefore[1].replace(/,/g, ''), 10);
    if (Number.isInteger(n) && n >= 1 && n <= 500000) {
      return `${n} Posts`;
    }
    return '';
  }

  // 2. Number-before-keyword with prefix exclusion & bare calendar-year protection
  const numBeforeRe =
    /(?:^|[\s(\[-])(\d{1,3}(?:,\d{3})+|\d{1,6})\s*\+?\s*(posts?|vacanc(?:y|ies)|openings?|பணியிடங்கள்|medical\s+officers?|staff\s+nurses?|assistants?|engineers?)\b/gi;
  let match;
  while ((match = numBeforeRe.exec(text)) !== null) {
    const numToken = match[1];
    const keywordToken = (match[2] || '').toLowerCase();
    const numStart = match.index + match[0].indexOf(numToken);
    const prefix = text.slice(Math.max(0, numStart - 24), numStart).trimEnd().toLowerCase();

    if (
      /(?:^|[\s(\[/,\-–:])(?:rs\.?|₹|inr|pay|level|grade|scale|advt\.?|notif(?:ication)?|no\.?|group|category|stage|tier|phase|class|part|paper|batch|division|recruitment|exam|examination)[\s\-–:.]*$/i.test(prefix)
    ) {
      continue;
    }

    // Reject bare 4-digit calendar years (2020-2035) immediately before "Post/Posts"
    const isBareYearBeforePosts =
      /^(?:202\d|203[0-5])$/.test(numToken) &&
      !match[0].includes('+') &&
      /^posts?$/i.test(keywordToken) &&
      !/(?:^|[\s(\[/,\-–:])(?:total|approx\.?|about)[\s\-–:.]*$/i.test(prefix);
    if (isBareYearBeforePosts) {
      continue;
    }

    const n = parseInt(numToken.replace(/,/g, ''), 10);
    if (Number.isInteger(n) && n >= 1 && n <= 500000) {
      return `${n} Posts`;
    }
  }

  return '';
}

/**
 * Extracts explicit qualification without guessing
 */
function extractExplicitQualification(text) {
  if (!text) return '';
  const match = String(text).match(
    /\b(MBBS|MD|B\.?Sc\.? Nursing|GNM|Diploma|B\.?E\.?|B\.?Tech|10th Pass|12th Pass|SSLC|HSC|Any Degree|Graduation|ITI|Post Graduate|B\.?Ed)\b/i
  );
  return match ? match[0] : '';
}

function normalizeUrlForCompare(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  return rawUrl.trim().split('#')[0].replace(/\/+$/, '').toLowerCase();
}

function isPdfUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    const parsed = new URL(rawUrl);
    return /\.pdf$/i.test(parsed.pathname || '');
  } catch {
    return /\.pdf(?:$|\?|#)/i.test(rawUrl);
  }
}

/**
 * Resolves absolute URL safely against base URL with district eCourts awareness
 * and strict scheme, control-character, protocol-relative, and explicit domain-policy validation.
 */
export function resolveDistrictUrlSafe(href, baseUrl, sourceKey = '', linkKind = 'notice', options = {}) {
  if (typeof href !== 'string') return '';
  const trimmed = href.trim();
  if (!trimmed || trimmed === '#' || trimmed.startsWith('#')) {
    return '';
  }
  if (/[\u0000-\u001F\u007F]/.test(trimmed)) {
    return '';
  }
  if (trimmed.startsWith('//') || trimmed.includes('\\')) {
    return '';
  }
  if (/^(javascript|vbscript|data|file|mailto|tel|blob|ftp):/i.test(trimmed)) {
    return '';
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !/^https?:/i.test(trimmed)) {
    return '';
  }

  let parsed;
  try {
    const base = new URL(baseUrl);
    const isAbsoluteHttp = /^https?:\/\//i.test(trimmed);
    if (!isAbsoluteHttp && base.hostname === 'districts.ecourts.gov.in') {
      const parts = base.pathname.split('/').filter(Boolean);
      const distSlug = parts[0]; // e.g. 'madurai'
      if (distSlug && !trimmed.startsWith(`/${distSlug}/`)) {
        parsed = new URL(`/${distSlug}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`, base.origin);
      } else {
        parsed = new URL(trimmed, baseUrl);
      }
    } else {
      parsed = new URL(trimmed, baseUrl);
    }
  } catch {
    return '';
  }

  const allowHttpForLocalMock = Boolean(options.allowHttpForLocalMock);
  if (parsed.protocol !== 'https:' && !(allowHttpForLocalMock && parsed.protocol === 'http:')) {
    return '';
  }
  if (!parsed.hostname) {
    return '';
  }

  const resolved = parsed.toString();
  if (sourceKey) {
    const check = validateExplicitSourceUrl(resolved, sourceKey, linkKind, {
      allowHttpForLocalMock
    });
    if (!check.valid) {
      return '';
    }
  }

  return resolved;
}

/**
 * Validates that a candidate Apply URL for a district notice is genuinely notification-specific,
 * non-PDF, non-generic, and authorized for the district sourceKey.
 */
export function isValidDistrictApplyUrl(absUrl, sourceConfig = {}, options = {}) {
  if (!absUrl || typeof absUrl !== 'string') return false;
  if (isPdfUrl(absUrl)) return false;
  if (isGenericRootHomepage(absUrl) || isGenericListingOrDirectoryUrl(absUrl)) return false;

  const normAbs = normalizeUrlForCompare(absUrl);
  const normRecruit = normalizeUrlForCompare(sourceConfig?.recruitmentUrl || '');
  const normPortal = normalizeUrlForCompare(sourceConfig?.officialWebsiteUrl || '');
  if ((normRecruit && normAbs === normRecruit) || (normPortal && normAbs === normPortal)) {
    return false;
  }

  const sourceKey = sourceConfig?.sourceKey || sourceConfig?.key || '';
  if (sourceKey) {
    const check = validateExplicitSourceUrl(absUrl, sourceKey, 'apply', {
      allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
    });
    if (!check.valid) return false;
  }

  return true;
}

function looksLikeDistrictApplyAnchor(text, titleAttr, absUrl) {
  const combinedLabel = `${text || ''} ${titleAttr || ''}`.toLowerCase();
  if (
    /\b(apply\s*online|apply\s*now|online\s*application|online\s*registration|apply\s*here|click\s*(?:here\s*)?to\s*apply|register\s*online|submit\s*application)\b/i.test(combinedLabel)
  ) {
    return true;
  }
  try {
    const parsed = new URL(absUrl);
    return /\/(apply|apply[-_]?online|apply[-_]?now|online[-_]?application|online[-_]?registration|registration)\b/i.test(
      (parsed.pathname || '').toLowerCase()
    );
  } catch {
    return false;
  }
}

function extractDistrictApplyLink($, $container, baseUrl, sourceConfig, options = {}) {
  let applyLink = '';
  const sourceKey = sourceConfig?.sourceKey || sourceConfig?.key || '';
  $container.find('a').each((_, a) => {
    if (applyLink) return;
    const href = $(a).attr('href') || '';
    const text = $(a).text().replace(/\s+/g, ' ').trim();
    const titleAttr = `${$(a).attr('title') || ''} ${$(a).attr('aria-label') || ''}`.trim();
    const abs = resolveDistrictUrlSafe(href, baseUrl, sourceKey, 'apply', options);
    if (!abs) return;
    if (looksLikeDistrictApplyAnchor(text, titleAttr, abs) && isValidDistrictApplyUrl(abs, sourceConfig, options)) {
      applyLink = abs;
    }
  });
  return applyLink;
}

/**
 * Classifies date and detects expiration against reference today
 */
function analyzeClosingDate(rawDateStr, todayIso = getKolkataToday().isoDate) {
  if (!rawDateStr) {
    return { valid: false, parsedIso: '', isExpired: false, reason: 'MISSING_DATE' };
  }
  const parsed = parseDateDetailed(rawDateStr);
  if (!parsed || parsed.kind === 'empty' || parsed.kind === 'unrecognized' || parsed.kind === 'invalid_calendar') {
    return { valid: false, parsedIso: '', isExpired: false, reason: 'INVALID_CALENDAR_DATE' };
  }
  const iso = parsed.components?.isoDate || parsed.isoDate || '';
  const isExpired = Boolean(iso && iso < todayIso);
  return { valid: true, parsedIso: iso, isExpired, reason: 'VALID_DATE' };
}

/**
 * Parses Standard NIC S3WaaS Recruitment Tables
 * Covers Collectorate, DHS, DRDA, DCPU, ATMA notices
 */
export function extractS3waasTableNotifications(html, sourceConfig, options = {}) {
  const items = [];
  const $ = cheerio.load(html);
  const baseUrl = sourceConfig.recruitmentUrl;

  const rows = $('table tbody tr, table.views-table tr, .table tr');
  if (rows.length === 0) {
    // Check if dynamic JavaScript container or empty table is present
    const hasDynamicContainer = $('.view-empty, .ajax-view, #block-system-main, .region-content').length > 0;
    return {
      items: [],
      note: hasDynamicContainer ? 'JAVASCRIPT_RENDERED_OR_EMPTY_TABLE' : 'NO_TABLE_FOUND'
    };
  }

  rows.each((i, row) => {
    const $row = $(row);
    const cells = $row.find('td');
    if (cells.length < 3) return; // Skip headers or invalid rows

    // Title / Post name cell
    const titleCell = $row.find('td.views-field-title, td:nth-child(1), td:nth-child(2)').first();
    const rawTitle = titleCell.text().replace(/\s+/g, ' ').trim();
    if (!rawTitle || /^(?:sl\.?\s*no\.?|post\s*name|recruitment(?:\s*(?:title|details|notice))?|name\s*of\s*the\s*post|title)$/i.test(rawTitle)) return;

    // Dates
    const startCell = $row.find('td.views-field-field-start-date, td:nth-child(3)').text().trim();
    const endCell = $row.find('td.views-field-field-end-date, td:nth-child(4)').text().trim();

    // PDF link (strictly validated against unsafe schemes & explicit district domain policy)
    let pdfUrl = '';
    const sourceKey = sourceConfig?.sourceKey || sourceConfig?.key || '';
    $row.find('a').each((_, a) => {
      const href = $(a).attr('href') || '';
      const text = $(a).text().trim().toLowerCase();
      if (href.toLowerCase().endsWith('.pdf') || text.includes('download') || text.includes('view') || text.includes('pdf')) {
        const abs = resolveDistrictUrlSafe(href, baseUrl, sourceKey, 'notice', options);
        if (abs && !pdfUrl) pdfUrl = abs;
      }
    });
    const applyLink = extractDistrictApplyLink($, $row, baseUrl, sourceConfig, options);

    const closingAnalysis = analyzeClosingDate(endCell, options.todayIso || getKolkataToday().isoDate);
    const vacancies = extractExplicitVacancies(rawTitle);
    const qualification = extractExplicitQualification(rawTitle);
    const identityFingerprint = computeIdentityFingerprint(sourceConfig.organization, rawTitle, closingAnalysis.parsedIso || endCell);

    // Quarantine determination
    let ingestionStatus = 'pending_review';
    let quarantineReason = null;

    if (!pdfUrl) {
      ingestionStatus = 'quarantined';
      quarantineReason = 'MISSING_OFFICIAL_SOURCE_EVIDENCE';
    } else if (!closingAnalysis.valid && endCell) {
      ingestionStatus = 'quarantined';
      quarantineReason = 'INVALID_CLOSING_DATE';
    }

    items.push({
      sourceKey: sourceConfig.sourceKey,
      category: sourceConfig.departmentId === 'district_health_society' ? 'medical' : 'other',
      department: sourceConfig.departmentNameEn,
      district: sourceConfig.districtId,
      districtIds: [sourceConfig.districtId],
      organization: sourceConfig.organization,
      service: rawTitle,
      postName: rawTitle,
      qualification: qualification || 'Refer Official Notification',
      posts: vacancies || 'Not Specified',
      vacancies: vacancies || 'Not Specified',
      ageLimit: 'Refer Official Notification',
      applicationFee: 'Refer Official Notification',
      openingDate: startCell || '',
      closingDate: endCell || '',
      examDate: 'To Be Announced',
      detailsLink: pdfUrl || '',
      pdfUrl: pdfUrl || '',
      applyLink,
      sourceUrl: baseUrl,
      isExpired: closingAnalysis.isExpired,
      ingestionStatus, // STRICT: NEVER auto-publish
      quarantineReason,
      trustScore: pdfUrl ? 85 : 40,
      identityFingerprint,
      sourceEvidence: {
        sourceKey: sourceConfig.sourceKey,
        officialDomain: sourceConfig.officialDomainPattern,
        sourceUrl: baseUrl,
        pdfUrl: pdfUrl || null,
        rawTitleExcerpt: rawTitle.substring(0, 150),
        rawClosingDate: endCell,
        fetchedAt: new Date().toISOString()
      }
    });
  });

  return { items, note: items.length > 0 ? 'SUCCESS_TABLE_EXTRACT' : 'NO_NOTIFICATIONS_EXTRACTED' };
}

/**
 * Parses eCourts Project Recruitment Tables
 * Covers District Courts
 */
export function extractEcourtTableNotifications(html, sourceConfig, options = {}) {
  const items = [];
  const $ = cheerio.load(html);
  const baseUrl = sourceConfig.recruitmentUrl;

  const rows = $('table tbody tr, table tr');
  rows.each((i, row) => {
    const $row = $(row);
    const cells = $row.find('td');
    if (cells.length < 3) return;

    const rawTitle = $(cells[1] || cells[0]).text().replace(/\s+/g, ' ').trim();
    if (!rawTitle || /^(?:sl\.?\s*no\.?|post\s*name|recruitment(?:\s*(?:title|details|notice))?|name\s*of\s*the\s*post|description)$/i.test(rawTitle)) return;

    const startCell = $(cells[2]).text().trim();
    const endCell = cells.length >= 4 ? $(cells[3]).text().trim() : '';

    let pdfUrl = '';
    const sourceKey = sourceConfig?.sourceKey || sourceConfig?.key || '';
    $row.find('a').each((_, a) => {
      const href = $(a).attr('href') || '';
      if (href.toLowerCase().endsWith('.pdf') || $(a).text().toLowerCase().includes('pdf')) {
        const abs = resolveDistrictUrlSafe(href, baseUrl, sourceKey, 'notice', options);
        if (abs && !pdfUrl) pdfUrl = abs;
      }
    });
    const applyLink = extractDistrictApplyLink($, $row, baseUrl, sourceConfig, options);

    const closingAnalysis = analyzeClosingDate(endCell, options.todayIso || getKolkataToday().isoDate);
    const vacancies = extractExplicitVacancies(rawTitle);
    const qualification = extractExplicitQualification(rawTitle);
    const identityFingerprint = computeIdentityFingerprint(sourceConfig.organization, rawTitle, closingAnalysis.parsedIso || endCell);

    let ingestionStatus = 'pending_review';
    let quarantineReason = null;

    if (!pdfUrl) {
      ingestionStatus = 'quarantined';
      quarantineReason = 'MISSING_OFFICIAL_SOURCE_EVIDENCE';
    } else if (!closingAnalysis.valid && endCell) {
      ingestionStatus = 'quarantined';
      quarantineReason = 'INVALID_CLOSING_DATE';
    }

    items.push({
      sourceKey: sourceConfig.sourceKey,
      category: 'other',
      department: sourceConfig.departmentNameEn,
      district: sourceConfig.districtId,
      districtIds: [sourceConfig.districtId],
      organization: sourceConfig.organization,
      service: rawTitle,
      postName: rawTitle,
      qualification: qualification || 'Refer Official Notification',
      posts: vacancies || 'Not Specified',
      vacancies: vacancies || 'Not Specified',
      ageLimit: 'Refer Official Notification',
      applicationFee: 'Refer Official Notification',
      openingDate: startCell || '',
      closingDate: endCell || '',
      examDate: 'To Be Announced',
      detailsLink: pdfUrl || '',
      pdfUrl: pdfUrl || '',
      applyLink,
      sourceUrl: baseUrl,
      isExpired: closingAnalysis.isExpired,
      ingestionStatus,
      quarantineReason,
      trustScore: pdfUrl ? 85 : 40,
      identityFingerprint,
      sourceEvidence: {
        sourceKey: sourceConfig.sourceKey,
        officialDomain: sourceConfig.officialDomainPattern,
        sourceUrl: baseUrl,
        pdfUrl: pdfUrl || null,
        rawTitleExcerpt: rawTitle.substring(0, 150),
        rawClosingDate: endCell,
        fetchedAt: new Date().toISOString()
      }
    });
  });

  return { items, note: items.length > 0 ? 'SUCCESS_ECOURTS_EXTRACT' : 'NO_NOTIFICATIONS_EXTRACTED' };
}

/**
 * Parses Municipal Corporation Portals (GCC, CCMC, Madurai, Trichy, Dindigul)
 */
export function extractMunicipalCorpNotifications(html, sourceConfig, options = {}) {
  const items = [];
  const $ = cheerio.load(html);
  const baseUrl = sourceConfig.recruitmentUrl;

  // Try table or card structures
  const cards = $('.recruitment-card, .views-row, .notice-item, table tbody tr, .card');
  if (cards.length === 0) {
    return { items: [], note: 'JAVASCRIPT_RENDERED_OR_EMPTY_TABLE' };
  }

  cards.each((i, el) => {
    const $el = $(el);
    const titleEl = $el.find('h3, h4, .title, .views-field-title, td:nth-child(2)').first();
    const rawTitle = (titleEl.text() || $el.find('a').first().text()).replace(/\s+/g, ' ').trim();
    if (!rawTitle || /^(?:sl\.?\s*no\.?|post\s*name|recruitment(?:\s*(?:title|details|notice))?|name\s*of\s*the\s*post)$/i.test(rawTitle)) return;

    let pdfUrl = '';
    const sourceKey = sourceConfig?.sourceKey || sourceConfig?.key || '';
    $el.find('a').each((_, a) => {
      const href = $(a).attr('href') || '';
      if (href.toLowerCase().endsWith('.pdf') || $(a).text().toLowerCase().includes('pdf') || $(a).text().toLowerCase().includes('download')) {
        const abs = resolveDistrictUrlSafe(href, baseUrl, sourceKey, 'notice', options);
        if (abs && !pdfUrl) pdfUrl = abs;
      }
    });
    const applyLink = extractDistrictApplyLink($, $el, baseUrl, sourceConfig, options);

    const dateMatch = $el.text().match(/(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/g);
    const startCell = dateMatch && dateMatch[0] ? dateMatch[0] : '';
    const endCell = dateMatch && dateMatch[1] ? dateMatch[1] : (dateMatch && dateMatch[0] ? dateMatch[0] : '');

    const closingAnalysis = analyzeClosingDate(endCell, options.todayIso || getKolkataToday().isoDate);
    const vacancies = extractExplicitVacancies(rawTitle + ' ' + $el.text());
    const qualification = extractExplicitQualification(rawTitle + ' ' + $el.text());
    const identityFingerprint = computeIdentityFingerprint(sourceConfig.organization, rawTitle, closingAnalysis.parsedIso || endCell);

    let ingestionStatus = 'pending_review';
    let quarantineReason = null;

    if (!pdfUrl) {
      ingestionStatus = 'quarantined';
      quarantineReason = 'MISSING_OFFICIAL_SOURCE_EVIDENCE';
    } else if (!closingAnalysis.valid && endCell) {
      ingestionStatus = 'quarantined';
      quarantineReason = 'INVALID_CLOSING_DATE';
    }

    items.push({
      sourceKey: sourceConfig.sourceKey,
      category: 'other',
      department: sourceConfig.departmentNameEn,
      district: sourceConfig.districtId,
      districtIds: [sourceConfig.districtId],
      organization: sourceConfig.organization,
      service: rawTitle,
      postName: rawTitle,
      qualification: qualification || 'Refer Official Notification',
      posts: vacancies || 'Not Specified',
      vacancies: vacancies || 'Not Specified',
      ageLimit: 'Refer Official Notification',
      applicationFee: 'Refer Official Notification',
      openingDate: startCell || '',
      closingDate: endCell || '',
      examDate: 'To Be Announced',
      detailsLink: pdfUrl || '',
      pdfUrl: pdfUrl || '',
      applyLink,
      sourceUrl: baseUrl,
      isExpired: closingAnalysis.isExpired,
      ingestionStatus,
      quarantineReason,
      trustScore: pdfUrl ? 85 : 40,
      identityFingerprint,
      sourceEvidence: {
        sourceKey: sourceConfig.sourceKey,
        officialDomain: sourceConfig.officialDomainPattern,
        sourceUrl: baseUrl,
        pdfUrl: pdfUrl || null,
        rawTitleExcerpt: rawTitle.substring(0, 150),
        rawClosingDate: endCell,
        fetchedAt: new Date().toISOString()
      }
    });
  });

  return { items, note: items.length > 0 ? 'SUCCESS_CORP_EXTRACT' : 'NO_NOTIFICATIONS_EXTRACTED' };
}

/**
 * Validates PDF Content-Type and Magic Bytes (%PDF-1.x)
 */
export function verifyPdfDocument(buffer, contentType = '') {
  return classifyPdfBuffer(buffer, {
    httpStatus: 200,
    contentType,
    truncated: false,
    receivedBytes: buffer ? buffer.length : 0
  });
}

/**
 * Master Pilot District Scraper Entry Point
 * Strictly enforces pilot boundaries, SSRF validation, polite delays, and retry logic.
 */
export async function scrapePilotDistrictSource(sourceConfig, options = {}) {
  const sourceKey = sourceConfig.sourceKey || sourceConfig.key;
  const recruitmentUrl = sourceConfig.recruitmentUrl || sourceConfig.url;
  const districtId = sourceConfig.districtId;

  // 1. Boundary enforcement: Only 15 Approved Pilot & Expansion Districts
  if (!PILOT_DISTRICT_IDS.has(districtId)) {
    return {
      success: false,
      source: sourceKey,
      error: `PILOT_DISTRICT_RESTRICTION: District ${districtId} is outside Phase B2-C pilot scope`,
      items: [],
      health: {
        sourceKey,
        districtId,
        departmentId: sourceConfig.departmentId,
        status: 'blocked_outside_pilot',
        itemsExtracted: 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  // 2. Pre-flight outbound domain & URL validation
  const preCheck = validateExplicitSourceUrl(recruitmentUrl, sourceKey, 'notice', {
    allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
  });

  if (!preCheck.valid) {
    return {
      success: false,
      source: sourceKey,
      error: `SECURITY_BLOCKED_URL: ${preCheck.reason}`,
      items: [],
      health: {
        sourceKey,
        districtId,
        departmentId: sourceConfig.departmentId,
        status: 'quarantined_domain_policy',
        itemsExtracted: 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  // 3. Polite Rate Limiting & Jitter
  await applyJitteredDelay(2000, 3000, Boolean(options.skipDelay));

  // 4. Safe Fetch with 1-shot retry on timeout
  let fetchRes = null;
  const maxRetries = typeof options.maxRetries === 'number' ? options.maxRetries : 1;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    fetchRes = await safeFetchHtml(recruitmentUrl, {
      sourceKey,
      timeoutMs: options.timeoutMs || 8000,
      allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock),
      dnsLookup: options.dnsLookup
    });

    if (fetchRes.ok || attempt === maxRetries) {
      break;
    }
    // Exponential retry backoff on transient timeout / 503
    if (fetchRes.failureCode === 'SOCKET_TIMEOUT' || fetchRes.failureCode === 'WALL_CLOCK_TIMEOUT' || fetchRes.status === 503) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
    } else {
      break; // Non-retryable error (e.g. 404, blocked IP)
    }
  }

  if (!fetchRes.ok) {
    return {
      success: false,
      source: sourceKey,
      error: fetchRes.error,
      failureCode: fetchRes.failureCode,
      items: [],
      health: {
        sourceKey,
        districtId,
        departmentId: sourceConfig.departmentId,
        status: 'failed',
        error: fetchRes.error,
        itemsExtracted: 0,
        timestamp: new Date().toISOString()
      }
    };
  }

  // 5. Structure Dispatcher
  let extractionResult;
  if (sourceConfig.sourceType === 'ecourts_recruitment_table') {
    extractionResult = extractEcourtTableNotifications(fetchRes.html, sourceConfig, options);
  } else if (sourceConfig.sourceType === 'municipal_corp_portal') {
    extractionResult = extractMunicipalCorpNotifications(fetchRes.html, sourceConfig, options);
  } else {
    extractionResult = extractS3waasTableNotifications(fetchRes.html, sourceConfig, options);
  }

  return {
    success: true,
    source: sourceKey,
    note: extractionResult.note,
    items: extractionResult.items,
    health: {
      sourceKey,
      districtId,
      departmentId: sourceConfig.departmentId,
      status: extractionResult.items.length > 0 ? 'success' : 'empty_or_dynamic_js',
      itemsExtracted: extractionResult.items.length,
      timestamp: new Date().toISOString()
    }
  };
}
