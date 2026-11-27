// server/ingestion/scrapers/tnStateScraper.js
import * as cheerio from 'cheerio';
import { safeFetchHtml } from '../fetchHelper.js';
import { EXPLICIT_SOURCE_DOMAIN_MAP, validateExplicitSourceUrl } from '../officialDomainPolicy.js';
import { parseDateDetailed, isGenericRootHomepage } from '../../../src/utils/notificationDateHelper.js';
import { isGenericListingOrDirectoryUrl } from '../trustScoringEngine.js';

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

export function resolveUrlSafe(href, baseUrl) {
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

function normalizeUrlForCompare(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  return rawUrl.trim().split('#')[0].replace(/\/+$/, '').toLowerCase();
}

function isPdfUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  try {
    const parsed = new URL(rawUrl);
    return /\.pdf$/i.test(parsed.pathname || '');
  } catch {
    return /\.pdf(?:$|\?|#)/i.test(rawUrl);
  }
}

function isGenericPortalOrListingUrl(absUrl, sourceConfig = {}) {
  if (!absUrl) return true;
  if (isGenericRootHomepage(absUrl)) return true;

  const normAbs = normalizeUrlForCompare(absUrl);
  const normSourceUrl = normalizeUrlForCompare(sourceConfig?.url || '');
  const normHome = normalizeUrlForCompare(sourceConfig?.homepage || '');
  const normPlanner = normalizeUrlForCompare(sourceConfig?.plannerUrl || '');
  const normCorrigendum = normalizeUrlForCompare(sourceConfig?.corrigendumUrl || '');

  if (
    (normSourceUrl && normAbs === normSourceUrl) ||
    (normHome && normAbs === normHome) ||
    (normPlanner && normAbs === normPlanner) ||
    (normCorrigendum && normAbs === normCorrigendum)
  ) {
    return true;
  }

  return isGenericListingOrDirectoryUrl(absUrl);
}

export function isValidSpecificDetailsUrl(absUrl, sourceKey, sourceConfig = {}, options = {}) {
  if (!absUrl) return false;
  const check = validateExplicitSourceUrl(absUrl, sourceKey, 'notice', {
    allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
  });
  if (!check.valid) return false;
  if (isGenericPortalOrListingUrl(absUrl, sourceConfig)) return false;
  return true;
}

export function isValidSpecificApplyUrl(absUrl, sourceKey, sourceConfig = {}, options = {}) {
  if (!absUrl) return false;
  if (isPdfUrl(absUrl)) return false;
  const check = validateExplicitSourceUrl(absUrl, sourceKey, 'apply', {
    allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
  });
  if (!check.valid) return false;
  if (isGenericPortalOrListingUrl(absUrl, sourceConfig)) return false;
  return true;
}

function looksLikeApplyAnchor(text, titleAttr, absUrl) {
  const combinedLabel = `${text || ''} ${titleAttr || ''}`.toLowerCase();
  if (
    /\b(apply\s*online|apply\s*now|online\s*application|online\s*registration|apply\s*here|click\s*(?:here\s*)?to\s*apply|register\s*online|submit\s*application)\b/i.test(combinedLabel)
  ) {
    return true;
  }
  try {
    const parsed = new URL(absUrl);
    const host = parsed.hostname.toLowerCase();
    const pathLower = (parsed.pathname || '').toLowerCase();
    if (host.startsWith('apply.') && pathLower !== '/' && pathLower.length > 1) {
      return true;
    }
    if (/\/(apply|apply[-_]?online|apply[-_]?now|online[-_]?application|online[-_]?registration|registration)\b/i.test(pathLower)) {
      return true;
    }
  } catch {}
  return false;
}

function looksLikeDetailsAnchor(text, titleAttr, absUrl) {
  if (isPdfUrl(absUrl)) return true;
  const combinedLabel = `${text || ''} ${titleAttr || ''}`.toLowerCase();
  return /\b(notification|advertisement|brochure|information\s*brochure|details|view\s*pdf|download|corrigendum|addendum|prospectus|circular)\b/i.test(combinedLabel);
}

/**
 * Separately extracts notification-specific detailsLink and genuine notification-specific applyLink.
 * Never falls back to generic root homepages or source listing URLs, and never copies a PDF into applyLink.
 */
export function classifyNotificationLinks($, container, baseUrl, sourceKey, sourceConfig = {}, options = {}) {
  let pdfDetailsLink = '';
  let explicitDetailsLink = '';
  let fallbackDetailsLink = '';
  let applyLink = '';

  $(container).find('a').each((_, a) => {
    const href = $(a).attr('href') || '';
    const text = $(a).text().replace(/\s+/g, ' ').trim();
    const titleAttr = `${$(a).attr('title') || ''} ${$(a).attr('aria-label') || ''}`.trim();
    const abs = resolveUrlSafe(href, baseUrl);
    if (!abs) return;

    const isApplyHint = looksLikeApplyAnchor(text, titleAttr, abs);
    const isDetailsHint = looksLikeDetailsAnchor(text, titleAttr, abs);

    if (isApplyHint) {
      if (!applyLink && isValidSpecificApplyUrl(abs, sourceKey, sourceConfig, options)) {
        applyLink = abs;
      }
      return;
    }

    if (isValidSpecificDetailsUrl(abs, sourceKey, sourceConfig, options)) {
      if (isPdfUrl(abs)) {
        if (!pdfDetailsLink) pdfDetailsLink = abs;
      } else if (isDetailsHint) {
        if (!explicitDetailsLink) explicitDetailsLink = abs;
      } else if (!fallbackDetailsLink) {
        fallbackDetailsLink = abs;
      }
    }
  });

  const detailsLink = pdfDetailsLink || explicitDetailsLink || fallbackDetailsLink || '';
  return { detailsLink, applyLink };
}

const PLACEHOLDER_VALUE_RE = /^(?:-|–|—|--|n\/a|na|nil|none|tba|tbd|not\s*specified|not\s*applicable|to\s*be\s*announced|awaited|refer\s*(?:official\s*)?notification)$/i;

/**
 * Strictly validates a calendar date string.
 * - Valid calendar date -> { valid: true, invalidCalendar: false, value: 'DD-MM-YYYY', components }
 * - Invalid calendar date (e.g. 30-02-2026) -> { valid: false, invalidCalendar: true, value: '', components: null }
 * - Empty / placeholder / descriptive -> { valid: false, invalidCalendar: false, value: '', components: null }
 */
export function extractValidatedDate(rawText) {
  const cleaned = String(rawText ?? '').replace(/\s+/g, ' ').trim();
  if (!cleaned || PLACEHOLDER_VALUE_RE.test(cleaned)) {
    return { valid: false, invalidCalendar: false, value: '', components: null };
  }

  const parsed = parseDateDetailed(cleaned);
  if (parsed.valid && parsed.components) {
    return {
      valid: true,
      invalidCalendar: false,
      value: parsed.components.displayDate,
      components: parsed.components
    };
  }
  if (parsed.kind === 'invalid_calendar') {
    return { valid: false, invalidCalendar: true, value: '', components: null };
  }
  return { valid: false, invalidCalendar: false, value: '', components: null };
}

/**
 * Extracts a positive integer vacancy count from a dedicated cell or inline text.
 * NEVER returns '0' or 0 for unknown/zero vacancies; always returns 'Not Specified' when unavailable.
 */
export function extractVacancyCount(rawText, { isDedicatedColumn = false } = {}) {
  const text = String(rawText ?? '').replace(/\s+/g, ' ').trim();
  if (!text || PLACEHOLDER_VALUE_RE.test(text)) {
    return 'Not Specified';
  }

  if (isDedicatedColumn) {
    // Reject pure zero or negative numbers explicitly (unknown vacancies must never be 0)
    if (/^0+(?:\s*(?:posts?|vacanc(?:y|ies)|openings?|seats?))?$/i.test(text)) {
      return 'Not Specified';
    }
    const pureMatch = text.match(/^(?:approx\.?\s*|total\s*[:\-]?\s*)?(\d{1,3}(?:,\d{3})+|\d{1,6})\s*\+?\s*(?:posts?|vacanc(?:y|ies)|openings?|seats?)?$/i);
    if (pureMatch) {
      const n = parseInt(pureMatch[1].replace(/,/g, ''), 10);
      if (Number.isInteger(n) && n >= 1 && n <= 500000) {
        return String(n);
      }
      return 'Not Specified';
    }
  }

  // Keyword-before-number: "Total Vacancies: 6,244", "No. of Posts - 2553", "Vacancies: 450"
  const kwBefore = text.match(
    /(?:total\s+(?:no\.?\s*of\s*)?(?:vacanc(?:y|ies)|posts?)|no\.?\s*of\s*(?:vacanc(?:y|ies)|posts?)|vacanc(?:y|ies)|total\s+posts?)\s*[:\-–=]?\s*(?:approx\.?\s*)?(\d{1,3}(?:,\d{3})+|\d{1,6})\b/i
  );
  if (kwBefore) {
    const n = parseInt(kwBefore[1].replace(/,/g, ''), 10);
    if (Number.isInteger(n) && n >= 1 && n <= 500000) {
      return String(n);
    }
    return 'Not Specified';
  }

  // Number-before-keyword: "6,244 Vacancies", "2553 Posts", "621+ Posts"
  const numBeforeRe = /(?:^|[\s(\[-])(\d{1,3}(?:,\d{3})+|\d{1,6})\s*\+?\s*(vacanc(?:y|ies)|posts?|openings?)\b/gi;
  let match;
  while ((match = numBeforeRe.exec(text)) !== null) {
    const numToken = match[1];
    const keywordToken = (match[2] || '').toLowerCase();
    const numStart = match.index + match[0].indexOf(numToken);
    const prefix = text.slice(Math.max(0, numStart - 24), numStart).trimEnd().toLowerCase();
    if (
      /(?:^|[\s(\[/,\-–:])(?:rs\.?|₹|inr|pay|level|grade|scale|advt\.?|notif(?:ication)?|no\.?|group|category|stage|tier|phase|class|part|paper|batch|division|recruitment|exam|examination)[\s\-–:.]*$/i.test(prefix)
    ) {
      continue;
    }
    // Reject bare 4-digit calendar years (2020-2035) immediately before "Post/Posts"
    const isBareYearBeforePosts =
      /^(?:202\d|203[0-5])$/.test(numToken) &&
      !match[0].includes('+') &&
      /^posts?$/i.test(keywordToken) &&
      !/(?:^|[\s(\[/,\-–:])(?:total|approx\.?|about)[\s\-–:.]*$/i.test(prefix);
    if (isBareYearBeforePosts) {
      continue;
    }
    const n = parseInt(numToken.replace(/,/g, ''), 10);
    if (Number.isInteger(n) && n >= 1 && n <= 500000) {
      return String(n);
    }
  }

  return 'Not Specified';
}

export function extractNotificationNo(rawCell, fallbackText = '') {
  const cell = String(rawCell ?? '').replace(/\s+/g, ' ').trim();
  if (cell && !PLACEHOLDER_VALUE_RE.test(cell) && !/^notification\s*no\.?$/i.test(cell)) {
    const stripped = cell.replace(/^(?:Notification|Notif\.?|Advt\.?|Advertisement)\s*(?:No\.?|Number)?\s*[:\-]?\s*/i, '').trim();
    if (stripped && stripped.length >= 2 && /\d/.test(stripped) && !PLACEHOLDER_VALUE_RE.test(stripped)) {
      return stripped;
    }
  }

  const text = String(fallbackText ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return '';

  const patterns = [
    /\b(?:Notification|Notif\.?|Advt\.?|Advertisement)\s*(?:No\.?|Number)\s*[:\-]?\s*([A-Z0-9][A-Z0-9/.\-_]{1,30})/i,
    /\b(\d{1,3}\/[A-Z]{2,6}\/\d{4})\b/i
  ];
  for (const pat of patterns) {
    const m = text.match(pat);
    if (m && m[1] && /\d/.test(m[1])) {
      return m[1].replace(/[.,;:\)\]]+$/, '');
    }
  }
  return '';
}

const INLINE_DATE_TOKEN = '(\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}|\\d{1,2}[-/.]\\d{1,2}[-/.]\\d{4}|\\d{1,2}(?:st|nd|rd|th)?\\s+[A-Za-z]{3,9},?\\s+\\d{4}|[A-Za-z]{3,9}\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+\\d{4})';

/**
 * Extracts clearly labeled published, opening, closing, and exam dates from inline prose.
 * Strictly separates Notification/Published Date from Application Opening Date.
 */
export function extractInlineDateFields(text) {
  const src = String(text ?? '').replace(/\s+/g, ' ').trim();
  const result = {
    sourcePublishedAt: '',
    openingDate: '',
    closingDate: '',
    examDate: '',
    invalidDateFields: []
  };
  if (!src) return result;

  const pubRe = new RegExp(
    `(?:date\\s+of\\s+notification|notification\\s+date|notif\\.?\\s*date|published\\s+(?:on|date)|date\\s+of\\s+publication|issued\\s+on|dated)\\s*[:\\-–]?\\s*${INLINE_DATE_TOKEN}`,
    'i'
  );
  const pubMatch = src.match(pubRe);
  if (pubMatch) {
    const parsed = extractValidatedDate(pubMatch[1]);
    if (parsed.valid) result.sourcePublishedAt = parsed.value;
    else if (parsed.invalidCalendar) result.invalidDateFields.push('sourcePublishedAt');
  }

  const rangeRe = new RegExp(
    `(?:online\\s+application|application|registration|apply\\s+online)[^.\\n]{0,45}?\\bfrom\\s*[:\\-]?\\s*${INLINE_DATE_TOKEN}\\s*(?:to|till|until|–|-)\\s*${INLINE_DATE_TOKEN}`,
    'i'
  );
  const rangeMatch = src.match(rangeRe);
  if (rangeMatch) {
    const openParsed = extractValidatedDate(rangeMatch[1]);
    if (openParsed.valid) result.openingDate = openParsed.value;
    else if (openParsed.invalidCalendar) result.invalidDateFields.push('openingDate');

    const closeParsed = extractValidatedDate(rangeMatch[2]);
    if (closeParsed.valid) result.closingDate = closeParsed.value;
    else if (closeParsed.invalidCalendar) result.invalidDateFields.push('closingDate');
  }

  if (!result.openingDate && !result.invalidDateFields.includes('openingDate')) {
    const openRe = new RegExp(
      `(?:opening\\s+date|application\\s+start\\s+date|start\\s+date|registration\\s+from|commencement\\s+of\\s+(?:online\\s+)?application|apply\\s+from|online\\s+application\\s+starts?\\s*(?:from|on)?)\\s*[:\\-–]?\\s*${INLINE_DATE_TOKEN}`,
      'i'
    );
    const openMatch = src.match(openRe);
    if (openMatch) {
      const parsed = extractValidatedDate(openMatch[1]);
      if (parsed.valid) result.openingDate = parsed.value;
      else if (parsed.invalidCalendar) result.invalidDateFields.push('openingDate');
    }
  }

  if (!result.closingDate && !result.invalidDateFields.includes('closingDate')) {
    const closeRe = new RegExp(
      `(?:closing\\s+date|last\\s+date(?:\\s+for\\s+(?:online\\s+)?(?:submission|application|registration|applying)(?:\\s+of\\s+application)?)?|application\\s+end\\s+date|end\\s+date|registration\\s+to|apply\\s+to|closes?\\s+on|deadline)\\s*[:\\-–]?\\s*${INLINE_DATE_TOKEN}`,
      'i'
    );
    const closeMatch = src.match(closeRe);
    if (closeMatch) {
      const parsed = extractValidatedDate(closeMatch[1]);
      if (parsed.valid) result.closingDate = parsed.value;
      else if (parsed.invalidCalendar) result.invalidDateFields.push('closingDate');
    }
  }

  const examRe = new RegExp(
    `(?:date\\s+of\\s+exam(?:ination)?|exam(?:ination)?\\s+date|written\\s+exam(?:ination)?\\s*(?:date|on)?)\\s*[:\\-–]?\\s*${INLINE_DATE_TOKEN}`,
    'i'
  );
  const examMatch = src.match(examRe);
  if (examMatch) {
    const parsed = extractValidatedDate(examMatch[1]);
    if (parsed.valid) result.examDate = parsed.value;
    else if (parsed.invalidCalendar) result.invalidDateFields.push('examDate');
  }

  return result;
}

/**
 * Validates cross-field date chronology without ever inventing missing dates.
 * If closingDate < openingDate, rejects closingDate and records 'closingDate_before_openingDate'.
 */
function reconcileExtractedDates({ sourcePublishedAt = '', openingDate = '', closingDate = '', examDate = '', invalidDateFields = [] }) {
  const issues = [...new Set(invalidDateFields)];
  let finalOpen = openingDate;
  let finalClose = closingDate;
  let finalExam = examDate;

  const openParsed = finalOpen ? parseDateDetailed(finalOpen) : null;
  const closeParsed = finalClose ? parseDateDetailed(finalClose) : null;
  const examParsed = finalExam ? parseDateDetailed(finalExam) : null;

  if (openParsed?.valid && closeParsed?.valid && closeParsed.components.epochDays < openParsed.components.epochDays) {
    issues.push('closingDate_before_openingDate');
    finalClose = '';
  }
  if (openParsed?.valid && examParsed?.valid && examParsed.components.epochDays < openParsed.components.epochDays) {
    issues.push('examDate_before_openingDate');
    finalExam = '';
  }

  return {
    sourcePublishedAt,
    notificationDate: sourcePublishedAt,
    openingDate: finalOpen,
    closingDate: finalClose,
    examDate: finalExam || 'To Be Announced',
    invalidDateFields: [...new Set(issues)]
  };
}

/**
 * Inspects a table's header row (<thead> or first <tr>) and maps column semantics dynamically.
 */
function inspectTableHeaders($, table) {
  let headerRow = $(table).find('thead tr').first();
  let headerInTbody = false;

  if (headerRow.length === 0) {
    const firstTr = $(table).find('tr').first();
    if (firstTr.length > 0) {
      const thCount = firstTr.find('th').length;
      const firstText = firstTr.text().replace(/\s+/g, ' ').trim().toLowerCase();
      if (
        thCount > 0 ||
        /\b(s\.?\s*no|sl\.?\s*no|notification|name of|post|opening|closing|last date|registration|exam|vacanc|department)\b/i.test(firstText)
      ) {
        headerRow = firstTr;
        headerInTbody = true;
      }
    }
  }

  const headers = [];
  if (headerRow.length > 0) {
    headerRow.find('th, td').each((_, cell) => {
      headers.push($(cell).text().replace(/\s+/g, ' ').trim().toLowerCase());
    });
  }

  const colMap = {
    notifNo: -1,
    service: -1,
    department: -1,
    vacancies: -1,
    publishedDate: -1,
    openingDate: -1,
    closingDate: -1,
    examDate: -1,
    notifMonth: -1
  };

  headers.forEach((h, idx) => {
    if (!h) return;
    if (colMap.notifNo === -1 && /(?:^|\b)(?:notif(?:ication)?\s*(?:no\.?|number)|advt\.?\s*no\.?|^no\.?$)(?:\s|$)/i.test(h)) {
      colMap.notifNo = idx;
    } else if (colMap.department === -1 && /(?:^|\b)(?:department|dept\.?|directorate|organisation|organization)(?:\s|$)/i.test(h)) {
      colMap.department = idx;
    } else if (colMap.vacancies === -1 && /(?:^|\b)(?:vacanc(?:y|ies)|no\.?\s*of\s*posts?|total\s*posts?|^posts?$)(?:\s|$)/i.test(h)) {
      colMap.vacancies = idx;
    } else if (colMap.notifMonth === -1 && /\b(?:notification\s*month|tentative\s*month)\b/i.test(h)) {
      colMap.notifMonth = idx;
    } else if (
      colMap.publishedDate === -1 &&
      /\b(?:date\s*of\s*notif(?:ication)?|notif(?:ication)?\s*date|publish(?:ed)?\s*date|date\s*of\s*publication|issue(?:d)?\s*date|release\s*date)\b/i.test(h)
    ) {
      colMap.publishedDate = idx;
    } else if (
      colMap.openingDate === -1 &&
      /\b(?:open(?:ing)?\s*date|^open$|start\s*date|registration\s*from|apply\s*from|commencement|application\s*start|from\s*date)\b/i.test(h)
    ) {
      colMap.openingDate = idx;
    } else if (
      colMap.closingDate === -1 &&
      /\b(?:clos(?:ing)?\s*date|^close$|last\s*date|end\s*date|registration\s*to|apply\s*to|submission|application\s*end|to\s*date|deadline)\b/i.test(h)
    ) {
      colMap.closingDate = idx;
    } else if (
      colMap.examDate === -1 &&
      /\b(?:date\s*of\s*exam|exam(?:ination)?\s*date|exam\s*month|written\s*exam|tentative\s*exam)\b/i.test(h)
    ) {
      colMap.examDate = idx;
    } else if (
      colMap.service === -1 &&
      /\b(?:name\s*of\s*(?:the\s*)?(?:post|service|exam)|post\s*name|^post$|recruitment|description|particulars|title|examination)\b/i.test(h)
    ) {
      colMap.service = idx;
    }
  });

  const isPlannerTable =
    colMap.notifMonth !== -1 ||
    headers.some((h) => /\b(annual\s*planner|tentative\s*month|notification\s*month|exam\s*month)\b/i.test(h));

  return { headers, colMap, isPlannerTable, headerRow, headerInTbody };
}

function getDataRows($, table, headerInfo) {
  const rows = [];
  const rawRows = $(table).find('tbody tr').length > 0 ? $(table).find('tbody tr') : $(table).find('tr');
  rawRows.each((idx, row) => {
    if (headerInfo.headerInTbody && idx === 0 && $(row).is(headerInfo.headerRow)) {
      return;
    }
    if ($(row).find('td').length === 0) return;
    rows.push(row);
  });
  return rows;
}

function cleanDepartmentText(raw, fallbackDept) {
  const cleaned = String(raw ?? '').replace(/\s+/g, ' ').trim();
  if (!cleaned || PLACEHOLDER_VALUE_RE.test(cleaned) || cleaned.length < 3) {
    return fallbackDept;
  }
  return cleaned;
}

function extractExamDateFromCell(rawCell, fallbackText = '') {
  const cleaned = String(rawCell ?? '').replace(/\s+/g, ' ').trim();
  if (cleaned && !PLACEHOLDER_VALUE_RE.test(cleaned) && !/date of exam|sl\.?no|name of the/i.test(cleaned)) {
    const validated = extractValidatedDate(cleaned);
    if (validated.valid) {
      return { value: validated.value, invalidCalendar: false };
    }
    if (validated.invalidCalendar) {
      return { value: '', invalidCalendar: true };
    }
    // Preserve valid non-numeric/month-year descriptive schedules (e.g., "December 2026")
    return { value: cleaned, invalidCalendar: false };
  }

  const inline = extractInlineDateFields(fallbackText);
  if (inline.examDate) {
    return { value: inline.examDate, invalidCalendar: false };
  }
  if (inline.invalidDateFields.includes('examDate')) {
    return { value: '', invalidCalendar: true };
  }
  return { value: '', invalidCalendar: false };
}

/**
 * Scrapes TNPSC Official Notification Table & Annual Planner
 * Covers Group 1, Group 2/2A, Group 4, Engineering, Technical recruitments and Corrigenda.
 */
export async function scrapeTnpscNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url || 'https://www.tnpsc.gov.in/English/Notification.aspx';
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'tnpsc'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenKeys = new Set();
  const defaultOrg = 'Tamil Nadu Public Service Commission (TNPSC)';
  const defaultDept = 'Tamil Nadu Public Service Commission (TNPSC)';

  $('table').each((_, table) => {
    const headerInfo = inspectTableHeaders($, table);
    const { colMap, isPlannerTable } = headerInfo;
    const rows = getDataRows($, table, headerInfo);

    for (const row of rows) {
      const cols = $(row).find('td');
      const rowText = $(row).text().replace(/\s+/g, ' ').trim();

      if (isPlannerTable && cols.length >= 4) {
        const postIdx = colMap.service !== -1 ? colMap.service : 1;
        const vacIdx = colMap.vacancies !== -1 ? colMap.vacancies : 3;
        const examIdx = colMap.examDate !== -1 ? colMap.examDate : (cols.length >= 5 ? 4 : -1);
        const deptIdx = colMap.department;

        const postCol = $(cols[postIdx]).text().replace(/\s+/g, ' ').trim();
        if (!postCol || postCol.length <= 5 || postCol.toLowerCase().includes('name of the post')) {
          continue;
        }

        const vacCell = vacIdx !== -1 && cols[vacIdx] ? $(cols[vacIdx]).text() : '';
        const vacancies = extractVacancyCount(vacCell, { isDedicatedColumn: vacIdx !== -1 });
        const examColRaw = examIdx !== -1 && cols[examIdx] ? $(cols[examIdx]).text().replace(/\s+/g, ' ').trim() : '';
        const examParsed = extractExamDateFromCell(examColRaw);
        const department = deptIdx !== -1 && cols[deptIdx] ? cleanDepartmentText($(cols[deptIdx]).text(), defaultDept) : defaultDept;
        const { detailsLink, applyLink } = classifyNotificationLinks($, row, url, 'tnpsc', sourceConfig, options);

        const dedupKey = `planner|${postCol.toLowerCase()}|${examParsed.value.toLowerCase()}`;
        if (seenKeys.has(dedupKey)) continue;
        seenKeys.add(dedupKey);

        const groupTag = classifyTnpscGroup(postCol);
        items.push({
          sourceKey: 'tnpsc',
          category: 'tnpsc',
          organization: defaultOrg,
          department,
          service: postCol,
          postName: postCol,
          group: groupTag,
          notificationNo: '',
          openingDate: '',
          closingDate: '',
          sourcePublishedAt: '',
          notificationDate: '',
          examDate: examParsed.value || 'To Be Announced',
          qualification: 'Refer Official Notification',
          ageLimit: 'Refer Official Notification',
          applicationFee: 'Refer Official Notification',
          vacancies,
          posts: vacancies,
          detailsLink,
          applyLink,
          source: 'Official TNPSC Portal (tnpsc.gov.in)',
          sourceUrl: url,
          isTentativePlanner: true,
          ...(examParsed.invalidCalendar ? { invalidDateFields: ['examDate'] } : {})
        });
        continue;
      }

      if (cols.length < 4) continue;

      // Determine column indices (header-aware with TNPSC canonical fallback)
      const hasExplicitHeaders = colMap.service !== -1 || colMap.openingDate !== -1 || colMap.closingDate !== -1 || colMap.publishedDate !== -1;
      const notifIdx = colMap.notifNo !== -1 ? colMap.notifNo : (cols.length >= 5 ? 1 : -1);
      const serviceIdx = colMap.service !== -1 ? colMap.service : (cols.length >= 5 ? 2 : 1);
      const openIdx = colMap.openingDate !== -1 ? colMap.openingDate : (!hasExplicitHeaders && cols.length >= 5 ? 3 : -1);
      const closeIdx = colMap.closingDate !== -1 ? colMap.closingDate : (!hasExplicitHeaders && cols.length >= 5 ? 4 : -1);
      const pubIdx = colMap.publishedDate;
      const vacIdx = colMap.vacancies;
      const deptIdx = colMap.department;
      const examIdx = colMap.examDate !== -1 ? colMap.examDate : (!hasExplicitHeaders && cols.length >= 6 ? 5 : -1);

      const serviceEl = $(cols[serviceIdx]);
      const serviceFullText = serviceEl.text().replace(/\s+/g, ' ').trim();
      const clonedService = serviceEl.clone();
      clonedService.find('button, .badge').remove();
      clonedService.find('a').each((_, a) => {
        const aText = $(a).text().replace(/\s+/g, ' ').trim();
        if (/^(?:apply\s*online|apply\s*now|download|notification\s*pdf|view\s*pdf|pdf|hall\s*ticket|download\s*hall\s*ticket|addendum[_0-9a-z]*|corrigendum|syllabus)$/i.test(aText)) {
          $(a).remove();
        }
      });
      const rawService = clonedService.text().replace(/\s+/g, ' ').trim() || serviceFullText;
      const hasCorrigendum = /addendum|corrigendum/i.test(serviceFullText) || /ADDENDUM_[0-9A-Z]+/i.test(serviceFullText);
      const cleanService = rawService
        .replace(/APPLY ONLINE|Apply Now|Download Hall Ticket|Download Notification|ADDENDUM_[0-9A-Z]+/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      if (!cleanService || cleanService.length <= 3 || cleanService.toLowerCase().includes('name of the post')) {
        continue;
      }

      const notifNo = extractNotificationNo(notifIdx !== -1 ? $(cols[notifIdx]).text() : '', rowText);
      const department = deptIdx !== -1 && cols[deptIdx] ? cleanDepartmentText($(cols[deptIdx]).text(), defaultDept) : defaultDept;

      // Vacancies: dedicated column first, then explicit inline mention in row text (NEVER '0')
      const vacFromCol = vacIdx !== -1 && cols[vacIdx]
        ? extractVacancyCount($(cols[vacIdx]).text(), { isDedicatedColumn: true })
        : 'Not Specified';
      const vacancies = vacFromCol !== 'Not Specified' ? vacFromCol : extractVacancyCount(rowText);

      // Dates: strictly separate Published Date from Application Opening Date
      const inlineDates = extractInlineDateFields(rowText);
      const invalidDateFields = [...inlineDates.invalidDateFields];

      let sourcePublishedAt = '';
      if (pubIdx !== -1 && cols[pubIdx]) {
        const pubRes = extractValidatedDate($(cols[pubIdx]).text());
        if (pubRes.valid) sourcePublishedAt = pubRes.value;
        else if (pubRes.invalidCalendar) invalidDateFields.push('sourcePublishedAt');
      } else if (inlineDates.sourcePublishedAt) {
        sourcePublishedAt = inlineDates.sourcePublishedAt;
      }

      let openingDate = '';
      if (openIdx !== -1 && cols[openIdx]) {
        const openRes = extractValidatedDate($(cols[openIdx]).text());
        if (openRes.valid) openingDate = openRes.value;
        else if (openRes.invalidCalendar) invalidDateFields.push('openingDate');
      } else if (inlineDates.openingDate) {
        openingDate = inlineDates.openingDate;
      }

      let closingDate = '';
      if (closeIdx !== -1 && cols[closeIdx]) {
        const closeRes = extractValidatedDate($(cols[closeIdx]).text());
        if (closeRes.valid) closingDate = closeRes.value;
        else if (closeRes.invalidCalendar) invalidDateFields.push('closingDate');
      } else if (inlineDates.closingDate) {
        closingDate = inlineDates.closingDate;
      }

      let examDate = '';
      if (examIdx !== -1 && cols[examIdx]) {
        const examRes = extractExamDateFromCell($(cols[examIdx]).text(), rowText);
        if (examRes.invalidCalendar) invalidDateFields.push('examDate');
        else examDate = examRes.value;
      } else if (inlineDates.examDate) {
        examDate = inlineDates.examDate;
      }

      const dates = reconcileExtractedDates({
        sourcePublishedAt,
        openingDate,
        closingDate,
        examDate,
        invalidDateFields
      });

      const { detailsLink, applyLink } = classifyNotificationLinks($, row, url, 'tnpsc', sourceConfig, options);

      const dedupKey = `${notifNo.toLowerCase()}|${cleanService.toLowerCase()}|${detailsLink.toLowerCase()}`;
      if (seenKeys.has(dedupKey)) continue;
      seenKeys.add(dedupKey);

      const groupTag = classifyTnpscGroup(cleanService);
      items.push({
        sourceKey: 'tnpsc',
        category: 'tnpsc',
        organization: defaultOrg,
        department,
        service: cleanService,
        postName: cleanService,
        group: groupTag,
        notificationNo: notifNo,
        openingDate: dates.openingDate,
        closingDate: dates.closingDate,
        sourcePublishedAt: dates.sourcePublishedAt,
        notificationDate: dates.notificationDate,
        examDate: dates.examDate,
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies,
        posts: vacancies,
        detailsLink,
        applyLink,
        source: 'Official TNPSC Portal (tnpsc.gov.in)',
        sourceUrl: url,
        isCorrigendum: Boolean(hasCorrigendum),
        ...(dates.invalidDateFields.length > 0 ? { invalidDateFields: dates.invalidDateFields } : {})
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 15) };
}

function isTnusrbRecruitmentTitle(text) {
  const lower = String(text || '').toLowerCase();
  const isRecruit =
    lower.includes('joint recruitment') ||
    lower.includes('common recruitment') ||
    lower.includes('sub-inspector') ||
    lower.includes('constable') ||
    lower.includes('police recruitment') ||
    lower.includes('fireman') ||
    lower.includes('jail warder') ||
    lower.includes('station officer');

  const isExcludedNoise =
    lower.includes('final result') ||
    lower.includes('final selection list') ||
    lower.includes('final provisional selection') ||
    lower.includes('marks secured') ||
    lower.includes('answer key') ||
    lower.includes('archive');

  return isRecruit && !isExcludedNoise;
}

/**
 * Scrapes TNUSRB Official Recruitment Portal
 * Supports structured recruitment cards/table rows (with separate Notification PDF & Apply URL + dates/vacancies)
 * as well as direct official homepage anchor links.
 */
export async function scrapeTnusrbNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'tnusrb'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenKeys = new Set();
  const claimedAnchors = new Set();
  const defaultOrg = 'Tamil Nadu Uniformed Services Recruitment Board (TNUSRB)';
  const defaultDept = 'Home Department (Tamil Nadu Police / TNUSRB)';

  // 1. Structured table rows or recruitment cards/blocks
  const structuredBlocks = [];
  $('table').each((_, table) => {
    const headerInfo = inspectTableHeaders($, table);
    const rows = getDataRows($, table, headerInfo);
    for (const row of rows) {
      structuredBlocks.push({ el: row, isTableRow: true, headerInfo });
    }
  });

  $('.recruitment-card, .notification-card, .notification-item, .notice-item, article, li').each((_, el) => {
    if ($(el).closest('table').length > 0) return;
    if ($(el).find('.recruitment-card, .notification-card, .notification-item, .notice-item, article, li').length > 0) return;
    if ($(el).find('a').length === 0) return;
    structuredBlocks.push({ el, isTableRow: false, headerInfo: null });
  });

  for (const block of structuredBlocks) {
    const $el = $(block.el);
    const blockText = $el.text().replace(/\s+/g, ' ').trim();
    if (!blockText || !isTnusrbRecruitmentTitle(blockText)) continue;

    let title = '';
    let notifNo = '';
    let vacancies = 'Not Specified';
    let department = defaultDept;
    let sourcePublishedAt = '';
    let openingDate = '';
    let closingDate = '';
    let examDate = '';
    const invalidDateFields = [];

    if (block.isTableRow && block.headerInfo) {
      const cols = $el.find('td');
      const { colMap } = block.headerInfo;
      const svcIdx = colMap.service !== -1 ? colMap.service : (cols.length >= 2 ? 1 : 0);
      title = $(cols[svcIdx]).clone().find('a, button').remove().end().text().replace(/\s+/g, ' ').trim()
        || $(cols[svcIdx]).text().replace(/\s+/g, ' ').trim();
      if (colMap.notifNo !== -1 && cols[colMap.notifNo]) {
        notifNo = extractNotificationNo($(cols[colMap.notifNo]).text(), blockText);
      }
      if (colMap.department !== -1 && cols[colMap.department]) {
        department = cleanDepartmentText($(cols[colMap.department]).text(), defaultDept);
      }
      if (colMap.vacancies !== -1 && cols[colMap.vacancies]) {
        vacancies = extractVacancyCount($(cols[colMap.vacancies]).text(), { isDedicatedColumn: true });
      }
      if (colMap.publishedDate !== -1 && cols[colMap.publishedDate]) {
        const p = extractValidatedDate($(cols[colMap.publishedDate]).text());
        if (p.valid) sourcePublishedAt = p.value;
        else if (p.invalidCalendar) invalidDateFields.push('sourcePublishedAt');
      }
      if (colMap.openingDate !== -1 && cols[colMap.openingDate]) {
        const o = extractValidatedDate($(cols[colMap.openingDate]).text());
        if (o.valid) openingDate = o.value;
        else if (o.invalidCalendar) invalidDateFields.push('openingDate');
      }
      if (colMap.closingDate !== -1 && cols[colMap.closingDate]) {
        const c = extractValidatedDate($(cols[colMap.closingDate]).text());
        if (c.valid) closingDate = c.value;
        else if (c.invalidCalendar) invalidDateFields.push('closingDate');
      }
      if (colMap.examDate !== -1 && cols[colMap.examDate]) {
        const ex = extractExamDateFromCell($(cols[colMap.examDate]).text(), blockText);
        if (ex.invalidCalendar) invalidDateFields.push('examDate');
        else examDate = ex.value;
      }
    } else {
      title =
        $el.find('h1, h2, h3, h4, h5, .title, .notice-title, strong, b').first().text().replace(/\s+/g, ' ').trim() ||
        $el.find('a').filter((_, a) => isTnusrbRecruitmentTitle($(a).text())).first().text().replace(/\s+/g, ' ').trim();
    }

    title = title.replace(/\s+/g, ' ').trim();
    if (!title || title.length < 6 || !isTnusrbRecruitmentTitle(title)) continue;

    if (!notifNo) notifNo = extractNotificationNo('', blockText);
    if (vacancies === 'Not Specified') vacancies = extractVacancyCount(blockText);

    const inlineDates = extractInlineDateFields(blockText);
    if (!sourcePublishedAt && inlineDates.sourcePublishedAt) sourcePublishedAt = inlineDates.sourcePublishedAt;
    if (!openingDate && inlineDates.openingDate) openingDate = inlineDates.openingDate;
    if (!closingDate && inlineDates.closingDate) closingDate = inlineDates.closingDate;
    if (!examDate && inlineDates.examDate) examDate = inlineDates.examDate;
    invalidDateFields.push(...inlineDates.invalidDateFields);

    const dates = reconcileExtractedDates({
      sourcePublishedAt,
      openingDate,
      closingDate,
      examDate,
      invalidDateFields
    });

    const { detailsLink, applyLink } = classifyNotificationLinks($, block.el, url, 'tnusrb', sourceConfig, options);
    if (!detailsLink && !applyLink) continue;

    $el.find('a').each((_, a) => claimedAnchors.add(a));

    const dedupKey = `${notifNo.toLowerCase()}|${title.toLowerCase()}|${detailsLink.toLowerCase()}`;
    if (seenKeys.has(dedupKey)) continue;
    seenKeys.add(dedupKey);

    items.push({
      sourceKey: 'tnusrb',
      category: 'police_defence',
      organization: defaultOrg,
      department,
      service: title,
      postName: title,
      notificationNo: notifNo,
      openingDate: dates.openingDate,
      closingDate: dates.closingDate,
      sourcePublishedAt: dates.sourcePublishedAt,
      notificationDate: dates.notificationDate,
      examDate: dates.examDate,
      qualification: 'Refer Official Notification',
      ageLimit: 'Refer Official Notification',
      applicationFee: 'Refer Official Notification',
      vacancies,
      posts: vacancies,
      detailsLink,
      applyLink,
      source: 'Official TNUSRB Portal',
      sourceUrl: url,
      ...(dates.invalidDateFields.length > 0 ? { invalidDateFields: dates.invalidDateFields } : {})
    });
  }

  // 2. Fallback scan for standalone homepage recruitment <a> anchors not already captured
  $('a').each((_, a) => {
    if (claimedAnchors.has(a)) return;
    const text = $(a).text().replace(/\s+/g, ' ').trim();
    const href = $(a).attr('href') || '';
    const titleAttr = `${$(a).attr('title') || ''} ${$(a).attr('aria-label') || ''}`.trim();
    const absLink = resolveUrlSafe(href, url);
    if (!absLink || !text || !isTnusrbRecruitmentTitle(text)) return;

    const isApplyAnchor = looksLikeApplyAnchor(text, titleAttr, absLink);
    let detailsLink = '';
    let applyLink = '';
    if (isApplyAnchor) {
      if (isValidSpecificApplyUrl(absLink, 'tnusrb', sourceConfig, options)) {
        applyLink = absLink;
      }
    } else if (isValidSpecificDetailsUrl(absLink, 'tnusrb', sourceConfig, options)) {
      detailsLink = absLink;
    }

    if (!detailsLink && !applyLink) return;

    const notifNo = extractNotificationNo('', text);
    const vacancies = extractVacancyCount(text);
    const inlineDates = extractInlineDateFields(text);
    const dates = reconcileExtractedDates(inlineDates);

    const dedupKey = `${notifNo.toLowerCase()}|${text.toLowerCase()}|${detailsLink.toLowerCase()}`;
    if (seenKeys.has(dedupKey)) return;
    seenKeys.add(dedupKey);

    items.push({
      sourceKey: 'tnusrb',
      category: 'police_defence',
      organization: defaultOrg,
      department: defaultDept,
      service: text,
      postName: text,
      notificationNo: notifNo,
      openingDate: dates.openingDate,
      closingDate: dates.closingDate,
      sourcePublishedAt: dates.sourcePublishedAt,
      notificationDate: dates.notificationDate,
      examDate: dates.examDate,
      qualification: 'Refer Official Notification',
      ageLimit: 'Refer Official Notification',
      applicationFee: 'Refer Official Notification',
      vacancies,
      posts: vacancies,
      detailsLink,
      applyLink,
      source: 'Official TNUSRB Portal',
      sourceUrl: url,
      ...(dates.invalidDateFields.length > 0 ? { invalidDateFields: dates.invalidDateFields } : {})
    });
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes TRB (Teachers Recruitment Board Tamil Nadu) Structured Table
 */
export async function scrapeTrbNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'trb_tn'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenKeys = new Set();
  const defaultOrg = 'Teachers Recruitment Board (TRB Tamil Nadu)';
  const defaultDept = 'School Education / Higher Education Department (TRB Tamil Nadu)';

  $('table').each((_, table) => {
    const headerInfo = inspectTableHeaders($, table);
    const { colMap } = headerInfo;
    const rows = getDataRows($, table, headerInfo);

    for (const row of rows) {
      const cols = $(row).find('td');
      // Standard TRB Table columns: [0: S No, 1: Notification No, 2: Name of Post, 3: Registration From, 4: Registration To, 5: Date of Exam, 6: Actions]
      if (cols.length < 5) continue;

      const hasExplicitHeaders = colMap.service !== -1 || colMap.openingDate !== -1 || colMap.closingDate !== -1;
      const notifIdx = colMap.notifNo !== -1 ? colMap.notifNo : 1;
      const serviceIdx = colMap.service !== -1 ? colMap.service : 2;
      const openIdx = colMap.openingDate !== -1 ? colMap.openingDate : (!hasExplicitHeaders ? 3 : -1);
      const closeIdx = colMap.closingDate !== -1 ? colMap.closingDate : (!hasExplicitHeaders ? 4 : -1);
      const pubIdx = colMap.publishedDate;
      const vacIdx = colMap.vacancies;
      const deptIdx = colMap.department;
      const examIdx = colMap.examDate !== -1 ? colMap.examDate : (!hasExplicitHeaders && cols.length >= 6 ? 5 : -1);

      const rowText = $(row).text().replace(/\s+/g, ' ').trim();
      const service = $(cols[serviceIdx]).text().replace(/\s+/g, ' ').trim();
      if (!service || service.length <= 5 || service.toLowerCase().includes('name of the post')) {
        continue;
      }

      const notifNo = extractNotificationNo(notifIdx !== -1 && cols[notifIdx] ? $(cols[notifIdx]).text() : '', rowText);
      const department = deptIdx !== -1 && cols[deptIdx] ? cleanDepartmentText($(cols[deptIdx]).text(), defaultDept) : defaultDept;

      const vacFromCol = vacIdx !== -1 && cols[vacIdx]
        ? extractVacancyCount($(cols[vacIdx]).text(), { isDedicatedColumn: true })
        : 'Not Specified';
      const vacancies = vacFromCol !== 'Not Specified' ? vacFromCol : extractVacancyCount(rowText);

      const inlineDates = extractInlineDateFields(rowText);
      const invalidDateFields = [...inlineDates.invalidDateFields];

      let sourcePublishedAt = '';
      if (pubIdx !== -1 && cols[pubIdx]) {
        const p = extractValidatedDate($(cols[pubIdx]).text());
        if (p.valid) sourcePublishedAt = p.value;
        else if (p.invalidCalendar) invalidDateFields.push('sourcePublishedAt');
      } else if (inlineDates.sourcePublishedAt) {
        sourcePublishedAt = inlineDates.sourcePublishedAt;
      }

      let openingDate = '';
      if (openIdx !== -1 && cols[openIdx]) {
        const o = extractValidatedDate($(cols[openIdx]).text());
        if (o.valid) openingDate = o.value;
        else if (o.invalidCalendar) invalidDateFields.push('openingDate');
      } else if (inlineDates.openingDate) {
        openingDate = inlineDates.openingDate;
      }

      let closingDate = '';
      if (closeIdx !== -1 && cols[closeIdx]) {
        const c = extractValidatedDate($(cols[closeIdx]).text());
        if (c.valid) closingDate = c.value;
        else if (c.invalidCalendar) invalidDateFields.push('closingDate');
      } else if (inlineDates.closingDate) {
        closingDate = inlineDates.closingDate;
      }

      let examDate = '';
      if (examIdx !== -1 && cols[examIdx]) {
        const ex = extractExamDateFromCell($(cols[examIdx]).text(), rowText);
        if (ex.invalidCalendar) invalidDateFields.push('examDate');
        else examDate = ex.value;
      } else if (inlineDates.examDate) {
        examDate = inlineDates.examDate;
      }

      const dates = reconcileExtractedDates({
        sourcePublishedAt,
        openingDate,
        closingDate,
        examDate,
        invalidDateFields
      });

      const { detailsLink, applyLink } = classifyNotificationLinks($, row, url, 'trb_tn', sourceConfig, options);

      const dedupKey = `${notifNo.toLowerCase()}|${service.toLowerCase()}|${detailsLink.toLowerCase()}`;
      if (seenKeys.has(dedupKey)) continue;
      seenKeys.add(dedupKey);

      items.push({
        sourceKey: 'trb_tn',
        category: 'teaching',
        organization: defaultOrg,
        department,
        service,
        postName: service,
        notificationNo: notifNo,
        openingDate: dates.openingDate,
        closingDate: dates.closingDate,
        sourcePublishedAt: dates.sourcePublishedAt,
        notificationDate: dates.notificationDate,
        examDate: dates.examDate,
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies,
        posts: vacancies,
        detailsLink,
        applyLink,
        source: 'Official TRB Portal',
        sourceUrl: url,
        ...(dates.invalidDateFields.length > 0 ? { invalidDateFields: dates.invalidDateFields } : {})
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}

/**
 * Scrapes MRB (Medical Services Recruitment Board Tamil Nadu) Structured Table
 */
export async function scrapeMrbNotifications(sourceConfig, options = {}) {
  const url = sourceConfig.url;
  const res = await safeFetchHtml(url, withSourceKey(sourceConfig, options, 'mrb_tn'));
  if (!res.ok) {
    return { success: false, source: sourceConfig.key, error: res.error, items: [] };
  }

  const $ = cheerio.load(res.html);
  const items = [];
  const seenKeys = new Set();
  const defaultOrg = 'Medical Services Recruitment Board (MRB Tamil Nadu)';
  const defaultDept = 'Health and Family Welfare Department (MRB Tamil Nadu)';

  $('table').each((_, table) => {
    const headerInfo = inspectTableHeaders($, table);
    const { colMap } = headerInfo;
    const rows = getDataRows($, table, headerInfo);

    for (const row of rows) {
      const cols = $(row).find('td');
      if (cols.length < 3) continue;

      const notifIdx = colMap.notifNo !== -1 ? colMap.notifNo : 1;
      const descIdx = colMap.service !== -1 ? colMap.service : 2;
      const vacIdx = colMap.vacancies;
      const deptIdx = colMap.department;
      const pubIdx = colMap.publishedDate;
      const openIdx = colMap.openingDate;
      const closeIdx = colMap.closingDate;
      const examIdx = colMap.examDate;

      const rowText = $(row).text().replace(/\s+/g, ' ').trim();
      const rawNotifCell = cols[notifIdx] ? $(cols[notifIdx]).text().replace(/\s+/g, ' ').trim() : '';
      if (rawNotifCell.toLowerCase().includes('notification no')) continue;

      const notifNo = extractNotificationNo(rawNotifCell, rowText);
      const descText = cols[descIdx] ? $(cols[descIdx]).text().replace(/\s+/g, ' ').trim() : '';
      if (!descText) continue;

      // Extract a clean post name without inline date/link clutter
      const titleSource = descText
        .replace(/\b(Apply\s*Online|Apply\s*Now|Download\s*PDF|View\s*Notification|Notification\s*PDF)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

      let postName = '';
      const postMatch =
        titleSource.match(/for the post of ([^\(\)\.\n\-–]+?)(?:\s*(?:\(|-|–|\.|Notification\s+Date|Published|Opening|Last\s+Date|Closing|\d+\s*(?:Posts?|Vacanc)))/i) ||
        titleSource.match(/for the post of ([^\(\)\.]+)/i) ||
        titleSource.match(/Notification for ([^\(\)\.]+)/i);
      if (postMatch) {
        postName = postMatch[1].replace(/[\s\-–:,]+$/, '').trim();
      } else {
        postName = titleSource.split(/[\(\.\n]/)[0].trim().slice(0, 100);
      }

      if (!postName || postName.length < 3 || postName.toLowerCase().includes('name of the post')) {
        continue;
      }

      const department = deptIdx !== -1 && cols[deptIdx] ? cleanDepartmentText($(cols[deptIdx]).text(), defaultDept) : defaultDept;

      const vacFromCol = vacIdx !== -1 && cols[vacIdx]
        ? extractVacancyCount($(cols[vacIdx]).text(), { isDedicatedColumn: true })
        : 'Not Specified';
      const vacancies = vacFromCol !== 'Not Specified' ? vacFromCol : extractVacancyCount(rowText);

      const inlineDates = extractInlineDateFields(rowText);
      const invalidDateFields = [...inlineDates.invalidDateFields];

      let sourcePublishedAt = '';
      if (pubIdx !== -1 && cols[pubIdx]) {
        const p = extractValidatedDate($(cols[pubIdx]).text());
        if (p.valid) sourcePublishedAt = p.value;
        else if (p.invalidCalendar) invalidDateFields.push('sourcePublishedAt');
      } else if (inlineDates.sourcePublishedAt) {
        sourcePublishedAt = inlineDates.sourcePublishedAt;
      }

      let openingDate = '';
      if (openIdx !== -1 && cols[openIdx]) {
        const o = extractValidatedDate($(cols[openIdx]).text());
        if (o.valid) openingDate = o.value;
        else if (o.invalidCalendar) invalidDateFields.push('openingDate');
      } else if (inlineDates.openingDate) {
        openingDate = inlineDates.openingDate;
      }

      let closingDate = '';
      if (closeIdx !== -1 && cols[closeIdx]) {
        const c = extractValidatedDate($(cols[closeIdx]).text());
        if (c.valid) closingDate = c.value;
        else if (c.invalidCalendar) invalidDateFields.push('closingDate');
      } else if (inlineDates.closingDate) {
        closingDate = inlineDates.closingDate;
      }

      let examDate = '';
      if (examIdx !== -1 && cols[examIdx]) {
        const ex = extractExamDateFromCell($(cols[examIdx]).text(), rowText);
        if (ex.invalidCalendar) invalidDateFields.push('examDate');
        else examDate = ex.value;
      } else if (inlineDates.examDate) {
        examDate = inlineDates.examDate;
      }

      const dates = reconcileExtractedDates({
        sourcePublishedAt,
        openingDate,
        closingDate,
        examDate,
        invalidDateFields
      });

      const { detailsLink, applyLink } = classifyNotificationLinks($, row, url, 'mrb_tn', sourceConfig, options);

      const serviceTitle = notifNo ? `MRB ${notifNo}: ${postName}` : `MRB: ${postName}`;
      const dedupKey = `${notifNo.toLowerCase()}|${postName.toLowerCase()}|${detailsLink.toLowerCase()}`;
      if (seenKeys.has(dedupKey)) continue;
      seenKeys.add(dedupKey);

      items.push({
        sourceKey: 'mrb_tn',
        category: 'medical',
        organization: defaultOrg,
        department,
        service: serviceTitle,
        postName: `MRB ${postName}`,
        notificationNo: notifNo,
        openingDate: dates.openingDate,
        closingDate: dates.closingDate,
        sourcePublishedAt: dates.sourcePublishedAt,
        notificationDate: dates.notificationDate,
        examDate: dates.examDate,
        qualification: 'Refer Official Notification',
        ageLimit: 'Refer Official Notification',
        applicationFee: 'Refer Official Notification',
        vacancies,
        posts: vacancies,
        detailsLink,
        applyLink,
        source: 'Official MRB Portal (mrb.tn.gov.in)',
        sourceUrl: url,
        ...(dates.invalidDateFields.length > 0 ? { invalidDateFields: dates.invalidDateFields } : {})
      });
    }
  });

  return { success: true, source: sourceConfig.key, items: items.slice(0, 8) };
}
