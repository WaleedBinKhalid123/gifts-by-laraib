'use client';

import Image from '@/components/ui/Img';
import { Button } from '@/components/ui/Button';
import { useParallax } from '@/lib/useParallax';
import { RevealText, Reveal } from '@/components/ui/Reveal';
import { DottedRule } from '@/components/ui/Ornament';
import { waGeneral } from '@/lib/whatsapp';
import { photo } from '@/lib/utils';

export function FinalCTA() {
  const { containerRef, setLayer } = useParallax<HTMLElement>([{ y: [-8, 8], minWidth: 768 }]);

  return (
    <section ref={containerRef} aria-labelledby="cta-heading" className="bg-cream pb-section">
      <div className="shell">
        <div className="relative overflow-hidden rounded-[2rem] bg-wine-900 sm:rounded-[2.5rem]">
          {/* Parallax plate */}
          <div ref={setLayer(0)} className="absolute inset-0 -top-[10%] h-[120%] will-change-transform">
            <Image
              src={photo('photo-1680563094046-5d846e2c59d1', 1400)}
              alt=""
              aria-hidden
              fill
              loading="lazy"
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-wine-900/95 via-wine-900/88 to-wine-800/84"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full opacity-40"
            style={{ background: 'radial-gradient(closest-side,#E4578F 0%,rgba(228,87,143,0.4) 42%,rgba(64,7,30,0) 78%)' }}
          />

          <div className="relative px-6 py-[clamp(4rem,3rem+6vw,8rem)] text-center sm:px-12">
            <Reveal>
              <span className="text-label uppercase tracking-[0.26em] text-gold-300">
                Nothing here quite right?
              </span>
            </Reveal>

            <RevealText
              text="Have something special in mind?"
              delay={0.06}
              className="mx-auto mt-6 max-w-4xl font-display text-display-md font-light text-cream"
            />

            <Reveal delay={0.24}>
              <div className="mt-6 flex justify-center">
                <DottedRule width={180} className="text-blush-400/60" />
              </div>
            </Reveal>

            <Reveal delay={0.28}>
              <p className="mx-auto mt-7 max-w-xl text-[1.0625rem] leading-[1.8] text-blush-200/80">
                Tell us who it&apos;s for, what they love and roughly what you want to spend. We&apos;ll
                come back with a basket designed around them — usually the same day.
              </p>
            </Reveal>

            <Reveal delay={0.34}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Button href="/customize" size="lg" className="bg-cream text-wine-800 hover:bg-blush-100" magnetic>
                  Create Your Basket
                </Button>
                <Button href={waGeneral()} external variant="wa" size="lg">
                  Chat on WhatsApp
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="mt-8 font-script text-[1.75rem] text-blush-300">
                We reply to every message ourselves.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export { FinalCTA as CTASection };
