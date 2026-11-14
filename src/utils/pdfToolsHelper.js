// src/utils/pdfToolsHelper.js
// Pure client-side PDF utilities using dynamically loaded pdf-lib & pdfjs-dist (0 server uploads)

export const MAX_PDF_BYTES = 40 * 1024 * 1024; // 40 MB safety cap for mobile browser RAM

async function toUint8Array(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (input && typeof input.arrayBuffer === 'function') {
    return new Uint8Array(await input.arrayBuffer());
  }
  throw new Error('Invalid PDF input source');
}

export async function validatePdfInput(input, maxBytes = MAX_PDF_BYTES) {
  const bytes = await toUint8Array(input);
  if (!bytes || bytes.byteLength === 0) {
    throw new Error('The selected PDF file is empty (0 bytes).');
  }
  if (bytes.byteLength > maxBytes) {
    throw new Error(`File size exceeds ${Math.round(maxBytes / (1024 * 1024))} MB browser safety limit.`);
  }
  const headerSlice = new TextDecoder('ascii').decode(bytes.subarray(0, 1024));
  if (!headerSlice.includes('%PDF-')) {
    throw new Error('Invalid file format: File does not start with a valid %PDF header.');
  }
  return bytes;
}

async function getPdfLib() {
  return await import('pdf-lib');
}

let cachedWorkerConfigured = false;
async function getPdfJs() {
  const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
  const pdfjs = isBrowser
    ? await import('pdfjs-dist')
    : await import('pdfjs-dist/legacy/build/pdf.mjs');

  if (isBrowser && pdfjs.GlobalWorkerOptions && !cachedWorkerConfigured) {
    const workerMod = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
    pdfjs.GlobalWorkerOptions.workerSrc = workerMod.default;
    cachedWorkerConfigured = true;
  }
  return pdfjs;
}

export function formatPdfErrorMessage(err, isTa = false) {
  const raw = String(err?.message || err || '');
  const low = raw.toLowerCase();

  if (low.includes('password-protected') || low.includes('encrypted') || low.includes('encrypt')) {
    return isTa
      ? 'இந்த PDF கடவுச்சொல் பூட்டு (Encrypted/Password) கொண்டுள்ளது. பூட்டப்படாத PDF கோப்பைப் பதிவேற்றவும்.'
      : 'This PDF is password-protected/encrypted. Please remove restrictions and upload an unencrypted PDF.';
  }
  if (low.includes('empty (0 bytes)')) {
    return isTa
      ? 'தேர்ந்தெடுக்கப்பட்ட PDF கோப்பு காலியாக (0 bytes) உள்ளது.'
      : 'The selected PDF file is empty (0 bytes).';
  }
  if (low.includes('%pdf header') || low.includes('invalid file format')) {
    return isTa
      ? 'செல்லாத PDF வடிவம்: இந்தக் கோப்பு சரியான PDF கோப்பாகத் தெரியவில்லை.'
      : 'Invalid file format: File does not start with a valid %PDF header.';
  }
  if (low.includes('exceeds') && low.includes('safety limit')) {
    return isTa
      ? 'PDF கோப்பின் அளவு 40 MB பிரவுசர் வரம்பை விட அதிகமாக உள்ளது.'
      : raw;
  }
  if (
    low.includes('corrupt') ||
    low.includes('/pages') ||
    low.includes('catalog') ||
    low.includes('parse') ||
    low.includes('cannot read properties') ||
    low.includes('unexpected end') ||
    low.includes('invalid object') ||
    low.includes('no pages')
  ) {
    return isTa
      ? 'இந்த PDF கோப்பைப் படிக்க முடியவில்லை. கோப்பு சேதமடைந்திருக்கலாம் அல்லது /Pages அமைப்பு தவறாக இருக்கலாம்.'
      : 'Could not parse this PDF file. The PDF catalog or /Pages structure appears corrupted or unsupported.';
  }
  return raw || (isTa ? 'PDF செயலாக்கத்தில் பிழை ஏற்பட்டது.' : 'Failed to process PDF.');
}

