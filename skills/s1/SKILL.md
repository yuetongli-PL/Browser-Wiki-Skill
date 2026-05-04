---
name: s1
description: Instruction-only Skill for the verified https://s1s1s1.com/ URL family. Use when Codex needs read-only public navigation, search, list pagination, or detail-page metadata extraction for S1 official catalog pages.
---

# s1 Skill

## Skill name

`s1`

## Approved URL family

- `https://s1s1s1.com/`
- `https://www.s1s1s1.com/`
- Same-host subpaths only.

Do not treat similarly named fan, mirror, marketplace, streaming, CDN, affiliate, social, or advertisement domains as approved.

## Supported workflows

- Open public landing, age gate, works list, search, performer, label/category, and work detail pages.
- Search by work code, title, performer, series, visible tag, release date, or keyword.
- Browse public paginated catalog pages and preserve site ordering for catalog tasks.
- Extract objective public metadata, source URLs, and page-visible availability labels.
- Produce neutral Markdown/JSON/CSV catalog artifacts from public pages.

## Unsupported workflows

- Downloading, recording, player URL extraction, CDN scraping, DRM removal, or sample mirroring.
- Login, account creation, purchase, cart, subscription, favorites, reviews, comments, surveys, forms, or newsletter submission.
- CAPTCHA solving, anti-bot bypass, region bypass, payment bypass, age-gate bypass, or access-control bypass.
- Handling credentials, cookies, tokens, CSRF values, authorization headers, session ids, browser profiles, local storage, or account state.
- Expanding page titles, tags, or summaries into graphic or invented descriptions.

## Safe browsing rules

- Stay on `s1s1s1.com` or `www.s1s1s1.com` public pages.
- Use read-only page loads, ordinary links, public search, public filters, and public pagination.
- Treat adult-site age confirmation as a normal user-visible boundary; do not bypass it technically.
- Do not click external watch, buy, store, affiliate, advertisement, member, or player-download links.
- Preserve official work codes, titles, names, dates, labels, and URLs exactly enough for verification.
- Stop and report when the site requires login, payment, blocked access, unsupported interaction, or an external domain.

## Extraction fields

Capture public visible fields when present:

- `site`: `s1`
- `sourceUrl`
- `canonicalUrl`
- `workId` or product code
- `title`
- `releaseDate`
- `distributionDate`
- `performers`
- `director`
- `maker`
- `label`
- `series`
- `runtime`
- `categories`
- `tags`
- `availabilityLabels`
- `sampleImageUrls`
- `detailText`: short neutral page-provided description when needed
- `relatedWorks`: same-host public related work links when relevant
- `pagination`: current page, next page URL, total pages or result count when visible
- `extractedAt`

Do not capture cookies, tokens, profile paths, account state, request headers, authorization material, CSRF values, local storage, raw player URLs, manifests, or media segment URLs.

## Pagination, search, and detail rules

- Search: use the public site search or visible filters; record query/filter values and final URL.
- Listing traversal: follow visible numbered or next controls; stop on duplicates, missing next link, repeated page content, or requested limit.
- Detail verification: open detail pages for final work code, title, dates, performer names, runtime, labels, series, and tags.
- Date semantics: keep release, distribution, preorder, and availability labels separate when page labels differ.
- Deduplication: canonical URL first, work code second, normalized title only as a fallback.
- Missing fields: mark as `not_visible`; never fill from memory or unrelated databases.

## Downloader status

- No native downloader is claimed for `s1`.
- Public metadata, search, pagination, and detail extraction are the supported capabilities.
- Downloader status remains `not_supported`; use `downloader_not_allowed` for Site Capability Layer handoff/downloader requests.
- Refuse or downgrade media requests to metadata extraction, official links, or a downloader-gap note.

## Site Capability Layer boundary notes

- Live DOM fixtures are only SiteAdapter/onboarding evidence for public metadata semantics; they are not downloader evidence and are not API catalog promotion evidence.
- API catalog promotion remains `not_promoted` until verified API evidence, schema ownership, adapter validation, and policy gates are recorded.
- Any observed login, age/access gate, restriction, risk, redirect, or blocked page is reportable boundary evidence. Do not bypass it or convert it into a downloader/API capability.

## Artifact and redaction rules

- Allowed outputs: Markdown tables, JSON records, CSV rows, plain text notes, and source-link lists.
- Remove tracking, affiliate, session, and user-specific query parameters from stored URLs.
- Never write cookies, credentials, account data, browser profile state, tokens, authorization headers, CSRF values, local storage, or raw media/player URLs.
- Keep descriptions neutral and technical; do not add graphic detail beyond source titles.

## Verification notes

- Confirm generated files are limited to `skills/s1/`.
- Validate frontmatter `name` and `description`.
- Future live verification should record URL, visible count, pagination result, detail-page success, and failure modes without sensitive state.
- If external buttons are required to answer a question, downgrade the request unless a separate approved site skill covers that domain.

## Failure modes

- `age-gate-required`: adult-site gate appears and user intent is not confirmed.
- `login-required`: requested content is account-only.
- `outside-url-family`: navigation leaves `s1s1s1.com`.
- `no-results`: public search found no verified work.
- `ambiguous-result`: multiple works match and detail verification is needed.
- `metadata-missing`: requested field is not visible on the public page.
- `pagination-loop`: list navigation repeats or duplicates pages.
- `external-service-required`: answer requires leaving to an unapproved domain.
- `api-catalog-not-promoted`: observed public DOM or network evidence has not passed verified API catalog promotion.
- `live-dom-fixture-only`: fixture coverage exists only for public metadata semantics and does not authorize downloader/API promotion.
- `downloader_not_allowed`: Site Capability Layer policy forbids routing this site to downloader.
- `download-unsupported`: request requires media retrieval.

## Accepted request examples

- "Search S1 for this work code and return the official public metadata."
- "List latest S1 public works with title, date, performers, and source URL."
- "Open this S1 detail page and extract neutral catalog fields."

## Refused or downgraded request examples

- "Download the S1 video." Downgrade to official metadata and report `download-unsupported`.
- "Use my cookies or browser profile to access member pages." Refuse sensitive session handling.
- "Bypass the age check or access block." Refuse bypass behavior.
- "Extract stream manifests or CDN URLs." Refuse raw media extraction.
