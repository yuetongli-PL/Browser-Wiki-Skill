// @ts-check

import { cleanText } from '../../../shared/normalize.mjs';
import { createCatalogAdapter } from './factory.mjs';

const INSTAGRAM_HOSTS = Object.freeze([
  'www.instagram.com',
  'instagram.com',
]);

export const INSTAGRAM_TERMINOLOGY = Object.freeze({
  entityLabel: 'post',
  entityPlural: 'posts',
  personLabel: 'profile',
  personPlural: 'profiles',
  searchLabel: 'search Instagram',
  openEntityLabel: 'open post',
  openPersonLabel: 'open profile',
  downloadLabel: 'download post',
  verifiedTaskLabel: 'post / reel / profile',
});

const INTENT_LABELS = Object.freeze({
  'search-content': 'search Instagram',
  'search-book': 'search Instagram',
  'open-post': 'open post',
  'open-book': 'open post',
  'open-reel': 'open reel',
  'open-profile': 'open profile',
  'open-author': 'open profile',
  'open-category': 'open explore page',
  'open-utility-page': 'open utility page',
  'open-auth-page': 'open login page',
  'download-book': 'download post media',
  'profile-content': 'list profile posts',
  'list-profile-content': 'list profile posts',
  'list-author-posts': 'list profile posts',
  'list-author-media': 'list profile media',
  'list-author-highlights': 'list profile highlights',
  'list-author-following': 'list profile following',
  'list-profile-following': 'list profile following',
  'list-followed-users': 'list followed profiles',
  'list-followed-updates': 'list followed profile posts',
  'account-info': 'get profile information',
});

function isReservedRootSegment(segment) {
  return [
    'about',
    'accounts',
    'api',
    'challenge',
    'direct',
    'explore',
    'graphql',
    'legal',
    'p',
    'privacy',
    'reel',
    'reels',
    'stories',
    'tv',
    'web',
  ].includes(segment);
}

function inferInstagramPageType({ pathname = '' } = {}) {
  const normalizedPath = String(pathname || '/').trim().replace(/\/+$/u, '').toLowerCase() || '/';
  if (normalizedPath === '/') {
    return 'home';
  }
  if (
    normalizedPath.startsWith('/accounts/login')
    || normalizedPath.startsWith('/accounts/emailsignup')
    || normalizedPath.startsWith('/accounts/password')
    || normalizedPath.startsWith('/challenge')
  ) {
    return 'auth-page';
  }
  if (normalizedPath === '/explore/search' || normalizedPath.startsWith('/explore/search/')) {
    return 'search-results-page';
  }
  if (
    normalizedPath === '/explore'
    || normalizedPath.startsWith('/explore/')
    || normalizedPath === '/popular'
    || normalizedPath.startsWith('/reels')
  ) {
    return 'category-page';
  }
  if (normalizedPath.startsWith('/web/')) {
    return 'unknown-page';
  }
  if (
    normalizedPath.startsWith('/p/')
    || normalizedPath.startsWith('/reel/')
    || normalizedPath.startsWith('/tv/')
  ) {
    return 'book-detail-page';
  }
  if (normalizedPath.startsWith('/direct')) {
    return 'author-list-page';
  }
  if (/^\/[^/]+\/(?:following|followers)(?:\/|$)/u.test(normalizedPath)) {
    return 'author-list-page';
  }
  if (/^\/[^/]+\/(?:reels|tagged|saved)(?:\/|$)/u.test(normalizedPath)) {
    return 'author-page';
  }

  const firstSegment = normalizedPath.split('/').filter(Boolean)[0] ?? '';
  if (firstSegment && !isReservedRootSegment(firstSegment)) {
    return 'author-page';
  }
  return null;
}

export const instagramAdapter = createCatalogAdapter({
  id: 'instagram',
  hosts: INSTAGRAM_HOSTS,
  terminology: INSTAGRAM_TERMINOLOGY,
  intentLabels: INTENT_LABELS,
  inferPageType: inferInstagramPageType,
  normalizeDisplayLabel: ({ value }) => cleanText(value),
});