function mapPdfProcessingError(err) {
  const raw = String(err?.message || '');
  const low = raw.toLowerCase();
  if (low.includes('password') || low.includes('encrypt')) {
    return new Error('This PDF is password-protected / encrypted. Please remove restrictions before uploading.');
  }
  if (
    err instanceof TypeError ||
    low.includes('cannot read properties') ||
    low.includes('undefined') ||
    low.includes('null') ||
    low.includes('parse') ||
    low.includes('corrupt') ||
    low.includes('xref') ||
    low.includes('catalog') ||
    low.includes('trailer')
  ) {
    return new Error('Could not parse this PDF file. The catalog or /Pages structure appears corrupted or unsupported.');
  }
  return err instanceof Error ? err : new Error(raw || 'Failed to parse PDF document.');
}

export async function loadPdfDocumentSafe(bytes) {
  const { PDFDocument } = await getPdfLib();
  try {
    const doc = await PDFDocument.load(bytes);
    if (doc.isEncrypted) {
      throw new Error('This PDF is password-protected / encrypted. Please remove restrictions before uploading.');
    }
    const pageCount = doc.getPageCount();
    const pages = doc.getPages();
    if (!Number.isInteger(pageCount) || pageCount < 1 || !Array.isArray(pages) || pages.length < 1) {
      throw new Error('Could not parse this PDF file. The catalog or /Pages structure appears corrupted or unsupported.');
    }
    for (const p of pages) {
      if (!p || !p.node) {
        throw new Error('Could not parse this PDF file. Invalid page tree node.');
      }
      p.getSize();
    }
    return doc;
  } catch (err) {
    throw mapPdfProcessingError(err);
  }
}

export function parsePageRange(rangeText, totalPages) {
  const raw = String(rangeText || '').trim();
  if (!raw) {
    throw new Error(`Please enter page numbers (e.g., 1-${Math.min(2, totalPages)}). Total pages: ${totalPages}.`);
  }

  const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
  const selected = [];
  const seen = new Set();

  for (const part of parts) {
    const rangeMatch = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      if (start < 1 || end < 1 || start > end || end > totalPages) {
        throw new Error(`Invalid range "${part}". Must be between 1 and ${totalPages}.`);
      }
      for (let p = start; p <= end; p++) {
        if (!seen.has(p - 1)) {
          seen.add(p - 1);
          selected.push(p - 1);
        }
      }
    } else if (/^\d+$/.test(part)) {
      const pageNum = parseInt(part, 10);
      if (pageNum < 1 || pageNum > totalPages) {
        throw new Error(`Page ${pageNum} is out of bounds. Document has ${totalPages} page(s).`);
      }
      if (!seen.has(pageNum - 1)) {
        seen.add(pageNum - 1);
        selected.push(pageNum - 1);
      }
    } else {
      throw new Error(`Invalid page syntax "${part}". Use formats like "1, 3, 4-6".`);
    }
  }

  if (selected.length === 0) {
    throw new Error('No valid pages selected.');
  }
  return selected;
}

function detectPaperSize(wMm, hMm) {
  const minD = Math.min(wMm, hMm);
  const maxD = Math.max(wMm, hMm);
  if (Math.abs(minD - 210) <= 5 && Math.abs(maxD - 297) <= 5) return 'A4';
  if (Math.abs(minD - 216) <= 5 && Math.abs(maxD - 279) <= 5) return 'Letter';
  if (Math.abs(minD - 216) <= 5 && Math.abs(maxD - 356) <= 5) return 'Legal';
  return `${Math.round(wMm)} × ${Math.round(hMm)} mm`;
}

