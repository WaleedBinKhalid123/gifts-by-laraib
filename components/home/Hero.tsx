'use client';

import Image from '@/components/ui/Img';
import { ArrowDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DottedRule, Sparkle, Wash } from '@/components/ui/Ornament';
import { useParallax } from '@/lib/useParallax';
import { photo } from '@/lib/utils';

const HEADLINE_A = ['Thoughtfully', 'Gifted.'];
const HEADLINE_B = 'Beautifully Remembered.';

/**
 * Layers move at different rates as the section leaves the viewport. Written
 * straight to `style.transform` by the shared scroll ticker — no re-render per
 * frame, and no opacity ever driven below 1 on the copy, so the headline can
 * never be caught mid-fade in a blank state.
 */
const LAYERS = [
  { y: [0, 12] as [number, number], scale: [1, 1.06] as [number, number], minWidth: 640 }, // main plate
  { y: [0, -22] as [number, number], minWidth: 640 }, // ribbon card
  { y: [0, 28] as [number, number], minWidth: 640 }, // bloom card
  { y: [0, 16] as [number, number], minWidth: 1024 }, // copy column
];

export function Hero() {
  const { containerRef, setLayer } = useParallax<HTMLElement>(LAYERS);

  return (
    <section
      ref={containerRef}
      aria-label="Gifts by Laraib — customized gift baskets"
      className="relative overflow-hidden bg-cream pb-[clamp(2.5rem,1.5rem+3vw,4rem)] pt-[calc(var(--nav-h)+clamp(1.75rem,0.75rem+4vw,3.5rem))]"
    >
      <Wash className="left-[-18%] top-[-14%] h-[46rem] w-[46rem]" />
      <Wash className="right-[-14%] top-[8%] h-[38rem] w-[38rem]" from="238,220,184" opacity={0.55} />

      <div className="shell relative">
        <div className="grid items-center gap-[clamp(2.5rem,1.5rem+4vw,4.5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.02fr)]">
          {/* ---------- Copy ---------- */}
          <div ref={setLayer(3)} className="relative z-10 max-w-[36rem] will-change-transform">
            <div className="fade-in flex items-center gap-3" style={{ animationDelay: '40ms' }}>
              <Sparkle className="h-3 w-3 text-gold-400" />
              <span className="text-label uppercase tracking-[0.26em] text-rose-600">
                Customized gift baskets · Pakistan
              </span>
            </div>

            <h1 className="mt-6 font-display font-light text-wine-800">
              <span className="sr-only">Thoughtfully gifted. Beautifully remembered.</span>
              <span aria-hidden className="block text-display-lg leading-[0.95]">
                {HEADLINE_A.map((w, i) => (
                  <span key={w} className="block overflow-hidden pb-[0.06em]">
                    <span className="rise-in block" style={{ animationDelay: `${60 + i * 70}ms` }}>
                      {w}
                    </span>
                  </span>
                ))}
              </span>
              <span aria-hidden className="mt-1 block overflow-hidden pb-[0.12em]">
                <span
                  className="rise-in block font-script text-[clamp(2.4rem,1.4rem+3.6vw,4.6rem)] leading-[1.05] text-rose-500"
                  style={{ animationDelay: '200ms' }}
                >
                  {HEADLINE_B}
                </span>
              </span>
            </h1>

            <div className="fade-in" style={{ animationDelay: '260ms' }}>
              <DottedRule width={170} className="mt-8" />
              <p className="mt-7 max-w-prose text-[1.0625rem] leading-[1.8] text-ink-soft sm:text-[1.125rem]">
                Curated and customized gift baskets, hand-packed for the moments you want them to
                remember. Choose a signature basket — or build one, piece by piece, around the person
                opening it.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <Button href="/shop" size="lg" magnetic>
                  Explore Gifts
                </Button>
                <Button href="/customize" variant="outline" size="lg">
                  Create Your Basket
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-[0.8125rem] text-ink-muted">
                <span className="flex items-center gap-1.5">
                  <span className="flex" aria-hidden>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" strokeWidth={0} />
                    ))}
                  </span>
                  <span className="ml-1">
                    <strong className="font-medium text-wine-700">5.0</strong> from 200+ gifts sent
                  </span>
                </span>
                <span className="hidden h-3 w-px bg-blush-300 sm:block" aria-hidden />
                <span>Same-day delivery in Lahore</span>
              </div>
            </div>
          </div>

          {/* ---------- Composition ---------- */}
          <div className="relative">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] sm:aspect-[5/6]">
              <div
                aria-hidden
                className="fade-in absolute inset-x-[6%] bottom-[6%] top-[10%] rounded-[999px] bg-blush-100"
                style={{ animationDelay: '60ms' }}
              />

              {/* Main image */}
              <div
                ref={setLayer(0)}
                className="absolute inset-x-[10%] bottom-[2%] top-[4%] overflow-hidden rounded-[14rem_14rem_1.75rem_1.75rem] shadow-float will-change-transform"
              >
                <Image
                  src={photo('photo-1557492993-01989e8ed6d7', 1100)}
                  alt="A wicker gift basket layered with pastel boxes, ribbon and pampering pieces"
                  fill
                  priority
                  fetchPriority="high"
                  quality={72}
                  sizes="(max-width: 640px) 80vw, (max-width: 1024px) 60vw, 34vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-wine-900/20 via-transparent to-transparent"
                />
              </div>

              {/* Floating detail — ribbon */}
              <figure
                ref={setLayer(1)}
                className="fade-in absolute -left-2 top-[12%] w-[38%] max-w-[11rem] -rotate-6 overflow-hidden rounded-lg border-[6px] border-cream shadow-lift will-change-transform sm:-left-6"
                style={{ animationDelay: '300ms' }}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={photo('photo-1646182504823-a02b768e28b5', 420)}
                    alt="A gift wrapped in blush ribbon on a floral backdrop"
                    fill
                    sizes="(max-width: 640px) 34vw, 180px"
                    className="object-cover"
                  />
                </div>
              </figure>

              {/* Floating detail — blooms */}
              <figure
                ref={setLayer(2)}
                className="fade-in absolute -right-1 bottom-[14%] w-[34%] max-w-[10rem] rotate-[5deg] overflow-hidden rounded-lg border-[6px] border-cream shadow-lift will-change-transform sm:-right-6"
                style={{ animationDelay: '340ms' }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo('photo-1579664872746-55e2a805d705', 360)}
                    alt="Preserved pink peonies against a pale background"
                    fill
                    sizes="(max-width: 640px) 30vw, 160px"
                    className="object-cover"
                  />
                </div>
              </figure>

              {/* Seal */}
              <div
                className="pop-in absolute -bottom-3 left-[6%] grid h-[5.5rem] w-[5.5rem] place-items-center rounded-full bg-wine-700 text-cream shadow-lift sm:h-[6.5rem] sm:w-[6.5rem]"
                style={{ animationDelay: '380ms' }}
              >
                <div className="text-center leading-tight">
                  <span className="block font-script text-[1.35rem] sm:text-[1.6rem]">hand</span>
                  <span className="block text-[0.5rem] uppercase tracking-[0.2em] text-blush-300">
                    packed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div
          className="fade-in mt-[clamp(1.75rem,1rem+2vw,3rem)] hidden items-center gap-3 lg:flex"
          style={{ animationDelay: '420ms' }}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-blush-300 text-rose-500">
            <ArrowDown className="h-4 w-4 animate-drift motion-reduce:animate-none" strokeWidth={1.4} />
          </span>
          <span className="text-label uppercase tracking-[0.24em] text-ink-faint">
            What are you celebrating?
          </span>
        </div>
      </div>
    </section>
  );
}
