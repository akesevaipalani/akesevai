// server/ingestion/preValidationHardening.test.mjs
// Offline unit & integration tests for Step 2.85 / 2.85.2 pre-validation hardening (B-1, B-2, M-1, M-3).
// Strictly offline: stubs https.request & dnsLookup locally; zero live scraping, ports, or DB writes.

import test from 'node:test';
import assert from 'node:assert/strict';
import https from 'node:https';
import { EventEmitter } from 'node:events';

import { OFFICIAL_EXAM_SOURCES } from './sourcesConfig.js';
import { validateExplicitSourceUrl } from './officialDomainPolicy.js';
import { safeFetchHtml } from './fetchHelper.js';
import {
  normalizeNotificationPosts,
  runAllIngestionJobs
} from './ingestionManager.js';
import { registerNotificationAndIngestionRoutes } from './ingestionRoutes.js';
import { evaluateCandidateTrust } from './trustScoringEngine.js';
import {
  buildIdentityFingerprint,
  buildNonDestructiveMerge,
  computeContentHash,
  evaluateCorrigendumUpdate
} from './corrigendumHelper.js';
import { isDuplicateNotification } from './deduplicationHelper.js';

import {
  scrapeTnpscNotifications,
  scrapeTnusrbNotifications,
  scrapeTrbNotifications,
  scrapeMrbNotifications
} from './scrapers/tnStateScraper.js';
import {
  scrapeIbpsNotifications,
  scrapeSbiNotifications,
  scrapeRbiNotifications
} from './scrapers/bankingScraper.js';
import {
  resolveUrlSafe,
  scrapeUpscNotifications,
  scrapeSscNotifications,
  scrapeRrbNotifications,
  scrapeIndiaPostNotifications
} from './scrapers/centralGovtScraper.js';
import {
  scrapeIndianArmyNotifications,
  scrapeIndianNavyNotifications,
  scrapeIndianAirforceNotifications,
  scrapeCtetNotifications,
  scrapeKvsNotifications
} from './scrapers/defenceTeachingScraper.js';
import {
  scrapeLicNotifications,
  scrapeNiaclNotifications,
  scrapeBelNotifications,
  scrapeBhelNotifications
} from './scrapers/insurancePsuScraper.js';

/**
 * Helper that temporarily stubs https.request for deterministic offline HTTP/redirect tests.
 */
async function withMockHttpsRequest(handler, fn) {
  const originalRequest = https.request;
  const calls = [];

  https.request = (reqOptions, cb) => {
    calls.push(reqOptions);
    const req = new EventEmitter();
    req.destroyed = false;
    req.destroy = () => {
      req.destroyed = true;
    };
    req.end = () => {
      queueMicrotask(() => {
        const spec = handler(reqOptions, calls.length);
        const res = new EventEmitter();
        res.statusCode = spec.statusCode ?? 200;
        res.headers = spec.headers ?? { 'content-type': 'text/html; charset=utf-8' };
        res.resume = () => {};
        res.destroy = () => {};
        cb(res);
        if (spec.body !== undefined) {
          res.emit('data', Buffer.from(spec.body, 'utf8'));
        }
        res.emit('end');
      });
    };
    return req;
  };

  try {
    return await fn(calls);
  } finally {
    https.request = originalRequest;
  }
}

const PUBLIC_TEST_DNS = async () => [{ address: '93.184.216.34', family: 4 }];

function createReadOnlyMockNotificationModel(existingDocs = []) {
  return {
    find() {
      return {
        lean: async () => existingDocs.map((d) => ({ ...d }))
      };
    },
    create() {
      throw new Error('DB_WRITE_FORBIDDEN_IN_DRY_RUN_TEST');
    },
    updateOne() {
      throw new Error('DB_WRITE_FORBIDDEN_IN_DRY_RUN_TEST');
    }
  };
}

function createMockExpressApp() {
  const routes = new Map();
  const register = (method, pathOrPaths, handler) => {
    const paths = Array.isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths];
    for (const p of paths) {
      routes.set(`${method}:${p}`, handler);
    }
  };
  return {
    get: (p, h) => register('GET', p, h),
    post: (p, h) => register('POST', p, h),
    put: (p, h) => register('PUT', p, h),
    delete: (p, h) => register('DELETE', p, h),
    async invoke(method, path, req = {}) {
      const handler = routes.get(`${method}:${path}`);
      assert.ok(handler, `Expected registered route ${method} ${path}`);
      const response = { statusCode: 200, body: null };
      const res = {
        status(code) {
          response.statusCode = code;
          return res;
        },
        json(payload) {
          response.body = payload;
          return res;
        }
      };
      await handler(req, res);
      return response;
    }
  };
}

test('B-1: safeFetchHtml enforces per-source allowlist on initial URL before DNS or network', async () => {
  let dnsCalled = false;
  const forbiddenDns = async () => {
    dnsCalled = true;
    throw new Error('DNS_MUST_NOT_BE_CALLED');
  };

  const resExternal = await safeFetchHtml('https://unauthorized-public.example.com/notice.html', {
    sourceKey: 'tnpsc',
    skipRateLimit: true,
    dnsLookup: forbiddenDns
  });
  assert.equal(resExternal.ok, false);
  assert.equal(resExternal.failureCode, 'UNTRUSTED_NOTICE_DOMAIN');
  assert.equal(dnsCalled, false);

  // Cross-source domain must also be rejected for the wrong sourceKey
  const resCrossSource = await safeFetchHtml('https://upsc.gov.in/active-examinations', {
    sourceKey: 'tnpsc',
    skipRateLimit: true,
    dnsLookup: forbiddenDns
  });
  assert.equal(resCrossSource.ok, false);
  assert.equal(resCrossSource.failureCode, 'UNTRUSTED_NOTICE_DOMAIN');
  assert.equal(dnsCalled, false);

  // Every configured source's own official URL must pass explicit allowlist validation
  for (const src of OFFICIAL_EXAM_SOURCES) {
    const check = validateExplicitSourceUrl(src.url, src.key, 'notice');
    assert.equal(check.valid, true, `Expected official URL to pass allowlist for ${src.key}`);
  }
});

