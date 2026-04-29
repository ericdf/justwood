# justwood.design — Site Specification
**As built — updated April 2026**

---

## Overview

justwood.design is a gallery-quality atelier site for Eric Friedman — a Berkeley woodworker specializing in Japanese joinery (kumiko), fine furniture, turned and hand-carved bowls, and lighting. The site is not a shop; it's a curated presentation of work designed to attract serious commission clients. Visitors should trust the maker and know how to begin a conversation.

Replaced the previous Hugo Blox site.

---

## Technology Stack

- **Eleventy (11ty) v3** — static site generator, Nunjucks templates
- **Tailwind CSS** — utility styling via PostCSS
- **Alpine.js v3** (CDN, `defer`) — mobile nav, lightbox interactions
- **Google Fonts** — loaded via `<link>` in `<head>` (not `@import` in CSS)
- **Netlify** — hosting + Netlify Forms for commission inquiries

```bash
npm run dev      # Eleventy dev server + PostCSS watch (concurrently)
npm run build    # Production build → _site/
```

---

## Project Structure

```
justwood/
├── src/
│   ├── _includes/
│   │   ├── base.njk              # HTML shell, sticky nav, footer
│   │   ├── category-nav.njk      # Sticky category nav (anchor links on home, page URLs elsewhere)
│   │   ├── piece-card.njk        # Reusable piece card (related pieces section)
│   │   ├── image-lightbox.njk    # (unused — lightbox is inline on bowl pages)
│   │   └── scroll-chevron.njk    # Animated scroll hint SVG
│   ├── _data/
│   │   ├── pieces.json           # All individual pieces (furniture, lighting, panels, objects)
│   │   ├── bowls.json            # Bowl cards for the home page grid
│   │   └── site.json             # Global metadata (title, description, url, email)
│   ├── assets/
│   │   ├── images/               # All photography (raw, passthrough to _site/)
│   │   └── css/
│   │       └── main.css          # Tailwind input + custom CSS variables + grain overlay
│   ├── bowls/
│   │   ├── index.njk             # /bowls/ — three-section overview with anchor links
│   │   ├── segmented.njk         # /bowls/segmented/
│   │   ├── found.njk             # /bowls/found/
│   │   └── carved.njk            # /bowls/carved/
│   ├── index.njk                 # Home / editorial gallery
│   ├── piece.njk                 # Individual piece template (paginated from pieces.json)
│   ├── about.njk
│   ├── commission.njk
│   ├── furniture.njk
│   ├── lighting.njk
│   ├── objects.njk
│   ├── panels.njk
│   └── 404.njk
├── .eleventy.js
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml
└── package.json
```

---

## Visual Design System

### Color Palette

```css
/* Defined in main.css :root and extended in tailwind.config.js */
--color-ground:    #F7F3EE;   /* page background */
--color-charcoal:  #1E1C1A;   /* primary text */
--color-cedar:     #7A4B2A;   /* accent */
--color-ash:       #C8C1B8;   /* borders, muted text */
--color-blackwood: #2C2520;   /* nav background, dark CTAs */
--color-paper:     #EDE8DF;   /* card backgrounds, portrait piece backgrounds */
```

### Typography

Loaded via Google Fonts `<link>` (not CSS `@import`):

- **Display / titles:** `Cormorant Garamond` Light (300) — piece titles, section headings
- **Body / descriptions:** `Lora` — paragraph text, piece descriptions
- **UI / labels / nav:** `Jost` Light (300) — navigation, labels, buttons, captions
- **Japanese characters:** `Noto Serif JP` — rendered inline where `titleJapanese` exists

Tailwind font family aliases: `font-display`, `font-body`, `font-ui`.

### Decorative Rules

- No rounded corners on images — sharp edges
- `1px` rules in `--color-ash` as section separators
- Grain overlay: `body::before` with CSS SVG noise at `opacity: 0.035`, `z-index: 20`
- Scroll-margin: `h2[id], section[id] { scroll-margin-top: 100px; }` — clears both sticky bars

---

## Global Components

### Navigation (`base.njk`)

Sticky top bar. Background `--color-blackwood`, height ~52px.
- **Left:** "Justwood" wordmark — `font-ui tracking-widest uppercase text-sm`, links to `/`
- **Right (desktop):** Work · About · Commission in `font-ui text-sm uppercase text-ash`
- **Mobile:** Alpine.js hamburger with slide-down menu

