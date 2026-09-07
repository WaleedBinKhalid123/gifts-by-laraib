'use client';

import Image from '@/components/ui/Img';
import Link from 'next/link';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { products } from '@/lib/content/products';
import { occasions } from '@/lib/content/occasions';
import { useOverlay } from '@/lib/useOverlay';
import { cn, formatPKR, photo } from '@/lib/utils';

const SUGGESTIONS = ['self-care', 'birthday', 'bridal', 'eid', 'under 5k', 'corporate'];

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { panelRef, exiting, dismiss } = useOverlay({ onClose, exitMs: 240 });

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 100);
    return () => window.clearTimeout(id);
  }, []);

  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!term) return { baskets: products.filter((p) => p.featured).slice(0, 4), occ: [] };
    const baskets = products.filter((p) =>
      [p.name, p.tagline, p.description, p.category, ...p.tags, ...p.occasions, ...p.includes.map((i) => i.name)]
        .join(' ')
        .toLowerCase()
        .includes(term),
    );
    const occ = occasions.filter((o) => `${o.name} ${o.line}`.toLowerCase().includes(term));
    return { baskets: baskets.slice(0, 6), occ: occ.slice(0, 4) };
  }, [term]);

  const empty = term.length > 0 && results.baskets.length === 0 && results.occ.length === 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className={cn(
        'fixed inset-0 z-[70]',
        exiting ? 'overlay-exit pointer-events-none' : 'overlay-enter',
      )}
    >
      <button
        aria-label="Close search"
        onClick={dismiss}
        className="absolute inset-0 cursor-default bg-wine-900/30 supports-[backdrop-filter]:backdrop-blur-[4px]"
      />

      <div
        ref={panelRef}
        className={cn(
          'relative mx-auto mt-[6vh] w-[min(46rem,92vw)] overflow-hidden rounded-2xl border border-blush-200 bg-cream shadow-float',
          exiting ? 'sheet-exit' : 'sheet-enter',
        )}
      >
        <div className="flex items-center gap-3 border-b border-blush-200 px-5 py-4">
          <Search className="h-[18px] w-[18px] shrink-0 text-rose-500" strokeWidth={1.5} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search baskets, occasions, or what's inside…"
            aria-label="Search baskets and occasions"
            className="w-full bg-transparent font-sans text-[0.9375rem] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <button
            onClick={dismiss}
            aria-label="Close search"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-blush-100"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto p-3">
          {!term ? (
            <div className="px-2 pb-2 pt-1">
              <p className="text-label uppercase text-ink-faint">Try</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setQ(s)}
                    className="rounded-full border border-blush-200 px-3 py-1.5 text-[0.8125rem] text-ink-soft transition-colors hover:border-rose-300 hover:text-wine-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-label uppercase text-ink-faint">Most gifted</p>
            </div>
          ) : null}

          {results.occ.length > 0 ? (
            <div className="mb-2 flex flex-wrap gap-2 px-2 py-2">
              {results.occ.map((o) => (
                <Link
                  key={o.slug}
                  href={`/occasions/${o.slug}`}
                  onClick={onClose}
                  className="rounded-full bg-blush-100 px-3 py-1.5 text-[0.8125rem] text-wine-700"
                >
                  <span aria-hidden className="mr-1.5">{o.emoji}</span>
                  {o.name}
                </Link>
              ))}
            </div>
          ) : null}

          <ul>
            {results.baskets.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/shop/${p.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-xl px-2 py-2.5 transition-colors hover:bg-blush-50"
                >
                  <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-blush-100">
                    <Image src={photo(p.images[0].id, 160)} alt="" fill sizes="56px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[1.0625rem] text-wine-800">
                      {p.name}
                    </span>
                    <span className="block truncate text-[0.8125rem] text-ink-muted">{p.tagline}</span>
                  </span>
                  <span className="shrink-0 text-[0.8125rem] text-rose-600">{formatPKR(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>

          {empty ? (
            <div className="px-3 py-10 text-center">
              <p className="font-display text-[1.375rem] text-wine-800">
                Nothing matches “{q}” — yet.
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] leading-relaxed text-ink-muted">
                We make almost everything to order. Tell us what you had in mind and we&apos;ll build it.
              </p>
              <Link
                href="/customize"
                onClick={onClose}
                className="mt-5 inline-flex h-11 items-center rounded-full bg-wine-700 px-6 text-[0.875rem] text-cream"
              >
                Build your own basket
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