export async function inspectPdfDocument(input, fileName = 'document.pdf') {
  const bytes = await validatePdfInput(input);
  const sizeBytes = bytes.byteLength;
  const sizeKb = Math.round(sizeBytes / 1024);

  try {
    const pdf = await loadPdfDocumentSafe(bytes);
    const pages = pdf.getPages();
    const pagesInfo = pages.map((p, idx) => {
      const { width, height } = p.getSize();
      const widthMm = +(width * 0.352778).toFixed(1);
      const heightMm = +(height * 0.352778).toFixed(1);
      return {
        pageNumber: idx + 1,
        widthPt: Math.round(width),
        heightPt: Math.round(height),
        widthMm,
        heightMm,
        paperMatch: detectPaperSize(widthMm, heightMm),
        rotation: p.getRotation().angle
      };
    });

    return {
      fileName,
      format: 'application/pdf',
      isEncrypted: false,
      pageCount: pages.length,
      sizeBytes,
      sizeKb,
      pagesInfo
    };
  } catch (err) {
    if (String(err.message).includes('password-protected')) {
      return {
        fileName,
        format: 'application/pdf',
        isEncrypted: true,
        pageCount: null,
        sizeBytes,
        sizeKb,
        pagesInfo: []
      };
    }
    throw err;
  }
}

export async function mergePdfFiles(files) {
  if (!Array.isArray(files) || files.length < 2) {
    throw new Error('Please select at least 2 valid PDF files to merge.');
  }
  const { PDFDocument } = await getPdfLib();
  const mergedPdf = await PDFDocument.create();
  let expectedPages = 0;

  try {
    for (const f of files) {
      const bytes = await validatePdfInput(f);
      const srcPdf = await loadPdfDocumentSafe(bytes);
      const indices = srcPdf.getPageIndices();
      expectedPages += indices.length;
      const copiedPages = await mergedPdf.copyPages(srcPdf, indices);
      copiedPages.forEach((p) => mergedPdf.addPage(p));
    }

    const outBytes = await mergedPdf.save();
    if (mergedPdf.getPageCount() !== expectedPages) {
      throw new Error('Output verification failed: merged page count mismatch.');
    }

    return {
      bytes: outBytes,
      pageCount: mergedPdf.getPageCount(),
      sizeBytes: outBytes.byteLength,
      sizeKb: Math.max(1, Math.round(outBytes.byteLength / 1024))
    };
  } catch (err) {
    throw mapPdfProcessingError(err);
  }
}

export async function extractPdfPages(input, rangeText) {
  const bytes = await validatePdfInput(input);
  const { PDFDocument } = await getPdfLib();
  const srcPdf = await loadPdfDocumentSafe(bytes);
  const totalPages = srcPdf.getPageCount();
  const indices = parsePageRange(rangeText, totalPages);

  try {
    const outPdf = await PDFDocument.create();
    const copied = await outPdf.copyPages(srcPdf, indices);
    copied.forEach((p) => outPdf.addPage(p));

    const outBytes = await outPdf.save();
    return {
      bytes: outBytes,
      pageCount: outPdf.getPageCount(),
      totalSourcePages: totalPages,
      extractedPageNumbers: indices.map((i) => i + 1),
      sizeBytes: outBytes.byteLength,
      sizeKb: Math.max(1, Math.round(outBytes.byteLength / 1024))
    };
  } catch (err) {
    throw mapPdfProcessingError(err);
  }
}

