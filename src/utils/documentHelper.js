// Helper utilities to safely View and Download documents without triggering 404 pages or top-frame data URL blocks

export const handleViewDocument = (docObj, notify) => {
  const rawUrl = docObj?.data || docObj?.url;

  if (!rawUrl || rawUrl.startsWith('LOCAL_DATA_URL')) {
    const msg = '⚠️ இந்த ஆவணத்தின் கோப்பு தற்காலிகமாகச் சேமிப்பில் இல்லை. (Document file unavailable)';
    if (typeof notify === 'function') notify(msg);
    else alert(msg);
    return;
  }

  // Handle Base64 Data URL (convert to Blob URL so Chrome/Safari top-frame navigation allows it)
  if (rawUrl.startsWith('data:')) {
    try {
      const parts = rawUrl.split(',');
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'application/pdf';
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);
      const newWin = window.open(blobUrl, '_blank');
      if (!newWin) {
        window.location.href = blobUrl;
      }
      return;
    } catch (err) {
      console.warn('Base64 blob conversion notice:', err);
      const newWin = window.open(rawUrl, '_blank');
      if (!newWin) window.location.href = rawUrl;
      return;
    }
  }

  // Handle HTTPS / Firebase Storage URL / Blob URL
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('blob:')) {
    const newWin = window.open(rawUrl, '_blank');
    if (!newWin) window.location.href = rawUrl;
    return;
  }

  const msg = '⚠️ ஆவணத்தை திறக்க இயலவில்லை. (Invalid URL)';
  if (typeof notify === 'function') notify(msg);
  else alert(msg);
};

export const handleDownloadDocument = (docObj, notify) => {
  const rawUrl = docObj?.data || docObj?.url;
  const fileName = docObj?.name || docObj?.requirement || 'document.pdf';

  if (!rawUrl || rawUrl.startsWith('LOCAL_DATA_URL')) {
    const msg = '⚠️ பதிவிறக்கம் செய்ய ஆவணக் கோப்பு கிடைக்கவில்லை. (File not found for download)';
    if (typeof notify === 'function') notify(msg);
    else alert(msg);
    return;
  }

  // Handle Base64 Data URL download
  if (rawUrl.startsWith('data:')) {
    try {
      const link = document.createElement('a');
      link.href = rawUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (typeof notify === 'function') notify(`✅ ${fileName} பதிவிறக்கம் தொடங்கப்பட்டது!`);
      return;
    } catch (e) {
      console.error('Data URL download error:', e);
    }
  }

  // Handle Firebase Storage / Cloud HTTPS URL download
  try {
    const link = document.createElement('a');
    link.href = rawUrl;
    link.target = '_blank';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (typeof notify === 'function') notify(`✅ ${fileName} பதிவிறக்கம் செய்யப்படுகிறது!`);
  } catch (err) {
    window.open(rawUrl, '_blank');
  }
};
