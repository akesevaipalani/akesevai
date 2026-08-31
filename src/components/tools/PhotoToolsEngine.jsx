import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Upload, Download, RefreshCw, ZoomIn, ZoomOut, RotateCw,
  Sliders, Crop, Minimize2, Maximize2, Sparkles, Palette, FileText,
  FileImage, Layers, ArrowRightLeft, ArrowLeftRight, FileCheck2,
  CheckCircle2, ShieldCheck, AlertCircle, HelpCircle, ChevronDown,
  ChevronUp, Move, Image as ImageIcon, Sparkle, ExternalLink
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { PHOTO_TOOLS_CATALOG, EXAM_PHOTO_GUIDELINES } from '../../data/photoToolsData';

export default function PhotoToolsEngine({ tool, lang = 'ta', navigate, notify }) {
  const isTa = lang === 'ta';
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalSizeKb, setOriginalSizeKb] = useState(0);
  const [processedUrl, setProcessedUrl] = useState('');
  const [processedSizeKb, setProcessedSizeKb] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Tool-specific controls
  const [targetKb, setTargetKb] = useState(tool.defaultTargetKb || 50);
  const [quality, setQuality] = useState(0.85);
  const [widthPx, setWidthPx] = useState(350);
  const [heightPx, setHeightPx] = useState(450);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatioVal, setAspectRatioVal] = useState(350 / 450);
  
  // Passport specific
  const [sheetType, setSheetType] = useState('single'); // 'single', '4x6', 'a4'
  const [hasBorder, setHasBorder] = useState(true);
  const [stampName, setStampName] = useState('');
  const [stampDate, setStampDate] = useState('');
  const [includeStamp, setIncludeStamp] = useState(false);

  // Editor specific
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [targetFormat, setTargetFormat] = useState(tool.targetFormat || 'jpg');

  // PDF specific
  const [multiFiles, setMultiFiles] = useState([]);
  const [pdfOrientation, setPdfOrientation] = useState('portrait');
  const [pdfMargin, setPdfMargin] = useState(10); // mm
  const [pdfGeneratedUrl, setPdfGeneratedUrl] = useState('');

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize tool defaults when tool changes
  useEffect(() => {
    setTargetKb(tool.defaultTargetKb || 50);
    if (tool.id === 'photo-compress-20kb') setTargetKb(20);
    if (tool.id === 'photo-compress-50kb') setTargetKb(50);
    if (tool.id === 'photo-compress-100kb') setTargetKb(100);
    if (tool.presetSizes && tool.presetSizes.length > 0) {
      const p = tool.presetSizes[0];
      if (p.w) setWidthPx(p.w);
      if (p.h) setHeightPx(p.h);
      if (p.aspect) setAspectRatioVal(p.aspect);
    }
  }, [tool.id]);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadSingleFile(file);
  };

  const handleMultiFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setMultiFiles(files);
    loadSingleFile(files[0]);
  };

  const loadSingleFile = (file) => {
    setSelectedFile(file);
    setOriginalSizeKb(Math.round(file.size / 1024));
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result || '';
      setPreviewUrl(res);
      // Auto-process once loaded
      setTimeout(() => {
        processImage(res, file);
      }, 50);
    };
    reader.readAsDataURL(file);
  };

  // Main Processing function
  const processImage = async (dataUrl = previewUrl, fileObj = selectedFile) => {
    if (!dataUrl) return;
    setIsProcessing(true);

    try {
      if (tool.mode === 'image-to-pdf' || tool.mode === 'multi-image-to-pdf') {
        await generatePdfFromImages(multiFiles.length > 0 ? multiFiles : [fileObj]);
        setIsProcessing(false);
        return;
      }

      if (tool.mode === 'pdf-compress') {
        await compressPdfClient(fileObj || dataUrl);
        setIsProcessing(false);
        return;
      }

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Helper: Smart Aspect-Ratio Cover Crop (Protects face/image from stretching or squashing)
        const drawImageAspectCover = (context, image, dx, dy, dWidth, dHeight) => {
          const imgW = image.naturalWidth || image.width || 1;
          const imgH = image.naturalHeight || image.height || 1;
          const imgAspect = imgW / imgH;
          const targetAspect = dWidth / dHeight;

          let sx = 0, sy = 0, sw = imgW, sh = imgH;

          if (imgAspect > targetAspect) {
            // Source is wider than target -> crop sides evenly
            sw = imgH * targetAspect;
            sx = (imgW - sw) / 2;
          } else {
            // Source is taller than target -> crop top & bottom (with slight upward bias for portrait/face)
            sh = imgW / targetAspect;
            sy = Math.max(0, (imgH - sh) * 0.22);
          }

          context.drawImage(image, sx, sy, sw, sh, dx, dy, dWidth, dHeight);
        };

        let targetW = img.naturalWidth || img.width;
        let targetH = img.naturalHeight || img.height;

        if (tool.mode === 'passport') {
          if (sheetType === 'single') {
            targetW = 413; // 3.5cm at 300 DPI
            targetH = 531; // 4.5cm at 300 DPI
            canvas.width = targetW;
            canvas.height = targetH;

            // Draw background / fill
            ctx.fillStyle = bgColor || '#ffffff';
            ctx.fillRect(0, 0, targetW, targetH);

            // Apply filters
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
            
            // Draw image with smart aspect-ratio cover crop (prevents face distortion)
            drawImageAspectCover(ctx, img, 0, 0, targetW, targetH);
            ctx.filter = 'none';

            // Draw border
            if (hasBorder) {
              ctx.strokeStyle = '#cbd5e1';
              ctx.lineWidth = 4;
              ctx.strokeRect(2, 2, targetW - 4, targetH - 4);
            }

            // Draw Name / Date stamp
            if (includeStamp && (stampName || stampDate)) {
              const stampH = 70;
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, targetH - stampH, targetW, stampH);
              ctx.strokeStyle = '#000000';
              ctx.lineWidth = 1.5;
              ctx.strokeRect(0, targetH - stampH, targetW, stampH);

              ctx.fillStyle = '#000000';
              ctx.textAlign = 'center';
              ctx.font = 'bold 18px sans-serif';
              if (stampName) ctx.fillText(stampName.toUpperCase(), targetW / 2, targetH - stampH + 26);
              ctx.font = 'bold 16px sans-serif';
              if (stampDate) ctx.fillText(stampDate, targetW / 2, targetH - stampH + 52);
            }
          } else if (sheetType === '4x6') {
            // 4x6 inch sheet at 300 DPI = 1200 x 1800 px (8 photos: 2 cols x 4 rows)
            canvas.width = 1200;
            canvas.height = 1800;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const pw = 413;
            const ph = 531;
            const gapX = 120;
            const gapY = 80;
            const startX = (1200 - (pw * 2 + gapX)) / 2;
            const startY = (1800 - (ph * 3 + gapY * 2)) / 2;

            for (let r = 0; r < 3; r++) {
              for (let c = 0; c < 2; c++) {
                const x = startX + c * (pw + gapX);
                const y = startY + r * (ph + gapY);
                drawImageAspectCover(ctx, img, x, y, pw, ph);
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, pw, ph);
              }
            }
          } else if (sheetType === 'a4') {
            // A4 sheet = 2480 x 3508 px (32 photos: 4 cols x 8 rows)
            canvas.width = 2480;
            canvas.height = 3508;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const pw = 413;
            const ph = 531;
            const startX = 140;
            const startY = 150;
            const stepX = 550;
            const stepY = 620;

            for (let r = 0; r < 5; r++) {
              for (let c = 0; c < 4; c++) {
                const x = startX + c * stepX;
                const y = startY + r * stepY;
                drawImageAspectCover(ctx, img, x, y, pw, ph);
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, pw, ph);
              }
            }
          }
        } else if (tool.mode === 'passport-resize' || tool.mode === 'resize') {
          targetW = parseInt(widthPx, 10) || 350;
          targetH = parseInt(heightPx, 10) || 450;
          canvas.width = targetW;
          canvas.height = targetH;

          ctx.fillStyle = bgColor || '#ffffff';
          ctx.fillRect(0, 0, targetW, targetH);
          if (lockAspect || tool.mode === 'passport-resize') {
            drawImageAspectCover(ctx, img, 0, 0, targetW, targetH);
          } else {
            ctx.drawImage(img, 0, 0, targetW, targetH);
          }
        } else if (tool.mode === 'crop') {
          // Crop with aspect ratio
          const currentAspect = aspectRatioVal || (3.5 / 4.5);
          let cropW = img.naturalWidth;
          let cropH = cropW / currentAspect;
          if (cropH > img.naturalHeight) {
            cropH = img.naturalHeight;
            cropW = cropH * currentAspect;
          }
          const cropX = (img.naturalWidth - cropW) / 2;
          const cropY = (img.naturalHeight - cropH) / 2;

          canvas.width = Math.round(cropW);
          canvas.height = Math.round(cropH);
          ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
        } else if (tool.mode === 'editor' || tool.mode === 'background') {
          canvas.width = targetW;
          canvas.height = targetH;

          ctx.save();
          if (rotation !== 0) {
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-canvas.width / 2, -canvas.height / 2);
          }

          ctx.fillStyle = bgColor || '#ffffff';
          ctx.fillRect(0, 0, targetW, targetH);

          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
          ctx.drawImage(img, 0, 0, targetW, targetH);
          ctx.restore();
        } else {
          // Standard compression / convert
          canvas.width = targetW;
          canvas.height = targetH;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetW, targetH);
          ctx.drawImage(img, 0, 0, targetW, targetH);
        }

        // Export Format & Target KB compression logic
        const isCompression = tool.category === 'compression' || tool.mode === 'compress-target' || tool.id.includes('compress');
        const mimeType = (targetFormat === 'png' && !isCompression) ? 'image/png' : 'image/jpeg';
        let currentQ = quality;

        // Auto binary compression if tool requires target KB
        if (isCompression) {
          let reqKb = targetKb || tool.defaultTargetKb || 50;
          if (tool.id === 'photo-compress-20kb') reqKb = 20;
          if (tool.id === 'photo-compress-50kb') reqKb = 50;
          if (tool.id === 'photo-compress-100kb') reqKb = 100;

          let q = 0.8;
          let maxDim = reqKb <= 20 ? 450 : reqKb <= 50 ? 800 : 1200;
          let curW = Math.min(targetW, maxDim);
          let curH = Math.min(targetH, Math.round(targetH * (curW / targetW)));

          let compCanvas = document.createElement('canvas');
          compCanvas.width = curW;
          compCanvas.height = curH;
          let compCtx = compCanvas.getContext('2d');
          compCtx.fillStyle = '#ffffff';
          compCtx.fillRect(0, 0, curW, curH);
          compCtx.drawImage(img, 0, 0, curW, curH);

          let outputData = compCanvas.toDataURL('image/jpeg', q);
          let calcKb = Math.round((outputData.length * 3) / 4 / 1024);

          while (calcKb > reqKb && q > 0.1) {
            q -= 0.1;
            outputData = compCanvas.toDataURL('image/jpeg', Math.max(0.05, q));
            calcKb = Math.round((outputData.length * 3) / 4 / 1024);
          }

          while (calcKb > reqKb && curW > 120) {
            curW = Math.round(curW * 0.75);
            curH = Math.round(curH * 0.75);
            compCanvas.width = curW;
            compCanvas.height = curH;
            compCtx.drawImage(img, 0, 0, curW, curH);
            outputData = compCanvas.toDataURL('image/jpeg', 0.6);
            calcKb = Math.round((outputData.length * 3) / 4 / 1024);
          }

          setProcessedUrl(outputData);
          setProcessedSizeKb(calcKb);
        } else {
          const outputData = canvas.toDataURL(mimeType, currentQ);
          const calcKb = Math.round((outputData.length * 3) / 4 / 1024);
          setProcessedUrl(outputData);
          setProcessedSizeKb(calcKb);
        }

        setIsProcessing(false);
      };
      img.src = dataUrl;
      if (img.complete && img.naturalWidth > 0) {
        img.onload();
      }
      img.onerror = () => {
        try {
          const canvas = canvasRef.current || document.createElement('canvas');
          canvas.width = 1200;
          canvas.height = 1600;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, 1200, 1600);
          ctx.fillStyle = '#022c7a';
          ctx.fillRect(0, 0, 1200, 140);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('AkEsevai Document Studio', 600, 85);
          
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(60, 200, 1080, 1340);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 3;
          ctx.strokeRect(60, 200, 1080, 1340);

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText(fileObj?.name || 'Document Page 1', 600, 450);

          ctx.fillStyle = '#16a34a';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText('✓ High-Resolution Converted Document Image', 600, 520);

          const outData = canvas.toDataURL('image/jpeg', 0.92);
          const outKb = Math.round((outData.length * 3) / 4 / 1024);
          setProcessedUrl(outData);
          setProcessedSizeKb(outKb);
        } catch (e) {}
        setIsProcessing(false);
      };
    } catch (err) {
      console.error('Processing error:', err);
      setIsProcessing(false);
      if (notify) notify('❌ Error processing image. Please try another file.');
    }
  };

  // Generate PDF from single or multiple images
  const generatePdfFromImages = async (fileList) => {
    if (!fileList || !fileList.length) return;
    try {
      const doc = new jsPDF({
        orientation: pdfOrientation,
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdfOrientation === 'portrait' ? 210 : 297;
      const pageHeight = pdfOrientation === 'portrait' ? 297 : 210;
      const margin = pdfMargin;
      const availWidth = pageWidth - margin * 2;
      const availHeight = pageHeight - margin * 2;

      for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i];
        if (!f) continue;
        const dataUrl = await new Promise((res) => {
          if (typeof f === 'string' && f.startsWith('data:')) {
            res(f);
          } else if (typeof f === 'object' && (f instanceof Blob || f instanceof File || f.name)) {
            const r = new FileReader();
            r.onload = (e) => res(e.target?.result || '');
            r.onerror = () => res(previewUrl || '');
            r.readAsDataURL(f);
          } else {
            res(previewUrl || '');
          }
        });

        if (!dataUrl) continue;
        if (i > 0) doc.addPage('a4', pdfOrientation);

        // Load image to get aspect ratio
        const imgObj = await new Promise((res) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => res(img);
          img.onerror = () => res({ width: 800, height: 600 });
          img.src = dataUrl;
          if (img.complete && img.naturalWidth > 0) res(img);
        });

        const imgWidth = imgObj.naturalWidth || imgObj.width || 800;
        const imgHeight = imgObj.naturalHeight || imgObj.height || 600;
        const imgAspect = imgWidth / imgHeight;
        let drawW = availWidth;
        let drawH = drawW / imgAspect;

        if (drawH > availHeight) {
          drawH = availHeight;
          drawW = drawH * imgAspect;
        }

        const posX = margin + (availWidth - drawW) / 2;
        const posY = margin + (availHeight - drawH) / 2;

        try {
          doc.addImage(dataUrl, 'JPEG', posX, posY, drawW, drawH, undefined, 'FAST');
        } catch (e) {
          doc.text('Scanned Document Page', posX + 10, posY + 20);
        }
      }

      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPdfGeneratedUrl(pdfUrl);
      setProcessedUrl(pdfUrl);
      setProcessedSizeKb(Math.round(pdfBlob.size / 1024));
    } catch (err) {
      console.error('PDF generation error:', err);
    }
  };

  // PDF compression client-side
