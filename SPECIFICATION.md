# justwood.design — Full Rebuild Specification
**For use with Claude Code on your Mac**

---

## Overview

Rebuild justwood.design as a gallery-quality atelier site for Eric Friedman — a Berkeley woodworker specializing in Japanese joinery (including kumiko), western joinery, fine furniture, turned and hand-carved bowls, and lighting. The site is not a shop; it's a curated presentation of completed and available work, designed to attract serious commission clients. Visitors should be awed by the work, trust the maker, and know exactly how to begin a conversation.

Current site is Hugo Blox. Replace it entirely.

---

## Technology Stack

**Same stack as walkwitheric.com rebuild** for consistency and maintainability:

- **Eleventy (11ty)** — static site generator
- **Tailwind CSS** — utility styling via PostCSS
- **Alpine.js** (CDN) — mobile nav, lightbox, filter interactions
- **Google Fonts** — typography (see below)
- **Netlify** — deployment

Both sites can share a Node/npm workflow, making maintenance easier over time.

---

## Project Structure

```
justwood/
├── src/
│   ├── _includes/
│   │   ├── base.njk            # HTML shell, head, nav, footer
│   │   ├── piece-card.njk      # Reusable piece card (gallery grid)
│   │   ├── piece-hero.njk      # Full-width piece hero (featured items)
│   │   ├── image-lightbox.njk  # Lightbox overlay component
│   ├── _data/
│   │   ├── pieces.json         # All work: title, category, images, description, status
│   │   ├── site.json           # Global metadata
│   ├── assets/
│   │   ├── images/             # All piece photography (downloaded from current site)
│   │   ├── css/
│   │   │   └── main.css        # Tailwind input + custom CSS
│   ├── index.njk               # Home / gallery page
│   ├── piece.njk               # Individual piece template (generated from pieces.json)
│   ├── about.njk               # About Eric + studio
│   ├── commission.njk          # Commission process page
│   └── 404.njk                 # Custom 404
├── .eleventy.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Visual Design System

### Aesthetic Direction

**Wabi-sabi minimalism meets European atelier.** Not the cold white-cube minimalism of tech — warm, material, considered. The palette and typography should feel like the inside of a beautifully maintained workshop: natural surfaces, precise craft, nothing wasted. The photography does the heavy lifting; the design's job is to get out of its way while conveying unmistakable intentionality.

Reference points (aesthetic only, not to copy): Nakashima Woodworkers, Japandi interior design, artisan furniture ateliers. 

**One thing visitors must remember:** This is made by someone who knows what they're doing at a level most people never encounter.

### Color Palette

```css
--color-ground:    #F7F3EE;   /* warm off-white, like unfinished maple */
--color-charcoal:  #1E1C1A;   /* near-black, warm tone, primary text */
--color-cedar:     #7A4B2A;   /* warm medium brown, accent */
--color-ash:       #C8C1B8;   /* warm mid-grey, borders, muted text */
--color-blackwood: #2C2520;   /* deep warm dark, nav background */
--color-paper:     #EDE8DF;   /* slightly darker than ground, card backgrounds */
--color-light:     #FFFFFF;   /* pure white, used sparingly */
```

Do not use cool greys, blue-greys, or any color that reads as digital/tech. Everything should feel like it was made from natural material.

### Typography

Load from Google Fonts:

- **Display / Piece titles:** `Cormorant Garamond` — a high-contrast classical serif with extraordinary elegance at large sizes; use Light or Light Italic for piece names, Regular for headings
- **Body / Descriptions:** `Lora` — warm, book-quality serif; reads beautifully at paragraph length
- **UI / Labels / Nav / Categories:** `Jost` — geometric sans, light weight, feels precise without being cold
- **Japanese characters:** Ensure `Noto Serif JP` is loaded as a fallback for kanji in piece titles (e.g., 井桁, 間, 黒竹, 斗栱)

```css
font-display:   'Cormorant Garamond', serif;    /* clamp(2.5rem, 5vw, 5rem) */
font-h2:        'Cormorant Garamond', serif;    /* clamp(1.75rem, 3vw, 2.75rem) */
font-body:      'Lora', serif;                  /* 1.0625rem, line-height 1.75 */
font-ui:        'Jost', sans-serif;             /* 0.8125rem, letter-spacing 0.08em */
font-caption:   'Jost', sans-serif;             /* 0.75rem, uppercase, tracking wide */
```

### Grid System

**Masonry-inspired variable grid**, not a uniform card grid. Pieces vary in aspect ratio and visual weight; the layout should honor that. 

Use CSS Grid with `grid-auto-rows` and `grid-row: span N` assigned per piece based on its primary image's aspect ratio. This creates a flowing, editorial layout where tall pieces (lamp, andon) span more rows than wide pieces (table, bench).

On mobile: single column, full width.

### Decorative Language

- Very thin rules (`1px`, `--color-ash`) used sparingly as separators
- Generous negative space — padding is a design element
- Image captions in `Jost` uppercase, `--color-ash`, small tracking
- No rounded corners on images — sharp edges, like the work itself
- Subtle grain overlay on the `--color-ground` background (CSS noise SVG, very low opacity)
- Japanese characters in piece titles rendered in `Noto Serif JP`, slightly smaller than the Latin text

---

## Site Architecture — Pages

### 1. Global: Navigation

Sticky top nav. Background `--color-blackwood`. 

**Left:** Wordmark — "just wood" in Cormorant Garamond Light, letter-spaced, white. Linked to home. (Lowercase is intentional — matches the maker's ethos of understatement.)

**Right:** Nav links in Jost uppercase, small, letter-spaced, white:
- Work  
- About  
- Commission  
- Contact (mailto: link, opens email)

Mobile: hamburger (Alpine.js), slide-down menu, full-width links.

Active state: thin `--color-cedar` underline.

---

### 2. Global: Footer

Background `--color-charcoal`, text `--color-ash`.

Three-column layout (collapses to single on mobile):

**Left:** 
```
just wood
Handcrafted objects in wood
Berkeley, California
```

**Center:**
```
Work      Commission
About     Contact
```

**Right:**
```
Instagram  →
Email  →
```

Bottom: `© 2026 Eric Friedman · justwood.design`  
Drop the "Published with Hugo Blox Builder" — that's gone.

---

### 3. Home Page — Gallery (`index.njk`)

#### Hero Statement

Full-width banner, NOT a photo hero. Instead: dark background (`--color-blackwood`), centered text block:

```
[Cormorant Garamond Light Italic, large, white]
  Objects made to last.

