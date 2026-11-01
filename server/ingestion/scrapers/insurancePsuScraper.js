// server/ingestion/scrapers/insurancePsuScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';

/**
 * Scrapes LIC India Careers (Life Insurance Corporation)
 */
export async function scrapeLicNotifications(sourceConfig) {
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
    if (!href || href === '#' || href.startsWith('javascript') || text.length < 8) return;

    const lower = text.toLowerCase();
    const isLicRecruit =
      (lower.includes('recruitment') ||
        lower.includes('engagement') ||
        lower.includes('apprentice') ||
        lower.includes('aao') ||
        lower.includes('ado') ||
        lower.includes('assistant')) &&
      !lower.includes('recruitment results') &&
      !lower.includes('archive') &&
      !lower.includes('privacy policy') &&
      !lower.includes('disclaimer');

    if (isLicRecruit && !seenTitles.has(text)) {
      seenTitles.add(text);
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'lic_careers',
        category: 'banking',
        organization: 'Life Insurance Corporation of India (LIC)',
        service: text,
        postName: text,
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Announced Soon',
        qualification: 'Bachelor’s Degree in any discipline / Relevant Professional Qualification',
        ageLimit: '21 - 30 Years (Relaxation as per norms)',
        applicationFee: '₹700 - ₹850 (SC/ST/PwBD Concessional)',
        detailsLink: absLink,
        applyLink: absLink,
        source: 'Official LIC India Careers Portal (licindia.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes NIACL Recruitment (New India Assurance Company Ltd)
 */
export async function scrapeNiaclNotifications(sourceConfig) {
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
    if (!href || href === '#' || text.length < 10) return;

    const lower = text.toLowerCase();
    const isNiaclJob =
      lower.includes('recruitment') ||
      lower.includes('advertisement') ||
      lower.includes('administrative officer') ||
      lower.includes('assistant') ||
      lower.includes('officer');

    const isPast = lower.includes('archive') || lower.includes('final result announced');

    if (isNiaclJob && !isPast && !seenTitles.has(text)) {
      seenTitles.add(text);
      let absLink = href.startsWith('http') ? href : new URL(href, url).toString();
      items.push({
        sourceKey: 'niacl_careers',
        category: 'banking',
        organization: 'The New India Assurance Co. Ltd. (NIACL)',
        service: text,
        postName: text.replace(/^(Detailed advertisement for|NOTICE -)\s*/i, '').trim(),
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Phase I / Phase II as per NIACL Schedule',
        qualification: 'Graduate / Post Graduate in any discipline with min 60% marks',
        ageLimit: '21 - 30 Years',
        applicationFee: '₹850 (SC/ST/PwBD ₹100)',
        detailsLink: absLink,
        applyLink: 'https://www.newindia.co.in/recruitment/list',
        source: 'Official NIACL Recruitment Portal (newindia.co.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 6) };
}

/**
 * Scrapes Bharat Electronics Limited (BEL Job Notifications)
 */
export async function scrapeBelNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];

  $('.career-result-box').each((_, box) => {
    const rawText = $(box).text().replace(/\s+/g, ' ').trim();
    if (!rawText || rawText.length < 15) return;

    // Clean title: extract title before "Advertisements" word
    let title = rawText.split('Advertisements')[0].trim();
    if (!title) {
      title = $(box).find('h2, h3, h4, h5, strong, b').first().text().trim() || rawText.slice(0, 100);
    }

    let pdfLink = '';
    let applyLink = '';

    $(box).find('a').each((_, a) => {
      const h = $(a).attr('href') || '';
      const t = $(a).text().trim().toLowerCase();
      if (h.endsWith('.pdf') && !pdfLink && !h.toLowerCase().includes('format') && !h.toLowerCase().includes('certificate')) {
        pdfLink = h.startsWith('http') ? h : new URL(h, url).toString();
      }
      if (t.includes('apply') || h.includes('jobapply.in')) {
        applyLink = h.startsWith('http') ? h : new URL(h, url).toString();
      }
    });

    if (!pdfLink && !applyLink) return;

    items.push({
      sourceKey: 'bel_psu',
      category: 'psu',
      organization: 'Bharat Electronics Limited (BEL / Navratna PSU)',
      service: `BEL Recruitment: ${title}`,
      postName: title,
      notificationNo: '',
      openingDate: '',
      closingDate: '',
      examDate: 'Written Test / Interview as per BEL schedule',
      qualification: 'B.E. / B.Tech / Diploma / ITI / Relevant Degree as per trade',
      ageLimit: 'Upper Age Limit 28 - 32 Years (Relaxations apply)',
      applicationFee: '₹400 - ₹500 (SC/ST/PwBD Exempted)',
      detailsLink: pdfLink || applyLink || url,
      applyLink: applyLink || pdfLink || url,
      source: 'Official BEL Careers Portal (bel-india.in)',
      sourceUrl: url
    });
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes Bharat Heavy Electricals Limited (BHEL Careers)
 */
export async function scrapeBhelNotifications(sourceConfig) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url);
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  let currentGroup = '';
  const seenHeadings = new Set();

  $('a').each((_, a) => {
    const text = $(a).text().trim().replace(/\s+/g, ' ');
    const href = $(a).attr('href') || '';

    if (!href || href === '#' || href.startsWith('javascript')) {
      if (
        (text.includes('Recruitment') || text.includes('Engagement') || text.includes('Artisan') || text.includes('Openings')) &&
        !text.includes('Archives') &&
        !text.includes('Formats')
      ) {
        currentGroup = text;
      }
      return;
    }

    if (
      href.endsWith('.pdf') ||
      href.includes('login.html') ||
      href.includes('career') ||
      href.includes('lateral') ||
      href.includes('FTARecruitment')
    ) {
      if (href.includes('archives/') || href.includes('format') || href.includes('taclaim')) return;

      const title = currentGroup ? `${currentGroup} - ${text}` : text;
      if (seenHeadings.has(title) || text.length < 3) return;
      seenHeadings.add(title);

      let absLink = href.startsWith('http') ? href : new URL(href, 'https://careers.bhel.in/').toString();
      items.push({
        sourceKey: 'bhel_psu',
        category: 'psu',
        organization: 'Bharat Heavy Electricals Limited (BHEL / Maharatna PSU)',
        service: `BHEL ${title}`,
        postName: currentGroup || text,
        notificationNo: '',
        openingDate: '',
        closingDate: '',
        examDate: 'Computer Based Examination (CBE) / Skill Test',
        qualification: 'ITI / Diploma / B.E/B.Tech / Degree as per post',
        ageLimit: '27 - 30 Years (Relaxation as per Govt directives)',
        applicationFee: '₹300 - ₹500 (SC/ST/PwD Exempted)',
        detailsLink: absLink,
        applyLink: href.includes('login.html') ? absLink : 'https://careers.bhel.in/',
        source: 'Official BHEL Careers Portal (careers.bhel.in)',
        sourceUrl: url
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}
