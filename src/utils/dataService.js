import {
  fetchSingleCustomerProfileMongo,
  saveCustomerProfileMongo,
  fetchAllCustomerProfilesMongo,
  deleteCustomerProfileMongo,
  subscribeCustomerProfilesMongo,
  saveApplicationMongo,
  fetchAllApplicationsMongo,
  deleteApplicationMongo,
  subscribeApplicationsMongo,
  saveExpiryDocumentMongo,
  fetchAllExpiryDocumentsMongo,
  deleteExpiryDocumentMongo,
  subscribeExpiryDocumentsMongo,
  saveTokenBookingMongo,
  requestTokenBookingMongo,
  verifyTokenPaymentMongo,
  rejectTokenPaymentMongo,
  checkDuplicateUtrMongo,
  fetchAllTokensMongo,
  deleteTokenBookingMongo,
  subscribeTokensMongo,
  fetchDeletedCustomersMongo,
  saveDeletedCustomerMongo,
  subscribeDeletedCustomersMongo,
  uploadFileToMongoStorage,
  fetchNotificationsMongo,
  saveNotificationMongo,
  deleteNotificationMongo,
  syncBankingNotificationsMongo,
  subscribeNotificationsMongo,
  sendOtpMongo,
  verifyOtpMongo,
  resendOtpMongo,
  fetchAllAdvertisementsMongo,
  saveAdvertisementMongo,
  deleteAdvertisementMongo
} from './mongoService';

export const sendOtpCloud = async (phone, purpose) => {
  return await sendOtpMongo(phone, purpose);
};

export const verifyOtpCloud = async (phone, otp, purpose) => {
  return await verifyOtpMongo(phone, otp, purpose);
};

export const resendOtpCloud = async (phone, purpose) => {
  return await resendOtpMongo(phone, purpose);
};

export const fetchAllTokensCloud = async () => {
  return await fetchAllTokensMongo();
};

export const fetchNotificationsCloud = async (category, status) => {
  return await fetchNotificationsMongo(category, status);
};

export const saveNotificationCloud = async (notifData) => {
  return await saveNotificationMongo(notifData);
};

export const deleteNotificationCloud = async (notifId) => {
  return await deleteNotificationMongo(notifId);
};

export const syncBankingNotificationsCloud = async () => {
  return await syncBankingNotificationsMongo();
};

export const subscribeNotificationsCloud = (callback) => {
  return subscribeNotificationsMongo(callback);
};

export const fetchSingleCustomerProfileCloud = async (phone) => {
  return await fetchSingleCustomerProfileMongo(phone);
};

const logNotice = (tag, err) => {
  const msg = err?.message || String(err || '');
  console.info(`[AkEsevai Data Sync] ${tag}:`, msg);
};

// Clear legacy application local storage while preserving active session & customer cache
export const clearAllApplicationLocalStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    const keysToKeep = new Set([
      'akesevai-customer-session',
      'akesevai-customer-records',
      'akesevai-customers',
      'akesevai-token-bookings',
      'akesevai-lang',
      'akesevai-dark-mode',
      'akesevai-admin-session'
    ]);
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('akesevai') || key.startsWith('AKESEVAI')) && !keysToKeep.has(key)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  } catch (e) {
    console.warn('Error clearing local storage:', e);
  }
};

export const normalizePhone = (phone) => {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

// --- CUSTOMER PROFILES (CENTRAL MONGODB SERVER) ---

export const saveCustomerProfileCloud = async (phone, profileData) => {
  const cleanPhone = normalizePhone(phone);
  if (!cleanPhone) return;

  try {
    const rawRecords = localStorage.getItem('akesevai-customer-records') || '{}';
    const records = JSON.parse(rawRecords);
    
    // Never store sensitive base64 scan data or large payloads in localStorage
    const storageSafeDocs = (profileData.documents || []).map((docItem) => {
      const { data, ...safeDoc } = docItem || {};
      const dUrl = safeDoc.url || '';
      return {
        ...safeDoc,
        data: '',
        url: (typeof dUrl === 'string' && dUrl.startsWith('data:')) ? '' : dUrl
      };
    });

    const storageSafeProfile = {
      ...profileData,
      documents: storageSafeDocs,
      phone: cleanPhone
    };

    const existingRecord = records[cleanPhone] || {};
    const updatedRecord = { ...existingRecord, ...storageSafeProfile };
    if (!profileData.lastToken) {
      delete updatedRecord.lastToken;
    }
    records[cleanPhone] = updatedRecord;
    localStorage.setItem('akesevai-customer-records', JSON.stringify(records));
    localStorage.setItem('akesevai-customers', JSON.stringify(records));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('akesevai-data-changed'));
    }
  } catch (e) {}

  const dataToSave = {
    ...profileData,
    phone: cleanPhone,
    updatedAt: new Date().toISOString()
  };

  try {
    await saveCustomerProfileMongo(cleanPhone, dataToSave);
  } catch (err) {
    logNotice('MongoDB Customer save', err);
  }
};

