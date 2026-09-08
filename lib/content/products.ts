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
