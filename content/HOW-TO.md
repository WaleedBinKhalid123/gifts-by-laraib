# Adding baskets, variants and materials

Everything on the shop is driven by three spreadsheets in this folder. You edit
them in Excel or Google Sheets, run one command, and the site updates.

```
content/products.csv   ← the baskets
content/variants.csv   ← the sizes each basket comes in
content/items.csv      ← the materials customers can pick in "Customize"
```

**After any change, run this from the project folder:**

```bash
npm run content:import
```

It checks every row and tells you exactly what is wrong before it writes
anything. If it says `✓ Imported…`, you're good — then `npm run build` (or push
to deploy) to see it live.

> Opening these in Excel: use **File → Open** and choose UTF-8 encoding, or the
> accented characters (é, –, ’) will look wrong. Google Sheets handles it
> automatically, and is the safer choice.

---

## The three ideas, and how they differ

| | What it answers | How many per basket | Where you edit it |
| --- | --- | --- | --- |
| **Category** | *What kind of basket is this?* | Exactly one | `products.csv`, `category` column |
| **Occasion** | *When would you send it?* | As many as fit | `products.csv`, `occasions` column |
| **Variant** | *Which size am I buying?* | One row each in `variants.csv` | `variants.csv` |

A basket is **one** category — Self-Care *or* Romance, never both. It can be for
**many** occasions — the same self-care basket works for a birthday, Mother's Day
and just-because.

---

## Adding a basket

Add one row to `products.csv`. Columns:

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

One row per size in `variants.csv`:

```
productSlug,id,name,price,note,includes,available,isDefault
bridal-glow,classic,Classic,12500,6–8 items,,yes,yes
bridal-glow,deluxe,Deluxe,15000,9–12 items,,yes,no
```

- `productSlug` must match the `slug` in `products.csv` exactly. A typo here is
  the most common mistake, and the import will catch it.
- `price` is the **full price**, not a difference. What you type is what the
  customer pays.
- `isDefault` — mark exactly one `yes`. That's the size selected when the page
  opens. Make it the one you sell most, not the cheapest.
- `available` — set `no` for a size you've run out of. It shows greyed out with
  "Sold out" instead of disappearing, so people can see it exists.
- `includes` — leave blank and the size uses the basket's own list. Fill it in
  only when a size genuinely holds different things; the product page then shows
  that list when the size is chosen.

**A basket doesn't need variants.** Leave it out of `variants.csv` entirely, put
a number in the `price` column of `products.csv`, and it's a single-price basket
with no size chooser.

### Why not colours as well as sizes?

Because 4 sizes × 3 colours is 12 combinations to price, photograph and keep
track of. For hand-made work that's a lot of admin for very little gain. If
someone wants ivory instead of blush, they say so in the "Anything to swap or
add?" box and it comes through on WhatsApp. If colour ever becomes the main thing
that varies, change `variantLabel` to `Colour` and use the variant rows for that
instead — one axis, whichever one matters most.

---

## Adding materials (the Customize page)

`items.csv` is your buckets, flowers, candles, chocolates — the things a customer
picks when building their own basket.

```
id,name,group,price,image,imageAlt,available
peony,Preserved peony,Bloom,2100,peony-01.jpg,Three pink peonies,yes
```

- `group` must be one of: `Pamper`, `Sweet`, `Keepsake`, `Bloom`. These are the
  tabs on the Customize page.
- `available` — set `no` to hide something you're out of. It stays in the
  spreadsheet so you don't lose the price.

**Materials and baskets are different things.** The same candle appears twice:
once in `items.csv` (a customer can add it) and once in a basket's `includes`
(it's already in that basket). That's expected.

---

## Photos

Put your photo files in `public/images/`, then use the filename in the CSV:

```
images: bridal-glow-01.jpg|Silk robe and pearl pins in a cream box;bridal-glow-02.jpg|Close-up of the ribbon
```

- Use 3–4 photos per basket. The first is the one on the shop card.
- Around 1600px on the long edge is plenty. Bigger just makes the site slower.
- The text after `|` is the **alt text** — what a blind visitor hears and what
  Google reads. Describe what's in the shot, not "basket photo 1".
- Name files after the basket so they're easy to find later.

---

## Changing categories or occasions

These are deliberately not in the spreadsheet — adding one means a new page, new
navigation and new SEO, so it should be a considered change.

**To add or rename a category**, open `lib/content/products.ts` and edit:

```ts
export const categories = [
  { slug: 'signature', name: 'Signature', blurb: 'Our most-loved, most-gifted baskets' },
  …
];
```

Then add the same `slug` to `CategorySlug` in `lib/types.ts`, and to the
`CATEGORIES` list at the top of `scripts/content-import.mjs` so the import
accepts it.

**To add an occasion**, open `lib/content/occasions.ts` and copy an existing
block — it needs a `slug`, `name`, `line`, `blurb`, `emoji`, `accent` and an
`image`. Add the slug to `OccasionSlug` in `lib/types.ts` and to `OCCASIONS` in
the import script. A landing page, navigation entry and sitemap entry all appear
automatically.

Tell me if you'd rather I did these — they're three files each and easy to get
half-right.

---

## When the import complains

It stops before writing anything and lists each problem with a line number:

```
✖ Import stopped. 2 problems to fix:

  • products.csv line 6: unknown category "selfcare". Allowed: signature, self-care, …
  • variants.csv: rows reference productSlug "bridal-glo", which is not in products.csv
```

Fix those rows and run it again. Warnings (a missing alt text, a basket with no
occasions) are printed but don't block the import.

---

## Going the other way

```bash
npm run content:export
```

Rewrites the three CSVs from whatever the site currently holds. Useful if
somebody edited the code directly, or if you want a clean sheet after I've added
baskets for you.