### Category Nav (`category-nav.njk`)

Second sticky bar at `top: 52px` (just below the main nav). Background `--color-ground`.
Five categories: Furniture · Lighting · Panels · Bowls · Objects

**Two modes:**
- **Home page** (no `activeCat` in frontmatter): links are `#anchor` links to sections on the same page
- **Category pages** (with `activeCat: furniture` etc.): links go to `/furniture/`, `/lighting/`, etc.; current category shown in `font-medium`

**Safari scroll fix:** When `activeCat` is not set, a small inline script intercepts anchor clicks and calls `target.scrollIntoView({ behavior: 'smooth', block: 'start' })` instead of the native anchor scroll. This works around a Safari bug where `scroll-margin-top` is not applied on the first click from within a sticky element. `scrollIntoView()` is a separate code path that respects scroll-margin correctly.

### Footer (`base.njk`)

Thin `border-t border-ash`. Three items: wordmark + location, nav links, copyright.

---

## Home Page (`index.njk`)

### Hero

Full-width photo of the Cherry and Quilted Maple Credenza (`/assets/images/credenza/featured.jpeg`). Height `75vh`, `object-cover object-[center_50%]`. Dark gradient overlay from bottom. Text overlaid at bottom-left:

```
Made by hand. Built to last.        [Cormorant Garamond Light, 4xl–6xl, --color-ground]
Berkeley, California                [Jost, xs, uppercase, --color-ash]
```

### Category Nav

`{% include "category-nav.njk" %}` — renders as the sticky anchor bar below the hero.

### Editorial Sections

Each section follows this pattern:
```
<section id="{category}">
  <h2>Category Name</h2>        [font-ui 11px uppercase]
  <!-- grid of images -->
  <a>See all X →</a>            [border button, full width]
</section>
```

**Furniture:** 2 pieces (Heirloom Bed, Parquet Table) in `grid-cols-2`, each `col-span-2` (full width). Pulled from `pieces.json` by slug using the `getBySlug` filter.

**Lighting:** 2 pieces (Igeta Lantern, Water Drop Lamp) side by side in `grid-cols-2`. Portrait lamps on `--color-paper` background with `object-contain`.

**Panels:** 2 pieces (Kurotake Panel, Sakura/Kumiko Panel) side by side in `grid-cols-2 items-center`.

**Bowls:** 5 cards from `bowls.json` — 2 segmented (split), 2 found wood (split), 1 carved (full-width span). Each links to the corresponding subcategory page, not to individual pieces. Subcategory sections have their own `id` values so the "See all" cards can anchor directly.

**Objects:** 2 pieces (Tokyo Study/Bracket, Hanukkiah) side by side.

Each section ends with a commission CTA strip (`bg-blackwood py-20`).

---

## Bowl Pages

Bowls are a special case — three subcategories, each with multiple images and its own page.

### `/bowls/` (`src/bowls/index.njk`)

Three sections (Segmented, Found Wood, Carved), each with:
- `font-ui text-[11px] uppercase` section heading
- Desktop image gallery (flex strip or `grid-cols-4`)
- Alpine.js lightbox (inline `x-data`)
- "See all X →" border button

### Subcategory pages (`segmented.njk`, `found.njk`, `carved.njk`)

Each has:
- Breadcrumb: Work · Bowls · [Type]
- `h1` title + intro paragraph
- Desktop gallery (flex strip or 4-column grid, varies by subcategory)
- Mobile single-column stack
- Alpine.js lightbox with keyboard nav (Escape, ←, →)
- Dark CTA section at bottom

Image lists are hardcoded in each file's frontmatter as a Nunjucks `{% set images = [...] %}`.

**No `bowls.json` entries link to individual piece pages** — bowls don't have `/work/` pages.

---

## Individual Piece Pages (`piece.njk`)

Generated by Eleventy pagination from `pieces.json`. URL: `/work/{slug}/`.

### Hero

Two variants based on `piece.orientation`:
- **Portrait** (lamps etc.): `flex items-center justify-center` container with `background-color: #EDE8DF`, image as `object-contain`
- **Standard** (everything else): `overflow-hidden`, image as `object-cover object-center`

Both variants: height `75vh`, animated scroll-hint chevron (fades via IntersectionObserver when hero scrolls out of view).

### Content Area

