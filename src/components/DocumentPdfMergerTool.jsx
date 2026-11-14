import React, { useState } from 'react';
import { Layers, Combine, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { validatePdfInput, loadPdfDocumentSafe, formatPdfErrorMessage } from '../utils/pdfToolsHelper';
import { validateImageFile } from '../utils/imageToolsHelper';

export default function DocumentPdfMergerTool({ notify }) {
  const [files, setFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [mergedInfo, setMergedInfo] = useState(null);
  const [outputName, setOutputName] = useState('akesevai_merged_document.pdf');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    setErrorMsg('');

    const validItems = [];
    for (const file of selected) {
      const isImg = file.type.startsWith('image/') || /\.(jpe?g|png|webp|bmp)$/i.test(file.name || '');
      const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
      if (!isImg && !isPdf) {
        setErrorMsg(`Unsupported file format: ${file.name}. Only PDF, JPG, PNG, WEBP allowed.`);
        continue;
      }
      try {
        if (isImg) validateImageFile(file);
      } catch (err) {
        setErrorMsg(err.message);
        continue;
      }
      validItems.push({
        id: Math.random().toString(36).slice(2, 11),
        file,
        name: file.name,
        sizeKb: Math.max(1, Math.round(file.size / 1024)),
        type: isImg ? 'image' : 'pdf'
      });
    }

    if (validItems.length > 0) {
      setFiles((prev) => [...prev, ...validItems]);
      setMergedPdfUrl(null);
      setMergedInfo(null);
    }
    e.target.value = '';
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedPdfUrl(null);
    setMergedInfo(null);
    setErrorMsg('');
  };

  const handleMerge = async () => {
    if (!files.length) return;
    setProcessing(true);
    setErrorMsg('');

    try {
      const { PDFDocument } = await import('pdf-lib');
      const outPdf = await PDFDocument.create();

      for (const item of files) {
        if (item.type === 'pdf') {
          const bytes = await validatePdfInput(item.file);
          const srcPdf = await loadPdfDocumentSafe(bytes);
          const copied = await outPdf.copyPages(srcPdf, srcPdf.getPageIndices());
          copied.forEach((p) => outPdf.addPage(p));
        } else {
          // Convert raster image reliably to JPEG/PNG bytes for pdf-lib embedding on an A4 sheet
          const imgBytesUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (ev) => resolve(ev.target?.result || '');
            reader.onerror = () => reject(new Error(`Failed to read image: ${item.name}`));
            reader.readAsDataURL(item.file);
          });

          const imgEl = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Corrupted image file: ${item.name}`));
            img.src = imgBytesUrl;
          });

          const tmpCanvas = document.createElement('canvas');
          tmpCanvas.width = imgEl.naturalWidth || imgEl.width;
          tmpCanvas.height = imgEl.naturalHeight || imgEl.height;
          const tctx = tmpCanvas.getContext('2d');
          tctx.fillStyle = '#ffffff';
          tctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
          tctx.drawImage(imgEl, 0, 0);

          const jpgDataUrl = tmpCanvas.toDataURL('image/jpeg', 0.9);
          const jpgBytes = Uint8Array.from(atob(jpgDataUrl.split(',')[1]), (c) => c.charCodeAt(0));
          const embedded = await outPdf.embedJpg(jpgBytes);

          // Fit image proportionally on A4 page (595.28 x 841.89 pt) with 24pt margin
          const a4W = 595.28;
          const a4H = 841.89;
          const maxW = a4W - 48;
          const maxH = a4H - 48;
          const scale = Math.min(maxW / embedded.width, maxH / embedded.height, 1);
          const drawW = embedded.width * scale;
          const drawH = embedded.height * scale;

          const page = outPdf.addPage([a4W, a4H]);
          page.drawImage(embedded, {
            x: (a4W - drawW) / 2,
            y: (a4H - drawH) / 2,
            width: drawW,
            height: drawH
          });
        }
      }

      const finalPdfBytes = await outPdf.save();
      const blob = new Blob([finalPdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      setMergedPdfUrl(blobUrl);
      setMergedInfo({
        pageCount: outPdf.getPageCount(),
        sizeKb: Math.max(1, Math.round(blob.size / 1024))
      });
      if (typeof notify === 'function') notify('🎉 அனைத்து ஆவணங்களும் உண்மையான PDF கோப்பாக இணைக்கப்பட்டன!');
    } catch (e) {
      setErrorMsg(formatPdfErrorMessage(e, true));
      if (typeof notify === 'function') notify('❌ ஆவணங்களை இணைப்பதில் பிழை ஏற்பட்டது.');
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdfUrl) return;
    const safeBase = outputName.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.pdf$/i, '') || 'akesevai_merged';
    const link = document.createElement('a');
    link.href = mergedPdfUrl;
    link.download = `${safeBase}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="document-pdf-merger-tool" className="pdf-merger-tool" style={{
      background: 'white',
      border: '1.5px solid #e2e8f0',
      borderRadius: '18px',
      overflow: 'hidden',
      marginTop: '28px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.06)'
    }}>
      <div style={{ background: 'linear-gradient(135deg, #022c7a 0%, #15803d 100%)', padding: '18px 24px' }}>
        <div style={{ color: '#86efac', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>OPERATOR INTERNAL PDF MERGER</div>
        <div style={{ color: 'white', fontSize: '19px', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginTop: '2px' }}>
          📑 Multi-Document Merger & Real PDF Combiner
        </div>
        <div style={{ color: '#bfdbfe', fontSize: '12px', marginTop: '3px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <span>பல PDF கோப்புகள் & படங்களை (ஆதார், ஸ்மார்ட் கார்டு, TC) உண்மையான PDF கோப்பாக பிரவுசரிலேயே இணைக்கும் கருவி.</span>
          <a href="/tools/pdf-merge" style={{ color: '#fde047', fontWeight: 800, textDecoration: 'underline', fontSize: '12px' }}>
            Open Public PDF Merge Tool ➔
          </a>
        </div>
      </div>

      <div style={{ padding: '22px 24px' }}>
        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '12.5px', fontWeight: 700 }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <label style={{
          border: '2px dashed #93c5fd',
          borderRadius: '14px',
          padding: '24px',
          textAlign: 'center',
          cursor: 'pointer',
          background: '#eff6ff',
          display: 'block',
          marginBottom: '18px'
        }}>
          <Combine size={32} color="#022c7a" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e40af' }}>ஆவணங்கள் (JPG / PNG / PDF) தேர்ந்தெடுக்க கிளிக் செய்க</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>ஒன்றிற்கும் மேற்பட்ட கோப்புகளை ஒரே நேரத்தில் தேர்ந்தெடுக்கலாம்</div>
          <input id="pdf-merger-file-input" name="pdf_merger_files" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleFileSelect} style={{ display: 'none' }} />
        </label>

        {files.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#374151', marginBottom: '8px' }}>
              📋 தேர்ந்தெடுக்கப்பட்ட ஆவணங்கள் ({files.length}):
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {files.map((item, index) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 14px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: '#022c7a', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'grid', placeItems: 'center', fontSize: '11px', fontWeight: 800 }}>{index + 1}</span>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748b' }}>{item.type.toUpperCase()} • {item.sizeKb} KB</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFile(item.id)} style={{ color: '#dc2626', background: 'none', border: 'none', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>✕</button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={handleMerge}
                disabled={processing}
                style={{
                  flex: 1, padding: '12px', background: 'linear-gradient(135deg, #022c7a 0%, #15803d 100%)',
                  color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800,
                  cursor: processing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {processing ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> இணைக்கப்படுகிறது...</> : <><Layers size={16} /> ஆவணங்களை PDF ஆக இணைக்குக (Merge to Real PDF)</>}
              </button>
            </div>
          </div>
        )}

        {mergedPdfUrl && mergedInfo && (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '18px', textAlign: 'center', marginTop: '16px' }}>
            <CheckCircle2 size={32} color="#16a34a" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803d' }}>
              ஆவணங்கள் வெற்றிகரமாக இணைக்கப்பட்டுவிட்டன! ({mergedInfo.pageCount} பக்கங்கள் • {mergedInfo.sizeKb} KB)
            </div>
            <div style={{ fontSize: '11px', color: '#166534', marginTop: '2px', marginBottom: '14px' }}>உண்மையான PDF ஆவணமாகப் பதிவிறக்கப்பட்டது (பிரவுசரிலேயே 100% உருவாக்கப்பட்டது).</div>
            <button
              type="button"
              onClick={handleDownload}
              style={{ padding: '12px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} /> PDF கோப்பைப் பதிவிறக்குக (Download Merged PDF)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
