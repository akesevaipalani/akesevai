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

const handleFirebaseError = (context, err) => {
  if (err?.code === 'permission-denied' || err?.message?.includes('PERMISSION_DENIED')) {
    console.error(`🚨 Firebase Firestore [${context}] PERMISSION DENIED! Go to Firebase Console -> Cloud Firestore -> Rules tab and set 'allow read, write: if true;' then click Publish.`);
  } else {
    console.warn(`Firebase [${context}] notice:`, err?.message || err);
  }
};

// --- CUSTOMER PROFILES ---

export const saveCustomerProfileCloud = async (phone, profileData) => {
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (!cleanPhone) return;

  const dataToSave = {
    ...profileData,
    phone: cleanPhone,
    updatedAt: new Date().toISOString()
  };

  // Local storage save
  try {
    const existing = JSON.parse(localStorage.getItem(CUSTOMER_RECORDS_KEY) || '{}');
    existing[cleanPhone] = { ...(existing[cleanPhone] || {}), ...dataToSave };
    localStorage.setItem(CUSTOMER_RECORDS_KEY, JSON.stringify(existing));
  } catch (e) {
    console.warn('Local storage write warning:', e);
  }

  // Cloud Firestore save
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, cleanPhone);
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('Firebase customer save fallback to local:', err?.message || err);
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
  } catch (e) {
    console.warn('Local storage delete warning:', e);
  }

  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, cleanPhone);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firebase customer delete warning:', err);
  }
};

export const deleteTokenBookingCloud = async (tokenNo) => {
  if (!tokenNo) return;

  try {
    const existingTokens = JSON.parse(localStorage.getItem(TOKEN_BOOKINGS_KEY) || '[]');
    const filtered = existingTokens.filter(t => t.tokenNo !== tokenNo);
    localStorage.setItem(TOKEN_BOOKINGS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Local token delete warning:', e);
  }

  try {
    const docRef = doc(db, TOKENS_COLLECTION, String(tokenNo));
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firebase token delete warning:', err);
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
      console.warn('Firebase customer listener offline notice:', error);
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
    console.warn('Local application save warning:', e);
  }

  // Cloud Firestore sync
  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, appId);
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('Firebase application save fallback to local:', err?.message || err);
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
      console.warn('Firebase applications listener offline:', error);
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
    console.warn('Local token save warning:', e);
  }

  // Cloud Firestore sync
  try {
    const docRef = doc(db, TOKENS_COLLECTION, String(tokenData.tokenNo));
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('Firebase token save fallback to local:', err?.message || err);
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
      console.warn('Firebase tokens listener offline notice:', error);
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

export const saveExpiryDocumentCloud = async (docData) => {
  if (!docData || (!docData.id && !docData.url)) return;

  const docId = docData.id || `DOC-${Date.now()}`;
  const fullDocData = { ...docData, id: docId, updatedAt: new Date().toISOString() };

  // 1. Save to Local Storage immediately
  try {
    const existing = JSON.parse(localStorage.getItem(EXPIRY_DOCS_KEY) || '[]');
    const filtered = existing.filter(d => d.id !== docId && d.url !== fullDocData.url);
    const updated = [fullDocData, ...filtered];
    localStorage.setItem(EXPIRY_DOCS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Local storage document write warning:', e);
  }

  // 2. Save to Firebase Firestore documents collection
  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, String(docId));
    await setDoc(docRef, { ...fullDocData, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (e) {
    console.warn('Firebase document save fallback:', e);
  }
};

// --- FIREBASE CLOUD STORAGE UPLOAD (PDF & JPG FILES) ---

export const uploadFileToFirebaseStorage = async (file, pathFolder = 'customer_documents', customerPhone = '') => {
  if (!file) return null;

  const timestamp = Date.now();
  const sanitizeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : `doc_${timestamp}`;
  const filePath = `${pathFolder}/${customerPhone ? customerPhone + '_' : ''}${timestamp}_${sanitizeName}`;

  const createDataUrlRecord = () => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const localRecord = {
          id: `DOC-LOCAL-${timestamp}`,
          name: file.name || sanitizeName,
          type: file.type || 'application/pdf',
          size: file.size || 0,
          url: e.target.result,
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


