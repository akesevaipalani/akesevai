// server/ingestion/officialDomainPolicy.js
// Explicit Per-Source Domain Allowlist & SSRF IP Range Validator
// Note: Reads OFFICIAL_EXAM_SOURCES read-only without modifying sourcesConfig.js.
// NEVER trusts generic domain suffixes (.gov.in, .nic.in, .ac.in, .edu.in) automatically.

import net from 'net';
import { OFFICIAL_EXAM_SOURCES } from './sourcesConfig.js';

export const URL_SHORTENER_HOSTS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'ow.ly',
  'is.gd',
  'buff.ly',
  'rebrand.ly',
  'rb.gy',
  'cutt.ly',
  'shorturl.at',
  'tiny.cc',
  'lnkd.in',
  'v.gd',
  's.id',
  'short.io'
]);

/**
 * Explicit sourceKey -> allowed exact hostnames mapping.
 * Every auto-publishable link or redirect hop MUST match this explicit map.
 */
export const EXPLICIT_SOURCE_DOMAIN_MAP = {
  tnpsc: {
    allowedNoticeHosts: ['www.tnpsc.gov.in', 'tnpsc.gov.in'],
    allowedApplyHosts: ['apply.tnpscexams.in', 'www.tnpscexams.in', 'www.tnpsc.gov.in', 'tnpsc.gov.in']
  },
  tnusrb: {
    allowedNoticeHosts: ['tnusrb.tn.gov.in', 'www.tnusrb.tn.gov.in'],
    allowedApplyHosts: ['tnusrb.tn.gov.in', 'www.tnusrb.tn.gov.in']
  },
  trb_tn: {
    allowedNoticeHosts: ['trb.tn.gov.in', 'www.trb.tn.gov.in'],
    allowedApplyHosts: ['trb.tn.gov.in', 'www.trb.tn.gov.in']
  },
  mrb_tn: {
    allowedNoticeHosts: ['www.mrb.tn.gov.in', 'mrb.tn.gov.in'],
    allowedApplyHosts: ['www.mrb.tn.gov.in', 'mrb.tn.gov.in']
  },
  ibps: {
    allowedNoticeHosts: ['www.ibps.in', 'ibps.in'],
    allowedApplyHosts: ['ibpsonline.ibps.in', 'www.ibps.in', 'ibps.in']
  },
  sbi_careers: {
    allowedNoticeHosts: ['sbi.co.in', 'www.sbi.co.in', 'bank.sbi', 'www.bank.sbi'],
    allowedApplyHosts: ['sbi.co.in', 'www.sbi.co.in', 'bank.sbi', 'www.bank.sbi', 'recruitment.bank.sbi', 'ibpsonline.ibps.in']
  },
  rbi_vacancies: {
    allowedNoticeHosts: ['opportunities.rbi.org.in', 'rbi.org.in', 'www.rbi.org.in'],
    allowedApplyHosts: ['opportunities.rbi.org.in', 'rbi.org.in', 'www.rbi.org.in', 'ibpsonline.ibps.in']
  },
  rrb_chennai: {
    allowedNoticeHosts: ['rrbchennai.gov.in', 'www.rrbchennai.gov.in'],
    allowedApplyHosts: ['rrbchennai.gov.in', 'www.rrbchennai.gov.in', 'www.rrbapply.gov.in', 'rrbapply.gov.in']
  },
  upsc_active: {
    allowedNoticeHosts: ['upsc.gov.in', 'www.upsc.gov.in'],
    allowedApplyHosts: ['upsconline.nic.in', 'www.upsconline.nic.in', 'upsconline.gov.in', 'upsc.gov.in', 'www.upsc.gov.in']
  },
  ssc_notices: {
    allowedNoticeHosts: ['ssc.gov.in', 'www.ssc.gov.in'],
    allowedApplyHosts: ['ssc.gov.in', 'www.ssc.gov.in']
  },
  india_post_gds: {
    allowedNoticeHosts: ['indiapostgdsonline.gov.in', 'www.indiapostgdsonline.gov.in'],
    allowedApplyHosts: ['indiapostgdsonline.gov.in', 'www.indiapostgdsonline.gov.in']
  },
  indian_army: {
    allowedNoticeHosts: ['joinindianarmy.nic.in', 'www.joinindianarmy.nic.in'],
    allowedApplyHosts: ['joinindianarmy.nic.in', 'www.joinindianarmy.nic.in']
  },
  indian_navy: {
    allowedNoticeHosts: ['www.joinindiannavy.gov.in', 'joinindiannavy.gov.in'],
    allowedApplyHosts: ['www.joinindiannavy.gov.in', 'joinindiannavy.gov.in']
  },
  indian_airforce: {
    allowedNoticeHosts: ['agnipathvayu.cdac.in'],
    allowedApplyHosts: ['agnipathvayu.cdac.in']
  },
  ctet_cbse: {
    allowedNoticeHosts: ['ctet.nic.in', 'www.ctet.nic.in', 'examinationservices.nic.in'],
    allowedApplyHosts: ['ctet.nic.in', 'www.ctet.nic.in', 'examinationservices.nic.in']
  },
  kvs_delhi: {
    allowedNoticeHosts: ['kvs.gov.in', 'www.kvs.gov.in', 'kvsangathan.nic.in'],
    allowedApplyHosts: ['kvs.gov.in', 'www.kvs.gov.in', 'kvsangathan.nic.in']
  },
  lic_careers: {
    allowedNoticeHosts: ['licindia.in', 'www.licindia.in'],
    allowedApplyHosts: ['licindia.in', 'www.licindia.in', 'ibpsonline.ibps.in']
  },
  niacl_careers: {
    allowedNoticeHosts: ['www.newindia.co.in', 'newindia.co.in'],
    allowedApplyHosts: ['www.newindia.co.in', 'newindia.co.in', 'ibpsonline.ibps.in']
  },
  bel_psu: {
    allowedNoticeHosts: ['bel-india.in', 'www.bel-india.in'],
    allowedApplyHosts: ['bel-india.in', 'www.bel-india.in'],
    reviewOnlyApplyHosts: ['jobapply.in', 'www.jobapply.in']
  },
  bhel_psu: {
    allowedNoticeHosts: ['careers.bhel.in', 'www.bhel.com', 'bhel.in'],
    allowedApplyHosts: ['careers.bhel.in']
  }
};

