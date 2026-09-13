# Gossip paper conversation

This is a material and motion refinement of the existing Gossip website. The
owner selected the paper SVG created on September 13, 2026 and asked for that
treatment on the website. Existing content, section order, Bricolage Grotesque,
setup instructions, data labels and interaction contracts remain the reference.

## Reference lock

| Decision | Source | Role and reason |
| --- | --- | --- |
| Charcoal canvas, orange connections, ivory faces, thin angled layers | Owner-selected paper SVG | The supplied illustration is the visual target; preserve its three expressions and blocks. |
| Large graphic type, flat contrast, uncluttered surrounding UI | [Figma Config](https://config.figma.com/events/figma-config-2022), Refero style `bb8e48ab-b4f8-4b66-8796-206b512af8d6` | Primary compositional reference; retain the incumbent dark canvas and display font. |
| Illustrated objects with controlled angled perspective | [Gumroad](https://gumroad.com), Refero style `ac783c6e-6c2b-4663-87b3-bcd12d463b0a` | Borrow the role of illustrative characters; do not import its pink palette or change action colors. |
| Strong outlines and a character-led focal point | [Flying Papers](https://www.flyingpapers.com), Refero style `a0959d3b-cf38-4140-bb6c-4ef3857d2804` | Borrow graphic weight, not its purple/yellow palette or product content. |
| Folded corners and short, solid offset edges | Owner's paper brief | Apply to headline, buttons, strips and evidence panels as physical paper thickness. |
| One conversational sequence with pause, reduced-motion and visibility control | Impeccable animate guidance and existing `guide.js` | Motion connects the three characters; body content does not move. |

The three Refero styles were retrieved in full after three searches. The build
target is the supplied SVG inside the existing page. No alternate brand direction,
generated bitmap mockup or new product claims are needed for this scoped change.

## Material and motion

The hero is inline SVG in `public/index.html`, allowing the existing motion
controller to pause every animated part without a fetch, frame, dependency or
relaxed Content Security Policy. Inner matrix transforms preserve the artwork's
perspective. Outer groups supply the independent paper motion.

An eight-second conversation starts at the curious orange character, reaches the
smiling charcoal character and receives a response from the ivory character.
The central node acknowledges the handoff, the dashed orange links carry the
signal, and the small blocks turn slightly. Each character rests between gestures.
The supplied faces, surrounding blocks and orange emphasis marks remain intact.

Animations default to paused. The existing controller starts them only when the
art is visible, the document is active, reduced motion is off and the visitor has
not paused. Without JavaScript, the complete illustration remains visible.

Shared components use sharp corners and solid paper edges. Evidence and
observation panels use ivory surfaces with dark text; orange remains an accent,
not a claim of success or readiness. The connect page inherits the shared button
treatment and a folded setup sheet while retaining its functional structure.

## Scope

The original WebP and social/icon assets remain available for existing references.
The home page no longer loads the raster hero. The owner approved the first paper
treatment and requested deployment through `main`. Integration preserves the
current protected setup prompts and server API. No engine or wallet change is
part of this work.

## Verification

- All 16 `npm run check` tests passed after integration with the current `main`,
  including internal links, serving allowlist, metadata, self-hosted assets,
  restrictive headers and protected prompt API behavior.
- The Playwright browser suite passed at 360, 768 and 1440 pixels on both
  routes. It checks SVG bounds and accessible name, independently running
  character timelines, pause and resume, offscreen suspension, reduced motion,
  and visible static artwork with JavaScript disabled.
- Existing keyboard tabs, skip navigation, guide disclosure and deep links,
  route selection, and clipboard success/failure checks passed.
- Prompt controls remain hidden and empty until unlock and reset on reload.
  Browser checks use synthetic API responses for rejected and accepted access,
  host tabs and clipboard behavior; Node tests verify API authorization. Without
  JavaScript, prompts remain locked with an explanation.
- Desktop and mobile screenshots were inspected, including the hero, paper
  evidence panels and connection page. No horizontal overflow was detected.
- The Impeccable detector returned no findings for the changed UI sources.
- Sampled normal-text color pairs passed the 4.5:1 contrast requirement.
- Changed HTML, CSS and test sources passed the deterministic readable-format
  runner. No runtime dependency was added.

Screenshots are local evidence under ignored `output/playwright/`. Production
deployment is verified separately through Vercel status and the public domain.
These website checks do not establish engine or real-host acceptance.
