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
    hideFinished: '🚫 பழைய / முடிந்தவற்றை மறை (Hide Expired & Completed)',
    filterHeading: 'வடிகட்டிகள் (Filter):',
    filterAll: '📋 அனைத்து நேரலை அறிவிப்புகள் (All Active)',
    filterActiveApp: '🔥 விண்ணப்பம் நடைபெறுகிறது (Active Applications)',
    filterActiveJobs: '💼 நடப்பு அரசு வேலைகள் (Current Govt Jobs)',
    filterUpcomingExam: '📚 தேர்வு நடைபெற உள்ளது (Upcoming Exams)',
    filterUpcomingInterviews: '🎙️ நேர்காணல் தேர்வுகள் (Upcoming Interviews)',
    filterClosingSoon: '⏰ விரைவில் முடியும் விண்ணப்பங்கள் (Closing Soon)',
    filterLatestVerified: '✅ சமீபத்திய சரிபார்க்கப்பட்டவை (Latest Verified)',
    filterAppClosed: '🔴 விண்ணப்ப காலம் முடிந்தது (Application Closed)',
    filterExamCompleted: '🔴 தேர்வு முடிந்தது (Exam Completed)',
    filterArchived: '📦 பழைய / முடிந்த அறிவிப்புகள் (Archived)',
    filterUpdates: '📢 முடிவுகள் / நுழைவுச் சீட்டு (Results & Updates)',
    interviewDateLabel: 'நேர்காணல் தேதி (Interview Date):',
    dvDateLabel: 'சான்றிதழ் சரிபார்ப்பு (Doc Verification):',
    prelimsLabel: 'முதல்நிலைத் தேர்வு (Prelims):',
    mainsLabel: 'முதன்மைத் தேர்வு (Mains):',
    nextEventPrefix: '⏳ அடுத்த முக்கிய நிகழ்வு:',
    notApplicable: 'பொருந்தாது (Not Applicable)',
    interviewNotApplicable: 'நேர்காணல் பொருந்தாது (Not Applicable)',
    cardPrelimsPrefix: '📝 முதல்நிலை:',
    cardMainsPrefix: '📚 முதன்மை:',
    cardInterviewPrefix: '🎙️ நேர்காணல்:',
    cardDvPrefix: '📄 சான்றிதழ் சரிபார்ப்பு:',
    adminPendingCurrent: 'நடப்பு ஒப்புதல்கள் (Current Pending)',
    adminPendingExpired: 'காலாவதியானவை (Expired Pending)',
    adminMissingDate: 'தேதி சரிபார்ப்பு தேவை (Missing Date)',
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
    officialNotificationAwaitedBtn: 'அரசு அறிவிப்பு எதிர்பார்க்கப்படுகிறது',
    vacancyAwaited: 'காலிப்பணியிடங்கள்: அரசு அறிவிப்பு எதிர்பார்க்கப்படுகிறது',
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
    hideFinished: '🚫 Hide Expired & Finished Exams',
    filterHeading: 'Filter:',
    filterAll: '📋 All Active Notifications',
    filterActiveApp: '🔥 Active Applications',
    filterActiveJobs: '💼 Current Government Jobs',
    filterUpcomingExam: '📚 Upcoming Exams',
    filterUpcomingInterviews: '🎙️ Upcoming Interviews',
    filterClosingSoon: '⏰ Applications Closing Soon',
    filterLatestVerified: '✅ Latest Verified Notifications',
    filterAppClosed: '🔴 Application Closed',
    filterExamCompleted: '🔴 Exam Completed',
    filterArchived: '📦 Archived / Completed',
    filterUpdates: '📢 Results & Updates',
    interviewDateLabel: 'Interview Date:',
    dvDateLabel: 'Doc Verification Date:',
    prelimsLabel: 'Preliminary Exam (Prelims):',
    mainsLabel: 'Main Examination (Mains):',
    nextEventPrefix: '⏳ Next Important Event:',
    notApplicable: 'Not Applicable',
    interviewNotApplicable: 'Interview Not Applicable',
    cardPrelimsPrefix: '📝 Prelims:',
    cardMainsPrefix: '📚 Mains:',
    cardInterviewPrefix: '🎙️ Interview:',
    cardDvPrefix: '📄 Doc Verification:',
    adminPendingCurrent: 'Current Pending Approvals',
    adminPendingExpired: 'Expired Pending Approvals',
    adminMissingDate: 'Missing Date Verification',
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
    officialNotificationAwaitedBtn: 'Official Notification Awaited',
    vacancyAwaited: 'Vacancy details awaiting official notification',
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

export const TAMIL_MONTH_MAP = {
  'ஜனவரி': 1, 'பிப்ரவரி': 2, 'மார்ச்': 3, 'ஏப்ரல்': 4,
  'மே': 5, 'ஜூன்': 6, 'ஜூலை': 7, 'ஆகஸ்ட்': 8,
  'செப்டம்பர்': 9, 'செப்': 9, 'அக்டோபர்': 10, 'அக்': 10,
  'நவம்பர்': 11, 'நவம்': 11, 'டிசம்பர்': 12, 'டிசம்': 12,
  'சித்திரை': 4, 'வைகாசி': 5, 'ஆனி': 6, 'ஆடி': 7,
  'ஆவணி': 8, 'புரட்டாசி': 9, 'ஐப்பசி': 10, 'கார்த்திகை': 11,
  'மார்கழி': 12, 'தை': 1, 'மாசி': 2, 'பங்குனி': 3
};

export const ALL_MONTH_MAP = { ...MONTH_NAME_MAP, ...TAMIL_MONTH_MAP };

export const DATE_STATUS = {
  VERIFIED: 'VERIFIED',
  NOT_ANNOUNCED: 'NOT_ANNOUNCED',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  INVALID: 'INVALID'
};

