# Skal International Taipei Website Build Plan

## Overview
Build a sleek, modern website for Skal International Taipei (since 1970) → deploy to Cloudflare Pages → point domain to skaltaipei.org.tw

---

## ✅ Status — as built (supersedes the Next.js notes below)

The site is built and compiles. Decisions that differ from the original plan:

| Topic | Plan said | What was built | Why |
|---|---|---|---|
| Framework | Next.js | **Astro 5, fully static** (`output: "static"`, `dist/`) | One page, no interactivity beyond a menu button; Astro ships zero JS by default and does build-time image optimisation. |
| Design | OpenDesign, 3 directions | **Direction C — Editorial** (`design/opendesign-output/skal-taipei-c-editorial.html`) | Chosen by the club. Ported 1:1 into Astro components. |
| Events | Manual copy | **Build-time render of `content/facebook-feed.json`** + optional editorial headlines in `content/feed-overrides.json` | The GitHub Action refreshes the feed every 6 h and commits; every commit redeploys. |

**Project layout**
```
src/pages/index.astro         the one page (section order)
src/layouts/Base.astro        <head>: meta, OG, RSS link, JSON-LD, fonts
src/components/*.astro        TopNav · Hero · About · Events · Programmes · WhyJoin · Membership · Footer
src/data/site.ts              ALL copy — edit text here, never in components
src/lib/feed.ts               turns facebook-feed.json into 6 event cards
src/styles/global.css         design tokens (Direction C) + base styles
content/facebook-feed.json    scraper output (do not hand-edit)
content/feed-overrides.json   optional per-post title/summary/tag/hide
public/                       logos, feed photos, feed.xml (copied verbatim to dist/)
scripts/fetch-facebook-feed.mjs   the scraper (npm run feed)
```

**Local commands**
```bash
npm install          # Node ≥ 22
npm run dev          # http://localhost:4321
npm run build        # → dist/
npm run preview
```

**Cloudflare Pages settings** (Workers & Pages → Create → Pages → connect the GitHub repo)
- Framework preset: **Astro**
- Build command: `npm run build`
- Build output directory: `dist`
- Environment variables: `NODE_VERSION = 22`; optionally `SITE_URL = https://skaltaipei.org.tw` (default in `astro.config.mjs`)
- Custom domain: add `skaltaipei.org.tw` and `www` → Cloudflare creates the CNAME records once the domain's nameservers are on Cloudflare (Phase 5 below).

**Content to confirm before launch**
- `hero.nextLine` in `src/data/site.ts` — only ever show a confirmed next-meeting date (or set to `""`).
- `whyJoin.testimonial.quote` — block is hidden until a real member quote is supplied.
- `membership.feeNote` — replace with actual dues if the board agrees to publish them.
- Names in copy (Membership Director, Charter President, ambassadors) are taken from Facebook posts — have the board verify.

---

## Building Ingredients (Tech Stack)

### 1. **Design System** → **OpenDesign** (Open-source, AI-powered)
- **What it is**: Official open-source Claude Design alternative from nexu-io/open-design (Apache-2.0)
- **How to use it**:
  - Download desktop app (macOS/Windows x64) OR clone & run from source
  - Local-first: runs on your machine, no cloud sync required
  - Write a design brief (style guide, brand colors, typography, component look & feel)
  - Let AI agent generate design system + artifacts
  - Export as: HTML, PDF, PPTX, PNG, ZIP, or Markdown
- **Cost**: **$0** (open-source, free)
- **Repo**: https://github.com/nexu-io/open-design

### 2. **Frontend Framework** → **Next.js** (Production-grade React)
- **Why**: Fast, SEO-friendly, excellent for content-heavy sites like Skal's organization site
- **What you get**: Pages, API routes, image optimization, built-in internationalization ready
- **Cost**: **$0** (open-source, free)

