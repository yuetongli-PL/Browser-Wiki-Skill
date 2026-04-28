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
- `profile-content <handle> --content-type posts|replies|media|highlights --full-archive --max-api-pages <n>` for deep archive mode. The runner captures target X GraphQL/search seed responses, follows API cursors when available, and falls back to DOM scroll when capture is unavailable. If no target API seed is captured, expect `archive.reason` such as `no-api-seed-captured`, `no-parseable-api-seed`, or `api-cursor-disabled-or-unavailable`; if a cursor replay fails after seed items were collected, `soft-cursor-exhausted` is reported as `degraded`, not complete.
- `profile-following <handle>`.
- `followed-posts-by-date --date YYYY-MM-DD [--query <keyword>] [--max-api-pages <n>]`.
- `search --query <keyword>`.
- Add `--download-media` to download media from the current result set with browser cookie passthrough. For X `profile-content`, `search`, and `followed-posts-by-date`, media download also enables API seed capture even when cursor paging is disabled; API media is preferred over DOM posters, and video entries use the best available `video/mp4` variant before falling back to DOM/performance-visible URLs. If API capture is unavailable and only an X video poster image is visible, reports mark it as `poster-only-video-fallback` with `expectedType: "video"`.
- Media downloads write `downloads.jsonl`, `media-queue.json`, and `media-manifest.json`; inspect `media-manifest.json` for SHA-256 hashes, small-file anomalies, content-type mismatches, and ffprobe video checks.
- Unified runner migration: use `node src/entrypoints/sites/download.mjs --site x --input <handle> --task-type social-archive --json` for a dry-run wrapper manifest. Add `--execute` only after the plan and session state are reviewed. Current branch behavior falls back to `x-action.mjs` for social archive/media execution; do not treat the runner wrapper as proof that live auth is healthy.
- If the default Browser-Wiki-Skill profile is not logged in, set `BWS_X_USER_DATA_DIR` or pass `--user-data-dir <Chrome user data dir>` to reuse an existing authenticated Chrome profile.

## Live Operations

- Resume a paused or bounded full archive with `node scripts/social-live-resume.mjs --state <manifest-or-state.json> --site x --auto-execute --cooldown-minutes 30 --max-attempts 3`.
- `--auto-execute` waits through cooldown, runs ready resume commands, rereads the latest state/manifest, and stops when the archive is complete, no candidates remain, max attempts is reached, or `--max-cycles` is exhausted.
- Build a local run dashboard with `node scripts/social-live-dashboard.mjs --site x`; open `runs/social-live-dashboard/social-live-dashboard.html` to review recent health, rate-limit, download quality, and drift signals.
- Preview a scheduled health watcher with `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\install-social-health-watch-task.ps1 -Site x`; add `-Execute` only after reviewing the generated `schtasks.exe` command.
- Action manifests can include `recoveryRunbook.commands`; prefer those exact next commands after login wall, challenge, rate-limit, API drift, or media-download failures.
- Unified runner manifests under `runs/downloads/x/...` can include normalized legacy source artifact paths. For media issues, inspect the action-level `media-manifest.json` and use the action manifest's `recoveryRunbook.commands` before retrying.

## Natural Language Shortcuts

Map these user requests directly to the existing action or verification command. Keep live traffic plan-first unless the user explicitly asks to execute.

| User wording | Intent | Command mapping |
| --- | --- | --- |
| `X 全量续跑 <handle>` / `resume X full archive for <handle>` | `resume-full-archive` | `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts --full-archive --max-api-pages <n> --run-dir <previous-or-new-run>` |
| `X 限流冷却后继续` / `continue X after rate limit cooldown` | `resume-after-cooldown` | `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts --full-archive --risk-backoff-ms <ms> --risk-retries <n>` |
| `高速下载 X 媒体 <handle>` / `fast X media download` | `media-fast-download` | `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type media --download-media --max-media-downloads <n>` |
| `检查 X 登录健康` / `X health check` | `health-check` | `node scripts/social-auth-recover.mjs --execute --site x --verify` |
| `生成 X live 验收报告` / `X live acceptance report` | `live-acceptance-report` | `node scripts/social-live-verify.mjs --live --execute --site x --x-account <handle> --max-items <n> --max-media-downloads <n> --timeout <ms> --case-timeout <ms> --run-root <dir>` |
| `刷新 X KB` / `X scenario KB refresh` | `kb-refresh` | `node scripts/social-kb-refresh.mjs --execute --site x --x-account <handle>` |

Additional shortcuts:

| User wording | Intent | Command mapping |
| --- | --- | --- |
| `X live dashboard` / `X dashboard` | `live-dashboard` | `node scripts/social-live-dashboard.mjs --site x` |
| `X 自动续跑` / `auto resume X full archive` | `auto-resume-full-archive` | `node scripts/social-live-resume.mjs --state <manifest-or-state.json> --site x --auto-execute --cooldown-minutes 30 --max-attempts 3` |

## Reading order

1. [references/index.md](references/index.md)
2. [references/flows.md](references/flows.md)
3. [references/nl-intents.md](references/nl-intents.md)
4. [references/recovery.md](references/recovery.md)
5. [references/approval.md](references/approval.md)
6. [references/interaction-model.md](references/interaction-model.md)
