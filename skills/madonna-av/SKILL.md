---
name: madonna-av
description: Instruction-only Skill for the verified https://madonna-av.com/ URL family. Use when Codex needs read-only public navigation, search, list pagination, or detail-page metadata extraction for Madonna AV pages.
---

# madonna-av Skill

## Skill name

`madonna-av`

## Approved URL family

- `https://madonna-av.com/`
- `https://www.madonna-av.com/`
- Same-host subpaths only.

Do not treat similarly named music, hospital, fan, mirror, review, reseller, CDN, or social domains as approved.

## Supported workflows

- Open the public site, age gate, list pages, search pages, performer pages, and work detail pages.
- Search by work code, title fragment, performer, series, label, or visible category.
- Paginate through public catalog pages for timeline or count-limited catalog tasks.
- Extract public metadata and source URLs for catalog, comparison, verification, or handoff artifacts.
- Summarize availability status only when it is visible as public page text.

## Unsupported workflows

- Downloading, recording, stream URL extraction, embedded player reverse engineering, DRM removal, or CDN scraping.
- Login, registration, account recovery, purchase, cart, subscription, favorites, comments, ratings, forms, or newsletter submission.
- CAPTCHA solving, anti-bot bypass, region bypass, hidden API probing, or age-gate bypass.
- Handling credentials, cookies, SESSDATA-like values, browser profiles, account ids, CSRF values, or authorization headers.
- Producing graphic summaries or expanding page titles into explicit descriptions.

## Safe browsing rules

- Remain on `madonna-av.com` or `www.madonna-av.com`.
- Use only public read-only navigation and ordinary search/list/detail controls.
- Ask for confirmation before proceeding past adult-site age confirmation if the user has not already made intent clear.
- Ignore third-party ads, external purchase links, social links, and download/player controls.
- Preserve official names, dates, codes, and URLs exactly enough for verification.
- Stop on login walls, payment walls, rate limits, or suspicious redirects.

## Extraction fields

Capture visible public fields as available:

- `site`: `madonna-av`
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
- `sampleImageUrls`
- `detailText`: short neutral page-provided description when needed
- `relatedWorks`: public related work links when relevant
- `pagination`: current page, next page URL, total pages or result count when visible
- `extractedAt`

Never extract or persist cookies, local storage, profile state, account state, request headers, tokens, CSRF values, or raw media/player URLs.

## Pagination, search, and detail rules

- Search: prefer public site search; if the site supports code-like URLs, verify the final page before claiming a match.
- Pagination: follow visible numbered or next controls; track visited canonical URLs to avoid loops.
- Detail-first verification: when list cards are ambiguous, open the detail page and use the canonical work code/title.
- Date handling: distinguish release date from distribution or availability date; do not merge them unless the page labels match.
- Deduplication: use canonical URL first, work code second, and normalized title only as a fallback.
- Missing data: leave fields empty or mark `not_visible`; do not infer performers, dates, or categories from external sites.

## Downloader status

- No native downloader is claimed for `madonna-av`.
- Metadata/navigation workflows are supported; media retrieval is not.
- Downloader status remains `not_supported`; use `downloader_not_allowed` for Site Capability Layer handoff/downloader requests.
- Download requests should be refused or downgraded to official metadata, public links, or a clear unsupported-downloader note.

## Site Capability Layer boundary notes

- Live DOM fixtures are only SiteAdapter/onboarding evidence for public metadata semantics; they are not downloader evidence and are not API catalog promotion evidence.
- API catalog promotion remains `not_promoted` until verified API evidence, schema ownership, adapter validation, and policy gates are recorded.
- Any observed login, age/access gate, restriction, risk, redirect, or blocked page is reportable boundary evidence. Do not bypass it or convert it into a downloader/API capability.

## Artifact and redaction rules

- Store only public metadata and source URLs in Markdown, JSON, CSV, or text artifacts.
- Strip tracking, affiliate, session, and user-specific query parameters.
- Do not include raw player manifests, media segment URLs, cookies, tokens, account data, or browser profile references.
- Keep wording neutral and non-graphic even when source titles are adult-oriented.

## Verification notes

- Verify the skill file remains under `skills/madonna-av/`.
- Validate frontmatter syntax and required metadata keys.
- Future live checks should record only public URLs, observed counts, and visible failure states.
- If pages redirect to an age gate, record that gate as the observed state rather than inventing page content.

## Failure modes

- `age-gate-required`: user intent for adult-site browsing is not confirmed.
- `login-required`: public flow stops at account-only content.
- `outside-url-family`: navigation leaves the approved host.
- `no-results`: search produced no verified public match.
- `ambiguous-result`: several works match and detail verification is needed.
- `pagination-loop`: next-page traversal repeats or stops changing.
- `blocked-or-rate-limited`: site blocks automated access.
- `api-catalog-not-promoted`: observed public DOM or network evidence has not passed verified API catalog promotion.
- `live-dom-fixture-only`: fixture coverage exists only for public metadata semantics and does not authorize downloader/API promotion.
- `downloader_not_allowed`: Site Capability Layer policy forbids routing this site to downloader.
- `download-unsupported`: request requires media retrieval.

## Accepted request examples

- "Find this Madonna work code and return the official page with visible metadata."
- "Extract a date-sorted public Madonna catalog page into CSV fields."
- "Check whether this performer has public Madonna works and list official links."

## Refused or downgraded request examples

- "Download the video or sample stream." Downgrade to official page metadata and report `download-unsupported`.
- "Use this cookie/profile to see member-only pages." Refuse sensitive session handling.
- "Bypass the age gate." Refuse bypass behavior.
- "Harvest the embedded player URLs." Refuse raw media extraction.
