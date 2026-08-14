const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const host = typeof window !== 'undefined' && window.location && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${host}:5000/api`;
};

const API_BASE_URL = getApiBaseUrl();

const fetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    return null;
  }
};

const cleanDigits = (p) => {
  const d = String(p || '').replace(/\D/g, '');
  return d.length >= 10 ? d.slice(-10) : d;
};

// --- CUSTOMERS ---

export const saveCustomerProfileMongo = async (phone, customerData) => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return null;

  const payload = {
    phone: cleanPhone,
    name: customerData?.profile?.name || customerData?.name || 'Customer',
    dob: customerData?.profile?.dob || customerData?.dob || '',
    aadhaarNo: customerData?.profile?.aadhaarNo || customerData?.aadhaarNo || '',
    profile: customerData?.profile || customerData || {},
    applications: customerData?.applications || [],
    documents: customerData?.documents || [],
    lastToken: customerData?.lastToken || null
  };

  const res = await fetchJson(`${API_BASE_URL}/customers`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'customer', phone: cleanPhone } })); } catch (e) {}
  return res;
};

export const fetchAllCustomerProfilesMongo = async () => {
  return (await fetchJson(`${API_BASE_URL}/customers`)) || {};
};

export const deleteCustomerProfileMongo = async (phone) => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return false;
  const res = await fetchJson(`${API_BASE_URL}/customers/${cleanPhone}`, {
    method: 'DELETE'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'customer', phone: cleanPhone } })); } catch (e) {}
  return Boolean(res?.success);
};

// --- APPLICATIONS ---

export const saveApplicationMongo = async (appRecord) => {
  if (!appRecord || !appRecord.id) return null;
  const res = await fetchJson(`${API_BASE_URL}/applications`, {
    method: 'POST',
    body: JSON.stringify(appRecord)
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'application', id: appRecord.id } })); } catch (e) {}
  return res;
};

export const fetchAllApplicationsMongo = async () => {
  return (await fetchJson(`${API_BASE_URL}/applications`)) || {};
};

export const deleteApplicationMongo = async (id) => {
  if (!id) return false;
  const res = await fetchJson(`${API_BASE_URL}/applications/${id}`, {
    method: 'DELETE'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'application', id } })); } catch (e) {}
  return Boolean(res?.success);
};

// --- EXPIRY DOCUMENTS ---

export const saveExpiryDocumentMongo = async (docData) => {
  if (!docData) return null;
  const res = await fetchJson(`${API_BASE_URL}/documents`, {
    method: 'POST',
    body: JSON.stringify(docData)
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'document', id: docData.id } })); } catch (e) {}
  return res;
};

export const fetchAllExpiryDocumentsMongo = async () => {
  return (await fetchJson(`${API_BASE_URL}/documents`)) || [];
};

export const deleteExpiryDocumentMongo = async (id) => {
  if (!id) return false;
  const res = await fetchJson(`${API_BASE_URL}/documents/${id}`, {
    method: 'DELETE'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'document', id } })); } catch (e) {}
  return Boolean(res?.success);
};

// --- TOKENS ---

export const saveTokenBookingMongo = async (tokenData) => {
  if (!tokenData) return null;
  const res = await fetchJson(`${API_BASE_URL}/tokens`, {
    method: 'POST',
    body: JSON.stringify(tokenData)
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'token', id: tokenData.id } })); } catch (e) {}
  return res;
};

export const fetchAllTokensMongo = async () => {
  return (await fetchJson(`${API_BASE_URL}/tokens`)) || [];
};

export const deleteTokenBookingMongo = async (id) => {
  if (!id) return false;
  const res = await fetchJson(`${API_BASE_URL}/tokens/${id}`, {
    method: 'DELETE'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'token', id } })); } catch (e) {}
  return Boolean(res?.success);
};

// --- DELETED CUSTOMERS ---

export const fetchDeletedCustomersMongo = async () => {
  return (await fetchJson(`${API_BASE_URL}/deleted-customers`)) || [];
};

export const saveDeletedCustomerMongo = async (phone) => {
  const cleanPhone = String(phone || '').replace(/\D/g, '');
  if (!cleanPhone) return false;
  return await fetchJson(`${API_BASE_URL}/deleted-customers`, {
    method: 'POST',
    body: JSON.stringify({ phone: cleanPhone })
  });
};

// --- FILE UPLOAD (DATA URL CONVERSION FOR MONGO) ---

export const uploadFileToMongoStorage = async (fileInput, pathFolder = 'customer_documents', customerPhone = '') => {
  return new Promise((resolve) => {
    if (!fileInput) return resolve({ url: '', storagePath: '' });
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result || '';
      resolve({
        url: dataUrl,
        storagePath: `mongo_storage/${customerPhone || 'guest'}_${Date.now()}`
      });
    };
    reader.onerror = () => resolve({ url: '', storagePath: '' });
    reader.readAsDataURL(fileInput);
  });
};

// --- REAL-TIME POLLING SUBSCRIPTIONS FOR MONGO ---

export const subscribeCustomerProfilesMongo = (callback, intervalMs = 1500) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchAllCustomerProfilesMongo();
    if (data && callback) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const subscribeApplicationsMongo = (callback, intervalMs = 1500) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchAllApplicationsMongo();
    if (data && callback) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const subscribeTokensMongo = (callback, intervalMs = 1500) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchAllTokensMongo();
    if (data && callback) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const subscribeExpiryDocumentsMongo = (callback, intervalMs = 1500) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchAllExpiryDocumentsMongo();
    if (data && callback) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const subscribeDeletedCustomersMongo = (callback, intervalMs = 1500) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const arrayList = await fetchDeletedCustomersMongo();
    if (arrayList && callback) {
      callback(new Set(arrayList));
    }
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};
