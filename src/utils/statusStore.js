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

export const updateApplicationStage = (appId, newStage, newStatusLabel, newRemarks, appMeta = {}) => {
  const records = getStoredApplications();
  let existing = records[appId];

  if (!existing) {
    existing = {
      id: appId,
      applicantName: appMeta.applicantName || appMeta.name || 'Applicant Customer',
      phone: (appMeta.phone || '').replace(/\D/g, ''),
      service: appMeta.service || appMeta.serviceName || 'Government e-Sevai Service',
      fee: appMeta.fee || '₹60',
      submittedDate: appMeta.submittedDate || appMeta.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      estimatedDate: appMeta.estimatedDate || 'Within 3 - 5 Working Days',
      currentStage: newStage,
      statusLabel: '',
      statusColor: '#0052cc',
      remarks: '',
      timeline: []
    };
  }

  const stageInfoMap = {
    1: {
      statusLabel: 'Step 1: Application Received (விண்ணப்பம் பெறப்பட்டது)',
      statusColor: '#3b82f6',
      remarks: 'AkEsevai மையத்தில் விண்ணப்பம் பதிவு செய்யப்பட்டுள்ளது.'
    },
    2: {
      statusLabel: 'Step 2: Documents Verified (ஆவணங்கள் சரிபார்க்கப்பட்டது)',
      statusColor: '#0284c7',
      remarks: 'வாடிக்கையாளரின் அனைத்து ஆவணங்களும் சரிபார்க்கப்பட்டுவிட்டது.'
    },
    3: {
      statusLabel: 'Step 3: Fee Confirmed (கட்டணம் பெறப்பட்டு செயலாக்கத்தில் உள்ளது)',
      statusColor: '#0052cc',
      remarks: 'கட்டணம் பெறப்பட்டு அரசு இணையதளத் தாக்கல் நிலுவையில் உள்ளது.'
    },
    4: {
      statusLabel: 'Step 4: Submitted to Govt (அரசு தளத்தில் தாக்கல் செய்யப்பட்டது)',
      statusColor: '#d97706',
      remarks: 'அரசு இ-சேவை இணையதளத்தில் வெற்றிகரமாக விண்ணப்பம் தாக்கல் செய்யப்பட்டது.'
    },
    5: {
      statusLabel: 'Step 5: Officer Review (அதிகாரி பரிசீலனையில் உள்ளது)',
      statusColor: '#8b5cf6',
      remarks: 'அரசு அதிகாரி / VAO / RI பரிசீலனையில் உள்ளது.'
    },
    6: {
      statusLabel: 'Approved & Completed (சான்றிதழ் தயாராக உள்ளது)',
      statusColor: '#16a34a',
      remarks: 'விண்ணப்பம் வெற்றிகரமாக ஒப்புதல் பெறப்பட்டு சான்றிதழ் தயாராக உள்ளது.'
    }
  };

  const defaultStage = stageInfoMap[newStage] || stageInfoMap[3];

  existing.currentStage = newStage;
  existing.statusLabel = newStatusLabel || defaultStage.statusLabel;
  existing.statusColor = defaultStage.statusColor;
  existing.remarks = newRemarks || defaultStage.remarks;

  const defaultTimelineTitles = [
    { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பதிவு செய்யப்பட்டது' },
    { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது' },
    { step: 3, title: 'Fee Confirmed', tamil: 'கட்டணம் பெறப்பட்டது' },
    { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் தாக்கல் செய்யப்பட்டது' },
    { step: 5, title: 'Officer Inspection', tamil: 'அதிகாரி பரிசீலனை' },
    { step: 6, title: 'Approved & Completed', tamil: 'சான்றிதழ் தயார் / நிறைவடைந்தது' }
  ];

  existing.timeline = defaultTimelineTitles.map((item) => {
    const stepNum = item.step;
    const isDone = stepNum <= newStage;
    const isActive = stepNum === newStage;
    let dateText = 'Pending';
    if (isDone) {
      if (stepNum === 1) dateText = existing.submittedDate || existing.date || 'Today';
      else if (isActive) dateText = newStage === 6 ? 'Completed' : 'Just Now';
      else dateText = 'Completed';
    }
    return {
      step: stepNum,
      title: item.title,
      tamil: item.tamil,
      date: dateText,
      done: isDone,
      active: isActive
    };
  });

  inMemoryApplications[appId] = existing;
  saveApplicationCloud(appId, existing);
  return existing;
};

export const deleteApplicationRecord = (targetId) => {
  if (!targetId) return;
  const strId = String(targetId);
  Object.keys(inMemoryApplications).forEach((key) => {
    const app = inMemoryApplications[key];
    if (key === strId || app?.id === strId || app?.tokenId === strId) {
      delete inMemoryApplications[key];
    }
  });
};

