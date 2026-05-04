# Flows

## Search book

- Intent type: `search-book`
- Input: book title, author name, or keywords.
- Main path: open `https://www.qidian.com/soushu/<query>.html`, inspect public results, and select only links under `https://www.qidian.com/book/`.
- Verification: open the candidate book detail page before reporting title, author, latest chapter, or update metadata.
- Stop condition: no results, probe/risk page, login gate, or unknown form.

## Open book detail

- Intent type: `open-book`
- Input: Qidian book URL or enough title/author context to choose a result.
- Main path: open a verified `https://www.qidian.com/book/<book-id>/` page.
- Verification: prefer page title, author metadata, visible book title, and canonical URL from the live page.
- Stop condition: ambiguous candidates, removed book, probe/risk page, or permission gate.

## Open chapter

- Intent type: `open-chapter`
- Input: chapter URL, exact chapter title, or chapter number plus a verified book page.
- Main path: open a public `https://www.qidian.com/chapter/<book-id>/<chapter-id>/` page.
- Verification: read only visible public chapter text.
- Stop condition: paid/VIP chapter, login gate, permission page, risk-control page, or missing chapter.

## Open category or ranking page

- Intent type: `open-category`
- Input: category, ranking, free, finish, male, or female channel request.
- Main path: open a known public navigation URL under `www.qidian.com`.
- Verification: report visible public listings and links without submitting forms other than approved search.

## Open utility page

- Intent type: `open-utility-page`
- Input: public utility/navigation page request.
- Main path: open the requested URL only if it stays under `www.qidian.com`.
- Stop condition: auth, payment, account, bookshelf, or profile state requiring credentials.

## Report onboarding or capability status

- Intent type: `inspect-site-capability`
- Input: user asks whether Qidian is fully connected, why a page is unsupported, or what the current skill can do.
- Main path: report the safe public scope, the completed local onboarding evidence, and any blocked surfaces separately.
- Evidence to mention when relevant: repo-local skill, `chapter-content` profile, site registry/capability records, SiteAdapter page/node/API classification, discovery inventory generation path, coverage gate, and `site-doctor` simulation.
- Stop condition: do not convert a status explanation into live probing, downloader execution, login reuse, paid/VIP access, or risk-control handling unless the user explicitly asks for a safe validation step.
