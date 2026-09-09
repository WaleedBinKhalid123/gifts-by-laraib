# Adding baskets, variants and materials

Everything on the shop is driven by three Google Sheets in your Drive:

```
products    ← the baskets
variants    ← the sizes each basket comes in
items       ← the materials customers can pick in "Customize"
```

**Edit the sheets in Drive. Then, from the project folder, run one command:**

```bash
npm run sync
```

That pulls all three sheets straight down from Drive, checks every row, and
rebuilds the site's data. No downloading, no dragging files around. Then
`npm run dev` (or push to deploy) to see it live.

If a row is wrong it stops before writing anything and tells you the sheet, the
line number and what to fix.

---

## One-time setup

`npm run sync` reads the three sheet links from `content/sheets.json`. Those are
already filled in. The only thing each sheet needs is to be readable without
signing in:

> In the sheet: **Share → General access → Anyone with the link → Viewer**

Viewer is read-only. Someone who had the link could read your basket list — which
is the same list published on your website — but nobody can change it.

If you skip this, `npm run sync` stops with:

```
✖ Baskets is not readable without signing in, so Google would not hand over the data.
```

### If you ever make a new sheet

Copy the whole address bar and paste it into `content/sheets.json` in place of
the old link. A bare sheet ID works too.

### The other two options

```bash
npm run sync -- --dry       # fetch and check everything, write nothing
npm run sync -- --offline   # rebuild from the last download, no internet needed
```

`--dry` is the safe way to see whether an edit is valid before it lands.

### What's in /content afterwards

Every sync writes a copy of each sheet into `content/*.csv`. **Those are a
snapshot, not something to edit** — the next sync overwrites them. They exist so
you can see in a git diff exactly what changed, and so `--offline` has something
to build from. The previous ten copies are kept in `content/.backups/`.

---

## The three ideas, and how they differ

| | What it answers | How many per basket | Which sheet |
| --- | --- | --- | --- |
| **Category** | *What kind of basket is this?* | Exactly one | `products`, `category` column |
| **Occasion** | *When would you send it?* | As many as fit | `products`, `occasions` column |
| **Variant** | *Which size am I buying?* | One row each | `variants` |

A basket is **one** category — Self-Care *or* Romance, never both. It can be for
**many** occasions — the same self-care basket works for a birthday, Mother's Day
and just-because.

---

## Adding a basket

Add one row to the **products** sheet. Columns:

| Column | Required | Notes |
| --- | --- | --- |
| `slug` | yes | The web address: `/shop/bridal-glow`. Lowercase, hyphens, no spaces. Never change it once it's live — links break. |
| `name` | yes | "Bridal Glow" |
| `tagline` | yes | One short line shown on the card |
| `description` | yes | Two or three sentences on the product page |
| `category` | yes | One of: `signature`, `self-care`, `romance`, `celebration`, `corporate`, `petite` |
| `price` | if no variants | Leave blank when the basket has variants — the cheapest variant becomes the "from" price |
| `compareAtPrice` | no | A higher struck-through price, for showing a discount |
| `occasions` | yes | Separated by `;` — see the list below |
| `recipients` | no | `for-her`, `for-him`, `for-couples`, `for-teams`, `for-new-mums` |
| `tags` | no | Free text, separated by `;`. Shows nowhere yet, but search reads them |
| `images` | yes | `filename\|alt text`, separated by `;`. See **Photos** below |
| `includes` | yes | The "What's inside" list. `Item name \| optional note`, separated by `;` |
| `leadTimeDays` | no | How many days you need. Defaults to 2 |
| `available` | no | `yes` / `no`. `no` shows "Currently unavailable" |
| `featured` | no | `yes` puts it on the homepage |
| `customizable` | no | `yes` shows the "Customizable" badge |
| `variantLabel` | no | What the chooser is called. Defaults to `Size` |

**Occasion values:** `birthday`, `anniversary`, `wedding`, `bridal-shower`,
`valentines`, `eid`, `mothers-day`, `graduation`, `corporate`, `just-because`

### The separators, in one line

- `;` separates **items in a list** — three occasions, four photos
- `|` separates **a thing from its note** — `Shea hand cream | Travel size`

---

## Adding variants (sizes)

One row per size in the **variants** sheet:

```
productSlug,id,name,price,note,includes,available,isDefault
bridal-glow,classic,Classic,12500,6–8 items,,yes,yes
bridal-glow,deluxe,Deluxe,15000,9–12 items,,yes,no
```

