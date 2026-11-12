// Robust Document Helper for View & Download — Supports PNG, JPG, PDF, WEBP, SVG, Blob URLs & Authenticated On-Demand Fetch
import { getDocBinary, saveDocBinary } from './idbDocStore.js';
import { fetchSingleExpiryDocumentDetailedMongo } from './mongoService.js';

const trackedBlobUrls = new Set();

export const getTrackedBlobUrlsCount = () => trackedBlobUrls.size;

export const createTrackedBlobUrl = (blob) => {
  if (!blob || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return '';
  const blobUrl = URL.createObjectURL(blob);
  if (blobUrl) trackedBlobUrls.add(blobUrl);
  return blobUrl;
};

export const revokeTrackedBlobUrl = (blobUrl) => {
  if (!blobUrl) return false;
  trackedBlobUrls.delete(blobUrl);
  if (typeof URL !== 'undefined' && typeof URL.revokeObjectURL === 'function') {
    try {
      URL.revokeObjectURL(blobUrl);
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
};

export const revokeAllTrackedBlobUrls = () => {
  for (const blobUrl of Array.from(trackedBlobUrls)) {
    revokeTrackedBlobUrl(blobUrl);
  }
};

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('pagehide', revokeAllTrackedBlobUrls);
  window.addEventListener('beforeunload', revokeAllTrackedBlobUrls);
}

function escapeViewerHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const isSafeDocumentPayload = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return false;
  const trimmed = rawUrl.trim();
  if (trimmed.length < 15 || trimmed.startsWith('LOCAL_DATA_URL')) return false;

  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('data:text/html') ||
    lower.startsWith('data:application/xhtml') ||
    lower.startsWith('data:text/javascript')
  ) {
    return false;
  }

  if (lower.startsWith('data:')) {
    const commaIdx = trimmed.indexOf(',');
    if (commaIdx === -1) return false;
    const header = lower.slice(0, commaIdx);
    const mimeMatch = header.match(/^data:([^;,]+)/);
    const mime = mimeMatch ? mimeMatch[1].trim() : '';
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
    if (mime && !allowedMimes.includes(mime)) {
      return false;
    }

    const rawBody = trimmed.slice(commaIdx + 1);
    let inspectText = '';
    if (header.includes(';base64')) {
      try {
        const cleanB64 = rawBody.replace(/\s/g, '').slice(0, 1024);
        if (typeof atob === 'function') {
          inspectText = atob(cleanB64).toLowerCase();
        } else if (typeof Buffer !== 'undefined') {
          inspectText = Buffer.from(cleanB64, 'base64').toString('latin1').toLowerCase();
        }
      } catch (e) {
        return false;
      }
    } else {
      try {
        inspectText = decodeURIComponent(rawBody.slice(0, 1024)).toLowerCase();
      } catch (e) {
        inspectText = rawBody.slice(0, 1024).toLowerCase();
      }
    }

    const htmlPatterns = ['<html', '<!doctype html', '<script', '<iframe', 'javascript:', 'onerror=', 'onload='];
    if (htmlPatterns.some((p) => inspectText.includes(p))) {
      return false;
    }
    return true;
  }

  if (lower.startsWith('https://') || lower.startsWith('blob:')) {
    return true;
  }
  return false;
};

export const validatePhotoUpload = (file, customMaxMb = 1) => {
  if (!file) return { valid: false, error: 'கோப்பு எதுவும் தேர்ந்தெடுக்கப்படவில்லை (No file selected).' };

  // 1. Format check: Only JPG / JPEG allowed
  const isJpg = file.type === 'image/jpeg' || /\.(jpg|jpeg)$/i.test(file.name || '');
  if (!isJpg) {
    return {
      valid: false,
      error: '⚠️ JPG / JPEG வடிவம் மட்டுமே அனுமதிக்கப்படும் (Only JPG/JPEG photo format supported)!'
    };
  }

  // 2. Size check: Max 1MB (or customMaxMb)
  const maxBytes = customMaxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `⚠️ போட்டோ அளவு 1 MB-க்கு மேல் இருக்கக்கூடாது (Photo size: ${sizeMb} MB. Max allowed: ${customMaxMb} MB)!`
    };
  }

  return { valid: true };
};

