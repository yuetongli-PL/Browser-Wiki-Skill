import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildMatrix,
  classifyDoctorReport,
  classifyKbRefreshManifest,
  classifySocialActionManifest,
  parseArgs,
} from '../../scripts/social-live-verify.mjs';

test('social-live-verify forwards case timeout into KB refresh commands', () => {
  const options = parseArgs(['--case-timeout', '1234']);
  const matrix = buildMatrix(options, 'run-1');
  const xKbRefresh = matrix.find((entry) => entry.id === 'x-kb-refresh');

  assert.ok(xKbRefresh);
  const timeoutIndex = xKbRefresh.args.indexOf('--case-timeout');
  assert.notEqual(timeoutIndex, -1);
  assert.equal(xKbRefresh.args[timeoutIndex + 1], '1234');
});

test('social-live-verify forwards media download tuning into media cases', () => {
  const options = parseArgs([
    '--case',
    'x-media-download',
    '--media-download-concurrency',
    '9',
    '--media-download-retries',
    '4',
    '--media-download-backoff-ms',
    '2500',
  ]);
  const matrix = buildMatrix(options, 'run-1');
  const mediaCase = matrix.find((entry) => entry.id === 'x-media-download');

  assert.ok(mediaCase);
  assert.equal(mediaCase.args[mediaCase.args.indexOf('--media-download-concurrency') + 1], '9');
  assert.equal(mediaCase.args[mediaCase.args.indexOf('--media-download-retries') + 1], '4');
  assert.equal(mediaCase.args[mediaCase.args.indexOf('--media-download-backoff-ms') + 1], '2500');
});

test('social-live-verify classifies site-doctor fail statuses as failed', () => {
  const classification = classifyDoctorReport({
    authHealth: { available: true },
    scenarios: [
      { id: 'home-search-post-detail-profile', status: 'fail', reasonCode: null },
      { id: 'profile-post-detail', status: 'pass', reasonCode: 'ok' },
    ],
  });

  assert.deepEqual(classification, {
    verdict: 'failed',
    reason: 'home-search-post-detail-profile',
  });
});

test('social-live-verify classifies auth-only skipped scenarios as blocked', () => {
  const classification = classifyDoctorReport({
    authHealth: { available: true },
    scenarios: [
      { id: 'home-auth', status: 'skipped', reasonCode: 'not-logged-in' },
    ],
  });

  assert.deepEqual(classification, {
    verdict: 'blocked',
    reason: 'not-logged-in',
  });
});

test('social-live-verify classifies KB refresh timeout manifest as blocked', () => {
  const classification = classifyKbRefreshManifest({
    status: 'blocked',
    results: [{
      id: 'instagram-kb-refresh',
      status: 'blocked',
      exitCode: 1,
      timeout: { timedOut: true },
      blocked: { status: true, reason: 'timeout' },
    }],
  });

  assert.equal(classification.verdict, 'blocked');
  assert.equal(classification.reason, 'timeout');
});

test('social-live-verify classifies Instagram action missing login as skipped', () => {
  assert.deepEqual(classifySocialActionManifest({
    status: 'failed',
    outcome: {
      status: 'credentials-unavailable',
      ok: false,
      reason: 'not-logged-in',
    },
  }), {
    verdict: 'skipped',
    reason: 'not-logged-in',
  });
});

test('social-live-verify classifies Instagram auth recovery needs as blocked', () => {
  assert.deepEqual(classifySocialActionManifest({
    status: 'completed',
    authHealth: {
      status: 'authenticated',
      needsRecovery: true,
      recoveryReason: 'login-wall',
    },
    runtimeRisk: {
      authExpired: true,
      stopReason: 'session-invalid',
    },
  }), {
    verdict: 'blocked',
    reason: 'login-wall',
  });
});

test('social-live-verify classifies Instagram media download skipped by login as skipped', () => {
  assert.deepEqual(classifySocialActionManifest({
    status: 'completed',
    downloads: {
      status: 'skipped',
      reason: 'no-reusable-session',
      expectedMedia: 0,
      ok: 0,
    },
  }), {
    verdict: 'skipped',
    reason: 'no-reusable-session',
  });
});
