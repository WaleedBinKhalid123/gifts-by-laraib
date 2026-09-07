import type { Metadata } from 'next';
import Link from 'next/link';
import { Clock, Instagram, Mail, MapPin } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { EnquiryForm } from '@/components/contact/EnquiryForm';
import { Reveal } from '@/components/ui/Reveal';
import { DottedRule } from '@/components/ui/Ornament';
import { faqs } from '@/lib/content/faqs';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Talk to ${site.name} about a customized gift basket. WhatsApp ${site.whatsapp.display}, email ${site.email}, or send an enquiry — we reply to every message ourselves.`,
  alternates: { canonical: '/contact' },
  openGraph: { title: `Contact · ${site.name}`, url: `${site.url}/contact` },
};

const DETAILS = [
  { icon: MapPin, label: 'Based in', value: site.city, note: site.serviceArea },
  { icon: Clock, label: 'Hours', value: site.hours, note: 'Messages after hours are answered next morning' },
  { icon: Mail, label: 'Email', value: site.email, href: `mailto:${site.email}`, note: 'Best for corporate and bulk enquiries' },
  { icon: Instagram, label: 'Instagram', value: site.instagram.handle, href: site.instagram.url, note: 'New baskets posted weekly' },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Contact' }]}
        eyebrow="Say hello"
        title="Tell us who it's for."
        lede="The fastest way to get a basket made is a message. Send us the person, the moment and roughly what you'd like to spend — we'll take it from there."
      />

      <section className="bg-cream pb-section">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <EnquiryForm />
            </div>

            <div>
              <Reveal>
                <a
                  href={`https://wa.me/${site.whatsapp.number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block rounded-[1.75rem] bg-wine-900 p-7 text-blush-200 transition-shadow duration-500 hover:shadow-float"
                >
                  <p className="text-label uppercase tracking-[0.22em] text-gold-300">
                    Prefer to just message?
                  </p>
                  <p className="mt-4 font-display text-[1.75rem] font-light text-cream">
                    {site.whatsapp.display}
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-blush-200/70">
                    WhatsApp is where almost every order starts. Send a voice note if it&apos;s
                    easier — we genuinely don&apos;t mind.
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-[0.8125rem] uppercase tracking-[0.18em] text-cream">
                    <span className="link-underline">Open WhatsApp</span>
                  </span>
                </a>
              </Reveal>

              <div className="mt-8 space-y-6">
                {DETAILS.map((d, i) => {
                  const Icon = d.icon;
                  const content = (
                    <>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-blush-300 text-rose-500">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                      <span>
                        <span className="block text-[0.6875rem] uppercase tracking-[0.18em] text-ink-faint">
                          {d.label}
                        </span>
                        <span className="mt-1 block text-[1rem] text-wine-800">{d.value}</span>
                        <span className="mt-1 block text-[0.8125rem] text-ink-muted">{d.note}</span>
                      </span>
                    </>
                  );
                  return (
                    <Reveal key={d.label} delay={i * 0.05}>
                      {d.href ? (
                        <a href={d.href} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                          {content}
                        </a>
                      ) : (
                        <div className="flex items-start gap-4">{content}</div>
                      )}
                    </Reveal>
                  );
                })}
              </div>

              <Reveal delay={0.2}>
                <DottedRule width={140} className="mt-10" />
                <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink-soft">
                  Planning a wedding, corporate batch or something over 10 baskets?{' '}
                  <Link href="/occasions/corporate" className="link-underline text-wine-700">
                    Start here
                  </Link>{' '}
                  — we&apos;ll send a quote within a day.
                </p>
              </Reveal>
            </div>
          </div>

          {/* Quick answers */}
          <div className="mt-section border-t border-blush-200 pt-14">
            <Reveal>
              <h2 className="font-display text-display-xs font-light text-wine-800">
                Answers to the usual questions
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-2">
              {faqs.slice(0, 4).map((f, i) => (
                <Reveal key={f.q} delay={(i % 2) * 0.06}>
                  <h3 className="font-display text-[1.1875rem] text-wine-700">{f.q}</h3>
                  <p className="mt-2.5 text-[0.9375rem] leading-[1.75] text-ink-soft">{f.a}</p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <Link
                href="/faqs"
                className="link-underline mt-9 inline-block text-[0.8125rem] uppercase tracking-[0.18em] text-wine-700"
              >
                Read all FAQs
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
