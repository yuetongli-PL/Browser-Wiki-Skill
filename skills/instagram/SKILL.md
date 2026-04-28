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
- `profile-content <handle> --content-type posts|reels|media|highlights --full-archive` for deep profile archive mode. The runner should prefer Instagram `api/v1/feed/user/<userId>/` pagination, fall back to any captured compatible API/cursor responses, then fall back to deep DOM scroll when live payloads are unavailable.
- `profile-following <handle>`.
- `followed-posts-by-date --date YYYY-MM-DD --max-users <n> --per-user-max-items <n>` expands the authenticated following dialog, scans followed profiles, opens candidate post/reel details, and filters by detail timestamps.
- `search --query <keyword>`.
- Add `--download-media` to save visible image/video URLs with browser cookie passthrough.
- Media downloads write `downloads.jsonl`, `media-queue.json`, and `media-manifest.json`; inspect `media-manifest.json` for SHA-256 hashes, small-file anomalies, content-type mismatches, and ffprobe video checks.
- Full archive and media download runs are resumable from the run directory/manifest. Reuse completed files, retry failed media queue entries, and verify the manifest before declaring the archive complete.
- Unified runner migration: use `node src/entrypoints/sites/download.mjs --site instagram --input <handle> --task-type social-archive --json` for a dry-run wrapper manifest. Add `--execute` only after the plan and session state are reviewed. Current branch behavior falls back to `instagram-action.mjs` for social archive/media execution; the runner docs do not claim that live auth is currently healthy.
- Full archive output should include machine-readable JSON/JSONL artifacts plus CSV and HTML indexes for local review.
- API parsing treats `api/v1/feed/user/<userId>/` as the formal Instagram profile-content/full-archive pagination path. GraphQL, generic `/api/v1/feed/user/`, and clips/reels-shaped payloads are compatibility fallbacks; DOM remains the final fallback when live payloads are unavailable.
- If the default Browser-Wiki-Skill profile is not logged in, set `BWS_INSTAGRAM_USER_DATA_DIR` or pass `--user-data-dir <Chrome user data dir>` to reuse an existing authenticated browser profile.

## Live Operations

- Resume a paused or bounded full archive with `node scripts/social-live-resume.mjs --state <manifest-or-state.json> --site instagram --auto-execute --cooldown-minutes 30 --max-attempts 3`.
- `--auto-execute` waits through cooldown, runs ready resume commands, rereads the latest state/manifest, and stops when the archive is complete, no candidates remain, max attempts is reached, or `--max-cycles` is exhausted.
- Build a local run dashboard with `node scripts/social-live-dashboard.mjs --site instagram`; open `runs/social-live-dashboard/social-live-dashboard.html` to review recent health, rate-limit, download quality, and drift signals.
- Preview a scheduled health watcher with `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\install-social-health-watch-task.ps1 -Site instagram`; add `-Execute` only after reviewing the generated `schtasks.exe` command.
- Action manifests can include `recoveryRunbook.commands`; prefer those exact next commands after login wall, challenge, rate-limit, API drift, or media-download failures.
- Unified runner manifests under `runs/downloads/instagram/...` can include normalized legacy source artifact paths. For media issues, inspect the action-level `media-manifest.json` and use the action manifest's `recoveryRunbook.commands` before retrying.

## Natural Language Shortcuts

Map these user requests directly to the existing action or verification command. Keep live traffic plan-first unless the user explicitly asks to execute.

| User wording | Intent | Command mapping |
| --- | --- | --- |
| `IG 全量续跑 <handle>` / `resume Instagram full archive for <handle>` | `resume-full-archive` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --run-dir <previous-or-new-run>` |
| `Instagram 限流冷却后继续` / `continue IG after rate limit cooldown` | `resume-after-cooldown` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --risk-backoff-ms <ms> --risk-retries <n>` |
| `高速下载 IG 媒体 <handle>` / `fast Instagram media download` | `media-fast-download` | `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type media --download-media --max-media-downloads <n>` |
| `检查 Instagram 登录健康` / `IG health check` | `health-check` | `node scripts/social-auth-recover.mjs --execute --site instagram --verify` |
| `生成 Instagram live 验收报告` / `IG live acceptance report` | `live-acceptance-report` | `node scripts/social-live-verify.mjs --live --execute --site instagram --ig-account <handle> --date <YYYY-MM-DD> --max-items <n> --max-users <n> --max-media-downloads <n> --timeout <ms> --case-timeout <ms> --run-root <dir>` |
| `刷新 Instagram KB` / `IG scenario KB refresh` | `kb-refresh` | `node scripts/social-kb-refresh.mjs --execute --site instagram --ig-account <handle>` |

Additional shortcuts:

| User wording | Intent | Command mapping |
| --- | --- | --- |
| `Instagram live dashboard` / `IG dashboard` | `live-dashboard` | `node scripts/social-live-dashboard.mjs --site instagram` |
| `IG 自动续跑` / `auto resume Instagram full archive` | `auto-resume-full-archive` | `node scripts/social-live-resume.mjs --state <manifest-or-state.json> --site instagram --auto-execute --cooldown-minutes 30 --max-attempts 3` |

## Reading order

1. [references/index.md](references/index.md)
2. [references/flows.md](references/flows.md)
3. [references/nl-intents.md](references/nl-intents.md)
4. [references/recovery.md](references/recovery.md)
5. [references/approval.md](references/approval.md)
6. [references/interaction-model.md](references/interaction-model.md)
