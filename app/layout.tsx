import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { InstagramFab } from '@/components/layout/InstagramFab';
import { PageTransition } from '@/components/layout/PageTransition';
import { site } from '@/lib/site';
import { REVEAL_ENGINE } from '@/lib/reveal-engine';

// site.url is validated in lib/site.ts, so this can no longer throw during the build.
const metadataBase = new URL(site.url);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: `${site.name} — Customized Gift Baskets & Hampers in Pakistan`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    'customized gift baskets',
    'gift hampers Pakistan',
    'personalized gifts',
    'birthday gift basket',
    'wedding gift hamper',
    'Eid hamper',
    'bridal gift box',
    'corporate gifting Pakistan',
    'gift delivery Lahore',
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Thoughtfully gifted. Beautifully remembered.`,
    description: site.description,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${site.name} gift baskets` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — Customized Gift Baskets`,
    description: site.description,
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFCFA',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${site.url}#business`,
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/og-image.jpg`,
  logo: `${site.url}/logo.png`,
  email: site.email,
  priceRange: 'Rs 2,900 – Rs 15,000',
  address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: 'PK' },
  areaServed: 'Pakistan',
  sameAs: [site.instagram.url],
  openingHours: 'Mo-Sa 11:00-20:00',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/*
          Runs synchronously before first paint. Adds `html.js`, which is the only
          thing that makes reveal elements start hidden, then drives them itself.
          Nothing about content visibility depends on React hydration.
        */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: REVEAL_ENGINE }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />

        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-wine-700 focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main">
          <PageTransition>{children}</PageTransition>
        </main>

        <Footer />
        <InstagramFab />
      </body>
    </html>
  );
}
