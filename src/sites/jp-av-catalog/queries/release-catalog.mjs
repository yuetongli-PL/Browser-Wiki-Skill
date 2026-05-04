// @ts-check

import { normalizeUrlNoFragment, normalizeWhitespace } from '../../../shared/normalize.mjs';

const DEFAULT_START_DATE = '2026-01-01';
const DEFAULT_END_DATE = '2026-05-04';

const DATE_FAMILY_SITES = Object.freeze([
  { siteKey: 'moodyz', siteName: 'MOODYZ', baseUrl: 'https://moodyz.com' },
  { siteKey: 's1', siteName: 'S1', baseUrl: 'https://s1s1s1.com' },
  { siteKey: 'attackers', siteName: 'ATTACKERS', baseUrl: 'https://attackers.net' },
  { siteKey: 'madonna-av', siteName: 'Madonna', baseUrl: 'https://madonna-av.com' },
  { siteKey: 'rookie-av', siteName: 'ROOKIE', baseUrl: 'https://rookie-av.jp' },
]);

const SKIPPED_RELEASE_SITES = Object.freeze([
  {
    siteKey: '8man',
    siteName: '8MAN',
    url: 'https://www.8man.jp/',
    status: 'skipped',
    reasonCode: 'no_release_catalog',
    reason: 'Official scope is public profile/list metadata; no work-release catalog compatible with this release table is registered.',
  },
  {
    siteKey: 'sod',
    siteName: 'SOD',
    url: 'https://www.sod.co.jp/',
    status: 'blocked',
    reasonCode: 'entry_unreachable_or_504',
    reason: 'Official entry is tracked as a blocked/unverified release source until a stable same-host public catalog URL is verified.',
  },
  {
    siteKey: 'dogma',
    siteName: 'DOGMA',
    url: 'https://www.dogma.co.jp/',
    status: 'blocked',
    reasonCode: 'age_or_entry_boundary',
    reason: 'Official entry has an age/entry boundary; no bypass or unpromoted traversal is used for release aggregation.',
  },
]);

function pad2(value) {
  return String(value).padStart(2, '0');
}

function assertIsoDate(value, label) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(value ?? ''))) {
    throw new Error(`${label} must be YYYY-MM-DD.`);
  }
}

function inRange(date, { startDate, endDate }) {
  return Boolean(date && date >= startDate && date <= endDate);
}

function decodeHtmlEntities(value) {
  return String(value ?? '')
    .replace(/&nbsp;/gu, ' ')
    .replace(/&amp;/gu, '&')
    .replace(/&quot;/gu, '"')
    .replace(/&#039;/gu, "'")
    .replace(/&#39;/gu, "'")
    .replace(/&#x([0-9a-f]+);/giu, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&lt;/gu, '<')
    .replace(/&gt;/gu, '>');
}

function stripTags(value) {
  return normalizeWhitespace(decodeHtmlEntities(String(value ?? '')
    .replace(/<script\b[\s\S]*?<\/script>/giu, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/giu, ' ')
    .replace(/<[^>]+>/gu, ' ')));
}

function normalizeField(value) {
  const text = stripTags(value);
  return text || 'not_visible';
}

function attrValue(tag, name) {
  const match = String(tag ?? '').match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'iu'));
  return match ? decodeHtmlEntities(match[1]) : '';
}

function absoluteUrl(baseUrl, href) {
  try {
    const parsed = new URL(decodeHtmlEntities(href), baseUrl);
    parsed.hash = '';
    parsed.search = '';
    return parsed.toString();
  } catch {
    return null;
  }
}

function allHrefs(html) {
  return [...String(html ?? '').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/giu)].map((match) => match[1]);
}

function blockMatches(html, regex) {
  return [...String(html ?? '').matchAll(regex)].map((match) => match[0] ?? match[1]).filter(Boolean);
}

function firstTagText(html, tagName, classToken = '') {
  const classPart = classToken ? `[^>]*class=["'][^"']*${classToken}[^"']*["'][^>]*` : '[^>]*';
  const match = String(html ?? '').match(new RegExp(`<${tagName}${classPart}>([\\s\\S]*?)<\\/${tagName}>`, 'iu'));
  return stripTags(match?.[1] ?? '');
}

