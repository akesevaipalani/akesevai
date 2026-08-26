import { saveApplicationCloud } from './dataService';

export const syncWithCentralServer = async () => {};

let inMemoryApplications = {};

export const getDeletedAppsSet = () => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem('akesevai-deleted-apps');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
};

export const setInStoreApplications = (apps) => {
  if (apps && typeof apps === 'object') {
    inMemoryApplications = { ...apps };
  }
};

export const getStoredApplications = () => {
  let storedObj = {};
  try {
    const raw = localStorage.getItem('akesevai-application-records');
    if (raw) storedObj = JSON.parse(raw);
  } catch (e) {}
  const merged = { ...storedObj, ...inMemoryApplications };
  const delSet = getDeletedAppsSet();
  if (delSet.size > 0) {
    Object.keys(merged).forEach((k) => {
      if (delSet.has(k) || delSet.has(merged[k]?.id) || delSet.has(merged[k]?.ackNo)) {
        delete merged[k];
      }
    });
  }
  return merged;
};

export const saveApplicationRecord = (appRecord) => {
  const id = appRecord.id || `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const dateToday = new Date().toISOString().split('T')[0];

  const completeRecord = {
    id,
    ackNo: id,
    tokenId: appRecord.tokenId || `TOK-${Math.floor(100 + Math.random() * 900)}`,
    applicantName: appRecord.applicantName || 'Applicant Customer',
    phone: (appRecord.phone || '').replace(/\D/g, ''),
    aadhaarNo: appRecord.aadhaarNo || '',
    service: appRecord.service || 'Government e-Sevai Service',
    fee: appRecord.fee || '₹60',
    date: appRecord.date || dateToday,
    submittedDate: appRecord.submittedDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    estimatedDate: appRecord.estimatedDate || 'Within 3 - 5 Working Days',
    currentStage: appRecord.currentStage || appRecord.stage || 1,
    stage: appRecord.currentStage || appRecord.stage || 1,
    status: (appRecord.currentStage || appRecord.stage || 1) === 6 ? 'Completed' : 'Processing',
    statusLabel: appRecord.statusLabel || 'Step 1: Application Received (விண்ணப்பம் பெறப்பட்டது)',
    statusColor: appRecord.statusColor || '#3b82f6',
    remarks: appRecord.remarks || 'AkEsevai மையத்தில் விண்ணப்பம் பெறப்பட்டுள்ளது.',
    timeline: appRecord.timeline || [
      { step: 1, title: 'Application Received', tamil: 'விண்ணப்பம் பெறப்பட்டது', date: 'Today', done: true, active: true },
      { step: 2, title: 'Document Verified', tamil: 'ஆவணங்கள் சரிபார்க்கப்பட்டது', date: 'Pending', done: false },
      { step: 3, title: 'Fee Payment Confirmed', tamil: 'கட்டணம் பெறப்பட்டது', date: 'Pending', done: false },
      { step: 4, title: 'Submitted to Govt Portal', tamil: 'அரசு தளத்தில் விண்ணப்பிக்கப்பட்டது', date: 'Pending', done: false },
      { step: 5, title: 'Officer Verification', tamil: 'அதிகாரி பரிசீலனை', date: 'Pending', done: false },
      { step: 6, title: 'Approved & Completed', tamil: 'சான்றிதழ் வழங்கப்பட்டது', date: 'Pending', done: false }
    ]
  };

  inMemoryApplications[id] = completeRecord;
  try {
    const current = JSON.parse(localStorage.getItem('akesevai-application-records') || '{}');
    current[id] = completeRecord;
    localStorage.setItem('akesevai-application-records', JSON.stringify(current));
  } catch (e) {}
  saveApplicationCloud(id, completeRecord);
  return completeRecord;
};

export const updateApplicationStage = (appId, newStage, newStatusLabel, newRemarks, appMeta = {}) => {
  const records = getStoredApplications();
  const cleanId = String(appId || appMeta.id || appMeta.ackNo || '').trim();
  let existing = records[cleanId] || records[appId] || Object.values(records).find(r => r && (r.id === cleanId || r.ackNo === cleanId || String(r.id).includes(cleanId)));

  if (!existing) {
    existing = {
      id: cleanId || `TN-AK-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      ackNo: cleanId,
      applicantName: appMeta.applicantName || appMeta.name || 'Applicant Customer',
      phone: (appMeta.phone || appMeta.customerPhone || '').replace(/\D/g, ''),
      service: appMeta.service || appMeta.name || appMeta.serviceName || 'Government e-Sevai Service',
      fee: appMeta.fee || '₹60',
      submittedDate: appMeta.submittedDate || appMeta.date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      estimatedDate: appMeta.estimatedDate || 'Within 3 - 5 Working Days',
      currentStage: newStage,
      stage: newStage,
      status: newStage === 6 ? 'Completed' : 'Processing',
      statusLabel: '',
      statusColor: '#0052cc',
      remarks: '',
      timeline: []
    };
  }

  const stageInfoMap = {
    1: {
      statusLabel: 'Application Submitted (விண்ணப்பம் பெறப்பட்டது)',
      statusColor: '#3b82f6',
      remarks: 'AkEsevai மையத்தில் விண்ணப்பம் பதிவு செய்யப்பட்டு பெறப்பட்டுள்ளது.'
    },
    2: {
      statusLabel: 'Document Verification (ஆவணங்கள் சரிபார்க்கப்படுகிறது)',
      statusColor: '#0284c7',
      remarks: 'வாடிக்கையாளர் பதிவேற்றிய ஆவணங்கள் சரிபார்க்கப்பட்டு வருகின்றன.'
    },
    3: {
      statusLabel: 'Document Pending (கூடுதல் ஆவணம் தேவை)',
      statusColor: '#d97706',
      remarks: 'விண்ணப்பத்தை தொடர வாடிக்கையாளரிடமிருந்து கூடுதல் ஆவணம் தேவைப்படுகிறது.'
    },
    4: {
      statusLabel: 'Under Process / Fee Paid (செயலாக்கத்தில் உள்ளது)',
      statusColor: '#0052cc',
      remarks: 'அரசு கட்டணம் செலுத்தப்பட்டு இணையதளத்தில் தாக்கல் செய்யப்பட்டுள்ளது.'
    },
    5: {
      statusLabel: 'Officer Review (அதிகாரி பரிசீலனையில் உள்ளது)',
      statusColor: '#8b5cf6',
      remarks: 'அரசு அதிகாரி / VAO / RI கள ஆய்வு மற்றும் பரிசீலனையில் உள்ளது.'
    },
    6: {
      statusLabel: 'Approved & Completed (சான்றிதழ் தயார் / நிறைவடைந்தது)',
      statusColor: '#16a34a',
      remarks: 'விண்ணப்பம் வெற்றிகரமாக ஒப்புதல் பெறப்பட்டு சான்றிதழ் தயாராக உள்ளது.'
    },
    7: {
      statusLabel: 'Rejected (விண்ணப்பம் நிராகரிக்கப்பட்டது)',
      statusColor: '#ef4444',
      remarks: 'அரசு விதிமுறைகளுக்கு உட்படாததால் விண்ணப்பம் நிராகரிக்கப்பட்டது.'
    }
  };

  const defaultStage = stageInfoMap[newStage] || stageInfoMap[1];

  existing.currentStage = newStage;
  existing.stage = newStage;
  existing.status = newStage === 6 ? 'Completed' : 'Processing';
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

  const targetId = existing.id || cleanId || appId;
  inMemoryApplications[targetId] = existing;
  if (cleanId && cleanId !== targetId) inMemoryApplications[cleanId] = existing;
  if (appId && appId !== targetId) inMemoryApplications[appId] = existing;

  try {
    const current = JSON.parse(localStorage.getItem('akesevai-application-records') || '{}');
    current[targetId] = existing;
    if (cleanId) current[cleanId] = existing;
    if (appId) current[appId] = existing;
    localStorage.setItem('akesevai-application-records', JSON.stringify(current));
  } catch (e) {}

  // Update inside customer.applications as well
  const rawPhone = existing.phone || appMeta.phone || appMeta.customerPhone || '';
  const cleanPhone = String(rawPhone).replace(/\D/g, '');
  if (cleanPhone) {
    ['akesevai-customer-records', 'akesevai-customers'].forEach((storageKey) => {
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          const custs = JSON.parse(raw);
          const phoneKeys = Object.keys(custs).filter(k => String(k).replace(/\D/g, '') === cleanPhone);
          phoneKeys.forEach(pk => {
            if (custs[pk] && Array.isArray(custs[pk].applications)) {
              custs[pk].applications = custs[pk].applications.map(a => {
                const aId = String(a.id || a.ackNo || '');
                if (aId === targetId || aId === cleanId || (a.name && existing.service && a.name.toLowerCase() === existing.service.toLowerCase())) {
                  return {
                    ...a,
                    currentStage: newStage,
                    stage: newStage,
                    status: newStage === 6 ? 'Completed' : 'Processing',
                    statusLabel: existing.statusLabel,
                    statusColor: existing.statusColor,
                    remarks: existing.remarks
                  };
                }
                return a;
              });
            }
          });
          localStorage.setItem(storageKey, JSON.stringify(custs));
        }
      } catch (e) {}
    });
  }

  saveApplicationCloud(targetId, existing);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('akesevai-data-changed'));
  }
  return existing;
};

