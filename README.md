# Gifts by Laraib

Brand site for a customized gift-basket business. Next.js 16 (App Router) · TypeScript · Tailwind CSS.

No animation library, no smooth-scroll library — all motion is CSS plus ~120 lines
of vanilla JS. The homepage ships about **23 KB of gzipped JavaScript**.

Ordering runs entirely through WhatsApp — no checkout, no server, no database. Every "order" button composes a structured WhatsApp message on the visitor's own device.

---

## Getting started

```bash
npm install
npm run images     # ← do this once. Downloads all photography locally (see below)
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
npm run typecheck  # tsc --noEmit
```

Node 18.18+ (20+ recommended).

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

Everything business-specific lives in **`lib/site.ts`**. Change it there and it updates across the whole site — nav, footer, metadata, structured data and every WhatsApp link.

```ts
whatsapp: {
  number: '923001234567',      // ← REPLACE. International format, digits only, no + or spaces
  display: '+92 300 123 4567', // ← REPLACE. How it reads on screen
},
email: 'hello@giftsbylaraib.com',   // ← REPLACE
instagram: { handle: '@giftsbylaraib', url: '...' },  // ← REPLACE
facebook: '...',                     // ← REPLACE
```

Set the live domain via an environment variable (used for canonical URLs, Open Graph, sitemap):

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://giftsbylaraib.com
```

---

## Content model

No content is hardcoded inside components. Everything is typed data in `lib/content/`, ready to be swapped for a CMS or an admin API without touching the UI.

| File | What it holds |
| --- | --- |
| `lib/content/products.ts` | Baskets: name, slug, price, images, category, occasions, recipients, included items, sizes, availability, featured flag, lead time |
| `lib/content/occasions.ts` | Occasions used by the homepage rail and `/occasions/[slug]` |
| `lib/content/builder.ts` | Basket sizes, themes, add-on items and wrapping styles for the configurator |
| `lib/content/testimonials.ts` | Reviews |
| `lib/content/gallery.ts` | The editorial Instagram-style grid |
| `lib/content/faqs.ts` | FAQ entries (also emitted as FAQPage structured data) |
| `lib/site.ts` | Business details, navigation, footer links, delivery policy |

Types are in `lib/types.ts`.

### Adding a basket

Append an object to `products` in `lib/content/products.ts`. The shop grid, filters, product page, sitemap, related-products logic and structured data all pick it up automatically — `generateStaticParams` builds a static page per slug at build time.

### Moving to a CMS later

Each content file exports plain arrays plus small accessor functions (`getProduct`, `productsByOccasion`, `featuredProducts`, `relatedProducts`). Replace the array with a fetch and keep the accessors' signatures, and no component needs to change.

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

`lib/whatsapp.ts` is the only place that builds order links:

- `waProductOrder()` — a basket from a product page (size, quantity, card message, recipient, delivery city, date, notes, total)
- `waCustomBasket()` — a basket from the configurator (size, theme, every item, wrapping, message)
- `waEnquiry()` — the contact form
- `waGeneral()` — plain "hello"

Each returns a `https://wa.me/...` URL with a formatted, readable message. Nothing is stored or transmitted anywhere else.

**Adding a real cart and checkout later:** the panels already collect everything a cart line item needs. Swap the WhatsApp button for an `addToCart(product, options)` call and keep the WhatsApp link as a secondary path — the data shapes do not change.

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
reads from — the navbar condense, the floating WhatsApp button, and all parallax.
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
             SmoothScroll, PageTransition, WhatsAppFab
  home/      Hero, TrustBar, OccasionRail, FeaturedBaskets, CustomizeTeaser,
             HowItWorks, BrandStory, TestimonialCarousel, InstagramGallery, FinalCTA
  shop/      ProductCard, ProductGrid
  product/   ProductGallery, ProductOrderPanel
  builder/   BasketBuilder, BasketPreview
  contact/   EnquiryForm
  ui/        Button, SectionHeading, Reveal, Ornament, HandwrittenCard, Toast
lib/
  site.ts types.ts utils.ts motion.ts useReveal.ts whatsapp.ts
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

Push to a Git repo and import it on Vercel. Set `NEXT_PUBLIC_SITE_URL` in project environment variables. Everything is statically prerendered; no runtime environment is required beyond that.

Any Node host works too: `npm run build && npm start`.
