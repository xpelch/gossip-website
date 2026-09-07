# Gossip / Signal — design and content v2

Date: 2026-09-06 America/Toronto. Supersedes the woodland Sherwood identity in v1.
User-selected direction: **Signal — graphite, orange, metal**. User authorized
localhost because no public domain exists. Public copy remains English as in #348.

## Research and reference lock

Refero's design method and bundled typography, color, anti-AI-slop and visual-workflow
references were read before implementation. Live Refero style/screen/flow tools were
not exposed; no Refero search result is claimed. Three public references were read
and visually inspected in the browser:

- [Raycast](https://www.raycast.com/): primary canvas/media reference. Preserve dark
  material-led hero, strong sans display, contrast and quiet navigation. Adapt its
  visual depth; do not copy the red artwork, logo or language.
- [Privy](https://www.privy.io/): narrow secondary role—clear crypto infrastructure
  positioning and separation of product promise from developer details. Do not
  borrow its lavender palette, finance dashboard or balance examples.
- [Kaito](https://www.kaito.ai/): domain counter-reference. Its dense crypto ranking
  and modal-led experience reinforce the decision to omit a public feed, fake
  market counters and leaderboard content from private Gossip's landing page.

The user chose Signal over white/cobalt Network and acid-green Afterhours. This
is the explicit build target, not an averaged palette. Reference screenshots are
local review artifacts under ignored `output/playwright/`.

| Decision | Source | Role preserved | Reason |
| --- | --- | --- | --- |
| Graphite canvas + media-led hero | Raycast + selected Signal | Brand campaign, not data-state color | Premium AI/Web3 identity |
| Orange/chrome speech sculpture | User-selected Signal | Decorative brand image only | Makes Gossip recognizable without crypto coin clichés |
| Large sans title | Refero typography + Raycast | Display only, readable neutral body | Replaces literary/woodland Sherwood identity |
| Orange primary action | User-selected Signal + Refero color | Action and brand accent, not success | One clear next step |
| Product → developer guide | Privy + real engine contracts | Separate explanation from protocol | Clear entry for people and agent builders |
| Interactive labelled example | #348 evidence rules | Illustration, never a live feed | Explains what evidence limits mean |
| Sherwood in engine section | User instruction | Subordinate engine attribution | Gossip owns public branding |

Reject: woodland imagery, editorial serif, violet generic AI gradients, coins,
wallet balances, fake logos, fabricated live statistics, a public Gossip feed,
or browser key import. Product interactions are native HTML plus bounded local JS.

## Tokens and composition

Canvas #101112; surface #171819; raised #202123; body #F1F0ED; secondary #A4A5A6;
primary action #FF783F with dark #171310 text; border #313233. Orange is never a
claim of live health. Secondary white nav action leads to the same guide.

One system sans family: Segoe UI / Arial. Consolas monospace only for protocol,
metadata and section indexing. No font binaries redistributed or external requests.
Maximum width 1240px. Tight 110px desktop display, 60–78px mobile, body 16px/1.65.
Radii 6px buttons, 8–10px bounded response/media containers. Open sections and
separators replace a repeated grid of rounded marketing cards.

Desktop: compact navigation → asymmetrical hero + dominant sculpture → protocol
strip → three-step exchange → question selector / illustrative response → Gossip
structure → privacy flow → engine attribution → FAQ → concluding action/footer.
Mobile: same content order, wrapping navigation, stacked media/content and cards;
hero keeps a two-line title at 360px. Guide becomes one column with wrapping
contents links. Code wraps and tables scroll only inside their container.

## Public messages and interactions

Hero: **Good intel travels.** Give your AI agent an onchain edge. Ask questions.
Share what you know. Turn useful observations into deeper insight.

Product story: **Ask the chain → Send a Gossip → Go one layer deeper.** A Gossip is
a specific dated observation with provenance. Unsupported conviction earns no
promise. A useful correction can matter; contributing nothing is allowed.

Privacy: raw owner-private content, own receipt/outcome access, no public raw feed.
Engine: **Gossip is the connection. Sherwood is the intelligence.** Source blocks,
time and Readiness accompany evidence. Monetary rewards remain disabled.

- Query tabs use ARIA tab/panel roles, roving focus, arrows/Home/End and click.
  All examples explicitly synthetic; no request is made on selection.
- Guide selector describes real EOA adapter requirements vs unsupported routes.
- Copy button copies local connection metadata, not executable client config or keys;
  polite success/failure feedback and manual-copy fallback.
- Native details/summary for FAQ; visible keyboard outline; skip link first.
- No animations. Reduced motion disables smooth scroll and hover translation.
- No public endpoint is assigned. localhost target is explicit, unverified and
  requires actual port/audience/cert. No fake connect success or test request.

## Generated asset

Built-in Imagegen used, not API/CLI fallback. Selected result saved in the project
as `public/gossip-signal.png` (1536×1024, approximately 1.86 MB). The original remains
in the Codex generated-images directory. Image reviewed before integration: chrome
and orange glass speech bubbles, high contrast, no text/coins/third-party logo.
`public/gossip-mark.svg` is a separate editable code-native speech mark.

Prompt:

> Use case: stylized-concept. Asset type: premium AI / crypto Web3 website hero for
> brand Gossip. Create an original high-end 3D product sculpture of two interlocking
> inflated speech bubbles, one large polished dark chrome silver bubble in the
> foreground and one vivid molten tangerine orange glass speech bubble behind,
> tilted in opposing conversational directions. Sculptural not cartoonish, deep
> hollow aperture through the chrome bubble so it reads as a continuous softly
> rounded speech ring with a short tail. Beautiful thick volumetric polished metal,
> carefully controlled specular highlights, physically based orange light reflecting
> into chrome. Tiny floating orange sphere as accent. Almost black graphite
> background #101112, seamless dark studio, dramatic directional softbox light,
> subtle grain. Landscape 3:2 composition; sculpture centered and fills 75% of frame
> with breathing room, unobstructed silhouette, no text, no logos, no UI, no coins,
> no Bitcoin/Ethereum glyphs, no charts, no woodland, no purple, no neon grid.
> This is a standalone brand sculpture to place alongside website headline.
> Premium industrial design campaign, tactile, minimal, confident.

No synthetic product evidence appears in this image; its role is brand sculpture.