test('B-1: canonical sourceKey enforcement blocks whitespace, mismatched caller keys, and supports safe fallback', async () => {
  let dnsCalls = 0;
  const failDns = async () => {
    dnsCalls++;
    throw new Error('DNS_MUST_NOT_BE_CALLED');
  };

  // 1) Whitespace-only options.sourceKey = '   ' must NEVER bypass explicit source-domain validation
  const wsWithConfigKey = await scrapeTnpscNotifications(
    { key: 'tnpsc', url: 'https://unauthorized-public.example.com/notice' },
    { sourceKey: '   ', skipRateLimit: true, dnsLookup: failDns }
  );
  assert.equal(wsWithConfigKey.success, false);
  assert.match(wsWithConfigKey.error, /UNTRUSTED_NOTICE_DOMAIN/);

  const wsWithBlankConfigKey = await scrapeTnpscNotifications(
    { key: '   ', url: 'https://unauthorized-public.example.com/notice' },
    { sourceKey: '   ', skipRateLimit: true, dnsLookup: failDns }
  );
  assert.equal(wsWithBlankConfigKey.success, false);
  assert.match(wsWithBlankConfigKey.error, /UNTRUSTED_NOTICE_DOMAIN/);

  // 2) Mismatched options.sourceKey MUST NOT authorize another source's domain (with or without sourceConfig.key)
  const mismatchedWithConfig = await scrapeTnpscNotifications(
    { key: 'tnpsc', url: 'https://upsc.gov.in/active-examinations' },
    { sourceKey: 'upsc_active', skipRateLimit: true, dnsLookup: failDns }
  );
  assert.equal(mismatchedWithConfig.success, false);
  assert.match(mismatchedWithConfig.error, /UNTRUSTED_NOTICE_DOMAIN/);

  const mismatchedWithoutConfig = await scrapeTnpscNotifications(
    { key: '', url: 'https://upsc.gov.in/active-examinations' },
    { sourceKey: 'upsc_active', skipRateLimit: true, dnsLookup: failDns }
  );
  assert.equal(mismatchedWithoutConfig.success, false);
  assert.match(mismatchedWithoutConfig.error, /UNTRUSTED_NOTICE_DOMAIN/);

  // Verify mismatched options.sourceKey cannot authorize another source across all 5 scraper modules
  const crossModuleMismatchCases = [
    ['tnpsc', scrapeTnpscNotifications, 'https://upsc.gov.in/active-examinations', 'upsc_active'],
    ['ibps', scrapeIbpsNotifications, 'https://www.tnpsc.gov.in/English/Notification.aspx', 'tnpsc'],
    ['upsc_active', scrapeUpscNotifications, 'https://www.ibps.in/', 'ibps'],
    ['indian_navy', scrapeIndianNavyNotifications, 'https://bel-india.in/job-notifications/', 'bel_psu'],
    ['bel_psu', scrapeBelNotifications, 'https://www.joinindiannavy.gov.in/en/page/current-events.html', 'indian_navy']
  ];
  for (const [canonicalKey, fn, foreignUrl, foreignKey] of crossModuleMismatchCases) {
    const res = await fn(
      { key: canonicalKey, url: foreignUrl },
      { sourceKey: foreignKey, skipRateLimit: true, dnsLookup: failDns }
    );
    assert.equal(res.success, false, `${canonicalKey} must reject ${foreignUrl} even when options.sourceKey='${foreignKey}'`);
    assert.match(res.error, /UNTRUSTED_NOTICE_DOMAIN/);
  }

  // 3) Missing both sourceConfig.key and options.sourceKey falls back safely to canonical fixed fallbackKey
  const missingBothUnauthorized = await scrapeTnpscNotifications(
    { url: 'https://unauthorized-public.example.com/notice' },
    { skipRateLimit: true, dnsLookup: failDns }
  );
  assert.equal(missingBothUnauthorized.success, false);
  assert.match(missingBothUnauthorized.error, /UNTRUSTED_NOTICE_DOMAIN/);

  assert.equal(dnsCalls, 0, 'No blocked request should ever reach DNS');

  // 4) Valid sourceConfig.key with incorrect caller key preserves valid source behavior for canonical host
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: '<table><tr><th>SNo</th><th>No</th><th>Post</th><th>Open</th><th>Close</th></tr></table>'
    }),
    async (calls) => {
      const validRes = await scrapeTnpscNotifications(
        { key: 'tnpsc', url: 'https://www.tnpsc.gov.in/English/Notification.aspx' },
        { sourceKey: 'upsc_active', skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(validRes.success, true);
      assert.equal(calls.length, 1);

      // Missing both sourceConfig.key and options.sourceKey still succeeds for canonical TNPSC URL
      const fallbackRes = await scrapeTnpscNotifications(
        { url: 'https://www.tnpsc.gov.in/English/Notification.aspx' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(fallbackRes.success, true);
      assert.equal(calls.length, 2);
    }
  );
});

test('B-1: single-hop, multi-hop, protocol-relative, and HTTPS-to-HTTP downgrade redirects are rejected', async () => {
  // 1) Single-hop redirect to unauthorized public domain in safeFetchHtml
  await withMockHttpsRequest(
    () => ({
      statusCode: 302,
      headers: { location: 'https://evil-public.example.com/phishing-notice' }
    }),
    async (calls) => {
      const directRes = await safeFetchHtml('https://www.tnpsc.gov.in/English/Notification.aspx', {
        sourceKey: 'tnpsc',
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS
      });
      assert.equal(directRes.ok, false);
      assert.equal(directRes.status, 302);
      assert.equal(directRes.failureCode, 'UNTRUSTED_REDIRECT');
      assert.match(directRes.error, /UNTRUSTED_NOTICE_DOMAIN/);
      assert.equal(calls.length, 1, 'Unauthorized redirect target must never be requested');
    }
  );

  // 2) End-to-end through ingestionManager.js -> tnStateScraper.js -> safeFetchHtml()
  await withMockHttpsRequest(
    () => ({
      statusCode: 301,
      headers: { location: 'https://malicious-mirror.example.org/tnpsc' }
    }),
    async (calls) => {
      const runRes = await runAllIngestionJobs(createReadOnlyMockNotificationModel([]), {
        dryRun: true,
        sourceKey: 'tnpsc',
        skipDocVerification: true,
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS
      });
      assert.equal(runRes.sourceResults.tnpsc.success, false);
      assert.match(runRes.sourceResults.tnpsc.error, /UNTRUSTED_REDIRECT/);
      assert.match(runRes.sourceResults.tnpsc.error, /UNTRUSTED_NOTICE_DOMAIN/);
      assert.equal(calls.length, 1, 'ingestionManager pipeline must stop before following unauthorized redirect');
    }
  );

  // 3) Multi-hop redirect: allowed host 1 -> allowed host 2 -> unauthorized public domain (blocked on hop 2)
  await withMockHttpsRequest(
    (_reqOpts, callNo) => {
      if (callNo === 1) {
        return {
          statusCode: 302,
          headers: { location: 'https://tnpsc.gov.in/English/Notification.aspx' }
        };
      }
      return {
        statusCode: 302,
        headers: { location: 'https://evil-hop2.example.com/payload' }
      };
    },
    async (calls) => {
      const multiHopRes = await safeFetchHtml('https://www.tnpsc.gov.in/English/Notification.aspx', {
        sourceKey: 'tnpsc',
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS
      });
      assert.equal(multiHopRes.ok, false);
      assert.equal(multiHopRes.failureCode, 'UNTRUSTED_REDIRECT');
      assert.match(multiHopRes.error, /UNTRUSTED_NOTICE_DOMAIN/);
      assert.equal(calls.length, 2, 'Must stop before following unauthorized hop 3');
    }
  );

  // 4) Protocol-relative redirect (Location: //evil.example.com/phish) to unauthorized host
  await withMockHttpsRequest(
    () => ({
      statusCode: 302,
      headers: { location: '//evil-relative.example.com/phish' }
    }),
    async (calls) => {
      const protoRelRes = await safeFetchHtml('https://www.tnpsc.gov.in/English/Notification.aspx', {
        sourceKey: 'tnpsc',
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS
      });
      assert.equal(protoRelRes.ok, false);
      assert.equal(protoRelRes.failureCode, 'UNTRUSTED_REDIRECT');
      assert.match(protoRelRes.error, /UNTRUSTED_NOTICE_DOMAIN/);
      assert.equal(calls.length, 1);
    }
  );

  // 5) HTTPS-to-HTTP downgrade redirect even to an allowlisted hostname must be rejected
  await withMockHttpsRequest(
    () => ({
      statusCode: 302,
      headers: { location: 'http://www.tnpsc.gov.in/English/Notification.aspx' }
    }),
    async (calls) => {
      const downgradeRes = await safeFetchHtml('https://www.tnpsc.gov.in/English/Notification.aspx', {
        sourceKey: 'tnpsc',
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS
      });
      assert.equal(downgradeRes.ok, false);
      assert.equal(downgradeRes.failureCode, 'NON_HTTPS_URL');
      assert.match(downgradeRes.error, /NON_HTTPS_URL/);
      assert.equal(calls.length, 1);
    }
  );

  // 6) Authorized same-policy host redirect (www.tnpsc.gov.in -> tnpsc.gov.in) succeeds cleanly
  await withMockHttpsRequest(
    (_reqOpts, callNo) => {
      if (callNo === 1) {
        return {
          statusCode: 302,
          headers: { location: 'https://tnpsc.gov.in/English/Notification.aspx' }
        };
      }
      return {
        statusCode: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
        body: '<table><tr><th>SNo</th><th>No</th><th>Post</th><th>Open</th><th>Close</th></tr></table>'
      };
    },
    async (calls) => {
      const allowedRes = await safeFetchHtml('https://www.tnpsc.gov.in/English/Notification.aspx', {
        sourceKey: 'tnpsc',
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS
      });
      assert.equal(allowedRes.ok, true);
      assert.equal(allowedRes.finalUrl, 'https://tnpsc.gov.in/English/Notification.aspx');
      assert.equal(calls.length, 2);
    }
  );
});

test('B-1: all five scraper modules (all 20 scrapers) forward canonical sourceKey to safeFetchHtml', async () => {
  const allScrapers = [
    // 1. tnStateScraper.js
    ['tnpsc', scrapeTnpscNotifications],
    ['tnusrb', scrapeTnusrbNotifications],
    ['trb_tn', scrapeTrbNotifications],
    ['mrb_tn', scrapeMrbNotifications],
    // 2. bankingScraper.js
    ['ibps', scrapeIbpsNotifications],
    ['sbi_careers', scrapeSbiNotifications],
    ['rbi_vacancies', scrapeRbiNotifications],
    // 3. centralGovtScraper.js
    ['upsc_active', scrapeUpscNotifications],
    ['ssc_notices', scrapeSscNotifications],
    ['rrb_chennai', scrapeRrbNotifications],
    ['india_post_gds', scrapeIndiaPostNotifications],
    // 4. defenceTeachingScraper.js
    ['indian_army', scrapeIndianArmyNotifications],
    ['indian_navy', scrapeIndianNavyNotifications],
    ['indian_airforce', scrapeIndianAirforceNotifications],
    ['ctet_cbse', scrapeCtetNotifications],
    ['kvs_delhi', scrapeKvsNotifications],
    // 5. insurancePsuScraper.js
    ['lic_careers', scrapeLicNotifications],
    ['niacl_careers', scrapeNiaclNotifications],
    ['bel_psu', scrapeBelNotifications],
    ['bhel_psu', scrapeBhelNotifications]
  ];

  let dnsCalls = 0;
  const failDns = async () => {
    dnsCalls++;
    throw new Error('DNS_MUST_NOT_BE_CALLED_WHEN_SOURCE_KEY_IS_FORWARDED');
  };

  for (const [key, scraperFn] of allScrapers) {
    // Direct call with config key
    const directRes = await scraperFn(
      { key, url: 'https://unauthorized-public.example.com/notices' },
      { skipRateLimit: true, dnsLookup: failDns }
    );
    assert.equal(directRes.success, false, `${key} must fail on unauthorized host`);
    assert.match(directRes.error, /UNTRUSTED_NOTICE_DOMAIN/, `${key} must enforce explicit source allowlist`);

    // Whitespace options.sourceKey must never bypass allowlist on any of the 20 scrapers
    const wsRes = await scraperFn(
      { key: '', url: 'https://unauthorized-public.example.com/notices' },
      { sourceKey: '   ', skipRateLimit: true, dnsLookup: failDns }
    );
    assert.equal(wsRes.success, false, `${key} must not bypass allowlist on whitespace options.sourceKey`);
    assert.match(wsRes.error, /UNTRUSTED_NOTICE_DOMAIN/);
  }

  assert.equal(dnsCalls, 0, 'No scraper should reach DNS resolution for unauthorized public domains');

  // Verify ingestionManager.js passes canonical sourceKey in options to scraperFn across all 5 modules
  const representativeKeys = ['tnpsc', 'ibps', 'upsc_active', 'indian_navy', 'bel_psu'];
  for (const key of representativeKeys) {
    let capturedOptions = null;
    await runAllIngestionJobs(createReadOnlyMockNotificationModel([]), {
      dryRun: true,
      sourceKey: key,
      skipDocVerification: true,
      skipRateLimit: true,
      scraperOverrides: {
        [key]: async (_source, opts) => {
          capturedOptions = opts;
          return { success: true, source: key, items: [] };
        }
      }
    });
    assert.equal(capturedOptions?.sourceKey, key, `ingestionManager must pass sourceKey='${key}'`);
  }
});

test('B-2: indian_army is disabled across default orchestrator, programmatic explicit call, and HTTP routes while preserving CAPTCHA quarantine', async () => {
  const armySource = OFFICIAL_EXAM_SOURCES.find((s) => s.key === 'indian_army');
  assert.ok(armySource, 'indian_army config entry must remain present');
  assert.equal(armySource.enabled, false, 'indian_army must be disabled');
  assert.equal(armySource.requiresCaptcha, true, 'requiresCaptcha flag must remain true');

  const enabledSources = OFFICIAL_EXAM_SOURCES.filter((s) => s.enabled);
  assert.equal(enabledSources.length, 19);
  assert.equal(enabledSources.some((s) => s.key === 'indian_army'), false);

  // 1) Default orchestrator run (no sourceKey filter) must exclude indian_army completely
  const invokedSources = [];
  const overridesAll = Object.fromEntries(
    OFFICIAL_EXAM_SOURCES.map((s) => [
      s.key,
      async () => {
        invokedSources.push(s.key);
        return { success: true, source: s.key, items: [] };
      }
    ])
  );
  const defaultRunRes = await runAllIngestionJobs(createReadOnlyMockNotificationModel([]), {
    dryRun: true,
    skipDocVerification: true,
    skipRateLimit: true,
    scraperOverrides: overridesAll
  });
  assert.equal(invokedSources.length, 19);
  assert.equal(invokedSources.includes('indian_army'), false);
  assert.equal(defaultRunRes.sourceResults.indian_army, undefined);

  // 2) Programmatic explicit sourceKey='indian_army' must be rejected without running scraper
  let disabledScraperCalled = false;
  const explicitDisabledRes = await runAllIngestionJobs(createReadOnlyMockNotificationModel([]), {
    dryRun: true,
    sourceKey: 'indian_army',
    skipDocVerification: true,
    skipRateLimit: true,
    scraperOverrides: {
      indian_army: async () => {
        disabledScraperCalled = true;
        return { success: true, source: 'indian_army', items: [] };
      }
    }
  });
  assert.equal(disabledScraperCalled, false);
  assert.equal(explicitDisabledRes.status, 'rejected');
  assert.equal(explicitDisabledRes.error, 'SOURCE_DISABLED_OR_UNKNOWN');
  assert.equal(explicitDisabledRes.sourcesAttempted, 0);
  assert.match(explicitDisabledRes.errors[0], /indian_army.*disabled/i);

  // 3) HTTP route rejection for indian_army on both ingest-job and worker-tick endpoints (in-memory, no server/DB)
  const mockApp = createMockExpressApp();
  let routeRunnerInvoked = false;
  registerNotificationAndIngestionRoutes(mockApp, {
    Notification: createReadOnlyMockNotificationModel([]),
    resolveAuthContext: () => ({ isAdmin: true, role: 'admin' }),
    syncAllVerifiedNotificationsFeed: async () => ({ synced: 0 }),
    env: { INGESTION_SECRET_KEY: 'test-secret-key-2852' },
    ingestionRunner: async () => {
      routeRunnerInvoked = true;
      return { status: 'completed' };
    }
  });

  const workerTickResp = await mockApp.invoke('POST', '/api/notifications/worker-tick', {
    headers: { 'x-ingestion-secret': 'test-secret-key-2852' },
    query: { sourceKey: 'indian_army', dryRun: 'true' },
    body: {}
  });
  assert.equal(workerTickResp.statusCode, 400);
  assert.equal(workerTickResp.body.success, false);
  assert.equal(workerTickResp.body.error, 'INVALID_SOURCE_KEY');
  assert.equal(workerTickResp.body.validSourceKeys.includes('indian_army'), false);

  const ingestJobResp = await mockApp.invoke('POST', '/api/notifications/ingest-job', {
    headers: { 'x-ingestion-secret': 'test-secret-key-2852' },
    query: { sourceKey: 'indian_army', dryRun: 'true' },
    body: {}
  });
  assert.equal(ingestJobResp.statusCode, 400);
  assert.equal(ingestJobResp.body.success, false);
  assert.equal(ingestJobResp.body.error, 'INVALID_SOURCE_KEY');
  assert.equal(ingestJobResp.body.validSourceKeys.includes('indian_army'), false);
  assert.equal(routeRunnerInvoked, false, 'HTTP routes must reject disabled indian_army before calling ingestionRunner');

  // 4) Trust scoring must still quarantine any indian_army candidate under CAPTCHA_PROTECTED_SOURCE
  const trustEval = evaluateCandidateTrust(
    {
      sourceKey: 'indian_army',
      category: 'police_defence',
      service: 'Indian Army Agniveer Recruitment Rally 2026',
      detailsLink: 'https://joinindianarmy.nic.in/notice.pdf',
      applyLink: 'https://joinindianarmy.nic.in/'
    },
    {
      sourceKey: 'indian_army',
      sourceConfig: armySource,
      env: { AUTO_PUBLISH_ENABLED: 'false', AUTO_PUBLISH_RESULTS: 'false' }
    }
  );
  assert.equal(trustEval.ingestionStatus, 'quarantined');
  assert.equal(trustEval.isVerified, false);
  assert.equal(trustEval.autoPublished, false);
  assert.match(trustEval.quarantineReason, /CAPTCHA_PROTECTED_SOURCE/);

  // 5) Scraper CAPTCHA detection remains intact
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: '<html><form action="Authentication.aspx">Enter the characters shown in the image</form></html>'
    }),
    async () => {
      const scrapeRes = await scrapeIndianArmyNotifications(armySource, {
        skipRateLimit: true,
        dnsLookup: PUBLIC_TEST_DNS
      });
      assert.equal(scrapeRes.success, false);
      assert.equal(scrapeRes.requiresCaptcha, true);
    }
  );
});

