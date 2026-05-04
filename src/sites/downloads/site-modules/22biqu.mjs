// @ts-check

import path from 'node:path';
import { access, readFile } from 'node:fs/promises';

import {
  normalizeDownloadResourceConsumerHeaders,
  normalizeDownloadResource,
  normalizeResolvedDownloadTask,
  normalizeSessionLeaseConsumerHeaders,
} from '../contracts.mjs';
import {
  isHttpUrl,
  normalizeText,
  pushFlag,
  resolveLegacyProfileFlagMaterial,
} from './common.mjs';

export const siteKey = '22biqu';

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfExists(filePath) {
  if (!filePath || !await pathExists(filePath)) {
    return null;
  }
  return JSON.parse(await readFile(filePath, 'utf8'));
}

function isObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value);
}

function toArray(value) {
  return Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
}

function firstText(...values) {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function absoluteUrl(value, baseUrl) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return '';
  }
  try {
    return new URL(normalized, baseUrl).toString();
  } catch {
    return '';
  }
}

function decodeHtmlEntities(value) {
  return String(value ?? '')
    .replace(/&#(\d+);/gu, (_, code) => {
      try {
        return String.fromCodePoint(Number(code));
      } catch {
        return _;
      }
    })
    .replace(/&#x([0-9a-f]+);/giu, (_, code) => {
      try {
        return String.fromCodePoint(Number.parseInt(code, 16));
      } catch {
        return _;
      }
    })
    .replace(/&nbsp;/giu, ' ')
    .replace(/&quot;/giu, '"')
    .replace(/&#39;/giu, '\'')
    .replace(/&apos;/giu, '\'')
    .replace(/&lt;/giu, '<')
    .replace(/&gt;/giu, '>')
    .replace(/&amp;/giu, '&');
}

function stripHtml(value) {
  return normalizeText(
    decodeHtmlEntities(
      String(value ?? '')
        .replace(/<script[\s\S]*?<\/script>/giu, ' ')
        .replace(/<style[\s\S]*?<\/style>/giu, ' ')
        .replace(/<br\s*\/?>/giu, '\n')
        .replace(/<\/(?:p|div|dd|dt|li|h[1-6])>/giu, '\n')
        .replace(/<[^>]+>/gu, ' '),
    ),
  );
}

function attributeValue(attributes, name) {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, 'iu');
  return decodeHtmlEntities(attributes.match(pattern)?.[2] ?? '');
}

function extractMetaContent(html, names = []) {
  const targets = new Set(toArray(names).map((name) => normalizeText(name).toLowerCase()).filter(Boolean));
  if (targets.size === 0) {
    return '';
  }
  const pattern = /<meta\b([^>]*)>/giu;
  let match = pattern.exec(html);
  while (match) {
    const attrs = match[1] ?? '';
    const metaName = normalizeText(attributeValue(attrs, 'property') || attributeValue(attrs, 'name')).toLowerCase();
    if (targets.has(metaName)) {
      const content = normalizeText(attributeValue(attrs, 'content'));
      if (content) {
        return content;
      }
    }
    match = pattern.exec(html);
  }
  return '';
}

function extractFirstTextByRegex(html, regexes = []) {
  for (const regex of regexes) {
    const match = html.match(regex);
    const text = stripHtml(match?.[1] ?? '');
    if (text) {
      return text;
    }
  }
  return '';
}

function extractTitle(html) {
  return extractFirstTextByRegex(html, [/<title[^>]*>([\s\S]*?)<\/title>/iu]);
}

function extractAnchors(html, baseUrl) {
  const anchors = [];
  const pattern = /<a\b([^>]*?)href\s*=\s*(["'])(.*?)\2([^>]*)>([\s\S]*?)<\/a>/giu;
  let match = pattern.exec(html);
  while (match) {
    const href = normalizeUrlNoFragment(absoluteUrl(match[3], baseUrl));
    const text = stripHtml(match[5]);
    if (href && text) {
      anchors.push({
        href,
        text,
        attrs: `${match[1] ?? ''} ${match[4] ?? ''}`,
      });
    }
    match = pattern.exec(html);
  }
  return anchors;
}

function normalizeUrlNoFragment(value, baseUrl = undefined) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return '';
  }
  try {
    const parsed = new URL(normalized, baseUrl);
    parsed.hash = '';
    return parsed.toString();
  } catch {
    return normalized.split('#')[0];
  }
}