`max-w-7xl` container. `grid-cols-1 md:grid-cols-3 gap-16`.
- **Left 2/3:** Title (with optional `titleJapanese` in Noto Serif JP), category label, description paragraphs (split on `\n\n`)
- **Right 1/3:** Sidebar with Materials, Dimensions, Wiring (conditional), and a "Commission this piece" border button linking to `/commission/`

### Secondary Images

Full-viewport-width flex strip (desktop, `height: 420px`) + single-column stack (mobile). Alpine.js lightbox with keyboard navigation. The `x-data` attribute uses single quotes to avoid JSON double-quote conflicts in HTML attributes.

### Related Pieces

Filtered by `piece.category` via the `byCategory` Eleventy filter. Max-w-7xl grid with `piece-card.njk`.

---

## Data Files

### `src/_data/pieces.json`

Array of objects. Key fields:

```json
{
  "title": "Piece Name",
  "titleJapanese": "Optional kanji",
  "slug": "url-slug",
  "category": "furniture|lighting|panels|objects",
  "featured": true,
  "orientation": "portrait",
  "homeSection": "lighting",
  "homeLayout": "split|full",
  "showInGrid": true,
  "date": "YYYY-MM-DD",
  "materials": "...",
  "dimensions": "...",
  "wiring": "Optional — lighting pieces only",
  "excerpt": "One-line description",
  "description": "Full prose (paragraphs separated by \\n\\n)",
  "primaryImage": "/assets/images/{slug}/featured.jpg",
  "images": ["/assets/images/{slug}/detail-1.jpg"]
}
```

Bowls are **not** in `pieces.json` — they have no `/work/` pages.

**Notable slugs and titles (as built):**
- `igeta-lantern` — Igeta Lantern (formerly "Igeta Lamp" in spec; slug retained from original site)
- `water-drop-lantern` — Water Drop Lamp (renamed from "Water Drop Lantern")
- `kumiko-panel` — Sakura Wall Panel (renamed from "Kumiko Wall Panel")

### `src/_data/bowls.json`

Cards for the home page bowls section:
```json
{
  "cards": [
    { "id": "...", "subcategory": "segmented|found|carved", "image": "...", "fit": "contain|cover" }
  ]
}
```

### `src/_data/site.json`

```json
{
  "title": "Justwood",
  "description": "...",
  "url": "https://justwood.design",
  "author": "Eric Friedman",
  "email": "eric@justwood.design"
}
```

---

## Eleventy Config (`.eleventy.js`)

Filters:
- `byCategory(pieces, category)` — filter pieces by category string
- `featured(pieces)` — filter to `featured: true`
- `getBySlug(pieces, slug)` — find a single piece by slug (used on home page)

Passthrough: `src/assets/images` → `_site/assets/images` (CSS is excluded; PostCSS handles it separately).

Image shortcode: `@11ty/eleventy-img` generating avif/webp/jpeg at 400/800/1200/1600px widths — available but not yet used in templates (images are served raw).

---

## Tailwind Config

Custom colors match CSS variables. Custom font families: `display`, `body`, `ui`.

Safelist (dynamic classes that Tailwind can't detect at build time):
```js
safelist: ["min-h-[280px]", "h-[50vw]", "h-[56vw]", "h-[35vw]", "object-top", "object-center"]
```

---

## Netlify Config (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "_site"

[[redirects]]
  from = "/work"
  to = "/"
  status = 301

[[headers]]
  for = "/assets/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Commission form uses `netlify` attribute on the `<form>` element. No backend required. Submissions go to `eric@justwood.design`.

---

## Category/Section Pages

`/furniture/`, `/lighting/`, `/panels/`, `/objects/` — each uses a similar pattern:
- Header with `h1` and brief description
- `{% include "category-nav.njk" %}` with `activeCat` set
- Gallery of pieces in that category

---

## About Page

Two-column layout (prose + photo). Photo: `eric-in-shop.jpg` — cropped workshop portrait showing Eric with lumber rack background. Three "Traditions" cards below: Japanese Joinery, Fine Furniture, Urban Salvage. Commission CTA button.

---

## Commission Page

Five numbered steps (01–05) for the commission process. Netlify form: Name, Email, Message (textarea). Direct email fallback using `site.email`. Submit button goes from `bg-charcoal` to `bg-cedar` on hover.

---

## Content Still Needed from Eric

1. Piece dimensions — most are missing
2. Which pieces (if any) are "available as built" rather than commission-only
3. More workshop/process photos for the About page
4. Any additional bowl photography
