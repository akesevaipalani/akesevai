// server/ingestion/fetchHelper.js
import { INGESTION_CONFIG } from './sourcesConfig.js';

const lastDomainAccessMap = new Map();

/**
 * Delays execution to ensure polite rate limiting per domain
 */
async function enforceRateLimit(url) {
  try {
    const domain = new URL(url).hostname;
    const now = Date.now();
    const lastAccess = lastDomainAccessMap.get(domain) || 0;
    const elapsed = now - lastAccess;

    if (elapsed < INGESTION_CONFIG.rateLimitDelayMs) {
      const waitTime = INGESTION_CONFIG.rateLimitDelayMs - elapsed;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
    lastDomainAccessMap.set(domain, Date.now());
  } catch (e) {}
}

/**
 * Safe HTTP fetch with timeout, headers, retry, and error insulation
 * @param {string} url
 * @param {Object} options
 * @returns {Promise<{ ok: boolean, status: number, html: string, error?: string }>}
 */
export async function safeFetchHtml(url, options = {}) {
  await enforceRateLimit(url);

  const timeoutMs = options.timeoutMs || INGESTION_CONFIG.requestTimeoutMs;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const headers = {
    'User-Agent': INGESTION_CONFIG.userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ta;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
      redirect: 'follow'
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        html: '',
        error: `HTTP ${res.status}: ${res.statusText}`
      };
    }

    const html = await res.text();
    return {
      ok: true,
      status: res.status,
      html,
      contentType: res.headers.get('content-type') || ''
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    return {
      ok: false,
      status: isTimeout ? 408 : 500,
      html: '',
      error: isTimeout ? `Request timed out after ${timeoutMs}ms` : err.message
    };
  }
}
