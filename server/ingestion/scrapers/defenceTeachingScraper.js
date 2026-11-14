// server/ingestion/scrapers/defenceTeachingScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';

/**
 * Scrapes Indian Army / Defence Notifications (with CAPTCHA detection)
 */
export async function scrapeIndianArmyNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
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
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'indian_army',
        category: 'police_defence',
        organization: 'Indian Army (Ministry of Defence)',
        service: text,
        postName: text,
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
 * Scrapes Indian Navy Notifications (from Current Events)
 */
export async function scrapeIndianNavyNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenHeadings = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';
    if (!href || href === '#' || href.startsWith('javascript') || text.length < 10) return;

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
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'indian_navy',
        category: 'police_defence',
        organization: 'Indian Navy (Nausena Bharti)',
        service: text,
        postName: text,
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'INET / SSB Interview as per schedule',
        qualification: '10th (MR) / 10+2 with Maths & Physics (SSR) / B.E/B.Tech (Officer)',
        ageLimit: '17.5 - 21 Years (Agniveer) / 19 - 24 Years (Officer)',
        applicationFee: '₹550 (Agniveer/Officer as applicable)',
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
export async function scrapeIndianAirforceNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
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
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'indian_airforce',
        category: 'police_defence',
        organization: 'Indian Air Force (Bharatiya Vayu Sena)',
        service: text,
        postName: text,
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
  const seenTitles = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';
    if (!href || href.startsWith('#') || href.startsWith('javascript') || text.length < 6) return;

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

      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'ctet_cbse',
        category: 'teaching',
        organization: 'Central Board of Secondary Education (CBSE / CTET)',
        service: text,
        postName: 'Primary Stage (Class I-V) & Elementary Stage (Class VI-VIII) Eligibility',
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'As per CBSE CTET Schedule',
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

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes KVS (Kendriya Vidyalaya Sangathan Interview & Recruitment Notices)
 */
export async function scrapeKvsNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
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
      let link = a.attr('href') || '';
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).toString();
      }

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
          examDate: 'As per KVS Schedule',
          qualification: 'B.Ed / CTET / Post Graduate / As per post recruitment rules',
          ageLimit: 'PRT: 30 Yrs, TGT: 35 Yrs, PGT: 40 Yrs (Relaxations Apply)',
          applicationFee: '₹1500 (SC/ST/PwD Exempted)',
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
