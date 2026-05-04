import test from 'node:test';
import assert from 'node:assert/strict';

import { API_CANDIDATE_SCHEMA_VERSION } from '../../src/sites/capability/api-candidates.mjs';
import {
  JP_AV_CATALOG_SITE_CONFIGS,
  dogmaAdapter,
  eightManAdapter,
  kmProduceAdapter,
  maxingAdapter,
  tPowersAdapter,
} from '../../src/sites/core/adapters/jp-av-catalog.mjs';
import { listSiteAdapters } from '../../src/sites/core/adapters/resolver.mjs';

const JP_AV_SITE_FIXTURES = Object.freeze([
  {
    siteKey: 'rookie-av',
    host: 'rookie-av.jp',
    candidatePath: '/api/works?page=1',
  },
  {
    siteKey: 'madonna-av',
    host: 'madonna-av.com',
    candidatePath: '/ajax/works?page=1',
  },
  {
    siteKey: 'dahlia-av',
    host: 'dahlia-av.jp',
    candidatePath: '/api/works?page=1',
  },
  {
    siteKey: 'sod',
    host: 'www.sod.co.jp',
    candidatePath: '/api/prime/videos?page=1',
  },
  {
    siteKey: 's1',
    host: 's1s1s1.com',
    candidatePath: '/ajax/works?page=1',
  },
  {
    siteKey: 'attackers',
    host: 'attackers.net',
    candidatePath: '/api/works?page=1',
  },
  {
    siteKey: 't-powers',
    host: 'www.t-powers.co.jp',
    candidatePath: '/wp-json/wp/v2/search?search=sample',
  },
  {
    siteKey: '8man',
    host: 'www.8man.jp',
    candidatePath: '/wp-json/wp/v2/search?search=sample',
  },
  {
    siteKey: 'dogma',
    host: 'www.dogma.co.jp',
    candidatePath: '/api/products?page=1',
  },
  {
    siteKey: 'km-produce',
    host: 'www.km-produce.com',
    candidatePath: '/wp-json/wp/v2/search?search=sample',
  },
  {
    siteKey: 'maxing',
    host: 'www.maxing.jp',
    candidatePath: '/ajax/products?page=1',
  },
]);

const PROFILE_PARSE_FIXTURES = Object.freeze([
  {
    label: 'T-POWERS talent page',
    adapter: tPowersAdapter,
    siteKey: 't-powers',
    host: 'www.t-powers.co.jp',
    url: 'https://www.t-powers.co.jp/talent/tpw-performer-001/',
    workId: 'TPW-PERFORMER-001',
    title: 'T-POWERS Performer Fixture',
    performer: 'T-POWERS Performer',
  },
  {
    label: '8MAN profile page',
    adapter: eightManAdapter,
    siteKey: '8man',
    host: 'www.8man.jp',
    url: 'https://www.8man.jp/profile/eightman-performer-001/',
    workId: 'EIGHTMAN-PERFORMER-001',
    title: '8MAN Performer Fixture',
    performer: '8MAN Performer',
  },
  {
    label: 'DOGMA performer page',
    adapter: dogmaAdapter,
    siteKey: 'dogma',
    host: 'www.dogma.co.jp',
    url: 'http://www.dogma.co.jp/product/dogma-performer-001/',
    workId: 'DOGMA-PERFORMER-001',
    title: 'DOGMA Performer Fixture',
    performer: 'DOGMA Performer',
  },
  {
    label: 'KM Produce actress page',
    adapter: kmProduceAdapter,
    siteKey: 'km-produce',
    host: 'www.km-produce.com',
    url: 'https://www.km-produce.com/product/km-performer-001/',
    workId: 'KM-PERFORMER-001',
    title: 'KM Produce Performer Fixture',
    performer: 'KM Produce Performer',
  },
  {
    label: 'MAXING model page',
    adapter: maxingAdapter,
    siteKey: 'maxing',
    host: 'www.maxing.jp',
    url: 'https://www.maxing.jp/product/maxing-performer-001/',
    workId: 'MAXING-PERFORMER-001',
    title: 'MAXING Performer Fixture',
    performer: 'MAXING Performer',
  },
]);

