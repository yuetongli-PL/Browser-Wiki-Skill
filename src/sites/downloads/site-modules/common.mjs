// @ts-check

import path from 'node:path';

import { normalizeText } from '../../../shared/normalize.mjs';
import { normalizeResolvedDownloadTask } from '../contracts.mjs';
import { resolveNativeResourceSeeds, toArray } from '../resource-seeds.mjs';

export { normalizeText, resolveNativeResourceSeeds, toArray };

export function normalizePositiveInteger(value, fallback = null) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

export function isHttpUrl(value) {
  return /^https?:\/\//iu.test(String(value ?? '').trim());
}

export function resolveEntrypoint(entrypoint, workspaceRoot) {
  const normalized = normalizeText(entrypoint);
  if (!normalized) {
    throw new Error('Legacy download plan is missing legacy.entrypoint.');
  }
  return path.isAbsolute(normalized) ? normalized : path.resolve(workspaceRoot, normalized);
}

export function resolveExecutorKind(plan, entrypointPath) {
  const explicit = normalizeText(plan.legacy?.executorKind).toLowerCase();
  if (explicit) {
    return explicit;
  }
  return entrypointPath.endsWith('.mjs') || entrypointPath.endsWith('.js') ? 'node' : 'python';
}

export function legacyItems(plan, request = {}) {
  const items = [
    ...toArray(request.items),
    request.input,
    request.inputUrl,
    request.url,
    request.account,
    plan.source?.input,
  ].map((item) => normalizeText(item)).filter(Boolean);
  return [...new Set(items)];
}

export function pushFlag(args, flag, value) {
  if (value === undefined || value === null || value === '') {
    return;
  }
  args.push(flag, String(value));
}

export function pushBooleanFlag(args, condition, trueFlag, falseFlag = null) {
  if (condition === undefined || condition === null) {
    return;
  }
  if (condition) {
    args.push(trueFlag);
  } else if (falseFlag) {
    args.push(falseFlag);
  }
}

export function resolveReuseLoginState(request = {}, options = {}) {
  if (request.reuseLoginState !== undefined) {
    return request.reuseLoginState !== false;
  }
  if (options.reuseLoginState !== undefined) {
    return options.reuseLoginState !== false;
  }
  return true;
}

export function resolveLegacyProfileFlagMaterial(request = {}, sessionLease = {}) {
  const sessionViewBoundaryPresent = Boolean(request.sessionView ?? sessionLease.sessionView);
  if (sessionViewBoundaryPresent) {
    return {
      allowed: false,
      boundary: 'SessionView',
      reason: 'session-view-boundary-present',
    };
  }
  return {
    allowed: true,
    boundary: 'legacy-no-session-view-only',
    reason: 'legacy-profile-flags-allowed-without-session-view',
    profilePath: request.profilePath,
    browserProfileRoot: request.browserProfileRoot,
    userDataDir: request.userDataDir,
  };
}

export function addCommonProfileFlags(args, request = {}, sessionLease = {}) {
  const legacyProfileMaterial = resolveLegacyProfileFlagMaterial(request, sessionLease);
  if (legacyProfileMaterial.allowed) {
    pushFlag(args, '--profile-path', legacyProfileMaterial.profilePath);
    pushFlag(args, '--browser-profile-root', legacyProfileMaterial.browserProfileRoot);
    pushFlag(args, '--user-data-dir', legacyProfileMaterial.userDataDir);
  }
  pushFlag(args, '--browser-path', request.browserPath);
  pushFlag(args, '--timeout', request.timeoutMs ?? request.timeout);
}

export function addLoginFlags(args, request = {}, options = {}, siteKey) {
  const reuseLoginState = resolveReuseLoginState(request, options);
  pushBooleanFlag(args, reuseLoginState, '--reuse-login-state', '--no-reuse-login-state');
  if (siteKey === 'xiaohongshu') {
    pushBooleanFlag(args, request.autoLogin ?? options.autoLogin, '--auto-login', '--no-auto-login');
  } else {
    pushBooleanFlag(
      args,
      request.allowAutoLoginBootstrap ?? options.allowAutoLoginBootstrap,
      '--auto-login-bootstrap',
      '--no-auto-login-bootstrap',
    );
  }
  if (request.headless === false || options.headless === false) {
    args.push('--no-headless');
  } else if (request.headless === true || options.headless === true) {
    args.push('--headless');
  }
}

export function addDownloadPolicyFlags(args, plan, request = {}) {
  const policy = plan.policy ?? {};
  pushFlag(args, '--concurrency', request.concurrency ?? policy.concurrency);
  const maxItems = normalizePositiveInteger(request.maxItems ?? request.limit ?? policy.maxItems, null);
  if (maxItems) {
    args.push('--max-items', String(maxItems));
  }
  if (request.concurrentFragments) {
    args.push('--concurrent-fragments', String(request.concurrentFragments));
  }
  if (request.maxHeight) {
    args.push('--max-height', String(request.maxHeight));
  }
  if (request.container) {
    args.push('--container', String(request.container));
  }
}

export function buildGenericLegacyArgs(entrypointPath, plan, request = {}, layout) {
  return [entrypointPath, 'download', ...legacyItems(plan, request), '--out-dir', layout.runDir];
}

function normalizeDiagnosticText(value, fallback = '') {
  const text = normalizeText(value);
  if (!text) {
    return fallback;
  }
  return text
    .replace(/(cookie|authorization|bearer|token|session|sid|csrf)[^,\s;)]*/giu, '$1:[REDACTED]')
    .slice(0, 120);
}

export function createNativeMissDiagnostics(siteKey, {
  reason,
  resolution = {},
} = {}) {
  const currentPhase = normalizeDiagnosticText(
    resolution.currentPhase
      ?? resolution.phase
      ?? resolution.sourceType
      ?? resolution.inputKind
      ?? 'native-resolution',
    'native-resolution',
  );
  const phases = toArray(resolution.phases).map((phase) => ({
    phase: normalizeDiagnosticText(phase?.phase ?? phase?.name, currentPhase),
    status: normalizeDiagnosticText(phase?.status, 'attempted'),
    reason: normalizeDiagnosticText(phase?.reason, ''),
  })).filter((phase) => phase.phase);
  if (phases.length === 0) {
    phases.push({
      phase: currentPhase,
      status: 'unresolved',
      reason: normalizeDiagnosticText(reason, `${siteKey}-native-evidence-unavailable`),
    });
  }
  return {
    contractVersion: 'native-miss-diagnostics-v1',
    siteKey,
    primaryReason: normalizeDiagnosticText(reason, `${siteKey}-native-evidence-unavailable`),
    currentPhase,
    phases: phases.slice(0, 8),
  };
}

export function createNativeResolutionMiss(siteKey, plan, {
  method,
  reason,
  expectedCount = 1,
  resolution = {},
} = {}) {
  return normalizeResolvedDownloadTask({
    planId: plan.id,
    siteKey: plan.siteKey,
    taskType: plan.taskType,
    resources: [],
    metadata: {
      resolver: {
        ...(plan.resolver ?? {}),
        method: method ?? `native-${siteKey}-resource-seeds`,
      },
      legacy: plan.legacy,
      resolution: {
        siteResolver: siteKey,
        nativeMiss: createNativeMissDiagnostics(siteKey, { reason, resolution }),
        ...resolution,
      },
    },
    completeness: {
      expectedCount,
      resolvedCount: 0,
      complete: false,
      reason: reason ?? `${siteKey}-native-evidence-unavailable`,
    },
  }, plan);
}
