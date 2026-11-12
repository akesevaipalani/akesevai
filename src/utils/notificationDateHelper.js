// ============================================================================
// AK E-SEVAI — TIMEZONE-SAFE NOTIFICATION DATE & STATUS ENGINE
// Timezone: Asia/Kolkata (IST = UTC+5:30)
// ============================================================================

export const NOTIFICATION_UI_LABELS = {
  ta: {
    govNotificationBadge: 'அரசு அறிவிப்பு',
    pageTitle: '📢 அனைத்து அரசு & போட்டித் தேர்வு நேரலை அறிவிப்புகள்',
    liveFeedBadge: 'நேரடி நேரலை Feed (Live)',
    pageSubtitle: 'UPSC, SSC, வங்கி, ரயில்வே, TNPSC, காவல்துறை, ஆசிரியர் பணி, மருத்துவம் மற்றும் நுழைவுத் தேர்வுகள் — தேதி & தேர்வு நிலை தானாகப் புதுப்பிக்கப்படுகிறது.',
    syncing: 'புதுப்பிக்கிறது...',
    syncMaster: '🔄 மாஸ்டர் பட்டியலைப் புதுப்பி (Sync Master)',
    refreshFeed: '🔄 அறிவிப்புகளைப் புதுப்பி (Refresh Feed)',
    runIngestion: '⚡ அரசு தளங்களில் தேடு (Run Ingestion)',
    pendingApprovals: '📥 புதிய அறிவிப்புகள் ஒப்புதல்',
    quarantineBtn: 'Quarantine',
    sourceHealthBtn: 'Source Health',
    addNotificationBtn: '➕ புதிய அறிவிப்பு சேர்க்க (Add)',
    syncSuccessAdmin: (count) => `✅ ${count || 'அனைத்து'} அரசு & போட்டித் தேர்வு அறிவிப்புகள் MongoDB Atlas-ல் வெற்றிகரமாக புதுப்பிக்கப்பட்டன!`,
    syncSuccessPublic: '✅ நேரலை அரசு & தேர்வு அறிவிப்புகள் புதுப்பிக்கப்பட்டன!',
    syncError: '⚠️ புதுப்பித்தலில் பிழை ஏற்பட்டது.',
    deleteConfirm: 'இந்த அறிவிப்பை நீக்க வேண்டுமா? (Delete this notification?)',
    searchPlaceholder: '🔍 தேர்வுப் பெயர், அமைப்பு (UPSC, TNPSC, SSC, SBI, RRB...), பதவி, தகுதி தேடவும்...',
    resultsCountSuffix: 'Results',
    hideFinished: '🚫 தேர்வு முடிந்தவற்றை மட்டும் மறை (Hide Finished)',
    filterHeading: 'வடிகட்டிகள் (Filter):',
    filterAll: '📋 அனைத்து அறிவிப்புகள் (All)',
    filterActiveApp: '🔥 விண்ணப்பம் நடைபெறுகிறது (Active Applications)',
    filterUpcomingExam: '📚 தேர்வு நடைபெற உள்ளது (Upcoming Exams)',
    filterAppClosed: '🔴 விண்ணப்ப காலம் முடிந்தது (Application Closed)',
    filterExamCompleted: '🔴 தேர்வு முடிந்தது (Exam Completed)',
    filterUpdates: '📢 முடிவுகள் / நுழைவுச் சீட்டு (Results & Updates)',
    emptyTitle: 'அறிவிப்புகள் எதுவும் கிடைக்கவில்லை / No Notifications Found',
    emptySubtitle: 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டியில் அறிவிப்புகள் இல்லை. புதிய அறிவிப்புகளைப் பெற கீழே உள்ள பொத்தானை அழுத்தவும்.',
    syncAllAction: '🔄 அனைத்துத் தேர்வுகளையும் உடனே புதுப்பிக்க (Sync Master Feed)',
    refreshAction: '🔄 அறிவிப்புகளைப் புதுப்பிக்க (Refresh Feed)',
    publishedPrefix: 'அறிவிப்பு:',
    qualificationLabel: '🎓 கல்வித் தகுதி:',
    ageLimitLabel: '⏳ வயது வரம்பு:',
    feeLabel: '💳 கட்டணம்:',
    openingDateLabel: 'விண்ணப்ப தொடக்கம்:',
    closingDateLabel: 'கடைசி தேதி (Last Date):',
    extendedClosingDateLabel: 'நீட்டிக்கப்பட்ட கடைசி தேதி:',
    originalClosingDateLabel: 'அசல் கடைசி தேதி:',
    examDateLabel: 'தேர்வு தேதி (Exam Date):',
    cardClosingPrefix: '⏰ கடைசி தேதி:',
    cardExamPrefix: '📝 தேர்வு தேதி:',
    cardResultPrefix: '📊 முடிவு:',
    viewResultLink: 'முடிவு பார்க்க ↗',
    adminReviewPausedNote: 'அதிகாரப்பூர்வ அறிவிப்பு உறுதி செய்யப்படும் வரை Apply பொத்தான் இடைநிறுத்தப்பட்டுள்ளது.',
    pdfDetailsBtn: 'PDF விவரம்',
    applyNowBtn: 'விண்ணப்பிக்க',
    applyNowCardLink: 'விண்ணப்பிக்க / அதிகாரப்பூர்வ இணைப்பு',
    applyPendingReviewBtn: 'Admin சரிபார்ப்பு நிலுவையில்',
    applyClosedBtn: 'விண்ணப்பம் முடிந்தது',
    applyNotStartedBtn: 'விண்ணப்பம் தொடங்கவில்லை',
    applyDateUnverifiedBtn: 'தேதி சரிபார்க்கப்படவில்லை',
    cardClosedRefLink: 'விண்ணப்பம் முடிந்தது (அதிகாரப்பூர்வ குறிப்பு)',
    cardReviewRefLink: 'விவரம் பார்க்க (Admin சரிபார்ப்பு தேவை)',
    cardOfficialRefLink: 'அதிகாரப்பூர்வ இணைப்பு',
    referenceFooterLabel: 'அதிகாரப்பூர்வ தளம் (குறிப்பு மட்டும்):',
    referenceFooterAction: 'தளம் பார்க்க (Reference) ↗',
    modalTitle: '➕ புதிய தேர்வு / வேலைவாய்ப்பு அறிவிப்பு சேர்க்க (Add Notification)',
    modalLivePreview: '🔍 நேரலை நிலை முன்னோட்டம் (Live Status Preview):',
    modalAppPrefix: 'விண்ணப்பம்:',
    modalExamPrefix: 'தேர்வு:',
    modalCategory: 'பிரிவு (Category):',
    modalOrg: 'நிறுவனம் / அமைப்பு (Organization):',
    modalTitleField: 'அறிவிப்பு தலைப்பு (Exam / Recruitment Title):',
    modalPostName: 'பதவிப் பெயர் (Post Name):',
    modalPosts: 'காலிப்பணியிடங்கள் (Posts):',
    modalQualification: 'கல்வித் தகுதி (Qualification):',
    modalAgeLimit: 'வயது வரம்பு (Age Limit):',
    modalOpeningDate: 'தொடங்கும் தேதி (DD-MM-YYYY):',
    modalClosingDate: 'கடைசி தேதி (DD-MM-YYYY):',
    modalExamDate: 'தேர்வு தேதி (Exam Date / DD-MM-YYYY):',
    modalFee: 'விண்ணப்பக் கட்டணம் (Fee):',
    modalDetails: 'முக்கிய விவரங்கள் (Important Details):',
    modalPdfUrl: 'PDF / அறிவிப்பு URL:',
    modalApplyUrl: 'விண்ணப்பிக்கும் URL:',
    modalSaveBtn: '💾 அறிவிப்பை MongoDB Atlas-ல் சேமிக்கவும் (Save Notification)',
    pendingQueueTitle: '📥 அரசு தளங்களில் கண்டறியப்பட்ட புதிய அறிவிப்புகள் (Pending Ingestion Review Queue)',
    pendingQueueCount: 'நிலுவை',
    pendingQueueDesc: 'இவை TNPSC, IBPS, SSC, UPSC, Railway, Defence போன்ற அதிகாரப்பூர்வ தளங்களிலிருந்து தானாக எடுக்கப்பட்டவை. நீங்கள் ஒப்புதல் (Approve) அளித்த பிறகே பொதுத் தளத்தில் நேரலையாகும்.',
    pendingQueueEmpty: '🟢 தற்போது ஒப்புதலுக்காக புதிய அறிவிப்புகள் நிலுவையில் இல்லை. (No pending notifications). மேலே உள்ள "அரசு தளங்களில் தேடு" பட்டனை அழுத்திப் புதிய அறிவிப்புகளை ஸ்கேன் செய்யலாம்.',
    approveBtn: 'ஒப்புதல் அளி (Approve)',
    rejectBtn: 'நிராகரி',
    quarantineQueueTitle: '🛡️ தனிமைப்படுத்தப்பட்ட சந்தேக/முழுமையற்ற அறிவிப்புகள் (Quarantined Queue:',
    quarantineQueueEmpty: 'தனிமைப்படுத்தப்பட்ட அறிவிப்புகள் ஏதுமில்லை.',
    approveOverrideBtn: 'Approve Override',
    rejectOverrideBtn: 'Reject',
    categories: {
      all: 'அனைத்து தேர்வுகள் (All)',
      banking: 'வங்கி & நிதி (Banking)',
      upsc: 'மத்திய அரசு (UPSC / Central)',
      ssc: 'பணியாளர் தேர்வாணையம் (SSC)',
      railway: 'ரயில்வே (Railway / RRB)',
      tnpsc: 'தமிழ்நாடு அரசு (TNPSC / State)',
      police_defence: 'காவல்துறை / ராணுவம் (Police & Defence)',
      teaching: 'ஆசிரியர் பணி (Teaching & TET)',
      medical: 'மருத்துவம் & நர்சிங் (Medical & Health)',
      entrance: 'நுழைவுத் தேர்வுகள் (Entrance Exams)',
      psu: 'பொதுத்துறை & தொழில்முறை (PSU & Technical)',
      other: 'பிற தேர்வுகள் (Other Govt Jobs)'
    }
  },
  en: {
    govNotificationBadge: 'Govt Notification',
    pageTitle: '📢 All Government & Competitive Exam Live Notifications',
    liveFeedBadge: 'Live Feed',
    pageSubtitle: 'UPSC, SSC, Banking, Railway, TNPSC, Police, Teaching, Medical & Entrance Exams — dates and exam status updated automatically.',
    syncing: 'Refreshing...',
    syncMaster: '🔄 Sync Master Feed',
    refreshFeed: '🔄 Refresh Feed',
    runIngestion: '⚡ Run Official Ingestion',
    pendingApprovals: '📥 Pending Approvals',
    quarantineBtn: 'Quarantine',
    sourceHealthBtn: 'Source Health',
    addNotificationBtn: '➕ Add Notification',
    syncSuccessAdmin: (count) => `✅ ${count || 'All'} government & competitive exam notifications synced to MongoDB Atlas!`,
    syncSuccessPublic: '✅ Live government & exam notifications refreshed!',
    syncError: '⚠️ Error refreshing notifications.',
    deleteConfirm: 'Are you sure you want to delete this notification?',
    searchPlaceholder: '🔍 Search exam title, agency (UPSC, TNPSC, SSC, SBI, RRB...), post, qualification...',
    resultsCountSuffix: 'Results',
    hideFinished: '🚫 Hide Finished Exams',
    filterHeading: 'Filter:',
    filterAll: '📋 All Notifications',
    filterActiveApp: '🔥 Active Applications',
    filterUpcomingExam: '📚 Upcoming Exams',
    filterAppClosed: '🔴 Application Closed',
    filterExamCompleted: '🔴 Exam Completed',
    filterUpdates: '📢 Results & Updates',
    emptyTitle: 'No Notifications Found',
    emptySubtitle: 'No notifications match the selected filter. Click the button below to refresh the live feed.',
    syncAllAction: '🔄 Sync Master Feed Now',
    refreshAction: '🔄 Refresh Notifications',
    publishedPrefix: 'Published:',
    qualificationLabel: '🎓 Qualification:',
    ageLimitLabel: '⏳ Age Limit:',
    feeLabel: '💳 Application Fee:',
    openingDateLabel: 'Application Opens:',
    closingDateLabel: 'Closing Date:',
    extendedClosingDateLabel: 'Extended Closing Date:',
    originalClosingDateLabel: 'Original Closing Date:',
    examDateLabel: 'Exam Date:',
    cardClosingPrefix: '⏰ Closing Date:',
    cardExamPrefix: '📝 Exam Date:',
    cardResultPrefix: '📊 Result:',
    viewResultLink: 'View Result ↗',
    adminReviewPausedNote: 'Apply button paused until official notification dates are verified (Admin Review Required).',
    pdfDetailsBtn: 'Official Notice',
    applyNowBtn: 'Apply Now',
    applyNowCardLink: 'Apply Now / Official Link',
    applyPendingReviewBtn: 'Application Verification Pending',
    applyClosedBtn: 'Application Closed',
    applyNotStartedBtn: 'Application Not Started',
    applyDateUnverifiedBtn: 'Date Not Verified',
    cardClosedRefLink: 'Application Closed (Official Reference)',
    cardReviewRefLink: 'View Details (Admin Review Required)',
    cardOfficialRefLink: 'Official Reference',
    referenceFooterLabel: 'Official Portal (Reference Only):',
    referenceFooterAction: 'Official Reference ↗',
    modalTitle: '➕ Add Government Exam / Recruitment Notification',
    modalLivePreview: '🔍 Live Status Preview:',
    modalAppPrefix: 'Application:',
    modalExamPrefix: 'Exam:',
    modalCategory: 'Category:',
    modalOrg: 'Organization / Agency:',
    modalTitleField: 'Exam / Recruitment Title:',
    modalPostName: 'Post Name:',
    modalPosts: 'Vacancies / Posts:',
    modalQualification: 'Qualification:',
    modalAgeLimit: 'Age Limit:',
    modalOpeningDate: 'Opening Date (DD-MM-YYYY):',
    modalClosingDate: 'Closing Date (DD-MM-YYYY):',
    modalExamDate: 'Exam Date (DD-MM-YYYY or Schedule):',
    modalFee: 'Application Fee:',
    modalDetails: 'Important Details:',
    modalPdfUrl: 'Official Notice / PDF URL:',
    modalApplyUrl: 'Apply URL:',
    modalSaveBtn: '💾 Save Notification',
    pendingQueueTitle: '📥 Pending Ingestion Review Queue',
    pendingQueueCount: 'Pending',
    pendingQueueDesc: 'Detected from official sources (TNPSC, IBPS, SSC, UPSC, Railway, Defence). Live publication requires Admin approval.',
    pendingQueueEmpty: '🟢 No pending notifications awaiting approval. Use "Run Official Ingestion" above to scan official sources.',
    approveBtn: 'Approve',
    rejectBtn: 'Reject',
    quarantineQueueTitle: '🛡️ Quarantined / Incomplete Notifications (Count:',
    quarantineQueueEmpty: 'No quarantined notifications.',
    approveOverrideBtn: 'Approve Override',
    rejectOverrideBtn: 'Reject',
    categories: {
      all: 'All Exams',
      banking: 'Banking & Finance',
      upsc: 'Central Govt (UPSC)',
      ssc: 'Staff Selection (SSC)',
      railway: 'Railway / RRB',
      tnpsc: 'State PSC (TNPSC)',
      police_defence: 'Police & Defence',
      teaching: 'Teaching & TET',
      medical: 'Medical & Nursing',
      entrance: 'Entrance Exams',
      psu: 'PSU & Technical',
      other: 'Other Govt Jobs'
    }
  }
};

