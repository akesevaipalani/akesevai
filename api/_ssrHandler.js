import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BASE_URL,
  DEFAULT_OG_IMAGE,
  escapeHtml,
  safeJsonLdStringify,
  resolveQueryRedirect,
  resolveRouteSeo
} from '../src/data/seoRoutesConfig.js';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

let bundledTemplateHtml = null;
try {
  const fallbackMod = await import('./_template/templateFallback.js');
  if (typeof fallbackMod?.SSR_TEMPLATE_HTML === 'string' && fallbackMod.SSR_TEMPLATE_HTML.length > 0) {
    bundledTemplateHtml = fallbackMod.SSR_TEMPLATE_HTML;
  }
} catch {
  bundledTemplateHtml = null;
}

const STATIC_EXT_RE =
  /\.(js|css|map|png|jpg|jpeg|webp|gif|svg|ico|woff|woff2|ttf|eot|json|txt|xml|pdf|mjs)$/i;

const CSP_POLICY =
  "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'; " +
  "img-src 'self' data: blob: https: http:; " +
  "font-src 'self' data: https://fonts.gstatic.com https:; " +
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https:; " +
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: blob:; " +
  "connect-src 'self' http: https: ws: wss: data: blob:; " +
  "frame-ancestors 'self';";

let cachedTemplateHtml = null;
let cachedTemplatePath = '';
let cachedTemplateMtimeMs = 0;

function resolveTemplatePath(customTemplatePath) {
  if (customTemplatePath && fs.existsSync(customTemplatePath)) {
    return customTemplatePath;
  }
  const cwd = process.cwd();
  const vercelTemplate = path.join(cwd, 'api', '_template', 'index.html');
  if (fs.existsSync(vercelTemplate)) {
    return vercelTemplate;
  }
  const moduleRelativeTemplate = path.join(MODULE_DIR, '_template', 'index.html');
  if (fs.existsSync(moduleRelativeTemplate)) {
    return moduleRelativeTemplate;
  }
  const distTemplate = path.join(cwd, 'dist', 'index.html');
  if (fs.existsSync(distTemplate)) {
    return distTemplate;
  }
  return null;
}

function readIndexTemplate(customTemplatePath) {
  const filePath = resolveTemplatePath(customTemplatePath);
  if (!filePath) {
    return bundledTemplateHtml || null;
  }

  const stat = fs.statSync(filePath);
  if (!cachedTemplateHtml || cachedTemplatePath !== filePath || cachedTemplateMtimeMs !== stat.mtimeMs) {
    cachedTemplateHtml = fs.readFileSync(filePath, 'utf8');
    cachedTemplatePath = filePath;
    cachedTemplateMtimeMs = stat.mtimeMs;
  }
  return cachedTemplateHtml;
}

function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self)');
  res.setHeader('Content-Security-Policy', CSP_POLICY);
}

export function injectSeoMetadata(templateHtml, resolved) {
  const seo = resolved?.seo || {};
  const escapedTitle = escapeHtml(seo.title || 'AK E-SEVAI');
  const escapedDesc = escapeHtml(seo.description || '');
  const escapedKeywords = escapeHtml(seo.keywords || '');
  const escapedCanonical = escapeHtml(seo.canonical || `${BASE_URL}/`);
  const escapedImage = escapeHtml(seo.image || DEFAULT_OG_IMAGE);
  const robotsValue = resolved?.noindex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  let html = templateHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, () => `<title>${escapedTitle}</title>`);
  html = html.replace(/<meta\s+name="description"[\s\S]*?\/?>/i, () => `<meta name="description" content="${escapedDesc}" />`);
  html = html.replace(/<meta\s+name="keywords"[\s\S]*?\/?>/i, () => `<meta name="keywords" content="${escapedKeywords}" />`);
  html = html.replace(/<meta\s+name="robots"[\s\S]*?\/?>/i, () => `<meta name="robots" content="${robotsValue}" />`);
  html = html.replace(/<link\s+rel="canonical"[\s\S]*?\/?>/i, () => `<link rel="canonical" href="${escapedCanonical}" />`);

  html = html.replace(/<meta\s+property="og:url"[\s\S]*?\/?>/i, () => `<meta property="og:url" content="${escapedCanonical}" />`);
  html = html.replace(/<meta\s+property="og:title"[\s\S]*?\/?>/i, () => `<meta property="og:title" content="${escapedTitle}" />`);
  html = html.replace(/<meta\s+property="og:description"[\s\S]*?\/?>/i, () => `<meta property="og:description" content="${escapedDesc}" />`);
  html = html.replace(/<meta\s+property="og:image"[\s\S]*?\/?>/i, () => `<meta property="og:image" content="${escapedImage}" />`);

  html = html.replace(/<meta\s+name="twitter:url"[\s\S]*?\/?>/i, () => `<meta name="twitter:url" content="${escapedCanonical}" />`);
  html = html.replace(/<meta\s+name="twitter:title"[\s\S]*?\/?>/i, () => `<meta name="twitter:title" content="${escapedTitle}" />`);
  html = html.replace(/<meta\s+name="twitter:description"[\s\S]*?\/?>/i, () => `<meta name="twitter:description" content="${escapedDesc}" />`);
  html = html.replace(/<meta\s+name="twitter:image"[\s\S]*?\/?>/i, () => `<meta name="twitter:image" content="${escapedImage}" />`);

  const routeH1 = escapeHtml((seo.title || 'AK E-SEVAI Digital Service Centre').split('|')[0].trim());
  html = html.replace(
    /<noscript>[\s\S]*?<\/noscript>/i,
    () =>
      `<noscript><main style="padding: 20px; font-family: sans-serif; max-width: 900px; margin: 0 auto; line-height: 1.6;"><h1>${routeH1}</h1><p>${escapedDesc}</p><p><strong>AK E-SEVAI Digital Service Centre</strong> — Independent e-Sevai guidance &amp; online document preparation across Tamil Nadu. Walk-in desk: Mill Road, Sanmugapuram, Anna Nagar, Palani, Tamil Nadu 624601 (+91 93423 18844).</p><nav aria-label="Core Pages"><a href="/">Home</a> | <a href="/esevai-services">Tamil Nadu e-Sevai Services</a> | <a href="/services">Service Directory</a> | <a href="/photo-tools">Free Photo &amp; PDF Tools</a> | <a href="/pan-card-service">PAN Card Assistance</a> | <a href="/income-certificate">Income Certificate Guide</a> | <a href="/community-certificate">Community Certificate Guide</a> | <a href="/smart-ration-card">Smart Ration Card Guide</a> | <a href="/patta-chitta">Patta &amp; Chitta Guide</a> | <a href="/aadhaar-guidance">Aadhaar Guidance</a> | <a href="/esevai-application-assistance">e-Sevai Application Assistance</a> | <a href="/xerox-printing">Xerox &amp; Printing Palani</a> | <a href="/typing-services">Typing Palani</a> | <a href="/spiral-binding">Spiral Binding Palani</a> | <a href="/about">About Palani Centre</a> | <a href="/contact">Contact</a></nav></main></noscript>`
  );

  html = html.replace(
    /<script\s+id="akesevai-jsonld-schema"\s+type="application\/ld\+json">[\s\S]*?<\/script>/i,
    () =>
      resolved?.jsonLd
        ? `<script id="akesevai-jsonld-schema" type="application/ld+json">${safeJsonLdStringify(resolved.jsonLd)}</script>`
        : ''
  );

  return html;
}