function adapterFor(siteKey) {
  const adapter = listSiteAdapters().find((candidate) => candidate.id === siteKey);
  assert.ok(adapter, `${siteKey} adapter must be registered in listSiteAdapters()`);
  return adapter;
}

function apiCandidateFor(site, { status = 'observed' } = {}) {
  const protocol = site.siteKey === 'dogma' ? 'http' : 'https';
  return {
    schemaVersion: API_CANDIDATE_SCHEMA_VERSION,
    id: `${site.siteKey}-observed-public-catalog-api`,
    siteKey: site.siteKey,
    status,
    endpoint: {
      method: 'GET',
      url: `${protocol}://${site.host}${site.candidatePath}`,
    },
    source: 'observed-network-capture',
    evidence: {
      captureMode: 'public-catalog-observation',
    },
  };
}

function assertNoSensitiveMaterial(value, label) {
  const serialized = JSON.stringify(value);
  assert.doesNotMatch(
    serialized,
    /synthetic\s*(?:cookie|authorization|token|profile)|SESSDATA|Cookie|Authorization|access_token|csrf|sessionid|Bearer|profilePath|browserProfile/iu,
    `${label} must not expose raw session or credential material`,
  );
}

test('JP AV observed API candidates remain observed-only until verified and are not promoted', () => {
  for (const site of JP_AV_SITE_FIXTURES) {
    const adapter = adapterFor(site.siteKey);
    const candidate = apiCandidateFor(site, { status: 'observed' });

    assert.equal(typeof adapter.describeApiCandidateSemantics, 'function', `${site.siteKey} adapter must expose describeApiCandidateSemantics({ candidate, scope })`);
    assert.equal(typeof adapter.validateApiCandidate, 'function', `${site.siteKey} adapter must expose validateApiCandidate({ candidate, evidence, scope })`);
    assert.equal(typeof adapter.getApiCatalogUpgradePolicy, 'function', `${site.siteKey} adapter must expose getApiCatalogUpgradePolicy({ candidate, siteAdapterDecision, evidence, scope })`);

    const semantics = adapter.describeApiCandidateSemantics({ candidate });
    const decision = adapter.validateApiCandidate({ candidate });
    const policy = adapter.getApiCatalogUpgradePolicy({ candidate, siteAdapterDecision: decision });
    const status = adapter.apiDiscoveryStatus({ candidate });

    assert.equal(candidate.status, 'observed');
    assert.equal(decision.decision, 'accepted', `${site.siteKey} may recognize the endpoint only as an observed candidate`);
    assert.equal(policy.allowCatalogUpgrade, false, `${site.siteKey} must enforce a verified-only catalog policy`);
    assert.equal(policy.reasonCode, 'api-catalog-entry-blocked');
    assert.equal(policy.scope.policyMode, 'jp-av-catalog-public-api');
    assert.equal(semantics.risk.downloaderBoundary, 'not_supported');
    assert.equal(semantics.risk.downloaderReasonCode, 'downloader_not_allowed');
    assert.equal(status.status, 'observed_only');
    assert.equal(status.promotion, 'not_promoted');
    assert.equal(status.downloaderBoundary, 'not_supported');
    assert.equal(status.downloaderReasonCode, 'downloader_not_allowed');
    assert.equal(Object.hasOwn(policy, 'catalogEntry'), false);
    assert.equal(Object.hasOwn(policy, 'promotedApi'), false);
    assert.equal(Object.hasOwn(policy, 'promotion'), false);
    assertNoSensitiveMaterial({ semantics, decision, policy, status }, `${site.siteKey}.observed-api`);
  }
});

