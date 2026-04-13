# Flows

## Table of contents

- [Download full book](#download-full-book)
- [Open auth page](#open-auth-page)
- [Open author page](#open-author-page)
- [Open book directory](#open-book-directory)
- [Open category page](#open-category-page)
- [Open chapter text](#open-chapter-text)
- [Open utility page](#open-utility-page)
- [Search book](#search-book)

## Download full book

- Intent ID: `intent_403814e1340c`
- Intent Type: `download-book`
- Action: `download-book`
- Summary: Return a local full-book TXT if present; otherwise reuse or generate the host crawler and download the whole public book.

- Example user requests: `下载《玄鉴仙族》`
- Start state: any verified public page, or a known book directory page.
- Target state: a local full-book TXT exists.
- Main path: check local artifact -> if missing, run `pypy3 download_book.py` -> parse the paginated directory -> fetch chapters concurrently -> output a pretty TXT.
- No-op rule: if a complete local TXT already exists, return it directly.
- Success signal: `book-content/<run>/downloads/<book-title>.txt` exists.

## Open auth page

- Intent ID: `intent_8afed1853cec`
- Intent Type: `open-auth-page`
- Action: `navigate`
- Summary: Open a login or register page without submitting credentials.

- Example user requests: `打开登录页`, `打开注册页`
- Start state: home page.
- Target state: a login or register page.
- Main path: navigate only; do not submit credentials.
- Success signal: the auth page opens.

## Open author page

- Intent ID: `intent_f3dafeb41ff1`
- Intent Type: `open-author`
- Action: `navigate`
- Summary: Open the author page linked from a verified book directory.

- Example user requests: `打开季越人作者页`
- Start state: the directory page for `玄鉴仙族`.
- Target state: the linked author page.
- Main path: read the author link -> open the author page.
- Success signal: the author name and URL match the selected author.

## Open book directory

- Intent ID: `intent_28a6d344ce7b`
- Intent Type: `open-book`
- Action: `navigate`
- Summary: Open a verified book directory page from the home page or a search result.

- Example user requests: `打开《玄鉴仙族》`
- Start state: home page, search results page, or any verified public page.
- Target state: a book directory page.
- Main path: open the matching book link.
- Success signal: the URL matches `/biqu.../` and the page shows a chapter directory.

## Open category page

- Intent ID: `intent_919a7d0e1050`
- Intent Type: `open-category`
- Action: `navigate`
- Summary: Open a verified category page from the site navigation.

- Example user requests: `打开玄幻小说`, `进入武侠小说`
- Start state: home page.
- Target state: a category page.
- Main path: click the category navigation link.
- Success signal: the final URL matches the chosen category path.

## Open chapter text

- Intent ID: `intent_2b0eb43dce25`
- Intent Type: `open-chapter`
- Action: `navigate`
- Summary: Open a verified chapter page and read the public text.

- Example user requests: `打开《玄鉴仙族》第一章`, `读取《玄鉴仙族》第1454章正文`
- Start state: the directory page for `玄鉴仙族`.
- Target state: a chapter page with readable public text.
- Main path: locate the chapter link -> open the chapter page -> read the body text.
- Success signal: chapter title matches the target and body text length is positive.

## Open utility page

- Intent ID: `intent_3f6b72955f80`
- Intent Type: `open-utility-page`
- Action: `navigate`
- Summary: Open a low-risk utility page such as reading history.

- Example user requests: `打开阅读记录`
- Start state: home page.
- Target state: a low-risk utility page.
- Main path: click the utility link.
- Success signal: the utility page is open without triggering auth submission.

## Search book

- Intent ID: `intent_328848d8b3c8`
- Intent Type: `search-book`
- Action: `search-submit`
- Summary: Submit a book title or author query into the site search box and enter the /ss/ result page.

- Example user requests: `搜索《玄鉴仙族》`, `搜索季越人`
- Start state: any verified public page.
- Target state: a `/ss/` search results page or a directly resolved book directory.
- Main path: fill the search box -> submit -> open the matching result if needed.
- Success signal: the result page mentions the query or the final URL is a `/biqu.../` directory page.
- Freshness rule: search results are only for discovery; if the user asks for author, latest chapter, update time, or `多久更新`, fetch the live `/biqu.../` directory page before answering.

## Notes

- Download now prefers full paginated directory parsing and concurrent chapter fetches.
- `.part` files are written during download so progress is visible before finalization.
- For live metadata questions, trust the current book directory HTML over search-engine snippets or cached result pages.
- Prefer `og:novel:lastest_chapter_name` and `og:novel:update_time` from the directory page when present.
