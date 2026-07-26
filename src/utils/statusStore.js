// Central Application Status Store with Real-Time Server Persistence & localStorage sync

const STATUS_RECORDS_KEY = 'akesevai-application-records';
const TOKEN_BOOKINGS_KEY = 'akesevai-token-bookings';

const defaultMockApplications = {
  'TN-AK-2026-108': {
    id: 'TN-AK-2026-108',
    tokenId: 'TOK-108',
    applicantName: 'K. Lakshmi (லெட்சுமி)',
    phone: '9443287654',
    aadhaarNo: '5432 1098 7654',
    service: 'வருமானச் சான்றிதழ் (Income Certificate)',
    fee: '₹60',
    date: '2026-07-25',
    submittedDate: '25 Jul 2026',
    estimatedDate: '25 Jul 2026',
    currentStage: 6,
    statusLabel: 'சான்றிதழ் தயாராக உள்ளது (Approved ✅)',
    statusColor: '#16a34a',
    remarks: 'தட்டாட்சியர் டிஜிட்டல் கையொப்பமிட்ட சான்றிதழ் தயார் நிலையில் உள்ளது. AkEsevai மையத்தில் பெற்றுக்கொள்ளலாம்.',
    timeline: [
      { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: '25 Jul, 09:30 AM', done: true },
      { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: '25 Jul, 10:15 AM', done: true },
      { step: 3, title: 'Fee Payment Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: '25 Jul, 10:20 AM', done: true },
      { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: '25 Jul, 11:00 AM', done: true },
      { step: 5, title: 'VAO / RI Verification', tamil: 'அதிகாரி பரிசீலனை', date: '25 Jul, 02:00 PM', done: true },
      { step: 6, title: 'Approved & Issued', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: '25 Jul, 03:30 PM', done: true, active: true }
    ]
  },
  'TN-AK-2026-112': {
    id: 'TN-AK-2026-112',
    tokenId: 'TOK-112',
    applicantName: 'P. Karthik (கார்த்திக்)',
    phone: '9876543210',
    aadhaarNo: '9876 5432 1098',
    service: 'முதல் பட்டதாரி சான்றிதழ் (First Graduate)',
    fee: '₹60',
    date: '2026-07-24',
    submittedDate: '24 Jul 2026',
    estimatedDate: '25 Jul 2026',
    currentStage: 6,
    statusLabel: 'சான்றிதழ் தயாராக உள்ளது (Approved ✅)',
    statusColor: '#16a34a',
    remarks: 'சான்றிதழ் அங்கீகரிக்கப்பட்டு டிஜிட்டல் சான்றிதழ் பதிவிறக்கத்திற்குத் தயாராக உள்ளது.',
    timeline: [
      { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: '24 Jul, 10:00 AM', done: true },
      { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: '24 Jul, 11:00 AM', done: true },
      { step: 3, title: 'Fee Payment Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: '24 Jul, 11:15 AM', done: true },
      { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: '24 Jul, 01:00 PM', done: true },
      { step: 5, title: 'VAO / RI Verification', tamil: 'அதிகாரி பரிசீலனை', date: '24 Jul, 04:30 PM', done: true },
      { step: 6, title: 'Approved & Issued', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: '25 Jul, 11:00 AM', done: true, active: true }
    ]
  },
  'TN-AK-2026-104': {
    id: 'TN-AK-2026-104',
    tokenId: 'TOK-104',
    applicantName: 'M. Senthil Kumar (செந்தில்குமார்)',
    phone: '9842154321',
    aadhaarNo: '7689 4321 0984',
    service: 'சாதிச்சான்று (Community Certificate)',
    fee: '₹60',
    date: '2026-07-25',
    submittedDate: '25 Jul 2026',
    estimatedDate: '28 Jul 2026',
    currentStage: 4,
    statusLabel: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது (Submitted)',
    statusColor: '#d97706',
    remarks: 'ஆவணங்கள் சரிபார்க்கப்பட்டு வருவாய்த் துறை (TNeGA) தளத்தில் விண்ணப்பிக்கப்பட்டது.',
    timeline: [
      { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: '25 Jul, 10:15 AM', done: true },
      { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: '25 Jul, 11:30 AM', done: true },
      { step: 3, title: 'Fee Payment Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: '25 Jul, 11:45 AM', done: true },
      { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: '25 Jul, 02:20 PM', done: true, active: true },
      { step: 5, title: 'VAO / RI Verification', tamil: 'அதிகாரி பரிசீலனை', date: 'Pending', done: false },
      { step: 6, title: 'Approved & Issued', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: 'Pending', done: false }
    ]
  },
  'TN-AK-2026-115': {
    id: 'TN-AK-2026-115',
    tokenId: 'TOK-115',
    applicantName: 'S. Anitha (அனிதா)',
    phone: '9342318844',
    aadhaarNo: '1234 5678 9012',
    service: 'இருப்பிட சான்றிதழ் (Nativity Certificate)',
    fee: '₹60',
    date: '2026-07-25',
    submittedDate: '25 Jul 2026',
    estimatedDate: '27 Jul 2026',
    currentStage: 5,
    statusLabel: 'VAO / RI களப்பரிசீலனையில் உள்ளது (VAO Review)',
    statusColor: '#b45309',
    remarks: 'கிராம நிர்வாக அதிகாரி (VAO) மற்றும் வருவாய் ஆய்வாளர் (RI) பரிசீலனையில் உள்ளது.',
    timeline: [
      { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: '25 Jul, 08:30 AM', done: true },
      { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: '25 Jul, 09:00 AM', done: true },
      { step: 3, title: 'Fee Payment Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: '25 Jul, 09:15 AM', done: true },
      { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: '25 Jul, 10:00 AM', done: true },
      { step: 5, title: 'VAO / RI Verification', tamil: 'அதிகாரி பரிசீலனை', date: '25 Jul, 01:30 PM', done: true, active: true },
      { step: 6, title: 'Approved & Issued', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: 'Pending', done: false }
    ]
  }
};

// Sync with Vite Server Central Store API (/api/store)
export const syncWithCentralServer = async () => {
  try {
    const res = await fetch('/api/store');
    if (res.ok) {
      const centralData = await res.json();
      
      // Update applications
      if (centralData.applications && Object.keys(centralData.applications).length > 0) {
        const localApps = getStoredApplications();
        const mergedApps = { ...localApps, ...centralData.applications };
        localStorage.setItem(STATUS_RECORDS_KEY, JSON.stringify(mergedApps));
      }

      // Update token bookings
      if (centralData.tokens && Array.isArray(centralData.tokens) && centralData.tokens.length > 0) {
        const localTokens = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
        const map = new Map();
        [...centralData.tokens, ...localTokens].forEach(t => {
          if (t && t.tokenNo && !map.has(t.tokenNo)) {
            map.set(t.tokenNo, t);
          }
        });
        const mergedTokens = Array.from(map.values());
        localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(mergedTokens));
      }

      window.dispatchEvent(new Event('storage'));
    }
  } catch (e) {
    // Fallback if offline
  }
};

// Automatically poll server every 3 seconds for unified cross-device real-time sync
if (typeof window !== 'undefined') {
  setInterval(() => {
    syncWithCentralServer();
  }, 3000);
}

export const getStoredApplications = () => {
  try {
    const saved = localStorage.getItem(STATUS_RECORDS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  localStorage.setItem(STATUS_RECORDS_KEY, JSON.stringify(defaultMockApplications));
  return defaultMockApplications;
};

export const saveApplicationRecord = (appRecord) => {
  const records = getStoredApplications();
  const id = appRecord.id || `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateToday = new Date().toISOString().split('T')[0];

  const completeRecord = {
    id,
    tokenId: appRecord.tokenId || `TOK-${Math.floor(100 + Math.random() * 900)}`,
    applicantName: appRecord.applicantName || 'Applicant Customer',
    phone: (appRecord.phone || '').replace(/\D/g, ''),
    aadhaarNo: appRecord.aadhaarNo || '',
    service: appRecord.service || 'Government e-Sevai Service',
    fee: appRecord.fee || '₹60',
    date: appRecord.date || dateToday,
    submittedDate: appRecord.submittedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    estimatedDate: appRecord.estimatedDate || 'Within 3 - 5 Working Days',
    currentStage: appRecord.currentStage || 3,
    statusLabel: appRecord.statusLabel || 'ஆவணங்கள் சரிபார்க்கப்பட்டு செயலாக்கத்தில் உள்ளது',
    statusColor: appRecord.statusColor || '#0052cc',
    remarks: appRecord.remarks || 'AkEsevai மையத்தில் விண்ணப்பம் பதிவு செய்யப்பட்டுள்ளது.',
    timeline: appRecord.timeline || [
      { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: 'Today', done: true },
      { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: 'Today', done: true },
      { step: 3, title: 'Fee Payment Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: 'Today', done: true, active: true },
      { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: 'Pending', done: false },
      { step: 5, title: 'Officer Verification', tamil: 'அதிகாரி பரிசீலனை', date: 'Pending', done: false },
      { step: 6, title: 'Approved & Completed', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: 'Pending', done: false }
    ]
  };

  records[id] = completeRecord;
  localStorage.setItem(STATUS_RECORDS_KEY, JSON.stringify(records));

  // Push to Central API server for immediate cross-device sync
  try {
    fetch('/api/store', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'application', data: completeRecord })
    }).catch(() => {});
  } catch (e) {}

  window.dispatchEvent(new Event('storage'));
  return completeRecord;
};

export const updateApplicationStage = (appId, newStage, newStatusLabel, newRemarks) => {
  const records = getStoredApplications();
  if (records[appId]) {
    const updatedTimeline = records[appId].timeline.map((stepItem) => {
      if (stepItem.step < newStage) return { ...stepItem, done: true, active: false };
      if (stepItem.step === newStage) return { ...stepItem, done: true, active: true, date: 'Just Now' };
      return { ...stepItem, done: false, active: false };
    });

    records[appId].currentStage = newStage;
    if (newStatusLabel) records[appId].statusLabel = newStatusLabel;
    if (newRemarks) records[appId].remarks = newRemarks;
    records[appId].timeline = updatedTimeline;

    localStorage.setItem(STATUS_RECORDS_KEY, JSON.stringify(records));

    try {
      fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'application', data: records[appId] })
      }).catch(() => {});
    } catch (e) {}

    window.dispatchEvent(new Event('storage'));
    return records[appId];
  }
  return null;
};
