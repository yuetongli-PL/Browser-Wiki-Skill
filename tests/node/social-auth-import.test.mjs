import test from 'node:test';
import assert from 'node:assert/strict';

import {
  parseArgs,
  parseCookieInput,
  summarizeCookies,
} from '../../scripts/social-auth-import.mjs';

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
