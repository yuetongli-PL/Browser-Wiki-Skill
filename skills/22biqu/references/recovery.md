# Recovery

## Common failures

| Failure | Trigger | Recovery |
| --- | --- | --- |
| missing-slot | User asks to open a book or chapter without enough identifying text. | Ask for the missing book title, author name, or chapter reference. |
| ambiguous-target | More than one candidate matches the given title or author. | Ask the user to disambiguate. |
| search-no-results | Search result count is zero. | Suggest a shorter query, an author name, or a different title. |
| stale-search-cache | A search snippet or older paginated page shows outdated author/latest-chapter/update-time metadata. | Re-fetch the live book directory root URL and, if needed, the final directory page; trust `og:novel:lastest_chapter_name` and `og:novel:update_time` over search snippets. |
| chapter-not-found | The book exists but the requested chapter cannot be mapped. | Return to the directory page and retry with an exact chapter title or a `Chapter N` reference. |
| artifact-stale | A local TXT exists but is incomplete or in an old format. | Recrawl and regenerate the full-book artifact. |
| approval-required | The request would submit auth data or leave the verified site boundary. | Stop and request human approval. |

## Runtime guidance

- Retry search with a shorter query or the author name if the first query returns no results.
- Search results are for locating the book only; verify fresh metadata from the live `/biqu.../` directory page before answering author/latest/update-time questions.
- If a chapter lookup fails, confirm the book title first, then the chapter title or number.
- If download is interrupted, rerun the same command; a valid local full-book artifact will be reused on later runs.