/**
 * Retrieves read-only source config from OFFICIAL_EXAM_SOURCES
 */
export function getRegisteredSourceConfig(sourceKey) {
  if (!sourceKey) return null;
  return OFFICIAL_EXAM_SOURCES.find((s) => s.key === sourceKey) || null;
}

/**
 * Parses an IPv4 dotted address into a 32-bit unsigned integer
 */
function ipv4ToUint32(ipv4) {
  const parts = String(ipv4).split('.');
  if (parts.length !== 4) return null;
  let num = 0;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null;
    const n = parseInt(part, 10);
    if (n < 0 || n > 255) return null;
    num = (num * 256) + n;
  }
  return num >>> 0;
}

function isBlockedIpv4(ipv4) {
  const num = ipv4ToUint32(ipv4);
  if (num === null) return true;

  const ranges = [
    [0x00000000, 0x00ffffff], // 0.0.0.0/8 (this network)
    [0x0a000000, 0x0affffff], // 10.0.0.0/8 (RFC1918)
    [0x64400000, 0x647fffff], // 100.64.0.0/10 (CGNAT)
    [0x7f000000, 0x7fffffff], // 127.0.0.0/8 (Loopback)
    [0xa9fe0000, 0xa9feffff], // 169.254.0.0/16 (Link-local & Cloud Metadata 169.254.169.254)
    [0xac100000, 0xac1fffff], // 172.16.0.0/12 (RFC1918)
    [0xc0000000, 0xc00000ff], // 192.0.0.0/24 (IETF Protocol)
    [0xc0000200, 0xc00002ff], // 192.0.2.0/24 (TEST-NET-1)
    [0xc0a80000, 0xc0a8ffff], // 192.168.0.0/16 (RFC1918)
    [0xc6120000, 0xc613ffff], // 198.18.0.0/15 (Benchmarking)
    [0xc6336400, 0xc63364ff], // 198.51.100.0/24 (TEST-NET-2)
    [0xcb007100, 0xcb0071ff], // 203.0.113.0/24 (TEST-NET-3)
    [0xe0000000, 0xefffffff], // 224.0.0.0/4 (Multicast)
    [0xf0000000, 0xffffffff]  // 240.0.0.0/4 (Reserved & Broadcast 255.255.255.255)
  ];

  return ranges.some(([start, end]) => num >= start && num <= end);
}

/**
 * Expands full 8-group IPv6 hex representation, extracting IPv4-mapped suffix if present.
 */
