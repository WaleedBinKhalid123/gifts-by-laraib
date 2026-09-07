import type { Metadata } from 'next';
import Image from '@/components/ui/Img';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { occasions, getOccasion } from '@/lib/content/occasions';
import { productsByOccasion } from '@/lib/content/products';
import { ProductGrid } from '@/components/shop/ProductGrid';
import { PageHeader } from '@/components/layout/PageHeader';
import { FinalCTA } from '@/components/home/FinalCTA';
import { RevealImage, Reveal } from '@/components/ui/Reveal';
import { site } from '@/lib/site';
import { photo } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return occasions.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) return { title: 'Occasion not found' };

  return {
    title: `${occasion.name} Gift Baskets`,
    description: `${occasion.blurb} Customized ${occasion.name.toLowerCase()} gift baskets from ${site.name}, delivered across Pakistan.`,
    alternates: { canonical: `/occasions/${occasion.slug}` },
    openGraph: {
      title: `${occasion.name} Gift Baskets · ${site.name}`,
      description: occasion.blurb,
      url: `${site.url}/occasions/${occasion.slug}`,
      images: [{ url: photo(occasion.image.id, 1200), alt: occasion.image.alt }],
    },
  };
}

export default async function OccasionPage({ params }: Params) {
  const { slug } = await params;
  const occasion = getOccasion(slug);
  if (!occasion) notFound();

  const items = productsByOccasion(occasion.slug);
  const others = occasions.filter((o) => o.slug !== occasion.slug).slice(0, 6);

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Occasions', href: '/occasions' }, { label: occasion.name }]}
        eyebrow={`${occasion.emoji} ${occasion.name}`}
        title={occasion.line}
        lede={occasion.blurb}
      />

      <section className="bg-cream pb-section">
        <div className="shell">
          <RevealImage className="relative aspect-[16/7] w-full overflow-hidden rounded-[2rem] bg-blush-100 sm:aspect-[21/8]">
            <div className="relative h-full w-full">
              <Image
                src={photo(occasion.image.id, 1500)}
                alt={occasion.image.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div aria-hidden className="absolute inset-0 bg-wine-900/15" />
            </div>
          </RevealImage>

          <div className="mt-14">
            <ProductGrid items={items.length > 0 ? items : undefined} initialOccasion={items.length > 0 ? undefined : occasion.slug} />
          </div>

          {/* Cross-links keep discovery going */}
          <Reveal>
            <div className="mt-section border-t border-blush-200 pt-12">
              <p className="text-label uppercase text-ink-faint">Other occasions</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/occasions/${o.slug}`}
                    className="rounded-full border border-blush-300 px-4 py-2 text-[0.875rem] text-ink-soft transition-colors hover:border-rose-400 hover:text-wine-700"
                  >
                    <span aria-hidden className="mr-1.5">{o.emoji}</span>
                    {o.name}
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
