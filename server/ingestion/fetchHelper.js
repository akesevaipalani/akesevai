// server/ingestion/fetchHelper.js
import https from 'https';
import http from 'http';
import net from 'net';
import tls from 'tls';
import dns from 'dns';
import zlib from 'zlib';
import { INGESTION_CONFIG } from './sourcesConfig.js';
import { OFFICIAL_INTERMEDIATE_CAS } from './trustedCerts.js';
import { isBlockedIp, isShortenerHost, validateExplicitSourceUrl } from './officialDomainPolicy.js';

const combinedCAs = [...tls.rootCertificates, ...OFFICIAL_INTERMEDIATE_CAS];
const lastDomainAccessMap = new Map();

export const VERIFY_LIMITS = {
  SCRAPE_TIMEOUT_MS: 15000,
  VERIFY_TIMEOUT_MS: 10000,
  MAX_REDIRECTS: 3,
  PDF_RANGE_BYTES: 65536, // 64 KB polite Range request for PDF prefix probe
  MAX_VERIFY_STREAM_BYTES: 262144, // 256 KB hard socket kill-switch even if origin ignores Range
  MAX_HTML_SCRAPE_BYTES: 5 * 1024 * 1024, // 5 MB max response for HTML index scraping
  MAX_DECLARED_PDF_BYTES: 50 * 1024 * 1024 // 50 MB declared upper bound before refusing remote PDF
};

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
  } catch (_) {}
}

function normalizeLookupResults(res, familyArg) {
  if (Array.isArray(res)) {
    return res.map((r) => ({ address: r.address, family: r.family || (String(r.address).includes(':') ? 6 : 4) }));
  }
  if (res && typeof res === 'object' && res.address) {
    return [{ address: res.address, family: res.family || familyArg || (String(res.address).includes(':') ? 6 : 4) }];
  }
  if (typeof res === 'string') {
    return [{ address: res, family: familyArg || (res.includes(':') ? 6 : 4) }];
  }
  return [];
}

/**
 * Resolves a hostname ONCE and verifies every resolved address is public/safe.
 * Returns a single pinned { address, family } for socket connection so DNS cannot rebind.
 */
export async function resolveAndPinPublicIp(hostname, customDnsLookup = null) {
  const resolver = typeof customDnsLookup === 'function'
    ? customDnsLookup
    : (h, opts) => dns.promises.lookup(h, opts);

  const raw = await resolver(hostname, { all: true });
  const records = normalizeLookupResults(raw);

  if (!records.length) {
    const err = new Error(`DNS resolution returned no addresses for ${hostname}`);
    err.code = 'DNS_EMPTY';
    throw err;
  }

  for (const rec of records) {
    if (isBlockedIp(rec.address)) {
      const err = new Error(`SSRF_BLOCKED_IP: Resolved IP ${rec.address} for ${hostname} is in a forbidden private/loopback/metadata range`);
      err.code = 'SSRF_BLOCKED_IP';
      err.blockedIp = rec.address;
      throw err;
    }
  }

  // Prefer IPv4 when multiple public addresses are returned (matches dns.setDefaultResultOrder ipv4first)
  const ipv4 = records.find((r) => r.family === 4);
  return ipv4 || records[0];
}

/**
 * Creates a single-shot DNS-pinned lookup handler passed directly to Node http/https.request({ lookup }).
 * Guarantees TCP sockets connect ONLY to the verified public IP while keeping TLS hostname/SNI intact.
 */
