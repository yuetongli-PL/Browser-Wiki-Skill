import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';

import {
  parseArgs,
  parseCookieInput,
  runImport,
  socialAuthImportCliSummary,
  socialAuthImportRedactionAuditPath,
  summarizeCookies,
  writeSocialAuthImportManifest,
} from '../../scripts/social-auth-import.mjs';
import { reasonCodeSummary } from '../../src/sites/capability/reason-codes.mjs';

test('parseCookieInput accepts a raw X Cookie header without leaking values in summaries', () => {
  const cookies = parseCookieInput('auth_token=SECRET; ct0=CSRF; twid=u%3D123', {
    defaultDomain: '.x.com',
  });
  assert.deepEqual(cookies.map((cookie) => cookie.name), ['auth_token', 'ct0', 'twid']);
  assert.equal(cookies[0].domain, '.x.com');
  assert.equal(cookies[0].secure, true);
  assert.ok(cookies[0].expires > Math.trunc(Date.now() / 1000));

  const summary = summarizeCookies(cookies, ['auth_token', 'ct0']);
  assert.equal(summary.count, 3);
  assert.deepEqual(summary.missingRequired, []);
  assert.doesNotMatch(JSON.stringify(summary), /SECRET|CSRF/u);
});

test('parseCookieInput accepts Netscape cookies.txt exports', () => {
  const text = [
    '# Netscape HTTP Cookie File',
    '.x.com\tTRUE\t/\tTRUE\t1893456000\tauth_token\tSECRET',
    '.x.com\tTRUE\t/\tTRUE\t1893456000\tct0\tCSRF',
  ].join('\n');

  const cookies = parseCookieInput(text, { defaultDomain: '.x.com' });
  assert.equal(cookies.length, 2);
  assert.equal(cookies[0].name, 'auth_token');
  assert.equal(cookies[0].expires, 1893456000);
  assert.equal(cookies[1].name, 'ct0');
});

test('parseCookieInput accepts browser extension JSON exports', () => {
  const cookies = parseCookieInput(JSON.stringify({
    cookies: [
      {
        name: 'auth_token',
        value: 'SECRET',
        domain: '.x.com',
        path: '/',
        secure: true,
        httpOnly: true,
        sameSite: 'no_restriction',
        expirationDate: 1893456000,
      },
    ],
  }), { defaultDomain: '.x.com' });

  assert.equal(cookies.length, 1);
  assert.equal(cookies[0].sameSite, 'None');
  assert.equal(cookies[0].httpOnly, true);
});

test('parseCookieInput accepts Set-Cookie lines with attributes', () => {
  const cookies = parseCookieInput([
    'set-cookie: auth_token=SECRET; Domain=.x.com; Path=/; Secure; HttpOnly; SameSite=None',
    'ct0=CSRF; Domain=.x.com; Path=/; Secure; SameSite=Lax',
  ].join('\n'), { defaultDomain: '.x.com' });

  assert.equal(cookies.length, 2);
  assert.equal(cookies[0].httpOnly, true);
  assert.equal(cookies[0].sameSite, 'None');
  assert.ok(cookies[0].expires > Math.trunc(Date.now() / 1000));
  assert.equal(cookies[1].sameSite, 'Lax');
});

test('parseArgs supports env-based cookie import without putting secrets in argv', () => {
  const options = parseArgs([
    '--site',
    'x',
    '--cookie-header-env',
    'X_COOKIE_HEADER',
    '--execute',
    '--no-headless',
  ]);

  assert.equal(options.site, 'x');
  assert.equal(options.cookieHeaderEnv, 'X_COOKIE_HEADER');
  assert.equal(options.execute, true);
  assert.equal(options.headless, false);
});

