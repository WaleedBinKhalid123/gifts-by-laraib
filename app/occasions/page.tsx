import type { Metadata } from 'next';
import Image from '@/components/ui/Img';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { occasions } from '@/lib/content/occasions';
import { productsByOccasion } from '@/lib/content/products';
import { PageHeader } from '@/components/layout/PageHeader';
import { FinalCTA } from '@/components/home/FinalCTA';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/lib/site';
import { photo } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Gift Baskets by Occasion',
  description:
    'Gift baskets for birthdays, anniversaries, weddings, bridal showers, Valentine’s Day, Eid, Mother’s Day, graduation and corporate gifting. Customized and delivered across Pakistan.',
  alternates: { canonical: '/occasions' },
  openGraph: { title: `Gift Baskets by Occasion · ${site.name}`, url: `${site.url}/occasions` },
};

export default function OccasionsPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Occasions' }]}
        eyebrow="Browse by moment"
        title="What are you celebrating?"
        lede="The occasion decides almost everything — the colours, the contents, the tone of the note. Pick the moment and we'll show you what fits."
      />

      <section className="bg-cream pb-section">
        <div className="shell">
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {occasions.map((o, i) => {
              const count = productsByOccasion(o.slug).length;
              return (
                <Reveal key={o.slug} delay={(i % 3) * 0.07}>
                  <Link href={`/occasions/${o.slug}`} className="group block">
                    <div className="relative aspect-[5/4] overflow-hidden rounded-[1.5rem] bg-blush-100 shadow-petal transition-[transform,box-shadow] duration-[700ms] ease-expo group-hover:-translate-y-1.5 group-hover:shadow-lift">
                      <Image
                        src={photo(o.image.id, 800)}
                        alt={o.image.alt}
                        fill
                        loading={i < 3 ? 'eager' : 'lazy'}
                        sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                        className="object-cover transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.06]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-wine-900/70 via-wine-900/10 to-transparent"
                      />
                      <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream/92 text-[1.05rem] backdrop-blur-sm">
                        <span aria-hidden>{o.emoji}</span>
                      </span>
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                        <h2 className="font-display text-[1.5rem] font-light text-cream">{o.name}</h2>
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cream/40 text-cream transition-all duration-500 ease-expo group-hover:bg-cream group-hover:text-wine-800">
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                        </span>
                      </div>
                    </div>

                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-soft">{o.line}</p>
                    <p className="mt-2 text-[0.75rem] uppercase tracking-[0.16em] text-ink-faint">
                      {count} {count === 1 ? 'basket' : 'baskets'}
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
