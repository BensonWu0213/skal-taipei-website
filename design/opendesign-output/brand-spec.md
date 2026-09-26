# Skål International Taipei — brand spec (locked from the brief)

Source of truth: user brief + `ASSETS.md` + official lockup seen on the 2025–26 flyers.

## Core tokens (OKLch equivalents of the supplied hex)

| Token | Value | Hex origin | Role |
|---|---|---|---|
| `--bg` | `oklch(0.958 0.008 70)` | #F5F1ED cream | page background (A, B, C) |
| `--surface` | `oklch(0.995 0.002 90)` | near-white | cards, raised areas |
| `--fg` | `oklch(0.30 0.07 255)` | #003366 navy | primary text, nav/footer fills |
| `--muted` | `oklch(0.48 0.03 255)` | derived from navy | secondary text (≥ 4.5:1 on cream) |
| `--border` | `oklch(0.92 0.003 90)` | #E8E8E8 gray | hairlines |
| `--accent` | `oklch(0.75 0.08 70)` | #D4A574 gold | hairlines, CTA fill, eyebrows **on navy only** |
| `--accent-ink` | `oklch(0.50 0.09 70)` | darkened gold | gold-toned text on cream (passes AA) |
| `--green` | `oklch(0.45 0.08 160)` | #2D6A4F | sustainability tile / tag only |
| `--crest` | `oklch(0.52 0.19 262)` | Skål royal blue | crest placeholder only |

Contrast checks (WCAG AA):
- Raw gold #D4A574 on cream #F5F1ED ≈ 1.9:1 → **never used as text on cream**. Gold text on cream uses `--accent-ink` (≈ 6:1).
- Gold #D4A574 on navy #003366 ≈ 5.9:1 → OK for eyebrows / small text on navy.
- Navy on cream ≈ 11.5:1. Navy on gold button ≈ 6.2:1 (button label = navy, not white).

## Type
- Display: `'Playfair Display', 'Noto Serif TC', Georgia, serif` (A, C) · `'Cormorant Garamond', 'Noto Serif TC', Georgia, serif` (B)
- Body: `'Source Sans 3', 'Noto Sans TC', -apple-system, 'Segoe UI', sans-serif` (A, B) · `'Inter', 'Noto Sans TC', sans-serif` (C)
- Mono / captions: `'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace`

## Observed rules
1. One gold: as a hairline, an eyebrow on navy, or the single primary CTA — never as body text on cream.
2. Navy is a surface as much as a text colour: nav, footer, and one dark band per page.
3. Photography is real club photography (Radium Kagaya group photo, S-Aura toasts, pennant signing); never stock.
4. Logo lockup = royal-blue crest + SKÅL INTERNATIONAL + vertical rule + TAIPEI + "Connecting Tourism Globally". Rendered as an HTML/SVG placeholder of the same shape until the club supplies the file.
5. Motion is restrained: hover lifts of 2 px, opacity/colour transitions ≤ 200 ms, no parallax.
