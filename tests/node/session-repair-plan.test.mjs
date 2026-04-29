import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildSessionRepairPlanResult,
  main,
  parseArgs,
} from '../../src/entrypoints/sites/session-repair-plan.mjs';

test('session repair plan parser defaults to dry-run guidance', () => {
  const parsed = parseArgs([
    '--site', 'douyin',
    '--status', 'quarantine',
    '--reason', 'network-identity-drift',
    '--risk-signal', 'run-keepalive-before-auth',
    '--json',
  ]);

  assert.equal(parsed.site, 'douyin');
  assert.equal(parsed.status, 'quarantine');
  assert.equal(parsed.reason, 'network-identity-drift');
  assert.deepEqual(parsed.riskSignals, ['run-keepalive-before-auth']);
  assert.equal(parsed.execute, false);
});

test('session repair plan maps injected unhealthy health without executing ops', async () => {
  const result = await buildSessionRepairPlanResult({
    site: 'douyin',
    host: 'www.douyin.com',
    status: 'quarantine',
    reason: 'network-identity-drift',
    riskSignals: ['network-identity-drift'],
  });

  assert.equal(result.dryRun, true);
  assert.equal(result.repairPlan.action, 'site-keepalive');
  assert.equal(result.repairPlan.command, 'site-keepalive');
  assert.equal(result.repairPlan.requiresApproval, true);
});

test('session repair plan rejects execute mode until separately approved', async () => {
  await assert.rejects(
    () => buildSessionRepairPlanResult({
      site: 'douyin',
      execute: true,
      status: 'manual-required',
    }),
    /--execute is not implemented/u,
  );
});

test('session repair plan main prints JSON and does not spawn child commands', async () => {
  let output = '';
  const result = await main([
    '--site', 'x',
    '--status', 'manual-required',
    '--reason', 'login-required',
    '--json',
  ], {
    stdout: {
      write(chunk) {
        output += chunk;
      },
    },
  });

  const parsed = JSON.parse(output);
  assert.equal(result.repairPlan.command, 'site-login');
  assert.equal(parsed.repairPlan.command, 'site-login');
  assert.equal(parsed.dryRun, true);
});

