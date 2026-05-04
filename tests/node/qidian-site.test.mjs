import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, readFile, rm } from 'node:fs/promises';

import { readJsonFile } from '../../src/infra/io.mjs';
import { siteDoctor } from '../../src/entrypoints/sites/site-doctor.mjs';
import {
  SITE_ONBOARDING_DISCOVERY_ARTIFACT_NAMES,
  SITE_ONBOARDING_DISCOVERY_CLASSIFICATIONS,
  SITE_ONBOARDING_REQUIRED_COVERAGE_THRESHOLD,
  assertSiteOnboardingDiscoveryComplete,
  createSiteOnboardingDiscoveryArtifacts,
  createSiteOnboardingDiscoveryInputFromCaptureExpand,
  createSiteOnboardingDiscoveryInputsFromCaptureExpandOutput,
} from '../../src/sites/capability/site-onboarding-discovery.mjs';
import { validateProfileFile } from '../../src/sites/core/profile-validation.mjs';
import { inferPageTypeFromUrl } from '../../src/sites/core/page-types.mjs';
import { resolveSite } from '../../src/sites/core/adapters/resolver.mjs';
import { readSiteCapabilities } from '../../src/sites/catalog/capabilities.mjs';
import { readSiteRegistry } from '../../src/sites/catalog/registry.mjs';

const QIDIAN_URL = 'https://www.qidian.com/';
const QIDIAN_PROFILE_PATH = path.resolve('profiles/www.qidian.com.json');

function createQidianCaptureExpandFixture(workspace) {
  return {
    captureOutput: {
      status: 'success',
      finalUrl: QIDIAN_URL,
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
          url: 'https://www.qidian.com/ajax/book/category?gender=male',
          resourceType: 'xhr',
        },
        {
          method: 'GET',
          url: 'https://www.qidian.com/static/js/index.js',
          resourceType: 'script',
        },
      ],
      files: {
        manifest: path.join(workspace, 'capture', 'manifest.json'),
      },
      error: null,
    },
    expandOutput: {
      outDir: path.join(workspace, 'expand'),
      summary: {
        capturedStates: 6,
      },
      warnings: [],
      states: [
        {
          state_id: 'qidian-home',
          status: 'captured',
          finalUrl: QIDIAN_URL,
          pageType: 'home',
          trigger: { kind: 'safe-nav-link' },
          files: {},
        },
        {
          state_id: 'qidian-search',
          status: 'captured',
          finalUrl: 'https://www.qidian.com/soushu/example.html',
          pageType: 'search-results-page',
          trigger: { kind: 'search-form' },
          files: {},
        },
        {
          state_id: 'qidian-category',
          status: 'captured',
          finalUrl: 'https://www.qidian.com/rank/',
          pageType: 'category-page',
          trigger: { kind: 'safe-nav-link' },
          files: {},
        },
        {
          state_id: 'qidian-book',
          status: 'captured',
          finalUrl: 'https://www.qidian.com/book/1234567890/',
          pageType: 'book-detail-page',
          trigger: { kind: 'content-link' },
          files: {},
        },
        {
          state_id: 'qidian-chapter',
          status: 'captured',
          finalUrl: 'https://www.qidian.com/chapter/1234567890/987654321/',
          pageType: 'chapter-page',
          trigger: { kind: 'safe-nav-link' },
          files: {},
        },
        {
          state_id: 'qidian-login-risk',
          status: 'captured',
          finalUrl: 'https://www.qidian.com/login/',
          pageType: 'auth-page',
          trigger: { kind: 'auth-link' },
          pageFacts: {
            loginStateDetected: true,
            permissionDenied: true,
            riskPageDetected: true,
            recoveryEntryVisible: true,
            manualRiskState: true,
          },
          files: {},
        },
      ],
    },
  };
}

