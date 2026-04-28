# Download Legacy Reduction Migration Matrix

Phase 3 records which download task shapes can run through native resource
resolution and which shapes must keep the legacy adapters. This document is an
evidence matrix, not a removal plan. Unsupported shapes must continue to fall
back to legacy until a matching native resolver has fixture-backed tests and
runner coverage.

## Scope

- Branch: `codex/download-legacy-reduction`
- Base assumption: Phase 2 runner contracts and the native resolver follow-up
  branch are already available locally.
- Current policy: do not delete or bypass legacy fallback paths.
- Live traffic status: not claimed. Native 22biqu coverage here is fixture or
  injected-fetch backed.

## Migration Matrix

| Site | Task shape | Native status | Resolver method | Completion reason | Evidence | Legacy fallback |
| --- | --- | --- | --- | --- | --- | --- |
| 22biqu | Request provides direct chapter entries through `chapters`, `chapterUrls`, or equivalent chapter seed fields. | Native | `native-22biqu-chapters` | `22biqu-chapters-provided` | `tests/node/download-site-modules.test.mjs`; `tests/node/downloads-runner.test.mjs` | Keep Python book downloader for inputs without chapter seeds. |
| 22biqu | Ordinary book URL or title resolved from local book-content artifacts via `bookContentDir`. | Native | `native-22biqu-book-content` | `22biqu-book-content-provided` | `tests/node/download-22biqu-native-resolver.test.mjs` | Keep Python book downloader when no matching artifact exists. |
| 22biqu | Ordinary book title resolved from a compiled KB root through `fixtureDir` and `index/sources.json`. | Native | `native-22biqu-book-content` | `22biqu-book-content-provided` | `tests/node/download-22biqu-native-resolver.test.mjs` | Keep Python book downloader when the KB root does not point to matching book-content artifacts. |
| 22biqu | Directory HTML supplied directly as `fixtureHtml`. | Native | `native-22biqu-directory` | `22biqu-directory-provided` | `tests/node/download-22biqu-native-resolver.test.mjs` | Keep Python book downloader when the HTML has no chapter links. |
| 22biqu | Directory HTML supplied from a local fixture file or book-content `directoryHtmlFile`. | Native | `native-22biqu-directory` | `22biqu-directory-provided` | `tests/node/download-22biqu-native-resolver.test.mjs` | Keep Python book downloader when the file is missing, unmatched, or has no chapter links. |
| 22biqu | Directory HTML supplied by an injected mock fetch function (`fetchImpl` / `mockFetchImpl`). | Native | `native-22biqu-directory` | `22biqu-directory-provided` | `tests/node/download-22biqu-native-resolver.test.mjs` | Keep Python book downloader when no injected fetch is supplied or it returns no parseable chapter links. |
| Bilibili | Request provides concrete resource seeds (`resources`, `resourceSeeds`, resolved media fields, etc.). | Native | `native-bilibili-resource-seeds` | `bilibili-resource-seeds-provided` | `tests/node/download-site-modules.test.mjs`; `tests/node/download-native-seed-schema.test.mjs` | Keep Bilibili legacy action for ordinary page or BV inputs without resource seeds. |
| Douyin | Request provides concrete direct media seeds. | Native | `native-douyin-resource-seeds` | `douyin-resource-seeds-provided` | `tests/node/download-site-modules.test.mjs`; `tests/node/download-native-seed-schema.test.mjs` | Keep Douyin legacy action for ordinary video, user, search, or feed inputs without resource seeds. |
| Xiaohongshu | Request provides concrete download bundle assets or resource seeds. | Native | `native-xiaohongshu-resource-seeds` | `xiaohongshu-resource-seeds-provided` | `tests/node/download-site-modules.test.mjs`; `tests/node/download-native-seed-schema.test.mjs` | Keep Xiaohongshu legacy action for ordinary note, search, or followed-user inputs without resource seeds. |
| X | Social archive, search, relation, followed-date, and profile-content inputs. | Legacy | n/a | `legacy-downloader-required` | `tests/node/download-site-modules.test.mjs`; `tests/node/downloads-runner.test.mjs` | Required. Native social archive/resource discovery is not implemented. |
| Instagram | Social archive, relation, followed-users, and profile-content inputs. | Legacy | n/a | `legacy-downloader-required` | `tests/node/download-site-modules.test.mjs`; `tests/node/downloads-runner.test.mjs` | Required. Native social archive/resource discovery is not implemented. |

## Remaining Fallback Reasons

The following task shapes intentionally remain on legacy fallback:

| Site | Shape | Stable reason | Why fallback remains |
| --- | --- | --- | --- |
| 22biqu | Live ordinary book URL or title with no local fixture, no KB root match, and no injected fetch/mock. | `legacy-downloader-required` | The native resolver does not perform real network crawling. Live book crawl remains in the Python downloader. |
| 22biqu | Local fixture or directory HTML exists but yields no chapter links. | `legacy-downloader-required` | Empty or unparseable local evidence is not enough to build a complete native resource queue. |
| Bilibili | Ordinary BV, video page, creator page, or page input without concrete resource seeds. | `legacy-downloader-required` | Page parsing and media URL discovery still live in the legacy site action. |
| Douyin | Ordinary video, user, search, or feed input without concrete direct media seeds. | `legacy-downloader-required` | Auth/session-aware discovery and direct media resolution still live in the legacy site action. |
| Xiaohongshu | Ordinary note, search, profile, or followed-user input without concrete bundle assets. | `legacy-downloader-required` | Browser/API discovery and bundle construction still live in the legacy site action. |
| X | Social archive, search, relation, followed-date, and media archive inputs. | `legacy-downloader-required` | Social cursor discovery, archive state, auth recovery, and media queue creation still live in the social legacy action. |
| Instagram | Social archive, relation, followed-users, and media archive inputs. | `legacy-downloader-required` | Social cursor discovery, relation pagination, auth recovery, and media queue creation still live in the social legacy action. |

## Test Gate

Focused gate for this branch:

```powershell
node --test tests\node\download-22biqu-native-resolver.test.mjs tests\node\download-site-modules.test.mjs tests\node\download-native-seed-schema.test.mjs tests\node\downloads-runner.test.mjs tests\node\download-media-executor.test.mjs
```

Passing this gate proves only fixture-backed native resolution, native seed
execution, legacy fallback routing, and generic media executor behavior. It
does not prove live crawling, authenticated social archive capability, or safe
fallback removal.
