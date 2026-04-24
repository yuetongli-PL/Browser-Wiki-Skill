// @ts-check

import { cleanText } from '../../../shared/normalize.mjs';
import { createCatalogAdapter } from './factory.mjs';

const XIAOHONGSHU_HOSTS = Object.freeze([
  'www.xiaohongshu.com',
]);

export const XIAOHONGSHU_TERMINOLOGY = Object.freeze({
  entityLabel: '\u7b14\u8bb0',
  entityPlural: '\u7b14\u8bb0',
  personLabel: '\u7528\u6237',
  personPlural: '\u7528\u6237',
  searchLabel: '\u641c\u7d22\u7b14\u8bb0',
  openEntityLabel: '\u6253\u5f00\u7b14\u8bb0',
  openPersonLabel: '\u6253\u5f00\u7528\u6237\u4e3b\u9875',
  downloadLabel: '\u4e0b\u8f7d\u7b14\u8bb0',
  verifiedTaskLabel: '\u7b14\u8bb0 / \u7528\u6237 / \u53d1\u73b0 / \u901a\u77e5',
});

const INTENT_LABELS = Object.freeze({
  'search-video': '\u641c\u7d22\u7b14\u8bb0',
  'search-work': '\u641c\u7d22\u7b14\u8bb0',
  'search-book': '\u641c\u7d22\u7b14\u8bb0',
  'open-video': '\u6253\u5f00\u7b14\u8bb0',
  'open-work': '\u6253\u5f00\u7b14\u8bb0',
  'open-book': '\u6253\u5f00\u7b14\u8bb0',
  'open-up': '\u6253\u5f00\u7528\u6237\u4e3b\u9875',
  'open-author': '\u6253\u5f00\u7528\u6237\u4e3b\u9875',
  'open-actress': '\u6253\u5f00\u7528\u6237\u4e3b\u9875',
  'open-model': '\u6253\u5f00\u7528\u6237\u4e3b\u9875',
  'open-category': '\u6253\u5f00\u53d1\u73b0\u9875',
  'open-utility-page': '\u6253\u5f00\u901a\u77e5\u9875',
  'open-auth-page': '\u6253\u5f00\u767b\u5f55\u9875',
  'download-book': '\u4e0b\u8f7d\u7b14\u8bb0',
  'download-video': '\u4e0b\u8f7d\u7b14\u8bb0',
  'download-work': '\u4e0b\u8f7d\u7b14\u8bb0',
  'list-followed-users': '\u67e5\u8be2\u5173\u6ce8\u7528\u6237\u5217\u8868',
  'list-followed-updates': '\u67e5\u8be2\u5173\u6ce8\u7528\u6237\u6700\u8fd1\u66f4\u65b0',
});

function parseUrl(input) {
  try {
    return input ? new URL(input) : null;
  } catch {
    return null;
  }
}

function stripXiaohongshuSuffix(value) {
  return cleanText(value)
    .replace(/\s*-\s*\u5c0f\u7ea2\u4e66$/u, '')
    .trim();
}

function normalizeXiaohongshuDisplayLabel(rawValue, { url, pageType, queryText } = {}) {
  const parsed = parseUrl(url);
  const pathname = parsed?.pathname ?? '';
  const searchQuery = cleanText(queryText || parsed?.searchParams.get('keyword') || '');
  const stripped = stripXiaohongshuSuffix(rawValue);

  if (pageType === 'home' || pathname === '/explore') {
    return '\u53d1\u73b0';
  }

  if (pageType === 'search-results-page' || pathname === '/search_result') {
    return searchQuery ? `\u641c\u7d22\uff1a${searchQuery}` : (stripped || '\u641c\u7d22\u7ed3\u679c');
  }

  if (pageType === 'author-page' || pathname.startsWith('/user/profile/')) {
    return stripped || '\u7528\u6237\u4e3b\u9875';
  }

  if (pageType === 'book-detail-page' || pathname.startsWith('/explore/')) {
    return stripped || '\u7b14\u8bb0\u8be6\u60c5';
  }

  if (pageType === 'utility-page' || pathname.startsWith('/notification')) {
    return '\u901a\u77e5\u9875';
  }

  if (pathname.startsWith('/livelist')) {
    return '\u76f4\u64ad\u5217\u8868';
  }

  if (pageType === 'auth-page' || pathname === '/login') {
    return '\u767b\u5f55\u9875';
  }

  if (pathname === '/register') {
    return '\u6ce8\u518c\u9875';
  }

  return stripped || null;
}

function inferXiaohongshuPageType({ pathname = '' } = {}) {
  const normalizedPath = cleanText(pathname).replace(/\/+$/u, '') || '/';
  if (normalizedPath === '/website-login/error') {
    return 'auth-page';
  }
  return null;
}

export const xiaohongshuAdapter = createCatalogAdapter({
  id: 'xiaohongshu',
  hosts: XIAOHONGSHU_HOSTS,
  terminology: XIAOHONGSHU_TERMINOLOGY,
  intentLabels: INTENT_LABELS,
  inferPageType: inferXiaohongshuPageType,
  normalizeDisplayLabel({ value, ...options }) {
    return normalizeXiaohongshuDisplayLabel(value, options) ?? cleanText(value);
  },
});
