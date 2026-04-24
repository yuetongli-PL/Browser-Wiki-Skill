import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import path from 'node:path';

import { readJsonFile } from '../../src/infra/io.mjs';
import {
  computePageStateSignature,
  createPageStateHelperBundleSource,
} from '../../src/shared/page-state-runtime.mjs';

const SITE_PROFILE_LOADERS = new Map([
  ['bilibili', () => readJsonFile(path.resolve('profiles/www.bilibili.com.json'))],
  ['douyin', () => readJsonFile(path.resolve('profiles/www.douyin.com.json'))],
  ['xiaohongshu', () => readJsonFile(path.resolve('profiles/www.xiaohongshu.com.json'))],
]);

const SITE_PROFILE_CACHE = new Map();

function createSelectorReaders({
  textMap = {},
  hrefMap = {},
  textsMap = {},
  hrefsMap = {},
  metaMap = {},
} = {}) {
  return {
    textFromSelectors(selectors) {
      for (const selector of selectors) {
        const value = textMap[selector];
        if (value) {
          return value;
        }
      }
      return null;
    },
    hrefFromSelectors(selectors) {
      for (const selector of selectors) {
        const value = hrefMap[selector];
        if (value) {
          return value;
        }
      }
      return null;
    },
    textsFromSelectors(selectors) {
      for (const selector of selectors) {
        const value = textsMap[selector];
        if (value) {
          return value;
        }
      }
      return [];
    },
    hrefsFromSelectors(selectors) {
      for (const selector of selectors) {
        const value = hrefsMap[selector];
        if (value) {
          return value;
        }
      }
      return [];
    },
    metaContent(name) {
      return metaMap[name] ?? null;
    },
  };
}

class FakeElement {
  constructor({
    tagName = 'div',
    text = '',
    attributes = {},
    value = '',
  } = {}) {
    this.tagName = String(tagName).toUpperCase();
    this.textContent = text;
    this.innerText = text;
    this.attributes = { ...attributes };
    this.value = value;
    this.hidden = false;
    this.isConnected = true;
    this.parentElement = null;
    this.id = this.attributes.id ?? '';
  }

  getAttribute(name) {
    return this.attributes[name] ?? null;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }

  querySelector() {
    return null;
  }

  querySelectorAll() {
    return [];
  }

  closest() {
    return null;
  }

  matches() {
    return false;
  }

  getBoundingClientRect() {
    return {
      width: 100,
      height: 24,
    };
  }
}

class FakeDocument {
  constructor(fixture) {
    this.title = fixture.title;
    this.baseURI = fixture.finalUrl;
    this.body = {
      innerText: fixture.documentText ?? '',
    };
    this.documentElement = {
      innerText: fixture.documentText ?? '',
      outerHTML: fixture.rawHtml ?? '',
    };
    this.selectorMap = buildSelectorMap(fixture);
    this.idMap = new Map();
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const selectors = String(selector)
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    const seen = new Set();
    const results = [];
    for (const value of selectors) {
      for (const element of this.selectorMap.get(value) ?? []) {
        if (!seen.has(element)) {
          seen.add(element);
          results.push(element);
        }
      }
    }
    return results;
  }

  getElementById(id) {
    return this.idMap.get(id) ?? null;
  }
}

