'use client';

import { site } from '@/lib/site';
import { instagramProfile } from '@/lib/order';
import { useScrolledPast } from '@/lib/scroll';
import { cn } from '@/lib/utils';

/** Appears once the visitor is clearly browsing. Mobile-first, unobtrusive on desktop. */
export function InstagramFab() {
  const show = useScrolledPast(900);

  return (
    <a
      href={instagramProfile()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${site.name} on Instagram`}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cn(
        'group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full px-[15px] text-white shadow-lift',
        'bg-[linear-gradient(120deg,#F9A245_0%,#E8446E_45%,#C42FA0_78%,#8B3AC4_100%)]',
        'transition-[opacity,transform,padding] duration-500 ease-expo sm:bottom-7 sm:right-7',
        show
          ? 'translate-y-0 scale-100 opacity-100 hover:pr-6'
          : 'pointer-events-none translate-y-3 scale-95 opacity-0',
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-6 w-6 shrink-0">
        <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.4" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="17.3" cy="6.7" r="1.25" fill="currentColor" />
      </svg>
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-expo group-hover:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap text-[0.875rem] font-medium">
          <span className="pl-2.5">Message us</span>
        </span>
      </span>
    </a>
  );
}