test('parseArgs blocks raw Cookie header argv unless explicitly acknowledged', () => {
  assert.throws(
    () => parseArgs([
      '--site',
      'x',
      '--cookie-header',
      'auth_token=synthetic-social-auth-argv-token; ct0=synthetic-social-auth-argv-csrf',
      '--execute',
    ]),
    /Raw --cookie-header is blocked/u,
  );

  const options = parseArgs([
    '--site',
    'x',
    '--cookie-header',
    'auth_token=synthetic-social-auth-argv-token; ct0=synthetic-social-auth-argv-csrf',
    '--allow-argv-cookie-header',
    '--execute',
  ]);
  assert.equal(options.cookieHeader, 'auth_token=synthetic-social-auth-argv-token; ct0=synthetic-social-auth-argv-csrf');
  assert.equal(options.allowArgvCookieHeader, true);
});

test('social auth import dry-run manifest writes redaction audit without cookie values', async (t) => {
  const runRoot = await mkdtemp(path.join(os.tmpdir(), 'bwk-social-auth-import-redaction-'));
  t.after(() => rm(runRoot, { recursive: true, force: true }));

  const manifest = await runImport({
    site: 'x',
    runRoot,
    cookieHeader: 'auth_token=synthetic-social-auth-token; ct0=synthetic-social-auth-csrf',
    execute: false,
  });

  const manifestText = await readFile(manifest.manifestPath, 'utf8');
  const persisted = JSON.parse(manifestText);
  const auditPath = socialAuthImportRedactionAuditPath(manifest.manifestPath);
  const auditText = await readFile(auditPath, 'utf8');
  assert.equal(persisted.artifacts.redactionAudit, auditPath);
  assert.equal(persisted.cookieSummary.count, 2);
  assert.deepEqual(persisted.cookieSummary.missingRequired, []);
  assert.doesNotMatch(
    `${manifestText}\n${auditText}`,
    /synthetic-social-auth-|auth_token=|ct0=|Cookie:/iu,
  );
});

test('social auth import manifest writer redacts profile and diagnostic values', async (t) => {
  const runRoot = await mkdtemp(path.join(os.tmpdir(), 'bwk-social-auth-import-writer-'));
  t.after(() => rm(runRoot, { recursive: true, force: true }));
  const manifestPath = path.join(runRoot, 'manifest.json');
  await writeSocialAuthImportManifest(manifestPath, {
    site: 'x',
    status: 'failed',
    userDataDir: 'C:/synthetic/social-auth/profile',
    auth: {
      currentUrl: 'https://x.com/home?access_token=synthetic-social-auth-url-token',
    },
    error: {
      message: 'Authorization: Bearer synthetic-social-auth-error-token',
    },
  });

  const manifestText = await readFile(manifestPath, 'utf8');
  const auditText = await readFile(socialAuthImportRedactionAuditPath(manifestPath), 'utf8');
  assert.doesNotMatch(
    `${manifestText}\n${auditText}`,
    /C:\/synthetic\/social-auth|synthetic-social-auth-|access_token=|Authorization: Bearer/iu,
  );
  const persisted = JSON.parse(manifestText);
  assert.equal(persisted.userDataDir, '[REDACTED]');
  assert.equal(persisted.auth.currentUrl, 'https://x.com/home?[REDACTED]');
  assert.equal(persisted.error.message, 'Authorization: [REDACTED]');
});

