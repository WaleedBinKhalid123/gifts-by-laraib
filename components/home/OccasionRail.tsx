'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { occasions } from '@/lib/content/occasions';
import { OccasionCard } from '@/components/home/OccasionCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useRail } from '@/lib/useRail';
import { Wash } from '@/components/ui/Ornament';

export function OccasionRail() {
  const { railProps, progress, atStart, atEnd, scrollable, page } = useRail<HTMLDivElement>();

  return (
    <section
      aria-labelledby="occasions-heading"
      className="paper relative overflow-hidden py-section"
    >
      <Wash className="right-[-12%] top-[10%] h-[34rem] w-[34rem]" from="245,207,222" opacity={0.75} />

      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Start here"
            title="What are you"
            script="celebrating?"
            lede="Every occasion asks for something slightly different. Pick the moment and we'll show you the baskets built for it."
            className="lg:max-w-xl"
          />

          <div className="flex items-center gap-3 lg:pb-2" hidden={!scrollable}>
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label="Previous occasions"
              className="grid h-11 w-11 place-items-center rounded-full border border-blush-300 text-wine-700 transition-all duration-300 ease-expo hover:border-wine-700 hover:bg-wine-700 hover:text-cream disabled:opacity-30 disabled:hover:border-blush-300 disabled:hover:bg-transparent disabled:hover:text-wine-700"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label="More occasions"
              className="grid h-11 w-11 place-items-center rounded-full border border-blush-300 text-wine-700 transition-all duration-300 ease-expo hover:border-wine-700 hover:bg-wine-700 hover:text-cream disabled:opacity-30 disabled:hover:border-blush-300 disabled:hover:bg-transparent disabled:hover:text-wine-700"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <h2 id="occasions-heading" className="sr-only">
        Shop gift baskets by occasion
      </h2>

      <div data-reveal className="reveal mt-10">
        <div
          {...railProps}
          className="rail no-scrollbar flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4 sm:gap-5"
        >
          {occasions.map((o, i) => (
            <OccasionCard key={o.slug} occasion={o} index={i} />
          ))}

          {/* Tail card — keeps the rail from ending abruptly and converts */}
          <Link
            href="/customize"
            className="group relative flex w-[68vw] shrink-0 snap-start flex-col justify-between rounded-[9rem_9rem_1.25rem_1.25rem] border border-blush-300 bg-cream p-6 pt-14 transition-[transform,box-shadow] duration-[600ms] ease-expo hover:-translate-y-2 hover:shadow-lift sm:w-[19rem] lg:w-[17.5rem]"
          >
            <div className="text-center">
              <span className="font-script text-[2.4rem] leading-none text-rose-500">Something</span>
              <span className="mt-1 block font-display text-[1.5rem] font-light text-wine-800">
                else entirely?
              </span>
              <p className="mx-auto mt-4 max-w-[15rem] text-[0.875rem] leading-relaxed text-ink-muted">
                Tell us the person, the moment and the budget. We&apos;ll design the basket around them.
              </p>
            </div>
            <span className="mt-8 inline-flex items-center justify-center gap-2 text-[0.8125rem] uppercase tracking-[0.18em] text-wine-700">
              Build your own
              <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-expo group-hover:translate-x-1.5" strokeWidth={1.5} />
            </span>
          </Link>
        </div>

        {/* Progress rule */}
        <div className="shell mt-6">
          <div className="h-px w-full max-w-xs bg-blush-200">
            <div
              className="h-px bg-rose-500 transition-[width] duration-200 ease-out"
              style={{ width: `${Math.max(12, progress * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
