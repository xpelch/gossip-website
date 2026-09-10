# Gossip mascot refinement

This pass refines the existing website around the owner-supplied September 10,
2026 brand assets. The layout, Bricolage Grotesque display font, content, setup
prompt, example data and connection behavior remain the incumbent reference.

## Reference lock

| Decision | Source | Role |
| --- | --- | --- |
| Keep the dark canvas, expressive headline and section sequence | Existing Gossip website | Preserve recognition and navigation |
| Orange `#ff7a00`, cream `#fff9f1`, warm charcoal `#11100f` | Supplied Gossip brand boards | Accent, light surfaces and dark canvas respectively |
| Three connected speech-bubble mascots replace the chrome bubbles | Owner-selected hero image | One hero illustration with gentle, pausable movement |
| Shared warm surfaces across the evidence, observation and setup cards | Refero color reference | Neutral surfaces; brand color must not imply readiness or success |
| Responsive artwork, stable dimensions, visible focus and reduced motion | Impeccable polish guidance | Preserve usability while refining the brand |

Refero's live research tools were not exposed in this session. The reference
lock uses the supplied hero, logo and brand boards, incumbent website, and
Refero's bundled color and visual-workflow guidance. No brand-board slogans
replace the site's factual AI-agent product copy.

## Assets

- `public/assets/gossip-hero.webp` and `gossip-hero-small.webp`: optimized
  1536px and 768px hero artwork, based on the owner's selected three mascots.
- `public/assets/gossip-social.jpg`: 1200 × 630 sharing card from the supplied
  light Gossip wordmark artwork (`14 h 02 min 22 s (5).png`), edited with
  Imagegen to replace the visible domain with “Trade inference for intelligence.”
- `public/gossip-mark.svg`: editable small-size interpretation of the supplied
  three-mascot logo. The same geometry supplies the PNG and ICO icons.
- `public/favicon.ico`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`
  and `icon-512.png`: browser and home-screen sizes.

Both public pages declare canonical URLs, Open Graph and Twitter large-image
cards, the shared icon set, theme color and web manifest. The manifest opens in
browser mode; it does not claim offline support. The sitemap contains only the
two existing public pages.

## Verification scope

The final hero was edited with the built-in Imagegen tool and exported as WebP.
A transparent attempt produced a visible checkerboard and was rejected; the
selected artwork uses the page's opaque charcoal background instead. A CSS edge
mask softens its boundary while keeping the mascot centers fully visible.

Final hero Imagegen prompt:

> Use case: precise-object-edit. Asset type: Gossip website hero. Edit target: supplied original image. Preserve the original three speech-bubble mascots, their poses, expressions (black happy smiling above, orange two eyes lower left, cream winking lower right), exact composition, shape, colors, orange orbital links, cubes and sound rays. Change ONLY the background: replace all distant ambient background and broad glow with a perfectly flat opaque dark charcoal #11100f, continuing all the way to every edge and corner. A small localized warm glow close to objects is okay. Keep all three mascots fully framed with 8% safe margin. No transparent background, no checkerboard, no gray grid, no text. Landscape 1536x1024. Clean high quality final website artwork.

Final sharing-card Imagegen prompt:

> Use case: text-localization. Edit target: the supplied 1200x630 Gossip social sharing card. Change ONLY the small line of text immediately below the large "gossip" wordmark. Completely remove "gossip-website.vercel.app" and replace it with exactly "Trade inference for intelligence." in a clean dark near-black rounded sans-serif typeface, centered under the wordmark, on one line, similar size and position to the original line, crisp and readable. Keep the "gossip" wordmark and its orange i dot exactly as they are. Keep all three orange, black and cream mascot figures, all surrounding orange and cream shapes, background, spacing, proportions and composition unchanged. No URL or domain visible anywhere. No extra text. Preserve aspect ratio 1200:630 (landscape social card).

Both routes were checked at 360px, 768px and 1440px, including the hero,
information cards and expanded connection guide. Browser checks passed for
pause/resume and reduced motion, tabs with keyboard navigation, setup and
connection copy success/failure, disclosures, deep links, skip navigation and
no-JavaScript content. The static checks verify the metadata assets through the
preview server, social-card dimensions, MIME types and restrictive headers.
Impeccable's detector returned no findings on the two pages and shared CSS.

Final acceptance: all 8 Node checks and the existing browser-checks suite passed.
The setup prompt at revision `4331000cca51ddcf9d377daf9d6a7c57aaf63750`
is byte-for-byte unchanged inside its `<pre>` element. The changed source files
and manifest passed the deterministic readable-format runner. Sampled text
pairings from the updated palette have contrast ratios of at least 5.14:1.
