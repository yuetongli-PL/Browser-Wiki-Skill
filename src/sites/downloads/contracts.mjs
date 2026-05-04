// @ts-check

import path from 'node:path';
import { createHash } from 'node:crypto';

import { normalizeArtifactReferenceSet } from '../capability/artifact-schema.mjs';
import { assertSchemaCompatible } from '../capability/compatibility-registry.mjs';
import { normalizeDownloadPolicy } from '../capability/download-policy.mjs';
import { normalizeReasonCode, reasonCodeSummary } from '../capability/reason-codes.mjs';
import { normalizeRiskState } from '../capability/risk-state.mjs';
import { redactValue } from '../capability/security-guard.mjs';
import {
  createSessionViewMaterializationAudit,
  normalizeSessionView,
} from '../capability/session-view.mjs';
import { resolveSiteKeyFromHost } from '../core/adapters/resolver.mjs';
import { compactSlug, hostFromUrl, normalizeText, sanitizeHost } from '../../shared/normalize.mjs';

export const DOWNLOAD_TASK_TYPES = Object.freeze([
  'book',
  'video',
  'image-note',
  'media-bundle',
  'social-archive',
  'generic-resource',
]);

export const SESSION_REQUIREMENTS = Object.freeze([
  'none',
  'optional',
  'required',
]);

export const SESSION_LEASE_STATUSES = Object.freeze([
  'ready',
  'blocked',
  'manual-required',
  'expired',
  'quarantine',
]);

export const SESSION_LEASE_MODES = Object.freeze([
  'anonymous',
  'reusable-profile',
  'authenticated',
]);

export const DOWNLOAD_RESOURCE_MEDIA_TYPES = Object.freeze([
  'text',
  'image',
  'video',
  'audio',
  'json',
  'binary',
]);

export const DOWNLOAD_RUN_STATUSES = Object.freeze([
  'passed',
  'partial',
  'failed',
  'blocked',
  'skipped',
]);

export const DOWNLOAD_RUN_MANIFEST_SCHEMA_VERSION = 1;
export const DEFAULT_DOWNLOAD_COMPLETED_REASON = 'download-completed';

export const LIVE_VALIDATION_STATUSES = Object.freeze([
  'not-run',
  'planned',
  'approved',
  'passed',
  'partial',
  'failed',
  'blocked',
]);

function defaultDownloadAdapterVersion({ siteKey, taskType } = {}) {
  const site = compactSlug(siteKey, 'generic', 48);
  const task = compactSlug(taskType, 'download', 48);
  return `${site}-${task}-adapter-v1`;
}

function valueOrDefault(value, fallback) {
  return value === undefined || value === null || value === '' ? fallback : value;
}

function enumValue(value, allowed, fallback) {
  const normalized = normalizeText(value);
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeStringMap(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  const result = {};
  for (const [key, entryValue] of Object.entries(value)) {
    const normalizedKey = normalizeText(key);
    if (!normalizedKey || entryValue === undefined || entryValue === null) {
      continue;
    }
    result[normalizedKey] = String(entryValue);
  }
  return result;
}

function normalizeStringList(value = []) {
  return [...new Set((Array.isArray(value) ? value : [value])
    .map((entry) => normalizeText(entry))
    .filter(Boolean))];
}

function normalizeDownloaderConsumerFieldName(value) {
  return normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/gu, '');
}

const DOWNLOADER_CONSUMER_FORBIDDEN_FIELD_NAMES = new Set([
  'x-access-token',
  'x-auth-token',
  'x-csrf-token',
  'x-refresh-token',
  'x-session-id',
  'x-xsrf-token',
  'authstatus',
  'authorization',
  'browserprofileroot',
  'cookie',
  'cookies',
  'credential',
  'credentials',
  'csrf',
  'headers',
  'loginstate',
  'loginstatus',
  'profilepath',
  'raw-auth',
  'raw-body',
  'raw-cookie',
  'raw-cookies',
  'raw-headers',
  'rawsessionlease',
  'request-body',
  'request-headers',
  'response-body',
  'response-headers',
  'sessionid',
  'sessionlease',
  'sessionstate',
  'sessdata',
  'site-adapter-state',
  'siteauthstate',
  'site-semantic-state',
  'site-semantics',
  'site-state',
  'userdatadir',
  'xsrf',
].map((name) => normalizeDownloaderConsumerFieldName(name)));

