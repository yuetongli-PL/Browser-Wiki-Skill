import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const DESIGN_URL = new URL('../../../docs/site-capability-planner/DESIGN.md', import.meta.url);
const MATRIX_URL = new URL('../../../docs/site-capability-planner/IMPLEMENTATION_MATRIX.md', import.meta.url);
const MIGRATION_PLAN_URL = new URL('../../../docs/site-capability-planner/MIGRATION_PLAN.md', import.meta.url);

const ALLOWED_STATUSES = new Set([
  'not_started',
  'partial',
  'implemented',
  'verified',
  'blocked',
]);

const REQUIRED_MATRIX_FIELDS = Object.freeze([
  'Section name',
  'Requirement summary',
  'Current status',
  'Existing code evidence',
  'Existing test evidence',
  'Verification command',
  'Verification result',
  'Current gaps',
  'Next smallest task',
  'Risk notes',
  'Last updated',
  'Responsible subagent',
  'QualityGateReviewAgent conclusion',
]);

const REQUIRED_DESIGN_HEADINGS = Object.freeze([
  'Core Positioning',
  'Non-goals',
  'Relationship With Site Capability Layer And Graph',
  'Planner Layered Structure',
  'Planner Input Model',
  'Planner Output Model',
  'Intent Normalization',
  'Capability / Route Resolution',
  'Requirement / Context Checking',
  'RiskPolicy / Approval Gate',
  'AuthRequirement / SessionRequirement / SignerRequirement',
  'Fallback / Degradation Strategy',
  'Failure Modes / reasonCode',
  'Versioning / Compatibility',
  'Trust Boundary',
  'SecurityGuard / Redaction Integration',
  'Plan Artifact / Plan Manifest Governance',
  'Observability / Lifecycle Events',
  'Testing Strategy',
  'Standard Outputs And Final Goal',
]);

const REQUIRED_PLANNER_EVIDENCE = Object.freeze([
  'schema-validator.test.mjs',
  'graph-loader.test.mjs',
  'route-resolver.test.mjs',
  'context-checker.test.mjs',
  'fallback-strategy.test.mjs',
  'reason-codes.test.mjs',
  'plan-artifact.test.mjs',
  'observability.test.mjs',
  'dry-run.test.mjs',
  'non-goals-boundary.test.mjs',
  'layer-handoff.test.mjs',
  'matrix.test.mjs',
  'schema.mjs',
  'validator.mjs',
  'loader.mjs',
  'route-resolver.mjs',
  'context-checker.mjs',
  'fallback-strategy.mjs',
  'reason-codes.mjs',
  'plan-artifact.mjs',
  'observability.mjs',
  'dry-run.mjs',
  'layer-handoff.mjs',
]);

const FINAL_STATUS_COUNTS = Object.freeze({
  verified: 20,
  implemented: 0,
  partial: 0,
  not_started: 0,
  blocked: 0,
});

async function readSource(url) {
  return readFile(url, 'utf8');
}

