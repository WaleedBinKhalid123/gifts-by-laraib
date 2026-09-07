import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${site.name} handles the information you share when ordering a gift basket.`,
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    h: 'The short version',
    p: [
      'This website does not have accounts, a checkout or a database. Nothing you type into a form here is stored on our servers, because there is no server storing it.',
      'When you press an order or enquiry button, your answers are assembled into a WhatsApp message on your own device. Nothing is sent until you press send in WhatsApp.',
    ],
  },
  {
    h: 'What we do end up holding',
    p: [
      'Once you message us, we hold whatever you send: your name, phone number, delivery address, card message and order details. We keep this in our WhatsApp and order records so we can make and deliver your gift, and so we can help if you order again.',
      'We do not sell, rent or share this with anyone, other than the courier who needs the delivery address.',
    ],
  },
  {
    h: 'Analytics and cookies',
    p: [
      'We use privacy-friendly, aggregate analytics to understand which pages people visit. It does not identify you and does not follow you around other websites.',
      'The site sets no advertising or tracking cookies.',
    ],
  },
  {
    h: 'Photographs',
    p: [
      'We photograph baskets before they leave. We only post a photo that includes a personal message or a recipient’s name if you have told us it is fine.',
      'If a photo of your basket is already up and you would rather it were not, message us and we will take it down.',
    ],
  },
  {
    h: 'Your choices',
    p: [
      `You can ask us to delete your details at any time by messaging ${site.whatsapp.display} or emailing ${site.email}. We will confirm once it is done.`,
      'Newsletter emails, if you subscribe, always carry a one-click unsubscribe.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Privacy Policy' }]}
        eyebrow="Legal"
        title="Privacy policy."
        lede="Written in plain language, because a gift basket order should not require a lawyer."
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

          <p className="border-t border-blush-200 pt-9 text-[0.8125rem] text-ink-faint">
            Last updated September 2026. Questions about any of this go to {site.email}.
          </p>
        </div>
      </section>
    </>
  );
}
