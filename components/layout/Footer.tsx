'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { InstagramGlyph } from '@/components/ui/InstagramGlyph';
import { useState } from 'react';
import { site } from '@/lib/site';
import { DottedRule } from '@/components/ui/Ornament';
import { Reveal } from '@/components/ui/Reveal';


export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  return (
    <footer className="relative overflow-hidden bg-wine-900 text-blush-200">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-40"
        style={{ background: 'radial-gradient(closest-side,#B22462 0%,rgba(178,36,98,0.45) 40%,rgba(64,7,30,0) 78%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-56 right-[-10rem] h-[36rem] w-[36rem] rounded-full opacity-25"
        style={{ background: 'radial-gradient(closest-side,#C6A15B 0%,rgba(198,161,91,0.4) 42%,rgba(64,7,30,0) 78%)' }}
      />

      <div className="shell relative py-[clamp(4rem,3rem+4vw,6.5rem)]">
        {/* Newsletter */}
        <Reveal>
          <div className="grid gap-10 border-b border-blush-200/15 pb-14 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-label uppercase tracking-[0.24em] text-gold-300">Stay close</p>
              <h2 className="mt-4 max-w-xl font-display text-display-sm font-light text-cream">
                Gifting inspiration, new baskets and the occasional early offer.
              </h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes('@')) setSubscribed(true);
              }}
              className="w-full"
            >
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <div className="flex items-center gap-3 border-b border-blush-200/30 pb-3 transition-colors focus-within:border-blush-300">
                <input
                  id="newsletter"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  disabled={subscribed}
                  className="w-full bg-transparent font-sans text-[1rem] text-cream placeholder:text-blush-200/40 focus:outline-none disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  aria-label="Subscribe to the newsletter"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-blush-200/30 text-cream transition-all duration-300 ease-expo hover:border-blush-300 hover:bg-blush-200/10 disabled:opacity-60"
                >
                  {subscribed ? (
                    <Check className="h-4 w-4" strokeWidth={1.6} />
                  ) : (
                    <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                  )}
                </button>
              </div>
              <p aria-live="polite" className="mt-3 text-[0.8125rem] text-blush-200/55">
                {subscribed
                  ? 'Lovely — you’re on the list. We only write when there’s something worth saying.'
                  : 'One email a month at most. Unsubscribe any time.'}
              </p>
            </form>
          </div>
        </Reveal>

        {/* Columns */}
        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)] lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="" width={104} height={104} className="h-[52px] w-[52px] object-contain" />
              <span className="font-script text-[1.75rem] leading-none text-cream">Gifts by Laraib</span>
            </div>
            <p className="mt-5 max-w-xs text-[0.9375rem] leading-relaxed text-blush-200/70">
              {site.tagline}
            </p>
            <DottedRule width={120} className="mt-6 text-blush-200/30" />
            <p className="mt-6 text-[0.875rem] leading-relaxed text-blush-200/60">
              {site.serviceArea}
              <br />
              {site.hours}
            </p>
            <div className="mt-6 flex items-center gap-2">
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-blush-200/20 transition-colors hover:border-blush-300 hover:bg-blush-200/10"
              >
                <InstagramGlyph className="h-[17px] w-[17px]" />
              </a>
            </div>
          </div>

          {Object.entries(site.footerLinks).map(([heading, links]) => (
            <nav key={heading} aria-label={heading}>
              <h3 className="font-sans text-label uppercase tracking-[0.24em] text-gold-300">
                {heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="link-underline text-[0.9375rem] text-blush-200/75 transition-colors hover:text-cream"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-blush-200/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.8125rem] text-blush-200/50">
            © {new Date().getFullYear()} {site.name}. Hand-packed in {site.city}.
          </p>
          <p className="text-[0.8125rem] text-blush-200/50">
            <a href={`mailto:${site.email}`} className="link-underline hover:text-cream">
              {site.email}
            </a>
            <span className="mx-3 text-blush-200/25">·</span>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline hover:text-cream"
            >
              {site.instagram.display}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