export const deleteCustomerProfileCloud = async (phone) => {
  if (!phone) return;
  const strPhone = String(phone);
  const cleanPhone = normalizePhone(phone);

  try {
    await deleteCustomerProfileMongo(cleanPhone);
    await saveDeletedCustomerMongo(cleanPhone);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      const phoneVariants = [cleanPhone, strPhone, `+91${cleanPhone}`, `91${cleanPhone}`, `+91 ${cleanPhone}`].filter(Boolean);

      ['akesevai-customer-records', 'akesevai-customers'].forEach(storageKey => {
        const recordsRaw = localStorage.getItem(storageKey);
        if (recordsRaw) {
          try {
            const records = JSON.parse(recordsRaw);
            Object.keys(records).forEach(k => {
              const kClean = String(k).replace(/\D/g, '');
              const valClean = String(records[k]?.phone || records[k]?.profile?.phone || '').replace(/\D/g, '');
              if (kClean === cleanPhone || valClean === cleanPhone || phoneVariants.includes(k)) {
                delete records[k];
              }
            });
            localStorage.setItem(storageKey, JSON.stringify(records));
          } catch (e) {}
        }
      });

      const sessionPhone = sessionStorage.getItem('akesevai-customer-session') || localStorage.getItem('akesevai-customer-session');
      if (sessionPhone && sessionPhone.replace(/\D/g, '') === cleanPhone) {
        sessionStorage.removeItem('akesevai-customer-session');
        localStorage.removeItem('akesevai-customer-session');
      }

      const delCustSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-customers') || '[]'));
      phoneVariants.forEach(pv => delCustSet.add(pv));
      localStorage.setItem('akesevai-deleted-customers', JSON.stringify(Array.from(delCustSet)));

      const expDocsRaw = localStorage.getItem('akesevai_expiry_docs');
      if (expDocsRaw) {
        const expDocsArr = JSON.parse(expDocsRaw);
        const delDocsSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-docs') || '[]'));
        
        const remainingDocs = expDocsArr.filter(d => {
          const docPhone = String(d.customerPhone || d.phone || '').replace(/\D/g, '');
          if (docPhone === cleanPhone) {
            if (d.id) delDocsSet.add(String(d.id));
            if (d.url) delDocsSet.add(String(d.url));
            if (d.data) delDocsSet.add(String(d.data));
            return false;
          }
          return true;
        });

        localStorage.setItem('akesevai_expiry_docs', JSON.stringify(remainingDocs));
        localStorage.setItem('akesevai-deleted-docs', JSON.stringify(Array.from(delDocsSet)));
      }

      const tokensRaw = localStorage.getItem('akesevai-token-bookings');
      if (tokensRaw) {
        const tokensArr = JSON.parse(tokensRaw);
        const delTokensSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-tokens') || '[]'));

        const remainingTokens = tokensArr.filter(t => {
          const tPhone = String(t.phone || t.customerPhone || '').replace(/\D/g, '');
          if (tPhone === cleanPhone) {
            const tokNo = String(t.tokenNo || t.tokenId || t.id || '');
            if (tokNo) delTokensSet.add(tokNo);
            return false;
          }
          return true;
        });

        localStorage.setItem('akesevai-token-bookings', JSON.stringify(remainingTokens));
        localStorage.setItem('akesevai-deleted-tokens', JSON.stringify(Array.from(delTokensSet)));
      }

      if ('BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('akesevai_data_sync_channel');
          channel.postMessage({ type: 'CUSTOMER_DELETED', phone: cleanPhone });
          channel.close();
        } catch (e) {}
      }
    } catch (e) {}

    try {
      window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'customer', phone: cleanPhone } }));
      window.dispatchEvent(new Event('akesevai-data-changed'));
    } catch (e) {}
  }
};

export const subscribeCustomerProfiles = (callback) => {
  return subscribeCustomerProfilesMongo((mongoCusts) => {
    try {
      const delTokensSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-tokens') || '[]'));
      const localCust1 = JSON.parse(localStorage.getItem('akesevai-customer-records') || '{}');
      const localCust2 = JSON.parse(localStorage.getItem('akesevai-customers') || '{}');
      const merged = { ...localCust2, ...localCust1, ...(mongoCusts || {}) };
      if (delTokensSet.size > 0) {
        Object.keys(merged).forEach((phone) => {
          if (merged[phone] && merged[phone].lastToken) {
            const tNo = String(merged[phone].lastToken.tokenNo || merged[phone].lastToken.tokenId || merged[phone].lastToken.id || '').trim();
            if (delTokensSet.has(tNo)) {
              delete merged[phone].lastToken;
            }
          }
        });
      }
      if (callback) callback(merged);
    } catch (e) {
      if (callback) callback(mongoCusts || {});
    }
  });
};

export const subscribeDeletedCustomersCloud = (callback) => {
  return subscribeDeletedCustomersMongo(callback);
};

// --- APPLICATIONS (MONGODB DATABASE) ---