function normalizeIpv6Groups(rawIp) {
  const clean = String(rawIp).toLowerCase().split('%')[0];
  // Handle ::ffff:a.b.c.d dotted trailing IPv4
  const lastColon = clean.lastIndexOf(':');
  let work = clean;
  if (lastColon !== -1 && clean.slice(lastColon + 1).includes('.')) {
    const dotted = clean.slice(lastColon + 1);
    const v4 = ipv4ToUint32(dotted);
    if (v4 === null) return null;
    const hi = ((v4 >>> 16) & 0xffff).toString(16);
    const lo = (v4 & 0xffff).toString(16);
    work = `${clean.slice(0, lastColon + 1)}${hi}:${lo}`;
  }

  const parts = work.split('::');
  if (parts.length > 2) return null;

  const left = parts[0] ? parts[0].split(':').filter(Boolean) : [];
  const right = parts.length === 2 && parts[1] ? parts[1].split(':').filter(Boolean) : [];
  const missing = 8 - (left.length + right.length);
  if (parts.length === 1 && missing !== 0) return null;
  if (parts.length === 2 && missing < 0) return null;

  const full = [
    ...left,
    ...new Array(Math.max(0, missing)).fill('0'),
    ...right
  ];
  if (full.length !== 8) return null;

  const nums = [];
  for (const h of full) {
    if (!/^[0-9a-f]{1,4}$/.test(h)) return null;
    nums.push(parseInt(h, 16));
  }
  return nums;
}

/**
 * Strictly determines whether an IPv4 or IPv6 address belongs to any private,
 * loopback, link-local, cloud-metadata, CGNAT, multicast, or reserved range.
 *
 * @param {string} ip
 * @returns {boolean} true if IP is blocked/unsafe
 */
export function isBlockedIp(ip) {
  if (!ip || typeof ip !== 'string') return true;
  const clean = ip.trim().replace(/^\[|\]$/g, '').split('%')[0];
  const ipType = net.isIP(clean);
  if (ipType === 0) return true;

  if (ipType === 4) {
    return isBlockedIpv4(clean);
  }

  const groups = normalizeIpv6Groups(clean);
  if (!groups) return true;

  // ::/128 Unspecified
  if (groups.every((g) => g === 0)) return true;
  // ::1/128 Loopback
  if (groups.slice(0, 7).every((g) => g === 0) && groups[7] === 1) return true;
  // IPv4-mapped ::ffff:0:0/96 or IPv4-compatible ::/96
  const isV4Mapped = groups.slice(0, 5).every((g) => g === 0) && (groups[5] === 0xffff || groups[5] === 0);
  if (isV4Mapped) {
    const v4Int = ((groups[6] << 16) | groups[7]) >>> 0;
    const dotted = `${(v4Int >>> 24) & 255}.${(v4Int >>> 16) & 255}.${(v4Int >>> 8) & 255}.${v4Int & 255}`;
    return isBlockedIpv4(dotted);
  }
  // fe80::/10 Link-local
  if ((groups[0] & 0xffc0) === 0xfe80) return true;
  // fec0::/10 Deprecated site-local
  if ((groups[0] & 0xffc0) === 0xfec0) return true;
  // fc00::/7 Unique local address (ULA, e.g. fd00:ec2::254 cloud metadata)
  if ((groups[0] & 0xfe00) === 0xfc00) return true;
  // ff00::/8 Multicast
  if ((groups[0] & 0xff00) === 0xff00) return true;
  // 2001:db8::/32 Documentation
  if (groups[0] === 0x2001 && groups[1] === 0x0db8) return true;
  // 64:ff9b::/96 NAT64 well-known prefix
  if (groups[0] === 0x0064 && groups[1] === 0xff9b && groups.slice(2, 6).every((g) => g === 0)) return true;

  return false;
}

/**
 * Checks whether hostname is a known URL shortener
 */
export function isShortenerHost(hostname) {
  if (!hostname) return false;
  const host = String(hostname).toLowerCase().trim();
  return URL_SHORTENER_HOSTS.has(host) || Array.from(URL_SHORTENER_HOSTS).some((s) => host.endsWith(`.${s}`));
}

/**
 * Returns explicit allowed host sets for a registered sourceKey
 */
