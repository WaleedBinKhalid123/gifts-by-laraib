# Gifts by Laraib

Brand site for a customized gift-basket business. Next.js 16 (App Router) · TypeScript · Tailwind CSS.

No animation library, no smooth-scroll library — all motion is CSS plus ~120 lines
of vanilla JS. The homepage ships about **23 KB of gzipped JavaScript**.

Ordering runs entirely through Instagram DMs — no checkout, no server, no database. Every "order" button composes a structured summary on the visitor's own device, copies it to their clipboard and opens the shop's Instagram messages.

---

## Getting started

```bash
npm install
npm run images          # ← once. Downloads all photography locally (see below)
npm run sync            # ← after any edit to the Google Sheets in Drive
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 20.9+ (pinned in `engines`).

### Please read this before judging the speed

`npm run dev` is **not** representative. Next.js compiles each route on first
visit in dev, so pages take seconds to appear the first time and animations
stutter while it works. Always sanity-check performance with:

```bash
npm run build && npm start
```

Every page is statically prerendered, so the production server is serving flat
HTML.

### If the page looks broken after taking a new build

Stale bundles are the usual cause of "it only works after a hard refresh": the
browser holds old JavaScript while the server serves new HTML. When you replace
the source, do a clean rebuild rather than restarting on top of the old one:

```bash
rm -rf .next
npm run build && npm start
```

Then hard-reload once (Cmd/Ctrl + Shift + R). After that the site should be
correct on a normal refresh.

### If you see empty boxes where photos should be

The photography is loaded from the Unsplash CDN. If your network is slow, or
blocks `images.unsplash.com`, or Next's image optimizer times out fetching from
it, you get soft blush rectangles with nothing in them — and the page feels slow
while it keeps trying. The fix takes one minute:

```bash
npm run images
```

That downloads every photo the site references into `public/images/`. Then open
`lib/utils.ts` and set:

```ts
const USE_LOCAL_IMAGES = true;
```

Restart the dev server. Everything now comes off local disk — no third-party
round trip, no re-encoding a 1600px source on every cold request, and it works
offline. This is also what you want in production once Laraib's own photos
replace the stock ones.

---

## First things to change

Everything business-specific lives in **`lib/site.ts`**. Change it there and it updates across the whole site — nav, footer, metadata, structured data and every Instagram link.

```ts
instagram: {
  number: '923001234567',      // ← REPLACE. International format, digits only, no + or spaces
  display: '+92 300 123 4567', // ← REPLACE. How it reads on screen
},
email: 'hello@giftsbylaraib.com',   // ← REPLACE
instagram: { handle: '@giftsbylaraib', url: '...' },  // ← REPLACE
facebook: '...',                     // ← REPLACE
```

Set the live domain via an environment variable (used for canonical URLs, Open
Graph, sitemap). Set it to a real value or omit the key — see **Deploying** for
why a blank value used to break the build.

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://giftsbylaraib.com
```

---

## Content model

Baskets, variants and materials are edited as **spreadsheets in `/content`**, not
in code. Full instructions for whoever maintains them: **[content/HOW-TO.md](content/HOW-TO.md)**.

```bash
npm run sync             # Google Sheets in Drive → lib/content/*.data.ts
npm run sync -- --dry    # fetch and validate, write nothing
npm run sync -- --offline  # rebuild from the last download, no internet
```

