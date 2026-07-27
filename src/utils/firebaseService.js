import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from '../config/firebase';

const CUSTOMERS_COLLECTION = 'customers';
const APPLICATIONS_COLLECTION = 'applications';
const TOKENS_COLLECTION = 'tokens';
const DOCUMENTS_COLLECTION = 'documents';
const ADS_COLLECTION = 'sponsored_ads';

// Local storage backup key references
const CUSTOMER_RECORDS_KEY = 'akesevai-customer-records';
const STATUS_RECORDS_KEY = 'akesevai-application-records';
const TOKEN_BOOKINGS_KEY = 'akesevai-token-bookings';
const EXPIRY_DOCS_KEY = 'akesevai-expiry-documents';
const SPONSORED_ADS_KEY = 'akesevai-sponsored-ads';

const logFirebaseNotice = (tag, err) => {
  const msg = err?.message || String(err || '');
  if (msg.includes('permissions') || err?.code === 'permission-denied') {
    // Quietly fallback to local storage mode without spewing console warnings
    return;
  }
  console.info(`[AkEsevai Sync] ${tag}:`, msg);
};

// --- CUSTOMER PROFILES ---

export const saveCustomerProfileCloud = async (phone, profileData) => {
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (!cleanPhone) return;

  // Local storage save
  try {
    const existing = JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}');
    existing[cleanPhone] = { ...(existing[cleanPhone] || {}), ...profileData, phone: cleanPhone };
    localStorage.setItem(CUSTOMER_RECORDS_KEY, JSON.stringify(existing));
  } catch (e) {
    logFirebaseNotice('Local storage write', e);
  }

  // Cloud Firestore payload sanitization (truncate giant base64 Data URLs so Firestore document size <= 1MB)
  const sanitizedDocs = (profileData.documents || []).map(doc => {
    if (doc.data && doc.data.length > 50000 && doc.data.startsWith('data:')) {
      return {
        ...doc,
        data: doc.url && !doc.url.startsWith('data:') ? doc.url : `LOCAL_DATA_URL_${doc.id || Date.now()}`
      };
    }
    return doc;
  });

  const dataToSave = {
    ...profileData,
    documents: sanitizedDocs,
    phone: cleanPhone,
    updatedAt: new Date().toISOString()
  };

  // Cloud Firestore save
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, cleanPhone);
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Customer cloud save', err);
  }
};

export const deleteCustomerProfileCloud = async (phone) => {
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (!cleanPhone) return;

  try {
    const existing = JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}');
    delete existing[cleanPhone];
    delete existing[phone];
    localStorage.setItem(CUSTOMER_RECORDS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    logFirebaseNotice('Local storage delete', e);
  }

  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, cleanPhone);
    await deleteDoc(docRef);
    if (phone && phone !== cleanPhone) {
      try { await deleteDoc(doc(db, CUSTOMERS_COLLECTION, String(phone))); } catch {}
    }
  } catch (err) {
    logFirebaseNotice('Customer cloud delete', err);
  }
};

export const deleteTokenBookingCloud = async (tokenNo) => {
  if (!tokenNo) return;

  try {
    const existingTokens = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
    const filtered = existingTokens.filter(t => String(t.tokenNo) !== String(tokenNo) && String(t.id) !== String(tokenNo));
    localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    logFirebaseNotice('Local token delete', e);
  }

  try {
    const docRef = doc(db, TOKENS_COLLECTION, String(tokenNo));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Token cloud delete', err);
  }
};

export const deleteApplicationCloud = async (appId) => {
  if (!appId) return;

  try {
    const existing = JSON.parse(localStorage.getItem(STATUS_RECORDS_KEY) || '{}');
    delete existing[appId];
    localStorage.setItem(STATUS_RECORDS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    logFirebaseNotice('Local application delete', e);
  }

  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, String(appId));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Application cloud delete', err);
  }
};

export const deleteExpiryDocumentCloud = async (docId) => {
  if (!docId) return;

  try {
    const existing = JSON.parse(localStorage.getItem(EXPIRY_DOCS_KEY) || '[]');
    const filtered = existing.filter(d => String(d.id) !== String(docId) && String(d.url) !== String(docId));
    localStorage.setItem(EXPIRY_DOCS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    logFirebaseNotice('Local document delete', e);
  }

  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, String(docId));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Document cloud delete', err);
  }
};