export const saveApplicationCloud = async (appId, appData) => {
  if (!appId) return;
  const dataToSave = {
    ...appData,
    id: String(appId),
    updatedAt: new Date().toISOString()
  };
  try {
    await saveApplicationMongo(dataToSave);
  } catch (err) {
    logNotice('MongoDB Application save', err);
  }
};

export const deleteApplicationCloud = async (appId) => {
  if (!appId) return;
  const strId = String(appId).trim();
  deleteApplicationRecord(strId);
  try {
    await deleteApplicationMongo(strId);
  } catch (err) {
    logNotice('MongoDB Application delete', err);
  }
};

export const subscribeApplications = (callback) => {
  return subscribeApplicationsMongo((mongoApps) => {
    try {
      const delAppsSet = getDeletedAppsSet();
      const localApps = JSON.parse(localStorage.getItem('akesevai-application-records') || '{}');
      const merged = { ...localApps, ...(mongoApps || {}) };
      if (delAppsSet.size > 0) {
        Object.keys(merged).forEach((k) => {
          if (delAppsSet.has(k) || delAppsSet.has(merged[k]?.id) || delAppsSet.has(merged[k]?.ackNo)) {
            delete merged[k];
          }
        });
      }
      if (callback) callback(merged);
    } catch (e) {
      if (callback) callback(mongoApps || {});
    }
  });
};

// --- TOKENS & PRIORITY PAYMENT VERIFICATION (MONGODB DATABASE) ---

export const checkDuplicateUtrCloud = async (utr) => {
  if (!utr) return false;
  const cleanUtr = String(utr).trim().toUpperCase();
  // Check localStorage first
  try {
    const rawTokens = localStorage.getItem('akesevai-token-bookings') || '[]';
    const tokensArr = JSON.parse(rawTokens);
    const existsLocally = tokensArr.some(t => t.utr && String(t.utr).toUpperCase() === cleanUtr && t.paymentStatus !== 'REJECTED');
    if (existsLocally) return true;
  } catch (e) {}

  // Check MongoDB
  try {
    return await checkDuplicateUtrMongo(cleanUtr);
  } catch (e) {
    return false;
  }
};

