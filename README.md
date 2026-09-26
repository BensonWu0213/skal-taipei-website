# Skål International Taipei — website

One-page marketing site for Skål International Taipei (Club No. 347, est. 1970).
Astro 5, fully static, deployed on Cloudflare Pages → `skaltaipei.org.tw`.

Design: OpenDesign **Direction C · Editorial** (`design/opendesign-output/skal-taipei-c-editorial.html`).

## Commands

```bash
npm install        # Node ≥ 22
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview
npm run feed       # re-scrape the Facebook page (also runs every 6 h in GitHub Actions)
```

## Where things live

| Path | Purpose |
|---|---|
| `src/data/site.ts` | **All copy.** Edit text here, never inside components. |
| `src/pages/index.astro` | Section order. |
| `src/components/*.astro` | TopNav · Hero · About · Events · Programmes · WhyJoin · Membership · Footer |
| `src/lib/feed.ts` | Turns `content/facebook-feed.json` into the 6 event cards. |
| `content/feed-overrides.json` | Optional per-post `title` / `summary` / `tag` / `hide`, keyed by post id. |
| `content/facebook-feed.json`, `public/feed.xml`, `public/images/feed/` | Scraper output — do not hand-edit. |
| `public/images/brand/` | Official logos (SVG built from the brand kit). |
| `skal-website-build-plan.md` | Plan + **"as built"** status, Cloudflare settings, pre-launch checklist. |

## Deploy (Cloudflare Pages)

Framework preset **Astro** · build `npm run build` · output `dist` · env `NODE_VERSION=22`.
Every push (including the feed bot's commits) redeploys.

## Before launch

- `hero.nextLine` — only show a confirmed next-meeting date, or set `""`.
- `whyJoin.testimonial.quote` — hidden until a real member quote exists.
- `membership.feeNote` and names quoted from Facebook posts — verify with the board.