test('social auth import manifest writer fails closed without raw cause exposure', async (t) => {
  const recovery = reasonCodeSummary('redaction-failed');
  const runRoot = await mkdtemp(path.join(os.tmpdir(), 'bwk-social-auth-import-fail-closed-'));
  t.after(() => rm(runRoot, { recursive: true, force: true }));
  const manifestPath = path.join(runRoot, 'manifest.json');
  const payload = {
    toJSON() {
      throw new Error(
        'Authorization: Bearer synthetic-social-auth-cause-token refresh_token=synthetic-social-auth-cause-refresh',
      );
    },
  };

  await assert.rejects(
    () => writeSocialAuthImportManifest(manifestPath, payload),
    (error) => {
      assert.equal(error.name, 'SocialAuthImportManifestRedactionFailure');
      assert.equal(error.reasonCode, 'redaction-failed');
      assert.equal(error.retryable, recovery.retryable);
      assert.equal(error.cooldownNeeded, recovery.cooldownNeeded);
      assert.equal(error.isolationNeeded, recovery.isolationNeeded);
      assert.equal(error.manualRecoveryNeeded, recovery.manualRecoveryNeeded);
      assert.equal(error.degradable, recovery.degradable);
      assert.equal(error.artifactWriteAllowed, recovery.artifactWriteAllowed);
      assert.equal(error.catalogAction, recovery.catalogAction);
      assert.equal(Object.hasOwn(error, 'cause'), false);
      assert.deepEqual(error.causeSummary, {
        name: 'Error',
        code: null,
      });
      assert.doesNotMatch(
        `${error.message}\n${JSON.stringify(error)}`,
        /synthetic-social-auth-cause-|Authorization: Bearer|refresh_token=/iu,
      );
      return true;
    },
  );
  assert.deepEqual(await readdir(runRoot), []);
});

test('social auth import CLI summary redacts diagnostic trust boundary fields', () => {
  const summary = socialAuthImportCliSummary({
    status: 'authenticated',
    mode: 'execute',
    site: 'x',
    cookieSummary: {
      count: 2,
      names: ['auth_token', 'ct0'],
    },
    auth: {
      currentUrl: 'https://x.com/home?access_token=synthetic-social-auth-stdout-url-token',
      challengeText: 'Authorization: Bearer synthetic-social-auth-stdout-auth',
    },
    manifestPath: 'runs/social-auth-import/synthetic/manifest.json',
    userDataDir: 'C:/synthetic/social-auth/stdout-profile',
  });

  assert.equal(summary.userDataDir, '[REDACTED]');
  assert.equal(summary.auth.currentUrl, 'https://x.com/home?[REDACTED]');
  assert.equal(summary.auth.challengeText, 'Authorization: [REDACTED]');
  assert.doesNotMatch(
    JSON.stringify(summary),
    /C:\/synthetic\/social-auth|synthetic-social-auth-stdout-|access_token=|Authorization: Bearer/iu,
  );
});

test('social auth import CLI summary maps redaction failure to safe reasonCode', () => {
  const recovery = reasonCodeSummary('redaction-failed');
  const manifest = {
    status: 'failed',
    mode: 'execute',
    site: 'x',
    cookieSummary: { count: 0 },
    auth: {
      toJSON() {
        throw new Error(
          'Authorization: Bearer synthetic-social-auth-summary-cause access_token=synthetic-social-auth-summary-access',
        );
      },
    },
    userDataDir: 'C:/synthetic/social-auth/summary-profile',
  };

  assert.throws(
    () => socialAuthImportCliSummary(manifest),
    (error) => {
      assert.equal(error.name, 'SocialAuthImportCliSummaryRedactionFailure');
      assert.equal(error.reasonCode, 'redaction-failed');
      assert.equal(error.retryable, recovery.retryable);
      assert.equal(error.cooldownNeeded, recovery.cooldownNeeded);
      assert.equal(error.isolationNeeded, recovery.isolationNeeded);
      assert.equal(error.manualRecoveryNeeded, recovery.manualRecoveryNeeded);
      assert.equal(error.degradable, recovery.degradable);
      assert.equal(error.artifactWriteAllowed, recovery.artifactWriteAllowed);
      assert.equal(error.catalogAction, recovery.catalogAction);
      assert.equal(Object.hasOwn(error, 'cause'), false);
      assert.deepEqual(error.causeSummary, {
        name: 'Error',
        code: null,
      });
      assert.doesNotMatch(
        `${error.message}\n${JSON.stringify(error)}`,
        /synthetic-social-auth-summary-|Authorization: Bearer|access_token=|summary-profile/iu,
      );
      return true;
    },
  );
});
