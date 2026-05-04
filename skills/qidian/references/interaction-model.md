# Interaction Model

| Node | Kind | Recognition |
| --- | --- | --- |
| Home page | `home` | `https://www.qidian.com/` |
| Search result page | `search-results-page` | `/soushu/` path |
| Book detail page | `book-detail-page` | `/book/<book-id>/` path |
| Chapter page | `chapter-page` | `/chapter/<book-id>/<chapter-id>/` path |
| Category/ranking page | `category-page` | `/all`, `/rank`, `/finish`, `/free`, `/mm`, `/boy` |
| Auth/risk/permission page | `auth-page` or unknown risk state | Must be reported and not bypassed |
| Login, permission, risk, restriction, recovery, or manual-risk signal | onboarding discovery node | Must enter inventory/reporting; never silently skip |
| Static support or artifact reference | ignored optional item | Record ignored reason when surfaced by discovery |

## Intent mapping

| Intent | Element | Action | State field |
| --- | --- | --- | --- |
| `search-book` | Search input/form | `search-submit` | `queryText` |
| `open-book` | Book result/detail link | `navigate` | `bookUrl` |
| `open-chapter` | Chapter link | `navigate` | `chapterUrl` |
| `open-category` | Category/ranking link | `navigate` | `categoryUrl` |
| `open-utility-page` | Public navigation link | `navigate` | `url` |
| `inspect-site-capability` | Local onboarding evidence | report only | `capabilityName` |

## Onboarding evidence model

Qidian onboarding evidence is safe-scope evidence, not a permission grant. The current local model expects:

- `NODE_INVENTORY`, `API_INVENTORY`, `UNKNOWN_NODE_REPORT`, `SITE_CAPABILITY_REPORT`, and `DISCOVERY_AUDIT` artifact paths or generation rules.
- `recognized`, `unknown`, or `ignored` state for every discovered node/API.
- Ignore reasons for ignored items.
- Zero unknown required nodes/APIs before reporting the safe-scope onboarding gate as complete.
- Explicit blocked status for paid/VIP, login, risk-control, permission, or manual-review states.
