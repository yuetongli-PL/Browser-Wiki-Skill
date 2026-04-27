import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  buildDownloadableMediaPlan,
  downloadMediaFiles,
  runCurlDownload,
} from '../../src/sites/downloads/media-executor.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, '..', '..');

function responseFor(payload, contentType = 'image/jpeg') {
  const bytes = Buffer.from(payload, 'utf8');
  return {
    ok: true,
    status: 200,
    headers: {
      get(name) {
        return String(name).toLowerCase() === 'content-type' ? contentType : '';
      },
    },
    async arrayBuffer() {
      return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
    },
  };
}

test('media executor builds bounded plans with poster fallback metadata', () => {
  const plan = buildDownloadableMediaPlan([
    { type: 'image', url: 'https://pbs.twimg.com/profile_images/avatar.jpg', alt: 'profile picture' },
    { type: 'video', url: 'blob:https://x.com/video' },
    {
      type: 'video',
      posterUrl: 'https://pbs.twimg.com/ext_tw_video_thumb/post-1/pu/img/poster.jpg',
      itemId: 'post-1',
      pageUrl: 'https://x.com/openai/status/1',
    },
    {
      type: 'image',
      url: 'https://pbs.twimg.com/media/real.jpg',
      itemId: 'post-2',
      pageUrl: 'https://x.com/openai/status/2',
    },
  ], 1);

  assert.equal(plan.expectedMedia.length, 2);
  assert.equal(plan.candidates.length, 1);
  assert.equal(plan.skippedMedia, 1);
  assert.equal(plan.skippedCandidates, 1);
  assert.equal(plan.candidates[0].fallbackFrom, 'poster-only-video-fallback');
  assert.equal(plan.candidates[0].expectedType, 'video');
});

test('media executor writes queue and dedupes by content hash', async (t) => {
  const runDir = await mkdtemp(path.join(os.tmpdir(), 'bwk-media-executor-dedupe-'));
  t.after(() => rm(runDir, { recursive: true, force: true }));

  const mediaDir = path.join(runDir, 'media');
  const queuePath = path.join(runDir, 'media-queue.json');
  const payload = 'shared media body';
  const result = await downloadMediaFiles({
    media: [
      { type: 'image', url: 'https://cdn.example.test/one.jpg', itemId: 'post-1', pageUrl: 'https://x.com/a/status/1' },
      { type: 'image', url: 'https://cdn.example.test/two.jpg', itemId: 'post-2', pageUrl: 'https://x.com/a/status/2' },
    ],
    headers: { Referer: 'https://x.com/a' },
    outDir: mediaDir,
    siteKey: 'x',
    account: 'openai',
    maxItems: 10,
    concurrency: 1,
    retries: 0,
    retryBackoffMs: 0,
    queuePath,
    fetchImpl: async () => responseFor(payload),
    curlDownload: async () => ({ ok: false, error: 'curl should not run' }),
  });

  assert.equal(result.downloads.length, 2);
  assert.equal(result.downloads[0].transport, 'fetch');
  assert.equal(result.downloads[1].transport, 'fetch-content-dedupe');
  assert.equal(result.downloads[0].filePath, result.downloads[1].filePath);
  assert.equal(await readFile(result.downloads[0].filePath, 'utf8'), payload);

  const queue = JSON.parse(await readFile(queuePath, 'utf8'));
  assert.equal(queue.counts.done, 2);
  assert.equal(queue.queue[1].result.duplicateOf, 'https://cdn.example.test/one.jpg');
});

test('media executor resumes completed downloads from previous jsonl rows', async (t) => {
  const runDir = await mkdtemp(path.join(os.tmpdir(), 'bwk-media-executor-resume-'));
  t.after(() => rm(runDir, { recursive: true, force: true }));

  const mediaDir = path.join(runDir, 'media');
  await mkdir(mediaDir, { recursive: true });
  const existingPath = path.join(mediaDir, 'already.jpg');
  await writeFile(existingPath, 'existing body', 'utf8');

  const result = await downloadMediaFiles({
    media: [{ type: 'image', url: 'https://cdn.example.test/already.jpg', itemId: 'post-1' }],
    headers: {},
    outDir: mediaDir,
    siteKey: 'x',
    account: 'openai',
    maxItems: 1,
    queuePath: path.join(runDir, 'media-queue.json'),
    previousDownloads: [{
      ok: true,
      url: 'https://cdn.example.test/already.jpg',
      type: 'image',
      filePath: existingPath,
      bytes: 13,
      transport: 'fetch',
    }],
    fetchImpl: async () => {
      throw new Error('fetch should not run for a restorable download');
    },
    curlDownload: async () => ({ ok: false, error: 'curl should not run' }),
  });

  assert.equal(result.downloads.length, 1);
  assert.equal(result.downloads[0].skipped, true);
  assert.equal(result.downloads[0].filePath, existingPath);
  assert.equal(result.queue[0].status, 'skipped');
});

