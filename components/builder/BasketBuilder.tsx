'use client';

import Image from '@/components/ui/Img';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  builderItems,
  builderSizes,
  builderThemes,
  builderWraps,
  itemGroups,
} from '@/lib/content/builder';
import type { BuilderItem, BuilderSelection } from '@/lib/types';
import { BasketPreview } from '@/components/builder/BasketPreview';
import { Button } from '@/components/ui/Button';
import { Toast, useToast } from '@/components/ui/Toast';
import { customBasketText } from '@/lib/order';
import { OrderButton } from '@/components/ui/OrderButton';
import { cn, formatPKR, photo } from '@/lib/utils';

const STEPS = [
  { id: 'size', label: 'Basket' },
  { id: 'theme', label: 'Theme' },
  { id: 'items', label: 'Items' },
  { id: 'wrap', label: 'Wrapping' },
  { id: 'note', label: 'Your note' },
] as const;

const MAX_MESSAGE = 180;

const field =
  'w-full rounded-md border border-blush-200 bg-cream-100 px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-rose-400 focus:outline-none';

export function BasketBuilder() {
  const [step, setStep] = useState(0);
  const [sizeId, setSizeId] = useState(builderSizes[1].id);
  const [themeId, setThemeId] = useState<string | null>(null);
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [wrapId, setWrapId] = useState(builderWraps[0].id);
  const [group, setGroup] = useState<(typeof itemGroups)[number]>('Pamper');
  const [message, setMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');

  const { message: toastMsg, toast } = useToast();

  const size = builderSizes.find((s) => s.id === sizeId)!;
  const theme = builderThemes.find((t) => t.id === themeId) ?? null;
  const wrap = builderWraps.find((w) => w.id === wrapId)!;
  const items = itemIds
    .map((id) => builderItems.find((i) => i.id === id))
    .filter(Boolean) as BuilderItem[];

  const total = useMemo(
    () => size.basePrice + wrap.price + items.reduce((sum, i) => sum + i.price, 0),
    [size, wrap, items],
  );

  const selection: BuilderSelection = {
    size, theme, items, wrap, message, recipientName, senderName,
  };

  const toggleItem = (item: BuilderItem) => {
    setItemIds((prev) => {
      if (prev.includes(item.id)) return prev.filter((id) => id !== item.id);
      if (prev.length >= size.itemAllowance) {
        toast(`${size.name} holds ${size.itemAllowance} items — remove one or size up`);
        return prev;
      }
      return [...prev, item.id];
    });
  };

  const canAdvance = step === 1 ? theme !== null : true;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.15fr_minmax(0,26rem)] lg:items-start lg:gap-14">
      {/* ---------------- Steps ---------------- */}
      <div className="order-2 min-w-0 lg:order-1">
        {/* Progress */}
        <nav aria-label="Builder steps" className="rail no-scrollbar -mx-gutter overflow-x-auto px-gutter">
          <ol className="flex min-w-max items-center gap-2">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep(i)}
                    aria-current={active ? 'step' : undefined}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-3.5 py-2 text-[0.8125rem] transition-all duration-400 ease-expo',
                      active
                        ? 'border-wine-700 bg-wine-700 text-cream'
                        : done
                          ? 'border-rose-300 text-wine-700'
                          : 'border-blush-200 text-ink-faint hover:border-rose-300',
                    )}
                  >
                    <span
                      className={cn(
                        'grid h-5 w-5 place-items-center rounded-full text-[0.625rem] tabular-nums',
                        active ? 'bg-cream/20' : done ? 'bg-rose-500 text-cream' : 'bg-blush-100 text-ink-faint',
                      )}
                    >
                      {done ? <Check className="h-3 w-3" strokeWidth={2.4} /> : i + 1}
                    </span>
                    {s.label}
                  </button>
                  {i < STEPS.length - 1 ? (
                    <span aria-hidden className="h-px w-4 bg-blush-300 sm:w-6" />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-10 min-h-[24rem]">
          {/* Re-keyed on the step so the CSS entry animation replays. */}
          <div key={STEPS[step].id} className="rise-in">
              {/* ---- 1. Size ---- */}
              {step === 0 ? (
                <section>
                  <h2 className="font-display text-display-xs font-light text-wine-800">
                    How big should it be?
                  </h2>
                  <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                    This sets how many pieces the basket holds. You can change it at any point — the
                    items you pick will carry over.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {builderSizes.map((s) => {
                      const active = s.id === sizeId;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSizeId(s.id)}
                          aria-pressed={active}
                          className={cn(
                            'rounded-xl border p-5 text-left transition-all duration-450 ease-expo',
                            active
                              ? 'border-wine-700 bg-wine-700 text-cream shadow-lift'
                              : 'border-blush-200 bg-cream hover:-translate-y-0.5 hover:border-rose-400 hover:shadow-petal',
                          )}
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="font-display text-[1.375rem] font-light">{s.name}</span>
                            <span className={cn('text-[0.875rem] tabular-nums', active ? 'text-blush-300' : 'text-wine-700')}>
                              from {formatPKR(s.basePrice)}
                            </span>
                          </div>
                          <p className={cn('mt-2 text-[0.875rem]', active ? 'text-blush-200/80' : 'text-ink-muted')}>
                            {s.description}
                          </p>
                          <p className={cn('mt-3 text-[0.6875rem] uppercase tracking-[0.16em]', active ? 'text-blush-300' : 'text-ink-faint')}>
                            Holds {s.itemAllowance} items
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {/* ---- 2. Theme ---- */}
              {step === 1 ? (
                <section>
                  <h2 className="font-display text-display-xs font-light text-wine-800">
                    What mood are we going for?
                  </h2>
                  <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                    The theme sets the palette, the ribbon and the tissue — the first thing they see
                    before anything is unwrapped.
                  </p>
                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {builderThemes.map((t) => {
                      const active = t.id === themeId;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setThemeId(t.id)}
                          aria-pressed={active}
                          className="group text-left"
                        >
                          <div
                            className={cn(
                              'relative aspect-[4/5] overflow-hidden rounded-xl bg-blush-100 transition-all duration-500 ease-expo',
                              active
                                ? 'ring-2 ring-wine-700 ring-offset-2 ring-offset-cream'
                                : 'ring-1 ring-blush-200 group-hover:-translate-y-1',
                            )}
                          >
                            <Image
                              src={photo(t.image.id, 500)}
                              alt={t.image.alt}
                              fill
                              loading="lazy"
                              sizes="(max-width: 640px) 45vw, 220px"
                              className="object-cover transition-transform duration-[1000ms] ease-expo group-hover:scale-105"
                            />
                            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-wine-900/70 to-transparent" />
                            {active ? (
                              <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-cream text-wine-700">
                                <Check className="h-3.5 w-3.5" strokeWidth={2.2} />
                              </span>
                            ) : null}
                            <div className="absolute inset-x-0 bottom-0 p-3">
                              <span className="block font-display text-[1.125rem] text-cream">{t.name}</span>
                              <span className="mt-1.5 flex gap-1.5">
                                {t.palette.map((c) => (
                                  <span key={c} className="h-2.5 w-2.5 rounded-full ring-1 ring-white/40" style={{ background: c }} />
                                ))}
                              </span>
                            </div>
                          </div>
                          <p className="mt-2.5 text-[0.8125rem] leading-snug text-ink-muted">{t.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {/* ---- 3. Items ---- */}
              {step === 2 ? (
                <section>
                  <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <h2 className="font-display text-display-xs font-light text-wine-800">
                        What goes inside?
                      </h2>
                      <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                        Pick up to {size.itemAllowance}. Don&apos;t see something? Add it as a note in
                        the last step and we&apos;ll source it.
                      </p>
                    </div>
                    <p className="rounded-full bg-blush-100 px-3.5 py-2 text-[0.8125rem] tabular-nums text-wine-700">
                      {items.length} / {size.itemAllowance} chosen
                    </p>
                  </div>

                  <div className="rail no-scrollbar mt-7 flex gap-2 overflow-x-auto">
                    {itemGroups.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGroup(g)}
                        aria-pressed={group === g}
                        className={cn(
                          'shrink-0 rounded-full border px-4 py-2 text-[0.8125rem] transition-all duration-400 ease-expo',
                          group === g
                            ? 'border-wine-700 bg-wine-700 text-cream'
                            : 'border-blush-200 text-ink-soft hover:border-rose-400',
                        )}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {builderItems
                      .filter((i) => i.group === group)
                      .map((it) => {
                        const active = itemIds.includes(it.id);
                        return (
                          <li key={it.id}>
                            <button
                              type="button"
                              onClick={() => toggleItem(it)}
                              aria-pressed={active}
                              className={cn(
                                'group w-full overflow-hidden rounded-xl border text-left transition-all duration-450 ease-expo',
                                active
                                  ? 'border-wine-700 shadow-petal'
                                  : 'border-blush-200 hover:-translate-y-1 hover:border-rose-400',
                              )}
                            >
                              <span className="relative block aspect-[4/3] bg-blush-100">
                                <Image
                                  src={photo(it.image.id, 360)}
                                  alt=""
                                  fill
                                  loading="lazy"
                                  sizes="(max-width: 640px) 45vw, 200px"
                                  className="object-cover transition-transform duration-[900ms] ease-expo group-hover:scale-105"
                                />
                                <span
                                  className={cn(
                                    'absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full transition-all duration-400',
                                    active ? 'bg-wine-700 text-cream' : 'bg-cream/90 text-wine-700',
                                  )}
                                >
                                  {active ? (
                                    <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                                  ) : (
                                    <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                                  )}
                                </span>
                              </span>
                              <span className="block bg-cream px-3 py-2.5">
                                <span className="block text-[0.875rem] leading-snug text-wine-800">{it.name}</span>
                                <span className="mt-0.5 block text-[0.75rem] tabular-nums text-ink-faint">
                                  +{formatPKR(it.price)}
                                </span>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                  </ul>
                </section>
              ) : null}

              {/* ---- 4. Wrap ---- */}
              {step === 3 ? (
                <section>
                  <h2 className="font-display text-display-xs font-light text-wine-800">
                    How should it be finished?
                  </h2>
                  <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                    The wrapping is the first impression. It is also the part people photograph.
                  </p>
                  <div className="mt-8 grid gap-3 sm:grid-cols-2">
                    {builderWraps.map((w) => {
                      const active = w.id === wrapId;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setWrapId(w.id)}
                          aria-pressed={active}
                          className={cn(
                            'rounded-xl border p-5 text-left transition-all duration-450 ease-expo',
                            active
                              ? 'border-wine-700 bg-wine-700 text-cream shadow-lift'
                              : 'border-blush-200 bg-cream hover:-translate-y-0.5 hover:border-rose-400',
                          )}
                        >
                          <div className="flex items-baseline justify-between">
                            <span className="font-display text-[1.25rem] font-light">{w.name}</span>
                            <span className={cn('text-[0.875rem] tabular-nums', active ? 'text-blush-300' : 'text-wine-700')}>
                              {w.price === 0 ? 'Included' : `+${formatPKR(w.price)}`}
                            </span>
                          </div>
                          <p className={cn('mt-2 text-[0.875rem] leading-relaxed', active ? 'text-blush-200/80' : 'text-ink-muted')}>
                            {w.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {/* ---- 5. Note ---- */}
              {step === 4 ? (
                <section>
                  <h2 className="font-display text-display-xs font-light text-wine-800">
                    And what should the card say?
                  </h2>
                  <p className="mt-3 max-w-prose text-[0.9375rem] leading-relaxed text-ink-muted">
                    We write this out by hand. Say the thing you would never say out loud — it lands
                    better on paper.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="b-to" className="text-label uppercase text-rose-600">
                        Their name
                      </label>
                      <input
                        id="b-to"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        placeholder="e.g. Amna"
                        className={cn(field, 'mt-3')}
                      />
                    </div>
                    <div>
                      <label htmlFor="b-from" className="text-label uppercase text-rose-600">
                        Your name
                      </label>
                      <input
                        id="b-from"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        placeholder="e.g. Sara"
                        className={cn(field, 'mt-3')}
                      />
                    </div>
                  </div>

                  <div className="mt-5">
                    <label htmlFor="b-msg" className="text-label uppercase text-rose-600">
                      Your message
                    </label>
                    <textarea
                      id="b-msg"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
                      placeholder="Because you never ask for anything, and you deserve everything…"
                      className={cn(field, 'mt-3 resize-none leading-relaxed')}
                    />
                    <p className="mt-1.5 text-right text-[0.75rem] tabular-nums text-ink-faint">
                      {message.length}/{MAX_MESSAGE}
                    </p>
                  </div>

                  <div className="mt-8 rounded-xl border border-blush-200 bg-blush-50 p-5">
                    <p className="text-label uppercase text-rose-600">Nearly there</p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                      Sending this copies your basket out in full — size, theme, every item,
                      wrapping and your note — and opens our Instagram messages. Paste it and send.
                      We reply with availability, the final price and a delivery date, usually within
                      the hour.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <OrderButton text={customBasketText(selection, total)} size="lg" magnetic>
                        Send my basket on Instagram
                      </OrderButton>
                      <Button type="button" variant="outline" size="lg" onClick={() => setStep(0)}>
                        Start again
                      </Button>
                    </div>
                  </div>
                </section>
              ) : null}
          </div>
        </div>

        {/* Step nav */}
        <div className="mt-10 flex items-center justify-between border-t border-blush-200 pt-6">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-[0.875rem] text-ink-soft transition-colors hover:text-wine-700 disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.6} />
            Back
          </button>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
              disabled={!canAdvance}
              size="md"
            >
              {step === 1 && !theme ? 'Pick a theme to continue' : `Next — ${STEPS[step + 1].label}`}
              <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
            </Button>
          ) : (
            <span className="text-[0.8125rem] text-ink-faint">Last step</span>
          )}
        </div>
      </div>

      {/* ---------------- Preview ---------------- */}
      <aside className="order-1 min-w-0 lg:order-2 lg:sticky lg:top-[92px]">
        <BasketPreview selection={selection} total={total} />
      </aside>

      <Toast message={toastMsg} />
    </div>
  );
}
