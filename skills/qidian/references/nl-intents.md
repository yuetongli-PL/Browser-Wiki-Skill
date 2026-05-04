# NL Intents

| Intent | Examples | Required slots |
| --- | --- | --- |
| `search-book` | `search Qidian for Lord of Mysteries`; `find this book on qidian` | `queryText` |
| `open-book` | `open this Qidian book`; `verify the book detail page` | `bookTitle` or `bookUrl` |
| `open-chapter` | `open chapter 10`; `read this public Qidian chapter` | `bookUrl` plus `chapterRef`, or `chapterUrl` |
| `open-category` | `open Qidian ranking`; `browse completed books` | `categoryName` |
| `open-utility-page` | `open this Qidian public page` | `url` |
| `inspect-site-capability` | `what can the Qidian skill do`; `is Qidian fully onboarded`; `why can't you read VIP chapters` | optional `capabilityName` |

## Slot rules

- Prefer exact Qidian URLs when provided.
- For title-only requests, search first and ask for disambiguation when multiple candidates match.
- Never infer permission to access paid, VIP, login-only, or account pages.
- For capability/status questions, separate completed public onboarding from blocked or unimplemented paid/login/downloader capabilities.
