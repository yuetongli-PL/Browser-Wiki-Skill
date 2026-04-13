# 22biqu Index

## Site summary

- Entry URL: `https://www.22biqu.com/`
- Site type: navigation hub + catalog detail.
- Verified tasks: search books, open directories, open author pages, open chapter text, download full public novels.
- Category examples: 玄幻小说, 武侠小说, 都市小说, 历史小说
- Utility pages: 阅读记录
- Auth pages: 用户登录, 用户注册
- Known books: 玄鉴仙族
- Known authors: 季越人
- Latest full-book coverage: 1 book(s), 1515 chapter(s)

## Reference navigation

- [flows.md](flows.md)
- [recovery.md](recovery.md)
- [approval.md](approval.md)
- [nl-intents.md](nl-intents.md)
- [interaction-model.md](interaction-model.md)

## Download notes

- First try a local full-book TXT.
- If no valid local artifact exists, reuse or generate `crawler-scripts/www.22biqu.com/crawler.py`.
- Download now uses full paginated directory parsing plus concurrent chapter fetches.
- The downloader writes `.part` files during execution and finalizes the TXT and JSON files at the end.