function isDownloaderConsumerForbiddenFieldName(name) {
  const normalized = normalizeDownloaderConsumerFieldName(name);
  return DOWNLOADER_CONSUMER_FORBIDDEN_FIELD_NAMES.has(normalized)
    || normalized.includes('accesstoken')
    || normalized.includes('refreshtoken')
    || normalized.includes('sessdata')
    || normalized.endsWith('csrf')
    || normalized.endsWith('token')
    || normalized.endsWith('xsrf');
}

function hasDownloaderConsumerSensitiveString(value) {
  return /authorization\s*:|cookie\s*:|set-cookie\s*:|bearer\s+|(?:access|refresh|xsec)_token=|csrf=|xsrf=|sessdata=|sessionid=|synthetic-[^\s"'<>]*(?:auth|cookie|csrf|session|token)/iu
    .test(String(value ?? ''));
}

function normalizeDownloaderConsumerValue(value, { omitSensitiveValues = false } = {}) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => normalizeDownloaderConsumerValue(entry, { omitSensitiveValues }))
      .filter((entry) => entry !== undefined);
  }
  if (value && typeof value === 'object') {
    const result = {};
    for (const [key, child] of Object.entries(value)) {
      if (isDownloaderConsumerForbiddenFieldName(key)) {
        continue;
      }
      const normalized = normalizeDownloaderConsumerValue(child, { omitSensitiveValues });
      if (normalized !== undefined) {
        result[key] = normalized;
      }
    }
    return result;
  }
  if (omitSensitiveValues && typeof value === 'string' && hasDownloaderConsumerSensitiveString(value)) {
    return undefined;
  }
  return value;
}

export function normalizeDownloaderConsumerObject(value = {}, options = {}) {
  const normalized = normalizeDownloaderConsumerValue(value, options);
  return normalized && typeof normalized === 'object' && !Array.isArray(normalized) ? normalized : {};
}

function normalizeDownloaderConsumerMetadata(value = {}) {
  return normalizeDownloaderConsumerObject(value, { omitSensitiveValues: true });
}

function normalizeDownloaderConsumerArray(value = []) {
  const normalized = normalizeDownloaderConsumerValue(value, { omitSensitiveValues: true });
  return Array.isArray(normalized) ? normalized : [];
}

function normalizeDownloaderConsumerString(value) {
  if (value === undefined || value === null) {
    return undefined;
  }
  return normalizeDownloaderConsumerValue(String(value), { omitSensitiveValues: true });
}

export function stableId(parts = []) {
  return createHash('sha1')
    .update(parts.map((part) => normalizeText(part)).join('\n'))
    .digest('hex')
    .slice(0, 12);
}

export function timestampForRun(date = new Date()) {
  return date.toISOString().replace(/[-:]/gu, '').replace(/\.(\d{3})Z$/u, '$1Z');
}

export function inferSiteKeyFromHost(host) {
  const normalizedHost = sanitizeHost(String(host ?? '').toLowerCase());
  return resolveSiteKeyFromHost(normalizedHost);
}

export function inferHostFromDownloadRequest(request = {}) {
  const explicitHost = normalizeText(request.host);
  if (explicitHost) {
    return sanitizeHost(explicitHost.toLowerCase());
  }
  const inputUrl = normalizeText(request.inputUrl ?? request.url ?? request.input ?? request.source?.canonicalUrl);
  return inputUrl ? hostFromUrl(inputUrl) : null;
}

export function createDownloadPlanId({ siteKey, taskType, input, seed = null } = {}) {
  const slug = compactSlug([siteKey, taskType, input].filter(Boolean).join('-'), 'download', 72);
  return `${slug}-${stableId([siteKey, taskType, input, seed])}`;
}

export const LEGACY_RAW_SESSION_LEASE_ISOLATION = Object.freeze({
  kind: 'legacy-raw-session-material',
  scope: 'in-memory-compatibility-only',
  normalConsumerBoundary: 'SessionView',
  consumerHeaderBoundary: 'normalizeSessionLeaseConsumerHeaders',
  artifactPersistenceAllowed: false,
});

