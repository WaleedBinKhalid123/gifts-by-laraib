'use client';

import { useMemo, useState } from 'react';
import { Copy, Minus, Plus, Truck } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { HandwrittenCard } from '@/components/ui/HandwrittenCard';
import { Toast, useToast } from '@/components/ui/Toast';
import { site } from '@/lib/site';
import { waProductOrder } from '@/lib/whatsapp';
import { cn, formatPKR } from '@/lib/utils';

const MAX_MESSAGE = 160;

const field =
  'w-full rounded-md border border-blush-200 bg-cream-100 px-4 py-3 text-[0.9375rem] text-ink placeholder:text-ink-faint transition-colors focus:border-rose-400 focus:outline-none';

export function ProductOrderPanel({ product }: { product: Product }) {
  const sizes = product.sizes ?? [];
  const [sizeLabel, setSizeLabel] = useState(
    sizes.find((s) => s.priceDelta === 0)?.label ?? sizes[0]?.label ?? '',
  );
  const [qty, setQty] = useState(1);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const { message: toastMsg, toast } = useToast();

  const unit = useMemo(() => {
    const delta = sizes.find((s) => s.label === sizeLabel)?.priceDelta ?? 0;
    return Math.max(0, product.price + delta);
  }, [product.price, sizes, sizeLabel]);

  const total = unit * qty;
  const freeDelivery = total >= site.delivery.freeOver;

  const href = waProductOrder({
    product,
    size: sizeLabel,
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
      `${product.name}${sizeLabel ? ` (${sizeLabel})` : ''} × ${qty}`,
      `Total: ${formatPKR(total)}`,
      to ? `For: ${to}` : '',
      from ? `From: ${from}` : '',
      message ? `Message: "${message}"` : '',
      city ? `Deliver to: ${city}` : '',
      date ? `Needed by: ${date}` : '',
    ]
      .filter(Boolean)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      toast('Order summary copied');
    } catch {
      toast('Could not copy — please select and copy manually');
    }
  };

  return (
    <div>
      {/* Size */}
      {sizes.length > 0 ? (
        <fieldset className="mt-2">
          <legend className="text-label uppercase text-rose-600">Choose your size</legend>
          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {sizes.map((s) => {
              const active = s.label === sizeLabel;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setSizeLabel(s.label)}
                  aria-pressed={active}
                  className={cn(
                    'rounded-lg border px-3 py-3 text-left transition-all duration-400 ease-expo',
                    active
                      ? 'border-wine-700 bg-wine-700 text-cream shadow-petal'
                      : 'border-blush-200 bg-cream text-ink-soft hover:border-rose-400',
                  )}
                >
                  <span className="block text-[0.875rem] font-medium">{s.label}</span>
                  <span className={cn('mt-0.5 block text-[0.6875rem]', active ? 'text-blush-300' : 'text-ink-faint')}>
                    {s.note}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Quantity */}
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

      {/* Personalisation */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="to" className="text-label uppercase text-rose-600">
            Their name
          </label>
          <input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Amna" className={cn(field, 'mt-3')} />
        </div>
        <div>
          <label htmlFor="from" className="text-label uppercase text-rose-600">
            Your name
          </label>
          <input id="from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Sara" className={cn(field, 'mt-3')} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="msg" className="text-label uppercase text-rose-600">
          Your handwritten note
        </label>
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
          <label htmlFor="city" className="text-label uppercase text-rose-600">
            Delivery city
          </label>
          <input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Lahore" className={cn(field, 'mt-3')} />
        </div>
        <div>
          <label htmlFor="date" className="text-label uppercase text-rose-600">
            Needed by
          </label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={cn(field, 'mt-3')} />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="notes" className="text-label uppercase text-rose-600">
          Anything to swap or add?
        </label>
        <input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. no candle, add a mug, wrap in ivory"
          className={cn(field, 'mt-3')}
        />
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={href} external variant="wa" size="lg" className="flex-1 sm:flex-none" magnetic>
          Order on WhatsApp
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={copySummary}>
          <Copy className="h-4 w-4" strokeWidth={1.6} />
          Copy summary
        </Button>
      </div>

      <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-muted">
        No payment is taken here. Your details open a message to us — we confirm availability, final
        price and delivery before anything is charged.
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