[Jost, small-caps, --color-ash, spaced out below]
  JAPANESE & WESTERN JOINERY · BOWLS · FURNITURE · LIGHTING
  BERKELEY, CALIFORNIA · COMMISSION ENQUIRIES WELCOME
```

This is short, confident, and immediately positions the site as atelier rather than maker fair. No hero image — the gallery below speaks.

Alternatively (Eric's call): A single full-width photograph of the Cherry and Quilted Maple Credenza — Eric confirms this is the piece visitors are most drawn to. Crop/zoom so the quilted maple panels fill the frame and the floating top is visible but the piece extends slightly beyond the edges, letting the wood figure do the work. Do not show the whole piece — partial visibility at this scale is more seductive than a catalog shot.

#### Category Filter Bar

Sticky below the hero when scrolling. `--color-paper` background, full width. Jost uppercase labels, left-aligned with container:

```
All · Furniture · Lighting · Wall Panels · Bowls · Objects
```

Active filter: `--color-cedar` underline + text.

Alpine.js handles filtering: clicking a category shows/hides cards using `x-show` on each card based on its `data-category` attribute. No page reload.

**Note on "Objects":** This replaces "Objets d'art" — confident and unpretentious, fits the site's voice without being precious. Keep the category count to 5–6 max to avoid filter UI clutter.

#### Gallery Grid

Variable-height masonry grid (see Grid System above). 

Each piece is a **Piece Card** (see component spec below). 

**Featured pieces** — the most visually striking 3–4 — are displayed at larger scale. Suggested featured pieces: Tansu, Igeta Lamp, Ma Triptych, Origami Tables, Found Wood Bowls. Eric should confirm.

Pieces are sorted with featured first, then reverse-chronological (newest to oldest).

#### Commission CTA Strip

Between gallery and footer: narrow full-width band, `--color-paper` background:

```
[Cormorant Garamond italic, centered]
  Every piece is made on commission.

[Jost body, centered, --color-ash]
  No inventory is maintained. If you see something you'd like to discuss — 
  a piece as shown, a variation, or something new — reach out.

[Button: cedar fill, white text, Jost]
  Begin a Conversation →
