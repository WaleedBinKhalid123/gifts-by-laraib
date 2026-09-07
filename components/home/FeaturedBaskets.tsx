import Image from '@/components/ui/Img';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { featuredProducts, getProduct } from '@/lib/content/products';
import { ProductCard } from '@/components/shop/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { Reveal, RevealImage } from '@/components/ui/Reveal';
import { DottedRule, HeartMark } from '@/components/ui/Ornament';
import { formatPKR, photo } from '@/lib/utils';

export function FeaturedBaskets() {
  const spotlight = getProduct('pink-self-care-basket');
  const rest = featuredProducts()
    .filter((p) => p.slug !== spotlight?.slug)
    .slice(0, 3);

  return (
    <section aria-labelledby="featured-heading" className="relative bg-cream py-section">
      <div className="shell">
        <SectionHeading
          eyebrow="The collection"
          title="Made to make them"
          script="smile."
          lede="Each basket started as a real order for a real person. We kept the ones people came back for."
          align="center"
        />
        <h2 id="featured-heading" className="sr-only">
          Featured gift baskets
        </h2>

        {/* ---------- Spotlight ---------- */}
        {spotlight ? (
          <div className="mt-[clamp(2.5rem,1.75rem+2.5vw,4rem)] grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <RevealImage className="relative order-1 aspect-[5/6] overflow-hidden rounded-[2rem] bg-blush-100 shadow-lift lg:aspect-[4/5]">
              <div className="relative h-full w-full">
                <Image
                  src={photo(spotlight.images[0].id, 1100)}
                  alt={spotlight.images[0].alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
              </div>
            </RevealImage>

            <div className="order-2">
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full bg-blush-100 px-3.5 py-1.5 text-[0.6875rem] uppercase tracking-[0.18em] text-wine-700">
                  <HeartMark className="h-3 w-3 text-rose-500" />
                  Most gifted
                </span>
              </Reveal>

              <Reveal delay={0.06}>
                <h3 className="mt-5 font-display text-display-sm font-light text-wine-800">
                  {spotlight.name}
                </h3>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="mt-4 max-w-prose text-[1.0625rem] leading-[1.8] text-ink-soft">
                  {spotlight.description}
                </p>
              </Reveal>

              <Reveal delay={0.14}>
                <DottedRule width={140} className="mt-8" />
                <p className="mt-6 text-label uppercase text-rose-600">Inside the basket</p>
                <ul className="mt-5 space-y-3">
                  {spotlight.includes.map((item) => (
                    <li key={item.name} className="flex items-baseline gap-3">
                      <span aria-hidden className="mt-[2px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
                      <span className="text-[0.9375rem] text-ink-soft">
                        {item.name}
                        {item.note ? (
                          <span className="text-ink-faint"> — {item.note}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-9 flex flex-wrap items-center gap-5">
                  <span className="font-display text-[1.75rem] text-wine-700">
                    {formatPKR(spotlight.price)}
                  </span>
                  <Button href={`/shop/${spotlight.slug}`} size="lg" magnetic>
                    View Gift
                  </Button>
                  <Link
                    href="/customize"
                    className="link-underline text-[0.875rem] text-ink-soft hover:text-wine-700"
                  >
                    or swap the contents
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        ) : null}

        {/* ---------- Grid ---------- */}
        <div className="mt-[clamp(2.75rem,2rem+3vw,4.5rem)] grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <Reveal delay={0.05}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-3 text-[0.8125rem] uppercase tracking-[0.2em] text-wine-700"
            >
              View all baskets
              <span className="grid h-10 w-10 place-items-center rounded-full border border-blush-300 transition-all duration-500 ease-expo group-hover:border-wine-700 group-hover:bg-wine-700 group-hover:text-cream">
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