export function extractRequestedPathname(requestUrl) {
  const parsed = new URL(requestUrl || '/', 'https://www.akesevai.com');
  const isDirectFunctionCall = parsed.pathname === '/api/ssr-seo' || parsed.pathname === '/api/ssr-seo/';

  if (isDirectFunctionCall && !parsed.searchParams.has('__ssr_path')) {
    return { parsed, pathname: parsed.pathname, directEndpointHit: true };
  }

  let rawPath = parsed.searchParams.has('__ssr_path')
    ? parsed.searchParams.get('__ssr_path') || '/'
    : parsed.pathname || '/';

  // Normalize repeated leading slashes cleanly
  rawPath = rawPath.replace(/^\/+/, '/') || '/';
  return { parsed, pathname: rawPath, directEndpointHit: false };
}

export function handleSsrRequest(req, res, options = {}) {
  const method = String(req.method || 'GET').toUpperCase();
  applySecurityHeaders(res);

  if (method !== 'GET' && method !== 'HEAD') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, HEAD');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.end('Method Not Allowed');
    return;
  }

  const isHead = method === 'HEAD';
  const { parsed, pathname, directEndpointHit } = extractRequestedPathname(req.url);

  if (directEndpointHit) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
    res.end(isHead ? undefined : JSON.stringify({ success: false, error: 'API_NOT_FOUND', message: 'Endpoint not found.' }));
    return;
  }

  // Canonicalize direct /index.html requests to /
  if (pathname.toLowerCase() === '/index.html') {
    res.statusCode = 301;
    res.setHeader('Location', '/');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
    res.end();
    return;
  }

  // Missing static assets or unknown /assets/* paths return genuine 404
  if (pathname.startsWith('/assets/') || STATIC_EXT_RE.test(pathname)) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
    res.end(isHead ? undefined : 'Not Found');
    return;
  }

  // Legacy ?tool= and ?page= query parameter 301 canonicalization
  if (pathname === '/') {
    const queryTool = parsed.searchParams.get('tool');
    const queryPage = parsed.searchParams.get('page');
    if (queryTool || queryPage) {
      const queryTarget = resolveQueryRedirect({ tool: queryTool || '', page: queryPage || '' });
      if (queryTarget) {
        res.statusCode = 301;
        res.setHeader('Location', queryTarget);
        res.setHeader('X-Robots-Tag', 'noindex, nofollow');
        res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
        res.end();
        return;
      }
    }
  }

  const resolved = resolveRouteSeo(pathname);
  if (resolved.status === 301 && resolved.redirectTo) {
    res.statusCode = 301;
    res.setHeader('Location', resolved.redirectTo);
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=3600');
    res.end();
    return;
  }

  const templateHtml = readIndexTemplate(options.templatePath);
  if (!templateHtml) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.end(isHead ? undefined : 'SSR template unavailable');
    return;
  }

  const html = injectSeoMetadata(templateHtml, resolved);
  res.statusCode = resolved.status;
  res.setHeader('Content-Type', 'text/html; charset=UTF-8');

  if (resolved.noindex) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'private, no-store');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=600');
  }

  res.end(isHead ? undefined : html);
}