function createLegacyRawSessionLeaseIsolation(raw = {}, defaults = {}, { sessionViewPresent = false } = {}) {
  const headers = normalizeStringMap(raw.headers ?? defaults.headers);
  const cookies = Array.isArray(raw.cookies ?? defaults.cookies) ? raw.cookies ?? defaults.cookies : [];
  const profileMaterialPresent = Boolean(
    normalizeText(raw.browserProfileRoot ?? defaults.browserProfileRoot)
      || normalizeText(raw.userDataDir ?? defaults.userDataDir),
  );
  const rawHeadersPresent = Object.keys(headers).length > 0;
  const rawCookiesPresent = cookies.length > 0;
  if (!rawHeadersPresent && !rawCookiesPresent && !profileMaterialPresent) {
    return undefined;
  }
  return {
    ...LEGACY_RAW_SESSION_LEASE_ISOLATION,
    rawHeadersPresent,
    rawCookiesPresent,
    profileMaterialPresent,
    sessionViewPresent,
  };
}

export function normalizeSessionLease(raw = {}, defaults = {}) {
  const siteKey = normalizeText(raw.siteKey ?? defaults.siteKey ?? inferSiteKeyFromHost(raw.host ?? defaults.host));
  const host = sanitizeHost(normalizeText(raw.host ?? defaults.host ?? siteKey));
  const repairPlan = normalizeSessionRepairPlan(raw.repairPlan ?? defaults.repairPlan);
  const rawHeaders = normalizeStringMap(raw.headers ?? defaults.headers);
  const rawCookies = Array.isArray(raw.cookies ?? defaults.cookies) ? [...(raw.cookies ?? defaults.cookies)] : [];
  const sessionViewInput = raw.sessionView ?? defaults.sessionView;
  const sessionView = sessionViewInput && typeof sessionViewInput === 'object' && !Array.isArray(sessionViewInput)
    ? (() => {
      const consumerSessionView = normalizeDownloaderConsumerObject(sessionViewInput);
      assertSchemaCompatible('SessionView', consumerSessionView);
      return normalizeSessionView({
        ...consumerSessionView,
        siteKey: consumerSessionView.siteKey ?? siteKey,
        purpose: consumerSessionView.purpose ?? raw.purpose ?? defaults.purpose,
        status: consumerSessionView.status ?? raw.status ?? defaults.status,
        expiresAt: consumerSessionView.expiresAt ?? raw.expiresAt ?? defaults.expiresAt,
      });
    })()
    : undefined;
  const sessionViewMaterializationAudit = sessionView
    ? createSessionViewMaterializationAudit(sessionView, {
      materializedAt: raw.materializedAt ?? defaults.materializedAt,
    })
    : undefined;
  return {
    siteKey,
    host,
    mode: enumValue(raw.mode, SESSION_LEASE_MODES, defaults.mode ?? 'anonymous'),
    status: enumValue(raw.status, SESSION_LEASE_STATUSES, defaults.status ?? 'ready'),
    browserProfileRoot: sessionView
      ? undefined
      : normalizeText(raw.browserProfileRoot ?? defaults.browserProfileRoot) || undefined,
    userDataDir: sessionView
      ? undefined
      : normalizeText(raw.userDataDir ?? defaults.userDataDir) || undefined,
    headers: sessionView ? {} : rawHeaders,
    cookies: sessionView ? [] : rawCookies,
    riskSignals: normalizeStringList(raw.riskSignals ?? defaults.riskSignals),
    expiresAt: normalizeText(raw.expiresAt ?? defaults.expiresAt) || undefined,
    quarantineKey: normalizeText(raw.quarantineKey ?? defaults.quarantineKey) || undefined,
    reason: normalizeText(raw.reason ?? defaults.reason) || undefined,
    purpose: normalizeText(raw.purpose ?? defaults.purpose) || undefined,
    repairPlan,
    sessionView,
    sessionViewMaterializationAudit,
    rawMaterialIsolation: createLegacyRawSessionLeaseIsolation(raw, defaults, {
      sessionViewPresent: Boolean(sessionView),
    }),
  };
}

const SESSION_LEASE_CONSUMER_SAFE_HEADER_NAMES = new Set([
  'accept',
  'accept-language',
  'cache-control',
  'pragma',
  'range',
  'if-range',
  'if-match',
  'if-none-match',
  'if-modified-since',
  'if-unmodified-since',
  'user-agent',
  'referer',
  'referrer',
]);

