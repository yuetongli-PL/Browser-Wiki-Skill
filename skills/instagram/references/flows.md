# Flows

## open-book: Content Links (Instagram)

- Intent ID: `intent_28a6d344ce7b`
- Intent Type: `open-book`
- Action: `navigate`

## open profile: Author Links (Instagram)

- Intent ID: `intent_b9c4ee1edc6e`
- Intent Type: `open-author`
- Action: `navigate`

## account-info: Instagram Profile

- Intent Type: `account-info`
- Command: `node src/entrypoints/sites/instagram-action.mjs account-info <handle>`
- Action: `query-social`

## profile-content: Instagram Posts / Reels / Media / Highlights

- Intent Type: `profile-content`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts|reels|media|highlights`
- Action: `query-social`
- Notes: for profile timeline extraction, prefer authenticated Instagram `api/v1/feed/user/<userId>/` pagination when the user id is known or discoverable; use captured compatible API payloads next, and DOM extraction only as the last fallback.

## full-archive: Instagram Account Deep History Export

- Intent Type: `profile-content`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts|reels|media|highlights --full-archive`
- Action: `query-social`
- Notes: formally prioritizes Instagram `api/v1/feed/user/<userId>/` pagination for profile-content/full-archive. Compatible GraphQL, generic `/api/v1/feed/user/`, and clips/reels payloads are fallbacks; DOM scroll is the final fallback.
- Artifact contract: preserve resumable state in the run directory, reuse completed downloads, retry failed media queue entries, run automatic manifest/media verification, and write CSV plus HTML indexes alongside JSON/JSONL artifacts.

## list-author-following: Instagram Profile Following List

- Intent Type: `list-author-following`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-following <handle>`
- Action: `query-social`

## list-followed-users: Logged-in Instagram Following List

- Intent Type: `list-followed-users`
- Command: `node src/entrypoints/sites/instagram-action.mjs followed-users [--account <handle>]`
- Action: `query-social`

## list-followed-updates: Instagram Followed Posts by Date

- Intent Type: `list-followed-updates`
- Command: `node src/entrypoints/sites/instagram-action.mjs followed-posts-by-date --date YYYY-MM-DD --max-users <n> --per-user-max-items <n>`
- Action: `query-social`
- Notes: expands the authenticated following dialog, scans followed profiles, opens candidate post/reel details, and filters by detail timestamps.

## download-book: Instagram Visible Media Download

- Intent Type: `download-book`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type media --download-media`
- Action: `download-media`
- Notes: downloads must be restartable from `media-queue.json`/`media-manifest.json`; failed media entries should be retried without redownloading completed files, then validated for hashes, size anomalies, content type, and video probe metadata where available.

## resume-full-archive: Instagram Full Archive Continuation

- Intent Type: `resume-full-archive`
- Example: `IG 全量续跑 <handle>` / `resume Instagram full archive for <handle>`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --run-dir <previous-or-new-run>`
- Action: `query-social`
- Notes: resume from the previous manifest/run directory, continue `api/v1/feed/user/<userId>/` pagination when a cursor remains, retry incomplete media work, and refresh CSV/HTML indexes after validation.

## resume-after-cooldown: Instagram Rate-Limit Cooldown Continuation

- Intent Type: `resume-after-cooldown`
- Example: `Instagram 限流冷却后继续` / `continue IG after rate limit cooldown`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts --full-archive --risk-backoff-ms <ms> --risk-retries <n>`
- Action: `query-social`

## media-fast-download: Instagram High-Speed Media Download

- Intent Type: `media-fast-download`
- Example: `高速下载 IG 媒体 <handle>` / `fast Instagram media download`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type media --download-media --max-media-downloads <n>`
- Action: `download-media`

## health-check: Instagram Session Health Check

- Intent Type: `health-check`
- Example: `检查 Instagram 登录健康` / `IG health check`
- Command: `node scripts/social-auth-recover.mjs --execute --site instagram --verify`
- Action: `query-social`

## live-acceptance-report: Instagram Live Acceptance Report

- Intent Type: `live-acceptance-report`
- Example: `生成 Instagram live 验收报告` / `IG live acceptance report`
- Command: `node scripts/social-live-verify.mjs --execute --site instagram --ig-account <handle>`
- Action: `query-social`

## kb-refresh: Instagram Scenario Knowledge Base Refresh

- Intent Type: `kb-refresh`
- Example: `刷新 Instagram KB` / `IG scenario KB refresh`
- Command: `node scripts/social-kb-refresh.mjs --execute --site instagram --ig-account <handle>`
- Action: `query-social`

## auto-resume-full-archive: Instagram Full Archive Auto Runner

- Intent Type: `auto-resume-full-archive`
- Command: `node scripts/social-live-resume.mjs --state <manifest-or-state.json> --site instagram --auto-execute --cooldown-minutes 30 --max-attempts 3`
- Action: `query-social`
- Notes: waits through cooldown, executes ready resume commands, rereads state/manifest after each run, and stops at archive completion, no candidates, max attempts, or `--max-cycles`.

## live-dashboard: Instagram Local Run Dashboard

- Intent Type: `live-dashboard`
- Command: `node scripts/social-live-dashboard.mjs --site instagram`
- Action: `query-social`
- Notes: writes `runs/social-live-dashboard/social-live-dashboard.html` with recent health, rate-limit, download quality, and drift classification.

## install-health-watch: Instagram Scheduled Health Watch

- Intent Type: `install-health-watch`
- Command: `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\install-social-health-watch-task.ps1 -Site instagram`
- Action: `query-social`
- Notes: dry-run by default. Add `-Execute` only after reviewing the generated `schtasks.exe` command.
