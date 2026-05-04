# bz888 Index

## Site summary

- Entry URL: `https://www.bz888888888.com/`
- Host: `www.bz888888888.com`
- Site key: `bz888`
- Adapter: `chapter-content`
- Skill directory: `skills/bz888`

## Supported public surfaces

| Surface | URL pattern | Page type | Notes |
| --- | --- | --- | --- |
| Home | `https://www.bz888888888.com/` | `home` | Public entry page when not blocked by challenge. |
| Search | `/search`, `/s`, `/ss`, `/modules/article/search.php` | `search-results-page` | Search submission requires approval. |
| Book detail | `/book/...`, `/novel/...`, `/txt/...`, `/biqu...`, numeric directories | `book-detail-page` | Verify before reporting metadata. |
| Chapter | `/.../<chapter>.html` | `chapter-page` | Read only public chapter text or public chapter body images. |
| Category | `/sort`, `/class`, `/category`, `/list`, `/quanben`, `/rank`, `/top` | `category-page` | Safe navigation surfaces for discovery. |

## Capability status

- Implemented locally: site registry record, site capabilities record, chapter-content profile, SiteAdapter classification, repo-local skill files, and downloader module registration.
- Downloader boundary: full-book public downloads route through `src/sites/chapter-content/download/python/book.py` with site-specific argv construction in `src/sites/downloads/site-modules/bz888.mjs`.
- Live access boundary: public GET is currently blocked by a Cloudflare challenge in this environment; this is recorded as blocked live access and must not be bypassed.

## Risk notes

- Challenge pages, login pages, permission pages, and risk-control surfaces are reportable blocked states.
- OCR is limited to public chapter body images and must not be applied to challenge or verification images.
- If live evidence differs from local profile assumptions, label the evidence as live, local, or synthetic.