test('M-1: vacancies normalize into notificationSchema.posts end-to-end inside runAllIngestionJobs without overwriting valid posts', async () => {
  // Standalone helper boundary checks
  assert.equal(normalizeNotificationPosts({ vacancies: '6244 Posts' }), '6244 Posts');
  assert.equal(normalizeNotificationPosts({ vacancies: 250 }), '250');
  assert.equal(normalizeNotificationPosts({ posts: '120 Posts', vacancies: 'Not Specified' }), '120 Posts');
  assert.equal(normalizeNotificationPosts({ posts: '120 Posts', vacancies: '999 Posts' }), '120 Posts');
  assert.equal(normalizeNotificationPosts({ posts: '', vacancies: '85 Vacancies' }), '85 Vacancies');
  assert.equal(normalizeNotificationPosts({ posts: 'Not Specified', vacancies: '85 Vacancies' }), '85 Vacancies');
  assert.equal(normalizeNotificationPosts({ posts: 'Multiple Posts', vacancies: 'Not Specified' }), 'Multiple Posts');
  assert.equal(normalizeNotificationPosts({ vacancies: 'Not Specified' }), 'Not Specified');
  assert.equal(normalizeNotificationPosts({}), 'Not Specified');

  const sampleItem = {
    sourceKey: 'tnpsc',
    category: 'tnpsc',
    organization: 'Tamil Nadu Public Service Commission (TNPSC)',
    service: 'TNPSC Combined Civil Services Group IV 2026',
    postName: 'Group IV',
    notificationNo: '01/2026',
    openingDate: '2026-11-20',
    closingDate: '2026-12-25',
    examDate: 'To Be Announced',
    detailsLink: 'https://www.tnpsc.gov.in/Document/english/01_2026.pdf',
    applyLink: 'https://apply.tnpscexams.in/'
  };

  // Use a distinct legacy id and fingerprint so EXACT_ID_MATCH / FINGERPRINT_MATCH CANNOT short-circuit,
  // forcing deduplicationHelper into IDENTITY_FINGERPRINT_MATCH + contentHash comparison!
  const identityFp = buildIdentityFingerprint(sampleItem);
  const existingWith5000 = {
    ...sampleItem,
    id: 'notif-tnpsc-legacy-id-5000',
    fingerprint: 'legacy-fingerprint-nonmatching-5000',
    identityFingerprint: identityFp,
    posts: '5000',
    contentHash: computeContentHash({ ...sampleItem, posts: '5000' }),
    ingestionStatus: 'pending_review'
  };
  const existingWith6244 = {
    ...sampleItem,
    id: 'notif-tnpsc-legacy-id-6244',
    fingerprint: 'legacy-fingerprint-nonmatching-6244',
    identityFingerprint: identityFp,
    posts: '6244',
    contentHash: computeContentHash({ ...sampleItem, posts: '6244' }),
    ingestionStatus: 'pending_review'
  };

  // A) Mutation-sensitive test #1:
  // Candidate has ONLY vacancies='6244' (no posts field) and ALL OTHER FIELDS identical to existingWith5000.
  // If `posts: normalizeNotificationPosts(rawItem)` is removed from ingestionManager.js, buildNonDestructiveMerge
  // sees candidate.posts === '' (placeholder) -> changedFields = [] -> newlyInserted becomes 0 and THIS FAILS.
  let verifyDocCallsA = 0;
  const runVacancyUpdate = await runAllIngestionJobs(createReadOnlyMockNotificationModel([existingWith5000]), {
    dryRun: true,
    sourceKey: 'tnpsc',
    skipRateLimit: true,
    verifyDocumentFn: async () => {
      verifyDocCallsA++;
      return { docState: 'structurally_verified', reason: 'PDF_OK' };
    },
    scraperOverrides: {
      tnpsc: async () => ({
        success: true,
        source: 'tnpsc',
        items: [{ ...sampleItem, vacancies: '6244' }]
      })
    }
  });
  assert.equal(verifyDocCallsA, 1, 'Changed vacancy count must reach corrigendum evaluation');
  assert.equal(runVacancyUpdate.sourceResults.tnpsc.newlyInserted, 1, 'Normalized vacancies=6244 must queue a revision proposal against posts=5000');
  assert.equal(runVacancyUpdate.sourceResults.tnpsc.pendingReview, 1);
  assert.equal(runVacancyUpdate.sourceResults.tnpsc.duplicatesSkipped, 0);
  assert.equal(runVacancyUpdate.sourceResults.tnpsc.autoPublished, 0);

  // B) Mutation-sensitive test #2:
  // Candidate has vacancies='6244' (no posts field) against existingWith6244 (posts='6244', distinct legacy fingerprint).
  // ONLY when ingestionManager normalizes vacancies -> posts='6244' does candidateContentHash equal existing.contentHash,
  // skipping verifyDocumentFn completely (verifyDocCallsB === 0). Removing normalization causes verifyDocCallsB === 1 -> FAILS!
  let verifyDocCallsB = 0;
  const runExactNormalizedHash = await runAllIngestionJobs(createReadOnlyMockNotificationModel([existingWith6244]), {
    dryRun: true,
    sourceKey: 'tnpsc',
    skipRateLimit: true,
    verifyDocumentFn: async () => {
      verifyDocCallsB++;
      return { docState: 'structurally_verified', reason: 'PDF_OK' };
    },
    scraperOverrides: {
      tnpsc: async () => ({
        success: true,
        source: 'tnpsc',
        items: [{ ...sampleItem, vacancies: '6244' }]
      })
    }
  });
  assert.equal(verifyDocCallsB, 0, 'Normalized posts=6244 must produce exact contentHash match before doc verification');
  assert.equal(runExactNormalizedHash.sourceResults.tnpsc.duplicatesSkipped, 1);
  assert.equal(runExactNormalizedHash.sourceResults.tnpsc.newlyInserted, 0);

  // C) Existing valid candidate.posts ('6244') must NEVER be overwritten by vacancies ('9999') inside runAllIngestionJobs
  let verifyDocCallsC = 0;
  const runPreserveCandidatePosts = await runAllIngestionJobs(createReadOnlyMockNotificationModel([existingWith6244]), {
    dryRun: true,
    sourceKey: 'tnpsc',
    skipRateLimit: true,
    verifyDocumentFn: async () => {
      verifyDocCallsC++;
      return { docState: 'structurally_verified', reason: 'PDF_OK' };
    },
    scraperOverrides: {
      tnpsc: async () => ({
        success: true,
        source: 'tnpsc',
        items: [{ ...sampleItem, posts: '6244', vacancies: '9999' }]
      })
    }
  });
  assert.equal(verifyDocCallsC, 0, 'Valid candidate.posts=6244 must be preserved over vacancies=9999');
  assert.equal(runPreserveCandidatePosts.sourceResults.tnpsc.duplicatesSkipped, 1);
  assert.equal(runPreserveCandidatePosts.sourceResults.tnpsc.newlyInserted, 0);

  // D) Placeholder vacancies ('Not Specified') must NOT replace existing valid posts ('6244')
  const runPlaceholderPreservesValid = await runAllIngestionJobs(createReadOnlyMockNotificationModel([existingWith6244]), {
    dryRun: true,
    sourceKey: 'tnpsc',
    skipRateLimit: true,
    verifyDocumentFn: async () => ({ docState: 'structurally_verified', reason: 'PDF_OK' }),
    scraperOverrides: {
      tnpsc: async () => ({
        success: true,
        source: 'tnpsc',
        items: [{ ...sampleItem, vacancies: 'Not Specified' }]
      })
    }
  });
  assert.equal(runPlaceholderPreservesValid.sourceResults.tnpsc.duplicatesSkipped, 1);
  assert.equal(runPlaceholderPreservesValid.sourceResults.tnpsc.newlyInserted, 0);

  // E) Direct non-destructive merge & corrigendum checks confirm proposedFields.posts
  const mergeKeepValid = buildNonDestructiveMerge(
    { posts: '6244' },
    { posts: normalizeNotificationPosts({ vacancies: 'Not Specified' }) }
  );
  assert.equal(mergeKeepValid.changedFields.includes('posts'), false);
  assert.equal(mergeKeepValid.merged.posts, undefined);

  const corrEval = evaluateCorrigendumUpdate({
    existing: existingWith5000,
    candidate: { ...sampleItem, posts: normalizeNotificationPosts({ vacancies: '6244' }) },
    docVerification: { docState: 'structurally_verified', reason: 'PDF_OK' },
    env: { AUTO_PUBLISH_ENABLED: 'false' }
  });
  assert.equal(corrEval.decision, 'pending_corrigendum_review');
  assert.equal(corrEval.proposedFields.posts, '6244');
});

