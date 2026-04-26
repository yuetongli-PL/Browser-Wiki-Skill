---
name: x
description: Instruction-only Skill for the observed https://x.com/home navigation space.
---

# x Skill

## Scope

- Site: `https://x.com/home`
- Primary archetype: `catalog-detail`
- Capability families: download-content, navigate-to-author, navigate-to-category, navigate-to-content, navigate-to-utility-page, query-account-profile, query-social-content, query-social-relations, search-content, switch-in-page-state
- Supported intents: account-info, profile-content, list-profile-content, list-author-posts, list-author-replies, list-author-media, list-author-highlights, list-author-following, list-followed-users, list-followed-updates, search-posts, open-post, open-author
- Safe actions: `navigate`, `query-social`, `download-media`
- Actionable targets: 18) X, For you, open source

## Local Action Entrypoint

Use `node src/entrypoints/sites/x-action.mjs <action> [target]` for authenticated read-only extraction. Common actions:

- `followed-users`: infer the logged-in account when possible, or pass `--account <handle>`.
- `profile-content <handle> --content-type posts|replies|media|highlights`.
- `profile-content <handle> --content-type posts|replies|media|highlights --full-archive --max-api-pages <n>` for deep archive mode. The runner captures X GraphQL/search responses, follows bottom cursors when available, and falls back to deep DOM scroll.
- `profile-following <handle>`.
- `followed-posts-by-date --date YYYY-MM-DD [--query <keyword>] [--max-api-pages <n>]`.
- `search --query <keyword>`.
- Add `--download-media` to save visible image/video URLs with browser cookie passthrough.
- If the default Browser-Wiki-Skill profile is not logged in, set `BWS_X_USER_DATA_DIR` or pass `--user-data-dir <Chrome user data dir>` to reuse an existing authenticated Chrome profile.

## Reading order

1. [references/index.md](references/index.md)
2. [references/flows.md](references/flows.md)
3. [references/nl-intents.md](references/nl-intents.md)
4. [references/recovery.md](references/recovery.md)
5. [references/approval.md](references/approval.md)
6. [references/interaction-model.md](references/interaction-model.md)
