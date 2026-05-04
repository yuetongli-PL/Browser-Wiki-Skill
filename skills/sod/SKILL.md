---
name: sod
description: Instruction-only Skill for the verified https://www.sod.co.jp/ URL family. Use when Codex needs read-only public navigation, search, list pagination, or detail-page metadata extraction for SOD official information pages.
---

# sod Skill

## Skill name

`sod`

## Approved URL family

- `https://www.sod.co.jp/`
- `https://sod.co.jp/`
- Same-host subpaths only.

Do not treat corporate, marketplace, streaming, fan, social, CDN, affiliate, short-link, or reseller domains as approved unless a separate task explicitly scopes them.

## Supported workflows

- Open public SOD information pages, age gates, list pages, search pages, performer pages, label pages, and work detail pages.
- Search by work code, title, performer, label, series, visible category, release date, or keyword.
- Paginate public catalog/list pages for count-limited or timeline outputs.
- Extract objective public metadata with official source URLs.
- Compare public detail-page fields across SOD official pages when all pages remain inside the approved URL family.

## Unsupported workflows

- Downloading, stream capture, CDN URL extraction, embedded-player reverse engineering, DRM removal, or sample mirroring.
- Login, account creation, purchase, cart, subscription, favorites, reviews, comments, surveys, contact forms, or newsletter submission.
- CAPTCHA solving, anti-bot bypass, age-gate bypass, payment bypass, region bypass, or access-control bypass.
- Persisting or using credentials, cookies, tokens, CSRF values, authorization headers, session ids, browser profiles, or account state.
- Following external marketplace/watch buttons to complete a task unless another approved skill covers that domain.

## Safe browsing rules

- Stay inside `sod.co.jp` / `www.sod.co.jp` public pages.
- Use read-only navigation, public search, public filters, and public pagination.
- Treat adult-site age confirmation as a user-visible gate; do not bypass it technically.
- Do not click purchase, watch, member, external, advertisement, or player controls by default.
- Preserve official titles, work codes, names, dates, labels, and URLs.
- Stop on login, payment, block, suspicious redirect, or unsupported side-effect UI.

## Extraction fields

Capture visible public fields when present:

- `site`: `sod`
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

Do not extract or store cookies, account ids, profile paths, local storage, CSRF values, authorization headers, request headers, raw player URLs, manifests, or media segment URLs.

## Pagination, search, and detail rules

- Search: use public SOD search or visible filters; record query/filter values and final URL.
- Pagination: follow numbered or next controls in order; stop at duplicate canonical URLs, repeated page content, no next control, or requested limit.
- Detail pages: use detail pages as source of truth for work code, title, dates, labels, performers, runtime, tags, and public availability labels.
- Filtered lists: record active label/category/date filters so downstream answers can explain scope.
- Deduplication: canonical URL first, work code second, normalized title as last fallback.
- External availability: record visible same-page labels only; do not follow external store/watch flows by default.

## Downloader status

- No native downloader is claimed for `sod`.
- This skill supports public metadata, search, pagination, and detail extraction only.
- Downloader status remains `not_supported`; use `downloader_not_allowed` for Site Capability Layer handoff/downloader requests.
- Refuse or downgrade download requests to official metadata, public detail links, or a downloader-gap note.

## Site Capability Layer boundary notes

- Live DOM fixtures are only SiteAdapter/onboarding evidence for public metadata semantics; they are not downloader evidence and are not API catalog promotion evidence.
- API catalog promotion remains `not_promoted` until verified API evidence, schema ownership, adapter validation, and policy gates are recorded.
- Any observed login, age/access gate, restriction, risk, redirect, or blocked page is reportable boundary evidence. Do not bypass it or convert it into a downloader/API capability.

## Artifact and redaction rules

- Allowed artifacts: Markdown, JSON, CSV, plain text, and source-link reports containing public metadata.
- Strip tracking, affiliate, session, and user-specific query parameters before persisting URLs.
- Never write cookies, tokens, credentials, account state, local storage, browser profile references, authorization headers, CSRF values, or raw media URLs.
- Keep outputs technical and neutral; do not add graphic descriptions or inferred adult-content classifications.

## Verification notes

- Verify generated files are limited to `skills/sod/`.
- Validate YAML frontmatter includes `name` and `description`.
- Future live verification should record public URL, observed count, detail-open result, and failure mode only.
- If SOD redirects to a corporate or external service domain, stop unless that domain is separately approved.

## Failure modes

- `age-gate-required`: adult-site gate appears and user intent is not confirmed.
- `login-required`: account-only area blocks the workflow.
- `outside-url-family`: navigation leaves `sod.co.jp`.
- `no-results`: public search returned no verified match.
- `ambiguous-result`: multiple works match; detail verification is needed.
- `pagination-loop`: list pages repeat or next URL cycles.
- `external-service-required`: requested answer depends on an unapproved external domain.
- `api-catalog-not-promoted`: observed public DOM or network evidence has not passed verified API catalog promotion.
- `live-dom-fixture-only`: fixture coverage exists only for public metadata semantics and does not authorize downloader/API promotion.
- `downloader_not_allowed`: Site Capability Layer policy forbids routing this site to downloader.
- `download-unsupported`: request requires media retrieval or player URL extraction.

## Accepted request examples

- "Search SOD for this work code and return the official metadata."
- "List public SOD releases from this page with title, date, performers, and source URL."
- "Open these SOD detail pages and compare visible labels and release dates."

## Refused or downgraded request examples

- "Download the SOD video." Downgrade to official metadata and report `download-unsupported`.
- "Use my account/browser profile to access member pages." Refuse sensitive session handling.
- "Bypass the age check or access block." Refuse bypass behavior.
- "Extract stream manifests or CDN files." Refuse raw media extraction.
