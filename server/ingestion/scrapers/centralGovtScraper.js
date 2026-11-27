// server/ingestion/scrapers/centralGovtScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';
import { EXPLICIT_SOURCE_DOMAIN_MAP, validateExplicitSourceUrl } from '../officialDomainPolicy.js';
import { toKolkataIsoDate } from '../../../src/utils/notificationDateHelper.js';

function withSourceKey(sourceConfig, options = {}, fallbackKey = '') {
  const canonicalFallback = String(fallbackKey || '').trim();
  const configKey = String(sourceConfig?.key || '').trim();
  const callerKey = String(options?.sourceKey || '').trim();
  const isRegistered = (key) => Boolean(key && Object.prototype.hasOwnProperty.call(EXPLICIT_SOURCE_DOMAIN_MAP, key));

  let resolvedKey = '';
  if (isRegistered(canonicalFallback)) {
    resolvedKey = canonicalFallback;
  } else if (isRegistered(configKey)) {
    resolvedKey = configKey;
  } else {
    resolvedKey = configKey || canonicalFallback || callerKey || '__INVALID_SOURCE_KEY__';
  }

  return {
    ...options,
    sourceKey: resolvedKey
  };
}

export function resolveUrlSafe(href, baseUrl) {
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
  if (/^(javascript|vbscript|data|file|mailto|tel|blob):/i.test(trimmed)) {
    return '';
  }
  let parsed;
  try {
    parsed = new URL(trimmed, baseUrl);
  } catch {
    return '';
  }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return '';
  }
  if (!parsed.hostname) {
    return '';
  }
  return parsed.toString();
}

/**
 * Scrapes UPSC Active Examinations & Notices
 * Supports both structured table layout and Drupal .views-row layout.
 */
export async function scrapeUpscNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url || 'https://upsc.gov.in/active-examinations';
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'upsc_active'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenTitles = new Set();
  const rows = $('table tr');

  rows.each((i, row) => {
    if (i === 0) return; // Skip table header: Examination Name | Notice No | Date of Commencement | Last Date
    const cols = $(row).find('td');
    if (cols.length < 3) return;

    const titleEl = $(cols[0]);
    const a = titleEl.find('a').first();
    const rawTitle = titleEl.text().replace(/\s+/g, ' ').trim();
    if (!rawTitle || rawTitle.toLowerCase().includes('examination name')) return;

    const lower = rawTitle.toLowerCase();
    if (lower.startsWith('final result:') || lower.includes('marks of recommended candidates')) {
      return;
    }
    if (seenTitles.has(rawTitle)) return;
    seenTitles.add(rawTitle);

    const notifNo = $(cols[1]).text().replace(/\s+/g, ' ').trim().replace(/^[—\-]+$/, '');
    const examDate = $(cols[2]).text().replace(/\s+/g, ' ').trim();
    const closingDate = cols.length >= 4 ? $(cols[3]).text().replace(/\s+/g, ' ').trim().replace(/^(?:NA|—|-)$/i, '') : '';

    const href = a.attr('href') || '';
    const absLink = resolveUrlSafe(href, url || 'https://upsc.gov.in/') || url;

    items.push({
      sourceKey: 'upsc_active',
      category: 'upsc',
      organization: 'Union Public Service Commission (UPSC)',
      service: rawTitle,
      postName: rawTitle.replace(/^(Notice:|Written Result:|Interview Schedule:)\s*/i, '').trim(),
      notificationNo: notifNo || '',
      openingDate: '',
      closingDate: closingDate || '',
      examDate: examDate || 'To Be Announced',
      qualification: 'Refer Official Notification',
      ageLimit: 'Refer Official Notification',
      applicationFee: 'Refer Official Notification',
      vacancies: 'Not Specified',
      detailsLink: absLink,
      applyLink: 'https://upsconline.nic.in/',
      source: 'Official UPSC Active Examinations Portal (upsc.gov.in)',
      sourceUrl: url
    });
  });

  if (items.length === 0) {
    $('.views-row').each((_, row) => {
      const a = $(row).find('a').first();
      const rawTitle = $(row).text().replace(/\s+/g, ' ').trim();
      const href = a.attr('href') || '';
      if (!rawTitle || !href) return;

      const lower = rawTitle.toLowerCase();
      if (lower.startsWith('final result:') || lower.includes('marks of recommended candidates')) {
        return;
      }
      if (seenTitles.has(rawTitle)) return;
      seenTitles.add(rawTitle);

      const absLink = resolveUrlSafe(href, 'https://upsc.gov.in/') || url;
      items.push({
        sourceKey: 'upsc_active',
        category: 'upsc',
        organization: 'Union Public Service Commission (UPSC)',
        service: rawTitle,
        postName: rawTitle.replace(/^(Notice:|Written Result:|Interview Schedule:)\s*/i, '').trim(),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: 'https://upsconline.nic.in/',
        source: 'Official UPSC Active Examinations Portal (upsc.gov.in)',
        sourceUrl: url
      });
    });
  }

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Safely resolves and validates an SSC notice attachment path or URL.
 * Rejects unsafe schemes, control characters, backslashes, protocol-relative URLs,
 * path traversal segments, non-official hosts, and non-PDF attachments.
 *
 * @param {string} rawPath
 * @param {Object} [options={}]
 * @returns {string} Validated official SSC PDF URL, or '' if rejected
 */