export async function splitPdfDocument(input, mode = 'all', segmentsText = '') {
  const bytes = await validatePdfInput(input);
  const { PDFDocument } = await getPdfLib();
  const srcPdf = await loadPdfDocumentSafe(bytes);
  const totalPages = srcPdf.getPageCount();

  if (totalPages < 1) {
    throw new Error('Source PDF contains no pages.');
  }

  const outputs = [];
  if (mode === 'all') {
    try {
      for (let i = 0; i < totalPages; i++) {
        const partPdf = await PDFDocument.create();
        const [copied] = await partPdf.copyPages(srcPdf, [i]);
        partPdf.addPage(copied);
        const partBytes = await partPdf.save();
        outputs.push({
          label: `Page ${i + 1}`,
          fileNameSuffix: `page_${i + 1}`,
          pageCount: 1,
          bytes: partBytes,
          sizeKb: Math.max(1, Math.round(partBytes.byteLength / 1024))
        });
      }
      return { totalSourcePages: totalPages, outputs };
    } catch (err) {
      throw mapPdfProcessingError(err);
    }
  }

  // Semicolon-separated groups, e.g. "1-2; 3-5" or comma-separated individual ranges
  const groups = String(segmentsText || '')
    .split(/[;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (groups.length === 0) {
    throw new Error('Please enter page groups separated by semicolons, e.g., "1-2; 3-4".');
  }

  for (let idx = 0; idx < groups.length; idx++) {
    const indices = parsePageRange(groups[idx], totalPages);
    try {
      const partPdf = await PDFDocument.create();
      const copied = await partPdf.copyPages(srcPdf, indices);
      copied.forEach((p) => partPdf.addPage(p));
      const partBytes = await partPdf.save();
      outputs.push({
        label: `Part ${idx + 1} (Pages ${groups[idx]})`,
        fileNameSuffix: `part_${idx + 1}`,
        pageCount: copied.length,
        bytes: partBytes,
        sizeKb: Math.max(1, Math.round(partBytes.byteLength / 1024))
      });
    } catch (err) {
      throw mapPdfProcessingError(err);
    }
  }

  return { totalSourcePages: totalPages, outputs };
}

export async function rotatePdfPages(input, angleDeg = 90, rangeText = '') {
  const bytes = await validatePdfInput(input);
  const { degrees } = await getPdfLib();
  const pdfDoc = await loadPdfDocumentSafe(bytes);
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  const normalizedAdd = ((angleDeg % 360) + 360) % 360;
  if (![90, 180, 270].includes(normalizedAdd)) {
    throw new Error('Rotation angle must be 90, 180, or 270 degrees.');
  }

  const targetIndices = rangeText && rangeText.trim()
    ? parsePageRange(rangeText, totalPages)
    : pages.map((_, idx) => idx);

  try {
    for (const idx of targetIndices) {
      const page = pages[idx];
      const current = page.getRotation().angle || 0;
      const nextAngle = (current + normalizedAdd) % 360;
      page.setRotation(degrees(nextAngle));
    }

    const outBytes = await pdfDoc.save();
    return {
      bytes: outBytes,
      pageCount: totalPages,
      rotatedPageNumbers: targetIndices.map((i) => i + 1),
      sizeBytes: outBytes.byteLength,
      sizeKb: Math.max(1, Math.round(outBytes.byteLength / 1024))
    };
  } catch (err) {
    throw mapPdfProcessingError(err);
  }
}

export async function renderPdfPagesToImages(input, options = {}) {
  const {
    format = 'jpeg',
    scale = 2.0,
    quality = 0.9,
    maxPagesToRender = 30
  } = options;

  const bytes = await validatePdfInput(input);
  const pdfjs = await getPdfJs();

  let loadingTask;
  try {
    loadingTask = pdfjs.getDocument({ data: bytes.slice(), disableAutoFetch: true });
  } catch (err) {
    throw new Error(`Unable to initialize PDF renderer: ${err.message}`);
  }

  let pdfDoc;
  try {
    pdfDoc = await loadingTask.promise;
  } catch (err) {
    const msg = String(err?.message || '').toLowerCase();
    if (msg.includes('password') || msg.includes('encrypt')) {
      throw new Error('This PDF is password-protected / encrypted and cannot be rendered.');
    }
    throw new Error('Invalid or corrupted PDF file.');
  }

  const numPages = pdfDoc.numPages;
  const limit = Math.min(numPages, maxPagesToRender);
  const rendered = [];
  const mime = format === 'png' ? 'image/png' : 'image/jpeg';

  for (let pageNum = 1; pageNum <= limit; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL(mime, format === 'jpeg' ? quality : undefined);
    const base64Len = dataUrl.split(',')[1]?.length || 0;
    const sizeKb = Math.max(1, Math.round((base64Len * 3) / 4 / 1024));

    rendered.push({
      pageNumber: pageNum,
      width: canvas.width,
      height: canvas.height,
      dataUrl,
      sizeKb,
      format: format === 'png' ? 'png' : 'jpg'
    });
  }

  return {
    totalPages: numPages,
    renderedPages: rendered,
    truncated: numPages > limit
  };
}

export async function compressPdfClient(input, { qualityPreset = 'medium', targetKb = null } = {}) {
  const originalBytes = await validatePdfInput(input);
  const originalSizeBytes = originalBytes.byteLength;
  const originalSizeKb = Math.max(1, Math.round(originalSizeBytes / 1024));

  // Verify it is not encrypted first
  await loadPdfDocumentSafe(originalBytes);

  const presets = {
    high: { scale: 1.5, quality: 0.78 },
    medium: { scale: 1.2, quality: 0.58 },
    extreme: { scale: 0.95, quality: 0.38 }
  };

  let { scale, quality } = presets[qualityPreset] || presets.medium;

  const { PDFDocument } = await getPdfLib();

  const buildRasterizedPdf = async (sc, q) => {
    const rendered = await renderPdfPagesToImages(originalBytes, {
      format: 'jpeg',
      scale: sc,
      quality: q,
      maxPagesToRender: 40
    });
    if (rendered.truncated) {
      throw new Error('PDF exceeds 40 pages; splitting into smaller parts is recommended before browser compression.');
    }

    const outDoc = await PDFDocument.create();
    for (const pg of rendered.renderedPages) {
      const jpgData = Uint8Array.from(atob(pg.dataUrl.split(',')[1]), (c) => c.charCodeAt(0));
      const embedded = await outDoc.embedJpg(jpgData);
      // Maintain natural A4-proportional point sizing relative to rendered scale
      const ptW = pg.width / sc;
      const ptH = pg.height / sc;
      const page = outDoc.addPage([ptW, ptH]);
      page.drawImage(embedded, { x: 0, y: 0, width: ptW, height: ptH });
    }
    return await outDoc.save();
  };

  let bestBytes = await buildRasterizedPdf(scale, quality);

  // If user requested an explicit target KB (e.g. 100 KB / 200 KB) and output is still larger, run bounded refinement
  if (targetKb && bestBytes.byteLength > targetKb * 1024) {
    const candidates = [
      { scale: 1.05, quality: 0.45 },
      { scale: 0.85, quality: 0.32 }
    ];
    for (const c of candidates) {
      const attempt = await buildRasterizedPdf(c.scale, c.quality);
      if (attempt.byteLength < bestBytes.byteLength) {
        bestBytes = attempt;
      }
      if (bestBytes.byteLength <= targetKb * 1024) break;
    }
  }

  // Never ship a "compressed" PDF that ended up larger than the original!
  if (bestBytes.byteLength >= originalSizeBytes) {
    return {
      bytes: originalBytes,
      preservedOriginal: true,
      originalSizeBytes,
      originalSizeKb,
      outputSizeBytes: originalSizeBytes,
      outputSizeKb: originalSizeKb,
      targetMet: targetKb ? originalSizeKb <= targetKb : true,
      reason: 'already-minimal'
    };
  }

  const outKb = Math.max(1, Math.round(bestBytes.byteLength / 1024));
  return {
    bytes: bestBytes,
    preservedOriginal: false,
    originalSizeBytes,
    originalSizeKb,
    outputSizeBytes: bestBytes.byteLength,
    outputSizeKb: outKb,
    targetMet: targetKb ? outKb <= targetKb : true,
    reason: 'compressed'
  };
}
