'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { categories, priceFrom, products, recipients } from '@/lib/content/products';
import { occasions } from '@/lib/content/occasions';
import { ProductCard } from '@/components/shop/ProductCard';
import { cn, formatPKR } from '@/lib/utils';
import type { Product } from '@/lib/types';

type Sort = 'featured' | 'price-asc' | 'price-desc';

const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Most gifted' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
];

const BUDGETS = [
  { id: 'all', label: 'Any budget', test: () => true },
  { id: 'u3', label: 'Under Rs 4,000', test: (p: Product) => priceFrom(p) < 4000 },
  { id: 'u8', label: 'Rs 4,000 – 8,000', test: (p: Product) => priceFrom(p) >= 4000 && priceFrom(p) <= 8000 },
  { id: 'o8', label: 'Above Rs 8,000', test: (p: Product) => priceFrom(p) > 8000 },
];

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 rounded-full border px-4 py-2 text-[0.8125rem] transition-all duration-400 ease-expo',
        active
          ? 'border-wine-700 bg-wine-700 text-cream'
          : 'border-blush-300 bg-cream text-ink-soft hover:border-rose-400 hover:text-wine-700',
      )}
    >
      {children}
    </button>
  );
}

export function ProductGrid({
  initialOccasion,
  initialCategory,
  showFilters = true,
  items,
}: {
  initialOccasion?: string;
  initialCategory?: string;
  showFilters?: boolean;
  items?: Product[];
}) {
  const source = items ?? products;
  const [category, setCategory] = useState(initialCategory ?? 'all');
  const [occasion, setOccasion] = useState(initialOccasion ?? 'all');
  const [recipient, setRecipient] = useState('all');
  const [budget, setBudget] = useState('all');
  const [sort, setSort] = useState<Sort>('featured');
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const budgetTest = BUDGETS.find((b) => b.id === budget)!.test;
    const list = source.filter(
      (p) =>
        (category === 'all' || p.category === category) &&
        (occasion === 'all' || (p.occasions as string[]).includes(occasion)) &&
        (recipient === 'all' || (p.recipients as string[]).includes(recipient)) &&
        budgetTest(p),
    );
    if (sort === 'price-asc') return [...list].sort((a, b) => priceFrom(a) - priceFrom(b));
    if (sort === 'price-desc') return [...list].sort((a, b) => priceFrom(b) - priceFrom(a));
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [source, category, occasion, recipient, budget, sort]);

  const activeCount =
    (category !== 'all' ? 1 : 0) +
    (occasion !== 'all' ? 1 : 0) +
    (recipient !== 'all' ? 1 : 0) +
    (budget !== 'all' ? 1 : 0);

  const reset = () => {
    setCategory('all');
    setOccasion('all');
    setRecipient('all');
    setBudget('all');
  };

  return (
    <div>
      {showFilters ? (
        <div className="sticky top-[62px] z-30 -mx-gutter border-y border-blush-200 bg-cream/92 px-gutter py-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="rail no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
              <Pill active={category === 'all'} onClick={() => setCategory('all')}>
                All baskets
              </Pill>
              {categories.map((c) => (
                <Pill key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)}>
                  {c.name}
                </Pill>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-[0.8125rem] transition-colors duration-300',
                open || activeCount > 0
                  ? 'border-rose-400 text-wine-700'
                  : 'border-blush-300 text-ink-soft hover:border-rose-400',
              )}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.6} />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 ? (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[0.6875rem] text-cream">
                  {activeCount}
                </span>
              ) : null}
            </button>
          </div>

          {/* Height-free collapse: grid-template-rows 0fr → 1fr, no measuring. */}
          <div className="collapse" data-open={open} aria-hidden={!open}>
            <div>
              <div className="grid gap-5 pb-2 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-label uppercase text-ink-faint">Occasion</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill active={occasion === 'all'} onClick={() => setOccasion('all')}>
                        Any
                      </Pill>
                      {occasions.slice(0, 6).map((o) => (
                        <Pill key={o.slug} active={occasion === o.slug} onClick={() => setOccasion(o.slug)}>
                          {o.name}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-label uppercase text-ink-faint">Recipient</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Pill active={recipient === 'all'} onClick={() => setRecipient('all')}>
                        Anyone
                      </Pill>
                      {recipients.map((r) => (
                        <Pill key={r.slug} active={recipient === r.slug} onClick={() => setRecipient(r.slug)}>
                          {r.name}
                        </Pill>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-label uppercase text-ink-faint">Budget</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {BUDGETS.map((b) => (
                        <Pill key={b.id} active={budget === b.id} onClick={() => setBudget(b.id)}>
                          {b.label}
                        </Pill>
                      ))}
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Result meta */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.8125rem] text-ink-muted">
          <span className="tabular-nums text-wine-700">{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'basket' : 'baskets'}
          {activeCount > 0 ? (
            <button onClick={reset} className="ml-3 inline-flex items-center gap-1 text-rose-600">
              <X className="h-3 w-3" strokeWidth={1.8} />
              Clear filters
            </button>
          ) : null}
        </p>

        <label className="flex items-center gap-2 text-[0.8125rem] text-ink-muted">
          <span className="sr-only sm:not-sr-only">Sort by</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-blush-300 bg-cream px-3 py-1.5 text-[0.8125rem] text-wine-700 focus:outline-none"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="mt-16 rounded-2xl border border-dashed border-blush-300 bg-blush-50 px-6 py-16 text-center">
          <p className="font-script text-[2.25rem] leading-none text-rose-500">Nothing here yet</p>
          <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-soft">
            No basket matches that combination — but almost everything we make is built to order.
            Tell us what you had in mind and we&apos;ll put it together.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              onClick={reset}
              className="rounded-full border border-wine-700/25 px-5 py-2.5 text-[0.875rem] text-wine-700 transition-colors hover:border-wine-700"
            >
              Clear filters
            </button>
            <Link
              href="/customize"
              className="rounded-full bg-wine-700 px-5 py-2.5 text-[0.875rem] text-cream"
            >
              Build your own
            </Link>
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <p className="mt-12 text-center text-[0.8125rem] text-ink-faint">
          Prices from {formatPKR(Math.min(...filtered.map(priceFrom)))} · every basket can be
          customized
        </p>
      ) : null}
    </div>
  );
}
