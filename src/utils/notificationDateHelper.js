// ============================================================================
// AK E-SEVAI — TIMEZONE-SAFE NOTIFICATION DATE & STATUS ENGINE
// Timezone: Asia/Kolkata (IST = UTC+5:30)
// ============================================================================

/**
 * Get current date in Asia/Kolkata timezone with zero time component.
 * Guaranteed safe against UTC midnight shift and browser system timezone offset.
 *
 * @param {Date|string|number} [referenceDate=new Date()]
 * @returns {{ year: number, month: number, day: number, epochDays: number, isoDate: string, displayDate: string }}
 */
export function getKolkataToday(referenceDate = new Date()) {
  const d = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const parts = formatter.formatToParts(d);
  const year = parseInt(parts.find((p) => p.type === 'year')?.value || '2026', 10);
  const month = parseInt(parts.find((p) => p.type === 'month')?.value || '1', 10);
  const day = parseInt(parts.find((p) => p.type === 'day')?.value || '1', 10);

  const epochDays = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const displayDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;

  return { year, month, day, epochDays, isoDate, displayDate };
}

/**
 * Parses any date format string (DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, or embedded in strings)
 * into a pure calendar date component object.
 *
 * @param {string|Date|number} dateInput
 * @returns {{ year: number, month: number, day: number, epochDays: number, isoDate: string, displayDate: string, originalText: string } | null}
 */
export function parseDateToComponents(dateInput) {
  if (!dateInput) return null;
  if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    return getKolkataToday(dateInput);
  }

  const rawStr = String(dateInput).trim();
  if (!rawStr) return null;

  // 1. Try matching YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = rawStr.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    if (isValidDateComponents(year, month, day)) {
      return buildDateComponents(year, month, day, rawStr);
    }
  }

  // 2. Try matching DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = rawStr.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    if (isValidDateComponents(year, month, day)) {
      return buildDateComponents(year, month, day, rawStr);
    }
  }

  return null;
}

/**
 * Validates year, month, day numbers
 */
