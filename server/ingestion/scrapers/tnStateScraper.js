// server/ingestion/scrapers/tnStateScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';

/**
 * Scrapes TNPSC Official Notification Table
 */
export async function scrapeTnpscNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  // 1. Table structure parsing (Standard TNPSC Notification.aspx)
  $('table tr').each((i, row) => {
    // Skip header
    if (i === 0) return;
    const cols = $(row).find('td');
    if (cols.length >= 5) {
      const notifNo = $(cols[1]).text().trim();
      const serviceEl = $(cols[2]);
      const rawService = serviceEl.clone().children().remove().end().text().trim() || serviceEl.text().trim();
      const cleanService = rawService.replace(/APPLY ONLINE|Download Hall Ticket|ADDENDUM_[0-9A-Z]+/gi, '').replace(/\s+/g, ' ').trim();
      const openingDate = $(cols[3]).text().trim();
      const closingDate = $(cols[4]).text().trim();

      // Extract PDF or link
      let link = serviceEl.find('a').attr('href') || $(cols[1]).find('a').attr('href') || $(cols[cols.length - 1]).find('a').attr('href') || '';
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).toString();
      }

      if (cleanService && cleanService.length > 3) {
        items.push({
          sourceKey: 'tnpsc',
          category: 'tnpsc',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          service: cleanService,
          postName: cleanService,
          notificationNo: notifNo || '',
          openingDate: openingDate || '',
          closingDate: closingDate || '',
          examDate: 'Announced Soon',
          qualification: 'SSLC / HSC / Degree as per official rules',
          ageLimit: '18 - 32 Years (Relaxations Applicable)',
          applicationFee: '₹100 (One Time Registration ₹150)',
          detailsLink: link || url,
          applyLink: 'https://apply.tnpscexams.in/',
          source: 'Official TNPSC Portal (tnpsc.gov.in)',
          sourceUrl: url,
          sourcePublishedAt: openingDate || new Date().toISOString()
        });
      }
    }
  });

  // 2. Fallback: Parse anchor links with "Notification" or "Recruitment"
  if (items.length === 0) {
    $('a').each((_, a) => {
      const text = $(a).text().trim();
      const href = $(a).attr('href');
      if (href && text && (text.toLowerCase().includes('recruitment') || text.toLowerCase().includes('group') || text.toLowerCase().includes('notification'))) {
        let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
        items.push({
          sourceKey: 'tnpsc',
          category: 'tnpsc',
          organization: 'Tamil Nadu Public Service Commission (TNPSC)',
          service: text.replace(/\s+/g, ' '),
          postName: text.replace(/\s+/g, ' '),
          notificationNo: '',
          openingDate: '',
          closingDate: '',
          examDate: 'Announced Soon',
          detailsLink: absLink,
          applyLink: 'https://apply.tnpscexams.in/',
          source: 'Official TNPSC Portal',
          sourceUrl: url
        });
      }
    });
  }

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes TNUSRB Official Recruitment Portal
 */
export async function scrapeTnusrbNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('a').each((_, a) => {
    const text = $(a).text().trim();
    const href = $(a).attr('href');
    if (
      href &&
      text &&
      (text.toLowerCase().includes('recruitment') ||
        text.toLowerCase().includes('sub-inspector') ||
        text.toLowerCase().includes('constable') ||
        text.toLowerCase().includes('notification'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'tnusrb',
        category: 'police_defence',
        organization: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Announced Soon',
        qualification: '10th / 12th / Any Degree (as per post)',
        ageLimit: '18 - 26 Years (Relaxation for BC/MBC/SC/ST)',
        applicationFee: '₹500',
        detailsLink: absLink,
        applyLink: url,
        source: 'Official TNUSRB Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes TRB (Teachers Recruitment Board) Portal
 */
export async function scrapeTrbNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('a').each((_, a) => {
    const text = $(a).text().trim();
    const href = $(a).attr('href');
    if (
      href &&
      text &&
      (text.toLowerCase().includes('tet') ||
        text.toLowerCase().includes('teacher') ||
        text.toLowerCase().includes('assistant professor') ||
        text.toLowerCase().includes('recruitment') ||
        text.toLowerCase().includes('notification'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'trb_tn',
        category: 'teaching',
        organization: 'Teachers Recruitment Board (TRB Tamil Nadu)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Announced Soon',
        qualification: 'B.Ed / D.T.Ed / Post Graduation / NET / SLET',
        ageLimit: 'Up to 50 Years',
        applicationFee: '₹500 (SC/ST ₹250)',
        detailsLink: absLink,
        applyLink: url,
        source: 'Official TRB Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes MRB (Medical Services Recruitment Board) Portal
 */
export async function scrapeMrbNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('table tr').each((i, row) => {
    if (i === 0) return;
    const cols = $(row).find('td');
    if (cols.length >= 2) {
      const service = $(cols[0]).text().trim();
      const linkEl = $(cols[cols.length - 1]).find('a');
      let link = linkEl.attr('href') || '';
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).toString();
      }

      if (service && service.length > 5) {
        items.push({
          sourceKey: 'mrb_tn',
          category: 'medical',
          organization: 'Medical Services Recruitment Board (MRB Tamil Nadu)',
          service: service.replace(/\s+/g, ' '),
          postName: service.replace(/\s+/g, ' '),
          notificationNo: '',
          openingDate: '',
          closingDate: '',
          examDate: 'Announced Soon',
          qualification: 'MBBS / BDS / Diploma in Pharmacy / B.Sc Nursing',
          ageLimit: '18 - 35 Years',
          applicationFee: '₹1000 (SC/ST ₹500)',
          detailsLink: link || url,
          applyLink: url,
          source: 'Official MRB Portal',
          sourceUrl: url
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}
