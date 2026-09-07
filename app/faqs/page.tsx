import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { FinalCTA } from '@/components/home/FinalCTA';
import { Reveal } from '@/components/ui/Reveal';
import { faqs } from '@/lib/content/faqs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'FAQs',
  description:
    'Ordering, customization, delivery times, payment and bulk gifting — the questions we get asked most about our customized gift baskets.',
  alternates: { canonical: '/faqs' },
  openGraph: { title: `FAQs · ${site.name}`, url: `${site.url}/faqs` },
};

const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FaqsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader
        crumbs={[{ label: 'FAQs' }]}
        eyebrow="Good questions"
        title="Everything you'd probably ask on WhatsApp anyway."
        lede="And if the answer isn't here, just message us — we'd rather answer it properly than have you guess."
      />

      <section className="bg-cream pb-section">
        <div className="shell max-w-3xl">
          <ul className="border-t border-blush-200">
            {faqs.map((f, i) => (
              <Reveal key={f.q} as="li" delay={Math.min(i * 0.04, 0.2)}>
                <details className="group border-b border-blush-200 py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                    <h2 className="font-display text-[1.25rem] font-light leading-snug text-wine-800 transition-colors duration-300 group-open:text-rose-600 sm:text-[1.375rem]">
                      {f.q}
                    </h2>
                    <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-blush-300 text-rose-500 transition-transform duration-500 ease-expo group-open:rotate-45">
                      <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </span>
                  </summary>
                  <p className="mt-4 max-w-prose pr-12 text-[0.9375rem] leading-[1.85] text-ink-soft">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <p className="mt-12 text-[0.9375rem] leading-relaxed text-ink-soft">
              Still unsure?{' '}
              <Link href="/contact" className="link-underline text-wine-700">
                Send us a message
              </Link>{' '}
              — or read about{' '}
              <Link href="/shipping" className="link-underline text-wine-700">
                shipping &amp; delivery
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
