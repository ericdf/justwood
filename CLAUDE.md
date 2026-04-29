# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Portfolio/gallery site for Eric Friedman, a Berkeley woodworker specializing in Japanese joinery (kumiko), furniture, turned bowls, and lighting. Goal: curated atelier aesthetic to attract serious commission clients. Not a shop.

Replacing the current Hugo Blox site at justwood.design.

## Technology Stack

- **Eleventy (11ty)** — static site generator, Nunjucks templates
- **Tailwind CSS** — via PostCSS
- **Alpine.js** — CDN (no build step); used for category filter, mobile nav, lightbox
- **Google Fonts** — Cormorant Garamond, Lora, Jost, Noto Serif JP
- **Netlify** — hosting + form handling for commission inquiries

## Commands

Once `package.json` is initialized:

```bash
npm run dev      # Eleventy dev server with hot reload
npm run build    # Production build → _site/
```

Tailwind is processed via PostCSS as part of the Eleventy build.

## Architecture

**Data-driven pages:** `src/_data/pieces.json` drives everything. Individual piece pages are generated via Eleventy pagination — one page per piece at `/work/{slug}/`. The gallery, filters, and related-pieces logic all derive from this data file.

**Key files:**
- `.eleventy.js` — image optimization (`@11ty/eleventy-img`: widths 400/800/1200/1600px, formats avif/webp/jpeg), custom filters (`byCategory`, `featured`), passthrough for assets
- `src/_includes/base.njk` — global HTML shell, sticky nav, footer
- `src/_data/pieces.json` — all portfolio data (see data shape below)
- `src/_data/site.json` — global metadata (title, description, url, etc.)
- `src/index.njk` — home/gallery with masonry grid and category filter
- `src/piece.njk` — individual piece template (paginated from pieces.json)

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

## Netlify

- Build command: `npm run build`, publish dir: `_site`
- Commission form uses Netlify Forms — no backend required, just `netlify` attribute on the `<form>` element
- Redirect: `/work` → `/` (301)
- Cache headers: 1 year immutable for `/assets/images/*`

## Current Status

**Specification phase.** `SPECIFICATION.md` is the authoritative design document — read it before implementing anything. No implementation files exist yet.

Implementation order: `package.json` → config files → directory structure → Nunjucks templates → `pieces.json` data → CSS → test locally → deploy.