function createElementsForSelector(
  selector,
  {
    textMap = {},
    hrefMap = {},
    textsMap = {},
    hrefsMap = {},
    valuesMap = {},
    metaMap = {},
  },
) {
  const texts = Array.isArray(textsMap[selector]) ? textsMap[selector] : null;
  const hrefs = Array.isArray(hrefsMap[selector]) ? hrefsMap[selector] : null;
  const values = Array.isArray(valuesMap[selector]) ? valuesMap[selector] : null;
  if (texts || hrefs || values) {
    const count = Math.max(texts?.length ?? 0, hrefs?.length ?? 0, values?.length ?? 0);
    return Array.from({ length: count }, (_, index) => {
      const href = hrefs?.[index] ?? null;
      const value = values?.[index] ?? '';
      return new FakeElement({
        tagName: href ? 'a' : value ? 'input' : selector === 'time' ? 'time' : 'div',
        text: texts?.[index] ?? '',
        attributes: href ? { href } : {},
        value,
      });
    });
  }

  const hasSingleText = Object.prototype.hasOwnProperty.call(textMap, selector);
  const hasSingleHref = Object.prototype.hasOwnProperty.call(hrefMap, selector);
  const hasSingleValue = Object.prototype.hasOwnProperty.call(valuesMap, selector);
  if (hasSingleText || hasSingleHref || hasSingleValue) {
    return [new FakeElement({
      tagName: hasSingleHref ? 'a' : hasSingleValue ? 'input' : selector === 'time' ? 'time' : 'div',
      text: textMap[selector] ?? '',
      attributes: hasSingleHref ? { href: hrefMap[selector] } : {},
      value: valuesMap[selector] ?? '',
    })];
  }

  for (const [name, value] of Object.entries(metaMap)) {
    if (selector === `meta[property="${name}"]` || selector === `meta[name="${name}"]`) {
      return [new FakeElement({
        tagName: 'meta',
        attributes: {
          content: value,
        },
      })];
    }
  }

  return [];
}

function buildSelectorMap(fixture) {
  const selectors = new Set([
    ...Object.keys(fixture.textMap ?? {}),
    ...Object.keys(fixture.hrefMap ?? {}),
    ...Object.keys(fixture.textsMap ?? {}),
    ...Object.keys(fixture.hrefsMap ?? {}),
    ...Object.keys(fixture.valuesMap ?? {}),
  ]);
  for (const name of Object.keys(fixture.metaMap ?? {})) {
    selectors.add(`meta[property="${name}"]`);
    selectors.add(`meta[name="${name}"]`);
  }

  const selectorMap = new Map();
  for (const selector of selectors) {
    selectorMap.set(selector, createElementsForSelector(selector, fixture));
  }
  return selectorMap;
}

async function readSiteProfile(siteKey) {
  if (!SITE_PROFILE_CACHE.has(siteKey)) {
    const loader = SITE_PROFILE_LOADERS.get(siteKey);
    assert.ok(loader, `missing site profile loader for ${siteKey}`);
    SITE_PROFILE_CACHE.set(siteKey, loader());
  }
  return SITE_PROFILE_CACHE.get(siteKey);
}

function computeNodeSignature(fixture, siteProfile) {
  return computePageStateSignature({
    finalUrl: fixture.finalUrl,
    title: fixture.title,
    rawHtml: fixture.rawHtml ?? '',
    documentText: fixture.documentText ?? '',
    queryInputValue: fixture.queryInputValue ?? '',
    ...createSelectorReaders(fixture),
  }, siteProfile);
}

function computeBrowserSignature(fixture, siteProfile) {
  const document = new FakeDocument(fixture);
  const location = new URL(fixture.finalUrl);
  const window = {
    innerWidth: 1440,
    innerHeight: 900,
    getComputedStyle() {
      return {
        display: 'block',
        visibility: 'visible',
        pointerEvents: 'auto',
      };
    },
  };

  const context = vm.createContext({
    URL,
    document,
    window,
    location,
    Element: FakeElement,
  });
  context.globalThis = context;
  vm.runInContext(createPageStateHelperBundleSource('__BWS_CONTRACT__'), context);
  context.siteProfile = siteProfile;
  return JSON.parse(JSON.stringify(
    vm.runInContext('globalThis["__BWS_CONTRACT__"].pageComputeStateSignature(siteProfile)', context),
  ));
}

function assertRuntimeEvidenceSubset(actual, expected) {
  assert.equal(actual, expected, 'runtimeEvidence should match when expected is null');
}

