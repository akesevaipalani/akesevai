const PRODUCTION_HOSTNAMES = new Set(['www.akesevai.com', 'akesevai.com']);
const LOCAL_DEV_HOSTNAMES = new Set(['localhost', '127.0.0.1', '[::1]']);
const FORBIDDEN_PREVIEW_BACKEND_HOST = 'akesevai.onrender.com';
export const BLOCKED_PREVIEW_API_ORIGIN = 'https://preview-api-blocked.invalid';

const hasForbiddenProductionHost = (candidateUrl) => {
  const normalized = String(candidateUrl || '').trim().toLowerCase();
  if (!normalized) return false;
  if (normalized.includes(FORBIDDEN_PREVIEW_BACKEND_HOST)) return true;
  try {
    const parsed = new URL(normalized);
    const host = parsed.hostname.toLowerCase();
    return host === FORBIDDEN_PREVIEW_BACKEND_HOST || host.endsWith(`.${FORBIDDEN_PREVIEW_BACKEND_HOST}`);
  } catch {
    return false;
  }
};

export const resolveApiBaseConfig = (overrides = {}) => {
  const hasImportMetaEnv = typeof import.meta !== 'undefined' && Boolean(import.meta.env);
  const rawEnvUrl = overrides.envUrl !== undefined
    ? overrides.envUrl
    : (hasImportMetaEnv ? import.meta.env.VITE_API_URL : '');
  const envUrl = String(rawEnvUrl || '').trim().replace(/\/+$/, '');

  const runtimeWindow = typeof window !== 'undefined' ? window : undefined;
  const hasBrowser = overrides.hasBrowser !== undefined
    ? Boolean(overrides.hasBrowser)
    : (Boolean(runtimeWindow) && typeof document !== 'undefined' && Boolean(runtimeWindow.location));

  const hostname = String(
    overrides.hostname !== undefined
      ? (overrides.hostname ?? '')
      : (runtimeWindow?.location?.hostname ?? '')
  ).trim().toLowerCase();

  const port = String(
    overrides.port !== undefined
      ? (overrides.port ?? '')
      : (runtimeWindow?.location?.port ?? '')
  ).trim();

  const vercelEnv = String(
    overrides.vercelEnv !== undefined
      ? (overrides.vercelEnv ?? '')
      : (hasImportMetaEnv ? (import.meta.env.VITE_VERCEL_ENV ?? '') : '')
  ).trim().toLowerCase();

  const isLocalHost = Boolean(hostname) && LOCAL_DEV_HOSTNAMES.has(hostname);
  const isProdHost = Boolean(hostname) && PRODUCTION_HOSTNAMES.has(hostname);
  const isPreviewContext = vercelEnv === 'preview' || (hasBrowser && Boolean(hostname) && !isProdHost && !isLocalHost);

  if (isPreviewContext) {
    if (!envUrl) {
      return {
        ok: false,
        isPreview: true,
        baseUrl: BLOCKED_PREVIEW_API_ORIGIN,
        code: 'PREVIEW_MISSING_API_URL',
        error: 'Preview isolation blocked API request: VITE_API_URL must be configured for Preview deployments.'
      };
    }
    if (envUrl.startsWith('/')) {
      return {
        ok: false,
        isPreview: true,
        baseUrl: BLOCKED_PREVIEW_API_ORIGIN,
        code: 'PREVIEW_RELATIVE_API_FORBIDDEN',
        error: 'Preview isolation blocked API request: relative /api fallback is forbidden in Preview.'
      };
    }
    let parsed;
    try {
      parsed = new URL(envUrl);
    } catch {
      return {
        ok: false,
        isPreview: true,
        baseUrl: BLOCKED_PREVIEW_API_ORIGIN,
        code: 'PREVIEW_INVALID_API_URL',
        error: 'Preview isolation blocked API request: VITE_API_URL is not a valid absolute URL.'
      };
    }
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return {
        ok: false,
        isPreview: true,
        baseUrl: BLOCKED_PREVIEW_API_ORIGIN,
        code: 'PREVIEW_INVALID_API_URL',
        error: 'Preview isolation blocked API request: VITE_API_URL must use http(s).'
      };
    }
    const targetHost = parsed.hostname.toLowerCase();
    if (hasForbiddenProductionHost(envUrl)) {
      return {
        ok: false,
        isPreview: true,
        baseUrl: BLOCKED_PREVIEW_API_ORIGIN,
        code: 'PREVIEW_PRODUCTION_API_FORBIDDEN',
        error: 'Preview isolation blocked API request: Production Render backend (akesevai.onrender.com) is forbidden in Preview.'
      };
    }
    if (LOCAL_DEV_HOSTNAMES.has(targetHost)) {
      return {
        ok: false,
        isPreview: true,
        baseUrl: BLOCKED_PREVIEW_API_ORIGIN,
        code: 'PREVIEW_LOCALHOST_API_FORBIDDEN',
        error: 'Preview isolation blocked API request: localhost backend URLs are forbidden in Preview.'
      };
    }
    return {
      ok: true,
      isPreview: true,
      baseUrl: envUrl,
      code: 'OK',
      error: null
    };
  }

  if (envUrl && !envUrl.includes('localhost') && /^https?:\/\//i.test(envUrl)) {
    return { ok: true, isPreview: false, baseUrl: envUrl, code: 'OK', error: null };
  }
  // In real browser runtime (Production custom domains or local Vite dev), use relative /api
  if (hasBrowser && port !== '5001') {
    return { ok: true, isPreview: false, baseUrl: '/api', code: 'OK', error: null };
  }
  return { ok: true, isPreview: false, baseUrl: 'http://localhost:5001/api', code: 'OK', error: null };
};