export const deleteApplicationRecord = (targetId) => {
  if (!targetId) return;
  const strId = String(targetId).trim();

  // 1. Add to blacklist set
  try {
    const delSet = getDeletedAppsSet();
    delSet.add(strId);
    localStorage.setItem('akesevai-deleted-apps', JSON.stringify(Array.from(delSet)));
  } catch (e) {}

  // 2. Remove from inMemoryApplications
  Object.keys(inMemoryApplications).forEach((key) => {
    const app = inMemoryApplications[key];
    if (key === strId || app?.id === strId || app?.ackNo === strId || app?.tokenId === strId) {
      delete inMemoryApplications[key];
    }
  });

  // 3. Remove from localStorage akesevai-application-records
  try {
    const raw = localStorage.getItem('akesevai-application-records');
    if (raw) {
      const records = JSON.parse(raw);
      delete records[strId];
      Object.keys(records).forEach(k => {
        if (records[k]?.id === strId || records[k]?.ackNo === strId) {
          delete records[k];
        }
      });
      localStorage.setItem('akesevai-application-records', JSON.stringify(records));
    }
  } catch (e) {}

  // 4. Remove from ALL customer records in localStorage (akesevai-customer-records and akesevai-customers)
  ['akesevai-customer-records', 'akesevai-customers'].forEach((storageKey) => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const custs = JSON.parse(raw);
        let updated = false;
        Object.keys(custs).forEach((phone) => {
          if (custs[phone] && Array.isArray(custs[phone].applications)) {
            const initialLen = custs[phone].applications.length;
            custs[phone].applications = custs[phone].applications.filter(
              (a) => a && String(a.id || a.ackNo || '').trim() !== strId
            );
            if (custs[phone].applications.length !== initialLen) {
              updated = true;
            }
          }
        });
        if (updated) {
          localStorage.setItem(storageKey, JSON.stringify(custs));
        }
      }
    } catch (e) {}
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('akesevai-data-changed'));
  }
};

