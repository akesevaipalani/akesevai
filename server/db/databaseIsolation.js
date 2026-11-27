// server/db/databaseIsolation.js
// ============================================================================
// AK E-SEVAI — DATABASE ISOLATION & MULTI-TIER ENVIRONMENT SECURITY SYSTEM
// Target Architecture:
//   - Production:        akesevai
//   - Staging:           akesevai_staging
//   - Local Development: akesevai_dev (or explicitly approved local database)
//   - Automated Tests:   akesevai_test (or isolated in-memory database)
//
// Rules & Policy:
// 1. Strict environment detection using APP_ENV, RENDER_SERVICE_NAME, RENDER_GIT_BRANCH.
// 2. Reject staging startup if database name is not akesevai_staging.
// 3. Reject production startup if database name is not akesevai (or if running outside verified Render production).
// 4. Reject local development startup if database name is akesevai.
// 5. Zero normal local bypass for production database protection.
// 6. Safe MongoDB URI parsing supporting both mongodb:// and mongodb+srv://.
// 7. Complete credential protection: masks passwords, usernames, and tokens from all logs & APIs.
// 8. Runtime post-connection verification using actual connected database name.
// 9. Cleanup scheduler environment verification:
//    - Staging: allowed only on akesevai_staging
//    - Development: allowed only on akesevai_dev
//    - Production: disabled by default (ENABLE_PROD_CLEANUP_SCHEDULER !== 'true')
// ============================================================================

export const PRODUCTION_DB_NAME = 'akesevai';
export const STAGING_DB_NAME = 'akesevai_staging';
export const DEVELOPMENT_DB_NAME = 'akesevai_dev';
export const TEST_DB_NAME = 'akesevai_test';

export const VERIFIED_PRODUCTION_HOSTNAMES = Object.freeze([
  'akesevai.onrender.com'
]);

export const VERIFIED_PRODUCTION_SERVICE_NAMES = Object.freeze([
  'akesevai',
  'akesevai-production'
]);

export const VERIFIED_STAGING_HOSTNAMES = Object.freeze([
  'akesevai-staging-api-jqp2.onrender.com'
]);

export const VERIFIED_STAGING_SERVICE_NAMES = Object.freeze([
  'akesevai-staging-api-jqp2'
]);

export const APPROVED_DEV_DATABASES = Object.freeze([
  DEVELOPMENT_DB_NAME,
  'akesevai_local',
  'akesevai_development'
]);

export const APPROVED_TEST_DATABASES = Object.freeze([
  TEST_DB_NAME,
  'akesevai_dev_test',
  'memory',
  'test'
]);

const VALID_HOSTNAME_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

/**
 * Strictly normalizes and validates a Render external hostname value.
 * Accepts bare hostnames only (e.g. 'akesevai.onrender.com'); rejects schemes, paths, ports, or whitespace.
 *
 * @param {string} rawValue
 * @returns {{ provided: boolean, valid: boolean, hostname: string }}
 */
export function normalizeRenderHostname(rawValue) {
  if (rawValue === undefined || rawValue === null) {
    return { provided: false, valid: false, hostname: '' };
  }
  const trimmed = String(rawValue).trim().toLowerCase().replace(/\.+$/, '');
  if (!trimmed) {
    return { provided: false, valid: false, hostname: '' };
  }
  if (!VALID_HOSTNAME_RE.test(trimmed)) {
    return { provided: true, valid: false, hostname: '' };
  }
  return { provided: true, valid: true, hostname: trimmed };
}

/**
 * Classifies Render cloud service identity using RENDER, RENDER_EXTERNAL_HOSTNAME,
 * RENDER_SERVICE_NAME, and RENDER_GIT_BRANCH.
 *
 * Fail-closed guarantees:
 * - Staging service ('akesevai-staging-api-jqp2' / staging hostname / staging branch) is NEVER classified as production.
 * - Unknown or malformed Render hostnames are NEVER permitted.
 * - Verified production identity strictly requires RENDER=true AND exact verified production hostname
 *   ('akesevai.onrender.com'), with zero staging signals or identity contradictions.
 *
 * @param {Object} [env=process.env]
 */
