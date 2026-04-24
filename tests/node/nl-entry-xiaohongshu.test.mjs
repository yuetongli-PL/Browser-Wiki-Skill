import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveSiteSemantics } from '../../src/entrypoints/pipeline/nl-entry.mjs';

test('nl-entry resolves xiaohongshu site semantics and generates explicit note/discover/auth phrases', () => {
  const semantics = resolveSiteSemantics('https://www.xiaohongshu.com/explore', {
    inputUrl: 'https://www.xiaohongshu.com/explore',
  });

  assert.equal(semantics.siteKey, 'xiaohongshu');
  assert.equal(semantics.intentLabels['search-book'].canonical, '\u641c\u7d22\u7b14\u8bb0');
  assert.equal(semantics.intentLabels['open-book'].canonical, '\u6253\u5f00\u7b14\u8bb0');
  assert.equal(semantics.intentLabels['open-author'].canonical, '\u6253\u5f00\u7528\u6237\u4e3b\u9875');
  assert.equal(semantics.intentLabels['open-category'].canonical, '\u6253\u5f00\u53d1\u73b0\u9875');
  assert.equal(semantics.intentLabels['open-auth-page'].canonical, '\u6253\u5f00\u767b\u5f55\u9875');
  assert.equal(semantics.intentLabels['open-utility-page'].canonical, '\u6253\u5f00\u901a\u77e5\u9875');
  assert.equal(semantics.intentLabels['download-book'].canonical, '\u4e0b\u8f7d\u7b14\u8bb0');
  assert.equal(semantics.intentLabels['list-followed-users'].canonical, '\u67e5\u8be2\u5173\u6ce8\u7528\u6237\u5217\u8868');
  assert.equal(semantics.intentLabels['list-followed-updates'].canonical, '\u67e5\u8be2\u5173\u6ce8\u7528\u6237\u6700\u8fd1\u66f4\u65b0');

  const searchExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'queryText',
    intent: { intentType: 'search-book' },
  }, 'explicit-intent', [
    { value: 'spring-outfit', label: '\u6625\u65e5\u7a7f\u642d' },
  ]);
  assert.ok(searchExamples.includes('\u641c\u7d22\u7b14\u8bb0\u6625\u65e5\u7a7f\u642d'));

  const noteExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'targetMemberId',
    intent: { intentType: 'open-book' },
  }, 'explicit-intent', [
    { value: 'note', label: '\u6625\u65e5\u7a7f\u642d\u6a21\u677f' },
  ]);
  assert.ok(noteExamples.includes('\u6253\u5f00\u7b14\u8bb0\u6625\u65e5\u7a7f\u642d\u6a21\u677f'));

  const userExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'targetMemberId',
    intent: { intentType: 'open-author' },
  }, 'explicit-intent', [
    { value: 'user', label: '\u7a7f\u642d\u7814\u7a76\u6240' },
  ]);
  assert.ok(userExamples.includes('\u6253\u5f00\u7528\u6237\u4e3b\u9875\u7a7f\u642d\u7814\u7a76\u6240'));

  const discoverExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'targetMemberId',
    intent: { intentType: 'open-category' },
  }, 'explicit-intent', [
    { value: 'discover', label: '\u53d1\u73b0\u9875' },
  ]);
  assert.ok(discoverExamples.includes('\u6253\u5f00\u53d1\u73b0\u9875'));
  assert.ok(discoverExamples.includes('\u6d4f\u89c8\u53d1\u73b0\u9875'));

  const authExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'targetMemberId',
    intent: { intentType: 'open-auth-page' },
  }, 'explicit-intent', [
    { value: 'login', label: '\u767b\u5f55\u9875' },
  ]);
  assert.ok(authExamples.includes('\u6253\u5f00\u767b\u5f55\u9875'));
  assert.ok(authExamples.includes('\u6253\u5f00\u767b\u5f55\u9875\u4f46\u4e0d\u81ea\u52a8\u63d0\u4ea4\u51ed\u8bc1'));

  const utilityExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'targetMemberId',
    intent: { intentType: 'open-utility-page' },
  }, 'explicit-intent', [
    { value: 'notification', label: '\u901a\u77e5\u9875' },
  ]);
  assert.ok(utilityExamples.includes('\u6253\u5f00\u901a\u77e5\u9875'));
  assert.ok(utilityExamples.includes('\u67e5\u770b\u6d88\u606f\u9875'));

  const downloadExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'noteTitle',
    intent: { intentType: 'download-book' },
  }, 'explicit-intent', [
    { value: 'note', label: '\u6625\u65e5\u7a7f\u642d\u6a21\u677f' },
  ]);
  assert.ok(downloadExamples.includes('\u4e0b\u8f7d\u7b14\u8bb0\u6625\u65e5\u7a7f\u642d\u6a21\u677f'));
  assert.ok(downloadExamples.includes('\u4e0b\u8f7d\u56fe\u6587\u6625\u65e5\u7a7f\u642d\u6a21\u677f'));

  const followedUserExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'targetMemberId',
    intent: { intentType: 'list-followed-users' },
  }, 'explicit-intent', []);
  assert.ok(followedUserExamples.includes('\u6211\u5173\u6ce8\u4e86\u54ea\u4e9b\u7528\u6237'));
  assert.ok(followedUserExamples.includes('\u67e5\u8be2\u5173\u6ce8\u7528\u6237\u5217\u8868'));

  const followedUpdateExamples = semantics.buildGeneratedPatternExamples({
    slotName: 'targetMemberId',
    intent: { intentType: 'list-followed-updates' },
  }, 'explicit-intent', []);
  assert.ok(followedUpdateExamples.includes('\u6211\u5173\u6ce8\u7684\u4eba\u6700\u8fd1\u53d1\u4e86\u4ec0\u4e48'));
  assert.ok(followedUpdateExamples.includes('\u67e5\u8be2\u5173\u6ce8\u7528\u6237\u6700\u8fd1\u66f4\u65b0'));
});
