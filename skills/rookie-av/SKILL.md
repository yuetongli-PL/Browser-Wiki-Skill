---
name: rookie-av
description: Instruction-only Skill for the verified https://rookie-av.jp/ URL family. Use when Codex needs read-only public navigation, search, list pagination, or detail-page metadata extraction for ROOKIE pages.
---

# rookie-av Skill

## Skill name

`rookie-av`

## Approved URL family

- `https://rookie-av.jp/`
- `https://www.rookie-av.jp/`
- Same-host subpaths only.

Do not follow off-site commerce, streaming, CDN, tracker, short-link, ad, or social links unless the user separately approves a new skill or browser task.

## Supported workflows

- Open the age gate or landing page and continue only through ordinary public navigation.
- Search by title, performer name, series name, label text, or work code when the site exposes a search field or query URL.
- Browse public listing pages, release-date pages, category pages, performer pages, and work detail pages.
- Extract objective metadata for catalog, timeline, comparison, or verification answers.
- Produce concise source-backed summaries with canonical page URLs.

## Unsupported workflows

- Media download, stream capture, player-token extraction, DRM removal, CDN URL harvesting, or clip mirroring.
- Account creation, login, payment, cart, subscription, coupon, point, wishlist, review, comment, or contact-form submission.
- CAPTCHA bypass, anti-bot bypass, region bypass, age-gate bypass, or automated credential handling.
- Scraping private user pages, account history, purchased content, hidden APIs, or unpublished assets.
- Generating explicit descriptions beyond neutral metadata already present on public pages.

## Safe browsing rules

- Stay inside the approved URL family and prefer canonical HTTPS URLs.
- Treat all navigation as read-only. Do not submit unknown forms.
- If an age confirmation appears, only use normal site controls after confirming the user intends adult-site browsing; never bypass it technically.
- Preserve page-provided titles and names; do not rewrite them into more explicit phrasing.
- Avoid opening popups, ads, third-party trackers, or download buttons.
- If the page becomes login-gated, stop and report the boundary.

## Extraction fields

Capture fields only when visible on the public page:

- `site`: `rookie-av`
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
- `detailText`: short neutral synopsis or page-provided description, if needed
- `pagination`: current page, next page URL, total pages or result count when visible
- `extractedAt`

Do not store account identifiers, cookies, session ids, request headers, CSRF values, authorization material, browser profile paths, or raw player URLs.

## Pagination, search, and detail rules

- Search: start with the site's public search UI or documented query URL; record the exact query and result URL.
- Pagination: follow ordinary numbered or next-page controls in order; stop when no next control exists, the page repeats, or the requested count is reached.
- Listing pages: extract only card-level metadata that is visible there, then open detail pages only when the task needs fields not present on the list.
- Detail pages: prefer canonical work pages for final metadata; reconcile duplicate list entries by canonical URL or work code.
- Sorting: preserve site order unless the user asks for a different sort; when sorting by date, keep unknown-date items separate.
- Search misses: try one normalized work code variant, then report no verified match instead of guessing.

## Downloader status

- No native downloader is claimed for `rookie-av`.
- This skill supports public metadata/navigation only.
- Downloader status remains `not_supported`; use `downloader_not_allowed` for Site Capability Layer handoff/downloader requests.
- Refuse or downgrade download requests to metadata extraction, official detail-page links, or a downloader-gap report.

## Site Capability Layer boundary notes

- Live DOM fixtures are only SiteAdapter/onboarding evidence for public metadata semantics; they are not downloader evidence and are not API catalog promotion evidence.
- API catalog promotion remains `not_promoted` until verified API evidence, schema ownership, adapter validation, and policy gates are recorded.
- Any observed login, age/access gate, restriction, risk, redirect, or blocked page is reportable boundary evidence. Do not bypass it or convert it into a downloader/API capability.

## Artifact and redaction rules

- Allowed artifacts: Markdown, JSON, CSV, or plain text containing public metadata and source URLs.
- Redact or omit query parameters that contain tracking, session, affiliate, or user-specific values.
- Never persist cookies, tokens, local storage, request headers, account state, browser profile data, or raw media URLs.
- Keep adult material descriptions neutral and technical; avoid invented or graphic wording.

## Verification notes

- Verify that generated files stay under `skills/rookie-av/`.
- Validate YAML frontmatter contains `name` and `description`.
- For future live validation, record URL, task, result count, and whether detail pages were opened; do not record sensitive browser state.
- If a live page is inaccessible, record the HTTP/browser-visible failure and stop at the read-only boundary.

## Failure modes

- `age-gate-required`: age gate is visible and user intent is not confirmed.
- `login-required`: requested page or action needs an account.
- `outside-url-family`: navigation would leave `rookie-av.jp`.
- `no-results`: public search returned no verified matches.
- `pagination-loop`: next page repeats or produces duplicate canonical URLs.
- `blocked-or-rate-limited`: site blocks automated or repeated access.
- `metadata-missing`: requested field is not visible on the public page.
- `api-catalog-not-promoted`: observed public DOM or network evidence has not passed verified API catalog promotion.
- `live-dom-fixture-only`: fixture coverage exists only for public metadata semantics and does not authorize downloader/API promotion.
- `downloader_not_allowed`: Site Capability Layer policy forbids routing this site to downloader.
- `download-unsupported`: request asks for media retrieval or stream capture.

## Accepted request examples

- "Search ROOKIE for this work code and give me the official detail link."
- "List the latest public ROOKIE works with title, date, performers, and source URL."
- "Open this ROOKIE detail page and extract neutral metadata."

## Refused or downgraded request examples

- "Download the full video from this ROOKIE page." Downgrade to official metadata and report `download-unsupported`.
- "Use my cookies to access member content." Refuse credential/session handling.
- "Bypass the age check or anti-bot page." Refuse bypass behavior.
- "Collect all player CDN URLs." Refuse raw media URL harvesting.