export function resolveRenderCloudIdentity(env = process.env) {
  const safeEnv = env && typeof env === 'object' ? env : {};
  const renderFlag = String(safeEnv.RENDER || '').trim().toLowerCase() === 'true';
  const renderService = String(safeEnv.RENDER_SERVICE_NAME || '').trim().toLowerCase();
  const renderBranch = String(safeEnv.RENDER_GIT_BRANCH || '').trim().toLowerCase();
  const hostInfo = normalizeRenderHostname(safeEnv.RENDER_EXTERNAL_HOSTNAME);
  const hostname = hostInfo.valid ? hostInfo.hostname : '';

  const isRender = Boolean(renderFlag || renderService || renderBranch || hostInfo.provided);

  const isVerifiedStagingHostname = Boolean(hostname && VERIFIED_STAGING_HOSTNAMES.includes(hostname));
  const isVerifiedStagingService = Boolean(renderService && VERIFIED_STAGING_SERVICE_NAMES.includes(renderService));
  const isStagingServicePattern = Boolean(isVerifiedStagingService || renderService.includes('staging'));
  const isStagingHostnamePattern = Boolean(isVerifiedStagingHostname || hostname.includes('staging'));
  const isStagingBranchPattern = Boolean(renderBranch.includes('staging'));
  const isRenderStaging = Boolean(isStagingServicePattern || isStagingHostnamePattern || isStagingBranchPattern);

  const isVerifiedProdHostname = Boolean(hostname && VERIFIED_PRODUCTION_HOSTNAMES.includes(hostname));
  const isVerifiedProdServiceName = Boolean(renderService && VERIFIED_PRODUCTION_SERVICE_NAMES.includes(renderService));

  const hasInvalidHostname = Boolean(hostInfo.provided && !hostInfo.valid);
  const hasUnknownHostname = Boolean(
    hostname &&
    !isVerifiedProdHostname &&
    !isVerifiedStagingHostname
  );

  const hasIdentityConflict = Boolean(
    (isVerifiedProdHostname && isRenderStaging) ||
    (isVerifiedProdServiceName && isRenderStaging) ||
    (isVerifiedProdHostname && isVerifiedStagingHostname)
  );

  const isVerifiedRenderProd = Boolean(
    renderFlag &&
    isVerifiedProdHostname &&
    !isRenderStaging &&
    !hasInvalidHostname &&
    !hasUnknownHostname &&
    !hasIdentityConflict
  );

  const isVerifiedRenderStaging = Boolean(
    renderFlag &&
    !isVerifiedProdHostname &&
    !isVerifiedProdServiceName &&
    !hasInvalidHostname &&
    !hasUnknownHostname &&
    !hasIdentityConflict &&
    (isVerifiedStagingHostname || (!hostInfo.provided && isVerifiedStagingService))
  );

  return {
    isRender,
    renderFlag,
    renderService,
    renderBranch,
    hostname,
    hostnameProvided: hostInfo.provided,
    hasInvalidHostname,
    hasUnknownHostname,
    hasIdentityConflict,
    isRenderStaging,
    isVerifiedProdHostname,
    isVerifiedProdServiceName,
    isVerifiedStagingHostname,
    isVerifiedStagingService,
    isVerifiedRenderProd,
    isVerifiedRenderStaging
  };
}

/**
 * Safely extracts the target database name from a mongodb:// or mongodb+srv:// connection URI.
 * Handles single-host, multi-host, replica set, quotes, and query parameters.
 * Never throws; returns null on missing, invalid, or database-less URIs.
 *
 * @param {string} uri
 * @returns {string|null} Database name, or null if undefined/invalid
 */