function firstMetaContent(html, property) {
  const tag = String(html ?? '').match(new RegExp(`<meta\\b[^>]*(?:property|name)=["']${property}["'][^>]*>`, 'iu'))?.[0];
  return tag ? normalizeWhitespace(decodeHtmlEntities(attrValue(tag, 'content'))) : '';
}

function fieldByDt(html, label) {
  const re = new RegExp(`<dt[^>]*>\\s*${escapeRegex(label)}\\s*<\\/dt>\\s*<dd[^>]*>([\\s\\S]*?)<\\/dd>`, 'iu');
  return stripTags(String(html ?? '').match(re)?.[1] ?? '');
}

function fieldBySpanList(html, label) {
  const re = new RegExp(`<li[^>]*>[\\s\\S]*?<span[^>]*>\\s*${escapeRegex(label)}\\s*<\\/span>([\\s\\S]*?)<\\/li>`, 'iu');
  return stripTags(String(html ?? '').match(re)?.[1] ?? '');
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

export function toIsoDate(value) {
  const text = String(value ?? '');
  const patterns = [
    /(\d{4})[-/年](\d{1,2})[-/月](\d{1,2})日?/u,
    /(\d{4})\.(\d{1,2})\.(\d{1,2})/u,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      return `${match[1]}-${pad2(match[2])}-${pad2(match[3])}`;
    }
  }
  return null;
}

function monthsBetween(startDate, endDate) {
  const months = [];
  let year = Number.parseInt(startDate.slice(0, 4), 10);
  let month = Number.parseInt(startDate.slice(5, 7), 10);
  const endYear = Number.parseInt(endDate.slice(0, 4), 10);
  const endMonth = Number.parseInt(endDate.slice(5, 7), 10);
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push({ year, month });
    month += 1;
    if (month > 12) {
      year += 1;
      month = 1;
    }
  }
  return months;
}

function normalizeCodeFromSlug(value) {
  const slug = String(value ?? '').replace(/\/+$/u, '').split('/').at(-1) ?? '';
  const compact = slug.toUpperCase();
  const match = compact.match(/^([A-Z]+)(\d+)$/u);
  return match ? `${match[1]}-${match[2]}` : compact || 'not_visible';
}

