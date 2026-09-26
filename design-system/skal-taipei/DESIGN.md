# Skål International Taipei — Design System

Brand contract for the skaltaipei.org.tw website. Read fully before rendering anything.

## 1. Brand essence
- Who: Taipei chapter (Club N° 347, est. 1970) of Skål International, the global network of travel & tourism leaders (est. 1934, 12,000+ members, 100+ countries).
- Motto: "Doing Business Among Friends". Official tagline: "Connecting Tourism Globally".
- Feel: five-star hospitality, diplomatic warmth, international. NOT corporate SaaS, NOT startup. Think a grand hotel's brand site: calm, generous, photographic.
- Anti-goals: no gradients on text, no glassmorphism, no neon, no emoji in headings, no stock-photo people (real event photos only), no lorem ipsum.

## 2. Logo
Files live in `public/images/brand/`. Use them as-is; never redraw, recolour, stretch, add effects, or set the words in a different font.
- Primary (light backgrounds): `skal-international-taipei-logo.svg`
- On dark/photo backgrounds: `skal-international-taipei-logo-white.svg`
- Single colour: `skal-international-taipei-logo-mono.svg` / `-all-white.svg`
- Crest only (favicon, avatars, section markers, watermark): `skal-crest.svg`, `skal-crest-mono.svg`
- Global "member of" mark for footer: `skal-international-logo-white.svg`
- Pennant (About/History): `skal-taipei-pennant-transparent.png`
- Gradient banner / share card: `skal-taipei-banner-wide.png` (1920×640), `skal-taipei-banner-social.png` (1600×900)
Clear space = height of the crest on all sides. Minimum width of the lockup: 180 px.

## 3. Colour
Official Skål colours (from the Skål International press kit) are the anchor; everything else supports them.

| Token | Hex | Role |
|---|---|---|
| `--skal-blue` | `#314691` | Official dark blue. Nav, footer, primary buttons, headings on light. |
| `--skal-blue-light` | `#65A8DE` | Official light blue. Links, icons, "TAIPEI" accent, hover. |
| `--skal-grey` | `#59595B` | Official text grey. Body text on light. |
| `--navy` | `#1F2E5C` | Deep navy for hero overlays and dark sections (a shade darker than skal-blue so the logo still pops). |
| `--gold` | `#C9A461` | Accent only: hairlines, small labels, one primary CTA. Never body text on cream (fails AA). |
| `--cream` | `#F7F4EE` | Page background. |
| `--white` | `#FFFFFF` | Cards, nav on scroll. |
| `--stone` | `#E6E2DA` | Borders, dividers. |
| `--green` | `#2D6A4F` | Sustainability accents only. |

Rules: skal-blue and navy may sit next to each other; gold is ≤ 5 % of any viewport; light blue text only ≥ 18 px on dark backgrounds.

## 4. Typography
- Headings: **Cormorant Garamond** (600) or Playfair Display (500). Tight leading (1.05–1.15), no letter-spacing on large sizes.
- Small caps labels ("CURRENT EVENTS", "EST. 1970"): **Montserrat** 500, 12–13 px, letter-spacing 0.18em, skal-blue-light or gold.
- Body / UI: **Inter** 400/500, 16–18 px, line-height 1.6, colour skal-grey on light, `rgba(255,255,255,.85)` on dark.
- Traditional Chinese fallback: Noto Serif TC for headings, Noto Sans TC for body. Font stacks must include them.
- Scale (desktop): 64 / 44 / 32 / 24 / 18 / 16 / 13. Mobile: 40 / 32 / 26 / 20 / 17 / 16 / 12.

## 5. Layout & spacing
- Max content width 1200 px; text measure ≤ 68ch.
- Section padding 96 px desktop / 56 px mobile. Space scale 4 · 8 · 16 · 24 · 40 · 64 · 96.
- Grid: 12 col, 24 px gutter. Cards on 3-up (desktop) → 2-up → 1-up.
- Sticky top nav, 72 px, transparent over hero → white with hairline shadow after scroll.

## 6. Components
- Buttons: 48 px tall, 4 px radius, Montserrat 600 14 px uppercase 0.08em. Primary = gold bg / navy text. Secondary = 1.5 px skal-blue outline. On dark: white outline.
- Cards: white, 1 px stone border, 8 px radius, no drop shadow at rest, soft shadow on hover, image ratio 16:10 with object-fit cover; a no-image variant shows the crest watermark at 8 % on cream.
- Stat chips: number in Cormorant 44 px skal-blue, label Montserrat caps.
- Hairline rule: 1 px gold, 64 px wide, used under section labels.
- Event card meta: date in Montserrat caps light blue → title Cormorant 24 → 2-line excerpt → "Read on Facebook ↗".

## 7. Imagery
Real club photography only (`public/images/brand/skal-taipei-cover-group-photo-2026.jpg`, `public/images/facebook-misc/`, `public/images/feed/`). Warm, slightly desaturated grade; overlay on hero = navy at 55–65 % with a bottom-to-top gradient so white text passes AA. Never place text over faces.

## 8. Motion
Restrained: 200 ms ease-out fades on scroll-in, 150 ms hover lifts (2 px). No parallax, no auto-playing carousels.

## 9. Accessibility
WCAG AA everywhere; visible focus rings (2 px skal-blue-light); nav is keyboard operable; all images have alt text; language toggle EN / 繁中 in the nav.