export const requestTokenBookingCloud = async (tokenRequest) => {
  if (!tokenRequest) return null;
  const cleanPhone = String(tokenRequest.phone || '').replace(/\D/g, '');
  const cleanUtr = String(tokenRequest.utr || '').trim().toUpperCase();
  const requestId = tokenRequest.id || `REQ-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const requestData = {
    ...tokenRequest,
    id: requestId,
    tokenNo: '', // Gated: No token number until verified!
    phone: cleanPhone,
    customerPhone: cleanPhone,
    utr: cleanUtr,
    amount: 50,
    paymentStatus: 'PENDING_VERIFICATION',
    status: 'PAYMENT PENDING',
    updatedAt: new Date().toISOString()
  };

  // Submit to MongoDB first (Enforce server-side anti-duplicate UTR & ₹50 validation)
  let savedData = requestData;
  try {
    const res = await requestTokenBookingMongo(requestData);
    if (res && res.token) {
      savedData = res.token;
    } else if (res && !res.error) {
      savedData = res;
    }
  } catch (err) {
    logNotice('MongoDB Token Request', err);
    throw err;
  }

  // Update local storage only after successful validation
  if (typeof window !== 'undefined') {
    try {
      const rawTokens = localStorage.getItem('akesevai-token-bookings') || '[]';
      const tokensArr = JSON.parse(rawTokens);
      const filtered = tokensArr.filter(t => String(t.id) !== requestId);
      filtered.unshift(savedData);
      localStorage.setItem('akesevai-token-bookings', JSON.stringify(filtered));

      if (cleanPhone) {
        ['akesevai-customer-records', 'akesevai-customers'].forEach(storageKey => {
          const rawCusts = localStorage.getItem(storageKey);
          if (rawCusts) {
            const custs = JSON.parse(rawCusts);
            if (custs[cleanPhone]) {
              custs[cleanPhone].lastToken = savedData;
              localStorage.setItem(storageKey, JSON.stringify(custs));
            }
          }
        });
      }
      window.dispatchEvent(new Event('akesevai-data-changed'));
    } catch (e) {}
  }

  return savedData;
};

export const verifyTokenPaymentCloud = async (id) => {
  if (!id) return null;
  try {
    const res = await verifyTokenPaymentMongo(id);
    const token = res?.token || res;
    if (token && typeof window !== 'undefined') {
      const cleanPhone = String(token.phone || '').replace(/\D/g, '');
      const rawTokens = localStorage.getItem('akesevai-token-bookings') || '[]';
      const tokensArr = JSON.parse(rawTokens);
      const updatedArr = tokensArr.map(t => (t.id === id || t.tokenNo === id || (t.utr && token.utr && t.utr === token.utr)) ? { ...t, ...token } : t);
      if (!updatedArr.some(t => t.id === token.id || t.tokenNo === token.tokenNo || (t.utr && token.utr && t.utr === token.utr))) {
        updatedArr.unshift(token);
      }
      localStorage.setItem('akesevai-token-bookings', JSON.stringify(updatedArr));

      if (cleanPhone) {
        ['akesevai-customer-records', 'akesevai-customers'].forEach(storageKey => {
          const rawCusts = localStorage.getItem(storageKey);
          if (rawCusts) {
            const custs = JSON.parse(rawCusts);
            if (custs[cleanPhone]) {
              custs[cleanPhone].lastToken = token;
              localStorage.setItem(storageKey, JSON.stringify(custs));
            }
          }
        });
      }
      window.dispatchEvent(new Event('akesevai-data-changed'));
    }
    return { success: true, token };
  } catch (err) {
    logNotice('MongoDB Token Verify', err);
    return null;
  }
};

export const rejectTokenPaymentCloud = async (id, reason = '') => {
  if (!id) return null;
  try {
    const res = await rejectTokenPaymentMongo(id, reason);
    const token = res?.token || res;
    if (token && typeof window !== 'undefined') {
      const rawTokens = localStorage.getItem('akesevai-token-bookings') || '[]';
      const tokensArr = JSON.parse(rawTokens);
      const updatedArr = tokensArr.map(t => (t.id === id || t.tokenNo === id || (t.utr && token.utr && t.utr === token.utr)) ? { ...t, ...token } : t);
      localStorage.setItem('akesevai-token-bookings', JSON.stringify(updatedArr));
      window.dispatchEvent(new Event('akesevai-data-changed'));
    }
    return { success: true, token };
  } catch (err) {
    logNotice('MongoDB Token Reject', err);
    return null;
  }
};

export const saveTokenBookingCloud = async (tokenData) => {
  if (!tokenData) return;
  const isVerified = tokenData.paymentStatus === 'VERIFIED' || String(tokenData.status || '').includes('VERIFIED') || (tokenData.tokenNo && String(tokenData.tokenNo).startsWith('TOK-'));
  const tokenNo = isVerified ? (tokenData.tokenNo || tokenData.tokenId || `TOK-${Date.now()}`) : '';
  const cleanPhone = String(tokenData.phone || tokenData.customerPhone || '').replace(/\D/g, '');
  const recordId = tokenData.id || tokenNo || `REQ-${Date.now()}`;

  const dataToSave = {
    ...tokenData,
    tokenNo: String(tokenNo),
    id: String(recordId),
    phone: cleanPhone,
    customerPhone: cleanPhone,
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      const rawTokens = localStorage.getItem('akesevai-token-bookings') || '[]';
      const tokensArr = JSON.parse(rawTokens);
      const filtered = tokensArr.filter(t => String(t.id || t.tokenNo || t.tokenId) !== String(recordId) && (!t.utr || !tokenData.utr || t.utr !== tokenData.utr));
      filtered.unshift(dataToSave);
      localStorage.setItem('akesevai-token-bookings', JSON.stringify(filtered));

      if (cleanPhone) {
        ['akesevai-customer-records', 'akesevai-customers'].forEach(storageKey => {
          const rawCusts = localStorage.getItem(storageKey);
          if (rawCusts) {
            const custs = JSON.parse(rawCusts);
            if (custs[cleanPhone]) {
              custs[cleanPhone].lastToken = dataToSave;
              localStorage.setItem(storageKey, JSON.stringify(custs));
            }
          }
        });
      }

      window.dispatchEvent(new Event('akesevai-data-changed'));
    } catch (e) {}
  }

  try {
    await saveTokenBookingMongo(dataToSave);
  } catch (err) {
    logNotice('MongoDB Token save', err);
  }
};

export const deleteTokenBookingCloud = async (tokenNo, customerPhone = '') => {
  if (!tokenNo) return;
  const strTokenNo = String(tokenNo).trim();
  try {
    await deleteTokenBookingMongo(strTokenNo);
  } catch (err) {
    logNotice('MongoDB Token delete', err);
  }

  if (typeof window !== 'undefined') {
    try {
      const delTokensSet = new Set(JSON.parse(localStorage.getItem('akesevai-deleted-tokens') || '[]'));
      delTokensSet.add(strTokenNo);
      localStorage.setItem('akesevai-deleted-tokens', JSON.stringify(Array.from(delTokensSet)));

      const tokensRaw = localStorage.getItem('akesevai-token-bookings');
      if (tokensRaw) {
        const tokensArr = JSON.parse(tokensRaw);
        const filtered = tokensArr.filter(t => String(t.tokenNo || t.tokenId || t.id).trim() !== strTokenNo);
        localStorage.setItem('akesevai-token-bookings', JSON.stringify(filtered));
      }
      deleteApplicationRecord(strTokenNo);

      const cleanPhone = normalizePhone(customerPhone);

      ['akesevai-customer-records', 'akesevai-customers'].forEach(storageKey => {
        const raw = localStorage.getItem(storageKey);
        if (raw) {
          try {
            const records = JSON.parse(raw);
            let updated = false;
            Object.keys(records).forEach(k => {
              const cust = records[k];
              if (cust) {
                const kPhone = normalizePhone(k);
                const cPhone = normalizePhone(cust.phone);
                const isPhoneMatch = cleanPhone && (kPhone === cleanPhone || cPhone === cleanPhone);
                const tNo = String(cust.lastToken?.tokenNo || cust.lastToken?.tokenId || cust.lastToken?.id || '').trim();
                if (isPhoneMatch || tNo === strTokenNo || !tNo) {
                  delete records[k].lastToken;
                  updated = true;
                  if (cPhone) {
                    const custCopy = { ...cust };
                    delete custCopy.lastToken;
                    saveCustomerProfileMongo(cPhone, custCopy).catch(() => {});
                  }
                }
              }
            });
            if (updated) localStorage.setItem(storageKey, JSON.stringify(records));
          } catch (e) {}
        }
      });
    } catch (e) {}

    try {
      window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'token', tokenNo: strTokenNo } }));
      window.dispatchEvent(new Event('akesevai-data-changed'));
    } catch (e) {}
  }
};

export const subscribeTokens = (callback) => {
  return subscribeTokensMongo((mongoTokens) => {
    try {
      const localToks = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
      const tokenMap = new Map();
      [...(Array.isArray(mongoTokens) ? mongoTokens : []), ...localToks].forEach(t => {
        if (!t) return;
        const key = String(t.id || t.tokenNo || t.tokenId || t.utr || '');
        if (key && !tokenMap.has(key)) tokenMap.set(key, t);
      });
      if (callback) callback(Array.from(tokenMap.values()));
    } catch (e) {
      if (callback) callback(mongoTokens || []);
    }
  });
};

// --- EXPIRY DOCUMENTS (MONGODB DATABASE) ---

export const compressImageForUpload = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], (file.name || 'doc.jpg').replace(/\.[^/.]+$/, ".jpg"), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          0.65
        );
      };
      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
};

export const saveExpiryDocumentCloud = async (docData) => {
  if (!docData || (!docData.id && !docData.url)) return;
  const docId = docData.id || `DOC-${Date.now()}`;
  const fullDocData = { ...docData, id: docId, updatedAt: new Date().toISOString() };

  if (typeof window !== 'undefined') {
    try {
      const { data, ...safeDocData } = fullDocData;
      const dUrl = safeDocData.url || '';
      const storageSafeDoc = {
        ...safeDocData,
        data: '',
        url: (typeof dUrl === 'string' && dUrl.startsWith('data:')) ? '' : dUrl
      };

      const rawExpDocs = localStorage.getItem('akesevai_expiry_docs') || '[]';
      const expDocs = JSON.parse(rawExpDocs);
      const filtered = expDocs.filter(d => d.id !== docId && d.requirement !== docData.requirement);
      filtered.unshift(storageSafeDoc);
      localStorage.setItem('akesevai_expiry_docs', JSON.stringify(filtered));

      const phone = String(docData.customerPhone || docData.phone || '').replace(/\D/g, '');
      if (phone) {
        ['akesevai-customer-records', 'akesevai-customers'].forEach(storageKey => {
          const rawCusts = localStorage.getItem(storageKey);
          if (rawCusts) {
            const custs = JSON.parse(rawCusts);
            if (custs[phone]) {
              const currentDocs = custs[phone].documents || [];
              const fDocs = currentDocs.filter(d => d.id !== docId && d.requirement !== docData.requirement);
              custs[phone].documents = [storageSafeDoc, ...fDocs];
              localStorage.setItem(storageKey, JSON.stringify(custs));
            }
          }
        });
      }

      window.dispatchEvent(new Event('akesevai-data-changed'));
    } catch (e) {}
  }

  try {
    await saveExpiryDocumentMongo(fullDocData);
  } catch (e) {
    logNotice('MongoDB Document save', e);
  }
};

export const getDeletedDocsSet = () => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem('akesevai-deleted-docs');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
};

export const isDocumentDeletedByBlacklist = (docItem, deletedSet = null) => {
  if (!docItem) return true;
  const delSet = deletedSet || getDeletedDocsSet();
  if (!delSet || !(delSet instanceof Set) || delSet.size === 0) return false;

  const dId = String(docItem.id || docItem.docId || docItem.tokenId || '').trim();
  const dName = String(docItem.name || '').trim();
  const dReq = String(docItem.requirement || docItem.title || '').trim();
  const dTitle = String(docItem.title || docItem.requirement || '').trim();
  const rawPhone = docItem.customerPhone || docItem.phone || '';
  const cleanP = String(rawPhone).replace(/\D/g, '');

  if (dId && delSet.has(dId)) return true;
  if (dName && delSet.has(dName)) return true;
  if (dReq && delSet.has(dReq)) return true;
  if (dTitle && delSet.has(dTitle)) return true;

  if (cleanP) {
    if (dName && delSet.has(`${cleanP}_${dName}`)) return true;
    if (dReq && delSet.has(`${cleanP}_${dReq}`)) return true;
    if (dTitle && delSet.has(`${cleanP}_${dTitle}`)) return true;
  }

  return false;
};

export const filterDeletedDocs = (docsList = []) => {
  if (!Array.isArray(docsList)) return [];
  const deletedSet = getDeletedDocsSet();
  if (deletedSet.size === 0) return docsList;
  return docsList.filter(d => !isDocumentDeletedByBlacklist(d, deletedSet));
};

export const deleteExpiryDocumentCloud = async (docId, customerPhone = '', docMeta = null) => {
  if (!docId && !docMeta) return;
  const strId = String(docId || '');
  
  try {
    if (strId && !strId.startsWith('data:')) {
      await deleteExpiryDocumentMongo(strId);
    }
  } catch (err) {
    logNotice('MongoDB Document delete', err);
  }

  if (typeof window !== 'undefined') {
    try {
      const delDocsSet = getDeletedDocsSet();
      
      const safeAddKey = (k) => {
        if (!k) return;
        const strKey = String(k).trim();
        if (strKey && strKey.length < 500 && !strKey.startsWith('data:image')) {
          delDocsSet.add(strKey);
        }
      };

      safeAddKey(strId);

      const cleanPhone = String(customerPhone || docMeta?.customerPhone || docMeta?.phone || '').replace(/\D/g, '');

      if (docMeta) {
        safeAddKey(docMeta.id);
        safeAddKey(docMeta.name);
        safeAddKey(docMeta.requirement);
        safeAddKey(docMeta.title);
        safeAddKey(docMeta.storagePath);
        if (cleanPhone) {
          if (docMeta.name) safeAddKey(`${cleanPhone}_${docMeta.name}`);
          if (docMeta.requirement) safeAddKey(`${cleanPhone}_${docMeta.requirement}`);
          if (docMeta.title) safeAddKey(`${cleanPhone}_${docMeta.title}`);
        }
      }

      localStorage.setItem('akesevai-deleted-docs', JSON.stringify(Array.from(delDocsSet)));

      const expDocsRaw = localStorage.getItem('akesevai_expiry_docs');
      if (expDocsRaw) {
        const expDocsArr = JSON.parse(expDocsRaw);
        const filteredDocs = expDocsArr.filter(d => !isDocumentDeletedByBlacklist(d, delDocsSet));
        localStorage.setItem('akesevai_expiry_docs', JSON.stringify(filteredDocs));
      }

      if (cleanPhone) {
        const phoneVariants = [cleanPhone, `+91${cleanPhone}`, `91${cleanPhone}`];

        ['akesevai-customer-records', 'akesevai-customers'].forEach(storageKey => {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const records = JSON.parse(raw);
            let updated = false;
            let targetProfileToSync = null;

            phoneVariants.forEach(pv => {
              if (records[pv] && Array.isArray(records[pv].documents)) {
                const initialLen = records[pv].documents.length;
                records[pv].documents = records[pv].documents.filter(d => !isDocumentDeletedByBlacklist(d, delDocsSet));
                if (records[pv].documents.length !== initialLen) {
                  updated = true;
                  targetProfileToSync = records[pv];
                }
              }
            });

            if (updated) {
              localStorage.setItem(storageKey, JSON.stringify(records));
              if (targetProfileToSync && typeof saveCustomerProfileMongo === 'function') {
                saveCustomerProfileMongo(cleanPhone, targetProfileToSync).catch(() => {});
              }
            }
          }
        });
      }
    } catch (e) {
      console.warn('[AkEsevai Document Delete Error]:', e);
    }

    try {
      window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'document', id: strId } }));
    } catch (e) {}
  }
};

export const uploadFileToFirebaseStorage = async (fileInput, pathFolder = 'customer_documents', customerPhone = '') => {
  if (!fileInput) return null;
  const uploadRes = await uploadFileToMongoStorage(fileInput, pathFolder, customerPhone);
  const docRecord = {
    id: `DOC-${Date.now()}`,
    name: fileInput.name || 'document.jpg',
    type: fileInput.type || 'image/jpeg',
    size: fileInput.size || 0,
    url: uploadRes.url,
    storagePath: uploadRes.storagePath,
    customerPhone,
    uploadedAt: new Date().toISOString()
  };
  await saveExpiryDocumentCloud(docRecord);
  return docRecord;
};

export const uploadDataUrlToFirebaseStorage = async (dataUrl, filename = 'document.jpg', pathFolder = 'customer_photos') => {
  if (!dataUrl) return null;
  return {
    url: dataUrl,
    storagePath: `mongo_storage/${Date.now()}_${filename}`,
    name: filename,
    uploadedAt: new Date().toISOString()
  };
};

export const subscribeExpiryDocuments = (callback) => {
  return subscribeExpiryDocumentsMongo((rawDocs) => {
    try {
      const localDocs = JSON.parse(localStorage.getItem('akesevai_expiry_docs') || '[]');
      const docMap = new Map();
      [...localDocs, ...(Array.isArray(rawDocs) ? rawDocs : [])].forEach(d => {
        if (!d) return;
        const key = String(d.id || d.url || d.name || '');
        if (key && !docMap.has(key)) docMap.set(key, d);
      });
      const filtered = filterDeletedDocs(Array.from(docMap.values()));
      if (callback) callback(filtered);
    } catch (e) {
      const filtered = filterDeletedDocs(rawDocs || []);
      if (callback) callback(filtered);
    }
  });
};

export const saveLiveQueueCloud = async (queueState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('akesevai-live-center-status', JSON.stringify(queueState));
    window.dispatchEvent(new Event('akesevai-data-changed'));
  } catch (e) {}
};

export const readTokenBookings = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('akesevai-token-bookings') || localStorage.getItem('akesevai-tokens') || '[]';
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
};

export const subscribeLiveQueue = (callback) => {
  if (typeof window === 'undefined') {
    if (callback) callback(null);
    return () => {};
  }
  const handler = () => {
    try {
      const raw = localStorage.getItem('akesevai-live-center-status');
      if (callback) callback(raw ? JSON.parse(raw) : null);
    } catch (e) {
      if (callback) callback(null);
    }
  };
  handler();
  window.addEventListener('akesevai-data-changed', handler);
  return () => window.removeEventListener('akesevai-data-changed', handler);
};

export const saveServiceOfDayCloud = async (sodData) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('akesevai-service-of-day', JSON.stringify(sodData));
    window.dispatchEvent(new Event('akesevai-data-changed'));
  } catch (e) {}
};

export const subscribeServiceOfDay = (callback) => {
  if (typeof window === 'undefined') {
    if (callback) callback(null);
    return () => {};
  }
  const handler = () => {
    try {
      const raw = localStorage.getItem('akesevai-service-of-day');
      if (callback) callback(raw ? JSON.parse(raw) : null);
    } catch (e) {
      if (callback) callback(null);
    }
  };
  handler();
  window.addEventListener('akesevai-data-changed', handler);
  return () => window.removeEventListener('akesevai-data-changed', handler);
};
export const recordLoginEventCloud = async (loginData) => {};
export const saveCustomerReviewCloud = async (reviewData) => {};
export const subscribeCustomerReviews = (callback) => { callback([]); return () => {}; };
export const saveReferralCloud = async (code, referralData) => {};
export const subscribeReferrals = (callback) => { callback({}); return () => {}; };

export const fetchAllCloudRecords = async () => {
  let mongoCustomers = {};
  let mongoTokens = [];
  let mongoDocs = [];
  let mongoApps = {};

  try {
    mongoCustomers = (await fetchAllCustomerProfilesMongo()) || {};
    mongoTokens = (await fetchAllTokensMongo()) || [];
    mongoDocs = (await fetchAllExpiryDocumentsMongo()) || [];
    mongoApps = (await fetchAllApplicationsMongo()) || {};

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('akesevai-customer-records', JSON.stringify(mongoCustomers));
      localStorage.setItem('akesevai-customers', JSON.stringify(mongoCustomers));
      localStorage.setItem('akesevai-token-bookings', JSON.stringify(mongoTokens));
      localStorage.setItem('akesevai_expiry_docs', JSON.stringify(mongoDocs));
      localStorage.setItem('akesevai-application-records', JSON.stringify(mongoApps));
    }
  } catch (e) {
    if (typeof window !== 'undefined' && window.localStorage) {
      mongoCustomers = JSON.parse(localStorage.getItem('akesevai-customer-records') || '{}');
      mongoTokens = JSON.parse(localStorage.getItem('akesevai-token-bookings') || '[]');
      mongoDocs = JSON.parse(localStorage.getItem('akesevai_expiry_docs') || '[]');
      mongoApps = JSON.parse(localStorage.getItem('akesevai-application-records') || '{}');
    }
  }

  return {
    customers: mongoCustomers,
    tokens: mongoTokens,
    documents: mongoDocs,
    applications: mongoApps
  };
};

export const purgeAllFirebaseCloudData = async () => {
  clearAllApplicationLocalStorage();
  return true;
};

const BASE_VISITOR_COUNT = 18472;

export const recordVisitorHitCloud = async () => {};
export const subscribeVisitorCounter = (callback) => {
  callback(BASE_VISITOR_COUNT);
  return () => {};
};

export const recordDetailedVisitorVisitCloud = async (pageName = 'Home', customerInfo = null) => {
  if (typeof window === 'undefined') return;
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const nowIso = new Date().toISOString();
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const deviceType = isMobile ? '📱 Mobile' : '💻 Desktop';
    const cleanPhone = customerInfo?.phone ? String(customerInfo.phone).replace(/\D/g, '') : '';
    const name = customerInfo?.profile?.name || customerInfo?.name || (cleanPhone ? `Customer +91 ${cleanPhone}` : 'Guest Visitor');

    const logEntry = {
      id: `${todayStr}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      date: todayStr,
      timestamp: nowIso,
      timeStr: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      page: pageName,
      name: name,
      phone: cleanPhone || 'N/A',
      device: deviceType
    };

    const logsRaw = localStorage.getItem('akesevai-daily-visitor-logs') || '[]';
    const logsArr = JSON.parse(logsRaw);
    logsArr.unshift(logEntry);
    localStorage.setItem('akesevai-daily-visitor-logs', JSON.stringify(logsArr.slice(0, 500)));
  } catch (err) {}
};

