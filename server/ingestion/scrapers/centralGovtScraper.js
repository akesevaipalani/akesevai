// server/ingestion/scrapers/centralGovtScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';
import { toKolkataIsoDate } from '../../../src/utils/notificationDateHelper.js';

function resolveUrlSafe(href, baseUrl) {
  if (!href) return '';
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return '';
  }
}

/**
 * Scrapes UPSC Active Examinations & Notices
 * Supports both structured table layout and Drupal .views-row layout.
 */
export async function scrapeUpscNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url || 'https://upsc.gov.in/active-examinations';
  const res = await safeFetchHtml(url, options);
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
 * Scrapes SSC Official Notice Board (Direct REST API)
 */
export async function scrapeSscNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, options);
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
      if (notice.attachments && notice.attachments.length > 0 && notice.attachments[0].path) {
        const cleanPath = notice.attachments[0].path.replace(/\\/g, '/');
        detailsLink = `https://ssc.gov.in/api/attachment/${cleanPath}`;
      } else if (notice.redirectUrl) {
        detailsLink = notice.redirectUrl;
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
        notificationNo: notice.id || '',
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
  const res = await safeFetchHtml(url, options);
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

      let absLink;
      try {
        absLink = new URL(href.trim(), 'https://rrbchennai.gov.in/').toString();
      } catch {
        const trimmedHref = href.trim();
        absLink = trimmedHref.startsWith('http')
          ? trimmedHref.replace(/\s+/g, '%20')
          : `https://rrbchennai.gov.in${trimmedHref.startsWith('/') ? '' : '/'}${trimmedHref}`.replace(/\s+/g, '%20');
      }

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
  const res = await safeFetchHtml(url, options);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenHrefs = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';
    if (!href || href === '#' || href === 'javascript:void(0)' || seenHrefs.has(href)) return;

    const lower = text.toLowerCase();
    if (
      lower.includes('descriptive notification') ||
      lower.includes('gds online engagement') ||
      lower.includes('gramin dak sevak') ||
      lower.includes('special drive')
    ) {
      seenHrefs.add(href);
      const absLink = resolveUrlSafe(href, url) || url;
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
