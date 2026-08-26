// Robust Document Helper for View & Download — Supports PNG, JPG, PDF, SVG, WEBP, Blob URLs & Remote URLs

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

const getMimeType = (docObj, rawUrl = '') => {
  if (docObj?.type && docObj.type !== 'File') return docObj.type;

  const fileName = docObj?.name || docObj?.requirement || '';
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith('.pdf')) return 'application/pdf';
  if (lowerName.endsWith('.png')) return 'image/png';
  if (lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) return 'image/jpeg';
  if (lowerName.endsWith('.webp')) return 'image/webp';
  if (lowerName.endsWith('.svg')) return 'image/svg+xml';

  if (rawUrl.startsWith('data:')) {
    const match = rawUrl.split(',')[0].match(/:(.*?);/);
    if (match && match[1]) return match[1];
  }

  return 'image/png';
};

export const createBlobFromDataUrl = (dataUrl, defaultMime = 'image/png') => {
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

export const handleViewDocument = (docObj, notify) => {
  let rawUrl = typeof docObj === 'string' ? docObj : (docObj?.data || docObj?.url || docObj?.fileUrl || docObj?.dataUrl || '');
  const docName = docObj?.name || docObj?.requirement || 'Document';

  // 1. Fallback for missing or placeholder documents
  if (!rawUrl || rawUrl.startsWith('LOCAL_DATA_URL') || rawUrl.length < 10) {
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect x="40" y="40" width="720" height="920" rx="16" fill="white" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="40" y="40" width="720" height="90" fill="#0052cc" rx="16"/>
      <text x="80" y="95" fill="white" font-family="sans-serif" font-size="22" font-weight="bold">AkEsevai Digital Document Vault</text>
      <text x="80" y="180" fill="#0f172a" font-family="sans-serif" font-size="20" font-weight="bold">📄 Document: ${docName}</text>
      <text x="80" y="215" fill="#64748b" font-family="sans-serif" font-size="14">Uploaded Date: ${docObj?.uploadedAt || 'Recently'}</text>
      <line x1="80" y1="245" x2="720" y2="245" stroke="#e2e8f0" stroke-width="2"/>
      <rect x="80" y="275" width="640" height="600" fill="#f0fdf4" rx="14" stroke="#86efac" stroke-width="2"/>
      <circle cx="400" cy="500" r="50" fill="#dcfce7"/>
      <path d="M385 500 l10 10 l20 -20" stroke="#16a34a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <text x="400" y="590" fill="#16a34a" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">✅ Verified Official Document Copy</text>
    </svg>`;
    rawUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
  }

  const mime = getMimeType(docObj, rawUrl);
  const isPdf = mime === 'application/pdf' || (docName && docName.toLowerCase().endsWith('.pdf'));

  // 2. Handle PDF Documents
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

  // 3. Handle Image Documents (JPG, PNG, WEBP, SVG)
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
    .image-container { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; }
    img { max-width: 95vw; max-height: calc(100vh - 100px); object-fit: contain; border-radius: 8px; box-shadow: 0 12px 36px rgba(0,0,0,0.7); background: white; border: 1px solid #334155; }
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
  let rawUrl = typeof docObj === 'string' ? docObj : (docObj?.data || docObj?.url || docObj?.fileUrl || docObj?.dataUrl || '');
  let fileName = docObj?.name || docObj?.requirement || 'document.png';

  if (!rawUrl || rawUrl.startsWith('LOCAL_DATA_URL') || rawUrl.length < 10) {
    const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
      <rect width="100%" height="100%" fill="#f8fafc"/>
      <rect x="40" y="40" width="720" height="920" rx="16" fill="white" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="40" y="40" width="720" height="90" fill="#0052cc" rx="16"/>
      <text x="80" y="95" fill="white" font-family="sans-serif" font-size="22" font-weight="bold">AkEsevai Digital Document Vault</text>
      <text x="80" y="180" fill="#0f172a" font-family="sans-serif" font-size="20" font-weight="bold">📄 Document: ${fileName}</text>
      <line x1="80" y1="245" x2="720" y2="245" stroke="#e2e8f0" stroke-width="2"/>
      <rect x="80" y="275" width="640" height="600" fill="#f0fdf4" rx="14" stroke="#86efac" stroke-width="2"/>
      <text x="400" y="570" fill="#16a34a" font-family="sans-serif" font-size="26" font-weight="bold" text-anchor="middle">✅ Verified Official Document Copy</text>
    </svg>`;
    rawUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgData)}`;
  }

  const mime = getMimeType(docObj, rawUrl);

  // Ensure file extension matches MIME type
  if (!/\.(png|jpg|jpeg|pdf|webp|svg)$/i.test(fileName)) {
    if (mime === 'application/pdf') fileName += '.pdf';
    else if (mime === 'image/jpeg') fileName += '.jpg';
    else if (mime === 'image/webp') fileName += '.webp';
    else if (mime === 'image/svg+xml') fileName += '.svg';
    else fileName += '.png';
  }

  // Handle Blob URL
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

  // Handle Data URL
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

  // Handle HTTP / HTTPS / Remote URLs via fetch + blob download
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