export const deleteSponsoredAdCloud = async (adId) => {
  if (!adId) return;

  try {
    const existing = JSON.parse(localStorage.getItem(SPONSORED_ADS_KEY) || '[]');
    const filtered = existing.filter(a => String(a.id) !== String(adId));
    localStorage.setItem(SPONSORED_ADS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    logFirebaseNotice('Local ad delete', e);
  }

  try {
    const docRef = doc(db, ADS_COLLECTION, String(adId));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Sponsored ad cloud delete', err);
  }
};

export const deleteNotificationCloud = async (notifId) => {
  if (!notifId) return;

  try {
    const docRef = doc(db, 'notifications', String(notifId));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Notification cloud delete', err);
  }
};

export const subscribeCustomerProfiles = (callback) => {
  try {
    const q = collection(db, CUSTOMERS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const records = {};
      snapshot.forEach((docSnap) => {
        records[docSnap.id] = docSnap.data();
      });
      localStorage.setItem(CUSTOMER_RECORDS_KEY, JSON.stringify(records));
      callback(records);
    }, (error) => {
      logFirebaseNotice('Customer listener', error);
      const local = JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}');
      callback(local);
    });
  } catch (e) {
    const local = JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}');
    callback(local);
    return () => {};
  }
};

// --- APPLICATIONS ---

export const saveApplicationCloud = async (appId, appData) => {
  if (!appId) return;

  const dataToSave = {
    ...appData,
    id: appId,
    updatedAt: new Date().toISOString()
  };

  // Local storage sync
  try {
    const existing = JSON.parse(localStorage.getItem(STATUS_RECORDS_KEY) || '{}');
    existing[appId] = { ...(existing[appId] || {}), ...dataToSave };
    localStorage.setItem(STATUS_RECORDS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    logFirebaseNotice('Local application save', e);
  }

  // Cloud Firestore sync
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, appId);
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Application cloud save', err);
  }
};

export const subscribeApplications = (callback) => {
  try {
    const q = collection(db, APPLICATIONS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const apps = {};
      snapshot.forEach((docSnap) => {
        apps[docSnap.id] = docSnap.data();
      });
      if (Object.keys(apps).length > 0) {
        localStorage.setItem(STATUS_RECORDS_KEY, JSON.stringify(apps));
        callback(apps);
      } else {
        const local = JSON.parse(localStorage.getItem(STATUS_RECORDS_KEY) || '{}');
        callback(local);
      }
    }, (error) => {
      logFirebaseNotice('Applications listener', error);
      const local = JSON.parse(localStorage.getItem(STATUS_RECORDS_KEY) || '{}');
      callback(local);
    });
  } catch (e) {
    const local = JSON.parse(localStorage.getItem(STATUS_RECORDS_KEY) || '{}');
    callback(local);
    return () => {};
  }
};

// --- TOKENS & QUEUE ---

export const saveTokenBookingCloud = async (tokenData) => {
  if (!tokenData || !tokenData.tokenNo) return;

  const dataToSave = {
    ...tokenData,
    updatedAt: new Date().toISOString()
  };

  // Local storage sync
  try {
    const existingTokens = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
    const filtered = existingTokens.filter(t => t.tokenNo !== tokenData.tokenNo);
    const updated = [dataToSave, ...filtered];
    localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    logFirebaseNotice('Local token save', e);
  }

  // Cloud Firestore sync
  try {
    const docRef = doc(db, TOKENS_COLLECTION, String(tokenData.tokenNo));
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Token cloud save', err);
  }
};

export const subscribeTokens = (callback) => {
  try {
    const q = collection(db, TOKENS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const tokens = [];
      snapshot.forEach((docSnap) => {
        tokens.push(docSnap.data());
      });
      localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(tokens));
      callback(tokens);
    }, (error) => {
      logFirebaseNotice('Tokens listener', error);
      const local = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
      callback(local);
    });
  } catch (e) {
    const local = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
    callback(local);
    return () => {};
  }
};