```

Button links to `/commission`.

---

### 4. Piece Card Component (`piece-card.njk`)

Two sizes: **Standard** and **Featured** (Featured = 2× grid column width + more rows).

**Both sizes contain:**

- Primary image, full bleed, no border, sharp corners
- On hover: very subtle darkening overlay (CSS transition, `background: rgba(0,0,0,0.15)`) + a small "View →" label appears centered in Jost uppercase white
- **No text visible by default on the card** — this is a gallery, not a catalog. The image speaks first.
- Click → goes to the piece's individual page

**Below the image (outside the overlay):**
- Piece title in Cormorant Garamond, `--color-charcoal`
- One-line material/technique note in Jost small, `--color-ash` (e.g., "Cherry · kumiko · mulberry paper")
- If `status: "available"` in the data: a small cedar-colored dot + "Available" label in Jost uppercase tiny
- If `status: "commission"`: nothing (default — most pieces are examples of what can be commissioned)

---

### 5. Individual Piece Page (`piece.njk`)

This page does much more work than the current site. It's where serious buyers spend time.

**Layout:**

#### Hero Image
Full-width, tall (80vh max), `object-fit: cover`, centered. No caption here.

#### Piece Header (below image, max-width container, centered)

```
[Jost uppercase small, --color-ash]  LIGHTING  ←  (category, linked back to filtered gallery)

[Cormorant Garamond Light, display size]  
  Igeta (井桁) Lamp

[Lora italic, --color-ash]
  Cherry with Port Orford cedar kumiko panels and ginwashi mizutama paper
```

#### Description

Full description text in Lora body, max-width 680px, centered. Generous line height. This is where the beautiful existing prose lives — the Igeta write-up, the Tansu write-up, etc.

Eric's existing descriptions are excellent. Use them verbatim.

#### Image Gallery

Below the description: a row of secondary images, each clickable. Use Alpine.js for a simple full-screen lightbox overlay (no external library needed — just an `x-show` fullscreen div with the selected image).

Images displayed as thumbnails in a row, `aspect-ratio: 4/3`, `object-fit: cover`. On click, the selected image fills the screen with a close button (×) and previous/next arrows.

#### Piece Details

Small details table below gallery, Jost typography, thin rule separators:

```
Materials     Cherry; Port Orford cedar; ginwashi mizutama paper
Dimensions    8¼" square base · [height]
Wiring        Battery or conventional (specify on order)
Status        Available to commission · variations welcome
```

Eric fills these in for each piece. Dimensions and status are most important for buyers.

#### Commission Callout

At the bottom of every piece page, a soft cedar-toned box:

```
[Cormorant italic]  Interested in this piece?

[Lora body]  This piece is available as shown, or I can build a variation 
             in different species, dimensions, or configuration.
             
[Button: cedar]  Enquire →   (mailto: with subject pre-filled: "Enquiry re: Igeta Lamp")
```

Pre-fill the email subject line dynamically using the piece title from the template data.

#### Related Pieces

3-piece row at the bottom: "You might also like" — pull 3 other pieces from the same category. Simple horizontal row of cards.

---

### 6. About Page (`about.njk`)

This page currently has one paragraph and a small avatar. It needs to become a proper maker's statement.

**Sections:**

#### Portrait + Name Header

Large photo of Eric — ideally at the bench, or a portrait in the workshop. Not a headshot; context matters. Cormorant display title: "Eric Fischer" below.

#### The Work

2–3 paragraphs on:
- The aesthetic traditions he works in (Japanese joinery — including but not limited to kumiko — western joinery, and his own synthesis of the two; precision, restraint, beauty through structure)
- The kumiko tradition specifically — what it demands, why he's drawn to it
- The approach to wood itself — salvage urban trees, working with figured grain, non-toxic finishes

Placeholder copy provided; Eric to refine.

#### The Maker

1–2 paragraphs on:
- How he came to this (former Apple career, turning to making)
- The Berkeley studio
- The rhythm of the work — this isn't production, it's practice

#### The Philosophy

Pull quote in Cormorant Large Italic, centered, with cedar vertical rule:

```
"My designs awaken an interest in form — how is this made? — 
while excelling at function."
```

This is already on the site. It's good. Give it the presentation it deserves.

#### Tools + Traditions

Optional section (Eric's call): a few sentences on the toolkit and traditions. Japanese joinery (shoji, kumiko, and others), western joinery, segmented turning, found-wood and hand-carved bowls — each could get a sentence. This helps clients understand the range.

#### CTA

```
[Cormorant italic]  Every piece begins with a conversation.
[Button]  Commission Enquiry →  (links to /commission)
```

---

### 7. Commission Page (`commission.njk`)

This page doesn't exist on the current site. It's essential.

**Purpose:** Remove friction for serious buyers who don't know how to start. Answer the questions they're afraid to ask.

**Sections:**

#### Header

```
[Cormorant display]  Commission a Piece

