// server/ingestion/fetchHelper.js
import https from 'https';
import http from 'http';
import tls from 'tls';
import zlib from 'zlib';
import { INGESTION_CONFIG } from './sourcesConfig.js';
import { OFFICIAL_INTERMEDIATE_CAS } from './trustedCerts.js';

const combinedCAs = [...tls.rootCertificates, ...OFFICIAL_INTERMEDIATE_CAS];
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
 * Safe HTTP/HTTPS fetch with timeout, polite rate limiting, redirect following,
 * and strict TLS certificate verification incorporating official intermediate CAs.
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {number} [redirectCount=0]
 * @returns {Promise<{ ok: boolean, status: number, html: string, contentType: string, error?: string }>}
 */
export async function safeFetchHtml(url, options = {}, redirectCount = 0) {
  if (redirectCount === 0) {
    await enforceRateLimit(url);
  }

  if (redirectCount > 5) {
    return { ok: false, status: 310, html: '', contentType: '', error: 'Too many redirects' };
  }

  let parsed;
  try {
    parsed = new URL(url);
  } catch (err) {
    return { ok: false, status: 400, html: '', contentType: '', error: `Invalid URL: ${url}` };
  }

  const isHttps = parsed.protocol === 'https:';
  const transport = isHttps ? https : http;
  const timeoutMs = options.timeoutMs || INGESTION_CONFIG.requestTimeoutMs;

  const reqHeaders = {
    'User-Agent': options.userAgent || INGESTION_CONFIG.userAgent,
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ta;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    ...(options.headers || {})
  };

  return new Promise((resolve) => {
    const reqOptions = {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: reqHeaders,
      timeout: timeoutMs
    };

    if (isHttps) {
      reqOptions.ca = combinedCAs;
      reqOptions.rejectUnauthorized = true; // STRICT CRYPTOGRAPHIC VERIFICATION
      reqOptions.minVersion = 'TLSv1.2';
    }

    const req = transport.request(reqOptions, async (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        try {
          const nextUrl = new URL(res.headers.location, url).toString();
          const nextRes = await safeFetchHtml(nextUrl, options, redirectCount + 1);
          resolve(nextRes);
          return;
        } catch (redirErr) {
          resolve({ ok: false, status: res.statusCode, html: '', contentType: '', error: `Redirect resolution failed: ${redirErr.message}` });
          return;
        }
      }

      const chunks = [];
      res.on('data', (chunk) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      res.on('end', () => {
        const ok = res.statusCode >= 200 && res.statusCode < 300;
        let buffer = Buffer.concat(chunks);
        const encoding = (res.headers['content-encoding'] || '').toLowerCase();

        try {
          if (encoding === 'gzip') {
            buffer = zlib.gunzipSync(buffer);
          } else if (encoding === 'deflate') {
            buffer = zlib.inflateSync(buffer);
          } else if (encoding === 'br') {
            buffer = zlib.brotliDecompressSync(buffer);
          }
        } catch (_) {
          // Fallback to raw buffer if decompression fails
        }

        const data = buffer.toString('utf8');
        resolve({
          ok,
          status: res.statusCode,
          html: data,
          contentType: res.headers['content-type'] || '',
          error: ok ? undefined : `HTTP ${res.statusCode}: ${res.statusMessage || 'Request failed'}`
        });
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        ok: false,
        status: 408,
        html: '',
        contentType: '',
        error: `Request timed out after ${timeoutMs}ms`
      });
    });

    req.on('error', (err) => {
      resolve({
        ok: false,
        status: 500,
        html: '',
        contentType: '',
        error: err.message
      });
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}