// --- EXPIRY DOCUMENTS ---

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

  // 1. Save to Local Storage immediately
  try {
    const existing = JSON.parse(localStorage.getItem(EXPIRY_DOCS_KEY) || '[]');
    const filtered = existing.filter(d => d.id !== docId && d.url !== fullDocData.url);
    const updated = [fullDocData, ...filtered];
    try {
      localStorage.setItem(EXPIRY_DOCS_KEY, JSON.stringify(updated));
    } catch (quotaErr) {
      console.warn('localStorage quota reached for expiry docs. Cleaning heavy data strings...', quotaErr);
      const cleaned = updated.map(d => ({
        ...d,
        url: d.url && d.url.length > 200000 && d.url.startsWith('data:') ? '' : d.url
      }));
      localStorage.setItem(EXPIRY_DOCS_KEY, JSON.stringify(cleaned));
    }
  } catch (e) {
    logFirebaseNotice('Local document save', e);
  }

  // 2. Save to Firebase Firestore documents collection
  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, String(docId));
    await setDoc(docRef, { ...fullDocData, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (e) {
    logFirebaseNotice('Document cloud save', e);
  }
};

// --- FIREBASE CLOUD STORAGE UPLOAD (PDF & JPG FILES) ---

export const uploadFileToFirebaseStorage = async (fileInput, pathFolder = 'customer_documents', customerPhone = '') => {
  if (!fileInput) return null;

  // Compress image if camera/photo upload
  const file = await compressImageForUpload(fileInput);

  const timestamp = Date.now();
  const sanitizeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : `doc_${timestamp}`;
  const filePath = `${pathFolder}/${customerPhone ? customerPhone + '_' : ''}${timestamp}_${sanitizeName}`;

  const createDataUrlRecord = () => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        let resultUrl = e.target.result;
        // Safety check: if data URL is huge (> 1.5MB), use Object URL to prevent quota crash
        if (resultUrl && resultUrl.length > 1500000) {
          try {
            resultUrl = URL.createObjectURL(file);
          } catch (objErr) {
            console.warn('Object URL creation fallback', objErr);
          }
        }

        const localRecord = {
          id: `DOC-LOCAL-${timestamp}`,
          name: file.name || sanitizeName,
          type: file.type || 'application/pdf',
          size: file.size || 0,
          url: resultUrl,
          customerPhone,
          uploadedAt: new Date().toISOString()
        };
        saveExpiryDocumentCloud(localRecord);
        resolve(localRecord);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  try {
    const cloudUploadPromise = (async () => {
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      const docRecord = {
        id: `DOC-${timestamp}`,
        name: file.name || sanitizeName,
        type: file.type || (file.name?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
        size: file.size || 0,
        url: downloadURL,
        storagePath: filePath,
        customerPhone,
        uploadedAt: new Date().toISOString()
      };

      await saveExpiryDocumentCloud(docRecord);
      return docRecord;
    })();

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Storage upload timeout')), 3500)
    );

    return await Promise.race([cloudUploadPromise, timeoutPromise]);
  } catch (err) {
    console.warn('Firebase Storage upload notice (instant fallback to Data URL):', err?.message || err);
    return await createDataUrlRecord();
  }
};

export const uploadDataUrlToFirebaseStorage = async (dataUrl, filename = 'document.jpg', pathFolder = 'customer_photos') => {
  if (!dataUrl) return null;

  const timestamp = Date.now();
  const filePath = `${pathFolder}/${timestamp}_${filename}`;

  try {
    const storageRef = ref(storage, filePath);
    const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      storagePath: filePath,
      name: filename,
      uploadedAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn('Firebase Storage string upload notice:', err?.message || err);
    return { url: dataUrl, name: filename, uploadedAt: new Date().toISOString() };
  }
};

export const subscribeExpiryDocuments = (callback) => {
  try {
    const q = collection(db, DOCUMENTS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const docsList = [];
      snapshot.forEach((docSnap) => {
        docsList.push(docSnap.data());
      });
      localStorage.setItem(EXPIRY_DOCS_KEY, JSON.stringify(docsList));
      callback(docsList);
    }, (error) => {
      console.warn('Firebase documents listener offline notice:', error);
      const local = JSON.parse(localStorage.getItem(EXPIRY_DOCS_KEY) || '[]');
      callback(local);
    });
  } catch (e) {
    const local = JSON.parse(localStorage.getItem(EXPIRY_DOCS_KEY) || '[]');
    callback(local);
    return () => {};
  }
};

// --- LIVE QUEUE STATUS ---

const QUEUE_STATUS_KEY = 'akesevai-live-queue-status';
const SERVICE_OF_DAY_KEY = 'akesevai-service-of-day';
const LOGINS_COLLECTION = 'user_logins';
const SETTINGS_COLLECTION = 'portal_settings';

export const saveLiveQueueCloud = async (queueState) => {
  if (!queueState) return;
  try {
    localStorage.setItem(QUEUE_STATUS_KEY, JSON.stringify(queueState));
    const docRef = doc(db, SETTINGS_COLLECTION, 'live_queue');
    await setDoc(docRef, { ...queueState, updatedAt: new Date().toISOString(), lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn('Live queue cloud save fallback:', e);
  }
};

export const subscribeLiveQueue = (callback) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'live_queue');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem(QUEUE_STATUS_KEY, JSON.stringify(data));
        callback(data);
      } else {
        const local = JSON.parse(localStorage.getItem(QUEUE_STATUS_KEY) || '{}');
        callback(local);
      }
    }, () => {
      const local = JSON.parse(localStorage.getItem(QUEUE_STATUS_KEY) || '{}');
      callback(local);
    });
  } catch (e) {
    const local = JSON.parse(localStorage.getItem(QUEUE_STATUS_KEY) || '{}');
    callback(local);
    return () => {};
  }
};

// --- SERVICE OF THE DAY ---