export const getMimeType = (docObj, rawUrl = '') => {
  if (docObj?.type && docObj.type !== 'File') return docObj.type;

  const fileName = docObj?.name || docObj?.requirement || '';
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.pdf')) return 'application/pdf';
  if (lowerName.endsWith('.png')) return 'image/png';
  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) return 'image/jpeg';
  if (lowerName.endsWith('.webp')) return 'image/webp';
  if (lowerName.endsWith('.svg')) return 'image/svg+xml';

  if (rawUrl && typeof rawUrl === 'string' && rawUrl.startsWith('data:')) {
    const match = rawUrl.split(',')[0].match(/:(.*?);/);
    if (match && match[1]) return match[1];
  }

  return 'image/jpeg';
};

export const createBlobFromDataUrl = (dataUrl, defaultMime = 'image/jpeg') => {
  if (!dataUrl || typeof dataUrl !== 'string') return null;

  // If already a blob URL, return null (caller should use dataUrl directly)
  if (dataUrl.startsWith('blob:')) {
    return null;
  }

  try {
    // 1. Handle data: URLs
    if (dataUrl.startsWith('data:')) {
      const parts = dataUrl.split(',');
      const header = parts[0] || '';
      const headerMime = header.match(/:(.*?);/)?.[1] || header.match(/data:([^,;]+)/)?.[1];
      const mime = headerMime || defaultMime;
      const isBase64 = header.includes(';base64');
      const rawContent = parts.slice(1).join(',');

      if (isBase64) {
        // Clean base64 string (strip whitespace/newlines)
        const cleanBase64 = rawContent.replace(/\s/g, '');
        try {
          const bstr = atob(cleanBase64);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          return new Blob([u8arr], { type: mime });
        } catch (atobErr) {
          console.warn('Base64 decode warning, falling back to text Blob:', atobErr.message);
          return new Blob([cleanBase64], { type: mime });
        }
      } else {
        // Plain URI-encoded content (e.g. SVG)
        try {
          const decoded = decodeURIComponent(rawContent);
          return new Blob([decoded], { type: mime });
        } catch (decErr) {
          return new Blob([rawContent], { type: mime });
        }
      }
    }

    // 2. Handle raw base64 string without data: prefix
    if (/^[A-Za-z0-9+/=_\-\s]+$/.test(dataUrl) && dataUrl.length > 50) {
      try {
        const clean = dataUrl.replace(/\s/g, '');
        const bstr = atob(clean);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: defaultMime });
      } catch (e) {}
    }

    return null;
  } catch (e) {
    console.warn('Safe blob creation notice:', e.message);
    return null;
  }
};

/**
 * Resolves document data/URL with full error status discrimination:
 * A. doc.data / doc.url if valid & safe
 * B. IndexedDB idbDocStore cache
 * C. Authenticated on-demand fetch: GET /api/documents/:id (with 45s timeout + transient retry)
 * D. Auto-cache retrieved cloud binary into IndexedDB under canonical docId
 */
