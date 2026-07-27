// Central Application Status Store with Real-Time Server Persistence, Firebase & localStorage sync
import { saveApplicationCloud } from './firebaseService';

const STATUS_RECORDS_KEY = 'akesevai-application-records';
const TOKEN_BOOKINGS_KEY = 'akesevai-token-bookings';

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
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {}
  return {};
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
  saveApplicationCloud(id, completeRecord);

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
    saveApplicationCloud(appId, records[appId]);

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
