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

  // Table structure parsing (Standard TNPSC Notification.aspx)
  $('table tr').each((i, row) => {
    if (i === 0) return;
    const cols = $(row).find('td');
    if (cols.length >= 5) {
      const notifNo = $(cols[1]).text().trim();
      const serviceEl = $(cols[2]);
      const rawService = serviceEl.clone().children().remove().end().text().trim() || serviceEl.text().trim();
      const cleanService = rawService.replace(/APPLY ONLINE|Download Hall Ticket|ADDENDUM_[0-9A-Z]+/gi, '').replace(/\s+/g, ' ').trim();
      const openingDate = $(cols[3]).text().trim();
      const closingDate = $(cols[4]).text().trim();

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
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'tnusrb',
        category: 'police_defence',
        organization: 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)',
        service: text,
        postName: text,
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Written Test & Physical Efficiency Test',
        qualification: '10th / 12th / Any Degree (as per post)',
        ageLimit: '18 - 26 Years (Relaxation for BC/MBC/SC/ST)',
        applicationFee: '₹500',
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
export async function scrapeTrbNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
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
      let link = a.attr('href') || '';
      if (link && !link.startsWith('http')) {
        link = new URL(link, url).toString();
      }

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
          examDate: examDate || 'Announced Soon',
          qualification: 'B.Ed / D.T.Ed / Post Graduation / NET / SLET',
          ageLimit: 'Up to 50 Years',
          applicationFee: '₹500 (SC/ST ₹250)',
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
export async function scrapeMrbNotifications(sourceConfig) {
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
    if (cols.length >= 3) {
      const notifNo = $(cols[1]).text().trim().replace(/\s+/g, ' ');
      const descText = $(cols[2]).text().trim().replace(/\s+/g, ' ');

      // Find primary notification link (prioritize "Notification for..." or first pdf link)
      let link = '';
      $(cols[2]).find('a').each((_, a) => {
        const t = $(a).text().trim().toLowerCase();
        const h = $(a).attr('href') || '';
        if (t.includes('notification for') || (!link && h.endsWith('.pdf'))) {
          link = h;
        }
      });
      if (!link) {
        link = $(row).find('a').first().attr('href') || '';
      }

      if (link && !link.startsWith('http')) {
        link = new URL(link, url).toString();
      }

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
          examDate: 'Announced Soon',
          qualification: 'MBBS / BDS / Diploma in Pharmacy / B.Sc Nursing (as per post)',
          ageLimit: '18 - 35 Years (Relaxations as per Rules)',
          applicationFee: '₹1000 (SC/ST/SCA/DAP ₹500)',
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
