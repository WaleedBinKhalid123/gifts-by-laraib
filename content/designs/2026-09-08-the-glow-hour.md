# Design 002 — The Glow Hour

**Date:** 8 Sep 2026 · **Category:** Self-Care · **Status:** ready to build

Full visual design board (with the real reference photos, the build plan drawing
and the paste-ready rows) is published as an artifact. This file is the text
record.

Built **entirely from batch-1 stock that is on disk** — every item below has a
reference photo in `content/photos/`. Nothing needs buying in.

---

## The idea

A beauty-led basket. The two self-care baskets already on the site are wind-down
baskets — candle, chocolate, hand cream. This is the opposite: blush palette,
glosses, masks, press-on nails. Same category, different job, and that gap is
why it's next.

Base is the **square** wicker tray, not the round one. The round trays are too
shallow to hold upright bottles at the back and flat palettes at the front,
which is the whole structure of this basket.

---

## Copy

- **Name:** The Glow Hour
- **Slug:** `the-glow-hour`
- **Tagline:** Everything for the hour before she walks out the door
- **Description:** Blush, gloss, hand cream and a sheet mask, packed into a
  square wicker tray with hot pink roses in one corner and a bear in the other.
  It's the basket for the friend who does her own glam and still wants somebody
  to make a fuss of her. Tell us her shades and we'll pick them — otherwise we
  choose the ones that suit almost everyone.
- **Card suggestion:** "Go be unreasonably lovely."

## Taxonomy

| Field | Value |
| --- | --- |
| Category | `self-care` |
| Occasions | `birthday`, `graduation`, `eid`, `just-because` |
| Recipients | `for-her` |
| Lead time | 2 days |
| Flags | featured, customizable, available |

Deliberately **not** `mothers-day` or `anniversary` — the contents skew young
(press-on nails, cartoon compacts) and it would weaken both landing pages.

## Sizes

| Size | Tray | Items | Price |
| --- | --- | --- | --- |
| Mini | smallest square | 5–6 | Rs 3,900 |
| **Classic** *(default)* | middle square | 9–10 | **Rs 6,400** |
| Deluxe | largest square | 14–15 | Rs 10,900 |

Deluxe is where the large plush bear goes, which is why it needs the biggest tray.

## Build order

1. **Liner** — blush tissue crushed so it mounds; corners above the rim. Never flat.
2. **Bear, back-left** — large hooded bear at 45°. Keychain bear instead on Mini/Classic.
3. **Rose posy, back-right** — 7 hot pink stems cut to ~4", taped as one posy with
   2 gypsophila sprays. One posy, not seven loose stems — loose stems drift in transit.
4. **Flat-lay band, middle** — blush palette flat, lid closed; mask sachets fanned behind.
5. **Front row** — soap tubes as bookends, glosses upright between them, hand cream
   tubes laid along the front edge, caps facing the same way.
6. **Keychain corner** — front-right stays low: compact face-up, keychain bear
   clipped to the rim so it overhangs.
7. **Ribbon and card** — hot pink satin round the body, bow front-left, tails cut
   on the diagonal. Card between palette and roses, writing out. Glitter jar
   beside the bow on Deluxe only.

**Rule:** every item liftable without moving another. If a customer has to dig,
it's over-packed — and an over-packed basket photographs as a pile.

## Shoot list

`glow-hour-01.jpg` three-quarter hero at ~35° (shop card) · `-02` straight
overhead of the flat-lay band · `-03` front row at rim height · `-04` the three
sizes left to right.

Not on the shaggy rug. White sheet or cream card near a window, mid-morning, no
flash.

---

## Paste-ready rows

### `content/products.csv`

