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
  where,
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
const LOGINS_COLLECTION = 'user_logins';
const SETTINGS_COLLECTION = 'portal_settings';
const REVIEWS_COLLECTION = 'customer_reviews';
const REFERRALS_COLLECTION = 'referrals';

const logFirebaseNotice = (tag, err) => {
  const msg = err?.message || String(err || '');
  console.info(`[AkEsevai Cloud Sync] ${tag}:`, msg);
};

// Purge all application local storage data to ensure 100% Firebase Cloud usage
export const clearAllApplicationLocalStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('akesevai') || key.startsWith('AKESEVAI'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    console.info('🧹 Purged local storage application records. Running 100% on Firebase Cloud.');
  } catch (e) {
    console.warn('Error clearing local storage:', e);
  }
};


// --- CUSTOMER PROFILES (FIREBASE CLOUD FIRESTORE) ---

export const saveCustomerProfileCloud = async (phone, profileData) => {
  const cleanPhone = String(phone).replace(/\D/g, '');
  if (!cleanPhone) return;

  const sanitizedDocs = (profileData.documents || []).map(doc => {
    return {
      ...doc,
      data: doc.data || doc.url || '',
      url: doc.url || doc.data || ''
    };
  });

  const dataToSave = {
    ...profileData,
    documents: sanitizedDocs,
    phone: cleanPhone,
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, cleanPhone);
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Customer cloud save', err);
  }
};

export const deleteCustomerProfileCloud = async (phone) => {
  if (!phone) return;
  const strPhone = String(phone);
  const cleanPhone = strPhone.replace(/\D/g, '');

  const targets = new Set([strPhone, cleanPhone, `+91${cleanPhone}`, `91${cleanPhone}`]);
  for (const targetId of targets) {
    if (targetId) {
      try {
        await deleteDoc(doc(db, CUSTOMERS_COLLECTION, targetId));
      } catch (e) {}
    }
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
      callback(records);
    }, (error) => {
      logFirebaseNotice('Customer listener', error);
      callback({});
    });
  } catch (e) {
    logFirebaseNotice('Customer subscription init', e);
    callback({});
    return () => {};
  }
};

// --- APPLICATIONS (FIREBASE CLOUD FIRESTORE) ---

export const saveApplicationCloud = async (appId, appData) => {
  if (!appId) return;

  const dataToSave = {
    ...appData,
    id: appId,
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, appId);
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Application cloud save', err);
  }
};

export const deleteApplicationCloud = async (appId) => {
  if (!appId) return;

  try {
    const docRef = doc(db, APPLICATIONS_COLLECTION, String(appId));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Application cloud delete', err);
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
      callback(apps);
    }, (error) => {
      logFirebaseNotice('Applications listener', error);
      callback({});
    });
  } catch (e) {
    logFirebaseNotice('Applications subscription init', e);
    callback({});
    return () => {};
  }
};

// --- TOKENS & QUEUE (FIREBASE CLOUD FIRESTORE) ---

export const saveTokenBookingCloud = async (tokenData) => {
  if (!tokenData || !tokenData.tokenNo) return;

  const dataToSave = {
    ...tokenData,
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, TOKENS_COLLECTION, String(tokenData.tokenNo));
    await setDoc(docRef, { ...dataToSave, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Token cloud save', err);
  }
};

export const deleteTokenBookingCloud = async (tokenNo) => {
  if (!tokenNo) return;

  try {
    const docRef = doc(db, TOKENS_COLLECTION, String(tokenNo));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Token cloud delete', err);
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
      callback(tokens);
    }, (error) => {
      logFirebaseNotice('Tokens listener', error);
      callback([]);
    });
  } catch (e) {
    logFirebaseNotice('Tokens subscription init', e);
    callback([]);
    return () => {};
  }
};

