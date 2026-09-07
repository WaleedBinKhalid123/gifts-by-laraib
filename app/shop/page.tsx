import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { FinalCTA } from '@/components/home/FinalCTA';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Shop Gift Baskets',
  description:
    'Browse customized gift baskets and hampers from Gifts by Laraib — self-care, romance, birthday, bridal, Eid and corporate. Every basket can be personalised. Delivery across Pakistan.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: `Shop Gift Baskets · ${site.name}`,
    description: 'Customized gift baskets and hampers, hand-packed and delivered across Pakistan.',
    url: `${site.url}/shop`,
  },
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Shop' }]}
        eyebrow="The collection"
        title="Every basket, in one place."
        lede="Start from any of these and change whatever you like — the contents, the size, the wrapping, the note. Nothing here is fixed."
      />

      <section className="bg-cream pb-section">
        <div className="shell">
          <ProductGrid />
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
