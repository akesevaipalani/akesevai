// Native IndexedDB Document Binary Store for AK e-Sevai Vault
// Enables persistent storage of document Data URLs across page refreshes and browser restarts

const DB_NAME = 'akesevai_vault_db';
const DB_VERSION = 1;
const STORE_NAME = 'documents_store';

let dbInstance = null;

const openDB = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return resolve(null);
    }
    if (dbInstance) {
      return resolve(dbInstance);
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('customerPhone', 'customerPhone', { unique: false });
          store.createIndex('requirement', 'requirement', { unique: false });
          store.createIndex('name', 'name', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        dbInstance = event.target.result;
        resolve(dbInstance);
      };

      request.onerror = (err) => {
        console.warn('[IndexedDB Notice] Unable to open document store:', err);
        resolve(null);
      };
    } catch (e) {
      console.warn('[IndexedDB Error]:', e);
      resolve(null);
    }
  });
};

export const saveDocBinary = async (docId, dataUrl, meta = {}) => {
  if (!docId) return false;
  const strId = String(docId);

  // 1. Fallback / fast cache in memory / storage
  if (typeof window !== 'undefined' && dataUrl && typeof dataUrl === 'string') {
    try {
      if (dataUrl.length < 500000) {
        sessionStorage.setItem(`akesevai_doc_raw_${strId}`, dataUrl);
      }
    } catch (e) {}
  }

  const db = await openDB();
  if (!db) {
    return false;
  }

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);

      const record = {
        id: strId,
        data: dataUrl || '',
        url: dataUrl || '',
        name: meta.name || '',
        requirement: meta.requirement || '',
        customerPhone: meta.customerPhone || '',
        applicationId: meta.applicationId || '',
        type: meta.type || 'image/jpeg',
        size: meta.size || 0,
        uploadedAt: meta.uploadedAt || new Date().toISOString()
      };

      store.put(record);

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
};

export const getDocBinary = async (docId) => {
  if (!docId) return null;
  const strId = String(docId);

  // 1. Check fast session cache
  if (typeof window !== 'undefined') {
    try {
      const mem = sessionStorage.getItem(`akesevai_doc_raw_${strId}`);
      if (mem && (mem.startsWith('data:') || mem.startsWith('http') || mem.startsWith('blob:'))) {
        return mem;
      }
    } catch (e) {}
  }

  // 2. Check IndexedDB
  const db = await openDB();
  if (db) {
    const record = await new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(strId);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => resolve(null);
      } catch (e) {
        resolve(null);
      }
    });

    if (record && (record.data || record.url)) {
      const resUrl = record.data || record.url;
      try {
        if (resUrl.length < 500000) {
          sessionStorage.setItem(`akesevai_doc_raw_${strId}`, resUrl);
        }
      } catch (e) {}
      return resUrl;
    }
  }

  return null;
};

export const deleteDocBinary = async (docId) => {
  if (!docId) return false;
  const strId = String(docId);

  if (typeof window !== 'undefined') {
    try {
      sessionStorage.removeItem(`akesevai_doc_raw_${strId}`);
    } catch (e) {}
  }

  const db = await openDB();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(strId);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch (e) {
      resolve(false);
    }
  });
};

export const getAllDocBinaries = async () => {
  const db = await openDB();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    } catch (e) {
      resolve([]);
    }
  });
};
