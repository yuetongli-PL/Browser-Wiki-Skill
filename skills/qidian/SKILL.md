---
name: qidian
description: Instruction-only Skill for https://www.qidian.com/. Use when Codex needs to search Qidian books, open verified book detail pages, open public chapter pages, browse category/ranking pages, or inspect login/risk/permission surfaces without submitting credentials or bypassing access controls.
---

# Qidian Skill

## Scope

- Site: `https://www.qidian.com/`
- Stay inside the `www.qidian.com` URL family unless the user explicitly approves another Qidian-owned surface.
- Primary archetype: `chapter-content`
- Safe actions: `navigate`
- Approval action kinds: `search-submit`
- Supported tasks: search books, open book detail pages, open public chapter pages, and browse public category or ranking pages.
- Onboarding status: local Site Capability onboarding is code-backed for the safe public scope, including discovery inventories, coverage gate tests, and `site-doctor` artifact generation path.
- Current boundary: no verified full-book downloader is enabled for Qidian in this repository; no verified Qidian login reuse, paid/VIP chapter access, or access-control handling is enabled either.

## Reading order

1. Start with [references/index.md](references/index.md).
2. For task execution details, read [references/flows.md](references/flows.md).
3. For user utterances and slot mapping, read [references/nl-intents.md](references/nl-intents.md).
4. For failure handling, read [references/recovery.md](references/recovery.md).
5. For approval boundaries, read [references/approval.md](references/approval.md).
6. For the structured site model, read [references/interaction-model.md](references/interaction-model.md).

## Safety boundary

- Treat probe, verification, login, paywall, VIP, permission, rate-limit, and risk-control pages as reportable states.
- Do not submit credentials, payment forms, CAPTCHA, verification flows, or unknown forms.
- Do not implement CAPTCHA bypass, anti-bot bypass, access-control bypass, credential extraction, or silent privilege expansion.
- Do not persist raw cookies, authorization headers, CSRF values, tokens, session ids, browser profiles, or equivalent sensitive material.
- If a request crosses into paid/VIP, login-required, risk-control, or permission-required content, report the boundary and stop rather than attempting recovery through another surface.

## Do not do

- Do not claim a full-book download path exists unless a future verified downloader contract is added.
- Do not scrape paid or access-controlled chapter text.
- Do not leave the approved URL family as a workaround for a blocked Qidian page.
- Do not treat onboarding completion as permission to read paid/VIP content; onboarding only records that these states are discoverable and safely classified.
