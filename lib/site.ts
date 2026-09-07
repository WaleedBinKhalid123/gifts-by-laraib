/** Used when no environment variable supplies a usable one. */
const FALLBACK_URL = 'https://giftsbylaraib.com';

/**
 * Resolve the canonical site origin.
 *
 * `process.env.X ?? fallback` is not enough: `??` only catches null/undefined,
 * so an environment variable that exists but is EMPTY (very easy to do — add the
 * key in your host's dashboard and leave the value blank) passes straight through
 * and `new URL('')` throws at build time. This validates every candidate and
 * falls through to the next one.
 *
 * Only NEXT_PUBLIC_* variables are read, so the server and the browser always
 * agree on the value and hydration never mismatches on a rendered URL.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_VERCEL_URL, // set automatically on Vercel deployments
  ];

  for (const candidate of candidates) {
    const value = candidate?.trim();
    if (!value) continue;
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      return new URL(withProtocol).origin; // normalises and drops any trailing slash
    } catch {
      // Not a usable URL — try the next candidate.
    }
  }

  return FALLBACK_URL;
}

export const SITE_URL = resolveSiteUrl();

/**
 * Single source of truth for business details.
 * Replace the placeholder contact values below and the whole site updates.
 */
export const site = {
  name: 'Gifts by Laraib',
  shortName: 'GBL',
  tagline: 'Thoughtfully gifted. Beautifully remembered.',
  description:
    'Customized gift baskets and hampers, hand-packed in Pakistan for birthdays, weddings, Eid, anniversaries and every moment worth marking. Choose a signature basket or build your own.',
  url: SITE_URL,
  locale: 'en_PK',
  currency: 'PKR',

  /* ---- REPLACE THESE ---- */
  whatsapp: {
    /** International format, digits only. Placeholder — swap for the real number. */
    number: '923001234567',
    display: '+92 300 123 4567',
  },
  email: 'hello@giftsbylaraib.com',
  instagram: {
    handle: '@giftsbylaraib',
    url: 'https://instagram.com/giftsbylaraib',
  },
  facebook: 'https://facebook.com/giftsbylaraib',
  /* ----------------------- */

  city: 'Lahore',
  serviceArea: 'Nationwide delivery across Pakistan',
  hours: 'Mon – Sat, 11am – 8pm PKT',

  delivery: {
    lahoreSameDay: 'Same-day delivery in Lahore for orders placed before 1pm',
    nationwide: '2–4 working days nationwide via Leopards / TCS',
    freeOver: 8000,
  },

  nav: [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: 'Occasions', href: '/occasions' },
    { label: 'Customize', href: '/customize' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],

  footerLinks: {
    Explore: [
      { label: 'All Baskets', href: '/shop' },
      { label: 'Occasions', href: '/occasions' },
      { label: 'Build Your Own', href: '/customize' },
      { label: 'Corporate Gifting', href: '/occasions/corporate' },
    ],
    Company: [
      { label: 'Our Story', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'FAQs', href: '/faqs' },
    ],
    Help: [
      { label: 'Shipping & Delivery', href: '/shipping' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
} as const;

export type Site = typeof site;
