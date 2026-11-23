// server/ingestion/scrapers/districtRecruitmentScraper.js
// AK E-SEVAI 2 — PHASE B2-C: Reusable Controlled Pilot District Recruitment Scraper Engine
// Restricted strictly to 5 pilot districts: Dindigul, Chennai, Coimbatore, Tiruchirappalli, Madurai
// Strict Official Government Domain Policy, SSRF Protection, Dual HTML/PDF Support, and Zero-Guessing Rule.

import * as cheerio from 'cheerio';
import { safeFetchHtml, classifyPdfBuffer } from '../fetchHelper.js';
import { validateExplicitSourceUrl } from '../officialDomainPolicy.js';
import { parseDateDetailed, isKnownDescriptiveDateText } from '../../../src/utils/notificationDateHelper.js';

/**
 * STRICT PILOT & CONTROLLED EXPANSION BOUNDARY: 10 Approved Districts
 * Original 5 Pilot Districts + 5 Phase B3 Expansion Districts
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
 * Extracts explicit vacancy number without guessing
 */
function extractExplicitVacancies(text) {
  if (!text) return '';
  const match = String(text).match(/\b(\d+)\s*(?:posts?|vacanc(?:y|ies)|பணியிடங்கள்|medical officers?|staff nurses?|assistants?|engineers?)\b/i);
  return match ? `${match[1]} Posts` : '';
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

/**
 * Resolves absolute URL safely against base URL with district eCourts awareness
 */
function resolveUrl(href, baseUrl) {
  if (!href || href === '#' || href.startsWith('javascript:')) return '';
  try {
    const base = new URL(baseUrl);
    if (base.hostname === 'districts.ecourts.gov.in') {
      const parts = base.pathname.split('/').filter(Boolean);
      const distSlug = parts[0]; // e.g. 'madurai'
      if (distSlug && !href.startsWith(`/${distSlug}/`)) {
        return new URL(`/${distSlug}${href.startsWith('/') ? '' : '/'}${href}`, base.origin).toString();
      }
    }
    return new URL(href, baseUrl).toString();
  } catch {
    return '';
  }
}

/**
 * Classifies date and detects expiration against reference today
 */
function analyzeClosingDate(rawDateStr, todayIso = '2026-11-18') {
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

    // PDF link
    let pdfUrl = '';
    $row.find('a').each((_, a) => {
      const href = $(a).attr('href') || '';
      const text = $(a).text().trim().toLowerCase();
      if (href.toLowerCase().endsWith('.pdf') || text.includes('download') || text.includes('view') || text.includes('pdf')) {
        const abs = resolveUrl(href, baseUrl);
        if (abs && !pdfUrl) pdfUrl = abs;
      }
    });

    const closingAnalysis = analyzeClosingDate(endCell, options.todayIso || '2026-11-18');
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
      detailsLink: pdfUrl || baseUrl,
      pdfUrl: pdfUrl || '',
      applyLink: baseUrl,
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
    $row.find('a').each((_, a) => {
      const href = $(a).attr('href') || '';
      if (href.toLowerCase().endsWith('.pdf') || $(a).text().toLowerCase().includes('pdf')) {
        const abs = resolveUrl(href, baseUrl);
        if (abs && !pdfUrl) pdfUrl = abs;
      }
    });

    const closingAnalysis = analyzeClosingDate(endCell, options.todayIso || '2026-11-18');
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
      detailsLink: pdfUrl || baseUrl,
      pdfUrl: pdfUrl || '',
      applyLink: baseUrl,
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
    $el.find('a').each((_, a) => {
      const href = $(a).attr('href') || '';
      if (href.toLowerCase().endsWith('.pdf') || $(a).text().toLowerCase().includes('pdf') || $(a).text().toLowerCase().includes('download')) {
        const abs = resolveUrl(href, baseUrl);
        if (abs && !pdfUrl) pdfUrl = abs;
      }
    });

    const dateMatch = $el.text().match(/(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/g);
    const startCell = dateMatch && dateMatch[0] ? dateMatch[0] : '';
    const endCell = dateMatch && dateMatch[1] ? dateMatch[1] : (dateMatch && dateMatch[0] ? dateMatch[0] : '');

    const closingAnalysis = analyzeClosingDate(endCell, options.todayIso || '2026-11-18');
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
      detailsLink: pdfUrl || baseUrl,
      pdfUrl: pdfUrl || '',
      applyLink: baseUrl,
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

  // 1. Boundary enforcement: Only 5 Pilot Districts
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
