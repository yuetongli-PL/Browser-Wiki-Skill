# qidian Index

## Site summary

- Entry URL: `https://www.qidian.com/`
- Host: `www.qidian.com`
- Site key: `qidian`
- Adapter: `chapter-content`
- Skill directory: `skills/qidian`

## Supported public surfaces

| Surface | URL pattern | Page type | Notes |
| --- | --- | --- | --- |
| Home | `https://www.qidian.com/` | `home` | Public entry page. |
| Search | `https://www.qidian.com/soushu/<query>.html` | `search-results-page` | Use for discovery only; verify book detail pages before answering metadata questions. |
| Book detail | `https://www.qidian.com/book/<book-id>/` | `book-detail-page` | Use as the canonical public book page when available. |
| Chapter | `https://www.qidian.com/chapter/<book-id>/<chapter-id>/` | `chapter-page` | Read only public chapter text. Stop on paid, login, VIP, or permission gates. |
| Category/rank | `/all`, `/rank`, `/finish`, `/free`, `/mm`, `/boy` | `category-page` | Safe navigation surfaces for discovery. |

## Capability status

- Implemented locally: site registry record, site capabilities record, chapter-content profile, adapter page-type routing, repo-local skill files, Qidian-specific onboarding discovery fixture, coverage gate, and `site-doctor` five-artifact generation path.
- Onboarding artifacts/generation path: `NODE_INVENTORY`, `API_INVENTORY`, `UNKNOWN_NODE_REPORT`, `SITE_CAPABILITY_REPORT`, and `DISCOVERY_AUDIT` are covered by the Qidian focused test and `site-doctor` simulation.
- Coverage boundary: focused onboarding passes with zero unknown required nodes/APIs for the safe public scope; ignored static/artifact items carry reasons.
- Not implemented: Qidian-specific downloader, credentialed session reuse, paywall handling, CAPTCHA handling, paid/VIP chapter reading, or access-control bypass.

## Risk notes

- A live anonymous request to `https://www.qidian.com/` may return a probe/challenge shell. Treat this as risk evidence, not a failure to bypass.
- If a user asks for paid/VIP content, report the access boundary and stop.
- If a live page differs from the synthetic onboarding fixture, report whether the evidence is live, synthetic, or simulated and do not overclaim completion outside the safe public scope.
