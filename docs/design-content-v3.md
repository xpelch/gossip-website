# Floating conversation — refinement v3

This is a scoped amplification of the user-selected Signal identity, not a change
to Gossip's product or backend contract. Gossip remains the public brand; Sherwood
remains the engine. The localhost configuration and all tool/privacy facts remain.

## Direction and sources

The user asked for another, funkier pass with background-free floating animated
assets and explicitly invoked Impeccable and Refero. Impeccable context, bolder,
animate and craft-floor references were applied. This is Persuade mode for the
landing and Read mode for the guide; incumbent v2 copy/contracts are the authority.
The repository-wide context script found engine design notes rather than website
context, so this scoped refinement uses the existing website and v2 reference lock.
No unrelated root design files were created or changed.

Refero remains the research method. Its previously inspected Raycast/Privy/Kaito
references and selected graphite/orange/material direction are retained; no live
Refero tools are exposed and no new Refero search is claimed. Impeccable supplied
implementation craft and bounded motion guidance, not a competing palette.

Changes: self-hosted Bricolage Grotesque, tilted orange word shape, genuinely
transparent sculpture, two conversation labels, restrained orbital geometry,
cream protocol strip, orange exchange section and cream closing section. Removed
repetitive eyebrow labels and replaced diagonal-arrow glyphs with authored SVG.
No new product claims, fake data or client compatibility claims.

## Motion thesis

One focal moment: the speech sculpture slowly changes angle and height, like a
conversation suspended between agents. No repeating section reveals or feed effects.
One seven-second transform loop; no framework, shaders, layout animation or
per-pointer render loop. The orbit and labels remain still so the focal object
has a clear frame of reference.

The default without JavaScript is paused. IntersectionObserver watches the art
region itself, not the whole hero; it pauses outside the viewport. Hidden pages
also pause. A manual Pause/Resume control preserves user intent across visibility
changes. Reduced-motion disables the animation and labels the control Motion off.
No text or essential explanation is hidden behind animation.

## Assets

`public/gossip-floating.png`: built-in Imagegen background-extraction edit of the
v2 sculpture. Saved as a new sibling; original assets preserved. Verified PNG RGBA,
1536×1024; 45.47% fully transparent pixels and all four corners alpha=0. The image
is composited normally: no blend mode, painted backdrop, CSS background removal,
or baked screenshot. Transparency through the shape and around its silhouette was
visually checked in the website.

Prompt:

> Edit target: the attached Gossip chrome and orange speech-bubble sculpture.
> Use case: background-extraction. Create a truly transparent-background PNG cutout
> with real alpha, not a checkerboard baked into RGB. Keep the same beautiful two
> interlocked sculptural speech rings, chrome in front and orange glass behind,
> with the small orange satellite bead. Preserve refined materials, silhouette,
> orange/chrome palette, proportions and polished reflections. Remove the entire
> dark studio backdrop, floor, ground shadows, atmospheric haze and all rectangular
> framing. The sculpture must float freely in transparent space, including genuine
> transparency through both ring apertures and between objects. Use tidy antialiased
> cutout edges. No text, no UI, no floor, no background color, no gradient, no
> checkerboard. Landscape composition with enough transparent margin that the tails
> are not cropped. This will be composited and animated directly over website
> typography; genuine alpha is essential.

`public/fonts/bricolage-grotesque.ttf` and `OFL.txt`: original official Google Fonts
variable font, 408,496 bytes. License, immutable source and SHA-256 in
[font-provenance.md](font-provenance.md). Font data is served locally; no third-party
font request. A Luna worker acquired these files; the coordinator checked the hash
and loaded font in the browser. Provenance was moved into the website subtree.

## Validation

- Five Node checks pass: previous policy/guide/internal-route protections plus
  PNG alpha format, local TrueType format/license and new served asset paths.
- Browser suite passes on both pages at 360/768/1440px: no page overflow, navigation,
  tabs/keyboard/content, selector, FAQ, clipboard success/failure, skip link,
  no-JavaScript reading and no external resource requests.
- Actual transform changes observed; pause/resume, offscreen pause and reduced
  motion validated. A focused 360px check also confirmed the offscreen art stays
  paused while hero text is visible, resumes when art enters view, and manual
  pause persists after scrolling away and back.
- One initial batched visual inspection found transformed-image overflow at
  tablet/desktop widths. One fix batch reduced the object's bounds; final browser
  suite and captured views confirm the correction. No open-ended polishing loop.
- Impeccable mechanical detector ran once and returned no findings (`[]`).
- Text on the orange section uses #251A14 for headings and #48291D for supporting
  copy; cream strip supporting copy is #55504A. Contrast was calculated, and an
  initially borderline supporting shade was darkened without changing layout.
- No production MCP call, signature, wallet transaction, deployment, backend/indexer,
  DB, shared root build or Railway modification.