test('media executor falls back to curl-compatible hook after HTTP failure', async (t) => {
  const runDir = await mkdtemp(path.join(os.tmpdir(), 'bwk-media-executor-curl-'));
  t.after(() => rm(runDir, { recursive: true, force: true }));

  const mediaDir = path.join(runDir, 'media');
  let curlCalls = 0;
  const result = await downloadMediaFiles({
    media: [{ type: 'image', url: 'https://cdn.example.test/fallback.jpg', itemId: 'post-1' }],
    headers: { Cookie: 'session=1' },
    outDir: mediaDir,
    siteKey: 'instagram',
    account: 'instagram',
    maxItems: 1,
    retries: 4,
    queuePath: path.join(runDir, 'media-queue.json'),
    fetchImpl: async () => ({
      ok: false,
      status: 503,
      headers: { get() { return ''; } },
    }),
    curlDownload: async ({ filePath, headers, retries }) => {
      curlCalls += 1;
      assert.equal(headers.Cookie, 'session=1');
      assert.equal(retries, 4);
      await writeFile(filePath, 'curl body', 'utf8');
      return { ok: true };
    },
  });

  assert.equal(curlCalls, 1);
  assert.equal(result.downloads[0].transport, 'curl-fallback');
  assert.equal(await readFile(result.downloads[0].filePath, 'utf8'), 'curl body');
});

test('media executor writes and reuses Instagram nested post-folder files', async (t) => {
  const runDir = await mkdtemp(path.join(os.tmpdir(), 'bwk-media-executor-instagram-nested-'));
  t.after(() => rm(runDir, { recursive: true, force: true }));

  const mediaDir = path.join(runDir, 'media');
  const media = [{
    type: 'image',
    url: 'https://scontent.cdninstagram.com/shared.jpg',
    itemId: 'post-1',
    pageUrl: 'https://www.instagram.com/p/ONE/',
    mediaIndex: 0,
  }];

  const first = await downloadMediaFiles({
    media,
    headers: {},
    outDir: mediaDir,
    siteKey: 'instagram',
    account: 'instagram',
    maxItems: 1,
    concurrency: 1,
    retries: 0,
    retryBackoffMs: 0,
    fetchImpl: async () => responseFor('nested body', 'image/jpeg'),
    curlDownload: async () => ({ ok: false, error: 'curl should not run' }),
  });

  assert.equal(path.basename(path.dirname(first.downloads[0].filePath)), 'one');
  assert.match(path.basename(first.downloads[0].filePath), /^m01-image-[a-f0-9]{10}\.jpg$/u);
  assert.equal(await readFile(first.downloads[0].filePath, 'utf8'), 'nested body');

  const second = await downloadMediaFiles({
    media,
    headers: {},
    outDir: mediaDir,
    siteKey: 'instagram',
    account: 'instagram',
    maxItems: 1,
    concurrency: 1,
    retries: 0,
    retryBackoffMs: 0,
    fetchImpl: async () => {
      throw new Error('fetch should not run when nested existing file is reused');
    },
    curlDownload: async () => ({ ok: false, error: 'curl should not run' }),
  });

  assert.equal(second.downloads[0].skipped, true);
  assert.equal(second.downloads[0].transport, 'existing-file');
  assert.equal(second.downloads[0].filePath, first.downloads[0].filePath);
});

test('media executor lowers concurrency after previous queue failures', async (t) => {
  const runDir = await mkdtemp(path.join(os.tmpdir(), 'bwk-media-executor-adaptive-concurrency-'));
  t.after(() => rm(runDir, { recursive: true, force: true }));

  const mediaDir = path.join(runDir, 'media');
  let active = 0;
  let maxActive = 0;
  const media = [1, 2, 3, 4].map((index) => ({
    type: 'image',
    url: `https://cdn.example.test/${index}.jpg`,
    itemId: `post-${index}`,
  }));

  const result = await downloadMediaFiles({
    media,
    headers: {},
    outDir: mediaDir,
    siteKey: 'x',
    account: 'openai',
    maxItems: 4,
    concurrency: 4,
    retries: 0,
    retryBackoffMs: 0,
    previousQueue: [
      { key: 'image:https://cdn.example.test/1.jpg', status: 'failed', result: { ok: false } },
      { key: 'image:https://cdn.example.test/2.jpg', status: 'failed', result: { ok: false } },
      { key: 'image:https://cdn.example.test/3.jpg', status: 'done', result: { ok: true } },
      { key: 'image:https://cdn.example.test/4.jpg', status: 'done', result: { ok: true } },
    ],
    fetchImpl: async (url) => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await new Promise((resolve) => setTimeout(resolve, 25));
      active -= 1;
      return responseFor(String(url));
    },
    curlDownload: async () => ({ ok: false, error: 'curl should not run' }),
  });

  assert.equal(maxActive, 2);
  assert.equal(result.requestedConcurrency, 4);
  assert.equal(result.concurrency, 2);
  assert.equal(result.adaptiveConcurrency.adjusted, true);
  assert.equal(result.adaptiveConcurrency.reason, 'previous-failure-rate-high');
  assert.equal(result.adaptiveConcurrency.previous.failed, 2);
});

test('runCurlDownload carries hardened retry and timeout arguments', async () => {
  const source = runCurlDownload.toString();
  assert.match(source, /--retry/u);
  assert.match(source, /--retry-all-errors/u);
  assert.match(source, /--ssl-no-revoke/u);
  assert.match(source, /--http1\.1/u);
  assert.match(source, /--connect-timeout'[\s\S]*'30'/u);
  assert.match(source, /--max-time'[\s\S]*'180'/u);
});

test('media executor stays independent from social action routers', async () => {
  const source = await readFile(path.join(REPO_ROOT, 'src', 'sites', 'downloads', 'media-executor.mjs'), 'utf8');
  assert.equal(source.includes('sites/social/actions/router'), false);
  assert.equal(source.includes('../social/actions'), false);
});