[Lora body, --color-ash, max-width 600px centered]
  I don't maintain inventory. Every piece in this portfolio is either a 
  completed commission or available to recreate. Here's how we work together.
```

#### How It Works (numbered, not bulleted — more considered)

```
1. Begin with a note
   Tell me what you're drawn to — a specific piece, a general category, 
   a problem you're trying to solve in a room. There are no wrong starting points.

2. A conversation
   We'll talk (email, phone, or video) about the piece, your space, your 
   preferences in wood species and finish. I'll ask questions. You'll ask questions.

3. A proposal
   For significant commissions I'll prepare a written proposal with dimensions, 
   materials, and timing. For smaller pieces, we can often agree over email.

4. The making
   I'll keep you informed at key stages. Most clients enjoy seeing work in progress.

5. Delivery
   Most pieces are delivered or arranged for pickup in the Bay Area. 
   Shipping can be arranged for suitable pieces.
```

#### What to Expect

- **Timing:** Custom furniture typically takes [X–Y months]. Lighting and smaller objects [X–Y weeks]. Eric fills in.
- **Investment:** A single honest line — "My work is priced to reflect the materials, time, and craft involved. I'm happy to discuss budget early so we don't waste each other's time."
- **Pieces as shown:** Some portfolio pieces are available as built, not just as commission templates.

#### Contact Form (simple, no backend needed)

Use a Netlify Form (static, no server required):

```html
<form name="commission" method="POST" data-netlify="true">
  Name *
  Email *
  What are you interested in? (dropdown: Furniture / Lighting / Wall Panels / Bowls / Something new)
  Tell me more (textarea)
  [Submit: "Send Enquiry"]
</form>
```

Netlify handles form submissions and emails them to eric@justwood.design. Free tier supports this. No backend code required.

Also include the direct email as a fallback: *"Or write directly to eric AT justwood.design"*

---

## Data File: `src/_data/pieces.json`

Each piece needs these fields. Claude Code should populate from the current site content; Eric confirms and adds missing details.

```json
[
  {
    "title": "Igeta (井桁) Lamp",
    "titleJapanese": "井桁",
    "slug": "igeta-lamp",
    "category": "lighting",
    "featured": true,
    "status": "commission",
    "date": "2025-12-19",
    "materials": "Cherry; Port Orford cedar kumiko; ginwashi mizutama paper",
    "dimensions": "8.25\" square base",
    "wiring": "Battery or conventional",
    "excerpt": "Cherry lamp with Port Orford cedar kumiko panels and water drop paper",
    "description": "Full description text here...",
    "primaryImage": "/assets/images/igeta-lamp/featured.webp",
    "images": [
      "/assets/images/igeta-lamp/igeta-1.png",
      "/assets/images/igeta-lamp/igeta-2.png"
    ],
    "tags": ["lighting", "kumiko", "japanese"]
  },
  {
    "title": "Cherry and Birdseye Maple Tansu",
    "slug": "tansu",
    "category": "furniture",
    "featured": true,
    "status": "commission",
    "date": "2023-01-01",
    "materials": "Cherry; birdseye maple",
    "dimensions": "[Eric to add]",
    "excerpt": "Three-tier tansu with modular cases, proud through-tenon joinery, and half-blind dovetailed drawers",
    "description": "Full description...",
    "primaryImage": "/assets/images/tansu/featured.webp",
    "images": [],
    "tags": ["furniture", "japanese", "storage"]
  }
  // ... all 22 pieces
]
```

**Status values:**
- `"commission"` — example of what can be built; no specific piece available
- `"available"` — this specific piece can be purchased/delivered
- `"sold"` — completed and placed; shown for portfolio only (optionally hidden or watermarked)

**Featured:** `true` for 4–6 pieces to be displayed at larger scale on the grid.

---

## Image Handling

Current images are served from Hugo's CDN processing. To migrate:

```bash
# Download all featured images from the current site
# Example for each piece — Claude Code should script this:
curl -O https://justwood.design/project/igeta-lantern/featured.jpeg
```

Claude Code should write a small Node script to:
1. Read `pieces.json`
2. Download each image URL from the current live site
3. Save to `src/assets/images/[slug]/`

Images should be kept at original resolution. Eleventy's image plugin (`@11ty/eleventy-img`) can handle resizing/optimization at build time — install and configure this.

---

## Eleventy Configuration (`.eleventy.js`)

```js
const Image = require("@11ty/eleventy-img");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  
  // Image shortcode for optimized images
  eleventyConfig.addShortcode("image", async function(src, alt, sizes) {
    let metadata = await Image(src, {
      widths: [400, 800, 1200, 1600],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./_site/img/",
      urlPath: "/img/"
    });
    return Image.generateHTML(metadata, { alt, sizes, loading: "lazy", decoding: "async" });
  });

  // Filter: get pieces by category
  eleventyConfig.addFilter("byCategory", function(pieces, category) {
    if (!category || category === "all") return pieces;
    return pieces.filter(p => p.category === category);
  });

  // Filter: get featured pieces
  eleventyConfig.addFilter("featured", function(pieces) {
    return pieces.filter(p => p.featured);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk"
  };
};
```

---

## Generating Individual Piece Pages

Use Eleventy's pagination feature to generate one page per piece from `pieces.json`:

In `src/piece.njk` front matter:
```yaml
---
pagination:
  data: pieces
  size: 1
  alias: piece
