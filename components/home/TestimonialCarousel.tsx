'use client';

import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { testimonials } from '@/lib/content/testimonials';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useRail } from '@/lib/useRail';
import { cn } from '@/lib/utils';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TestimonialCarousel() {
  const { railProps, index, atStart, atEnd, scrollable, goTo } = useRail<HTMLDivElement>();

  return (
    <section aria-labelledby="reviews-heading" className="relative bg-blush-50 py-section">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Kind words"
            title="What people say"
            script="after they open it."
            className="lg:max-w-xl"
          />
          <div className="flex items-center gap-3 lg:pb-2" hidden={!scrollable}>
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              disabled={atStart}
              aria-label="Previous review"
              className="grid h-11 w-11 place-items-center rounded-full border border-blush-300 text-wine-700 transition-all duration-300 ease-expo hover:border-wine-700 hover:bg-wine-700 hover:text-cream disabled:opacity-30"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              disabled={atEnd}
              aria-label="Next review"
              className="grid h-11 w-11 place-items-center rounded-full border border-blush-300 text-wine-700 transition-all duration-300 ease-expo hover:border-wine-700 hover:bg-wine-700 hover:text-cream disabled:opacity-30"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
      <h2 id="reviews-heading" className="sr-only">
        Customer reviews
      </h2>

      <div data-reveal className="reveal mt-10">
        <div
          {...railProps}
          className="rail no-scrollbar mask-fade-r flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-gutter pb-2"
        >
          {testimonials.map((t) => (
            <figure
              key={t.id}
              className="flex w-[84vw] shrink-0 snap-center flex-col justify-between rounded-2xl border border-blush-200 bg-cream p-7 shadow-petal sm:w-[24rem] lg:w-[26rem]"
            >
              <div>
                <div className="flex items-center gap-1" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" strokeWidth={0} />
                  ))}
                </div>
                <span aria-hidden className="mt-5 block font-script text-[2.5rem] leading-none text-blush-300">
                  &ldquo;
                </span>
                <blockquote className="-mt-3 text-[1.0625rem] leading-[1.75] text-ink-soft">
                  {t.quote}
                </blockquote>
              </div>

              <figcaption className="mt-7 flex items-center gap-3 border-t border-blush-200 pt-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-wine-700 font-display text-[0.875rem] tracking-wide text-cream">
                  {initials(t.name)}
                </span>
                <span>
                  <span className="block font-display text-[1.0625rem] text-wine-800">{t.name}</span>
                  <span className="block text-[0.8125rem] text-ink-faint">
                    {t.occasion}
                    {t.city ? ` · ${t.city}` : ''}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="shell mt-8 flex items-center gap-2">
          {testimonials.map((t, i) => (
            <span
              key={t.id}
              aria-hidden
              className={cn(
                'h-1 rounded-full transition-all duration-500 ease-expo',
                i === index ? 'w-8 bg-rose-500' : 'w-2 bg-blush-300',
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