```
the-glow-hour,The Glow Hour,Everything for the hour before she walks out the door,"Blush, gloss, hand cream and a sheet mask, packed into a square wicker tray with hot pink roses in one corner and a bear in the other. It's the basket for the friend who does her own glam and still wants somebody to make a fuss of her. Tell us her shades and we'll pick them — otherwise we choose the ones that suit almost everyone.",self-care,,,birthday;graduation;eid;just-because,for-her,beauty;makeup;flowers included;teen;bestseller in waiting,glow-hour-01.jpg|Square wicker basket of makeup with hot pink roses and a plush bear;glow-hour-02.jpg|Overhead view of a blush palette and sheet masks in a wicker tray;glow-hour-03.jpg|Lip glosses and hand cream tubes lined along the front of the basket;glow-hour-04.jpg|Three sizes of the basket side by side,"Emelie 4-colour blush palette;Emelie lip gloss | 3 shades;3Q Beauty Hot Pink magic lip oil;Meidián fruit hand cream | 3 × 30g, scents your choice;Bioaqua sheet masks | 3 sachets;Fruit paper soap tubes | 2;Mocallure mini compact;Plush bear keychain;Hot pink roses & white gypsophila | 7 stems, hand-taped;Hot pink satin ribbon finish;Handwritten card",2,yes,yes,yes,Size
```

### `content/variants.csv`

```
the-glow-hour,mini,Mini,3900,5–6 items,"Emelie lip gloss | 2 shades;Meidián fruit hand cream | 2 × 30g;Fruit paper soap tube;Plush bear keychain;Hot pink roses & white gypsophila | 3 stems;Hot pink satin ribbon finish;Handwritten card",yes,no
the-glow-hour,classic,Classic,6400,9–10 items,,yes,yes
the-glow-hour,deluxe,Deluxe,10900,14–15 items,"Emelie 4-colour blush palette;Emelie lip gloss | 3 shades;3Q Beauty Hot Pink magic lip oil;Hudamoji boxed lip gloss | 3 shades;Meidián fruit hand cream | 3 × 30g;Bioaqua sheet masks | Full set of 5;Fruit paper soap tubes | 2;Mocallure mini compact;Merrycolor press-on nails | 24 pc, burgundy or black glitter;Glitter powder jar;Large plush bear | Pink hooded or dusty pink dungarees;Hot pink roses & white gypsophila | 12 stems, hand-taped;Hot pink satin ribbon finish;Handwritten card",yes,no
```

### `content/items.csv` — nine new materials

```
blush-palette,Emelie 4-colour blush palette,Pamper,1150,03-emelie-blush-palette.jpg,Four-pan pink and coral blush palette in a black case,yes
lip-gloss,Emelie lip gloss,Pamper,320,02-emelie-lip-gloss-and-lip-oils.jpg,Clear-tube lip gloss with a pink tint,yes
lip-oil,Hot Pink magic lip oil,Pamper,480,02-emelie-lip-gloss-and-lip-oils.jpg,Colour-changing lip oil in a pink translucent bottle,yes
hand-cream,Meidián fruit hand cream 30g,Pamper,290,01-meidian-hand-cream-set.jpg,Fruit-extract hand cream tube on a printed header card,yes
sheet-mask,Bioaqua sheet mask,Pamper,180,06-bioaqua-sheet-masks.jpg,Single-use sheet mask sachet,yes
paper-soap,Fruit paper soap tube,Pamper,220,04-paper-soap-tubes.jpg,Tube of fruit-scented paper soap sheets,yes
mini-compact,Mocallure mini compact,Keepsake,540,05-mocallure-mini-compacts.jpg,Mini compact mirror with a cartoon lid,yes
press-on-nails,Press-on nails 24 pc,Keepsake,650,08-merrycolor-press-on-nails.jpg,Burgundy acrylic press-on nails,yes
bear-keychain,Plush bear keychain,Keepsake,380,10-teddy-keychain-bouquet.jpg,Small plush bear keychain with a ribbon bow,yes
```

Item prices are retail-in-basket guesses for the Customize builder — adjust them
to your actual margins before importing.

Then:

```bash
npm run content:import
npm run build
```

The import warns that the four `glow-hour-*.jpg` files aren't in `public/images/`
yet. It doesn't block, but don't deploy until they are.

---

## Regenerating the design board

```bash
python3 scripts/design-board-images.py     # crops + base64s the reference photos
```

Then substitute the `{{IMG_*}}` tokens in `scripts/.design-board.tpl.html`.
