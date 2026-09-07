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

export interface Product {
  id: string;
  name: string;
  slug: string;
  /** One-line hook used on cards */
  tagline: string;
  description: string;
  price: number;
  /** Optional strike-through reference price */
  compareAtPrice?: number;
  images: ProductImage[];
  category: CategorySlug;
  occasions: OccasionSlug[];
  recipients: RecipientSlug[];
  tags: string[];
  includes: IncludedItem[];
  /** Size options offered for this basket, priced as deltas */
  sizes?: { label: string; priceDelta: number; note?: string }[];
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
