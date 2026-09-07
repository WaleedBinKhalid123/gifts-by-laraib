import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge has to be told about our custom type scale, otherwise it
 * treats `text-display-md` as a colour utility and lets `text-wine-800`
 * silently delete it.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display-xs', 'display-sm', 'display-md', 'display-lg', 'label', 'label-lg'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Pakistani Rupee formatting — "Rs 4,500" */
export function formatPKR(value: number) {
  return `Rs ${new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(value)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

/** Blush-toned 10×12 placeholder shown under every photo while it loads. */
export const BLUR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='12'%3E%3Crect width='10' height='12' fill='%23FBEDF3'/%3E%3C/svg%3E";

/**
 * Set to true once you have run `npm run images` — every photo is then served
 * from /public/images instead of the Unsplash CDN. Local files are dramatically
 * faster (no third-party round trip, no on-the-fly re-encode of a huge source)
 * and they keep working offline.
 */
const USE_LOCAL_IMAGES = false;

/**
 * Single source of truth for image URLs. A CMS or asset host can replace this
 * one function without touching a component.
 *
 * `w` is the width requested *from the source*, not the rendered size — keep it
 * close to the largest size the slot is ever displayed at. Asking Unsplash for
 * 1600px to fill a 280px card is the main reason a page like this feels slow.
 */
export function photo(id: string, w = 1200) {
  if (USE_LOCAL_IMAGES) return `/images/${id}.jpg`;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;
}
