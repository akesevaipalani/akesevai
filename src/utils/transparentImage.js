// Converts white/light background images to transparent PNG Data URLs in browser Canvas
const cache = new Map();

export function makeImageTransparent(src, threshold = 230) {
  if (cache.has(src)) return Promise.resolve(cache.get(src));

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // 1. Remove white and light-grey background pixels
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Background is pure/near white or light grey floor shadow
        if (r > 220 && g > 220 && b > 220) {
          data[i + 3] = 0;
        } else if (r > 200 && g > 200 && b > 200) {
          // Feather edges smoothly
          const factor = Math.max(0, (220 - (r + g + b) / 3) / 20);
          data[i + 3] = Math.round(data[i + 3] * factor);
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentDataUrl = canvas.toDataURL('image/png');
      cache.set(src, transparentDataUrl);
      resolve(transparentDataUrl);
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}