export function extractMongoDatabaseName(uri) {
  if (!uri || typeof uri !== 'string') {
    return null;
  }
  const cleanUri = uri.trim().replace(/^["']|["']$/g, '');
  const schemeMatch = cleanUri.match(/^mongodb(?:\+srv)?:\/\//i);
  if (!schemeMatch) {
    return null;
  }

  const remainder = cleanUri.slice(schemeMatch[0].length);
  // Find where the path starts after host(s)
  const slashIdx = remainder.indexOf('/');
  if (slashIdx === -1) {
    return null;
  }

  const afterSlash = remainder.slice(slashIdx + 1);
  const qMarkIdx = afterSlash.indexOf('?');
  const rawDb = qMarkIdx === -1 ? afterSlash : afterSlash.slice(0, qMarkIdx);
  const cleanDb = decodeURIComponent(rawDb.trim());
  return cleanDb.length > 0 ? cleanDb : null;
}

/**
 * Safely masks a MongoDB connection string to ensure no username, password, or auth token
 * can ever be leaked into application logs, console outputs, or diagnostics.
 *
 * E.g.: mongodb+srv://user:pass@cluster0... -> mongodb+srv://[CREDENTIALS_REDACTED]@cluster0...
 *
 * @param {string} uri
 * @returns {string} Sanitized connection string with credentials redacted
 */
export function maskMongoUri(uri) {
  if (!uri || typeof uri !== 'string') {
    return '';
  }
  const clean = uri.trim().replace(/^["']|["']$/g, '');
  return clean.replace(/^(mongodb(?:\+srv)?:\/\/)[^@]+@/i, '$1[CREDENTIALS_REDACTED]@');
}

/**
 * Strictly resolves the application environment from APP_ENV, RENDER,
 * RENDER_EXTERNAL_HOSTNAME, RENDER_SERVICE_NAME, RENDER_GIT_BRANCH, and NODE_ENV.
 *
 * Detects conflicts between explicit APP_ENV and Render cloud service identity.
 * Rejects unknown Render hostnames, missing cloud identity metadata, or staging/prod contradictions.
 *
 * @param {Object} [env=process.env]
 * @returns {'production'|'staging'|'development'|'test'}
 * @throws {Error} When conflicting, ambiguous, unknown, or invalid configuration is detected
 */
export function resolveAppEnvironment(env = process.env) {
  const safeEnv = env && typeof env === 'object' ? env : {};
  const rawAppEnv = String(safeEnv.APP_ENV || '').trim().toLowerCase();
  const nodeEnv = String(safeEnv.NODE_ENV || '').trim().toLowerCase();

  // 1. Explicit Automated Test Mode
  if (nodeEnv === 'test' || rawAppEnv === 'test') {
    return 'test';
  }

  // 2. Classify Render cloud infrastructure identity fail-closed
  const identity = resolveRenderCloudIdentity(safeEnv);

  if (identity.hasIdentityConflict) {
    throw new Error(
      `ENVIRONMENT_CONFLICT: Contradictory Render cloud identity metadata detected (SERVICE='${safeEnv.RENDER_SERVICE_NAME || ''}', HOSTNAME='${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}', BRANCH='${safeEnv.RENDER_GIT_BRANCH || ''}'). Refusing startup.`
    );
  }

  if (identity.isRender && (identity.hasInvalidHostname || identity.hasUnknownHostname)) {
    throw new Error(
      `UNKNOWN_RENDER_SERVICE: Unrecognized or invalid Render external hostname '${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}'. Only verified production ('akesevai.onrender.com') or staging ('akesevai-staging-api-jqp2.onrender.com') services are permitted.`
    );
  }

  // 3. Resolve when explicit APP_ENV is supplied
  if (rawAppEnv) {
    if (rawAppEnv === 'staging') {
      if (identity.isVerifiedProdHostname || identity.isVerifiedProdServiceName) {
        throw new Error(
          `ENVIRONMENT_CONFLICT: APP_ENV is 'staging' but Render identity indicates production (SERVICE='${safeEnv.RENDER_SERVICE_NAME || ''}', HOSTNAME='${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}'). Refusing startup.`
        );
      }
      if (identity.isRender && !identity.isVerifiedRenderStaging) {
        throw new Error(
          `UNVERIFIED_RENDER_STAGING_IDENTITY: Running on Render with APP_ENV='staging' without verified staging identity metadata (SERVICE='${safeEnv.RENDER_SERVICE_NAME || ''}', HOSTNAME='${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}'). Refusing startup.`
        );
      }
      return 'staging';
    }

    if (rawAppEnv === 'production') {
      if (identity.isRenderStaging) {
        throw new Error(
          `ENVIRONMENT_CONFLICT: APP_ENV is 'production' but Render identity indicates staging (SERVICE='${safeEnv.RENDER_SERVICE_NAME || ''}', HOSTNAME='${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}', BRANCH='${safeEnv.RENDER_GIT_BRANCH || ''}'). Refusing startup.`
        );
      }
      return 'production';
    }

    if (rawAppEnv === 'development') {
      if (identity.isRender) {
        throw new Error(
          `ENVIRONMENT_CONFLICT: Cloud Render instance cannot run in 'development' mode (SERVICE='${safeEnv.RENDER_SERVICE_NAME || ''}', HOSTNAME='${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}'). Refusing startup.`
        );
      }
      return 'development';
    }

    throw new Error(
      `INVALID_APP_ENV: Unrecognized APP_ENV value '${safeEnv.APP_ENV}'. Allowed values are 'production', 'staging', 'development', or 'test'.`
    );
  }

  // 4. Missing APP_ENV: Deduce strictly from verified Render Cloud identity
  if (identity.isRender) {
    if (identity.isVerifiedRenderStaging) {
      return 'staging';
    }
    if (identity.isVerifiedRenderProd) {
      return 'production';
    }
    throw new Error(
      `MISSING_APP_ENV: Running on Render with missing or unverified service identity (SERVICE='${safeEnv.RENDER_SERVICE_NAME || ''}', HOSTNAME='${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}', BRANCH='${safeEnv.RENDER_GIT_BRANCH || ''}'). Explicit APP_ENV and verified Render hostname metadata are required.`
    );
  }

  // 5. Running locally outside Render without explicit APP_ENV
  if (nodeEnv === 'production') {
    throw new Error(
      `AMBIGUOUS_ENVIRONMENT: NODE_ENV is 'production' outside Render, but APP_ENV is missing. Explicit APP_ENV is required.`
    );
  }

  return 'development';
}

/**
 * Validates MongoDB database name against the resolved environment.
 * Ensures that:
 * - Staging startup is rejected if DB is not 'akesevai_staging' (or Render staging identity is unverified).
 * - Production startup is rejected if DB is not 'akesevai' or if running outside verified Render production ('akesevai.onrender.com' + RENDER=true).
 * - Local development startup is rejected if DB is 'akesevai'.
 * - No normal local override is provided to bypass production database protection.
 *
 * @param {Object} options
 * @param {string} options.uri
 * @param {Object} [options.env=process.env]
 * @param {boolean} [options.exitOnError=true]
 * @returns {{ ok: boolean, appEnv: string, targetDb: string, isIsolated: boolean, renderIdentity: Object }}
 */
export function validateDatabaseEnvironmentIsolation({
  uri,
  env = process.env,
  exitOnError = true
}) {
  const safeEnv = env && typeof env === 'object' ? env : {};
  const targetDb = extractMongoDatabaseName(uri);
  const identity = resolveRenderCloudIdentity(safeEnv);

  let appEnv = 'development';
  let envError = null;

  try {
    appEnv = resolveAppEnvironment(safeEnv);
  } catch (err) {
    envError = err;
  }

  let violationMessage = null;

  if (envError) {
    violationMessage = envError.message;
  } else if (!targetDb) {
    violationMessage = `DATABASE_ISOLATION_ERROR: Target database name is missing or invalid in MONGODB_URI. URI scheme must specify a database name (e.g. /akesevai_staging or /akesevai_dev).`;
  } else {
    switch (appEnv) {
      case 'staging':
        if (targetDb === PRODUCTION_DB_NAME) {
          violationMessage = `CRITICAL_DATABASE_ISOLATION_VIOLATION: Staging environment attempted connection to the PRODUCTION database ('${PRODUCTION_DB_NAME}')! Staging must connect strictly to '${STAGING_DB_NAME}'.`;
        } else if (targetDb !== STAGING_DB_NAME) {
          violationMessage = `STAGING_DATABASE_MISMATCH: Staging environment must connect strictly to '${STAGING_DB_NAME}', but MONGODB_URI targets '${targetDb}'.`;
        }
        break;

      case 'production':
        if (targetDb !== PRODUCTION_DB_NAME) {
          violationMessage = `PRODUCTION_DATABASE_MISMATCH: Production environment must connect strictly to '${PRODUCTION_DB_NAME}', but MONGODB_URI targets '${targetDb}'.`;
        } else if (!identity.isVerifiedRenderProd) {
          if (!identity.renderFlag) {
            // Reject local execution (or non-Render runtime without RENDER=true) attempting to connect to production database
            violationMessage = `LOCAL_PRODUCTION_DB_BLOCKED: Local execution is strictly forbidden from connecting to production database '${PRODUCTION_DB_NAME}'. Local development must use '${DEVELOPMENT_DB_NAME}'. No local bypass is permitted.`;
          } else {
            violationMessage = `UNVERIFIED_RENDER_PRODUCTION_IDENTITY: Production startup requires verified Render production identity (RENDER=true and exact RENDER_EXTERNAL_HOSTNAME='akesevai.onrender.com' with zero staging indicators). Received HOSTNAME='${safeEnv.RENDER_EXTERNAL_HOSTNAME || ''}', SERVICE='${safeEnv.RENDER_SERVICE_NAME || ''}'.`;
          }
        }
        break;

      case 'development':
        if (targetDb === PRODUCTION_DB_NAME) {
          violationMessage = `CRITICAL_DATABASE_ISOLATION_VIOLATION: Local development cannot connect to production database '${PRODUCTION_DB_NAME}'! Local development must connect to '${DEVELOPMENT_DB_NAME}' or an approved local database.`;
        } else if (targetDb === STAGING_DB_NAME) {
          violationMessage = `DEVELOPMENT_DATABASE_MISMATCH: Local development cannot connect to staging database '${STAGING_DB_NAME}'. Local development must connect to '${DEVELOPMENT_DB_NAME}'.`;
        } else if (!APPROVED_DEV_DATABASES.includes(targetDb)) {
          violationMessage = `DEVELOPMENT_DATABASE_MISMATCH: Local development must connect to '${DEVELOPMENT_DB_NAME}' or an approved local database (${APPROVED_DEV_DATABASES.join(', ')}), but MONGODB_URI targets '${targetDb}'.`;
        }
        break;

      case 'test':
        if (targetDb === PRODUCTION_DB_NAME) {
          violationMessage = `CRITICAL_DATABASE_ISOLATION_VIOLATION: Automated tests cannot connect to production database '${PRODUCTION_DB_NAME}'! Automated tests must use '${TEST_DB_NAME}' or an isolated in-memory database.`;
        } else if (targetDb === STAGING_DB_NAME) {
          violationMessage = `CRITICAL_DATABASE_ISOLATION_VIOLATION: Automated tests cannot connect to staging database '${STAGING_DB_NAME}'! Automated tests must use '${TEST_DB_NAME}' or an isolated in-memory database.`;
        } else if (!APPROVED_TEST_DATABASES.includes(targetDb) && !targetDb.endsWith('_test')) {
          violationMessage = `TEST_DATABASE_MISMATCH: Automated tests must connect strictly to '${TEST_DB_NAME}' or an in-memory database, but targets '${targetDb}'.`;
        }
        break;

      default:
        violationMessage = `UNKNOWN_ENVIRONMENT: Unrecognized environment '${appEnv}'.`;
        break;
    }
  }

  if (violationMessage) {
    console.error('\n=============================================================');
    console.error('🚨 [FATAL DATABASE ISOLATION ERROR] REFUSING SERVER STARTUP');
    console.error('=============================================================');
    console.error(`Violation:   ${violationMessage}`);
    console.error(`Environment: ${appEnv}`);
    console.error(`Target DB:   ${targetDb || 'NONE'}`);
    console.error(`Sanitized:   ${maskMongoUri(uri)}`);
    console.error('=============================================================\n');

    if (exitOnError) {
      process.exit(1);
    }
    throw new Error(violationMessage);
  }

  return {
    ok: true,
    appEnv,
    targetDb,
    isIsolated: true,
    renderIdentity: {
      isRender: identity.isRender,
      hostname: identity.hostname || null,
      isVerifiedRenderProd: identity.isVerifiedRenderProd,
      isVerifiedRenderStaging: identity.isVerifiedRenderStaging
    }
  };
}

/**
 * Runtime post-connection verification using the actual connected database name
 * reported by the active Mongoose / MongoDB connection handle.
 *
 * @param {Object} options
 * @param {string} options.connectedDbName
 * @param {string} options.appEnv
 * @param {boolean} [options.exitOnError=true]
 * @returns {{ ok: boolean, connectedDbName: string, appEnv: string }}
 */
export function validateActualConnectedDatabase({
  connectedDbName,
  appEnv,
  exitOnError = true
}) {
  if (!connectedDbName || typeof connectedDbName !== 'string') {
    const err = new Error('RUNTIME_VERIFICATION_ERROR: Unable to determine actual connected database name from MongoDB connection.');
    if (exitOnError) {
      console.error('🚨 [FATAL]:', err.message);
      process.exit(1);
    }
    throw err;
  }

  let violation = null;

  if (appEnv === 'staging' && connectedDbName !== STAGING_DB_NAME) {
    violation = `RUNTIME_DATABASE_MISMATCH: Staging service is physically connected to database '${connectedDbName}' instead of '${STAGING_DB_NAME}'!`;
  } else if (appEnv === 'production' && connectedDbName !== PRODUCTION_DB_NAME) {
    violation = `RUNTIME_DATABASE_MISMATCH: Production service is physically connected to database '${connectedDbName}' instead of '${PRODUCTION_DB_NAME}'!`;
  } else if (appEnv === 'development' && (connectedDbName === PRODUCTION_DB_NAME || connectedDbName === STAGING_DB_NAME || !APPROVED_DEV_DATABASES.includes(connectedDbName))) {
    violation = `CRITICAL_RUNTIME_DATABASE_VIOLATION: Local development process is physically connected to unauthorized database '${connectedDbName}'!`;
  } else if (appEnv === 'test' && (connectedDbName === PRODUCTION_DB_NAME || connectedDbName === STAGING_DB_NAME)) {
    violation = `CRITICAL_RUNTIME_DATABASE_VIOLATION: Automated test process is physically connected to live database '${connectedDbName}'!`;
  }

  if (violation) {
    console.error('\n=============================================================');
    console.error('🚨 [CRITICAL RUNTIME DATABASE ISOLATION FAILURE]');
    console.error('=============================================================');
    console.error(`Violation:    ${violation}`);
    console.error(`Connected DB: ${connectedDbName}`);
    console.error(`Environment:  ${appEnv}`);
    console.error('Terminating process immediately to prevent data contamination.');
    console.error('=============================================================\n');

    if (exitOnError) {
      process.exit(1);
    }
    throw new Error(violation);
  }

  return { ok: true, connectedDbName, appEnv };
}

/**
 * Verifies whether the 10-day expired exam cleanup scheduler is allowed to run
 * in the active runtime environment and connected database.
 *
 * Rules:
 * - Staging: allowed only on akesevai_staging.
 * - Development: allowed only on akesevai_dev.
 * - Production: disabled by default (ENABLE_PROD_CLEANUP_SCHEDULER !== 'true').
 * - Purge execution always requires explicit ENABLE_EXPIRED_EXAM_PURGE === 'true'.
 *
 * @param {Object} options
 * @param {Object} [options.env=process.env]
 * @param {string} [options.activeDbName]
 * @returns {{ allowed: boolean, appEnv: string, dbName: string, dryRun: boolean, reason: string }}
 */
export function isCleanupSchedulerAllowedInEnvironment({
  env = process.env,
  activeDbName = null
} = {}) {
  let appEnv = 'development';
  try {
    appEnv = resolveAppEnvironment(env);
  } catch (err) {
    return {
      allowed: false,
      appEnv: 'misconfigured',
      dbName: activeDbName || 'unknown',
      dryRun: true,
      reason: `ENVIRONMENT_RESOLUTION_FAILED: ${err.message}`
    };
  }

  const dbName = activeDbName || extractMongoDatabaseName(env.MONGODB_URI) || 'unknown';
  const purgeEnabled = String(env.ENABLE_EXPIRED_EXAM_PURGE || '').trim().toLowerCase() === 'true';

  switch (appEnv) {
    case 'staging':
      if (dbName === STAGING_DB_NAME) {
        return {
          allowed: true,
          appEnv: 'staging',
          dbName,
          dryRun: !purgeEnabled,
          reason: 'STAGING_SCHEDULER_PERMITTED'
        };
      }
      return {
        allowed: false,
        appEnv: 'staging',
        dbName,
        dryRun: true,
        reason: `SCHEDULER_BLOCKED_STAGING_DB_MISMATCH: Staging scheduler is permitted only on '${STAGING_DB_NAME}', current target is '${dbName}'.`
      };

    case 'development':
      if (dbName === DEVELOPMENT_DB_NAME) {
        return {
          allowed: true,
          appEnv: 'development',
          dbName,
          dryRun: !purgeEnabled,
          reason: 'DEV_SCHEDULER_PERMITTED'
        };
      }
      return {
        allowed: false,
        appEnv: 'development',
        dbName,
        dryRun: true,
        reason: `SCHEDULER_BLOCKED_DEV_DB_MISMATCH: Development scheduler is permitted only on '${DEVELOPMENT_DB_NAME}', current target is '${dbName}'.`
      };

    case 'production': {
      const identity = resolveRenderCloudIdentity(env);
      if (!identity.isVerifiedRenderProd) {
        return {
          allowed: false,
          appEnv: 'production',
          dbName,
          dryRun: true,
          reason: 'PRODUCTION_SCHEDULER_BLOCKED_UNVERIFIED_RENDER_IDENTITY'
        };
      }
      const isExplicitlyAllowedInProd =
        String(env.ENABLE_PROD_CLEANUP_SCHEDULER || '').trim().toLowerCase() === 'true';

      if (!isExplicitlyAllowedInProd) {
        return {
          allowed: false,
          appEnv: 'production',
          dbName,
          dryRun: true,
          reason: 'PRODUCTION_SCHEDULER_DISABLED_BY_DEFAULT'
        };
      }
      if (dbName !== PRODUCTION_DB_NAME) {
        return {
          allowed: false,
          appEnv: 'production',
          dbName,
          dryRun: true,
          reason: `PRODUCTION_SCHEDULER_BLOCKED_DB_MISMATCH: Production scheduler requires '${PRODUCTION_DB_NAME}', current target is '${dbName}'.`
        };
      }
      return {
        allowed: true,
        appEnv: 'production',
        dbName,
        dryRun: !purgeEnabled,
        reason: 'PRODUCTION_SCHEDULER_EXPLICITLY_ENABLED'
      };
    }

    case 'test':
      return {
        allowed: true,
        appEnv: 'test',
        dbName,
        dryRun: true,
        reason: 'TEST_SCHEDULER_PERMITTED'
      };

    default:
      return {
        allowed: false,
        appEnv,
        dbName,
        dryRun: true,
        reason: `SCHEDULER_BLOCKED_UNKNOWN_ENVIRONMENT: Environment '${appEnv}' is not approved for cleanup execution.`
      };
  }
}