export function resolveSafeSscAttachmentUrl(rawPath, options = {}) {
  if (typeof rawPath !== 'string') return '';
  const trimmed = rawPath.trim();
  if (!trimmed) return '';
  if (/[\u0000-\u001F\u007F]/.test(trimmed) || trimmed.includes('\\') || /%5c/i.test(trimmed)) {
    return '';
  }
  if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
    return '';
  }
  if (/^(javascript|vbscript|data|file|mailto|tel|blob|ftp):/i.test(trimmed)) {
    return '';
  }
  // Reject arbitrary non-http(s) URI schemes (e.g. custom:, gopher:, smb:)
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && !/^https?:/i.test(trimmed)) {
    return '';
  }
  // Reject raw, percent-encoded, or double-encoded backslashes, control chars, traversal segments, and malformed encoding (S101-2)
  if (/(^|[\\/])\.\.([\\/]|$)/.test(trimmed) || /(?:%2e|\.)(?:%2e|\.)/i.test(trimmed)) {
    return '';
  }
  let decoded = trimmed;
  for (let pass = 0; pass < 2; pass++) {
    let nextDecoded;
    try {
      nextDecoded = decodeURIComponent(decoded);
    } catch {
      return '';
    }
    if (
      /[\u0000-\u001F\u007F]/.test(nextDecoded) ||
      nextDecoded.includes('\\') ||
      /%5c/i.test(nextDecoded) ||
      /(^|[\\/])\.\.([\\/]|$)/.test(nextDecoded) ||
      /%2e%2e/i.test(nextDecoded)
    ) {
      return '';
    }
    if (nextDecoded === decoded) break;
    decoded = nextDecoded;
  }

  let candidateUrl = '';
  if (/^https?:\/\//i.test(trimmed)) {
    candidateUrl = resolveUrlSafe(trimmed, 'https://ssc.gov.in/');
  } else if (trimmed.startsWith('/api/attachment/')) {
    candidateUrl = resolveUrlSafe(trimmed, 'https://ssc.gov.in/');
  } else {
    const relativePath = trimmed.replace(/^\/+/, '');
    if (!relativePath) return '';
    candidateUrl = resolveUrlSafe(relativePath, 'https://ssc.gov.in/api/attachment/');
  }

  if (!candidateUrl) return '';

  const policyCheck = validateExplicitSourceUrl(candidateUrl, 'ssc_notices', 'notice', {
    allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
  });
  if (!policyCheck.valid || !policyCheck.parsedUrl) {
    return '';
  }

  // Strictly accept valid official PDF attachments only (and re-verify decoded pathname)
  const pathname = String(policyCheck.parsedUrl.pathname || '').trim();
  let decodedPathname = '';
  try {
    decodedPathname = decodeURIComponent(pathname);
  } catch {
    return '';
  }
  if (
    /[\u0000-\u001F\u007F]/.test(decodedPathname) ||
    decodedPathname.includes('\\') ||
    /(^|[\\/])\.\.([\\/]|$)/.test(decodedPathname)
  ) {
    return '';
  }
  if (!/\/[^/]+\.pdf$/i.test(pathname)) {
    return '';
  }

  return policyCheck.parsedUrl.toString();
}

/**
 * Scrapes SSC Official Notice Board (Direct REST API)
 */
