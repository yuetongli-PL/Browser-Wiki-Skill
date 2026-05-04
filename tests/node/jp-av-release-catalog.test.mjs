import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildKMProduceArchiveUrls,
  collectJpAvReleaseCatalog,
  parseDahliaDetailHtml,
  parseDahliaListHtml,
  parseKMProduceDetailHtml,
  parseKMProduceListHtml,
  parseMaxingDetailHtml,
  parseMaxingListHtml,
  parseTPowersReleaseHomeHtml,
  parseTPowersReleaseMonthHtml,
  toIsoDate,
} from '../../src/sites/jp-av-catalog/queries/release-catalog.mjs';

const RANGE = Object.freeze({ startDate: '2026-01-01', endDate: '2026-05-04' });

test('JP AV release catalog helpers parse site-specific public list/detail shapes', () => {
  assert.equal(toIsoDate('2026年5月4日'), '2026-05-04');
  assert.equal(toIsoDate('2026/5/4'), '2026-05-04');

  const dahliaList = parseDahliaListHtml(`
    <a href="/works/dldss500/">detail</a>
    <a href="/work/page/2/">next</a>
  `);
  assert.deepEqual(dahliaList.detailUrls, ['https://dahlia-av.jp/works/dldss500/']);
  assert.deepEqual(dahliaList.nextPageUrls, ['https://dahlia-av.jp/work/page/2/']);

  const dahliaDetail = parseDahliaDetailHtml(`
    <h1>Dahlia Release Fixture</h1>
    <li><span>配信開始日</span>2026/05/04</li>
    <li><span>発売日</span>2026/05/09</li>
    <li><span>品番</span>DLDSS-500</li>
    <li><span>出演女優</span>Public Performer</li>
  `, { url: 'https://dahlia-av.jp/works/dldss500/', range: RANGE });
  assert.equal(dahliaDetail.releaseDate, '2026-05-04');
  assert.equal(dahliaDetail.workId, 'DLDSS-500');

  const tPowersMonths = parseTPowersReleaseHomeHtml(`
    <a href="/release/2026/05/">2026 May</a>
    <a href="/release/2026/06/">future</a>
  `, RANGE);
  assert.deepEqual(tPowersMonths, ['https://www.t-powers.co.jp/release/2026/05/']);

  const tPowersRows = parseTPowersReleaseMonthHtml(`
    <article class="p-release__list-item">
      <a href="https://example.invalid/?skuId=ABF-341">external product</a>
      <h3 class="p-release__list-item-title">T-Powers Release Fixture</h3>
      発売日：2026/05/01<br>
      メーカー名：Public Maker<br>
    </article>
  `, { sourceUrl: 'https://www.t-powers.co.jp/release/2026/05/', range: RANGE });
  assert.equal(tPowersRows.length, 1);
  assert.equal(tPowersRows[0].workId, 'ABF-341');
  assert.equal(tPowersRows[0].tagsOrGenres, 'メーカー名:Public Maker');

  const kmpArchives = buildKMProduceArchiveUrls(RANGE);
  assert.equal(kmpArchives.includes('https://www.km-produce.com/works?archive=2026%E5%B9%B45%E6%9C%88'), true);
  const kmpCandidates = parseKMProduceListHtml(`
    <article class="post">
      <h3><a href="works/savr-1045">KMP short title</a></h3>
      <p class="label"><a>KMP Label</a></p>
      <dl class="data"><dt>発売日</dt><dd>2026/5/4</dd></dl>
      <p class="jk"><a href="works/savr-1045"><img alt="KMP Release Fixture"></a></p>
    </article>
  `, { sourceUrl: 'https://www.km-produce.com/works', range: RANGE });
  assert.equal(kmpCandidates[0].detailUrl, 'https://www.km-produce.com/works/savr-1045');
  const kmpDetail = parseKMProduceDetailHtml(`
    <h1>KMP Release Fixture</h1>
    <dl>
      <dt>出演女優</dt><dd>KM Performer</dd>
      <dt>ジャンル</dt><dd>public catalog</dd>
      <dt>発売日</dt><dd>2026/5/4</dd>
      <dt>品番</dt><dd>SAVR-1045</dd>
    </dl>
  `, { url: kmpCandidates[0].detailUrl, fallback: kmpCandidates[0], range: RANGE });
  assert.equal(kmpDetail.actors, 'KM Performer');
  assert.equal(kmpDetail.tagsOrGenres, 'public catalog');

  const maxingLinks = parseMaxingListHtml(`
    <td class="proTd">
      <a href="https://www.maxing.jp/shop/pid/5632.html">detail</a>
      <p>2026/04/16発売</p>
    </td>
  `);
  assert.deepEqual(maxingLinks, ['https://www.maxing.jp/shop/pid/5632.html']);
  const maxingDetail = parseMaxingDetailHtml(`
    <h2 class="pdetail">MAXING Release Fixture</h2>
    <dl>
      <dt>品番</dt><dd>MXGS-1424</dd>
      <dt>発売日</dt><dd>2026年04月16日</dd>
      <dt>女優</dt><dd>Maxing Performer</dd>
      <dt>レーベル</dt><dd>MAXING</dd>
    </dl>
  `, { url: maxingLinks[0], range: RANGE });
  assert.equal(maxingDetail.workId, 'MXGS-1424');
  assert.equal(maxingDetail.releaseDate, '2026-04-16');
});