export function normalizeLanguage(lang) {
  const normalized = String(lang || '').trim().toLowerCase();
  if (
    normalized === 'en' ||
    normalized.startsWith('en-') ||
    normalized.startsWith('en_') ||
    normalized === 'english'
  ) {
    return 'en';
  }
  return 'ta';
}

export function getNotificationUiLabels(lang = 'ta') {
  return NOTIFICATION_UI_LABELS[normalizeLanguage(lang)];
}

const MONTH_NAME_MAP = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

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
 * Converts a Date or ISO-8601 instant into an Asia/Kolkata YYYY-MM-DD calendar date.
 * Never shifts calendar days via UTC .toISOString().split('T')[0].
 *
 * @param {Date|string|number} instantInput
 * @returns {string}
 */
export function toKolkataIsoDate(instantInput) {
  if (!instantInput) return '';
  const d = instantInput instanceof Date ? instantInput : new Date(instantInput);
  if (isNaN(d.getTime())) return '';
  return getKolkataToday(d).isoDate;
}

/**
 * Parses date-only strings (7 approved formats) and ISO timestamps into strict
 * Asia/Kolkata calendar components without UTC/local-timezone day shifts.
 *
 * Supported date-only formats:
 * - YYYY-MM-DD, YYYY/MM/DD
 * - DD-MM-YYYY, DD/MM/YYYY, DD.MM.YYYY
 * - DD Mon YYYY (e.g. "23 Oct 2026", "23 October 2026")
 * - Mon DD, YYYY / Mon DD YYYY (e.g. "Oct 23, 2026")
 *
 * Also supports ISO-8601 timestamps containing time + explicit offset (e.g. Z, +05:30),
 * projecting them into Asia/Kolkata calendar dates.
 *
 * @param {string|Date|number} dateInput
 * @returns {{ valid: boolean, kind: 'calendar'|'timestamp'|'empty'|'descriptive'|'invalid_calendar', components: Object|null, instantMs: number|null, reason?: string }}
 */
