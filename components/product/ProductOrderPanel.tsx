'use client';

import { useMemo, useState } from 'react';
import { Copy, Minus, Plus, Truck } from 'lucide-react';
import type { Product } from '@/lib/types';
import { defaultVariant, includesFor } from '@/lib/content/products';
import { Button } from '@/components/ui/Button';
import { HandwrittenCard } from '@/components/ui/HandwrittenCard';
import { Toast, useToast } from '@/components/ui/Toast';
import { DottedRule } from '@/components/ui/Ornament';
import { site } from '@/lib/site';
import { productOrderText } from '@/lib/order';
import { OrderButton } from '@/components/ui/OrderButton';
import { cn, formatPKR } from '@/lib/utils';

const MAX_MESSAGE = 160;

const field =
  'w-full rounded-md border border-blush-200 bg-cream-100 px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-rose-400 focus:outline-none';

export function ProductOrderPanel({ product }: { product: Product }) {
  const variants = product.variants ?? [];
  const [variantId, setVariantId] = useState(() => defaultVariant(product)?.id ?? '');
  const [qty, setQty] = useState(1);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const { message: toastMsg, toast } = useToast();

  const variant = variants.find((v) => v.id === variantId);
  const unit = variant?.price ?? product.price;
  const total = unit * qty;
  const freeDelivery = total >= site.delivery.freeOver;

  /* The contents list follows the chosen variant — a Deluxe holds more. */
  const includes = useMemo(() => includesFor(product, variant), [product, variant]);

  const orderText = productOrderText({
    product,
    size: variant?.name,
    unitPrice: unit,
    quantity: qty,
    message,
    recipientName: to,
    senderName: from,
    deliveryCity: city,
    deliveryDate: date,
    notes,
    total,
  });

  const copySummary = async () => {
    const text = [
      `${product.name}${variant ? ` (${variant.name})` : ''} × ${qty}`,
      `Total: ${formatPKR(total)}`,
      to ? `For: ${to}` : '',
      from ? `From: ${from}` : '',
      message ? `Message: "${message}"` : '',
      city ? `Deliver to: ${city}` : '',
      date ? `Needed by: ${date}` : '',
    ].filter(Boolean).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast('Order summary copied');
    } catch {
      toast('Could not copy — please select and copy manually');
    }
  };

  return (
    <div>
      {/* ---- What's inside (follows the selected variant) ---- */}
      <div>
        <p className="text-label uppercase text-rose-600">What&apos;s inside</p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {includes.map((item) => (
            <li key={item.name} className="flex items-baseline gap-3">
              <span aria-hidden className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-rose-300" />
              <span className="text-[0.9375rem] leading-snug text-ink-soft">
                {item.name}
                {item.note ? (
                  <span className="block text-[0.8125rem] text-ink-faint">{item.note}</span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
        {variant?.includes?.length ? (
          <p className="mt-4 text-[0.8125rem] text-ink-muted">
            Contents shown for the <strong className="font-medium text-wine-700">{variant.name}</strong>{' '}
            size.
          </p>
        ) : null}
      </div>

      <DottedRule width={140} className="mt-9" />

      {/* ---- Variant ---- */}
      {variants.length > 0 ? (
        <fieldset className="mt-8">
          <legend className="text-label uppercase text-rose-600">
            Choose your {(product.variantLabel ?? 'Size').toLowerCase()}
          </legend>
          <div
            className={cn(
              'mt-4 grid gap-2.5',
              variants.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3',
            )}
          >
            {variants.map((v) => {
              const active = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setVariantId(v.id)}
                  aria-pressed={active}
                  disabled={!v.available}
                  className={cn(
                    'rounded-lg border px-3 py-3 text-left transition-all duration-400 ease-expo',
                    active
                      ? 'border-wine-700 bg-wine-700 text-cream shadow-petal'
                      : 'border-blush-200 bg-cream text-ink-soft hover:border-rose-400',
                    !v.available && 'cursor-not-allowed opacity-40 hover:border-blush-200',
                  )}
                >
                  <span className="block text-[0.875rem] font-medium">{v.name}</span>
                  <span
                    className={cn(
                      'mt-0.5 block text-[0.8125rem] tabular-nums',
                      active ? 'text-blush-300' : 'text-wine-700',
                    )}
                  >
                    {formatPKR(v.price)}
                  </span>
                  {v.note ? (
                    <span
                      className={cn(
                        'mt-0.5 block text-[0.6875rem]',
                        active ? 'text-blush-200/70' : 'text-ink-faint',
                      )}
                    >
                      {v.available ? v.note : 'Sold out'}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* ---- Quantity ---- */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-blush-200 py-5">
        <div className="flex items-center gap-4">
          <span className="text-label uppercase text-ink-faint">Quantity</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              disabled={qty <= 1}
              className="grid h-9 w-9 place-items-center rounded-full border border-blush-300 text-wine-700 transition-colors hover:bg-blush-100 disabled:opacity-35"
            >
              <Minus className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
            <span aria-live="polite" className="w-10 text-center font-display text-[1.25rem] tabular-nums text-wine-800">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              aria-label="Increase quantity"
              className="grid h-9 w-9 place-items-center rounded-full border border-blush-300 text-wine-700 transition-colors hover:bg-blush-100"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-ink-faint">Total</p>
          <p className="font-display text-[1.75rem] tabular-nums text-wine-700">{formatPKR(total)}</p>
        </div>
      </div>

      {/* ---- Personalisation ---- */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="to" className="text-label uppercase text-rose-600">Their name</label>
          <input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Amna" className={cn(field, 'mt-3')} />
        </div>
        <div>
          <label htmlFor="from" className="text-label uppercase text-rose-600">Your name</label>
          <input id="from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Sara" className={cn(field, 'mt-3')} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="msg" className="text-label uppercase text-rose-600">Your handwritten note</label>
        <textarea
          id="msg"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
          placeholder="We'll write this out by hand and tuck it under the ribbon…"
          className={cn(field, 'mt-3 resize-none leading-relaxed')}
        />
        <p className="mt-1.5 text-right text-[0.75rem] tabular-nums text-ink-faint">
          {message.length}/{MAX_MESSAGE}
        </p>
      </div>

      {(message || to) && (
        <div className="mt-4">
          <HandwrittenCard message={message} to={to || undefined} from={from || undefined} compact />
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="text-label uppercase text-rose-600">Delivery city</label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lahore" className={cn(field, 'mt-3')} />
        </div>
        <div>
          <label htmlFor="date" className="text-label uppercase text-rose-600">Needed by</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cn(field, 'mt-3')} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="notes" className="text-label uppercase text-rose-600">Anything to swap or add?</label>
        <input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. no candle, add a mug, wrap in ivory"
          className={cn(field, 'mt-3')}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-start gap-3">
        <OrderButton text={orderText} size="lg" className="flex-1 sm:flex-none" magnetic>
          Order on Instagram
        </OrderButton>
        <Button type="button" variant="outline" size="lg" onClick={copySummary}>
          <Copy className="h-4 w-4" strokeWidth={1.6} />
          Copy summary
        </Button>
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
        No payment is taken here. Your order is copied to your clipboard and our Instagram messages
        open — paste it and send. We confirm availability, final price and delivery before anything
        is charged.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-lg bg-blush-50 p-4">
        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" strokeWidth={1.5} />
        <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
          {freeDelivery ? (
            <>
              <strong className="font-medium text-wine-700">Free delivery included</strong> — this
              order is over {formatPKR(site.delivery.freeOver)}.{' '}
            </>
          ) : (
            <>Free nationwide delivery over {formatPKR(site.delivery.freeOver)}. </>
          )}
          {site.delivery.lahoreSameDay}. {site.delivery.nationwide}.
        </p>
      </div>

      <Toast message={toastMsg} />
    </div>
  );
}
