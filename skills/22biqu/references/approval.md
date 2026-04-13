# Approval

## Safe action allowlist

- `download-book`, `navigate`, `search-submit`

## Approval-required cases

- Login or register form submission
- Any unknown form submission
- Leaving the verified `www.22biqu.com` URL family
- Any side-effect action that is not on the safe allowlist

## Current site boundary

- Searching books, opening directories, opening author pages, reading chapter text, and downloading public book content are low-risk flows.
- Navigation to login or register pages is allowed, but credential submission is not automatic.