function extractSections(markdown) {
  const matches = [...markdown.matchAll(/^## (\d+)\. .+$/gmu)];
  return matches.map((match, index) => {
    const next = matches[index + 1];
    return {
      number: Number(match[1]),
      heading: match[0],
      body: markdown.slice(match.index, next?.index ?? markdown.length),
    };
  });
}

function getField(section, fieldName) {
  const escaped = fieldName.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
  const match = section.body.match(new RegExp(`^- ${escaped}: (.*)$`, 'mu'));
  return match?.[1]?.trim() ?? null;
}

function extractTopMatter(markdown) {
  const firstSectionIndex = markdown.search(/^## \d+\. /mu);
  return firstSectionIndex === -1 ? markdown : markdown.slice(0, firstSectionIndex);
}

function countStatuses(sections) {
  const counts = new Map([...ALLOWED_STATUSES].map((status) => [status, 0]));
  for (const section of sections) {
    const status = getField(section, 'Current status')?.replaceAll('`', '');
    counts.set(status, (counts.get(status) ?? 0) + 1);
  }
  return counts;
}

function assertSummaryCounts(topMatter, statusCounts, expectedCounts = null) {
  for (const status of ['verified', 'implemented', 'partial', 'not_started', 'blocked']) {
    const summaryMatch = topMatter.match(new RegExp(`^- \`${status}\`: (\\d+)$`, 'mu'));
    assert.notEqual(summaryMatch, null, `top-level summary should include ${status}`);
    assert.equal(Number(summaryMatch[1]), statusCounts.get(status), `${status} count should match section statuses`);
    if (expectedCounts) {
      assert.equal(Number(summaryMatch[1]), expectedCounts[status], `${status} final count should match the final gate`);
    }
  }
}

function assertFinalMatrixState(matrix) {
  const topMatter = extractTopMatter(matrix);
  const sections = extractSections(matrix);
  const statusCounts = countStatuses(sections);
  assertSummaryCounts(topMatter, statusCounts, FINAL_STATUS_COUNTS);

  const verifiedSections = sections.filter((section) => getField(section, 'Current status') === '`verified`');
  assert.equal(verifiedSections.length, 20, 'all Planner matrix sections must be verified at final gate');
  assert.deepEqual(
    sections.map((section) => getField(section, 'Current status')?.replaceAll('`', '')),
    Array.from({ length: 20 }, () => 'verified'),
  );

  for (const section of sections) {
    assert.match(
      getField(section, 'QualityGateReviewAgent conclusion') ?? '',
      /Final Accepted by QualityGateReviewAgent; verified\./u,
      `${section.heading} should record final QualityGate acceptance`,
    );
    assert.match(
      getField(section, 'Current gaps') ?? '',
      /None known for the current Planner goal/u,
      `${section.heading} should not keep unresolved final-goal gaps`,
    );
  }

  assert.match(matrix, /matrix\.test\.mjs/u);
  assert.match(matrix, /79\/79/u);
  assert.match(matrix, /prepublish-secret-scan/u);
  assert.match(matrix, /616 candidate files/u);
  assert.match(matrix, /Site Capability Layer remains the execution/u);
  assert.match(matrix, /Site Capability Graph remains declarative/u);
  assert.match(matrix, /Planner remains descriptor-only/u);
  assert.match(matrix, /SecurityGuard \/ Redaction/u);
  assert.match(matrix, /redactionRequired=true/u);

  assert.doesNotMatch(matrix, /implemented, not verified|partial, not verified/iu);
  assert.doesNotMatch(matrix, /final verified promotion is still pending|Final completion remains blocked/iu);
  assert.doesNotMatch(matrix, /matrix validator tests do not exist yet|Add Planner matrix validator tests/iu);
  assert.doesNotMatch(matrix, /Layer-governed handoff compatibility remains unimplemented/iu);
  assert.doesNotMatch(matrix, /Complete fallback\/degradation/iu);
  assert.doesNotMatch(matrix, /Not run yet|TODO-only|placeholder-only/iu);
}

test('Planner documentation set exists and DESIGN covers the required 20 sections', async () => {
  await Promise.all([
    access(DESIGN_URL),
    access(MATRIX_URL),
    access(MIGRATION_PLAN_URL),
  ]);

  const design = await readSource(DESIGN_URL);
  const sections = extractSections(design);

  assert.deepEqual(sections.map((section) => section.number), Array.from({ length: 20 }, (_, index) => index + 1));
  for (const [index, heading] of REQUIRED_DESIGN_HEADINGS.entries()) {
    assert.match(sections[index].heading, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'u'));
  }
  assert.match(design, /Planner never executes real tasks/u);
  assert.match(design, /Site Capability Layer remains the execution/u);
  assert.match(design, /Site Capability Graph remains the declarative/u);
  assert.match(design, /SecurityGuard \/ Redaction/u);
});

test('Planner implementation matrix has 20 sections and summary counts match statuses', async () => {
  const matrix = await readSource(MATRIX_URL);
  const topMatter = extractTopMatter(matrix);
  const sections = extractSections(matrix);

  assert.deepEqual(sections.map((section) => section.number), Array.from({ length: 20 }, (_, index) => index + 1));
  const statusCounts = countStatuses(sections);
  assertSummaryCounts(topMatter, statusCounts);
});

test('Planner implementation matrix sections keep required evidence fields and allowed statuses', async () => {
  const matrix = await readSource(MATRIX_URL);
  const sections = extractSections(matrix);

  for (const section of sections) {
    for (const field of REQUIRED_MATRIX_FIELDS) {
      const value = getField(section, field);
      assert.notEqual(value, null, `${section.heading} should include ${field}`);
      assert.notEqual(value, '', `${section.heading} ${field} should not be empty`);
    }

    const status = getField(section, 'Current status')?.replaceAll('`', '');
    assert.equal(ALLOWED_STATUSES.has(status), true, `${section.heading} has unsupported status ${status}`);
    assert.match(getField(section, 'Last updated') ?? '', /^\d{4}-\d{2}-\d{2}$/u);
  }
});

test('Planner matrix reflects final verified promotion', async () => {
  const matrix = await readSource(MATRIX_URL);
  assertFinalMatrixState(matrix);
});

test('Planner final matrix validator rejects malformed final states', async () => {
  const matrix = await readSource(MATRIX_URL);

  assert.throws(
    () => assertFinalMatrixState(matrix.replace('- `verified`: 20', '- `verified`: 19')),
    /verified count should match/u,
  );
  assert.throws(
    () => assertFinalMatrixState(matrix.replace('- Current status: `verified`', '- Current status: `partial`')),
    /verified count should match|all Planner matrix sections/u,
  );
  assert.throws(
    () => assertFinalMatrixState(matrix.replace('Final Accepted by QualityGateReviewAgent; verified.', 'Accepted for slice; implemented, not verified.')),
    /QualityGate|implemented, not verified/u,
  );
  assert.throws(
    () => assertFinalMatrixState(matrix.replaceAll('616 candidate files', 'secret scan count missing')),
    /616 candidate files/u,
  );
});

test('Planner matrix records current focused test and module evidence', async () => {
  const matrix = await readSource(MATRIX_URL);

  for (const evidence of REQUIRED_PLANNER_EVIDENCE) {
    assert.match(matrix, new RegExp(evidence.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&'), 'u'));
  }
  assert.match(matrix, /79\/79/u);
  assert.match(matrix, /`verified`: 20/u);
  assert.match(matrix, /Planner matrix validator/u);
  assert.doesNotMatch(matrix, /Not run yet|TODO-only|placeholder-only/iu);
});
