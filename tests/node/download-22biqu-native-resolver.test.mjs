import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import {
  createDownloadPlan,
  resolveDownloadResources,
} from '../../src/sites/downloads/modules.mjs';
import {
  resolveDownloadSiteDefinition,
} from '../../src/sites/downloads/registry.mjs';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TEST_DIR, '..', '..');

async function writeJson(filePath, payload) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

async function writeText(filePath, body) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, body, 'utf8');
}

async function createBookContentFixture(rootDir) {
  const bookContentDir = path.join(rootDir, 'raw', 'step-book-content', 'run');
  const chaptersFile = path.join('chapters', 'mock-native-book.json');
  await writeJson(path.join(bookContentDir, 'book-content-manifest.json'), {
    inputUrl: 'https://www.22biqu.com/',
    baseUrl: 'https://www.22biqu.com/',
    files: {
      books: 'books.json',
      manifest: 'book-content-manifest.json',
    },
  });
  await writeJson(path.join(bookContentDir, 'books.json'), [
    {
      bookId: 'fixture-book',
      title: 'Mock Native Book',
      finalUrl: 'https://www.22biqu.com/biqu123/',
      chaptersFile,
    },
  ]);
  await writeJson(path.join(bookContentDir, chaptersFile), [
    { chapterIndex: 2, href: '2.html', title: 'Chapter Two' },
    { chapterIndex: 1, href: '1.html', title: 'Chapter One' },
    { chapterIndex: 3, href: 'https://www.22biqu.com/biqu123/3.html', title: 'Chapter Three' },
  ]);
  return bookContentDir;
}

