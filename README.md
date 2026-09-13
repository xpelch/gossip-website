# Gossip public website

Gossip is the product brand. Sherwood is its intelligence engine. This self-contained
site is the public experience for #348. The current v2 candidate references
public Gossip Agent Kit source commit `79475467ce9d412b7d3f47792af96d6e23a395b9` and deployed
Sherwood engine revision `rev-2eddeb5d5f03317f411f8a096ba37085b57f3b5f`.

## Run locally

Node.js 22 or newer; no runtime dependency installation or build step.

```powershell
cd gossip-website
npm start
npm run check
```

Preview: http://127.0.0.1:43848. Loopback only; occupied ports fail without stopping
another process. Tests use an OS-assigned ephemeral port.

## Protected setup prompts

The public connection page starts with empty prompt panels. `POST /api/setup-prompt`
returns the four prompts only after checking the submitted password against the
server-side SHA-256 digest. Configure `GOSSIP_PROMPT_PASSWORD_SHA256` and
`GOSSIP_PROMPTS_JSON` as sensitive Vercel environment variables; never commit
their values. The JSON object must contain non-empty `general`, `grok`, `hermes`
and `openclaw` strings.

This is a temporary access gate. A public wallet address is guessable and does not
provide strong authentication. The password is kept out of URLs, storage and logs,
and prompts are returned with `Cache-Control: no-store`, but anyone who knows the
password can inspect or copy the unlocked response.

The public MCP endpoint is **https://api.gossip-protocol.xyz/mcp** and the exact
signing audience is **https://api.gossip-protocol.xyz/**. The capabilities
endpoint is **https://api.gossip-protocol.xyz/v2/gossip/capabilities**. Public
diagnostic checks passed for capabilities and MCP initialize/tools-list, with
replay and invalid-signature checks returning 401. These are diagnostic only:
production and host acceptance remain unverified. Live capability evidence verifies
atomic consultation, durable operations, signed receipts and evidence; public and
private submissions remain blocked. An operator-local development runtime may still be available at
**http://127.0.0.1:18080/mcp** from that same host. The site performs no
authentication request or transaction and does not proxy or provision an engine.

## Contents

- `public/`: complete static website; landing and developer guide.
- `public/availability.json`: code-backed candidate endpoint, source-pinned kit and engine revisions, diagnostic outcomes, and explicit verification flags.
- `public/assets/gossip-hero.webp`: responsive mascot artwork with optional floating motion.
- `public/assets/gossip-social.jpg`: sharing preview, with browser and home-screen icons in `public/`.
- [Mascot identity, metadata and validation](docs/design-content-v4.md).
- `public/fonts/`: self-hosted Bricolage Grotesque and OFL license.
- [Floating refinement, motion and verification](docs/design-content-v3.md).
- [Signal design lock and asset provenance](docs/design-content-v2.md).
- [Historical v1 integration contract and current v2 handoff](docs/onboarding-v2.md).
- [Current validation evidence](docs/verification-v2.md).

The v1 documents describe the historical Sherwood woodland preview and are
superseded by v2. The public brand does not rename Sherwood protocol strings,
headers or backend tool contracts.

`server.mjs` is a local preview server, not deployment configuration. It allowlists
public files and sends restrictive CSP/no-store headers. No analytics, external font
requests, wallet SDK, storage or private intake. Hosting must preserve equivalent
headers when deployment is separately authorized.

## Browser checks

From repository root, with the preview running:

```powershell
npx --yes --package @playwright/cli playwright-cli -s=gossip-design open http://127.0.0.1:43848
npx --yes --package @playwright/cli playwright-cli -s=gossip-design run-code --filename=browser-checks.js
```

The CLI function expression intentionally has no trailing semicolon. Screenshots
and local measurement records go under ignored `output/`; they are not application
assets or production evidence. Essential content remains readable without JavaScript.

## Repository boundary

This repository contains the Gossip website only. The agent toolkit and issue
tracker live at https://github.com/gossip-dev/gossip. Extracted from Sherwood commit
63d12b323a927f2abb8e4b7b4af96c7cd74aa912. Historical design documents retain
their original context. The v2 kit is a developer preview; signed production
and real-host acceptance remain open release gates.

## Vercel hosting

Import this repository with the Other framework preset and repository root. The checked-in configuration runs the checks and publishes only public/, with the same security headers as the local preview. No environment variables are required. The local preview server is not deployed.

The setup prompt uses `https://gossip-protocol.xyz/gossip` as its repository URL.
Vercel redirects this path and its subpaths to the existing agent kit repository,
including Git discovery requests. This redirect is available on Vercel only.
