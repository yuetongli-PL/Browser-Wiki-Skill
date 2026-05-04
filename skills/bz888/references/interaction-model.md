# Interaction model

## Entities

- `Book`: title, author, detail URL, latest chapter, update time.
- `Chapter`: title, chapter URL, order, text content, optional public body-image OCR text.
- `SearchResult`: title, detail URL, author, snippet.
- `BlockedState`: reason code, URL, observed signal, recommended next action.

## Page types

- `home`
- `search-results-page`
- `book-detail-page`
- `chapter-page`
- `category-page`
- `auth-page`
- `limited-page`
- `restriction-page`
- `unknown-page`

## Node kinds

- `search-form`
- `book-link`
- `chapter-link`
- `content-link`
- `chapter-body-image`
- `ocr-image-text`
- `auth-link`
- `permission`
- `risk-control`
- `restriction-page`

## Artifact expectations

- Download manifests must not include raw cookies, authorization headers, tokens, CSRF values, or browser profile paths.
- Redacted artifacts should record live challenge surfaces as blocked evidence.
- OCR output should be traceable to public chapter body images, not challenge or verification images.
