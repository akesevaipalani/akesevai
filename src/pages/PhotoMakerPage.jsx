import React, { useState, useEffect, useRef, useCallback } from 'react';
import { jsPDF } from 'jspdf';
import {
  Camera, Download, Printer, Crop, Sparkles, SlidersHorizontal,
  RefreshCw, Trash2, Check, Copy, ExternalLink, Image as ImageIcon,
  ZoomIn, Sun, Contrast, FileText, CheckCircle2, ShieldCheck,
  AlertCircle, X, HelpCircle, ArrowRight, Wand2, Type
} from 'lucide-react';

export const pageMeta = { id: 'photo-maker', title: 'Passport Photo Maker & Studio' };

const PHOTO_WIDTH_PX = 413;  // 3.5 cm @ 300 DPI
const PHOTO_HEIGHT_PX = 531; // 4.5 cm @ 300 DPI

function mmToPx(mm) {
  return Math.round((mm / 25.4) * 300);
}

const GEMINI_PASSPORT_PROMPT = `Act as a professional photo studio AI editor.

Important:
Do NOT change the face identity.
Do NOT modify facial structure.
Preserve 100% original biometric details.
Only enhance the image, do not recreate or generate a new face.

Tasks:
1. Remove background.
2. Change background colour light blue.
3. Improve lighting and exposure.
4. Increase sharpness and clarity.
5. Remove blur and noise.
6. Enhance naturally without over smoothing.
7. Maintain skin texture.
8. Convert to HD quality.
9. Make it passport and visa ready.

If the image is damaged:
Restore carefully without altering the face.

If black and white:
Colourize naturally but preserve identity.

Final result must be:
Original, natural, and biometric safe.`;

