import React, { useState, useRef } from 'react';
import { Upload, ImagePlus, Download, RefreshCw } from 'lucide-react';
import { validatePhotoUpload } from '../utils/documentHelper';
import { replaceCornerBackgroundColor } from '../utils/imageToolsHelper';

const BG_COLORS = [
  { label: '⬜ வெள்ளை (White)', value: '#FFFFFF', style: { background: '#FFFFFF', border: '1.5px solid #e2e8f0' } },
  { label: '🟦 நீலம் (Blue)', value: '#4169E1', style: { background: '#4169E1' } },
  { label: '🔴 சிவப்பு (Red)', value: '#CC0000', style: { background: '#CC0000' } },
  { label: '🟩 பச்சை (Green)', value: '#008000', style: { background: '#008000' } },
  { label: '🟨 மஞ்சள் (Yellow)', value: '#FFD700', style: { background: '#FFD700', border: '1.5px solid #d1d5db' } },
  { label: '⬛ கருப்பு (Black)', value: '#000000', style: { background: '#000000' } },
  { label: '🎨 வெளிர் நீலம் (Sky Blue)', value: '#87CEEB', style: { background: '#87CEEB' } },
  { label: '🟫 சாம்பல் (Gray)', value: '#808080', style: { background: '#808080' } },
];

export default function PhotoBackgroundRemover() {
  const [original, setOriginal] = useState(null);
  const [result, setResult] = useState(null);
  const [selectedBg, setSelectedBg] = useState('#FFFFFF');
  const [tolerance, setTolerance] = useState(60);
  const [processing, setProcessing] = useState(false);
  const fileRef = useRef();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validatePhotoUpload(file, 1);
    if (!validation.valid) {
      alert(validation.error);
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => { setOriginal(ev.target.result); setResult(null); };
    reader.readAsDataURL(file);
  };

  const handleProcess = () => {
    if (!original) return;
    setProcessing(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const { canvas: finalCanvas } = replaceCornerBackgroundColor(canvas, selectedBg, tolerance);
      setResult(finalCanvas.toDataURL('image/jpeg', 0.92));
      setProcessing(false);
    };
    img.onerror = () => {
      setProcessing(false);
    };
    img.src = original;
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result;
    a.download = 'akesevai_photo.jpg';
    a.click();
  };

  return (
    <div style={{
      background: 'white',
      border: '1.5px solid #e2e8f0',
      borderRadius: '18px',
      overflow: 'hidden',
      marginTop: '28px',
      boxShadow: '0 6px 24px rgba(0,0,0,0.06)'
    }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)', padding: '18px 24px' }}>
        <div style={{ color: '#ddd6fe', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>PHOTO TOOL</div>
        <div style={{ color: 'white', fontSize: '19px', fontWeight: 800, fontFamily: 'Manrope, sans-serif', marginTop: '2px' }}>
          📸 Photo Background Colour Changer
        </div>
        <div style={{ color: '#ddd6fe', fontSize: '12px', marginTop: '3px' }}>
          ஆதார் / பாஸ்போர்ட் புகைப்படம் — பின்னணி நிறத்தை உடனே மாற்றுங்கள்!
        </div>
      </div>

      <div style={{ padding: '22px 24px' }}>
        {/* Upload */}
        <input id="photo-bg-file-input" name="photo_bg_file" type="file" accept="image/jpeg,.jpg,.jpeg" ref={fileRef} onChange={handleUpload} style={{ display: 'none' }} />
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: '2px dashed #c4b5fd',
            borderRadius: '14px',
            padding: '28px',
            textAlign: 'center',
            cursor: 'pointer',
            background: '#faf5ff',
            marginBottom: '18px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f3e8ff'}
          onMouseLeave={e => e.currentTarget.style.background = '#faf5ff'}
        >
          <Upload size={28} color="#7c3aed" style={{ margin: '0 auto 8px' }} />
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#4c1d95' }}>புகைப்படம் தேர்ந்தெடுக்க இங்கே click பண்ணுங்கள்</div>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>JPG / JPEG வடிவம் மட்டுமே (Max 1 MB)</div>
        </div>

        {original && (
          <>
            {/* Bg color selector */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '8px' }}>🎨 பின்னணி நிறம் தேர்ந்தெடுக்கவும்:</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {BG_COLORS.map(bg => (
                  <button
                    key={bg.value}
                    onClick={() => setSelectedBg(bg.value)}
                    title={bg.label}
                    style={{
                      width: 34, height: 34, borderRadius: '8px', cursor: 'pointer',
                      outline: selectedBg === bg.value ? `3px solid #7c3aed` : 'none',
                      outlineOffset: '2px',
                      transition: 'all 0.15s ease',
                      ...bg.style
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '6px' }}>
                தேர்ந்தெடுத்த நிறம்: <strong>{BG_COLORS.find(b => b.value === selectedBg)?.label}</strong>
              </div>
            </div>

            {/* Tolerance */}
            <div style={{ marginBottom: '18px' }}>
              <label htmlFor="photo-bg-tolerance-range" style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                🎯 sensitivity: {tolerance} (குறைவு = precise, அதிகம் = broad)
              </label>
              <input
                id="photo-bg-tolerance-range"
                name="tolerance_range"
                type="range"
                min={20}
                max={130}
                value={tolerance}
                onChange={e => setTolerance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#7c3aed' }}
              />
            </div>

            {/* Preview row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>📷 அசல் (Original)</div>
                <img src={original} alt="original" style={{ width: '100%', height: '160px', objectFit: 'contain', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }} />
              </div>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>✨ மாற்றம் (Result)</div>
                {result
                  ? <img src={result} alt="result" style={{ width: '100%', height: '160px', objectFit: 'contain', background: selectedBg, borderRadius: '10px', border: '1px solid #e2e8f0' }} />
                  : <div style={{ height: '160px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>Process பண்ணவும்</div>
                }
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleProcess}
                disabled={processing}
                style={{
                  flex: 1, padding: '12px', background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
                  color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800,
                  cursor: processing ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: processing ? 0.7 : 1
                }}
              >
                {processing ? <><RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <><ImagePlus size={15} /> Background மாற்றுக</>}
              </button>
              {result && (
                <button
                  onClick={handleDownload}
                  style={{
                    padding: '12px 18px', background: '#16a34a', color: 'white', border: 'none',
                    borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <Download size={15} /> Save
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
