import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { access, readFile } from 'node:fs/promises';

import {
  SITE_ONBOARDING_DISCOVERY_ARTIFACT_NAMES,
  assertSiteOnboardingDiscoveryComplete,
  createSiteOnboardingDiscoveryArtifacts,
  createSiteOnboardingDiscoveryInputFromCaptureExpand,
} from '../../src/sites/capability/site-onboarding-discovery.mjs';
import { readSiteCapabilities } from '../../src/sites/catalog/capabilities.mjs';
import { readSiteRegistry } from '../../src/sites/catalog/registry.mjs';
import { validateProfileFile } from '../../src/sites/core/profile-validation.mjs';
import { inferPageTypeFromUrl } from '../../src/sites/core/page-types.mjs';
import { resolveSite } from '../../src/sites/core/adapters/resolver.mjs';

const WORKSPACE_ROOT = process.cwd();

const BATCH2_AV_SITES = Object.freeze([
  {
    host: 's1s1s1.com',
    siteKey: 's1',
    adapterId: 's1',
    baseUrl: 'https://s1s1s1.com/',
    repoSkillDir: 'skills/s1',
    detailUrl: 'https://s1s1s1.com/works/detail/S1-001/',
    searchUrl: 'https://s1s1s1.com/search/list?keyword=sample',
    categoryUrl: 'https://s1s1s1.com/works/list',
    expectedTitle: 'S1 Sample Work',
    expectedWorkId: 'S1-001',
    expectedActor: 'S1 Actor',
  },
  {
    host: 'attackers.net',
    siteKey: 'attackers',
    adapterId: 'attackers',
    baseUrl: 'https://attackers.net/',
    repoSkillDir: 'skills/attackers',
    detailUrl: 'https://attackers.net/works/detail/ATK-001/',
    searchUrl: 'https://attackers.net/search/list?keyword=sample',
    categoryUrl: 'https://attackers.net/works/list',
    expectedTitle: 'Attackers Sample Work',
    expectedWorkId: 'ATK-001',
    expectedActor: 'Attackers Actor',
  },
  {
    host: 'www.t-powers.co.jp',
    siteKey: 't-powers',
    adapterId: 't-powers',
    baseUrl: 'https://www.t-powers.co.jp/',
    repoSkillDir: 'skills/t-powers',
    detailUrl: 'https://www.t-powers.co.jp/works/detail/TPW-001/',
    searchUrl: 'https://www.t-powers.co.jp/search/list?keyword=sample',
    categoryUrl: 'https://www.t-powers.co.jp/works/list',
    expectedTitle: 'T-POWERS Sample Work',
    expectedWorkId: 'TPW-001',
    expectedActor: 'T-POWERS Actor',
  },
  {
    host: 'www.8man.jp',
    siteKey: '8man',
    adapterId: '8man',
    baseUrl: 'https://www.8man.jp/',
    repoSkillDir: 'skills/8man',
    detailUrl: 'https://www.8man.jp/works/detail/8MN-001/',
    searchUrl: 'https://www.8man.jp/search/list?keyword=sample',
    categoryUrl: 'https://www.8man.jp/works/list',
    expectedTitle: '8MAN Sample Work',
    expectedWorkId: '8MN-001',
    expectedActor: '8MAN Actor',
  },
]);

function createDetailFixture(site) {
  return {
    finalUrl: `${site.detailUrl}?utm_source=synthetic#sample-fragment`,
    title: `${site.expectedTitle} - ${site.host}`,
    html: `
      <main>
        <meta property="og:url" content="${site.detailUrl}">
        <h1>${site.expectedTitle}</h1>
        <dl>
          <dt>productId</dt><dd data-field="productId">${site.expectedWorkId}</dd>
          <dt>actress</dt><dd data-field="actress"><a href="/actress/detail/synthetic">${site.expectedActor}</a></dd>
          <dt>releaseDate</dt><dd data-field="releaseDate">2026-05-01</dd>
          <dt>maker</dt><dd data-field="maker">${site.siteKey}</dd>
          <dt>genre</dt><dd data-field="genre">drama, catalog</dd>
        </dl>
        <img class="cover" src="/cover.jpg" alt="">
        <img class="sample" src="/sample-1.jpg" alt="">
        <a href="${site.detailUrl}">canonical</a>
      </main>
    `,
  };
}