export const RECRUITMENT_STAGES = {
  APPLICATION_NOT_STARTED: 'APPLICATION_NOT_STARTED',
  APPLICATION_OPEN: 'APPLICATION_OPEN',
  APPLICATION_CLOSED: 'APPLICATION_CLOSED',
  ADMIT_CARD_RELEASED: 'ADMIT_CARD_RELEASED',
  PRELIMS_UPCOMING: 'PRELIMS_UPCOMING',
  PRELIMS_COMPLETED: 'PRELIMS_COMPLETED',
  MAINS_UPCOMING: 'MAINS_UPCOMING',
  MAINS_COMPLETED: 'MAINS_COMPLETED',
  INTERVIEW_UPCOMING: 'INTERVIEW_UPCOMING',
  INTERVIEW_COMPLETED: 'INTERVIEW_COMPLETED',
  DOCUMENT_VERIFICATION_UPCOMING: 'DOCUMENT_VERIFICATION_UPCOMING',
  RESULT_AWAITED: 'RESULT_AWAITED',
  FINAL_SELECTION_COMPLETED: 'FINAL_SELECTION_COMPLETED',
  RECRUITMENT_CANCELLED: 'RECRUITMENT_CANCELLED'
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
 * - DD Mon YYYY (e.g. "23 Oct 2026", "23 October 2026", "15th September, 2024")
 * - Mon DD, YYYY / Mon DD YYYY (e.g. "Oct 23, 2026")
 * - Tamil formats (e.g. "15 நவம்பர் 2026", "நவம்பர் 15, 2026")
 *
 * Uses standardized dateStatus:
 * - VERIFIED: Parsed valid calendar date / timestamp
 * - NOT_ANNOUNCED: Missing or unannounced placeholder (NOT_ANNOUNCED, TBA, Announced Soon)
 * - NEEDS_REVIEW: Descriptive text, interview schedule without exact date, or multi-stage
 * - INVALID: Strictly invalid calendar numbers (e.g. 30-02-2026, 31-04-2026, month 13)
 *
 * @param {string|Date|number} dateInput
 * @returns {{ valid: boolean, kind: 'calendar'|'timestamp'|'empty'|'descriptive'|'not_announced'|'invalid_calendar', dateStatus: 'VERIFIED'|'NOT_ANNOUNCED'|'NEEDS_REVIEW'|'INVALID', components: Object|null, instantMs: number|null, reason?: string, scheduleType?: string, isMultiStage?: boolean }}
 */
export function parseDateDetailed(dateInput) {
  const res = _parseDateDetailedInner(dateInput);
  let dateStatus = DATE_STATUS.INVALID;
  if (res.valid) {
    dateStatus = DATE_STATUS.VERIFIED;
  } else if (res.kind === 'empty' || res.kind === 'not_announced') {
    dateStatus = DATE_STATUS.NOT_ANNOUNCED;
  } else if (res.kind === 'descriptive') {
    dateStatus = DATE_STATUS.NEEDS_REVIEW;
  } else if (res.kind === 'invalid_calendar') {
    dateStatus = DATE_STATUS.INVALID;
  }

  const rawStr = typeof dateInput === 'string' ? dateInput.trim() : '';
  const isMultiStage = Boolean(rawStr && /\b(?:stage|tier|phase)\s+(?:[iI1]|[iI]{2}|2)\b|prelim(?:s|inary)?.*main(?:s)?/i.test(rawStr));

  return {
    ...res,
    dateStatus,
    ...(isMultiStage ? { isMultiStage: true } : {})
  };
}

function _parseDateDetailedInner(dateInput) {
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

  // 3. DD Mon YYYY (e.g. "23 Oct 2026", "15th September, 2024", "15 நவம்பர் 2026")
  const dMonYMatch = rawStr.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z\u0B80-\u0BFF]{3,12}),?\s+(\d{4})$/i);
  if (dMonYMatch) {
    const day = parseInt(dMonYMatch[1], 10);
    const mStr = dMonYMatch[2].toLowerCase();
    const month = ALL_MONTH_MAP[mStr];
    const year = parseInt(dMonYMatch[3], 10);
    if (month && isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 4. Mon DD, YYYY / Mon DD YYYY (e.g. "Oct 23, 2026", "நவம்பர் 15, 2026")
  const monDYMatch = rawStr.match(/^([A-Za-z\u0B80-\u0BFF]{3,12})\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/i);
  if (monDYMatch) {
    const mStr = monDYMatch[1].toLowerCase();
    const month = ALL_MONTH_MAP[mStr];
    const day = parseInt(monDYMatch[2], 10);
    const year = parseInt(monDYMatch[3], 10);
    if (month && isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 5. Fallback extraction inside descriptive strings like:
  // "Stage I (Preliminary) on 15th September, 2024 & Stage II on 20th October, 2024", "Walk-in Interview on 15/11/2026"
  const isInterview = /(?:^|[\s,;:(])(interview|walk[- ]?in|நேர்காணல்)/i.test(rawStr) || /நேர்காணல்/.test(rawStr);
  const isWalkIn = /(?:^|[\s,;:(])(walk[- ]?in|நேரடி\s*நேர்காணல்)/i.test(rawStr) || /நேரடி\s*நேர்காணல்/.test(rawStr);
  const scheduleType = isWalkIn ? 'walk_in' : (isInterview ? 'interview' : 'scheduled_exam');

  const embeddedIso = rawStr.match(/(?<!\d)(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?!\d)/);
  if (embeddedIso) {
    const year = parseInt(embeddedIso[1], 10);
    const month = parseInt(embeddedIso[2], 10);
    const day = parseInt(embeddedIso[3], 10);
    if (isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', scheduleType, components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  const embeddedDmy = rawStr.match(/(?<!\d)(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})(?!\d)/);
  if (embeddedDmy) {
    const day = parseInt(embeddedDmy[1], 10);
    const month = parseInt(embeddedDmy[2], 10);
    const year = parseInt(embeddedDmy[3], 10);
    if (isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', scheduleType, components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  const embeddedDMonY = rawStr.match(/(?<!\d)(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z\u0B80-\u0BFF]{3,12}),?\s+(\d{4})/i);
  if (embeddedDMonY) {
    const day = parseInt(embeddedDMonY[1], 10);
    const mStr = embeddedDMonY[2].toLowerCase();
    const month = ALL_MONTH_MAP[mStr];
    const year = parseInt(embeddedDMonY[3], 10);
    if (month && isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', scheduleType, components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  const embeddedMonDY = rawStr.match(/([A-Za-z\u0B80-\u0BFF]{3,12})\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})/i);
  if (embeddedMonDY) {
    const mStr = embeddedMonDY[1].toLowerCase();
    const month = ALL_MONTH_MAP[mStr];
    const day = parseInt(embeddedMonDY[2], 10);
    const year = parseInt(embeddedMonDY[3], 10);
    if (month && isValidDateComponents(year, month, day)) {
      return { valid: true, kind: 'calendar', scheduleType, components: buildDateComponents(year, month, day, rawStr), instantMs: null };
    }
    return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'INVALID_CALENDAR_DATE' };
  }

  // 6. Check for unannounced phrases ("NOT_ANNOUNCED", "Announced Soon", "தேதி பின்னர் அறிவிக்கப்படும்")
  if (isUnannouncedDateText(rawStr)) {
    return { valid: false, kind: 'not_announced', scheduleType: 'not_announced', components: null, instantMs: null, reason: 'UNANNOUNCED_SCHEDULE' };
  }

  // 7. Check for descriptive schedule phrases ("Stage I / Stage II", "Prelims / Mains", "CBT", "Written Test", etc.)
  if (isKnownDescriptiveDateText(rawStr)) {
    return { valid: false, kind: 'descriptive', scheduleType, components: null, instantMs: null, reason: 'UNPARSED_DESCRIPTIVE_DATE' };
  }

  // 8. If text has NO date-like digits at all (e.g. purely descriptive words like "Refer Notification PDF"), treat as descriptive
  if (!/\d{1,4}/.test(rawStr)) {
    return { valid: false, kind: 'descriptive', scheduleType, components: null, instantMs: null, reason: 'UNPARSED_DESCRIPTIVE_DATE' };
  }

  return { valid: false, kind: 'invalid_calendar', components: null, instantMs: null, reason: 'UNRECOGNIZED_INVALID_DATE' };
}

export function isUnannouncedDateText(rawStr) {
  const lower = String(rawStr || '').trim().toLowerCase();
  if (!lower) return true;
  return /(not[ _-]?announced|unannounced|tba|tbd|to be announced|to be notified|will be announced|intimated later|announced soon|shortly|தேதி பின்னர் அறிவிக்கப்படும்|விரைவில் அறிவிக்கப்படும்|அறிவிக்கப்படும்|பின்னர் அறிவிக்கப்படும்)/i.test(lower);
}

export function isInterviewOrScheduleText(rawStr) {
  const lower = String(rawStr || '').trim().toLowerCase();
  if (!lower) return false;
  // CBT, CBT-1, CBT-2, Written Test, Written Exam are strictly written examination stages, NOT interview stages.
  const isWrittenExam = /(cbt|computer\s*based\s*test|written\s*test|written\s*exam|cee\s*exam|objective\s*test|tier\s*[iI\d]|stage\s*[iI\d]|எழுத்துத்\s*தேர்வு)/i.test(lower);
  if (isWrittenExam) return false;

  return /(interview|walk[- ]?in|viva[- ]?voce|personality\s*test|counselling|screening|merit|gate\s*score|pet|pst|physical\s*test|physical\s*efficiency|rally|trade\s*test|skill\s*test|document\s*verification|நேர்காணல்|நேரடி\s*நேர்காணல்|கலந்தாய்வு|சான்றிதழ்\s*சரிபார்ப்பு)/i.test(lower);
}

export function isKnownDescriptiveDateText(rawStr) {
  const lower = String(rawStr || '').trim().toLowerCase();
  if (!lower) return true;
  if (isUnannouncedDateText(lower) || isInterviewOrScheduleText(lower)) {
    return true;
  }
  // English recruitment descriptions: stages, prelims/mains, CBT, tests, merit, scores, rallies, etc.
  if (/(stage\s*[iIvVx\d]+|tier\s*[iIvVx\d]+|phase\s*[iIvVx\d]+)/i.test(lower)) {
    return true;
  }
  if (/(prelim|main|cbt|written\s*test|written\s*exam|interview|walk[- ]?in|merit|no\s*written|without\s*(?:written\s*)?exam|no\s*exam|as\s*per|schedule|gate\s*score|gate\s*exam|pet|pst|physical\s*test|physical\s*efficiency|physical\s*endurance|pmt|rally|trade\s*test|skill\s*test|typing\s*test|counselling|document\s*verification|fitness|screening|tentative|refer|notification|rules|pdf|brochure|planner|soon|ongoing|open|quarter|half)/i.test(lower)) {
    return true;
  }
  // Tamil recruitment descriptions
  if (/(நேர்காணல்|நேரடி\s*நேர்காணல்|எழுத்துத்\s*தேர்வு|தேர்வு\s*இல்லை|எழுத்துத்\s*தேர்வு\s*இல்லை|மதிப்பெண்|மதிப்பெண்கள்|தகுதிப்\s*பட்டியல்|அட்டவணை|அட்டவணைப்படி|அறிவிக்கப்படும்|விரைவில்|உடற்தகுதி|உடல்தகுதி|உடல்திறன்|சான்றிதழ்\s*சரிபார்ப்பு|கலந்தாய்வு)/.test(lower)) {
    return true;
  }
  const monthNames = Object.keys(ALL_MONTH_MAP).join('|');
  const monthYearRegex = new RegExp(`\\b(${monthNames})\\b[\\s,/&-]+\\d{4}|\\b(${monthNames})\\b.*\\b(${monthNames})\\b`, 'i');
  return monthYearRegex.test(lower);
}

/**
 * Evaluates whether a raw date/schedule string indicates a future month or ongoing pending stage
 * (e.g. "December 2026", "Online Computer Based Test December 2026", "November / December 2026",
 * "March 2027", "Interview based on GATE Score", "Interview November 2026", "Walk-in Interview").
 *
 * Prevents premature archival of active recruitment notifications where application has closed
 * but exams, interviews, or selection stages remain scheduled or pending in the current/future cycle.
 *
 * @param {string} rawText
 * @param {Object} [rawTodayObj=getKolkataToday()]
 * @returns {boolean}
 */
export function hasFutureMonthOrPendingStage(rawText, rawTodayObj = getKolkataToday()) {
  if (!rawText) return false;
  const str = String(rawText).trim();
  if (!str) return false;
  const lower = str.toLowerCase();

  const todayObj = resolveTodayObject(rawTodayObj);
  const currentYear = todayObj.year;
  const currentMonth = todayObj.month;

  // 1. Check for 4-digit years
  const yearMatches = [...str.matchAll(/(?<!\d)(20\d\d)(?!\d)/g)];
  if (yearMatches.length > 0) {
    let hasFutureYear = false;
    let hasCurrentYear = false;
    let hasPastOnly = true;

    for (const ym of yearMatches) {
      const y = parseInt(ym[1], 10);
      if (y > currentYear) {
        hasFutureYear = true;
        hasPastOnly = false;
      } else if (y === currentYear) {
        hasCurrentYear = true;
        hasPastOnly = false;
      }
    }

    if (hasFutureYear) return true;

    if (hasCurrentYear) {
      const monthKeys = Object.keys(ALL_MONTH_MAP).sort((a, b) => b.length - a.length);
      const monthTokensFound = [];
      for (const mKey of monthKeys) {
        const regex = new RegExp(`(^|[^a-z\u0B80-\u0BFF])${mKey}([^a-z\u0B80-\u0BFF]|$)`, 'i');
        if (regex.test(lower)) {
          monthTokensFound.push(ALL_MONTH_MAP[mKey]);
        }
      }

      if (monthTokensFound.length > 0) {
        // Any month >= currentMonth indicates an upcoming or current active cycle
        return monthTokensFound.some((m) => m >= currentMonth);
      }

      // Current year mentioned without an explicit past month token (e.g. "CBT in 2026")
      if (!/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct)\b/i.test(lower)) {
        return true;
      }
    }

    if (hasPastOnly) return false;
  }

  // 2. Pending selection/interview stages without explicit year (Rule 5)
  if (isInterviewOrScheduleText(lower) && !isUnannouncedDateText(lower)) {
    return true;
  }

  return false;
}

/**
 * Checks whether a schedule text describes an interview-only or selection process without written exam
 * (e.g. "Interview based on GATE Score", "Walk-in Interview").
 */
export function isInterviewOnlySchedule(rawStr) {
  const lower = String(rawStr || '').trim().toLowerCase();
  if (!lower) return false;
  const hasInterview = /(interview|walk[- ]?in|நேர்காணல்|நேரடி\s*நேர்காணல்)/i.test(lower);
  const hasExam = /(cbt|computer\s*based|written|prelim|main|tier\s*[iI\d]|stage\s*[iI\d]|cee\s*exam|objective|எழுத்துத்\s*தேர்வு)/i.test(lower);
  return hasInterview && !hasExam;
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

  const monthKeys = Object.keys(ALL_MONTH_MAP).join('|');
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
    const monthNum = ALL_MONTH_MAP[sharedMatch[2].toLowerCase()];
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
    `(?<![A-Za-z\u0B80-\u0BFF])(${monthKeys})\\s+((?:\\d{1,2}(?:st|nd|rd|th)?\\s*(?:,|&|\\band\\b)\\s*)+\\d{1,2}(?:st|nd|rd|th)?),?\\s+(\\d{4})(?!\\d)`,
    'gi'
  );
  while ((sharedMatch = sharedMonthDayPattern.exec(rawStr)) !== null) {
    const spanStart = sharedMatch.index;
    const spanEnd = spanStart + sharedMatch[0].length;
    if (overlapsExistingSpan(spanStart, spanEnd)) continue;
    matchedSpans.push([spanStart, spanEnd]);
    hasSharedMonthGroup = true;

    const monthNum = ALL_MONTH_MAP[sharedMatch[1].toLowerCase()];
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

export function isGenericRootHomepage(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

    // Normalize pathname: remove trailing slashes
    const rawPath = parsed.pathname || '';
    const pathname = rawPath.replace(/\/+$/, '').toLowerCase();

    // Generic root or default homepage index paths across any web server
    const isRoot = !pathname || pathname === '' || pathname === '/';
    const isIndexOrHome = (
      pathname === '/index.html' ||
      pathname === '/index.htm' ||
      pathname === '/index.php' ||
      pathname === '/index.aspx' ||
      pathname === '/index.jsp' ||
      pathname === '/home' ||
      pathname === '/home.html' ||
      pathname === '/home.htm' ||
      pathname === '/home.aspx' ||
      pathname === '/home.php' ||
      pathname === '/home.jsp' ||
      pathname === '/default.aspx' ||
      pathname === '/default.html' ||
      pathname === '/default.htm' ||
      pathname === '/default.php' ||
      pathname === '/main.html' ||
      pathname === '/main.aspx' ||
      pathname === '/main.php'
    );

    return Boolean(isRoot || isIndexOrHome);
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
  const result = _calculateExamStatusInner(examDateInput, rawTodayObj, options);
  let dateStatus = DATE_STATUS.VERIFIED;
  if (result.isInvalid || result.status === 'INVALID_DATE') {
    dateStatus = DATE_STATUS.INVALID;
  } else if (result.status === 'NOT_ANNOUNCED') {
    const rawStr = examDateInput ? String(examDateInput).trim().toLowerCase() : '';
    const isDescriptive = rawStr && !rawStr.includes('soon') && !rawStr.includes('அறிவிக்கப்படவில்லை') && !rawStr.includes('not_announced');
    dateStatus = isDescriptive ? DATE_STATUS.NEEDS_REVIEW : DATE_STATUS.NOT_ANNOUNCED;
  } else if (result.isFutureMonth || result.isDatePending) {
    dateStatus = DATE_STATUS.NEEDS_REVIEW;
  } else {
    dateStatus = DATE_STATUS.VERIFIED;
  }
  return { ...result, dateStatus };
}

function _calculateExamStatusInner(examDateInput, rawTodayObj = getKolkataToday(), options = {}) {
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

  // Missing or genuine text-only (e.g. "Announced Soon" / "January 2027" / "December 2026")
  if (!parsedRange.startDate) {
    const isDescriptive = rawStr && !lowerStr.includes('soon') && !lowerStr.includes('அறிவிக்கப்படவில்லை');
    const isInterviewOnly = isInterviewOnlySchedule(rawStr);

    if (isInterviewOnly) {
      return {
        code: 'NOT_APPLICABLE',
        status: 'NOT_APPLICABLE',
        label: isEn ? `📅 Exam: Not Applicable (${rawStr})` : `📅 தேர்வு: பொருந்தாது (${rawStr})`,
        shortLabel: isEn ? 'Not Applicable' : 'தேர்வு இல்லை',
        displayDate: rawStr,
        countdown: isEn ? `Selection via ${rawStr}` : `மதிப்பீடு: ${rawStr}`,
        badgeClass: 'status-badge-exam-unannounced',
        tagColor: '#64748b',
        tagBg: '#f8fafc',
        tagBorder: '#cbd5e1',
        isUpcoming: false,
        isToday: false,
        isCompleted: false,
        isInvalid: false,
        isInterviewOnly: true,
        parsedDates: [],
        scheduleDisplay: rawStr,
        daysRemaining: null
      };
    }

    const isFutureSchedule = hasFutureMonthOrPendingStage(rawStr, todayObj);

    if (isFutureSchedule) {
      return {
        code: 'UPCOMING',
        status: 'UPCOMING',
        label: isEn ? `📅 Exam: ${rawStr} (Schedule Pending)` : `📅 தேர்வு: ${rawStr} (அட்டவணை விரைவில்)`,
        shortLabel: rawStr,
        displayDate: rawStr,
        countdown: isEn ? `Exam: ${rawStr} (Schedule Pending)` : `தேர்வு விரைவில் (${rawStr})`,
        badgeClass: 'status-badge-exam-upcoming',
        tagColor: '#0284c7',
        tagBg: '#f0f9ff',
        tagBorder: '#bae6fd',
        isUpcoming: true,
        isToday: false,
        isCompleted: false,
        isInvalid: false,
        isFutureMonth: true,
        isDatePending: true,
        parsedDates: [],
        scheduleDisplay: rawStr,
        daysRemaining: null
      };
    }

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
 * Calculates dynamic Interview / Walk-in Status and countdown.
 *
 * Normalized status (`status`):
 * - UPCOMING: today < interviewStartDate
 * - TODAY: interviewStartDate <= today <= interviewEndDate
 * - COMPLETED: today > interviewEndDate
 * - NOT_ANNOUNCED: missing or genuine text placeholder
 * - INVALID_DATE: invalid calendar date
 */
export function calculateInterviewStatus(interviewDateInput, rawTodayObj = getKolkataToday(), options = {}) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const lang = normalizeLanguage(options.lang);
  const isEn = lang === 'en';

  const rawStr = interviewDateInput ? String(interviewDateInput).trim() : '';
  if (!rawStr) {
    return {
      code: 'NOT_ANNOUNCED',
      status: 'NOT_ANNOUNCED',
      label: isEn ? '🎙️ Interview: Not Announced' : '🎙️ நேர்காணல்: அறிவிக்கப்படவில்லை',
      shortLabel: isEn ? 'Not Announced' : 'அறிவிக்கப்படவில்லை',
      displayDate: '',
      countdown: '',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      hasDate: false,
      tagColor: '#64748b',
      tagBg: '#f8fafc',
      tagBorder: '#cbd5e1'
    };
  }

  const parsedRange = parseAllDatesDetailed(rawStr);
  if (parsedRange.hasInvalidCalendarDate || parsedRange.kind === 'invalid_calendar') {
    return {
      code: 'INVALID_DATE',
      status: 'INVALID_DATE',
      label: isEn ? '⚠️ Invalid Interview Date' : '⚠️ தவறான நேர்காணல் தேதி (Invalid Date)',
      shortLabel: isEn ? 'Invalid Date' : 'தவறான தேதி',
      displayDate: `⚠️ ${rawStr} (Invalid Date)`,
      countdown: isEn ? 'Verify Interview Date (Admin Review Required)' : 'நேர்காணல் தேதியை சரிபார்க்கவும் (Admin Review Required)',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: true,
      hasDate: false,
      tagColor: '#b91c1c',
      tagBg: '#fef2f2',
      tagBorder: '#fca5a5'
    };
  }

  if (!parsedRange.startDate) {
    const isFutureInterview = hasFutureMonthOrPendingStage(rawStr, todayObj);
    if (isFutureInterview) {
      return {
        code: 'UPCOMING',
        status: 'UPCOMING',
        label: isEn ? `🎙️ Interview: ${rawStr}` : `🎙️ நேர்காணல்: ${rawStr}`,
        shortLabel: rawStr,
        displayDate: rawStr,
        countdown: isEn ? `Interview: ${rawStr} (Pending Schedule)` : `நேர்காணல் விரைவில் (${rawStr})`,
        isUpcoming: true,
        isToday: false,
        isCompleted: false,
        isInvalid: false,
        hasDate: true,
        isDatePending: true,
        tagColor: '#7c3aed',
        tagBg: '#f5f3ff',
        tagBorder: '#ddd6fe'
      };
    }

    return {
      code: 'NOT_ANNOUNCED',
      status: 'NOT_ANNOUNCED',
      label: isEn ? `🎙️ Interview: ${rawStr}` : `🎙️ நேர்காணல்: ${rawStr}`,
      shortLabel: rawStr,
      displayDate: rawStr,
      countdown: '',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      hasDate: false,
      tagColor: '#475569',
      tagBg: '#f8fafc',
      tagBorder: '#e2e8f0'
    };
  }

  const startComp = parsedRange.startDate;
  const endComp = parsedRange.endDate || startComp;
  const displayFormatted = parsedRange.isRange
    ? formatDisplayDate(rawStr, { lang })
    : startComp.displayDate;

  if (todayObj.epochDays < startComp.epochDays) {
    const daysRemaining = startComp.epochDays - todayObj.epochDays;
    return {
      code: 'UPCOMING',
      status: 'UPCOMING',
      label: isEn ? '🎙️ Upcoming Interview' : '🎙️ நேர்காணல் நடைபெற உள்ளது',
      shortLabel: isEn ? 'Upcoming Interview' : 'நேர்காணல் விரைவில்',
      displayDate: displayFormatted,
      countdown: isEn
        ? `🎙️ ${daysRemaining} ${daysRemaining === 1 ? 'Day' : 'Days'} Remaining`
        : `🎙️ நேர்காணலுக்கு இன்னும் ${daysRemaining} நாட்கள்`,
      isUpcoming: true,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      hasDate: true,
      earliestEpochDays: startComp.epochDays,
      latestEpochDays: endComp.epochDays,
      daysRemaining,
      tagColor: '#7c3aed',
      tagBg: '#f5f3ff',
      tagBorder: '#ddd6fe'
    };
  }

  if (todayObj.epochDays >= startComp.epochDays && todayObj.epochDays <= endComp.epochDays) {
    return {
      code: 'TODAY',
      status: 'TODAY',
      label: isEn ? '🟠 Interview Today' : '🟠 இன்று நேர்காணல்',
      shortLabel: isEn ? 'Interview Today' : 'இன்று நேர்காணல்',
      displayDate: displayFormatted,
      countdown: isEn ? '🟠 Interview Today' : '🟠 இன்று நேர்காணல் நடைபெறுகிறது',
      isUpcoming: false,
      isToday: true,
      isCompleted: false,
      isInvalid: false,
      hasDate: true,
      earliestEpochDays: startComp.epochDays,
      latestEpochDays: endComp.epochDays,
      daysRemaining: 0,
      tagColor: '#ea580c',
      tagBg: '#fff7ed',
      tagBorder: '#ffedd5'
    };
  }

  const daysPassed = todayObj.epochDays - endComp.epochDays;
  return {
    code: 'INTERVIEW_COMPLETED',
    status: 'COMPLETED',
    label: isEn ? '🔴 Interview Completed' : '🔴 நேர்காணல் முடிந்தது',
    shortLabel: isEn ? 'Interview Completed' : 'நேர்காணல் முடிந்தது',
    displayDate: displayFormatted,
    countdown: isEn ? '🔴 Interview Completed' : '🔴 நேர்காணல் முடிந்தது',
    isUpcoming: false,
    isToday: false,
    isCompleted: true,
    isInvalid: false,
    hasDate: true,
    earliestEpochDays: startComp.epochDays,
    latestEpochDays: endComp.epochDays,
    daysRemaining: 0,
    daysPassed,
    tagColor: '#dc2626',
    tagBg: '#fef2f2',
    tagBorder: '#fecaca'
  };
}

/**
 * Calculates dynamic Document Verification / Selection / Counselling status.
 */
export function calculateSelectionStatus(dateInput, rawTodayObj = getKolkataToday(), options = {}) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const lang = normalizeLanguage(options.lang);

  const rawStr = dateInput ? String(dateInput).trim() : '';
  if (!rawStr) {
    return {
      status: 'NOT_ANNOUNCED',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      hasDate: false,
      displayDate: ''
    };
  }

  const parsedRange = parseAllDatesDetailed(rawStr);
  if (parsedRange.hasInvalidCalendarDate || parsedRange.kind === 'invalid_calendar') {
    return {
      status: 'INVALID_DATE',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: true,
      hasDate: false,
      displayDate: `⚠️ ${rawStr} (Invalid Date)`
    };
  }

  if (!parsedRange.startDate) {
    return {
      status: 'NOT_ANNOUNCED',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      hasDate: false,
      displayDate: rawStr
    };
  }

  const startComp = parsedRange.startDate;
  const endComp = parsedRange.endDate || startComp;
  const displayFormatted = parsedRange.isRange
    ? formatDisplayDate(rawStr, { lang })
    : startComp.displayDate;

  if (todayObj.epochDays < startComp.epochDays) {
    return {
      status: 'UPCOMING',
      isUpcoming: true,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      hasDate: true,
      displayDate: displayFormatted,
      daysRemaining: startComp.epochDays - todayObj.epochDays
    };
  }

  if (todayObj.epochDays >= startComp.epochDays && todayObj.epochDays <= endComp.epochDays) {
    return {
      status: 'TODAY',
      isUpcoming: false,
      isToday: true,
      isCompleted: false,
      isInvalid: false,
      hasDate: true,
      displayDate: displayFormatted,
      daysRemaining: 0
    };
  }

  return {
    status: 'COMPLETED',
    isUpcoming: false,
    isToday: false,
    isCompleted: true,
    isInvalid: false,
    hasDate: true,
    displayDate: displayFormatted,
    daysRemaining: 0,
    daysPassed: todayObj.epochDays - endComp.epochDays
  };
}

/**
 * Extracts distinct Prelims and Mains (or Single) exam stage dates from raw exam schedule strings
 * or dedicated notification fields.
 *
 * @param {string} rawExamStr
 * @param {Object} [notif={}]
 * @returns {{ prelimsRaw: string, mainsRaw: string, isMultiStage: boolean, source: string }}
 */
export function extractExamStages(rawExamStr, notif = {}) {
  const prelimsField = notif.prelimsExamDate || notif.prelimsDate || notif.tier1ExamDate || notif.tier1Date || notif.stage1ExamDate || notif.stage1Date || '';
  const mainsField = notif.mainsExamDate || notif.mainsDate || notif.tier2ExamDate || notif.tier2Date || notif.stage2ExamDate || notif.stage2Date || '';

  if (prelimsField || mainsField) {
    return {
      prelimsRaw: String(prelimsField).trim(),
      mainsRaw: String(mainsField).trim(),
      isMultiStage: Boolean(mainsField),
      source: 'fields'
    };
  }

  const str = String(rawExamStr || '').trim();
  if (!str) {
    return {
      prelimsRaw: '',
      mainsRaw: '',
      isMultiStage: false,
      source: 'none'
    };
  }

  const hasStageIndicators = /(?:prelim|stage\s*[iI1]|tier\s*[iI1]).*(?:main|stage\s*[iI]{2}|tier\s*[iI]{2}|stage\s*2|tier\s*2)/i.test(str) ||
    /(?:main|stage\s*[iI]{2}|tier\s*[iI]{2}|stage\s*2|tier\s*2).*(?:prelim|stage\s*[iI1]|tier\s*[iI1])/i.test(str);

  if (hasStageIndicators) {
    // Pattern A: <date text> (Prelims / Stage I) ... <date text> (Mains / Stage II)
    const patternA = /(.*?)\s*\((?:prelims?|stage\s*[iI1]|tier\s*[iI1])\)[^&,\w]*(?:&|and|,)?\s*(.*?)\s*\((?:mains?|stage\s*[iI]{2}|stage\s*2|tier\s*[iI]{2}|tier\s*2)\)/i;
    const matchA = str.match(patternA);
    if (matchA) {
      return {
        prelimsRaw: matchA[1].trim(),
        mainsRaw: matchA[2].trim(),
        isMultiStage: true,
        source: 'pattern_suffix'
      };
    }

    // Pattern B: Prelims: <date text> [;&,] Mains: <date text>
    const patternB = /(?:prelims?|stage\s*[iI1]|tier\s*[iI1])[:\s-]+(.*?)(?:[;&,]|and)\s*(?:mains?|stage\s*[iI]{2}|stage\s*2|tier\s*[iI]{2}|tier\s*2)[:\s-]+(.*)/i;
    const matchB = str.match(patternB);
    if (matchB) {
      return {
        prelimsRaw: matchB[1].trim(),
        mainsRaw: matchB[2].trim(),
        isMultiStage: true,
        source: 'pattern_prefix'
      };
    }

    // Pattern C: Stage I (Preliminary) on <date text> & Stage II on <date text>
    const patternC = /(?:stage\s*[iI1]|tier\s*[iI1]).*?(?:on|dated|:)\s*(.*?)(?:&|and|,)\s*(?:stage\s*[iI]{2}|stage\s*2|tier\s*[iI]{2}|tier\s*2).*?(?:on|dated|:)\s*(.*)/i;
    const matchC = str.match(patternC);
    if (matchC) {
      return {
        prelimsRaw: matchC[1].trim(),
        mainsRaw: matchC[2].trim(),
        isMultiStage: true,
        source: 'pattern_inline'
      };
    }
  }

  return {
    prelimsRaw: str,
    mainsRaw: '',
    isMultiStage: false,
    source: 'single'
  };
}

/**
 * Evaluates whether a recruitment notification is CURRENT/ACTIVE.
 *
 * A notification is active if it meets AT LEAST ONE of the following 4 rules:
 * 1. Application is currently open (start <= today <= closing deadline).
 * 2. Confirmed upcoming/today Exam date (examDate >= today or upcoming Prelims/Mains).
 * 3. Confirmed upcoming/today Interview or Walk-in date (interviewDate >= today).
 * 4. Confirmed upcoming/today Document Verification, Selection, or Counselling date.
 *
 * If none of the 4 conditions are met, the notification is EXPIRED/INACTIVE.
 *
 * @param {Object} notif
 * @param {Object} [todayObj=getKolkataToday()]
 * @param {Object} [options={}]
 * @returns {boolean}
 */
export function isNotificationActive(notif, rawTodayObj = getKolkataToday(), options = {}) {
  if (!notif) return false;
  const todayObj = resolveTodayObject(rawTodayObj);

  const openInput = notif.openingDate || notif.applicationStartDate || '';
  const closeInput = notif.closingDate || notif.applicationEndDate || notif.applicationLastDate || '';
  const appStatus = calculateApplicationStatus(openInput, closeInput, todayObj, {
    extendedClosingDate: notif.extendedClosingDate || notif.extendedLastDate || notif.revisedClosingDate || '',
    isExtensionVerified: notif.isExtensionVerified,
    extensionVerified: notif.extensionVerified,
    corrigendumVerified: notif.corrigendumVerified
  });

  // Rule 1: Application currently open
  if (appStatus.isOpen && !appStatus.isExpired) {
    return true;
  }

  // Rule 2: Future / today exam (supports multi-stage: prelims or mains)
  const examStages = extractExamStages(notif.examDate, notif);
  if (examStages.prelimsRaw) {
    const prelimsStatus = calculateExamStatus(examStages.prelimsRaw, todayObj);
    if (prelimsStatus.isUpcoming || prelimsStatus.isToday) return true;
  }
  if (examStages.mainsRaw) {
    const mainsStatus = calculateExamStatus(examStages.mainsRaw, todayObj);
    if (mainsStatus.isUpcoming || mainsStatus.isToday) return true;
  }
  const examDateInput = notif.examDate || '';
  if (examDateInput) {
    const examStatus = calculateExamStatus(examDateInput, todayObj);
    if (examStatus.isUpcoming || examStatus.isToday) {
      return true;
    }
  }

  // Rule 3: Future / today interview or walk-in (only if applicable)
  const isInterviewApplicable = notif.interviewApplicable !== false && notif.interviewNotApplicable !== true;
  const interviewDateInput = notif.interviewDate || notif.walkInDate || '';
  if (isInterviewApplicable && interviewDateInput) {
    const interviewStatus = calculateInterviewStatus(interviewDateInput, todayObj);
    if (interviewStatus.isUpcoming || interviewStatus.isToday) {
      return true;
    }
  }

  // Also check if examDate text itself has interview schedule
  if (isInterviewApplicable && examDateInput && isInterviewOrScheduleText(examDateInput)) {
    const interviewStatus = calculateInterviewStatus(examDateInput, todayObj);
    if (interviewStatus.isUpcoming || interviewStatus.isToday) {
      return true;
    }
  }

  // Rule 4: Future / today selection / document verification / counselling
  const selectionDateInput = notif.documentVerificationDate || notif.dvDate || notif.selectionDate || notif.counsellingDate || '';
  if (selectionDateInput) {
    const selStatus = calculateSelectionStatus(selectionDateInput, todayObj);
    if (selStatus.isUpcoming || selStatus.isToday) {
      return true;
    }
  }

  return false;
}

/**
 * Classifies a notification into public and admin lifecycle queues.
 *
 * @param {Object} notif
 * @param {Object} [todayObj=getKolkataToday()]
 * @returns {Object}
 */
export function classifyNotificationQueues(notif, rawTodayObj = getKolkataToday()) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const active = isNotificationActive(notif, todayObj);

  const openInput = notif.openingDate || notif.applicationStartDate || '';
  const closeInput = notif.closingDate || notif.applicationEndDate || notif.applicationLastDate || '';
  const appStatus = calculateApplicationStatus(openInput, closeInput, todayObj, {
    extendedClosingDate: notif.extendedClosingDate || notif.extendedLastDate || notif.revisedClosingDate || ''
  });
  const examStatus = calculateExamStatus(notif.examDate, todayObj);
  const interviewStatus = calculateInterviewStatus(notif.interviewDate || notif.walkInDate, todayObj);

  const hasInvalidDates = Boolean(appStatus.isInvalid || examStatus.isInvalid || interviewStatus.isInvalid);
  const hasMissingDeadline = Boolean(appStatus.hasMissingDeadline && !examStatus.isUpcoming && !interviewStatus.isUpcoming);
  const hasPendingDateVerification = Boolean(examStatus.isFutureMonth || examStatus.isDatePending || interviewStatus.isDatePending);
  const needsDateVerification = hasInvalidDates || hasMissingDeadline || hasPendingDateVerification || !openInput || !closeInput;

  const isQuarantined = Boolean(
    notif.isQuarantined ||
    notif.quarantined ||
    notif.status === 'quarantined' ||
    notif.ingestionStatus === 'quarantined'
  );

  const isPendingReview = notif.ingestionStatus === 'pending_review';
  const isApproved = notif.ingestionStatus === 'published' || notif.isVerified === true || (!notif.ingestionStatus && notif.status !== 'quarantined' && notif.status !== 'rejected');

  let adminQueue = 'current_pending';
  if (isQuarantined) {
    adminQueue = 'quarantined';
  } else if (isPendingReview) {
    if (!active) {
      adminQueue = 'expired_pending_review';
    } else if (needsDateVerification) {
      adminQueue = 'missing_date_verification';
    } else {
      adminQueue = 'current_pending';
    }
  } else {
    adminQueue = active ? 'published_active' : 'archived_expired';
  }

  const isClosingSoon = Boolean(
    appStatus.isOpen &&
    !appStatus.isExpired &&
    appStatus.daysRemaining !== null &&
    appStatus.daysRemaining <= 5 &&
    appStatus.daysRemaining >= 0
  );

  return {
    isNotificationActive: active,
    isExpired: !active,
    needsDateVerification,
    adminQueue,
    isClosingSoon,
    isPublicActive: Boolean(active && isApproved && !isQuarantined && !isPendingReview),
    appStatus,
    examStatus,
    interviewStatus
  };
}

/**
 * Calculates dynamic multi-stage recruitment timeline, next important event,
 * and overall recruitment stage code based on Asia/Kolkata date calculations.
 *
 * @param {Object} notif
 * @param {Object} [rawTodayObj=getKolkataToday()]
 * @param {Object} [options={}]
 * @returns {Object}
 */
export function calculateRecruitmentStageTimeline(notif, rawTodayObj = getKolkataToday(), options = {}) {
  const todayObj = resolveTodayObject(rawTodayObj);
  const lang = normalizeLanguage(options.lang ?? notif?.lang);
  const isEn = lang === 'en';

  if (!notif) {
    return {
      examStages: { prelimsRaw: '', mainsRaw: '', isMultiStage: false, source: 'none' },
      prelimsStatus: { status: 'NOT_ANNOUNCED', isUpcoming: false, isToday: false, isCompleted: false, isInvalid: false, hasDate: false, displayDate: '' },
      mainsStatus: { status: 'NOT_APPLICABLE', isUpcoming: false, isToday: false, isCompleted: false, isInvalid: false, hasDate: false, displayDate: '' },
      interviewStatus: { status: 'NOT_APPLICABLE', isUpcoming: false, isToday: false, isCompleted: false, isInvalid: false, hasDate: false, displayDate: '' },
      selectionStatus: { status: 'NOT_ANNOUNCED', isUpcoming: false, isToday: false, isCompleted: false, isInvalid: false, hasDate: false, displayDate: '' },
      resultStatus: { status: 'NOT_PUBLISHED', isPublished: false, displayDate: '' },
      timeline: [],
      nextImportantEvent: null,
      overallStageCode: RECRUITMENT_STAGES.APPLICATION_NOT_STARTED,
      overallStageLabel: isEn ? 'Not Started' : 'தொடங்கவில்லை',
      isInterviewApplicable: true
    };
  }

  const openInput = notif.openingDate || notif.applicationStartDate || '';
  const closeInput = notif.closingDate || notif.applicationEndDate || '';
  const appStatus = calculateApplicationStatus(openInput, closeInput, todayObj, {
    extendedClosingDate: notif.extendedClosingDate || notif.extendedLastDate || notif.revisedClosingDate || '',
    isExtensionVerified: notif.isExtensionVerified,
    extensionVerified: notif.extensionVerified,
    corrigendumVerified: notif.corrigendumVerified,
    lang
  });

  const examStages = extractExamStages(notif.examDate, notif);
  const prelimsStatus = examStages.prelimsRaw
    ? calculateExamStatus(examStages.prelimsRaw, todayObj, { lang })
    : { status: 'NOT_ANNOUNCED', isUpcoming: false, isToday: false, isCompleted: false, isInvalid: false, hasDate: false, displayDate: '' };

  let mainsStatus = null;
  if (examStages.mainsRaw) {
    mainsStatus = calculateExamStatus(examStages.mainsRaw, todayObj, { lang });
  } else if (examStages.isMultiStage) {
    mainsStatus = { status: 'NOT_ANNOUNCED', isUpcoming: false, isToday: false, isCompleted: false, isInvalid: false, hasDate: false, displayDate: '' };
  } else {
    mainsStatus = { status: 'NOT_APPLICABLE', isUpcoming: false, isToday: false, isCompleted: false, isInvalid: false, hasDate: false, displayDate: '' };
  }

  const isInterviewApplicable = notif.interviewApplicable !== false && notif.interviewNotApplicable !== true;
  let interviewStatus = null;
  if (!isInterviewApplicable) {
    interviewStatus = {
      code: 'NOT_APPLICABLE',
      status: 'NOT_APPLICABLE',
      isApplicable: false,
      label: isEn ? '⚪ Interview: Not Applicable' : '⚪ நேர்காணல்: பொருந்தாது (Not Applicable)',
      shortLabel: isEn ? 'Not Applicable' : 'பொருந்தாது',
      displayDate: isEn ? 'Not Applicable' : 'பொருந்தாது',
      countdown: '',
      isUpcoming: false,
      isToday: false,
      isCompleted: false,
      isInvalid: false,
      hasDate: false,
      tagColor: '#64748b',
      tagBg: '#f8fafc',
      tagBorder: '#e2e8f0'
    };
  } else {
    const interviewCandidate = notif.interviewDate || notif.walkInDate || (isInterviewOrScheduleText(notif.examDate) ? notif.examDate : '');
    interviewStatus = calculateInterviewStatus(interviewCandidate, todayObj, { lang });
  }

  const selectionDateInput = notif.documentVerificationDate || notif.dvDate || notif.selectionDate || notif.counsellingDate || '';
  const selectionStatus = calculateSelectionStatus(selectionDateInput, todayObj, { lang });
  const resultStatus = calculateResultStatus(notif, todayObj, { lang });

  // Build Chronological Timeline Milestones
  const timeline = [];

  // 1. Application Open
  const openComp = parseDateToComponents(openInput);
  if (openComp) {
    timeline.push({
      stageKey: 'APPLICATION_START',
      title: isEn ? 'Application Opens' : 'விண்ணப்பத் தொடக்கம்',
      displayDate: openComp.displayDate,
      epochDays: openComp.epochDays,
      status: todayObj.epochDays < openComp.epochDays ? 'UPCOMING' : (todayObj.epochDays === openComp.epochDays ? 'TODAY' : 'COMPLETED'),
      daysRemaining: Math.max(0, openComp.epochDays - todayObj.epochDays)
    });
  }

  // 2. Application Close
  const closeRaw = appStatus.hasExtendedDeadline && appStatus.effectiveClosingDate ? appStatus.effectiveClosingDate : closeInput;
  const closeComp = parseDateToComponents(closeRaw);
  if (closeComp) {
    timeline.push({
      stageKey: 'APPLICATION_DEADLINE',
      title: isEn ? 'Application Deadline' : 'விண்ணப்பிக்க கடைசி தேதி',
      displayDate: closeComp.displayDate,
      epochDays: closeComp.epochDays,
      status: appStatus.isOpen ? (appStatus.isToday ? 'TODAY' : 'UPCOMING') : 'COMPLETED',
      daysRemaining: Math.max(0, closeComp.epochDays - todayObj.epochDays)
    });
  }

  // 3. Prelims / Single Exam
  if (prelimsStatus && prelimsStatus.earliestEpochDays && !prelimsStatus.isInvalid) {
    timeline.push({
      stageKey: examStages.isMultiStage ? 'PRELIMS_EXAM' : 'EXAM',
      title: examStages.isMultiStage ? (isEn ? 'Preliminary Exam (Prelims)' : 'முதல்நிலைத் தேர்வு (Prelims)') : (isEn ? 'Written Examination' : 'எழுத்துத் தேர்வு'),
      displayDate: prelimsStatus.displayDate,
      epochDays: prelimsStatus.earliestEpochDays,
      status: prelimsStatus.status,
      daysRemaining: prelimsStatus.isUpcoming ? prelimsStatus.daysRemaining : 0
    });
  }

  // 4. Mains Exam
  if (mainsStatus && mainsStatus.earliestEpochDays && !mainsStatus.isInvalid) {
    timeline.push({
      stageKey: 'MAINS_EXAM',
      title: isEn ? 'Main Examination (Mains)' : 'முதன்மைத் தேர்வு (Mains)',
      displayDate: mainsStatus.displayDate,
      epochDays: mainsStatus.earliestEpochDays,
      status: mainsStatus.status,
      daysRemaining: mainsStatus.isUpcoming ? mainsStatus.daysRemaining : 0
    });
  }

  // 5. Interview
  if (interviewStatus && interviewStatus.hasDate && interviewStatus.earliestEpochDays && isInterviewApplicable) {
    timeline.push({
      stageKey: 'INTERVIEW',
      title: isEn ? 'Interview / Personality Test' : 'நேர்காணல் தேர்வு',
      displayDate: interviewStatus.displayDate,
      epochDays: interviewStatus.earliestEpochDays,
      status: interviewStatus.status,
      daysRemaining: interviewStatus.isUpcoming ? interviewStatus.daysRemaining : 0
    });
  }

  // 6. DV / Selection
  if (selectionStatus && selectionStatus.hasDate) {
    const selComp = parseDateToComponents(selectionDateInput);
    if (selComp) {
      timeline.push({
        stageKey: 'DOCUMENT_VERIFICATION',
        title: isEn ? 'Document Verification' : 'சான்றிதழ் சரிபார்ப்பு',
        displayDate: selectionStatus.displayDate,
        epochDays: selComp.epochDays,
        status: selectionStatus.status,
        daysRemaining: selectionStatus.isUpcoming ? selectionStatus.daysRemaining : 0
      });
    }
  }

  // Sort timeline chronologically
  timeline.sort((a, b) => a.epochDays - b.epochDays);

  // Determine nextImportantEvent: earliest milestone where epochDays >= todayObj.epochDays
  let nextImportantEvent = null;
  const upcomingMilestones = timeline.filter(m => m.epochDays >= todayObj.epochDays && m.status !== 'COMPLETED');
  if (upcomingMilestones.length > 0) {
    const next = upcomingMilestones[0];
    const daysRemaining = next.epochDays - todayObj.epochDays;
    const isToday = daysRemaining === 0;
    const badgeText = isToday
      ? (isEn ? `🔔 Today's Event: ${next.title} (${next.displayDate})` : `🔔 இன்றைய நிகழ்வு: ${next.title} (${next.displayDate})`)
      : (isEn
        ? `⏳ Next Event: ${next.title} in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} (${next.displayDate})`
        : `⏳ அடுத்த முக்கிய நிகழ்வு: ${next.title} — ${next.displayDate} (இன்னும் ${daysRemaining} நாட்கள்)`);

    nextImportantEvent = {
      stageKey: next.stageKey,
      title: next.title,
      displayDate: next.displayDate,
      epochDays: next.epochDays,
      daysRemaining,
      isToday,
      badgeText
    };
  }

  // Determine overallStageCode
  let overallStageCode = RECRUITMENT_STAGES.APPLICATION_NOT_STARTED;
  let overallStageLabel = isEn ? 'Application Not Started' : 'விண்ணப்பம் தொடங்கவில்லை';

  if (notif.isCancelled || notif.status === 'cancelled') {
    overallStageCode = RECRUITMENT_STAGES.RECRUITMENT_CANCELLED;
    overallStageLabel = isEn ? 'Recruitment Cancelled' : 'அறிவிப்பு ரத்து செய்யப்பட்டது';
  } else if (appStatus.isOpen && !appStatus.isExpired) {
    overallStageCode = RECRUITMENT_STAGES.APPLICATION_OPEN;
    overallStageLabel = isEn ? 'Application Open' : 'விண்ணப்பம் நடைபெறுகிறது';
  } else if (appStatus.status === 'NOT_STARTED') {
    overallStageCode = RECRUITMENT_STAGES.APPLICATION_NOT_STARTED;
    overallStageLabel = isEn ? 'Application Not Started' : 'விண்ணப்பம் தொடங்கவில்லை';
  } else if (appStatus.isExpired) {
    // Application is closed. Where are we in the examination/interview cycle?
    if (examStages.isMultiStage) {
      if (prelimsStatus.isUpcoming || prelimsStatus.isToday) {
        overallStageCode = RECRUITMENT_STAGES.PRELIMS_UPCOMING;
        overallStageLabel = isEn ? 'Prelims Upcoming' : 'முதல்நிலைத் தேர்வு நடைபெற உள்ளது';
      } else if (prelimsStatus.isCompleted && (mainsStatus.isUpcoming || mainsStatus.isToday)) {
        overallStageCode = RECRUITMENT_STAGES.MAINS_UPCOMING;
        overallStageLabel = isEn ? 'Mains Upcoming' : 'முதன்மைத் தேர்வு நடைபெற உள்ளது';
      } else if (prelimsStatus.isCompleted && mainsStatus.isCompleted) {
        if (isInterviewApplicable && (interviewStatus.isUpcoming || interviewStatus.isToday)) {
          overallStageCode = RECRUITMENT_STAGES.INTERVIEW_UPCOMING;
          overallStageLabel = isEn ? 'Interview Upcoming' : 'நேர்காணல் நடைபெற உள்ளது';
        } else if (isInterviewApplicable && interviewStatus.isCompleted) {
          overallStageCode = resultStatus.isPublished ? RECRUITMENT_STAGES.FINAL_SELECTION_COMPLETED : RECRUITMENT_STAGES.RESULT_AWAITED;
          overallStageLabel = resultStatus.isPublished ? (isEn ? 'Final Selection Completed' : 'இறுதித் தேர்வு முடிந்தது') : (isEn ? 'Result Awaited' : 'முடிவுகள் எதிர்பார்க்கப்படுகிறது');
        } else if (!isInterviewApplicable) {
          overallStageCode = resultStatus.isPublished ? RECRUITMENT_STAGES.FINAL_SELECTION_COMPLETED : RECRUITMENT_STAGES.RESULT_AWAITED;
          overallStageLabel = resultStatus.isPublished ? (isEn ? 'Final Selection Completed' : 'இறுதித் தேர்வு முடிந்தது') : (isEn ? 'Result Awaited' : 'முடிவுகள் எதிர்பார்க்கப்படுகிறது');
        } else {
          overallStageCode = RECRUITMENT_STAGES.MAINS_COMPLETED;
          overallStageLabel = isEn ? 'Mains Completed' : 'முதன்மைத் தேர்வு முடிந்தது';
        }
      } else {
        overallStageCode = RECRUITMENT_STAGES.APPLICATION_CLOSED;
        overallStageLabel = isEn ? 'Application Closed' : 'விண்ணப்ப காலம் முடிந்தது';
      }
    } else {
      // Single exam or no exam
      if (prelimsStatus.isUpcoming || prelimsStatus.isToday) {
        overallStageCode = RECRUITMENT_STAGES.PRELIMS_UPCOMING;
        overallStageLabel = isEn ? 'Exam Upcoming' : 'தேர்வு நடைபெற உள்ளது';
      } else if (isInterviewApplicable && (interviewStatus.isUpcoming || interviewStatus.isToday)) {
        overallStageCode = RECRUITMENT_STAGES.INTERVIEW_UPCOMING;
        overallStageLabel = isEn ? 'Interview Upcoming' : 'நேர்காணல் நடைபெற உள்ளது';
      } else if (prelimsStatus.isCompleted) {
        if (isInterviewApplicable && (interviewStatus.isUpcoming || interviewStatus.isToday)) {
          overallStageCode = RECRUITMENT_STAGES.INTERVIEW_UPCOMING;
          overallStageLabel = isEn ? 'Interview Upcoming' : 'நேர்காணல் நடைபெற உள்ளது';
        } else if (selectionStatus.isUpcoming || selectionStatus.isToday) {
          overallStageCode = RECRUITMENT_STAGES.DOCUMENT_VERIFICATION_UPCOMING;
          overallStageLabel = isEn ? 'Doc Verification Upcoming' : 'சான்றிதழ் சரிபார்ப்பு நடைபெற உள்ளது';
        } else if (resultStatus.isPublished) {
          overallStageCode = RECRUITMENT_STAGES.FINAL_SELECTION_COMPLETED;
          overallStageLabel = isEn ? 'Selection Completed' : 'தேர்வு முடிந்தது';
        } else {
          overallStageCode = RECRUITMENT_STAGES.RESULT_AWAITED;
          overallStageLabel = isEn ? 'Result Awaited' : 'முடிவுகள் எதிர்பார்க்கப்படுகிறது';
        }
      } else {
        overallStageCode = RECRUITMENT_STAGES.APPLICATION_CLOSED;
        overallStageLabel = isEn ? 'Application Closed' : 'விண்ணப்ப காலம் முடிந்தது';
      }
    }
  }

  return {
    examStages,
    prelimsStatus,
    mainsStatus,
    interviewStatus,
    selectionStatus,
    resultStatus,
    timeline,
    nextImportantEvent,
    overallStageCode,
    overallStageLabel,
    isInterviewApplicable
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

  // Multi-stage conflict: Mains exam date before Prelims exam date
  const examStages = extractExamStages(notif.examDate, notif);
  if (examStages.prelimsRaw && examStages.mainsRaw) {
    const prelimsRange = parseAllDatesDetailed(examStages.prelimsRaw);
    const mainsRange = parseAllDatesDetailed(examStages.mainsRaw);
    if (prelimsRange.startDate && mainsRange.startDate && mainsRange.startDate.epochDays < prelimsRange.startDate.epochDays) {
      issues.push('MAINS_BEFORE_PRELIMS');
      warnings.push(
        isEn
          ? `⚠️ Admin Review Required: Main exam date (${mainsRange.startDate.displayDate}) is before Preliminary exam date (${prelimsRange.startDate.displayDate}).`
          : `⚠️ Admin சரிபார்ப்பு தேவை: முதன்மைத் தேர்வு தேதி (${mainsRange.startDate.displayDate}) முதல்நிலைத் தேர்வுக்கு (${prelimsRange.startDate.displayDate}) முன் உள்ளது.`
      );
      requiresCtaBlock = true;
    }
  }

  // Core requirement: Application is OPEN while Exam is COMPLETED
  let isAnyExamCompleted = examStatus.status === 'COMPLETED';
  if (examStages.prelimsRaw) {
    const pRange = parseAllDatesDetailed(examStages.prelimsRaw);
    if (pRange.endDate && pRange.endDate.epochDays < todayObj.epochDays) {
      isAnyExamCompleted = true;
    }
  }

  if (appStatus.status === 'OPEN' && isAnyExamCompleted) {
    if (!issues.includes('APPLICATION_OPEN_EXAM_COMPLETED')) {
      issues.push('APPLICATION_OPEN_EXAM_COMPLETED');
      warnings.push(
        isEn
          ? '⚠️ Admin Review Required: Application appears open while exam is marked completed.'
          : '⚠️ Admin சரிபார்ப்பு தேவை: விண்ணப்பம் திறந்த நிலையில் இருந்தாலும் தேர்வு முடிந்ததாகக் காட்டுகிறது. தேதி முரண்பாடு இருக்கலாம்.'
      );
      requiresCtaBlock = true;
    }
  }

  // Third-party source date vs official source conflict
  if ((notif.sourceType === 'third_party' || notif.isThirdParty === true) && (notif.isOfficialSourceVerified === false || notif.isVerified === false)) {
    issues.push('THIRD_PARTY_DATE_UNVERIFIED');
    warnings.push(
      isEn
        ? '⚠️ Third-party date source unverified by official notification — Admin Review Required.'
        : '⚠️ அதிகாரப்பூர்வ அறிவிப்பு இல்லாமல் மூன்றாம் தரப்பு தேதி உள்ளிடப்பட்டுள்ளது. Admin சரிபார்ப்பு தேவை.'
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
  const interviewCandidate = notif.interviewDate || notif.walkInDate || (isInterviewOrScheduleText(notif.examDate) ? notif.examDate : '');
  const interviewStatus = calculateInterviewStatus(interviewCandidate, todayObj, { lang });
  const selectionStatus = calculateSelectionStatus(notif.documentVerificationDate || notif.dvDate || notif.selectionDate || notif.counsellingDate, todayObj, { lang });
  const resultStatus = calculateResultStatus(notif, todayObj, { lang });
  const dateConsistency = evaluateNotificationDateConsistency(notif, appStatus, examStatus, resultStatus, todayObj, { lang });

  const active = isNotificationActive(notif, todayObj);
  const isExpired = !active;

  const formattedOpeningDate = formatDisplayDate(openInput, { lang });
  const effectiveClosingRaw = appStatus.hasExtendedDeadline && appStatus.effectiveClosingDate
    ? appStatus.effectiveClosingDate
    : closeInput;
  const formattedClosingDate = formatDisplayDate(effectiveClosingRaw, { lang });
  const formattedOriginalClosingDate = formatDisplayDate(notif.originalClosingDate || closeInput, { lang });
  const formattedExamDate = formatDisplayDate(notif.examDate, { lang });
  const formattedInterviewDate = formatDisplayDate(notif.interviewDate || notif.walkInDate, { lang });
  const formattedDvDate = formatDisplayDate(notif.documentVerificationDate || notif.dvDate || notif.selectionDate || notif.counsellingDate, { lang });
  const formattedNotificationDate = formatDisplayDate(notif.notificationDate || openInput, { lang });

  const hasValidApplyUrl = isSafeHttpUrl(notif.applyLink);
  const isQuarantined = Boolean(
    notif.isQuarantined ||
    notif.quarantined ||
    notif.status === 'quarantined' ||
    notif.ingestionStatus === 'quarantined' ||
    notif.trustStatus === 'quarantined'
  );
  const isPublished = Boolean(
    notif.published !== false &&
    notif.isPublished !== false &&
    notif.status !== 'draft' &&
    notif.ingestionStatus !== 'pending_review' &&
    notif.ingestionStatus !== 'rejected' &&
    notif.status !== 'rejected'
  );
  const isGenericNoticeUrl = isGenericRootHomepage(notif.detailsLink);
  const isGenericApplyUrl = isGenericRootHomepage(notif.applyLink);

  const hasSourceIntegrityIssue = Boolean(
    notif.hasSourceIntegrityIssue === true ||
    notif.sourceIntegrityVerified !== true ||
    notif.needsOfficialSource === true ||
    notif.isThirdParty === true ||
    notif.sourceType === 'third_party' ||
    notif.isHistoricalCycle === true ||
    notif.status === 'under_review' ||
    notif.evidenceClassification === 'NEEDS_OFFICIAL_SOURCE' ||
    notif.evidenceClassification === 'NEEDS_REVIEW_DISABLED' ||
    notif.evidenceClassification === 'OFFICIAL_CALENDAR_ONLY' ||
    notif.evidenceClassification === 'OLD_RECRUITMENT_CYCLE' ||
    notif.evidenceClassification === 'HISTORICAL_CYCLE' ||
    isGenericNoticeUrl ||
    isGenericApplyUrl
  );

  const hasOpeningDate = Boolean(openInput && String(openInput).trim().length > 0);
  const hasClosingDate = Boolean(closeInput && String(closeInput).trim().length > 0);
  const hasValidApplicationDates = Boolean(
    appStatus.status !== 'INVALID' &&
    !appStatus.isInvalid &&
    hasOpeningDate &&
    hasClosingDate &&
    !dateConsistency.issues.includes('MISSING_OPENING_DATE') &&
    !dateConsistency.issues.includes('INVALID_OPENING_DATE') &&
    !dateConsistency.issues.includes('MISSING_CLOSING_DATE') &&
    !dateConsistency.issues.includes('INVALID_CLOSING_DATE') &&
    !dateConsistency.issues.includes('CLOSING_BEFORE_OPENING')
  );

  // Unified Active Application & Apply CTA eligibility predicate (single source of truth)
  const isActiveApplication = Boolean(
    appStatus.isOpen === true &&
    appStatus.isExpired !== true &&
    !isQuarantined &&
    isPublished &&
    notif.isVerified !== false &&
    notif.isThirdParty !== true &&
    notif.sourceType !== 'third_party' &&
    notif.sourceIntegrityVerified === true &&
    notif.applicationDatesVerified === true &&
    notif.hasSourceIntegrityIssue !== true &&
    !hasSourceIntegrityIssue &&
    hasValidApplyUrl &&
    !isGenericApplyUrl &&
    !dateConsistency.requiresCtaBlock &&
    notif.evidenceClassification !== 'NEEDS_OFFICIAL_SOURCE' &&
    notif.evidenceClassification !== 'NEEDS_REVIEW_DISABLED' &&
    notif.evidenceClassification !== 'OFFICIAL_CALENDAR_ONLY' &&
    notif.evidenceClassification !== 'OLD_RECRUITMENT_CYCLE' &&
    notif.evidenceClassification !== 'HISTORICAL_CYCLE' &&
    hasValidApplicationDates
  );
  const canShowApplyCta = isActiveApplication;

  let applyCtaState = 'UNAVAILABLE';
  if (isQuarantined) {
    applyCtaState = 'QUARANTINED_DISABLED';
  } else if (canShowApplyCta) {
    applyCtaState = 'ACTIVE';
  } else if (appStatus.isExpired || appStatus.status === 'CLOSED') {
    applyCtaState = 'CLOSED';
  } else if (
    dateConsistency.requiresCtaBlock ||
    appStatus.isInvalid ||
    hasSourceIntegrityIssue ||
    !hasValidApplicationDates ||
    notif.applicationDatesVerified !== true ||
    notif.isVerified === false
  ) {
    applyCtaState = 'NEEDS_REVIEW_DISABLED';
  } else if (appStatus.status === 'NOT_STARTED') {
    applyCtaState = 'NOT_STARTED';
  }

  const isClosingSoon = Boolean(
    appStatus.isOpen &&
    !appStatus.isExpired &&
    appStatus.daysRemaining !== null &&
    appStatus.daysRemaining <= 5 &&
    appStatus.daysRemaining >= 0
  );
  const needsDateVerification = Boolean(
    dateConsistency.needsAdminReview ||
    appStatus.isInvalid ||
    examStatus.isInvalid ||
    interviewStatus.isInvalid ||
    examStatus.isFutureMonth ||
    examStatus.isDatePending ||
    interviewStatus.isDatePending ||
    (appStatus.hasMissingDeadline && !active)
  );

  // Preserve original source dates & audit history without mutating source inputs
  const firstPrevClosing = Array.isArray(notif.revisionHistory) && notif.revisionHistory.length > 0
    ? (notif.revisionHistory[0]?.previousValues?.closingDate || '')
    : '';
  const originalDates = {
    openingDate: notif.originalOpeningDate || openInput || '',
    closingDate: notif.originalClosingDate || firstPrevClosing || closeInput || '',
    examDate: notif.originalExamDate || notif.examDate || '',
    interviewDate: notif.originalInterviewDate || notif.interviewDate || notif.walkInDate || ''
  };

  const stageTimeline = calculateRecruitmentStageTimeline(notif, todayObj, { lang });

  return {
    ...notif,
    lang,
    applicationStatus: appStatus.status,
    examStatusCode: examStatus.status,
    interviewStatusCode: interviewStatus.status,
    resultStatusCode: resultStatus.status,
    appStatus,
    examStatus,
    interviewStatus: stageTimeline.interviewStatus,
    selectionStatus,
    resultStatus,
    dateConsistency,
    needsAdminReview: dateConsistency.needsAdminReview,
    needsDateVerification,
    hasSourceIntegrityIssue,
    isGenericNoticeUrl,
    isGenericApplyUrl,
    canShowApplyCta,
    applyCtaState,
    hasVerifiedReferenceApplyUrl: hasValidApplyUrl && appStatus.status === 'CLOSED',
    originalDates,
    revisionHistory: Array.isArray(notif.revisionHistory) ? notif.revisionHistory : [],
    formattedOpeningDate,
    formattedClosingDate,
    formattedOriginalClosingDate,
    formattedExamDate,
    formattedInterviewDate,
    formattedDvDate,
    formattedNotificationDate,
    // Stage-based Timeline and Milestones
    stageTimeline,
    stages: stageTimeline.examStages,
    timeline: stageTimeline.timeline,
    nextImportantEvent: stageTimeline.nextImportantEvent,
    overallStageCode: stageTimeline.overallStageCode,
    overallStageLabel: stageTimeline.overallStageLabel,
    prelimsStatus: stageTimeline.prelimsStatus,
    mainsStatus: stageTimeline.mainsStatus,
    isMultiStage: stageTimeline.examStages.isMultiStage,
    isInterviewApplicable: stageTimeline.isInterviewApplicable,
    // Unified Lifecycle and Classification flags
    isNotificationActive: active,
    isExpired,
    isClosingSoon: Boolean(
      isClosingSoon &&
      isActiveApplication
    ),
    isActiveApplication,
    isUpcomingExam: examStatus.isUpcoming || examStatus.isToday || Boolean(stageTimeline.mainsStatus && (stageTimeline.mainsStatus.isUpcoming || stageTimeline.mainsStatus.isToday)),
    isUpcomingInterview: Boolean((stageTimeline.interviewStatus?.isUpcoming || stageTimeline.interviewStatus?.isToday) && stageTimeline.isInterviewApplicable),
    isApplicationClosed: appStatus.isExpired,
    isExamCompleted: examStatus.isCompleted,
    isInterviewCompleted: Boolean(stageTimeline.interviewStatus?.isCompleted),
    isResultPublished: resultStatus.isPublished
  };
}