export const isBlockedApiTarget = (url, overrides = {}) => {
  const target = String(url || '').trim();
  const cfg = resolveApiBaseConfig(overrides);
  if (!cfg.ok) {
    return { blocked: true, code: cfg.code, error: cfg.error };
  }
  if (!target || target.startsWith(BLOCKED_PREVIEW_API_ORIGIN)) {
    return {
      blocked: true,
      code: 'PREVIEW_API_ISOLATION_BLOCKED',
      error: 'Preview isolation blocked API request target.'
    };
  }
  if (cfg.isPreview) {
    if (target.startsWith('/')) {
      return {
        blocked: true,
        code: 'PREVIEW_RELATIVE_API_FORBIDDEN',
        error: 'Preview isolation blocked API request: relative /api request is forbidden in Preview.'
      };
    }
    if (hasForbiddenProductionHost(target)) {
      return {
        blocked: true,
        code: 'PREVIEW_PRODUCTION_API_FORBIDDEN',
        error: 'Preview isolation blocked API request: Production Render backend (akesevai.onrender.com) is forbidden in Preview.'
      };
    }
  }
  return { blocked: false, code: 'OK', error: null };
};

export const getApiBaseUrl = (overrides) => {
  const cfg = resolveApiBaseConfig(overrides);
  if (!cfg.ok) {
    throw new Error(cfg.error);
  }
  return cfg.baseUrl;
};

const _initialApiConfig = resolveApiBaseConfig();
export const API_BASE_URL = _initialApiConfig.ok ? _initialApiConfig.baseUrl : BLOCKED_PREVIEW_API_ORIGIN;

export const getAuthHeaders = () => {
  const headers = {};
  if (typeof window !== 'undefined') {
    try {
      // 1. Admin Session Token (Dynamic Secure Opaque Token)
      const adminToken = sessionStorage.getItem('akesevai-admin-token');
      if (adminToken && typeof adminToken === 'string' && adminToken.trim().length > 0) {
        headers['x-admin-token'] = adminToken.trim();
      }

      // 2. Customer Cryptographic Token (HMAC Signed)
      const ssToken = sessionStorage.getItem('akesevai-customer-token');
      const lsToken = localStorage.getItem('akesevai-customer-token');
      const custToken = (ssToken && ssToken.trim()) || (lsToken && lsToken.trim()) || '';
      if (custToken) {
        headers['x-customer-token'] = custToken;
      }

      // 3. Customer Session Phone (only used alongside token; prefer phone matching token if present)
      const custSession = sessionStorage.getItem('akesevai-customer-session') || localStorage.getItem('akesevai-customer-session');
      let phoneDigits = '';
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
          phoneDigits = digits.slice(-10);
        }
      }
      if (!phoneDigits && custToken.startsWith('ctok_')) {
        const tokenPhone = custToken.split('_')[1] || '';
        if (/^\d{10}$/.test(tokenPhone)) phoneDigits = tokenPhone;
      }
      if (phoneDigits) {
        headers['x-customer-phone'] = phoneDigits;
      }
    } catch (e) {}
  }
  return headers;
};

