import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Upload, Download, RefreshCw, Sliders, RotateCw,
  FileText, Layers, FileCheck2, CheckCircle2, ShieldCheck,
  AlertCircle, HelpCircle, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Trash2
} from 'lucide-react';
import { PHOTO_TOOLS_CATALOG, EXAM_PHOTO_GUIDELINES } from '../../data/photoToolsData';
import SpaLink from '../SpaLink';
import {
  validateImageFile,
  estimateDataUrlSizeKb,
  drawImageAspectCover,
  compressCanvasToTargetKb,
  replaceCornerBackgroundColor
} from '../../utils/imageToolsHelper';
import {
  validatePdfInput,
  inspectPdfDocument,
  mergePdfFiles,
  splitPdfDocument,
  extractPdfPages,
  rotatePdfPages,
  renderPdfPagesToImages,
  compressPdfClient,
  formatPdfErrorMessage
} from '../../utils/pdfToolsHelper';

const PDF_DEDICATED_MODES = new Set([
  'pdf-merge',
  'pdf-split',
  'pdf-extract',
  'pdf-rotate',
  'pdf-to-image',
  'pdf-compress'
]);

function safeBlobDownload(blobOrUrl, filename, fallbackExt = 'bin') {
  const cleanName = String(filename || `akesevai_file.${fallbackExt}`).replace(/[^a-zA-Z0-9._-]/g, '_');
  const link = document.createElement('a');
  link.download = cleanName;
  if (blobOrUrl instanceof Blob) {
    const objUrl = URL.createObjectURL(blobOrUrl);
    link.href = objUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(objUrl), 15000);
  } else {
    link.href = blobOrUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default function PhotoToolsEngine({ tool, lang = 'ta', navigate, notify }) {
  const isTa = lang === 'ta';
  const isPdfTool = PDF_DEDICATED_MODES.has(tool.mode);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [originalSizeKb, setOriginalSizeKb] = useState(0);
  const [processedUrl, setProcessedUrl] = useState('');
  const [processedSizeKb, setProcessedSizeKb] = useState(0);
  const [outputDims, setOutputDims] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [warningMsg, setWarningMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // PDF multi & single controls
  const [pdfMergeFiles, setPdfMergeFiles] = useState([]);
  const [pdfBlobResult, setPdfBlobResult] = useState(null);
  const [pdfMetaInfo, setPdfMetaInfo] = useState(null);
  const [splitMode, setSplitMode] = useState('all');
  const [pageRangeText, setPageRangeText] = useState('');
  const [splitParts, setSplitParts] = useState([]);
  const [rotateAngle, setRotateAngle] = useState(90);
  const [pdfCompressLevel, setPdfCompressLevel] = useState('medium');
  const [pdfTargetKb, setPdfTargetKb] = useState(tool.defaultTargetKb || 100);
  const [pdfRenderFormat, setPdfRenderFormat] = useState('jpeg');
  const [pdfRenderScale, setPdfRenderScale] = useState(1.8);
  const [renderedPdfPages, setRenderedPdfPages] = useState([]);

  // Checker state
  const [detectedMetrics, setDetectedMetrics] = useState(null);

  // Image controls
  const [targetKb, setTargetKb] = useState(tool.defaultTargetKb || 50);
  const [quality, setQuality] = useState(0.85);
  const [widthPx, setWidthPx] = useState(350);
  const [heightPx, setHeightPx] = useState(450);
  const [lockAspect, setLockAspect] = useState(true);
  const [aspectRatioVal, setAspectRatioVal] = useState(tool.defaultAspect || 350 / 450);
  const [cleanPaperSig, setCleanPaperSig] = useState(true);

  // Passport / Exam Stamp
  const [sheetType, setSheetType] = useState('single');
  const [hasBorder, setHasBorder] = useState(true);
  const [stampName, setStampName] = useState('');
  const [stampDate, setStampDate] = useState('');
  const [includeStamp, setIncludeStamp] = useState(false);

  // Editor & BG
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [bgTolerance, setBgTolerance] = useState(52);
  const [targetFormat, setTargetFormat] = useState(tool.targetFormat || 'jpg');

  // Image-to-PDF state
  const [multiFiles, setMultiFiles] = useState([]);
  const [pdfOrientation, setPdfOrientation] = useState('portrait');
  const [pdfMargin, setPdfMargin] = useState(10);

  const fileInputRef = useRef(null);
  const sourceImageRef = useRef(null);

  // Reset clean state when switching tools
  useEffect(() => {
    setSelectedFile(null);
    setPreviewUrl('');
    setProcessedUrl('');
    setProcessedSizeKb(0);
    setOriginalSizeKb(0);
    setOutputDims(null);
    setErrorMsg('');
    setWarningMsg('');
    setPdfMergeFiles([]);
    setPdfBlobResult(null);
    setPdfMetaInfo(null);
    setSplitParts([]);
    setRenderedPdfPages([]);
    setDetectedMetrics(null);
    setMultiFiles([]);
    setPageRangeText('');

    setTargetKb(tool.defaultTargetKb || 50);
    setPdfTargetKb(tool.defaultTargetKb || 100);
    if (tool.id === 'photo-compress-20kb' || tool.id === 'signature-resize') setTargetKb(20);
    if (tool.id === 'photo-compress-50kb') setTargetKb(50);
    if (tool.id === 'photo-compress-100kb') setTargetKb(100);
    if (tool.id === 'photo-compress-200kb') setTargetKb(200);
    if (tool.targetFormat) setTargetFormat(tool.targetFormat);
    if (tool.defaultAspect) setAspectRatioVal(tool.defaultAspect);

    if (tool.presetSizes && tool.presetSizes.length > 0) {
      const p = tool.presetSizes[0];
      if (p.w) setWidthPx(p.w);
      if (p.h) setHeightPx(p.h);
      if (p.targetKb) setTargetKb(p.targetKb);
      if (p.aspect) setAspectRatioVal(p.aspect);
      setIncludeStamp(Boolean(p.hasNameStamp));
    } else if (tool.mode === 'signature-compress') {
      setWidthPx(200);
      setHeightPx(100);
      setTargetKb(20);
    } else {
      setWidthPx(350);
      setHeightPx(450);
      setIncludeStamp(false);
    }
  }, [tool.id]);

  // ------------------------------------------------------------------------
  // DEDICATED PDF TOOL HANDLERS
  // ------------------------------------------------------------------------
  const handlePdfMergeSelect = async (e) => {
    const selected = Array.from(e.target.files || []);
    e.target.value = '';
    if (!selected.length) return;
    setErrorMsg('');
    setWarningMsg('');

    const validated = [];
    for (const f of selected) {
      try {
        const info = await inspectPdfDocument(f, f.name);
        if (info.isEncrypted) {
          throw new Error(`"${f.name}" is encrypted/password-protected and cannot be merged.`);
        }
        validated.push({
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          name: f.name,
          sizeKb: info.sizeKb,
          pageCount: info.pageCount
        });
      } catch (err) {
        setErrorMsg(formatPdfErrorMessage(err, isTa));
      }
    }

    if (validated.length > 0) {
      setPdfMergeFiles((prev) => [...prev, ...validated]);
      setPdfBlobResult(null);
    }
  };

  const moveMergeFile = (idx, dir) => {
    setPdfMergeFiles((prev) => {
      const next = [...prev];
      const targetIdx = idx + dir;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      [next[idx], next[targetIdx]] = [next[targetIdx], next[idx]];
      return next;
    });
    setPdfBlobResult(null);
  };

  const removeMergeFile = (id) => {
    setPdfMergeFiles((prev) => prev.filter((f) => f.id !== id));
    setPdfBlobResult(null);
  };

  const executePdfMerge = async () => {
    if (pdfMergeFiles.length < 2) {
      setErrorMsg(isTa ? 'குறைந்தது 2 PDF கோப்புகளைத் தேர்ந்தெடுக்கவும்.' : 'Please select at least 2 valid PDF files to merge.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');
    try {
      const res = await mergePdfFiles(pdfMergeFiles.map((x) => x.file));
      const blob = new Blob([res.bytes], { type: 'application/pdf' });
      setPdfBlobResult(blob);
      setProcessedSizeKb(res.sizeKb);
      setPdfMetaInfo({ pageCount: res.pageCount, sizeKb: res.sizeKb });
      if (notify) notify(isTa ? '✅ PDF கோப்புகள் வெற்றிகரமாக இணைக்கப்பட்டன!' : '✅ PDFs merged successfully!');
    } catch (err) {
      setErrorMsg(formatPdfErrorMessage(err, isTa));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSinglePdfSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErrorMsg('');
    setWarningMsg('');
    setPdfBlobResult(null);
    setSplitParts([]);
    setRenderedPdfPages([]);
    setSelectedFile(file);
    setOriginalSizeKb(Math.max(1, Math.round(file.size / 1024)));

    try {
      const info = await inspectPdfDocument(file, file.name);
      if (info.isEncrypted) {
        setErrorMsg(formatPdfErrorMessage(new Error('This PDF is password-protected / encrypted.'), isTa));
        setPdfMetaInfo(info);
        return;
      }
      setPdfMetaInfo(info);
      setPageRangeText(info.pageCount > 1 ? `1-${Math.min(2, info.pageCount)}` : '1');
    } catch (err) {
      setErrorMsg(formatPdfErrorMessage(err, isTa));
      setSelectedFile(null);
      setPdfMetaInfo(null);
    }
  };

  const executePdfToolAction = async () => {
    if (!selectedFile) {
      setErrorMsg(isTa ? 'முதலில் ஒரு PDF கோப்பைத் தேர்ந்தெடுக்கவும்.' : 'Please upload a valid PDF file first.');
      return;
    }
    setIsProcessing(true);
    setErrorMsg('');
    setWarningMsg('');

    try {
      if (tool.mode === 'pdf-split') {
        const res = await splitPdfDocument(selectedFile, splitMode, pageRangeText);
        setSplitParts(res.outputs.map((o) => ({
          ...o,
          blob: new Blob([o.bytes], { type: 'application/pdf' })
        })));
        if (notify) notify(isTa ? `✅ ${res.outputs.length} PDF பிரிவுகள் தயாராகிவிட்டன!` : `✅ Split into ${res.outputs.length} PDF file(s)!`);
      } else if (tool.mode === 'pdf-extract') {
        const res = await extractPdfPages(selectedFile, pageRangeText);
        const blob = new Blob([res.bytes], { type: 'application/pdf' });
        setPdfBlobResult(blob);
        setProcessedSizeKb(res.sizeKb);
        setPdfMetaInfo((prev) => ({ ...(prev || {}), outputPageCount: res.pageCount }));
        if (notify) notify(isTa ? '✅ குறிப்பிட்ட பக்கங்கள் பிரித்தெடுக்கப்பட்டன!' : '✅ Pages extracted successfully!');
      } else if (tool.mode === 'pdf-rotate') {
        const res = await rotatePdfPages(selectedFile, rotateAngle, pageRangeText);
        const blob = new Blob([res.bytes], { type: 'application/pdf' });
        setPdfBlobResult(blob);
        setProcessedSizeKb(res.sizeKb);
        if (notify) notify(isTa ? '✅ PDF பக்கங்கள் சுழற்றப்பட்டன!' : '✅ PDF rotated successfully!');
      } else if (tool.mode === 'pdf-to-image') {
        const res = await renderPdfPagesToImages(selectedFile, {
          format: pdfRenderFormat,
          scale: pdfRenderScale,
          quality: 0.9
        });
        setRenderedPdfPages(res.renderedPages);
        if (res.truncated) {
          setWarningMsg(`Showing first ${res.renderedPages.length} of ${res.totalPages} pages for browser memory safety.`);
        }
        if (notify) notify(isTa ? `✅ ${res.renderedPages.length} பக்கங்கள் படங்களாக மாற்றப்பட்டன!` : `✅ Converted ${res.renderedPages.length} PDF page(s)!`);
      } else if (tool.mode === 'pdf-compress') {
        const res = await compressPdfClient(selectedFile, {
          qualityPreset: pdfCompressLevel,
          targetKb: pdfTargetKb > 0 ? pdfTargetKb : null
        });
        const blob = new Blob([res.bytes], { type: 'application/pdf' });
        setPdfBlobResult(blob);
        setProcessedSizeKb(res.outputSizeKb);
        if (res.preservedOriginal) {
          setWarningMsg(
            isTa
              ? `இந்த PDF ஏற்கனவே மிகச் சிறிய அளவில் (${res.originalSizeKb} KB) உள்ளது. மீண்டும் சுருக்கினால் அளவு அதிகரிக்கும் என்பதால் அசல் கோப்பே பாதுகாக்கப்பட்டுள்ளது.`
              : `Original PDF (${res.originalSizeKb} KB) is already compact/text-based. Rasterizing increased size, so your original PDF was preserved.`
          );
        } else if (!res.targetMet && pdfTargetKb) {
          setWarningMsg(
            isTa
              ? `PDF அளவு ${res.originalSizeKb} KB-ல் இருந்து ${res.outputSizeKb} KB ஆகக் குறைக்கப்பட்டது. ஆனால் ${pdfTargetKb} KB-க்கு கீழ் குறைக்க முடியவில்லை (பக்கங்களைப் பிரித்து முயற்சிக்கவும்).`
              : `Reduced from ${res.originalSizeKb} KB to ${res.outputSizeKb} KB, but could not reach ${pdfTargetKb} KB without harming legibility. Consider splitting pages.`
          );
        } else {
          if (notify) notify(isTa ? `✅ PDF ${res.outputSizeKb} KB ஆக சுருக்கப்பட்டது!` : `✅ Compressed to ${res.outputSizeKb} KB!`);
        }
      }
    } catch (err) {
      setErrorMsg(formatPdfErrorMessage(err, isTa));
    } finally {
      setIsProcessing(false);
    }
  };

  // ------------------------------------------------------------------------
  // IMAGE & DOCUMENT CHECKER HANDLERS
  // ------------------------------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setErrorMsg('');
    setWarningMsg('');

    const looksPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');

    if (tool.mode === 'document-checker' && looksPdf) {
      setSelectedFile(file);
      setPreviewUrl('document-pdf-checked');
      setProcessedUrl('');
      setOriginalSizeKb(Math.max(1, Math.round(file.size / 1024)));
      setIsProcessing(true);
      inspectPdfDocument(file, file.name)
        .then((info) => {
          setDetectedMetrics({ kind: 'pdf', ...info });
          if (info.isEncrypted) {
            setWarningMsg(formatPdfErrorMessage(new Error('This PDF is password-protected / encrypted.'), isTa));
          }
        })
        .catch((err) => {
          setErrorMsg(formatPdfErrorMessage(err, isTa));
          setDetectedMetrics(null);
        })
        .finally(() => setIsProcessing(false));
      return;
    }

    try {
      validateImageFile(file);
    } catch (err) {
      setErrorMsg(err.message);
      return;
    }

    setMultiFiles([file]);
    loadSingleImageFile(file);
  };

  const handleMultiImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (!files.length) return;
    setErrorMsg('');
    setWarningMsg('');

    const valid = [];
    for (const f of files) {
      try {
        validateImageFile(f);
        valid.push(f);
      } catch (err) {
        setErrorMsg(err.message);
      }
    }
    if (!valid.length) return;
    setMultiFiles(valid);
    loadSingleImageFile(valid[0]);
  };

  const loadSingleImageFile = (file) => {
    setSelectedFile(file);
    setOriginalSizeKb(Math.max(1, Math.round(file.size / 1024)));
    setPdfBlobResult(null);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const res = ev.target?.result || '';
      setPreviewUrl(res);
      const img = new Image();
      img.onload = () => {
        sourceImageRef.current = img;
        runImagePipeline(img, file, {
          targetKbVal: targetKb,
          wPx: widthPx,
          hPx: heightPx,
          stampOn: includeStamp,
          filesList: [file]
        });
      };
      img.onerror = () => {
        setErrorMsg(isTa ? 'படத்தைத் திறக்க முடியவில்லை. சரியான JPG/PNG/WEBP கோப்பை பதிவேற்றவும்.' : 'Unable to decode image file. It may be corrupted.');
        setPreviewUrl('');
      };
      img.src = res;
    };
    reader.onerror = () => setErrorMsg('Failed to read selected file.');
    reader.readAsDataURL(file);
  };

  const generatePdfFromImages = async (fileList) => {
    if (!fileList || !fileList.length) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: pdfOrientation, unit: 'mm', format: 'a4' });
    const pageW = pdfOrientation === 'portrait' ? 210 : 297;
    const pageH = pdfOrientation === 'portrait' ? 297 : 210;
    const margin = pdfMargin;
    const availW = pageW - margin * 2;
    const availH = pageH - margin * 2;

    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const dataUrl = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = (e) => resolve(e.target?.result || '');
        r.onerror = () => reject(new Error(`Failed to read ${f.name}`));
        r.readAsDataURL(f);
      });

      const imgObj = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Invalid image ${f.name}`));
        img.src = dataUrl;
      });

      const c = document.createElement('canvas');
      c.width = imgObj.naturalWidth || imgObj.width;
      c.height = imgObj.naturalHeight || imgObj.height;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(imgObj, 0, 0);
      const jpgUrl = c.toDataURL('image/jpeg', 0.92);

      if (i > 0) doc.addPage('a4', pdfOrientation);
      const aspect = c.width / c.height;
      let drawW = availW;
      let drawH = drawW / aspect;
      if (drawH > availH) {
        drawH = availH;
        drawW = drawH * aspect;
      }
      const posX = margin + (availW - drawW) / 2;
      const posY = margin + (availH - drawH) / 2;
      doc.addImage(jpgUrl, 'JPEG', posX, posY, drawW, drawH, undefined, 'FAST');
    }

    const pdfBlob = doc.output('blob');
    setPdfBlobResult(pdfBlob);
    setProcessedUrl('pdf-generated-ready');
    setProcessedSizeKb(Math.max(1, Math.round(pdfBlob.size / 1024)));
    setPdfMetaInfo({ pageCount: fileList.length, sizeKb: Math.max(1, Math.round(pdfBlob.size / 1024)) });
  };

  const runImagePipeline = async (
    img = sourceImageRef.current,
    fileObj = selectedFile,
    overrides = {}
  ) => {
    if (!fileObj) return;
    setIsProcessing(true);
    setErrorMsg('');
    setWarningMsg('');

    try {
      if (tool.mode === 'image-to-pdf' || tool.mode === 'multi-image-to-pdf') {
        const list = overrides.filesList || (multiFiles.length > 0 ? multiFiles : [fileObj]);
        await generatePdfFromImages(list);
        setIsProcessing(false);
        return;
      }

      if (!img) {
        setIsProcessing(false);
        return;
      }

      const natW = img.naturalWidth || img.width;
      const natH = img.naturalHeight || img.height;

      if (tool.mode === 'dimension-checker' || tool.mode === 'document-checker') {
        const sizeKb = Math.max(1, Math.round(fileObj.size / 1024));
        const fmt = (fileObj.type || '').replace('image/', '').toUpperCase() || 'IMAGE';
        setDetectedMetrics({
          kind: 'image',
          format: fmt,
          widthPx: natW,
          heightPx: natH,
          widthCm300: ((natW / 300) * 2.54).toFixed(2),
          heightCm300: ((natH / 300) * 2.54).toFixed(2),
          aspectRatio: (natW / natH).toFixed(2),
          sizeKb,
          tnpscPhotoRef: natW >= 300 && natW <= 420 && natH >= 400 && natH <= 540 && sizeKb >= 15 && sizeKb <= 50,
          sigRef: natW >= 130 && natW <= 260 && natH >= 50 && natH <= 130 && sizeKb >= 5 && sizeKb <= 20,
          sscPhotoRef: natW >= 180 && natW <= 250 && natH >= 210 && natH <= 270 && sizeKb <= 50,
          upscPhotoRef: Math.abs(natW - natH) <= 25 && natW >= 350 && sizeKb <= 300
        });
        setProcessedUrl(previewUrl || img.src);
        setProcessedSizeKb(sizeKb);
        setOutputDims({ w: natW, h: natH });
        setIsProcessing(false);
        return;
      }

      const effTargetKb = overrides.targetKbVal ?? targetKb;
      const effW = overrides.wPx ?? widthPx;
      const effH = overrides.hPx ?? heightPx;
      const effStampOn = overrides.stampOn ?? includeStamp;

      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      if (tool.mode === 'passport' || tool.mode === 'exam-resizer') {
        if (tool.mode === 'passport' && sheetType === '4x6') {
          canvas.width = 1800;
          canvas.height = 1200;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const pw = 413;
          const ph = 531;
          for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 4; c++) {
              const x = 29 + c * (pw + 30);
              const y = 49 + r * (ph + 40);
              drawImageAspectCover(ctx, img, x, y, pw, ph);
              if (hasBorder) {
                ctx.strokeStyle = '#94a3b8';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, pw, ph);
              }
            }
          }
        } else if (tool.mode === 'passport' && sheetType === 'a4') {
          canvas.width = 2480;
          canvas.height = 3508;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const pw = 531;
          const ph = 413;
          for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 4; c++) {
              const x = 118 + c * (pw + 40);
              const y = 32 + r * (ph + 20);
              drawImageAspectCover(ctx, img, x, y, pw, ph);
              if (hasBorder) {
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 2;
                ctx.strokeRect(x, y, pw, ph);
              }
            }
          }
        } else {
          // Single passport or exact exam resizer dimensions
          const w = tool.mode === 'exam-resizer' ? (effW || 350) : 413;
          const h = tool.mode === 'exam-resizer' ? (effH || 450) : 531;
          canvas.width = w;
          canvas.height = h;
          ctx.fillStyle = bgColor || '#ffffff';
          ctx.fillRect(0, 0, w, h);
          drawImageAspectCover(ctx, img, 0, 0, w, h);

          if (hasBorder && tool.mode === 'passport') {
            ctx.strokeStyle = '#cbd5e1';
            ctx.lineWidth = 3;
            ctx.strokeRect(1.5, 1.5, w - 3, h - 3);
          }

          if (effStampOn && (stampName || stampDate)) {
            const stripH = Math.max(42, Math.round(h * 0.14));
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, h - stripH, w, stripH);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(0, h - stripH, w, stripH);

            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            const fSize = Math.max(10, Math.round(w * 0.044));
            ctx.font = `bold ${fSize}px sans-serif`;
            if (stampName && stampDate) {
              ctx.fillText(stampName.toUpperCase(), w / 2, h - stripH + Math.round(stripH * 0.44));
              ctx.fillText(stampDate, w / 2, h - stripH + Math.round(stripH * 0.84));
            } else {
              ctx.fillText((stampName || stampDate).toUpperCase(), w / 2, h - Math.round(stripH * 0.35));
            }
          }
        }
      } else if (tool.mode === 'signature-compress') {
        const w = Math.max(60, parseInt(effW, 10) || 200);
        const h = Math.max(30, parseInt(effH, 10) || 100);
        canvas.width = w;
        canvas.height = h;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        // Fit entire signature cleanly without chopping off ink edges
        const imgAspect = natW / natH;
        const targetAspect = w / h;
        let dw = w;
        let dh = h;
        if (imgAspect > targetAspect) {
          dh = Math.round(w / imgAspect);
        } else {
          dw = Math.round(h * imgAspect);
        }
        if (cleanPaperSig) {
          ctx.filter = 'contrast(135%) brightness(108%) grayscale(100%)';
        }
        ctx.drawImage(img, Math.round((w - dw) / 2), Math.round((h - dh) / 2), dw, dh);
        ctx.filter = 'none';
      } else if (tool.mode === 'passport-resize' || tool.mode === 'resize') {
        const w = Math.max(20, parseInt(effW, 10) || 350);
        const h = Math.max(20, parseInt(effH, 10) || 450);
        canvas.width = w;
        canvas.height = h;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
        if (lockAspect || tool.mode === 'passport-resize') {
          drawImageAspectCover(ctx, img, 0, 0, w, h);
        } else {
          ctx.drawImage(img, 0, 0, w, h);
        }
      } else if (tool.mode === 'crop') {
        const curAsp = aspectRatioVal || (3.5 / 4.5);
        let cropW = natW;
        let cropH = cropW / curAsp;
        if (cropH > natH) {
          cropH = natH;
          cropW = cropH * curAsp;
        }
        const cropX = (natW - cropW) / 2;
        const cropY = (natH - cropH) / 2;
        canvas.width = Math.max(1, Math.round(cropW));
        canvas.height = Math.max(1, Math.round(cropH));
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);
      } else if (tool.mode === 'background') {
        canvas.width = natW;
        canvas.height = natH;
        ctx.drawImage(img, 0, 0, natW, natH);
        const { canvas: replacedCanvas } = replaceCornerBackgroundColor(canvas, bgColor || '#ffffff', bgTolerance);
        canvas = replacedCanvas;
      } else if (tool.mode === 'editor') {
        const rad = (rotation * Math.PI) / 180;
        const swap = rotation % 180 !== 0;
        canvas.width = swap ? natH : natW;
        canvas.height = swap ? natW : natH;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, -natW / 2, -natH / 2, natW, natH);
        ctx.restore();
      } else {
        // Compress / Convert
        canvas.width = natW;
        canvas.height = natH;
        if (targetFormat !== 'png' || tool.category === 'compression' || tool.mode.includes('compress')) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, natW, natH);
        }
        ctx.drawImage(img, 0, 0, natW, natH);
      }

      const needsTargetKb =
        tool.category === 'compression' ||
        tool.mode === 'compress-target' ||
        tool.mode === 'signature-compress' ||
        tool.mode === 'exam-resizer' ||
        tool.mode === 'passport-resize';

      if (needsTargetKb) {
        const exactDimsMode = tool.mode === 'exam-resizer' || tool.mode === 'signature-compress' || tool.mode === 'passport-resize';
        const compRes = compressCanvasToTargetKb(canvas, effTargetKb, {
          allowDimensionScale: !exactDimsMode,
          minDimensionPx: exactDimsMode ? 60 : 180,
          preserveExactDimensions: exactDimsMode
        });

        setProcessedUrl(compRes.dataUrl);
        setProcessedSizeKb(compRes.sizeKb);
        setOutputDims({ w: compRes.width, h: compRes.height });

        if (!compRes.targetMet) {
          setWarningMsg(
            isTa
              ? `படத்தின் பிக்சல் அளவை (${compRes.width}×${compRes.height}) மாற்றாமல் ${effTargetKb} KB-க்குள் கொண்டு வர முடியவில்லை (குறைந்தபட்சம் ${compRes.sizeKb} KB). சிறிய பிக்சல் அளவை அல்லது சற்று பெரிய KB வரம்பைத் தேர்ந்தெடுக்கவும்.`
              : `Could not reach ≤${effTargetKb} KB at ${compRes.width}×${compRes.height} px without distorting readability (minimum achieved: ${compRes.sizeKb} KB). Lower dimensions slightly or increase target KB.`
          );
        }
      } else {
        const mime = targetFormat === 'png' && tool.mode !== 'background' ? 'image/png' : 'image/jpeg';
        const outUrl = canvas.toDataURL(mime, mime === 'image/jpeg' ? quality : undefined);
        const kb = estimateDataUrlSizeKb(outUrl);
        setProcessedUrl(outUrl);
        setProcessedSizeKb(kb);
        setOutputDims({ w: canvas.width, h: canvas.height });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error processing file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadOutput = () => {
    setErrorMsg('');
    if (pdfBlobResult) {
      safeBlobDownload(pdfBlobResult, `akesevai_${tool.id}_${Date.now()}.pdf`, 'pdf');
      if (notify) notify(isTa ? '🎉 PDF வெற்றிகரமாக பதிவிறக்கப்பட்டது!' : '🎉 PDF downloaded!');
      return;
    }

    if (!processedUrl || !processedUrl.startsWith('data:image/')) {
      setErrorMsg(isTa ? 'பதிவிறக்கத் தயாரான வெளியீடு இன்னும் இல்லை.' : 'No processed output ready to download.');
      return;
    }

    const mimeMatch = processedUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
    const actualMime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
    const ext = actualMime.includes('png') ? 'png' : 'jpg';
    const bstr = atob(processedUrl.split(',')[1]);
    const u8 = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
    const blob = new Blob([u8], { type: actualMime });

    safeBlobDownload(blob, `akesevai_${tool.id}_${Date.now()}.${ext}`, ext);
    if (notify) notify(isTa ? '🎉 கோப்பு வெற்றிகரமாக பதிவிறக்கப்பட்டது!' : '🎉 File downloaded!');
  };

  const isExamComplianceMode =
    tool.mode === 'exam-resizer' ||
    tool.mode === 'dimension-checker' ||
    tool.mode === 'document-checker' ||
    tool.id === 'signature-resize';

  return (
    <div className="tool-engine-wrapper" style={{ maxWidth: '1180px', margin: '0 auto', padding: '16px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #022c7a 0%, #0052cc 100%)', borderRadius: '16px', padding: '26px 24px', color: 'white', marginBottom: '20px', boxShadow: '0 8px 24px rgba(2,44,122,0.18)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: '#22c55e', color: '#064e3b', fontSize: '11px', fontWeight: 900, padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase' }}>
            {isTa ? tool.badgeTa : tool.badge}
          </span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
            🔒 {isTa ? '100% பிரவுசரிலேயே செயல்பாடு (Zero Server Upload)' : '100% Local Browser Processing'}
          </span>
        </div>
        <h1 style={{ fontSize: '25px', fontWeight: 900, margin: '0 0 8px', lineHeight: 1.3 }}>
          {isTa ? tool.titleTa.split('|')[0].trim() : tool.title.split('|')[0].trim()}
        </h1>
        <p style={{ fontSize: '14px', opacity: 0.94, margin: 0, maxWidth: '880px', lineHeight: 1.55 }}>
          {isTa ? tool.descriptionTa : tool.description}
        </p>
      </div>

      {/* Exam / Passport Verification Disclaimer */}
      {isExamComplianceMode && (
        <div style={{ background: '#fffbeb', border: '1.5px solid #fcd34d', color: '#92400e', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontSize: '12.5px', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>{isTa ? 'அறிவிப்பு சரிபார்ப்பு குறிப்பு: ' : 'Official Notification Check: '}</strong>
            {isTa
              ? 'கீழே காட்டப்படும் பரிமாணங்கள் மற்றும் KB அளவுகள் பொதுவான வழிகாட்டி மாதிரிகள் மட்டுமே. தேர்வு வாரியங்கள் ஒவ்வொரு அறிவிப்பிலும் விதிகளை மாற்றக்கூடும் என்பதால், பதிவேற்றும் முன் சமீபத்திய அதிகாரப்பூர்வ அறிவிப்பை சரிபார்க்கவும்.'
              : 'Preset dimensions and KB targets shown here are configurable reference profiles only. Commissions may update requirements per notification — verify your exact active notification before uploading.'}
          </div>
        </div>
      )}

      {/* Error & Warning Alerts */}
      {errorMsg && (
        <div role="alert" style={{ background: '#fef2f2', border: '1.5px solid #fca5a5', color: '#991b1b', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', fontWeight: 700 }}>
          ❌ {errorMsg}
        </div>
      )}
      {warningMsg && (
        <div role="status" style={{ background: '#fff7ed', border: '1.5px solid #fdba74', color: '#9a3412', borderRadius: '12px', padding: '12px 16px', marginBottom: '18px', fontSize: '13px', fontWeight: 600 }}>
          ⚠️ {warningMsg}
        </div>
      )}

      {/* Main Studio Container */}
      <div className={`photo-tools-studio-grid ${(previewUrl || isPdfTool) ? 'has-preview' : 'no-preview'}`}>
        {/* LEFT COLUMN: INPUT + TOOL CONTROLS */}
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', minWidth: 0, boxSizing: 'border-box' }}>
          {tool.mode === 'pdf-merge' ? (
            <div style={{ display: 'grid', gap: '14px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="#0052cc" /> {isTa ? '1. பல PDF கோப்புகளைத் தேர்ந்தெடுக்கவும்' : '1. Select Multiple PDF Files'}
              </h2>
              <label style={{ border: '2px dashed #93c5fd', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', display: 'block' }}>
                <Upload size={28} color="#0052cc" style={{ margin: '0 auto 8px' }} />
                <strong style={{ display: 'block', fontSize: '14.5px', color: '#0f172a' }}>
                  {isTa ? 'PDF கோப்புகளைச் சேர்க்க இங்கே கிளிக் செய்க (2+ PDFs)' : 'Click to Add PDF Files (Select 2 or more PDFs)'}
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>application/pdf • Max 40 MB per file • Unencrypted PDFs</span>
                <input type="file" accept="application/pdf,.pdf" multiple onChange={handlePdfMergeSelect} style={{ display: 'none' }} />
              </label>

              {pdfMergeFiles.length > 0 && (
                <div style={{ display: 'grid', gap: '8px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#334155' }}>
                    {isTa ? `வரிசைப்படுத்தப்பட்ட PDF-கள் (${pdfMergeFiles.length}):` : `PDF Queue (${pdfMergeFiles.length} files):`}
                  </div>
                  {pdfMergeFiles.map((item, idx) => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', background: '#f1f5f9', padding: '8px 10px', borderRadius: '8px', fontSize: '12px' }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <strong style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#0f172a' }}>
                          {idx + 1}. {item.name}
                        </strong>
                        <span style={{ color: '#64748b', fontSize: '11px' }}>{item.pageCount} page(s) • {item.sizeKb} KB</span>
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button type="button" aria-label="Move Up" disabled={idx === 0} onClick={() => moveMergeFile(idx, -1)} style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}><ArrowUp size={13} /></button>
                        <button type="button" aria-label="Move Down" disabled={idx === pdfMergeFiles.length - 1} onClick={() => moveMergeFile(idx, 1)} style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', background: 'white', cursor: idx === pdfMergeFiles.length - 1 ? 'not-allowed' : 'pointer' }}><ArrowDown size={13} /></button>
                        <button type="button" aria-label="Remove PDF" onClick={() => removeMergeFile(item.id)} style={{ padding: '4px 6px', borderRadius: '4px', border: '1px solid #fca5a5', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={13} /></button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={executePdfMerge}
                    disabled={isProcessing || pdfMergeFiles.length < 2}
                    style={{
                      background: pdfMergeFiles.length >= 2 ? '#0052cc' : '#94a3b8',
                      color: 'white',
                      border: 'none',
                      padding: '13px',
                      borderRadius: '10px',
                      fontWeight: 800,
                      fontSize: '14px',
                      cursor: pdfMergeFiles.length >= 2 ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {isProcessing ? (isTa ? 'இணைக்கப்படுகிறது...' : 'Merging PDFs...') : (isTa ? 'PDF-களை ஒரே ஆவணமாக இணை (Merge PDFs)' : 'Merge PDFs Now')}
                  </button>
                </div>
              )}
            </div>
          ) : isPdfTool ? (
            <div style={{ display: 'grid', gap: '14px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#0052cc" /> {isTa ? '1. PDF கோப்பைப் பதிவேற்றவும்' : '1. Upload PDF Document'}
              </h2>
              <label style={{ border: '2px dashed #93c5fd', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', display: 'block' }}>
                <Upload size={28} color="#0052cc" style={{ margin: '0 auto 8px' }} />
                <strong style={{ display: 'block', fontSize: '14.5px', color: '#0f172a' }}>
                  {selectedFile ? selectedFile.name : (isTa ? 'PDF கோப்பைத் தேர்ந்தெடுக்க கிளிக் செய்க' : 'Click to Upload PDF File')}
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>application/pdf • Max 40 MB • Processed in browser memory</span>
                <input type="file" accept="application/pdf,.pdf" onChange={handleSinglePdfSelect} style={{ display: 'none' }} />
              </label>

              {pdfMetaInfo && !pdfMetaInfo.isEncrypted && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px', display: 'grid', gap: '12px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e3a8a' }}>
                    📄 {pdfMetaInfo.pageCount} {isTa ? 'பக்கங்கள்' : 'Page(s)'} • {originalSizeKb} KB
                  </div>

                  {tool.mode === 'pdf-split' && (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <button type="button" onClick={() => setSplitMode('all')} style={{ padding: '8px', borderRadius: '6px', border: splitMode === 'all' ? '2px solid #0052cc' : '1px solid #cbd5e1', background: splitMode === 'all' ? '#eff6ff' : 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                          {isTa ? 'ஒவ்வொரு பக்கத்தையும் பிரி' : 'Split Every Page'}
                        </button>
                        <button type="button" onClick={() => setSplitMode('range')} style={{ padding: '8px', borderRadius: '6px', border: splitMode === 'range' ? '2px solid #0052cc' : '1px solid #cbd5e1', background: splitMode === 'range' ? '#eff6ff' : 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                          {isTa ? 'பக்க வரம்பு (Ranges)' : 'Custom Page Groups'}
                        </button>
                      </div>
                      {splitMode === 'range' && (
                        <input
                          type="text"
                          value={pageRangeText}
                          onChange={(e) => setPageRangeText(e.target.value)}
                          placeholder="e.g. 1-2; 3-4"
                          style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                        />
                      )}
                    </div>
                  )}

                  {tool.mode === 'pdf-extract' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                        {isTa ? 'எடுக்க வேண்டிய பக்க எண்கள் (எ.கா: 1, 3, 4-6):' : 'Pages to Extract (e.g. 1, 3, 4-6):'}
                      </label>
                      <input
                        type="text"
                        value={pageRangeText}
                        onChange={(e) => setPageRangeText(e.target.value)}
                        placeholder={`1-${pdfMetaInfo.pageCount}`}
                        style={{ width: '100%', padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                      />
                    </div>
                  )}

                  {tool.mode === 'pdf-rotate' && (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {[90, 180, 270].map((deg) => (
                          <button key={deg} type="button" onClick={() => setRotateAngle(deg)} style={{ padding: '8px', borderRadius: '6px', border: rotateAngle === deg ? '2px solid #0052cc' : '1px solid #cbd5e1', background: rotateAngle === deg ? '#eff6ff' : 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                            <RotateCw size={13} style={{ display: 'inline', marginRight: '4px' }} /> {deg}°
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={pageRangeText}
                        onChange={(e) => setPageRangeText(e.target.value)}
                        placeholder={isTa ? 'அனைத்து பக்கங்களுக்கும் காலியாக விடவும் (அல்லது 1, 3)' : 'Leave blank for all pages (or enter 1, 3)'}
                        style={{ padding: '9px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}
                      />
                    </div>
                  )}

                  {tool.mode === 'pdf-to-image' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <select value={pdfRenderFormat} onChange={(e) => setPdfRenderFormat(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700 }}>
                        <option value="jpeg">JPG Output</option>
                        <option value="png">PNG Output</option>
                      </select>
                      <select value={pdfRenderScale} onChange={(e) => setPdfRenderScale(Number(e.target.value))} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px', fontWeight: 700 }}>
                        <option value={1.4}>Standard Resolution</option>
                        <option value={2.0}>High Print Resolution</option>
                      </select>
                    </div>
                  )}

                  {tool.mode === 'pdf-compress' && (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {[
                          { id: 'high', label: 'Balanced' },
                          { id: 'medium', label: 'Medium' },
                          { id: 'extreme', label: 'Max Compress' }
                        ].map((opt) => (
                          <button key={opt.id} type="button" onClick={() => setPdfCompressLevel(opt.id)} style={{ padding: '8px', borderRadius: '6px', border: pdfCompressLevel === opt.id ? '2px solid #0052cc' : '1px solid #cbd5e1', background: pdfCompressLevel === opt.id ? '#eff6ff' : 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <label style={{ fontSize: '12px', fontWeight: 700 }}>
                        {isTa ? 'இலக்கு KB (விருப்பம்):' : 'Target Max KB (Optional):'}
                        <select value={pdfTargetKb} onChange={(e) => setPdfTargetKb(Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }}>
                          <option value={0}>Auto Best Compression</option>
                          <option value={100}>Target ≤ 100 KB</option>
                          <option value={200}>Target ≤ 200 KB</option>
                          <option value={500}>Target ≤ 500 KB</option>
                        </select>
                      </label>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={executePdfToolAction}
                    disabled={isProcessing}
                    style={{ background: '#0052cc', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 800, fontSize: '14px', cursor: isProcessing ? 'wait' : 'pointer' }}
                  >
                    {isProcessing ? (isTa ? 'செயலாக்கப்படுகிறது...' : 'Processing...') : (isTa ? 'செயல்படுத்து (Run Tool)' : 'Process PDF')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* IMAGE / DOCUMENT CHECKER / IMAGE-TO-PDF UPLOAD & SETTINGS */
            <>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={20} color="#0052cc" /> {isTa ? '1. கோப்பைப் பதிவேற்றவும்' : '1. Upload Photo / Document'}
              </h2>
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ border: '2px dashed #93c5fd', borderRadius: '12px', padding: '24px 16px', textAlign: 'center', cursor: 'pointer', background: '#f8fafc', marginBottom: '18px' }}
              >
                <input
                  id="photo-tools-file-input"
                  name="photo_tool_file"
                  type="file"
                  ref={fileInputRef}
                  onChange={tool.mode.includes('multi') ? handleMultiImageChange : handleFileChange}
                  accept={tool.mode === 'document-checker' ? 'image/jpeg,image/png,image/webp,image/bmp,application/pdf,.pdf' : 'image/jpeg,image/png,image/webp,image/bmp'}
                  multiple={tool.mode.includes('multi')}
                  style={{ display: 'none' }}
                />
                <div style={{ display: 'inline-flex', padding: '12px', background: '#eff6ff', borderRadius: '50%', color: '#0052cc', marginBottom: '10px' }}>
                  <Camera size={28} />
                </div>
                <strong style={{ display: 'block', fontSize: '14.5px', color: '#0f172a', marginBottom: '4px' }}>
                  {selectedFile ? selectedFile.name : (isTa ? 'புகைப்படம் / கோப்பை தேர்ந்தெடுக்க கிளிக் செய்யவும்' : 'Click to Upload File')}
                </strong>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {tool.mode === 'document-checker'
                    ? 'JPG, PNG, WEBP, PDF supported (Max 30/40 MB)'
                    : tool.mode.includes('multi')
                      ? 'Select 1 or more images (JPG, PNG, WEBP)'
                      : 'JPG, PNG, WEBP, BMP supported (Max 30 MB)'}
                </span>
              </div>

              {previewUrl && (
                <div style={{ display: 'grid', gap: '14px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sliders size={18} color="#0052cc" /> {isTa ? '2. அளவு & கட்டுப்பாடுகள்' : '2. Controls & Settings'}
                  </h3>

                  {tool.presetSizes && tool.presetSizes.length > 0 && (
                    <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '10px', display: 'grid', gap: '8px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#1e3a8a' }}>
                        🎯 {isTa ? 'மாதிரி அளவுகள் (Reference Presets):' : 'Reference Dimension Presets:'}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '6px' }}>
                        {tool.presetSizes.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              if (preset.w) setWidthPx(preset.w);
                              if (preset.h) setHeightPx(preset.h);
                              if (preset.targetKb) setTargetKb(preset.targetKb);
                              if (preset.aspect) setAspectRatioVal(preset.aspect);
                              const stampFlag = Boolean(preset.hasNameStamp);
                              setIncludeStamp(stampFlag);
                              runImagePipeline(sourceImageRef.current, selectedFile, {
                                targetKbVal: preset.targetKb || targetKb,
                                wPx: preset.w || widthPx,
                                hPx: preset.h || heightPx,
                                stampOn: stampFlag
                              });
                            }}
                            style={{
                              padding: '8px',
                              fontSize: '11px',
                              fontWeight: 700,
                              borderRadius: '6px',
                              border: widthPx === preset.w && heightPx === preset.h ? '2px solid #2563eb' : '1px solid #cbd5e1',
                              background: widthPx === preset.w && heightPx === preset.h ? '#dbeafe' : 'white',
                              color: '#1e40af',
                              cursor: 'pointer',
                              textAlign: 'left'
                            }}
                          >
                            📌 {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {tool.mode === 'passport' && (
                    <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px', display: 'grid', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {[
                          { id: 'single', label: 'Single Photo' },
                          { id: '4x6', label: '4x6 Sheet (8)' },
                          { id: 'a4', label: 'A4 Sheet (32)' }
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => { setSheetType(s.id); setTimeout(() => runImagePipeline(), 30); }}
                            style={{ padding: '8px', borderRadius: '6px', border: sheetType === s.id ? '2px solid #0052cc' : '1px solid #cbd5e1', background: sheetType === s.id ? '#eff6ff' : 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(tool.mode === 'passport' || tool.mode === 'exam-resizer') && sheetType === 'single' && (
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gap: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={includeStamp}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setIncludeStamp(val);
                            runImagePipeline(sourceImageRef.current, selectedFile, { stampOn: val });
                          }}
                        />
                        {isTa ? 'பெயர் & தேதி முத்திரை சேர்க்க (Optional Name/Date Strip)' : 'Add Optional Name & Date Strip'}
                      </label>
                      {includeStamp && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <input type="text" placeholder="NAME / பெயர்" value={stampName} onChange={(e) => setStampName(e.target.value)} onBlur={() => runImagePipeline()} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }} />
                          <input type="date" value={stampDate} onChange={(e) => setStampDate(e.target.value)} onBlur={() => runImagePipeline()} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12.5px' }} />
                        </div>
                      )}
                    </div>
                  )}

                  {(tool.mode === 'exam-resizer' || tool.mode === 'resize' || tool.mode === 'passport-resize' || tool.mode === 'signature-compress') && (
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700 }}>
                          Width (px):
                          <input type="number" min="20" max="4000" value={widthPx} onChange={(e) => setWidthPx(parseInt(e.target.value, 10) || 100)} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                        </label>
                        <label style={{ fontSize: '12px', fontWeight: 700 }}>
                          Height (px):
                          <input type="number" min="20" max="4000" value={heightPx} onChange={(e) => setHeightPx(parseInt(e.target.value, 10) || 100)} style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #cbd5e1', marginTop: '4px', boxSizing: 'border-box' }} />
                        </label>
                      </div>
                      {tool.mode === 'signature-compress' && (
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                          <input type="checkbox" checked={cleanPaperSig} onChange={(e) => setCleanPaperSig(e.target.checked)} />
                          {isTa ? 'வெள்ளைத் தாள் தெளிவுபடுத்து (High Contrast White Paper)' : 'Enhance Signature Contrast (Clean White Paper)'}
                        </label>
                      )}
                    </div>
                  )}

                  {(tool.category === 'compression' || tool.mode === 'compress-target' || tool.mode === 'signature-compress' || tool.mode === 'exam-resizer' || tool.mode === 'passport-resize') && (
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', fontWeight: 800 }}>
                        <span>{isTa ? 'இலக்கு கோப்பு அளவு (Target Max KB):' : 'Target Max File Size:'}</span>
                        <strong style={{ color: '#0052cc' }}>≤ {targetKb} KB</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[20, 50, 100, 200].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => {
                              setTargetKb(preset);
                              runImagePipeline(sourceImageRef.current, selectedFile, { targetKbVal: preset });
                            }}
                            style={{ flex: 1, padding: '6px', fontSize: '11.5px', fontWeight: 800, borderRadius: '6px', border: targetKb === preset ? '2px solid #0052cc' : '1px solid #cbd5e1', background: targetKb === preset ? '#eff6ff' : 'white', color: targetKb === preset ? '#0052cc' : '#334155', cursor: 'pointer' }}
                          >
                            {preset} KB
                          </button>
                        ))}
                      </div>
                      <input type="range" min="10" max="500" step="5" value={targetKb} onChange={(e) => setTargetKb(Number(e.target.value))} style={{ width: '100%', accentColor: '#0052cc' }} />
                    </div>
                  )}

                  {tool.mode === 'background' && (
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gap: '10px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800 }}>
                        {isTa ? 'புதிய பின்னணி நிறம்:' : 'New Background Color:'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {['#ffffff', '#cce5ff', '#e0f2fe', '#f3f4f6'].map((hex) => (
                          <button key={hex} type="button" onClick={() => setBgColor(hex)} style={{ width: '28px', height: '28px', borderRadius: '50%', background: hex, border: bgColor === hex ? '2.5px solid #0052cc' : '1px solid #94a3b8', cursor: 'pointer' }} />
                        ))}
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '32px', height: '32px', border: 'none', padding: 0, cursor: 'pointer' }} />
                      </div>
                      <label style={{ fontSize: '12px', fontWeight: 700 }}>
                        Tolerance ({bgTolerance}):
                        <input type="range" min="15" max="115" value={bgTolerance} onChange={(e) => setBgTolerance(Number(e.target.value))} style={{ width: '100%', accentColor: '#0052cc' }} />
                      </label>
                    </div>
                  )}

                  {tool.mode === 'editor' && (
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: 700 }}>Brightness ({brightness}%): <input type="range" min="50" max="175" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} style={{ width: '100%' }} /></label>
                      <label style={{ fontSize: '12px', fontWeight: 700 }}>Contrast ({contrast}%): <input type="range" min="50" max="175" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} style={{ width: '100%' }} /></label>
                      <button type="button" onClick={() => setRotation((r) => (r + 90) % 360)} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>↻ Rotate 90° ({rotation}°)</button>
                    </div>
                  )}

                  {(tool.mode === 'image-to-pdf' || tool.mode === 'multi-image-to-pdf') && (
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button type="button" onClick={() => setPdfOrientation('portrait')} style={{ padding: '8px', borderRadius: '6px', border: pdfOrientation === 'portrait' ? '2px solid #0052cc' : '1px solid #cbd5e1', background: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Portrait A4</button>
                      <button type="button" onClick={() => setPdfOrientation('landscape')} style={{ padding: '8px', borderRadius: '6px', border: pdfOrientation === 'landscape' ? '2px solid #0052cc' : '1px solid #cbd5e1', background: 'white', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>Landscape A4</button>
                    </div>
                  )}

                  {detectedMetrics && (
                    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #cbd5e1', display: 'grid', gap: '10px' }}>
                      <strong style={{ fontSize: '13.5px', color: '#0f172a' }}>📊 {isTa ? 'கண்டறியப்பட்ட அளவு விவரங்கள்:' : 'Detected Metrics:'}</strong>
                      {detectedMetrics.kind === 'pdf' ? (
                        <div style={{ fontSize: '12.5px', color: '#334155', display: 'grid', gap: '6px' }}>
                          <div>Format: <strong>{detectedMetrics.format}</strong></div>
                          <div>Size: <strong>{detectedMetrics.sizeKb} KB</strong></div>
                          <div>Pages: <strong>{detectedMetrics.isEncrypted ? (isTa ? 'பூட்டப்பட்டது (Password Protected)' : 'Password Protected / Encrypted') : detectedMetrics.pageCount}</strong></div>
                          {detectedMetrics.pagesInfo?.[0] && (
                            <div>Page 1 Size: <strong>{detectedMetrics.pagesInfo[0].paperMatch} ({detectedMetrics.pagesInfo[0].widthMm}×{detectedMetrics.pagesInfo[0].heightMm} mm)</strong></div>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>Format: <strong>{detectedMetrics.format}</strong></div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>Size: <strong>{detectedMetrics.sizeKb} KB</strong></div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>Pixels: <strong>{detectedMetrics.widthPx} × {detectedMetrics.heightPx}</strong></div>
                          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>Aspect Ratio: <strong>{detectedMetrics.aspectRatio}</strong></div>
                        </div>
                      )}
                    </div>
                  )}

                  {tool.mode !== 'dimension-checker' && tool.mode !== 'document-checker' && (
                    <button
                      type="button"
                      onClick={() => runImagePipeline()}
                      disabled={isProcessing}
                      style={{ background: '#0052cc', color: 'white', padding: '12px', borderRadius: '10px', border: 'none', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <RefreshCw size={16} /> {isProcessing ? (isTa ? 'மாற்றப்படுகிறது...' : 'Processing...') : (isTa ? 'மாற்றங்களைச் செயல்படுத்து (Apply Changes)' : 'Apply Changes')}
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN: REAL PREVIEW & DOWNLOAD OUTPUT */}
        {(previewUrl || pdfBlobResult || splitParts.length > 0 || renderedPdfPages.length > 0) && (
          <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0, boxSizing: 'border-box' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={20} color="#16a34a" /> {isTa ? '3. வெளியீடு & பதிவிறக்கம்' : '3. Verified Output & Download'}
              </h2>

              {originalSizeKb > 0 && (processedSizeKb > 0 || pdfBlobResult) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px', border: '1px solid #cbd5e1' }}>
                  <div>
                    <small style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, display: 'block' }}>ORIGINAL:</small>
                    <strong style={{ fontSize: '15px', color: '#334155' }}>{originalSizeKb} KB</strong>
                  </div>
                  <div>
                    <small style={{ fontSize: '11px', color: '#166534', fontWeight: 700, display: 'block' }}>OUTPUT:</small>
                    <strong style={{ fontSize: '15px', color: '#16a34a' }}>
                      {processedSizeKb} KB {outputDims ? `(${outputDims.w}×${outputDims.h} px)` : ''}
                    </strong>
                  </div>
                </div>
              )}

              {/* Split PDF Outputs */}
              {splitParts.length > 0 && (
                <div style={{ display: 'grid', gap: '8px', maxHeight: '360px', overflowY: 'auto' }}>
                  {splitParts.map((part, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4', border: '1px solid #86efac', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#166534' }}>
                        📄 {part.label} ({part.pageCount} pg • {part.sizeKb} KB)
                      </div>
                      <button type="button" onClick={() => safeBlobDownload(part.blob, `akesevai_${part.fileNameSuffix}.pdf`, 'pdf')} style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* PDF-to-JPG Rendered Page Images */}
              {renderedPdfPages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', maxHeight: '420px', overflowY: 'auto' }}>
                  {renderedPdfPages.map((pg) => (
                    <div key={pg.pageNumber} style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '10px', textAlign: 'center' }}>
                      <img src={pg.dataUrl} alt={`PDF Page ${pg.pageNumber}`} style={{ width: '100%', height: '140px', objectFit: 'contain', background: 'white', borderRadius: '6px', marginBottom: '8px' }} />
                      <div style={{ fontSize: '11px', color: '#475569', marginBottom: '6px' }}>
                        Page {pg.pageNumber} • {pg.width}×{pg.height} • {pg.sizeKb} KB
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const mime = pg.format === 'png' ? 'image/png' : 'image/jpeg';
                          const bstr = atob(pg.dataUrl.split(',')[1]);
                          const u8 = new Uint8Array(bstr.length);
                          for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
                          safeBlobDownload(new Blob([u8], { type: mime }), `akesevai_page_${pg.pageNumber}.${pg.format}`, pg.format);
                        }}
                        style={{ width: '100%', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', padding: '7px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                      >
                        Download Page {pg.pageNumber}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Single PDF Output Card */}
              {pdfBlobResult && splitParts.length === 0 && (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                  <FileText size={54} color="#dc2626" style={{ margin: '0 auto 10px' }} />
                  <strong style={{ display: 'block', fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>
                    {isTa ? 'PDF ஆவணம் தயார்!' : 'Valid PDF Document Ready!'}
                  </strong>
                  <span style={{ fontSize: '12.5px', color: '#166534' }}>
                    {pdfMetaInfo?.outputPageCount || pdfMetaInfo?.pageCount ? `${pdfMetaInfo.outputPageCount || pdfMetaInfo.pageCount} page(s) • ` : ''}{processedSizeKb} KB
                  </span>
                </div>
              )}

              {/* Image Preview Canvas Output */}
              {!pdfBlobResult && splitParts.length === 0 && renderedPdfPages.length === 0 && processedUrl && processedUrl.startsWith('data:image/') && (
                <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '16px', textAlign: 'center', minHeight: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                  <img
                    src={processedUrl}
                    alt={`${tool.title.split('|')[0].trim()} preview`}
                    style={{ maxWidth: '100%', maxHeight: '340px', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </div>
              )}
            </div>

            {(pdfBlobResult || (processedUrl && processedUrl.startsWith('data:image/'))) && (
              <div style={{ marginTop: '18px' }}>
                <button
                  type="button"
                  onClick={handleDownloadOutput}
                  style={{ width: '100%', background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: 'white', padding: '15px', borderRadius: '12px', border: 'none', fontSize: '15px', fontWeight: 900, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Download size={20} /> {isTa ? 'இலவசமாக பதிவிறக்குக (Download Output)' : 'Download Output File'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Privacy Card */}
      <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', margin: '24px 0' }}>
        <ShieldCheck size={28} color="#16a34a" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ fontSize: '13.5px', color: '#166534', display: 'block', marginBottom: '2px' }}>
            {isTa ? '100% தனிநபர் பாதுகாப்பு (Zero Server Upload Privacy)' : '100% Client-Side Browser Processing'}
          </strong>
          <span style={{ fontSize: '12.5px', color: '#15803d', lineHeight: 1.45 }}>
            {isTa
              ? 'உங்கள் படங்களும் PDF கோப்புகளும் உங்கள் பிரவுசர் மெமரியிலேயே மாற்றப்படுகின்றன. எதுவும் சர்வருக்கு பதிவேற்றப்படுவதில்லை; பக்கத்தை மூடியவுடன் பிரவுசர் மெமரி தானாகவே காலியாகிவிடும்.'
              : 'All file inspection, resizing, compression, and PDF manipulation run locally in your browser memory. Files are never uploaded to our server and leave memory when you close or reload the page.'}
          </span>
        </div>
      </div>

      {/* Reference Matrix */}
      <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '22px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          📋 {isTa ? 'அரசுத் தேர்வுகள் மாதிரி வழிகாட்டுதல் (Reference Only)' : 'Exam Photo & Signature Reference Matrix'}
        </h2>
        <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 14px' }}>
          {isTa ? 'ஒவ்வொரு தேர்வு அறிவிப்பும் மாறுபடலாம் என்பதால் அதிகாரப்பூர்வ அறிவிப்பை சரிபார்ப்பது அவசியம்.' : 'Reference specifications shown for convenience; always check active official portal notifications.'}
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #cbd5e1' }}>
                <th style={{ padding: '10px' }}>{isTa ? 'தேர்வு / தளம்' : 'Exam / Portal'}</th>
                <th style={{ padding: '10px' }}>{isTa ? 'மாதிரி போட்டோ' : 'Photo Ref'}</th>
                <th style={{ padding: '10px' }}>{isTa ? 'மாதிரி கையொப்பம்' : 'Signature Ref'}</th>
                <th style={{ padding: '10px' }}>{isTa ? 'குறிப்பு' : 'Note'}</th>
              </tr>
            </thead>
            <tbody>
              {EXAM_PHOTO_GUIDELINES.map((g, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px', fontWeight: 700, color: '#0052cc' }}>{isTa ? g.examTa : g.exam}</td>
                  <td style={{ padding: '10px' }}>{g.photoSpec}</td>
                  <td style={{ padding: '10px' }}>{g.sigSpec}</td>
                  <td style={{ padding: '10px', color: '#b45309', fontSize: '11.5px' }}>⚠️ {isTa ? g.noteTa : g.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Instructions */}
      {tool.howTo && (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '22px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>
            📖 {isTa ? 'பயன்படுத்தும் முறை' : 'How to Use This Tool'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
            {tool.howTo.map((step) => (
              <div key={step.step} style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'inline-flex', width: '26px', height: '26px', background: '#0052cc', color: 'white', borderRadius: '50%', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>
                  {step.step}
                </span>
                <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a', marginBottom: '4px' }}>
                  {isTa ? step.titleTa : step.title}
                </strong>
                <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0 }}>{isTa ? step.textTa : step.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {tool.faqs && tool.faqs.length > 0 && (
        <div style={{ background: 'white', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '22px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={20} color="#0052cc" /> {isTa ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions'}
          </h2>
          <div style={{ display: 'grid', gap: '10px' }}>
            {tool.faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{ width: '100%', padding: '14px 16px', background: isOpen ? '#eff6ff' : 'white', border: 'none', textAlign: 'left', fontSize: '13.5px', fontWeight: 700, color: isOpen ? '#0052cc' : '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  >
                    <span>{isTa ? faq.qTa : faq.q}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {isOpen && (
                    <div style={{ padding: '14px 16px', background: 'white', fontSize: '13px', color: '#475569', lineHeight: 1.5, borderTop: '1px solid #e2e8f0' }}>
                      {isTa ? faq.aTa : faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Tools Internal Crawl Links */}
      {tool.relatedTools && tool.relatedTools.length > 0 && (
        <div style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '16px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              🔗 {isTa ? 'தொடர்புடைய பிற கருவிகள்' : 'Related Online Tools'}
            </h2>
            <SpaLink
              to="/photo-tools"
              navigate={navigate}
              scrollToTop
              style={{ background: '#0052cc', color: 'white', padding: '7px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
            >
              {isTa ? `அனைத்து ${PHOTO_TOOLS_CATALOG.length} கருவிகளையும் காண்க ➔` : `All ${PHOTO_TOOLS_CATALOG.length} Tools ➔`}
            </SpaLink>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            {tool.relatedTools.map((relId) => {
              const rel = PHOTO_TOOLS_CATALOG.find((t) => t.id === relId);
              if (!rel) return null;
              return (
                <SpaLink
                  key={rel.id}
                  to={rel.path}
                  navigate={navigate}
                  scrollToTop
                  style={{ display: 'block', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', textDecoration: 'none' }}
                >
                  <strong style={{ fontSize: '13px', color: '#0052cc', display: 'block', marginBottom: '2px' }}>
                    {isTa ? rel.titleTa.split('|')[0] : rel.title.split('|')[0]}
                  </strong>
                  <span style={{ fontSize: '11.5px', color: '#64748b', display: 'block', lineHeight: 1.35 }}>
                    {isTa ? rel.shortDescTa : rel.shortDesc}
                  </span>
                </SpaLink>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
