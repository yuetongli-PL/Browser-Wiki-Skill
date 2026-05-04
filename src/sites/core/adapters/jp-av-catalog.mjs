// @ts-check

import { cleanText, hostFromUrl, normalizeUrlNoFragment, normalizeWhitespace } from '../../../shared/normalize.mjs';
import {
  normalizeSiteAdapterCandidateDecision,
  normalizeSiteAdapterCatalogUpgradePolicy,
} from '../../capability/api-candidates.mjs';
import { createCatalogAdapter } from './factory.mjs';
import { normalizeSiteAdapterSemanticEntry } from './generic-navigation.mjs';

export const JP_AV_CATALOG_REASON_CODES = Object.freeze({
  unsupportedUrl: 'unsupported_url',
  unsupportedCapability: 'unsupported_capability',
  parseFailed: 'parse_failed',
  missingRequiredField: 'missing_required_field',
  paginationExhausted: 'pagination_exhausted',
  networkFailed: 'network_failed',
  authRequired: 'auth_required',
  ageGateOrAccessGate: 'age_gate_or_access_gate',
  blockedByPolicy: 'blocked_by_policy',
  downloaderNotAllowed: 'downloader_not_allowed',
  schemaValidationFailed: 'schema_validation_failed',
});

const COMMON_STATIC_API_PATTERNS = Object.freeze([
  /\/(?:favicon|robots\.txt)(?:$|[?#])/iu,
  /\/(?:assets?|static|common|css|js|images?|img|fonts?)\//iu,
  /\.(?:css|js|mjs|png|jpe?g|webp|gif|svg|ico|woff2?|ttf|map)(?:$|[?#])/iu,
]);

const SENSITIVE_NODE_KINDS = new Set([
  'login-state',
  'permission',
  'permission-signal',
  'permission-denied',
  'risk',
  'risk-control',
  'risk-signal',
  'limited-page',
  'restriction-page',
  'rate-limit',
  'recovery-entry',
  'manual-risk',
  'manual-risk-state',
]);

const RECOGNIZED_NODE_KINDS = new Set([
  'navigation-state',
  'page-type',
  'search-form',
  'content-link',
  'safe-nav-link',
  'pagination-link',
  'ranking-link',
  'author-link',
  'brand-link',
  'maker-link',
  'label-link',
  'series-link',
  'category-link',
  'release-list',
  'work-list',
  'work-detail',
  'auth-link',
  ...SENSITIVE_NODE_KINDS,
]);

const IGNORED_NODE_KINDS = new Set([
  'artifact-ref',
  'decorative-banner',
  'analytics-pixel',
  'tracking-pixel',
  'style-resource',
]);

const PAGE_TYPES = new Set([
  'home',
  'book-detail-page',
  'content-detail-page',
  'author-page',
  'author-list-page',
  'category-page',
  'search-results-page',
  'auth-page',
  'unknown-page',
]);

const SITE_CONFIGS = Object.freeze({
  'rookie-av': {
    id: 'rookie-av',
    siteKey: 'rookie-av',
    hosts: ['rookie-av.jp', 'www.rookie-av.jp'],
    canonicalBaseUrl: 'https://rookie-av.jp/',
    displayName: 'ROOKIE',
    detailPrefixes: ['/works/detail/'],
    listPrefixes: ['/works/date', '/works/list/', '/works/'],
    authorPrefixes: ['/actress/detail/', '/actress/'],
    authorListPrefixes: ['/actress'],
    searchPrefixes: ['/search/list', '/search/'],
    authPrefixes: ['/login', '/member', '/mypage'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/list'],
    productIdPatterns: [
      /\/works\/detail\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  'madonna-av': {
    id: 'madonna-av',
    siteKey: 'madonna-av',
    hosts: ['madonna-av.com', 'www.madonna-av.com'],
    canonicalBaseUrl: 'https://madonna-av.com/',
    displayName: 'Madonna',
    detailPrefixes: ['/works/detail/'],
    listPrefixes: ['/works/date', '/works/list/', '/works/'],
    authorPrefixes: ['/actress/detail/', '/actress/'],
    authorListPrefixes: ['/actress'],
    searchPrefixes: ['/search/list', '/search/'],
    authPrefixes: ['/login', '/member', '/mypage'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/list'],
    productIdPatterns: [
      /\/works\/detail\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  'dahlia-av': {
    id: 'dahlia-av',
    siteKey: 'dahlia-av',
    hosts: ['dahlia-av.jp', 'www.dahlia-av.jp'],
    canonicalBaseUrl: 'https://dahlia-av.jp/',
    displayName: 'DAHLIA',
    detailPrefixes: ['/works/detail/'],
    listPrefixes: ['/works/date', '/works/list/', '/works/'],
    authorPrefixes: ['/actress/detail/', '/actress/'],
    authorListPrefixes: ['/actress'],
    searchPrefixes: ['/search/list', '/search/'],
    authPrefixes: ['/login', '/member', '/mypage'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/list'],
    productIdPatterns: [
      /\/works\/detail\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  sod: {
    id: 'sod',
    siteKey: 'sod',
    hosts: ['www.sod.co.jp', 'sod.co.jp'],
    canonicalBaseUrl: 'https://www.sod.co.jp/',
    displayName: 'SOD',
    detailPrefixes: ['/prime/videos/', '/videos/', '/adultvideo/detail/', '/works/detail/'],
    listPrefixes: ['/prime/videos/', '/contents/', '/search/', '/adultvideo/', '/works/'],
    authorPrefixes: ['/actress/', '/star/', '/performer/'],
    authorListPrefixes: ['/actress', '/star'],
    searchPrefixes: ['/search/', '/prime/search/'],
    authPrefixes: ['/login', '/member', '/mypage'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/'],
    productIdPatterns: [
      /\/(?:prime\/videos|videos|adultvideo\/detail|works\/detail)\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work|video)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  s1: {
    id: 's1',
    siteKey: 's1',
    hosts: ['s1s1s1.com', 'www.s1s1s1.com'],
    canonicalBaseUrl: 'https://s1s1s1.com/',
    displayName: 'S1 NO.1 STYLE',
    detailPrefixes: ['/works/detail/'],
    listPrefixes: ['/works/date', '/works/list/', '/works/'],
    authorPrefixes: ['/actress/detail/', '/actress/'],
    authorListPrefixes: ['/actress'],
    searchPrefixes: ['/search/list', '/search/'],
    authPrefixes: ['/login', '/member', '/mypage', '/agecheck'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/list'],
    productIdPatterns: [
      /\/works\/detail\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  attackers: {
    id: 'attackers',
    siteKey: 'attackers',
    hosts: ['attackers.net', 'www.attackers.net'],
    canonicalBaseUrl: 'https://attackers.net/',
    displayName: 'ATTACKERS',
    detailPrefixes: ['/works/detail/'],
    listPrefixes: ['/works/date', '/works/list/', '/works/'],
    authorPrefixes: ['/actress/detail/', '/actress/'],
    authorListPrefixes: ['/actress'],
    searchPrefixes: ['/search/list', '/search/'],
    authPrefixes: ['/login', '/member', '/mypage', '/agecheck'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/list'],
    productIdPatterns: [
      /\/works\/detail\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  't-powers': {
    id: 't-powers',
    siteKey: 't-powers',
    hosts: ['www.t-powers.co.jp', 't-powers.co.jp'],
    canonicalBaseUrl: 'https://www.t-powers.co.jp/',
    displayName: 'T-POWERS',
    detailPrefixes: ['/works/detail/', '/talent/', '/release/detail/', '/release/', '/topics/', '/event/'],
    listPrefixes: ['/talent', '/topics', '/release', '/event', '/sns'],
    authorPrefixes: ['/talent/', '/model/'],
    authorListPrefixes: ['/talent'],
    searchPrefixes: ['/search/', '/?s='],
    authPrefixes: ['/login', '/client', '/contact'],
    utilityPrefixes: ['/company', '/link', '/contact', '/fanletter', '/recruit'],
    apiPrefixes: ['/wp-json/', '/api/', '/ajax/', '/search/'],
    productIdPatterns: [
      /\/(?:works\/detail|talent|release|topics|event)\/([a-z0-9_-]+)/iu,
      /(?:talent|release|topic|event)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  '8man': {
    id: '8man',
    siteKey: '8man',
    hosts: ['www.8man.jp', '8man.jp'],
    canonicalBaseUrl: 'https://www.8man.jp/',
    displayName: 'EIGHTMAN',
    detailPrefixes: ['/works/detail/', '/talent/', '/model/', '/profile/'],
    listPrefixes: ['/talent', '/model', '/news', '/release', '/works'],
    authorPrefixes: ['/talent/', '/model/', '/profile/'],
    authorListPrefixes: ['/talent', '/model'],
    searchPrefixes: ['/search/', '/?s='],
    authPrefixes: ['/login', '/member', '/contact'],
    utilityPrefixes: ['/company', '/link', '/contact', '/privacy', '/sitemap'],
    apiPrefixes: ['/wp-json/', '/api/', '/ajax/', '/search/'],
    productIdPatterns: [
      /\/(?:works\/detail|talent|model|profile)\/([a-z0-9_-]+)/iu,
      /(?:talent|model|profile|work)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  dogma: {
    id: 'dogma',
    siteKey: 'dogma',
    hosts: ['www.dogma.co.jp', 'dogma.co.jp'],
    canonicalBaseUrl: 'http://www.dogma.co.jp/',
    displayName: 'DOGMA',
    detailPrefixes: ['/works/detail/', '/product/', '/products/', '/movie/', '/movies/'],
    listPrefixes: ['/works/list', '/works/', '/product/', '/products/', '/movie/', '/movies/', '/release/'],
    authorPrefixes: ['/actress/', '/model/', '/performer/'],
    authorListPrefixes: ['/actress', '/model', '/performer'],
    searchPrefixes: ['/search/', '/search/list', '/?s='],
    authPrefixes: ['/agecheck', '/adultcheck', '/login', '/member', '/mypage'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/'],
    productIdPatterns: [
      /\/(?:works\/detail|product|products|movie|movies)\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work|movie)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  'km-produce': {
    id: 'km-produce',
    siteKey: 'km-produce',
    hosts: ['www.km-produce.com', 'km-produce.com'],
    canonicalBaseUrl: 'https://www.km-produce.com/',
    displayName: 'KM Produce',
    detailPrefixes: ['/works/detail/', '/product/', '/products/', '/movies/', '/item/'],
    listPrefixes: ['/newrelease/', '/release/', '/ranking/', '/genre/', '/actress/', '/works/', '/product/', '/products/', '/movies/'],
    authorPrefixes: ['/actress/', '/model/', '/performer/'],
    authorListPrefixes: ['/actress'],
    searchPrefixes: ['/search/', '/?s='],
    authPrefixes: ['/agecheck', '/adultcheck', '/login', '/member', '/mypage'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact', '/event'],
    apiPrefixes: ['/api/', '/ajax/', '/wp-json/', '/search/'],
    productIdPatterns: [
      /\/(?:works\/detail|product|products|movies|item)\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work|movie|item)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
  maxing: {
    id: 'maxing',
    siteKey: 'maxing',
    hosts: ['www.maxing.jp', 'maxing.jp'],
    canonicalBaseUrl: 'https://www.maxing.jp/',
    displayName: 'MAXING',
    detailPrefixes: ['/works/detail/', '/product/', '/products/', '/item/', '/movie/'],
    listPrefixes: ['/works/list', '/works/', '/product/', '/products/', '/release/', '/genre/'],
    authorPrefixes: ['/actress/', '/model/', '/performer/'],
    authorListPrefixes: ['/actress', '/model', '/performer'],
    searchPrefixes: ['/search/', '/search/list', '/?s='],
    authPrefixes: ['/agecheck', '/adultcheck', '/login', '/member', '/mypage'],
    utilityPrefixes: ['/top', '/help', '/privacy', '/sitemap', '/contact'],
    apiPrefixes: ['/api/', '/ajax/', '/search/'],
    productIdPatterns: [
      /\/(?:works\/detail|product|products|item|movie)\/([a-z0-9_-]+)/iu,
      /(?:product|cid|work|item|movie)[_-]?id=([a-z0-9_-]+)/iu,
    ],
  },
});

function parseUrl(input) {
  try {
    return input ? new URL(input) : null;
  } catch {
    return null;
  }
}

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function uniqueClean(values) {
  return [...new Set(toArray(values).map((value) => cleanText(value)).filter(Boolean))];
}

function resolveHost(input = {}) {
  return String(
    input.host
      ?? input.siteContext?.host
      ?? input.profile?.host
      ?? hostFromUrl(input.candidateUrl)
      ?? hostFromUrl(input.inputUrl)
      ?? ''
  ).toLowerCase();
}

function normalizePathnameValue(pathname) {
  const input = String(pathname ?? '').trim() || '/';
  let normalized = input.startsWith('/') ? input : `/${input}`;
  normalized = normalized.replace(/\/{2,}/gu, '/');
  if (normalized.length > 1) {
    normalized = normalized.replace(/\/+$/gu, '');
  }
  return normalized || '/';
}

function pathStartsWithAny(pathname, prefixes = []) {
  const normalized = normalizePathnameValue(pathname).toLowerCase();
  return prefixes.some((prefix) => {
    const candidate = normalizePathnameValue(prefix).toLowerCase();
    return normalized === candidate || normalized.startsWith(candidate.endsWith('/') ? candidate : `${candidate}/`);
  });
}

function firstMatch(value, patterns = []) {
  for (const pattern of patterns) {
    const match = String(value ?? '').match(pattern);
    if (match?.[1]) {
      return cleanText(match[1]).toUpperCase();
    }
  }
  return null;
}

function endpointParts(candidate = {}) {
  const parsed = parseUrl(candidate?.endpoint?.url ?? candidate?.url);
  return {
    host: parsed?.hostname.toLowerCase() ?? '',
    pathname: parsed?.pathname ?? '',
  };
}

function isSiteApiCandidate(config, candidate = {}) {
  const siteKey = String(candidate?.siteKey ?? '').trim();
  const { host, pathname } = endpointParts(candidate);
  return siteKey === config.siteKey
    && config.hosts.includes(host)
    && config.apiPrefixes.some((prefix) => pathStartsWithAny(pathname, [prefix]));
}

function inferConfiguredPageType(config, { pathname = '/' } = {}) {
  const normalized = normalizePathnameValue(pathname);
  if (normalized === '/') {
    return 'home';
  }
  if (pathStartsWithAny(normalized, config.authPrefixes)) {
    return 'auth-page';
  }
  if (pathStartsWithAny(normalized, config.searchPrefixes)) {
    return 'search-results-page';
  }
  if (pathStartsWithAny(normalized, config.detailPrefixes)) {
    return 'book-detail-page';
  }
  if (pathStartsWithAny(normalized, config.authorPrefixes)) {
    return pathStartsWithAny(normalized, config.authorListPrefixes) ? 'author-list-page' : 'author-page';
  }
  if (pathStartsWithAny(normalized, config.listPrefixes)) {
    return 'category-page';
  }
  return null;
}

function classifyConfiguredPath(config, { pathname = '/' } = {}) {
  const pageType = inferConfiguredPageType(config, { pathname });
  if (!pageType) {
    return { kind: null, detail: null };
  }
  return {
    kind: 'jp-av-catalog-path',
    detail: pageType,
  };
}

function normalizeConfiguredDisplayLabel(config, rawValue, { url, pageType } = {}) {
  const raw = cleanText(rawValue);
  if (pageType === 'home') {
    return config.displayName;
  }
  const parsed = parseUrl(url);
  const productId = firstMatch(parsed?.pathname ?? '', config.productIdPatterns);
  if (pageType === 'book-detail-page' && productId) {
    return raw && !raw.toUpperCase().includes(productId) ? `${productId} ${raw}` : (raw || productId);
  }
  return raw || productId || config.displayName;
}

function normalizeNodeKind(item = {}) {
  return cleanText(item.nodeKind ?? item.kind ?? item.type).toLowerCase();
}

function normalizePageType(item = {}) {
  const raw = cleanText(item.pageType ?? item.semanticPageType ?? item.evidence?.pageType);
  return PAGE_TYPES.has(raw) ? raw : null;
}

function urlPath(value) {
  const text = cleanText(value);
  if (!text) {
    return '';
  }
  try {
    return new URL(text).pathname;
  } catch {
    return text;
  }
}

function nodeLocator(item = {}) {
  return cleanText(item.locator ?? item.url ?? item.href ?? item.path);
}

function recognizedDecision(item, recognizedAs) {
  return {
    classification: 'recognized',
    recognizedAs,
    required: Boolean(item?.required),
  };
}

function ignoredDecision(item, reason) {
  return {
    classification: 'ignored',
    reason,
    required: Boolean(item?.required),
  };
}

function classifyConfiguredNode(config, item = {}) {
  const nodeKind = normalizeNodeKind(item);
  if (nodeKind && SENSITIVE_NODE_KINDS.has(nodeKind)) {
    return recognizedDecision(item, `${config.siteKey}:${nodeKind}`);
  }
  const pageType = normalizePageType(item) ?? inferConfiguredPageType(config, { pathname: urlPath(nodeLocator(item)) });
  if (pageType) {
    return recognizedDecision(item, `${config.siteKey}:${pageType}`);
  }
  if (nodeKind && RECOGNIZED_NODE_KINDS.has(nodeKind)) {
    return recognizedDecision(item, `${config.siteKey}:${nodeKind}`);
  }
  if (nodeKind && IGNORED_NODE_KINDS.has(nodeKind)) {
    return ignoredDecision(item, `${config.displayName} non-capability page chrome is recorded outside required onboarding coverage.`);
  }
  return {
    classification: 'unknown',
    required: Boolean(item.required),
  };
}

function apiEndpoint(item = {}) {
  return cleanText(item.locator ?? item.url ?? item.endpoint?.url ?? item.path ?? item.route);
}

function classifyConfiguredApi(config, item = {}) {
  const endpoint = apiEndpoint(item);
  const path = urlPath(endpoint);
  if (!endpoint) {
    return {
      classification: 'unknown',
      required: Boolean(item.required),
    };
  }
  if (COMMON_STATIC_API_PATTERNS.some((pattern) => pattern.test(endpoint))) {
    return ignoredDecision(item, `${config.displayName} static or browser-support request is outside onboarding capability coverage.`);
  }
  if (pathStartsWithAny(path, [...config.detailPrefixes, ...config.listPrefixes, ...config.searchPrefixes, ...config.authorPrefixes])) {
    return recognizedDecision(item, `${config.siteKey}:page-request:${path || '/'}`);
  }
  if (pathStartsWithAny(path, config.apiPrefixes)) {
    return recognizedDecision(item, `${config.siteKey}:observed-api:${path || '/'}`);
  }
  return ignoredDecision(item, `${config.displayName} non-required request is not promoted until a verified SiteAdapter API contract accepts it.`);
}

function stripTags(value) {
  return normalizeWhitespace(String(value ?? '').replace(/<[^>]*>/gu, ' '));
}

function decodeEntities(value) {
  return String(value ?? '')
    .replace(/&amp;/giu, '&')
    .replace(/&lt;/giu, '<')
    .replace(/&gt;/giu, '>')
    .replace(/&quot;/giu, '"')
    .replace(/&#39;/giu, "'");
}

function attrValue(tag, attrName) {
  const pattern = new RegExp(`${attrName}\\s*=\\s*["']([^"']+)["']`, 'iu');
  return decodeEntities(tag.match(pattern)?.[1] ?? '');
}

function absoluteUrl(value, baseUrl) {
  const text = normalizeWhitespace(value);
  if (!text) {
    return null;
  }
  try {
    return new URL(text, baseUrl).toString();
  } catch {
    return text;
  }
}

function isAllowedConfiguredUrl(config, inputUrl, profile = null) {
  const parsed = parseUrl(inputUrl);
  if (!parsed) {
    return false;
  }
  const allowedHosts = new Set([
    ...config.hosts,
    ...toArray(profile?.navigation?.allowedHosts).map((host) => String(host).toLowerCase()),
  ]);
  return allowedHosts.has(parsed.hostname.toLowerCase());
}

function normalizeConfiguredNavigationUrl(config, inputUrl, profile = null) {
  const parsed = parseUrl(inputUrl);
  if (!parsed || !isAllowedConfiguredUrl(config, parsed.toString(), profile)) {
    return null;
  }
  parsed.hash = '';
  for (const key of [...parsed.searchParams.keys()]) {
    if (/^(?:utm_|fbclid$|gclid$|yclid$|yclid$|mc_)/iu.test(key) || /(?:session|token|csrf|cookie|auth)/iu.test(key)) {
      parsed.searchParams.delete(key);
    }
  }
  if (inferConfiguredPageType(config, { pathname: parsed.pathname }) === 'book-detail-page') {
    parsed.search = '';
  }
  return parsed.toString();
}

function firstMetaContent(html, names = []) {
  for (const name of names) {
    const pattern = new RegExp(`<meta\\b[^>]*(?:property|name|itemprop)=["']${name}["'][^>]*>`, 'iu');
    const tag = html.match(pattern)?.[0];
    const content = tag ? attrValue(tag, 'content') : '';
    if (content) {
      return normalizeWhitespace(content);
    }
  }
  return null;
}

function firstTextByDataField(html, fieldNames = []) {
  for (const field of fieldNames) {
    const patterns = [
      new RegExp(`<[^>]+data-field=["']${field}["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'iu'),
      new RegExp(`<dt[^>]*>\\s*${field}\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`, 'iu'),
      new RegExp(`<th[^>]*>\\s*${field}\\s*<\\/th>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`, 'iu'),
    ];
    for (const pattern of patterns) {
      const value = cleanText(decodeEntities(stripTags(html.match(pattern)?.[1] ?? '')));
      if (value) {
        return value;
      }
    }
  }
  return null;
}

function allTextByDataField(html, fieldNames = []) {
  const values = [];
  for (const field of fieldNames) {
    const patterns = [
      new RegExp(`<[^>]+data-field=["']${field}["'][^>]*>([\\s\\S]*?)<\\/[^>]+>`, 'giu'),
      new RegExp(`<dt[^>]*>\\s*${field}\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`, 'giu'),
      new RegExp(`<th[^>]*>\\s*${field}\\s*<\\/th>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`, 'giu'),
    ];
    for (const pattern of patterns) {
      for (const match of html.matchAll(pattern)) {
        const text = cleanText(decodeEntities(stripTags(match[1])));
        if (text) {
          values.push(...text.split(/\s*[,/銆侊紝]\s*/u));
        }
      }
    }
  }
  return uniqueClean(values);
}

function allImageUrls(html, baseUrl, selectorToken) {
  const urls = [];
  const pattern = new RegExp(`<img\\b[^>]*(?:class|data-role)=["'][^"']*${selectorToken}[^"']*["'][^>]*>`, 'giu');
  for (const match of html.matchAll(pattern)) {
    const src = attrValue(match[0], 'src') || attrValue(match[0], 'data-src');
    const resolved = absoluteUrl(src, baseUrl);
    if (resolved) {
      urls.push(resolved);
    }
  }
  return uniqueClean(urls);
}

function extractStructuredData(html) {
  const entries = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu;
  for (const match of html.matchAll(pattern)) {
    try {
      const parsed = JSON.parse(decodeEntities(match[1]).trim());
      entries.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      // Ignore invalid JSON-LD and fall back to HTML selectors.
    }
  }
  return entries.find((entry) => entry && typeof entry === 'object') ?? {};
}

function confidenceFromMissing(missingFields) {
  const missing = missingFields.length;
  if (missing <= 1) {
    return 0.95;
  }
  if (missing <= 3) {
    return 0.82;
  }
  return 0.68;
}

function allAnchors(html, baseUrl, allowedHosts = []) {
  const links = [];
  const pattern = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/giu;
  const hostSet = new Set(allowedHosts.map((host) => String(host).toLowerCase()));
  for (const match of String(html ?? '').matchAll(pattern)) {
    const url = normalizePublicUrl(match[1], baseUrl);
    if (!url) {
      continue;
    }
    const parsed = parseUrl(url);
    if (!parsed || (hostSet.size > 0 && !hostSet.has(parsed.hostname.toLowerCase()))) {
      continue;
    }
    links.push({
      url,
      label: cleanText(decodeEntities(stripTags(match[2]))),
      pathname: parsed.pathname,
    });
  }
  return links;
}

function normalizePublicUrl(value, baseUrl) {
  const text = normalizeWhitespace(value);
  if (!text || /^(?:javascript|data|mailto|tel):/iu.test(text)) {
    return null;
  }
  try {
    const parsed = new URL(text, baseUrl);
    parsed.username = '';
    parsed.password = '';
    parsed.hash = '';
    for (const key of [...parsed.searchParams.keys()]) {
      if (/^(?:utm_|fbclid$|gclid$|yclid$|mc_)/iu.test(key) || /(?:session|token|csrf|cookie|auth|sessdata|sid)/iu.test(key)) {
        parsed.searchParams.delete(key);
      }
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

function externalPublicAnchors(html, baseUrl) {
  const socialHosts = /(?:x\.com|twitter\.com|instagram\.com|youtube\.com|youtu\.be|tiktok\.com|facebook\.com|line\.me|linktr\.ee|lit\.link|note\.com|threads\.net)/iu;
  return allAnchors(html, baseUrl)
    .filter((link) => parseUrl(link.url) && socialHosts.test(parseUrl(link.url).hostname))
    .map((link) => ({ url: link.url, label: link.label || null }));
}

function firstImageUrl(html, baseUrl) {
  const tag = String(html ?? '').match(/<img\b[^>]*>/iu)?.[0];
  if (!tag) {
    return null;
  }
  return absoluteUrl(attrValue(tag, 'src') || attrValue(tag, 'data-src'), baseUrl);
}

function profileNameFromHtml(html) {
  return firstMetaContent(html, ['og:title', 'twitter:title'])
    || cleanText(stripTags(String(html ?? '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] ?? ''))
    || cleanText(stripTags(String(html ?? '').match(/<h2[^>]*>([\s\S]*?)<\/h2>/iu)?.[1] ?? ''));
}

function structuredDataEntries(html) {
  const entries = [];
  const pattern = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu;
  for (const match of String(html ?? '').matchAll(pattern)) {
    try {
      const parsed = JSON.parse(decodeEntities(match[1]).trim());
      entries.push(...(Array.isArray(parsed) ? parsed : [parsed]));
    } catch {
      // Ignore invalid JSON-LD and fall back to HTML selectors.
    }
  }
  return entries.filter((entry) => entry && typeof entry === 'object');
}

function profileStructuredData(html) {
  return structuredDataEntries(html).find((entry) => {
    const type = String(Array.isArray(entry?.['@type']) ? entry['@type'].join(' ') : entry?.['@type'] ?? '').toLowerCase();
    return /\b(?:person|performer|organization)\b/iu.test(type);
  }) ?? {};
}

export function extractJpAvProfileMetadata({
  html,
  url,
  siteKey,
  extractedAt = new Date().toISOString(),
} = {}) {
  const config = SITE_CONFIGS[siteKey];
  if (!config) {
    return {
      ok: false,
      reasonCode: JP_AV_CATALOG_REASON_CODES.unsupportedUrl,
      missingFields: ['siteKey'],
    };
  }
  const sourceUrl = normalizeUrlNoFragment(url ?? config.canonicalBaseUrl);
  const canonicalUrl =
    normalizeUrlNoFragment(firstMetaContent(html, ['og:url', 'twitter:url']) ?? sourceUrl)
    ?? sourceUrl;
  const jsonLd = profileStructuredData(html);
  const links = allAnchors(html, canonicalUrl, config.hosts);
  const workLinks = links
    .filter((link) => pathStartsWithAny(link.pathname, config.detailPrefixes))
    .map((link) => ({ url: link.url, title: link.label || null }));
  const sameHostPublicLinks = links
    .filter((link) => !pathStartsWithAny(link.pathname, config.detailPrefixes))
    .slice(0, 20)
    .map((link) => ({ url: link.url, label: link.label || null }));
  const publicLinks = [
    ...externalPublicAnchors(html, canonicalUrl),
    ...sameHostPublicLinks,
  ].slice(0, 30);
  const name = cleanText(jsonLd.name) || profileNameFromHtml(html);
  const aliases = uniqueClean([
    ...toArray(jsonLd.alternateName),
    ...allTextByDataField(html, ['alias', 'aliases', 'nickname', 'stageName']),
  ]);
  const tags = uniqueClean([
    ...toArray(jsonLd.knowsAbout),
    ...toArray(jsonLd.keywords).flatMap((value) => String(value).split(/\s*,\s*/u)),
    ...allTextByDataField(html, ['genre', 'genres', 'tags', 'category', 'categories']),
    ...links
      .filter((link) => pathStartsWithAny(link.pathname, [...config.authorPrefixes, ...config.listPrefixes]))
      .map((link) => link.label),
  ]);
  const agencyOrBrand =
    cleanText(jsonLd.affiliation?.name ?? jsonLd.brand?.name ?? jsonLd.worksFor?.name)
    || firstTextByDataField(html, ['agency', 'office', 'brand', 'maker'])
    || config.displayName;
  const image =
    absoluteUrl(cleanText(Array.isArray(jsonLd.image) ? jsonLd.image[0] : jsonLd.image), canonicalUrl)
    || absoluteUrl(firstMetaContent(html, ['og:image', 'twitter:image']), canonicalUrl)
    || firstImageUrl(html, canonicalUrl);
  const missingFields = ['name', 'canonicalUrl', 'sourceUrl'].filter((field) => {
    if (field === 'name') {
      return !name;
    }
    if (field === 'canonicalUrl') {
      return !canonicalUrl;
    }
    return !sourceUrl;
  });
  return {
    ok: missingFields.length === 0,
    reasonCode: missingFields.length ? JP_AV_CATALOG_REASON_CODES.missingRequiredField : null,
    metadata: {
      siteKey: config.siteKey,
      name: name || null,
      aliases,
      agency: agencyOrBrand,
      brand: agencyOrBrand,
      profileUrl: canonicalUrl,
      canonicalUrl,
      sourceUrl,
      image,
      publicLinks,
      socialLinks: publicLinks,
      workLinks,
      worksLinks: workLinks,
      appearances: workLinks,
      appearancesLinks: workLinks,
      tags,
      categories: tags,
      extractedAt,
      missingFields,
      confidence: confidenceFromMissing(missingFields),
      sourceEvidence: {
        name: name ? 'json-ld/meta-or-heading' : null,
        aliases: aliases.length ? 'json-ld-or-profile-field' : null,
        agency: agencyOrBrand ? 'json-ld-or-profile-field-or-site-brand' : null,
        canonicalUrl: canonicalUrl ? 'og-url-or-source-url' : null,
        image: image ? 'json-ld/meta-or-first-image' : null,
        publicLinks: publicLinks.length ? 'social/public anchors' : null,
        workLinks: workLinks.length ? 'detail-prefix anchors' : null,
        tags: tags.length ? 'json-ld/field/category-links' : null,
      },
    },
  };
}

export function extractJpAvWorkMetadata({
  html,
  url,
  siteKey,
  extractedAt = new Date().toISOString(),
  listPosition = null,
} = {}) {
  const config = SITE_CONFIGS[siteKey];
  if (!config) {
    return {
      ok: false,
      reasonCode: JP_AV_CATALOG_REASON_CODES.unsupportedUrl,
      missingFields: ['siteKey'],
    };
  }
  const sourceUrl = normalizeUrlNoFragment(url ?? config.canonicalBaseUrl);
  const canonicalDetailUrl =
    normalizeUrlNoFragment(firstMetaContent(html, ['og:url', 'twitter:url']) ?? sourceUrl)
    ?? sourceUrl;
  const jsonLd = extractStructuredData(String(html ?? ''));
  const productId = firstMatch(`${canonicalDetailUrl}\n${html ?? ''}`, config.productIdPatterns)
    ?? cleanText(jsonLd.sku ?? jsonLd.productID ?? '');
  const title =
    cleanText(jsonLd.name)
    || firstMetaContent(html, ['og:title', 'twitter:title'])
    || cleanText(stripTags(String(html ?? '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] ?? ''));
  const releaseDate =
    cleanText(jsonLd.releaseDate ?? jsonLd.datePublished)
    || firstTextByDataField(html, ['releaseDate', 'release-date']);
  const coverImage =
    absoluteUrl(cleanText(jsonLd.image), canonicalDetailUrl)
    || absoluteUrl(firstMetaContent(html, ['og:image', 'twitter:image']), canonicalDetailUrl);
  const sampleImages = allImageUrls(html, canonicalDetailUrl, 'sample');
  const actress = uniqueClean([
    ...toArray(jsonLd.actor).map((actor) => actor?.name ?? actor),
    ...toArray(jsonLd.performer).map((performer) => performer?.name ?? performer),
    ...allTextByDataField(html, ['actress', 'performer']),
  ]);
  const tags = uniqueClean([
    ...toArray(jsonLd.genre),
    ...toArray(jsonLd.keywords).flatMap((value) => String(value).split(/\s*,\s*/u)),
    ...allTextByDataField(html, ['genre', 'genres', 'tags', '銈搞儯銉炽儷', '銈儐銈淬儶']),
  ]);

  const metadata = {
    siteKey: config.siteKey,
    workId: productId || null,
    productId: productId || null,
    title: title || null,
    releaseDate: releaseDate || null,
    maker: firstTextByDataField(html, ['maker', '銉°兗銈兗']) ?? config.displayName,
    label: firstTextByDataField(html, ['label', '銉兗銉欍儷']) ?? null,
    brand: firstTextByDataField(html, ['brand', '銉栥儵銉炽儔']) ?? config.displayName,
    series: firstTextByDataField(html, ['series', '銈枫儶銉笺偤']) ?? null,
    actress,
    performer: actress,
    director: firstTextByDataField(html, ['director', '鐩ｇ潱']) ?? null,
    duration: firstTextByDataField(html, ['duration', '鍙庨尣鏅傞枔', '鍐嶇敓鏅傞枔']) ?? null,
    coverImage,
    sampleImages,
    tags,
    genres: tags,
    description:
      cleanText(jsonLd.description)
      || firstMetaContent(html, ['description', 'og:description'])
      || firstTextByDataField(html, ['description', 'intro'])
      || null,
    price: firstTextByDataField(html, ['price', '渚℃牸']) ?? null,
    availability: cleanText(jsonLd.offers?.availability) || firstTextByDataField(html, ['availability', '璨╁２鐘舵硜']) || null,
    pageSourceUrl: sourceUrl,
    canonicalDetailUrl,
    listPosition,
    extractedAt,
    sourceEvidence: {
      title: title ? 'json-ld/meta/h1' : null,
      productId: productId ? 'url-or-product-selector' : null,
      releaseDate: releaseDate ? 'json-ld-or-release-selector' : null,
      coverImage: coverImage ? 'json-ld-or-og-image' : null,
      sampleImages: sampleImages.length ? 'img.sample/data-role-sample' : null,
      tags: tags.length ? 'json-ld-or-field-selector' : null,
    },
  };

  const requiredFields = ['productId', 'title', 'canonicalDetailUrl', 'pageSourceUrl'];
  const missingFields = requiredFields.filter((field) => !metadata[field]);
  return {
    ok: missingFields.length === 0,
    reasonCode: missingFields.length ? JP_AV_CATALOG_REASON_CODES.missingRequiredField : null,
    metadata: {
      ...metadata,
      missingFields,
      confidence: confidenceFromMissing(missingFields),
    },
  };
}

export function mapJpAvFailureReason(input) {
  const normalized = String(input ?? '').trim();
  return JP_AV_CATALOG_REASON_CODES[normalized]
    ?? Object.values(JP_AV_CATALOG_REASON_CODES).find((code) => code === normalized)
    ?? JP_AV_CATALOG_REASON_CODES.parseFailed;
}

export function getJpAvApiDiscoverySupportStatus({
  siteKey,
  candidate,
} = {}) {
  const config = SITE_CONFIGS[siteKey];
  if (!config) {
    return {
      ok: false,
      reasonCode: JP_AV_CATALOG_REASON_CODES.unsupportedUrl,
      status: 'not_in_scope',
      promotion: 'not_promoted',
      downloaderBoundary: 'not_supported',
      apiDiscoveryStatus: 'not_promoted',
      promotionStatus: 'not_promoted',
      downloaderStatus: 'downloader_not_allowed',
      downloaderReasonCode: JP_AV_CATALOG_REASON_CODES.downloaderNotAllowed,
    };
  }
  const fallbackCandidate = {
    siteKey: config.siteKey,
    endpoint: { url: `${config.canonicalBaseUrl.replace(/\/+$/u, '')}/api/` },
  };
  const inspectedCandidate = candidate ?? fallbackCandidate;
  const observed = isSiteApiCandidate(config, inspectedCandidate);
  const { host, pathname } = endpointParts(inspectedCandidate);
  return {
    ok: true,
    siteKey: config.siteKey,
    adapterId: config.id,
    endpointHost: host,
    endpointPath: pathname,
    status: observed ? 'observed_only' : 'not_in_scope',
    promotion: 'not_promoted',
    downloaderBoundary: 'not_supported',
    apiDiscoveryStatus: observed ? 'observed_only' : 'not_promoted',
    promotionStatus: 'not_promoted',
    downloaderStatus: 'downloader_not_allowed',
    reasonCode: observed ? 'observed_api_not_promoted' : 'api_not_promoted',
    downloaderReasonCode: JP_AV_CATALOG_REASON_CODES.downloaderNotAllowed,
    notes: [
      'public catalog API discovery is observation evidence only',
      'no endpoint is promoted to a stable API contract by this adapter alone',
      'downloader integration is explicitly not allowed for this catalog adapter',
    ],
  };
}

function createJpAvCatalogAdapter(config) {
  const adapter = createCatalogAdapter({
    id: config.id,
    siteKey: config.siteKey,
    hosts: config.hosts,
    terminology: {
      entityLabel: 'work',
      entityPlural: 'works',
      personLabel: 'performer',
      personPlural: 'performers',
      searchLabel: 'search works',
      openEntityLabel: 'open work',
      openPersonLabel: 'open performer page',
      downloadLabel: 'download media',
      verifiedTaskLabel: `${config.displayName} catalog`,
    },
    intentLabels: {
      'search-work': 'search works',
      'open-work': 'open work',
      'open-actress': 'open performer page',
      'open-author': 'open performer page',
      'open-category': 'open category page',
      'open-utility-page': 'open utility page',
    },
    inferPageType(input = {}) {
      return inferConfiguredPageType(config, input);
    },
    classifyPath(input = {}) {
      return classifyConfiguredPath(config, input);
    },
    normalizeDisplayLabel({ value, ...options }) {
      return normalizeConfiguredDisplayLabel(config, value, options);
    },
    classifyNode(item = {}) {
      return classifyConfiguredNode(config, item);
    },
    classifyApi(item = {}) {
      return classifyConfiguredApi(config, item);
    },
    describeApiCandidateSemantics({
      candidate,
      scope = {},
    } = {}) {
      const { host, pathname } = endpointParts(candidate);
      return normalizeSiteAdapterSemanticEntry({
        candidate,
        scope: {
          semanticMode: 'jp-av-catalog-api-candidate',
          endpointHost: host,
          endpointPath: pathname,
          siteSurface: 'public-catalog-metadata',
          ...scope,
        },
        semantics: {
          auth: {
            ...candidate?.auth,
            authenticationRequired: false,
            credentialPolicy: 'redacted-session-view-only-if-explicitly-approved',
          },
          pagination: {
            ...candidate?.pagination,
            model: 'page-number-or-query-param',
            pageParam: 'page',
            nextPageSource: 'public pagination links or response metadata',
          },
          fieldMapping: {
            ...candidate?.fieldMapping,
            itemsPath: 'items or data.items',
            idPath: 'product id, work id, or URL slug',
            titlePath: 'title or name',
            detailUrlPath: 'url or canonical detail URL',
            thumbnailPath: 'cover image or thumbnail',
            performerPaths: ['actress', 'performer', 'cast'],
            tagPaths: ['tags', 'genres', 'categories'],
          },
          risk: {
            ...candidate?.risk,
            hints: [
              'public catalog surface only',
              'age gate, login, permission, risk, recovery, and manual-risk states are reportable boundaries',
              'no downloader is enabled for this site adapter',
            ],
            downloaderBoundary: 'not_supported',
            downloaderReasonCode: JP_AV_CATALOG_REASON_CODES.downloaderNotAllowed,
          },
        },
      }, {
        adapterId: config.id,
        siteKey: config.siteKey,
      });
    },
    validateApiCandidate({
      candidate,
      evidence = {},
      scope = {},
      validatedAt,
    } = {}) {
      const { host, pathname } = endpointParts(candidate);
      const accepted = isSiteApiCandidate(config, candidate);
      return normalizeSiteAdapterCandidateDecision({
        adapterId: config.id,
        decision: accepted ? 'accepted' : 'rejected',
        reasonCode: accepted ? undefined : 'api-verification-failed',
        validatedAt,
        scope: {
          validationMode: 'jp-av-catalog-api-candidate',
          endpointHost: host,
          endpointPath: pathname,
          ...scope,
        },
        evidence,
      }, { candidate });
    },
    getApiCatalogUpgradePolicy({
      candidate,
      siteAdapterDecision,
      evidence = {},
      scope = {},
      decidedAt,
    } = {}) {
      const { host, pathname } = endpointParts(candidate);
      const accepted = siteAdapterDecision?.decision === 'accepted'
        && isSiteApiCandidate(config, candidate)
        && candidate?.status === 'verified';
      return normalizeSiteAdapterCatalogUpgradePolicy({
        adapterId: config.id,
        allowCatalogUpgrade: accepted,
        reasonCode: accepted ? undefined : 'api-catalog-entry-blocked',
        decidedAt,
        scope: {
          policyMode: 'jp-av-catalog-public-api',
          endpointHost: host,
          endpointPath: pathname,
          ...scope,
        },
        evidence,
      }, {
        candidate,
        siteAdapterDecision,
      });
    },
  });

  return Object.freeze({
    ...adapter,
    extractWorkMetadata(input = {}) {
      return extractJpAvWorkMetadata({
        ...input,
        siteKey: config.siteKey,
      });
    },
    mapFailureReason: mapJpAvFailureReason,
    downloaderBoundary() {
      return {
        status: 'not_supported',
        reasonCode: JP_AV_CATALOG_REASON_CODES.downloaderNotAllowed,
        reason: `${config.displayName} has no verified low-permission downloader contract in this repository.`,
      };
    },
    apiDiscoveryStatus({ candidate } = {}) {
      return getJpAvApiDiscoverySupportStatus({
        siteKey: config.siteKey,
        candidate,
      });
    },
    getApiDiscoverySupportStatus(input = {}) {
      return getJpAvApiDiscoverySupportStatus({
        ...input,
        siteKey: config.siteKey,
      });
    },
    normalizeUrlForNavigation({ inputUrl, profile } = {}) {
      return normalizeConfiguredNavigationUrl(config, inputUrl, profile);
    },
    isAllowedUrlFamily({ inputUrl, profile } = {}) {
      return isAllowedConfiguredUrl(config, inputUrl, profile);
    },
    extractContentDetailSemantics(input = {}) {
      const host = resolveHost({ ...input, inputUrl: input.finalUrl ?? input.url });
      if (!isAllowedConfiguredUrl(config, input.finalUrl ?? input.url, input.profile)) {
        return {
          ok: false,
          reasonCode: JP_AV_CATALOG_REASON_CODES.unsupportedUrl,
          siteKey: config.siteKey,
          host: host || input.host || config.hosts[0],
        };
      }
      const normalizedUrl = normalizeConfiguredNavigationUrl(
        config,
        input.finalUrl ?? input.url ?? config.canonicalBaseUrl,
        input.profile,
      );
      const parsed = extractJpAvWorkMetadata({
        html: input.html,
        url: normalizedUrl,
        siteKey: config.siteKey,
        extractedAt: input.extractedAt,
        listPosition: input.listPosition,
      });
      if (!parsed.ok) {
        return {
          ok: false,
          reasonCode: parsed.reasonCode ?? JP_AV_CATALOG_REASON_CODES.parseFailed,
          siteKey: config.siteKey,
          host: host || input.host || config.hosts[0],
          missingFields: parsed.metadata?.missingFields ?? parsed.missingFields ?? [],
        };
      }
      const metadata = parsed.metadata;
      return {
        ok: true,
        schemaVersion: 'av-detail/v1',
        siteKey: config.siteKey,
        host: host || input.host || config.hosts[0],
        pageType: input.pageType ?? 'book-detail-page',
        canonicalUrl: metadata.canonicalDetailUrl,
        sourceUrl: metadata.pageSourceUrl,
        workId: metadata.workId,
        productId: metadata.productId,
        title: metadata.title,
        releaseDate: metadata.releaseDate,
        maker: metadata.maker,
        label: metadata.label,
        brand: metadata.brand,
        series: metadata.series,
        actors: metadata.actress,
        performers: metadata.performer,
        director: metadata.director,
        duration: metadata.duration,
        coverImage: metadata.coverImage,
        sampleImages: metadata.sampleImages,
        tags: metadata.tags,
        genres: metadata.genres,
        description: metadata.description,
        price: metadata.price,
        availability: metadata.availability,
        listPosition: metadata.listPosition,
        extractedAt: metadata.extractedAt,
        confidence: metadata.confidence,
        missingFields: metadata.missingFields,
        sourceEvidence: metadata.sourceEvidence,
      };
    },
    extractProfileSemantics(input = {}) {
      const host = resolveHost({ ...input, inputUrl: input.finalUrl ?? input.url });
      if (!isAllowedConfiguredUrl(config, input.finalUrl ?? input.url, input.profile)) {
        return {
          ok: false,
          reasonCode: JP_AV_CATALOG_REASON_CODES.unsupportedUrl,
          siteKey: config.siteKey,
          host: host || input.host || config.hosts[0],
        };
      }
      const normalizedUrl = normalizeConfiguredNavigationUrl(
        config,
        input.finalUrl ?? input.url ?? config.canonicalBaseUrl,
        input.profile,
      );
      const parsed = extractJpAvProfileMetadata({
        html: input.html,
        url: normalizedUrl,
        siteKey: config.siteKey,
        extractedAt: input.extractedAt,
      });
      if (!parsed.ok) {
        return {
          ok: false,
          reasonCode: parsed.reasonCode ?? JP_AV_CATALOG_REASON_CODES.parseFailed,
          siteKey: config.siteKey,
          host: host || input.host || config.hosts[0],
          missingFields: parsed.metadata?.missingFields ?? parsed.missingFields ?? [],
        };
      }
      return {
        ok: true,
        schemaVersion: 'av-profile/v1',
        siteKey: config.siteKey,
        host: host || input.host || config.hosts[0],
        ...parsed.metadata,
      };
    },
    extractPerformerProfileSemantics(input = {}) {
      return this.extractProfileSemantics(input);
    },
    extractTalentProfileSemantics(input = {}) {
      return this.extractProfileSemantics(input);
    },
  });
}

export const rookieAvAdapter = createJpAvCatalogAdapter(SITE_CONFIGS['rookie-av']);
export const madonnaAvAdapter = createJpAvCatalogAdapter(SITE_CONFIGS['madonna-av']);
export const dahliaAvAdapter = createJpAvCatalogAdapter(SITE_CONFIGS['dahlia-av']);
export const sodAdapter = createJpAvCatalogAdapter(SITE_CONFIGS.sod);
export const s1Adapter = createJpAvCatalogAdapter(SITE_CONFIGS.s1);
export const attackersAdapter = createJpAvCatalogAdapter(SITE_CONFIGS.attackers);
export const tPowersAdapter = createJpAvCatalogAdapter(SITE_CONFIGS['t-powers']);
export const eightManAdapter = createJpAvCatalogAdapter(SITE_CONFIGS['8man']);
export const dogmaAdapter = createJpAvCatalogAdapter(SITE_CONFIGS.dogma);
export const kmProduceAdapter = createJpAvCatalogAdapter(SITE_CONFIGS['km-produce']);
export const maxingAdapter = createJpAvCatalogAdapter(SITE_CONFIGS.maxing);

export const JP_AV_CATALOG_SITE_CONFIGS = SITE_CONFIGS;