export const hasCustomerAuthToken = () => {
  const auth = getAuthHeaders();
  return Boolean(auth['x-customer-token'] && auth['x-customer-token'].startsWith('ctok_'));
};

export const hasAnyApiAuth = () => {
  const auth = getAuthHeaders();
  return Boolean(auth['x-admin-token'] || (auth['x-customer-token'] && auth['x-customer-token'].startsWith('ctok_')));
};

let lastAuthExpiredEventAt = 0;
function notifyAuthExpired(status, code, url) {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  if (now - lastAuthExpiredEventAt < 3000) return;
  lastAuthExpiredEventAt = now;
  try {
    const auth = getAuthHeaders();
    const isAdminUrl = String(url || '').includes('/admin');
    const role = isAdminUrl ? 'admin' : (auth['x-customer-phone'] || auth['x-customer-token'] ? 'customer' : (auth['x-admin-token'] ? 'admin' : 'anonymous'));
    window.dispatchEvent(new CustomEvent('akesevai-auth-expired', { detail: { role, status, code, url } }));
  } catch (e) {}
}

function classifyHttpFailure(status, data) {
  const serverCode = data?.error || '';
  const serverMsg = data?.message || data?.error || '';
  if (status === 401) {
    return {
      code: serverCode || 'SESSION_EXPIRED',
      message: serverMsg || 'Session expired or unauthorized. Please sign in again.',
      retryable: false
    };
  }
  if (status === 403) {
    return {
      code: serverCode || 'FORBIDDEN',
      message: serverMsg || 'Access denied: you do not have permission for this document.',
      retryable: false
    };
  }
  if (status === 404) {
    return {
      code: serverCode || 'DOCUMENT_NOT_FOUND',
      message: serverMsg || 'Document not found.',
      retryable: false
    };
  }
  if (status === 413) {
    return {
      code: 'PAYLOAD_TOO_LARGE',
      message: serverMsg || 'File is too large for upload. Please compress below 1 MB and try again.',
      retryable: false
    };
  }
  if (status === 429) {
    return {
      code: 'RATE_LIMITED',
      message: serverMsg || 'Too many requests. Please wait a moment and try again.',
      retryable: false
    };
  }
  if (status >= 500) {
    return {
      code: serverCode || 'SERVER_UNAVAILABLE',
      message: serverMsg || 'Server is temporarily unavailable. Please retry in a few seconds.',
      retryable: true
    };
  }
  return {
    code: serverCode || `HTTP_${status}`,
    message: serverMsg || `Request failed with status ${status}.`,
    retryable: false
  };
}

