import React, { useState, useRef } from 'react';
import { Upload, ImagePlus, Download, RefreshCw } from 'lucide-react';
import { validatePhotoUpload } from '../utils/documentHelper';

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

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

// Simple background removal using flood fill from corners/edges
function removeBackground(canvas, ctx, bgColor, tolerance) {
  const { r: br, g: bg, b: bb } = hexToRgb(bgColor);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const w = canvas.width;
  const h = canvas.height;
  const visited = new Uint8Array(w * h);
  const queue = [];

  // Seed from all 4 corners and edges
  const seeds = [];
  for (let x = 0; x < w; x++) { seeds.push([x, 0]); seeds.push([x, h - 1]); }
  for (let y = 0; y < h; y++) { seeds.push([0, y]); seeds.push([w - 1, y]); }

  seeds.forEach(([x, y]) => {
    const idx = (y * w + x);
    if (!visited[idx]) {
      const pi = idx * 4;
      const dist = colorDistance(data[pi], data[pi + 1], data[pi + 2], br, bg, bb);
      if (dist < tolerance) { queue.push([x, y]); visited[idx] = 1; }
    }
  });

  // BFS flood fill
  while (queue.length > 0) {
    const [cx, cy] = queue.pop();
    const pi = (cy * w + cx) * 4;
    data[pi + 3] = 0; // Make transparent
    const neighbors = [[cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
        const ni = ny * w + nx;
        if (!visited[ni]) {
          const npi = ni * 4;
          const dist = colorDistance(data[npi], data[npi + 1], data[npi + 2], br, bg, bb);
          if (dist < tolerance) { visited[ni] = 1; queue.push([nx, ny]); }
        }
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

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
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      removeBackground(canvas, ctx, selectedBg, tolerance);

      // Now draw on new bg color
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = img.width;
      finalCanvas.height = img.height;
      const fctx = finalCanvas.getContext('2d');
      // Fill with chosen bg
      fctx.fillStyle = selectedBg;
      fctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      fctx.drawImage(canvas, 0, 0);
      setResult(finalCanvas.toDataURL('image/jpeg', 0.92));
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
        <input type="file" accept="image/jpeg,.jpg,.jpeg" ref={fileRef} onChange={handleUpload} style={{ display: 'none' }} />
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
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
                🎯 sensitivity: {tolerance} (குறைவு = precise, அதிகம் = broad)
              </div>
              <input type="range" min={20} max={130} value={tolerance} onChange={e => setTolerance(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#7c3aed' }} />
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
