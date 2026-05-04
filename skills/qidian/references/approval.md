# Approval

## Safe action allowlist

- `navigate`
- `search-submit`

## Approval-required or blocked cases

- Login or register form submission.
- Payment, subscription, bookshelf, reward, voting, comment, or account-state actions.
- CAPTCHA, verification, probe, risk-control, or anti-bot flows.
- Paid, VIP, or otherwise access-controlled chapter text.
- Leaving `www.qidian.com` or using another Qidian-owned host.
- Any attempt to turn onboarding discovery evidence into downloader, credentialed-session, or paid-content capability.

## Current site boundary

- Public navigation, public search, public book detail pages, and public chapter pages are in scope.
- Credentialed or paid flows are out of scope for this skill.
- Onboarding completion means these blocked states are explicitly classified and reportable; it does not grant approval to bypass or read them.