// --- EXPIRY DOCUMENTS (FIREBASE CLOUD STORAGE & FIRESTORE) ---

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

  try {
    const docRef = doc(db, DOCUMENTS_COLLECTION, String(docId));
    await setDoc(docRef, { ...fullDocData, lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (e) {
    logFirebaseNotice('Document cloud save', e);
  }
};

export const deleteExpiryDocumentCloud = async (docId, customerPhone = '') => {
  if (!docId) return;

  const strId = String(docId);
  try {
    // 1. Delete direct document ID from 'documents' collection
    try {
      await deleteDoc(doc(db, DOCUMENTS_COLLECTION, strId));
    } catch (e) {}

    // 2. Query 'documents' collection by id and delete matching docs
    try {
      const q1 = query(collection(db, DOCUMENTS_COLLECTION), where('id', '==', strId));
      const snap1 = await getDocs(q1);
      snap1.forEach(async (dSnap) => {
        try { await deleteDoc(dSnap.ref); } catch (e) {}
      });
    } catch (e) {}

    // 3. Clean up customer's documents array in 'customers' collection
    const cleanPhone = String(customerPhone).replace(/\D/g, '');
    if (cleanPhone) {
      try {
        const custRef = doc(db, CUSTOMERS_COLLECTION, cleanPhone);
        const custSnap = await getDoc(custRef);
        if (custSnap.exists()) {
          const custData = custSnap.data();
          const existingDocs = Array.isArray(custData.documents) ? custData.documents : [];
          const updatedDocs = existingDocs.filter(
            (d) => String(d.id) !== strId && String(d.url || d.data) !== strId && d.requirement !== docId
          );
          await setDoc(custRef, { ...custData, documents: updatedDocs, updatedAt: new Date().toISOString() }, { merge: true });
        }
      } catch (e) {}
    }
  } catch (err) {
    logFirebaseNotice('Document cloud delete', err);
  }
};

export const uploadFileToFirebaseStorage = async (fileInput, pathFolder = 'customer_documents', customerPhone = '') => {
  if (!fileInput) return null;

  const file = await compressImageForUpload(fileInput);
  const timestamp = Date.now();
  const sanitizeName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : `doc_${timestamp}`;
  const filePath = `${pathFolder}/${customerPhone ? customerPhone + '_' : ''}${timestamp}_${sanitizeName}`;

  try {
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
  } catch (err) {
    logFirebaseNotice('Firebase Storage upload', err);
    return null;
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
    logFirebaseNotice('Firebase Storage string upload', err);
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
      callback(docsList);
    }, (error) => {
      logFirebaseNotice('Firebase documents listener', error);
      callback([]);
    });
  } catch (e) {
    logFirebaseNotice('Documents subscription init', e);
    callback([]);
    return () => {};
  }
};

// --- SPONSORED ADS (FIREBASE CLOUD FIRESTORE) ---

export const saveSponsoredAdCloud = async (adData) => {
  if (!adData) return;
  const adId = adData.id || `AD-${Date.now()}`;
  try {
    const docRef = doc(db, ADS_COLLECTION, String(adId));
    await setDoc(docRef, { ...adData, id: adId, updatedAt: new Date().toISOString(), lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Sponsored ad save', err);
  }
};

export const deleteSponsoredAdCloud = async (adId) => {
  if (!adId) return;
  try {
    const docRef = doc(db, ADS_COLLECTION, String(adId));
    await deleteDoc(docRef);
  } catch (err) {
    logFirebaseNotice('Sponsored ad cloud delete', err);
  }
};

export const subscribeSponsoredAds = (callback) => {
  try {
    const q = collection(db, ADS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const ads = [];
      snapshot.forEach((docSnap) => ads.push(docSnap.data()));
      callback(ads);
    }, (error) => {
      logFirebaseNotice('Sponsored ads listener', error);
      callback([]);
    });
  } catch (e) {
    logFirebaseNotice('Sponsored ads subscription init', e);
    callback([]);
    return () => {};
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

// --- LIVE QUEUE STATUS (FIREBASE CLOUD FIRESTORE) ---

export const saveLiveQueueCloud = async (queueState) => {
  if (!queueState) return;
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'live_queue');
    await setDoc(docRef, { ...queueState, updatedAt: new Date().toISOString(), lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (e) {
    logFirebaseNotice('Live queue cloud save', e);
  }
};

export const subscribeLiveQueue = (callback) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'live_queue');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback(docSnap.data());
      } else {
        callback({});
      }
    }, (err) => {
      logFirebaseNotice('Live queue listener', err);
      callback({});
    });
  } catch (e) {
    logFirebaseNotice('Live queue subscription init', e);
    callback({});
    return () => {};
  }
};