### 3. **Hosting** → **Cloudflare Pages**
- **What it is**: Global CDN + serverless functions + free tier is very generous
- **Free tier includes**:
  - Unlimited static requests (perfect for a static marketing site)
  - 100,000 function invocations per day (if you add dynamic features later)
  - Custom domains (no extra charge)
  - Automatic HTTPS
  - Git integration (connect GitHub/GitLab repo, auto-deploy on push)
- **Cost**: **$0–20/month** depending on scale (most orgs stay free)
- **Docs**: https://developers.cloudflare.com/pages/

### 4. **Domain** → **.org.tw** (Taiwan organization domain)
- **Registrar**: Any TWNIC-accredited registrar (e.g., Gandi, GoDaddy, 協志聯合科技 [Taiwan-local])
- **Annual cost**: **NT$800–1000/year** (~USD $26–33)
- **Notes**:
  - .org.tw is restricted to registered nonprofit organizations/foundations
  - Skal International Taipei will need to verify nonprofit status
  - Registration takes 3–5 business days after verification
- **Popular registrars**:
  - [RedDNS](https://www.reddns.com/tw/) (Taiwan-local, NT$1000/year)
  - [Gandi](https://www.gandi.net/) (international, accepts .org.tw)
  - [GoDaddy](https://godaddy.com/) (international)

---

## Step-by-Step Workflow

### Phase 1: Research & Content Gathering (1–2 hours)
1. **Extract information from Skal Facebook**:
   - Organization mission, values, services
   - Contact info, leadership, chapters/members
   - Event photos, testimonials, case studies
   - Branding (colors, logo, tone of voice)

2. **Create a content brief** (Markdown or text file):
   ```
   # Skal International Taipei Website Brief
   
   **Organization**: Skal International Taipei (since 1970)
   **Mission**: [From Facebook]
   **Services**: [List key offerings]
   **Target Audience**: [Who visits: members, partners, job seekers?]
   **Style**: Professional, modern, trustworthy
   **Sections Needed**:
   - Hero: tagline + CTA
   - About: organization mission & history
   - Services/Offerings: what Skal does
   - Team/Leadership: members, chapters
   - Testimonials: success stories from partners
   - Contact: email, phone, social links
   **Color Palette**: [Your brand colors or "warm professional"]
   **Fonts**: [Serif for headlines? Sans for body? Or "modern, legible"]
   ```

### Phase 2: Design System Generation (1–2 hours)
1. **Install OpenDesign**:
   - Download: https://open-design.ai/ (or `git clone https://github.com/nexu-io/open-design`)
   - If running from source: `pnpm install && pnpm tools-dev run web` (localhost:7456)

2. **Create design brief in OpenDesign**:
   - Open home → paste your content brief
   - Agent asks clarifying questions (color themes, layout preference, spacing, etc.)
   - Agent streams a design system + component previews

3. **Review & iterate**:
   - 5-point self-critique: brand accuracy, readability, modern feel, user flow, accessibility
   - Export as **design-system package** (DESIGN.md + tokens.css + component HTML)
   - **Location**: `~/.od/projects/<id>/artifact.html`

4. **Save design files locally**:
   ```
   ./design-system/
   ├── DESIGN.md          # Design system documentation
   ├── tokens.css         # Color, typography, spacing tokens
   └── components.html    # Reference component library
   ```

### Phase 3: Website Development (2–4 hours)
1. **Scaffold Next.js project**:
   ```bash
   npx create-next-app@latest skal-website --typescript --tailwind
   cd skal-website
   ```

2. **Integrate OpenDesign tokens**:
   - Copy `tokens.css` into `app/globals.css`
   - Create component files from the OpenDesign HTML:
     - `components/Hero.tsx`
     - `components/About.tsx`
     - `components/Services.tsx`
     - `components/Team.tsx`
     - `components/Testimonials.tsx`
     - `components/Contact.tsx`

3. **Build page structure** (`app/page.tsx`):
   ```tsx
   import Hero from '@/components/Hero'
   import About from '@/components/About'
   import Services from '@/components/Services'
   import Team from '@/components/Team'
   import Testimonials from '@/components/Testimonials'
   import Contact from '@/components/Contact'
   
   export default function Home() {
     return (
       <>
         <Hero />
         <About />
         <Services />
         <Team />
         <Testimonials />
         <Contact />
       </>
     )
   }
   ```

4. **Add content** (hardcoded or from CMS):
   - Skal's mission, services, team info
   - Contact form (email service: Resend, SendGrid, or simple mailto)
   - Social links

5. **Test locally**:
   ```bash
   npm run dev  # http://localhost:3000
   ```

### Phase 4: Deployment to Cloudflare Pages (30 minutes)
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial Skal website"
   git remote add origin https://github.com/YOUR_USERNAME/skal-website.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - **Workers & Pages** → **Pages** → **Connect to Git**
   - Select your GitHub repo (`skal-website`)
   - Build settings:
     - **Framework preset**: Astro
     - **Build command**: `npm run build`
     - **Build output directory**: `dist`
     - **Environment variable**: `NODE_VERSION` = `22`
   - **Deploy**

3. **Cloudflare Pages auto-assigns a URL**:
   - e.g., `https://skal-website.pages.dev`
   - Test it works ✓

### Phase 5: Custom Domain Setup (15 minutes)
1. **Buy domain** from a Taiwan registrar:
   - Choose: RedDNS, Gandi, or GoDaddy
   - Register `skaltaipei.org.tw`
   - Verify nonprofit status (takes 3–5 days)
   - Wait for registration to complete

2. **Point domain to Cloudflare**:
   - In registrar dashboard, set nameservers to Cloudflare's:
     ```
     lisa.ns.cloudflare.com
     paul.ns.cloudflare.com
     ```
   - OR create A/CNAME records pointing to Cloudflare Pages

3. **Add custom domain in Cloudflare Pages**:
   - **Pages** → your project → **Settings** → **Domain**
   - **Add custom domain** → `skaltaipei.org.tw`
   - Verify DNS propagation (5–10 minutes)
   - Automatic HTTPS cert issued by Cloudflare ✓

4. **Test**:
   - Visit `https://skaltaipei.org.tw` → should load your site

### Phase 6: Ongoing Maintenance
- **Auto-deploy**: Push to GitHub → Cloudflare auto-rebuilds & deploys
- **Analytics**: Cloudflare Web Analytics (free tier available)
- **Backups**: GitHub is your backup (all code versioned)
- **SSL/TLS**: Automatic (Cloudflare handles renewal)

---

## Total Cost Breakdown

| Item | Cost | Frequency | Notes |
|------|------|-----------|-------|
| **Design System** (OpenDesign) | $0 | One-time | Free, open-source |
| **Frontend Framework** (Next.js) | $0 | One-time | Free, open-source |
| **Hosting** (Cloudflare Pages) | $0 | Monthly | Free tier; upgrade to Pro ($20/mo) if you need Workers functions at scale |
| **Domain** (skaltaipei.org.tw) | NT$800–1000 | Annual | ~USD $26–33; renew yearly |
| **Email sending** (optional) | $0–50 | Monthly | Free tier: Resend (100 emails/day free); paid: SendGrid, Mailgun |
| **CDN/SSL** | $0 | Included | Cloudflare includes HTTPS, caching, DDoS protection |
| **SEO tools** (optional) | $0–100 | Monthly | Semrush, Ahrefs (optional; Cloudflare Web Analytics is free) |
| **Total Year 1** | **NT$800–1000** | — | ~**USD $26–33 + dev time** |
| **Total Year 2+** | **NT$800–1000** | Annual | Domain renewal only; everything else stays free |

---

## Development Time Estimate

| Phase | Time | Notes |
|-------|------|-------|
| Content gathering & brief | 1–2 hrs | Extract from Facebook, clarify messaging |
| Design system generation | 1–2 hrs | OpenDesign iteration + review |
| Website development | 2–4 hrs | Next.js scaffolding + component building |
| Testing & refinement | 1 hr | Local smoke tests |
| Deployment setup | 30 min | Cloudflare + domain pointing |
| **Total** | **6–10 hrs** | Achievable in 1–2 days |

---

## Key Decision Points

### 1. **Content Source**: Facebook → Website
- **Action**: Extract Skal's mission, services, team from Facebook, format for web
- **Responsibility**: You or Skal team provide content

### 2. **Design Preference**: Modern & sleek
- **Tool**: OpenDesign (AI-assisted, brand-consistent)
- **Alternative**: Hire a designer (cost: NT$10,000–50,000+)

### 3. **Interactivity**: Static vs. Dynamic
- **Static** (simpler, cheaper, faster): Fixed pages, maybe a contact form
- **Dynamic** (more complex, optional later): Member directory, event calendar, CMS integration

### 4. **Email Hosting**:
- **Option A**: Use a free tier (Resend: 100/day free, perfect for contact forms)
- **Option B**: Paid tier (SendGrid, Mailgun: $10–50/mo for high volume)

### 5. **Future Growth**:
- **Now**: Cloudflare Pages free tier (unlimited static requests)
- **Later** (if adding features): Upgrade to Cloudflare Pro ($20/mo) for advanced Workers functions

---

## Tools & Accounts You'll Need

### To Create
- [x] GitHub account (free): https://github.com
- [x] Cloudflare account (free): https://dash.cloudflare.com/
- [x] Registrar account (paid): RedDNS, Gandi, or GoDaddy

### Already Free
- Next.js CLI: `npx create-next-app`
- OpenDesign: Download or git clone
- Node.js (if not installed): https://nodejs.org/

---

## Next Immediate Steps

1. **Today**: 
   - Gather Skal content (mission, services, team, contact) from Facebook
   - Write a one-page design brief (colors, tone, sections needed)

2. **Tomorrow**:
   - Set up OpenDesign, generate design system (1–2 hrs)
   - Start Next.js project, integrate design (2–4 hrs)
   - Deploy to Cloudflare Pages (30 min)

3. **This week**:
   - Register `skaltaipei.org.tw` domain (3–5 days for verification)
   - Point domain to Cloudflare (15 min once registered)
   - Go live!

---

## FAQ

**Q: Can I use Wordpress instead?**
A: Yes, but you'd pay hosting costs (~$100–200/year) and lose the speed/SEO benefits of static generation. Cloudflare Pages + Next.js is faster and cheaper.

**Q: What if I need a CMS (content management)?**
A: Add one later: Sanity, Contentful, or Strapi. For now, hardcode content in `.tsx` files (easy to update).

**Q: Can I add a blog?**
A: Yes. Use Next.js App Router + MDX for Markdown blog posts. Can be added post-launch.

**Q: What about analytics?**
A: Cloudflare Web Analytics (free tier). You can also add Google Analytics if desired.

**Q: Do I need SSL/TLS?**
A: Yes, Cloudflare provides it automatically. Modern browsers require HTTPS.

**Q: Will it rank on Google?**
A: Yes. Next.js has built-in SEO (meta tags, sitemap, structured data). Add a `robots.txt` and submit to Google Search Console for faster indexing.

---

## Summary Table: Your Launch Path

```
Week 1:
  Mon: Content gathering + design brief
  Tue–Wed: OpenDesign iteration → design-system files
  Thu: Next.js dev + Cloudflare deploy (pages.dev URL)
  Fri: Domain registration (3–5 day verification starts)

Week 2:
  Tue: Domain verified → point nameservers to Cloudflare
  Wed: Custom domain live on Cloudflare (DNS propagation)
  Thu: Final testing on https://skaltaipei.org.tw
  Fri: Launch! 🚀

Total out-of-pocket: NT$800–1000 (domain only)
```

---

**Questions? Let me know, and I'll help you execute each phase!**