function codeFromExternalHref(href) {
  const text = String(href ?? '');
  const sku = text.match(/[?&]skuId=([A-Z0-9-]+)/iu);
  if (sku) {
    return sku[1].toUpperCase();
  }
  const cid =
    text.match(/cid=([^/?&#]+)/iu)
    ?? text.match(/product_detail\/([^/?&#]+)/iu)
    ?? text.match(/[?&]id=([^&#]+)/iu);
  return cid ? normalizeCodeFromSlug(cid[1].replace(/^1|^125/iu, '')) : 'not_visible';
}

function buildWork({
  siteKey,
  siteName,
  title,
  workId,
  actors = 'not_visible',
  tagsOrGenres = 'not_visible',
  releaseDate,
  canonicalUrl,
  sourceUrl,
  availabilityOrStatus = 'published',
  notes = [],
} = {}) {
  return {
    siteKey,
    siteName,
    title: normalizeField(title),
    workId: normalizeField(workId),
    actors: normalizeField(actors),
    tagsOrGenres: normalizeField(tagsOrGenres),
    releaseDate,
    canonicalUrl: normalizeUrlNoFragment(canonicalUrl) ?? canonicalUrl,
    sourceUrl: normalizeUrlNoFragment(sourceUrl) ?? sourceUrl,
    availabilityOrStatus,
    notes,
  };
}

export function buildDateFamilyDateListUrl(site, date) {
  return `${site.baseUrl}/works/list/date/${date}`;
}

export function parseDateFamilyDateIndexHtml(html, { startDate, endDate } = {}) {
  assertIsoDate(startDate, 'startDate');
  assertIsoDate(endDate, 'endDate');
  return [...new Set([...String(html ?? '').matchAll(/\d{4}[-/年]\d{1,2}[-/月]\d{1,2}日?/gu)]
    .map((match) => toIsoDate(match[0]))
    .filter((date) => inRange(date, { startDate, endDate })))].sort();
}

export function parseDateFamilyListHtml(html, { site, sourceUrl } = {}) {
  const detailRe = /href=["']([^"']+\/works\/detail\/[^"'#?]+)["'][^>]*>([\s\S]*?)<\/a>/giu;
  const rows = [];
  const date = toIsoDate(sourceUrl);
  for (const match of String(html ?? '').matchAll(detailRe)) {
    const canonicalUrl = absoluteUrl(site.baseUrl, match[1]);
    if (!canonicalUrl) {
      continue;
    }
    const title = firstTagText(match[2], 'p', 'text') || stripTags(match[2]);
    rows.push({
      title,
      workId: normalizeCodeFromSlug(canonicalUrl),
      releaseDate: date,
      canonicalUrl,
      sourceUrl,
    });
  }
  return rows;
}

export function parseDateFamilyDetailHtml(html, { site, url, fallback = {} } = {}) {
  const title =
    firstTagText(html, 'h1')
    || firstTagText(html, 'h2', 'p-workPage__title')
    || firstMetaContent(html, 'og:title')
    || fallback.title;
  const releaseDate = toIsoDate(fieldByDt(html, '発売日') || fieldByDt(html, 'releaseDate')) ?? fallback.releaseDate;
  return buildWork({
    siteKey: site.siteKey,
    siteName: site.siteName,
    title,
    workId: fieldByDt(html, '品番') || fallback.workId || normalizeCodeFromSlug(url),
    actors: fieldByDt(html, '女優') || fieldByDt(html, '出演女優') || fieldByDt(html, '出演者') || 'not_visible',
    tagsOrGenres: fieldByDt(html, 'ジャンル') || 'not_visible',
    releaseDate,
    canonicalUrl: url,
    sourceUrl: fallback.sourceUrl ?? url,
  });
}

export function parseDahliaListHtml(html, { baseUrl = 'https://dahlia-av.jp' } = {}) {
  const detailUrls = allHrefs(html)
    .map((href) => absoluteUrl(baseUrl, href))
    .filter((url) => /^https:\/\/(?:www\.)?dahlia-av\.jp\/works\/[^/]+\/?$/iu.test(String(url)));
  const nextPageUrls = allHrefs(html)
    .map((href) => absoluteUrl(baseUrl, href))
    .filter((url) => /^https:\/\/(?:www\.)?dahlia-av\.jp\/work\/page\/\d+\/?$/iu.test(String(url)));
  return {
    detailUrls: [...new Set(detailUrls)],
    nextPageUrls: [...new Set(nextPageUrls)],
  };
}

export function parseDahliaDetailHtml(html, { url, range } = {}) {
  const distributionDate = toIsoDate(fieldBySpanList(html, '配信開始日'));
  const saleDate = toIsoDate(fieldBySpanList(html, '発売日')) ?? toIsoDate(String(html ?? '').match(/\d{4}\/\d{1,2}\/\d{1,2}\s*発売開始/u)?.[0]);
  const releaseDate = inRange(distributionDate, range) ? distributionDate : saleDate;
  if (!inRange(releaseDate, range)) {
    return null;
  }
  return buildWork({
    siteKey: 'dahlia-av',
    siteName: 'DAHLIA',
    title: firstTagText(html, 'h1') || firstMetaContent(html, 'og:title'),
    workId: fieldBySpanList(html, '品番') || normalizeCodeFromSlug(url),
    actors: fieldBySpanList(html, '出演女優') || fieldBySpanList(html, '出演者') || 'not_visible',
    tagsOrGenres: fieldBySpanList(html, 'ジャンル') || 'not_visible',
    releaseDate,
    canonicalUrl: url,
    sourceUrl: url,
  });
}

export function parseTPowersReleaseHomeHtml(html, { startDate, endDate, baseUrl = 'https://www.t-powers.co.jp' } = {}) {
  const range = { startDate, endDate };
  return [...new Set(allHrefs(html)
    .map((href) => absoluteUrl(baseUrl, href))
    .filter((url) => {
      const match = String(url ?? '').match(/\/release\/(\d{4})\/(\d{2})\/?$/u);
      if (!match) {
        return false;
      }
      return `${match[1]}-${match[2]}-31` >= startDate && `${match[1]}-${match[2]}-01` <= endDate;
    }))].filter((url) => inRange(`${url.match(/\/release\/(\d{4})\/(\d{2})\/?$/u)?.[1]}-${url.match(/\/release\/(\d{4})\/(\d{2})\/?$/u)?.[2]}-01`, range)
      || `${url.match(/\/release\/(\d{4})\/(\d{2})\/?$/u)?.[1]}-${url.match(/\/release\/(\d{4})\/(\d{2})\/?$/u)?.[2]}-31` >= startDate);
}

export function parseTPowersReleaseMonthHtml(html, { sourceUrl, range } = {}) {
  const works = [];
  for (const article of blockMatches(html, /<article[^>]*class=["'][^"']*p-release__list-item[^"']*["'][^>]*>[\s\S]*?<\/article>/giu)) {
    const releaseDate = toIsoDate(stripTags(article.match(/発売日：\s*([^<]+)/u)?.[1] ?? ''));
    if (!inRange(releaseDate, range)) {
      continue;
    }
    const maker = stripTags(article.match(/メーカー名：\s*([^<]+)/u)?.[1] ?? '');
    const href = attrValue(article.match(/<a\b[^>]*href=["'][^"']+["'][^>]*>/iu)?.[0] ?? '', 'href');
    works.push(buildWork({
      siteKey: 't-powers',
      siteName: 'T-Powers',
      title: firstTagText(article, 'h3', 'p-release__list-item-title'),
      workId: codeFromExternalHref(href),
      actors: 'not_visible',
      tagsOrGenres: maker ? `メーカー名:${maker}` : 'not_visible',
      releaseDate,
      canonicalUrl: sourceUrl,
      sourceUrl,
    }));
  }
  return works;
}

export function buildKMProduceArchiveUrls({ startDate, endDate, baseUrl = 'https://www.km-produce.com' } = {}) {
  return [
    `${baseUrl}/works`,
    ...monthsBetween(startDate, endDate).map(({ year, month }) => `${baseUrl}/works?archive=${encodeURIComponent(`${year}年${month}月`)}`),
  ];
}

export function parseKMProduceListHtml(html, { sourceUrl, range, baseUrl = 'https://www.km-produce.com' } = {}) {
  const candidates = [];
  for (const article of blockMatches(html, /<article\b[\s\S]*?<\/article>/giu)) {
    const releaseDate = toIsoDate(fieldByDt(article, '発売日')) ?? toIsoDate(article);
    if (!inRange(releaseDate, range)) {
      continue;
    }
    const detailUrl = allHrefs(article)
      .map((href) => absoluteUrl(baseUrl, href))
      .find((url) => /^https:\/\/www\.km-produce\.com\/works\/[^/?#]+$/iu.test(String(url)));
    if (!detailUrl) {
      continue;
    }
    candidates.push({
      detailUrl,
      releaseDate,
      title: normalizeField(attrValue(article.match(/<img\b[^>]*>/iu)?.[0] ?? '', 'alt') || firstTagText(article, 'h3')),
      tagsOrGenres: normalizeField(firstTagText(article, 'p', 'label')),
      sourceUrl,
    });
  }
  return candidates;
}

export function parseKMProduceDetailHtml(html, { url, fallback = {}, range } = {}) {
  const releaseDate = toIsoDate(fieldByDt(html, '発売日')) ?? fallback.releaseDate;
  if (!inRange(releaseDate, range)) {
    return null;
  }
  return buildWork({
    siteKey: 'km-produce',
    siteName: 'KM Produce',
    title: firstTagText(html, 'h1') || fallback.title,
    workId: fieldByDt(html, '品番') || normalizeCodeFromSlug(url),
    actors: fieldByDt(html, '出演女優') || fieldByDt(html, '出演') || 'not_visible',
    tagsOrGenres: fieldByDt(html, 'ジャンル') || fallback.tagsOrGenres || 'not_visible',
    releaseDate,
    canonicalUrl: url,
    sourceUrl: fallback.sourceUrl ?? url,
  });
}

export function parseMaxingListHtml(html, { baseUrl = 'https://www.maxing.jp' } = {}) {
  const source = blockMatches(html, /<td[^>]*class=["'][^"']*proTd[^"']*["'][^>]*>[\s\S]*?<\/td>/giu).join('\n') || html;
  return [...new Set(allHrefs(source)
    .map((href) => absoluteUrl(baseUrl, href))
    .filter((url) => /^https:\/\/www\.maxing\.jp\/shop\/pid\/\d+\.html$/iu.test(String(url))))];
}

export function parseMaxingDetailHtml(html, { url, range } = {}) {
  const releaseDate = toIsoDate(fieldByDt(html, '発売日'));
  if (!inRange(releaseDate, range)) {
    return null;
  }
  const label = fieldByDt(html, 'レーベル');
  const genre = fieldByDt(html, 'ジャンル');
  return buildWork({
    siteKey: 'maxing',
    siteName: 'MAXING',
    title: firstTagText(html, 'h2', 'pdetail') || firstMetaContent(html, 'og:title'),
    workId: fieldByDt(html, '品番') || normalizeCodeFromSlug(url),
    actors: fieldByDt(html, '女優') || fieldByDt(html, '出演女優') || 'not_visible',
    tagsOrGenres: genre || (label ? `レーベル:${label}` : 'not_visible'),
    releaseDate,
    canonicalUrl: url,
    sourceUrl: url,
  });
}

async function mapLimit(items, concurrency, mapper) {
  const values = [...items];
  const results = new Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;
      results[currentIndex] = await mapper(values[currentIndex], currentIndex);
    }
  }

  const workerCount = Math.min(Math.max(Number(concurrency) || 1, 1), values.length || 1);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function pushFailure(failures, site, url, reasonCode, error) {
  failures.push({
    siteKey: site.siteKey,
    siteName: site.siteName,
    url,
    reasonCode,
    error: error instanceof Error ? error.message : String(error ?? ''),
  });
}

async function fetchText(fetchHtml, url, options = {}) {
  return fetchHtml(url, options);
}

async function collectDateFamilySite({ site, range, fetchHtml, concurrency, failures }) {
  const dateIndexUrl = `${site.baseUrl}/works/date`;
  const indexHtml = await fetchText(fetchHtml, dateIndexUrl);
  const dates = parseDateFamilyDateIndexHtml(indexHtml, range);
  const listResults = await mapLimit(dates.map((date) => buildDateFamilyDateListUrl(site, date)), concurrency, async (url) => {
    try {
      const html = await fetchText(fetchHtml, url);
      return parseDateFamilyListHtml(html, { site, sourceUrl: url });
    } catch (error) {
      pushFailure(failures, site, url, 'list_fetch_failed', error);
      return [];
    }
  });
  const candidates = listResults.flat();
  const works = await mapLimit(candidates, concurrency, async (candidate) => {
    try {
      const html = await fetchText(fetchHtml, candidate.canonicalUrl);
      return parseDateFamilyDetailHtml(html, {
        site,
        url: candidate.canonicalUrl,
        fallback: candidate,
      });
    } catch (error) {
      pushFailure(failures, site, candidate.canonicalUrl, 'detail_fetch_failed', error);
      return null;
    }
  });
  return works.filter(Boolean);
}

async function collectDahlia({ range, fetchHtml, concurrency, maxPages, failures }) {
  const site = { siteKey: 'dahlia-av', siteName: 'DAHLIA', baseUrl: 'https://dahlia-av.jp' };
  const pageQueue = [`${site.baseUrl}/work/`];
  const seenPages = new Set(pageQueue);
  const detailUrls = new Set();
  for (let index = 0; index < pageQueue.length && index < maxPages; index += 1) {
    const url = pageQueue[index];
    try {
      const html = await fetchText(fetchHtml, url);
      const parsed = parseDahliaListHtml(html, { baseUrl: site.baseUrl });
      parsed.detailUrls.forEach((detailUrl) => detailUrls.add(detailUrl));
      for (const nextPageUrl of parsed.nextPageUrls) {
        if (!seenPages.has(nextPageUrl)) {
          seenPages.add(nextPageUrl);
          pageQueue.push(nextPageUrl);
        }
      }
    } catch (error) {
      pushFailure(failures, site, url, 'list_fetch_failed', error);
    }
  }
  const works = await mapLimit([...detailUrls], concurrency, async (url) => {
    try {
      const html = await fetchText(fetchHtml, url);
      return parseDahliaDetailHtml(html, { url, range });
    } catch (error) {
      pushFailure(failures, site, url, 'detail_fetch_failed', error);
      return null;
    }
  });
  return works.filter(Boolean);
}

async function collectTPowers({ range, fetchHtml, failures }) {
  const site = { siteKey: 't-powers', siteName: 'T-Powers', baseUrl: 'https://www.t-powers.co.jp' };
  const releaseHomeUrl = `${site.baseUrl}/release/`;
  let monthUrls = [];
  try {
    const html = await fetchText(fetchHtml, releaseHomeUrl);
    monthUrls = parseTPowersReleaseHomeHtml(html, { ...range, baseUrl: site.baseUrl });
  } catch (error) {
    pushFailure(failures, site, releaseHomeUrl, 'release_home_fetch_failed', error);
  }
  const works = [];
  for (const url of monthUrls) {
    try {
      const html = await fetchText(fetchHtml, url);
      works.push(...parseTPowersReleaseMonthHtml(html, { sourceUrl: url, range }));
    } catch (error) {
      pushFailure(failures, site, url, 'release_month_fetch_failed', error);
    }
  }
  return works;
}

async function collectKMProduce({ range, fetchHtml, concurrency, failures }) {
  const site = { siteKey: 'km-produce', siteName: 'KM Produce', baseUrl: 'https://www.km-produce.com' };
  const candidates = new Map();
  for (const url of buildKMProduceArchiveUrls({ ...range, baseUrl: site.baseUrl })) {
    try {
      const html = await fetchText(fetchHtml, url);
      for (const candidate of parseKMProduceListHtml(html, { sourceUrl: url, range, baseUrl: site.baseUrl })) {
        candidates.set(candidate.detailUrl, candidate);
      }
    } catch (error) {
      pushFailure(failures, site, url, 'list_fetch_failed', error);
    }
  }
  const works = await mapLimit([...candidates.values()], concurrency, async (candidate) => {
    try {
      const html = await fetchText(fetchHtml, candidate.detailUrl);
      return parseKMProduceDetailHtml(html, {
        url: candidate.detailUrl,
        fallback: candidate,
        range,
      });
    } catch (error) {
      pushFailure(failures, site, candidate.detailUrl, 'detail_fetch_failed', error);
      return null;
    }
  });
  return works.filter(Boolean);
}

async function collectMaxing({ range, fetchHtml, concurrency, failures }) {
  const site = { siteKey: 'maxing', siteName: 'MAXING', baseUrl: 'https://www.maxing.jp' };
  const listUrls = [
    `${site.baseUrl}/shop/now_release.html`,
    `${site.baseUrl}/shop/search.html`,
    `${site.baseUrl}/top/`,
  ];
  const detailUrls = new Set();
  for (const url of listUrls) {
    try {
      const html = await fetchText(fetchHtml, url, { encoding: 'euc-jp' });
      parseMaxingListHtml(html, { baseUrl: site.baseUrl }).forEach((detailUrl) => detailUrls.add(detailUrl));
    } catch (error) {
      pushFailure(failures, site, url, 'list_fetch_failed', error);
    }
  }
  const works = await mapLimit([...detailUrls], concurrency, async (url) => {
    try {
      const html = await fetchText(fetchHtml, url, { encoding: 'euc-jp' });
      return parseMaxingDetailHtml(html, { url, range });
    } catch (error) {
      pushFailure(failures, site, url, 'detail_fetch_failed', error);
      return null;
    }
  });
  return works.filter(Boolean);
}

function dedupeWorks(works) {
  return [...new Map(works.map((work) => [
    `${work.siteKey}|${work.canonicalUrl}|${work.workId}|${work.title}`,
    work,
  ])).values()];
}

function coverageRecord(site, works, adapter, status = 'ok', extra = {}) {
  return {
    siteKey: site.siteKey,
    siteName: site.siteName,
    status,
    count: works.length,
    adapter,
    ...extra,
  };
}

export async function collectJpAvReleaseCatalog({
  startDate = DEFAULT_START_DATE,
  endDate = DEFAULT_END_DATE,
  fetchHtml,
  concurrency = 6,
  maxPages = 80,
} = {}) {
  assertIsoDate(startDate, 'startDate');
  assertIsoDate(endDate, 'endDate');
  if (endDate < startDate) {
    throw new Error('endDate must be greater than or equal to startDate.');
  }
  if (typeof fetchHtml !== 'function') {
    throw new Error('collectJpAvReleaseCatalog requires fetchHtml(url, options).');
  }

  const range = { startDate, endDate };
  const failures = [];
  const coverage = {};
  const collected = [];

  for (const site of DATE_FAMILY_SITES) {
    try {
      const works = await collectDateFamilySite({ site, range, fetchHtml, concurrency, failures });
      collected.push(...works);
      coverage[site.siteKey] = coverageRecord(site, works, 'works_date');
    } catch (error) {
      pushFailure(failures, site, `${site.baseUrl}/works/date`, 'works_date_failed', error);
      coverage[site.siteKey] = coverageRecord(site, [], 'works_date', 'failed');
    }
  }

  const siteCollectors = [
    {
      site: { siteKey: 'dahlia-av', siteName: 'DAHLIA' },
      adapter: 'dahlia_work_paged',
      collect: () => collectDahlia({ range, fetchHtml, concurrency, maxPages, failures }),
    },
    {
      site: { siteKey: 't-powers', siteName: 'T-Powers' },
      adapter: 'tpowers_release_month',
      collect: () => collectTPowers({ range, fetchHtml, failures }),
    },
    {
      site: { siteKey: 'km-produce', siteName: 'KM Produce' },
      adapter: 'kmproduce_archive_work_detail',
      collect: () => collectKMProduce({ range, fetchHtml, concurrency, failures }),
    },
    {
      site: { siteKey: 'maxing', siteName: 'MAXING' },
      adapter: 'maxing_shop_recent_eucjp',
      collect: () => collectMaxing({ range, fetchHtml, concurrency, failures }),
      partial: true,
    },
  ];

  for (const item of siteCollectors) {
    try {
      const works = await item.collect();
      collected.push(...works);
      coverage[item.site.siteKey] = coverageRecord(
        item.site,
        works,
        item.adapter,
        item.partial ? 'partial' : 'ok',
        item.partial
          ? { note: 'Readable public recent shop/list entries only; no complete year archive is registered.' }
          : {},
      );
    } catch (error) {
      pushFailure(failures, item.site, item.site.siteKey, `${item.adapter}_failed`, error);
      coverage[item.site.siteKey] = coverageRecord(item.site, [], item.adapter, 'failed');
    }
  }

  for (const skipped of SKIPPED_RELEASE_SITES) {
    failures.push({
      siteKey: skipped.siteKey,
      siteName: skipped.siteName,
      url: skipped.url,
      reasonCode: skipped.reasonCode,
      error: skipped.reason,
    });
    coverage[skipped.siteKey] = {
      siteKey: skipped.siteKey,
      siteName: skipped.siteName,
      status: skipped.status,
      count: 0,
      adapter: skipped.reasonCode,
      note: skipped.reason,
    };
  }

  const works = dedupeWorks(collected)
    .sort((left, right) => (
      String(right.releaseDate ?? '').localeCompare(String(left.releaseDate ?? ''), 'en')
      || String(left.siteName).localeCompare(String(right.siteName), 'en')
      || String(left.workId).localeCompare(String(right.workId), 'en')
    ));
  const bySite = {};
  for (const work of works) {
    bySite[work.siteName] = (bySite[work.siteName] ?? 0) + 1;
  }

  return {
    schemaVersion: 'jp-av-release-catalog/v1',
    startDate,
    endDate,
    total: works.length,
    bySite,
    works,
    coverage,
    failures,
    generatedAt: new Date().toISOString(),
  };
}

export const JP_AV_RELEASE_CATALOG_EXPECTED_OUTPUT_SITES = Object.freeze([
  ...DATE_FAMILY_SITES.map((site) => site.siteKey),
  'dahlia-av',
  't-powers',
  'km-produce',
  'maxing',
]);