- `productSlug` must match the `slug` in the products sheet exactly. A typo here
  is the most common mistake, and the sync will catch it.
- `price` is the **full price**, not a difference. What you type is what the
  customer pays.
- `isDefault` — mark exactly one `yes`. That's the size selected when the page
  opens. Make it the one you sell most, not the cheapest.
- `available` — set `no` for a size you've run out of. It shows greyed out with
  "Sold out" instead of disappearing, so people can see it exists.
- `includes` — leave blank and the size uses the basket's own list. Fill it in
  only when a size genuinely holds different things.

**A basket doesn't need variants.** Leave it out of the variants sheet entirely,
put a number in the `price` column of products, and it's a single-price basket
with no size chooser. `Lift the Lid` and `The Glow Hour` both work this way.

### Which price do I change?

| Basket has sizes? | Change the price in |
| --- | --- |
| Yes | **variants**, on the row for that size |
| No | **products**, the `price` column |

Baskets with sizes leave `products.price` blank on purpose, so there's only ever
one place a number lives. Editing the blank one does nothing.

### Why not colours as well as sizes?

Because 4 sizes × 3 colours is 12 combinations to price, photograph and keep
track of. For hand-made work that's a lot of admin for very little gain. If
someone wants ivory instead of blush, they say so in the "Anything to swap or
add?" box and it comes through in your DMs. If colour ever becomes the main thing
that varies, change `variantLabel` to `Colour` and use the variant rows for that
instead — one axis, whichever one matters most.

---

## Adding materials (the Customize page)

The **items** sheet is your buckets, flowers, candles, chocolates — the things a
customer picks when building their own basket.

```
id,name,group,price,image,imageAlt,available
peony,Preserved peony,Bloom,2100,peony-01.jpg,Three pink peonies,yes
```

- `group` must be one of: `Pamper`, `Sweet`, `Keepsake`, `Bloom`. These are the
  tabs on the Customize page.
- `available` — set `no` to hide something you're out of. It stays in the sheet
  so you don't lose the price.

**Materials and baskets are different things.** The same candle appears twice:
once in items (a customer can add it) and once in a basket's `includes` (it's
already in that basket). That's expected.

---

## Photos

Put your photo files in `public/images/`, then use the filename in the sheet:

```
images: bridal-glow-01.jpg|Silk robe and pearl pins in a cream box;bridal-glow-02.jpg|Close-up of the ribbon
```

- Use 3–4 photos per basket. The first is the one on the shop card.
- Around 1600px on the long edge is plenty. Bigger just makes the site slower.
- The text after `|` is the **alt text** — what a blind visitor hears and what
  Google reads. Describe what's in the shot, not "basket photo 1".
- Name files after the basket so they're easy to find later.

Photos live in the project, not in Drive. `npm run sync` doesn't move images.

---

## Changing categories or occasions

These are deliberately not in the sheets — adding one means a new page, new
navigation and new SEO, so it should be a considered change.

**To add or rename a category**, open `lib/content/products.ts` and edit:

```ts
export const categories = [
  { slug: 'signature', name: 'Signature', blurb: 'Our most-loved, most-gifted baskets' },
  …
];
```

Then add the same `slug` to `CategorySlug` in `lib/types.ts`, and to the
`CATEGORIES` list at the top of `scripts/sync.mjs` so the sync accepts it.

**To add an occasion**, open `lib/content/occasions.ts` and copy an existing
block — it needs a `slug`, `name`, `line`, `blurb`, `emoji`, `accent` and an
`image`. Add the slug to `OccasionSlug` in `lib/types.ts` and to `OCCASIONS` in
`scripts/sync.mjs`. A landing page, navigation entry and sitemap entry all appear
automatically.

Tell me if you'd rather I did these — they're three files each and easy to get
half-right.

---

## When the sync complains

It stops before writing anything and lists each problem with a line number:

```
✖ Sync stopped. 2 problems to fix in your sheets:

  • products.csv line 6: unknown category "selfcare". Allowed: signature, self-care, …
  • variants.csv: rows reference productSlug "bridal-glo", which is not in products.csv

Nothing was written. Fix those rows in Drive and run it again.
```

The line number is the row number in the sheet. Fix it in Drive and run
`npm run sync` again. Warnings (a missing alt text, a basket with no occasions)
are printed but don't block.
