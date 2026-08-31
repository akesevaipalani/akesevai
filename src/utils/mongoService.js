export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    const envUrl = import.meta.env.VITE_API_URL;
    if (envUrl && !envUrl.includes('localhost') && envUrl.startsWith('http')) {
      return envUrl;
    }
    // In browser, relative /api works seamlessly with Vite proxy on any network/device IP
    return '/api';
  }
  return '/api';
};

export const API_BASE_URL = getApiBaseUrl();

export const getAuthHeaders = () => {
  const headers = {};
  if (typeof window !== 'undefined') {
    try {
      // 1. Admin Session Check
      const adminSession = sessionStorage.getItem('akesevai-admin-session') || localStorage.getItem('akesevai-admin-session');
      if (adminSession === 'true' || adminSession === 'admin-auth-token-2026' || adminSession === 'akesevai-admin-2026' || adminSession === 'admin123') {
        headers['x-admin-token'] = 'admin123';
      } else if (adminSession) {
        try {
          const parsed = JSON.parse(adminSession);
          if (parsed?.token || parsed?.password) {
            headers['x-admin-token'] = parsed.token || parsed.password;
          } else if (typeof parsed === 'string' && parsed.length > 0) {
            headers['x-admin-token'] = parsed;
          } else {
            headers['x-admin-token'] = 'admin123';
          }
        } catch (e) {
          headers['x-admin-token'] = String(adminSession);
        }
      }

      // 2. Customer Session Check (handles raw phone string or JSON object)
      const custSession = sessionStorage.getItem('akesevai-customer-session') || localStorage.getItem('akesevai-customer-session');
      if (custSession) {
        let phoneStr = '';
        try {
          const parsed = JSON.parse(custSession);
          phoneStr = typeof parsed === 'object' && parsed !== null ? (parsed.phone || '') : String(parsed);
        } catch (e) {
          phoneStr = String(custSession);
        }
        const digits = String(phoneStr || '').replace(/\D/g, '');
        if (digits.length >= 10) {
          headers['x-customer-phone'] = digits.slice(-10);
        }
      }
    } catch (e) {}
  }
  return headers;
};

const fetchJson = async (url, options = {}, timeoutMs = 6000) => {
  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const authHeaders = getAuthHeaders();
    const res = await fetch(url, {
      signal: controller?.signal,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {})
      },
      ...options
    });
    if (timeoutId) clearTimeout(timeoutId);
    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    if (!res.ok) {
      // Gracefully handle 401 Unauthorized / 403 Forbidden without throwing unhandled promise errors
      if (res.status === 401 || res.status === 403) {
        return null;
      }
      if (data && (data.message || data.error)) {
        const error = new Error(data.message || data.error);
        error.status = res.status;
        error.data = data;
        throw error;
      }
      return null;
    }
    return data;
  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId);
    return null;
  }
};

const cleanDigits = (p) => {
  const d = String(p || '').replace(/\D/g, '');
  return d.length >= 10 ? d.slice(-10) : d;
};

// --- CUSTOMERS ---

export const fetchSingleCustomerProfileMongo = async (phone) => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return null;
  return await fetchJson(`${API_BASE_URL}/customers/${cleanPhone}`);
};

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
  const auth = getAuthHeaders();
  if (!auth['x-admin-token'] && !auth['x-customer-phone']) {
    return [];
  }
  const query = auth['x-customer-phone'] ? `?customerPhone=${auth['x-customer-phone']}` : '';
  return (await fetchJson(`${API_BASE_URL}/documents${query}`)) || [];
};

export const deleteExpiryDocumentMongo = async (id) => {
  if (!id) return false;
  const res = await fetchJson(`${API_BASE_URL}/documents/${id}`, {
    method: 'DELETE'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'document', id } })); } catch (e) {}
  return Boolean(res?.success);
};

// --- TOKENS & PAYMENT VERIFICATION ---

export const requestTokenBookingMongo = async (tokenRequest) => {
  if (!tokenRequest) return null;
  const res = await fetchJson(`${API_BASE_URL}/tokens/request`, {
    method: 'POST',
    body: JSON.stringify(tokenRequest)
  });
  if (res && res.error && !res.token) {
    throw new Error(res.message || res.error);
  }
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'token', id: res?.token?.id || tokenRequest.id } })); } catch (e) {}
  return res?.token || res;
};

export const verifyTokenPaymentMongo = async (id) => {
  if (!id) return null;
  const res = await fetchJson(`${API_BASE_URL}/tokens/verify`, {
    method: 'POST',
    body: JSON.stringify({ id })
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'token', id } })); } catch (e) {}
  return res?.token || res;
};

export const rejectTokenPaymentMongo = async (id, reason = '') => {
  if (!id) return null;
  const res = await fetchJson(`${API_BASE_URL}/tokens/reject`, {
    method: 'POST',
    body: JSON.stringify({ id, reason })
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'token', id } })); } catch (e) {}
  return res?.token || res;
};

export const checkDuplicateUtrMongo = async (utr) => {
  if (!utr) return false;
  const res = await fetchJson(`${API_BASE_URL}/tokens/check-utr/${encodeURIComponent(utr)}`);
  return Boolean(res?.exists);
};

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

