'use client';

import Image from '@/components/ui/Img';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '@/lib/types';
import { cn, formatPKR, photo } from '@/lib/utils';

export function ProductCard({
  product,
  index = 0,
  priority = false,
  className,
}: {
  product: Product;
  index?: number;
  priority?: boolean;
  className?: string;
}) {
  const [primary, secondary] = product.images;
  const hasCompare = typeof product.compareAtPrice === 'number';
  /**
   * The hover image is only mounted once the pointer has actually arrived.
   * Rendering both up front doubled every listing page's image requests —
   * 24 downloads on a 12-card grid — for a flourish most visitors never see.
   */
  const [wantsHover, setWantsHover] = useState(false);

  return (
    <article
      data-reveal
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setWantsHover(true);
      }}
      className={cn('reveal group relative', className)}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        {/* ---- Frame ---- */}
        <div className="relative overflow-hidden rounded-[1.5rem] bg-blush-100 shadow-petal transition-[box-shadow,transform] duration-[700ms] ease-expo group-hover:-translate-y-1.5 group-hover:shadow-lift">
          <div className="relative aspect-[4/5]">
            <Image
              src={photo(primary.id, 800)}
              alt={primary.alt}
              fill
              priority={priority}
              loading={priority ? undefined : 'lazy'}
              sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 30vw"
              className={cn(
                'object-cover transition-[transform,opacity] duration-[1100ms] ease-expo group-hover:scale-[1.04]',
                // Never fade out until there is something behind it to reveal.
                secondary && wantsHover && 'group-hover:opacity-0',
              )}
            />
            {secondary && wantsHover ? (
              <Image
                src={photo(secondary.id, 640)}
                alt=""
                aria-hidden
                fill
                loading="lazy"
                sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 30vw"
                className="scale-[1.06] object-cover opacity-0 transition-[transform,opacity] duration-[1100ms] ease-expo group-hover:scale-100 group-hover:opacity-100"
              />
            ) : null}

            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-wine-900/30 via-transparent to-transparent opacity-70"
            />

            {/* Index — editorial detail, not a badge */}
            <span className="absolute left-4 top-4 font-display text-[0.8125rem] tracking-[0.14em] text-cream/80">
              {String(index + 1).padStart(2, '0')}
            </span>

            {product.customizable ? (
              <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-cream/92 px-3 py-1.5 text-[0.6875rem] uppercase tracking-[0.14em] text-wine-700 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-gold-400" strokeWidth={1.6} />
                Customizable
              </span>
            ) : null}

            {!product.available ? (
              <span className="absolute inset-x-0 bottom-0 bg-wine-900/80 py-2 text-center text-[0.75rem] uppercase tracking-[0.18em] text-cream">
                Currently unavailable
              </span>
            ) : null}

            {/* Slide-up CTA */}
            <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-[130%] rounded-full bg-cream/95 py-3 text-center text-[0.8125rem] font-medium tracking-[0.06em] text-wine-700 opacity-0 shadow-petal backdrop-blur-sm transition-all duration-[600ms] ease-expo group-hover:translate-y-0 group-hover:opacity-100 motion-reduce:hidden">
              View Gift
              <ArrowUpRight className="ml-1 inline h-4 w-4 align-[-3px]" strokeWidth={1.5} />
            </span>
          </div>
        </div>

        {/* ---- Meta ---- */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-[1.375rem] font-light leading-snug text-wine-800 transition-colors duration-300 group-hover:text-rose-600">
              {product.name}
            </h3>
            <p className="mt-1.5 text-[0.875rem] leading-snug text-ink-muted">{product.tagline}</p>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-display text-[1.125rem] text-wine-700">{formatPKR(product.price)}</p>
            {hasCompare ? (
              <p className="text-[0.75rem] text-ink-faint line-through">
                {formatPKR(product.compareAtPrice!)}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-3 text-[0.75rem] uppercase tracking-[0.16em] text-ink-faint">
          {product.includes.length} pieces
          <span className="mx-2 text-blush-300">·</span>
          {product.leadTimeDays === 1 ? 'Ready in 24h' : `${product.leadTimeDays} day lead time`}
        </p>
      </Link>
    </article>
  );
}