permalink: "/work/{{ piece.slug }}/"
---
```

This generates `/work/igeta-lamp/`, `/work/tansu/`, etc. automatically from the JSON data.

---

## SEO & Meta

Each piece page gets:
- `<title>` — "[Piece Title] | Just Wood"
- `<meta name="description">` — piece excerpt
- `og:image` — piece primary image (absolute URL)
- `og:type` — "article" for pieces

Home page:
- `<title>` — "Just Wood · Handcrafted Objects in Wood · Berkeley"
- Description — "Custom woodwork in Japanese and western joinery traditions: kumiko, furniture, lighting, turned and hand-carved bowls. Commission enquiries welcome."

---

## Netlify Form Configuration

Add to `netlify.toml`:
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

Netlify Forms requires no configuration beyond the `data-netlify="true"` attribute on the HTML form. Eric will receive email notifications at eric@justwood.design for each submission.

---

## Content Placeholders Eric Must Fill In

Mark with `<!-- ERIC: -->` HTML comments throughout:

1. **All piece dimensions** — most are missing from current site
2. **Piece status** — which pieces are "available as built" vs commission-only
3. **Which 4–6 pieces to feature** (larger in the grid)
4. **About page bio copy** — especially workshop/background narrative
5. **Commission page timing estimates** — how long furniture vs lighting typically takes
6. **Workshop/process photos** — for the About page; current site has none
7. **Hero choice** — text-only hero vs. single-piece hero photo

---

## Differences from walkwitheric.com Rebuild

| | walkwitheric.com | justwood.design |
|---|---|---|
| Primary goal | Tour attendance + book sales | Commission enquiries |
| Voice | Warm, inviting, conversational | Precise, considered, quiet confidence |
| Content density | High (5 tours + book) | Low text, high image |
| CTA | External links (City Guides) | Contact form + mailto |
| Key new page | Book page | Commission page |
| Grid | Equal cards | Variable-height masonry |

---

## Out of Scope

- Shopping cart or payment processing — all sales via conversation
- Inventory tracking — not applicable
- Blog or news feed — not needed
- Client login or gallery — not needed
- Price list — intentionally omitted (Eric's preference to discuss)

---

## Notes for Claude Code

- The site's purpose is not to sell — it's to make someone want to have a conversation. Every design decision should serve that.
- Download existing images from justwood.design before starting — write a fetch script first.
- The Noto Serif JP font must be loaded for kanji to render correctly in piece titles. Test this specifically.
- Build the Commission page and its Netlify form before launching — it's the most important new element.
- Test hover states carefully: the gallery hover interaction is where the site feels alive or dead.
- Eric's existing piece descriptions are very well-written — use them verbatim, do not rewrite.
- Mobile at 390px is important — much gallery browsing happens on phones.