function isValidDateComponents(year, month, day) {
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (year < 1970 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const daysInMonth = new Date(year, month, 0).getDate();
  return day <= daysInMonth;
}

/**
 * Builds standard component object from year, month, day
 */
function buildDateComponents(year, month, day, originalText) {
  const epochDays = Math.floor(Date.UTC(year, month - 1, day) / 86400000);
  const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const displayDate = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
  return { year, month, day, epochDays, isoDate, displayDate, originalText };
}

/**
 * Formats any date input into customer-facing DD-MM-YYYY format.
 * If input is a descriptive string (e.g. "November / December 2026"), cleanly returns that string.
 *
 * @param {string|Date} dateInput
 * @param {string} [fallback='📅 தேதி அறிவிக்கப்படவில்லை']
 * @returns {string}
 */
export function formatDisplayDate(dateInput, fallback = '📅 தேதி அறிவிக்கப்படவில்லை') {
  if (!dateInput) return fallback;
  const parsed = parseDateToComponents(dateInput);
  if (parsed) return parsed.displayDate;

  const str = String(dateInput).trim();
  const lower = str.toLowerCase();
  if (!str || lower === 'announced soon' || lower === 'soon' || lower.includes('அறிவிக்கப்படவில்லை')) {
    return fallback;
  }
  return str;
}

/**
 * Calculates dynamic Application Status and countdown based on start date and end date.
 *
 * Status Codes:
 * - BEFORE_START: start > today (🟡 விண்ணப்பம் விரைவில் தொடங்கும்)
 * - OPEN: today >= start && today <= end (🟢 விண்ணப்பம் நடைபெற்று வருகிறது)
 * - APPLICATION_EXPIRED: today > end (🔴 விண்ணப்ப காலம் முடிந்தது)
 * - NOT_ANNOUNCED: missing dates
 *
 * @param {string|Date} startDateInput
 * @param {string|Date} endDateInput
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Object}
 */
export function calculateApplicationStatus(startDateInput, endDateInput, todayObj = getKolkataToday()) {
  const start = parseDateToComponents(startDateInput);
  const end = parseDateToComponents(endDateInput);

  // Both missing
  if (!start && !end) {
    return {
      code: 'NOT_ANNOUNCED',
      label: '📅 தேதி அறிவிக்கப்படவில்லை',
      shortLabel: 'தேதி இல்லை',
      countdown: 'விவரங்கள் விரைவில் அறிவிக்கப்படும்',
      badgeClass: 'status-badge-app-unannounced',
      tagColor: '#64748b',
      tagBg: '#f1f5f9',
      tagBorder: '#cbd5e1',
      isOpen: false,
      isExpired: false,
      isUpcoming: false,
      daysRemaining: null,
      daysToStart: null
    };
  }

  // 1. Check if application closed (today > end)
  if (end && todayObj.epochDays > end.epochDays) {
    const daysPassed = todayObj.epochDays - end.epochDays;
    return {
      code: 'APPLICATION_EXPIRED',
      label: '🔴 விண்ணப்ப காலம் முடிந்தது',
      shortLabel: 'முடிந்தது',
      countdown: 'விண்ணப்பிக்க கடைசி தேதி முடிந்தது',
      badgeClass: 'status-badge-app-expired',
      tagColor: '#dc2626',
      tagBg: '#fef2f2',
      tagBorder: '#fecaca',
      isOpen: false,
      isExpired: true,
      isUpcoming: false,
      daysRemaining: 0,
      daysPassed
    };
  }

  // 2. Check if application is in the future (today < start)
  if (start && todayObj.epochDays < start.epochDays) {
    const daysToStart = start.epochDays - todayObj.epochDays;
    return {
      code: 'BEFORE_START',
      label: '🟡 விண்ணப்பம் விரைவில் தொடங்கும்',
      shortLabel: 'விரைவில்',
      countdown: daysToStart === 1
        ? '⏳ நாளை விண்ணப்பம் தொடங்குகிறது'
        : `⏳ தொடங்குவதற்கு இன்னும் ${daysToStart} நாட்கள்`,
      badgeClass: 'status-badge-app-upcoming',
      tagColor: '#d97706',
      tagBg: '#fffbeb',
      tagBorder: '#fde68a',
      isOpen: false,
      isExpired: false,
      isUpcoming: true,
      daysToStart
    };
  }

  // 3. Application is currently OPEN (today >= start && today <= end)
  if (end) {
    const daysRemaining = end.epochDays - todayObj.epochDays;
    const isLastDay = daysRemaining === 0;

    return {
      code: 'OPEN',
      label: '🟢 விண்ணப்பம் நடைபெற்று வருகிறது',
      shortLabel: 'தற்போது விண்ணப்பிக்கலாம்',
      countdown: isLastDay
        ? '⚠️ இன்று கடைசி நாள் (Last Day Today)'
        : `⏳ விண்ணப்பிக்க இன்னும் ${daysRemaining} நாட்கள்`,
      badgeClass: isLastDay ? 'status-badge-app-lastday' : 'status-badge-app-open',
      tagColor: isLastDay ? '#b45309' : '#15803d',
      tagBg: isLastDay ? '#fef3c7' : '#dcfce7',
      tagBorder: isLastDay ? '#fde68a' : '#86efac',
      isOpen: true,
      isExpired: false,
      isUpcoming: false,
      isLastDay,
      daysRemaining
    };
  }

  // Start date reached and no end date specified
  return {
    code: 'OPEN',
    label: '🟢 விண்ணப்பம் நடைபெற்று வருகிறது',
    shortLabel: 'விண்ணப்பிக்கலாம்',
    countdown: 'விண்ணப்ப பதிவு நடைபெறுகிறது',
    badgeClass: 'status-badge-app-open',
    tagColor: '#15803d',
    tagBg: '#dcfce7',
    tagBorder: '#86efac',
    isOpen: true,
    isExpired: false,
    isUpcoming: false,
    daysRemaining: null
  };
}

/**
 * Calculates dynamic Exam Status and countdown.
 *
 * Status Codes:
 * - UPCOMING: examDate > today (🔵 தேர்வு நடைபெற உள்ளது)
 * - TODAY: examDate === today (🟠 இன்று தேர்வு)
 * - EXAM_COMPLETED: examDate < today (🔴 தேர்வு தேதி முடிந்தது)
 * - NOT_ANNOUNCED: missing exact date
 *
 * @param {string|Date} examDateInput
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Object}
 */
export function calculateExamStatus(examDateInput, todayObj = getKolkataToday()) {
  const parsed = parseDateToComponents(examDateInput);
  const rawStr = examDateInput ? String(examDateInput).trim() : '';
  const lowerStr = rawStr.toLowerCase();

  // Missing or text-only (e.g. "Announced Soon" / "October 2026")
  if (!parsed) {
    const isDescriptive = rawStr && !lowerStr.includes('soon') && !lowerStr.includes('அறிவிக்கப்படவில்லை');
    return {
      code: 'NOT_ANNOUNCED',
      label: isDescriptive ? `📅 தேர்வு: ${rawStr}` : '📅 தேர்வு தேதி அறிவிக்கப்படவில்லை',
      shortLabel: isDescriptive ? rawStr : 'அறிவிக்கப்படும்',
      displayDate: isDescriptive ? rawStr : 'தேதி அறிவிக்கப்படவில்லை',
      countdown: isDescriptive ? `தேர்வு: ${rawStr}` : 'தேர்வு தேதி விரைவில் அறிவிக்கப்படும்',
      badgeClass: 'status-badge-exam-unannounced',
      tagColor: '#475569',
      tagBg: '#f8fafc',
      tagBorder: '#e2e8f0',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      daysRemaining: null
    };
  }

  const daysRemaining = parsed.epochDays - todayObj.epochDays;

  // 1. Exam Date in the Future
  if (daysRemaining > 0) {
    return {
      code: 'UPCOMING',
      label: '🔵 தேர்வு நடைபெற உள்ளது',
      shortLabel: 'தேர்வு விரைவில்',
      displayDate: parsed.displayDate,
      countdown: `📝 தேர்வுக்கு இன்னும் ${daysRemaining} நாட்கள்`,
      badgeClass: 'status-badge-exam-upcoming',
      tagColor: '#0284c7',
      tagBg: '#f0f9ff',
      tagBorder: '#bae6fd',
      isUpcoming: true,
      isToday: false,
      isCompleted: false,
      daysRemaining
    };
  }

  // 2. Exam is TODAY
  if (daysRemaining === 0) {
    return {
      code: 'TODAY',
      label: '🟠 இன்று தேர்வு',
      shortLabel: 'இன்று தேர்வு',
      displayDate: parsed.displayDate,
      countdown: '🟠 இன்று தேர்வு நடைபெறுகிறது (Exam Today)',
      badgeClass: 'status-badge-exam-today',
      tagColor: '#ea580c',
      tagBg: '#fff7ed',
      tagBorder: '#ffedd5',
      isUpcoming: false,
      isToday: true,
      isCompleted: false,
      daysRemaining: 0
    };
  }

  // 3. Exam Completed in the Past
  const daysPassed = Math.abs(daysRemaining);
  return {
    code: 'EXAM_COMPLETED',
    label: '🔴 தேர்வு தேதி முடிந்தது',
    shortLabel: 'தேர்வு முடிந்தது',
    displayDate: parsed.displayDate,
    countdown: '🔴 தேர்வு முடிந்தது (Exam Completed)',
    badgeClass: 'status-badge-exam-completed',
    tagColor: '#dc2626',
    tagBg: '#fef2f2',
    tagBorder: '#fecaca',
    isUpcoming: false,
    isToday: false,
    isCompleted: true,
    daysRemaining: 0,
    daysPassed
  };
}

/**
 * Validates date ranges for Admin entry:
 * - Detects closingDate < openingDate (ERROR)
 * - Detects examDate < openingDate (WARNING)
 * - Returns structured errors, warnings, and live computed statuses
 *
 * @param {string} openingDateStr
 * @param {string} closingDateStr
 * @param {string} examDateStr
 * @returns {{ isValid: boolean, errors: string[], warnings: string[], appStatus: Object, examStatus: Object }}
 */
export function validateNotificationDateForm(openingDateStr, closingDateStr, examDateStr) {
  const errors = [];
  const warnings = [];

  const start = parseDateToComponents(openingDateStr);
  const end = parseDateToComponents(closingDateStr);
  const exam = parseDateToComponents(examDateStr);

  if (start && end && end.epochDays < start.epochDays) {
    errors.push(`❌ விண்ணப்ப கடைசி தேதி (${end.displayDate}) தொடக்க தேதிக்கு (${start.displayDate}) முன் இருக்க முடியாது.`);
  }

  if (start && exam && exam.epochDays < start.epochDays) {
    warnings.push(`⚠️ தேர்வு தேதி (${exam.displayDate}) விண்ணப்ப தொடக்க தேதிக்கு (${start.displayDate}) முன் உள்ளது. தயவுசெய்து சரிபார்க்கவும்.`);
  }

  const today = getKolkataToday();
  const appStatus = calculateApplicationStatus(openingDateStr, closingDateStr, today);
  const examStatus = calculateExamStatus(examDateStr, today);

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    appStatus,
    examStatus
  };
}