export function createPinnedLookup(expectedHostname, prePinned = null, customDnsLookup = null) {
  let cachedPin = prePinned;
  let resolvingPromise = null;

  return function pinnedSocketLookup(reqHost, opts, cb) {
    const callback = typeof opts === 'function' ? opts : cb;
    const lookupOpts = typeof opts === 'object' && opts !== null ? opts : {};

    const cleanReqHost = String(reqHost || '').toLowerCase().replace(/\.+$/, '');
    if (cleanReqHost !== String(expectedHostname || '').toLowerCase().replace(/\.+$/, '')) {
      const err = new Error(`DNS_HOST_MISMATCH: Expected ${expectedHostname} but socket requested ${reqHost}`);
      err.code = 'SSRF_HOST_MISMATCH';
      return callback(err);
    }

    const replyWithPin = (pin) => {
      if (lookupOpts.all) {
        return callback(null, [{ address: pin.address, family: pin.family }]);
      }
      return callback(null, pin.address, pin.family);
    };

    if (cachedPin) {
      return replyWithPin(cachedPin);
    }

    if (!resolvingPromise) {
      resolvingPromise = resolveAndPinPublicIp(expectedHostname, customDnsLookup)
        .then((pin) => {
          cachedPin = pin;
          return pin;
        });
    }

    resolvingPromise
      .then((pin) => replyWithPin(pin))
      .catch((err) => callback(err));
  };
}

function decompressBuffer(buffer, contentEncoding) {
  const encoding = (contentEncoding || '').toLowerCase().trim();
  try {
    if (encoding === 'gzip') return zlib.gunzipSync(buffer);
    if (encoding === 'deflate') return zlib.inflateSync(buffer);
    if (encoding === 'br') return zlib.brotliDecompressSync(buffer);
  } catch (_) {}
  return buffer;
}

/**
 * Pre-flight security validation for any outbound URL or redirect target.
 */
function validateOutboundTarget(urlStr, options = {}) {
  if (options.sourceKey) {
    return validateExplicitSourceUrl(urlStr, options.sourceKey, 'notice', {
      allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
    });
  }

  // Generic SSRF hygiene even when called without sourceKey
  let parsed;
  try {
    parsed = new URL(String(urlStr || '').trim());
  } catch {
    return { valid: false, reason: 'MALFORMED_URL', severity: 'quarantine', parsedUrl: null, host: '', protocol: '' };
  }

  const protocol = parsed.protocol.toLowerCase();
  const allowHttp = Boolean(options.allowHttpForLocalMock);
  if (protocol !== 'https:' && !(allowHttp && protocol === 'http:')) {
    return { valid: false, reason: 'NON_HTTPS_URL', severity: 'quarantine', parsedUrl: parsed, host: parsed.hostname.toLowerCase(), protocol };
  }
  if (parsed.username || parsed.password) {
    return { valid: false, reason: 'URL_CREDENTIALS_FORBIDDEN', severity: 'quarantine', parsedUrl: parsed, host: parsed.hostname.toLowerCase(), protocol };
  }
  const host = parsed.hostname.toLowerCase().replace(/\.+$/, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    return { valid: false, reason: 'INTERNAL_HOST_FORBIDDEN', severity: 'quarantine', parsedUrl: parsed, host, protocol };
  }
  if (isShortenerHost(host)) {
    return { valid: false, reason: 'URL_SHORTENER_FORBIDDEN', severity: 'quarantine', parsedUrl: parsed, host, protocol };
  }
  if (net.isIP(host.replace(/^\[|\]$/g, '')) !== 0) {
    return { valid: false, reason: 'IP_LITERAL_FORBIDDEN', severity: 'quarantine', parsedUrl: parsed, host, protocol };
  }
  if (parsed.port && !((protocol === 'https:' && parsed.port === '443') || (allowHttp && protocol === 'http:'))) {
    return { valid: false, reason: 'NON_STANDARD_PORT', severity: 'quarantine', parsedUrl: parsed, host, protocol };
  }

  return { valid: true, parsedUrl: parsed, host, protocol };
}

/**
 * Core SSRF-safe HTTP/HTTPS fetch with:
 * - Total wall-clock timeout across redirects and streaming
 * - Hard maximum response byte cap
 * - DNS IP pinning & private/loopback/metadata IP blocking
 * - Strict TLS certificate verification with bundled government intermediate CAs
 * - Hop-by-hop redirect revalidation (max 3 redirects)
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {number} [redirectCount=0]
 */
