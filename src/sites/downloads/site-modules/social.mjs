// @ts-check

import {
  addCommonProfileFlags,
  addLoginFlags,
  isHttpUrl,
  normalizeText,
  pushFlag,
} from './common.mjs';

export const siteKeys = Object.freeze(['x', 'instagram']);

function firstText(...values) {
  for (const value of values) {
    const normalized = normalizeText(value);
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function normalizeActionToken(value) {
  return normalizeText(value).toLowerCase().replace(/_/gu, '-');
}

function isTrue(value) {
  return value === true || value === 'true' || value === '1' || value === 'yes' || value === 'on';
}

function actionNeedsQuery(action) {
  return ['search', 'followed-posts-by-date'].includes(normalizeActionToken(action));
}

function relationActionFromRequest(request = {}) {
  const relation = normalizeActionToken(firstText(
    request.relation,
    request.relationType,
    request.socialRelation,
    request.followType,
  ));
  if (['followers', 'profile-followers', 'follower'].includes(relation) || isTrue(request.followers)) {
    return 'profile-followers';
  }
  if (['following', 'profile-following', 'followings'].includes(relation) || isTrue(request.following)) {
    return 'profile-following';
  }
  if (['followed-users', 'followed', 'current-following'].includes(relation) || isTrue(request.followedUsers)) {
    return 'followed-users';
  }
  return '';
}

function hasDateWindow(request = {}) {
  return Boolean(firstText(request.date, request.fromDate, request.from, request.toDate, request.to));
}

function queryFromSocialInput(plan, request = {}) {
  const explicit = firstText(
    request.query,
    request.keyword,
    request.q,
    request.searchQuery,
    request.search,
  );
  if (explicit && explicit !== 'true') {
    return explicit;
  }
  const input = firstText(request.input, request.url, request.inputUrl, plan.source?.input);
  if (!input) {
    return '';
  }
  if (!isHttpUrl(input)) {
    return input;
  }
  try {
    const parsed = new URL(input);
    return firstText(
      parsed.searchParams.get('q'),
      parsed.searchParams.get('query'),
      parsed.searchParams.get('keyword'),
    );
  } catch {
    return '';
  }
}

function hasExplicitSearchIntent(plan, request = {}) {
  if (isTrue(request.search)) {
    return true;
  }
  const explicit = firstText(request.query, request.keyword, request.q, request.searchQuery);
  if (explicit) {
    return true;
  }
  const input = firstText(request.input, request.url, request.inputUrl, plan.source?.input);
  if (!isHttpUrl(input)) {
    return false;
  }
  try {
    const parsed = new URL(input);
    return parsed.pathname.split('/').filter(Boolean)[0]?.toLowerCase() === 'search'
      || parsed.searchParams.has('q')
      || parsed.searchParams.has('query')
      || parsed.searchParams.has('keyword');
  } catch {
    return false;
  }
}

export function accountFromSocialInput(plan, request = {}) {
  const explicit = firstText(
    request.account,
    request.handle,
    request.user,
    request.profile,
    request.target,
    plan.source?.account,
  );
  if (explicit) {
    return explicit;
  }
  const input = firstText(request.input, request.url, request.inputUrl, plan.source?.input);
  if (!isHttpUrl(input)) {
    return input;
  }
  try {
    const parsed = new URL(input);
    const segment = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
    if (!segment || ['home', 'explore', 'search', 'notifications'].includes(segment.toLowerCase())) {
      return '';
    }
    return segment.replace(/^@/u, '');
  } catch {
    return input;
  }
}

export function inferSocialAction(plan, request = {}) {
  const explicit = normalizeActionToken(firstText(
    request.action,
    request.socialAction,
    request.downloadAction,
  ));
  if (explicit) {
    return explicit;
  }
  const relationAction = relationActionFromRequest(request);
  if (relationAction) {
    return relationAction;
  }
  if (
    isTrue(request.followedPostsByDate)
    || isTrue(request.followedUpdates)
    || normalizeActionToken(request.dateMode) === 'followed'
    || (hasDateWindow(request) && !accountFromSocialInput(plan, request) && !queryFromSocialInput(plan, request))
  ) {
    return 'followed-posts-by-date';
  }
  if (hasExplicitSearchIntent(plan, request)) {
    return 'search';
  }
  if (plan.taskType === 'media-bundle') {
    return 'profile-content';
  }
  if (isTrue(request.fullArchive) || isTrue(request.allHistory) || isTrue(request.archive)) {
    return 'full-archive';
  }
  return 'full-archive';
}

function inferSocialContentType(plan, request = {}) {
  const explicit = firstText(request.contentType, request.tab);
  if (explicit) {
    return explicit;
  }
  if (plan.taskType === 'media-bundle' || isTrue(request.mediaOnly)) {
    return 'media';
  }
  return '';
}

export function buildLegacyArgs(entrypointPath, plan, request = {}, sessionLease = {}, options = {}, layout) {
  const action = inferSocialAction(plan, request);
  const query = actionNeedsQuery(action) ? queryFromSocialInput(plan, request) : '';
  const account = actionNeedsQuery(action) ? '' : accountFromSocialInput(plan, request);
  const contentType = inferSocialContentType(plan, request);
  const args = [entrypointPath, action];
  if (account) {
    args.push(account);
  }
  addCommonProfileFlags(args, request, sessionLease);
  addLoginFlags(args, request, options, plan.siteKey);
  pushFlag(args, '--out-dir', request.outDir);
  pushFlag(args, '--run-dir', layout.runDir);
  pushFlag(args, '--max-items', request.maxItems ?? plan.policy?.maxItems);
  pushFlag(args, '--max-scrolls', request.maxScrolls);
  pushFlag(args, '--max-api-pages', request.maxApiPages);
  pushFlag(args, '--max-users', request.maxUsers);
  pushFlag(args, '--max-detail-pages', request.maxDetailPages);
  pushFlag(args, '--per-user-max-items', request.perUserMaxItems);
  pushFlag(args, '--date', request.date);
  pushFlag(args, '--from', request.fromDate ?? request.from);
  pushFlag(args, '--to', request.toDate ?? request.to);
  pushFlag(args, '--query', query);
  pushFlag(args, '--content-type', contentType);
  if (request.downloadMedia || request.download === true || plan.taskType === 'media-bundle') {
    args.push('--download-media');
  }
  pushFlag(args, '--max-media-downloads', request.maxMediaDownloads);
  pushFlag(args, '--media-download-concurrency', request.mediaDownloadConcurrency ?? plan.policy?.concurrency);
  pushFlag(args, '--media-download-retries', request.mediaDownloadRetries ?? plan.policy?.retries);
  pushFlag(args, '--media-download-backoff-ms', request.mediaDownloadBackoffMs ?? plan.policy?.retryBackoffMs);
  if (request.skipExistingDownloads === false) {
    args.push('--no-skip-existing-downloads');
  } else if (request.skipExistingDownloads === true || plan.policy?.skipExisting) {
    args.push('--skip-existing-downloads');
  }
  if (request.apiCursor === false) {
    args.push('--no-api-cursor');
  } else if (request.apiCursor !== undefined) {
    pushFlag(args, '--api-cursor', request.apiCursor);
  }
  args.push('--format', 'json');
  return args;
}

export function createSocialSiteModule(siteKey) {
  return Object.freeze({
    siteKey,
    buildLegacyArgs,
  });
}
