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
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://giftsbylaraib.com',
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
