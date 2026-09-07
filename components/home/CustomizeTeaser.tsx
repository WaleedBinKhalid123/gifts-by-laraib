'use client';

import Image from '@/components/ui/Img';
import { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { builderSizes, builderThemes, builderWraps } from '@/lib/content/builder';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { HandwrittenCard } from '@/components/ui/HandwrittenCard';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { cn, formatPKR, photo } from '@/lib/utils';

const MAX = 90;

function Chip({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'relative rounded-full border px-4 py-2.5 text-[0.8125rem] transition-all duration-400 ease-expo',
        active
          ? 'border-wine-700 bg-wine-700 text-cream shadow-petal'
          : 'border-blush-300 bg-cream text-ink-soft hover:border-rose-400 hover:text-wine-700',
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function CustomizeTeaser() {
  const [sizeId, setSizeId] = useState(builderSizes[1].id);
  const [themeId, setThemeId] = useState(builderThemes[0].id);
  const [wrapId, setWrapId] = useState(builderWraps[1].id);
  const [message, setMessage] = useState('Because you never ask for anything, and you deserve everything.');
  const [to, setTo] = useState('Amna');

  const size = builderSizes.find((s) => s.id === sizeId)!;
  const theme = builderThemes.find((t) => t.id === themeId)!;
  const wrap = builderWraps.find((w) => w.id === wrapId)!;

  const estimate = useMemo(() => size.basePrice + wrap.price, [size, wrap]);

  return (
    <section
      aria-labelledby="customize-heading"
      className="relative overflow-hidden bg-wine-900 py-section text-blush-200"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-52 top-0 h-[40rem] w-[40rem] rounded-full opacity-35"
        style={{ background: 'radial-gradient(closest-side,#B22462 0%,rgba(178,36,98,0.45) 40%,rgba(64,7,30,0) 78%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-64 right-[-14rem] h-[42rem] w-[42rem] rounded-full opacity-25"
        style={{ background: 'radial-gradient(closest-side,#C6A15B 0%,rgba(198,161,91,0.4) 42%,rgba(64,7,30,0) 78%)' }}
      />

      <div className="shell relative">
        <SectionHeading
          eyebrow="The configurator"
          title="Make it uniquely"
          script="theirs."
          lede="Size, mood, wrapping, and a note in your words. Change anything and the basket updates as you go — then send it straight to us on WhatsApp."
          align="center"
          tone="light"
        />
        <h2 id="customize-heading" className="sr-only">
          Customize your gift basket
        </h2>

        <div className="mt-[clamp(2.25rem,1.5rem+2.5vw,3.5rem)] grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          {/* ---------- Controls ---------- */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <fieldset>
                <legend className="text-label uppercase tracking-[0.22em] text-gold-300">
                  01 — Choose your basket
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {builderSizes.map((s) => (
                    <Chip key={s.id} active={s.id === sizeId} onClick={() => setSizeId(s.id)}>
                      {s.name}
                      <span className="ml-2 text-[0.6875rem] opacity-60">{s.itemAllowance} items</span>
                    </Chip>
                  ))}
                </div>
              </fieldset>
            </Reveal>

            <Reveal delay={0.06}>
              <fieldset className="mt-9">
                <legend className="text-label uppercase tracking-[0.22em] text-gold-300">
                  02 — Choose a theme
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {builderThemes.map((t) => (
                    <Chip key={t.id} active={t.id === themeId} onClick={() => setThemeId(t.id)}>
                      {t.name}
                    </Chip>
                  ))}
                </div>
              </fieldset>
            </Reveal>

            <Reveal delay={0.1}>
              <fieldset className="mt-9">
                <legend className="text-label uppercase tracking-[0.22em] text-gold-300">
                  03 — Choose your wrapping
                </legend>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {builderWraps.map((w) => (
                    <Chip key={w.id} active={w.id === wrapId} onClick={() => setWrapId(w.id)}>
                      {w.name}
                      {w.price > 0 ? (
                        <span className="ml-2 text-[0.6875rem] opacity-60">+{formatPKR(w.price)}</span>
                      ) : null}
                    </Chip>
                  ))}
                </div>
                <p className="mt-3 text-[0.8125rem] text-blush-200/60">{wrap.description}</p>
              </fieldset>
            </Reveal>

            <Reveal delay={0.14}>
              <fieldset className="mt-9">
                <legend className="text-label uppercase tracking-[0.22em] text-gold-300">
                  04 — Add a personal message
                </legend>

                <label htmlFor="teaser-to" className="sr-only">
                  Recipient name
                </label>
                <input
                  id="teaser-to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Their name"
                  maxLength={24}
                  className="mt-4 w-full rounded-md border border-blush-200/25 bg-white/[0.04] px-4 py-3 text-[0.9375rem] text-cream placeholder:text-blush-200/35 focus:border-blush-300 focus:outline-none"
                />

                <label htmlFor="teaser-msg" className="sr-only">
                  Card message
                </label>
                <textarea
                  id="teaser-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
                  rows={3}
                  placeholder="Say the thing you'd never fit on a card…"
                  className="mt-3 w-full resize-none rounded-md border border-blush-200/25 bg-white/[0.04] px-4 py-3 text-[0.9375rem] leading-relaxed text-cream placeholder:text-blush-200/35 focus:border-blush-300 focus:outline-none"
                />
                <p className="mt-2 text-right text-[0.75rem] tabular-nums text-blush-200/45">
                  {message.length}/{MAX}
                </p>
              </fieldset>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-6 border-t border-blush-200/15 pt-7">
                <div>
                  <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-blush-200/50">
                    Starting from
                  </p>
                  <p className="mt-1 font-display text-[1.75rem] text-cream tabular-nums">
                    {formatPKR(estimate)}
                  </p>
                </div>
                <Button
                  href="/customize"
                  size="lg"
                  className="bg-cream text-wine-800 hover:bg-blush-100"
                  magnetic
                >
                  Continue in the builder
                  <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* ---------- Live preview ---------- */}
          <div className="order-1 lg:order-2">
            <div className="relative mx-auto w-full max-w-[30rem]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[12rem_12rem_1.5rem_1.5rem] ring-1 ring-blush-200/20">
                {/* All themes stay mounted and crossfade — no unmount flicker,
                    and the image for the next choice is already decoded. */}
                {builderThemes.map((t) => (
                  <div key={t.id} className="xfade" data-active={t.id === themeId}>
                    <Image
                      src={photo(t.image.id, 700)}
                      alt={t.id === themeId ? t.image.alt : ''}
                      aria-hidden={t.id !== themeId}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 90vw, 30rem"
                      className="object-cover"
                    />
                  </div>
                ))}

                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-wine-900/85 via-wine-900/10 to-transparent"
                />

                {/* Ribbon band — colour follows the theme */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-[38%] h-3 transition-colors duration-500 ease-expo"
                  style={{ backgroundColor: theme.palette[1] }}
                />
                <span
                  aria-hidden
                  className="absolute left-1/2 top-[34%] h-11 w-11 -translate-x-1/2 rounded-full transition-colors duration-500 ease-expo"
                  style={{ backgroundColor: theme.palette[0] }}
                />

                <div className="absolute inset-x-0 bottom-0 p-6 pb-20">
                  <p className="text-[0.625rem] uppercase tracking-[0.24em] text-blush-300">
                    {size.name} · {theme.name} · {wrap.name}
                  </p>
                  <p className="mt-2 font-display text-[1.5rem] font-light text-cream">
                    {theme.description}
                  </p>
                  <div className="mt-4 flex gap-2">
                    {theme.palette.map((c) => (
                      <span
                        key={c}
                        className="h-4 w-4 rounded-full ring-1 ring-white/40 transition-colors duration-500"
                        style={{ background: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative z-10 mx-auto -mt-12 w-[86%] rotate-[-2.5deg]">
                <HandwrittenCard message={message} to={to} compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