function createDiscoveryFixture(site) {
  return {
    captureOutput: {
      status: 'success',
      finalUrl: site.baseUrl,
      pageType: 'home',
      pageFacts: {
        loginStateDetected: true,
        restrictionDetected: true,
        riskPageDetected: true,
        recoveryAvailable: true,
        manualRiskState: true,
      },
      networkRequests: [
        {
          method: 'GET',
          url: `${site.baseUrl}search/list?keyword=sample`,
          resourceType: 'document',
        },
        {
          method: 'GET',
          url: `${site.baseUrl}assets/app.js`,
          resourceType: 'script',
        },
      ],
    },
    expandOutput: {
      summary: {
        capturedStates: 5,
      },
      states: [
        {
          stateId: 'home',
          status: 'captured',
          finalUrl: site.baseUrl,
          pageType: 'home',
          trigger: { kind: 'safe-nav-link' },
        },
        {
          stateId: 'search',
          status: 'captured',
          finalUrl: site.searchUrl,
          pageType: 'search-results-page',
          trigger: { kind: 'search-form' },
        },
        {
          stateId: 'category',
          status: 'captured',
          finalUrl: site.categoryUrl,
          pageType: 'category-page',
          trigger: { kind: 'pagination-link' },
        },
        {
          stateId: 'detail',
          status: 'captured',
          finalUrl: site.detailUrl,
          pageType: 'book-detail-page',
          trigger: { kind: 'content-link' },
        },
        {
          stateId: 'access-gate',
          status: 'captured',
          finalUrl: `${site.baseUrl}login`,
          pageType: 'auth-page',
          trigger: { kind: 'auth-link' },
          pageFacts: {
            loginStateDetected: true,
            permissionDenied: true,
            riskPageDetected: true,
            recoveryEntryVisible: true,
            manualRiskState: true,
          },
        },
      ],
    },
  };
}

function assertRequiredStrings(record, fields, label) {
  for (const field of fields) {
    assert.equal(typeof record?.[field], 'string', `${label}.${field} must be a string`);
    assert.notEqual(record[field].trim(), '', `${label}.${field} must be non-empty`);
  }
}

function assertRequiredArrays(record, fields, label) {
  for (const field of fields) {
    assert.equal(Array.isArray(record?.[field]), true, `${label}.${field} must be an array`);
    assert.equal(record[field].length > 0, true, `${label}.${field} must be non-empty`);
  }
}

function assertNoSensitiveMaterial(value, label) {
  const serialized = JSON.stringify(value);
  assert.doesNotMatch(
    serialized,
    /SESSDATA|Authorization|Cookie|csrf|access_token|sessionid|profile_path|Bearer /iu,
    `${label} must not expose raw session or credential material`,
  );
}

async function assertFileExists(filePath, label) {
  try {
    await access(filePath);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      assert.fail(`${label} must exist at ${filePath}`);
    }
    throw error;
  }
}

