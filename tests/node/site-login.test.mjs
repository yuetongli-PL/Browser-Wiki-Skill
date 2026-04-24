import test from 'node:test';
import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import { mkdtemp, rm } from 'node:fs/promises';

import { siteLogin } from '../../scripts/site-login.mjs';

function createResolvedProfile(workspace) {
  return {
    profile: {
      host: 'www.bilibili.com',
      authSession: {
        loginUrl: 'https://passport.bilibili.com/login',
        postLoginUrl: 'https://www.bilibili.com/',
      },
    },
    warnings: [],
    filePath: path.resolve('profiles/www.bilibili.com.json'),
  };
}

function createDouyinResolvedProfile() {
  return {
    profile: {
      host: 'www.douyin.com',
      authValidationSamples: {
        selfPostsUrl: 'https://www.douyin.com/user/self?showTab=post',
        likesUrl: 'https://www.douyin.com/user/self?showTab=like',
        followFeedUrl: 'https://www.douyin.com/follow?tab=feed',
      },
      authSession: {
        loginUrl: 'https://www.douyin.com/',
        postLoginUrl: 'https://www.douyin.com/',
        verificationUrl: 'https://www.douyin.com/user/self?showTab=like',
        keepaliveUrl: 'https://www.douyin.com/follow?tab=feed',
        keepaliveIntervalMinutes: 120,
        cooldownMinutesAfterRisk: 120,
        preferVisibleBrowserForAuthenticatedFlows: true,
        requireStableNetworkForAuthenticatedFlows: true,
        autoLoginByDefault: true,
      },
    },
    warnings: [],
    filePath: path.resolve('profiles/www.douyin.com.json'),
  };
}

function createXiaohongshuResolvedProfile() {
  return {
    profile: {
      host: 'www.xiaohongshu.com',
      authValidationSamples: {
        notificationUrl: 'https://www.xiaohongshu.com/notification',
      },
      authSession: {
        loginUrl: 'https://www.xiaohongshu.com/login?redirectPath=https%3A%2F%2Fwww.xiaohongshu.com%2Fnotification',
        postLoginUrl: 'https://www.xiaohongshu.com/notification',
        verificationUrl: 'https://www.xiaohongshu.com/notification',
        keepaliveUrl: 'https://www.xiaohongshu.com/notification',
        keepaliveIntervalMinutes: 180,
        cooldownMinutesAfterRisk: 180,
        preferVisibleBrowserForAuthenticatedFlows: true,
        requireStableNetworkForAuthenticatedFlows: true,
        autoLoginByDefault: false,
      },
    },
    warnings: [],
    filePath: path.resolve('profiles/www.xiaohongshu.com.json'),
  };
}

function createResolvedBrowserOptions(workspace) {
  return {
    reuseLoginState: true,
    userDataDir: path.join(workspace, 'profiles', 'bilibili.com'),
    cleanupUserDataDirOnShutdown: false,
    authConfig: {
      loginUrl: 'https://passport.bilibili.com/login',
      postLoginUrl: 'https://www.bilibili.com/',
    },
  };
}

function createDouyinResolvedBrowserOptions(workspace) {
  return {
    reuseLoginState: true,
    userDataDir: path.join(workspace, 'profiles', 'douyin.com'),
    cleanupUserDataDirOnShutdown: false,
    authConfig: {
      loginUrl: 'https://www.douyin.com/',
      postLoginUrl: 'https://www.douyin.com/',
      verificationUrl: 'https://www.douyin.com/user/self?showTab=like',
      keepaliveUrl: 'https://www.douyin.com/follow?tab=feed',
      keepaliveIntervalMinutes: 120,
      cooldownMinutesAfterRisk: 120,
      preferVisibleBrowserForAuthenticatedFlows: true,
      requireStableNetworkForAuthenticatedFlows: true,
      autoLoginByDefault: true,
    },
  };
}

