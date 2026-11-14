// src/utils/imageToolsHelper.js
// Clean HTML5 Canvas image processing helpers (100% browser-local, zero blank fallbacks)

export const MAX_IMAGE_BYTES = 30 * 1024 * 1024; // 30 MB guard for browser canvas safety
export const SUPPORTED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/bmp'
]);

export function validateImageFile(file, maxBytes = MAX_IMAGE_BYTES) {
  if (!file) throw new Error('No file selected.');
  if (file.size === 0) throw new Error('The selected image file is empty (0 bytes).');
  if (file.size > maxBytes) {
    throw new Error(`Image size exceeds ${Math.round(maxBytes / (1024 * 1024))} MB safety limit.`);
  }
  const type = String(file.type || '').toLowerCase();
  const extOk = /\.(jpe?g|png|webp|bmp)$/i.test(file.name || '');
  if (type && !SUPPORTED_IMAGE_MIMES.has(type) && !extOk) {
    throw new Error(`Unsupported file format (${type || file.name}). Please upload JPG, PNG, WEBP, or BMP.`);
  }
  return true;
}

export function estimateDataUrlSizeKb(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return 0;
  const base64 = dataUrl.split(',')[1] || '';
  if (!base64) return 0;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const bytes = Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
  return Math.max(1, Math.round(bytes / 1024));
}

export function estimateDataUrlBytes(dataUrl) {
  if (!dataUrl || typeof dataUrl !== 'string') return 0;
  const base64 = dataUrl.split(',')[1] || '';
  if (!base64) return 0;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
}

export function drawImageAspectCover(context, image, dx, dy, dWidth, dHeight) {
  const imgW = image.naturalWidth || image.width || 1;
  const imgH = image.naturalHeight || image.height || 1;
  const imgAspect = imgW / imgH;
  const targetAspect = dWidth / dHeight;

  let sx = 0;
  let sy = 0;
  let sw = imgW;
  let sh = imgH;

  if (imgAspect > targetAspect) {
    sw = imgH * targetAspect;
    sx = (imgW - sw) / 2;
  } else {
    sh = imgW / targetAspect;
    sy = Math.max(0, (imgH - sh) * 0.22);
  }

  context.drawImage(image, sx, sy, sw, sh, dx, dy, dWidth, dHeight);
}

/**
 * Pure binary search JPEG quality compression without ever overwriting image with a blank rectangle.
 * If even minimum readable quality/scale still exceeds targetKb, returns targetMet: false with honest details.
 */