/**
 * Enriches a notification object with complete computed date statuses, formatted date strings,
 * and filter category matches.
 *
 * @param {Object} notif
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Object}
 */
export function enrichNotificationWithDateStatus(notif, todayObj = getKolkataToday()) {
  if (!notif) return null;

  const appStatus = calculateApplicationStatus(notif.openingDate || notif.applicationStartDate, notif.closingDate || notif.applicationEndDate, todayObj);
  const examStatus = calculateExamStatus(notif.examDate, todayObj);

  const formattedOpeningDate = formatDisplayDate(notif.openingDate || notif.applicationStartDate);
  const formattedClosingDate = formatDisplayDate(notif.closingDate || notif.applicationEndDate);
  const formattedExamDate = formatDisplayDate(notif.examDate);
  const formattedNotificationDate = formatDisplayDate(notif.notificationDate || notif.openingDate);

  return {
    ...notif,
    appStatus,
    examStatus,
    formattedOpeningDate,
    formattedClosingDate,
    formattedExamDate,
    formattedNotificationDate,
    // Classification flags
    isActiveApplication: appStatus.isOpen,
    isUpcomingExam: examStatus.isUpcoming || examStatus.isToday,
    isApplicationClosed: appStatus.isExpired,
    isExamCompleted: examStatus.isCompleted
  };
}
