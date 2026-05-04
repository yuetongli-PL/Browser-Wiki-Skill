---
name: 8man
description: Instruction-only Skill for the verified https://www.8man.jp/ URL family. Use when Codex needs read-only public navigation, search, list pagination, or profile/detail metadata extraction for 8MAN official pages.
---

# 8man Skill

## Skill name

`8man`

## Approved URL family

- `https://www.8man.jp/`
- `https://8man.jp/`
- Same-host subpaths only.

Do not treat fan, mirror, marketplace, streaming, CDN, affiliate, social, short-link, or advertisement domains as approved unless a separate task explicitly scopes them.

## Supported workflows

- Open public landing, list, search, profile, news, schedule, and detail pages.
- Search by public profile name, visible category, keyword, date, or profile/detail URL.
- Browse public paginated list pages and preserve site ordering for catalog tasks.
- Extract objective public metadata, official source URLs, public profile links, and page-visible labels.
- Produce neutral Markdown/JSON/CSV catalog artifacts from public pages.

## Unsupported workflows

- Downloading, recording, stream URL extraction, CDN scraping, DRM removal, or mirroring media assets beyond ordinary public page image URLs needed for metadata.
- Login, registration, account recovery, contact forms, job/application forms, purchase, subscription, favorites, comments, surveys, or newsletter submission.
- CAPTCHA solving, anti-bot bypass, region bypass, hidden API probing, or access-control bypass.
- Handling credentials, cookies, tokens, CSRF values, authorization headers, session ids, browser profiles, local storage, or account state.
- Producing graphic summaries, private-person speculation, or inferred personal data not visible on official public pages.

## Safe browsing rules

- Stay inside `8man.jp` / `www.8man.jp` public pages.
- Use read-only page loads, ordinary links, public search, public filters, and public pagination.
- Do not submit contact, application, account, or inquiry forms.
- Do not click external marketplace, streaming, social, advertisement, or download controls by default.
- Preserve official names, romanization, profile labels, dates, and URLs as page-visible metadata.
- Stop and report when the workflow requires login, form submission, blocked access, sensitive data, or an external domain.

## Extraction fields

Capture public visible fields when present:

- `site`: `8man`
- `sourceUrl`
- `canonicalUrl`
- `profileId` or page slug
- `name`
- `alternateNames`
- `profileLabels`
- `affiliationLabels`
- `birthDateOrPublicDateLabel`: only if visibly published by the official page
- `publicMeasurementsOrAttributes`: only page-visible non-sensitive profile fields
- `worksOrAppearances`: official same-host links or visible public titles when relevant
- `newsItems`: title, date, and same-host URL when relevant
- `scheduleItems`: title, date, venue/label, and same-host URL when visible
- `imageUrls`: public page image URLs when needed for metadata
- `detailText`: short neutral page-provided description when needed
- `pagination`: current page, next page URL, total pages or result count when visible
- `extractedAt`

Do not capture cookies, tokens, profile paths, account state, request headers, authorization material, CSRF values, local storage, private contact data, raw media/player URLs, manifests, or media segment URLs.

## Pagination, search, and detail rules

- Search: use public site search, visible index pages, or public filters; record query/filter values and final URL.
- Listing traversal: follow visible numbered or next controls; stop on duplicates, missing next link, repeated page content, or requested limit.
- Detail verification: open profile/detail pages for final names, labels, dates, same-host links, and public text.
- Date semantics: keep profile dates, news dates, schedule dates, and availability labels separate when page labels differ.
- Deduplication: canonical URL first, profile slug/id second, normalized visible name only as a fallback.
- Missing fields: mark as `not_visible`; never infer personal data from memory, social sites, or unrelated databases.

## Downloader status

- No native downloader is claimed for `8man`.
- Public metadata/navigation is the supported capability.
- Downloader status remains `not_supported`; use `downloader_not_allowed` for Site Capability Layer handoff/downloader requests.
- Refuse or downgrade media requests to metadata extraction, official links, or an implementation-gap note.

## Site Capability Layer boundary notes

- 8MAN profile semantics are usable for public profile/list/detail interpretation through SiteAdapter/onboarding evidence.
- Live DOM fixtures are only SiteAdapter/onboarding evidence for public profile and metadata semantics; they are not downloader evidence and are not API catalog promotion evidence.
- API catalog promotion remains `not_promoted` until verified API evidence, schema ownership, adapter validation, and policy gates are recorded.
- Any observed login, form, restriction, risk, redirect, or blocked page is reportable boundary evidence. Do not bypass it or convert it into a downloader/API capability.

## Artifact and redaction rules

- Allowed outputs: Markdown tables, JSON records, CSV rows, plain text notes, and source-link lists.
- Remove tracking, affiliate, session, and user-specific query parameters from stored URLs.
- Never write cookies, credentials, account data, browser profile state, tokens, authorization headers, CSRF values, local storage, private contact data, or raw media/player URLs.
- Keep descriptions neutral and technical; do not add graphic, speculative, or private-person detail.

## Verification notes

- Confirm generated files are limited to `skills/8man/`.
- Validate frontmatter `name` and `description`.
- Future live verification should record URL, visible count, pagination result, detail-page success, and failure modes without sensitive state.
- If external buttons are required to answer a question, downgrade the request unless a separate approved site skill covers that domain.

## Failure modes

- `login-required`: requested content is account-only.
- `form-submission-required`: requested workflow requires contact, inquiry, application, or account form submission.
- `outside-url-family`: link leaves `8man.jp`.
- `no-results`: public search found no verified profile/detail page.
- `ambiguous-result`: several public pages match and detail verification is needed.
- `metadata-missing`: requested field is not visible on the public page.
- `pagination-loop`: list navigation repeats or duplicates pages.
- `external-service-required`: answer requires leaving to an unapproved domain.
- `api-catalog-not-promoted`: observed public DOM or network evidence has not passed verified API catalog promotion.
- `live-dom-fixture-only`: fixture coverage exists only for public profile/metadata semantics and does not authorize downloader/API promotion.
- `downloader_not_allowed`: Site Capability Layer policy forbids routing this site to downloader.
- `download-unsupported`: request requires media retrieval.

## Accepted request examples

- "Search 8MAN for this public profile name and return the official page metadata."
- "Extract public profile fields from this 8MAN detail URL."
- "Build a neutral CSV of visible 8MAN list entries with source links."

## Refused or downgraded request examples

- "Use account state or cookies to view hidden profile information." Refuse sensitive session handling.
- "Submit the contact form for this profile." Refuse side-effect form submission.
- "Download all profile videos or private media." Downgrade to public metadata and report `download-unsupported`.
- "Infer private personal details from other sites." Refuse unsupported personal-data inference.