async function pathExists(filePath) {
  try {
    await readFile(filePath, 'utf8');
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

function qidianDiscoveryText(item = {}) {
  return [
    item.id,
    item.label,
    item.locator,
    item.url,
    item.endpoint?.url,
    item.nodeKind,
    item.kind,
    item.source,
  ].map((value) => String(value ?? '').toLowerCase()).join(' ');
}

function recognizedDecision(item, recognizedAs) {
  return {
    classification: 'recognized',
    recognizedAs,
    required: Boolean(item.required),
  };
}

function createQidianDiscoveryAdapter() {
  const requiredNodeKinds = new Set([
    'navigation-state',
    'page-type',
    'home',
    'search-results-page',
    'book-detail-page',
    'chapter-page',
    'search-form',
    'book-link',
    'chapter-link',
  ]);

  return {
    id: 'chapter-content',
    classifyNode(node = {}) {
      const text = qidianDiscoveryText(node);
      const nodeKind = String(node.nodeKind ?? node.kind ?? '').toLowerCase();
      if (text.includes('qidian-decorative-banner')) {
        return {
          classification: 'ignored',
          reason: 'Decorative promotion does not provide a required Qidian chapter-content capability.',
          required: false,
        };
      }
      if (text.includes('qidian-optional-ranking-filter')) {
        return {
          classification: 'unknown',
          required: false,
        };
      }
      if (
        requiredNodeKinds.has(nodeKind)
        || text.includes('/soushu/')
        || text.includes('/book/')
        || text.includes('/chapter/')
      ) {
        return recognizedDecision(node, `qidian:${nodeKind || 'chapter-content-node'}`);
      }
      return {
        classification: 'unknown',
        required: Boolean(node.required),
      };
    },
    classifyApi(api = {}) {
      const text = qidianDiscoveryText(api);
      if (text.includes('qidian-analytics-pixel')) {
        return {
          classification: 'ignored',
          reason: 'Analytics endpoint is outside the Qidian onboarding capability surface.',
          required: false,
        };
      }
      if (text.includes('qidian-optional-forum-feed')) {
        return {
          classification: 'unknown',
          required: false,
        };
      }
      if (text.includes('/ajax/search/autocomplete') || text.includes('/ajax/book/category')) {
        return recognizedDecision(api, 'qidian:public-discovery-api');
      }
      return {
        classification: 'unknown',
        required: Boolean(api.required),
      };
    },
  };
}

function createQidianSyntheticCaptureExpandDiscovery() {
  const homeUrl = 'https://www.qidian.com/';
  const searchUrl = 'https://www.qidian.com/soushu/example.html';
  const bookUrl = 'https://www.qidian.com/book/1234567890/';
  const chapterUrl = 'https://www.qidian.com/chapter/1234567890/987654321/';

  const producedInputs = createSiteOnboardingDiscoveryInputsFromCaptureExpandOutput({
    siteKey: 'qidian',
    generatedAt: '2026-05-04T09:00:00.000Z',
    source: 'qidian-synthetic-capture-expand',
    required: true,
    apiRequired: true,
    captureOutput: {
      schemaVersion: 1,
      siteKey: 'qidian',
      inputUrl: homeUrl,
      finalUrl: homeUrl,
      title: 'Qidian Home',
      status: 'success',
      pageType: 'home',
      networkRequests: [
        {
          id: 'qidian-search-suggest-api',
          method: 'GET',
          url: 'https://www.qidian.com/ajax/Search/AutoComplete?kw=example',
          resourceType: 'xhr',
          source: 'capture-network',
        },
        {
          id: 'qidian-category-books-api',
          method: 'GET',
          url: 'https://www.qidian.com/ajax/book/category?chanId=21&page=1',
          resourceType: 'xhr',
          source: 'capture-network',
        },
      ],
    },
    expandOutput: {
      schemaVersion: 1,
      inputUrl: homeUrl,
      baseUrl: homeUrl,
      summary: {
        capturedStates: 4,
        discoveredTriggers: 3,
      },
      states: [
        {
          stateId: 'home',
          status: 'captured',
          finalUrl: homeUrl,
          title: 'Qidian Home',
          pageType: 'home',
          trigger: {
            kind: 'search-form',
            label: 'Search books',
            href: searchUrl,
          },
        },
        {
          stateId: 'search',
          status: 'captured',
          finalUrl: searchUrl,
          title: 'Qidian Search Results',
          pageType: 'search-results-page',
          trigger: {
            kind: 'book-link',
            label: 'Open book detail',
            href: bookUrl,
          },
        },
        {
          stateId: 'book',
          status: 'captured',
          finalUrl: bookUrl,
          title: 'Qidian Book Detail',
          pageType: 'book-detail-page',
          trigger: {
            kind: 'chapter-link',
            label: 'Open chapter',
            href: chapterUrl,
          },
        },
        {
          stateId: 'chapter',
          status: 'captured',
          finalUrl: chapterUrl,
          title: 'Qidian Chapter',
          pageType: 'chapter-page',
        },
      ],
    },
  });

  return {
    ...producedInputs,
    discoveredNodes: [
      ...producedInputs.discoveredNodes,
      {
        id: 'qidian-optional-ranking-filter',
        label: 'Ranking filter',
        locator: 'https://www.qidian.com/rank/',
        nodeKind: 'ranking-filter',
        source: 'synthetic-qidian-optional',
        required: false,
      },
      {
        id: 'qidian-decorative-banner',
        label: 'Decorative banner',
        locator: '.qidian-banner',
        nodeKind: 'decorative-banner',
        source: 'synthetic-qidian-optional',
        required: false,
      },
    ],
    discoveredApis: [
      ...producedInputs.discoveredApis,
      {
        id: 'qidian-optional-forum-feed',
        method: 'GET',
        url: 'https://www.qidian.com/ajax/forum/feed',
        label: 'Optional forum feed',
        required: false,
      },
      {
        id: 'qidian-analytics-pixel',
        method: 'POST',
        url: 'https://www.qidian.com/ajax/analytics/pixel',
        label: 'Analytics pixel',
        required: false,
      },
    ],
  };
}

function assertEveryEntryHasExplicitTriState(entries) {
  for (const entry of entries) {
    assert.equal(
      SITE_ONBOARDING_DISCOVERY_CLASSIFICATIONS.includes(entry.classification),
      true,
      `${entry.id} must have an explicit onboarding discovery tri-state`,
    );
  }
}

test('qidian profile and site metadata register a chapter-content site without downloader privileges', async () => {
  const profileResult = await validateProfileFile(QIDIAN_PROFILE_PATH);
  assert.equal(profileResult.valid, true);
  assert.equal(profileResult.host, 'www.qidian.com');
  assert.equal(profileResult.archetype, 'chapter-content');

  const site = await resolveSite({
    inputUrl: QIDIAN_URL,
    profilePath: QIDIAN_PROFILE_PATH,
    workspaceRoot: process.cwd(),
  });
  assert.equal(site.host, 'www.qidian.com');
  assert.equal(site.siteKey, 'qidian');
  assert.equal(site.adapterId, 'chapter-content');
  assert.equal(site.adapter.id, 'chapter-content');

  const registry = await readSiteRegistry(process.cwd());
  const capabilities = await readSiteCapabilities(process.cwd());
  const registryRecord = registry.sites['www.qidian.com'];
  const capabilityRecord = capabilities.sites['www.qidian.com'];
  assert.equal(registryRecord.repoSkillDir, path.resolve('skills/qidian'));
  assert.equal(registryRecord.downloadEntrypoint, undefined);
  assert.equal(capabilityRecord.siteKey, 'qidian');
  assert.equal(capabilityRecord.adapterId, 'chapter-content');
  assert.equal(capabilityRecord.capabilityFamilies.includes('download-content'), false);
  assert.equal(capabilityRecord.supportedIntents.includes('search-book'), true);
  assert.equal(capabilityRecord.supportedIntents.includes('open-chapter'), true);
});

test('qidian URL classification stays inside the SiteAdapter boundary', async () => {
  const profile = await readJsonFile(QIDIAN_PROFILE_PATH);
  assert.equal(inferPageTypeFromUrl('https://www.qidian.com/', profile), 'home');
  assert.equal(
    inferPageTypeFromUrl('https://www.qidian.com/soushu/example.html', profile),
    'search-results-page',
  );
  assert.equal(
    inferPageTypeFromUrl('https://www.qidian.com/book/1234567890/', profile),
    'book-detail-page',
  );
  assert.equal(
    inferPageTypeFromUrl('https://www.qidian.com/chapter/1234567890/987654321/', profile),
    'chapter-page',
  );
  assert.equal(inferPageTypeFromUrl('https://www.qidian.com/rank/', profile), 'category-page');
});

test('qidian skill is generated with read-only public-navigation boundaries', async () => {
  const skillMd = await readFile(path.resolve('skills/qidian/SKILL.md'), 'utf8');
  const indexMd = await readFile(path.resolve('skills/qidian/references/index.md'), 'utf8');
  const approvalMd = await readFile(path.resolve('skills/qidian/references/approval.md'), 'utf8');

  assert.match(skillMd, /^---\nname: qidian\n/su);
  assert.match(skillMd, /Instruction-only Skill for https:\/\/www\.qidian\.com\//u);
  assert.match(skillMd, /no verified full-book downloader is enabled/u);
  assert.doesNotMatch(skillMd, /SESSDATA|Authorization:|Cookie:|csrf_token|access_token/u);
  assert.match(indexMd, /Adapter: `chapter-content`/u);
  assert.match(indexMd, /Not implemented: Qidian-specific downloader/u);
  assert.match(approvalMd, /CAPTCHA, verification, probe, risk-control, or anti-bot flows/u);
});

test('qidian onboarding discovery fixture passes the coverage gate through SiteAdapter classification', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-qidian-discovery-'));
  try {
    const site = await resolveSite({
      inputUrl: QIDIAN_URL,
      profilePath: QIDIAN_PROFILE_PATH,
      workspaceRoot: process.cwd(),
    });
    const fixture = createQidianCaptureExpandFixture(workspace);
    const discoveryInput = createSiteOnboardingDiscoveryInputFromCaptureExpand({
      siteKey: 'qidian',
      captureOutput: fixture.captureOutput,
      expandOutput: fixture.expandOutput,
    });
    const artifacts = createSiteOnboardingDiscoveryArtifacts({
      siteKey: 'qidian',
      discoveredNodes: discoveryInput.discoveredNodes,
      discoveredApis: discoveryInput.discoveredApis,
      adapter: site.adapter,
    });

    assert.equal(artifacts.gate.passed, true);
    assert.equal(artifacts.gate.unknownRequiredNodes, 0);
    assert.equal(artifacts.gate.unknownRequiredApis, 0);
    assert.equal(artifacts.gate.requiredIgnoredNodes, 0);
    assert.equal(artifacts.gate.requiredIgnoredApis, 0);
    assert.equal(artifacts.gate.requiredCoverage.requiredCoverage >= 0.95, true);
    assert.equal(
      artifacts.objects.NODE_INVENTORY.entries.every((entry) =>
        ['recognized', 'unknown', 'ignored'].includes(entry.classification)),
      true,
    );
    assert.equal(
      artifacts.objects.API_INVENTORY.entries
        .filter((entry) => entry.classification === 'ignored')
        .every((entry) => typeof entry.reason === 'string' && entry.reason.length > 0),
      true,
    );
    assert.equal(
      artifacts.objects.NODE_INVENTORY.entries.some((entry) =>
        entry.manualReviewRequired && entry.classification === 'recognized'),
      true,
    );
    assert.equal(
      artifacts.objects.API_INVENTORY.entries.some((entry) => entry.classification === 'ignored'),
      true,
    );
    assert.equal(artifacts.objects.UNKNOWN_NODE_REPORT.totalUnknownRequiredNodes, 0);
    assert.match(artifacts.markdown.NODE_INVENTORY, /# NODE_INVENTORY/u);
    assert.match(artifacts.markdown.API_INVENTORY, /# API_INVENTORY/u);
    assert.match(artifacts.markdown.UNKNOWN_NODE_REPORT, /Unknown required nodes: 0/u);
    assert.match(artifacts.markdown.SITE_CAPABILITY_REPORT, /Gate passed: yes/u);
    assert.match(artifacts.markdown.DISCOVERY_AUDIT, /unknownRequiredNodesZero\s+\|\s+yes/u);
    assert.equal(assertSiteOnboardingDiscoveryComplete({ artifacts, acceptedByAgentB: true }), true);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('qidian site-doctor simulation writes onboarding discovery artifacts and passes coverage', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-qidian-site-doctor-'));
  try {
    const site = await resolveSite({
      inputUrl: QIDIAN_URL,
      profilePath: QIDIAN_PROFILE_PATH,
      workspaceRoot: process.cwd(),
    });
    const fixture = createQidianCaptureExpandFixture(workspace);
    const report = await siteDoctor(QIDIAN_URL, {
      profilePath: QIDIAN_PROFILE_PATH,
      outDir: path.join(workspace, 'doctor'),
      query: 'example',
    }, {
      resolveSite: async () => site,
      ensureCrawlerScript: async () => ({
        status: 'generated',
        scriptPath: path.join(workspace, 'crawler.py'),
        metaPath: path.join(workspace, 'crawler.meta.json'),
      }),
      capture: async () => fixture.captureOutput,
      expandStates: async () => fixture.expandOutput,
    });

    const summary = report.reports.siteOnboardingDiscovery;
    assert.equal(report.profile.valid, true);
    assert.equal(report.capture.valid, true);
    assert.equal(report.expand.valid, true);
    assert.equal(report.search.valid, true);
    assert.equal(report.detail.valid, true);
    assert.equal(report.chapter.valid, true);
    assert.equal(summary?.passed, true);
    assert.equal(summary?.failures.length, 0);
    assert.equal(summary?.requiredCoverage.requiredCoverage >= 0.95, true);
    assert.equal(summary?.requiredCoverage.requiredUnknown, 0);
    for (const artifactName of [
      'NODE_INVENTORY',
      'API_INVENTORY',
      'UNKNOWN_NODE_REPORT',
      'SITE_CAPABILITY_REPORT',
      'DISCOVERY_AUDIT',
    ]) {
      assert.equal(await pathExists(summary[artifactName]), true, `${artifactName} must be written`);
    }

    const nodeInventory = await readFile(summary.NODE_INVENTORY, 'utf8');
    const apiInventory = await readFile(summary.API_INVENTORY, 'utf8');
    const unknownReport = await readFile(summary.UNKNOWN_NODE_REPORT, 'utf8');
    const capabilityReport = await readFile(summary.SITE_CAPABILITY_REPORT, 'utf8');
    const discoveryAudit = await readFile(summary.DISCOVERY_AUDIT, 'utf8');
    assert.match(nodeInventory, /qidian:chapter-page/u);
    assert.match(nodeInventory, /qidian:risk-control/u);
    assert.match(apiInventory, /Static or browser-support request is outside Qidian onboarding capability coverage/u);
    assert.match(unknownReport, /Unknown required nodes: 0/u);
    assert.match(unknownReport, /Unknown required APIs: 0/u);
    assert.match(capabilityReport, /Gate passed: yes/u);
    assert.match(discoveryAudit, /ignoredItemsHaveReason\s+\|\s+yes/u);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('qidian synthetic onboarding discovery emits complete tri-state artifacts and passes the coverage gate', () => {
  const inputs = createQidianSyntheticCaptureExpandDiscovery();
  const adapter = createQidianDiscoveryAdapter();
  const artifacts = createSiteOnboardingDiscoveryArtifacts({
    ...inputs,
    adapter,
  });

  assert.equal(inputs.siteKey, 'qidian');
  assert.equal(inputs.producer, 'site-onboarding-discovery-input');
  assert.equal(inputs.source, 'qidian-synthetic-capture-expand');
  assert.equal(inputs.sourceSummary.captureInputs, 1);
  assert.equal(inputs.sourceSummary.expandInputs, 1);
  assert.equal(inputs.sourceSummary.networkRequests, 2);
  assert.equal(inputs.sourceSummary.discoveredNodes > 0, true);
  assert.equal(inputs.sourceSummary.discoveredApis, 2);

  assert.deepEqual(Object.keys(artifacts.objects).sort(), [...SITE_ONBOARDING_DISCOVERY_ARTIFACT_NAMES].sort());
  for (const artifactName of SITE_ONBOARDING_DISCOVERY_ARTIFACT_NAMES) {
    assert.equal(artifacts.objects[artifactName].artifactName, artifactName);
    assert.match(artifacts.markdown[artifactName], new RegExp(`# ${artifactName}`, 'u'));
  }

  const nodeInventory = artifacts.objects.NODE_INVENTORY;
  const apiInventory = artifacts.objects.API_INVENTORY;
  assertEveryEntryHasExplicitTriState(nodeInventory.entries);
  assertEveryEntryHasExplicitTriState(apiInventory.entries);
  assert.deepEqual(
    Object.keys(nodeInventory.counts).sort(),
    [...SITE_ONBOARDING_DISCOVERY_CLASSIFICATIONS].sort(),
  );
  assert.deepEqual(
    Object.keys(apiInventory.counts).sort(),
    [...SITE_ONBOARDING_DISCOVERY_CLASSIFICATIONS].sort(),
  );
  assert.equal(nodeInventory.counts.recognized > 0, true);
  assert.equal(nodeInventory.counts.unknown > 0, true);
  assert.equal(nodeInventory.counts.ignored > 0, true);
  assert.equal(apiInventory.counts.recognized > 0, true);
  assert.equal(apiInventory.counts.unknown > 0, true);
  assert.equal(apiInventory.counts.ignored > 0, true);

  const ignoredEntries = [...nodeInventory.entries, ...apiInventory.entries]
    .filter((entry) => entry.classification === 'ignored');
  assert.equal(ignoredEntries.length > 0, true);
  assert.equal(ignoredEntries.every((entry) => typeof entry.reason === 'string' && entry.reason.length > 0), true);

  const unknownReport = artifacts.objects.UNKNOWN_NODE_REPORT;
  assert.equal(unknownReport.totalUnknownNodes > 0, true);
  assert.equal(unknownReport.totalUnknownApis > 0, true);
  assert.equal(unknownReport.totalUnknownRequiredNodes, 0);
  assert.equal(unknownReport.totalUnknownRequiredApis, 0);
  assert.equal(unknownReport.gateRequiredUnknownNodesZero, true);
  assert.equal(unknownReport.gateRequiredUnknownApisZero, true);

  assert.equal(artifacts.gate.unknownRequiredNodes, 0);
  assert.equal(artifacts.gate.unknownRequiredApis, 0);
  assert.equal(artifacts.gate.requiredCoverage.requiredCoverage >= SITE_ONBOARDING_REQUIRED_COVERAGE_THRESHOLD, true);
  assert.equal(artifacts.gate.requiredCoveragePass, true);
  assert.equal(artifacts.gate.passed, true);
  assert.equal(artifacts.objects.SITE_CAPABILITY_REPORT.siteSpecificInterpretationOwner, 'SiteAdapter');
  assert.equal(artifacts.objects.DISCOVERY_AUDIT.adapterId, 'chapter-content');
  assert.equal(artifacts.objects.DISCOVERY_AUDIT.invariantChecks.ignoredItemsHaveReason, true);
  assert.equal(artifacts.objects.DISCOVERY_AUDIT.invariantChecks.everyDiscoveredItemRecorded, true);
  assert.equal(artifacts.objects.DISCOVERY_AUDIT.invariantChecks.requiredCoverageAtLeastThreshold, true);
  assert.equal(artifacts.objects.DISCOVERY_AUDIT.invariantChecks.unknownRequiredNodesZero, true);
  assert.equal(artifacts.objects.DISCOVERY_AUDIT.invariantChecks.unknownRequiredApisZero, true);
  assert.equal(assertSiteOnboardingDiscoveryComplete({ artifacts, acceptedByAgentB: true }), true);
});
