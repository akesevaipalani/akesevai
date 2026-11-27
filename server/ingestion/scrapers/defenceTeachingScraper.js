// server/ingestion/scrapers/defenceTeachingScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';
import { EXPLICIT_SOURCE_DOMAIN_MAP } from '../officialDomainPolicy.js';

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

function resolveUrlSafe(href, baseUrl) {
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
 * Scrapes Indian Army / Defence Notifications (with CAPTCHA detection)
 */
export async function scrapeIndianArmyNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'indian_army'));
  if (!res.ok) {
    return {
      success: false,
      source: sourceConfig.key,
      error: res.error || 'Connection failed',
      items: []
    };
  }

  // Detect CAPTCHA challenge on joinindianarmy.nic.in
  const lowerHtml = (res.html || '').toLowerCase();
  if (
    lowerHtml.includes('authentication.aspx') ||
    lowerHtml.includes('captcha') ||
    lowerHtml.includes('enter the characters shown in the image')
  ) {
    return {
      success: false,
      source: sourceConfig.key,
      error: 'Official portal enforces numeric CAPTCHA verification (Authentication.aspx) for automated requests',
      items: [],
      requiresCaptcha: true
    };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href');
    if (!href || !text || text.length < 8) return;

    const lower = text.toLowerCase();
    if (
      lower.includes('agniveer') ||
      lower.includes('rally') ||
      lower.includes('officer') ||
      lower.includes('soldier') ||
      lower.includes('recruitment')
    ) {
      const absLink = resolveUrlSafe(href, url);
      if (!absLink) return;
      items.push({
        sourceKey: 'indian_army',
        category: 'police_defence',
        organization: 'Indian Army (Ministry of Defence)',
        service: text,
        postName: text,
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: 'https://joinindianarmy.nic.in/',
        source: 'Official Join Indian Army Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 5) };
}

/**
 * Scrapes Indian Navy Notifications (from Current Events)
 */
export async function scrapeIndianNavyNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'indian_navy'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenHeadings = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';
    const absLink = resolveUrlSafe(href, url);
    if (!absLink || text.length < 10) return;

    const lower = text.toLowerCase();
    const isNavyRecruit =
      lower.includes('ssc') ||
      lower.includes('course') ||
      lower.includes('agniveer') ||
      lower.includes('officer') ||
      lower.includes('application window') ||
      lower.includes('callups') ||
      lower.includes('entry');

    if (isNavyRecruit && !seenHeadings.has(text)) {
      seenHeadings.add(text);
      items.push({
        sourceKey: 'indian_navy',
        category: 'police_defence',
        organization: 'Indian Navy (Nausena Bharti)',
        service: text,
        postName: text,
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: 'https://www.joinindiannavy.gov.in/en/account/login',
        source: 'Official Join Indian Navy Portal (Current Events)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes Indian Air Force (Agnipath Vayu)
 */
export async function scrapeIndianAirforceNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'indian_airforce'));
  if (!res.ok) {
    return {
      success: false,
      source: sourceConfig.key,
      error: res.error || 'Server responded with error status',
      items: []
    };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href');
    if (
      href &&
      text &&
      (text.toLowerCase().includes('agniveervayu') ||
        text.toLowerCase().includes('intake') ||
        text.toLowerCase().includes('recruitment') ||
        text.toLowerCase().includes('notification'))
    ) {
      const absLink = resolveUrlSafe(href, url);
      if (!absLink) return;
      items.push({
        sourceKey: 'indian_airforce',
        category: 'police_defence',
        organization: 'Indian Air Force (Bharatiya Vayu Sena)',
        service: text,
        postName: text,
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: 'https://agnipathvayu.cdac.in/',
        source: 'Official Agnipath Vayu Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 5) };
}

/**
 * Scrapes CTET (Central Teacher Eligibility Test)
 */
export async function scrapeCtetNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'ctet_cbse'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenTitles = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';
    const absLink = resolveUrlSafe(href, url);
    if (!absLink || text.length < 6) return;

    const lower = text.toLowerCase();
    if (
      lower.includes('ctet') ||
      lower.includes('public notice') ||
      lower.includes('bulletin') ||
      lower.includes('information bulletin') ||
      lower.includes('online application')
    ) {
      if (seenTitles.has(text)) return;
      seenTitles.add(text);

      items.push({
        sourceKey: 'ctet_cbse',
        category: 'teaching',
        organization: 'Central Board of Secondary Education (CBSE / CTET)',
        service: text,
        postName: 'Primary Stage (Class I-V) & Elementary Stage (Class VI-VIII) Eligibility',
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: 'https://ctet.nic.in/',
        source: 'Official CTET Examination Portal (ctet.nic.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes KVS (Kendriya Vidyalaya Sangathan Interview & Recruitment Notices)
 */
export async function scrapeKvsNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'kvs_delhi'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('table tr').each((i, row) => {
    if (i === 0) return; // Skip table header
    const cols = $(row).find('td');
    if (cols.length >= 2) {
      const title = $(cols[0]).text().trim().replace(/\s+/g, ' ');
      const publishDate = $(cols[1]).text().trim().replace(/\s+/g, ' ');
      const a = $(row).find('a');
      const link = resolveUrlSafe(a.attr('href') || '', url);

      if (title && title.length > 5) {
        items.push({
          sourceKey: 'kvs_delhi',
          category: 'teaching',
          organization: 'Kendriya Vidyalaya Sangathan (KVS HQ New Delhi)',
          service: title,
          postName: title,
          notificationNo: '',
          openingDate: publishDate || '',
          closingDate: '',
          examDate: 'To Be Announced',
          qualification: 'Refer Official Notification',
          ageLimit: 'Refer Official Notification',
          applicationFee: 'Refer Official Notification',
          vacancies: 'Not Specified',
          detailsLink: link || url,
          applyLink: 'https://kvs.gov.in/',
          source: 'Official Kendriya Vidyalaya Sangathan Portal (kvs.gov.in)',
          sourceUrl: url
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}
