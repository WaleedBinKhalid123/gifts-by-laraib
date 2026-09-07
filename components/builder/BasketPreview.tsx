'use client';

import Image from '@/components/ui/Img';
import type { BuilderSelection } from '@/lib/types';
import { HandwrittenCard } from '@/components/ui/HandwrittenCard';
import { formatPKR, photo } from '@/lib/utils';

export function BasketPreview({
  selection,
  total,
}: {
  selection: BuilderSelection;
  total: number;
}) {
  const { size, theme, items, wrap, message, recipientName, senderName } = selection;
  const filled = items.length;
  const pct = Math.min(100, (filled / size.itemAllowance) * 100);

  return (
    <div className="rounded-[1.75rem] border border-blush-200 bg-cream p-5 shadow-petal sm:p-6">
      {/* Visual */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[10rem_10rem_1.25rem_1.25rem] bg-blush-100">
        {theme ? (
          <div key={theme.id} className="fade-in absolute inset-0">
            <Image
              src={photo(theme.image.id, 600)}
              alt={theme.image.alt}
              fill
              sizes="(max-width: 1024px) 90vw, 26rem"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="grid h-full w-full place-items-center bg-blush-100 px-8 text-center">
            <p className="font-script text-[1.75rem] leading-tight text-rose-400">
              Choose a theme and your basket appears here
            </p>
          </div>
        )}

        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-wine-900/80 via-wine-900/5 to-transparent" />

        {theme ? (
          <>
            <span
              aria-hidden
              className="absolute inset-x-0 top-[40%] h-2.5 transition-colors duration-500 ease-expo"
              style={{ backgroundColor: theme.palette[1] }}
            />
            <span
              aria-hidden
              className="absolute left-1/2 top-[36%] h-9 w-9 -translate-x-1/2 rounded-full ring-2 ring-white/30 transition-colors duration-500 ease-expo"
              style={{ backgroundColor: theme.palette[0] }}
            />
          </>
        ) : null}

        {/* Chosen items float up from the basket */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[0.5625rem] uppercase tracking-[0.24em] text-blush-300">
            {size.name} · {wrap.name} wrap
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {items.map((it) => (
              <li
                key={it.id}
                className="pop-in rounded-full bg-cream/92 px-2.5 py-1 text-[0.6875rem] text-wine-800"
              >
                {it.name}
              </li>
            ))}
            {items.length === 0 ? (
              <li className="text-[0.8125rem] text-blush-200/80">Nothing added yet</li>
            ) : null}
          </ul>
        </div>
      </div>

      {/* Allowance meter */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-[0.75rem] text-ink-muted">
          <span>
            {filled} of {size.itemAllowance} items
          </span>
          <span className="tabular-nums">{Math.round(pct)}% full</span>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-blush-200">
          <div
            className="h-full rounded-full bg-rose-500 transition-[width] duration-500 ease-expo"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="mt-5">
        <HandwrittenCard
          message={message}
          to={recipientName || undefined}
          from={senderName || undefined}
          compact
        />
      </div>

      {/* Total */}
      <div className="mt-5 flex items-end justify-between border-t border-blush-200 pt-5">
        <div>
          <p className="text-[0.625rem] uppercase tracking-[0.2em] text-ink-faint">Estimated total</p>
          <p className="mt-1 font-display text-[1.75rem] tabular-nums text-wine-700">
            {formatPKR(total)}
          </p>
        </div>
        <p className="max-w-[10rem] text-right text-[0.6875rem] leading-snug text-ink-faint">
          Confirmed with you before anything is charged
        </p>
      </div>
    </div>
  );
}
