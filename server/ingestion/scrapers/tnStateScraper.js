// server/ingestion/scrapers/tnStateScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';

/**
 * Classifies TNPSC Recruitment Group / Service category
 */
export function classifyTnpscGroup(serviceTitle = '') {
  const t = String(serviceTitle || '').toLowerCase();
  if (/\bgroup[- ]?i\b|group[- ]?1\b|civil services examination[- ]?i\b/i.test(t)) {
    return 'Group 1 Services';
  }
  if (/\bgroup[- ]?ii[- ]?a\b|group[- ]?2[- ]?a\b/i.test(t)) {
    return 'Group 2A Services';
  }
  if (/\bgroup[- ]?ii\b|group[- ]?2\b|civil services examination[- ]?ii\b/i.test(t)) {
    return 'Group 2 Services';
  }
  if (/\bgroup[- ]?iv\b|group[- ]?4\b|civil services examination[- ]?iv\b|vaio|village administrative officer/i.test(t)) {
    return 'Group 4 Services (VAO)';
  }
  if (/\bgroup[- ]?v[- ]?a\b|group[- ]?5[- ]?a\b/i.test(t)) {
    return 'Group 5A Services';
  }
  if (/\bcombined engineering|assistant engineer|cese\b/i.test(t)) {
    return 'Combined Engineering Services';
  }
  if (/\bcombined technical|technical services\b/i.test(t)) {
    return 'Combined Technical Services';
  }
  return 'TNPSC State Recruitment';
}

function resolveUrlSafe(href, baseUrl) {
  if (!href || href === '#' || href.startsWith('javascript:')) return '';
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return '';
  }
}

function extractPdfLink($, row, baseUrl) {
  let pdfLink = '';
  let fallbackLink = '';
  $(row).find('a').each((_, a) => {
    const href = $(a).attr('href') || '';
    const text = $(a).text().trim().toLowerCase();
    const abs = resolveUrlSafe(href, baseUrl);
    if (!abs) return;
    if (href.toLowerCase().endsWith('.pdf') || text.includes('pdf') || text.includes('notification')) {
      if (!pdfLink) pdfLink = abs;
    } else if (!fallbackLink) {
      fallbackLink = abs;
    }
  });
  return pdfLink || fallbackLink || baseUrl;
}

