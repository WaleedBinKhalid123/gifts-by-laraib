'use client';

import Image from '@/components/ui/Img';
import { useState } from 'react';
import type { ProductImage } from '@/lib/types';
import { cn, photo } from '@/lib/utils';

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">
      {/* Thumbs */}
      <ul className="rail no-scrollbar flex shrink-0 gap-3 overflow-x-auto sm:flex-col sm:overflow-visible">
        {images.map((img, i) => (
          <li key={img.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={cn(
                'relative h-16 w-16 overflow-hidden rounded-md ring-1 transition-all duration-400 ease-expo sm:h-[4.75rem] sm:w-[4.75rem]',
                i === active
                  ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-cream'
                  : 'opacity-65 ring-blush-200 hover:opacity-100',
              )}
            >
              <Image
                src={photo(img.id, 200)}
                alt=""
                fill
                sizes="76px"
                className="object-cover"
              />
            </button>
          </li>
        ))}
      </ul>

      {/* Main */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-blush-100 shadow-lift">
        {/* Every frame stays mounted and crossfades — switching is instant
            after the first view, with no unmount flash. */}
        {images.map((img, i) => (
          <div key={img.id} className="xfade" data-active={i === active}>
            <Image
              src={photo(img.id, 1100)}
              alt={i === active ? `${name} — ${img.alt}` : ''}
              aria-hidden={i !== active}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
              sizes="(max-width: 1024px) 92vw, 44vw"
              className="object-cover"
            />
          </div>
        ))}

        <span className="absolute bottom-4 right-4 rounded-full bg-cream/85 px-3 py-1.5 text-[0.6875rem] tabular-nums tracking-[0.14em] text-wine-700 backdrop-blur-sm">
          {active + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
