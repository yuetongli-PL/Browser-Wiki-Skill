---
name: dahlia-av
description: Instruction-only Skill for the verified https://dahlia-av.jp/ URL family. Use when Codex needs read-only public navigation, search, list pagination, or detail-page metadata extraction for DAHLIA pages.
---

# dahlia-av Skill

## Skill name

`dahlia-av`

## Approved URL family

- `https://dahlia-av.jp/`
- `https://www.dahlia-av.jp/`
- Same-host subpaths only.

External purchase, streaming, marketplace, CDN, social, and advertisement domains are outside this skill.

## Supported workflows

- Open public landing, works list, work detail, performer, search, and category/tag pages.
- Search by work code, title, performer, visible tag, release date, or distribution date.
- Browse paginated public works lists and preserve site ordering for catalog tasks.
- Extract objective public metadata, source URLs, and page-visible availability labels.
- Produce neutral Markdown/JSON/CSV catalog artifacts from public pages.

## Unsupported workflows

- Downloading or recording media, resolving player URLs, scraping CDN assets, removing DRM, or mirroring samples.
- Logging in, registering, purchasing, opening account areas, submitting reviews/comments/forms, or managing favorites.
- CAPTCHA, anti-bot, geo, payment, age-gate, or access-control bypass.
- Extracting credentials, cookies, local storage, CSRF values, authorization headers, session ids, browser profile data, or account state.
- Expanding titles or synopses into graphic or invented content.

## Safe browsing rules

- Stay on `dahlia-av.jp` or `www.dahlia-av.jp`.
- Use read-only page loads, ordinary links, public search, and public pagination.
- Treat age confirmation as a normal user-visible boundary; do not bypass it mechanically.
- Do not click external watch, buy, store, affiliate, ad, or player-download links.
- If detail pages include external availability buttons, record only their visible labels and do not follow them by default.
- Stop and report when the site requires login, payment, blocked access, or unsupported interaction.

## Extraction fields

Capture public visible fields when present:

- `site`: `dahlia-av`
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
- `pagination`: current page, next page URL, total pages or result count when visible
- `extractedAt`

Do not capture cookies, tokens, profile paths, request headers, local storage, account identifiers, CSRF values, or raw media/player URLs.

## Pagination, search, and detail rules

- Search: use public search UI or query URL; record query text and final URL.
- Listing traversal: follow visible next or numbered controls; stop on duplicates, missing next link, or requested limit.
- Detail verification: open work pages for final `workId`, title, dates, performer names, runtime, and tags.
- Date semantics: keep release, distribution, and preorder/availability labels separate when page labels differ.
- Deduplication: canonical URL and work code are authoritative; avoid title-only merges unless necessary.
- Missing fields: mark as `not_visible`; never fill from memory or unrelated databases.

## Downloader status

- No native downloader is claimed for `dahlia-av`.
- Public metadata/navigation is the supported capability.
- Downloader status remains `not_supported`; use `downloader_not_allowed` for Site Capability Layer handoff/downloader requests.
- Refuse or downgrade media requests to metadata extraction, official links, or an implementation-gap note.

## Site Capability Layer boundary notes

- Live DOM fixtures are only SiteAdapter/onboarding evidence for public metadata semantics; they are not downloader evidence and are not API catalog promotion evidence.
- API catalog promotion remains `not_promoted` until verified API evidence, schema ownership, adapter validation, and policy gates are recorded.
- Any observed login, age/access gate, restriction, risk, redirect, or blocked page is reportable boundary evidence. Do not bypass it or convert it into a downloader/API capability.

## Artifact and redaction rules

- Allowed outputs: Markdown tables, JSON records, CSV rows, plain text notes, and source-link lists.
- Remove tracking, affiliate, session, or user-specific query parameters from stored URLs.
- Never write cookies, account data, browser profile state, tokens, authorization headers, CSRF values, or media stream URLs.
- Keep descriptions neutral and technical; do not add graphic detail beyond source titles.

## Verification notes

- Confirm generated files are limited to `skills/dahlia-av/`.
- Validate frontmatter `name` and `description`.
- Future live verification should record URL, visible count, pagination result, detail-page success, and failure modes without sensitive state.
- If external buttons are required to answer a question, downgrade the request unless a separate approved site skill covers that domain.

## Failure modes

- `age-gate-required`: adult-site gate appears and user intent is not confirmed.
- `login-required`: requested content is account-only.
- `outside-url-family`: link leaves `dahlia-av.jp`.
- `no-results`: public search found no verified work.
- `metadata-missing`: requested field is not visible on the public page.
- `pagination-loop`: list navigation repeats or duplicates pages.
- `external-store-required`: answer requires leaving to a purchase/streaming domain.
- `api-catalog-not-promoted`: observed public DOM or network evidence has not passed verified API catalog promotion.
- `live-dom-fixture-only`: fixture coverage exists only for public metadata semantics and does not authorize downloader/API promotion.
- `downloader_not_allowed`: Site Capability Layer policy forbids routing this site to downloader.
- `download-unsupported`: request requires media retrieval.

## Accepted request examples

- "Extract DAHLIA public work metadata from this detail URL."
- "Search DAHLIA for this performer and list official work links with dates."
- "Build a neutral CSV of the latest DAHLIA listing page."

## Refused or downgraded request examples

- "Download the movie from DAHLIA." Downgrade to public metadata and report `download-unsupported`.
- "Follow store links and buy or unlock it." Refuse purchase/account action.
- "Use saved browser state to access restricted content." Refuse sensitive account/session handling.
- "Get the player manifest or CDN URLs." Refuse media URL extraction.