test('Batch 2 AV sites are registered with capabilities and valid profiles', async () => {
  const registry = await readSiteRegistry(WORKSPACE_ROOT);
  const capabilities = await readSiteCapabilities(WORKSPACE_ROOT);

  for (const site of BATCH2_AV_SITES) {
    const registryRecord = registry.sites[site.host];
    const capabilityRecord = capabilities.sites[site.host];

    assert.ok(
      registryRecord,
      `${site.host} must exist in config/site-registry.json with expected interface { host, siteKey: ${site.siteKey}, adapterId: ${site.adapterId}, canonicalBaseUrl: ${site.baseUrl}, repoSkillDir: ${site.repoSkillDir} }`,
    );
    assert.ok(
      capabilityRecord,
      `${site.host} must exist in config/site-capabilities.json with expected public catalog capability interface`,
    );
    assert.equal(registryRecord.host, site.host);
    assert.equal(registryRecord.siteKey, site.siteKey);
    assert.equal(registryRecord.adapterId, site.adapterId);
    assert.equal(registryRecord.canonicalBaseUrl, site.baseUrl);
    assert.equal(
      typeof registryRecord.repoSkillDir,
      'string',
      `${site.host} registry record must expose repoSkillDir: ${site.repoSkillDir}`,
    );
    assert.equal(path.relative(WORKSPACE_ROOT, registryRecord.repoSkillDir).replaceAll('\\', '/'), site.repoSkillDir);
    assert.equal(registryRecord.downloadEntrypoint, undefined, `${site.host} must remain navigation-only in Batch 2`);

    assert.equal(capabilityRecord.host, site.host);
    assert.equal(capabilityRecord.siteKey, site.siteKey);
    assert.equal(capabilityRecord.adapterId, site.adapterId);
    assert.equal(capabilityRecord.baseUrl, site.baseUrl);
    assert.equal(capabilityRecord.primaryArchetype, 'catalog-detail');
    assertRequiredArrays(capabilityRecord, [
      'pageTypes',
      'capabilityFamilies',
      'supportedIntents',
      'safeActionKinds',
      'approvalActionKinds',
      'reasonCodes',
    ], `capabilities.${site.host}`);
    assert.equal(capabilityRecord.capabilityFamilies.includes('download-content'), false);
    assert.equal(capabilityRecord.capabilityFamilies.includes('search-content'), true);
    assert.equal(capabilityRecord.capabilityFamilies.includes('navigate-to-content'), true);
    assert.equal(capabilityRecord.supportedIntents.includes('search-work'), true);
    assert.equal(capabilityRecord.supportedIntents.includes('open-work'), true);
    assert.equal(capabilityRecord.reasonCodes.includes('downloader_not_allowed'), true);

    const profile = await validateProfileFile(path.resolve(`profiles/${site.host}.json`));
    assert.equal(
      profile.valid,
      true,
      `${site.host} profile must exist at profiles/${site.host}.json and validate as a navigation-catalog profile`,
    );
    assert.equal(profile.host, site.host);
    assert.equal(profile.archetype, 'navigation-catalog');
    assert.equal(profile.profile.navigation.allowedHosts.includes(site.host), true);
    assert.equal(profile.profile.navigation.authPathPrefixes.length > 0, true);
  }
});

test('Batch 2 AV URL normalization stays inside each allowed host family', async () => {
  for (const site of BATCH2_AV_SITES) {
    const resolved = await resolveSite({
      workspaceRoot: WORKSPACE_ROOT,
      inputUrl: `${site.baseUrl}?utm_source=synthetic#top`,
    });
    const adapter = resolved.adapter;

    assert.equal(resolved.host, site.host);
    assert.equal(resolved.siteKey, site.siteKey);
    assert.equal(resolved.adapterId, site.adapterId);
    assert.equal(typeof adapter.normalizeUrlForNavigation, 'function', `${site.host} adapter must expose normalizeUrlForNavigation`);
    assert.equal(typeof adapter.isAllowedUrlFamily, 'function', `${site.host} adapter must expose isAllowedUrlFamily`);
    assert.equal(
      adapter.normalizeUrlForNavigation({ inputUrl: `${site.detailUrl}?utm_source=synthetic#frag`, profile: resolved.profile }),
      site.detailUrl,
    );
    assert.equal(adapter.isAllowedUrlFamily({ inputUrl: site.detailUrl, profile: resolved.profile }), true);
    assert.equal(
      adapter.isAllowedUrlFamily({ inputUrl: 'https://example.invalid/works/detail/S1-001/', profile: resolved.profile }),
      false,
    );
  }
});

