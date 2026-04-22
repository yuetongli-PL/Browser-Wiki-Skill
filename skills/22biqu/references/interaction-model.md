# Interaction Model

## Site profile

- Archetype: `navigation-hub` + `catalog-detail`
- URL family: `https://www.22biqu.com/`
- Safe actions: `download-book`, `navigate`, `search-submit`

## Verified capabilities

| Capability | Description |
| --- | --- |
| search-book | Submit a site search and enter the `/ss/` result page. |
| open-book | Open a `/biqu.../` book directory page. |
| open-author | Open the linked author page from a book directory. |
| open-chapter | Open a chapter page and read the body text. |
| download-book | Download a full public novel and emit a pretty TXT. |
| live-book-metadata | Read author/latest chapter/update time from the live directory HTML. |

## Download path

- Entrypoint: `pypy3 src/sites/chapter-content/download/python/book.py`
- Metadata path: `pypy3 src/sites/chapter-content/download/python/book.py <url> --book-title "<title>" --metadata-only`
- Directory strategy: parse paginated directory pages first, then fetch chapters concurrently.
- Concurrency: chapter fetch concurrency is currently `64`; chapter sub-pages are still ordered serially inside each chapter.
- Output strategy: write `.part` files during execution, then finalize TXT and JSON outputs.
- Freshness rule: for author/latest chapter/update time, trust the live `/biqu.../` directory page and its `og:novel:*` metadata over search-engine snippets.

## Verified examples

- Books: 玄鉴仙族
- Authors: 季越人
- Latest download: [latest full-book artifact](../../../book-content/20260413T182812124Z_www.22biqu.com_book-content/downloads/book_7b16b9aa9e82.txt)
