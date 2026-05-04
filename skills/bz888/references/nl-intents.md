# Natural-language intents

| User intent | Canonical intent | Required slots | Notes |
| --- | --- | --- | --- |
| Search by title or author | `search-book` | `query` | Search form submission requires approval. |
| Open this book | `open-book` | `url` or `query` | Verify same-host URL before opening. |
| Read this chapter | `open-chapter` | `url` or `book + chapter` | Public chapter only. |
| Download this book | `download-book` | `url` or `query` | Start with dry-run manifest. |
| What can this site do | `inspect-site-capability` | none | Separate local implementation from live access. |

## Slot mapping

- `book-title`: title-like free text.
- `author`: author-like free text.
- `book-url`: same-host URL matching a book detail pattern.
- `chapter-url`: same-host URL matching a chapter pattern.
- `max-chapters`: optional bounded count for validation or sampling.
- `metadata-only`: optional flag for discovery without download execution.
