---
name: instagram
description: Instruction-only Skill for the observed https://www.instagram.com/ navigation space.
---

# instagram Skill

## Scope

- Site: `https://www.instagram.com/`
- Primary archetype: `catalog-detail`
- Capability families: download-content, navigate-to-author, navigate-to-category, navigate-to-content, navigate-to-utility-page, query-account-profile, query-social-content, query-social-relations, search-content
- Supported intents: account-info, profile-content, list-profile-content, list-author-posts, list-author-media, list-author-highlights, list-author-following, list-followed-users, list-followed-updates, search-content, open-post, open-reel, open-author
- Safe actions: `navigate`, `query-social`, `download-media`
- Actionable targets: Instagram

## Local Action Entrypoint

Use `node src/entrypoints/sites/instagram-action.mjs <action> [target]` for authenticated read-only extraction. Common actions:

- `followed-users`: infer the logged-in account when possible, or pass `--account <handle>`.
- `profile-content <handle> --content-type posts|reels|media|highlights --full-archive` for deep profile archive mode. The runner captures available API/cursor responses and falls back to deep DOM scroll.
- `profile-following <handle>`.
- `followed-posts-by-date --date YYYY-MM-DD --max-users <n> --per-user-max-items <n>` expands the authenticated following dialog, scans followed profiles, opens candidate post/reel details, and filters by detail timestamps.
- `search --query <keyword>`.
- Add `--download-media` to save visible image/video URLs with browser cookie passthrough.
- If the default Browser-Wiki-Skill profile is not logged in, set `BWS_INSTAGRAM_USER_DATA_DIR` or pass `--user-data-dir <Chrome user data dir>` to reuse an existing authenticated browser profile.

## Reading order

1. [references/index.md](references/index.md)
2. [references/flows.md](references/flows.md)
3. [references/nl-intents.md](references/nl-intents.md)
4. [references/recovery.md](references/recovery.md)
5. [references/approval.md](references/approval.md)
6. [references/interaction-model.md](references/interaction-model.md)
