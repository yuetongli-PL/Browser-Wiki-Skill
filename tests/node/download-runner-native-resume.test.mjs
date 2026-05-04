import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { executeResolvedDownloadTask } from '../../src/sites/downloads/executor.mjs';
import { runDownloadTask } from '../../src/sites/downloads/runner.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, '..', '..');

const NATIVE_22BIQU_CHAPTERS = [
  { chapterIndex: 1, href: '1.html', title: 'Chapter One' },
  { chapterIndex: 2, href: '2.html', title: 'Chapter Two' },
];

function native22BiquRequest(overrides = {}) {
  return {
    site: '22biqu',
    input: 'https://www.22biqu.com/biqu123/',
    chapters: NATIVE_22BIQU_CHAPTERS,
    retries: 0,
    retryBackoffMs: 0,
    ...overrides,
  };
}

function native22BiquSessionLease(purpose = 'download:book') {
  return {
    siteKey: '22biqu',
    host: 'www.22biqu.com',
    mode: 'anonymous',
    status: 'ready',
    riskSignals: [],
    purpose,
  };
}

test('download runner resume consumes persisted native resolved-task instead of legacy fallback', async (t) => {
  const runRoot = await mkdtemp(path.join(os.tmpdir(), 'bwk-download-runner-native-resume-'));
  t.after(() => rm(runRoot, { recursive: true, force: true }));

  const dryRun = await runDownloadTask(native22BiquRequest({ dryRun: true }), {
    workspaceRoot: REPO_ROOT,
    runRoot,
  }, {
    acquireSessionLease: async (_siteKey, purpose) => native22BiquSessionLease(purpose),
    releaseSessionLease: async () => {},
  });
  const runDir = dryRun.manifest.artifacts.runDir ?? path.dirname(dryRun.manifest.artifacts.manifest);
  assert.equal(dryRun.resolvedTask.resources.length, 2);

  let genericExecutorInvoked = false;
  let legacyInvoked = false;
  const fetchedUrls = [];
  const resumed = await runDownloadTask(native22BiquRequest({
    dryRun: false,
    resume: true,
    runDir,
  }), {
    workspaceRoot: REPO_ROOT,
    runDir,
    resume: true,
  }, {
    acquireSessionLease: async (_siteKey, purpose) => native22BiquSessionLease(purpose),
    releaseSessionLease: async () => {},
    resolveDownloadResources: async () => {
      throw new Error('resume should consume persisted native resolved-task without re-resolving');
    },
    executeResolvedDownloadTask: async (resolvedTask, plan, sessionLease, options, executorDeps) => {
      genericExecutorInvoked = true;
      return await executeResolvedDownloadTask(resolvedTask, plan, sessionLease, options, executorDeps);
    },
    executeLegacyDownloadTask: async () => {
      legacyInvoked = true;
      throw new Error('legacy adapter should not execute for persisted native resolved-task resume');
    },
    fetchImpl: async (url) => {
      fetchedUrls.push(String(url));
      const payload = Buffer.from(`resumed native body for ${url}`, 'utf8');
      return {
        ok: true,
        status: 200,
        async arrayBuffer() {
          return payload.buffer.slice(payload.byteOffset, payload.byteOffset + payload.byteLength);
        },
      };
    },
  });

  assert.equal(genericExecutorInvoked, true);
  assert.equal(legacyInvoked, false);
  assert.deepEqual(fetchedUrls.sort(), [
    'https://www.22biqu.com/biqu123/1.html',
    'https://www.22biqu.com/biqu123/2.html',
  ]);
  assert.equal(resumed.manifest.status, 'passed');
  assert.equal(resumed.manifest.counts.downloaded, 2);
  assert.equal(resumed.resolvedTask.completeness.reason, '22biqu-chapters-provided');
  assert.equal(resumed.manifest.legacy, undefined);
});
