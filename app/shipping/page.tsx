import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { FinalCTA } from '@/components/home/FinalCTA';
import { site } from '@/lib/site';
import { formatPKR } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Shipping & Delivery',
  description:
    'Delivery times, charges and lead times for Gifts by Laraib — same-day in Lahore, 2–4 working days nationwide across Pakistan.',
  alternates: { canonical: '/shipping' },
};

const SECTIONS = [
  {
    h: 'Lahore',
    p: [
      'Orders confirmed before 1pm can be delivered the same day. After 1pm, we deliver the next morning.',
      'Lahore delivery is Rs 350, or free on orders over ' + formatPKR(site.delivery.freeOver) + '.',
      'Fresh flowers are only used for Lahore deliveries — everywhere else we use preserved blooms so nothing arrives wilted.',
    ],
  },
  {
    h: 'Nationwide',
    p: [
      'We ship anywhere in Pakistan via Leopards or TCS, typically arriving in 2–4 working days.',
      'Nationwide delivery is Rs 550, or free on orders over ' + formatPKR(site.delivery.freeOver) + '.',
      'Tracking is sent to you on Instagram the moment the parcel is picked up.',
    ],
  },
  {
    h: 'Lead times',
    p: [
      'Ready-to-ship baskets: 1–2 days before dispatch.',
      'Custom and bridal baskets: 4–5 days, longer if we are sourcing something specific.',
      'Corporate batches: 5–10 working days depending on quantity and branding.',
      'Eid, Valentine’s and wedding season fill up. If your date is fixed, message us early — slots are genuinely limited.',
    ],
  },
  {
    h: 'Multiple addresses',
    p: [
      'We regularly send one order to several recipients — six Eid hampers to six houses, or a hundred client boxes across three cities.',
      'Send us the list of names, addresses and card messages, and we handle each dispatch separately under a single invoice.',
    ],
  },
  {
    h: 'If something goes wrong',
    p: [
      'Send us a photo within 48 hours of delivery and we will replace the affected item, or the whole basket, at our cost.',
      'Because baskets are made to order and often personalised, we cannot accept returns for change of mind — but if we got something wrong, we fix it.',
    ],
  },
];

export default function ShippingPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Shipping & Delivery' }]}
        eyebrow="Getting it there"
        title="Shipping & delivery."
        lede={`${site.delivery.lahoreSameDay}. ${site.delivery.nationwide}.`}
      />

      <section className="bg-cream pb-section">
        <div className="shell max-w-3xl">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.h} delay={Math.min(i * 0.05, 0.2)}>
              <div className="border-t border-blush-200 py-9">
                <h2 className="font-display text-[1.5rem] font-light text-wine-800">{s.h}</h2>
                <div className="mt-4 space-y-3">
                  {s.p.map((para) => (
                    <p key={para} className="text-[0.9375rem] leading-[1.85] text-ink-soft">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <FinalCTA />
    </>
  );
}