export const subscribeDailyVisitorLogsCloud = (callback) => {
  if (typeof window === 'undefined' || typeof callback !== 'function') return () => {};
  try {
    const logs = JSON.parse(localStorage.getItem('akesevai-daily-visitor-logs') || '[]');
    callback(logs);
  } catch (e) {
    callback([]);
  }
  return () => {};
};

// --- SPONSORED ADS (PROMOTIONAL BANNERS) ---

export const getDeletedSponsoredAdsSet = () => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem('akesevai-deleted-sponsored-ads');
    return new Set(raw ? JSON.parse(raw) : []);
  } catch (e) {
    return new Set();
  }
};

export const saveSponsoredAdCloud = async (adData) => {
  if (!adData || !adData.id) return;
  try {
    const raw = localStorage.getItem('akesevai-sponsored-ads');
    let ads = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(ads)) {
      ads = [];
    }
    const filtered = ads.filter((a) => String(a.id) !== String(adData.id));
    filtered.unshift(adData);
    localStorage.setItem('akesevai-sponsored-ads', JSON.stringify(filtered));
    localStorage.setItem('akesevai-has-custom-sponsored-ads', 'true');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('akesevai-ads-changed'));
      window.dispatchEvent(new Event('storage'));
    }
    // Sync with MongoDB Atlas
    await saveAdvertisementMongo(adData);
  } catch (e) {}
};

