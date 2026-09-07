import type { Metadata } from 'next';
import Image from '@/components/ui/Img';
import { PageHeader } from '@/components/layout/PageHeader';
import { FinalCTA } from '@/components/home/FinalCTA';
import { Reveal, RevealImage, RevealText } from '@/components/ui/Reveal';
import { DottedRule } from '@/components/ui/Ornament';
import { site } from '@/lib/site';
import { photo } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Our Story',
  description:
    'How Gifts by Laraib began — one basket for a friend having a difficult month, made at a kitchen table in Lahore. Today, customized gift baskets delivered across Pakistan.',
  alternates: { canonical: '/about' },
  openGraph: { title: `Our Story · ${site.name}`, url: `${site.url}/about` },
};

const VALUES = [
  {
    title: 'Chosen, not filled',
    body: 'Every piece has to earn its place. If it is only there to take up space, it comes out. A smaller basket of things someone will actually use beats a large one they quietly give away.',
  },
  {
    title: 'Written by hand',
    body: 'Every card is written out by hand, in ink, in the words you send us. It is the slowest part of what we do and the part people mention most.',
  },
  {
    title: 'Photographed before it leaves',
    body: 'You see exactly what was packed before it goes out. No surprises, no stock photo standing in for the real thing.',
  },
  {
    title: 'Answered by a person',
    body: 'There is no support desk. Messages come to Laraib, and she answers them — usually within the hour, often at unreasonable times of night.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'About' }]}
        eyebrow="Our story"
        title="Every gift has a story."
        lede="This one starts with a friend, a difficult month, and a basket that was never meant to become a business."
      />

      {/* Opening spread */}
      <section className="bg-cream pb-section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
            <RevealImage className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-blush-100 shadow-lift">
              <div className="relative h-full w-full">
                <Image
                  src={photo('photo-1508899203029-1c9eb493c9bd', 1400)}
                  alt="A gift basket being assembled by hand on a work surface"
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 52vw"
                  className="object-cover"
                />
              </div>
            </RevealImage>

            <div>
              <Reveal>
                <p className="text-[1.125rem] leading-[1.85] text-ink-soft">
                  In 2022 a friend of Laraib&apos;s was having a genuinely terrible month. Not a
                  dramatic one — the slow, grinding kind nobody sends flowers for.
                </p>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="mt-5 text-[1.0625rem] leading-[1.85] text-ink-soft">
                  So Laraib put together a basket. A candle, a hand cream, her friend&apos;s
                  ridiculous favourite chocolate, and a note that said the thing nobody had said out
                  loud. It cost less than dinner.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-5 text-[1.0625rem] leading-[1.85] text-ink-soft">
                  Her friend called crying. Then her sister asked for one. Then a colleague. Then a
                  stranger on Instagram. The kitchen table stopped being big enough somewhere around
                  the fortieth basket.
                </p>
              </Reveal>
              <Reveal delay={0.14}>
                <DottedRule width={150} className="mt-9" />
                <p className="mt-7 font-script text-[1.875rem] leading-snug text-rose-500">
                  Nothing about how we make them has changed since that first one.
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="paper py-section" aria-labelledby="values-heading">
        <div className="shell">
          <RevealText
            as="h2"
            text="What we refuse to rush."
            className="max-w-2xl font-display text-display-md font-light text-wine-800"
          />
          <span id="values-heading" className="sr-only">
            Our principles
          </span>

          <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 2) * 0.08}>
                <div className="border-t border-blush-300 pt-7">
                  <span className="font-display text-[0.875rem] tracking-[0.2em] text-rose-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-[1.5rem] font-light text-wine-800">
                    {v.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-[0.9375rem] leading-[1.8] text-ink-soft">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founder note */}
      <section className="bg-cream py-section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <Reveal>
                <p className="text-label uppercase text-rose-600">A note from Laraib</p>
              </Reveal>
              <Reveal delay={0.05}>
                <blockquote className="mt-6 font-display text-[1.5rem] font-light italic leading-[1.5] text-wine-700 sm:text-[1.75rem]">
                  “People think gifting is about the object. It isn&apos;t. It&apos;s about proving
                  you were paying attention. The basket is just where the proof goes.”
                </blockquote>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-7 max-w-prose text-[1.0625rem] leading-[1.85] text-ink-soft">
                  I still pack most of them myself. I still overthink the ribbon. And I still get a
                  small thrill when someone sends me a photo of the person opening it — which is,
                  honestly, the only reason any of this exists.
                </p>
                <p className="mt-6 font-script text-[2rem] text-rose-500">Laraib</p>
                <p className="mt-1 text-[0.75rem] uppercase tracking-[0.2em] text-ink-faint">
                  Founder · {site.city}
                </p>
              </Reveal>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative">
                <RevealImage className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-blush-100 shadow-lift">
                  <div className="relative h-full w-full">
                    <Image
                      src={photo('photo-1543769657-fcf1236421bc', 1000)}
                      alt="A note being written out by hand in flowing script"
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 92vw, 46vw"
                      className="object-cover"
                    />
                  </div>
                </RevealImage>
                <span aria-hidden className="absolute -bottom-5 -left-5 hidden h-28 w-28 rounded-full border border-blush-300 lg:block" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
