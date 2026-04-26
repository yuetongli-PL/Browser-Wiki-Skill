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

## full-archive: Instagram Account Deep History Export

- Intent Type: `profile-content`
- Command: `node src/entrypoints/sites/instagram-action.mjs profile-content <handle> --content-type posts|reels|media|highlights --full-archive`
- Action: `query-social`
- Notes: captures available API/cursor responses, keeps DOM fallback, and reports archive strategy/completeness metadata.

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
