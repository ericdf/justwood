# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Portfolio/gallery site for Eric Friedman, a Berkeley woodworker specializing in Japanese joinery (kumiko), furniture, turned bowls, and lighting. Goal: curated atelier aesthetic to attract serious commission clients. Not a shop.

Live at justwood.design (replaced the previous Hugo Blox site).

## Technology Stack

- **Eleventy (11ty)** — static site generator, Nunjucks templates
- **Tailwind CSS** — via PostCSS
- **Alpine.js** — CDN (no build step); used for category filter, mobile nav, lightbox
- **Google Fonts** — Cormorant Garamond, Lora, Jost, Noto Serif JP (Noto conditional — only loaded on pieces with Japanese titles)
- **GitHub Pages** — hosting; `.github/workflows/deploy.yml` auto-deploys on push to `main`

## Commands

```bash
npm run dev      # Eleventy dev server + PostCSS watch (via concurrently)
npm run build    # Production build → _site/
```

Tailwind is processed via PostCSS as part of the Eleventy build.

## Architecture

**Data-driven pages:** `src/_data/pieces.json` drives everything. Individual piece pages are generated via Eleventy pagination — one page per piece at `/work/{slug}/`. The gallery, filters, and related-pieces logic all derive from this data file.

**Key files:**
- `.eleventy.js` — image shortcodes (`image`, `imagePreload`; widths 400/800/1200/1600px, formats avif/webp/jpeg, output to `src/assets/images/optimised/`), custom filters (`byCategory`, `featured`, `getBySlug`), passthrough for assets
- `src/_includes/base.njk` — global HTML shell, sticky nav, footer
- `src/_includes/piece-card.njk` — gallery card partial
- `src/_includes/category-nav.njk` — category filter nav partial
- `src/_includes/image-lightbox.njk` — lightbox overlay partial
- `src/_includes/scroll-chevron.njk` — scroll indicator partial
- `src/_data/pieces.json` — all portfolio data (see data shape below)
- `src/_data/bowls.json` — bowl subcategory data
- `src/_data/site.json` — global metadata (title, description, url, etc.)
- `src/index.njk` — home/gallery with masonry grid and category filter
- `src/piece.njk` — individual piece template (paginated from pieces.json)
- `src/about.njk` — about page
- `src/commission.njk` — commission inquiry page (obfuscated mailto, not a form)
- `src/404.njk` — custom 404 page
- `src/bowls/` — bowl subcategory pages (`index.njk`, `carved.njk`, `found.njk`, `segmented.njk`)
- `src/furniture.njk`, `src/lighting.njk`, `src/panels.njk`, `src/objects.njk` — category landing pages

**Interactivity (Alpine.js):**
- Category filter: `x-show` on gallery cards, no page reload
- Mobile nav: hamburger toggle
- Lightbox: fullscreen overlay with prev/next on piece pages

## Design System

**Aesthetic:** Wabi-sabi minimalism meets European atelier. Warm, material, intentional — not cold tech minimalism.

**CSS variables (defined in `main.css`, extended in Tailwind config):**
```css
--color-ground:    #F7F3EE   /* page background */
--color-charcoal:  #1E1C1A   /* primary text */
--color-cedar:     #7A4B2A   /* accent */
--color-ash:       #C8C1B8   /* borders, muted text */
--color-blackwood: #2C2520   /* nav background */
--color-paper:     #EDE8DF   /* card backgrounds */
--color-light:     #FFFFFF
```

**Rules:**
- No rounded corners on images — sharp edges, like the work itself
- 1px rules in `--color-ash`
- Generous negative space
- Subtle grain overlay via CSS SVG noise (low opacity)
- Masonry grid: CSS Grid with `grid-row: span N` per piece based on aspect ratio
- Mobile: single column (390px viewport is important baseline)

**Typography:**
- Display headings: Cormorant Garamond Light / Light Italic
- Body: Lora
- UI/nav labels: Jost (geometric sans, light weight)
- Japanese piece titles: Noto Serif JP (kanji fallback)

## Data Shape (`pieces.json`)

```json
{
  "title": "Piece Name",
  "titleJapanese": "Optional kanji",
  "slug": "url-slug",
  "category": "furniture|lighting|wall-panels|bowls|objects",
  "featured": true,
  "status": "commission|available|sold",
  "date": "YYYY-MM-DD",
  "materials": "...",
  "dimensions": "...",
  "wiring": "Optional — for lighting pieces",
  "excerpt": "One-line description",
  "description": "Full prose",
  "primaryImage": "/assets/images/[slug]/featured.webp",
  "images": ["/assets/images/[slug]/detail-1.webp"],
  "tags": ["joinery", "kumiko"]
}
```

`status` values: `commission` (portfolio only, made to order), `available` (this piece can be purchased), `sold` (portfolio only).

## GitHub Pages

- Build: GitHub Actions workflow (`.github/workflows/deploy.yml`) runs `npm run build`, publishes `_site`
- Custom domain: `justwood.design` via `src/CNAME` (passed through by Eleventy)
- Commission page uses an obfuscated `mailto:` link — no form
- GitHub Pages does NOT support server-side redirects; use `<meta http-equiv="refresh">` pages instead

## Git / Deployment

- Remote: `git@github.com:ericdf/justwood.git` (SSH — HTTPS push fails due to pack size)
- Deployed to GitHub Pages; pushes to `main` trigger auto-deploy via Actions

## Current Status

**Implemented and deployed.** The site is live at justwood.design. `SPECIFICATION.md` contains the original design document for reference.

Images are committed directly to `src/assets/images/` (one folder per piece). Optimised avif/webp/jpeg variants are generated at build time by `eleventy-img` into `src/assets/images/optimised/` and also committed so GitHub Actions deploys are fast (no re-optimisation on CI).