const SESSION_LEASE_PAGE_FETCH_HEADER_NAMES = new Set([
  ...SESSION_LEASE_CONSUMER_SAFE_HEADER_NAMES,
  'cookie',
]);

const DOWNLOAD_RESOURCE_FORBIDDEN_HEADER_NAMES = new Set([
  'authorization',
  'proxy-authorization',
  'cookie',
  'set-cookie',
  'x-csrf-token',
  'x-xsrf-token',
  'x-access-token',
  'x-refresh-token',
  'x-auth-token',
  'x-session-id',
  'session-id',
  'sessdata',
]);

function isDownloadResourceForbiddenHeaderName(name, { allowCookieHeader = false } = {}) {
  const normalized = normalizeText(name).toLowerCase();
  if (allowCookieHeader && normalized === 'cookie') {
    return false;
  }
  return DOWNLOAD_RESOURCE_FORBIDDEN_HEADER_NAMES.has(normalized)
    || normalized.includes('csrf')
    || normalized.includes('xsrf')
    || normalized.includes('token')
    || normalized.includes('sessdata');
}

export function normalizeSessionLeaseConsumerHeaders(sessionLease = null) {
  if (!sessionLease || typeof sessionLease !== 'object' || Array.isArray(sessionLease)) {
    return {};
  }
  if (sessionLease.sessionView) {
    assertSchemaCompatible('SessionView', sessionLease.sessionView);
    return {};
  }
  const headers = normalizeStringMap(sessionLease.headers);
  return Object.fromEntries(
    Object.entries(headers).filter(([name]) => SESSION_LEASE_CONSUMER_SAFE_HEADER_NAMES.has(name.toLowerCase())),
  );
}

export function normalizeSessionLeasePageFetchHeaders(sessionLease = null) {
  if (!sessionLease || typeof sessionLease !== 'object' || Array.isArray(sessionLease)) {
    return {};
  }
  if (sessionLease.sessionView) {
    assertSchemaCompatible('SessionView', sessionLease.sessionView);
    return {};
  }
  const headers = normalizeStringMap(sessionLease.headers);
  return Object.fromEntries(
    Object.entries(headers).filter(([name]) => SESSION_LEASE_PAGE_FETCH_HEADER_NAMES.has(name.toLowerCase())),
  );
}

export function normalizeDownloadResourceConsumerHeaders(headers = null, options = {}) {
  return Object.fromEntries(
    Object.entries(normalizeStringMap(headers))
      .filter(([name]) => !isDownloadResourceForbiddenHeaderName(name, options)),
  );
}

function normalizeSessionRepairPlan(value = undefined) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const result = {
    action: normalizeText(value.action ?? value.suggestedAction),
    reason: normalizeText(value.reason),
    command: normalizeText(value.command),
    requiresApproval: value.requiresApproval === true || undefined,
    riskSignals: normalizeStringList(value.riskSignals),
    notBefore: normalizeText(value.notBefore) || undefined,
  };
  return Object.fromEntries(Object.entries(result).filter(([, entryValue]) => (
    entryValue !== undefined
      && entryValue !== ''
      && (!Array.isArray(entryValue) || entryValue.length > 0)
  )));
}

export function createAnonymousSessionLease({ siteKey, host, purpose } = {}) {
  return normalizeSessionLease({
    siteKey,
    host,
    mode: 'anonymous',
    status: 'ready',
    riskSignals: [],
    purpose,
  });
}

export function createBlockedSessionLease({ siteKey, host, purpose, status = 'blocked', reason, riskSignals = [] } = {}) {
  return normalizeSessionLease({
    siteKey,
    host,
    mode: 'reusable-profile',
    status,
    reason,
    riskSignals,
    purpose,
  });
}

