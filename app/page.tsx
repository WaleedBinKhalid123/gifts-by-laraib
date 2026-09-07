import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { TrustBar } from '@/components/home/TrustBar';
import { OccasionRail } from '@/components/home/OccasionRail';
import { FeaturedBaskets } from '@/components/home/FeaturedBaskets';
import { CustomizeTeaser } from '@/components/home/CustomizeTeaser';
import { HowItWorks } from '@/components/home/HowItWorks';
import { BrandStory } from '@/components/home/BrandStory';
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel';
import { InstagramGallery } from '@/components/home/InstagramGallery';
import { FinalCTA } from '@/components/home/FinalCTA';
import { site } from '@/lib/site';
import { featuredProducts } from '@/lib/content/products';

export const metadata: Metadata = {
  title: 'Customized Gift Baskets & Hampers | Gifts by Laraib',
  description: site.description,
  alternates: { canonical: '/' },
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Featured gift baskets',
  itemListElement: featuredProducts().map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: `${site.url}/shop/${p.slug}`,
    name: p.name,
  })),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <Hero />
      <TrustBar />
      <OccasionRail />
      <FeaturedBaskets />
      <CustomizeTeaser />
      <HowItWorks />
      <BrandStory />
      <TestimonialCarousel />
      <InstagramGallery />
      <FinalCTA />
    </>
  );
}