test('JP AV verified-only API policy still requires explicit verified status before catalog upgrade', () => {
  for (const site of JP_AV_SITE_FIXTURES) {
    const adapter = adapterFor(site.siteKey);
    const observedCandidate = apiCandidateFor(site, { status: 'observed' });
    const verifiedCandidate = apiCandidateFor(site, { status: 'verified' });
    const observedDecision = adapter.validateApiCandidate({ candidate: observedCandidate });
    const verifiedDecision = adapter.validateApiCandidate({ candidate: verifiedCandidate });

    const observedPolicy = adapter.getApiCatalogUpgradePolicy({
      candidate: observedCandidate,
      siteAdapterDecision: observedDecision,
    });
    const verifiedPolicy = adapter.getApiCatalogUpgradePolicy({
      candidate: verifiedCandidate,
      siteAdapterDecision: verifiedDecision,
    });

    assert.equal(observedPolicy.allowCatalogUpgrade, false);
    assert.equal(verifiedPolicy.allowCatalogUpgrade, true, `${site.siteKey} verified-only policy should allow catalog upgrade only after verified evidence`);
    assert.equal(Object.hasOwn(verifiedPolicy, 'promotedApi'), false);
    assert.equal(Object.hasOwn(verifiedPolicy, 'promotion'), false);
    assertNoSensitiveMaterial({ observedPolicy, verifiedPolicy }, `${site.siteKey}.verified-only-policy`);
  }
});

test('JP AV downloader boundary is uniformly not supported and not allowed', () => {
  for (const site of JP_AV_SITE_FIXTURES) {
    const adapter = adapterFor(site.siteKey);

    assert.equal(typeof adapter.downloaderBoundary, 'function', `${site.siteKey} adapter must expose downloaderBoundary()`);
    const boundary = adapter.downloaderBoundary();

    assert.equal(boundary.status, 'not_supported');
    assert.equal(boundary.reasonCode, 'downloader_not_allowed');
    assert.match(boundary.reason, /no verified low-permission downloader contract/iu);
    assertNoSensitiveMaterial(boundary, `${site.siteKey}.downloader-boundary`);
  }
});

test('T-POWERS 8MAN Dogma KM Produce and Maxing parse performer/profile fixtures as public catalog semantics', () => {
  for (const fixture of PROFILE_PARSE_FIXTURES) {
    const html = `
      <main>
        <meta property="og:url" content="${fixture.url}">
        <meta property="og:image" content="/public-cover.jpg">
        <h1>${fixture.title}</h1>
        <dl>
          <dt>productId</dt><dd data-field="productId">${fixture.workId}</dd>
          <dt>performer</dt><dd data-field="performer">${fixture.performer}</dd>
          <dt>releaseDate</dt><dd data-field="releaseDate">2026-05-04</dd>
          <dt>genre</dt><dd data-field="genre">public, catalog</dd>
        </dl>
        <img class="sample" src="/public-sample.jpg" alt="">
      </main>
    `;
    const parsed = fixture.adapter.extractContentDetailSemantics({
      siteKey: fixture.siteKey,
      host: fixture.host,
      finalUrl: `${fixture.url}?utm_source=fixture#fragment`,
      pageType: 'author-page',
      html,
      profile: {
        host: fixture.host,
        navigation: {
          allowedHosts: [fixture.host],
        },
      },
    });

    assert.equal(
      parsed.ok,
      true,
      `${fixture.label} should parse via extractContentDetailSemantics; if a site-native profile route is not supported yet, the expected interface is extractContentDetailSemantics({ finalUrl, html, profile }) returning av-detail/v1 performer fields from public catalog markup`,
    );
    assert.equal(parsed.schemaVersion, 'av-detail/v1');
    assert.equal(parsed.siteKey, fixture.siteKey);
    assert.equal(parsed.host, fixture.host);
    assert.equal(parsed.canonicalUrl, fixture.url);
    assert.equal(parsed.workId, fixture.workId);
    assert.equal(parsed.title, fixture.title);
    assert.deepEqual(parsed.performers, [fixture.performer]);
    assert.deepEqual(parsed.actors, [fixture.performer]);
    assert.equal(parsed.releaseDate, '2026-05-04');
    assert.equal(parsed.genres.includes('public'), true);
    assertNoSensitiveMaterial(parsed, `${fixture.siteKey}.performer-profile-semantics`);
  }
});