export function normalizeDownloadTaskPlan(raw = {}, defaults = {}) {
  const siteKey = normalizeText(raw.siteKey ?? defaults.siteKey ?? inferSiteKeyFromHost(raw.host ?? defaults.host));
  const taskType = enumValue(raw.taskType ?? defaults.taskType, DOWNLOAD_TASK_TYPES, 'generic-resource');
  const sourceInput = normalizeText(
    raw.source?.input
      ?? raw.input
      ?? raw.inputUrl
      ?? raw.url
      ?? raw.account
      ?? defaults.input
      ?? defaults.inputUrl
      ?? '',
  );
  const planIdInput = redactValue({ sourceInput }).value.sourceInput;
  const id = normalizeText(raw.id ?? defaults.id) || createDownloadPlanId({
    siteKey,
    taskType,
    input: planIdInput,
    seed: raw.createdAt ?? defaults.createdAt ?? '',
  });
  const sessionRequirement = enumValue(
    raw.sessionRequirement ?? defaults.sessionRequirement,
    SESSION_REQUIREMENTS,
    'none',
  );
  const legacyPolicy = {
    dryRun: Boolean(raw.policy?.dryRun ?? raw.dryRun ?? defaults.policy?.dryRun ?? true),
    concurrency: Number(valueOrDefault(raw.policy?.concurrency ?? raw.concurrency, defaults.policy?.concurrency ?? 4)),
    retries: Number(valueOrDefault(raw.policy?.retries ?? raw.retries, defaults.policy?.retries ?? 2)),
    retryBackoffMs: Number(valueOrDefault(raw.policy?.retryBackoffMs ?? raw.retryBackoffMs, defaults.policy?.retryBackoffMs ?? 1_000)),
    skipExisting: Boolean(raw.policy?.skipExisting ?? raw.skipExisting ?? defaults.policy?.skipExisting ?? true),
    verify: Boolean(raw.policy?.verify ?? raw.verify ?? defaults.policy?.verify ?? true),
    maxItems: Number(valueOrDefault(raw.policy?.maxItems ?? raw.maxItems, defaults.policy?.maxItems ?? 0)),
  };
  const standardPolicy = normalizeDownloadPolicy({
    ...(defaults.policy ?? {}),
    ...(raw.policy ?? {}),
    siteKey,
    taskType,
    dryRun: legacyPolicy.dryRun,
    retries: legacyPolicy.retries,
    retryBackoffMs: legacyPolicy.retryBackoffMs,
    sessionRequirement: raw.policy?.sessionRequirement
      ?? defaults.policy?.sessionRequirement
      ?? sessionRequirement,
    allowNetworkResolve: raw.policy?.allowNetworkResolve
      ?? raw.resolveNetwork
      ?? defaults.policy?.allowNetworkResolve,
  }, {
    siteKey,
    taskType,
    dryRun: true,
    retries: 2,
    retryBackoffMs: 1_000,
    sessionRequirement,
  });
  return {
    id,
    siteKey,
    host: sanitizeHost(normalizeText(raw.host ?? defaults.host ?? inferHostFromDownloadRequest(raw) ?? siteKey)),
    taskType,
    adapterVersion: normalizeText(
      raw.adapterVersion
        ?? raw.siteAdapterVersion
        ?? raw.metadata?.adapterVersion
        ?? raw.metadata?.siteAdapterVersion
        ?? defaults.adapterVersion
        ?? defaults.siteAdapterVersion
        ?? defaults.metadata?.adapterVersion
        ?? defaults.metadata?.siteAdapterVersion,
    ) || defaultDownloadAdapterVersion({ siteKey, taskType }),
    source: {
      input: sourceInput,
      canonicalUrl: normalizeText(raw.source?.canonicalUrl ?? raw.canonicalUrl ?? raw.inputUrl ?? raw.url) || undefined,
      account: normalizeText(raw.source?.account ?? raw.account ?? defaults.account) || undefined,
      title: normalizeText(raw.source?.title ?? raw.title ?? defaults.title) || undefined,
    },
    sessionRequirement,
    resolver: {
      adapterId: normalizeText(raw.resolver?.adapterId ?? defaults.resolver?.adapterId ?? siteKey),
      method: normalizeText(raw.resolver?.method ?? defaults.resolver?.method ?? 'resolve-download-resources'),
    },
    output: {
      root: normalizeText(raw.output?.root ?? raw.outDir ?? defaults.output?.root) || undefined,
      runDir: normalizeText(raw.output?.runDir ?? raw.runDir ?? defaults.output?.runDir) || undefined,
      namingStrategy: normalizeText(raw.output?.namingStrategy ?? defaults.output?.namingStrategy) || undefined,
    },
    policy: {
      ...standardPolicy,
      concurrency: legacyPolicy.concurrency,
      skipExisting: legacyPolicy.skipExisting,
      verify: legacyPolicy.verify,
      maxItems: legacyPolicy.maxItems,
    },
    resume: raw.resume ?? defaults.resume ?? undefined,
    legacy: raw.legacy ?? defaults.legacy ?? undefined,
    metadata: normalizeDownloaderConsumerMetadata({
      ...(defaults.metadata ?? {}),
      ...(raw.metadata ?? {}),
    }),
  };
}