export const fetchApiResult = async (url, options = {}, config = {}) => {
  const blockedCheck = isBlockedApiTarget(url);
  if (blockedCheck.blocked) {
    return {
      ok: false,
      status: 0,
      code: blockedCheck.code,
      message: blockedCheck.error,
      data: null,
      needsAdminReview: false,
      timedOut: false,
      networkError: true,
      retryable: false
    };
  }

  const {
    timeoutMs = 20000,
    retries = 0,
    retryDelayMs = 1200
  } = config || {};

  let attempt = 0;
  const maxAttempts = Math.max(1, Number(retries || 0) + 1);

  while (attempt < maxAttempts) {
    attempt += 1;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

    try {
      const authHeaders = getAuthHeaders();
      const res = await fetch(url, {
        ...options,
        signal: controller?.signal,
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...(options.headers || {})
        }
      });
      if (timeoutId) clearTimeout(timeoutId);

      let data = null;
      try {
        data = await res.json();
      } catch (e) {
        data = null;
      }

      if (!res.ok) {
        const classified = classifyHttpFailure(res.status, data);
        if (res.status === 401) {
          notifyAuthExpired(res.status, classified.code, url);
        }
        if (classified.retryable && attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, retryDelayMs));
          continue;
        }
        return {
          ok: false,
          status: res.status,
          code: classified.code,
          message: classified.message,
          data,
          needsAdminReview: Boolean(data?.needsAdminReview),
          timedOut: false,
          networkError: false,
          retryable: classified.retryable
        };
      }

      return {
        ok: true,
        status: res.status,
        code: 'OK',
        message: '',
        data,
        needsAdminReview: false,
        timedOut: false,
        networkError: false,
        retryable: false
      };
    } catch (err) {
      if (timeoutId) clearTimeout(timeoutId);
      const isTimeout = err?.name === 'AbortError' || /abort|timeout/i.test(String(err?.message || ''));
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, retryDelayMs));
        continue;
      }
      return {
        ok: false,
        status: 0,
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: isTimeout
          ? 'Server request timed out (server may be waking up). Please retry.'
          : 'Network error connecting to server. Please check connection and retry.',
        data: null,
        needsAdminReview: false,
        timedOut: isTimeout,
        networkError: !isTimeout,
        retryable: true
      };
    }
  }

  return {
    ok: false,
    status: 0,
    code: 'NETWORK_ERROR',
    message: 'Request failed after retries.',
    data: null,
    needsAdminReview: false,
    timedOut: false,
    networkError: true,
    retryable: true
  };
};

const fetchJson = async (url, options = {}, timeoutMs = 20000) => {
  const result = await fetchApiResult(url, options, { timeoutMs, retries: 0 });
  if (!result.ok) {
    if (result.status === 401 || result.status === 403 || result.status === 0) {
      return null;
    }
    if (result.data && (result.data.message || result.data.error)) {
      const error = new Error(result.data.message || result.data.error);
      error.status = result.status;
      error.code = result.code;
      error.data = result.data;
      throw error;
    }
    return null;
  }
  return result.data;
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

function sanitizeDocMetaForCustomer(docItem) {
  if (!docItem || typeof docItem !== 'object') return null;
  const rawUrl = typeof docItem.url === 'string' && /^https:\/\//i.test(docItem.url.trim()) ? docItem.url.trim() : '';
  const meta = {
    id: docItem.id || '',
    applicationId: docItem.applicationId || '',
    name: docItem.name || 'Document',
    requirement: docItem.requirement || '',
    type: docItem.type || '',
    url: rawUrl,
    uploadedAt: docItem.uploadedAt || ''
  };
  if (docItem.legacyId) meta.legacyId = docItem.legacyId;
  return meta;
}

export const saveCustomerProfileMongo = async (phone, customerData) => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return null;

  const payload = {
    phone: cleanPhone,
    name: customerData?.profile?.name || customerData?.name || 'Customer',
    dob: customerData?.profile?.dob ?? customerData?.dob,
    aadhaarNo: customerData?.profile?.aadhaarNo ?? customerData?.aadhaarNo,
    profile: customerData?.profile || customerData || {},
    applications: Array.isArray(customerData?.applications) ? customerData.applications : undefined,
    documents: Array.isArray(customerData?.documents)
      ? customerData.documents.map(sanitizeDocMetaForCustomer).filter(Boolean)
      : undefined,
    lastToken: customerData?.lastToken || undefined,
    allowClearDocuments: customerData?.allowClearDocuments === true,
    explicitDocumentsReplace: customerData?.explicitDocumentsReplace === true,
    deletedDocIds: Array.isArray(customerData?.deletedDocIds) ? customerData.deletedDocIds : undefined
  };

  const result = await fetchApiResult(`${API_BASE_URL}/customers`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }, { timeoutMs: 25000, retries: 1 });

  if (!result.ok) {
    const error = new Error(result.message || 'Failed to save customer profile.');
    error.status = result.status;
    error.code = result.code;
    error.retryable = result.retryable;
    throw error;
  }

  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'customer', phone: cleanPhone } })); } catch (e) {}
  return result.data;
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

// --- PUBLIC STATUS TRACKING APIS ---

