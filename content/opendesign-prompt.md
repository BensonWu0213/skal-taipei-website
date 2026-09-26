# OpenDesign prompt — Skål International Taipei homepage

Paste the block below into OpenDesign. Attach: design-brief.md, content/ASSETS.md,
content/facebook-feed.json, and the images listed at the bottom.

---

Design a sleek, modern, one-page marketing website for **Skål International Taipei**, the Taipei chapter (founded 1970) of Skål International — the world's largest professional network of travel & tourism leaders (founded 1934, 12,000+ members, 100+ countries). Motto: "Doing Business Among Friends". Tagline on the official logo: "Connecting Tourism Globally".

Read `design-brief.md` and `ASSETS.md` first and use the real facts, names, venues and programmes from them — no lorem ipsum, no invented statistics.

## Audience & goal
Primary: hotel GMs, airline/travel-agency executives, tourism-board staff and diplomats in Taipei deciding whether to join or attend a lunch meeting. Secondary: members checking the next event. The page must make joining or RSVPing feel prestigious, warm and effortless.

## Brand
- Palette: Navy #003366 (primary), Gold #D4A574 (accent), Cream #F5F1ED (background), Gray #E8E8E8, Green #2D6A4F (sustainability accents). Skål crest blue is a bright royal blue — navy should harmonise with it.
- Type: elegant serif for headings (e.g. Playfair Display or Cormorant), clean sans for body (Inter or Source Sans). Support Traditional Chinese glyphs (Noto Sans TC / Noto Serif TC fallback).
- Feel: international hospitality — think a five-star hotel brand site, not a corporate SaaS. Generous whitespace, large photography, subtle gold rules, restrained motion.
- Logo: use the real SVG files — `public/images/brand/skal-international-taipei-logo.svg` (light backgrounds), `…-taipei-logo-white.svg` (dark backgrounds), `skal-crest.svg` (icon/favicon). Do not redraw or restyle them. Official Skål blues: dark `#314691`, light `#65A8DE`, grey `#59595B` — the site navy must sit comfortably next to them.

## Sections (in order)
1. **Hero** — full-bleed photo (attached 2026 group photo at Radium Kagaya, or a candid toast photo), overlaid headline "Where Taipei's tourism leaders meet", one-line sub, two CTAs: "Join a lunch meeting" (gold) and "Become a member" (outline). Small line: "Taipei chapter · est. 1970 · Skål International".
2. **About** — 3 short paragraphs: what Skål is, the Taipei club since 1970, the "Doing Business Among Friends" spirit. Include 3–4 stat chips (1934 · 100+ countries · 12,000+ members · Taipei since 1970).
3. **Current Events** — grid of the latest 6 Facebook posts from `facebook-feed.json` (image, date, title, 2-line excerpt, "Read on Facebook" link). Card design must handle posts with no image. Header: "Current Events" with an RSS icon linking to /feed.xml.
4. **What we do** — 4–6 tiles: Monthly General Meetings (lunch, Wednesdays), Doing Business Among Friends, World Tourism Day, Skål Taipei Toastmasters, Young Skål, Sustainability (reforestation, Sustainable Tourism Awards), International twinning (Japan chapters, Cusco).
5. **Why join** — 3 benefit columns + a short quote-style highlight (can be a placeholder testimonial marked as such).
6. **Membership** — who qualifies (tourism/hospitality professionals), how to join (attend as guest → apply → induction), fee note "contact us", CTA button.
7. **Contact / footer** — email skalinternationaltaipei@gmail.com, Facebook link, link to skal.org, small white Skål International logo, "© Skål International Taipei", EN / 繁中 language toggle placeholder.

## Constraints
- Mobile-first, responsive; hero must look good on a phone in portrait.
- Static HTML + CSS (Tailwind is fine). No backend. Current Events cards should be easy to map to JSON later.
- Accessible contrast (WCAG AA) — check gold text on cream.
- Keep it to one page plus a sticky top nav with anchor links.

## Deliver
Three visual directions as separate pages, then I'll pick one:
- **A. Classic Prestige** — navy hero, serif headlines, gold hairlines, photo-heavy.
- **B. Bright Hospitality** — cream/white dominant, big photography, navy only for nav/footer, friendlier.
- **C. Editorial** — magazine-style layout, oversized type, asymmetric grid for Current Events.

Export each as a standalone HTML file with the images referenced relatively so they can be handed to a developer.

---

## Images to attach
- `public/images/brand/skal-taipei-cover-group-photo-2026.jpg` — hero candidate (group photo with banner)
- `public/images/facebook-misc/816164037_1625247016063838_7940717025564087548.jpg` — Halloween flyer, shows official logo lockup top-left
- `public/images/facebook-misc/774432459_1593070462614827_6346110160908575351.jpg` — candid toast, President with chain of office
- `public/images/facebook-misc/773645951_1593070432614830_6539563344041496633.jpg` — ambassador signing pennant (vertical)
- `public/images/facebook-misc/127182412_187718786378380_7515727466974080427.jpg` — Taipei 101 fireworks (mobile hero option)
- `public/images/brand/skal-international-taipei-logo.svg` + `-white.svg` — official Taipei lockup (nav / footer)
- `public/images/brand/skal-crest.svg` — crest alone (favicon, section markers)
- `public/images/brand/skal-taipei-banner-wide.png` — ready-made gradient banner (hero option if no photo)
- `public/images/brand/skal-taipei-pennant-transparent.png` — club pennant (About / History section)
- `public/images/brand/skal-international-logo-white.svg` — white global logo for footer "member of Skål International"