test('Batch 2 AV adapter exposes catalog navigation capability for each site', async () => {
  for (const site of BATCH2_AV_SITES) {
    const resolved = await resolveSite({
      workspaceRoot: WORKSPACE_ROOT,
      inputUrl: site.detailUrl,
    });
    const adapter = resolved.adapter;

    assert.equal(adapter.id, site.adapterId);
    assert.equal(typeof adapter.matches, 'function');
    assert.equal(typeof adapter.inferPageType, 'function');
    assert.equal(typeof adapter.classifyPath, 'function');
    assert.equal(typeof adapter.classifyNode, 'function');
    assert.equal(typeof adapter.classifyApi, 'function');
    assert.equal(typeof adapter.extractContentDetailSemantics, 'function', `${site.host} adapter must expose fixture detail semantic parser`);
    assert.equal(adapter.matches({ host: site.host, inputUrl: site.baseUrl, profile: resolved.profile }), true);
    assert.equal(inferPageTypeFromUrl(site.detailUrl, resolved.profile), 'book-detail-page');
    assert.equal(inferPageTypeFromUrl(site.searchUrl, resolved.profile), 'search-results-page');
    assert.equal(inferPageTypeFromUrl(site.categoryUrl, resolved.profile), 'category-page');

    const detailClassification = adapter.classifyPath({
      inputUrl: site.detailUrl,
      pathname: new URL(site.detailUrl).pathname,
      profile: resolved.profile,
    });
    assert.equal(detailClassification?.kind, 'jp-av-catalog-path');
    assert.equal(detailClassification?.detail, 'book-detail-page');
  }
});

test('Batch 2 AV fixture detail parsing emits semantic metadata without sensitive material', async () => {
  for (const site of BATCH2_AV_SITES) {
    const resolved = await resolveSite({
      workspaceRoot: WORKSPACE_ROOT,
      inputUrl: site.detailUrl,
    });
    const fixture = createDetailFixture(site);
    const parsed = resolved.adapter.extractContentDetailSemantics({
      siteKey: site.siteKey,
      host: site.host,
      finalUrl: fixture.finalUrl,
      pageType: 'book-detail-page',
      title: fixture.title,
      html: fixture.html,
      profile: resolved.profile,
      headers: {
        cookie: 'SESSDATA=synthetic-batch2-cookie',
        authorization: 'Bearer synthetic-batch2-token',
      },
    });

    assert.equal(Object.getPrototypeOf(parsed), Object.prototype);
    assertRequiredStrings(parsed, ['schemaVersion', 'siteKey', 'host', 'canonicalUrl', 'title', 'workId'], `${site.host}.detail`);
    assert.equal(parsed.ok, true);
    assert.equal(parsed.schemaVersion, 'av-detail/v1');
    assert.equal(parsed.siteKey, site.siteKey);
    assert.equal(parsed.host, site.host);
    assert.equal(parsed.canonicalUrl, site.detailUrl);
    assert.equal(parsed.title, site.expectedTitle);
    assert.equal(parsed.workId, site.expectedWorkId);
    assert.deepEqual(parsed.actors, [site.expectedActor]);
    assert.equal(parsed.releaseDate, '2026-05-01');
    assert.equal(parsed.pageType, 'book-detail-page');
    assert.equal(parsed.tags.includes('drama'), true);
    assertNoSensitiveMaterial(parsed, `${site.host}.detail`);
  }
});

test('Batch 2 AV adapter returns reasonCode on unsupported or cross-family detail parsing', async () => {
  for (const site of BATCH2_AV_SITES) {
    const resolved = await resolveSite({
      workspaceRoot: WORKSPACE_ROOT,
      inputUrl: site.detailUrl,
    });
    const result = resolved.adapter.extractContentDetailSemantics({
      siteKey: site.siteKey,
      host: site.host,
      finalUrl: 'https://example.invalid/works/detail/S1-001/',
      pageType: 'book-detail-page',
      title: 'Wrong Host',
      html: '<h1>Wrong Host</h1>',
      profile: resolved.profile,
    });

    assert.equal(result.ok, false);
    assert.equal(result.reasonCode, 'unsupported_url');
    assert.equal(result.siteKey, site.siteKey);
    assert.equal(result.host, site.host);
    assertNoSensitiveMaterial(result, `${site.host}.failure`);
    assert.equal(resolved.adapter.mapFailureReason('downloaderNotAllowed'), 'downloader_not_allowed');
  }
});

