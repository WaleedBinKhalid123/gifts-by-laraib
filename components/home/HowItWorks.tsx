'use client';

import { useEffect, useRef } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { subscribeScroll, prefersReducedMotion } from '@/lib/scroll';

const STEPS = [
  {
    n: '01',
    title: 'Choose your occasion',
    body: 'Birthday, nikkah, Eid, or an ordinary Tuesday that needs lifting. It changes everything that follows.',
  },
  {
    n: '02',
    title: 'Pick or build your basket',
    body: 'Start from a signature basket and swap pieces out, or build one from scratch in the configurator.',
  },
  {
    n: '03',
    title: 'Add your message',
    body: 'Send us your words. We write them by hand onto a card and tuck it under the ribbon.',
  },
  {
    n: '04',
    title: 'We create & deliver',
    body: 'Packed, photographed before it leaves, and delivered — same day in Lahore, 2–4 days nationwide.',
  },
];

/** A shallow double wave that passes through the step markers. */
const RIBBON = 'M0 30 Q 300 -6 600 30 T 1200 30';
const RIBBON_LENGTH = 1300; // generous over-estimate; dashoffset clamps fine

export function HowItWorks() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) return;

    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = '0';
      return;
    }

    const len = path.getTotalLength() || RIBBON_LENGTH;
    path.style.strokeDasharray = String(len);
    path.style.strokeDashoffset = String(len);

    return subscribeScroll(() => {
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Draws while the block travels through the lower two-thirds of the screen.
      const p = Math.max(0, Math.min(1, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)));
      path.style.strokeDashoffset = String(len * (1 - p));
    });
  }, []);

  return (
    <section aria-labelledby="how-heading" className="relative bg-cream py-section">
      <div className="shell">
        <SectionHeading
          eyebrow="How it works"
          title="Four steps, and"
          script="nothing left to chance."
          align="center"
        />
        <h2 id="how-heading" className="sr-only">
          How ordering works
        </h2>

        <div ref={wrapRef} className="relative mt-[clamp(2.25rem,1.5rem+2.5vw,3.5rem)]">
          <svg
            aria-hidden
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 top-[44px] hidden h-[120px] w-full lg:block"
          >
            <path
              d={RIBBON}
              stroke="#F5CFDE"
              strokeWidth="1.25"
              strokeDasharray="4 8"
              fill="none"
              strokeLinecap="round"
            />
            <path ref={pathRef} d={RIBBON} stroke="#E4578F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </svg>

          <ol className="relative grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-reveal
                className="reveal relative"
                style={{ transitionDelay: `${i * 110}ms` }}
              >
                <span
                  className="block font-display text-[3.25rem] font-light leading-none text-transparent lg:text-[3.75rem]"
                  style={{ WebkitTextStroke: '1px #EDB2C9' }}
                  aria-hidden
                >
                  {s.n}
                </span>
                <span className="mt-4 block h-2.5 w-2.5 rounded-full bg-rose-500 ring-4 ring-blush-100" aria-hidden />
                <h3 className="mt-4 font-display text-[1.375rem] font-light leading-snug text-wine-800">
                  {s.title}
                </h3>
                <p className="mt-3 max-w-[24rem] text-[0.9375rem] leading-relaxed text-ink-muted lg:max-w-none">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