export function compressCanvasToTargetKb(sourceCanvas, targetKb, {
  allowDimensionScale = true,
  minDimensionPx = 180,
  preserveExactDimensions = false
} = {}) {
  const targetBytes = Math.max(4, Number(targetKb) || 50) * 1024;
  const srcW = sourceCanvas.width;
  const srcH = sourceCanvas.height;

  const tryBinaryQuality = (canvas) => {
    let highData = canvas.toDataURL('image/jpeg', 0.94);
    if (estimateDataUrlBytes(highData) <= targetBytes) {
      return { dataUrl: highData, bytes: estimateDataUrlBytes(highData), hit: true };
    }

    let low = 0.08;
    let high = 0.94;
    let bestUnder = null;
    let lowestBytesData = highData;
    let lowestBytes = estimateDataUrlBytes(highData);

    for (let i = 0; i < 8; i++) {
      const mid = (low + high) / 2;
      const attempt = canvas.toDataURL('image/jpeg', mid);
      const b = estimateDataUrlBytes(attempt);
      if (b < lowestBytes) {
        lowestBytes = b;
        lowestBytesData = attempt;
      }
      if (b <= targetBytes) {
        bestUnder = { dataUrl: attempt, bytes: b, hit: true };
        low = mid;
      } else {
        high = mid;
      }
    }

    if (bestUnder) return bestUnder;
    return { dataUrl: lowestBytesData, bytes: lowestBytes, hit: false };
  };

  let result = tryBinaryQuality(sourceCanvas);
  let outW = srcW;
  let outH = srcH;

  if (!result.hit && allowDimensionScale && !preserveExactDimensions) {
    let scaleFactor = 0.85;
    for (let step = 0; step < 5; step++) {
      const nextW = Math.round(srcW * scaleFactor);
      const nextH = Math.round(srcH * scaleFactor);
      if (Math.min(nextW, nextH) < minDimensionPx) break;

      const tmpCanvas = document.createElement('canvas');
      tmpCanvas.width = nextW;
      tmpCanvas.height = nextH;
      const tCtx = tmpCanvas.getContext('2d');
      tCtx.fillStyle = '#ffffff';
      tCtx.fillRect(0, 0, nextW, nextH);
      tCtx.drawImage(sourceCanvas, 0, 0, nextW, nextH);

      const attempt = tryBinaryQuality(tmpCanvas);
      if (attempt.bytes < result.bytes) {
        result = attempt;
        outW = nextW;
        outH = nextH;
      }
      if (attempt.hit) break;
      scaleFactor *= 0.78;
    }
  }

  return {
    dataUrl: result.dataUrl,
    sizeKb: Math.max(1, Math.round(result.bytes / 1024)),
    sizeBytes: result.bytes,
    targetKb: Number(targetKb) || 50,
    targetMet: result.hit,
    width: outW,
    height: outH
  };
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

/**
 * Samples actual corner pixels of the photo to determine existing backdrop color,
 * removes connected border background within color tolerance, and paints targetBgHex underneath.
 */
export function replaceCornerBackgroundColor(sourceCanvas, targetBgHex = '#ffffff', tolerance = 48) {
  const maxBgDim = 1400;
  let w = sourceCanvas.width;
  let h = sourceCanvas.height;
  if (Math.max(w, h) > maxBgDim) {
    const scale = maxBgDim / Math.max(w, h);
    w = Math.max(1, Math.round(w * scale));
    h = Math.max(1, Math.round(h * scale));
  }
  const workCanvas = document.createElement('canvas');
  workCanvas.width = w;
  workCanvas.height = h;
  const ctx = workCanvas.getContext('2d');
  ctx.drawImage(sourceCanvas, 0, 0, w, h);

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  // Sample average top-left and top-right corners (safest backdrop areas on portraits)
  const samplePoints = [
    [2, 2],
    [Math.max(0, w - 3), 2],
    [2, Math.floor(h * 0.15)],
    [Math.max(0, w - 3), Math.floor(h * 0.15)]
  ];

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let count = 0;

  for (const [sx, sy] of samplePoints) {
    if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
      const pi = (sy * w + sx) * 4;
      if (data[pi + 3] > 20) {
        sumR += data[pi];
        sumG += data[pi + 1];
        sumB += data[pi + 2];
        count++;
      }
    }
  }

  // If image already has transparent border pixels, simply composite onto target background
  if (count === 0) {
    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const octx = outCanvas.getContext('2d');
    octx.fillStyle = targetBgHex;
    octx.fillRect(0, 0, w, h);
    octx.drawImage(workCanvas, 0, 0);
    return { canvas: outCanvas, sampledRgb: null, pixelsReplaced: 0 };
  }

  const bgR = Math.round(sumR / count);
  const bgG = Math.round(sumG / count);
  const bgB = Math.round(sumB / count);

  const visited = new Uint8Array(w * h);
  const queue = [];

  // Seed flood fill strictly along outer perimeter borders (so inner eyes/teeth/clothes stay intact)
  const addSeed = (x, y) => {
    const idx = y * w + x;
    if (visited[idx]) return;
    const pi = idx * 4;
    if (data[pi + 3] === 0 || colorDistance(data[pi], data[pi + 1], data[pi + 2], bgR, bgG, bgB) <= tolerance) {
      visited[idx] = 1;
      queue.push(x, y);
    }
  };

  for (let x = 0; x < w; x++) {
    addSeed(x, 0);
    addSeed(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    addSeed(0, y);
    addSeed(w - 1, y);
  }

  let head = 0;
  let replaced = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const idx = cy * w + cx;
    const pi = idx * 4;

    const dist = colorDistance(data[pi], data[pi + 1], data[pi + 2], bgR, bgG, bgB);
    if (dist > tolerance * 0.72) {
      // Soft feather alpha on fringe pixels
      const ratio = Math.min(1, (dist - tolerance * 0.72) / (tolerance * 0.28 + 1));
      data[pi + 3] = Math.round(data[pi + 3] * ratio);
    } else {
      data[pi + 3] = 0;
    }
    replaced++;

    if (cx + 1 < w) addSeed(cx + 1, cy);
    if (cx - 1 >= 0) addSeed(cx - 1, cy);
    if (cy + 1 < h) addSeed(cx, cy + 1);
    if (cy - 1 >= 0) addSeed(cx, cy - 1);
  }

  ctx.putImageData(imageData, 0, 0);

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = w;
  finalCanvas.height = h;
  const fctx = finalCanvas.getContext('2d');
  fctx.fillStyle = targetBgHex;
  fctx.fillRect(0, 0, w, h);
  fctx.drawImage(workCanvas, 0, 0);

  return {
    canvas: finalCanvas,
    sampledRgb: [bgR, bgG, bgB],
    pixelsReplaced: replaced
  };
}
