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

## Natural Language Shortcuts

Map these user requests directly to the existing action or verification command. Keep live traffic plan-first unless the user explicitly asks to execute.

| User wording | Intent | Command mapping |
| --- | --- | --- |
| `X 全量续跑 <handle>` / `resume X full archive for <handle>` | `resume-full-archive` | `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts --full-archive --max-api-pages <n> --run-dir <previous-or-new-run>` |
| `X 限流冷却后继续` / `continue X after rate limit cooldown` | `resume-after-cooldown` | `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts --full-archive --risk-backoff-ms <ms> --risk-retries <n>` |
| `高速下载 X 媒体 <handle>` / `fast X media download` | `media-fast-download` | `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type media --download-media --max-media-downloads <n>` |
| `检查 X 登录健康` / `X health check` | `health-check` | `node scripts/social-auth-recover.mjs --execute --site x --verify` |
| `生成 X live 验收报告` / `X live acceptance report` | `live-acceptance-report` | `node scripts/social-live-verify.mjs --execute --site x --x-account <handle>` |
| `刷新 X KB` / `X scenario KB refresh` | `kb-refresh` | `node scripts/social-kb-refresh.mjs --execute --site x --x-account <handle>` |

## Reading order

1. [references/index.md](references/index.md)
2. [references/flows.md](references/flows.md)
3. [references/nl-intents.md](references/nl-intents.md)
4. [references/recovery.md](references/recovery.md)
5. [references/approval.md](references/approval.md)
6. [references/interaction-model.md](references/interaction-model.md)
