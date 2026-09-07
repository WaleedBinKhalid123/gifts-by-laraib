import Image from '@/components/ui/Img';
import { Instagram } from 'lucide-react';
import { gallery } from '@/lib/content/gallery';
import { site } from '@/lib/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { cn, photo } from '@/lib/utils';

const SPANS: Record<string, string> = {
  hero: 'col-span-2 row-span-2 md:col-span-2 md:row-span-2',
  tall: 'col-span-1 row-span-2',
  wide: 'col-span-2 row-span-1',
  square: 'col-span-1 row-span-1',
};

export function InstagramGallery() {
  return (
    <section aria-labelledby="gallery-heading" className="bg-cream py-section">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow={site.instagram.handle}
            title="From the"
            script="packing table."
            className="sm:max-w-xl"
          />
          <Reveal delay={0.1}>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 text-[0.8125rem] uppercase tracking-[0.18em] text-wine-700 sm:pb-2"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
              <span className="link-underline">Follow along</span>
            </a>
          </Reveal>
        </div>
        <h2 id="gallery-heading" className="sr-only">
          Gift basket gallery
        </h2>

        <Reveal delay={0.05}>
          <div className="mt-10 grid auto-rows-[9.5rem] grid-flow-dense grid-cols-2 gap-3 sm:auto-rows-[11.5rem] md:grid-cols-4 md:gap-4 lg:auto-rows-[13.5rem]">
            {gallery.map((item) => (
              <a
                key={item.id}
                href={item.href ?? site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'group relative overflow-hidden rounded-lg bg-blush-100 md:rounded-xl',
                  SPANS[item.span],
                )}
              >
                <Image
                  src={photo(item.image.id, item.span === 'hero' ? 900 : 560)}
                  alt={item.image.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] ease-expo group-hover:scale-[1.07]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-wine-900/0 transition-colors duration-[600ms] group-hover:bg-wine-900/55"
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 transition-opacity duration-[600ms] group-hover:opacity-100">
                  <Instagram className="h-5 w-5 text-cream" strokeWidth={1.4} />
                  <p className="mt-2 text-[0.875rem] leading-snug text-cream">{item.caption}</p>
                  <p className="mt-1 text-[0.6875rem] uppercase tracking-[0.18em] text-blush-300">
                    View on Instagram
                  </p>
                </div>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