test('M-3: resolveUrlSafe, centralGovtScraper (incl. RRB), harmonized scrapers, and source metadata reject unsafe URLs', async () => {
  const base = 'https://upsc.gov.in/active-examinations';

  // Comprehensive unsafe & malformed URL rejection matrix
  const rejectedInputs = [
    '',
    '   ',
    null,
    undefined,
    '#',
    '#fragment',
    '  #section-1  ',
    'javascript:void(0)',
    'JAVASCRIPT:alert(1)',
    '  JaVaScRiPt:; ',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    'java\rscript:alert(1)',
    '\x00javascript:alert(1)',
    'vbscript:msgbox(1)',
    'VBSCRIPT:CreateObject("WScript.Shell")',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
    'mailto:admin@example.com',
    'tel:+911234567890',
    'ftp://example.com/notice.pdf',
    'https://',
    'http://',
    'https://[broken',
    '//evil.example.com/phish.pdf',
    'https://evil.example.com\\@upsc.gov.in/notice.pdf'
  ];
  for (const bad of rejectedInputs) {
    assert.equal(resolveUrlSafe(bad, base), '', `Expected resolveUrlSafe to reject: ${JSON.stringify(bad)}`);
  }

  // Valid HTTPS & relative URL normalization via new URL()
  assert.equal(
    resolveUrlSafe('/sites/default/files/Exam Notice 2026.pdf', base),
    'https://upsc.gov.in/sites/default/files/Exam%20Notice%202026.pdf'
  );
  assert.equal(
    resolveUrlSafe('  https://upsc.gov.in/sites/default/files/Exam-Notice-2026.pdf  ', base),
    'https://upsc.gov.in/sites/default/files/Exam-Notice-2026.pdf'
  );

  // UPSC scraper must not emit unsafe hrefs
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: `
        <table>
          <tr><th>Examination Name</th><th>Notice No</th><th>Commencement</th><th>Last Date</th></tr>
          <tr>
            <td><a href="java&#x09;script:alert(1)">Civil Services Examination 2026</a></td>
            <td>05/2026-CSP</td>
            <td>24-05-2026</td>
            <td>15-03-2026</td>
          </tr>
          <tr>
            <td><a href="#fragment">Combined Defence Services Examination 2026</a></td>
            <td>06/2026-CDS</td>
            <td>14-09-2026</td>
            <td>20-06-2026</td>
          </tr>
        </table>
      `
    }),
    async () => {
      const upscRes = await scrapeUpscNotifications(
        { key: 'upsc_active', url: 'https://upsc.gov.in/active-examinations' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(upscRes.success, true);
      assert.equal(upscRes.items.length, 2);
      for (const item of upscRes.items) {
        assert.equal(item.detailsLink, 'https://upsc.gov.in/active-examinations');
      }
    }
  );

  // RRB scraper must skip ALL unsafe hrefs with zero unsafe string-concatenation fallback
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: `
        <a href="javascript:alert(1)?cenum=01/2026&category=Notification">CEN (01/2026) Fake JS Notice</a>
        <a href="java&#x09;script:void(0)?cenum=02/2026&category=Notification">CEN (02/2026) Fake Tab JS Notice</a>
        <a href="data:text/html,cenum=03/2026&category=Notification">CEN (03/2026) Fake Data Notice</a>
        <a href="#cenum=04/2026&category=Notification">CEN (04/2026) Fake Fragment Notice</a>
        <a href="//evil.example.com/p?cenum=05/2026&category=Notification">CEN (05/2026) Fake ProtoRel Notice</a>
        <a href="notice.php?cenum=09/2025&category=Indicative Notice">CEN (09/2025) Indicative Notice (21-10-2026)</a>
      `
    }),
    async () => {
      const rrbRes = await scrapeRrbNotifications(
        { key: 'rrb_chennai', url: 'https://rrbchennai.gov.in/' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(rrbRes.success, true);
      assert.equal(rrbRes.items.length, 1, 'Only the single valid HTTPS RRB notice should be accepted');
      assert.equal(
        rrbRes.items[0].detailsLink,
        'https://rrbchennai.gov.in/notice.php?cenum=09/2025&category=Indicative%20Notice'
      );
      assert.equal(rrbRes.items[0].notificationNo, 'CEN 09/2025');
    }
  );

  // India Post scraper must skip unsafe hrefs
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: `
        <a href="JAVASCRIPT:alert(1)">Gramin Dak Sevak Special Drive 2026</a>
        <a href="vbscript:msgbox(1)">Descriptive Notification GDS Engagement</a>
        <a href="#gds">Descriptive Notification GDS Online Engagement</a>
        <a href="/notifications/gds-2026.pdf">Gramin Dak Sevak Online Engagement 2026</a>
      `
    }),
    async () => {
      const gdsRes = await scrapeIndiaPostNotifications(
        { key: 'india_post_gds', url: 'https://indiapostgdsonline.gov.in/' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(gdsRes.success, true);
      assert.equal(gdsRes.items.length, 1);
      assert.equal(gdsRes.items[0].detailsLink, 'https://indiapostgdsonline.gov.in/notifications/gds-2026.pdf');
    }
  );

  // SSC scraper rejects unsafe redirectUrl and coerces numeric notice.id cleanly
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rows: [
          {
            id: 4207,
            headline: 'Combined Graduate Level Examination 2026 Notice',
            redirectUrl: 'data:text/html,<script>alert(1)</script>',
            createdAt: '2026-11-25T10:00:00.000Z'
          }
        ]
      })
    }),
    async () => {
      const sscRes = await scrapeSscNotifications(
        { key: 'ssc_notices', url: 'https://ssc.gov.in/api/general-website/portal/notice-boards' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(sscRes.success, true);
      assert.equal(sscRes.items.length, 1);
      assert.equal(sscRes.items[0].detailsLink, 'https://ssc.gov.in/notices');
      assert.equal(typeof sscRes.items[0].notificationNo, 'string');
      assert.equal(sscRes.items[0].notificationNo, '4207');
      const dup = isDuplicateNotification(sscRes.items[0], []);
      assert.equal(dup.isDuplicate, false);
    }
  );

  // Harmonized unsafe href rejection across the other four scraper modules
  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: `
        <a href="java&#x09;script:alert(1)">Joint Recruitment of Sub-Inspector Police Recruitment 2026</a>
        <a href="data:text/html,evil">Common Recruitment Constable 2026</a>
        <a href="//evil.example.com/fake">Sub-Inspector Recruitment Notice 2026</a>
        <a href="/notifications/si-2026.pdf">Joint Recruitment of Sub-Inspector 2026</a>
      `
    }),
    async () => {
      const tnusrbRes = await scrapeTnusrbNotifications(
        { key: 'tnusrb', url: 'https://tnusrb.tn.gov.in/' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(tnusrbRes.success, true);
      assert.equal(tnusrbRes.items.length, 1);
      assert.equal(tnusrbRes.items[0].detailsLink, 'https://tnusrb.tn.gov.in/notifications/si-2026.pdf');
    }
  );

  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: `
        <a href="vbscript:evil()">CRP Probationary Officers Recruitment 2026</a>
        <a href="#top">CRP Clerk Specialist Officer Recruitment 2026</a>
        <a href="/crp-po-2026.pdf">CRP Probationary Officer Notification 2026</a>
      `
    }),
    async () => {
      const ibpsRes = await scrapeIbpsNotifications(
        { key: 'ibps', url: 'https://www.ibps.in/' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(ibpsRes.success, true);
      assert.equal(ibpsRes.items.length, 1);
      assert.equal(ibpsRes.items[0].detailsLink, 'https://www.ibps.in/crp-po-2026.pdf');
    }
  );

  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: `
        <a href="mailto:fake@example.com">Agniveer Officer Entry Course 2026</a>
        <a href="file:///etc/passwd">SSC Officer Application Window 2026</a>
        <a href="/en/page/ssc-officer-2026.html">SSC Officer Entry Application Window 2026</a>
      `
    }),
    async () => {
      const navyRes = await scrapeIndianNavyNotifications(
        { key: 'indian_navy', url: 'https://www.joinindiannavy.gov.in/en/page/current-events.html' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(navyRes.success, true);
      assert.equal(navyRes.items.length, 1);
      assert.equal(navyRes.items[0].detailsLink, 'https://www.joinindiannavy.gov.in/en/page/ssc-officer-2026.html');
    }
  );

  await withMockHttpsRequest(
    () => ({
      statusCode: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
      body: `
        <a href="javascript:void(0)">Recruitment of AAO Officers 2026</a>
        <a href="//evil.example.com/lic.pdf">Recruitment of Assistant Administrative Officer 2026</a>
        <a href="/documents/aao-2026.pdf">Recruitment of AAO Generalist 2026</a>
      `
    }),
    async () => {
      const licRes = await scrapeLicNotifications(
        { key: 'lic_careers', url: 'https://licindia.in/web/guest/careers' },
        { skipRateLimit: true, dnsLookup: PUBLIC_TEST_DNS }
      );
      assert.equal(licRes.success, true);
      assert.equal(licRes.items.length, 1);
      assert.equal(licRes.items[0].detailsLink, 'https://licindia.in/documents/aao-2026.pdf');
    }
  );

  // Confirmed M-3 metadata fixes in sourcesConfig.js
  const byKey = Object.fromEntries(OFFICIAL_EXAM_SOURCES.map((s) => [s.key, s]));
  assert.deepEqual(byKey.rbi_vacancies.expectedFields, ['service', 'openingDate', 'detailsLink']);
  assert.equal(byKey.rrb_chennai.parserType, 'html_links');
  assert.deepEqual(byKey.ssc_notices.expectedFields, ['service', 'detailsLink', 'sourcePublishedAt']);
  assert.deepEqual(byKey.kvs_delhi.expectedFields, ['service', 'openingDate', 'detailsLink']);
  assert.equal(byKey.bel_psu.parserType, 'html_cards');
});