function fileNameForChapter(chapter, index) {
  const title = normalizeText(
    chapter.title
      ?? chapter.chapterTitle
      ?? chapter.name
      ?? chapter.label
      ?? `chapter-${String(index + 1).padStart(3, '0')}`,
  );
  const prefix = String(index + 1).padStart(4, '0');
  return `${prefix}-${title}.txt`;
}

function is22BiquBookDirectoryUrl(value) {
  try {
    return /\/biqu\d+\/?$/iu.test(new URL(value).pathname);
  } catch {
    return /\/biqu\d+\/?$/iu.test(normalizeText(value));
  }
}

function is22BiquChapterUrl(value) {
  try {
    return /\/biqu\d+\/\d+(?:_\d+)?\.html$/iu.test(new URL(value).pathname);
  } catch {
    return /\/biqu\d+\/\d+(?:_\d+)?\.html$/iu.test(normalizeText(value));
  }
}

function bookPathFromUrl(value) {
  try {
    return new URL(value).pathname.match(/\/biqu\d+\//iu)?.[0] ?? '';
  } catch {
    return normalizeText(value).match(/\/biqu\d+\//iu)?.[0] ?? '';
  }
}

function chapterNumericId(value) {
  try {
    const match = new URL(value).pathname.match(/\/(\d+)(?:_\d+)?\.html$/iu);
    const parsed = Number(match?.[1]);
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    const match = normalizeText(value).match(/\/(\d+)(?:_\d+)?\.html$/iu);
    const parsed = Number(match?.[1]);
    return Number.isFinite(parsed) ? parsed : null;
  }
}

function titleChapterNumber(value) {
  const match = normalizeText(value).match(/(?:第\s*)?(\d+)\s*(?:章|节|回)?/iu);
  const parsed = Number(match?.[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

function sortDirectoryChapters(chapters = []) {
  return chapters
    .map((chapter, originalIndex) => ({ chapter, originalIndex }))
    .sort((left, right) => {
      const leftUrlId = chapterNumericId(left.chapter.href);
      const rightUrlId = chapterNumericId(right.chapter.href);
      if (leftUrlId !== null && rightUrlId !== null && leftUrlId !== rightUrlId) {
        return leftUrlId - rightUrlId;
      }
      const leftTitleId = titleChapterNumber(left.chapter.title);
      const rightTitleId = titleChapterNumber(right.chapter.title);
      if (leftTitleId !== null && rightTitleId !== null && leftTitleId !== rightTitleId) {
        return leftTitleId - rightTitleId;
      }
      return left.originalIndex - right.originalIndex;
    })
    .map((entry) => entry.chapter);
}

function shouldSkipDirectoryAnchorText(value) {
  const normalized = normalizeText(value).toLowerCase();
  return [
    '上一章',
    '下一章',
    '返回目录',
    '加入书签',
    '章节报错',
    '投推荐票',
    '上一页',
    '下一页',
  ].includes(normalized);
}

function parseDirectoryChaptersFromHtml(html, baseUrl) {
  const bookPath = bookPathFromUrl(baseUrl);
  const seen = new Set();
  const chapters = [];
  for (const anchor of extractAnchors(html, baseUrl)) {
    if (!is22BiquChapterUrl(anchor.href)) {
      continue;
    }
    if (bookPath && !new URL(anchor.href).pathname.includes(bookPath)) {
      continue;
    }
    if (shouldSkipDirectoryAnchorText(anchor.text)) {
      continue;
    }
    const href = normalizeUrlNoFragment(anchor.href);
    if (!href || seen.has(href)) {
      continue;
    }
    seen.add(href);
    chapters.push({
      href,
      title: anchor.text,
    });
  }
  return sortDirectoryChapters(chapters)
    .map((chapter, index) => ({
      ...chapter,
      chapterIndex: index + 1,
    }));
}

function parseDirectoryBookFromHtml(html, finalUrl, source = 'directory-html') {
  const normalizedHtml = String(html ?? '');
  const finalUrlValue = normalizeUrlNoFragment(finalUrl);
  const metaBookUrl = extractMetaContent(normalizedHtml, ['og:novel:read_url', 'og:url']);
  const bookUrlValue = is22BiquBookDirectoryUrl(finalUrlValue)
    ? finalUrlValue
    : normalizeUrlNoFragment(firstText(metaBookUrl, finalUrlValue));
  if (!normalizedHtml.trim() || !bookUrlValue) {
    return null;
  }
  const chapters = parseDirectoryChaptersFromHtml(normalizedHtml, bookUrlValue);
  if (chapters.length === 0) {
    return null;
  }
  const title = firstText(
    extractMetaContent(normalizedHtml, ['og:novel:book_name']),
    extractFirstTextByRegex(normalizedHtml, [
      /<h1[^>]*>([\s\S]*?)<\/h1>/iu,
      /<h2[^>]*>([\s\S]*?)<\/h2>/iu,
    ]),
    extractTitle(normalizedHtml).replace(/[（(].*$/u, ''),
    bookUrlValue,
  );
  return {
    chapters,
    book: {
      title,
      url: bookUrlValue,
      id: bookPathFromUrl(bookUrlValue).replace(/\W+/gu, '-').replace(/^-|-$/gu, ''),
      source,
    },
    directory: {
      source,
      chapterCount: chapters.length,
    },
  };
}

function requestDryRun(request, plan) {
  return Boolean(request.dryRun ?? plan.policy?.dryRun);
}

function chapterEntriesFromRequest(request = {}) {
  return [
    ...toArray(request.chapters),
    ...toArray(request.chapterUrls).map((url) => ({ url })),
    ...toArray(request.book?.chapters),
    ...(request.chapterUrl ? [{ url: request.chapterUrl }] : []),
  ];
}

function fixtureDirCandidates(request = {}, context = {}) {
  const nested = request.bookContent && typeof request.bookContent === 'object' ? request.bookContent : {};
  return [
    request.bookContentDir,
    request.bookContentRoot,
    request.fixtureBookContentDir,
    request.mockBookContentDir,
    request.fixtureDir,
    request.mockDir,
    nested.dir,
    nested.root,
    context.bookContentDir,
    context.bookContentRoot,
    context.fixtureBookContentDir,
    context.mockBookContentDir,
    context.fixtureDir,
    context.mockDir,
  ].map((value) => normalizeText(value)).filter(Boolean);
}

function stringValue(value) {
  return typeof value === 'string' && value.trim() ? value : '';
}

function directoryNestedInputs(request = {}, context = {}) {
  return [
    isObject(request.directory) ? request.directory : {},
    isObject(request.fixture) ? request.fixture : {},
    isObject(request.mock) ? request.mock : {},
    isObject(request.bookDirectory) ? request.bookDirectory : {},
    isObject(context.directory) ? context.directory : {},
    isObject(context.fixture) ? context.fixture : {},
    isObject(context.mock) ? context.mock : {},
    isObject(context.bookDirectory) ? context.bookDirectory : {},
  ];
}

function directoryHtmlStringCandidates(request = {}, context = {}) {
  const nested = directoryNestedInputs(request, context);
  return [
    request.html,
    request.htmlString,
    request.rawHtml,
    request.pageHtml,
    request.sourceHtml,
    request.fixtureHtml,
    request.fixtureHtmlString,
    request.mockHtml,
    request.responseHtml,
    request.directoryHtml,
    request.directoryHtmlString,
    request.bookHtml,
    request.bookDirectoryHtml,
    request.bookDirectoryHtmlString,
    context.html,
    context.htmlString,
    context.rawHtml,
    context.pageHtml,
    context.sourceHtml,
    context.fixtureHtml,
    context.fixtureHtmlString,
    context.mockHtml,
    context.responseHtml,
    context.directoryHtml,
    context.directoryHtmlString,
    context.bookHtml,
    context.bookDirectoryHtml,
    context.bookDirectoryHtmlString,
    ...nested.flatMap((entry) => [
      entry.html,
      entry.htmlString,
      entry.rawHtml,
      entry.pageHtml,
      entry.sourceHtml,
      entry.fixtureHtml,
      entry.fixtureHtmlString,
      entry.directoryHtml,
      entry.directoryHtmlString,
      entry.bookHtml,
      entry.bookDirectoryHtml,
      entry.bookDirectoryHtmlString,
    ]),
  ].map((value) => stringValue(value)).filter(Boolean);
}

function directoryHtmlPathCandidates(request = {}, context = {}) {
  const nested = directoryNestedInputs(request, context);
  return [
    request.fixtureHtml,
    request.directoryHtml,
    request.bookDirectoryHtml,
    request.htmlPath,
    request.htmlFile,
    request.htmlFilePath,
    request.fixtureHtmlPath,
    request.fixtureHtmlFile,
    request.fixtureHtmlFilePath,
    request.mockHtmlPath,
    request.mockHtmlFile,
    request.directoryHtmlPath,
    request.directoryHtmlFile,
    request.bookHtmlPath,
    request.bookHtmlFile,
    request.bookDirectoryHtmlPath,
    request.bookDirectoryHtmlFile,
    context.fixtureHtml,
    context.directoryHtml,
    context.bookDirectoryHtml,
    context.htmlPath,
    context.htmlFile,
    context.htmlFilePath,
    context.fixtureHtmlPath,
    context.fixtureHtmlFile,
    context.fixtureHtmlFilePath,
    context.mockHtmlPath,
    context.mockHtmlFile,
    context.directoryHtmlPath,
    context.directoryHtmlFile,
    context.bookHtmlPath,
    context.bookHtmlFile,
    context.bookDirectoryHtmlPath,
    context.bookDirectoryHtmlFile,
    ...nested.flatMap((entry) => [
      entry.fixtureHtml,
      entry.directoryHtml,
      entry.bookDirectoryHtml,
      entry.htmlPath,
      entry.htmlFile,
      entry.htmlFilePath,
      entry.fixtureHtmlPath,
      entry.fixtureHtmlFile,
      entry.fixtureHtmlFilePath,
      entry.directoryHtmlPath,
      entry.directoryHtmlFile,
      entry.bookHtmlPath,
      entry.bookHtmlFile,
    ]),
  ].map((value) => normalizeText(value)).filter(Boolean);
}

function resolveDirectoryHtmlPath(value, request = {}, context = {}) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return '';
  }
  if (path.isAbsolute(normalized)) {
    return normalized;
  }
  const baseDir = firstText(request.workspaceRoot, context.workspaceRoot, request.cwd, context.cwd, '.');
  return path.resolve(baseDir, normalized);
}

function resolveFixturePath(value, baseDir) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return '';
  }
  return path.isAbsolute(normalized) ? normalized : path.resolve(baseDir, normalized);
}

async function bookContentRootsFromCandidate(candidate) {
  const root = path.resolve(candidate);
  const sources = await readJsonIfExists(path.join(root, 'index', 'sources.json'));
  const sourceRoots = [];
  for (const source of toArray(sources?.activeSources)) {
    if (source?.step === 'step-book-content' && source.rawDir) {
      sourceRoots.push(path.resolve(root, source.rawDir));
    }
  }
  return [...sourceRoots, root];
}

async function loadBookContentFixture(root) {
  const manifest = await readJsonIfExists(path.join(root, 'book-content-manifest.json'));
  const booksPath = resolveFixturePath(manifest?.files?.books ?? 'books.json', root);
  const books = await readJsonIfExists(booksPath);
  if (Array.isArray(books)) {
    return { root, books };
  }

  const book = await readJsonIfExists(path.join(root, 'book.json'));
  if (isObject(book)) {
    return { root, books: [book] };
  }

  const chapters = await readJsonIfExists(path.join(root, 'chapters.json'));
  if (Array.isArray(chapters)) {
    return {
      root,
      books: [{
        title: manifest?.title,
        finalUrl: manifest?.finalUrl ?? manifest?.baseUrl ?? manifest?.inputUrl,
        chapters,
      }],
    };
  }

  return null;
}

async function loadBookContentFixtures(request = {}, context = {}) {
  const fixtures = [];
  const seen = new Set();
  for (const candidate of fixtureDirCandidates(request, context)) {
    for (const root of await bookContentRootsFromCandidate(candidate)) {
      const key = path.resolve(root).toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      const fixture = await loadBookContentFixture(root);
      if (fixture) {
        fixtures.push(fixture);
      }
    }
  }
  return fixtures;
}

function requestedBookUrl(request = {}, plan = {}) {
  return normalizeUrlNoFragment(firstText(
    request.bookUrl,
    request.url,
    request.inputUrl,
    isHttpUrl(request.input) ? request.input : '',
    plan.source?.canonicalUrl,
    isHttpUrl(plan.source?.input) ? plan.source?.input : '',
  ));
}

function requestedBookTitle(request = {}, plan = {}) {
  return firstText(
    request.bookTitle,
    request.title,
    !isHttpUrl(request.input) ? request.input : '',
    plan.source?.title,
    !isHttpUrl(plan.source?.input) ? plan.source?.input : '',
  );
}

function bookUrl(book = {}) {
  return normalizeUrlNoFragment(firstText(
    book.finalUrl,
    book.bookUrl,
    book.url,
    book.canonicalUrl,
    book.sourceUrl,
  ));
}

function bookTitle(book = {}) {
  return firstText(book.title, book.bookTitle, book.name);
}

function titlesMatch(left, right) {
  const leftText = normalizeText(left).toLowerCase();
  const rightText = normalizeText(right).toLowerCase();
  return Boolean(leftText && rightText && (
    leftText === rightText
    || leftText.includes(rightText)
    || rightText.includes(leftText)
  ));
}

function bookMatchesRequest(book, request, plan) {
  const targetUrl = requestedBookUrl(request, plan);
  const targetTitle = requestedBookTitle(request, plan);
  const candidateUrl = bookUrl(book);
  const candidateTitle = bookTitle(book);
  if (targetUrl && candidateUrl && targetUrl === candidateUrl) {
    return true;
  }
  return titlesMatch(candidateTitle, targetTitle);
}

async function loadChaptersForBook(book, root) {
  const inlineChapters = chapterEntriesFromRequest({ chapters: book.chapters, chapterUrls: book.chapterUrls });
  if (inlineChapters.length > 0) {
    return inlineChapters;
  }

  const chaptersFile = firstText(book.chaptersFile, book.chapterFile, book.chaptersPath);
  if (!chaptersFile) {
    return [];
  }
  const chaptersPath = resolveFixturePath(chaptersFile, root);
  const chapters = await readJsonIfExists(chaptersPath);
  return Array.isArray(chapters) ? chapters : [];
}

async function loadDirectoryHtmlChaptersForBook(book, root, request, plan) {
  const inlineHtml = stringValue(firstText(book.directoryHtml, book.bookDirectoryHtml, book.html, book.rawHtml));
  const htmlFile = firstText(
    book.directoryHtmlFile,
    book.directoryHtmlPath,
    book.bookDirectoryHtmlFile,
    book.bookDirectoryHtmlPath,
    book.htmlFile,
    book.htmlPath,
  );
  const finalUrl = bookUrl(book) || requestedBookUrl(request, plan);
  if (!finalUrl) {
    return null;
  }
  if (inlineHtml) {
    return parseDirectoryBookFromHtml(inlineHtml, finalUrl, 'book-content-directory-html');
  }
  if (!htmlFile) {
    return null;
  }
  try {
    const htmlPath = resolveFixturePath(htmlFile, root);
    return parseDirectoryBookFromHtml(await readFile(htmlPath, 'utf8'), finalUrl, 'book-content-directory-html');
  } catch {
    return null;
  }
}

function chapterOrderValue(chapter = {}) {
  const value = chapter.chapterIndex ?? chapter.index ?? chapter.order ?? chapter.sequence;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function stableChapterEntries(chapters = []) {
  return chapters
    .map((chapter, originalIndex) => ({ chapter, originalIndex }))
    .sort((left, right) => {
      const leftOrder = chapterOrderValue(isObject(left.chapter) ? left.chapter : {});
      const rightOrder = chapterOrderValue(isObject(right.chapter) ? right.chapter : {});
      if (leftOrder !== null && rightOrder !== null && leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }
      if (leftOrder !== null && rightOrder === null) {
        return -1;
      }
      if (leftOrder === null && rightOrder !== null) {
        return 1;
      }
      return left.originalIndex - right.originalIndex;
    })
    .map((entry) => entry.chapter);
}

async function chapterEntriesFromFixtures(request, plan, context) {
  if (!requestDryRun(request, plan)) {
    return null;
  }

  for (const fixture of await loadBookContentFixtures(request, context)) {
    const book = fixture.books.find((entry) => bookMatchesRequest(entry, request, plan));
    if (!book) {
      continue;
    }
    const chapters = stableChapterEntries(await loadChaptersForBook(book, fixture.root));
    if (chapters.length > 0) {
      return {
        chapters,
        book: {
          title: bookTitle(book),
          url: bookUrl(book),
          id: firstText(book.bookId, book.id),
          source: firstText(book.source, 'book-content-fixture'),
        },
      };
    }

    const directoryHtml = await loadDirectoryHtmlChaptersForBook(book, fixture.root, request, plan);
    if (directoryHtml?.chapters?.length > 0) {
      return {
        chapters: directoryHtml.chapters,
        book: {
          title: firstText(bookTitle(book), directoryHtml.book?.title),
          url: firstText(bookUrl(book), directoryHtml.book?.url),
          id: firstText(book.bookId, book.id, directoryHtml.book?.id),
          source: firstText(book.source, directoryHtml.book?.source, 'book-content-directory-html'),
        },
      };
    }
  }
  return null;
}

async function directoryHtmlPayloadsFromFixtures(request = {}, plan = {}, context = {}) {
  const finalUrl = requestedBookUrl(request, plan);
  const payloads = directoryHtmlStringCandidates(request, context)
    .map((html) => ({
      html,
      finalUrl,
      source: 'fixture-html-string',
    }));
  const seenPaths = new Set();
  for (const candidate of directoryHtmlPathCandidates(request, context)) {
    const filePath = resolveDirectoryHtmlPath(candidate, request, context);
    const key = path.resolve(filePath).toLowerCase();
    if (!filePath || seenPaths.has(key) || !await pathExists(filePath)) {
      continue;
    }
    seenPaths.add(key);
    try {
      payloads.push({
        html: await readFile(filePath, 'utf8'),
        finalUrl,
        source: 'fixture-html-file',
        filePath,
      });
    } catch {
      continue;
    }
  }
  return payloads;
}

function injectedFetchImpl(request = {}, context = {}) {
  for (const candidate of [
    request.fetchImpl,
    request.mockFetchImpl,
    context.fetchImpl,
    context.mockFetchImpl,
    context.deps?.fetchImpl,
    context.deps?.mockFetchImpl,
    context.options?.fetchImpl,
    context.options?.mockFetchImpl,
  ]) {
    if (typeof candidate === 'function') {
      return candidate;
    }
  }
  return null;
}

function directoryFetchImpl(request = {}, context = {}) {
  const fetchImpl = injectedFetchImpl(request, context);
  if (fetchImpl) {
    return {
      fetchImpl,
      source: 'fetchImpl',
    };
  }
  if (context.allowNetworkResolve === true && typeof globalThis.fetch === 'function') {
    return {
      fetchImpl: globalThis.fetch,
      source: 'network-fetch',
    };
  }
  return null;
}

async function responseToText(response) {
  if (typeof response === 'string') {
    return response;
  }
  if (!response || response.ok === false) {
    return '';
  }
  if (typeof response.text === 'function') {
    return await response.text();
  }
  return stringValue(response.body) || stringValue(response.data);
}

async function directoryHtmlPayloadFromFetch(request = {}, plan = {}, context = {}, sessionLease = null) {
  const fetchState = directoryFetchImpl(request, context);
  const finalUrl = requestedBookUrl(request, plan);
  if (!fetchState || !finalUrl || !is22BiquBookDirectoryUrl(finalUrl)) {
    return null;
  }
  try {
    const response = await fetchState.fetchImpl(finalUrl, {
      method: 'GET',
      headers: {
        ...normalizeSessionLeaseConsumerHeaders(sessionLease),
        ...normalizeDownloadResourceConsumerHeaders(request.headers),
      },
      redirect: 'follow',
    });
    const html = await responseToText(response);
    if (!stringValue(html)) {
      return null;
    }
    return {
      html,
      finalUrl: normalizeUrlNoFragment(firstText(response?.url, finalUrl)),
      source: fetchState.source,
    };
  } catch {
    return null;
  }
}

async function chapterEntriesFromDirectoryHtml(request, plan, context, sessionLease) {
  for (const payload of await directoryHtmlPayloadsFromFixtures(request, plan, context)) {
    const parsed = parseDirectoryBookFromHtml(payload.html, payload.finalUrl, payload.source);
    if (parsed) {
      parsed.directory.filePath = payload.filePath || undefined;
      return parsed;
    }
  }

  const fetchedPayload = await directoryHtmlPayloadFromFetch(request, plan, context, sessionLease);
  if (fetchedPayload) {
    return parseDirectoryBookFromHtml(fetchedPayload.html, fetchedPayload.finalUrl, fetchedPayload.source);
  }
  return null;
}

function withDirectoryMetadata(resolved, directory) {
  const metadata = {
    ...resolved.metadata,
    resolver: {
      ...(resolved.metadata?.resolver ?? {}),
      method: 'native-22biqu-directory',
    },
    directory: {
      source: directory?.source,
      filePath: directory?.filePath,
      chapterCount: directory?.chapterCount,
    },
  };
  delete metadata.bookContent;
  return {
    ...resolved,
    metadata,
    completeness: {
      ...resolved.completeness,
      reason: resolved.metadata?.boundedByMaxItems
        ? '22biqu-chapters-bounded-by-max-items'
        : '22biqu-directory-provided',
    },
  };
}

export function create22BiquChapterResourceSeed({
  plan,
  request = {},
  sessionLease = null,
  chapter: rawChapter,
  index = 0,
  details = {},
  baseUrl = '',
  bookUrl = '',
  sourceTitle = '',
} = {}) {
  const chapter = typeof rawChapter === 'string' ? { url: rawChapter } : rawChapter;
  if (!isObject(chapter)) {
    return null;
  }
  const url = absoluteUrl(chapter.url ?? chapter.chapterUrl ?? chapter.href ?? chapter.canonicalUrl, baseUrl);
  if (!url) {
    return null;
  }
  return {
    id: normalizeText(chapter.id) || undefined,
    url,
    headers: normalizeSessionLeaseConsumerHeaders(sessionLease),
    fileName: chapter.fileName ?? fileNameForChapter(chapter, index),
    mediaType: 'text',
    sourceUrl: chapter.sourceUrl ?? bookUrl,
    referer: chapter.referer ?? bookUrl,
    priority: chapter.priority ?? index,
    groupId: request.bookId ?? request.title ?? plan?.source?.title ?? plan?.id,
    metadata: {
      siteResolver: siteKey,
      chapterIndex: chapter.chapterIndex ?? chapter.index ?? index + 1,
      title: normalizeText(chapter.title ?? chapter.chapterTitle ?? chapter.name) || undefined,
      bookTitle: sourceTitle || undefined,
    },
  };
}

function resolveChapterResources(plan, sessionLease, context, chapterEntries, details = {}) {
  const request = context.request ?? {};
  if (chapterEntries.length === 0) {
    return null;
  }
  const maxItems = Number(plan.policy?.maxItems ?? request.maxItems ?? 0);
  const boundedChapterEntries = Number.isFinite(maxItems) && maxItems > 0
    ? chapterEntries.slice(0, maxItems)
    : chapterEntries;

  const baseUrl = normalizeText(
    details.book?.url
      ?? request.bookUrl
      ?? request.siteUrl
      ?? request.baseUrl
      ?? request.input
      ?? request.url
      ?? request.inputUrl
      ?? plan.source?.canonicalUrl
      ?? plan.source?.input
      ?? 'https://www.22biqu.com/',
  );
  const bookUrl = normalizeText(details.book?.url ?? request.bookUrl ?? plan.source?.canonicalUrl ?? plan.source?.input);
  const sourceTitle = normalizeText(details.book?.title ?? request.title ?? request.bookTitle ?? plan.source?.title);
  const resources = boundedChapterEntries
    .map((entry, index) => {
      const resource = create22BiquChapterResourceSeed({
        plan,
        request,
        sessionLease,
        chapter: entry,
        index,
        details,
        baseUrl,
        bookUrl,
        sourceTitle,
      });
      return resource ? normalizeDownloadResource(resource, index) : null;
    })
    .filter(Boolean);

  if (resources.length === 0) {
    return null;
  }

  return normalizeResolvedDownloadTask({
    planId: plan.id,
    siteKey: plan.siteKey,
    taskType: plan.taskType,
    resources,
    metadata: {
      resolver: {
        ...(plan.resolver ?? {}),
        method: 'native-22biqu-chapters',
      },
      legacy: plan.legacy,
      bookContent: details.book ? {
        source: details.book.source,
        bookId: details.book.id || undefined,
      } : undefined,
      boundedByMaxItems: boundedChapterEntries.length < chapterEntries.length
        ? {
          maxItems,
          fullChapterCount: chapterEntries.length,
        }
        : undefined,
    },
    completeness: {
      expectedCount: chapterEntries.length,
      resolvedCount: resources.length,
      complete: resources.length === chapterEntries.length,
      reason: boundedChapterEntries.length < chapterEntries.length
        ? '22biqu-chapters-bounded-by-max-items'
        : resources.length === chapterEntries.length
        ? '22biqu-chapters-provided'
        : '22biqu-chapter-data-incomplete',
    },
  }, plan);
}

export async function resolveResources(plan, sessionLease = null, context = {}) {
  const request = context.request ?? {};
  const chapterEntries = chapterEntriesFromRequest(request);
  if (chapterEntries.length > 0) {
    return resolveChapterResources(plan, sessionLease, context, chapterEntries);
  }

  const fixtureChapters = await chapterEntriesFromFixtures(request, plan, context);
  if (fixtureChapters) {
    const resolved = resolveChapterResources(plan, sessionLease, context, fixtureChapters.chapters, fixtureChapters);
    if (resolved) {
      return {
        ...resolved,
        metadata: {
          ...resolved.metadata,
          resolver: {
            ...(resolved.metadata?.resolver ?? {}),
            method: 'native-22biqu-book-content',
          },
        },
        completeness: {
          ...resolved.completeness,
          reason: resolved.metadata?.boundedByMaxItems
            ? '22biqu-chapters-bounded-by-max-items'
            : '22biqu-book-content-provided',
        },
      };
    }
  }

  const directoryChapters = await chapterEntriesFromDirectoryHtml(request, plan, context, sessionLease);
  if (directoryChapters) {
    const resolved = resolveChapterResources(plan, sessionLease, context, directoryChapters.chapters, directoryChapters);
    if (resolved) {
      return withDirectoryMetadata(resolved, directoryChapters.directory);
    }
  }

  return null;
}

export function buildLegacyCommand(entrypointPath, plan, request = {}, sessionLease = {}, options = {}, layout) {
  const input = normalizeText(request.input ?? request.url ?? request.inputUrl ?? plan.source?.input);
  const command = request.pythonPath ?? options.pythonPath ?? plan.legacy?.pythonPath ?? 'python';
  const baseUrl = normalizeText(request.siteUrl ?? request.baseUrl ?? plan.source?.canonicalUrl) || 'https://www.22biqu.com/';
  const args = [entrypointPath, baseUrl, '--out-dir', layout.runDir];
  if (isHttpUrl(input)) {
    args.push('--book-url', input);
  } else if (input) {
    args.push('--book-title', input);
  }
  if (request.metadataOnly) {
    args.push('--metadata-only');
  }
  if (request.forceRecrawl) {
    args.push('--force-recrawl');
  }
  const legacyProfileMaterial = resolveLegacyProfileFlagMaterial(request, sessionLease);
  if (legacyProfileMaterial.allowed) {
    pushFlag(args, '--profile-path', legacyProfileMaterial.profilePath);
  }
  pushFlag(args, '--crawler-scripts-dir', request.crawlerScriptsDir);
  pushFlag(args, '--knowledge-base-dir', request.knowledgeBaseDir);
  pushFlag(args, '--node-executable', request.nodeExecutable ?? options.nodeExecutable);
  return { command, args, executorKind: 'python' };
}

export default Object.freeze({
  siteKey,
  resolveResources,
  buildLegacyCommand,
});
