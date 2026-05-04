---
name: bz888
description: Instruction-only Skill for https://www.bz888888888.com/. Use when Codex needs to search books, open verified book or chapter pages, or download a full public novel while respecting Cloudflare and access-control boundaries.
---

# BZ888 Skill

## Scope

- Site: `https://www.bz888888888.com/`
- Stay inside the verified `www.bz888888888.com` URL family.
- Primary archetype: `chapter-content`
- Safe actions: `navigate`, `download-book`
- Approval action kinds: `search-submit`
- Supported tasks: search public books, open public book directories, open public chapter pages, and download full public novels when the public page is reachable.
- Download entrypoint: `pypy3 src/sites/chapter-content/download/python/book.py`.
- Unified runner migration: use `node src/entrypoints/sites/download.mjs --site bz888 --input "<book-title-or-url>" --json` for a dry-run manifest. Add `--execute` only after the plan is reviewed.

## Current Site Capability status

- Local onboarding is code-backed for the safe public scope: site registry record, site capabilities record, chapter-content profile, SiteAdapter page/node/API classification, and downloader module registration.
- The live public entry currently returns a Cloudflare challenge in this environment. Treat that as a blocked live-access state, not a reason to bypass the challenge.
- OCR is allowed only for public chapter body images after the page is reachable through normal public access. OCR must not be used for CAPTCHA, login, permission, risk-control, or challenge surfaces.

## Reading order

1. Start with [references/index.md](references/index.md).
2. For task execution details, read [references/flows.md](references/flows.md).
3. For user utterances and slot mapping, read [references/nl-intents.md](references/nl-intents.md).
4. For failure handling, read [references/recovery.md](references/recovery.md).
5. For approval boundaries, read [references/approval.md](references/approval.md).
6. For the structured site model, read [references/interaction-model.md](references/interaction-model.md).

## Safety boundary

- Do not bypass Cloudflare, CAPTCHA, login, permission, or risk-control pages.
- Do not submit credentials, verification forms, payment forms, CAPTCHA answers, uploads, or unknown forms.
- Do not persist raw cookies, authorization headers, CSRF values, tokens, session ids, browser profiles, or equivalent sensitive material.
- If a live request returns a challenge or access-control page, report the boundary and stop.

## Do not do

- Do not leave the approved URL family as a workaround for a blocked page.
- Do not treat OCR as permission to solve access-control images.
- Do not claim live downloader validation succeeded when only local dry-run or synthetic tests were run.