function assertPageFactsValue(actualPageFacts, key, expectedValue) {
  assert.deepEqual(actualPageFacts?.[key], expectedValue, `pageFacts.${key}`);
}

function assertRuntimeEvidenceValue(actualRuntimeEvidence, key, expectedValue) {
  assert.deepEqual(actualRuntimeEvidence?.[key], expectedValue, `runtimeEvidence.${key}`);
}

async function assertContractScenario(scenario) {
  const siteProfile = await readSiteProfile(scenario.siteKey);
  const nodeSignature = computeNodeSignature(scenario.fixture, siteProfile);
  const browserSignature = computeBrowserSignature(scenario.fixture, siteProfile);

  scenario.validate(nodeSignature);
  assert.equal(browserSignature.pageType, nodeSignature.pageType);
  assert.deepEqual(browserSignature.pageFacts, nodeSignature.pageFacts);
  assert.deepEqual(browserSignature.runtimeEvidence, nodeSignature.runtimeEvidence);
}

const scenarios = [
  {
    name: 'bilibili detail page-state fixtures',
    siteKey: 'bilibili',
    fixture: {
      finalUrl: 'https://www.bilibili.com/video/BV1WjDDBGE3p',
      title: 'Test Video Title - bilibili',
      documentText: '"aid":987654321,"bvid":"BV1WjDDBGE3p","mid":1202350411',
      textMap: {
        'h1.video-title': 'Test Video Title',
        'a.up-name': 'Test Uploader',
        '.video-info-detail a': 'Knowledge',
        time: '2026-04-16 10:00:00',
      },
      hrefMap: {
        'a.up-name[href*="space.bilibili.com/"]': 'https://space.bilibili.com/1202350411',
      },
      textsMap: {
        '.tag-link': ['Tutorial', 'Knowledge'],
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'book-detail-page');
      assertPageFactsValue(signature.pageFacts, 'contentType', 'video');
      assertPageFactsValue(signature.pageFacts, 'contentTitle', 'Test Video Title');
      assertPageFactsValue(signature.pageFacts, 'authorMid', '1202350411');
      assertPageFactsValue(signature.pageFacts, 'bvid', 'BV1WjDDBGE3p');
      assertPageFactsValue(signature.pageFacts, 'publishedAt', '2026-04-16 10:00:00');
      assertPageFactsValue(signature.pageFacts, 'tagNames', ['Tutorial', 'Knowledge']);
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'bilibili search-results fixtures',
    siteKey: 'bilibili',
    fixture: {
      finalUrl: 'https://search.bilibili.com/video?keyword=BV1WjDDBGE3p',
      title: 'BV1WjDDBGE3p - bilibili',
      textsMap: {
        'a[href*="//www.bilibili.com/video/"]': ['Video One', 'Video Two'],
      },
      hrefsMap: {
        'a[href*="//www.bilibili.com/video/"]': [
          'https://www.bilibili.com/video/BV1WjDDBGE3p',
          'https://www.bilibili.com/video/BV1uT41147VW',
        ],
        'a[href*="//space.bilibili.com/"]': [
          'https://space.bilibili.com/1202350411',
          'https://space.bilibili.com/1202350412',
        ],
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'search-results-page');
      assertPageFactsValue(signature.pageFacts, 'queryText', 'BV1WjDDBGE3p');
      assertPageFactsValue(signature.pageFacts, 'searchSection', 'video');
      assertPageFactsValue(signature.pageFacts, 'resultCount', 2);
      assertPageFactsValue(signature.pageFacts, 'resultTitles', ['Video One', 'Video Two']);
      assertPageFactsValue(signature.pageFacts, 'resultBvids', ['BV1WjDDBGE3p', 'BV1uT41147VW']);
      assertPageFactsValue(signature.pageFacts, 'resultAuthorMids', ['1202350411', '1202350412']);
      assertPageFactsValue(signature.pageFacts, 'firstResultUrl', 'https://www.bilibili.com/video/BV1WjDDBGE3p');
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'bilibili dynamic author-list anti-crawl fixtures',
    siteKey: 'bilibili',
    fixture: {
      finalUrl: 'https://space.bilibili.com/1202350411/dynamic',
      title: 'Test Uploader dynamic - bilibili',
      documentText: '\u8bbf\u95ee\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\uff0c\u5b8c\u6210\u5b89\u5168\u9a8c\u8bc1\u540e\u7ee7\u7eed\u8bbf\u95ee',
      textMap: {
        '.nickname': 'Test Uploader',
      },
      textsMap: {
        'a[href*="//www.bilibili.com/video/"]': ['Dynamic Video One'],
      },
      hrefsMap: {
        'a[href*="//www.bilibili.com/video/"]': [
          'https://www.bilibili.com/video/BV1WjDDBGE3p',
        ],
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'author-list-page');
      assertPageFactsValue(signature.pageFacts, 'authorName', 'Test Uploader');
      assertPageFactsValue(signature.pageFacts, 'authorMid', '1202350411');
      assertPageFactsValue(signature.pageFacts, 'authorSubpage', 'dynamic');
      assertPageFactsValue(signature.pageFacts, 'featuredContentTitles', ['Dynamic Video One']);
      assertPageFactsValue(signature.pageFacts, 'featuredContentBvids', ['BV1WjDDBGE3p']);
      assertPageFactsValue(signature.pageFacts, 'antiCrawlDetected', true);
      assertPageFactsValue(signature.pageFacts, 'antiCrawlSignals', ['rate-limit', 'verify', 'retry-later']);
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'antiCrawlDetected', true);
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'antiCrawlReasonCode', 'anti-crawl-verify');
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'networkRiskDetected', true);
    },
  },
  {
    name: 'douyin anti-crawl authenticated author-list fixtures',
    siteKey: 'douyin',
    fixture: {
      finalUrl: 'https://www.douyin.com/user/self?showTab=like',
      title: '\u9a8c\u8bc1\u7801\u4e2d\u95f4\u9875',
      documentText: '\u9a8c\u8bc1\u7801\u4e2d\u95f4\u9875 middle_page_loading',
    },
    validate(signature) {
      assert.equal(signature.pageType, 'author-list-page');
      assertPageFactsValue(signature.pageFacts, 'authorSubpage', 'like');
      assertPageFactsValue(signature.pageFacts, 'antiCrawlDetected', true);
      assertPageFactsValue(signature.pageFacts, 'antiCrawlSignals', ['challenge', 'middle-page-loading', 'verify']);
      assertPageFactsValue(signature.pageFacts, 'antiCrawlReasonCode', 'anti-crawl-verify');
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'antiCrawlDetected', true);
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'antiCrawlSignals', ['challenge', 'middle-page-loading', 'verify']);
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'antiCrawlReasonCode', 'anti-crawl-verify');
    },
  },
  {
    name: 'douyin public author-page fixtures',
    siteKey: 'douyin',
    fixture: {
      finalUrl: 'https://www.douyin.com/user/MS4wLjABAAAAexample',
      title: 'Sample Creator - Douyin',
      documentText: 'Sample Creator no more content',
      rawHtml: '<script>{"awemeId":"7487317288315258152","createTime":1776450600}{"awemeId":"7487317288315258153","createTime":1776537000}</script>',
      textMap: {
        h1: 'Sample Creator',
      },
      textsMap: {
        'a[href*="/video/"]': ['Video One', 'Video Two'],
      },
      hrefsMap: {
        'a[href*="/video/"]': [
          'https://www.douyin.com/video/7487317288315258152',
          'https://www.douyin.com/video/7487317288315258153',
        ],
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'author-page');
      assertPageFactsValue(signature.pageFacts, 'authorName', 'Sample Creator');
      assertPageFactsValue(signature.pageFacts, 'authorSubpage', 'home');
      assertPageFactsValue(signature.pageFacts, 'featuredContentCount', 2);
      assertPageFactsValue(signature.pageFacts, 'featuredContentComplete', true);
      assertPageFactsValue(signature.pageFacts, 'featuredContentVideoIds', ['7487317288315258152', '7487317288315258153']);
      assertPageFactsValue(signature.pageFacts, 'featuredContentPublishedDayKeys', ['2026-04-18', '2026-04-19']);
      assert.equal(signature.pageFacts?.featuredContentCards?.[0]?.publishedAt, '2026-04-17T18:30:00.000Z');
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'douyin content-detail fixtures with encoded author payloads',
    siteKey: 'douyin',
    fixture: {
      finalUrl: 'https://www.douyin.com/video/7487317288315258152',
      title: 'Sample Video - Douyin',
      documentText: 'Sample Video',
      rawHtml: '<script>var payload="%22nickname%22%3A%22yuetong.l%22%2C%22sec_uid%22%3A%22MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ%22";</script>',
      textMap: {
        h1: 'Sample Video',
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'book-detail-page');
      assertPageFactsValue(signature.pageFacts, 'contentTitle', 'Sample Video');
      assertPageFactsValue(signature.pageFacts, 'authorName', 'yuetong.l');
      assertPageFactsValue(
        signature.pageFacts,
        'authorUserId',
        'MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ',
      );
      assertPageFactsValue(
        signature.pageFacts,
        'authorUrl',
        'https://www.douyin.com/user/MS4wLjABAAAAD_rgoQxZRb5ZZdRaJIEEaRVq2h3_1YwTXfUhFGJPDhL0-oL-nDOYSn-y_wsCnjsZ',
      );
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'xiaohongshu content-detail fixtures from initial state',
    siteKey: 'xiaohongshu',
    fixture: {
      finalUrl: 'https://www.xiaohongshu.com/explore/662233445566778899aabbcc',
      title: '\u6625\u65e5\u6781\u7b80\u7a7f\u642d - \u5c0f\u7ea2\u4e66',
      rawHtml: '<script>window.__INITIAL_STATE__={"user":{"userInfo":{"userId":undefined,"redId":undefined}},"note":{"noteDetailMap":{"662233445566778899aabbcc":{"note":{"noteId":"662233445566778899aabbcc","title":"\\u6625\\u65e5\\u6781\\u7b80\\u7a7f\\u642d","desc":"\\u4e00\\u5468\\u53ef\\u4ee5\\u53cd\\u590d\\u7a7f\\u7684\\u8f7b\\u901a\\u52e4\\u642d\\u914d\\u3002","type":"normal","time":1776450600,"user":{"userId":"user-1","nickname":"\\u7a7f\\u642d\\u7814\\u7a76\\u6240","redId":"red-1"},"tagList":[{"name":"\\u901a\\u52e4\\u7a7f\\u642d"},{"name":"\\u6781\\u7b80"}],"imageList":[{"traceId":"img-1","width":1080,"height":1440,"urlDefault":"//ci.xiaohongshu.com/img-1-default.webp","urlPre":"//ci.xiaohongshu.com/img-1-preview.webp","infoList":[{"url":"//ci.xiaohongshu.com/img-1-preview.webp","imageScene":"WB_PRV"},{"url":"//ci.xiaohongshu.com/img-1-default.webp","imageScene":"WB_DFT"}]}]}}}}}</script>',
    },
    validate(signature) {
      assert.equal(signature.pageType, 'book-detail-page');
      assertPageFactsValue(signature.pageFacts, 'noteId', '662233445566778899aabbcc');
      assertPageFactsValue(signature.pageFacts, 'contentTitle', '\u6625\u65e5\u6781\u7b80\u7a7f\u642d');
      assertPageFactsValue(signature.pageFacts, 'contentExcerpt', '\u4e00\u5468\u53ef\u4ee5\u53cd\u590d\u7a7f\u7684\u8f7b\u901a\u52e4\u642d\u914d\u3002');
      assertPageFactsValue(signature.pageFacts, 'authorName', '\u7a7f\u642d\u7814\u7a76\u6240');
      assertPageFactsValue(signature.pageFacts, 'authorUserId', 'user-1');
      assertPageFactsValue(signature.pageFacts, 'authorRedId', 'red-1');
      assertPageFactsValue(signature.pageFacts, 'userId', 'user-1');
      assertPageFactsValue(signature.pageFacts, 'publishedDayKey', '2026-04-18');
      assertPageFactsValue(signature.pageFacts, 'tagNames', ['\u901a\u52e4\u7a7f\u642d', '\u6781\u7b80']);
      assertPageFactsValue(signature.pageFacts, 'contentImageCount', 1);
      assertPageFactsValue(signature.pageFacts, 'contentImageUrls', ['https://ci.xiaohongshu.com/img-1-default.webp']);
      assertPageFactsValue(signature.pageFacts, 'contentImagePreviewUrls', ['https://ci.xiaohongshu.com/img-1-preview.webp']);
      assertPageFactsValue(signature.pageFacts, 'primaryImageUrl', 'https://ci.xiaohongshu.com/img-1-default.webp');
      assert.equal(signature.pageFacts?.contentImages?.[0]?.width, 1080);
      assert.equal(signature.pageFacts?.contentImages?.[0]?.height, 1440);
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'xiaohongshu content-detail fixtures with dom fallback',
    siteKey: 'xiaohongshu',
    fixture: {
      finalUrl: 'https://www.xiaohongshu.com/explore/fallback-note-1',
      title: '\u6625\u65e5\u6781\u7b80\u7a7f\u642d - \u5c0f\u7ea2\u4e66',
      textMap: {
        '.note-content .title': '\u6625\u65e5\u6781\u7b80\u7a7f\u642d',
        '.note-content .desc': '\u4e00\u5468\u53ef\u4ee5\u53cd\u590d\u7a7f\u7684\u8f7b\u901a\u52e4\u642d\u914d\u3002',
        '.author-wrapper .name': '\u7a7f\u642d\u7814\u7a76\u6240',
        '.note-content .date': '2026-04-18',
      },
      hrefMap: {
        'a[href*="/user/profile/"]': 'https://www.xiaohongshu.com/user/profile/user-1?xsec_source=pc_note',
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'book-detail-page');
      assertPageFactsValue(signature.pageFacts, 'noteId', 'fallback-note-1');
      assertPageFactsValue(signature.pageFacts, 'contentTitle', '\u6625\u65e5\u6781\u7b80\u7a7f\u642d');
      assertPageFactsValue(signature.pageFacts, 'contentExcerpt', '\u4e00\u5468\u53ef\u4ee5\u53cd\u590d\u7a7f\u7684\u8f7b\u901a\u52e4\u642d\u914d\u3002');
      assertPageFactsValue(signature.pageFacts, 'authorName', '\u7a7f\u642d\u7814\u7a76\u6240');
      assertPageFactsValue(signature.pageFacts, 'authorUrl', 'https://www.xiaohongshu.com/user/profile/user-1');
      assertPageFactsValue(signature.pageFacts, 'authorUserId', 'user-1');
      assertPageFactsValue(signature.pageFacts, 'publishedTimeText', '2026-04-18');
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'xiaohongshu search-results fixtures from initial state',
    siteKey: 'xiaohongshu',
    fixture: {
      finalUrl: 'https://www.xiaohongshu.com/search_result?keyword=%E7%A9%BF%E6%90%AD',
      title: '\u7a7f\u642d - \u641c\u7d22\u7ed3\u679c - \u5c0f\u7ea2\u4e66',
      rawHtml: '<script>window.__INITIAL_STATE__={"search":{"searchContext":{"keyword":"\\u7a7f\\u642d","page":1,"pageSize":20,"noteType":0},"currentSearchType":"all","feeds":[{"id":"feed-1","noteCard":{"noteId":"note-1","displayTitle":"\\u6625\\u65e5\\u7a7f\\u642d\\u6a21\\u677f","type":"normal","user":{"userId":"user-1","nickname":"\\u5c0f\\u660e"}}},{"id":"feed-2","noteCard":{"noteId":"note-2","displayTitle":"\\u9ed1\\u767d\\u6781\\u7b80\\u7a7f\\u642d","type":"video","time":1776537000,"user":{"userId":"user-2","nickName":"\\u5c0f\\u7f8e"}}}]}}</script>',
    },
    validate(signature) {
      assert.equal(signature.pageType, 'search-results-page');
      assertPageFactsValue(signature.pageFacts, 'queryText', '\u7a7f\u642d');
      assertPageFactsValue(signature.pageFacts, 'searchSection', 'all');
      assertPageFactsValue(signature.pageFacts, 'resultCount', 2);
      assertPageFactsValue(signature.pageFacts, 'resultTitles', ['\u6625\u65e5\u7a7f\u642d\u6a21\u677f', '\u9ed1\u767d\u6781\u7b80\u7a7f\u642d']);
      assertPageFactsValue(signature.pageFacts, 'resultNoteIds', ['note-1', 'note-2']);
      assertPageFactsValue(signature.pageFacts, 'firstResultUrl', 'https://www.xiaohongshu.com/explore/note-1');
      assertPageFactsValue(signature.pageFacts, 'resultAuthorUserIds', ['user-1', 'user-2']);
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'xiaohongshu author-page fixtures merge state and dom cards',
    siteKey: 'xiaohongshu',
    fixture: {
      finalUrl: 'https://www.xiaohongshu.com/user/profile/user-1',
      title: '\u7a7f\u642d\u7814\u7a76\u6240\u7684\u4e2a\u4eba\u4e3b\u9875 - \u5c0f\u7ea2\u4e66',
      rawHtml: '<script>window.__INITIAL_STATE__={"user":{"userPageData":{"basicInfo":{"nickname":"\\u7a7f\\u642d\\u7814\\u7a76\\u6240","desc":"\\u5206\\u4eab\\u8f7b\\u901a\\u52e4\\u548c\\u57fa\\u7840\\u6b3e","redId":"red-1"}},"notes":[[{"noteCard":{"noteId":"","displayTitle":"\\u6625\\u65e5\\u7a7f\\u642d\\u6a21\\u677f","type":"normal","user":{"userId":"user-1","nickname":"\\u7a7f\\u642d\\u7814\\u7a76\\u6240"}}},{"noteCard":{"noteId":"note-2","displayTitle":"\\u9ed1\\u767d\\u6781\\u7b80\\u7a7f\\u642d","type":"video","time":1776537000,"user":{"userId":"user-1","nickname":"\\u7a7f\\u642d\\u7814\\u7a76\\u6240"}}}]]}}</script>',
      textsMap: {
        'section.note-item .footer .title': ['\u6625\u65e5\u7a7f\u642d\u6a21\u677f', '\u9ed1\u767d\u6781\u7b80\u7a7f\u642d'],
        '.author-wrapper .name': ['\u7a7f\u642d\u7814\u7a76\u6240', '\u7a7f\u642d\u7814\u7a76\u6240'],
      },
      hrefsMap: {
        'section.note-item a[href*="/explore/"]': [
          'https://www.xiaohongshu.com/explore/note-1?xsec_token=test',
          'https://www.xiaohongshu.com/explore/note-2?xsec_token=test',
        ],
        '.author-wrapper a[href*="/user/profile/"]': [
          'https://www.xiaohongshu.com/user/profile/user-1',
        ],
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'author-page');
      assertPageFactsValue(signature.pageFacts, 'authorName', '\u7a7f\u642d\u7814\u7a76\u6240');
      assertPageFactsValue(signature.pageFacts, 'authorUserId', 'user-1');
      assertPageFactsValue(signature.pageFacts, 'authorRedId', 'red-1');
      assertPageFactsValue(signature.pageFacts, 'authorBio', '\u5206\u4eab\u8f7b\u901a\u52e4\u548c\u57fa\u7840\u6b3e');
      assertPageFactsValue(signature.pageFacts, 'featuredContentCount', 2);
      assertPageFactsValue(signature.pageFacts, 'featuredContentTitles', ['\u6625\u65e5\u7a7f\u642d\u6a21\u677f', '\u9ed1\u767d\u6781\u7b80\u7a7f\u642d']);
      assertPageFactsValue(signature.pageFacts, 'featuredContentNoteIds', ['note-1', 'note-2']);
      assertPageFactsValue(signature.pageFacts, 'featuredContentUrls', [
        'https://www.xiaohongshu.com/explore/note-1',
        'https://www.xiaohongshu.com/explore/note-2',
      ]);
      assertRuntimeEvidenceSubset(signature.runtimeEvidence, null);
    },
  },
  {
    name: 'xiaohongshu restriction-page fixtures surface anti-crawl runtime evidence',
    siteKey: 'xiaohongshu',
    fixture: {
      finalUrl: 'https://www.xiaohongshu.com/website-login/error?error_code=300012&error_msg=%E8%AF%B7%E5%88%87%E6%8D%A2%E5%8F%AF%E9%9D%A0%E7%BD%91%E7%BB%9C%E7%8E%AF%E5%A2%83%E5%90%8E%E9%87%8D%E8%AF%95&redirectPath=%2Fexplore',
      title: '\u5b89\u5168\u9650\u5236',
      documentText: '\u5b89\u5168\u9650\u5236 IP\u5b58\u5728\u98ce\u9669 \u8bf7\u5207\u6362\u53ef\u9760\u7f51\u7edc\u73af\u5883\u540e\u91cd\u8bd5',
      textMap: {
        '.restricted-content': '\u8bf7\u5207\u6362\u53ef\u9760\u7f51\u7edc\u73af\u5883\u540e\u91cd\u8bd5',
        '.desc-code': '300012',
      },
    },
    validate(signature) {
      assert.equal(signature.pageType, 'auth-page');
      assertPageFactsValue(signature.pageFacts, 'antiCrawlDetected', true);
      assertPageFactsValue(signature.pageFacts, 'antiCrawlSignals', ['ip-risk', 'risk-control', 'verify']);
      assertPageFactsValue(signature.pageFacts, 'antiCrawlReasonCode', 'anti-crawl-verify');
      assertPageFactsValue(signature.pageFacts, 'riskPageDetected', true);
      assertPageFactsValue(signature.pageFacts, 'riskPageCode', '300012');
      assertPageFactsValue(signature.pageFacts, 'riskPageTitle', '\u5b89\u5168\u9650\u5236');
      assertPageFactsValue(signature.pageFacts, 'riskPageMessage', '\u8bf7\u5207\u6362\u53ef\u9760\u7f51\u7edc\u73af\u5883\u540e\u91cd\u8bd5');
      assertPageFactsValue(signature.pageFacts, 'redirectPath', '/explore');
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'antiCrawlDetected', true);
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'antiCrawlReasonCode', 'anti-crawl-verify');
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'networkRiskDetected', true);
      assertRuntimeEvidenceValue(signature.runtimeEvidence, 'noDedicatedIpRiskDetected', true);
    },
  },
];

for (const scenario of scenarios) {
  test(`browser helper and node runtime agree on ${scenario.name}`, async () => {
    await assertContractScenario(scenario);
  });
}