export const fetchTokensByPhoneMongo = async (phone, date = '') => {
  const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) return [];
  try {
    const url = `${API_BASE_URL}/tokens/by-phone/${encodeURIComponent(cleanPhone)}${date ? `?date=${encodeURIComponent(date)}` : ''}`;
    const res = await fetchJson(url);
    return Array.isArray(res) ? res : [];
  } catch (err) {
    return [];
  }
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

export const subscribeExpiryDocumentsMongo = (callback, intervalMs = 2500) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const auth = getAuthHeaders();
    if (!auth['x-admin-token'] && !auth['x-customer-phone']) {
      // Unauthenticated: do not make network requests to /api/documents
      if (callback && isMounted) callback([]);
      return;
    }
    const data = await fetchAllExpiryDocumentsMongo();
    if (isMounted && callback && Array.isArray(data)) {
      callback(data);
    }
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

// --- NOTIFICATIONS & BANKING EXAM RECRUITMENT ---

export const fetchNotificationsMongo = async (category = 'all', status = 'all') => {
  const params = new URLSearchParams();
  if (category && category !== 'all') params.append('category', category);
  if (status && status !== 'all') params.append('status', status);
  const queryStr = params.toString() ? `?${params.toString()}` : '';
  return (await fetchJson(`${API_BASE_URL}/notifications${queryStr}`)) || [];
};

export const syncBankingNotificationsMongo = async () => {
  const res = await fetchJson(`${API_BASE_URL}/notifications/sync-banking`, {
    method: 'POST'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'notification' } })); } catch (e) {}
  return res;
};

export const saveNotificationMongo = async (notifData) => {
  if (!notifData) return null;
  const res = await fetchJson(`${API_BASE_URL}/notifications`, {
    method: 'POST',
    body: JSON.stringify(notifData)
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'notification', id: notifData.id } })); } catch (e) {}
  return res;
};

export const deleteNotificationMongo = async (id) => {
  if (!id) return false;
  const res = await fetchJson(`${API_BASE_URL}/notifications/${id}`, {
    method: 'DELETE'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'notification', id } })); } catch (e) {}
  return Boolean(res?.success);
};

export const subscribeNotificationsMongo = (callback, intervalMs = 2500) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchNotificationsMongo('all', 'all');
    if (data && callback) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

// --- OTP AUTHENTICATION ---

export const sendOtpMongo = async (phone, purpose = 'register') => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return { success: false, error: 'INVALID_PHONE', message: '10-இலக்க மொபைல் எண் தேவை.' };
  
  try {
    const res = await fetch(`${API_BASE_URL}/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, purpose })
    });
    const data = await res.json();
    return { ...data, status: res.status };
  } catch (err) {
    return { success: false, error: 'NETWORK_ERROR', message: 'சர்வர் இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' };
  }
};

export const verifyOtpMongo = async (phone, otp, purpose = 'register') => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return { success: false, error: 'INVALID_PHONE', message: '10-இலக்க மொபைல் எண் தேவை.' };
  
  try {
    const res = await fetch(`${API_BASE_URL}/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, otp, purpose })
    });
    const data = await res.json();
    return { ...data, status: res.status };
  } catch (err) {
    return { success: false, error: 'NETWORK_ERROR', message: 'சர்வர் இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' };
  }
};

export const resendOtpMongo = async (phone, purpose = 'register') => {
  return await sendOtpMongo(phone, purpose);
};

// --- ADVERTISEMENTS API ---

export const fetchAllAdvertisementsMongo = async (includeAll = false) => {
  return (await fetchJson(`${API_BASE_URL}/advertisements${includeAll ? '?all=true' : ''}`)) || [];
};

export const saveAdvertisementMongo = async (adData) => {
  if (!adData) return null;
  const res = await fetchJson(`${API_BASE_URL}/advertisements`, {
    method: 'POST',
    body: JSON.stringify(adData)
  });
  try {
    window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'advertisement', id: adData.id } }));
  } catch (e) {}
  return res;
};

export const deleteAdvertisementMongo = async (id) => {
  if (!id) return false;
  const res = await fetchJson(`${API_BASE_URL}/advertisements/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  try {
    window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'advertisement', id } }));
  } catch (e) {}
  return Boolean(res?.success);
};

// --- 9. LIVE QUEUE & CENTER SETTINGS (MULTI-DEVICE CLOUD SYNC) ---

export const fetchLiveQueueMongo = async () => {
  try {
    const data = await fetchJson(`${API_BASE_URL}/settings/live-queue`);
    return data && typeof data === 'object' ? data : null;
  } catch (err) {
    return null;
  }
};

export const saveLiveQueueMongo = async (queueState) => {
  if (!queueState || typeof queueState !== 'object') return null;
  try {
    const res = await fetchJson(`${API_BASE_URL}/settings/live-queue`, {
      method: 'POST',
      body: JSON.stringify(queueState)
    });
    try {
      window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'live-queue', data: res?.settings || queueState } }));
    } catch (e) {}
    return res?.settings || res;
  } catch (err) {
    return null;
  }
};

export const subscribeLiveQueueMongo = (callback, intervalMs = 2000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchLiveQueueMongo();
    if (data && callback) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};
