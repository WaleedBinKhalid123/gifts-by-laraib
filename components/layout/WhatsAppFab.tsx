'use client';

import { site } from '@/lib/site';
import { waGeneral } from '@/lib/whatsapp';
import { useScrolledPast } from '@/lib/scroll';
import { cn } from '@/lib/utils';

/** Appears once the visitor is clearly browsing. Mobile-first, unobtrusive on desktop. */
export function WhatsAppFab() {
  const show = useScrolledPast(900);

  return (
    <a
      href={waGeneral()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${site.name} on WhatsApp`}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={cn(
        'group fixed bottom-5 right-5 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#1FA855] px-[15px] text-white shadow-lift',
        'transition-[opacity,transform,padding] duration-500 ease-expo sm:bottom-7 sm:right-7',
        show
          ? 'translate-y-0 scale-100 opacity-100 hover:pr-6'
          : 'pointer-events-none translate-y-3 scale-95 opacity-0',
      )}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-6 w-6 shrink-0">
        <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        <path d="M12.04 2C6.6 2 2.17 6.43 2.17 11.87c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.83 9.83 0 0 0 4.7 1.2h.01c5.44 0 9.87-4.43 9.87-9.87S17.48 2 12.04 2Zm0 18.03h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.17 8.17 0 0 1-1.25-4.32c0-4.52 3.68-8.2 8.2-8.2a8.2 8.2 0 0 1 8.2 8.2c0 4.52-3.68 8.2-8.2 8.2Z" />
      </svg>
      <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-expo group-hover:grid-cols-[1fr]">
        <span className="overflow-hidden whitespace-nowrap text-[0.875rem] font-medium">
          <span className="pl-2.5">Chat with us</span>
        </span>
      </span>
    </a>
  );
}
