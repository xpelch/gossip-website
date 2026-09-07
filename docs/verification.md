# Verification evidence

Run on 2026-09-05 America/Toronto (2026-09-06 UTC), isolated worktree
`2499/rh_indexer`, Node v24.13.1, Playwright CLI Chromium session `sherwood348`.
Only loopback port 43848 was used for the site; tests use an ephemeral port.

## Passed

- `npm run check`: 2 tests passed. Public policy remains unavailable; no forms,
  input fields, invented Telegram links or script network/storage APIs. HTTP boundary
  serves allowlisted public files, rejects private/traversal and POST routes, and
  sends no-store, restrictive CSP and nosniff headers.
- Browser script: both pages at 360, 768 and 1440px, one h1 each, valid local anchors,
  no page-level horizontal overflow. Screenshots captured for all six combinations.
- Hero connection link navigated to the guide; Telegram action navigates to the two
  clearly unavailable destinations. Native disabled action cannot be activated.
- Route selector updates its announced explanation; FAQ opens; copy succeeds with
  a null endpoint record and announces success; denied clipboard gives manual fallback.
- First Tab reaches the skip link; Enter activates it. Semantic headings, labelled
  select, native disclosure controls and visible focus rules inspected.
- Reduced-motion media results in non-smooth scrolling. Both pages remain readable
  with JavaScript disabled at 360px and have no horizontal overflow.
- Local browser checks observed no off-origin requests. The public UI never invokes
  a wallet provider, network authentication, transaction or private-content intake.
- Active small-text color pairs measured at 4.69:1 or better (see design brief).
- Desktop hero, mobile hero and complete guide screenshots visually inspected.
  Orbio inspected visually as a reference only; no assets copied.

Generated screenshots are ignored in `output/playwright/`; reproduce them with the
README commands. The initial missing favicon was fixed by referencing the local SVG.
The browser script was rerun after formatting; its expression has no trailing
semicolon because the CLI embeds it as a callable function.

## Not established by this delivery

No production, RPC, database or backend integration request was run. Real-client
signed authentication, expiry/domain/chain rejection, live policy, private response
cache behavior, server revocation and production indexing coverage are not tested.
The guide describes their intended failure handling; it does not simulate evidence.
No verified bot or channel destination was supplied, so both remain unavailable.
No independent comprehension study, full screen-reader session or cross-browser
certification is claimed. This is a locally tested public preview, not acceptance
of the live onboarding exit gate.