export const fetchPublicAppStatusMongo = async (appId) => {
  const cleanId = String(appId || '').trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (!cleanId) return null;
  return await fetchJson(`${API_BASE_URL}/public/track/application/${encodeURIComponent(cleanId)}`);
};

export const fetchTrackByMobileMongo = async (phone, trackingToken = '') => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return null;
  const headers = {};
  if (trackingToken) {
    headers['x-tracking-token'] = trackingToken;
  }
  return await fetchJson(`${API_BASE_URL}/public/track/mobile/${cleanPhone}`, { headers });
};

// --- EXPIRY DOCUMENTS ---

export const saveExpiryDocumentMongo = async (docData, options = {}) => {
  if (!docData) {
    const err = new Error('Document data is required.');
    err.status = 400;
    err.code = 'MISSING_PAYLOAD';
    throw err;
  }

  const clientRequestId = docData.clientRequestId || `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const uploadPayload = {
    ...docData,
    clientRequestId
  };

  const result = await fetchApiResult(`${API_BASE_URL}/documents`, {
    method: 'POST',
    body: JSON.stringify(uploadPayload)
  }, {
    timeoutMs: options.timeoutMs ?? 45000,
    retries: options.retries ?? 1,
    retryDelayMs: options.retryDelayMs ?? 1500
  });

  if (!result.ok || !result.data || !result.data.id) {
    const error = new Error(result.message || 'Document upload failed.');
    error.status = result.status;
    error.code = result.code;
    error.retryable = result.retryable;
    error.data = result.data;
    throw error;
  }

  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'document', id: result.data.id } })); } catch (e) {}
  return result.data;
};

export const fetchAllExpiryDocumentsMongo = async () => {
  if (!hasAnyApiAuth()) {
    return [];
  }
  const auth = getAuthHeaders();
  const query = !auth['x-admin-token'] && auth['x-customer-phone'] ? `?customerPhone=${auth['x-customer-phone']}` : '';
  return (await fetchJson(`${API_BASE_URL}/documents${query}`)) || [];
};

export const fetchSingleExpiryDocumentDetailedMongo = async (id, options = {}) => {
  const cleanId = String(id || '').trim();
  if (!cleanId) {
    return {
      ok: false,
      status: 400,
      code: 'MISSING_DOCUMENT_ID',
      message: 'Document ID is missing.',
      document: null,
      retryable: false,
      needsAdminReview: false
    };
  }

  if (!hasAnyApiAuth()) {
    notifyAuthExpired(401, 'SESSION_EXPIRED', `${API_BASE_URL}/documents/${cleanId}`);
    return {
      ok: false,
      status: 401,
      code: 'SESSION_EXPIRED',
      message: 'Session expired. Please login again to view documents.',
      document: null,
      retryable: false,
      needsAdminReview: false
    };
  }

  const auth = getAuthHeaders();
  const query = (options.customerPhone && auth['x-admin-token'])
    ? `?customerPhone=${encodeURIComponent(cleanDigits(options.customerPhone))}`
    : '';

  const res = await fetchApiResult(`${API_BASE_URL}/documents/${encodeURIComponent(cleanId)}${query}`, {}, {
    timeoutMs: options.timeoutMs ?? 45000,
    retries: options.retries ?? 1,
    retryDelayMs: options.retryDelayMs ?? 1500
  });

  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      code: res.code,
      message: res.message,
      document: null,
      retryable: res.retryable,
      needsAdminReview: Boolean(res.needsAdminReview)
    };
  }

  return {
    ok: true,
    status: res.status,
    code: 'OK',
    message: '',
    document: res.data,
    retryable: false,
    needsAdminReview: false
  };
};

export const fetchSingleExpiryDocumentMongo = async (id, options = {}) => {
  const res = await fetchSingleExpiryDocumentDetailedMongo(id, options);
  if (!res.ok) {
    if (options.throwOnError) {
      const error = new Error(res.message || 'Failed to fetch document.');
      error.status = res.status;
      error.code = res.code;
      error.retryable = res.retryable;
      error.needsAdminReview = res.needsAdminReview;
      throw error;
    }
    return null;
  }
  return res.document;
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

export const subscribeCustomerProfilesMongo = (callback, intervalMs = 30000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    if (!hasAnyApiAuth()) {
      if (callback && isMounted) callback({});
      return;
    }
    const data = await fetchAllCustomerProfilesMongo();
    if (data && callback && isMounted) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const subscribeApplicationsMongo = (callback, intervalMs = 30000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    if (!hasAnyApiAuth()) {
      if (callback && isMounted) callback({});
      return;
    }
    const data = await fetchAllApplicationsMongo();
    if (data && callback && isMounted) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const subscribeTokensMongo = (callback, intervalMs = 20000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    if (!hasAnyApiAuth()) {
      if (callback && isMounted) callback([]);
      return;
    }
    const data = await fetchAllTokensMongo();
    if (data && callback && isMounted) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const subscribeExpiryDocumentsMongo = (callback, intervalMs = 30000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    if (!hasAnyApiAuth()) {
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

export const subscribeDeletedCustomersMongo = (callback, intervalMs = 30000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const auth = getAuthHeaders();
    if (!auth['x-admin-token']) {
      if (callback && isMounted) callback(new Set());
      return;
    }
    const arrayList = await fetchDeletedCustomersMongo();
    if (arrayList && callback && isMounted) {
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

export const subscribeNotificationsMongo = (callback, intervalMs = 300000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchNotificationsMongo('all', 'all');
    if (data && callback && isMounted) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

export const fetchPendingNotificationsMongo = async () => {
  const res = await fetchJson(`${API_BASE_URL}/notifications/pending`);
  return res?.notifications || [];
};

export const fetchQuarantinedNotificationsMongo = async () => {
  const res = await fetchJson(`${API_BASE_URL}/notifications/quarantined`);
  return res?.notifications || [];
};

export const fetchNotificationRevisionsMongo = async (id) => {
  if (!id) return null;
  return await fetchJson(`${API_BASE_URL}/notifications/${encodeURIComponent(id)}/revisions`);
};

export const approveNotificationMongo = async (id) => {
  if (!id) return null;
  const res = await fetchJson(`${API_BASE_URL}/notifications/${id}/approve`, {
    method: 'POST'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'notification', id, action: 'approve' } })); } catch (e) {}
  return res;
};

export const rejectNotificationMongo = async (id) => {
  if (!id) return null;
  const res = await fetchJson(`${API_BASE_URL}/notifications/${id}/reject`, {
    method: 'POST'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'notification', id, action: 'reject' } })); } catch (e) {}
  return res;
};

export const triggerIngestionJobMongo = async (sourceKey = '') => {
  const query = sourceKey ? `?sourceKey=${encodeURIComponent(sourceKey)}` : '';
  const res = await fetchJson(`${API_BASE_URL}/notifications/ingest-job${query}`, {
    method: 'POST'
  });
  try { window.dispatchEvent(new CustomEvent('akesevai-data-changed', { detail: { type: 'notification', action: 'ingest' } })); } catch (e) {}
  return res;
};

export const fetchIngestionStatusMongo = async () => {
  return await fetchJson(`${API_BASE_URL}/notifications/ingestion-status`);
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
    if (data && data.customerToken) {
      try {
        sessionStorage.setItem('akesevai-customer-token', data.customerToken);
        localStorage.setItem('akesevai-customer-token', data.customerToken);
      } catch (e) {}
    }
    return { ...data, status: res.status };
  } catch (err) {
    return { success: false, error: 'NETWORK_ERROR', message: 'சர்வர் இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' };
  }
};

export const loginCustomerPasswordMongo = async (phone, password) => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone || !password) {
    return { success: false, error: 'INVALID_INPUT', message: 'மொபைல் எண் மற்றும் கடவுச்சொல் தேவை.' };
  }
  try {
    const res = await fetch(`${API_BASE_URL}/customer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleanPhone, password })
    });
    const data = await res.json();
    if (data && data.customerToken) {
      try {
        sessionStorage.setItem('akesevai-customer-token', data.customerToken);
        localStorage.setItem('akesevai-customer-token', data.customerToken);
      } catch (e) {}
    }
    return { ...data, status: res.status };
  } catch (err) {
    return { success: false, error: 'NETWORK_ERROR', message: 'சர்வர் இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' };
  }
};

