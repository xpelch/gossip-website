# Gossip public website

Gossip is the product brand. Sherwood is its intelligence engine. This self-contained
site is the public experience for #348, with implemented MCP/Gossip contract details
verified from upstream revision `47695b9bbc86658b1c420810fcb304c5ea68fb79`.

## Run locally

Node.js 22 or newer; no runtime dependency installation or build step.

```powershell
cd gossip-website
npm start
npm run check
```

Preview: http://127.0.0.1:43848. Loopback only; occupied ports fail without stopping
another process. Tests use an OS-assigned ephemeral port.

The user's development MCP target is **https://localhost/mcp**. It is deliberately
separate from the website preview. It is not a detected running service: configure
the engine's actual HTTPS port, trusted local certificate and audience, plus a
compatible EOA signing adapter. No public domain is assigned. The site performs no
authentication request or transaction and does not proxy or provision an engine.

## Contents

- `public/`: complete static website; landing and developer guide.
- `public/availability.json`: code-backed capability metadata and explicitly unverified local target.
- `public/gossip-floating.png`: transparent Imagegen sculpture with optional floating motion.
- `public/fonts/`: self-hosted Bricolage Grotesque and OFL license.
- [Floating refinement, motion and verification](docs/design-content-v3.md).
- [Signal design lock and asset provenance](docs/design-content-v2.md).
- [Verified integration contract](docs/onboarding-v2.md).
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

This repository contains the Gossip website only. The agent toolkit lives at https://github.com/xpelch/gossip. Extracted from xpelch/sherwood commit 63d12b323a927f2abb8e4b7b4af96c7cd74aa912. Historical design documents retain their original context. The setup-gossip expansion is specified in https://github.com/xpelch/gossip/issues/2 and is not yet a released capability.

