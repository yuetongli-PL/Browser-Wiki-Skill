# Recovery

## Challenge or risk-control page

- Reason code: `blocked-by-cloudflare-challenge`
- Action: record the blocked state and stop.
- Do not use OCR, alternate hosts, credentials, browser profile extraction, or automated challenge solving to bypass it.

## Access-control image encountered during OCR

- Reason code: `ocr-disallowed-access-control-image`
- Action: stop OCR for that image and report the access-control boundary.
- Do not fetch or run Tesseract on CAPTCHA, challenge, verification, login, permission, or risk-control images.

## OCR dependency missing

- Reason code: `ocr-dependency-missing`
- Action: report that public chapter body images require Tesseract OCR and the dependency is unavailable.
- Safe retry: install or configure the OCR dependency only if the user explicitly asks.

## Public chapter image unreadable

- Reason code: `ocr-required-image-unreadable`
- Action: preserve the image placeholder and report the unreadable chapter segment.
- Safe retry: rerun with a narrower chapter range or improved public image fetch if the page is still reachable.

## Parse failed

- Reason code: `parse_failed`
- Action: keep the raw public page artifact if it is already redacted, then report the selector/profile gap.
- Safe retry: update `profiles/www.bz888888888.com.json` selectors from public evidence only.

## Interrupted download

- Reason code: `interrupted`
- Action: inspect the download manifest for a resume command.
- Safe retry: use the generated resume command only if it does not include raw credentials or browser profile material.