export function getAllowedHostsForSource(sourceKey) {
  const policy = EXPLICIT_SOURCE_DOMAIN_MAP[sourceKey];
  if (!policy) {
    return {
      known: false,
      noticeHosts: new Set(),
      applyHosts: new Set(),
      reviewOnlyApplyHosts: new Set()
    };
  }
  return {
    known: true,
    noticeHosts: new Set((policy.allowedNoticeHosts || []).map((h) => h.toLowerCase())),
    applyHosts: new Set((policy.allowedApplyHosts || policy.allowedNoticeHosts || []).map((h) => h.toLowerCase())),
    reviewOnlyApplyHosts: new Set((policy.reviewOnlyApplyHosts || []).map((h) => h.toLowerCase()))
  };
}

/**
 * Validates any URL strictly against protocol, credentials, port, IP literals,
 * shortener blacklist, and explicit per-source host allowlist.
 *
 * @param {string} rawUrl
 * @param {string} sourceKey
 * @param {'notice'|'apply'} [linkKind='notice']
 * @param {Object} [options]
 * @returns {{ valid: boolean, host: string, protocol: string, parsedUrl: URL|null, reviewOnlyVendor?: boolean, reason?: string, severity?: 'quarantine'|'review' }}
 */
export function validateExplicitSourceUrl(rawUrl, sourceKey, linkKind = 'notice', options = {}) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, host: '', protocol: '', parsedUrl: null, reason: 'MISSING_URL', severity: 'review' };
  }

  const trimmed = rawUrl.trim();
  if (/^(javascript|vbscript|data|file):/i.test(trimmed)) {
    return { valid: false, host: '', protocol: trimmed.split(':')[0].toLowerCase(), parsedUrl: null, reason: 'UNSAFE_URI_SCHEME', severity: 'quarantine' };
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, host: '', protocol: '', parsedUrl: null, reason: 'MALFORMED_URL', severity: 'quarantine' };
  }

  const protocol = parsed.protocol.toLowerCase();
  const allowHttpForLocalMock = Boolean(options.allowHttpForLocalMock);
  if (protocol !== 'https:' && !(allowHttpForLocalMock && protocol === 'http:')) {
    return { valid: false, host: parsed.hostname.toLowerCase(), protocol, parsedUrl: parsed, reason: 'NON_HTTPS_URL', severity: 'quarantine' };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, host: parsed.hostname.toLowerCase(), protocol, parsedUrl: parsed, reason: 'URL_CREDENTIALS_FORBIDDEN', severity: 'quarantine' };
  }

  const host = parsed.hostname.toLowerCase().replace(/\.+$/, '');
  if (!host) {
    return { valid: false, host: '', protocol, parsedUrl: parsed, reason: 'EMPTY_HOSTNAME', severity: 'quarantine' };
  }

  if (parsed.port && !((protocol === 'https:' && parsed.port === '443') || (allowHttpForLocalMock && protocol === 'http:'))) {
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'NON_STANDARD_PORT', severity: 'quarantine' };
  }

  if (net.isIP(host.replace(/^\[|\]$/g, '')) !== 0) {
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'IP_LITERAL_FORBIDDEN', severity: 'quarantine' };
  }

  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'INTERNAL_HOST_FORBIDDEN', severity: 'quarantine' };
  }

  if (isShortenerHost(host)) {
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'URL_SHORTENER_FORBIDDEN', severity: 'quarantine' };
  }

  if (!sourceKey) {
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'MISSING_SOURCE_KEY', severity: 'quarantine' };
  }

  const allowed = getAllowedHostsForSource(sourceKey);
  if (!allowed.known) {
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'UNREGISTERED_SOURCE_POLICY', severity: 'quarantine' };
  }

  if (linkKind === 'apply') {
    if (allowed.applyHosts.has(host)) {
      return { valid: true, host, protocol, parsedUrl: parsed };
    }
    if (allowed.reviewOnlyApplyHosts.has(host)) {
      return {
        valid: false,
        reviewOnlyVendor: true,
        host,
        protocol,
        parsedUrl: parsed,
        reason: 'THIRD_PARTY_APPLY_VENDOR_REQUIRES_REVIEW',
        severity: 'review'
      };
    }
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'UNTRUSTED_APPLY_DOMAIN', severity: 'quarantine' };
  }

  if (!allowed.noticeHosts.has(host)) {
    return { valid: false, host, protocol, parsedUrl: parsed, reason: 'UNTRUSTED_NOTICE_DOMAIN', severity: 'quarantine' };
  }

  return { valid: true, host, protocol, parsedUrl: parsed };
}