export const deleteSponsoredAdCloud = async (adId) => {
  if (!adId) return;
  const strId = String(adId).trim();
  try {
    const delSet = getDeletedSponsoredAdsSet();
    delSet.add(strId);
    localStorage.setItem('akesevai-deleted-sponsored-ads', JSON.stringify(Array.from(delSet)));

    const raw = localStorage.getItem('akesevai-sponsored-ads');
    if (raw) {
      const ads = JSON.parse(raw);
      const filtered = ads.filter((a) => String(a.id).trim() !== strId);
      localStorage.setItem('akesevai-sponsored-ads', JSON.stringify(filtered));
    }
    localStorage.setItem('akesevai-has-custom-sponsored-ads', 'true');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('akesevai-ads-changed'));
      window.dispatchEvent(new Event('storage'));
    }
    // Sync with MongoDB Atlas
    await deleteAdvertisementMongo(strId);
  } catch (e) {}
};

export const subscribeSponsoredAds = (callback) => {
  const notifyCallback = async () => {
    try {
      const delSet = getDeletedSponsoredAdsSet();
      const hasCustom = localStorage.getItem('akesevai-has-custom-sponsored-ads') === 'true';
      const raw = localStorage.getItem('akesevai-sponsored-ads');
      
      let ads = [];
      if (raw) {
        ads = JSON.parse(raw);
      }
      
      // If local is empty, try to fetch from MongoDB Atlas
      if (ads.length === 0) {
        try {
          const mongoAds = await fetchAllAdvertisementsMongo(true);
          if (Array.isArray(mongoAds) && mongoAds.length > 0) {
            ads = mongoAds;
            localStorage.setItem('akesevai-sponsored-ads', JSON.stringify(ads));
          }
        } catch (err) {}
      }

      if (ads.length === 0 && !hasCustom) {
        if (callback) callback(null);
        return;
      }
      
      const filtered = ads.filter((a) => a && a.id && !delSet.has(String(a.id).trim()));
      if (callback) callback(filtered);
    } catch (e) {
      if (callback) callback([]);
    }
  };

  notifyCallback();
  if (typeof window !== 'undefined') {
    window.addEventListener('akesevai-ads-changed', notifyCallback);
    window.addEventListener('akesevai-data-changed', notifyCallback);
    window.addEventListener('storage', notifyCallback);
  }
  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('akesevai-ads-changed', notifyCallback);
      window.removeEventListener('akesevai-data-changed', notifyCallback);
      window.removeEventListener('storage', notifyCallback);
    }
  };
};

export const purgeAllSystemRecordsCloud = async () => {
  if (typeof window === 'undefined') return;
  try {
    const keysToWipe = [
      'akesevai-customer-records',
      'akesevai-customers',
      'akesevai-token-bookings',
      'akesevai-application-records',
      'akesevai_expiry_docs',
      'akesevai-deleted-customers',
      'akesevai-deleted-apps',
      'akesevai-deleted-docs',
      'akesevai_customer_session',
      'akesevai-daily-visitor-logs'
    ];
    keysToWipe.forEach((k) => {
      try {
        localStorage.removeItem(k);
        sessionStorage.removeItem(k);
      } catch (e) {}
    });
    window.location.reload();
  } catch (err) {
    window.location.reload();
  }
};
