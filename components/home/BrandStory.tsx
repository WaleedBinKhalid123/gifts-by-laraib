'use client';

import Image from '@/components/ui/Img';
import { Reveal, RevealText } from '@/components/ui/Reveal';
import { useParallax } from '@/lib/useParallax';
import { Button } from '@/components/ui/Button';
import { DottedRule } from '@/components/ui/Ornament';
import { photo } from '@/lib/utils';

const STATS = [
  { value: '200+', label: 'Baskets sent' },
  { value: '18', label: 'Cities delivered to' },
  { value: '100%', label: 'Notes written by hand' },
];

export function BrandStory() {
  const { containerRef, setLayer } = useParallax<HTMLElement>([
    { y: [-6, 6], minWidth: 768 },
    { y: [12, -12], minWidth: 768 },
  ]);

  return (
    <section ref={containerRef} aria-labelledby="story-heading" className="paper relative overflow-hidden py-section">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-20">
          {/* Imagery */}
          <div className="relative">
            <div
              ref={setLayer(0)}
              className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush-100 shadow-lift will-change-transform"
            >
              <Image
                src={photo('photo-1633074157732-731f042cf9b1', 1100)}
                alt="A woven hamper being layered with tissue, ribbon and hand-picked gifts"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 92vw, 44vw"
                className="object-cover"
              />
            </div>

            <figure
              ref={setLayer(1)}
              className="absolute -bottom-8 -right-3 w-[46%] max-w-[15rem] overflow-hidden rounded-xl border-[8px] border-cream shadow-float will-change-transform sm:-right-8"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={photo('photo-1543769657-fcf1236421bc', 480)}
                  alt="A card being written out by hand in flowing script"
                  fill
                  loading="lazy"
                  sizes="240px"
                  className="object-cover"
                />
              </div>
            </figure>

            <span
              aria-hidden
              className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-full border border-blush-300 lg:block"
            />
          </div>

          {/* Copy */}
          <div className="lg:pl-4">
            <Reveal>
              <span className="text-label uppercase tracking-[0.24em] text-rose-600">Our story</span>
            </Reveal>

            <RevealText
              text="Every gift has a story."
              delay={0.05}
              className="mt-5 font-display text-display-md font-light text-wine-800"
            />

            <Reveal delay={0.2}>
              <DottedRule width={150} className="mt-7" />
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-7 space-y-5 text-[1.0625rem] leading-[1.85] text-ink-soft">
                <p>
                  It began with one basket, made for a friend who was having a genuinely terrible
                  month. Nothing expensive — a candle, a hand cream, her favourite chocolate, and a
                  note that said the thing nobody had said out loud.
                </p>
                <p>
                  She called crying. Then her sister asked for one. Then someone from work. Laraib
                  kept making them at the kitchen table until the kitchen table stopped being big
                  enough.
                </p>
                <p>
                  What has never changed is the part that matters: someone sits down, thinks about
                  the person actually opening it, and puts the basket together by hand. No two are
                  identical, because no two people are.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <figure className="mt-9 border-l-2 border-rose-300 pl-6">
                <blockquote className="font-display text-[1.375rem] font-light italic leading-snug text-wine-700">
                  “A gift should feel like it was made for one person. If it could have been for
                  anyone, we haven&apos;t finished it yet.”
                </blockquote>
                <figcaption className="mt-3 font-script text-[1.5rem] text-rose-500">
                  Laraib
                </figcaption>
              </figure>
            </Reveal>

            <Reveal delay={0.34}>
              <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-blush-200 pt-8">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <span className="block font-display text-[1.875rem] font-light text-wine-700">
                        {s.value}
                      </span>
                      <span className="mt-1 block text-[0.75rem] uppercase tracking-[0.14em] text-ink-faint">
                        {s.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.38}>
              <div className="mt-10">
                <Button href="/about" variant="outline" size="lg">
                  Read the full story
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