test('Batch 2 AV onboarding discovery emits complete tri-state artifacts and passes coverage gate', async () => {
  for (const site of BATCH2_AV_SITES) {
    const resolved = await resolveSite({
      workspaceRoot: WORKSPACE_ROOT,
      inputUrl: site.baseUrl,
    });
    const fixture = createDiscoveryFixture(site);
    const inputs = createSiteOnboardingDiscoveryInputFromCaptureExpand({
      siteKey: site.siteKey,
      captureOutput: fixture.captureOutput,
      expandOutput: fixture.expandOutput,
    });
    const artifacts = createSiteOnboardingDiscoveryArtifacts({
      siteKey: site.siteKey,
      discoveredNodes: [
        ...inputs.discoveredNodes,
        {
          id: `${site.siteKey}-decorative-banner`,
          label: 'Decorative banner',
          locator: '.hero',
          nodeKind: 'decorative-banner',
          required: false,
        },
      ],
      discoveredApis: inputs.discoveredApis,
      adapter: resolved.adapter,
    });

    assert.deepEqual(Object.keys(artifacts.objects).sort(), [...SITE_ONBOARDING_DISCOVERY_ARTIFACT_NAMES].sort());
    assert.equal(artifacts.gate.passed, true);
    assert.equal(artifacts.gate.unknownRequiredNodes, 0);
    assert.equal(artifacts.gate.unknownRequiredApis, 0);
    assert.equal(artifacts.gate.requiredCoverage.requiredCoverage >= 0.95, true);
    assert.equal(artifacts.objects.UNKNOWN_NODE_REPORT.totalUnknownRequiredNodes, 0);
    assert.equal(artifacts.objects.UNKNOWN_NODE_REPORT.totalUnknownRequiredApis, 0);
    assert.equal(
      [...artifacts.objects.NODE_INVENTORY.entries, ...artifacts.objects.API_INVENTORY.entries]
        .filter((entry) => entry.classification === 'ignored')
        .every((entry) => typeof entry.reason === 'string' && entry.reason.length > 0),
      true,
    );
    assert.equal(
      artifacts.objects.NODE_INVENTORY.entries.some((entry) => entry.manualReviewRequired && entry.classification === 'recognized'),
      true,
    );
    assert.match(artifacts.markdown.NODE_INVENTORY, /# NODE_INVENTORY/u);
    assert.match(artifacts.markdown.API_INVENTORY, /# API_INVENTORY/u);
    assert.match(artifacts.markdown.SITE_CAPABILITY_REPORT, /Gate passed: yes/u);
    assert.match(artifacts.markdown.DISCOVERY_AUDIT, /unknownRequiredNodesZero\s+\|\s+yes/u);
    assert.equal(assertSiteOnboardingDiscoveryComplete({ artifacts, acceptedByAgentB: true }), true);
  }
});

test('Batch 2 AV skills lint as instruction-only public navigation skills', async () => {
  for (const site of BATCH2_AV_SITES) {
    const skillPath = path.resolve(site.repoSkillDir, 'SKILL.md');
    await assertFileExists(skillPath, `${site.siteKey} skill`);
    const skillMd = await readFile(skillPath, 'utf8');

    assert.match(skillMd, new RegExp(`^---\\nname: ${site.siteKey}\\n`, 'u'));
    assert.match(skillMd, /description: .*Instruction-only Skill/iu);
    assert.match(skillMd, new RegExp(`https://${site.host.replaceAll('.', '\\.')}/`, 'u'));
    assert.match(skillMd, /search|open|navigate/iu);
    assert.match(skillMd, /approved URL family|approved .*URL|URL family/iu);
    assert.match(skillMd, /read-only|public-navigation|navigation-only/iu);
    assert.doesNotMatch(skillMd, /downloadEntrypoint|SESSDATA=|Authorization:|Cookie:|csrf_token=|access_token=|sessionid=/iu);
  }
});
