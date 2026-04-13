---
name: 22biqu
description: Instruction-only Skill for https://www.22biqu.com/. Use when Codex needs to search books, open verified book or author pages, read chapter text, or download a full public novel while staying inside the approved 22biqu URL family.
---

# 22biqu Skill

## Scope

- Site: `https://www.22biqu.com/`
- Stay inside the verified `www.22biqu.com` URL family.
- Safe actions: `download-book`, `navigate`, `search-submit`
- Supported tasks: search books, open book directories, open author pages, open chapter pages, and download full public novels.
- Download entrypoint: `pypy3 download_book.py`.

## Reading order

1. Start with [references/index.md](references/index.md).
2. For task execution details, read [references/flows.md](references/flows.md).
3. For user utterances and slot mapping, read [references/nl-intents.md](references/nl-intents.md).
4. For failure handling, read [references/recovery.md](references/recovery.md).
5. For approval boundaries, read [references/approval.md](references/approval.md).
6. For the structured site model, read [references/interaction-model.md](references/interaction-model.md).

## Safety boundary

- Search and public chapter fetching are low-risk actions.
- Login or register pages may be opened, but credential submission is out of scope.
- Prefer returning a local full-book TXT if one already exists.
- If no valid local artifact exists, reuse or generate the host crawler and download again.
- For author/latest chapter/update-time questions, verify against the live `/biqu.../` directory page; do not trust search-engine snippets or older paginated pages as the final source of truth.

## Do not do

- Do not leave the verified 22biqu URL family.
- Do not invent unobserved actions or side-effect flows.
- Do not submit auth forms, uploads, payments, or unknown forms without approval.
