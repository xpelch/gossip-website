# Design and content brief v1

Reviewed 2026-09-05. Scope: public website #348; policy authority: #346.

## Visual direction

Orbio was visually inspected in a live browser at https://www.orbio.so/.
Its restrained header, large serif headline, calm paper backdrop and edge-framed
hero informed hierarchy. Its columns, logo, artwork, prose and economic claims
were not reused. The original `public/forest.svg` uses layered pine silhouettes
and concentric contour lines. No external images or font requests are made.

Georgia / Times New Roman is the editorial system serif; Arial / Helvetica is the
UI system sans. Fonts are resolved from the visitor's licensed OS installation;
no font files are redistributed. The optional clover-like tree glyph is a text
emblem, not a trademark claim. The SVG is authored for this site.

| Token | Value | Use |
| --- | --- | --- |
| Paper | #F5F1E7 | Reading surface |
| Ink | #18251E | Main text |
| Forest | #173E2B | Actions and privacy section |
| Moss | #61714B | Numbers and accents |
| Muted | #4D5B50 | Supporting text |
| White | #FFFCF5 | Cards and action labels |
| Focus | #8B6024 | Keyboard outline |
| Width | 1120px | Desktop content maximum |
| Headline | 46–88px | Responsive hero |
| Body | 16px / 1.65 | Readable default |

Contrast: ink/paper 14.08:1; muted/paper 6.36:1; moss/paper 4.69:1;
white/forest 11.64:1; pale privacy text/forest 8.37:1; badge text/fill 7.14:1.
Gold is not used for small body copy. There are no automatic animations.
Reduced motion disables smooth scrolling.

## Page map and versioned section copy

The checked-in semantic HTML is the exact versioned copy source. This table records
the message and its availability qualification, without maintaining a second full
copy of every paragraph.

| Section | Heading / message | Qualification |
| --- | --- | --- |
| Hero | See what moves through Sherwood. | Public preview; setup unavailable |
| Questions | Better questions. Grounded answers. | Synthetic field note, fictional block/time; partial Readiness |
| Participation | Ask. Contribute. Go deeper. | Planned, evaluation before benefit |
| Gossip | An observation. With its roots attached. | Synthetic structured observation, not a wire schema |
| Privacy | Shared evidence. Private contributions. | Planned owner-only raw policy, independent disclosure checks |
| Connection | Your agent signs. Your key stays put. | Guide available, authentication unavailable |
| Telegram | Follow the news. Ask your own questions. | Two disabled destinations, both unverified |
| Availability | Access comes first. Promises do not. | Quotas pending, rewards inactive, no live health claim |
| FAQ | Before you enter. | Freshness, privacy, costs, optional contribution, clients, disconnect |
| Guide | Your agent signs. Your key stays put. | All route versions unverified |

Routes: `/` public explanation, `/connect.html` connection guide,
`/availability.json` public non-executable availability record. Footer links lead
to real in-page privacy/status/help sections and the issue's progress page.

## Wireframes

Desktop:

```text
[brand                       how / Telegram / status / guide]
[forest       eyebrow + large serif hero             forest]
[                  two actions + preview label            ]
[questions                       synthetic answer receipt ]
[ask                     contribute               deeper  ]
[Gossip explanation              synthetic structure      ]
[dark privacy: public facts / owner-only raw / derived     ]
[secure connection               permissions / availability]
[news channel                    personal bot             ]
[conditional rewards             current availability     ]
[FAQ                                                      ]
[footer                                                   ]
```

Mobile: same DOM and reading order; single-column cards and stacked hero actions.
Forest framing is removed below 600px so it cannot crowd the text. Navigation wraps
without a hidden menu. Code wraps; compatibility table has a contained scroll area.
Guide desktop: introduction then left contents rail / right numbered sections.
Guide mobile: inline wrapping contents links then sections in order.

## Component states

- Links: real local anchors/pages or known GitHub issue URLs; visible keyboard focus.
- Unavailable integrations: native disabled buttons plus visible explanation;
  no fake click target, waitlist submission or simulated success.
- Route selector: labelled native select; status region explains each route;
  full matrix remains present without JavaScript.
- FAQs: native details/summary, collapsed initially, keyboard operable.
- Copy: appears only with JavaScript; copies public JSON excerpt; success and failure
  announced in a polite status region. Manual selection is the fallback.
- Coverage: sample is explicitly Example/synthetic and Partial. Source block and
  observation time are fictional. No live counters or generated current timestamps.
- Service availability: not connected, not yet available, pending, inactive.
  Future partial/stale/unavailable results must remain distinct from no activity.

## Comprehension review

Editorial self-check (not an independent user study): a reader can locate these
answers without code: Sherwood analyzes token/wallet activity; a Gossip is a sourced,
dated observation; the owner can read it; another agent cannot read raw collection;
connection proves wallet control and does not permit spending. A real reader study
and screen-reader assistive-technology session remain useful acceptance follow-ups.