// --- SERVICE OF THE DAY (FIREBASE CLOUD FIRESTORE) ---

export const saveServiceOfDayCloud = async (sodData) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'service_of_day');
    await setDoc(docRef, { data: sodData || null, updatedAt: new Date().toISOString(), lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (e) {
    logFirebaseNotice('Service of day cloud save', e);
  }
};

export const subscribeServiceOfDay = (callback) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'service_of_day');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().data !== undefined) {
        callback(docSnap.data().data);
      } else {
        callback(null);
      }
    }, (err) => {
      logFirebaseNotice('Service of day listener', err);
      callback(null);
    });
  } catch (e) {
    logFirebaseNotice('Service of day subscription init', e);
    callback(null);
    return () => {};
  }
};

// --- LOGIN AUDIT RECORDS (FIREBASE CLOUD FIRESTORE) ---

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
    logFirebaseNotice('Login event cloud log', e);
  }
};

// --- CUSTOMER REVIEWS (FIREBASE CLOUD FIRESTORE) ---

export const saveCustomerReviewCloud = async (reviewData) => {
  if (!reviewData) return;
  const revId = reviewData.id || `REV-${Date.now()}`;
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, String(revId));
    await setDoc(docRef, { ...reviewData, id: revId, createdAt: new Date().toISOString(), lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Customer review cloud save', err);
  }
};

export const subscribeCustomerReviews = (callback) => {
  try {
    const q = collection(db, REVIEWS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((docSnap) => list.push(docSnap.data()));
      callback(list);
    }, (error) => {
      logFirebaseNotice('Customer reviews listener', error);
      callback([]);
    });
  } catch (e) {
    logFirebaseNotice('Customer reviews subscription init', e);
    callback([]);
    return () => {};
  }
};

// --- REFERRALS (FIREBASE CLOUD FIRESTORE) ---

export const saveReferralCloud = async (code, referralData) => {
  if (!code) return;
  try {
    const docRef = doc(db, REFERRALS_COLLECTION, String(code));
    await setDoc(docRef, { ...referralData, code: String(code), lastCloudSync: serverTimestamp() }, { merge: true });
  } catch (err) {
    logFirebaseNotice('Referral cloud save', err);
  }
};

export const subscribeReferrals = (callback) => {
  try {
    const q = collection(db, REFERRALS_COLLECTION);
    return onSnapshot(q, (snapshot) => {
      const refs = {};
      snapshot.forEach((docSnap) => {
        refs[docSnap.id] = docSnap.data();
      });
      callback(refs);
    }, (error) => {
      logFirebaseNotice('Referrals listener', error);
      callback({});
    });
  } catch (e) {
    logFirebaseNotice('Referrals subscription init', e);
    callback({});
    return () => {};
  }
};

// --- DIRECT CLOUD FETCH (FIREBASE FIRESTORE DATA COLLECTIONS) ---

export const syncAllLocalDataToFirebaseCloud = async () => {
  return;
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

    const appsRef = collection(db, APPLICATIONS_COLLECTION);
    const appsSnap = await getDocs(appsRef);
    const applications = {};
    appsSnap.forEach((d) => {
      applications[d.id] = d.data();
    });

    return { customers, tokens, documents, applications };
  } catch (err) {
    logFirebaseNotice('Direct cloud fetch', err);
    return null;
  }
};

export const purgeAllFirebaseCloudData = async () => {
  if (!isFirebaseConfigured()) return false;
  const collectionsToClear = [
    CUSTOMERS_COLLECTION,
    APPLICATIONS_COLLECTION,
    TOKENS_COLLECTION,
    DOCUMENTS_COLLECTION,
    ADS_COLLECTION,
    LOGINS_COLLECTION,
    SETTINGS_COLLECTION,
    'notifications'
  ];
  try {
    for (const colName of collectionsToClear) {
      const snap = await getDocs(collection(db, colName));
      for (const docSnap of snap.docs) {
        await deleteDoc(docSnap.ref);
      }
    }
    clearAllApplicationLocalStorage();
    return true;
  } catch (err) {
    logFirebaseNotice('Purge all cloud data', err);
    return false;
  }
};