export async function scrapeSscNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'ssc_notices'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const items = [];
  try {
    const payload = JSON.parse(res.html);
    const notices = payload.rows || payload.data || (Array.isArray(payload) ? payload : []);

    for (const notice of notices) {
      const headline = (notice.headline || '').replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (!headline || headline.length < 5) continue;

      let detailsLink = 'https://ssc.gov.in/notices';
      if (Array.isArray(notice.attachments) && notice.attachments.length > 0) {
        for (const attachment of notice.attachments) {
          const validPdfUrl = resolveSafeSscAttachmentUrl(attachment?.path, options);
          if (validPdfUrl) {
            detailsLink = validPdfUrl;
            break;
          }
        }
      }
      if (detailsLink === 'https://ssc.gov.in/notices' && notice.redirectUrl) {
        const resolvedRedirect = resolveUrlSafe(notice.redirectUrl, 'https://ssc.gov.in/');
        if (resolvedRedirect) {
          const redirectCheck = validateExplicitSourceUrl(resolvedRedirect, 'ssc_notices', 'notice', {
            allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
          });
          if (redirectCheck.valid) {
            detailsLink = resolvedRedirect;
          }
        }
      }

      // Project UTC/offset timestamp cleanly into Asia/Kolkata calendar date
      let publishedDate = '';
      if (notice.createdAt) {
        publishedDate = toKolkataIsoDate(notice.createdAt);
      }

      const startIso = notice.startDate ? (toKolkataIsoDate(notice.startDate) || notice.startDate) : '';
      const endIso = notice.endDate ? (toKolkataIsoDate(notice.endDate) || notice.endDate) : '';

      items.push({
        sourceKey: 'ssc_notices',
        category: 'ssc',
        organization: 'Staff Selection Commission (SSC Central)',
        service: headline,
        postName: headline,
        notificationNo: notice.id !== undefined && notice.id !== null ? String(notice.id).trim() : '',
        openingDate: startIso || publishedDate || '',
        closingDate: endIso || '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink,
        applyLink: 'https://ssc.gov.in/',
        source: 'Official Staff Selection Commission Portal (ssc.gov.in)',
        sourceUrl: 'https://ssc.gov.in/',
        sourcePublishedAt: publishedDate
      });

      if (items.length >= 8) break;
    }
  } catch (err) {
    return { success: false, source: sourceConfig.key, error: `JSON Parse error: ${err.message}`, items: [] };
  }

  return { success: true, source: sourceConfig.key, items };
}

/**
 * Scrapes RRB (Railway Recruitment Board Chennai / CEN Notices)
 */
export async function scrapeRrbNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'rrb_chennai'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenLinks = new Set();

  $('a').each((_, a) => {
    const rawText = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';
    if (!href || seenLinks.has(href)) return;

    // Filter for CEN Notifications, Indicative Notices, or Application announcements
    const isCenLink = href.includes('cenum=');
    const isRecruitmentCat =
      href.includes('category=Notification') ||
      href.includes('category=Indicative Notice') ||
      href.includes('category=Indicative+Notice') ||
      href.includes('category=Indicative%20Notice') ||
      href.includes('category=Application') ||
      href.includes('category=Special+Notice');

    if (isCenLink && isRecruitmentCat && rawText.length > 5) {
      seenLinks.add(href);

      // Extract CEN Number (e.g., "(09/2025)" -> "CEN 09/2025")
      const cenMatch = rawText.match(/\((\d+\/\d+)\)/);
      const cenNo = cenMatch ? `CEN ${cenMatch[1]}` : '';

      // Extract date if present (e.g. "(21-10-2026)")
      const dateMatch = rawText.match(/\((\d{2}-\d{2}-\d{4})\)/);
      const notifDate = dateMatch ? dateMatch[1] : '';

      const absLink = resolveUrlSafe(href, 'https://rrbchennai.gov.in/');
      if (!absLink) return;

      items.push({
        sourceKey: 'rrb_chennai',
        category: 'railway',
        organization: 'Railway Recruitment Board (RRB / Indian Railways)',
        service: `Indian Railways ${cenNo ? cenNo + ' ' : ''}Recruitment Notification: ${rawText}`,
        postName: `${cenNo ? cenNo + ' - ' : ''}Railway Recruitment (NTPC / ALP / Technician / Group D)`,
        notificationNo: cenNo,
        openingDate: notifDate,
        closingDate: '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: 'https://rrbchennai.gov.in/',
        source: 'Official Railway Recruitment Board Portal (rrbchennai.gov.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes India Post GDS
 */
export async function scrapeIndiaPostNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'india_post_gds'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenHrefs = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';
    const absLink = resolveUrlSafe(href, url);
    if (!absLink || seenHrefs.has(href)) return;

    const lower = text.toLowerCase();
    if (
      lower.includes('descriptive notification') ||
      lower.includes('gds online engagement') ||
      lower.includes('gramin dak sevak') ||
      lower.includes('special drive')
    ) {
      seenHrefs.add(href);
      items.push({
        sourceKey: 'india_post_gds',
        category: 'psu',
        organization: 'India Post (Department of Posts)',
        service: text,
        postName: 'Gramin Dak Sevak (BPM / ABPM / Dak Sevak)',
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Merit-Based (No Written Exam)',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: 'https://indiapostgdsonline.gov.in/',
        source: 'Official India Post GDS Online Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 4) };
}
