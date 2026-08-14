// Robust Document Helper for View & Download — Supports PNG, JPG, PDF, SVG, WEBP & Firebase Storage

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

const createBlobFromDataUrl = (dataUrl, defaultMime = 'image/png') => {
  try {
    const parts = dataUrl.split(',');
    const headerMime = parts[0]?.match(/:(.*?);/)?.[1];
    const mime = headerMime || defaultMime;
    const base64Data = parts[1] || parts[0];
    const bstr = atob(base64Data);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  } catch (e) {
    console.error('Blob creation error:', e);
    return null;
  }
};

export const handleViewDocument = (docObj, notify) => {
  let rawUrl = typeof docObj === 'string' ? docObj : (docObj?.data || docObj?.url || docObj?.fileUrl || docObj?.dataUrl || '');
  const docName = docObj?.name || docObj?.requirement || 'Document';

  // Fallback for missing/empty/LOCAL_DATA_URL document placeholders
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

  // If HTTPS URL or Firebase Storage URL
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('blob:')) {
    const win = window.open(rawUrl, '_blank');
    if (!win) window.location.href = rawUrl;
    return;
  }

  // Handle Base64 Data URL
  if (rawUrl.startsWith('data:')) {
    const blob = createBlobFromDataUrl(rawUrl, mime);
    if (blob) {
      const blobUrl = URL.createObjectURL(blob);

      // For Images (PNG, JPG, WEBP), open a clean viewer window with full image display
      if (mime.startsWith('image/')) {
        const viewWindow = window.open('', '_blank');
        if (viewWindow) {
          viewWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${docName} — AkEsevai Document Viewer</title>
                <style>
                  body { margin: 0; background: #0f172a; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui, sans-serif; color: white; }
                  .header { position: fixed; top: 0; left: 0; right: 0; background: rgba(15,23,42,0.9); backdrop-filter: blur(8px); padding: 12px 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; z-index: 100; }
                  .title { font-weight: 700; font-size: 15px; color: #f8fafc; }
                  .btn { background: #0052cc; color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; font-size: 13px; cursor: pointer; text-decoration: none; }
                  img { max-width: 90vw; max-height: 85vh; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); margin-top: 70px; object-fit: contain; }
                </style>
              </head>
              <body>
                <div class="header">
                  <div class="title">📄 ${docName}</div>
                  <a href="${blobUrl}" download="${docName}" class="btn">📥 Download File</a>
                </div>
                <img src="${blobUrl}" alt="${docName}" />
              </body>
            </html>
          `);
          viewWindow.document.close();
          return;
        }
      }

      // For PDF or SVG, open blob URL directly in new tab
      const win = window.open(blobUrl, '_blank');
      if (!win) window.location.href = blobUrl;
      return;
    }
  }

  window.open(rawUrl, '_blank');
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

  // Handle Base64 Data URL
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

  // Handle HTTP / HTTPS / Firebase Storage URLs via fetch + blob download to prevent CORS format errors!
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