export const resolveDocumentDetailed = async (docObj, options = {}) => {
  if (!docObj) {
    return { ok: false, url: '', source: '', status: 400, code: 'MISSING_DOC', message: 'Document reference is missing.', retryable: false };
  }

  if (typeof docObj === 'string') {
    if (isSafeDocumentPayload(docObj)) {
      return { ok: true, url: docObj, source: 'direct', status: 200, code: 'OK', message: '', retryable: false };
    }
    if (docObj.trim().toLowerCase().startsWith('data:text/html') || /<html|<script/i.test(docObj)) {
      return { ok: false, url: '', source: '', status: 400, code: 'UNSAFE_CONTENT_BLOCKED', message: 'Unsafe HTML/script content blocked.', retryable: false };
    }
  }

  // Priority A: inline doc.data / doc.url if already hydrated safely
  const directCandidates = [docObj.data, docObj.url, docObj.fileUrl, docObj.dataUrl].filter(Boolean);
  for (const candidate of directCandidates) {
    if (typeof candidate === 'string' && candidate.trim().length > 20 && !candidate.startsWith('LOCAL_DATA_URL')) {
      if (!isSafeDocumentPayload(candidate)) {
        return {
          ok: false,
          url: '',
          source: 'direct',
          status: 400,
          code: 'UNSAFE_CONTENT_BLOCKED',
          message: 'Blocked unsafe HTML/script content disguised as a document.',
          retryable: false
        };
      }
      return { ok: true, url: candidate, source: 'direct', status: 200, code: 'OK', message: '', retryable: false };
    }
  }

  const rawId = docObj.id || docObj.docId || docObj.legacyId || (typeof docObj.url === 'string' && /^(DOC|AK)-/.test(docObj.url.trim()) ? docObj.url.trim() : '');
  const docId = rawId ? String(rawId).trim() : '';

  // Priority B: Origin-local IndexedDB cache
  if (docId) {
    try {
      const idbUrl = await getDocBinary(docId);
      if (idbUrl && isSafeDocumentPayload(idbUrl)) {
        return { ok: true, url: idbUrl, source: 'indexeddb', status: 200, code: 'OK', message: '', retryable: false };
      }
    } catch (e) {}
  }

  // Priority C: Authenticated Cloud Fallback (GET /api/documents/:id)
  if (!docId) {
    return {
      ok: false,
      url: '',
      source: '',
      status: 404,
      code: 'DOCUMENT_ID_MISSING',
      message: 'Document ID is missing; cannot retrieve file from cloud vault.',
      retryable: false,
      needsAdminReview: true
    };
  }

  const cloudRes = await fetchSingleExpiryDocumentDetailedMongo(docId, {
    timeoutMs: options.timeoutMs ?? 45000,
    retries: options.retries ?? 1,
    retryDelayMs: options.retryDelayMs ?? 1500,
    customerPhone: docObj.customerPhone || docObj.phone
  });

  if (cloudRes.ok && cloudRes.document) {
    const cloudUrl = cloudRes.document.data || cloudRes.document.url || '';
    if (!cloudUrl) {
      return {
        ok: false,
        url: '',
        source: 'cloud',
        status: 404,
        code: 'DOCUMENT_BINARY_EMPTY',
        message: 'Document record has no stored image/PDF data.',
        retryable: false,
        needsAdminReview: true
      };
    }
    if (!isSafeDocumentPayload(cloudUrl)) {
      return {
        ok: false,
        url: '',
        source: 'cloud',
        status: 400,
        code: 'UNSAFE_CONTENT_BLOCKED',
        message: 'Blocked potentially malicious HTML/script content.',
        retryable: false
      };
    }

    // Priority D: Auto-cache retrieved binary under canonical server ID
    const cacheId = cloudRes.document.id || docId;
    try {
      await saveDocBinary(cacheId, cloudUrl, { ...docObj, ...cloudRes.document });
    } catch (e) {}

    return { ok: true, url: cloudUrl, source: 'cloud', status: 200, code: 'OK', message: '', document: cloudRes.document, retryable: false };
  }

  return {
    ok: false,
    url: '',
    source: 'cloud',
    status: cloudRes.status ?? 404,
    code: cloudRes.code || 'DOCUMENT_NOT_FOUND',
    message: cloudRes.message || 'Document preview could not be retrieved.',
    retryable: Boolean(cloudRes.retryable),
    needsAdminReview: Boolean(cloudRes.needsAdminReview)
  };
};

export const resolveDocumentUrl = async (docObj, options = {}) => {
  const res = await resolveDocumentDetailed(docObj, options);
  return res.ok ? res.url : '';
};

