// server/ingestion/scrapers/defenceTeachingScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';

/**
 * Scrapes Indian Army / Defence Notifications
 */
export async function scrapeIndianArmyNotifications(sourceConfig) {
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
      (text.toLowerCase().includes('agniveer') ||
        text.toLowerCase().includes('rally') ||
        text.toLowerCase().includes('officer') ||
        text.toLowerCase().includes('soldier') ||
        text.toLowerCase().includes('recruitment'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'indian_army',
        category: 'police_defence',
        organization: 'Indian Army (Ministry of Defence)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Online CEE & Physical Fitness Test',
        qualification: '8th / 10th / 10+2 / Degree (as per trade)',
        ageLimit: '17.5 - 21 Years (Agniveer)',
        applicationFee: '₹250 (CEE Fee)',
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
 * Scrapes Indian Navy Notifications
 */
export async function scrapeIndianNavyNotifications(sourceConfig) {
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
      (text.toLowerCase().includes('agniveer') ||
        text.toLowerCase().includes('ssr') ||
        text.toLowerCase().includes('mr') ||
        text.toLowerCase().includes('officer') ||
        text.toLowerCase().includes('recruitment'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'indian_navy',
        category: 'police_defence',
        organization: 'Indian Navy (Nausena Bharti)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'INET / INAC Computer-based Examination',
        qualification: '10th (MR) / 10+2 with Maths & Physics (SSR) / B.E/B.Tech (Officer)',
        ageLimit: '17.5 - 21 Years',
        applicationFee: '₹550',
        detailsLink: absLink,
        applyLink: 'https://www.joinindiannavy.gov.in/',
        source: 'Official Join Indian Navy Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 5) };
}

/**
 * Scrapes Indian Air Force (Agnipath Vayu)
 */
export async function scrapeIndianAirforceNotifications(sourceConfig) {
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
      (text.toLowerCase().includes('agniveervayu') ||
        text.toLowerCase().includes('intake') ||
        text.toLowerCase().includes('recruitment') ||
        text.toLowerCase().includes('notification'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'indian_airforce',
        category: 'police_defence',
        organization: 'Indian Air Force (Bharatiya Vayu Sena)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Phase I Online Test',
        qualification: '10+2 with Mathematics, Physics and English (min 50%) or 3-yr Diploma',
        ageLimit: '17.5 - 21 Years',
        applicationFee: '₹550',
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
export async function scrapeCtetNotifications(sourceConfig) {
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
      (text.toLowerCase().includes('ctet') ||
        text.toLowerCase().includes('eligibility') ||
        text.toLowerCase().includes('bulletin') ||
        text.toLowerCase().includes('online application'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'ctet_cbse',
        category: 'teaching',
        organization: 'Central Board of Secondary Education (CBSE / CTET)',
        service: text.replace(/\s+/g, ' '),
        postName: 'Primary Stage (Class I-V) & Elementary Stage (Class VI-VIII) Eligibility',
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'As per CBSE Schedule',
        qualification: 'Senior Secondary with min 50% + D.El.Ed / Graduation + B.Ed',
        ageLimit: 'No Upper Age Limit',
        applicationFee: '₹1000 (Paper 1 or 2) / ₹1200 (Both)',
        detailsLink: absLink,
        applyLink: 'https://ctet.nic.in/',
        source: 'Official CTET Examination Portal (ctet.nic.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 4) };
}
