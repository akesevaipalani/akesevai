// Robust Document Helper for View & Download — Supports PNG, JPG, PDF, SVG, WEBP, Blob URLs & Remote URLs
import { getDocBinary, saveDocBinary } from './idbDocStore.js';
import { fetchSingleExpiryDocumentMongo } from './mongoService.js';

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
 * Resolves document data/URL using exact 4-tier priority:
 * A. doc.url / doc.data if valid
 * B. IndexedDB idbDocStore cache
 * C. Cloud fallback: GET /api/documents/:id using authenticated mongoService
 * D. Auto-cache retrieved cloud binary into IndexedDB
 * E. Fail gracefully with clean Preview Unavailable (NEVER restore fake SVG)
 */
export const resolveDocumentUrl = async (docObj) => {
  if (!docObj) return '';
  if (typeof docObj === 'string') {
    if (docObj.length > 20 && !docObj.startsWith('LOCAL_DATA_URL')) return docObj;
  }

  // Priority A: doc.url / doc.data if valid string
  let directUrl = docObj.data || docObj.url || docObj.fileUrl || docObj.dataUrl || '';
  if (directUrl && directUrl.length > 20 && !directUrl.startsWith('LOCAL_DATA_URL')) {
    return directUrl;
  }

  const docId = docObj.id || docObj.docId || docObj.url || docObj.name;

  // Priority B: IndexedDB idbDocStore cache
  if (docId) {
    try {
      const idbUrl = await getDocBinary(docId);
      if (idbUrl && idbUrl.length > 20 && !idbUrl.startsWith('LOCAL_DATA_URL')) {
        return idbUrl;
      }
    } catch (e) {}
  }

  // Priority C: Cloud fallback (GET /api/documents/:id with authenticated context)
  if (docId && typeof fetchSingleExpiryDocumentMongo === 'function') {
    try {
      const cloudDoc = await fetchSingleExpiryDocumentMongo(docId);
      const cloudUrl = cloudDoc?.url || cloudDoc?.data || '';
      if (cloudUrl && cloudUrl.length > 20 && !cloudUrl.startsWith('LOCAL_DATA_URL')) {
        // Priority D: Auto-cache retrieved binary into IndexedDB for instant offline access
        try {
          await saveDocBinary(docId, cloudUrl, { ...docObj, ...cloudDoc });
        } catch (e) {}
        return cloudUrl;
      }
    } catch (e) {}
  }

  // Priority E: If all sources fail, return empty
  return '';
};

export const handleViewDocument = async (docObj, notify) => {
  const docName = docObj?.name || docObj?.requirement || 'Document';
  const docReq = docObj?.requirement || '';
  const uploadedAt = docObj?.uploadedAt || 'Recently';

  let rawUrl = await resolveDocumentUrl(docObj);

  // If no URL available, show clean Preview Unavailable view (NOT fake SVG)
  if (!rawUrl || rawUrl.length < 15 || rawUrl.startsWith('LOCAL_DATA_URL')) {
    const unavailableHtml = `<!DOCTYPE html>
<html lang="ta">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${docName} — AK e-Sevai Vault</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; }
    .card { background: #1e293b; border: 2px solid #334155; border-radius: 16px; padding: 32px; max-width: 500px; width: 100%; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
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
    <span class="badge">முன்னோட்டம் கிடைக்கவில்லை • PREVIEW UNAVAILABLE</span>
    <h2>${docName}</h2>
    <p>இந்த ஆவணத்தின் நேரடி முன்னோட்டம் கிடைக்கவில்லை. தயவுசெய்து ஆவணத்தை மீண்டும் பதிவேற்றவும்.<br><small>(Direct file preview unavailable. Please re-upload this document in your vault.)</small></p>
    <div class="meta">
      <div>📄 <strong>கோப்பு பெயர் (File):</strong> ${docName}</div>
      ${docReq ? `<div>📋 <strong>தேவை (Requirement):</strong> ${docReq}</div>` : ''}
      <div>📅 <strong>பதிவேற்றப்பட்ட தேதி (Date):</strong> ${uploadedAt}</div>
    </div>
    <button onclick="window.close()" class="btn btn-close">✕ மூடு (Close Window)</button>
  </div>
</body>
</html>`;
    const htmlBlob = new Blob([unavailableHtml], { type: 'text/html;charset=utf-8' });
    const viewerUrl = URL.createObjectURL(htmlBlob);
    const win = window.open(viewerUrl, '_blank');
    if (!win) window.location.href = viewerUrl;
    if (typeof notify === 'function') notify('⚠️ ஆவண முன்னோட்டம் கிடைக்கவில்லை. தயவுசெய்து மீண்டும் பதிவேற்றவும்.');
    return;
  }

  const mime = getMimeType(docObj, rawUrl);
  const isPdf = mime === 'application/pdf' || (docName && docName.toLowerCase().endsWith('.pdf'));

  // 1. Handle PDF Documents
  if (isPdf) {
    let pdfBlobUrl = rawUrl;
    if (rawUrl.startsWith('data:')) {
      const blob = createBlobFromDataUrl(rawUrl, 'application/pdf');
      if (blob) {
        pdfBlobUrl = URL.createObjectURL(blob);
      }
    }

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
</body>
</html>`;
    const htmlBlob = new Blob([pdfViewerHtml], { type: 'text/html;charset=utf-8' });
    const viewerUrl = URL.createObjectURL(htmlBlob);
    const win = window.open(viewerUrl, '_blank');
    if (!win) window.location.href = viewerUrl;
    return;
  }

  // 2. Handle Real Image Documents (JPG, PNG, WEBP, SVG)
  let imageDisplayUrl = rawUrl;
  if (rawUrl.startsWith('data:') && rawUrl.includes(';base64')) {
    const blob = createBlobFromDataUrl(rawUrl, mime);
    if (blob) {
      imageDisplayUrl = URL.createObjectURL(blob);
    }
  }

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
</body>
</html>`;

  const htmlBlob = new Blob([imageViewerHtml], { type: 'text/html;charset=utf-8' });
  const viewerUrl = URL.createObjectURL(htmlBlob);
  const win = window.open(viewerUrl, '_blank');
  if (!win) window.location.href = viewerUrl;
};

export const handleDownloadDocument = async (docObj, notify) => {
  let rawUrl = await resolveDocumentUrl(docObj);
  let fileName = docObj?.name || docObj?.requirement || 'document.jpg';

  if (!rawUrl || rawUrl.length < 15 || rawUrl.startsWith('LOCAL_DATA_URL')) {
    if (typeof notify === 'function') {
      notify('⚠️ ஆவணக் கோப்பு கிடைக்கவில்லை. தயவுசெய்து மீண்டும் பதிவேற்றவும். (Document file not found, please re-upload)');
    }
    return;
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
    return;
  }

  // 2. Handle Data URL
  if (rawUrl.startsWith('data:')) {
    const blob = createBlobFromDataUrl(rawUrl, mime);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      if (typeof notify === 'function') notify(`✅ ${fileName} பதிவிறக்கம் தொடங்கப்பட்டது!`);
      return;
    }
  }

  // 3. Handle HTTP / HTTPS / Remote URLs via fetch + blob download
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    try {
      if (typeof notify === 'function') notify(`⏳ ${fileName} பதிவிறக்கப்படுகிறது... (Downloading...)`);
      const response = await fetch(rawUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      if (typeof notify === 'function') notify(`✅ ${fileName} பதிவிறக்கம் முடிவடைந்தது!`);
      return;
    } catch (e) {
      window.open(rawUrl, '_blank');
      return;
    }
  }

  window.open(rawUrl, '_blank');
};
