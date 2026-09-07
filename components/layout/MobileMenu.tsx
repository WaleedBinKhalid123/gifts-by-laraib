'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { site } from '@/lib/site';
import { occasions } from '@/lib/content/occasions';
import { waGeneral } from '@/lib/whatsapp';
import { useOverlay } from '@/lib/useOverlay';
import { DottedRule, HeartMark } from '@/components/ui/Ornament';
import { cn } from '@/lib/utils';

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const { panelRef, exiting, dismiss } = useOverlay({ onClose, exitMs: 420 });

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className={cn(
        'fixed inset-0 z-[60] lg:hidden',
        // Stop the closing panel from swallowing clicks aimed at what is behind it.
        exiting ? 'overlay-exit pointer-events-none' : 'overlay-enter',
      )}
    >
      <div className={cn('absolute inset-0 bg-cream', exiting ? 'curtain-exit' : 'curtain-enter')} />
      <div className="paper absolute inset-0" aria-hidden />

      <div className="relative flex h-full flex-col overflow-y-auto px-gutter pb-10 pt-6">
        <div className="flex items-center justify-between">
          <span className="font-script text-[1.6rem] leading-none text-wine-700">
            Gifts by Laraib
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={dismiss}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-full border border-blush-200 text-wine-700"
          >
            <X className="h-5 w-5" strokeWidth={1.4} />
          </button>
        </div>

        <ul className="mt-10 space-y-1">
          {site.nav.map((item, i) => (
            <li key={item.href} className="overflow-hidden">
              <div className="rise-in" style={{ animationDelay: `${90 + i * 45}ms` }}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-4 py-2"
                >
                  <span className="w-6 text-[0.625rem] tracking-[0.2em] text-rose-400">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[2.4rem] font-light leading-tight text-wine-800 transition-colors duration-300 group-hover:text-rose-600">
                    {item.label}
                  </span>
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 rise-in" style={{ animationDelay: '330ms' }}>
          <DottedRule width={140} />
          <p className="mt-6 text-label uppercase text-rose-600">Shop by occasion</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {occasions.slice(0, 8).map((o) => (
              <Link
                key={o.slug}
                href={`/occasions/${o.slug}`}
                onClick={onClose}
                className="rounded-full border border-blush-200 bg-white/60 px-3.5 py-2 text-[0.8125rem] text-ink-soft"
              >
                <span aria-hidden className="mr-1.5">{o.emoji}</span>
                {o.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-10 rise-in" style={{ animationDelay: '370ms' }}>
          <a
            href={waGeneral()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-wine-700 text-[0.9375rem] font-medium text-cream"
          >
            <HeartMark className="h-4 w-4" />
            Order on WhatsApp
          </a>
          <p className="mt-4 text-center text-[0.8125rem] text-ink-muted">
            {site.whatsapp.display} · {site.hours}
          </p>
        </div>
      </div>
    </div>
  );
}
