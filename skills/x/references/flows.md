# Flows

## open-book: Content Links (18) X)

- Intent ID: `intent_28a6d344ce7b`
- Intent Type: `open-book`
- Action: `navigate`

## Set Active Member: Tab Group (For you, Following)

- Intent ID: `intent_3074d39613a3`
- Intent Type: `switch-tab`
- Action: `select-member`

## Search Book: Search Form

- Intent ID: `intent_328848d8b3c8`
- Intent Type: `search-book`
- Action: `search-submit`

## account-info: X Account Profile

- Intent Type: `account-info`
- Command: `node src/entrypoints/sites/x-action.mjs account-info <handle>`
- Action: `query-social`

## profile-content: X Account Posts / Replies / Media / Highlights

- Intent Type: `profile-content`
- Command: `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts|replies|media|highlights`
- Action: `query-social`

## full-archive: X Account Deep History Export

- Intent Type: `profile-content`
- Command: `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts|replies|media|highlights --full-archive --max-api-pages <n>`
- Action: `query-social`
- Notes: captures X GraphQL/search responses, follows cursors when available, and reports archive strategy/completeness metadata.

## list-author-following: X Account Following List

- Intent Type: `list-author-following`
- Command: `node src/entrypoints/sites/x-action.mjs profile-following <handle>`
- Action: `query-social`

## list-followed-users: Logged-in X Following List

- Intent Type: `list-followed-users`
- Command: `node src/entrypoints/sites/x-action.mjs followed-users [--account <handle>]`
- Action: `query-social`

## list-followed-updates: X Followed Posts by Date

- Intent Type: `list-followed-updates`
- Command: `node src/entrypoints/sites/x-action.mjs followed-posts-by-date --date YYYY-MM-DD [--query <keyword>] [--max-api-pages <n>]`
- Action: `query-social`
- Notes: uses X followed-search operators plus captured API cursor pagination when available.

## download-book: X Visible Media Download

- Intent Type: `download-book`
- Command: `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type media --download-media`
- Action: `download-media`

## resume-full-archive: X Full Archive Continuation

- Intent Type: `resume-full-archive`
- Example: `X 全量续跑 <handle>` / `resume X full archive for <handle>`
- Command: `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts --full-archive --max-api-pages <n> --run-dir <previous-or-new-run>`
- Action: `query-social`

## resume-after-cooldown: X Rate-Limit Cooldown Continuation

- Intent Type: `resume-after-cooldown`
- Example: `X 限流冷却后继续` / `continue X after rate limit cooldown`
- Command: `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type posts --full-archive --risk-backoff-ms <ms> --risk-retries <n>`
- Action: `query-social`

## media-fast-download: X High-Speed Media Download

- Intent Type: `media-fast-download`
- Example: `高速下载 X 媒体 <handle>` / `fast X media download`
- Command: `node src/entrypoints/sites/x-action.mjs profile-content <handle> --content-type media --download-media --max-media-downloads <n>`
- Action: `download-media`

## health-check: X Session Health Check

- Intent Type: `health-check`
- Example: `检查 X 登录健康` / `X health check`
- Command: `node scripts/social-auth-recover.mjs --execute --site x --verify`
- Action: `query-social`

## live-acceptance-report: X Live Acceptance Report

- Intent Type: `live-acceptance-report`
- Example: `生成 X live 验收报告` / `X live acceptance report`
- Command: `node scripts/social-live-verify.mjs --execute --site x --x-account <handle>`
- Action: `query-social`

## kb-refresh: X Scenario Knowledge Base Refresh

- Intent Type: `kb-refresh`
- Example: `刷新 X KB` / `X scenario KB refresh`
- Command: `node scripts/social-kb-refresh.mjs --execute --site x --x-account <handle>`
- Action: `query-social`
