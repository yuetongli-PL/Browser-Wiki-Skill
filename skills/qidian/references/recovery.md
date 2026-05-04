# Recovery

| Failure | Trigger | Recovery |
| --- | --- | --- |
| `search-no-results` | Search page has no credible book links. | Retry with a shorter title, author name, or original Chinese title if the user provides it. |
| `ambiguous-target` | Multiple books match the query. | Ask the user to choose by title, author, or URL. |
| `probe-or-risk-page` | The page returns a probe, verification, rate-limit, or challenge shell. | Report the risk state and stop; do not bypass. |
| `permission-required` | The chapter or book requires login, payment, VIP access, or account state. | Report the access boundary and stop. |
| `chapter-not-found` | Book opens but the requested chapter cannot be located. | Re-check the book directory or ask for the exact chapter title/URL. |
| `outside-scope` | Request points outside `www.qidian.com`. | Ask for approval before leaving the approved URL family. |
| `capability-not-implemented` | User asks for downloader, credentialed session reuse, paid/VIP chapter reading, or access-control handling. | State that the current Qidian skill is public-read-only and that onboarding only records these states as blocked/reportable. |

## Runtime guidance

- Search result pages are discovery surfaces; verify final facts from the book detail page.
- Treat probe/risk/permission states as findings that must be reported.
- Do not cache or persist sensitive browser/session material while investigating.
- Distinguish live, synthetic, and simulated evidence when explaining onboarding status or limitations.