export async function safeFetchHtml(url, options = {}, redirectCount = 0) {
  const maxRedirects = typeof options.maxRedirects === 'number' ? options.maxRedirects : VERIFY_LIMITS.MAX_REDIRECTS;
  const wallClockMs = options.timeoutMs || VERIFY_LIMITS.SCRAPE_TIMEOUT_MS;
  const startedAtMs = options._startedAtMs || Date.now();
  const maxBytes = options.maxBytes || VERIFY_LIMITS.MAX_HTML_SCRAPE_BYTES;
  const redirectChain = options._redirectChain || [url];

  if (redirectCount === 0 && !options.skipRateLimit) {
    await enforceRateLimit(url);
  }

  if (redirectCount > maxRedirects) {
    return {
      ok: false,
      status: 310,
      html: '',
      buffer: Buffer.alloc(0),
      contentType: '',
      headers: {},
      finalUrl: url,
      redirectChain,
      truncated: false,
      error: `TOO_MANY_REDIRECTS: Exceeded limit of ${maxRedirects} redirects`,
      failureCode: 'TOO_MANY_REDIRECTS'
    };
  }

  const check = validateOutboundTarget(url, options);
  if (!check.valid || !check.parsedUrl) {
    return {
      ok: false,
      status: 400,
      html: '',
      buffer: Buffer.alloc(0),
      contentType: '',
      headers: {},
      finalUrl: url,
      redirectChain,
      truncated: false,
      error: `${check.reason}: Blocked outbound target (${url})`,
      failureCode: check.reason || 'BLOCKED_URL'
    };
  }

  const parsed = check.parsedUrl;
  const elapsedMs = Date.now() - startedAtMs;
  const remainingWallMs = wallClockMs - elapsedMs;
  if (remainingWallMs <= 0) {
    return {
      ok: false,
      status: 408,
      html: '',
      buffer: Buffer.alloc(0),
      contentType: '',
      headers: {},
      finalUrl: url,
      redirectChain,
      truncated: false,
      error: `Request wall-clock timed out after ${wallClockMs}ms`,
      failureCode: 'WALL_CLOCK_TIMEOUT'
    };
  }

  // If caller injected custom dnsLookup (e.g. unit test for DNS rebinding/SSRF),
  // perform pre-flight resolve & pin once so mocked transport stubs never bypass IP blocking.
  let prePinned = null;
  if (typeof options.dnsLookup === 'function') {
    try {
      prePinned = await resolveAndPinPublicIp(parsed.hostname, options.dnsLookup);
    } catch (dnsErr) {
      return {
        ok: false,
        status: 403,
        html: '',
        buffer: Buffer.alloc(0),
        contentType: '',
        headers: {},
        finalUrl: url,
        redirectChain,
        truncated: false,
        error: dnsErr.message,
        failureCode: dnsErr.code || 'SSRF_BLOCKED_IP'
      };
    }
  }

  const remainingAfterDnsMs = wallClockMs - (Date.now() - startedAtMs);
  if (remainingAfterDnsMs <= 0) {
    return {
      ok: false,
      status: 408,
      html: '',
      buffer: Buffer.alloc(0),
      contentType: '',
      headers: {},
      finalUrl: url,
      redirectChain,
      truncated: false,
      error: `Request wall-clock timed out after ${wallClockMs}ms`,
      failureCode: 'WALL_CLOCK_TIMEOUT'
    };
  }

  const isHttps = parsed.protocol === 'https:';
  const transport = isHttps ? https : http;
  const pinnedLookup = createPinnedLookup(parsed.hostname, prePinned, options.dnsLookup);

  const reqHeaders = {
    'User-Agent': options.userAgent || INGESTION_CONFIG.userAgent,
    'Accept': options.accept || 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ta;q=0.8',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    ...(options.headers || {})
  };

  return new Promise((resolve) => {
    let settled = false;
    let req = null;
    let wallTimer = null;

    const finish = (payload) => {
      if (settled) return;
      settled = true;
      if (wallTimer) clearTimeout(wallTimer);
      resolve(payload);
    };

    const reqOptions = {
      protocol: parsed.protocol,
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: reqHeaders,
      timeout: remainingAfterDnsMs,
      lookup: pinnedLookup
    };

    if (isHttps) {
      reqOptions.ca = combinedCAs;
      reqOptions.rejectUnauthorized = true; // STRICT CRYPTOGRAPHIC VERIFICATION
      reqOptions.minVersion = 'TLSv1.2';
    }

    wallTimer = setTimeout(() => {
      if (req && !req.destroyed) {
        req.destroy(new Error(`WALL_CLOCK_TIMEOUT:${wallClockMs}`));
      }
      finish({
        ok: false,
        status: 408,
        html: '',
        buffer: Buffer.alloc(0),
        contentType: '',
        headers: {},
        finalUrl: url,
        redirectChain,
        truncated: false,
        error: `Request timed out (wall-clock cap ${wallClockMs}ms)`,
        failureCode: 'WALL_CLOCK_TIMEOUT'
      });
    }, remainingAfterDnsMs);

    req = transport.request(reqOptions, async (res) => {
      // Manual per-hop redirect validation
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        res.resume(); // drain redirect socket cleanly
        try {
          const nextUrl = new URL(res.headers.location, url).toString();
          const nextCheck = validateOutboundTarget(nextUrl, options);
          if (!nextCheck.valid) {
            finish({
              ok: false,
              status: res.statusCode,
              html: '',
              buffer: Buffer.alloc(0),
              contentType: '',
              headers: res.headers,
              finalUrl: nextUrl,
              redirectChain: [...redirectChain, nextUrl],
              truncated: false,
              error: `UNTRUSTED_REDIRECT (${nextCheck.reason}): ${nextUrl}`,
              failureCode: nextCheck.reason === 'UNTRUSTED_NOTICE_DOMAIN' ? 'UNTRUSTED_REDIRECT' : (nextCheck.reason || 'UNTRUSTED_REDIRECT')
            });
            return;
          }

          if (redirectCount + 1 > maxRedirects) {
            finish({
              ok: false,
              status: 310,
              html: '',
              buffer: Buffer.alloc(0),
              contentType: '',
              headers: res.headers,
              finalUrl: nextUrl,
              redirectChain: [...redirectChain, nextUrl],
              truncated: false,
              error: `TOO_MANY_REDIRECTS: Exceeded limit of ${maxRedirects} redirects`,
              failureCode: 'TOO_MANY_REDIRECTS'
            });
            return;
          }

          if (wallTimer) clearTimeout(wallTimer);
          const nextRes = await safeFetchHtml(
            nextUrl,
            {
              ...options,
              _startedAtMs: startedAtMs,
              _redirectChain: [...redirectChain, nextUrl]
            },
            redirectCount + 1
          );
          finish(nextRes);
          return;
        } catch (redirErr) {
          finish({
            ok: false,
            status: res.statusCode,
            html: '',
            buffer: Buffer.alloc(0),
            contentType: '',
            headers: res.headers,
            finalUrl: url,
            redirectChain,
            truncated: false,
            error: `Redirect resolution failed: ${redirErr.message}`,
            failureCode: 'REDIRECT_ERROR'
          });
          return;
        }
      }

      // Optional pre-check Content-Length against declared upper bound
      const declaredLenRaw = res.headers['content-length'];
      if (declaredLenRaw !== undefined && typeof options.maxDeclaredBytes === 'number') {
        const declaredLen = Number(declaredLenRaw);
        if (!Number.isFinite(declaredLen) || declaredLen < 0 || declaredLen > options.maxDeclaredBytes) {
          res.destroy();
          if (req && !req.destroyed) req.destroy();
          finish({
            ok: false,
            status: res.statusCode,
            html: '',
            buffer: Buffer.alloc(0),
            contentType: res.headers['content-type'] || '',
            headers: res.headers,
            finalUrl: url,
            redirectChain,
            truncated: true,
            error: `OVERSIZED_DECLARED_CONTENT: Content-Length ${declaredLenRaw} exceeds limit ${options.maxDeclaredBytes}`,
            failureCode: 'OVERSIZED_DOCUMENT'
          });
          return;
        }
      }

      const chunks = [];
      let receivedBytes = 0;
      let hitByteCap = false;

      res.on('data', (chunk) => {
        const bufChunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
        if (receivedBytes + bufChunk.length > maxBytes) {
          const allowedRemainder = Math.max(0, maxBytes - receivedBytes);
          if (allowedRemainder > 0) {
            chunks.push(bufChunk.subarray(0, allowedRemainder));
            receivedBytes += allowedRemainder;
          }
          hitByteCap = true;
          res.destroy();
          if (req && !req.destroyed) req.destroy();
          return;
        }
        chunks.push(bufChunk);
        receivedBytes += bufChunk.length;
      });

      const finalizeStream = () => {
        if (hitByteCap && options.failOnByteCapExceeded) {
          finish({
            ok: false,
            status: res.statusCode,
            html: '',
            buffer: Buffer.concat(chunks),
            contentType: res.headers['content-type'] || '',
            headers: res.headers,
            finalUrl: url,
            redirectChain,
            truncated: true,
            receivedBytes,
            error: `RESPONSE_SIZE_CAP_EXCEEDED: Stream exceeded ${maxBytes} bytes`,
            failureCode: 'OVERSIZED_DOCUMENT'
          });
          return;
        }

        const ok = res.statusCode >= 200 && res.statusCode < 300;
        const rawBuf = Buffer.concat(chunks);
        const decompressed = options.rawBinary ? rawBuf : decompressBuffer(rawBuf, res.headers['content-encoding']);
        const text = decompressed.toString('utf8');

        finish({
          ok,
          status: res.statusCode,
          html: text,
          buffer: decompressed,
          contentType: res.headers['content-type'] || '',
          headers: res.headers,
          finalUrl: url,
          redirectChain,
          truncated: hitByteCap,
          receivedBytes,
          error: ok ? undefined : `HTTP ${res.statusCode}: ${res.statusMessage || 'Request failed'}`
        });
      };

      res.on('end', finalizeStream);
      res.on('close', () => {
        if (hitByteCap) finalizeStream();
      });
      res.on('error', (streamErr) => {
        if (hitByteCap) {
          finalizeStream();
          return;
        }
        finish({
          ok: false,
          status: 500,
          html: '',
          buffer: Buffer.alloc(0),
          contentType: res.headers['content-type'] || '',
          headers: res.headers,
          finalUrl: url,
          redirectChain,
          truncated: false,
          error: streamErr.message,
          failureCode: 'STREAM_ERROR'
        });
      });
    });

    req.on('timeout', () => {
      if (!req.destroyed) req.destroy();
      finish({
        ok: false,
        status: 408,
        html: '',
        buffer: Buffer.alloc(0),
        contentType: '',
        headers: {},
        finalUrl: url,
        redirectChain,
        truncated: false,
        error: `Request socket timed out (${wallClockMs}ms)`,
        failureCode: 'SOCKET_TIMEOUT'
      });
    });

    req.on('error', (err) => {
      const code = err.code || (String(err.message).startsWith('SSRF_BLOCKED_IP') ? 'SSRF_BLOCKED_IP' : 'NETWORK_ERROR');
      finish({
        ok: false,
        status: code === 'SSRF_BLOCKED_IP' ? 403 : 500,
        html: '',
        buffer: Buffer.alloc(0),
        contentType: '',
        headers: {},
        finalUrl: url,
        redirectChain,
        truncated: false,
        error: err.message,
        failureCode: code
      });
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

/**
 * Checks whether a buffer looks like disguised HTML/XML/script instead of a binary PDF.
 */
function hasHtmlDisguise(buf) {
  const headText = buf.subarray(0, 1024).toString('utf8').trimStart().toLowerCase();
  return (
    headText.startsWith('<!doctype') ||
    headText.startsWith('<html') ||
    headText.startsWith('<head') ||
    headText.startsWith('<body') ||
    headText.startsWith('<script') ||
    headText.startsWith('<?xml')
  );
}

/**
 * Validates HTTP Content-Range header for a bytes=0-65535 PDF probe.
 */
export function validatePartialContentRange(contentRangeHeader, receivedBytes) {
  if (!contentRangeHeader || typeof contentRangeHeader !== 'string') {
    return { valid: false, reason: 'MISSING_CONTENT_RANGE' };
  }
  const match = contentRangeHeader.trim().match(/^bytes\s+(\d+)-(\d+)\/(\d+|\*)$/i);
  if (!match) {
    return { valid: false, reason: 'MALFORMED_CONTENT_RANGE' };
  }
  const start = parseInt(match[1], 10);
  const end = parseInt(match[2], 10);
  const total = match[3] === '*' ? null : parseInt(match[3], 10);

  if (start !== 0 || end < start) {
    return { valid: false, reason: 'INVALID_RANGE_BOUNDS' };
  }
  if (total !== null && (total <= 0 || end >= total || total > VERIFY_LIMITS.MAX_DECLARED_PDF_BYTES)) {
    return { valid: false, reason: 'INVALID_OR_OVERSIZED_RANGE_TOTAL' };
  }
  const sliceLen = end - start + 1;
  if (receivedBytes > VERIFY_LIMITS.PDF_RANGE_BYTES || receivedBytes > sliceLen + 1024) {
    return { valid: false, reason: 'RANGE_BYTES_MISMATCH' };
  }
  return { valid: true, start, end, total };
}

/**
 * Evaluates a PDF buffer given HTTP status and truncation metadata.
 *
 * IMPORTANT LIMITATION (explicitly documented):
 * Marker checks on a complete bounded PDF (header `%PDF-`, `obj`/`endobj`, `xref` or `/XRef`,
 * `startxref`, trailing `%%EOF`) validate PDF container integrity and catch HTML spoofing or truncation.
 * They are NOT equivalent to a full multi-pass PDF parser or cryptographic signature verification.
 * Partial 206 responses and cap-truncated 200 responses NEVER become `structurally_verified`.
 *
 * @param {Buffer} buffer
 * @param {Object} meta
 * @returns {{ docState: 'structurally_verified'|'signature_checked'|'malformed', reason: string }}
 */
export function classifyPdfBuffer(buffer, meta = {}) {
  const { httpStatus = 200, contentType = '', contentRange = '', truncated = false, receivedBytes = buffer.length } = meta;

  if (!buffer || buffer.length === 0 || receivedBytes === 0) {
    return { docState: 'malformed', reason: 'EMPTY_PDF_BODY' };
  }

  if (hasHtmlDisguise(buffer)) {
    return { docState: 'malformed', reason: 'HTML_DISGUISED_AS_PDF' };
  }

  const headSlice = buffer.subarray(0, 1024).toString('latin1');
  const hasPdfMagic = /%PDF-1\.[0-7]|%PDF-2\.[0-9]/i.test(headSlice);

  if (!hasPdfMagic) {
    const lowerCt = String(contentType || '').toLowerCase();
    if (lowerCt.includes('text/html')) {
      return { docState: 'malformed', reason: 'HTML_DISGUISED_AS_PDF' };
    }
    return { docState: 'malformed', reason: 'MISSING_PDF_MAGIC_BYTES' };
  }

  // Partial 206 response -> signature_checked ONLY (must never become structurally_verified)
  if (httpStatus === 206) {
    const rangeValidation = validatePartialContentRange(contentRange, receivedBytes);
    if (!rangeValidation.valid) {
      return { docState: 'malformed', reason: rangeValidation.reason };
    }
    return { docState: 'signature_checked', reason: 'PARTIAL_206_PREFIX_ONLY' };
  }

  // Origin ignored Range and stream hit the 256 KB kill-switch -> signature_checked ONLY
  if (truncated) {
    return { docState: 'signature_checked', reason: 'TRUNCATED_200_CAP_REACHED' };
  }

  // Complete bounded 200 PDF within 256 KB -> validate container structural markers
  const fullText = buffer.toString('latin1');
  const hasObj = /\b\d+\s+\d+\s+obj\b/.test(fullText) && /\bendobj\b/.test(fullText);
  const hasXref = /\bxref\b/.test(fullText) || /\/Type\s*\/XRef\b/.test(fullText);
  const hasStartXref = /\bstartxref\b/.test(fullText);
  const tailSlice = buffer.subarray(Math.max(0, buffer.length - 1024)).toString('latin1');
  const hasEof = /%%EOF/.test(tailSlice);

  if (hasObj && hasXref && hasStartXref && hasEof) {
    return { docState: 'structurally_verified', reason: 'COMPLETE_BOUNDED_PDF_MARKERS_VALID' };
  }

  return { docState: 'malformed', reason: 'INCOMPLETE_OR_CORRUPT_PDF_STRUCTURE' };
}

/**
 * Evaluates a complete HTML/JSON official notice page (max 256 KB, complete response only).
 */
export function classifyHtmlOrJsonNotice(htmlText, meta = {}) {
  const { httpStatus = 200, contentType = '', truncated = false, expectedTitle = '', notificationNo = '' } = meta;

  if (truncated || httpStatus === 206) {
    return { docState: 'unavailable', reason: 'INCOMPLETE_HTML_OR_TRUNCATED' };
  }
  if (httpStatus !== 200) {
    if (httpStatus === 404 || httpStatus === 410) {
      return { docState: 'malformed', reason: `HTTP_${httpStatus}_NOT_FOUND` };
    }
    return { docState: 'unavailable', reason: `HTTP_${httpStatus}_UNAVAILABLE` };
  }

  const ct = String(contentType || '').toLowerCase();
  const isAllowedMime = !ct || ct.includes('text/html') || ct.includes('application/xhtml+xml') || ct.includes('application/json');
  if (!isAllowedMime) {
    return { docState: 'malformed', reason: `UNEXPECTED_NOTICE_MIME:${ct}` };
  }

  const trimmed = String(htmlText || '').trim();
  if (trimmed.length < 100) {
    return { docState: 'malformed', reason: 'EMPTY_OR_TINY_NOTICE_PAGE' };
  }

  const lower = trimmed.toLowerCase();
  if (
    lower.includes('authentication.aspx') ||
    lower.includes('enter the characters shown in the image') ||
    (lower.includes('captcha') && lower.includes('<form')) ||
    lower.includes('403 forbidden') ||
    lower.includes('access denied') ||
    lower.includes('please enable javascript and cookies')
  ) {
    return { docState: 'malformed', reason: 'CAPTCHA_OR_LOGIN_WALL_DETECTED' };
  }

  // Verify body contains the notice identifier or meaningful title tokens
  const cleanId = String(notificationNo || '').trim().toLowerCase();
  const idMatch = cleanId.length >= 3 && lower.includes(cleanId);

  const stopWords = new Set(['for', 'the', 'and', 'with', 'from', 'govt', 'notification', 'recruitment', 'official', 'online', 'exam', 'examination']);
  const tokens = String(expectedTitle || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !stopWords.has(w));

  let matchedTokenCount = 0;
  for (const tok of tokens.slice(0, 6)) {
    if (lower.includes(tok)) matchedTokenCount++;
  }
  const titleMatch = tokens.length === 0 ? false : (matchedTokenCount >= Math.min(2, tokens.length));

  if (!idMatch && !titleMatch) {
    return { docState: 'unavailable', reason: 'NOTICE_TITLE_OR_ID_MISMATCH' };
  }

  return { docState: 'html_notice_verified', reason: 'COMPLETE_OFFICIAL_NOTICE_VERIFIED' };
}

/**
 * Verifies an extracted official PDF or HTML/JSON notice URL safely within strict resource bounds.
 * Returns separated states: 'structurally_verified' | 'html_notice_verified' | 'signature_checked' | 'unavailable' | 'malformed'.
 *
 * @param {string} url
 * @param {string} sourceKey
 * @param {Object} [options]
 */
export async function safeVerifyOfficialDocument(url, sourceKey, options = {}) {
  const urlCheck = validateExplicitSourceUrl(url, sourceKey, 'notice', {
    allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock)
  });

  if (!urlCheck.valid) {
    return {
      docState: urlCheck.severity === 'review' ? 'unavailable' : 'malformed',
      reason: urlCheck.reason,
      finalUrl: url,
      redirectChain: [url],
      httpStatus: 0
    };
  }

  const pathname = (urlCheck.parsedUrl?.pathname || '').toLowerCase();
  const isPdfTarget = options.expectPdf !== undefined ? Boolean(options.expectPdf) : pathname.endsWith('.pdf');

  const fetchOpts = {
    sourceKey,
    timeoutMs: options.timeoutMs || VERIFY_LIMITS.VERIFY_TIMEOUT_MS,
    maxRedirects: VERIFY_LIMITS.MAX_REDIRECTS,
    maxBytes: VERIFY_LIMITS.MAX_VERIFY_STREAM_BYTES, // 256 KB hard kill-switch regardless of Range support
    maxDeclaredBytes: isPdfTarget ? VERIFY_LIMITS.MAX_DECLARED_PDF_BYTES : VERIFY_LIMITS.MAX_VERIFY_STREAM_BYTES,
    rawBinary: isPdfTarget,
    failOnByteCapExceeded: !isPdfTarget,
    skipRateLimit: Boolean(options.skipRateLimit),
    dnsLookup: options.dnsLookup,
    allowHttpForLocalMock: Boolean(options.allowHttpForLocalMock),
    headers: isPdfTarget
      ? { Range: `bytes=0-${VERIFY_LIMITS.PDF_RANGE_BYTES - 1}`, Accept: 'application/pdf,*/*;q=0.5' }
      : { Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8' }
  };

  const res = await safeFetchHtml(url, fetchOpts);

  if (res.failureCode) {
    if (
      ['UNTRUSTED_NOTICE_DOMAIN', 'UNTRUSTED_REDIRECT', 'URL_SHORTENER_FORBIDDEN',
       'IP_LITERAL_FORBIDDEN', 'INTERNAL_HOST_FORBIDDEN', 'NON_HTTPS_URL',
       'UNSAFE_URI_SCHEME', 'URL_CREDENTIALS_FORBIDDEN', 'NON_STANDARD_PORT',
       'TOO_MANY_REDIRECTS', 'SSRF_BLOCKED_IP', 'OVERSIZED_DOCUMENT'].includes(res.failureCode)
    ) {
      return {
        docState: 'malformed',
        reason: res.failureCode,
        finalUrl: res.finalUrl,
        redirectChain: res.redirectChain,
        httpStatus: res.status
      };
    }

    // Timeout / temp network / DNS / stream transient error -> unavailable -> pending_review
    return {
      docState: 'unavailable',
      reason: res.failureCode,
      finalUrl: res.finalUrl,
      redirectChain: res.redirectChain,
      httpStatus: res.status
    };
  }

  if (res.status === 404 || res.status === 410) {
    return {
      docState: 'malformed',
      reason: `HTTP_${res.status}_NOT_FOUND`,
      finalUrl: res.finalUrl,
      redirectChain: res.redirectChain,
      httpStatus: res.status
    };
  }

  if (res.status >= 400 || res.status === 0) {
    return {
      docState: 'unavailable',
      reason: `HTTP_${res.status}_UNAVAILABLE`,
      finalUrl: res.finalUrl,
      redirectChain: res.redirectChain,
      httpStatus: res.status
    };
  }

  const ctLower = String(res.contentType || '').toLowerCase();
  if (isPdfTarget || ctLower.includes('application/pdf')) {
    const pdfEval = classifyPdfBuffer(res.buffer, {
      httpStatus: res.status,
      contentType: res.contentType,
      contentRange: res.headers?.['content-range'] || '',
      truncated: res.truncated,
      receivedBytes: res.receivedBytes
    });
    return {
      ...pdfEval,
      finalUrl: res.finalUrl,
      redirectChain: res.redirectChain,
      httpStatus: res.status,
      contentType: res.contentType,
      receivedBytes: res.receivedBytes
    };
  }

  const htmlEval = classifyHtmlOrJsonNotice(res.html, {
    httpStatus: res.status,
    contentType: res.contentType,
    truncated: res.truncated,
    expectedTitle: options.expectedTitle || '',
    notificationNo: options.notificationNo || ''
  });

  return {
    ...htmlEval,
    finalUrl: res.finalUrl,
    redirectChain: res.redirectChain,
    httpStatus: res.status,
    contentType: res.contentType,
    receivedBytes: res.receivedBytes
  };
}
