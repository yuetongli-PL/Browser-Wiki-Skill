# NL Intents

## search-book

- Slots: `queryText`
- Examples: `搜索《玄鉴仙族》`, `搜索夜无疆`, `搜索季越人`

## open-book

- Slots: `bookTitle`
- Examples: `打开《玄鉴仙族》`

## open-author

- Slots: `authorName`
- Examples: `打开季越人作者页`

## open-chapter

- Slots: `bookTitle` + `chapterRef`
- Examples: `打开《玄鉴仙族》第一章`, `读取《玄鉴仙族》第1454章正文`

## download-book

- Slots: `bookTitle`
- Examples: `下载《玄鉴仙族》`
- Behavior: return a local full-book TXT when available; otherwise call the PyPy downloader.

## open-category

- Examples: `打开玄幻小说`, `进入武侠小说`

## open-utility-page

- Examples: `打开阅读记录`

## open-auth-page

- Examples: `打开登录页`, `打开注册页`
- Navigation only; auth form submission is out of scope.