export const registerCustomerMongo = async (phone, verifiedToken, details = {}) => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone) return { success: false, error: 'INVALID_PHONE', message: '10-இலக்க மொபைல் எண் தேவை.' };
  try {
    const authHeaders = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/customer/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        phone: cleanPhone,
        verifiedToken,
        name: details.name || 'Customer',
        dob: details.dob || '',
        aadhaarNo: details.aadhaarNo || '',
        password: details.password || ''
      })
    });
    const data = await res.json();
    if (data && data.customerToken) {
      try {
        sessionStorage.setItem('akesevai-customer-token', data.customerToken);
        localStorage.setItem('akesevai-customer-token', data.customerToken);
      } catch (e) {}
    }
    return { ...data, status: res.status };
  } catch (err) {
    return { success: false, error: 'NETWORK_ERROR', message: 'சர்வர் இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' };
  }
};

export const setCustomerPasswordMongo = async (phone, verifiedToken, newPassword) => {
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone || !newPassword) {
    return { success: false, error: 'INVALID_INPUT', message: 'மொபைல் எண் மற்றும் புதிய கடவுச்சொல் தேவை.' };
  }
  try {
    const authHeaders = getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/customer/set-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({
        phone: cleanPhone,
        verifiedToken,
        newPassword
      })
    });
    const data = await res.json();
    if (data && data.customerToken) {
      try {
        sessionStorage.setItem('akesevai-customer-token', data.customerToken);
        localStorage.setItem('akesevai-customer-token', data.customerToken);
      } catch (e) {}
    }
    return { ...data, status: res.status };
  } catch (err) {
    return { success: false, error: 'NETWORK_ERROR', message: 'சர்வர் இணைப்பு பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.' };
  }
};

