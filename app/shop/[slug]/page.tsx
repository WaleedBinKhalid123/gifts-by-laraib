import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { getProduct, hasPriceRange, priceFrom, priceTo, products, relatedProducts } from '@/lib/content/products';
import { occasions } from '@/lib/content/occasions';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductOrderPanel } from '@/components/product/ProductOrderPanel';
import { ProductCard } from '@/components/shop/ProductCard';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { DottedRule } from '@/components/ui/Ornament';
import { site } from '@/lib/site';
import { formatPKR, photo } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: 'Basket not found' };

  const description = `${product.tagline}. ${product.description.slice(0, 120)}…`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} · ${site.name}`,
      description,
      url: `${site.url}/shop/${product.slug}`,
      images: [{ url: photo(product.images[0].id, 1200), width: 1200, height: 1500, alt: product.images[0].alt }],
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product);
  const productOccasions = occasions.filter((o) => (product.occasions as string[]).includes(o.slug));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images.map((i) => photo(i.id, 1200)),
    brand: { '@type': 'Brand', name: site.name },
    sku: product.id,
    offers: product.variants?.length
      ? {
          '@type': 'AggregateOffer',
          url: `${site.url}/shop/${product.slug}`,
          priceCurrency: 'PKR',
          lowPrice: priceFrom(product),
          highPrice: priceTo(product),
          offerCount: product.variants.length,
          availability: product.available
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: site.name },
        }
      : {
          '@type': 'Offer',
          url: `${site.url}/shop/${product.slug}`,
          priceCurrency: 'PKR',
          price: product.price,
          availability: product.available
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: site.name },
        },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader
        crumbs={[{ label: 'Shop', href: '/shop' }, { label: product.name }]}
        eyebrow={product.tagline}
        title={product.name}
      />

      <section className="bg-cream pb-section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            {/* Gallery — sticky on large screens */}
            <div className="lg:sticky lg:top-[92px] lg:self-start">
              <ProductGallery images={product.images} name={product.name} />
            </div>

            {/* Details */}
            <div>
              <div className="flex flex-wrap items-baseline gap-4">
                <p className="font-display text-[2rem] text-wine-700">
                  {hasPriceRange(product) ? (
                    <span className="mr-2 font-sans text-[0.75rem] uppercase tracking-[0.16em] text-ink-faint">
                      from
                    </span>
                  ) : null}
                  {formatPKR(priceFrom(product))}
                </p>
                {product.compareAtPrice ? (
                  <p className="text-[1rem] text-ink-faint line-through">
                    {formatPKR(product.compareAtPrice)}
                  </p>
                ) : null}
                {product.customizable ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-100 px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-wine-700">
                    <Sparkles className="h-3 w-3 text-gold-400" strokeWidth={1.6} />
                    Fully customizable
                  </span>
                ) : null}
              </div>

              <p className="mt-6 text-[1.0625rem] leading-[1.85] text-ink-soft">{product.description}</p>

              <DottedRule width={140} className="mt-8" />

              <p className="mt-5 text-[0.8125rem] text-ink-muted">
                Want something swapped? Note it below, or{' '}
                <Link href="/customize" className="link-underline text-wine-700">
                  build the whole basket yourself
                </Link>
                .
              </p>

              {/* Occasion tags */}
              {productOccasions.length > 0 ? (
                <div className="mt-8">
                  <p className="text-label uppercase text-ink-faint">Gifted most for</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {productOccasions.map((o) => (
                      <Link
                        key={o.slug}
                        href={`/occasions/${o.slug}`}
                        className="rounded-full border border-blush-300 px-3.5 py-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:border-rose-400 hover:text-wine-700"
                      >
                        <span aria-hidden className="mr-1.5">{o.emoji}</span>
                        {o.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}

              <DottedRule width={140} className="mt-10" />

              <div className="mt-10">
                <ProductOrderPanel product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 ? (
        <section className="border-t border-blush-200 bg-blush-50 py-section">
          <div className="shell">
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <p className="text-label uppercase text-rose-600">You might also like</p>
                  <h2 className="mt-3 font-display text-display-xs font-light text-wine-800">
                    Often gifted alongside
                  </h2>
                </div>
                <Link href="/shop" className="link-underline hidden text-[0.8125rem] uppercase tracking-[0.18em] text-wine-700 sm:block">
                  All baskets
                </Link>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
