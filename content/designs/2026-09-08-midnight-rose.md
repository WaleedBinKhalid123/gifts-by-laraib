# Design 001 — Midnight Rose

**Date:** 8 Sep 2026 · **Category:** Romance · **Status:** ready to build

Built entirely from stock already photographed. The anchor is the styled black
hat box in batch 2 (`4a08d1f2`) — burgundy roses, white gypsophila and a white
teddy in a striped party hat. That arrangement already exists, which is why this
is the first one to build: the hero shot is one careful reshoot away, not a
guess.

---

## The idea

Almost every romance basket in Pakistan is pink on pink. This one is black.
Matte black hat box, burgundy roses, a single white teddy and one white
gypsophila break — three colours, nothing else. It reads expensive because it is
restrained, and it photographs beautifully against a cream wall, which matters
more than anything for a WhatsApp-and-Instagram business.

It also solves a real gap in the shop: everything in `romance` right now is soft
and pale. There is nothing for the customer who wants *dramatic*.

---

## Copy

**Name:** Midnight Rose
**Slug:** `midnight-rose`
**Tagline:** Deep burgundy, quiet drama

**Description:**
> Burgundy roses and white gypsophila arranged in a matte black hat box —
> the one we reach for when pink feels too soft for the occasion. Every stem is
> set by hand, so the collar sits high and the roses stay tight, and it arrives
> with the lid on and the ribbon tied. Made for the anniversary you want to be
> remembered.

**Handwritten card suggestion (shown as the placeholder in the order form):**
> "Some things are worth the drama."

---

## Taxonomy

| Field | Value |
| --- | --- |
| Category | `romance` |
| Occasions | `anniversary`, `valentines`, `birthday`, `just-because` |
| Recipients | `for-her` |
| Tags | `hat box`, `burgundy`, `preserved look`, `flowers included`, `statement gift` |
| Lead time | 3 days *(floral arranging — not a shelf pull)* |
| Customizable | yes |
| Featured | yes |
| Variant label | Size |

Deliberately **not** tagged `wedding` — black cases read as mourning for some
families, and it isn't worth the one bad message.

---

## Variants — real stock, real prices

Three sizes, mapped onto boxes you actually own (small hat box, large hat box,
large hat box + large plush).

### Petite — Rs 5,400 · 5–6 items
Small black hat box (batch 2 `4a08d1f2`, bagged pair)

- 7 burgundy roses, hand-set
- White gypsophila break
- Plush bear keychain — from the keychain bouquet
- Hudamoji lip gloss, 1 shade — boxed
- Handwritten card

### Classic — Rs 8,900 · 8–9 items · **default**
Large black hat box — the shot you already have

- 15 burgundy roses, hand-set collar
- White gypsophila throughout
- White plush teddy in a striped party hat
- Ombré body mist, 1 pc
- Emelie lip gloss, 2 shades
- Merrycolor press-on nails — burgundy, 24 pc
- Satin ribbon finish, black
- Handwritten card

### Grand — Rs 13,400 · 11–12 items
Large black hat box + large plush bear alongside

- 20 burgundy roses + white gypsophila
- Large plush bear — dusty pink dungarees
- Pink cube-cap perfume, 1 pc
- Emelie 4-colour blush palette
- Bioaqua sheet masks — pearl whitening + hyaluronic & vitamin C
- Meidián hand cream, 2 × 30g
- Fruit paper soap tube
- Hudamoji lip gloss, 2 shades
- Satin ribbon finish, black
- Handwritten card

Petite is priced so the flowers still feel generous at the entry point —
undercutting it further would mean a thin collar, which photographs badly and
is what people remember.

---

## Photo plan

Four shots, in this order. First one is the shop card.

| File | Shot |
| --- | --- |
| `midnight-rose-01.jpg` | The Classic, straight on, lid off, cream wall behind, natural window light |
| `midnight-rose-02.jpg` | Overhead into the box — rose collar and gypsophila filling the frame |
| `midnight-rose-03.jpg` | Lid on, ribbon tied, teddy sitting beside it — the "how it arrives" shot |
| `midnight-rose-04.jpg` | The three sizes together, so the chooser makes sense |

