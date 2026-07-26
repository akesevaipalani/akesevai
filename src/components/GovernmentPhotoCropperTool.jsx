import React, { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Crop, Download, RefreshCw, Sparkles, CheckCircle2, ShieldCheck, FileText, AlertCircle } from 'lucide-react';

const PRESETS = [
  {
    id: 'tn-esevai-photo',
    name: 'TN e-Sevai Photo (பட்டா/சான்றிதழ்)',
    width: 200,
    height: 230,
    maxKb: 50,
    description: 'அரசு இ-சேவை சான்றிதழ்கள், ஆதார் மற்றும் குடும்ப அட்டைக்கு ஏற்றது'
  },
  {
    id: 'tn-esevai-sig',
    name: 'TN e-Sevai Signature (கையொப்பம்)',
    width: 200,
    height: 100,
    maxKb: 20,
    description: 'இ-சேவை கையொப்பப் படம் (வெள்ளை பின்னணியில் நீல/கருப்பு மை)'
  },
  {
    id: 'tnpsc-photo',
    name: 'TNPSC தேர்வு பாஸ்போர்ட் போட்டோ (பெயர் & தேதியுடன்)',
    width: 350,
    height: 450,
    maxKb: 50,
    hasNameStamp: true,
    description: 'TNPSC குரூப் தேர்வுகள் & போட்டித் தேர்வுகளுக்கான பெயர் & தேதி முத்திரை போட்டோ'
  },
  {
    id: 'passport-std',
    name: 'Standard Passport Photo (3.5cm x 4.5cm)',
    width: 350,
    height: 450,
    maxKb: 100,
    description: 'பாஸ்போர்ட், லைசென்ஸ் & கல்லூரி விண்ணப்பங்களுக்கு'
  }
];