test('JP AV profile semantic interfaces return av-profile/v1 public profile metadata', () => {
  for (const fixture of PROFILE_PARSE_FIXTURES) {
    const html = `
      <main>
        <meta property="og:url" content="${fixture.url}">
        <meta property="og:image" content="/profile-image.jpg">
        <h1>${fixture.performer}</h1>
        <dl>
          <dt>alias</dt><dd data-field="alias">${fixture.performer} Alias</dd>
          <dt>genre</dt><dd data-field="genre">profile, public</dd>
        </dl>
        <a href="/works/detail/${fixture.workId}/">${fixture.title}</a>
        <a href="/news/public-info/">Public info</a>
      </main>
    `;
    const input = {
      siteKey: fixture.siteKey,
      host: fixture.host,
      finalUrl: `${fixture.url}?utm_source=fixture#fragment`,
      html,
      profile: {
        host: fixture.host,
        navigation: {
          allowedHosts: [fixture.host],
        },
      },
    };

    for (const methodName of [
      'extractProfileSemantics',
      'extractPerformerProfileSemantics',
      'extractTalentProfileSemantics',
    ]) {
      assert.equal(typeof fixture.adapter[methodName], 'function', `${fixture.siteKey}.${methodName} must be exposed`);
      const parsed = fixture.adapter[methodName](input);

      assert.equal(parsed.ok, true, `${fixture.label} should parse via ${methodName}`);
      assert.equal(parsed.schemaVersion, 'av-profile/v1');
      assert.equal(parsed.siteKey, fixture.siteKey);
      assert.equal(parsed.host, fixture.host);
      assert.equal(parsed.name, fixture.performer);
      assert.equal(parsed.profileUrl, fixture.url);
      assert.equal(parsed.canonicalUrl, fixture.url);
      assert.equal(parsed.aliases.includes(`${fixture.performer} Alias`), true);
      assert.equal(parsed.tags.includes('profile'), true);
      assert.equal(parsed.categories.includes('profile'), true);
      assert.equal(parsed.workLinks.some((link) => link.url.includes(`/works/detail/${fixture.workId}/`)), true);
      assert.equal(parsed.appearancesLinks.some((link) => link.url.includes(`/works/detail/${fixture.workId}/`)), true);
      assert.equal(parsed.socialLinks.every((link) => new URL(link.url).hostname === fixture.host), true);
      assert.equal(parsed.missingFields.length, 0);
      assert.equal(parsed.confidence >= 0.95, true);
      assertNoSensitiveMaterial(parsed, `${fixture.siteKey}.${methodName}`);
    }
  }
});

test('DOGMA and MAXING public-entry failures are explicit boundaries, not bypass attempts', () => {
  for (const adapter of [dogmaAdapter, maxingAdapter]) {
    const config = JP_AV_CATALOG_SITE_CONFIGS[adapter.siteKey];
    const url = new URL(config.canonicalBaseUrl);
    url.pathname = config.siteKey === 'dogma' ? '/product/public-entry-001/' : '/product/public-entry-001/';
    const missingFields = adapter.extractContentDetailSemantics({
      siteKey: config.siteKey,
      host: config.hosts[0],
      finalUrl: url.toString(),
      pageType: 'book-detail-page',
      html: '<main><h1></h1><p>Public entry could not be decoded into required catalog fields.</p></main>',
      profile: {
        host: config.hosts[0],
        navigation: {
          allowedHosts: config.hosts,
        },
      },
    });

    assert.equal(missingFields.ok, false);
    assert.equal(missingFields.reasonCode, 'missing_required_field');
    assert.deepEqual(
      [
        adapter.mapFailureReason('networkFailed'),
        adapter.mapFailureReason('ageGateOrAccessGate'),
        adapter.mapFailureReason('parseFailed'),
      ],
      ['network_failed', 'age_gate_or_access_gate', 'parse_failed'],
      `${config.siteKey} must record network/access/encoding-style boundaries as reason codes`,
    );
    assert.equal(Object.hasOwn(missingFields, 'bypass'), false);
    assert.equal(Object.hasOwn(missingFields, 'captchaBypass'), false);
    assert.equal(Object.hasOwn(missingFields, 'credentialExtraction'), false);
    assertNoSensitiveMaterial(missingFields, `${config.siteKey}.public-entry-boundary`);
  }
});
