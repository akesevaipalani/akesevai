import { saveApplicationCloud } from './firebaseService';

export const syncWithCentralServer = async () => {};

let inMemoryApplications = {};

export const setInStoreApplications = (apps) => {
  if (apps && typeof apps === 'object') {
    inMemoryApplications = { ...apps };
  }
};

export const getStoredApplications = () => {
  return inMemoryApplications || {};
};

export const saveApplicationRecord = (appRecord) => {
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

  inMemoryApplications[id] = completeRecord;
  saveApplicationCloud(id, completeRecord);
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

    inMemoryApplications[appId] = records[appId];
    saveApplicationCloud(appId, records[appId]);
    return records[appId];
  }
  return null;
};