function describePreviewFailure(resolution) {
  const status = resolution?.status || 0;
  const code = resolution?.code || '';
  if (status === 401 || code === 'SESSION_EXPIRED' || code === 'UNAUTHORIZED') {
    return {
      badge: 'SESSION EXPIRED • மீண்டும் உள்நுழையவும்',
      title: 'Session Expired / Authentication Required',
      detail: 'Your login session has expired or is missing a security token. Please sign in again to view this document.',
      notifyMsg: '🔐 அமர்வு காலாவதியானது (401). ஆவணத்தைப் பார்க்க மீண்டும் உள்நுழையவும். (Session expired — please login again.)'
    };
  }
  if (status === 403 || code === 'FORBIDDEN') {
    return {
      badge: 'ACCESS DENIED • அனுமதி மறுக்கப்பட்டது',
      title: 'Access Denied (403)',
      detail: 'You do not have permission to view this private document.',
      notifyMsg: '⛔ இந்த ஆவணத்தை அணுக அனுமதி இல்லை (403 Access Denied).'
    };
  }
  if (code === 'UNSAFE_CONTENT_BLOCKED') {
    return {
      badge: 'SECURITY BLOCKED • பாதுகாப்பு தடுப்பு',
      title: 'Unsupported or Unsafe File Content',
      detail: 'Potentially dangerous HTML or script content was blocked from rendering.',
      notifyMsg: '🛡️ பாதுகாப்பற்ற கோப்பு உள்ளடக்கம் தடுக்கப்பட்டது.'
    };
  }
  if (status === 429 || code === 'RATE_LIMITED') {
    return {
      badge: 'TOO MANY REQUESTS • சிறிது நேரம் கழித்து முயற்சிக்கவும்',
      title: 'Too Many Requests (429)',
      detail: 'Please wait a few seconds before trying to open this document again.',
      notifyMsg: '⏳ அதிக கோரிக்கைகள் (429). சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.'
    };
  }
  if (status >= 500 || code === 'SERVER_UNAVAILABLE' || code === 'DOCUMENT_DECRYPTION_FAILED') {
    return {
      badge: 'SERVER UNAVAILABLE • மீண்டும் முயற்சிக்கவும்',
      title: 'Server Temporarily Unavailable',
      detail: resolution?.message || 'The document server is temporarily unavailable. Please retry in a few seconds.',
      notifyMsg: '⚠️ சர்வர் தற்காலிகமாக கிடைக்கவில்லை (5xx). சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.'
    };
  }
  if (resolution?.retryable || status === 0 || code === 'TIMEOUT' || code === 'NETWORK_ERROR') {
    return {
      badge: 'CONNECTION TIMED OUT • மீண்டும் முயற்சிக்கவும்',
      title: 'Server Waking Up / Request Timed Out',
      detail: 'Could not download the document in time (server may be waking up). Please click Retry or open again.',
      notifyMsg: '⏳ சர்வர் பதிலளிக்க நேரம் எடுத்தது (Timeout). மீண்டும் முயற்சிக்கவும் (Retry).'
    };
  }
  if (code === 'LEGACY_DOCUMENT_UNRESOLVED' || resolution?.needsAdminReview) {
    return {
      badge: 'ADMIN REVIEW REQUIRED • மறுஆய்வு தேவை',
      title: 'Legacy Document Requires Review (404)',
      detail: 'This legacy document record does not contain a recoverable binary in cloud storage and requires Admin review or re-upload.',
      notifyMsg: '⚠️ பழைய ஆவணக் கோப்பு காணப்படவில்லை (Admin Review / Re-upload required).'
    };
  }
  return {
    badge: 'DOCUMENT NOT FOUND • ஆவணம் கிடைக்கவில்லை',
    title: 'Document Not Found (404)',
    detail: 'This document binary was not found on the server. Please re-upload it in your Document Vault.',
    notifyMsg: '⚠️ ஆவணக் கோப்பு சர்வரில் கிடைக்கவில்லை (404). தயவுசெய்து மீண்டும் பதிவேற்றவும்.'
  };
}