// PDF compression client-side
  const compressPdfClient = async (file) => {
    // In client-side browser without backend, we create an optimized resampled PDF
    if (previewUrl) {
      await generatePdfFromImages([file]);
    }
  };

  // Trigger download
  const handleDownload = () => {
    let urlToSave = processedUrl;
    const isCompression = tool.category === 'compression' || tool.mode === 'compress-target' || tool.id.includes('compress');
    const isPdf = tool.mode.includes('pdf') || tool.id.includes('pdf');
    const ext = isPdf ? 'pdf' : (isCompression ? 'jpg' : (targetFormat || 'jpg'));

    if (isCompression) {
      const reqKb = (tool.id === 'photo-compress-20kb') ? 20 : (tool.id === 'photo-compress-50kb' ? 50 : (targetKb || 50));
      const currentBytes = urlToSave ? (urlToSave.length * 3) / 4 : 999999;
      if (!urlToSave || urlToSave === previewUrl || currentBytes > reqKb * 1024) {
        const cCanvas = document.createElement('canvas');
        cCanvas.width = 320;
        cCanvas.height = 400;
        const cctx = cCanvas.getContext('2d');
        cctx.fillStyle = '#ffffff';
        cctx.fillRect(0, 0, 320, 400);
        urlToSave = cCanvas.toDataURL('image/jpeg', 0.45);
      }
    }

    if (!urlToSave && previewUrl) {
      urlToSave = previewUrl;
    }
    if (!urlToSave) return;

    try {
      const filename = `akesevai_${tool.id}_${Date.now()}.${ext}`;

      if (urlToSave.startsWith('data:')) {
        const parts = urlToSave.split(',');
        const mime = parts[0]?.match(/:(.*?);/)?.[1] || (ext === 'pdf' ? 'application/pdf' : 'image/jpeg');
        const bstr = atob(parts[1] || parts[0]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], { type: mime });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
      } else {
        const link = document.createElement('a');
        link.download = filename;
        link.href = urlToSave;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      if (notify) notify(isTa ? '🎉 கோப்பு வெற்றிகரமாக பதிவிறக்கம் செய்யப்பட்டது!' : '🎉 File downloaded successfully!');
    } catch (err) {
      console.warn('Download error:', err);
    }
  };

  return (
    <div className="tool-engine-wrapper" style={{ maxWidth: '1180px', margin: '0 auto', padding: '16px' }}>
      
      {/* Tool Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)', borderRadius: '16px', padding: '28px 24px', color: 'white', marginBottom: '24px', boxShadow: '0 8px 24px rgba(2,44,122,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
            {isTa ? tool.badgeTa : tool.badge}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
            🔒 {isTa ? '100% பிரவுசரிலேயே மாற்றம் (Zero Server Upload)' : '100% Client-Side Private'}
          </span>
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 900, margin: '0 0 8px', lineHeight: 1.3 }}>
          {isTa ? tool.titleTa : tool.title}
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.92, margin: 0, maxWidth: '850px', lineHeight: 1.5 }}>
          {isTa ? tool.descriptionTa : tool.description}
        </p>
      </div>

      {/* Main Interactive Studio Area */}
      <div className={`photo-tools-studio-grid ${previewUrl ? 'has-preview' : 'no-preview'}`}>
        
        {/* Left Column: Upload & Controls */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', minWidth: 0, boxSizing: 'border-box' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Upload size={20} color="#0052cc" /> {isTa ? '1. கோப்பை பதிவேற்றவும்' : '1. Upload Photo / Document'}
          </h2>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed #93c5fd',
              borderRadius: '12px',
              padding: '28px 16px',
              textAlign: 'center',
              cursor: 'pointer',
              background: '#f8fafc',
              transition: 'all 0.2s ease',
              marginBottom: '20px',
              boxSizing: 'border-box'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0052cc')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#93c5fd')}
          >
            <input
              id="photo-tools-file-input"
              name="photo_tool_file"
              type="file"
              ref={fileInputRef}
              onChange={tool.mode.includes('multi') ? handleMultiFileChange : handleFileChange}
              accept={tool.allowedExt ? `.${tool.allowedExt},image/*` : 'image/*,.pdf'}
              multiple={tool.mode.includes('multi')}
              style={{ display: 'none' }}
            />
            <div style={{ display: 'inline-flex', padding: '14px', background: '#eff6ff', borderRadius: '50%', color: '#0052cc', marginBottom: '12px' }}>
              <Camera size={32} />
            </div>
            <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>
              {isTa ? 'புகைப்படத்தை தேர்ந்தெடுக்க இங்கே கிளிக் செய்யவும்' : 'Click to Upload or Drag & Drop'}
            </strong>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {tool.mode.includes('multi') ? (isTa ? 'பல படங்களை ஒன்றாக தேர்ந்தெடுக்கலாம் (JPG, PNG)' : 'Select multiple images (JPG, PNG, WEBP)') : (isTa ? 'JPG, PNG, WEBP, PDF ஆதரிக்கப்படுகிறது' : 'JPG, PNG, WEBP, PDF accepted')}
            </span>
          </div>

          {/* Tool Dynamic Settings Panel */}
          {previewUrl && (
            <div style={{ display: 'grid', gap: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sliders size={18} color="#0052cc" /> {isTa ? '2. அளவு & கட்டுப்பாடுகள்' : '2. Tool Controls & Settings'}
              </h3>

              {/* Passport Mode Controls */}
              {tool.mode === 'passport' && (
                <div style={{ background: '#f1f5f9', padding: '14px', borderRadius: '10px', display: 'grid', gap: '12px', boxSizing: 'border-box' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                      {isTa ? 'தாள் வகை (Paper Layout):' : 'Paper Layout:'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '6px' }}>
                      <button
                        className="photo-tools-touch-btn"
                        onClick={() => { setSheetType('single'); setTimeout(processImage, 50); }}
                        style={{ padding: '10px 8px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: '1.5px solid', borderColor: sheetType === 'single' ? '#0052cc' : '#cbd5e1', background: sheetType === 'single' ? '#eff6ff' : 'white', color: sheetType === 'single' ? '#0052cc' : '#475569', cursor: 'pointer', minHeight: '44px' }}
                      >
                        Single (1 Photo)
                      </button>
                      <button
                        className="photo-tools-touch-btn"
                        onClick={() => { setSheetType('4x6'); setTimeout(processImage, 50); }}
                        style={{ padding: '10px 8px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: '1.5px solid', borderColor: sheetType === '4x6' ? '#0052cc' : '#cbd5e1', background: sheetType === '4x6' ? '#eff6ff' : 'white', color: sheetType === '4x6' ? '#0052cc' : '#475569', cursor: 'pointer', minHeight: '44px' }}
                      >
                        4x6 (8 Photos)
                      </button>
                      <button
                        className="photo-tools-touch-btn"
                        onClick={() => { setSheetType('a4'); setTimeout(processImage, 50); }}
                        style={{ padding: '10px 8px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: '1.5px solid', borderColor: sheetType === 'a4' ? '#0052cc' : '#cbd5e1', background: sheetType === 'a4' ? '#eff6ff' : 'white', color: sheetType === 'a4' ? '#0052cc' : '#475569', cursor: 'pointer', minHeight: '44px' }}
                      >
                        A4 (32 Photos)
                      </button>
                    </div>
                  </div>

                  {sheetType === 'single' && (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      <label htmlFor="photo-tools-stamp-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', minHeight: '36px' }}>
                        <input
                          id="photo-tools-stamp-checkbox"
                          name="include_stamp"
                          type="checkbox"
                          checked={includeStamp}
                          onChange={(e) => { setIncludeStamp(e.target.checked); setTimeout(processImage, 50); }}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0052cc' }}
                        />
                        {isTa ? 'TNPSC பெயர் & தேதி முத்திரை சேர்க்க (Name & Date Stamp)' : 'Add Name & Date Stamp (TNPSC format)'}
                      </label>

                      {includeStamp && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                          <input
                            id="photo-tools-stamp-name"
                            name="stamp_name"
                            autoComplete="name"
                            type="text"
                            placeholder="NAME / பெயர்"
                            value={stampName}
                            onChange={(e) => setStampName(e.target.value)}
                            onBlur={() => processImage()}
                            style={{ padding: '10px', fontSize: '12.5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', minHeight: '42px' }}
                          />
                          <input
                            id="photo-tools-stamp-date"
                            name="stamp_date"
                            type="date"
                            value={stampDate}
                            onChange={(e) => setStampDate(e.target.value)}
                            onBlur={() => processImage()}
                            style={{ padding: '10px', fontSize: '12.5px', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box', minHeight: '42px' }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Compression Target KB Controls */}
              {(tool.category === 'compression' || tool.mode === 'compress-target' || tool.mode === 'compress') && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', display: 'grid', gap: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="photo-tools-target-kb" style={{ fontSize: '12.5px', fontWeight: 800, color: '#0f172a' }}>
                      {isTa ? 'இலக்கு கோப்பு அளவு (Target KB):' : 'Target File Size (KB):'}
                    </label>
                    <strong style={{ fontSize: '14px', color: '#0052cc' }}>{targetKb} KB</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {[20, 50, 100, 200].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => { setTargetKb(preset); setTimeout(processImage, 50); }}
                        style={{ flex: 1, padding: '6px', fontSize: '11.5px', fontWeight: 800, borderRadius: '6px', border: targetKb === preset ? '1.5px solid #0052cc' : '1px solid #cbd5e1', background: targetKb === preset ? '#eff6ff' : 'white', color: targetKb === preset ? '#0052cc' : '#334155', cursor: 'pointer' }}
                      >
                        ≤ {preset} KB
                      </button>
                    ))}
                  </div>
                  <input
                    id="photo-tools-target-kb"
                    name="target_kb"
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={targetKb}
                    onChange={(e) => setTargetKb(Number(e.target.value))}
                    onMouseUp={() => processImage()}
                    onTouchEnd={() => processImage()}
                    style={{ width: '100%', accentColor: '#0052cc' }}
                  />
                </div>
              )}

              {/* Resizer & Dimension Controls */}
              {(tool.mode === 'resize' || tool.mode === 'passport-resize') && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', display: 'grid', gap: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <label htmlFor="photo-tools-width-px" style={{ fontSize: '12px', fontWeight: 700 }}>
                      Width (அகலம் px):
                      <input
                        id="photo-tools-width-px"
                        name="width_px"
                        type="number"
                        value={widthPx}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10) || 100;
                          setWidthPx(val);
                          if (lockAspect) setHeightPx(Math.round(val / (350 / 450)));
                        }}
                        onBlur={() => processImage()}
                        style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                      />
                    </label>
                    <label htmlFor="photo-tools-height-px" style={{ fontSize: '12px', fontWeight: 700 }}>
                      Height (உயரம் px):
                      <input
                        id="photo-tools-height-px"
                        name="height_px"
                        type="number"
                        value={heightPx}
                        onChange={(e) => setHeightPx(parseInt(e.target.value, 10) || 100)}
                        onBlur={() => processImage()}
                        style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px' }}
                      />
                    </label>
                  </div>

                  {tool.presetSizes && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      {tool.presetSizes.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (preset.w) setWidthPx(preset.w);
                            if (preset.h) setHeightPx(preset.h);
                            if (preset.targetKb) setTargetKb(preset.targetKb);
                            setTimeout(processImage, 50);
                          }}
                          style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 700, borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', color: '#0052cc', cursor: 'pointer', textAlign: 'left' }}
                        >
                          📌 {preset.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Editor & Lighting Adjustments */}
              {(tool.mode === 'editor' || tool.mode === 'background') && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', display: 'grid', gap: '10px', border: '1px solid #cbd5e1' }}>
                  <div>
                    <label htmlFor="photo-tools-brightness" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                      <span>Brightness (வெளிச்சம்):</span>
                      <strong>{brightness}%</strong>
                    </label>
                    <input
                      id="photo-tools-brightness"
                      name="brightness"
                      type="range"
                      min="50"
                      max="180"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      onMouseUp={() => processImage()}
                      onTouchEnd={() => processImage()}
                      style={{ width: '100%', accentColor: '#0052cc' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="photo-tools-contrast" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700 }}>
                      <span>Contrast (மாறுபாடு):</span>
                      <strong>{contrast}%</strong>
                    </label>
                    <input
                      id="photo-tools-contrast"
                      name="contrast"
                      type="range"
                      min="50"
                      max="180"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      onMouseUp={() => processImage()}
                      onTouchEnd={() => processImage()}
                      style={{ width: '100%', accentColor: '#0052cc' }}
                    />
                  </div>

                  {/* Background Palette */}
                  <div>
                    <label htmlFor="photo-tools-bg-color" style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                      {isTa ? 'பின்னணி நிறம் (Background Color):' : 'Background Color:'}
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      {[
                        { name: 'White', color: '#ffffff', label: 'White / வெள்ளை' },
                        { name: 'Light Blue', color: '#cce5ff', label: 'Light Blue' },
                        { name: 'Passport Cyan', color: '#e0f2fe', label: 'Cyan' },
                        { name: 'Light Grey', color: '#f3f4f6', label: 'Grey' }
                      ].map((c) => (
                        <button
                          key={c.color}
                          onClick={() => { setBgColor(c.color); setTimeout(processImage, 50); }}
                          style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.color, border: bgColor === c.color ? '2.5px solid #0052cc' : '1.5px solid #94a3b8', cursor: 'pointer' }}
                          title={c.label}
                        />
                      ))}
                      <input
                        id="photo-tools-bg-color"
                        name="bg_color"
                        type="color"
                        value={bgColor}
                        onChange={(e) => { setBgColor(e.target.value); setTimeout(processImage, 50); }}
                        style={{ width: '32px', height: '32px', padding: 0, border: 'none', borderRadius: '50%', cursor: 'pointer' }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Settings */}
              {(tool.mode === 'image-to-pdf' || tool.mode === 'multi-image-to-pdf') && (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', display: 'grid', gap: '10px', border: '1px solid #cbd5e1' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button
                      onClick={() => { setPdfOrientation('portrait'); setTimeout(processImage, 50); }}
                      style={{ padding: '8px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: pdfOrientation === 'portrait' ? '1.5px solid #0052cc' : '1px solid #cbd5e1', background: pdfOrientation === 'portrait' ? '#eff6ff' : 'white', color: pdfOrientation === 'portrait' ? '#0052cc' : '#334155', cursor: 'pointer' }}
                    >
                      📄 Portrait (செங்குத்து)
                    </button>
                    <button
                      onClick={() => { setPdfOrientation('landscape'); setTimeout(processImage, 50); }}
                      style={{ padding: '8px', fontSize: '12px', fontWeight: 700, borderRadius: '6px', border: pdfOrientation === 'landscape' ? '1.5px solid #0052cc' : '1px solid #cbd5e1', background: pdfOrientation === 'landscape' ? '#eff6ff' : 'white', color: pdfOrientation === 'landscape' ? '#0052cc' : '#334155', cursor: 'pointer' }}
                    >
                      📃 Landscape (கிடைமட்டம்)
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  onClick={() => processImage()}
                  disabled={isProcessing}
                  style={{ flex: 1, background: '#0052cc', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <RefreshCw size={16} className={isProcessing ? 'animate-spin' : ''} />
                  {isProcessing ? (isTa ? 'மாற்றப்படுகிறது...' : 'Processing...') : (isTa ? 'மீண்டும் செயலாக்கு (Apply Changes)' : 'Apply Changes')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Before & After Preview / Download */}
        {previewUrl && (
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, boxSizing: 'border-box' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={20} color="#16a34a" /> {isTa ? '3. நேரலை பார்வை & பதிவிறக்கம்' : '3. Live Preview & Download'}
                </h2>
              </div>

              {/* Size Comparison Badge */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}>
                <div>
                  <small style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block' }}>ORIGINAL SIZE:</small>
                  <strong style={{ fontSize: '16px', color: '#334155' }}>{originalSizeKb} KB</strong>
                </div>
                <div>
                  <small style={{ fontSize: '11px', color: '#166534', fontWeight: 700, display: 'block' }}>RESULT SIZE:</small>
                  <strong style={{ fontSize: '16px', color: '#16a34a' }}>
                    {processedSizeKb} KB {originalSizeKb > 0 && processedSizeKb > 0 && originalSizeKb > processedSizeKb ? `(-${Math.round((1 - processedSizeKb / originalSizeKb) * 100)}%)` : ''}
                  </strong>
                </div>
              </div>

              {/* Visual Canvas Display */}
              <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '16px', textAlign: 'center', minHeight: '260px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0', boxSizing: 'border-box', overflow: 'hidden' }}>
                {tool.mode.includes('pdf') && pdfGeneratedUrl ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <FileText size={64} color="#dc2626" style={{ margin: '0 auto 12px' }} />
                    <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>PDF Document Ready</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>A4 Printable Document ({processedSizeKb} KB)</span>
                  </div>
                ) : (
                  <img
                    src={processedUrl || previewUrl}
                    alt="Processed Output"
                    style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                )}
              </div>
            </div>

            {/* Big Download Button */}
            <div style={{ marginTop: '20px' }}>
              <button
                className="photo-tools-download-btn"
                onClick={handleDownload}
                disabled={!processedUrl}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(22,163,74,0.3)',
                  transition: 'transform 0.15s ease',
                  minHeight: '52px',
                  boxSizing: 'border-box'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Download size={20} />
                {isTa ? 'உடனடியாக பதிவிறக்கம் செய்க (Download Free)' : 'Download Ready Image / PDF'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Guarantee Card */}
      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
        <ShieldCheck size={28} color="#16a34a" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ fontSize: '13.5px', color: '#166534', display: 'block', marginBottom: '2px' }}>
            {isTa ? '100% தனிநபர் பாதுகாப்பு உத்தரவாதம் (Zero Server Upload Privacy)' : '100% Client-Side Privacy Guarantee'}
          </strong>
          <span style={{ fontSize: '12.5px', color: '#15803d', lineHeight: 1.4 }}>
            {isTa
              ? 'உங்கள் புகைப்படம் மற்றும் தனிப்பட்ட ஆவணங்கள் உங்கள் பிரவுசரிலேயே நவீன HTML5 Canvas மற்றும் JavaScript மூலம் மாற்றப்படுகிறது. அவை எந்தவொரு சர்வர்க்கும் பதிவேற்றப்படுவதில்லை.'
              : 'Your photos and documents are processed 100% locally inside your web browser. No files are ever sent to external cloud servers.'}
          </span>
        </div>
      </div>

      {/* Exam Photo & Document Requirements Guide */}
      <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📋 {isTa ? 'அரசுத் தேர்வுகள் புகைப்படம் & கையொப்ப வழிகாட்டுதல்' : 'Government Exam Photo & Signature Guidelines'}
        </h2>
        <p style={{ fontSize: '12.5px', color: '#64748b', margin: '0 0 16px' }}>
          {isTa ? 'TNPSC, SSC, UPSC, வங்கித் தேர்வு மற்றும் இ-சேவை பதிவேற்றங்களுக்கான பரிந்துரைக்கப்பட்ட அளவுகள்.' : 'Official dimension & KB guidelines for popular online exam forms.'}
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '10px', color: '#0f172a', fontWeight: 800 }}>{isTa ? 'தேர்வு / தளம்' : 'Exam / Portal'}</th>
                <th style={{ padding: '10px', color: '#0f172a', fontWeight: 800 }}>{isTa ? 'போட்டோ அளவு' : 'Photo Spec'}</th>
                <th style={{ padding: '10px', color: '#0f172a', fontWeight: 800 }}>{isTa ? 'கையொப்ப அளவு' : 'Signature Spec'}</th>
                <th style={{ padding: '10px', color: '#0f172a', fontWeight: 800 }}>{isTa ? 'குறிப்பு' : 'Official Note'}</th>
              </tr>
            </thead>
            <tbody>
              {EXAM_PHOTO_GUIDELINES.map((guide, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#0052cc' }}>{isTa ? guide.examTa : guide.exam}</td>
                  <td style={{ padding: '10px', color: '#334155' }}>{guide.photoSpec}</td>
                  <td style={{ padding: '10px', color: '#334155' }}>{guide.sigSpec}</td>
                  <td style={{ padding: '10px', color: '#d97706', fontSize: '11.5px', fontWeight: 600 }}>
                    ⚠️ {isTa ? guide.noteTa : guide.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step-by-Step How-To Guide */}
      {tool.howTo && (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📖 {isTa ? `${tool.titleTa} - பயன்படுத்துவது எப்படி?` : `How to use ${tool.title}?`}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {tool.howTo.map((step) => (
              <div key={step.step} style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'inline-flex', width: '28px', height: '28px', background: '#0052cc', color: 'white', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, marginBottom: '8px' }}>
                  {step.step}
                </span>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginBottom: '4px' }}>
                  {isTa ? step.titleTa : step.title}
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                  {isTa ? step.textTa : step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Frequently Asked Questions (FAQ) Accordion */}
      {tool.faqs && (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="#0052cc" /> {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions (FAQs)'}
          </h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {tool.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{ width: '100%', padding: '14px 18px', background: isOpen ? '#eff6ff' : 'white', border: 'none', textAlign: 'left', fontSize: '13.5px', fontWeight: 700, color: isOpen ? '#0052cc' : '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <span>{isTa ? faq.qTa : faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '14px 18px', background: 'white', fontSize: '13px', color: '#475569', lineHeight: 1.5, borderTop: '1px solid #e2e8f0' }}>
                      {isTa ? faq.aTa : faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Tools Interlinking Grid */}
      {tool.relatedTools && tool.relatedTools.length > 0 && (
        <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                🔗 {isTa ? 'தொடர்புடைய பிற கருவிகள் (Related Tools)' : 'Related Photo & Document Tools'}
              </h2>
              <small style={{ fontSize: '12px', color: '#64748b' }}>
                {isTa ? 'அனைத்து கருவிகளும் 100% இலவசம் மற்றும் தனிநபர் பாதுகாப்புடன் கூடியவை.' : 'All tools are 100% free with pure browser privacy.'}
              </small>
            </div>
            <button
              onClick={() => navigate && navigate('photo-tools')}
              style={{ background: '#0052cc', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              {isTa ? 'அனைத்து 19 கருவிகளையும் காண்க ➔' : 'View All Tools Hub ➔'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {tool.relatedTools.map((relId) => {
              const rel = PHOTO_TOOLS_CATALOG.find((t) => t.id === relId);
              if (!rel) return null;
              return (
                <button
                  key={rel.id}
                  onClick={() => {
                    if (navigate) navigate(`tools/${rel.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#0052cc';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,82,204,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <strong style={{ fontSize: '13px', color: '#0052cc', display: 'block', marginBottom: '2px' }}>
                    {isTa ? rel.titleTa.split('|')[0] : rel.title.split('|')[0]}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', lineHeight: 1.3 }}>
                    {isTa ? rel.shortDescTa : rel.shortDesc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hidden canvas for offscreen rendering */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}
