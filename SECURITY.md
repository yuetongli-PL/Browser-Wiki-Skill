# Security Policy

## Sensitive Data

Do not store or publish raw credentials, cookies, CSRF values, authorization
headers, SESSDATA, access tokens, refresh tokens, session ids, browser profile
directories, or equivalent sensitive material in this repository.

Before publishing or opening a pull request, run:

```powershell
node tools\prepublish-secret-scan.mjs
git diff --check
```

The secret scan is a guardrail, not a substitute for review. Also inspect new
fixtures, logs, browser captures, site-doctor outputs, and generated artifacts
before staging them.

## Automation Boundaries

This project must not include logic that bypasses CAPTCHA, MFA, platform risk
controls, rate limits, permissions, access control, or account restrictions.
When a site reports those states, automation should stop, downgrade, quarantine,
or require user action.

## Reporting

For security-sensitive issues, do not include secrets in issue bodies, logs, or
screenshots. Redact the material first and include only the affected module,
command, and sanitized error shape.