test('JP AV release catalog collector aggregates expected sites and explicit blocked/skipped coverage', async () => {
  const fetchHtml = async (url) => {
    if (url.endsWith('/works/date')) {
      return '<a>2026年5月4日</a>';
    }
    if (url.includes('/works/list/date/2026-05-04')) {
      const host = new URL(url).origin;
      return `<a href="${host}/works/detail/SAMPLE001/"><p class="text">Date Family Fixture</p></a>`;
    }
    if (/\/works\/detail\/SAMPLE001\/?$/u.test(url)) {
      return `
        <h1>Date Family Fixture</h1>
        <dl>
          <dt>品番</dt><dd>DF-001</dd>
          <dt>女優</dt><dd>Date Performer</dd>
          <dt>ジャンル</dt><dd>date catalog</dd>
          <dt>発売日</dt><dd>2026年5月4日</dd>
        </dl>
      `;
    }
    if (url === 'https://dahlia-av.jp/work/') {
      return '<a href="/works/dldss500/">Dahlia detail</a>';
    }
    if (url === 'https://dahlia-av.jp/works/dldss500/') {
      return `
        <h1>Dahlia Fixture</h1>
        <li><span>配信開始日</span>2026/05/04</li>
        <li><span>品番</span>DLDSS-500</li>
        <li><span>出演女優</span>Dahlia Performer</li>
      `;
    }
    if (url === 'https://www.t-powers.co.jp/release/') {
      return '<a href="/release/2026/05/">May releases</a>';
    }
    if (url === 'https://www.t-powers.co.jp/release/2026/05/') {
      return `
        <article class="p-release__list-item">
          <a href="https://example.invalid/?skuId=ABF-341">external</a>
          <h3 class="p-release__list-item-title">T-Powers Fixture</h3>
          発売日：2026/05/01<br>
          メーカー名：Public Maker<br>
        </article>
      `;
    }
    if (url.startsWith('https://www.km-produce.com/works?archive=') || url === 'https://www.km-produce.com/works') {
      return `
        <article class="post">
          <h3><a href="works/savr-1045">KMP short title</a></h3>
          <p class="label"><a>KMP Label</a></p>
          <dl class="data"><dt>発売日</dt><dd>2026/5/4</dd></dl>
          <p class="jk"><a href="works/savr-1045"><img alt="KMP Fixture"></a></p>
        </article>
      `;
    }
    if (url === 'https://www.km-produce.com/works/savr-1045') {
      return `
        <h1>KMP Fixture</h1>
        <dl>
          <dt>出演女優</dt><dd>KM Performer</dd>
          <dt>ジャンル</dt><dd>public catalog</dd>
          <dt>発売日</dt><dd>2026/5/4</dd>
          <dt>品番</dt><dd>SAVR-1045</dd>
        </dl>
      `;
    }
    if ([
      'https://www.maxing.jp/shop/now_release.html',
      'https://www.maxing.jp/shop/search.html',
      'https://www.maxing.jp/top/',
    ].includes(url)) {
      return '<td class="proTd"><a href="https://www.maxing.jp/shop/pid/5632.html">detail</a><p>2026/04/16発売</p></td>';
    }
    if (url === 'https://www.maxing.jp/shop/pid/5632.html') {
      return `
        <h2 class="pdetail">MAXING Fixture</h2>
        <dl>
          <dt>品番</dt><dd>MXGS-1424</dd>
          <dt>発売日</dt><dd>2026年04月16日</dd>
          <dt>女優</dt><dd>Maxing Performer</dd>
          <dt>レーベル</dt><dd>MAXING</dd>
        </dl>
      `;
    }
    throw new Error(`Unexpected fixture URL: ${url}`);
  };

  const catalog = await collectJpAvReleaseCatalog({
    ...RANGE,
    fetchHtml,
    concurrency: 2,
    maxPages: 2,
  });

  assert.equal(catalog.schemaVersion, 'jp-av-release-catalog/v1');
  assert.equal(catalog.coverage.moodyz.count, 1);
  assert.equal(catalog.coverage.s1.count, 1);
  assert.equal(catalog.coverage.attackers.count, 1);
  assert.equal(catalog.coverage['madonna-av'].count, 1);
  assert.equal(catalog.coverage['rookie-av'].count, 1);
  assert.equal(catalog.coverage['dahlia-av'].count, 1);
  assert.equal(catalog.coverage['t-powers'].count, 1);
  assert.equal(catalog.coverage['km-produce'].count, 1);
  assert.equal(catalog.coverage.maxing.count, 1);
  assert.equal(catalog.coverage.maxing.status, 'partial');
  assert.equal(catalog.coverage['8man'].status, 'skipped');
  assert.equal(catalog.coverage.sod.status, 'blocked');
  assert.equal(catalog.coverage.dogma.status, 'blocked');
  assert.equal(catalog.total, 9);
  assert.equal(catalog.failures.some((failure) => failure.reasonCode === 'no_release_catalog'), true);
  assert.equal(catalog.failures.some((failure) => failure.reasonCode === 'entry_unreachable_or_504'), true);
  assert.equal(catalog.failures.some((failure) => failure.reasonCode === 'age_or_entry_boundary'), true);
  assert.equal(catalog.works.some((work) => work.siteKey === 'km-produce' && work.workId === 'SAVR-1045'), true);
  assert.equal(catalog.works.some((work) => work.siteKey === 't-powers' && work.workId === 'ABF-341'), true);
});
