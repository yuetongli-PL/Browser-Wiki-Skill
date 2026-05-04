// @ts-check

import {
  normalizeText,
  pushFlag,
} from './common.mjs';

export const siteKey = 'bz888';

function isHttpUrl(value) {
  return /^https?:\/\//iu.test(String(value ?? '').trim());
}

export function buildLegacyCommand(entrypointPath, plan, request = {}, _sessionLease = {}, options = {}, layout) {
  const input = normalizeText(request.input ?? request.url ?? request.inputUrl ?? plan.source?.input);
  const command = request.pythonPath ?? options.pythonPath ?? plan.legacy?.pythonPath ?? 'pypy3';
  const baseUrl = normalizeText(request.siteUrl ?? request.baseUrl ?? plan.source?.canonicalUrl) || 'https://www.bz888888888.com/';
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
  pushFlag(args, '--profile-path', request.profilePath);
  pushFlag(args, '--crawler-scripts-dir', request.crawlerScriptsDir);
  pushFlag(args, '--knowledge-base-dir', request.knowledgeBaseDir);
  pushFlag(args, '--node-executable', request.nodeExecutable ?? options.nodeExecutable);
  return { command, args, executorKind: 'python' };
}

export default Object.freeze({
  siteKey,
  buildLegacyCommand,
});