function normalizeFileName(fileName, fallback = 'download.bin') {
  const normalized = normalizeText(fileName).replace(/[<>:"/\\|?*\x00-\x1F]+/gu, '-').replace(/-+/gu, '-').trim();
  return normalized || fallback;
}

export function normalizeDownloadResource(raw = {}, index = 0, options = {}) {
  const url = normalizeText(raw.url);
  const sourceUrl = normalizeText(raw.sourceUrl ?? raw.referer);
  const id = normalizeText(raw.id) || stableId([url, sourceUrl, raw.fileName, index]);
  const body = normalizeDownloaderConsumerString(raw.body);
  const parsedPathName = (() => {
    try {
      return path.basename(new URL(url).pathname);
    } catch {
      return '';
    }
  })();
  return {
    id,
    url,
    method: enumValue(raw.method, ['GET', 'POST'], 'GET'),
    headers: normalizeDownloadResourceConsumerHeaders(raw.headers, options),
    body,
    fileName: normalizeFileName(raw.fileName ?? parsedPathName, `${id}.bin`),
    mediaType: enumValue(raw.mediaType, DOWNLOAD_RESOURCE_MEDIA_TYPES, 'binary'),
    sourceUrl: sourceUrl || undefined,
    referer: normalizeText(raw.referer ?? sourceUrl) || undefined,
    expectedBytes: raw.expectedBytes === undefined ? undefined : Number(raw.expectedBytes),
    expectedHash: normalizeText(raw.expectedHash) || undefined,
    priority: raw.priority === undefined ? index : Number(raw.priority),
    groupId: normalizeText(raw.groupId) || undefined,
    metadata: normalizeDownloaderConsumerMetadata(raw.metadata),
  };
}

export function normalizeResolvedDownloadTask(raw = {}, plan = {}, options = {}) {
  const resources = (Array.isArray(raw.resources) ? raw.resources : [])
    .map((resource, index) => normalizeDownloadResource(resource, index, options))
    .filter((resource) => resource.url);
  const groups = (Array.isArray(raw.groups) ? raw.groups : [])
    .map((group) => normalizeDownloaderConsumerObject(group, { omitSensitiveValues: true }))
    .filter((group) => Object.keys(group).length > 0);
  const expectedCount = raw.completeness?.expectedCount ?? raw.expectedCount ?? resources.length;
  return {
    planId: normalizeText(raw.planId ?? plan.id),
    siteKey: normalizeText(raw.siteKey ?? plan.siteKey),
    taskType: normalizeText(raw.taskType ?? plan.taskType),
    resources,
    groups,
    metadata: normalizeDownloaderConsumerMetadata(raw.metadata),
    completeness: {
      expectedCount,
      resolvedCount: raw.completeness?.resolvedCount ?? resources.length,
      complete: Boolean(raw.completeness?.complete ?? (resources.length >= Number(expectedCount || 0))),
      reason: normalizeText(raw.completeness?.reason ?? raw.reason) || undefined,
    },
  };
}

export function resolveDownloadRunStatus({ expected = 0, attempted = 0, downloaded = 0, failed = 0, skipped = 0, blocked = false, dryRun = false } = {}) {
  if (blocked) {
    return 'blocked';
  }
  if (dryRun) {
    return 'skipped';
  }
  if (failed > 0 && downloaded > 0) {
    return 'partial';
  }
  if (failed > 0) {
    return 'failed';
  }
  if (expected > 0 && downloaded + skipped < expected) {
    return attempted > 0 || downloaded > 0 ? 'partial' : 'skipped';
  }
  return 'passed';
}

export function normalizeDownloadRunStatus(value, context = {}) {
  const normalized = normalizeText(value).toLowerCase();
  const aliases = {
    ok: 'passed',
    success: 'passed',
    successful: 'passed',
    complete: 'passed',
    completed: 'passed',
    done: 'passed',
    warning: 'partial',
    warnings: 'partial',
    degraded: 'partial',
    bounded: 'partial',
    incomplete: 'partial',
    error: 'failed',
    failure: 'failed',
    auth: 'blocked',
    'blocked-auth': 'blocked',
    'blocked-risk': 'blocked',
    manual: 'blocked',
    pending: 'skipped',
    planned: 'skipped',
    'dry-run': 'skipped',
    noop: 'skipped',
  };
  const aliased = aliases[normalized] ?? normalized;
  return enumValue(aliased, DOWNLOAD_RUN_STATUSES, resolveDownloadRunStatus(context));
}

export function normalizeDownloadRunReason(value, status = undefined) {
  const reason = normalizeText(value);
  if (!reason) {
    return status === 'passed' ? DEFAULT_DOWNLOAD_COMPLETED_REASON : undefined;
  }
  if (
    status === 'passed'
    && ['ok', 'passed', 'success', 'successful', 'complete', 'completed', 'done'].includes(reason.toLowerCase())
  ) {
    return undefined;
  }
  return normalizeReasonCode(reason);
}

function normalizeDownloadRunReasonRecovery(reason) {
  if (!reason) {
    return undefined;
  }
  try {
    return reasonCodeSummary(reason);
  } catch {
    return undefined;
  }
}

function normalizeArtifactRefs(value = {}) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const result = {};
  for (const [key, artifactValue] of Object.entries(value)) {
    if (artifactValue === undefined || artifactValue === null || artifactValue === '') {
      continue;
    }
    if (artifactValue && typeof artifactValue === 'object' && !Array.isArray(artifactValue)) {
      const nested = normalizeArtifactRefs(artifactValue);
      if (nested && Object.keys(nested).length > 0) {
        result[key] = nested;
      }
      continue;
    }
    result[key] = String(artifactValue);
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

export function normalizeLiveValidation(value = undefined) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const status = enumValue(value.status, LIVE_VALIDATION_STATUSES, 'not-run');
  const result = {
    status,
    requiresApproval: value.requiresApproval !== false || undefined,
    approvalId: normalizeText(value.approvalId) || undefined,
    siteKey: normalizeText(value.siteKey) || undefined,
    scenario: normalizeText(value.scenario) || undefined,
    reason: normalizeText(value.reason) || undefined,
    evidenceLevel: normalizeText(value.evidenceLevel) || undefined,
    liveSmoke: value.liveSmoke === true || undefined,
    realDownload: value.realDownload === true || undefined,
    authenticated: value.authenticated === true || undefined,
    checkedAt: normalizeText(value.checkedAt) || undefined,
  };
  return Object.fromEntries(Object.entries(result).filter(([, entryValue]) => entryValue !== undefined && entryValue !== ''));
}

export function normalizeDownloadRunArtifacts(raw = {}, context = {}) {
  const artifactInput = raw && typeof raw === 'object' ? raw : {};
  const contextInput = context && typeof context === 'object' ? context : {};
  const result = {
    manifest: normalizeText(artifactInput.manifest ?? contextInput.manifest) || undefined,
    queue: normalizeText(artifactInput.queue ?? contextInput.queue) || undefined,
    downloadsJsonl: normalizeText(artifactInput.downloadsJsonl ?? contextInput.downloadsJsonl) || undefined,
    reportMarkdown: normalizeText(artifactInput.reportMarkdown ?? contextInput.reportMarkdown) || undefined,
    redactionAudit: normalizeText(artifactInput.redactionAudit ?? contextInput.redactionAudit) || undefined,
    lifecycleEvent: normalizeText(artifactInput.lifecycleEvent ?? contextInput.lifecycleEvent) || undefined,
    lifecycleEventRedactionAudit: normalizeText(artifactInput.lifecycleEventRedactionAudit ?? contextInput.lifecycleEventRedactionAudit) || undefined,
    plan: normalizeText(artifactInput.plan ?? contextInput.plan) || undefined,
    planRedactionAudit: normalizeText(artifactInput.planRedactionAudit ?? contextInput.planRedactionAudit) || undefined,
    resolvedTask: normalizeText(artifactInput.resolvedTask ?? contextInput.resolvedTask) || undefined,
    standardTaskList: normalizeText(artifactInput.standardTaskList ?? contextInput.standardTaskList) || undefined,
    runDir: normalizeText(artifactInput.runDir ?? contextInput.runDir) || undefined,
    filesDir: normalizeText(artifactInput.filesDir ?? contextInput.filesDir) || undefined,
  };
  const source = normalizeArtifactRefs(artifactInput.source ?? contextInput.source);
  if (source) {
    result.source = source;
  }
  return normalizeArtifactReferenceSet(result);
}

export function normalizeManifestSession(value = undefined) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const session = normalizeSessionLease(value, {
    siteKey: value.siteKey,
    host: value.host,
    mode: value.mode,
    status: value.status,
    riskSignals: value.riskSignals,
    expiresAt: value.expiresAt,
    quarantineKey: value.quarantineKey,
    reason: value.reason,
    purpose: value.purpose,
  });
  const sessionView = value.sessionView && typeof value.sessionView === 'object' && !Array.isArray(value.sessionView)
    ? (() => {
      const consumerSessionView = normalizeDownloaderConsumerObject(value.sessionView);
      assertSchemaCompatible('SessionView', consumerSessionView);
      return normalizeSessionView({
        ...consumerSessionView,
        siteKey: consumerSessionView.siteKey ?? session.siteKey,
        purpose: consumerSessionView.purpose ?? session.purpose,
        status: consumerSessionView.status ?? session.status,
        reasonCode: consumerSessionView.reasonCode ?? session.reason,
        riskSignals: consumerSessionView.riskSignals ?? session.riskSignals,
        expiresAt: consumerSessionView.expiresAt ?? session.expiresAt,
      });
    })()
    : undefined;
  const result = {
    siteKey: session.siteKey,
    host: session.host,
    mode: session.mode,
    status: session.status,
    riskSignals: session.riskSignals,
    expiresAt: session.expiresAt,
    quarantineKey: session.quarantineKey,
    reason: session.reason,
    purpose: session.purpose,
    repairPlan: session.repairPlan,
    provider: normalizeText(value.provider),
    healthManifest: normalizeText(value.healthManifest),
    sessionView,
    sessionViewMaterializationAudit: session.sessionViewMaterializationAudit,
  };
  return Object.fromEntries(Object.entries(result).filter(([, entryValue]) => entryValue !== undefined));
}

export function normalizeDownloadRunManifest(raw = {}, context = {}) {
  const counts = {
    expected: Number(raw.counts?.expected ?? context.expected ?? 0),
    attempted: Number(raw.counts?.attempted ?? context.attempted ?? 0),
    downloaded: Number(raw.counts?.downloaded ?? context.downloaded ?? 0),
    skipped: Number(raw.counts?.skipped ?? context.skipped ?? 0),
    failed: Number(raw.counts?.failed ?? context.failed ?? 0),
  };
  const status = normalizeDownloadRunStatus(raw.status ?? context.status, {
    ...counts,
    blocked: raw.blocked,
    dryRun: raw.dryRun,
  });
  const result = {
    schemaVersion: Number(raw.schemaVersion ?? context.schemaVersion ?? DOWNLOAD_RUN_MANIFEST_SCHEMA_VERSION),
    runId: normalizeText(raw.runId ?? context.runId),
    planId: normalizeText(raw.planId ?? context.planId),
    siteKey: normalizeText(raw.siteKey ?? context.siteKey),
    status,
    reason: normalizeDownloadRunReason(raw.reason ?? context.reason, status),
    counts,
    files: normalizeDownloaderConsumerArray(raw.files),
    failedResources: normalizeDownloaderConsumerArray(raw.failedResources),
    resumeCommand: normalizeText(raw.resumeCommand ?? context.resumeCommand) || undefined,
    artifacts: normalizeDownloadRunArtifacts(raw.artifacts, context.artifacts),
    legacy: raw.legacy ?? context.legacy ?? undefined,
    liveValidation: normalizeLiveValidation(raw.liveValidation ?? context.liveValidation),
    session: normalizeManifestSession(raw.session ?? context.session),
    createdAt: normalizeText(raw.createdAt ?? context.createdAt) || new Date().toISOString(),
    finishedAt: normalizeText(raw.finishedAt ?? context.finishedAt) || undefined,
  };
  const reasonRecovery = normalizeDownloadRunReasonRecovery(result.reason);
  if (reasonRecovery) {
    result.reasonRecovery = reasonRecovery;
  }
  const riskState = raw.riskState ?? context.riskState;
  if (riskState && typeof riskState === 'object' && !Array.isArray(riskState)) {
    assertSchemaCompatible('RiskState', riskState);
    result.riskState = normalizeRiskState(riskState);
  }
  return result;
}
