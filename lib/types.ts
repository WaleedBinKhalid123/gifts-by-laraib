export type OccasionSlug =
  | 'birthday'
  | 'anniversary'
  | 'wedding'
  | 'bridal-shower'
  | 'valentines'
  | 'eid'
  | 'mothers-day'
  | 'graduation'
  | 'corporate'
  | 'just-because';

export type CategorySlug =
  | 'signature'
  | 'self-care'
  | 'romance'
  | 'celebration'
  | 'corporate'
  | 'petite';

export type RecipientSlug = 'for-her' | 'for-him' | 'for-couples' | 'for-teams' | 'for-new-mums';

export interface ProductImage {
  /** Unsplash file id, resolved through `photo()` */
  id: string;
  alt: string;
}

export interface IncludedItem {
  name: string;
  note?: string;
}

/**
 * A buyable version of one basket.
 *
 * Deliberately a single axis (size), not a size × colour grid. A grid means
 * pricing, photographing and stock-checking every combination, which is the
 * wrong shape for hand-made work. Anything else a customer wants is a note they
 * add on Instagram.
 *
 * `price` is absolute, not a delta — what you type is what the customer pays,
 * with no mental arithmetic when you are editing a spreadsheet at 11pm.
 */
export interface ProductVariant {
  id: string;
  /** "Mini", "Classic", "Deluxe", "Luxury" */
  name: string;
  price: number;
  /** Short qualifier shown under the name, e.g. "6–8 items" */
  note?: string;
  /** Overrides the product's list when this variant holds different things. */
  includes?: IncludedItem[];
  available: boolean;
  /** The one selected when the page opens. Falls back to the first available. */
  isDefault?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** One-line hook used on cards */
  tagline: string;
  description: string;
  /**
   * Base price. When the basket has variants this is the fallback only —
   * `priceFrom()` reports the lowest variant price for cards and filters.
   */
  price: number;
  /** Optional strike-through reference price */
  compareAtPrice?: number;
  images: ProductImage[];
  category: CategorySlug;
  occasions: OccasionSlug[];
  recipients: RecipientSlug[];
  tags: string[];
  includes: IncludedItem[];
  /** Sizes offered for this basket. Omit for a single-price basket. */
  variants?: ProductVariant[];
  /** What the variant chooser is called on the product page. */
  variantLabel?: string;
  customizable: boolean;
  available: boolean;
  featured: boolean;
  leadTimeDays: number;
}

export interface Occasion {
  slug: OccasionSlug;
  name: string;
  /** Short editorial line shown on the card */
  line: string;
  blurb: string;
  emoji: string;
  image: ProductImage;
  accent: 'rose' | 'wine' | 'gold' | 'blush';
}

export interface Testimonial {
  id: string;
  name: string;
  city?: string;
  occasion: string;
  quote: string;
  rating: 1 | 2 | 3 | 4 | 5;
  avatar?: ProductImage;
}

export interface GalleryItem {
  id: string;
  image: ProductImage;
  caption: string;
  /** Grid weighting for the editorial masonry layout */
  span: 'tall' | 'wide' | 'square' | 'hero';
  href?: string;
}

export interface Faq {
  q: string;
  a: string;
}

/* ---------- Basket builder ---------- */

export interface BuilderSize {
  id: string;
  name: string;
  itemAllowance: number;
  basePrice: number;
  description: string;
}

export interface BuilderTheme {
  id: string;
  name: string;
  description: string;
  palette: string[];
  image: ProductImage;
}

export interface BuilderItem {
  id: string;
  name: string;
  price: number;
  group: 'Pamper' | 'Sweet' | 'Keepsake' | 'Bloom';
  image: ProductImage;
}

export interface BuilderWrap {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface BuilderSelection {
  size: BuilderSize;
  theme: BuilderTheme | null;
  items: BuilderItem[];
  wrap: BuilderWrap;
  message: string;
  recipientName: string;
  senderName: string;
}