function createDirectoryHtmlFixture({ includeChapters = true } = {}) {
  const chapterList = includeChapters
    ? `
      <dd><a href="3.html">Chapter Three</a></dd>
      <dd><a href="https://www.22biqu.com/biqu456/1.html">Chapter One</a></dd>
      <dd><a href="/biqu456/2.html">Chapter Two</a></dd>
      <dd><a href="https://www.22biqu.com/biqu456/2.html#duplicate">Chapter Two Duplicate</a></dd>
      <dd><a href="4.html">Chapter Four</a></dd>
    `
    : '';
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta property="og:novel:book_name" content="Directory Fixture Book">
    <meta property="og:novel:read_url" content="https://www.22biqu.com/biqu456/">
    <title>Directory Fixture Book</title>
  </head>
  <body>
    <div id="info">
      <h1>Directory Fixture Book</h1>
      <p>Author: Fixture Author</p>
    </div>
    <div id="list">
      <dl>
        <dt>Latest chapters</dt>${chapterList}
      </dl>
    </div>
  </body>
</html>
`;
}

async function createBookDirectoryHtmlFixture(rootDir, options = {}) {
  const bookContentDir = path.join(rootDir, 'raw', 'step-book-content', 'run');
  const targetHtmlFile = path.join('books', 'directory-fixture-book.html');
  const decoyHtmlFile = path.join('books', 'decoy-directory-book.html');
  await writeJson(path.join(bookContentDir, 'book-content-manifest.json'), {
    inputUrl: 'https://www.22biqu.com/',
    baseUrl: 'https://www.22biqu.com/',
    files: {
      books: 'books.json',
      manifest: 'book-content-manifest.json',
    },
  });
  await writeJson(path.join(bookContentDir, 'books.json'), [
    {
      bookId: 'decoy-html-book',
      title: 'Decoy Directory Book',
      finalUrl: 'https://www.22biqu.com/biqu999/',
      directoryHtmlFile: decoyHtmlFile,
    },
    {
      bookId: 'directory-html-book',
      title: 'Directory Fixture Book',
      finalUrl: 'https://www.22biqu.com/biqu456/',
      directoryHtmlFile: targetHtmlFile,
    },
  ]);
  await writeText(path.join(bookContentDir, decoyHtmlFile), `<!doctype html>
<html>
  <body>
    <h1>Decoy Directory Book</h1>
    <div id="list"><dl><dd><a href="1.html">Decoy Chapter</a></dd></dl></div>
  </body>
</html>
`);
  await writeText(path.join(bookContentDir, targetHtmlFile), createDirectoryHtmlFixture(options));
  return bookContentDir;
}

async function resolve22Biqu(request, context = {}) {
  const definition = await resolveDownloadSiteDefinition({ site: '22biqu' }, { workspaceRoot: REPO_ROOT });
  const plan = await createDownloadPlan(request, {
    workspaceRoot: REPO_ROOT,
    definition,
  });
  const resolved = await resolveDownloadResources(plan, null, {
    request,
    workspaceRoot: REPO_ROOT,
    definition,
    ...context,
  });
  return { plan, resolved };
}

test('22biqu native dry-run resolves an ordinary book URL from local book-content fixture chapters', async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-22biqu-native-url-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const bookContentDir = await createBookContentFixture(workspace);

  const { resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'https://www.22biqu.com/biqu123/',
    bookContentDir,
    dryRun: true,
  });

  assert.equal(resolved.siteKey, '22biqu');
  assert.equal(resolved.resources.length, 3);
  assert.deepEqual(resolved.resources.map((resource) => resource.url), [
    'https://www.22biqu.com/biqu123/1.html',
    'https://www.22biqu.com/biqu123/2.html',
    'https://www.22biqu.com/biqu123/3.html',
  ]);
  assert.deepEqual(resolved.resources.map((resource) => resource.fileName), [
    '0001-Chapter One.txt',
    '0002-Chapter Two.txt',
    '0003-Chapter Three.txt',
  ]);
  assert.deepEqual(resolved.resources.map((resource) => resource.metadata.chapterIndex), [1, 2, 3]);
  assert.equal(resolved.resources.every((resource) => resource.mediaType === 'text'), true);
  assert.equal(resolved.metadata.resolver.method, 'native-22biqu-book-content');
  assert.equal(resolved.metadata.bookContent.bookId, 'fixture-book');
  assert.equal(resolved.completeness.complete, true);
  assert.equal(resolved.completeness.reason, '22biqu-book-content-provided');
});

test('22biqu native dry-run resolves an ordinary book title from a compiled knowledge-base fixture root', async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-22biqu-native-title-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const bookContentDir = await createBookContentFixture(workspace);
  const kbRoot = path.join(workspace, 'knowledge-base', 'www.22biqu.com');
  await writeJson(path.join(kbRoot, 'index', 'sources.json'), {
    activeSources: [
      {
        step: 'step-book-content',
        rawDir: path.relative(kbRoot, bookContentDir),
      },
    ],
  });

  const { resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'Mock Native Book',
    fixtureDir: kbRoot,
    dryRun: true,
  });

  assert.equal(resolved.resources.length, 3);
  assert.equal(resolved.resources[0].sourceUrl, 'https://www.22biqu.com/biqu123/');
  assert.equal(resolved.resources[0].referer, 'https://www.22biqu.com/biqu123/');
  assert.equal(resolved.resources[0].metadata.bookTitle, 'Mock Native Book');
  assert.equal(resolved.metadata.resolver.method, 'native-22biqu-book-content');
});

test('22biqu native dry-run resolves directory HTML fixture chapters by URL', async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-22biqu-native-html-url-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const bookContentDir = await createBookDirectoryHtmlFixture(workspace);

  const { resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'https://www.22biqu.com/biqu456/',
    bookContentDir,
    dryRun: true,
  });

  assert.equal(resolved.siteKey, '22biqu');
  assert.equal(resolved.resources.length, 4);
  assert.deepEqual(resolved.resources.map((resource) => resource.url), [
    'https://www.22biqu.com/biqu456/1.html',
    'https://www.22biqu.com/biqu456/2.html',
    'https://www.22biqu.com/biqu456/3.html',
    'https://www.22biqu.com/biqu456/4.html',
  ]);
  assert.deepEqual(resolved.resources.map((resource) => resource.fileName), [
    '0001-Chapter One.txt',
    '0002-Chapter Two.txt',
    '0003-Chapter Three.txt',
    '0004-Chapter Four.txt',
  ]);
  assert.deepEqual(resolved.resources.map((resource) => resource.metadata.chapterIndex), [1, 2, 3, 4]);
  assert.equal(resolved.resources[1].metadata.title, 'Chapter Two');
  assert.equal(resolved.resources.every((resource) => resource.mediaType === 'text'), true);
  assert.match(resolved.metadata.resolver.method, /^native-22biqu-/u);
  assert.equal(resolved.metadata.bookContent.bookId, 'directory-html-book');
  assert.equal(resolved.completeness.complete, true);
});

test('22biqu native dry-run resolves directory HTML fixture chapters by book title', async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-22biqu-native-html-title-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const bookContentDir = await createBookDirectoryHtmlFixture(workspace);
  const kbRoot = path.join(workspace, 'knowledge-base', 'www.22biqu.com');
  await writeJson(path.join(kbRoot, 'index', 'sources.json'), {
    activeSources: [
      {
        step: 'step-book-content',
        rawDir: path.relative(kbRoot, bookContentDir),
      },
    ],
  });

  const { resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'Directory Fixture Book',
    fixtureDir: kbRoot,
    dryRun: true,
  });

  assert.equal(resolved.resources.length, 4);
  assert.equal(resolved.resources[0].sourceUrl, 'https://www.22biqu.com/biqu456/');
  assert.equal(resolved.resources[0].referer, 'https://www.22biqu.com/biqu456/');
  assert.equal(resolved.resources[0].metadata.bookTitle, 'Directory Fixture Book');
  assert.equal(resolved.metadata.bookContent.bookId, 'directory-html-book');
  assert.match(resolved.metadata.resolver.method, /^native-22biqu-/u);
});

test('22biqu native dry-run resolves direct fixture HTML without book-content artifacts', async () => {
  const { resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'https://www.22biqu.com/biqu456/',
    fixtureHtml: createDirectoryHtmlFixture(),
    dryRun: true,
  });

  assert.equal(resolved.resources.length, 4);
  assert.deepEqual(resolved.resources.map((resource) => resource.url), [
    'https://www.22biqu.com/biqu456/1.html',
    'https://www.22biqu.com/biqu456/2.html',
    'https://www.22biqu.com/biqu456/3.html',
    'https://www.22biqu.com/biqu456/4.html',
  ]);
  assert.equal(resolved.metadata.resolver.method, 'native-22biqu-directory');
  assert.equal(resolved.metadata.directory.source, 'fixture-html-string');
  assert.equal(resolved.metadata.bookContent, undefined);
  assert.equal(resolved.completeness.reason, '22biqu-directory-provided');
});

test('22biqu native dry-run resolves directory HTML through injected fetch only', async () => {
  const fetchedUrls = [];
  const { resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'https://www.22biqu.com/biqu456/',
    dryRun: true,
  }, {
    fetchImpl: async (url) => {
      fetchedUrls.push(String(url));
      return {
        ok: true,
        url,
        async text() {
          return createDirectoryHtmlFixture();
        },
      };
    },
  });

  assert.deepEqual(fetchedUrls, ['https://www.22biqu.com/biqu456/']);
  assert.equal(resolved.resources.length, 4);
  assert.equal(resolved.metadata.resolver.method, 'native-22biqu-directory');
  assert.equal(resolved.metadata.directory.source, 'fetchImpl');
});

test('22biqu native dry-run does not use global fetch without injected fetchImpl', async () => {
  const originalFetch = globalThis.fetch;
  let globalFetchInvoked = false;
  globalThis.fetch = async () => {
    globalFetchInvoked = true;
    throw new Error('global fetch must not be used by native 22biqu resolver tests');
  };
  try {
    const { resolved } = await resolve22Biqu({
      site: '22biqu',
      input: 'https://www.22biqu.com/biqu456/',
      dryRun: true,
    });

    assert.equal(globalFetchInvoked, false);
    assert.equal(resolved.resources.length, 0);
    assert.equal(resolved.completeness.reason, 'legacy-downloader-required');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('22biqu directory HTML fixture without chapter links keeps legacy fallback', async (t) => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-22biqu-native-html-empty-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const bookContentDir = await createBookDirectoryHtmlFixture(workspace, { includeChapters: false });

  const { plan, resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'https://www.22biqu.com/biqu456/',
    bookContentDir,
    dryRun: true,
  });

  assert.equal(resolved.resources.length, 0);
  assert.equal(resolved.completeness.reason, 'legacy-downloader-required');
  assert.equal(plan.legacy.entrypoint.endsWith(path.join('src', 'sites', 'chapter-content', 'download', 'python', 'book.py')), true);
});

test('22biqu ordinary book input keeps legacy fallback when no local fixture data matches', async () => {
  const { plan, resolved } = await resolve22Biqu({
    site: '22biqu',
    input: 'https://www.22biqu.com/biqu999/',
    dryRun: true,
  });

  assert.equal(resolved.resources.length, 0);
  assert.equal(resolved.completeness.reason, 'legacy-downloader-required');
  assert.equal(plan.legacy.entrypoint.endsWith(path.join('src', 'sites', 'chapter-content', 'download', 'python', 'book.py')), true);
});