function extractExamDateFromCols(cols, serviceText) {
  if (cols.length >= 6) {
    const rawCol = cols.eq(5).text().trim().replace(/\s+/g, ' ');
    if (rawCol && rawCol.length > 2 && !/date of exam|sl\.?no|name of the/i.test(rawCol)) {
      return rawCol;
    }
  }
  const match = String(serviceText || '').match(/exam(?:ination)?\s*(?:date|on)?[:\s]+(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/i);
  if (match) return match[1];
  return 'NOT_ANNOUNCED';
}

/**
 * Scrapes TNPSC Official Notification Table & Annual Planner
 * Covers Group 1, Group 2/2A, Group 4, Engineering, Technical recruitments and Corrigenda
 */
export async function scrapeTnpscNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url || 'https://www.tnpsc.gov.in/English/Notification.aspx';
  const res = await safeFetchHtml(url, options);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  // Table structure parsing (Standard TNPSC Notification.aspx & Annual Planner)
  $('table tr').each((i, row) => {
    if (i === 0) return;
    const cols = $(row).find('td');
    if (cols.length >= 5) {
      const notifNo = $(cols[1]).text().trim();
      const serviceEl = $(cols[2]);
      const rawService = serviceEl.clone().children().remove().end().text().trim() || serviceEl.text().trim();
      const hasCorrigendum = /addendum|corrigendum/i.test(serviceEl.text()) || /ADDENDUM_[0-9A-Z]+/i.test(serviceEl.text());
      const cleanService = rawService.replace(/APPLY ONLINE|Download Hall Ticket|ADDENDUM_[0-9A-Z]+/gi, '').replace(/\s+/g, ' ').trim();
      const openingDate = $(cols[3]).text().trim();
      const closingDate = $(cols[4]).text().trim();
      const examDate = extractExamDateFromCols(cols, rawService);

      let link = extractPdfLink($, row, url);

      if (cleanService && cleanService.length > 3 && !cleanService.toLowerCase().includes('name of the post')) {
        const groupTag = classifyTnpscGroup(cleanService);
        items.push({
          sourceKey: 'tnpsc',
          category: 'tnpsc',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          service: cleanService,
          postName: cleanService,
          group: groupTag,
          notificationNo: notifNo || '',
          openingDate: openingDate || '',
          closingDate: closingDate || '',
          examDate: examDate || 'To Be Announced',
          qualification: 'Refer Official Notification',
          ageLimit: 'Refer Official Notification',
          applicationFee: 'Refer Official Notification',
          vacancies: 'Not Specified',
          detailsLink: link || url,
          applyLink: 'https://apply.tnpscexams.in/',
          source: 'Official TNPSC Portal (tnpsc.gov.in)',
          sourceUrl: url,
          sourcePublishedAt: openingDate || '',
          isCorrigendum: Boolean(hasCorrigendum)
        });
      }
    } else if (cols.length >= 4) {
      // Annual planner table format: [0: S.No, 1: Name of Post/Exam, 2: Notification Month, 3: Vacancies, 4: Exam Month]
      const postCol = $(cols[1]).text().trim().replace(/\s+/g, ' ');
      const notifMonth = $(cols[2]).text().trim();
      const vacCol = cols.length >= 4 ? $(cols[3]).text().trim() : '';
      const examCol = cols.length >= 5 ? $(cols[4]).text().trim() : '';

      if (postCol && postCol.length > 5 && !postCol.toLowerCase().includes('name of the post') && (notifMonth || examCol)) {
        const groupTag = classifyTnpscGroup(postCol);
        items.push({
          sourceKey: 'tnpsc',
          category: 'tnpsc',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          service: postCol,
          postName: postCol,
          group: groupTag,
          notificationNo: '',
          openingDate: notifMonth || '',
          closingDate: '',
          examDate: examCol || 'To Be Announced',
          qualification: 'Refer Official Notification',
          ageLimit: 'Refer Official Notification',
          applicationFee: 'Refer Official Notification',
          vacancies: vacCol || 'Not Specified',
          detailsLink: url,
          applyLink: 'https://apply.tnpscexams.in/',
          source: 'Official TNPSC Portal (tnpsc.gov.in)',
          sourceUrl: url,
          sourcePublishedAt: notifMonth || '',
          isTentativePlanner: true
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 15) };
}

/**
 * Scrapes TNUSRB Official Recruitment Portal
 */
export async function scrapeTnusrbNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, options);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href');
    if (
      href &&
      text &&
      href !== '#' &&
      !href.startsWith('javascript:') &&
      (text.toLowerCase().includes('joint recruitment') ||
        text.toLowerCase().includes('common recruitment') ||
        text.toLowerCase().includes('sub-inspector') ||
        text.toLowerCase().includes('constable') ||
        text.toLowerCase().includes('police recruitment'))
    ) {
      const absLink = resolveUrlSafe(href, url) || url;
      items.push({
        sourceKey: 'tnusrb',
        category: 'police_defence',
        organization: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
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
        applyLink: absLink,
        source: 'Official TNUSRB Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes TRB (Teachers Recruitment Board Tamil Nadu) Structured Table
 */
export async function scrapeTrbNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, options);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('table tr').each((i, row) => {
    const cols = $(row).find('td');
    // TRB Table columns: [0: S No, 1: Notification No, 2: Name of Post, 3: Registration From, 4: Registration To, 5: Date of Exam, 6: Actions]
    if (cols.length >= 5) {
      const notifNo = $(cols[1]).text().trim();
      const service = $(cols[2]).text().trim().replace(/\s+/g, ' ');
      const openingDate = $(cols[3]).text().trim();
      const closingDate = $(cols[4]).text().trim();
      const examDate = cols.length >= 6 ? $(cols[5]).text().trim().replace(/\s+/g, ' ') : '';

      const a = $(cols[cols.length - 1]).find('a');
      const link = resolveUrlSafe(a.attr('href') || '', url);

      if (service && service.length > 5 && !service.toLowerCase().includes('name of the post')) {
        items.push({
          sourceKey: 'trb_tn',
          category: 'teaching',
          organization: 'Teachers Recruitment Board (TRB Tamil Nadu)',
          service,
          postName: service,
          notificationNo: notifNo || '',
          openingDate: openingDate || '',
          closingDate: closingDate || '',
          examDate: examDate || 'To Be Announced',
          qualification: 'Refer Official Notification',
          ageLimit: 'Refer Official Notification',
          applicationFee: 'Refer Official Notification',
          vacancies: 'Not Specified',
          detailsLink: link || url,
          applyLink: link || url,
          source: 'Official TRB Portal',
          sourceUrl: url
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes MRB (Medical Services Recruitment Board Tamil Nadu) Structured Table
 */
export async function scrapeMrbNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, options);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('table tr').each((i, row) => {
    if (i === 0) return; // Skip table header
    const cols = $(row).find('td');
    if (cols.length >= 3) {
      const notifNo = $(cols[1]).text().trim().replace(/\s+/g, ' ');
      const descText = $(cols[2]).text().trim().replace(/\s+/g, ' ');

      // Find primary notification link (prioritize "Notification for..." or first pdf link)
      let rawHref = '';
      $(cols[2]).find('a').each((_, a) => {
        const t = $(a).text().trim().toLowerCase();
        const h = $(a).attr('href') || '';
        if (t.includes('notification for') || (!rawHref && h.endsWith('.pdf'))) {
          rawHref = h;
        }
      });
      if (!rawHref) {
        rawHref = $(row).find('a').first().attr('href') || '';
      }

      const link = resolveUrlSafe(rawHref, url);

      // Extract a clean post name
      let postName = '';
      const postMatch = descText.match(/for the post of ([^\(\)\.]+)/i) ||
        descText.match(/Notification for ([^\(\)\.]+)/i);
      if (postMatch) {
        postName = postMatch[1].trim();
      } else {
        postName = descText.split('(')[0].trim().slice(0, 80);
      }

      if (notifNo && postName && !notifNo.toLowerCase().includes('notification no')) {
        items.push({
          sourceKey: 'mrb_tn',
          category: 'medical',
          organization: 'Medical Services Recruitment Board (MRB Tamil Nadu)',
          service: `MRB ${notifNo}: ${postName}`,
          postName: `MRB ${postName}`,
          notificationNo: notifNo,
          openingDate: '',
          closingDate: '',
          examDate: 'To Be Announced',
          qualification: 'Refer Official Notification',
          ageLimit: 'Refer Official Notification',
          applicationFee: 'Refer Official Notification',
          vacancies: 'Not Specified',
          detailsLink: link || url,
          applyLink: url,
          source: 'Official MRB Portal (mrb.tn.gov.in)',
          sourceUrl: url
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}
