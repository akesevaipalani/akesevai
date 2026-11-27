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

export async function scrapeIbpsNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'ibps'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenTitles = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href');
    if (!href || !text || text.length < 10) return;

    const lower = text.toLowerCase();
    const isRecruitment =
      lower.includes('crp') ||
      lower.includes('clerk') ||
      lower.includes('probationary') ||
      lower.includes('rrb') ||
      lower.includes('specialist officer') ||
      lower.includes('recruitment');

    // Exclude results, scores, marks
    const isPastResult =
      lower.includes('score card') ||
      lower.includes('scores of') ||
      lower.includes('marks obtained') ||
      lower.includes('result of') ||
      lower.includes('candidature cancelled');

    if (isRecruitment && !isPastResult && !seenTitles.has(text)) {
      const absLink = resolveUrlSafe(href, url);
      if (!absLink) return;
      seenTitles.add(text);
      items.push({
        sourceKey: 'ibps',
        category: 'banking',
        organization: 'Institute of Banking Personnel Selection (IBPS)',
        service: text,
        postName: text,
        notificationNo: text.match(/CRP[\s\w\-\/]+/i)?.[0] || '',
        openingDate: '',
        closingDate: '',
        examDate: 'To Be Announced',
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies: 'Not Specified',
        detailsLink: absLink,
        applyLink: absLink,
        source: 'Official IBPS Examination Portal (ibps.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

export async function scrapeSbiNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'sbi_careers'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenHeadings = new Set();

  $('.accordion-content').each((_, content) => {
    let rawHeading = $(content).prev().text().replace(/\s+/g, ' ').trim();
    if (!rawHeading || rawHeading.length < 5) {
      rawHeading = $(content).prevAll('.accordion-heading, h3, h4, h2, a').first().text().replace(/\s+/g, ' ').trim();
    }
    if (!rawHeading || rawHeading.length < 5) {
      rawHeading = $(content).closest('.accordion, .panel, .card, li').find('h3, h4, h2, .accordion-heading').first().text().replace(/\s+/g, ' ').trim();
    }
    if (!rawHeading || rawHeading.length < 10) return;

    const lower = rawHeading.toLowerCase();
    // Exclude past results, marks secured, waitlists, archive
    if (
      lower.includes('final result') ||
      lower.includes('marks secured') ||
      lower.includes('waitlist') ||
      lower.includes('wait list') ||
      lower.includes('circle allotment') ||
      lower.includes('candidature') ||
      lower.includes('candidates provisionally selected')
    ) {
      return;
    }

    // Extract Advertisement Number if present e.g. "ADVERTISEMENT NO: CRPD/SCO/2026-27/30"
    const notifMatch = rawHeading.match(/ADVERTISEMENT\s*NO\s*[:\-]?\s*([^\)]+)/i);
    const notifNo = notifMatch ? notifMatch[0].replace(/ADVERTISEMENT\s*NO\s*[:\-]?\s*/i, '').trim() : '';

    // Clean service title (remove ADVERTISEMENT NO segment from title)
    let service = rawHeading;
    if (notifMatch) {
      service = rawHeading.replace(notifMatch[0], '').replace(/\(\s*\)/g, '').trim();
    }

    if (seenHeadings.has(service)) return;
    seenHeadings.add(service);

    // Extract dates if available: "APPLY ONLINE (19.10.2026 TO 09.11.2026)"
    const contentText = $(content).text().replace(/\s+/g, ' ');
    const dateMatch = contentText.match(/(\d{2}[\.\/\-]\d{2}[\.\/\-]\d{4})\s*TO\s*(\d{2}[\.\/\-]\d{2}[\.\/\-]\d{4})/i);
    const openingDate = dateMatch ? dateMatch[1] : '';
    const closingDate = dateMatch ? dateMatch[2] : '';

    // Find links: prioritize Apply Now or English PDF advertisement
    let applyLink = '';
    let detailsLink = '';

    $(content).find('a').each((_, a) => {
      const aText = $(a).text().trim().toLowerCase();
      const aHref = $(a).attr('href');
      if (!aHref) return;

      const fullHref = resolveUrlSafe(aHref, url);
      if (!fullHref) return;

      if (aText.includes('apply now') || aText.includes('apply online') || fullHref.includes('/apply')) {
        if (!applyLink) applyLink = fullHref;
      }
      if (aText.includes('english') || aText.includes('advertisement') || fullHref.toLowerCase().endsWith('.pdf')) {
        if (!detailsLink) detailsLink = fullHref;
      }
    });

    if (!detailsLink) detailsLink = applyLink || url;
    if (!applyLink) applyLink = detailsLink;

    items.push({
      sourceKey: 'sbi_careers',
      category: 'banking',
      organization: 'State Bank of India (SBI Careers)',
      service,
      postName: service,
      notificationNo: notifNo,
      openingDate,
      closingDate,
      examDate: 'To Be Announced',
      qualification: 'Refer Official Notification',
      ageLimit: 'Refer Official Notification',
      applicationFee: 'Refer Official Notification',
      vacancies: 'Not Specified',
      detailsLink,
      applyLink,
      source: 'Official SBI Careers Portal',
      sourceUrl: url
    });
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

export async function scrapeRbiNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'rbi_vacancies'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const rows = $('table tr');

  // RBI table alternates single-cell date and title rows
  // Even row: Date (e.g. "Oct 23, 2026")
  // Odd row: Link and Title (e.g. "Engagement of Part-Time Bank's Medical Consultants...")
  let currentDate = '';

  rows.each((_, row) => {
    const a = $(row).find('a');
    const text = $(row).text().replace(/\s+/g, ' ').trim();

    if (a.length === 0) {
      // Date row
      if (text && (text.includes('202') || text.includes('Jan') || text.includes('Feb') || text.includes('Mar') || text.includes('Apr') || text.includes('May') || text.includes('Jun') || text.includes('Jul') || text.includes('Aug') || text.includes('Sep') || text.includes('Oct') || text.includes('Nov') || text.includes('Dec'))) {
        currentDate = text;
      }
    } else {
      // Content row with link
      const title = a.text().trim().replace(/\s+/g, ' ') || text;
      const link = resolveUrlSafe(a.attr('href') || '', url);

      if (title && title.length > 5) {
        items.push({
          sourceKey: 'rbi_vacancies',
          category: 'banking',
          organization: 'Reserve Bank of India (RBI Opportunities)',
          service: title,
          postName: title,
          notificationNo: '',
          openingDate: currentDate || '',
          closingDate: '',
          examDate: 'To Be Announced',
          qualification: 'Refer Official Notification',
          ageLimit: 'Refer Official Notification',
          applicationFee: 'Refer Official Notification',
          vacancies: 'Not Specified',
          detailsLink: link || url,
          applyLink: link || url,
          source: 'Official RBI Portal',
          sourceUrl: url
        });
        currentDate = ''; // Reset for next pair
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}