export default function GovernmentPhotoCropperTool() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [imageSrc, setImageSrc] = useState(null);
  const [candidateName, setCandidateName] = useState('');
  const [photoDate, setPhotoDate] = useState(new Date().toISOString().split('T')[0]);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [fileKbSize, setFileKbSize] = useState(0);
  const canvasRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setImageSrc(ev.target.result);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = selectedPreset.width;
      canvas.height = selectedPreset.height;
      const ctx = canvas.getContext('2d');

      // Clear background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render photo centered with zoom & offsets
      const destW = img.width * zoom;
      const destH = img.height * zoom;
      const destX = (canvas.width - destW) / 2 + offsetX;
      const destY = (canvas.height - destH) / 2 + offsetY;

      ctx.drawImage(img, destX, destY, destW, destH);

      // Add Name & Date overlay stamp if applicable (TNPSC spec)
      if (selectedPreset.hasNameStamp) {
        const stampHeight = 65;
        const stampY = canvas.height - stampHeight;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, stampY, canvas.width, stampHeight);
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, stampY, canvas.width, stampHeight);

        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px sans-serif';
        const displayName = candidateName.trim() || 'NAME HERE';
        ctx.fillText(displayName.toUpperCase(), canvas.width / 2, stampY + 25);

        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`DATE: ${photoDate}`, canvas.width / 2, stampY + 50);
      }

      // Compression loop to stay under maxKb
      let quality = 0.95;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      let kb = Math.round((dataUrl.length * 3) / 4 / 1024);

      while (kb > selectedPreset.maxKb && quality > 0.1) {
        quality -= 0.05;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        kb = Math.round((dataUrl.length * 3) / 4 / 1024);
      }

      setProcessedUrl(dataUrl);
      setFileKbSize(kb);
    };
    img.src = imageSrc;
  }, [imageSrc, selectedPreset, candidateName, photoDate, zoom, offsetX, offsetY]);

  return (
    <div style={{
      background: 'white',
      border: '2px solid #0052cc',
      borderRadius: '20px',
      padding: '24px',
      margin: '24px 0',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
    }}>
      {/* HEADER */}
      <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
        <span style={{
          background: '#eff6ff',
          color: '#0052cc',
          border: '1px solid #bfdbfe',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '11px',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <Crop size={14} /> GOVERNMENT SPEC PHOTO & SIGNATURE CROPPER
        </span>
        <h3 style={{ font: '800 22px Manrope', color: '#022c7a', margin: '6px 0 0' }}>
          அரசு விண்ணப்ப பாஸ்போர்ட் போட்டோ <span>& கையொப்ப அளவு மாற்றி</span>
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
          TN e-Sevai, TNPSC, ஆதார் மற்றும் பாஸ்போர்ட் அளவுகளுக்கு போட்டோவை சரியான pixel மற்றும் KB அளவில் மாற்றலாம்.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* LEFT COLUMN: OPTIONS & INPUTS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
              1. அரசு போர்ட்டல் அளவை தேர்வு செய்க (Select Portal Spec):
            </label>
            <div style={{ display: 'grid', gap: '8px' }}>
              {PRESETS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPreset(p)}
                  style={{
                    border: selectedPreset.id === p.id ? '2px solid #0052cc' : '1px solid #cbd5e1',
                    background: selectedPreset.id === p.id ? '#f0f7ff' : '#f8fafc',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '13px', color: selectedPreset.id === p.id ? '#0052cc' : '#334155' }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    📐 {p.width}x{p.height} px • 💾 Max Limit: {p.maxKb} KB • {p.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* UPLOAD FILE */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b', display: 'block', marginBottom: '6px' }}>
              2. போட்டோ அல்லது கையொப்பத்தைப் பதிவேற்றவும்:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px dashed #0052cc',
                borderRadius: '10px',
                background: '#f8fafc',
                cursor: 'pointer'
              }}
            />
          </div>

          {/* IF TNPSC SPEC, NAME & DATE OVERLAY INPUTS */}
          {selectedPreset.hasNameStamp && (
            <div style={{ background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: '12px', padding: '14px', display: 'grid', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#d48806', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={14} /> TNPSC போட்டோ பெயர் & தேதி முத்திரை:
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#434343' }}>விண்ணப்பதாரர் பெயர் (Candidate Name):</label>
                <input
                  type="text"
                  placeholder="எ.கா: K. RAMESH"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #d9d9d9', marginTop: '3px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#434343' }}>போட்டோ எடுத்த தேதி (Photo Taken Date):</label>
                <input
                  type="date"
                  value={photoDate}
                  onChange={(e) => setPhotoDate(e.target.value)}
                  style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #d9d9d9', marginTop: '3px' }}
                />
              </div>
            </div>
          )}

          {/* ZOOM & POSITION CONTROLS */}
          {imageSrc && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px', display: 'grid', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                🔍 போட்டோவை பெரிதாக்கு / நகர்த்து (Zoom & Position):
              </div>
              <label style={{ fontSize: '11px', color: '#64748b' }}>
                Zoom: {zoom.toFixed(1)}x
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <label style={{ fontSize: '11px', color: '#64748b' }}>
                  இடப்பக்கம் / வலப்பக்கம் (Offset X):
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    value={offsetX}
                    onChange={(e) => setOffsetX(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>
                <label style={{ fontSize: '11px', color: '#64748b' }}>
                  மேலே / கீழே (Offset Y):
                  <input
                    type="range"
                    min="-150"
                    max="150"
                    value={offsetY}
                    onChange={(e) => setOffsetY(parseInt(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PREVIEW & DOWNLOAD */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <h4 style={{ font: '800 15px Manrope', color: '#0f172a', margin: '0 0 14px' }}>
            🖼️ நேரடி முன்னோட்டம் (Live Preview)
          </h4>

          {processedUrl ? (
            <div>
              <div style={{
                background: 'white',
                padding: '8px',
                borderRadius: '10px',
                border: '2px solid #0052cc',
                display: 'inline-block',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
              }}>
                <img
                  src={processedUrl}
                  alt="Processed Spec"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '260px',
                    display: 'block',
                    borderRadius: '4px'
                  }}
                />
              </div>

              <canvas ref={canvasRef} style={{ display: 'none' }} />

              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: fileKbSize <= selectedPreset.maxKb ? '#16a34a' : '#dc2626',
                  background: fileKbSize <= selectedPreset.maxKb ? '#f0fdf4' : '#fef2f2',
                  border: `1px solid ${fileKbSize <= selectedPreset.maxKb ? '#bbf7d0' : '#fecaca'}`,
                  padding: '6px 14px',
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {fileKbSize <= selectedPreset.maxKb ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  கோப்பு அளவு (File Size): {fileKbSize} KB / (Max Limit: {selectedPreset.maxKb} KB)
                </div>

                <a
                  href={processedUrl}
                  download={`${selectedPreset.id}-${Date.now()}.jpg`}
                  style={{
                    background: '#16a34a',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '14px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                    marginTop: '8px'
                  }}
                >
                  <Download size={18} /> பதிவிறக்கு (Download Compliant JPEG)
                </a>
              </div>
            </div>
          ) : (
            <div style={{ color: '#94a3b8', padding: '40px 10px' }}>
              <ImageIcon size={48} style={{ opacity: 0.4, marginBottom: '10px' }} />
              <p style={{ fontSize: '13px', margin: 0 }}>
                போட்டோவை பதிவேற்றியவுடன் இங்கு முன்னோட்டம் தோன்றும்.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