The three sheets in Drive are the source of truth. `sync` fetches them over the
CSV export endpoint (no API key — each sheet just needs "Anyone with the link →
Viewer"), validates every row against the category/occasion/recipient unions, and
regenerates the data files. It also drops a snapshot of each sheet into
`content/*.csv` so a git diff shows what changed; those snapshots are outputs, not
inputs. Sheet links live in `content/sheets.json`.

| File | Holds |
| --- | --- |
| `content/products.csv` | One row per basket |
| `content/variants.csv` | One row per size, linked by `productSlug` |
| `content/items.csv` | Materials offered in the Customize configurator |

The import validates every row — unknown category, misspelled occasion, duplicate
slug, orphaned variant, non-numeric price — and refuses to write anything until
they're fixed, reporting each with a line number. The generated
`lib/content/*.data.ts` files are plain JSON behind one `export const`, so they
diff cleanly and the exporter can read them straight back.

### The three concepts

- **Category** — what kind of basket it is. Exactly one per basket. Drives the
  `/shop` filter pills.
- **Occasion** — when you'd send it. Many per basket. Each has its own landing
  page, sitemap entry and metadata.
- **Variant** — a buyable size of one basket, with its own absolute price,
  optional contents override and its own in-stock flag.

Variants are deliberately **one axis** (size), not a size × colour grid. A grid
means pricing, photographing and stock-checking every combination; for
hand-made work that cost is not repaid. Anything else the customer wants travels
in the Instagram note.

A basket with no rows in `variants.csv` is simply single-price — no chooser, a
plain `Offer` in its structured data instead of an `AggregateOffer`. Both paths
are exercised by the shipped sample data.

### Still hand-written

Categories, occasions and recipients live in `lib/content/products.ts`,
`lib/content/occasions.ts` and `lib/types.ts`. Adding one means a new page,
navigation entry and SEO surface, so it stays a considered code change rather
than a spreadsheet row. HOW-TO.md walks through it.

### Moving to a CMS later

Each content file exports plain arrays plus small accessors (`getProduct`,
`priceFrom`, `includesFor`, `productsByOccasion`, `relatedProducts`). Replace the
array with a fetch, keep the accessor signatures, and no component changes.

---

## Images

Product and editorial photography is loaded from Unsplash through `next/image`, via the `photo()` helper in `lib/utils.ts`:

```ts
photo('photo-1557492993-01989e8ed6d7', 1200)
// → https://images.unsplash.com/photo-...?auto=format&fit=crop&q=80&w=1200
```

`npm run images` downloads all of them into `public/images/`; flipping
`USE_LOCAL_IMAGES` to `true` in the same file switches the whole site over.

**When real photography is ready**, drop the files into `public/images/` named
after the ids used in `lib/content/*.ts` and keep `USE_LOCAL_IMAGES` on. Every
image updates at once. Remote hosts are allowlisted in `next.config.mjs` under
`images.remotePatterns`.

A note on `photo(id, width)`: the second argument is the width requested *from
the source*, not the rendered size. Keep it close to the largest size the slot is
ever shown at — asking for a 1600px file to fill a 280px card is the quickest way
to make a page like this feel heavy.

The brand mark in `public/logo.png` is the supplied badge, cropped and squared. Favicons, the touch icon and the Open Graph image were generated from it.

---

## Ordering

`lib/order.ts` is the only place that builds order messages:

- `productOrderText()` — a basket from a product page (size, quantity, card message, recipient, delivery city, date, notes, total)
- `customBasketText()` — a basket from the configurator (size, theme, every item, wrapping, message)
- `enquiryText()` — the contact form
- `generalEnquiryText()` — plain "hello"

Each returns plain readable text. `copyThenOpenDM()` puts it on the clipboard and opens `ig.me/m/<handle>`; `components/ui/OrderButton.tsx` wraps that and reports whether the clipboard write actually succeeded. Instagram cannot pre-fill a message the way `wa.me` links could, so copy-then-paste is the honest version of this flow. Nothing is stored or transmitted anywhere else.

**Adding a real cart and checkout later:** the panels already collect everything a cart line item needs. Swap `OrderButton` for an `addToCart(product, options)` call and keep the Instagram path as a secondary route — the data shapes do not change.

---

## Motion

**There is no animation library and no smooth-scroll library.** Both were removed
after they caused three separate classes of bug. Everything is CSS plus about 120
lines of vanilla JavaScript.

### The visibility contract

Content is **visible by default**. Reveal elements only start hidden once
`html.js` is on the root element, and that class is added by a small inline script
in `<head>` (`lib/reveal-engine.ts`) which runs synchronously before first paint
and then drives the reveals itself.

This inversion is the important part. Previously, elements began at `opacity: 0`
and waited for React to hydrate and an `IntersectionObserver` to fire. If the
bundle was slow, throttled, or hydration errored, the animation never started and
the page had permanent holes in it — which looked exactly like "lots of white
space", and went away on a hard refresh. Now, if that script is blocked, errors,
or the visitor prefers reduced motion, **nothing is ever hidden and the page
simply renders**.

The engine re-queries the DOM on each sweep rather than caching a node list, so
anything React mounts later — a filtered grid, a new route — is picked up with no
registration step.

### Scrolling

Native. `overflow-x: clip` on the body, `scroll-behavior: smooth` for anchors,
and nothing intercepting the wheel. Lenis was removed because it calls
`preventDefault` on wheel events document-wide, which broke every nested scroll
container on the site and could leave the page unresponsive.

### Scroll-linked effects

One shared, rAF-throttled scroll listener (`lib/scroll.ts`) that every subscriber
reads from — the navbar condense, the floating Instagram button, and all parallax.
Parallax writes straight to `style.transform` (`lib/useParallax.ts`), so there is
no React re-render per frame.

### Rules that keep it smooth

- Transforms and opacity only. Nothing scroll-linked touches layout.
- Background washes are radial gradients, never `filter: blur()`. A 100px blur
  radius on a 700px element forces the compositor to re-rasterise a huge surface
  every frame.
- Nothing is gated behind an entrance delay longer than ~420ms. Long, staggered
  intros are indistinguishable from a page that failed to load.
- Collapsibles animate `grid-template-rows: 0fr → 1fr` — no height measuring.
- Crossfades keep every frame mounted (`.xfade`), so switching is instant and
  there is no unmount flash.

### Carousels

The horizontal rails share `lib/useRail.ts`:

- **No wheel hijacking.** An earlier version translated vertical wheel into
  horizontal movement, so scrolling down with the cursor over a carousel moved
  the carousel instead of the page — indistinguishable from "the page won't
  scroll". A vertical gesture always scrolls the page. Sideways movement comes
  from touch swipe, native horizontal trackpad gestures, click-and-drag, and the
  arrows.
- **ResizeObserver, not just `scroll`.** Measuring only on scroll meant the
  "next" arrow could be born disabled and stay that way once images changed the
  layout.
- Arrows hide entirely when there is nothing to scroll.

### Overlays

`lib/useOverlay.ts` handles the mobile menu and search: reference-counted scroll
locking, Escape to close, a focus trap, and a CSS exit animation that completes
before unmount.

Two bugs worth knowing about, both fixed here, both of which presented as "the
page randomly stops scrolling":

1. The effect listed `dismiss` as a dependency. `dismiss()` flips `exiting`,
   which recreated `dismiss`, which re-ran the effect — and its cleanup cancelled
   the very timeout that was about to unmount the overlay. The panel stayed
   mounted and the scroll lock was never released. Everything mutable is in refs
   now and the effect has an empty dependency array.
2. Saving and restoring `body.style.overflow` per overlay meant a second overlay
   could save `"hidden"` as the previous value and restore it. Locking is
   reference-counted, with `releaseAllScrollLocks()` called on every route change
   as a safety valve.

## Accessibility

Skip link, focus-visible rings on the brand colour, labelled form fields with error messaging, a focus-trapped mobile menu with Escape-to-close, `aria-pressed` on all toggle chips, `aria-current` on the active nav item and gallery thumbnails, live regions for quantity and toasts, semantic landmarks and a single `h1` per page. FAQs use native `<details>` so they work without JavaScript.

---

## SEO

- Per-page `metadata` with canonical URLs, Open Graph and Twitter cards
- `LocalBusiness` schema site-wide, `Product` schema on basket pages, `ItemList` on the homepage, `FAQPage` on `/faqs`
- `app/sitemap.ts` and `app/robots.ts` generate `/sitemap.xml` and `/robots.txt` from the content files
- `app/manifest.ts` generates the web manifest
- Descriptive alt text on every content image

---

## Structure

```
app/
  layout.tsx           shell, metadata, structured data
  page.tsx             homepage
  shop/                listing + [slug] product pages
  occasions/           index + [slug]
  customize/           the basket configurator
  about/ contact/ faqs/ shipping/ privacy/
  sitemap.ts robots.ts manifest.ts not-found.tsx
components/
  layout/    Navbar, MobileMenu, SearchOverlay, Footer, PageHeader, Logo,
             SmoothScroll, PageTransition, InstagramFab
  home/      Hero, TrustBar, OccasionRail, FeaturedBaskets, CustomizeTeaser,
             HowItWorks, BrandStory, TestimonialCarousel, InstagramGallery, FinalCTA
  shop/      ProductCard, ProductGrid
  product/   ProductGallery, ProductOrderPanel
  builder/   BasketBuilder, BasketPreview
  contact/   EnquiryForm
  ui/        Button, SectionHeading, Reveal, Ornament, HandwrittenCard, Toast
lib/
  site.ts types.ts utils.ts motion.ts useReveal.ts order.ts
  content/ products occasions builder testimonials gallery faqs
```

---

## Design tokens

Defined once in `tailwind.config.ts`:

- **Colour** — `cream` (paper), `blush` (soft field), `rose` (brand pink), `wine` (deep burgundy, from the logo wordmark), `gold` (champagne accents), `ink` (text)
- **Type** — `font-display` Cormorant Garamond, `font-sans` Jost, `font-script` Parisienne (accents only). Fluid display sizes `text-display-xs` → `text-display-lg`
- **Motion** — one easing curve everywhere: `ease-expo` `cubic-bezier(0.16, 1, 0.3, 1)`
- **Elevation** — `shadow-petal`, `shadow-lift`, `shadow-float`

`tailwind-merge` is extended in `lib/utils.ts` so it understands the custom type scale — without that it silently drops `text-display-*` when a text colour is merged alongside it.

---

## Deploying

Push to a Git repo and import it on Vercel. Everything is statically prerendered;
no runtime environment is required.

### Environment variables

Only one matters: `NEXT_PUBLIC_SITE_URL`, used for canonical links, Open Graph
tags, the sitemap and structured data.

Set it to your real domain — or **leave the key out entirely**. What you must not
do is add the key with a blank value. An empty string is a value, and
`process.env.X ?? fallback` does not catch it, which is why an earlier version of
this project failed its Vercel build with:

```
TypeError: Invalid URL … input: ''
    at metadataBase: new URL(site.url)
```

`resolveSiteUrl()` in `lib/site.ts` now validates every candidate and falls
through, so the build survives an empty value, whitespace, a missing protocol, a
trailing slash, or outright nonsense. Resolution order:

1. `NEXT_PUBLIC_SITE_URL`
2. `NEXT_PUBLIC_VERCEL_URL` — set automatically on Vercel, so preview deployments
   get their own correct canonical URLs
3. the `FALLBACK_URL` constant at the top of `lib/site.ts`

A bare domain is accepted (`https://` is added) and trailing slashes are trimmed.
Only `NEXT_PUBLIC_*` variables are read, so the server and browser always agree
and no rendered URL can cause a hydration mismatch.

Node 20.9+ is required (pinned in `engines`).

Any Node host works: `npm run build && npm start`.
