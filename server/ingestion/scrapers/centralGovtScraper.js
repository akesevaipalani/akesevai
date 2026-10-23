// server/ingestion/scrapers/centralGovtScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';

/**
 * Scrapes UPSC Active Examinations
 */
export async function scrapeUpscNotifications(sourceConfig) {
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
    if (cols.length >= 3) {
      const titleEl = $(cols[0]).find('a');
      const service = titleEl.text().trim() || $(cols[0]).text().trim();
      const openingDate = $(cols[1]).text().trim();
      const closingDate = $(cols[2]).text().trim();

      let link = titleEl.attr('href') || $(cols[cols.length - 1]).find('a').attr('href') || '';
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).toString();
      }

      if (service && service.length > 5) {
        items.push({
          sourceKey: 'upsc_active',
          category: 'upsc',
          organization: 'Union Public Service Commission (UPSC)',
          service: service.replace(/\s+/g, ' '),
          postName: service.replace(/\s+/g, ' '),
          notificationNo: '',
          openingDate: openingDate || '',
          closingDate: closingDate || '',
          examDate: 'As per UPSC Calendar',
          qualification: 'Degree of a recognized University in relevant discipline',
          ageLimit: '21 - 32 Years (Relaxation as per Rules)',
          applicationFee: '₹100 (Female/SC/ST/PwBD Exempted)',
          detailsLink: link || url,
          applyLink: 'https://upsconline.nic.in/',
          source: 'Official UPSC Examination Portal (upsc.gov.in)',
          sourceUrl: url
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes SSC Notices / Announcements
 */
export async function scrapeSscNotifications(sourceConfig) {
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
      (text.toLowerCase().includes('combined graduate level') ||
        text.toLowerCase().includes('cgl') ||
        text.toLowerCase().includes('chsl') ||
        text.toLowerCase().includes('multi tasking') ||
        text.toLowerCase().includes('mts') ||
        text.toLowerCase().includes('constable (gd)') ||
        text.toLowerCase().includes('notice of examination'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'ssc_notices',
        category: 'ssc',
        organization: 'Staff Selection Commission (SSC)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Announced Soon',
        qualification: '10th / 12th / Any Degree (as per post)',
        ageLimit: '18 - 30 Years (Post wise)',
        applicationFee: '₹100 (Women/SC/ST Exempted)',
        detailsLink: absLink,
        applyLink: 'https://ssc.gov.in/',
        source: 'Official Staff Selection Commission Portal (ssc.gov.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes RRB (Railway Recruitment Board)
 */
export async function scrapeRrbNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('table tr, li, p').each((_, el) => {
    const a = $(el).find('a');
    if (a.length > 0) {
      const text = a.text().trim();
      const href = a.attr('href');
      if (
        href &&
        text &&
        (text.toLowerCase().includes('cen') ||
          text.toLowerCase().includes('ntpc') ||
          text.toLowerCase().includes('alp') ||
          text.toLowerCase().includes('technician') ||
          text.toLowerCase().includes('level 1') ||
          text.toLowerCase().includes('recruitment'))
      ) {
        let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
        items.push({
          sourceKey: 'rrb_chennai',
          category: 'railway',
          organization: 'Railway Recruitment Board (RRB / Indian Railways)',
          service: text.replace(/\s+/g, ' '),
          postName: text.replace(/\s+/g, ' '),
          notificationNo: text.match(/CEN\s*\d+\/\d+/i)?.[0] || '',
          openingDate: '',
          closingDate: '',
          examDate: 'Announced Soon',
          qualification: '10th / ITI / Diploma / Degree as per post',
          ageLimit: '18 - 33 Years (Relaxations Applicable)',
          applicationFee: '₹500 (₹400 Refundable after CBT)',
          detailsLink: absLink,
          applyLink: 'https://www.rrbchennai.gov.in/',
          source: 'Official Railway Recruitment Board Portal',
          sourceUrl: url
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes India Post GDS
 */
export async function scrapeIndiaPostNotifications(sourceConfig) {
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
      (text.toLowerCase().includes('gds') ||
        text.toLowerCase().includes('gramin dak sevak') ||
        text.toLowerCase().includes('engagement'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'india_post_gds',
        category: 'psu',
        organization: 'India Post (Department of Posts)',
        service: text.replace(/\s+/g, ' '),
        postName: 'Gramin Dak Sevak (BPM / ABPM / Dak Sevak)',
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Merit-Based (No Written Exam)',
        qualification: 'Secondary School Examination pass certificate of 10th standard',
        ageLimit: '18 - 40 Years',
        applicationFee: '₹100 (Female/SC/ST/PwD Exempted)',
        detailsLink: absLink,
        applyLink: 'https://indiapostgdsonline.gov.in/',
        source: 'Official India Post GDS Online Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 4) };
}
