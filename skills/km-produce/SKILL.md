---
name: km-produce
description: Instruction-only Skill for the verified https://www.km-produce.com/ URL family. Use when Codex needs read-only public navigation, search, list pagination, or detail-page metadata extraction for KM Produce official catalog pages.
---

# km-produce Skill

## Skill name

`km-produce`

## Approved URL family

- `https://www.km-produce.com/`
- `https://km-produce.com/`
- Same-host subpaths only.

Do not treat similarly named fan, mirror, marketplace, streaming, CDN, affiliate, social, short-link, or advertisement domains as approved.

## Supported workflows

- Open public landing, age gate, works list, search, performer, label/category, series, and work detail pages.
- Search by work code, title, performer, label, series, visible tag, release date, or keyword.
- Browse public paginated catalog pages and preserve site ordering for catalog tasks.
- Extract objective public metadata, source URLs, and page-visible availability labels.
- Produce neutral Markdown/JSON/CSV catalog artifacts from public pages.

## Unsupported workflows

- Downloading, recording, stream capture, player URL extraction, CDN scraping, DRM removal, or sample/media mirroring.
- Login, account creation, purchase, cart, subscription, favorites, reviews, comments, surveys, contact forms, or newsletter submission.
- CAPTCHA solving, anti-bot bypass, region bypass, payment bypass, age-gate bypass, hidden API probing, or access-control bypass.
- Handling credentials, cookies, tokens, CSRF values, authorization headers, session ids, browser profiles, local storage, or account state.
- Producing graphic summaries or expanding page titles, tags, or summaries into explicit or invented descriptions.

## Safe browsing rules

- Stay inside `km-produce.com` / `www.km-produce.com` public pages.
- Use read-only navigation, ordinary links, public search, public filters, and public pagination.
- Treat adult-site age confirmation as a normal user-visible boundary; do not bypass it technically.
- Do not click purchase, watch, member, external, advertisement, affiliate, or player/download controls by default.
- Preserve official titles, work codes, names, dates, labels, and URLs.
- Stop on login, payment, block, suspicious redirect, unsupported side-effect UI, or an external domain.

## Extraction fields

Capture visible public fields when present:

- `site`: `km-produce`
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

Do not capture cookies, tokens, account ids, profile paths, account state, request headers, authorization material, CSRF values, local storage, raw player URLs, manifests, or media segment URLs.

## Pagination, search, and detail rules

- Search: use public site search or visible filters; record query/filter values and final URL.
- Listing traversal: follow visible numbered or next controls; stop on duplicates, missing next link, repeated page content, or requested limit.
- Detail verification: open detail pages for final work code, title, dates, performer names, runtime, labels, series, tags, and public availability labels.
- Filtered lists: record active label/category/date filters so downstream answers can explain scope.
- Date semantics: keep release, distribution, preorder, and availability labels separate when page labels differ.
- Deduplication: canonical URL first, work code second, normalized title only as a fallback.
- Missing fields: mark as `not_visible`; never infer performers, dates, labels, or categories from external sites.

## Downloader status

- No native downloader is claimed for `km-produce`.
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

- Confirm generated files are limited to `skills/km-produce/`.
- Validate YAML frontmatter includes `name` and `description`.
- Future live verification should record public URL, observed count, detail-open result, pagination result, and failure mode only.
- If pages redirect to an age gate, record that gate as the observed state rather than inventing page content.
- If an answer depends on an external store/watch service, stop unless that domain is separately approved.

## Failure modes

- `age-gate-required`: adult-site gate appears and user intent is not confirmed.
- `login-required`: account-only area blocks the workflow.
- `outside-url-family`: navigation leaves `km-produce.com`.
- `no-results`: public search returned no verified match.
- `ambiguous-result`: multiple works match and detail verification is needed.
- `metadata-missing`: requested field is not visible on the public page.
- `pagination-loop`: list pages repeat or next URL cycles.
- `blocked-or-rate-limited`: site blocks automated access.
- `external-service-required`: requested answer depends on an unapproved external domain.
- `api-catalog-not-promoted`: observed public DOM or network evidence has not passed verified API catalog promotion.
- `live-dom-fixture-only`: fixture coverage exists only for public metadata semantics and does not authorize downloader/API promotion.
- `downloader_not_allowed`: Site Capability Layer policy forbids routing this site to downloader.
- `download-unsupported`: request requires media retrieval or player URL extraction.

## Accepted request examples

- "Search KM Produce for this work code and return the official metadata."
- "List public KM Produce releases from this page with title, date, performers, and source URL."
- "Open these KM Produce detail pages and compare visible labels and release dates."

## Refused or downgraded request examples

- "Download the KM Produce video." Downgrade to official metadata and report `download-unsupported`.
- "Use my account/browser profile to access member pages." Refuse sensitive session handling.
- "Bypass the age check or access block." Refuse bypass behavior.
- "Extract stream manifests or CDN files." Refuse raw media extraction.