Not on the shaggy rug. A white sheet or cream card near a window, box at eye
level. Black absorbs light — shoot in the brightest hour you get.

---

## Paste-ready rows

### `content/products.csv`

```
midnight-rose,Midnight Rose,"Deep burgundy, quiet drama","Burgundy roses and white gypsophila arranged in a matte black hat box — the one we reach for when pink feels too soft for the occasion. Every stem is set by hand, so the collar sits high and the roses stay tight, and it arrives with the lid on and the ribbon tied. Made for the anniversary you want to be remembered.",romance,,,anniversary;valentines;birthday;just-because,for-her,hat box;burgundy;preserved look;flowers included;statement gift,midnight-rose-01.jpg|Burgundy roses and white gypsophila in a matte black hat box;midnight-rose-02.jpg|Overhead view of a tight burgundy rose collar;midnight-rose-03.jpg|Black hat box with the lid on and a black satin ribbon, a white teddy beside it;midnight-rose-04.jpg|Three sizes of black hat box arrangement side by side,"15 burgundy roses | Hand-set collar;White gypsophila;White plush teddy | In a striped party hat;Ombré body mist;Emelie lip gloss | 2 shades;Merrycolor press-on nails | Burgundy, 24 pc;Black satin ribbon finish;Handwritten card",3,yes,yes,yes,Size
```

### `content/variants.csv`

```
midnight-rose,petite,Petite,5400,5–6 items,"7 burgundy roses | Hand-set;White gypsophila break;Plush bear keychain;Hudamoji lip gloss | 1 shade;Handwritten card",yes,no
midnight-rose,classic,Classic,8900,8–9 items,,yes,yes
midnight-rose,grand,Grand,13400,11–12 items,"20 burgundy roses | Hand-set collar;White gypsophila;Large plush bear | Dusty pink dungarees;Cube-cap perfume;Emelie 4-colour blush palette;Bioaqua sheet masks | Pearl whitening + hyaluronic & vitamin C;Meidián hand cream | 2 × 30g;Fruit paper soap tube;Hudamoji lip gloss | 2 shades;Black satin ribbon finish;Handwritten card",yes,no
```

Classic's `includes` is left blank on purpose — it inherits the product list, so
you only maintain that one in a single place.

Then:

```bash
npm run content:import
npm run build
```

The import will warn that the four photos aren't in `public/images/` yet. That
warning doesn't block it — but don't deploy until the photos are in, or the cards
render empty.

---

## New materials this unlocks for the Customize page

These are all things you own that aren't in `items.csv` yet. Worth adding
whether or not you build this basket:

```
burgundy-roses,Burgundy roses (5 stems),Bloom,900,09-artificial-flowers.jpg,Deep burgundy artificial roses,yes
gypsophila,White gypsophila spray,Bloom,450,09-artificial-flowers.jpg,White gypsophila filler stems,yes
body-mist,Ombré body mist,Pamper,1200,b51f74ad.jpg,Glass bottle of body mist in a black to magenta ombré,yes
cube-perfume,Cube-cap perfume,Pamper,1600,8438b606.jpg,Square glass perfume bottle with a textured gold cube cap,yes
press-on-nails,Press-on nails (24 pc),Keepsake,650,08-merrycolor-press-on-nails.jpg,Burgundy acrylic press-on nails,yes
plush-bear-large,Large plush bear,Keepsake,2400,13-large-teddy-bears.jpg,Large plush bear in dusty pink dungarees,yes
```

Rename those batch-2 filenames when you save them properly — `b51f74ad.jpg`
is a placeholder for whatever you call the body mist shot.

---

## Tomorrow

Obvious next designs from the same stock, so we don't repeat a silhouette:

1. **Bridal / bridal-shower** — the gold-handled bamboo baskets with the gold
   foil lining. Different container, different category, uses the pearl masks
   and the mini compacts.
2. **Petite** — the clear roll-on vials + paper soaps + a keychain bear in the
   smallest square wicker. A genuine under-Rs-3,000 price point, which the shop
   currently doesn't have.
3. **Celebration** — light pink hat box, hot pink roses, glitter jars, the
   capybara compacts. The loud sister to this one.