function generateViewerId() {
  return `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildViewerLifecycleScript(viewerId) {
  const safeId = String(viewerId || '').replace(/[^a-zA-Z0-9_-]/g, '');
  return `<script>
(function () {
  var viewerId = "${safeId}";
  function notifyOpener(type) {
    try {
      if (window.opener && !window.opener.closed && typeof window.opener.postMessage === 'function') {
        window.opener.postMessage(
          { source: 'akesevai-vault-viewer', viewerId: viewerId, type: type },
          window.location.origin
        );
      }
    } catch (e) {}
  }
  window.addEventListener('DOMContentLoaded', function () { notifyOpener('viewer-ready'); });
  window.addEventListener('load', function () { notifyOpener('viewer-loaded'); });
  window.addEventListener('pagehide', function () { notifyOpener('viewer-closed'); });
})();
</script>`;
}

/**
 * Cleanly manage Blob URLs for an opened same-origin HTML viewer window.
 * Never attaches unload/pagehide listeners to the initial about:blank navigation state,
 * preventing premature Blob URL revocation in Chrome while the popup navigates to the viewer.
 */
function attachWindowBlobCleanup(targetWin, urls = [], optionsOrDelay = {}) {
  const validUrls = Array.from(new Set(urls.filter((u) => typeof u === 'string' && u.startsWith('blob:'))));
  if (validUrls.length === 0) return { cleanup: () => {}, blocked: !targetWin };

  const opts = typeof optionsOrDelay === 'number'
    ? { cleanupDelayMs: optionsOrDelay }
    : (optionsOrDelay || {});
  const viewerId = opts.viewerId || '';
  const explicitDelayMs = typeof opts.cleanupDelayMs === 'number' && opts.cleanupDelayMs > 0
    ? opts.cleanupDelayMs
    : null;

  let cleaned = false;
  let pollTimer = null;
  let delayTimer = null;

  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    if (pollTimer !== null) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    if (delayTimer !== null) {
      clearTimeout(delayTimer);
      delayTimer = null;
    }
    if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
      try { window.removeEventListener('message', onViewerMessage); } catch (e) {}
    }
    validUrls.forEach((u) => revokeTrackedBlobUrl(u));
  };

  function onViewerMessage(event) {
    const data = event?.data;
    if (!data || data.source !== 'akesevai-vault-viewer') return;
    if (viewerId && data.viewerId !== viewerId) return;
    const sameOrigin = typeof window !== 'undefined' && window.location?.origin
      ? event.origin === window.location.origin
      : true;
    if (event.source !== targetWin && !sameOrigin) return;
    if (data.type === 'viewer-closed') {
      cleanup();
    }
  }

  // If popup was blocked or already closed, immediately revoke created Blob URLs to avoid leaks.
  if (!targetWin || targetWin.closed === true) {
    cleanup();
    return { cleanup, blocked: true };
  }

  if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('message', onViewerMessage);
  }

  // Poll window.closed for reliable disposal even if the browser skips pagehide on tab kill.
  if (typeof targetWin.closed === 'boolean') {
    pollTimer = setInterval(() => {
      try {
        if (!targetWin || targetWin.closed) {
          cleanup();
        }
      } catch (e) {
        cleanup();
      }
    }, 400);
    if (pollTimer && typeof pollTimer.unref === 'function') pollTimer.unref();
  }

  // Only honor an explicit caller-supplied cleanup delay (e.g. headless mock unit tests).
  if (explicitDelayMs !== null) {
    delayTimer = setTimeout(cleanup, explicitDelayMs);
    if (delayTimer && typeof delayTimer.unref === 'function') delayTimer.unref();
  }

  return { cleanup, blocked: false };
}

function openViewerHtmlWindow({ htmlContent, viewerId, mediaUrls = [], notify, preNotifyMsg = '', options = {} }) {
  const htmlBlob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const viewerUrl = createTrackedBlobUrl(htmlBlob);
  const allUrls = [viewerUrl, ...mediaUrls];
  const win = window.open(viewerUrl, '_blank');
  const { blocked } = attachWindowBlobCleanup(win, allUrls, {
    viewerId,
    cleanupDelayMs: options.blobCleanupDelayMs
  });

  if (blocked) {
    if (typeof notify === 'function') {
      notify(
        preNotifyMsg ||
        '⚠️ பாப்-அப் சாளரம் உலாவியால் தடுக்கப்பட்டது (Popup blocked by browser). தயவுசெய்து pop-ups அனுமதிக்கவும் அல்லது Download பொத்தானைப் பயன்படுத்தவும்.'
      );
    }
    return { popupBlocked: true };
  }

  if (preNotifyMsg && typeof notify === 'function') {
    notify(preNotifyMsg);
  }
  return { popupBlocked: false };
}

export const handleViewDocument = async (docObj, notify, options = {}) => {
  const docNameRaw = docObj?.name || docObj?.requirement || 'Document';
  const docName = escapeViewerHtml(docNameRaw);
  const docReq = escapeViewerHtml(docObj?.requirement || '');
  const uploadedAt = escapeViewerHtml(docObj?.uploadedAt || 'Recently');

  const resolution = await resolveDocumentDetailed(docObj, options);

  if (!resolution.ok || !resolution.url) {
    const failureInfo = describePreviewFailure(resolution);
    const viewerId = generateViewerId();
    const unavailableHtml = `<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docName} — AK e-Sevai Vault</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
    .card { background: #1e293b; border: 2px solid #334155; border-radius: 16px; padding: 32px; max-width: 520px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .icon { font-size: 48px; margin-bottom: 16px; }
    .badge { background: #d97706; color: white; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 6px; display: inline-block; margin-bottom: 12px; }
    h2 { font-size: 20px; color: #f8fafc; margin-bottom: 8px; }
    p { font-size: 13.5px; color: #94a3b8; line-height: 1.6; margin-bottom: 20px; }
    .meta { background: #0f172a; border-radius: 8px; padding: 12px; margin-bottom: 24px; font-size: 12px; text-align: left; color: #cbd5e1; display: grid; gap: 6px; border: 1px solid #334155; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; transition: 0.2s; }
    .btn-close { background: #334155; color: white; width: 100%; }
    .btn-close:hover { background: #475569; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">⚠️</div>
    <span class="badge">${escapeViewerHtml(failureInfo.badge)}</span>
    <h2>${docName}</h2>
    <p><strong>${escapeViewerHtml(failureInfo.title)}</strong><br>${escapeViewerHtml(failureInfo.detail)}</p>
    <div class="meta">
      <div>📄 <strong>கோப்பு பெயர் (File):</strong> ${docName}</div>
      ${docReq ? `<div>📋 <strong>தேவை (Requirement):</strong> ${docReq}</div>` : ''}
      <div>📅 <strong>பதிவேற்றப்பட்ட தேதி (Date):</strong> ${uploadedAt}</div>
    </div>
    <button onclick="window.close()" class="btn btn-close">✕ மூடு (Close Window)</button>
  </div>
  ${buildViewerLifecycleScript(viewerId)}
</body>
</html>`;
    const viewOpen = openViewerHtmlWindow({
      htmlContent: unavailableHtml,
      viewerId,
      notify,
      preNotifyMsg: failureInfo.notifyMsg,
      options
    });
    return viewOpen.popupBlocked ? { ...resolution, popupBlocked: true } : resolution;
  }

  const rawUrl = resolution.url;
  const mime = getMimeType(docObj, rawUrl);
  const isPdf = mime === 'application/pdf' || (docNameRaw && docNameRaw.toLowerCase().endsWith('.pdf'));

  // 1. Handle PDF Documents
  if (isPdf) {
    let pdfBlobUrl = rawUrl;
    let createdMediaUrl = '';
    if (rawUrl.startsWith('data:')) {
      const blob = createBlobFromDataUrl(rawUrl, 'application/pdf');
      if (blob) {
        createdMediaUrl = createTrackedBlobUrl(blob);
        pdfBlobUrl = createdMediaUrl;
      }
    }

    const viewerId = generateViewerId();
    const pdfViewerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docName} — AK e-Sevai PDF Viewer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
    .viewer-header { background: #1e293b; color: white; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .doc-info { display: flex; align-items: center; gap: 10px; }
    .badge { background: #dc2626; color: white; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
    .title { font-size: 14.5px; font-weight: 700; color: #f8fafc; max-width: 50vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .actions { display: flex; gap: 8px; align-items: center; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 6px; font-size: 12.5px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; }
    .btn-download { background: #16a34a; color: white; }
    .btn-download:hover { background: #15803d; }
    .btn-close { background: #334155; color: white; }
    .btn-close:hover { background: #475569; }
    .pdf-frame { flex: 1; width: 100%; height: calc(100vh - 54px); border: none; background: #525659; }
  </style>
</head>
<body>
  <header class="viewer-header">
    <div class="doc-info">
      <span class="badge">PDF DOCUMENT</span>
      <span class="title">📄 ${docName}</span>
    </div>
    <div class="actions">
      <a href="${pdfBlobUrl}" download="${docName}" class="btn btn-download">📥 Download (பதிவிறக்கு)</a>
      <button onclick="window.close()" class="btn btn-close">✕ Close</button>
    </div>
  </header>
  <iframe src="${pdfBlobUrl}#toolbar=1" class="pdf-frame" title="${docName}"></iframe>
  ${buildViewerLifecycleScript(viewerId)}
</body>
</html>`;
    const viewOpen = openViewerHtmlWindow({
      htmlContent: pdfViewerHtml,
      viewerId,
      mediaUrls: [createdMediaUrl],
      notify,
      options
    });
    return viewOpen.popupBlocked ? { ...resolution, popupBlocked: true } : resolution;
  }

  // 2. Handle Real Image Documents (JPG, PNG, WEBP, SVG)
  let imageDisplayUrl = rawUrl;
  let createdImageUrl = '';
  if (rawUrl.startsWith('data:') && rawUrl.includes(';base64')) {
    const blob = createBlobFromDataUrl(rawUrl, mime);
    if (blob) {
      createdImageUrl = createTrackedBlobUrl(blob);
      imageDisplayUrl = createdImageUrl;
    }
  }

  const viewerId = generateViewerId();
  const imageViewerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docName} — AK e-Sevai Document Viewer</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; display: flex; flex-direction: column; }
    .viewer-header { background: #1e293b; color: white; padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .doc-info { display: flex; align-items: center; gap: 10px; }
    .badge { background: #0052cc; color: white; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 4px; }
    .title { font-size: 14.5px; font-weight: 700; color: #f8fafc; max-width: 55vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .actions { display: flex; gap: 8px; align-items: center; }
    .btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; border-radius: 6px; font-size: 12.5px; font-weight: 700; text-decoration: none; border: none; cursor: pointer; transition: background 0.15s; }
    .btn-download { background: #16a34a; color: white; }
    .btn-download:hover { background: #15803d; }
    .btn-close { background: #334155; color: white; }
    .btn-close:hover { background: #475569; }
    .image-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; min-height: calc(100vh - 70px); }
    img { max-width: 95vw; max-height: calc(100vh - 100px); object-fit: contain; border-radius: 8px; box-shadow: 0 12px 36px rgba(0,0,0,0.7); background: #ffffff; border: 1px solid #334155; }
  </style>
</head>
<body>
  <header class="viewer-header">
    <div class="doc-info">
      <span class="badge">AK e-SEVAI VAULT</span>
      <span class="title">📄 ${docName}</span>
    </div>
    <div class="actions">
      <a href="${imageDisplayUrl}" download="${docName}" class="btn btn-download">📥 Download (பதிவிறக்கு)</a>
      <button onclick="window.close()" class="btn btn-close">✕ Close</button>
    </div>
  </header>
  <main class="image-container">
    <img src="${imageDisplayUrl}" alt="${docName}" />
  </main>
  ${buildViewerLifecycleScript(viewerId)}
</body>
</html>`;

  const viewOpen = openViewerHtmlWindow({
    htmlContent: imageViewerHtml,
    viewerId,
    mediaUrls: [createdImageUrl],
    notify,
    options
  });
  return viewOpen.popupBlocked ? { ...resolution, popupBlocked: true } : resolution;
};

export const handleDownloadDocument = async (docObj, notify, options = {}) => {
  const resolution = await resolveDocumentDetailed(docObj, options);
  const rawUrl = resolution.ok ? resolution.url : '';
  let fileName = docObj?.name || docObj?.requirement || 'document.jpg';

  if (!rawUrl || !isSafeDocumentPayload(rawUrl)) {
    const failureInfo = describePreviewFailure(resolution);
    if (typeof notify === 'function') {
      notify(failureInfo.notifyMsg);
    }
    return resolution;
  }

  const mime = getMimeType(docObj, rawUrl);

  // Ensure file extension matches MIME type
  if (!/\.(png|jpg|jpeg|pdf|webp|svg)$/i.test(fileName)) {
    if (mime === 'application/pdf') fileName += '.pdf';
    else if (mime === 'image/jpeg') fileName += '.jpg';
    else if (mime === 'image/webp') fileName += '.webp';
    else if (mime === 'image/svg+xml') fileName += '.svg';
    else fileName += '.jpg';
  }

  // 1. Handle Blob URL
  if (rawUrl.startsWith('blob:')) {
    const link = document.createElement('a');
    link.href = rawUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof notify === 'function') notify(`✅ ${fileName} பதிவிறக்கம் தொடங்கப்பட்டது!`);
    return resolution;
  }

  // 2. Handle Data URL
  if (rawUrl.startsWith('data:')) {
    const blob = createBlobFromDataUrl(rawUrl, mime);
    if (blob) {
      const blobUrl = createTrackedBlobUrl(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => revokeTrackedBlobUrl(blobUrl), options.blobCleanupDelayMs ?? 1500);
      if (typeof notify === 'function') notify(`✅ ${fileName} பதிவிறக்கம் தொடங்கப்பட்டது!`);
      return resolution;
    }
  }

  // 3. Handle HTTPS URLs via fetch + blob download
  if (rawUrl.startsWith('https://')) {
    try {
      if (typeof notify === 'function') notify(`⏳ ${fileName} பதிவிறக்கப்படுகிறது... (Downloading...)`);
      const response = await fetch(rawUrl);
      const blob = await response.blob();
      const blobUrl = createTrackedBlobUrl(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => revokeTrackedBlobUrl(blobUrl), options.blobCleanupDelayMs ?? 1500);
      if (typeof notify === 'function') notify(`✅ ${fileName} பதிவிறக்கம் முடிவடைந்தது!`);
      return resolution;
    } catch (e) {
      window.open(rawUrl, '_blank');
      return resolution;
    }
  }

  return resolution;
};