export function parseDateDetailed(dateInput) {
  if (dateInput === null || dateInput === undefined) {
    return { valid: false, kind: 'empty', components: null, instantMs: null, reason: 'EMPTY_DATE' };
  }

  if (dateInput instanceof Date) {
    if (isNaN(dateInput.getTime())) {
      return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_DATE_OBJECT' };
    }
    const comp = getKolkataToday(dateInput);
    return { valid: true, kind: 'timestamp', components: { ...comp, originalText: dateInput.toISOString() }, instantMs: dateInput.getTime() };
  }

  const rawStr = String(dateInput).trim();
  if (!rawStr) {
    return { valid: false, kind: 'empty', components: null, instantMs: null, reason: 'EMPTY_DATE' };
  }

  // 0. Timestamp with time + timezone offset (must project into Asia/Kolkata, never strip prefix!)
  const hasIsoTimeWithTz = /\d{4}[-/]\d{1,2}[-/]\d{1,2}[T\s]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})$/i.test(rawStr);
  if (hasIsoTimeWithTz) {
    // Normalize space separator to T and YYYY/MM/DD to YYYY-MM-DD for reliable Date parsing
    const normalizedIso = rawStr.replace(/^(\d{4})\/(\d{1,2})\/(\d{1,2})\s+/, (_, y, m, d) => `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}T`);
    const instant = new Date(normalizedIso);
    if (!isNaN(instant.getTime())) {
      // Also guard against rolled-over calendar inputs like 2026-02-30T10:00:00Z
      const datePartMatch = rawStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
      if (datePartMatch) {
        const y = parseInt(datePartMatch[1], 10);
        const m = parseInt(datePartMatch[2], 10);
        const d = parseInt(datePartMatch[3], 10);
        if (!isValidDateComponents(y, m, d)) {
          return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
        }
      }
      const comp = getKolkataToday(instant);
      return { valid: true, kind: 'timestamp', components: { ...comp, originalText: rawStr }, instantMs: instant.getTime() };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_TIMESTAMP' };
  }

  // Strip optional local/naive time suffix without timezone (e.g. "2026-11-11T10:00:00")
  const naiveTimeMatch = rawStr.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})[T\s]\d{2}:\d{2}(?::\d{2})?$/);
  if (naiveTimeMatch) {
    const year = parseInt(naiveTimeMatch[1], 10);
    const month = parseInt(naiveTimeMatch[2], 10);
    const day = parseInt(naiveTimeMatch[3], 10);
    if (isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 1. YYYY-MM-DD or YYYY/MM/DD (strict date-only token)
  const isoMatch = rawStr.match(/^(\d{4})([-/])(\d{1,2})\2(\d{1,2})$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[3], 10);
    const day = parseInt(isoMatch[4], 10);
    if (isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 2. DD-MM-YYYY, DD/MM/YYYY, or DD.MM.YYYY (strict date-only token)
  const dmyMatch = rawStr.match(/^(\d{1,2})([-/.])(\d{1,2})\2(\d{4})$/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[3], 10);
    const year = parseInt(dmyMatch[4], 10);
    if (isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 3. DD Mon YYYY (e.g. "23 Oct 2026", "09 November 2026")
  const dMonYMatch = rawStr.match(/^(\d{1,2})\s+([A-Za-z]{3,9}),?\s+(\d{4})$/);
  if (dMonYMatch) {
    const day = parseInt(dMonYMatch[1], 10);
    const month = MONTH_NAME_MAP[dMonYMatch[2].toLowerCase()];
    const year = parseInt(dMonYMatch[3], 10);
    if (month && isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 4. Mon DD, YYYY / Mon DD YYYY (e.g. "Oct 23, 2026")
  const monDYMatch = rawStr.match(/^([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})$/);
  if (monDYMatch) {
    const month = MONTH_NAME_MAP[monDYMatch[1].toLowerCase()];
    const day = parseInt(monDYMatch[2], 10);
    const year = parseInt(monDYMatch[3], 10);
    if (month && isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 5. Fallback extraction inside descriptive strings like "25/11/2026 (Prelims) & 19/02/2027 (Mains)"
  const embeddedIso = rawStr.match(/(?<!\d)(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?!\d)/);
  if (embeddedIso) {
    const year = parseInt(embeddedIso[1], 10);
    const month = parseInt(embeddedIso[2], 10);
    const day = parseInt(embeddedIso[3], 10);
    if (isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  const embeddedDmy = rawStr.match(/(?<!\d)(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?!\d)/);
  if (embeddedDmy) {
    const day = parseInt(embeddedDmy[1], 10);
    const month = parseInt(embeddedDmy[2], 10);
    const year = parseInt(embeddedDmy[3], 10);
    if (isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // Distinguish genuine descriptive placeholders (e.g. "January 2027", "Announced Soon") from malformed dates
  if (isKnownDescriptiveDateText(rawStr)) {
    return { valid: false, kind: 'descriptive', components: null, instantMs: null, reason: 'UNPARSED_DESCRIPTIVE_DATE' };
  }

  return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'UNRECOGNIZED_INVALID_DATE' };
}

function isKnownDescriptiveDateText(rawStr) {
  const lower = String(rawStr || '').trim().toLowerCase();
  if (!lower) return true;
  if (/(soon|tba|tbd|announce|shortly|later|ongoing|open|quarter|half|அறிவி|விரைவில்)/i.test(lower)) {
    return true;
  }
  const monthNames = Object.keys(MONTH_NAME_MAP).join('|');
  const monthYearRegex = new RegExp(`\\b(${monthNames})\\b[\\s,/&-]+\\d{4}|\\b(${monthNames})\\b.*\\b(${monthNames})\\b`, 'i');
  return monthYearRegex.test(lower);
}

/**
 * Extracts all calendar dates in order from a date string or range
 * (e.g. "10/11/2026 to 25/11/2026" or "15/11/2026 & 16/11/2026").
 * Flags any embedded invalid calendar tokens cleanly.
 */
export function parseAllDatesDetailed(dateInput) {
  if (dateInput === null || dateInput === undefined) {
    return {
      validDates: [],
      startDate: null,
      endDate: null,
      isRange: false,
      isContinuousRange: false,
      hasSharedMonthGroup: false,
      hasInvalidCalendarDate: false,
      kind: 'empty'
    };
  }

  if (dateInput instanceof Date || typeof dateInput === 'number') {
    const single = parseDateDetailed(dateInput);
    const validDates = single.valid && single.components ? [single.components] : [];
    return {
      validDates,
      startDate: validDates[0] || null,
      endDate: validDates[validDates.length - 1] || null,
      isRange: false,
      isContinuousRange: false,
      hasSharedMonthGroup: false,
      hasInvalidCalendarDate: single.kind === 'invalid_calendar',
      kind: single.kind
    };
  }

  const rawStr = String(dateInput).trim();
  if (!rawStr) {
    return {
      validDates: [],
      startDate: null,
      endDate: null,
      isRange: false,
      isContinuousRange: false,
      hasSharedMonthGroup: false,
      hasInvalidCalendarDate: false,
      kind: 'empty'
    };
  }

  // Single timestamp/date shortcut when ISO time with timezone is present
  if (/\d{4}[-/]\d{1,2}[-/]\d{1,2}[T\s]\d{2}:\d{2}/i.test(rawStr)) {
    const single = parseDateDetailed(rawStr);
    const validDates = single.valid && single.components ? [single.components] : [];
    return {
      validDates,
      startDate: validDates[0] || null,
      endDate: validDates[validDates.length - 1] || null,
      isRange: false,
      isContinuousRange: false,
      hasSharedMonthGroup: false,
      hasInvalidCalendarDate: single.kind === 'invalid_calendar',
      kind: single.kind
    };
  }

  const monthKeys = Object.keys(MONTH_NAME_MAP).join('|');
  const validDates = [];
  const matchedSpans = [];
  let hasInvalidCalendarDate = false;
  let hasSharedMonthGroup = false;

  const overlapsExistingSpan = (startIdx, endIdx) =>
    matchedSpans.some(([s, e]) => startIdx < e && endIdx > s);

  // 1A. Shared Month/Year Day List: e.g. "07, 08, 14 & 15 February 2027", "07, 08 and 14 February 2027", "07/08/14/15 February 2027"
  const sharedDayMonthPattern = new RegExp(
    `(?<![\\d/.-])((?:\\d{1,2}(?:st|nd|rd|th)?\\s*(?:,|&|\\band\\b|\\/)\\s*)+\\d{1,2}(?:st|nd|rd|th)?)\\s+(${monthKeys}),?\\s+(\\d{4})(?!\\d)`,
    'gi'
  );
  let sharedMatch;
  while ((sharedMatch = sharedDayMonthPattern.exec(rawStr)) !== null) {
    const spanStart = sharedMatch.index;
    const spanEnd = spanStart + sharedMatch[0].length;
    matchedSpans.push([spanStart, spanEnd]);

    const daysPart = sharedMatch[1];
    const monthNum = MONTH_NAME_MAP[sharedMatch[2].toLowerCase()];
    const yearNum = parseInt(sharedMatch[3], 10);
    const dayTokens = daysPart.split(/\s*(?:,|&|\band\b|\/)\s*/i).filter(Boolean);
    const dayNumbers = dayTokens.map((t) => parseInt(t.replace(/(?:st|nd|rd|th)$/i, ''), 10));

    // Reject slash-separated shared-month prefixes if ambiguous (e.g. "07/08 February 2027" without comma/&/and or 3+ days or day > 12)
    const isSlashOnly = daysPart.includes('/') && !/[,&]|\band\b/i.test(daysPart);
    if (isSlashOnly && dayNumbers.length < 3 && !dayNumbers.some((d) => d > 12)) {
      hasInvalidCalendarDate = true;
      continue;
    }

    hasSharedMonthGroup = true;
    for (const dayNum of dayNumbers) {
      if (monthNum && isValidDateComponents(yearNum, monthNum, dayNum)) {
        validDates.push(buildDateComponents(yearNum, monthNum, dayNum, sharedMatch[0]));
      } else {
        hasInvalidCalendarDate = true;
      }
    }
  }

  // 1B. Shared Month-first Day List: e.g. "February 07, 08, 14 & 15, 2027"
  const sharedMonthDayPattern = new RegExp(
    `(?<![A-Za-z])(${monthKeys})\\s+((?:\\d{1,2}(?:st|nd|rd|th)?\\s*(?:,|&|\\band\\b)\\s*)+\\d{1,2}(?:st|nd|rd|th)?),?\\s+(\\d{4})(?!\\d)`,
    'gi'
  );
  while ((sharedMatch = sharedMonthDayPattern.exec(rawStr)) !== null) {
    const spanStart = sharedMatch.index;
    const spanEnd = spanStart + sharedMatch[0].length;
    if (overlapsExistingSpan(spanStart, spanEnd)) continue;
    matchedSpans.push([spanStart, spanEnd]);
    hasSharedMonthGroup = true;

    const monthNum = MONTH_NAME_MAP[sharedMatch[1].toLowerCase()];
    const daysPart = sharedMatch[2];
    const yearNum = parseInt(sharedMatch[3], 10);
    const dayTokens = daysPart.split(/\s*(?:,|&|\band\b)\s*/i).filter(Boolean);

    for (const tok of dayTokens) {
      const dayNum = parseInt(tok.replace(/(?:st|nd|rd|th)$/i, ''), 10);
      if (monthNum && isValidDateComponents(yearNum, monthNum, dayNum)) {
        validDates.push(buildDateComponents(yearNum, monthNum, dayNum, sharedMatch[0]));
      } else {
        hasInvalidCalendarDate = true;
      }
    }
  }

  // 2. Explicit full calendar date tokens (skip spans already parsed by shared month/year groups)
  const tokenPattern = new RegExp(
    `(?<![\\d/.-])(\\d{4}[-/]\\d{1,2}[-/]\\d{1,2})(?![\\d/.-])|(?<![\\d/.-])(\\d{1,2}[-/.]\\d{1,2}[-/.]\\d{4})(?![\\d/.-])|(\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${monthKeys}),?\\s+\\d{4})|((?:${monthKeys})\\s+\\d{1,2}(?:st|nd|rd|th)?,?\\s+\\d{4})`,
    'gi'
  );

  let match;
  while ((match = tokenPattern.exec(rawStr)) !== null) {
    const spanStart = match.index;
    const spanEnd = spanStart + match[0].length;
    if (overlapsExistingSpan(spanStart, spanEnd)) continue;

    const normalizedTok = match[0].replace(/(\d{1,2})(?:st|nd|rd|th)\b/gi, '$1');
    const res = parseDateDetailed(normalizedTok);
    if (res.valid && res.components) {
      validDates.push({ ...res.components, originalText: match[0] });
    } else if (res.kind === 'invalid_calendar') {
      hasInvalidCalendarDate = true;
    }
  }

  if (validDates.length === 0) {
    if (hasInvalidCalendarDate) {
      return {
        validDates: [],
        startDate: null,
        endDate: null,
        isRange: false,
        isContinuousRange: false,
        hasSharedMonthGroup,
        hasInvalidCalendarDate: true,
        kind: 'invalid_calendar'
      };
    }
    const single = parseDateDetailed(rawStr);
    return {
      validDates: single.valid && single.components ? [single.components] : [],
      startDate: single.components || null,
      endDate: single.components || null,
      isRange: false,
      isContinuousRange: false,
      hasSharedMonthGroup,
      hasInvalidCalendarDate: single.kind === 'invalid_calendar',
      kind: single.kind
    };
  }

  // Sort chronologically and deduplicate identical calendar days
  const sortedByEpoch = [...validDates].sort((a, b) => a.epochDays - b.epochDays);
  const uniqueDates = [];
  const seenEpochDays = new Set();
  for (const item of sortedByEpoch) {
    if (!seenEpochDays.has(item.epochDays)) {
      seenEpochDays.add(item.epochDays);
      uniqueDates.push(item);
    }
  }

  const startDate = uniqueDates[0];
  const endDate = uniqueDates[uniqueDates.length - 1];
  const isRange = startDate.epochDays !== endDate.epochDays;

  const hasRangeConnector = (
    /\b(to|till|thru|through|until)\b/i.test(rawStr) ||
    /(?:\d{4}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4})\s*[-–—]\s*\d{1,2}/i.test(rawStr) ||
    new RegExp(`\\d{1,2}\\s+(?:${monthKeys}),?\\s+\\d{4}\\s*[-–—]\\s*\\d{1,2}`, 'i').test(rawStr)
  );
  const isContinuousRange = Boolean(isRange && hasRangeConnector);

  return {
    validDates: uniqueDates,
    startDate,
    endDate,
    isRange,
    isContinuousRange,
    hasSharedMonthGroup,
    hasInvalidCalendarDate,
    kind: hasInvalidCalendarDate ? 'invalid_calendar' : 'calendar'
  };
}

/**
 * Parses any supported date format string into a pure calendar date component object.
 *
 * @param {string|Date|number} dateInput
 * @returns {{ year: number, month: number, day: number, epochDays: number, isoDate: string, displayDate: string, originalText: string } | null}
 */
export function parseDateToComponents(dateInput) {
  const res = parseDateDetailed(dateInput);
  return res.valid ? res.components : null;
}

/**
 * Validates Gregorian year, month, day numbers using UTC calendar round-trip check
 * (prevents non-existent dates like Feb 30 or Apr 31 and avoids local timezone shifts).
 */
function isValidDateComponents(year, month, day) {
  if (isNaN(year) || isNaN(month) || isNaN(day)) return false;
  if (year < 1970 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;

  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && (d.getUTCMonth() + 1) === month && d.getUTCDate() === day;
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

function isSafeHttpUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch (e) {
    return false;
  }
}

/**
 * Formats any date input (single date or range) into customer-facing DD-MM-YYYY format.
 * Preserves date ranges (e.g. "10/11/2026 to 25/11/2026" -> "10-11-2026 to 25-11-2026")
 * and descriptive text (e.g. "November / December 2026").
 *
 * @param {string|Date} dateInput
 * @param {string} [fallback='📅 தேதி அறிவிக்கப்படவில்லை']
 * @returns {string}
 */
export function formatDisplayDate(dateInput, fallbackOrOptions) {
  const isOptsObj = fallbackOrOptions && typeof fallbackOrOptions === 'object';
  const lang = normalizeLanguage(isOptsObj ? fallbackOrOptions.lang : 'ta');
  const defaultFallback = lang === 'en' ? '📅 Date Not Announced' : '📅 தேதி அறிவிக்கப்படவில்லை';
  const fallback = isOptsObj
    ? (fallbackOrOptions.fallback || defaultFallback)
    : (fallbackOrOptions || defaultFallback);

  if (!dateInput) return fallback;

  if (dateInput instanceof Date || typeof dateInput === 'number') {
    const parsed = parseDateToComponents(dateInput);
    return parsed ? parsed.displayDate : fallback;
  }

  const str = String(dateInput).trim();
  const lower = str.toLowerCase();
  if (!str || lower === 'announced soon' || lower === 'soon' || lower.includes('அறிவிக்கப்படவில்லை')) {
    return fallback;
  }

  const allDates = parseAllDatesDetailed(str);
  if (allDates.hasInvalidCalendarDate || allDates.kind === 'invalid_calendar') {
    return `⚠️ ${str} (Invalid Date)`;
  }

  if (allDates.validDates.length === 1 && allDates.validDates[0].originalText === str) {
    return allDates.validDates[0].displayDate;
  }

  // Preserve shared-month human schedule strings cleanly without partial tail replacement
  if (allDates.hasSharedMonthGroup) {
    return str;
  }

  if (allDates.validDates.length >= 1) {
    const monthKeys = Object.keys(MONTH_NAME_MAP).join('|');
    const tokenPattern = new RegExp(
      `(?<![\\d/.-])(\\d{4}[-/]\\d{1,2}[-/]\\d{1,2})(?![\\d/.-])|(?<![\\d/.-])(\\d{1,2}[-/.]\\d{1,2}[-/.]\\d{4})(?![\\d/.-])|(\\d{1,2}\\s+(?:${monthKeys}),?\\s+\\d{4})|((?:${monthKeys})\\s+\\d{1,2},?\\s+\\d{4})`,
      'gi'
    );
    return str.replace(tokenPattern, (tok) => {
      const comp = parseDateToComponents(tok);
      return comp ? comp.displayDate : tok;
    });
  }

  return str;
}

/**
 * Resolves verified extended closing date if present while preserving original deadline.
 */
function resolveEffectiveClosingDate(endDateInput, options = {}) {
  const origDetail = parseDateDetailed(endDateInput);
  const origComp = origDetail.valid ? origDetail.components : null;

  const extInput = options.extendedClosingDate || options.extendedLastDate || options.revisedClosingDate || '';
  if (!extInput || String(extInput).trim() === '') {
    return {
      origDetail,
      origComp,
      effectiveDetail: origDetail,
      effectiveComp: origComp,
      hasExtendedDeadline: false,
      hasUnverifiedExtension: false,
      extendedClosingDate: ''
    };
  }

  const extDetail = parseDateDetailed(extInput);
  const extComp = extDetail.valid ? extDetail.components : null;
  const extensionVerified = (
    options.isExtensionVerified !== false &&
    options.extensionVerified !== false &&
    options.corrigendumVerified !== false
  );

  if (!extComp) {
    return {
      origDetail,
      origComp,
      effectiveDetail: extensionVerified ? extDetail : origDetail,
      effectiveComp: extensionVerified ? null : origComp,
      hasExtendedDeadline: false,
      hasUnverifiedExtension: !extensionVerified,
      hasInvalidExtension: extensionVerified && extDetail.kind === 'invalid_calendar',
      extendedClosingDate: String(extInput).trim()
    };
  }

  if (!extensionVerified) {
    return {
      origDetail,
      origComp,
      effectiveDetail: origDetail,
      effectiveComp: origComp,
      hasExtendedDeadline: false,
      hasUnverifiedExtension: true,
      extendedClosingDate: extComp.displayDate
    };
  }

  // Verified extension applies only if it does not silently shorten an existing deadline
  if (origComp && extComp.epochDays < origComp.epochDays) {
    return {
      origDetail,
      origComp,
      effectiveDetail: origDetail,
      effectiveComp: origComp,
      hasExtendedDeadline: false,
      hasUnverifiedExtension: true,
      extendedClosingDate: extComp.displayDate
    };
  }

  return {
    origDetail,
    origComp,
    effectiveDetail: extDetail,
    effectiveComp: extComp,
    hasExtendedDeadline: Boolean(!origComp || extComp.epochDays > origComp.epochDays),
    hasUnverifiedExtension: false,
    extendedClosingDate: extComp.displayDate
  };
}

/**
 * Calculates dynamic Application Status and countdown based on start date, end date,
 * and optional verified deadline extension.
 *
 * Normalized status (`status`):
 * - NOT_STARTED: today < start
 * - OPEN: today >= start && today <= effectiveEnd
 * - CLOSED: today > effectiveEnd
 * - NOT_ANNOUNCED: missing dates / missing closing deadline
 * - INVALID_DATE: invalid calendar or impossible date range
 *
 * Preserves legacy `code` values (`BEFORE_START`, `OPEN`, `APPLICATION_EXPIRED`, `NOT_ANNOUNCED`)
 * for backward compatibility.
 *
 * @param {string|Date} startDateInput
 * @param {string|Date} endDateInput
 * @param {Object} [todayObj=getKolkataToday()]
 * @param {Object} [options={}]
 * @returns {Object}
 */
function resolveTodayObject(todayOrDate) {
  if (todayOrDate && typeof todayOrDate === 'object' && typeof todayOrDate.epochDays === 'number') {
    return todayOrDate;
  }
  return getKolkataToday(todayOrDate);
}

export function calculateApplicationStatus(startDateInput, endDateInput, rawTodayObj = getKolkataToday(), options = {}) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const lang = normalizeLanguage(options.lang);
  const isEn = lang === 'en';

  const startDetail = parseDateDetailed(startDateInput);
  const start = startDetail.valid ? startDetail.components : null;
  const resolvedEnd = resolveEffectiveClosingDate(endDateInput, options);
  const endDetail = resolvedEnd.effectiveDetail;
  const end = resolvedEnd.effectiveComp;

  // 0. Guard strictly invalid calendar dates
  if (
    startDetail.kind === 'invalid_calendar' ||
    endDetail.kind === 'invalid_calendar' ||
    resolvedEnd.hasInvalidExtension
  ) {
    return {
      code: 'INVALID_DATE',
      status: 'INVALID_DATE',
      label: isEn ? '⚠️ Invalid Date' : '⚠️ தவறான விண்ணப்ப தேதி (Invalid Date)',
      shortLabel: isEn ? 'Invalid Date' : 'தவறான தேதி',
      countdown: isEn ? 'Admin Review Required' : 'தேதி சரிபார்ப்பு தேவை (Admin Review Required)',
      badgeClass: 'status-badge-app-invalid',
      tagColor: '#b91c1c',
      tagBg: '#fef2f2',
      tagBorder: '#fca5a5',
      isOpen: false,
      isExpired: false,
      isUpcoming: false,
      isInvalid: true,
      hasMissingDeadline: false,
      hasExtendedDeadline: false,
      hasUnverifiedExtension: resolvedEnd.hasUnverifiedExtension,
      daysRemaining: null,
      daysToStart: null
    };
  }

  // Both missing
  if (!start && !end) {
    return {
      code: 'NOT_ANNOUNCED',
      status: 'NOT_ANNOUNCED',
      label: isEn ? '📅 Date Not Announced' : '📅 தேதி அறிவிக்கப்படவில்லை',
      shortLabel: isEn ? 'Date Not Announced' : 'தேதி இல்லை',
      countdown: isEn ? 'Details will be announced soon' : 'விவரங்கள் விரைவில் அறிவிக்கப்படும்',
      badgeClass: 'status-badge-app-unannounced',
      tagColor: '#64748b',
      tagBg: '#f1f5f9',
      tagBorder: '#cbd5e1',
      isOpen: false,
      isExpired: false,
      isUpcoming: false,
      isInvalid: false,
      hasMissingDeadline: true,
      hasExtendedDeadline: false,
      hasUnverifiedExtension: resolvedEnd.hasUnverifiedExtension,
      daysRemaining: null,
      daysToStart: null
    };
  }

  // Impossible chronology: Closing < Opening
  if (start && end && end.epochDays < start.epochDays) {
    return {
      code: 'INVALID_DATE_RANGE',
      status: 'INVALID_DATE',
      label: isEn ? '⚠️ Invalid Date (Closing < Opening)' : '⚠️ தேதி முரண்பாடு (Closing < Opening)',
      shortLabel: isEn ? 'Invalid Date' : 'தேதி முரண்பாடு',
      countdown: isEn ? 'Closing date is before opening date' : 'கடைசி தேதி தொடக்க தேதிக்கு முன் உள்ளது',
      badgeClass: 'status-badge-app-invalid',
      tagColor: '#b91c1c',
      tagBg: '#fef2f2',
      tagBorder: '#fca5a5',
      isOpen: false,
      isExpired: false,
      isUpcoming: false,
      isInvalid: true,
      hasInvalidRange: true,
      hasMissingDeadline: false,
      hasExtendedDeadline: false,
      hasUnverifiedExtension: resolvedEnd.hasUnverifiedExtension,
      daysRemaining: 0,
      daysToStart: null
    };
  }

  // 1. Check if application is in the future (today < start)
  if (start && todayObj.epochDays < start.epochDays) {
    const daysToStart = start.epochDays - todayObj.epochDays;
    return {
      code: 'BEFORE_START',
      status: 'NOT_STARTED',
      label: isEn ? '🟡 Application Not Started' : '🟡 விண்ணப்பம் விரைவில் தொடங்கும்',
      shortLabel: isEn ? 'Application Not Started' : 'விரைவில்',
      countdown: isEn
        ? (daysToStart === 1 ? '⏳ Starts Tomorrow' : `⏳ Starts in ${daysToStart} Days`)
        : (daysToStart === 1
          ? '⏳ நாளை விண்ணப்பம் தொடங்குகிறது'
          : `⏳ தொடங்குவதற்கு இன்னும் ${daysToStart} நாட்கள்`),
      badgeClass: 'status-badge-app-upcoming',
      tagColor: '#d97706',
      tagBg: '#fffbeb',
      tagBorder: '#fde68a',
      isOpen: false,
      isExpired: false,
      isUpcoming: true,
      isInvalid: false,
      hasMissingDeadline: !end,
      hasExtendedDeadline: resolvedEnd.hasExtendedDeadline,
      hasUnverifiedExtension: resolvedEnd.hasUnverifiedExtension,
      daysRemaining: null,
      daysToStart
    };
  }

  // 2. Check if application closed (today > effectiveEnd)
  if (end && todayObj.epochDays > end.epochDays) {
    const daysPassed = todayObj.epochDays - end.epochDays;
    return {
      code: 'APPLICATION_EXPIRED',
      status: 'CLOSED',
      label: isEn ? '🔴 Application Closed' : '🔴 விண்ணப்ப காலம் முடிந்தது',
      shortLabel: isEn ? 'Application Closed' : 'விண்ணப்பம் முடிந்தது',
      countdown: isEn ? 'Application Closed' : 'விண்ணப்பிக்க கடைசி தேதி முடிந்தது',
      badgeClass: 'status-badge-app-expired',
      tagColor: '#dc2626',
      tagBg: '#fef2f2',
      tagBorder: '#fecaca',
      isOpen: false,
      isExpired: true,
      isUpcoming: false,
      isInvalid: false,
      hasMissingDeadline: false,
      hasExtendedDeadline: resolvedEnd.hasExtendedDeadline,
      hasUnverifiedExtension: resolvedEnd.hasUnverifiedExtension,
      effectiveClosingDate: end.displayDate,
      originalClosingDate: resolvedEnd.origComp ? resolvedEnd.origComp.displayDate : '',
      daysRemaining: 0,
      daysPassed
    };
  }

  // 3. Application is currently OPEN (today >= start && today <= effectiveEnd)
  if (end) {
    const daysRemaining = end.epochDays - todayObj.epochDays;
    const isLastDay = daysRemaining === 0;
    const countdownText = isEn
      ? (isLastDay
        ? '⚠️ Last Date Today'
        : `⏳ ${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Remaining`)
      : (isLastDay
        ? '⚠️ இன்று கடைசி நாள் (Last Day Today)'
        : `⏳ விண்ணப்பிக்க இன்னும் ${daysRemaining} நாட்கள்`);

    return {
      code: 'OPEN',
      status: 'OPEN',
      label: isEn
        ? (resolvedEnd.hasExtendedDeadline
          ? '🟢 Application Open (Extended)'
          : '🟢 Application Open')
        : (resolvedEnd.hasExtendedDeadline
          ? '🟢 விண்ணப்பம் நடைபெறுகிறது (தேதி நீட்டிக்கப்பட்டது)'
          : '🟢 விண்ணப்பம் நடைபெற்று வருகிறது'),
      shortLabel: isEn ? 'Apply Now' : 'தற்போது விண்ணப்பிக்கலாம்',
      countdown: isEn
        ? (resolvedEnd.hasExtendedDeadline
          ? `${countdownText} (Extended: ${end.displayDate})`
          : countdownText)
        : (resolvedEnd.hasExtendedDeadline
          ? `${countdownText} (நீட்டிக்கப்பட்ட தேதி: ${end.displayDate})`
          : countdownText),
      badgeClass: isLastDay ? 'status-badge-app-lastday' : 'status-badge-app-open',
      tagColor: isLastDay ? '#b45309' : '#15803d',
      tagBg: isLastDay ? '#fef3c7' : '#dcfce7',
      tagBorder: isLastDay ? '#fde68a' : '#86efac',
      isOpen: true,
      isExpired: false,
      isUpcoming: false,
      isInvalid: false,
      isLastDay,
      hasMissingDeadline: false,
      hasExtendedDeadline: resolvedEnd.hasExtendedDeadline,
      hasUnverifiedExtension: resolvedEnd.hasUnverifiedExtension,
      effectiveClosingDate: end.displayDate,
      originalClosingDate: resolvedEnd.origComp ? resolvedEnd.origComp.displayDate : '',
      daysRemaining
    };
  }

  // 4. Start date present/reached, but closing deadline is missing -> NEVER assume active Apply CTA
  return {
    code: 'MISSING_DEADLINE',
    status: 'NOT_ANNOUNCED',
    label: isEn ? '📅 Closing Date Not Announced' : '📅 கடைசி தேதி அறிவிக்கப்படவில்லை',
    shortLabel: isEn ? 'Date Not Announced' : 'கடைசி தேதி இல்லை',
    countdown: isEn ? 'Closing date missing (Verify Official Notice)' : 'விண்ணப்ப கடைசி தேதி இல்லை (Verify Official Notice)',
    badgeClass: 'status-badge-app-unannounced',
    tagColor: '#b45309',
    tagBg: '#fffbeb',
    tagBorder: '#fde68a',
    isOpen: false,
    isExpired: false,
    isUpcoming: false,
    isInvalid: false,
    hasMissingDeadline: true,
    hasExtendedDeadline: false,
    hasUnverifiedExtension: resolvedEnd.hasUnverifiedExtension,
    daysRemaining: null
  };
}

/**
 * Calculates dynamic Exam Status and countdown.
 * Handles both single exam dates and multi-day exam ranges (e.g. "10/11/2026 to 25/11/2026").
 *
 * Normalized status (`status`):
 * - UPCOMING: today < examStartDate
 * - TODAY: examStartDate <= today <= examEndDate
 * - COMPLETED: today > examEndDate
 * - NOT_ANNOUNCED: missing or genuine descriptive text
 * - INVALID_DATE: invalid calendar date
 *
 * @param {string|Date} examDateInput
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Object}
 */
export function calculateExamStatus(examDateInput, rawTodayObj = getKolkataToday(), options = {}) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const lang = normalizeLanguage(options.lang);
  const isEn = lang === 'en';

  const parsedRange = parseAllDatesDetailed(examDateInput);
  const rawStr = examDateInput ? String(examDateInput).trim() : '';
  const lowerStr = rawStr.toLowerCase();

  if (parsedRange.hasInvalidCalendarDate || parsedRange.kind === 'invalid_calendar') {
    return {
      code: 'INVALID_DATE',
      status: 'INVALID_DATE',
      label: isEn ? '⚠️ Invalid Exam Date' : '⚠️ தவறான தேர்வு தேதி (Invalid Date)',
      shortLabel: isEn ? 'Invalid Date' : 'தவறான தேதி',
      displayDate: rawStr ? `⚠️ ${rawStr} (Invalid Date)` : (isEn ? 'Invalid Date' : 'தேதி தவறானது'),
      countdown: isEn ? 'Verify Exam Date (Admin Review Required)' : 'தேர்வு தேதியை சரிபார்க்கவும் (Admin Review Required)',
      badgeClass: 'status-badge-exam-invalid',
      tagColor: '#b91c1c',
      tagBg: '#fef2f2',
      tagBorder: '#fca5a5',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: true,
      parsedDates: [],
      scheduleDisplay: rawStr,
      daysRemaining: null
    };
  }

  // Missing or genuine text-only (e.g. "Announced Soon" / "January 2027")
  if (!parsedRange.startDate) {
    const isDescriptive = rawStr && !lowerStr.includes('soon') && !lowerStr.includes('அறிவிக்கப்படவில்லை');
    return {
      code: 'NOT_ANNOUNCED',
      status: 'NOT_ANNOUNCED',
      label: isEn
        ? (isDescriptive ? `📅 Exam: ${rawStr}` : '📅 Date Not Announced')
        : (isDescriptive ? `📅 தேர்வு: ${rawStr}` : '📅 தேர்வு தேதி அறிவிக்கப்படவில்லை'),
      shortLabel: isDescriptive ? rawStr : (isEn ? 'Date Not Announced' : 'அறிவிக்கப்படும்'),
      displayDate: isDescriptive ? rawStr : (isEn ? 'Date Not Announced' : 'தேதி அறிவிக்கப்படவில்லை'),
      countdown: isEn
        ? (isDescriptive ? `Exam: ${rawStr}` : 'Exam date will be announced soon')
        : (isDescriptive ? `தேர்வு: ${rawStr}` : 'தேர்வு தேதி விரைவில் அறிவிக்கப்படும்'),
      badgeClass: 'status-badge-exam-unannounced',
      tagColor: '#475569',
      tagBg: '#f8fafc',
      tagBorder: '#e2e8f0',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      parsedDates: [],
      scheduleDisplay: rawStr,
      daysRemaining: null
    };
  }

  const startComp = parsedRange.startDate;
  const endComp = parsedRange.endDate || parsedRange.startDate;
  const parsedDates = parsedRange.validDates.map((d) => d.displayDate);
  const displayFormatted = parsedRange.isRange
    ? formatDisplayDate(rawStr, { lang })
    : startComp.displayDate;

  // Discrete multi-date schedule (e.g. "07, 08, 14 & 15 February 2027" or "25/11/2026 & 19/02/2027"):
  // check exact day match first, then earliest upcoming exam date, then completed once all dates pass.
  if (!parsedRange.isContinuousRange && parsedRange.validDates.length > 1) {
    const todayMatch = parsedRange.validDates.find((d) => d.epochDays === todayObj.epochDays);
    if (todayMatch) {
      return {
        code: 'TODAY',
        status: 'TODAY',
        label: isEn ? '🟠 Exam Today' : '🟠 இன்று தேர்வு',
        shortLabel: isEn ? 'Exam Today' : 'இன்று தேர்வு',
        displayDate: displayFormatted,
        countdown: isEn ? '🟠 Exam Today' : '🟠 இன்று தேர்வு நடைபெறுகிறது (Exam Today)',
        badgeClass: 'status-badge-exam-today',
        tagColor: '#ea580c',
        tagBg: '#fff7ed',
        tagBorder: '#ffedd5',
        isUpcoming: false,
        isToday: true,
        isCompleted: false,
        isInvalid: false,
        isOngoingWindow: false,
        parsedDates,
        scheduleDisplay: displayFormatted,
        earliestEpochDays: startComp.epochDays,
        latestEpochDays: endComp.epochDays,
        daysRemaining: 0
      };
    }

    const nextUpcoming = parsedRange.validDates.find((d) => d.epochDays > todayObj.epochDays);
    if (nextUpcoming) {
      const daysRemaining = nextUpcoming.epochDays - todayObj.epochDays;
      return {
        code: 'UPCOMING',
        status: 'UPCOMING',
        label: isEn ? '🔵 Exam Upcoming' : '🔵 தேர்வு நடைபெற உள்ளது',
        shortLabel: isEn ? 'Exam Upcoming' : 'தேர்வு விரைவில்',
        displayDate: displayFormatted,
        countdown: isEn
          ? `📝 ${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Remaining`
          : `📝 தேர்வுக்கு இன்னும் ${daysRemaining} நாட்கள்`,
        badgeClass: 'status-badge-exam-upcoming',
        tagColor: '#0284c7',
        tagBg: '#f0f9ff',
        tagBorder: '#bae6fd',
        isUpcoming: true,
        isToday: false,
        isCompleted: false,
        isInvalid: false,
        parsedDates,
        scheduleDisplay: displayFormatted,
        earliestEpochDays: startComp.epochDays,
        latestEpochDays: endComp.epochDays,
        nextExamDate: nextUpcoming.displayDate,
        daysRemaining
      };
    }

    const daysPassed = todayObj.epochDays - endComp.epochDays;
    return {
      code: 'EXAM_COMPLETED',
      status: 'COMPLETED',
      label: isEn ? '🔴 Exam Completed' : '🔴 தேர்வு தேதி முடிந்தது',
      shortLabel: isEn ? 'Exam Completed' : 'தேர்வு முடிந்தது (Exam Completed)',
      displayDate: displayFormatted,
      countdown: isEn ? '🔴 Exam Completed' : '🔴 தேர்வு முடிந்தது (Exam Completed)',
      badgeClass: 'status-badge-exam-completed',
      tagColor: '#dc2626',
      tagBg: '#fef2f2',
      tagBorder: '#fecaca',
      isUpcoming: false,
      isToday: false,
      isCompleted: true,
      isInvalid: false,
      parsedDates,
      scheduleDisplay: displayFormatted,
      earliestEpochDays: startComp.epochDays,
      latestEpochDays: endComp.epochDays,
      daysRemaining: 0,
      daysPassed
    };
  }

  // 1. Exam Date in the Future (today < earliest exam date)
  if (todayObj.epochDays < startComp.epochDays) {
    const daysRemaining = startComp.epochDays - todayObj.epochDays;
    return {
      code: 'UPCOMING',
      status: 'UPCOMING',
      label: isEn ? '🔵 Exam Upcoming' : '🔵 தேர்வு நடைபெற உள்ளது',
      shortLabel: isEn ? 'Exam Upcoming' : 'தேர்வு விரைவில்',
      displayDate: displayFormatted,
      countdown: isEn
        ? `📝 ${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Remaining`
        : `📝 தேர்வுக்கு இன்னும் ${daysRemaining} நாட்கள்`,
      badgeClass: 'status-badge-exam-upcoming',
      tagColor: '#0284c7',
      tagBg: '#f0f9ff',
      tagBorder: '#bae6fd',
      isUpcoming: true,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      parsedDates,
      scheduleDisplay: displayFormatted,
      earliestEpochDays: startComp.epochDays,
      latestEpochDays: endComp.epochDays,
      daysRemaining
    };
  }

  // 2. Exam is TODAY or currently ongoing across continuous range
  if (todayObj.epochDays >= startComp.epochDays && todayObj.epochDays <= endComp.epochDays) {
    const isOngoingWindow = endComp.epochDays > startComp.epochDays;
    return {
      code: 'TODAY',
      status: 'TODAY',
      label: isEn
        ? (isOngoingWindow ? '🟠 Exam In Progress' : '🟠 Exam Today')
        : (isOngoingWindow ? '🟠 தேர்வு நடைபெறுகிறது (Exam In Progress)' : '🟠 இன்று தேர்வு'),
      shortLabel: isEn
        ? (isOngoingWindow ? 'Exam In Progress' : 'Exam Today')
        : (isOngoingWindow ? 'தேர்வு நடைபெறுகிறது' : 'இன்று தேர்வு'),
      displayDate: displayFormatted,
      countdown: isEn
        ? (isOngoingWindow
          ? `🟠 Exam In Progress (${startComp.displayDate} – ${endComp.displayDate})`
          : '🟠 Exam Today')
        : (isOngoingWindow
          ? `🟠 தேர்வு நடைபெறுகிறது (${startComp.displayDate} – ${endComp.displayDate})`
          : '🟠 இன்று தேர்வு நடைபெறுகிறது (Exam Today)'),
      badgeClass: 'status-badge-exam-today',
      tagColor: '#ea580c',
      tagBg: '#fff7ed',
      tagBorder: '#ffedd5',
      isUpcoming: false,
      isToday: true,
      isCompleted: false,
      isInvalid: false,
      isOngoingWindow,
      parsedDates,
      scheduleDisplay: displayFormatted,
      earliestEpochDays: startComp.epochDays,
      latestEpochDays: endComp.epochDays,
      daysRemaining: 0
    };
  }

  // 3. Exam Completed in the Past (today > latest exam date)
  const daysPassed = todayObj.epochDays - endComp.epochDays;
  return {
    code: 'EXAM_COMPLETED',
    status: 'COMPLETED',
    label: isEn ? '🔴 Exam Completed' : '🔴 தேர்வு தேதி முடிந்தது',
    shortLabel: isEn ? 'Exam Completed' : 'தேர்வு முடிந்தது (Exam Completed)',
    displayDate: displayFormatted,
    countdown: isEn ? '🔴 Exam Completed' : '🔴 தேர்வு முடிந்தது (Exam Completed)',
    badgeClass: 'status-badge-exam-completed',
    tagColor: '#dc2626',
    tagBg: '#fef2f2',
    tagBorder: '#fecaca',
    isUpcoming: false,
    isToday: false,
    isCompleted: true,
    isInvalid: false,
    parsedDates,
    scheduleDisplay: displayFormatted,
    earliestEpochDays: startComp.epochDays,
    latestEpochDays: endComp.epochDays,
    daysRemaining: 0,
    daysPassed
  };
}

/**
 * Calculates independent verified Result Status.
 *
 * Status values:
 * - NOT_PUBLISHED: Before verified result publication
 * - PUBLISHED: After verified official result publication
 *
 * @param {Object} notif
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Object}
 */
export function calculateResultStatus(notif = {}, rawTodayObj = getKolkataToday(), options = {}) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const lang = normalizeLanguage(options.lang ?? notif.lang);
  const isEn = lang === 'en';

  const resultDateInput = notif.resultDate || notif.resultPublishedAt || '';
  const resDateDetail = parseDateDetailed(resultDateInput);
  const resDateComp = resDateDetail.valid ? resDateDetail.components : null;
  const resultLinkCandidate = notif.verifiedResultLink || notif.resultLink || '';
  const hasSafeResultLink = isSafeHttpUrl(resultLinkCandidate);

  if (resDateDetail.kind === 'invalid_calendar') {
    return {
      code: 'NOT_PUBLISHED',
      status: 'NOT_PUBLISHED',
      label: isEn ? '⚠️ Invalid Result Date' : '⚠️ தவறான முடிவு தேதி (Result Invalid)',
      shortLabel: isEn ? 'Invalid Date' : 'முடிவு தேதி தவறு',
      displayDate: '',
      resultLink: '',
      isPublished: false,
      isInvalidDate: true,
      tagColor: '#b91c1c',
      tagBg: '#fef2f2',
      tagBorder: '#fca5a5'
    };
  }

  // Future result date cannot mark result as already published
  if (resDateComp && resDateComp.epochDays > todayObj.epochDays) {
    return {
      code: 'NOT_PUBLISHED',
      status: 'NOT_PUBLISHED',
      label: isEn
        ? `⏳ Result Not Published (${resDateComp.displayDate})`
        : `⏳ முடிவு வெளியிடப்படவில்லை (${resDateComp.displayDate})`,
      shortLabel: isEn ? 'Result Not Published' : 'வெளியிடப்படவில்லை',
      displayDate: resDateComp.displayDate,
      resultLink: '',
      isPublished: false,
      isInvalidDate: false,
      tagColor: '#475569',
      tagBg: '#f8fafc',
      tagBorder: '#e2e8f0'
    };
  }

  const isExplicitPublished = (
    (
      notif.resultStatus === 'PUBLISHED' ||
      notif.resultStatus?.status === 'PUBLISHED' ||
      notif.resultStatusCode === 'PUBLISHED' ||
      notif.resultPublished === true ||
      notif.isResultPublished === true
    ) &&
    notif.resultVerified !== false &&
    notif.isVerified !== false
  );
  const isVerifiedResultNotice = (
    notif.noticeType === 'result_key' &&
    notif.isVerified === true &&
    !['quarantined', 'rejected', 'pending_review'].includes(notif.ingestionStatus)
  );
  const isVerifiedLinkPublished = Boolean(hasSafeResultLink && notif.resultVerified === true && notif.isVerified !== false);

  const isPublished = Boolean(isExplicitPublished || isVerifiedResultNotice || isVerifiedLinkPublished);

  if (isPublished) {
    return {
      code: 'PUBLISHED',
      status: 'PUBLISHED',
      label: isEn ? '🟢 Result Published' : '🟢 முடிவு வெளியிடப்பட்டது (Result Published)',
      shortLabel: isEn ? 'Result Published' : 'முடிவு வெளியானது',
      displayDate: resDateComp ? resDateComp.displayDate : '',
      resultLink: hasSafeResultLink ? String(resultLinkCandidate).trim() : '',
      isPublished: true,
      isInvalidDate: false,
      tagColor: '#15803d',
      tagBg: '#dcfce7',
      tagBorder: '#86efac'
    };
  }

  return {
    code: 'NOT_PUBLISHED',
    status: 'NOT_PUBLISHED',
    label: isEn ? '⏳ Result Not Published' : '⏳ முடிவு வெளியிடப்படவில்லை (Result Not Published)',
    shortLabel: isEn ? 'Result Not Published' : 'வெளியிடப்படவில்லை',
    displayDate: resDateComp ? resDateComp.displayDate : '',
    resultLink: '',
    isPublished: false,
    isInvalidDate: false,
    tagColor: '#64748b',
    tagBg: '#f8fafc',
    tagBorder: '#e2e8f0'
  };
}

/**
 * Evaluates cross-field date consistency and determines whether Admin Review is required
 * and whether the active Apply CTA must be suppressed.
 *
 * @param {Object} notif
 * @param {Object} appStatus
 * @param {Object} examStatus
 * @param {Object} resultStatus
 * @param {Object} [todayObj=getKolkataToday()]
 * @param {Object} [options={}]
 * @returns {Object}
 */
export function evaluateNotificationDateConsistency(notif = {}, appStatus = {}, examStatus = {}, resultStatus = {}, rawTodayObj = getKolkataToday(), options = {}) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const lang = normalizeLanguage(options.lang ?? notif.lang);
  const isEn = lang === 'en';

  const issues = [];
  const warnings = [];
  let requiresCtaBlock = false;

  const openInput = notif.openingDate || notif.applicationStartDate;
  const closeInput = notif.closingDate || notif.applicationEndDate;
  const openComp = parseDateToComponents(openInput);
  const resolvedEnd = resolveEffectiveClosingDate(closeInput, notif);
  const effectiveCloseComp = resolvedEnd.effectiveComp;
  const examRange = parseAllDatesDetailed(notif.examDate);

  if (appStatus.isInvalid || examStatus.isInvalid || resultStatus.isInvalidDate) {
    issues.push('INVALID_DATE_VALUE');
    warnings.push(
      isEn
        ? '⚠️ Invalid Date detected — Admin Review Required.'
        : '⚠️ தவறான தேதி வடிவம் கண்டறியப்பட்டது. Admin சரிபார்ப்பு தேவை.'
    );
    requiresCtaBlock = true;
  }

  if (appStatus.hasMissingDeadline) {
    issues.push('MISSING_APPLICATION_LAST_DATE');
    warnings.push(
      isEn
        ? '⚠️ Application closing date missing — Admin Review Required.'
        : '⚠️ விண்ணப்ப கடைசி தேதி இல்லை. அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்.'
    );
    requiresCtaBlock = true;
  }

  if (appStatus.hasUnverifiedExtension) {
    issues.push('UNVERIFIED_DEADLINE_EXTENSION');
    warnings.push(
      isEn
        ? '⚠️ Unverified deadline extension detected — Admin Review Required.'
        : '⚠️ சரிபார்க்கப்படாத விண்ணப்ப நீட்டிப்பு தேதி உள்ளது — Admin சரிபார்ப்பு தேவை.'
    );
  }

  if (appStatus.hasInvalidRange) {
    issues.push('CLOSING_BEFORE_OPENING');
    warnings.push(
      isEn
        ? '⚠️ Application closing date is before opening date — Admin Review Required.'
        : '⚠️ விண்ணப்ப கடைசி தேதி தொடக்க தேதிக்கு முன் உள்ளது.'
    );
    requiresCtaBlock = true;
  }

  // Core requirement: Application is OPEN while Exam is COMPLETED
  if (appStatus.status === 'OPEN' && examStatus.status === 'COMPLETED') {
    issues.push('APPLICATION_OPEN_EXAM_COMPLETED');
    warnings.push(
      isEn
        ? '⚠️ Admin Review Required: Application appears open while exam is marked completed.'
        : '⚠️ Admin சரிபார்ப்பு தேவை: விண்ணப்பம் திறந்த நிலையில் இருந்தாலும் தேர்வு முடிந்ததாகக் காட்டுகிறது. தேதி முரண்பாடு இருக்கலாம்.'
    );
    requiresCtaBlock = true;
  }

  // Chronological conflict: Exam starts before or earlier than application closing deadline
  if (effectiveCloseComp && examRange.startDate && examRange.startDate.epochDays < effectiveCloseComp.epochDays) {
    if (!issues.includes('APPLICATION_OPEN_EXAM_COMPLETED')) {
      issues.push('EXAM_BEFORE_APPLICATION_CLOSE');
      warnings.push(
        isEn
          ? `⚠️ Admin Review Required: Exam date (${examRange.startDate.displayDate}) is before application closing date (${effectiveCloseComp.displayDate}).`
          : `⚠️ Admin சரிபார்ப்பு தேவை: தேர்வு தேதி (${examRange.startDate.displayDate}) விண்ணப்ப கடைசி தேதிக்கு (${effectiveCloseComp.displayDate}) முன் உள்ளது.`
      );
    } else {
      issues.push('EXAM_BEFORE_APPLICATION_CLOSE');
    }
    requiresCtaBlock = true;
  }

  if (openComp && examRange.startDate && examRange.startDate.epochDays < openComp.epochDays) {
    issues.push('EXAM_BEFORE_APPLICATION_OPEN');
    warnings.push(
      isEn
        ? `⚠️ Admin Review Required: Exam date (${examRange.startDate.displayDate}) is before application opening date (${openComp.displayDate}).`
        : `⚠️ தேர்வு தேதி (${examRange.startDate.displayDate}) விண்ணப்ப தொடக்க தேதிக்கு (${openComp.displayDate}) முன் உள்ளது.`
    );
    requiresCtaBlock = true;
  }

  const hasVerifiedCombinationOverride = notif.dateCombinationVerified === true && !appStatus.isInvalid && !appStatus.hasMissingDeadline && !appStatus.hasInvalidRange;
  const finalCtaBlock = requiresCtaBlock && !hasVerifiedCombinationOverride;
  const needsAdminReview = issues.length > 0 && !hasVerifiedCombinationOverride;

  return {
    isConsistent: issues.length === 0,
    issues,
    warnings,
    needsAdminReview,
    requiresCtaBlock: finalCtaBlock,
    checkedAtIst: todayObj.isoDate
  };
}

/**
 * Validates date ranges for Admin entry:
 * - Detects closingDate < openingDate (ERROR)
 * - Detects examDate < openingDate or examDate < closingDate (WARNING)
 * - Returns structured errors, warnings, and live computed statuses
 *
 * @param {string} openingDateStr
 * @param {string} closingDateStr
 * @param {string} examDateStr
 * @param {Object} [options={}]
 * @returns {{ isValid: boolean, errors: string[], warnings: string[], appStatus: Object, examStatus: Object }}
 */
export function validateNotificationDateForm(openingDateStr, closingDateStr, examDateStr, options = {}) {
  const lang = normalizeLanguage(options.lang);
  const isEn = lang === 'en';
  const errors = [];
  const warnings = [];

  const start = parseDateToComponents(openingDateStr);
  const end = parseDateToComponents(closingDateStr);
  const examRange = parseAllDatesDetailed(examDateStr);
  const exam = examRange.startDate;

  if (start && end && end.epochDays < start.epochDays) {
    errors.push(
      isEn
        ? `❌ Application closing date (${end.displayDate}) cannot be before opening date (${start.displayDate}).`
        : `❌ விண்ணப்ப கடைசி தேதி (${end.displayDate}) தொடக்க தேதிக்கு (${start.displayDate}) முன் இருக்க முடியாது.`
    );
  }

  if (start && exam && exam.epochDays < start.epochDays) {
    warnings.push(
      isEn
        ? `⚠️ Exam date (${exam.displayDate}) is before opening date (${start.displayDate}). Please verify.`
        : `⚠️ தேர்வு தேதி (${exam.displayDate}) விண்ணப்ப தொடக்க தேதிக்கு (${start.displayDate}) முன் உள்ளது. தயவுசெய்து சரிபார்க்கவும்.`
    );
  }

  if (end && exam && exam.epochDays < end.epochDays) {
    warnings.push(
      isEn
        ? `⚠️ Exam date (${exam.displayDate}) is before closing date (${end.displayDate}). Please verify official notice.`
        : `⚠️ தேர்வு தேதி (${exam.displayDate}) விண்ணப்ப கடைசி தேதிக்கு (${end.displayDate}) முன் உள்ளது. அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்.`
    );
  }

  const today = getKolkataToday();
  const appStatus = calculateApplicationStatus(openingDateStr, closingDateStr, today, { lang });
  const examStatus = calculateExamStatus(examDateStr, today, { lang });

  if (appStatus.isInvalid) {
    errors.push(
      isEn
        ? '❌ Invalid application date format. Please enter a valid date.'
        : '❌ விண்ணப்ப தேதி வடிவம் தவறானது. சரியான தேதியை உள்ளிடவும்.'
    );
  }
  if (examStatus.isInvalid) {
    errors.push(
      isEn
        ? '❌ Invalid exam date format. Please enter a valid date.'
        : '❌ தேர்வு தேதி வடிவம் தவறானது. சரியான தேதியை உள்ளிடவும்.'
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    appStatus,
    examStatus
  };
}

/**
 * Enriches a notification object with independent applicationStatus, examStatus,
 * resultStatus, formatted date strings, Admin review consistency flags,
 * CTA visibility controls, and preserved original source dates.
 *
 * @param {Object} notif
 * @param {Object} [todayObj=getKolkataToday()]
 * @param {Object} [options={}]
 * @returns {Object}
 */
export function enrichNotificationWithDateStatus(notif, todayObj = getKolkataToday(), options = {}) {
  if (!notif) return null;

  const lang = normalizeLanguage(options.lang ?? notif.lang);
  const openInput = notif.openingDate || notif.applicationStartDate || '';
  const closeInput = notif.closingDate || notif.applicationEndDate || '';

  const appStatus = calculateApplicationStatus(openInput, closeInput, todayObj, {
    extendedClosingDate: notif.extendedClosingDate || notif.extendedLastDate || notif.revisedClosingDate || '',
    isExtensionVerified: notif.isExtensionVerified,
    extensionVerified: notif.extensionVerified,
    corrigendumVerified: notif.corrigendumVerified,
    lang
  });
  const examStatus = calculateExamStatus(notif.examDate, todayObj, { lang });
  const resultStatus = calculateResultStatus(notif, todayObj, { lang });
  const dateConsistency = evaluateNotificationDateConsistency(notif, appStatus, examStatus, resultStatus, todayObj, { lang });

  const formattedOpeningDate = formatDisplayDate(openInput, { lang });
  const effectiveClosingRaw = appStatus.hasExtendedDeadline && appStatus.effectiveClosingDate
    ? appStatus.effectiveClosingDate
    : closeInput;
  const formattedClosingDate = formatDisplayDate(effectiveClosingRaw, { lang });
  const formattedOriginalClosingDate = formatDisplayDate(notif.originalClosingDate || closeInput, { lang });
  const formattedExamDate = formatDisplayDate(notif.examDate, { lang });
  const formattedNotificationDate = formatDisplayDate(notif.notificationDate || openInput, { lang });

  const hasValidApplyUrl = isSafeHttpUrl(notif.applyLink);
  const canShowApplyCta = Boolean(appStatus.isOpen && hasValidApplyUrl && !dateConsistency.requiresCtaBlock);

  let applyCtaState = 'UNAVAILABLE';
  if (canShowApplyCta) {
    applyCtaState = 'ACTIVE';
  } else if (appStatus.isOpen && dateConsistency.requiresCtaBlock) {
    applyCtaState = 'NEEDS_REVIEW_DISABLED';
  } else if (appStatus.status === 'CLOSED') {
    applyCtaState = 'CLOSED';
  } else if (appStatus.status === 'NOT_STARTED') {
    applyCtaState = 'NOT_STARTED';
  }

  // Preserve original source dates & audit history without mutating source inputs
  const firstPrevClosing = Array.isArray(notif.revisionHistory) && notif.revisionHistory.length > 0
    ? (notif.revisionHistory[0]?.previousValues?.closingDate || '')
    : '';
  const originalDates = {
    openingDate: notif.originalOpeningDate || openInput || '',
    closingDate: notif.originalClosingDate || firstPrevClosing || closeInput || '',
    examDate: notif.originalExamDate || notif.examDate || ''
  };

  return {
    ...notif,
    lang,
    applicationStatus: appStatus.status,
    examStatusCode: examStatus.status,
    resultStatusCode: resultStatus.status,
    appStatus,
    examStatus,
    resultStatus,
    dateConsistency,
    needsAdminReview: dateConsistency.needsAdminReview,
    canShowApplyCta,
    applyCtaState,
    hasVerifiedReferenceApplyUrl: hasValidApplyUrl && appStatus.status === 'CLOSED',
    originalDates,
    revisionHistory: Array.isArray(notif.revisionHistory) ? notif.revisionHistory : [],
    formattedOpeningDate,
    formattedClosingDate,
    formattedOriginalClosingDate,
    formattedExamDate,
    formattedNotificationDate,
    // Classification flags
    isActiveApplication: appStatus.isOpen,
    isUpcomingExam: examStatus.isUpcoming || examStatus.isToday,
    isApplicationClosed: appStatus.isExpired,
    isExamCompleted: examStatus.isCompleted,
    isResultPublished: resultStatus.isPublished
  };
}
