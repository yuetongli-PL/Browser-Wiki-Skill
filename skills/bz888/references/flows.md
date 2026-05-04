# Flows

## Search book

- Intent type: `search-book`
- Input: book title, author name, or keywords.
- Main path: open an approved search surface under `www.bz888888888.com`, inspect public results, and select only same-host book links.
- Verification: open the candidate book detail page before reporting title, author, latest chapter, or update metadata.
- Stop condition: Cloudflare challenge, login gate, CAPTCHA, permission page, risk-control page, no results, or unknown form.

## Open book detail

- Intent type: `open-book`
- Input: BZ888 book URL or enough title/author context to choose a result.
- Main path: open a verified same-host book detail page.
- Verification: prefer visible title, author metadata, latest chapter link, and canonical URL from the live page.
- Stop condition: ambiguous candidates, removed book, challenge page, login gate, or permission gate.

## Open chapter

- Intent type: `open-chapter`
- Input: chapter URL, exact chapter title, or chapter number plus a verified book page.
- Main path: open a public same-host chapter page.
- Verification: read visible public text. If chapter body text is an image, OCR may be used only for public chapter body images.
- Stop condition: CAPTCHA, challenge page, login gate, permission page, risk-control page, or missing chapter.

## Download public book

- Intent type: `download-book`
- Input: book title or same-host book URL.
- Main path: first run `node src/entrypoints/sites/download.mjs --site bz888 --input "<book-title-or-url>" --json` and inspect the manifest. Add `--execute` only after the plan is acceptable.
- Verification: confirm the manifest uses `src/sites/chapter-content/download/python/book.py` and does not include cookies, auth headers, session tokens, or browser profile material.
- Stop condition: live challenge, access-control surface, OCR dependency missing, unreadable public chapter image, or incomplete chapter discovery.

## Report capability status

- Intent type: `inspect-site-capability`
- Main path: report local onboarding status, live access boundary, downloader route, and known gaps separately.
- Stop condition: do not convert a status explanation into live probing, bypass attempts, or credentialed access.