export const logoutCustomerMongo = async () => {
  try {
    const authHeaders = getAuthHeaders();
    await fetch(`${API_BASE_URL}/customer/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      }
    });
  } catch (err) {}
  try {
    sessionStorage.removeItem('akesevai-customer-token');
    localStorage.removeItem('akesevai-customer-token');
    sessionStorage.removeItem('akesevai-customer-session');
    localStorage.removeItem('akesevai-customer-session');
  } catch (e) {}
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

export const subscribeLiveQueueMongo = (callback, intervalMs = 30000) => {
  let isMounted = true;
  const poll = async () => {
    if (!isMounted) return;
    const data = await fetchLiveQueueMongo();
    if (data && callback && isMounted) callback(data);
  };
  poll();
  const timer = setInterval(poll, intervalMs);
  return () => {
    isMounted = false;
    clearInterval(timer);
  };
};

// --- ADMIN AUTHENTICATION API SERVICES ---

export const authenticateAdminApi = async (password) => {
  const url = `${getApiBaseUrl()}/admin/login`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json().catch(() => ({ success: false, message: 'Server response parsing error' }));
    return { ok: res.ok && Boolean(data.success), data, status: res.status };
  } catch (err) {
    return { ok: false, data: { success: false, message: err.message || 'Network error' }, status: 500 };
  }
};

export const changeAdminPasswordApi = async (currentPassword, newPassword) => {
  const url = `${getApiBaseUrl()}/admin/change-password`;
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json().catch(() => ({ success: false, message: 'Server response parsing error' }));
    return { ok: res.ok && Boolean(data.success), data, status: res.status };
  } catch (err) {
    return { ok: false, data: { success: false, message: err.message || 'Network error' }, status: 500 };
  }
};

export const logoutAdminApi = async () => {
  const url = `${getApiBaseUrl()}/admin/logout`;
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    };
    await fetch(url, { method: 'POST', headers });
  } catch (err) {}
};

export const verifyAdminSessionApi = async () => {
  const url = `${getApiBaseUrl()}/admin/verify-session`;
  try {
    const res = await fetch(url, { headers: getAuthHeaders() });
    const data = await res.json();
    return res.ok && Boolean(data.authenticated);
  } catch (err) {
    return false;
  }
};