export const saveServiceOfDayCloud = async (sodData) => {
  try {
    if (sodData) {
      localStorage.setItem(SERVICE_OF_DAY_KEY, JSON.stringify(sodData));
    } else {
      localStorage.removeItem(SERVICE_OF_DAY_KEY);
    }
    const docRef = doc(db, SETTINGS_COLLECTION, 'service_of_day');
    await setDoc(docRef, { data: sodData || null, updatedAt: new Date().toISOString(), lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn('Service of day cloud sync warning:', e);
  }
};

export const subscribeServiceOfDay = (callback) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'service_of_day');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().data !== undefined) {
        const sod = docSnap.data().data;
        if (sod) {
          localStorage.setItem(SERVICE_OF_DAY_KEY, JSON.stringify(sod));
        } else {
          localStorage.removeItem(SERVICE_OF_DAY_KEY);
        }
        callback(sod);
      } else {
        const local = JSON.parse(localStorage.getItem(SERVICE_OF_DAY_KEY) || 'null');
        callback(local);
      }
    }, () => {
      const local = JSON.parse(localStorage.getItem(SERVICE_OF_DAY_KEY) || 'null');
      callback(local);
    });
  } catch (e) {
    const local = JSON.parse(localStorage.getItem(SERVICE_OF_DAY_KEY) || 'null');
    callback(local);
    return () => {};
  }
};

// --- LOGIN AUDIT & SESSION RECORDS ---

export const recordLoginEventCloud = async (loginData) => {
  if (!loginData) return;
  try {
    const eventId = `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const docRef = doc(db, LOGINS_COLLECTION, eventId);
    await setDoc(docRef, {
      ...loginData,
      timestamp: new Date().toISOString(),
      lastCloudSync: serverTimestamp()
    });
  } catch (e) {
    console.warn('Login event cloud log notice:', e);
  }
};

// --- INITIAL AUTO SYNC FOR FIREBASE FIRESTORE DATA COLLECTIONS ---

export const syncAllLocalDataToFirebaseCloud = async () => {
  if (!isFirebaseConfigured()) return;

  try {
    // 1. Sync Customers Collection
    const customers = JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}');
    for (const [phone, pData] of Object.entries(customers)) {
      if (phone) {
        const docRef = doc(db, CUSTOMERS_COLLECTION, phone);
        await setDoc(docRef, { ...pData, phone, lastCloudSync: serverTimestamp() }, { merge: true });
      }
    }

    // 2. Sync Applications Collection
    const apps = JSON.parse(localStorage.getItem(STATUS_RECORDS_KEY) || '{}');
    for (const [appId, aData] of Object.entries(apps)) {
      if (appId) {
        const docRef = doc(db, APPLICATIONS_COLLECTION, appId);
        await setDoc(docRef, { ...aData, id: appId, lastCloudSync: serverTimestamp() }, { merge: true });
      }
    }

    // 3. Sync Tokens Collection
    const tokens = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
    for (const tData of tokens) {
      if (tData?.tokenNo) {
        const docRef = doc(db, TOKENS_COLLECTION, String(tData.tokenNo));
        await setDoc(docRef, { ...tData, lastCloudSync: serverTimestamp() }, { merge: true });
      }
    }

    // 4. Sync Expiry Documents Collection
    const docs = JSON.parse(localStorage.getItem(EXPIRY_DOCS_KEY) || '[]');
    for (const dData of docs) {
      if (dData?.id) {
        const docRef = doc(db, DOCUMENTS_COLLECTION, String(dData.id));
        await setDoc(docRef, { ...dData, lastCloudSync: serverTimestamp() }, { merge: true });
      }
    }

    console.log('✅ AkEsevai Firebase Firestore Collections successfully synced!');
  } catch (err) {
    console.warn('Firebase initial sync warning:', err);
  }
};

export const fetchAllCloudRecords = async () => {
  if (!isFirebaseConfigured()) return null;

  try {
    const customersRef = collection(db, CUSTOMERS_COLLECTION);
    const customersSnap = await getDocs(customersRef);
    const customers = {};
    customersSnap.forEach((d) => {
      customers[d.id] = d.data();
    });

    const tokensRef = collection(db, TOKENS_COLLECTION);
    const tokensSnap = await getDocs(tokensRef);
    const tokens = [];
    tokensSnap.forEach((d) => tokens.push(d.data()));

    const docsRef = collection(db, DOCUMENTS_COLLECTION);
    const docsSnap = await getDocs(docsRef);
    const documents = [];
    docsSnap.forEach((d) => documents.push(d.data()));

    if (Object.keys(customers).length > 0) {
      localStorage.setItem(CUSTOMER_RECORDS_KEY, JSON.stringify(customers));
    }
    if (tokens.length > 0) {
      localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(tokens));
    }
    if (documents.length > 0) {
      localStorage.setItem(EXPIRY_DOCS_KEY, JSON.stringify(documents));
    }

    return { customers, tokens, documents };
  } catch (err) {
    console.warn('Firebase direct cloud fetch notice:', err);
    return null;
  }
};