function createXiaohongshuResolvedBrowserOptions(workspace) {
  return {
    reuseLoginState: true,
    userDataDir: path.join(workspace, 'profiles', 'xiaohongshu.com'),
    cleanupUserDataDirOnShutdown: false,
    authConfig: {
      loginUrl: 'https://www.xiaohongshu.com/login?redirectPath=https%3A%2F%2Fwww.xiaohongshu.com%2Fnotification',
      postLoginUrl: 'https://www.xiaohongshu.com/notification',
      verificationUrl: 'https://www.xiaohongshu.com/notification',
      keepaliveUrl: 'https://www.xiaohongshu.com/notification',
      keepaliveIntervalMinutes: 180,
      cooldownMinutesAfterRisk: 180,
      preferVisibleBrowserForAuthenticatedFlows: true,
      requireStableNetworkForAuthenticatedFlows: true,
      autoLoginByDefault: false,
    },
  };
}

test('siteLogin writes identity-aware report fields for authenticated sessions', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-'));
  let closed = false;
  let openCalls = 0;
  const startupUrls = [];

  try {
    const report = await siteLogin('https://www.bilibili.com/', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      manualLoginTimeoutMs: 1_000,
      waitForManualLogin: false,
      autoLogin: true,
    }, {
      async resolveSiteAuthProfile() {
        const resolved = createResolvedProfile(workspace);
        resolved.warnings = ['compat warning'];
        return resolved;
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        openCalls += 1;
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            closed = true;
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'authenticated',
          credentials: {
            source: 'env:BILIBILI_USERNAME/BILIBILI_PASSWORD',
          },
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.bili-avatar img',
          },
          waitedForManualLogin: false,
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.bilibili.com/',
          title: 'bilibili',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.bili-avatar img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used when waitForManualLogin=false');
      },
    });

    assert.equal(report.auth.status, 'authenticated');
    assert.equal(report.auth.credentialsSource, 'env:BILIBILI_USERNAME/BILIBILI_PASSWORD');
    assert.equal(report.auth.loginStateDetected, true);
    assert.equal(report.auth.identityConfirmed, true);
    assert.equal(report.auth.identitySource, 'selector:.bili-avatar img');
    assert.equal(report.auth.reopenVerificationPassed, true);
    assert.equal(report.auth.persistenceVerified, true);
    assert.equal(report.auth.shutdownMode, 'graceful');
    assert.equal(report.site.runtimePurpose, 'login');
    assert.equal(report.auth.runtimeUrl, 'https://www.bilibili.com/');
    assert.equal(report.auth.warmupSummary?.attempted, false);
    assert.equal(report.auth.keepaliveUrl, null);
    assert.equal(report.auth.keepaliveIntervalMinutes, null);
    assert.equal(report.auth.cooldownMinutesAfterRisk, null);
    assert.equal(report.auth.preferVisibleBrowserForAuthenticatedFlows, false);
    assert.equal(report.auth.requireStableNetworkForAuthenticatedFlows, false);
    assert.equal(report.auth.sessionHealthSummary?.successfulLogins, 1);
    assert.equal(report.site.userDataDir, path.join(workspace, 'profiles', 'bilibili.com'));
    assert.equal(report.site.browserStartUrl, 'https://www.bilibili.com/');
    assert.equal(report.site.browserAttachedVia, 'existing-target');
    assert.equal(report.warnings.includes('compat warning'), true);
    assert.equal(report.reports.json.endsWith('site-login-report.json'), true);
    assert.equal(closed, true);
    assert.equal(openCalls, 2);
    assert.deepEqual(startupUrls, [
      'https://www.bilibili.com/',
      'https://www.bilibili.com/',
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin uses the login URL as startup page when interactive manual login is expected', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-manual-start-'));
  const startupUrls = [];

  try {
    await siteLogin('https://www.bilibili.com/', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      headless: false,
      waitForManualLogin: true,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createResolvedProfile(workspace);
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.header-entry-mini img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.bilibili.com/',
          title: 'bilibili',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.header-entry-mini img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(startupUrls[0], 'https://passport.bilibili.com/login');
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin reports session-reused when persisted session is already authenticated', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-reused-'));
  const startupUrls = [];
  try {
    const report = await siteLogin('https://www.bilibili.com/', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createResolvedProfile(workspace);
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.header-entry-mini img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.bilibili.com/',
          title: 'bilibili',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.header-entry-mini img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.auth.status, 'session-reused');
    assert.equal(report.auth.identityConfirmed, true);
    assert.equal(report.auth.identitySource, 'selector:.header-entry-mini img');
    assert.equal(report.auth.persistenceVerified, true);
    assert.deepEqual(startupUrls, [
      'https://www.bilibili.com/',
      'https://www.bilibili.com/',
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin suppresses historical crashed-profile warning after successful graceful persistence verification', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-warning-suppression-'));
  try {
    const report = await siteLogin('https://www.bilibili.com/', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createResolvedProfile(workspace);
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: false,
          warnings: ['Persistent browser profile last exit type was Crashed.'],
        };
      },
      async openBrowserSession() {
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.header-entry-mini img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.bilibili.com/',
          title: 'bilibili',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.header-entry-mini img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.auth.status, 'session-reused');
    assert.equal(report.auth.persistenceVerified, true);
    assert.equal(report.warnings.includes('Persistent browser profile last exit type was Crashed.'), false);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin does not report session-reused when reopen verification fails', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-reopen-fail-'));
  let openCalls = 0;

  try {
    const report = await siteLogin('https://www.bilibili.com/', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createResolvedProfile(workspace);
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        openCalls += 1;
        return {
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.header-entry-mini img',
          },
        };
      },
      async inspectLoginState() {
        if (openCalls === 1) {
          return {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.header-entry-mini img',
          };
        }
        return {
          currentUrl: 'https://space.bilibili.com/1202350411/dynamic',
          title: 'dynamic',
          loggedIn: false,
          loginStateDetected: false,
          identityConfirmed: false,
          identitySource: null,
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.auth.status, 'authenticated');
    assert.equal(report.auth.reopenVerificationPassed, false);
    assert.equal(report.auth.persistenceVerified, false);
    assert.match(report.warnings.join('\n'), /could not confirm persisted login state/u);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin does not treat heuristic logged-in state as reusable without confirmed identity', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-heuristic-only-'));
  let openCalls = 0;

  try {
    const report = await siteLogin('https://www.bilibili.com/', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createResolvedProfile(workspace);
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        openCalls += 1;
        return {
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.header-entry-mini img',
          },
        };
      },
      async inspectLoginState() {
        if (openCalls === 1) {
          return {
            currentUrl: 'https://www.bilibili.com/',
            title: 'bilibili',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.header-entry-mini img',
          };
        }
        return {
          currentUrl: 'https://space.bilibili.com/1202350411/dynamic',
          title: 'dynamic',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: false,
          identitySource: 'heuristic:no-login-form-or-logged-out-indicator',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.notEqual(report.auth.status, 'session-reused');
    assert.equal(report.auth.reopenVerificationPassed, false);
    assert.equal(report.auth.persistenceVerified, false);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin reports challenge-required without claiming identity confirmation', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-challenge-'));
  try {
    const report = await siteLogin('https://www.bilibili.com/', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      waitForManualLogin: false,
      autoLogin: true,
    }, {
      async resolveSiteAuthProfile() {
        return createResolvedProfile(workspace);
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        return {
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'challenge-required',
          credentials: {
            source: 'env:BILIBILI_USERNAME/BILIBILI_PASSWORD',
          },
          challengeRequired: true,
          challengeText: 'slide verify',
          loginState: {
            currentUrl: 'https://passport.bilibili.com/login',
            title: 'login',
            loggedIn: false,
            loginStateDetected: false,
            identityConfirmed: false,
            identitySource: null,
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://passport.bilibili.com/login',
          title: 'login',
          loggedIn: false,
          loginStateDetected: false,
          identityConfirmed: false,
          identitySource: null,
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.auth.status, 'challenge-required');
    assert.equal(report.auth.identityConfirmed, false);
    assert.match(report.warnings.join('\n'), /additional verification/u);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin preserves the original openBrowserSession failure when no session was created', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-open-failure-'));
  try {
    await assert.rejects(
      siteLogin('https://www.xiaohongshu.com/notification', {
        outDir: workspace,
        profilePath: path.resolve('profiles/www.xiaohongshu.com.json'),
        waitForManualLogin: false,
        autoLogin: false,
        headless: false,
      }, {
        async resolveSiteAuthProfile() {
          return createXiaohongshuResolvedProfile();
        },
        async resolveSiteBrowserSessionOptions() {
          return createXiaohongshuResolvedBrowserOptions(workspace);
        },
        async inspectPersistentProfileHealth() {
          return {
            healthy: true,
            warnings: [],
          };
        },
        async prepareSiteSessionGovernance() {
          return {
            policyDecision: { allowed: true },
            lease: null,
            authSessionSummary: null,
          };
        },
        async openBrowserSession() {
          throw new Error('profile already locked');
        },
        async releaseSessionLease() {},
      }),
      /profile already locked/u,
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin defaults reports under runs/sites/site-login when outDir is omitted', async () => {
  let reportJsonPath = null;

  try {
    const report = await siteLogin('https://www.bilibili.com/', {
      profilePath: path.resolve('profiles/www.bilibili.com.json'),
      manualLoginTimeoutMs: 1_000,
      waitForManualLogin: false,
      autoLogin: true,
    }, {
      async resolveSiteAuthProfile() {
        return createResolvedProfile(process.cwd());
      },
      async resolveSiteBrowserSessionOptions() {
        return createResolvedBrowserOptions(process.cwd());
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        return {
          browserStartUrl: 'https://passport.bilibili.com/login',
          browserAttachedVia: 'created-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'authenticated',
          credentials: { source: 'none' },
          persistenceVerified: true,
          challengeRequired: false,
          runtimeUrl: 'https://www.bilibili.com/',
          autoLoginAttempted: false,
          autoLoginSucceeded: false,
          loginStateDetected: 'logged-in',
          identityConfirmed: true,
          warnings: [],
        };
      },
      async inspectLoginState() {
        return {
          status: 'logged-in',
          detected: 'logged-in',
          identityConfirmed: true,
          antiCrawlSignals: [],
        };
      },
      async prepareSiteSessionGovernance() {
        return {
          policyDecision: {
            allowed: true,
            riskCauseCode: null,
            riskAction: null,
          },
          lease: null,
        };
      },
      async finalizeSiteSessionGovernance() {
        return {
          riskCauseCode: null,
          riskAction: null,
          profileQuarantined: false,
        };
      },
      async releaseSessionLease() {},
    });

    reportJsonPath = report.reports?.json ?? null;
    assert.ok(reportJsonPath);
    assert.match(reportJsonPath, /[\\/]runs[\\/]sites[\\/]site-login[\\/]/u);
  } finally {
    if (reportJsonPath) {
      await rm(path.dirname(reportJsonPath), { recursive: true, force: true });
    }
  }
});

test('siteLogin uses the Douyin verification URL for non-interactive startup and persistence checks', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-douyin-verification-'));
  const startupUrls = [];

  try {
    const report = await siteLogin('https://www.douyin.com/?recommend=1', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.douyin.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createDouyinResolvedProfile();
      },
      async resolveSiteBrowserSessionOptions() {
        return createDouyinResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.douyin.com/user/self?showTab=like',
            title: 'douyin',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:a[href*="/user/self"] img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.douyin.com/user/self?showTab=like',
          title: 'douyin',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:a[href*="/user/self"] img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.auth.status, 'session-reused');
    assert.equal(report.auth.reopenVerificationPassed, true);
    assert.equal(report.auth.persistenceVerified, true);
    assert.equal(report.site.runtimePurpose, 'login');
    assert.equal(report.auth.runtimeUrl, 'https://www.douyin.com/user/self?showTab=like');
    assert.equal(report.auth.warmupSummary?.attempted, false);
    assert.equal(report.auth.keepaliveUrl, 'https://www.douyin.com/follow?tab=feed');
    assert.equal(report.auth.keepaliveIntervalMinutes, 120);
    assert.equal(report.auth.cooldownMinutesAfterRisk, 120);
    assert.equal(report.auth.preferVisibleBrowserForAuthenticatedFlows, true);
    assert.equal(report.auth.requireStableNetworkForAuthenticatedFlows, true);
    assert.equal(report.auth.verificationUrl, 'https://www.douyin.com/user/self?showTab=like');
    assert.equal(report.site.userDataDir, path.join(workspace, 'profiles', 'douyin.com'));
    assert.deepEqual(startupUrls, [
      'https://www.douyin.com/user/self?showTab=like',
      'https://www.douyin.com/user/self?showTab=like',
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin reuses Douyin verification startup and can auto-restore auth after reopening the browser', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-douyin-auto-restore-'));
  const startupUrls = [];
  let authAttempts = 0;

  try {
    const report = await siteLogin('https://www.douyin.com/?recommend=1', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.douyin.com.json'),
      waitForManualLogin: false,
      autoLogin: true,
    }, {
      async resolveSiteAuthProfile() {
        return createDouyinResolvedProfile();
      },
      async resolveSiteBrowserSessionOptions() {
        return createDouyinResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'created-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        authAttempts += 1;
        return {
          status: 'authenticated',
          credentials: {
            source: 'env:DOUYIN_USERNAME/DOUYIN_PASSWORD',
          },
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.douyin.com/user/self?showTab=like',
            title: 'douyin',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:a[href*="/user/self"] img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.douyin.com/user/self?showTab=like',
          title: 'douyin',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:a[href*="/user/self"] img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.auth.status, 'authenticated');
    assert.equal(report.auth.reopenVerificationPassed, true);
    assert.equal(report.auth.persistenceVerified, true);
    assert.equal(report.auth.credentialsSource, 'env:DOUYIN_USERNAME/DOUYIN_PASSWORD');
    assert.equal(report.site.runtimePurpose, 'login');
    assert.equal(report.auth.runtimeUrl, 'https://www.douyin.com/user/self?showTab=like');
    assert.equal(report.auth.warmupSummary?.attempted, false);
    assert.equal(report.auth.keepaliveUrl, 'https://www.douyin.com/follow?tab=feed');
    assert.equal(report.auth.keepaliveIntervalMinutes, 120);
    assert.equal(report.auth.cooldownMinutesAfterRisk, 120);
    assert.equal(report.auth.preferVisibleBrowserForAuthenticatedFlows, true);
    assert.equal(report.auth.requireStableNetworkForAuthenticatedFlows, true);
    assert.equal(authAttempts, 2);
    assert.deepEqual(startupUrls, [
      'https://www.douyin.com/user/self?showTab=like',
      'https://www.douyin.com/user/self?showTab=like',
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin uses the Douyin keepalive URL for keepalive runtime startup and persistence checks', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-douyin-keepalive-runtime-'));
  const startupUrls = [];

  try {
    const report = await siteLogin('https://www.douyin.com/?recommend=1', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.douyin.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
      runtimePurpose: 'keepalive',
    }, {
      async resolveSiteAuthProfile() {
        return createDouyinResolvedProfile();
      },
      async resolveSiteBrowserSessionOptions() {
        return createDouyinResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.douyin.com/follow?tab=feed',
            title: 'douyin keepalive',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:a[href*="/user/self"] img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.douyin.com/follow?tab=feed',
          title: 'douyin keepalive',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:a[href*="/user/self"] img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.site.runtimePurpose, 'keepalive');
    assert.equal(report.site.browserStartUrl, 'https://www.douyin.com/');
    assert.equal(report.auth.runtimeUrl, 'https://www.douyin.com/follow?tab=feed');
    assert.equal(report.auth.warmupSummary?.attempted, true);
    assert.equal(report.auth.warmupSummary?.completed, true);
    assert.deepEqual(report.auth.warmupSummary?.urls, [
      'https://www.douyin.com/',
      'https://www.douyin.com/follow?tab=feed',
    ]);
    assert.equal(report.auth.keepaliveUrl, 'https://www.douyin.com/follow?tab=feed');
    assert.equal(report.auth.keepaliveIntervalMinutes, 120);
    assert.equal(report.auth.cooldownMinutesAfterRisk, 120);
    assert.equal(report.auth.preferVisibleBrowserForAuthenticatedFlows, true);
    assert.equal(report.auth.requireStableNetworkForAuthenticatedFlows, true);
    assert.equal(report.auth.verificationUrl, 'https://www.douyin.com/follow?tab=feed');
    assert.equal(report.auth.sessionHealthSummary?.successfulKeepalives, 1);
    assert.deepEqual(startupUrls, [
      'https://www.douyin.com/',
      'https://www.douyin.com/',
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin uses the Xiaohongshu verification URL for non-interactive startup and persistence checks', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-xiaohongshu-verification-'));
  const startupUrls = [];

  try {
    const report = await siteLogin('https://www.xiaohongshu.com/explore', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.xiaohongshu.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createXiaohongshuResolvedProfile();
      },
      async resolveSiteBrowserSessionOptions() {
        return createXiaohongshuResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.xiaohongshu.com/notification',
            title: 'xiaohongshu',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.notification-page .user-avatar img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.xiaohongshu.com/notification',
          title: 'xiaohongshu',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.notification-page .user-avatar img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.auth.status, 'session-reused');
    assert.equal(report.auth.autoLogin, false);
    assert.equal(report.auth.reopenVerificationPassed, true);
    assert.equal(report.auth.persistenceVerified, true);
    assert.equal(report.site.runtimePurpose, 'login');
    assert.equal(report.auth.runtimeUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.auth.warmupSummary?.attempted, false);
    assert.equal(report.auth.keepaliveUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.auth.keepaliveIntervalMinutes, 180);
    assert.equal(report.auth.cooldownMinutesAfterRisk, 180);
    assert.equal(report.auth.preferVisibleBrowserForAuthenticatedFlows, true);
    assert.equal(report.auth.requireStableNetworkForAuthenticatedFlows, true);
    assert.equal(report.auth.verificationUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.site.userDataDir, path.join(workspace, 'profiles', 'xiaohongshu.com'));
    assert.deepEqual(startupUrls, [
      'https://www.xiaohongshu.com/notification',
      'https://www.xiaohongshu.com/notification',
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin uses the Xiaohongshu login URL as startup page when interactive manual login is expected', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-xiaohongshu-manual-start-'));
  const startupUrls = [];

  try {
    await siteLogin('https://www.xiaohongshu.com/explore', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.xiaohongshu.com.json'),
      headless: false,
      waitForManualLogin: true,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createXiaohongshuResolvedProfile();
      },
      async resolveSiteBrowserSessionOptions() {
        return createXiaohongshuResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.xiaohongshu.com/notification',
            title: 'xiaohongshu',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.notification-page .user-avatar img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.xiaohongshu.com/notification',
          title: 'xiaohongshu',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.notification-page .user-avatar img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(
      startupUrls[0],
      'https://www.xiaohongshu.com/login?redirectPath=https%3A%2F%2Fwww.xiaohongshu.com%2Fnotification',
    );
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin recovers a reusable Xiaohongshu session before entering manual wait', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-xiaohongshu-reuse-probe-'));
  const startupUrls = [];
  const navigatedUrls = [];
  let inspectCalls = 0;

  try {
    const report = await siteLogin('https://www.xiaohongshu.com/explore', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.xiaohongshu.com.json'),
      headless: false,
      waitForManualLogin: true,
      autoLogin: false,
    }, {
      async resolveSiteAuthProfile() {
        return createXiaohongshuResolvedProfile();
      },
      async resolveSiteBrowserSessionOptions() {
        return createXiaohongshuResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait(url) {
            navigatedUrls.push(url);
          },
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'credentials-unavailable',
          credentials: {
            available: false,
            source: null,
          },
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.xiaohongshu.com/login?redirectPath=https%3A%2F%2Fwww.xiaohongshu.com%2Fnotification',
            title: 'xiaohongshu login',
            loggedIn: false,
            loginStateDetected: false,
            identityConfirmed: false,
            identitySource: null,
          },
        };
      },
      async inspectLoginState() {
        inspectCalls += 1;
        return {
          currentUrl: 'https://www.xiaohongshu.com/notification',
          title: 'xiaohongshu notification',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.notification-page',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used when reusable session is recovered');
      },
    });

    assert.equal(report.auth.status, 'session-reused');
    assert.equal(report.auth.waitedForManualLogin, false);
    assert.equal(report.auth.currentUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.auth.identityConfirmed, true);
    assert.equal(startupUrls[0], 'https://www.xiaohongshu.com/login?redirectPath=https%3A%2F%2Fwww.xiaohongshu.com%2Fnotification');
    assert.deepEqual(navigatedUrls, [
      'https://www.xiaohongshu.com/notification',
      'https://www.xiaohongshu.com/notification',
    ]);
    assert.equal(inspectCalls, 2);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});

test('siteLogin uses the Xiaohongshu notification URL for keepalive runtime startup and persistence checks', async () => {
  const workspace = await mkdtemp(path.join(os.tmpdir(), 'bwk-site-login-xiaohongshu-keepalive-runtime-'));
  const startupUrls = [];

  try {
    const report = await siteLogin('https://www.xiaohongshu.com/explore', {
      outDir: workspace,
      profilePath: path.resolve('profiles/www.xiaohongshu.com.json'),
      waitForManualLogin: false,
      autoLogin: false,
      runtimePurpose: 'keepalive',
    }, {
      async resolveSiteAuthProfile() {
        return createXiaohongshuResolvedProfile();
      },
      async resolveSiteBrowserSessionOptions() {
        return createXiaohongshuResolvedBrowserOptions(workspace);
      },
      async inspectPersistentProfileHealth() {
        return {
          healthy: true,
          warnings: [],
        };
      },
      async openBrowserSession() {
        startupUrls.push(arguments[0]?.startupUrl ?? null);
        return {
          browserStartUrl: arguments[0]?.startupUrl ?? null,
          browserAttachedVia: 'existing-target',
          async navigateAndWait() {},
          async close() {
            return {
              shutdownMode: 'graceful',
              profileFlush: { stable: true },
            };
          },
        };
      },
      async ensureAuthenticatedSession() {
        return {
          status: 'already-authenticated',
          credentials: null,
          challengeRequired: false,
          loginState: {
            currentUrl: 'https://www.xiaohongshu.com/notification',
            title: 'xiaohongshu keepalive',
            loggedIn: true,
            loginStateDetected: true,
            identityConfirmed: true,
            identitySource: 'selector:.notification-page .user-avatar img',
          },
        };
      },
      async inspectLoginState() {
        return {
          currentUrl: 'https://www.xiaohongshu.com/notification',
          title: 'xiaohongshu keepalive',
          loggedIn: true,
          loginStateDetected: true,
          identityConfirmed: true,
          identitySource: 'selector:.notification-page .user-avatar img',
        };
      },
      async waitForAuthenticatedSession() {
        throw new Error('manual wait should not be used');
      },
    });

    assert.equal(report.site.runtimePurpose, 'keepalive');
    assert.equal(report.site.browserStartUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.auth.runtimeUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.auth.autoLogin, false);
    assert.equal(report.auth.warmupSummary?.attempted, true);
    assert.equal(report.auth.warmupSummary?.completed, true);
    assert.deepEqual(report.auth.warmupSummary?.urls, [
      'https://www.xiaohongshu.com/notification',
    ]);
    assert.equal(report.auth.keepaliveUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.auth.keepaliveIntervalMinutes, 180);
    assert.equal(report.auth.cooldownMinutesAfterRisk, 180);
    assert.equal(report.auth.preferVisibleBrowserForAuthenticatedFlows, true);
    assert.equal(report.auth.requireStableNetworkForAuthenticatedFlows, true);
    assert.equal(report.auth.verificationUrl, 'https://www.xiaohongshu.com/notification');
    assert.equal(report.auth.sessionHealthSummary?.successfulKeepalives, 1);
    assert.deepEqual(startupUrls, [
      'https://www.xiaohongshu.com/notification',
      'https://www.xiaohongshu.com/notification',
    ]);
  } finally {
    await rm(workspace, { recursive: true, force: true });
  }
});
