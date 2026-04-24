import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, readFile, rm } from 'node:fs/promises';

import { compileFixtureKnowledgeBase, buildXiaohongshuStageSpec } from './kb-test-fixtures.mjs';
import { assertRepoMetadataUnchanged, captureRepoMetadataSnapshot } from './helpers/site-metadata-sandbox.mjs';

test('compileKnowledgeBase surfaces xiaohongshu facts into wiki pages and page indexes', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-xiaohongshu-compile-'));
  const repoMetadataSnapshot = await captureRepoMetadataSnapshot();

  try {
    const fixture = await compileFixtureKnowledgeBase(workspace, buildXiaohongshuStageSpec());
    const kbDir = fixture.kbDir;

    const pagesIndex = JSON.parse(await readFile(path.join(kbDir, 'index', 'pages.json'), 'utf8'));
    const overviewPage = pagesIndex.pages.find((page) => page.pageId === 'page_overview_site');
    const noteStatePage = pagesIndex.pages.find((page) => page.attributes?.xiaohongshuFacts?.noteId === '6718e70f0000000021031147');
    const searchStatePage = pagesIndex.pages.find((page) => page.attributes?.xiaohongshuFacts?.queryText === '春日穿搭');
    const authorStatePage = pagesIndex.pages.find((page) => Number(page.attributes?.xiaohongshuFacts?.featuredContentCardCount ?? 0) >= 2);

    assert.ok(overviewPage);
    assert.ok(noteStatePage);
    assert.ok(searchStatePage);
    assert.ok(authorStatePage);

    assert.ok(overviewPage.attributes.xiaohongshuFacts.noteIds.includes('6718e70f0000000021031147'));
    assert.ok(overviewPage.attributes.xiaohongshuFacts.noteIds.includes('6718e70f0000000021031148'));
    assert.deepEqual(overviewPage.attributes.xiaohongshuFacts.authorUserIds, ['5f123456000000000100abcd']);
    assert.deepEqual(overviewPage.attributes.xiaohongshuFacts.searchQueries, ['春日穿搭']);
    assert.deepEqual(overviewPage.attributes.xiaohongshuFacts.categories, ['发现']);
    assert.equal(overviewPage.attributes.xiaohongshuFacts.featuredContentCards.length, 2);

    assert.equal(noteStatePage.attributes.xiaohongshuFacts.authorUserId, '5f123456000000000100abcd');
    assert.equal(searchStatePage.attributes.xiaohongshuFacts.resultCount, 1);
    assert.deepEqual(searchStatePage.attributes.xiaohongshuFacts.resultNoteIds, ['6718e70f0000000021031147']);
    assert.equal(authorStatePage.attributes.xiaohongshuFacts.featuredContentCardCount, 2);
    assert.equal(authorStatePage.attributes.xiaohongshuFacts.featuredContentComplete, true);

    const overviewMd = await readFile(path.join(kbDir, 'wiki', 'overview', 'site-overview.md'), 'utf8');
    const noteStateMd = await readFile(path.join(kbDir, noteStatePage.path), 'utf8');
    const searchStateMd = await readFile(path.join(kbDir, searchStatePage.path), 'utf8');
    const authorStateMd = await readFile(path.join(kbDir, authorStatePage.path), 'utf8');

    assert.match(overviewMd, /Surfaced Xiaohongshu facts/u);
    assert.match(overviewMd, /`6718e70f0000000021031147`/u);
    assert.match(overviewMd, /`5f123456000000000100abcd`/u);
    assert.match(overviewMd, /春日穿搭/u);
    assert.match(overviewMd, /Featured note cards/u);
    assert.match(overviewMd, /通勤极简公式/u);

    assert.match(noteStateMd, /Surfaced Xiaohongshu facts/u);
    assert.match(noteStateMd, /\| Note ID \| `6718e70f0000000021031147` \|/u);
    assert.match(noteStateMd, /\| Author User ID \| `5f123456000000000100abcd` \|/u);

    assert.match(searchStateMd, /\| Query Text \| 春日穿搭 \|/u);
    assert.match(searchStateMd, /\| Result Note IDs \| `6718e70f0000000021031147` \|/u);

    assert.match(authorStateMd, /\| Featured Note Count \| 2 \|/u);
    assert.match(authorStateMd, /\| Featured Note Complete \| yes \|/u);
    assert.match(authorStateMd, /Featured Note Cards/u);
    assert.match(authorStateMd, /春日穿搭模板/u);
    assert.match(authorStateMd, /通勤极简公式/u);
    await assertRepoMetadataUnchanged(repoMetadataSnapshot);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
