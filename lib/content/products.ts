import type { CategorySlug, Product, ProductVariant, RecipientSlug } from '@/lib/types';
import { productList } from '@/lib/content/products.data';

export const categories: { slug: CategorySlug; name: string; blurb: string }[] = [
  { slug: 'signature', name: 'Signature', blurb: 'Our most-loved, most-gifted baskets' },
  { slug: 'self-care', name: 'Self-Care', blurb: 'Slow evenings, softer mornings' },
  { slug: 'romance', name: 'Romance', blurb: 'For the person who already has your heart' },
  { slug: 'celebration', name: 'Celebration', blurb: 'Birthdays, brides and big news' },
  { slug: 'corporate', name: 'Corporate', blurb: 'Client and team gifting, done properly' },
  { slug: 'petite', name: 'Petite', blurb: 'Small gestures that still say a lot' },
];

export const recipients: { slug: RecipientSlug; name: string }[] = [
  { slug: 'for-her', name: 'For Her' },
  { slug: 'for-him', name: 'For Him' },
  { slug: 'for-couples', name: 'For Couples' },
  { slug: 'for-teams', name: 'For Teams' },
  { slug: 'for-new-mums', name: 'For New Mums' },
];

/**
 * The baskets themselves live in products.data.ts, generated from
 * content/products.csv by `npm run content:import`. Everything below is
 * hand-written: the taxonomy, and the queries the site runs against it.
 */
export const products: Product[] = productList;

/** The variant shown when a product page opens. */
export function defaultVariant(product: Product): ProductVariant | undefined {
  if (!product.variants?.length) return undefined;
  return (
    product.variants.find((v) => v.isDefault && v.available) ??
    product.variants.find((v) => v.available) ??
    product.variants[0]
  );
}

/**
 * The number shown on cards and used by filters and sorting: the cheapest
 * available variant, or the product's own price when it has none.
 */
export function priceFrom(product: Product): number {
  const available = product.variants?.filter((v) => v.available) ?? [];
  return available.length ? Math.min(...available.map((v) => v.price)) : product.price;
}

export function priceTo(product: Product): number {
  const available = product.variants?.filter((v) => v.available) ?? [];
  return available.length ? Math.max(...available.map((v) => v.price)) : product.price;
}

/** True when the card should read "from Rs X" rather than a single figure. */
export const hasPriceRange = (product: Product) => priceFrom(product) !== priceTo(product);

/** The contents list for a variant, falling back to the product's own. */
export function includesFor(product: Product, variant?: ProductVariant) {
  return variant?.includes?.length ? variant.includes : product.includes;
}

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const featuredProducts = () => products.filter((p) => p.featured && p.available);

/**
 * A photograph we took ourselves, as opposed to a stock-library placeholder.
 * `photo()` uses the same test: anything not shaped like an Unsplash id is a
 * file in public/images.
 */
export const isOwnPhoto = (p: Product) => Boolean(p.images[0] && !p.images[0].id.startsWith('photo-'));

/**
 * Baskets pinned to the homepage, in order. The first one gets the spotlight —
 * the largest photograph on the site — and the rest fill the cards beneath it.
 *
 * This is a deliberate list rather than a sort, because the spotlight is a
 * judgement about which photograph is strongest, and no rule can make that
 * call. A basket named here does not need `featured` set in the sheet.
 */
const HOMEPAGE_PINNED = [
  'blush-and-bear',
  'blush-velvet-box',
  'midnight-rose',
  'light-up-snack-box',
];

/**
 * The homepage line-up: the spotlight first, then the cards under it.
 *
 * Pinned baskets come first, in the order above. Anything left over is filled
 * from the `featured` column in the sheet, own photography ahead of stock — so
 * if a pinned basket is removed or sold out, the homepage still fills itself
 * rather than leaving a hole.
 */
export function homepageFeatured(count = 4): Product[] {
  const pinned = HOMEPAGE_PINNED
    .map((slug) => products.find((p) => p.slug === slug && p.available))
    .filter((p): p is Product => Boolean(p));

  const featured = featuredProducts().filter((p) => !pinned.includes(p));
  const own = featured.filter(isOwnPhoto);
  const stock = featured.filter((p) => !isOwnPhoto(p));

  return [...pinned, ...own, ...stock].slice(0, count);
}

export const productsByOccasion = (slug: string) =>
  products.filter((p) => (p.occasions as string[]).includes(slug));

export function relatedProducts(current: Product, limit = 3) {
  return products
    .filter((p) => p.id !== current.id && p.available)
    .map((p) => {
      const shared = p.occasions.filter((o) => current.occasions.includes(o)).length;
      const sameCat = p.category === current.category ? 2 : 0;
      return { p, score: shared + sameCat };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

export const priceRange = () => {
  const values = products.map(priceFrom);
  return { min: Math.min(...values), max: Math.max(...values) };
};