export default function PhotoMakerPage({ notify, lang = 'ta' }) {
  const currentLang = typeof lang === 'string' && lang ? lang : 'ta';
  const isTa = currentLang === 'ta';

  // --- Photo State ---
  const [photoSrc, setPhotoSrc] = useState(null);
  const [paper, setPaper] = useState('maxi'); // 'maxi' (4x6) | 'a4' | 'single'
  const [copies, setCopies] = useState('8');   // '4' | '6' | '8' | '16' | '30' | '35' | '40'
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  // --- Margins & Gaps (in mm) ---
  const [marginTop, setMarginTop] = useState(5);
  const [marginBottom, setMarginBottom] = useState(5);
  const [marginLeft, setMarginLeft] = useState(5);
  const [marginRight, setMarginRight] = useState(5);
  const [gapHorizontal, setGapHorizontal] = useState(2.5);
  const [gapVertical, setGapVertical] = useState(2.5);

  // --- Border State ---
  const [enableBorder, setEnableBorder] = useState(true);
  const [borderColor, setBorderColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState(2);

  // --- Text Stamp State ---
  const [enableText, setEnableText] = useState(false);
  const [nameText, setNameText] = useState('');
  const [dateText, setDateText] = useState(new Date().toLocaleDateString('en-GB').replace(/\//g, '-'));
  const [fontSize, setFontSize] = useState(14);
  const [fontWeight, setFontWeight] = useState('bold');

  // --- Crop Mode State ---
  const [isCropMode, setIsCropMode] = useState(false);
  const [cropBox, setCropBox] = useState(null); // { x, y, w, h }
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // --- Signature Editor State ---
  const [sigSrc, setSigSrc] = useState(null);
  const [showSigModal, setShowSigModal] = useState(false);
  const [sigUnit, setSigUnit] = useState('cm'); // 'cm' | 'px' | 'in'
  const [sigWidth, setSigWidth] = useState(3.0);
  const [sigHeight, setSigHeight] = useState(1.2);
  const [sigDpi, setSigDpi] = useState(300);
  const [sigQuality, setSigQuality] = useState(0.9);
  const [sigCropBox, setSigCropBox] = useState(null);
  const [sigFileSizeKb, setSigFileSizeKb] = useState(0);

  // --- Modal States ---
  const [showGeminiModal, setShowGeminiModal] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);

  // --- Canvas Refs ---
  const sheetCanvasRef = useRef(null);
  const cropCanvasRef = useRef(null);
  const sigCanvasRef = useRef(null);
  const sigEditCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const sigFileInputRef = useRef(null);

  // Handle Paper change auto-select appropriate copies
  const handlePaperChange = (newPaper) => {
    setPaper(newPaper);
    if (newPaper === 'maxi') {
      setCopies('8');
    } else if (newPaper === 'a4') {
      setCopies('30');
    } else {
      setCopies('1');
    }
  };

  // --- Upload Photo ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = (file.type && file.type.startsWith('image/')) || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(file.name || '');
    if (!isImg) {
      if (notify) notify('Please upload a valid image file (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target.result;
      setPhotoSrc(url);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      setBrightness(100);
      setContrast(100);
      if (notify) notify(isTa ? 'புகைப்படம் வெற்றிகரமாக ஏற்றப்பட்டது.' : 'Photo uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  // --- Upload Signature ---
  const handleSigUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target.result;
      setSigSrc(url);
      if (notify) notify(isTa ? 'கையொப்பம் ஏற்றப்பட்டது. Edit & Crop செய்யலாம்.' : 'Signature loaded. You can now edit and crop.');
    };
    reader.readAsDataURL(file);
  };

  // --- Render Sheet on Canvas ---
  const renderSheet = useCallback(() => {
    const canvas = sheetCanvasRef.current;
    if (!canvas || !photoSrc) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoSrc;

    img.onload = () => {
      let pageW, pageH, cols, rows;

      if (paper === 'maxi') {
        pageW = 1800; // 6 inches @ 300 DPI
        pageH = 1200; // 4 inches @ 300 DPI
        if (copies === '4') { cols = 2; rows = 2; }
        else if (copies === '6') { cols = 3; rows = 2; }
        else { cols = 4; rows = 2; } // 8 copies
      } else if (paper === 'a4') {
        pageW = 2480; // A4 Width @ 300 DPI
        pageH = 3508; // A4 Height @ 300 DPI
        if (copies === '16') { cols = 4; rows = 4; }
        else if (copies === '30') { cols = 5; rows = 6; }
        else if (copies === '35') { cols = 5; rows = 7; }
        else { cols = 5; rows = 8; } // 40 copies
      } else {
        // Single photo
        pageW = PHOTO_WIDTH_PX;
        pageH = PHOTO_HEIGHT_PX;
        cols = 1;
        rows = 1;
      }

      canvas.width = pageW;
      canvas.height = pageH;

      // Fill Sheet Background (White)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, pageW, pageH);

      const photoW = PHOTO_WIDTH_PX;
      const photoH = PHOTO_HEIGHT_PX;

      const mt = paper === 'single' ? 0 : mmToPx(marginTop);
      const ml = paper === 'single' ? 0 : mmToPx(marginLeft);
      const gh = paper === 'single' ? 0 : mmToPx(gapHorizontal);
      const gv = paper === 'single' ? 0 : mmToPx(gapVertical);

      // Render each photo cell
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = ml + c * (photoW + gh);
          const y = mt + r * (photoH + gv);

          if (x + photoW > pageW || y + photoH > pageH) continue;

          ctx.save();

          // Clip to photo box
          ctx.beginPath();
          ctx.rect(x, y, photoW, photoH);
          ctx.clip();

          // Fill Cell Background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y, photoW, photoH);

          // Apply filters
          ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;

          // Calculate Image Draw Coordinates with Zoom and Offsets
          const aspect = img.width / img.height;
          const targetAspect = photoW / photoH;
          let drawW, drawH;

          if (aspect > targetAspect) {
            drawH = photoH * zoom;
            drawW = drawH * aspect;
          } else {
            drawW = photoW * zoom;
            drawH = drawW / aspect;
          }

          const drawX = x + (photoW - drawW) / 2 + offsetX;
          const drawY = y + (photoH - drawH) / 2 + offsetY;

          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.filter = 'none';

          // Draw Border
          if (enableBorder) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth * 2; // scaled for 300DPI
            ctx.strokeRect(x, y, photoW, photoH);
          }

          // Draw Text Stamp (Name & Date)
          if (enableText && (nameText || dateText)) {
            const scaleDpi = 300 / 96;
            const textBandHeight = Math.round(36 * scaleDpi);
            const textY = y + photoH - textBandHeight;

            ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
            ctx.fillRect(x, textY, photoW, textBandHeight);

            // Border on top of text band
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, textY);
            ctx.lineTo(x + photoW, textY);
            ctx.stroke();

            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const nameFontPx = Math.round(fontSize * scaleDpi);
            const dateFontPx = Math.round((fontSize - 2) * scaleDpi);

            if (nameText && dateText) {
              ctx.font = `${fontWeight} ${nameFontPx}px sans-serif`;
              ctx.fillText(nameText, x + photoW / 2, textY + textBandHeight * 0.35);

              ctx.font = `600 ${dateFontPx}px sans-serif`;
              ctx.fillText(dateText, x + photoW / 2, textY + textBandHeight * 0.75);
            } else {
              ctx.font = `${fontWeight} ${nameFontPx}px sans-serif`;
              ctx.fillText(nameText || dateText, x + photoW / 2, textY + textBandHeight / 2);
            }
          }

          ctx.restore();
        }
      }
    };
  }, [
    photoSrc, paper, copies, brightness, contrast, zoom, offsetX, offsetY,
    marginTop, marginLeft, gapHorizontal, gapVertical, enableBorder, borderColor,
    borderWidth, enableText, nameText, dateText, fontSize, fontWeight
  ]);

  useEffect(() => {
    renderSheet();
  }, [renderSheet]);

  // --- Interactive Cropping ---
  const startCropMode = () => {
    if (!photoSrc) {
      if (notify) notify('Please upload a photo first.');
      return;
    }
    setIsCropMode(true);
    const canvas = cropCanvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoSrc;
    img.onload = () => {
      const maxW = 500;
      const maxH = 400;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const cropH = canvas.height * 0.8;
      const cropW = cropH * (PHOTO_WIDTH_PX / PHOTO_HEIGHT_PX);
      const initCrop = {
        x: (canvas.width - cropW) / 2,
        y: (canvas.height - cropH) / 2,
        w: cropW,
        h: cropH
      };
      setCropBox(initCrop);
      drawCropOverlay(img, canvas, initCrop);
    };
  };

  const drawCropOverlay = (img, canvas, box) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Darken outer area
    ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Clear inner crop area
    ctx.clearRect(box.x, box.y, box.w, box.h);
    ctx.drawImage(img, box.x * (img.width / canvas.width), box.y * (img.height / canvas.height), box.w * (img.width / canvas.width), box.h * (img.height / canvas.height), box.x, box.y, box.w, box.h);

    // Draw crop border & grid lines
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.w, box.h);

    // Rule of thirds lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(box.x + box.w / 3, box.y);
    ctx.lineTo(box.x + box.w / 3, box.y + box.h);
    ctx.moveTo(box.x + (2 * box.w) / 3, box.y);
    ctx.lineTo(box.x + (2 * box.w) / 3, box.y + box.h);
    ctx.moveTo(box.x, box.y + box.h / 3);
    ctx.lineTo(box.x + box.w, box.y + box.h / 3);
    ctx.moveTo(box.x, box.y + (2 * box.h) / 3);
    ctx.lineTo(box.x + box.w, box.y + (2 * box.h) / 3);
    ctx.stroke();
  };

  const handleCropMouseDown = (e) => {
    const canvas = cropCanvasRef.current;
    if (!canvas || !cropBox) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (
      mouseX >= cropBox.x &&
      mouseX <= cropBox.x + cropBox.w &&
      mouseY >= cropBox.y &&
      mouseY <= cropBox.y + cropBox.h
    ) {
      setIsDraggingCrop(true);
      setDragStart({ x: mouseX - cropBox.x, y: mouseY - cropBox.y });
    }
  };

  const handleCropMouseMove = (e) => {
    if (!isDraggingCrop || !cropBox) return;
    const canvas = cropCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    let newX = mouseX - dragStart.x;
    let newY = mouseY - dragStart.y;

    newX = Math.max(0, Math.min(newX, canvas.width - cropBox.w));
    newY = Math.max(0, Math.min(newY, canvas.height - cropBox.h));

    const updatedBox = { ...cropBox, x: newX, y: newY };
    setCropBox(updatedBox);

    const img = new Image();
    img.src = photoSrc;
    drawCropOverlay(img, canvas, updatedBox);
  };

  const handleCropMouseUp = () => {
    setIsDraggingCrop(false);
  };

  const applyCrop = () => {
    if (!cropBox || !photoSrc) return;
    const canvas = cropCanvasRef.current;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = photoSrc;

    img.onload = () => {
      const scaleX = img.width / canvas.width;
      const scaleY = img.height / canvas.height;

      const sx = cropBox.x * scaleX;
      const sy = cropBox.y * scaleY;
      const sw = cropBox.w * scaleX;
      const sh = cropBox.h * scaleY;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = PHOTO_WIDTH_PX;
      tempCanvas.height = PHOTO_HEIGHT_PX;
      const tctx = tempCanvas.getContext('2d');

      tctx.drawImage(img, sx, sy, sw, sh, 0, 0, PHOTO_WIDTH_PX, PHOTO_HEIGHT_PX);
      const croppedUrl = tempCanvas.toDataURL('image/jpeg', 1.0);

      setPhotoSrc(croppedUrl);
      setIsCropMode(false);
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
      if (notify) notify(isTa ? 'புகைப்படம் 3.5 x 4.5 cm அளவிற்கு வெட்டப்பட்டது.' : 'Photo cropped to exact 3.5 x 4.5 cm passport ratio.');
    };
  };

  // --- Downloads & Print ---
  const handleDownloadJPEG = () => {
    const canvas = sheetCanvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `akesevai_passport_sheet_${paper}_${Date.now()}.jpg`;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);
        if (notify) notify(isTa ? 'புகைப்பட தாள் JPEG ஆக பதிவிறக்கப்பட்டது.' : 'Photo sheet JPEG downloaded.');
      }, 'image/jpeg', 0.95);
    } catch (e) {
      const link = document.createElement('a');
      link.download = `akesevai_passport_sheet_${paper}_${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadSinglePhoto = () => {
    if (!photoSrc) return;

    const SINGLE_W = 413;
    const SINGLE_H = 531;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = SINGLE_W;
    tempCanvas.height = SINGLE_H;
    const ctx = tempCanvas.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, SINGLE_W, SINGLE_H);

    const sheetCanvas = sheetCanvasRef.current;
    if (sheetCanvas) {
      ctx.drawImage(sheetCanvas, 0, 0, sheetCanvas.width, sheetCanvas.height, 0, 0, SINGLE_W, SINGLE_H);
    }

    if (enableBorder) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth * 2;
      ctx.strokeRect(0, 0, SINGLE_W, SINGLE_H);
    }

    if (enableText && (nameText || dateText)) {
      const textBannerH = 65;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, SINGLE_H - textBannerH, SINGLE_W, textBannerH);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, SINGLE_H - textBannerH, SINGLE_W, textBannerH);

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = 'bold 15px sans-serif';
      if (nameText) ctx.fillText(nameText.toUpperCase(), SINGLE_W / 2, SINGLE_H - textBannerH + 24);
      ctx.font = 'bold 13px sans-serif';
      if (dateText) ctx.fillText(dateText, SINGLE_W / 2, SINGLE_H - textBannerH + 48);
    }

    const dataUrl = tempCanvas.toDataURL('image/jpeg', 0.95);
    const link = document.createElement('a');
    link.download = `akesevai_single_passport_photo_${Date.now()}.jpg`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (notify) notify(isTa ? 'ஒற்றை பாஸ்போர்ட் போட்டோ (3.5x4.5cm) பதிவிறக்கப்பட்டது.' : 'Single passport photo (3.5x4.5cm) saved.');
  };

  const handleDownloadPDF = async () => {
    const canvas = sheetCanvasRef.current;
    if (!canvas) return;

    try {
      let pdf;
      if (paper === 'maxi') {
        pdf = new jsPDF({ orientation: 'landscape', unit: 'in', format: [6, 4] });
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 6, 4);
      } else {
        pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, 210, 297);
      }

      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.download = `akesevai_passport_sheet_${paper}_${Date.now()}.pdf`;
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      if (notify) notify(isTa ? 'அச்சிடத் தயாரான PDF பதிவிறக்கப்பட்டது.' : 'Print-ready PDF downloaded successfully.');
    } catch (e) {
      console.warn('PDF export fallback:', e);
      handleDownloadJPEG();
    }
  };

  const handleDirectPrint = () => {
    const canvas = sheetCanvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/jpeg', 1.0);
    const isMaxi = paper === 'maxi';
    const printHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>AkEsevai Passport Print Studio</title>
    <style>
      @page {
        size: ${isMaxi ? '6in 4in landscape' : 'A4 portrait'};
        margin: 0;
      }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        margin: 0;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      img {
        width: ${isMaxi ? '6in' : '210mm'};
        height: ${isMaxi ? '4in' : '297mm'};
        display: block;
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <img src="${dataUrl}" onload="setTimeout(() => { window.focus(); window.print(); }, 200);" />
  </body>
</html>`;

    const blob = new Blob([printHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) window.location.href = url;
  };

  // --- Signature Editor Logic ---
  const openSignatureEditor = () => {
    if (!sigSrc) {
      if (notify) notify('Please upload a signature image first.');
      return;
    }
    setShowSigModal(true);

    setTimeout(() => {
      const canvas = sigEditCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = sigSrc;
      img.onload = () => {
        const maxW = 460;
        const maxH = 180;
        const scale = Math.min(maxW / img.width, maxH / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const initCrop = {
          x: 20,
          y: 10,
          w: canvas.width - 40,
          h: canvas.height - 20
        };
        setSigCropBox(initCrop);
        drawSigCrop(img, canvas, initCrop);
      };
    }, 100);
  };

  const drawSigCrop = (img, canvas, box) => {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.clearRect(box.x, box.y, box.w, box.h);
    ctx.drawImage(img, box.x * (img.width / canvas.width), box.y * (img.height / canvas.height), box.w * (img.width / canvas.width), box.h * (img.height / canvas.height), box.x, box.y, box.w, box.h);

    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
  };

  const handleDownloadSignature = () => {
    if (!sigSrc) return;
    const img = new Image();
    img.src = sigSrc;
    img.onload = () => {
      let targetW, targetH;
      if (sigUnit === 'cm') {
        targetW = Math.round((sigWidth / 2.54) * sigDpi);
        targetH = Math.round((sigHeight / 2.54) * sigDpi);
      } else if (sigUnit === 'in') {
        targetW = Math.round(sigWidth * sigDpi);
        targetH = Math.round(sigHeight * sigDpi);
      } else {
        targetW = Math.round(sigWidth);
        targetH = Math.round(sigHeight);
      }

      const temp = document.createElement('canvas');
      temp.width = targetW;
      temp.height = targetH;
      const ctx = temp.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const dataUrl = temp.toDataURL('image/jpeg', sigQuality);
      const link = document.createElement('a');
      link.download = `signature_${targetW}x${targetH}_${sigDpi}dpi.jpg`;
      link.href = dataUrl;
      link.click();
      if (notify) notify(isTa ? 'கையொப்பம் துல்லியமான அளவில் பதிவிறக்கப்பட்டது.' : 'Signature exported to exact exam dimensions.');
    };
  };

  // --- Copy Gemini Prompt ---
  const copyGeminiPrompt = () => {
    navigator.clipboard.writeText(GEMINI_PASSPORT_PROMPT);
    setPromptCopied(true);
    if (notify) notify(isTa ? 'Gemini AI Prompt நகலெடுக்கப்பட்டது! Gemini தளத்தில் ஒட்டவும்.' : 'Gemini AI Prompt copied to clipboard!');
    setTimeout(() => setPromptCopied(false), 3000);
  };

  const clearAll = () => {
    setPhotoSrc(null);
    setNameText('');
    setZoom(1);
    setOffsetX(0);
    setOffsetY(0);
    setBrightness(100);
    setContrast(100);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (notify) notify(isTa ? 'புகைப்படம் அழிக்கப்பட்டது.' : 'Photo cleared.');
  };

  return (
    <section className="page-width inner-page photomaker-page-wrapper">
      {/* HEADER HERO */}
      <div className="inner-hero photomaker-hero">
        <div className="photomaker-hero-badge">
          <Camera size={15} />
          <span>{isTa ? 'பாஸ்போர்ட் புகைப்படம் & கையொப்ப ஸ்டுடியோ' : 'Passport Photo & Signature Studio'}</span>
        </div>
        <h1 className="photomaker-page-title">
          {isTa ? 'பாஸ்போர்ட் அளவு புகைப்பட உருவாக்கம்' : 'Passport Photo Maker & Sheet Generator'}
        </h1>
        <p className="photomaker-page-subtitle">
          {isTa
            ? '4x6 Maxi தாள் மற்றும் A4 தாளில் 4, 8, 30, 35 பாஸ்போர்ட் போட்டோக்கள், நேரடி அளவு வெட்டும் கருவி, பெயர் & தேதி அச்சிடுதல் மற்றும் அரசு தேர்வுக்கான கையொப்ப அளவு திருத்தம்.'
            : 'Create print-ready 4x6 Maxi & A4 sheets with 4, 8, 30, 35 passport photos, interactive face cropping, candidate name/date stamping, and signature dimension optimizer.'}
        </p>
      </div>

      {/* QUICK ACTIONS TOOLBAR */}
      <div className="photomaker-toolbar-card">
        <div className="photomaker-toolbar-actions">
          <button onClick={() => fileInputRef.current?.click()} className="photo-tool-btn primary">
            <Camera size={16} />
            <span>{isTa ? 'புகைப்படம் ஏற்றுக' : 'Upload Photo'}</span>
          </button>
          <input
            id="photo-maker-upload-file"
            name="photo_upload"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            style={{ display: 'none' }}
          />

          <button onClick={startCropMode} className="photo-tool-btn" disabled={!photoSrc}>
            <Crop size={16} />
            <span>{isTa ? 'அளவு வெட்டுக' : 'Crop Photo'}</span>
          </button>

          <button onClick={handleDownloadPDF} className="photo-tool-btn" disabled={!photoSrc}>
            <Download size={16} />
            <span>{isTa ? 'PDF பதிவிறக்கம்' : 'Download PDF'}</span>
          </button>

          <button onClick={handleDownloadJPEG} className="photo-tool-btn" disabled={!photoSrc}>
            <ImageIcon size={16} />
            <span>{isTa ? 'தாள் JPEG' : 'Download Sheet'}</span>
          </button>

          <button onClick={handleDownloadSinglePhoto} className="photo-tool-btn" disabled={!photoSrc}>
            <ImagePlusIcon size={16} />
            <span>{isTa ? 'ஒற்றை போட்டோ' : 'Single Photo'}</span>
          </button>

          <button onClick={handleDirectPrint} className="photo-tool-btn" disabled={!photoSrc}>
            <Printer size={16} />
            <span>{isTa ? 'நேரடி அச்சிடு' : 'Direct Print'}</span>
          </button>

          <button onClick={() => setShowGeminiModal(true)} className="photo-tool-btn ai-btn">
            <Wand2 size={16} />
            <span>{isTa ? 'Gemini AI Prompt' : 'AI Prompt Helper'}</span>
          </button>

          {photoSrc && (
            <button onClick={clearAll} className="photo-tool-btn danger">
              <Trash2 size={16} />
              <span>{isTa ? 'அழிக்க' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN TWO-COLUMN STUDIO LAYOUT */}
      <div className="photomaker-studio-grid">
        {/* LEFT COLUMN: CONTROLS & SETTINGS */}
        <div className="photomaker-controls-panel">
          {/* SECTION 1: PAPER & COPIES */}
          <div className="studio-card">
            <h3 className="studio-card-title">
              <span>📄</span> {isTa ? 'தாள் மற்றும் நகல்கள் அமைப்பு' : 'Paper & Sheet Settings'}
            </h3>

            <div className="control-row">
              <label className="control-label">{isTa ? 'தாள் அளவு (Paper Size):' : 'Paper Size:'}</label>
              <div className="pill-group">
                <button
                  className={`pill-btn ${paper === 'maxi' ? 'active' : ''}`}
                  onClick={() => handlePaperChange('maxi')}
                >
                  4 x 6 inch (Maxi)
                </button>
                <button
                  className={`pill-btn ${paper === 'a4' ? 'active' : ''}`}
                  onClick={() => handlePaperChange('a4')}
                >
                  A4 Paper
                </button>
                <button
                  className={`pill-btn ${paper === 'single' ? 'active' : ''}`}
                  onClick={() => handlePaperChange('single')}
                >
                  Single (3.5x4.5cm)
                </button>
              </div>
            </div>

            {paper !== 'single' && (
              <div className="control-row">
                <label className="control-label">{isTa ? 'நகல்கள் எண்ணிக்கை (Copies):' : 'Photo Copies:'}</label>
                <div className="pill-group">
                  {paper === 'maxi' ? (
                    <>
                      <button className={`pill-btn ${copies === '4' ? 'active' : ''}`} onClick={() => setCopies('4')}>4 Photos (2x2)</button>
                      <button className={`pill-btn ${copies === '6' ? 'active' : ''}`} onClick={() => setCopies('6')}>6 Photos (3x2)</button>
                      <button className={`pill-btn ${copies === '8' ? 'active' : ''}`} onClick={() => setCopies('8')}>8 Photos (4x2)</button>
                    </>
                  ) : (
                    <>
                      <button className={`pill-btn ${copies === '16' ? 'active' : ''}`} onClick={() => setCopies('16')}>16 Photos</button>
                      <button className={`pill-btn ${copies === '30' ? 'active' : ''}`} onClick={() => setCopies('30')}>30 Photos (5x6)</button>
                      <button className={`pill-btn ${copies === '35' ? 'active' : ''}`} onClick={() => setCopies('35')}>35 Photos (5x7)</button>
                      <button className={`pill-btn ${copies === '40' ? 'active' : ''}`} onClick={() => setCopies('40')}>40 Photos (5x8)</button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: BRIGHTNESS, CONTRAST & ZOOM */}
          <div className="studio-card">
            <h3 className="studio-card-title">
              <span>☀️</span> {isTa ? 'ஒளி மற்றும் உருப்பெருக்கம்' : 'Image Adjustments'}
            </h3>

            <div className="slider-item">
              <div className="slider-label-row">
                <span><Sun size={14} /> {isTa ? 'பிரகாசம் (Brightness)' : 'Brightness'}</span>
                <strong>{brightness}%</strong>
              </div>
              <input
                id="photo-maker-brightness-slider"
                name="brightness"
                type="range"
                min="50"
                max="180"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="studio-range-slider"
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span><Contrast size={14} /> {isTa ? 'மாறுபாடு (Contrast)' : 'Contrast'}</span>
                <strong>{contrast}%</strong>
              </div>
              <input
                id="photo-maker-contrast-slider"
                name="contrast"
                type="range"
                min="50"
                max="180"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="studio-range-slider"
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span><ZoomIn size={14} /> {isTa ? 'அளவு உருப்பெருக்கம் (Zoom)' : 'Zoom / Scale'}</span>
                <strong>{Math.round(zoom * 100)}%</strong>
              </div>
              <input
                id="photo-maker-zoom-slider"
                name="zoom"
                type="range"
                min="0.6"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="studio-range-slider"
              />
            </div>

            {/* PAN OFFSETS */}
            <div className="pan-controls-grid">
              <div>
                <label className="sub-label" htmlFor="photo-maker-pan-x">{isTa ? 'கிடைமட்ட நகர்வு (X)' : 'Pan X (mm)'}</label>
                <input
                  id="photo-maker-pan-x"
                  name="pan_x"
                  type="number"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="studio-num-input"
                />
              </div>
              <div>
                <label className="sub-label" htmlFor="photo-maker-pan-y">{isTa ? 'செங்குத்து நகர்வு (Y)' : 'Pan Y (mm)'}</label>
                <input
                  id="photo-maker-pan-y"
                  name="pan_y"
                  type="number"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="studio-num-input"
                />
              </div>
              <button
                className="reset-btn"
                onClick={() => { setZoom(1); setOffsetX(0); setOffsetY(0); setBrightness(100); setContrast(100); }}
                title="Reset Adjustments"
              >
                <RefreshCw size={13} /> {isTa ? 'மீட்டமைக்க' : 'Reset'}
              </button>
            </div>
          </div>

          {/* SECTION 3: BORDER & MARGINS */}
          <div className="studio-card">
            <h3 className="studio-card-title">
              <span>📐</span> {isTa ? 'பார்டர் மற்றும் ஓர இடைவெளிகள்' : 'Borders & Margins'}
            </h3>

            <div className="checkbox-row">
              <label className="checkbox-label" htmlFor="photo-maker-enable-border">
                <input
                  id="photo-maker-enable-border"
                  name="enable_border"
                  type="checkbox"
                  checked={enableBorder}
                  onChange={(e) => setEnableBorder(e.target.checked)}
                />
                <span>{isTa ? 'கருப்பு/வண்ண பார்டர் சேர்க்க' : 'Enable Photo Border'}</span>
              </label>

              {enableBorder && (
                <div className="color-picker-wrap">
                  <input
                    id="photo-maker-border-color"
                    name="border_color"
                    type="color"
                    value={borderColor}
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="studio-color-input"
                    title="Border Color"
                  />
                  <select
                    id="photo-maker-border-width"
                    name="border_width"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(Number(e.target.value))}
                    className="studio-select"
                  >
                    <option value={1}>1px</option>
                    <option value={2}>2px (Default)</option>
                    <option value={3}>3px</option>
                    <option value={4}>4px</option>
                  </select>
                </div>
              )}
            </div>

            {paper !== 'single' && (
              <div className="margins-grid">
                <div>
                  <label className="sub-label" htmlFor="photo-maker-margin-top">{isTa ? 'மேல் ஓரம் (Top mm)' : 'Top (mm)'}</label>
                  <input
                    id="photo-maker-margin-top"
                    name="margin_top"
                    type="number"
                    step="0.5"
                    value={marginTop}
                    onChange={(e) => setMarginTop(Number(e.target.value))}
                    className="studio-num-input"
                  />
                </div>
                <div>
                  <label className="sub-label" htmlFor="photo-maker-margin-left">{isTa ? 'இடது ஓரம் (Left mm)' : 'Left (mm)'}</label>
                  <input
                    id="photo-maker-margin-left"
                    name="margin_left"
                    type="number"
                    step="0.5"
                    value={marginLeft}
                    onChange={(e) => setMarginLeft(Number(e.target.value))}
                    className="studio-num-input"
                  />
                </div>
                <div>
                  <label className="sub-label" htmlFor="photo-maker-gap-h">{isTa ? 'கிடை இடைவெளி (Gap H)' : 'Gap H (mm)'}</label>
                  <input
                    id="photo-maker-gap-h"
                    name="gap_horizontal"
                    type="number"
                    step="0.5"
                    value={gapHorizontal}
                    onChange={(e) => setGapHorizontal(Number(e.target.value))}
                    className="studio-num-input"
                  />
                </div>
                <div>
                  <label className="sub-label" htmlFor="photo-maker-gap-v">{isTa ? 'செங்குத்து இடைவெளி (Gap V)' : 'Gap V (mm)'}</label>
                  <input
                    id="photo-maker-gap-v"
                    name="gap_vertical"
                    type="number"
                    step="0.5"
                    value={gapVertical}
                    onChange={(e) => setGapVertical(Number(e.target.value))}
                    className="studio-num-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 4: CANDIDATE NAME & DATE STAMP */}
          <div className="studio-card">
            <h3 className="studio-card-title">
              <span>🏷️</span> {isTa ? 'பெயர் & தேதி அச்சிடுதல் (TNPSC/Govt)' : 'Name & Date Stamp (Exam Ready)'}
            </h3>

            <div className="checkbox-row">
              <label className="checkbox-label" htmlFor="photo-maker-enable-text">
                <input
                  id="photo-maker-enable-text"
                  name="enable_text"
                  type="checkbox"
                  checked={enableText}
                  onChange={(e) => setEnableText(e.target.checked)}
                />
                <span>{isTa ? 'புகைப்படத்தில் பெயர் மற்றும் தேதி அச்சிட' : 'Add Candidate Name & Date Stamp'}</span>
              </label>
            </div>

            {enableText && (
              <div className="text-stamp-inputs">
                <div>
                  <label className="sub-label" htmlFor="photo-maker-name-text">{isTa ? 'விண்ணப்பதாரர் பெயர் (Candidate Name)' : 'Candidate Name'}</label>
                  <input
                    id="photo-maker-name-text"
                    name="candidate_name"
                    autoComplete="name"
                    type="text"
                    value={nameText}
                    placeholder="e.g. S. SENTHIL KUMAR"
                    onChange={(e) => setNameText(e.target.value)}
                    className="studio-text-input"
                  />
                </div>

                <div style={{ marginTop: '8px' }}>
                  <label className="sub-label" htmlFor="photo-maker-date-text">{isTa ? 'புகைப்படம் எடுத்த தேதி (Date of Photo)' : 'Date of Photo'}</label>
                  <input
                    id="photo-maker-date-text"
                    name="photo_date"
                    autoComplete="off"
                    type="text"
                    value={dateText}
                    placeholder="DD-MM-YYYY"
                    onChange={(e) => setDateText(e.target.value)}
                    className="studio-text-input"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 5: FREE AI STUDIO TOOLS */}
          <div className="studio-card ai-hub-card">
            <h3 className="studio-card-title">
              <span>✨</span> {isTa ? 'இலவச AI கருவிகள்' : 'Free AI Photo Studio'}
            </h3>
            <p className="ai-hub-desc">
              {isTa ? 'மங்கிய பழைய புகைப்படங்களை சரிசெய்து HD தரத்தில் மாற்றவும்:' : 'One-click external AI enhancement & background tools:'}
            </p>

            <div className="ai-buttons-grid">
              <a
                href="https://www.cutout.pro/photo-enhancer-sharpener-upscaler"
                target="_blank"
                rel="noreferrer"
                className="ai-action-link"
              >
                <span>✨ AI Image Enhancer & Upscaler</span>
                <ExternalLink size={13} />
              </a>

              <a
                href="https://www.remove.bg/"
                target="_blank"
                rel="noreferrer"
                className="ai-action-link"
              >
                <span>🎨 Background Remover & Color Change</span>
                <ExternalLink size={13} />
              </a>

              <a
                href="https://clipdrop.co/super-resolution"
                target="_blank"
                rel="noreferrer"
                className="ai-action-link"
              >
                <span>📸 Convert to Ultra HD (Super Resolution)</span>
                <ExternalLink size={13} />
              </a>

              <button
                onClick={() => setShowGeminiModal(true)}
                className="ai-action-link prompt-btn"
              >
                <span>🤖 Gemini Passport Prompt Template</span>
                <Copy size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE CANVAS PREVIEW & SIGNATURE STUDIO */}
        <div className="photomaker-preview-panel">
          {/* CROP OVERLAY MODAL IF ACTIVE */}
          {isCropMode ? (
            <div className="studio-preview-box crop-mode-box">
              <div className="crop-box-header">
                <strong>✂️ {isTa ? 'முகத்தை 3.5 x 4.5 cm அளவிற்கு வெட்டவும்' : 'Drag to Crop Face (3.5 x 4.5 cm)'}</strong>
                <div className="crop-actions">
                  <button onClick={applyCrop} className="crop-apply-btn">
                    <Check size={15} /> {isTa ? 'சரி செய்க' : 'Apply Crop'}
                  </button>
                  <button onClick={() => setIsCropMode(false)} className="crop-cancel-btn">
                    <X size={15} /> {isTa ? 'ரத்து' : 'Cancel'}
                  </button>
                </div>
              </div>

              <div className="crop-canvas-container">
                <canvas
                  ref={cropCanvasRef}
                  onMouseDown={handleCropMouseDown}
                  onMouseMove={handleCropMouseMove}
                  onMouseUp={handleCropMouseUp}
                  className="interactive-crop-canvas"
                />
              </div>
            </div>
          ) : (
            <div className="studio-preview-box">
              <div className="preview-top-bar">
                <span className="dimension-badge">
                  {paper === 'maxi' ? '4x6 inch Maxi (1800 x 1200 px @ 300DPI)' : paper === 'a4' ? 'A4 Sheet (2480 x 3508 px @ 300DPI)' : '3.5 x 4.5 cm (413 x 531 px @ 300DPI)'}
                </span>

                <div className="preview-action-badges">
                  <button onClick={renderSheet} className="mini-action-btn" title="Refresh Sheet">
                    <RefreshCw size={13} />
                  </button>
                  <button onClick={handleDownloadPDF} className="mini-action-btn primary" title="Download PDF">
                    <Download size={13} /> PDF
                  </button>
                  <button onClick={handleDirectPrint} className="mini-action-btn" title="Print Sheet">
                    <Printer size={13} /> Print
                  </button>
                </div>
              </div>

              <div className="canvas-viewport">
                {photoSrc ? (
                  <canvas ref={sheetCanvasRef} className="live-sheet-canvas" />
                ) : (
                  <div className="empty-photo-dropzone" onClick={() => fileInputRef.current?.click()}>
                    <Camera size={48} className="empty-photo-icon" />
                    <h4>{isTa ? 'புகைப்படத்தை இங்கு பதிவேற்றவும்' : 'Upload or Drag Photo Here'}</h4>
                    <p>{isTa ? 'JPG அல்லது PNG புகைப்படத்தைத் தேர்ந்தெடுக்க கிளிக் செய்யவும்' : 'Click to select JPG / PNG image or snap from mobile'}</p>
                    <span className="upload-cta-btn">{isTa ? 'கோப்பைத் தேர்வு செய்க' : 'Browse Photo'}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SIGNATURE STUDIO PANEL */}
          <div className="studio-card signature-studio-card">
            <div className="sig-header-row">
              <h3 className="studio-card-title">
                <span>✍️</span> {isTa ? 'கையொப்ப எடிட்டர் (Signature Optimizer)' : 'Signature Crop & Size Optimizer'}
              </h3>
              <span className="sig-tag">TNPSC / SSC / NTA Ready</span>
            </div>

            <div className="sig-body-grid">
              <div className="sig-upload-area">
                <input
                  id="photo-maker-sig-upload"
                  name="sig_upload"
                  ref={sigFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleSigUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => sigFileInputRef.current?.click()}
                  className="sig-btn secondary"
                >
                  <ImageIcon size={15} /> {isTa ? 'கையொப்பம் ஏற்றுக' : 'Upload Signature'}
                </button>

                {sigSrc && (
                  <div className="sig-quick-actions">
                    <button onClick={openSignatureEditor} className="sig-btn primary">
                      <Crop size={15} /> {isTa ? 'Crop & Edit' : 'Crop & Edit'}
                    </button>
                    <button onClick={handleDownloadSignature} className="sig-btn download">
                      <Download size={15} /> {isTa ? 'JPEG பதிவிறக்கம்' : 'Download JPEG'}
                    </button>
                  </div>
                )}
              </div>

              <div className="sig-specs-box">
                <div className="sig-specs-header">
                  <strong>{isTa ? 'இலக்கு அளவு (Target Size):' : 'Target Dimensions:'}</strong>
                  <div className="sig-unit-pills">
                    {['cm', 'px', 'in'].map((u) => (
                      <button
                        key={u}
                        className={`unit-pill ${sigUnit === u ? 'active' : ''}`}
                        onClick={() => setSigUnit(u)}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sig-inputs-row">
                  <div>
                    <label className="sub-label" htmlFor="photo-maker-sig-width">{isTa ? 'அகலம்' : 'Width'}</label>
                    <input
                      id="photo-maker-sig-width"
                      name="sig_width"
                      type="number"
                      step={sigUnit === 'px' ? '10' : '0.1'}
                      value={sigWidth}
                      onChange={(e) => setSigWidth(Number(e.target.value))}
                      className="studio-num-input"
                    />
                  </div>
                  <div>
                    <label className="sub-label" htmlFor="photo-maker-sig-height">{isTa ? 'உயரம்' : 'Height'}</label>
                    <input
                      id="photo-maker-sig-height"
                      name="sig_height"
                      type="number"
                      step={sigUnit === 'px' ? '10' : '0.1'}
                      value={sigHeight}
                      onChange={(e) => setSigHeight(Number(e.target.value))}
                      className="studio-num-input"
                    />
                  </div>
                  <div>
                    <label className="sub-label" htmlFor="photo-maker-sig-dpi">DPI</label>
                    <select
                      id="photo-maker-sig-dpi"
                      name="sig_dpi"
                      value={sigDpi}
                      onChange={(e) => setSigDpi(Number(e.target.value))}
                      className="studio-select"
                    >
                      <option value={200}>200 DPI</option>
                      <option value={300}>300 DPI</option>
                    </select>
                  </div>
                </div>

                <div className="sig-quality-row">
                  <div className="slider-label-row">
                    <span className="sub-label">{isTa ? 'சுருக்கத் தரம் (KB Limit Control)' : 'Quality (KB Control)'}</span>
                    <strong style={{ fontSize: '11px' }}>{Math.round(sigQuality * 100)}%</strong>
                  </div>
                  <input
                    id="photo-maker-sig-quality"
                    name="sig_quality"
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={sigQuality}
                    onChange={(e) => setSigQuality(Number(e.target.value))}
                    className="studio-range-slider"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GEMINI AI PROMPT HELPER MODAL */}
      {showGeminiModal && (
        <div className="photomaker-modal-backdrop" onClick={() => setShowGeminiModal(false)}>
          <div className="photomaker-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🤖 Gemini Passport AI Helper</h3>
              <button onClick={() => setShowGeminiModal(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <p className="modal-sub">
              {isTa
                ? 'கீழே உள்ள Prompt-ஐ காப்பி செய்து Google Gemini AI-ல் ஒட்டி உங்கள் புகைப்படத்தை ஸ்டுடியோ தரத்திற்கு மாற்றுங்கள்:'
                : 'Copy this prompt and paste it into Google Gemini with your raw photo to enhance lighting, remove background, and convert to HD:'}
            </p>

            <textarea
              readOnly
              value={GEMINI_PASSPORT_PROMPT}
              className="prompt-textarea"
              rows={12}
            />

            <div className="modal-footer-actions">
              <button onClick={copyGeminiPrompt} className="modal-copy-btn">
                {promptCopied ? <Check size={16} /> : <Copy size={16} />}
                <span>{promptCopied ? (isTa ? 'காப்பி செய்யப்பட்டது!' : 'Copied to Clipboard!') : (isTa ? 'Prompt-ஐ காப்பி செய்க' : 'Copy Prompt')}</span>
              </button>
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noreferrer"
                className="modal-open-gemini-btn"
              >
                <span>Open Google AI Studio</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SIGNATURE CROP MODAL */}
      {showSigModal && (
        <div className="photomaker-modal-backdrop" onClick={() => setShowSigModal(false)}>
          <div className="photomaker-modal-card sig-crop-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✍️ {isTa ? 'கையொப்பம் வெட்டும் கருவி' : 'Signature Crop & Align'}</h3>
              <button onClick={() => setShowSigModal(false)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="sig-canvas-wrap">
              <canvas ref={sigEditCanvasRef} className="sig-edit-canvas" />
            </div>

            <div className="modal-footer-actions">
              <button onClick={handleDownloadSignature} className="modal-copy-btn primary">
                <Download size={16} />
                <span>{isTa ? 'துல்லியமான அளவில் பதிவிறக்குக' : 'Export Formatted Signature'}</span>
              </button>
              <button onClick={() => setShowSigModal(false)} className="modal-close-btn-text">
                {isTa ? 'முடிந்தது' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function ImagePlusIcon({ size = 16 }) {
  return <ImageIcon size={size} />;
}
