# Onboarding contract v1: unavailable until verified

This document records #346 integration follow-ups for #348. It does not implement
or select authentication. `/connect.html` is the public explanatory guide.

## Compatibility matrix

| Route | Exact client / adapter version | Wallet types | Authentication | State |
| --- | --- | --- | --- | --- |
| Autonomous local signer | None verified | Pending | Signed HTTP candidate, not chosen | Unavailable |
| Ordinary MCP client | None verified | Pending | No implicit signing support | Unavailable |
| OAuth client | None verified | Pending | No verified implemented route | Unavailable |

ERC-8128 is a candidate in #346. OAuth is not an automatic substitute. ERC-8004
registration remains optional. No external protocol version is asserted supported.
The HTTPS endpoint is null; no domain, tool name, flag, token or command is invented.
Existing backend/legacy capabilities are not characterized as removed or broken;
this matrix is specifically the unverified public onboarding route.

## Activation evidence required from #346

1. Approved production HTTPS endpoint and domain; selected transport/auth version,
   supported wallet types, exact signing-aware client/adapter version.
2. Generated MCP tool contract, own-receipt/access scopes, schema/size limits,
   identity binding and denial of raw collection and operator privileges.
3. Test-signer evidence for valid requests, tampering, replay, expiry, wrong domain
   and chain context, denial, rate limits and outage. Reuse backend fixtures;
   do not implement a second signer or authentication stack in this site.
4. A clean-client run: hero → selected route → inspected permissions → local signer
   setup → domain-bound proof → harmless authenticated query. Record identity,
   capabilities, source block, observation time, cohort and per-Token Readiness.
5. Actual disconnect semantics: signer authorization removal for per-request signing;
   server revocation only when implemented. Demonstrate rejected expired/revoked
   access at the server, not just a local button state.
6. Versioned service policy for standard/enriched allowances, period/reset/counting
   rules and receipt benefit. Five/day remains only a proposal. No quota guessed.
7. Privacy disclosure and retention policy, authorized owner visibility, sanitized
   errors, cache controls and proof that derived results contain no identifying
   excerpts or private strategies. Paraphrase alone does not establish separation.
8. Verified official Telegram news and personal bot destinations. Keep the two
   audiences separate; ordinary bot use does not grant owner raw access.

Only after these gates should a scoped follow-up add tested machine-readable
configuration and a harmless connection test. Update static copy, availability JSON
and matrix together. Private responses must never enter shared caches, page source,
public previews, static generation or third-party analytics. Review hosting CSP
explicitly before allowing any selected connection; current connect-src is none.

## Monetary gate

No payment or monetary activation in this delivery. Future reserve awards require
funded existing tokens, approved fee allocation and acquisition budget, owner review,
weekly global/wallet ceilings, idempotent award/settlement and platform verification.
Paid consultations require explicit quote and consented maximum, recoverable delivery
and no repeated charge for failures/retries. No ticker, address, burn/recycle share,
launchpad, listing, passive yield or guaranteed return is published.

## Current machine-readable artifact

`public/availability.json` is an availability snapshot only. Its schema version is
the website's record version, not a backend API schema. Null values mean unverified;
empty supportedClients means no public route claimed. The guide copies a subset of
that public record, never credentials or executable configuration.

Do not close #348 as fully accepted while live onboarding is blocked. Local fixture
success does not prove indexing throughput, authentication or production coverage.
