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

## Natural Language Shortcuts

Map these user requests directly to the existing action or verification command. Keep live traffic plan-first unless the user explicitly asks to execute.

| User wording | Intent | Command mapping |
| --- | --- | --- |
| `IG 全量续跑 <handle>` / `resume Instagram full archive for <handle>` | `resume-full-archive` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --run-dir <previous-or-new-run>` |
| `Instagram 限流冷却后继续` / `continue IG after rate limit cooldown` | `resume-after-cooldown` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --risk-backoff-ms <ms> --risk-retries <n>` |
| `高速下载 IG 媒体 <handle>` / `fast Instagram media download` | `media-fast-download` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type media --download-media --max-media-downloads <n>` |
| `检查 Instagram 登录健康` / `IG health check` | `health-check` | `node scripts/social-auth-recover.mjs --execute --site instagram --verify` |
| `生成 Instagram live 验收报告` / `IG live acceptance report` | `live-acceptance-report` | `node scripts/social-live-verify.mjs --execute --site instagram --ig-account <handle>` |
| `刷新 Instagram KB` / `IG scenario KB refresh` | `kb-refresh` | `node scripts/social-kb-refresh.mjs --execute --site instagram --ig-account <handle>` |

## Reading order

1. [references/index.md](references/index.md)
2. [references/flows.md](references/flows.md)
3. [references/nl-intents.md](references/nl-intents.md)
4. [references/recovery.md](references/recovery.md)
5. [references/approval.md](references/approval.md)
6. [references/interaction-model.md](references/interaction-model.md)
