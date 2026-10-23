// server/ingestion/scrapers/bankingScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';

/**
 * Scrapes IBPS Official Portal
 */
export async function scrapeIbpsNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  // Scrape news flash, marquee, or direct links
  $('a').each((_, a) => {
    const text = $(a).text().trim();
    const href = $(a).attr('href');
    if (
      href &&
      text &&
      (text.toLowerCase().includes('crp') ||
        text.toLowerCase().includes('clerk') ||
        text.toLowerCase().includes('probationary') ||
        text.toLowerCase().includes('rrb') ||
        text.toLowerCase().includes('specialist officer'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'ibps',
        category: 'banking',
        organization: 'Institute of Banking Personnel Selection (IBPS)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Announced Soon',
        qualification: 'Bachelor’s Degree in any discipline from a recognized University',
        ageLimit: '20 - 30 Years (Relaxation for SC/ST/OBC)',
        applicationFee: '₹850 (SC/ST/PwBD ₹175)',
        detailsLink: absLink,
        applyLink: absLink,
        source: 'Official IBPS Examination Portal (ibps.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes SBI Careers Current Openings
 */
export async function scrapeSbiNotifications(sourceConfig) {
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
        text.toLowerCase().includes('probationary officers') ||
        text.toLowerCase().includes('junior associates') ||
        text.toLowerCase().includes('specialist cad'))
    ) {
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'sbi_careers',
        category: 'banking',
        organization: 'State Bank of India (SBI Careers)',
        service: text.replace(/\s+/g, ' '),
        postName: text.replace(/\s+/g, ' '),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Announced Soon',
        qualification: 'Graduation in any discipline from a recognized University',
        ageLimit: '21 - 30 Years',
        applicationFee: '₹750 (SC/ST/PwBD Nil)',
        detailsLink: absLink,
        applyLink: 'https://sbi.co.in/web/careers',
        source: 'Official SBI Careers Portal',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes RBI Vacancies
 */
export async function scrapeRbiNotifications(sourceConfig) {
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
      const titleEl = $(cols[0]).find('a');
      const service = titleEl.text().trim() || $(cols[0]).text().trim();
      let link = titleEl.attr('href') || '';
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).toString();
      }

      if (service && service.length > 5) {
        items.push({
          sourceKey: 'rbi_vacancies',
          category: 'banking',
          organization: 'Reserve Bank of India (RBI Opportunities)',
          service: service.replace(/\s+/g, ' '),
          postName: service.replace(/\s+/g, ' '),
          notificationNo: '',
          openingDate: '',
          closingDate: '',
          examDate: 'Announced Soon',
          qualification: 'Graduation with min 60% marks (Grade B) / Any Degree (Assistant)',
          ageLimit: '21 - 30 Years',
          applicationFee: '₹850 (SC/ST ₹100)',
          detailsLink: link || url,
          applyLink: url,
          source: 'Official RBI Portal',
          sourceUrl: url
        });
      }
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}
