import test from 'node:test';
import assert from 'node:assert/strict';

import {
  siteIntentTitlePrefix,
  siteIntentTypeName,
  siteTerminology,
} from '../../src/entrypoints/pipeline/generate-docs.mjs';

const context = {
  host: 'www.xiaohongshu.com',
  baseUrl: 'https://www.xiaohongshu.com/explore',
  url: 'https://www.xiaohongshu.com/explore',
};

test('generate-docs uses xiaohongshu terminology instead of generic book wording', () => {
  const terms = siteTerminology(context);
  assert.equal(terms.entityLabel, '笔记');
  assert.equal(terms.personLabel, '用户');
  assert.equal(terms.searchLabel, '搜索笔记');
  assert.equal(terms.openEntityLabel, '打开笔记');
  assert.equal(terms.openPersonLabel, '打开用户主页');
  assert.equal(terms.verifiedTaskLabel, '笔记 / 用户 / 发现 / 通知');
});

test('generate-docs remaps xiaohongshu intent labels and intent types to note/user semantics', () => {
  assert.equal(siteIntentTitlePrefix(context, 'search-book'), '搜索笔记');
  assert.equal(siteIntentTitlePrefix(context, 'open-work'), '打开笔记');
  assert.equal(siteIntentTitlePrefix(context, 'open-up'), '打开用户主页');
  assert.equal(siteIntentTitlePrefix(context, 'open-category'), '打开发现页');
  assert.equal(siteIntentTitlePrefix(context, 'open-auth-page'), '打开登录页');
  assert.equal(siteIntentTitlePrefix(context, 'open-utility-page'), '打开通知页');

  assert.equal(siteIntentTypeName(context, 'search-work'), 'search-book');
  assert.equal(siteIntentTypeName(context, 'open-work'), 'open-book');
  assert.equal(siteIntentTypeName(context, 'open-up'), 'open-author');
});
