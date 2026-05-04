---
name: bilibili
description: Instruction-only Skill for https://www.bilibili.com/. Use when Codex needs to search videos, open verified video pages, open verified UP profiles, navigate approved bilibili category/channel pages, inspect authenticated read-only bilibili surfaces, or invoke the local bilibili downloader.
---

# bilibili Skill

## Scope

- Site: `https://www.bilibili.com/`
- Stay inside the verified bilibili URL family: `www.bilibili.com`, `search.bilibili.com`, and `space.bilibili.com`.
- Safe actions: `navigate`
- Supported tasks: search videos by title, BV code, or keyword; open verified video detail pages; open verified UP profiles; navigate approved category/channel entry pages; inspect authenticated read-only bilibili surfaces; invoke the local bilibili downloader when the user explicitly asks to download.
- Cross-host navigation model: home and video pages on `www.bilibili.com`, search results on `search.bilibili.com/all`, UP profiles on `space.bilibili.com/<mid>`.

## Sample coverage

- Video samples: BV1WjDDBGE3p, BV1Xx411c7cH
- UP profile samples: UP 1202350411, UP 2, UP 3494370898611008, UP 364185321, UP 62163211
- Search query samples: BV1WjDDBGE3p
- Approved category/channel families: anime, channels, documentary, food, game, guochuang, knowledge, movie
- Verified bangumi detail entrypoints: `https://www.bilibili.com/bangumi/play/ep508404`
- Verified UP video subpages: `https://space.bilibili.com/1202350411/video`
- Verified authenticated surfaces: `space/<mid>/dynamic`, `space/<mid>/fans/follow`, `space/<mid>/fans/fans`, `https://www.bilibili.com/watchlater/#/list`, `https://space.bilibili.com/<mid>/favlist?...`

## Execution policy

- Public bilibili pages MUST use the built-in browser.
- Authenticated bilibili pages MUST use the canonical opener: `node .\src\entrypoints\sites\bilibili-action.mjs open <bilibili-authenticated-url>`.
- Download requests MUST use the canonical downloader router: `node .\src\entrypoints\sites\bilibili-action.mjs download <url-or-bv>...`.
- Unified runner migration: for plan-first operations use `node .\src\entrypoints\sites\download.mjs --site bilibili --input <url-or-bv> --json`; add `--execute` only after reviewing the dry-run. Current branch behavior wraps the run artifacts and falls back to the bilibili action router when no native resources are resolved.
- Native downloader status: public BV/DASH resources can resolve natively; UP-space/list flows may stop at `bilibili-api-evidence-unavailable` with sanitized native miss phase diagnostics rather than falling back silently.
- Login bootstrap MUST run through the canonical helper path: `node .\src\entrypoints\sites\bilibili-action.mjs login https://www.bilibili.com/`.
- If authenticated surfaces report `profile-health-risk`, follow `CONTRIBUTING.md` manual health recovery boundaries; do not delete/rebuild profiles or bypass challenges automatically.
- The built-in browser NEVER carries bilibili login state.
- If an authenticated bilibili page needs a reusable local session, the router MUST trigger the local login helper before continuing.
- Routing table:
  - Public home/search/video/bangumi/UP/category pages -> `builtin-browser`
  - Authenticated read-only pages -> `local-profile-browser`
  - Login bootstrap -> `site-login`
  - Downloads -> `src/sites/bilibili/download/python/bilibili.py` via the action router

## Current Site Capability status

- Public BV/DASH resources can resolve and execute natively through the unified runner.
- UP-space/list flows may stop at `bilibili-api-evidence-unavailable` with sanitized native miss phase diagnostics rather than falling back silently.

## Command entrypoints

- Open a public or authenticated bilibili page through the router:
  - `node .\src\entrypoints\sites\bilibili-action.mjs open <url>`
- Download one or more bilibili videos:
  - `node .\src\entrypoints\sites\bilibili-action.mjs download <url-or-bv>...`
- Download runner dry-run / execute:
  - `node .\src\entrypoints\sites\download.mjs --site bilibili --input <url-or-bv> --json`
  - `node .\src\entrypoints\sites\download.mjs --site bilibili --input <url-or-bv> --execute --json`
- Resume or retry a runner run:
  - `node .\src\entrypoints\sites\download.mjs --site bilibili --input <url-or-bv> --execute --run-dir <run-dir> --resume`
  - `node .\src\entrypoints\sites\download.mjs --site bilibili --input <url-or-bv> --execute --run-dir <run-dir> --retry-failed`
- Run explicit login bootstrap:
  - `node .\src\entrypoints\sites\bilibili-action.mjs login https://www.bilibili.com/`
- Legacy helpers remain available when needed:
  - `node .\src\entrypoints\sites\bilibili-open-page.mjs <bilibili-authenticated-url>`
  - `node .\src\entrypoints\sites\site-login.mjs https://www.bilibili.com\ --no-headless`
  - `python .\src\sites\bilibili\download\python\bilibili.py <url-or-bv>...`
- Downloader prerequisites: `yt-dlp`, `ffmpeg`, and `ffprobe` must be available on PATH.

## Safety boundary

- Search and public navigation are low-risk actions.
- Treat video pages, bangumi detail pages, UP profiles, UP video subpages, search results, approved category/channel pages, and authenticated read-only surfaces as read-only.
- Login bootstrap is allowed only through the local helper path, and authenticated surfaces must stay read-only after login.
- No follow, unfollow, like, coin, favorite mutation, comment, post, or upload action is in scope.

## Do not do

- Do not leave the verified bilibili URL family.
- Do not open authenticated bilibili surfaces in the built-in browser.
- Do not route downloads through browser navigation when the action router or downloader applies.
- Do not invent unobserved engagement flows such as commenting, following, or purchasing.
- Do not submit auth forms or any unknown side-effect action without approval.
