// @ts-check

import { cleanText } from '../../../shared/normalize.mjs';
import { createCatalogAdapter } from './factory.mjs';

const X_HOSTS = Object.freeze([
  'x.com',
  'www.x.com',
]);

export const X_TERMINOLOGY = Object.freeze({
  entityLabel: 'post',
  entityPlural: 'posts',
  personLabel: 'account',
  personPlural: 'accounts',
  searchLabel: 'search posts',
  openEntityLabel: 'open post',
  openPersonLabel: 'open account profile',
  downloadLabel: 'download post',
  verifiedTaskLabel: 'post / account / timeline',
});

const INTENT_LABELS = Object.freeze({
  'search-post': 'search posts',
  'search-posts': 'search posts',
  'search-content': 'search posts',
  'search-book': 'search posts',
  'open-post': 'open post',
  'open-book': 'open post',
  'open-author': 'open account profile',
  'open-profile': 'open account profile',
  'open-category': 'open explore page',
  'open-utility-page': 'open utility page',
  'open-auth-page': 'open login page',
  'download-book': 'download post media',
  'profile-content': 'list account posts',
  'list-profile-content': 'list account posts',
  'list-author-posts': 'list account posts',
  'list-author-replies': 'list account replies',
  'list-author-media': 'list account media',
  'list-author-highlights': 'list account highlights',
  'list-author-following': 'list account following',
  'list-profile-following': 'list account following',
  'list-followed-users': 'list followed accounts',
  'list-followed-updates': 'list followed account posts',
  'account-info': 'get account information',
});

function isReservedRootSegment(segment) {
  return [
    'compose',
    'explore',
    'home',
    'i',
    'jobs',
    'login',
    'messages',
    'notifications',
    'search',
    'settings',
    'signup',
  ].includes(segment);
}

function inferXPageType({ pathname = '' } = {}) {
  const normalizedPath = String(pathname || '/').trim().replace(/\/+$/u, '').toLowerCase() || '/';
  if (normalizedPath === '/home' || normalizedPath === '/') {
    return 'home';
  }
  if (normalizedPath === '/search' || normalizedPath.startsWith('/search/')) {
    return 'search-results-page';
  }
  if (normalizedPath === '/explore' || normalizedPath.startsWith('/explore/')) {
    return 'category-page';
  }
  if (
    normalizedPath === '/i/flow/login'
    || normalizedPath === '/login'
    || normalizedPath === '/signup'
    || normalizedPath.startsWith('/i/flow/signup')
  ) {
    return 'auth-page';
  }
  if (
    normalizedPath === '/notifications'
    || normalizedPath === '/messages'
    || normalizedPath === '/i/bookmarks'
    || normalizedPath.startsWith('/settings')
  ) {
    return 'author-list-page';
  }
  if (normalizedPath.startsWith('/i/status/')) {
    return 'book-detail-page';
  }
  if (/^\/[^/]+\/status\/\d+(?:\/|$)/u.test(normalizedPath)) {
    return 'book-detail-page';
  }
  if (/^\/[^/]+\/(?:following|followers)(?:\/|$)/u.test(normalizedPath)) {
    return 'author-list-page';
  }
  if (/^\/[^/]+\/(?:with_replies|media|highlights)(?:\/|$)/u.test(normalizedPath)) {
    return 'author-page';
  }

  const firstSegment = normalizedPath.split('/').filter(Boolean)[0] ?? '';
  if (firstSegment && !isReservedRootSegment(firstSegment)) {
    return 'author-page';
  }
  return null;
}

export const xAdapter = createCatalogAdapter({
  id: 'x',
  hosts: X_HOSTS,
  terminology: X_TERMINOLOGY,
  intentLabels: INTENT_LABELS,
  inferPageType: inferXPageType,
  normalizeDisplayLabel: ({ value }) => cleanText(value),
});
