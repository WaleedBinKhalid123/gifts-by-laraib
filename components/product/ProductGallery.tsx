'use client';

import Image from '@/components/ui/Img';
import { useState } from 'react';
import { Expand } from 'lucide-react';
import { ImageLightbox } from '@/components/product/ImageLightbox';
import type { ProductImage } from '@/lib/types';
import { cn, photo } from '@/lib/utils';

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

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
      <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-blush-100 shadow-lift">
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
              className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
            />
          </div>
        ))}

        {/* The whole photo is the zoom target — a small button in one corner is
            a harder thing to hit than the picture itself, on any device. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Open ${name} photos full screen`}
          className="absolute inset-0 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-500"
        >
          <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-cream/85 px-3.5 py-2 text-[0.6875rem] uppercase tracking-[0.14em] text-wine-700 shadow-petal backdrop-blur-sm transition-all duration-500 ease-expo group-hover:bg-cream">
            <Expand className="h-3.5 w-3.5" strokeWidth={1.6} />
            Zoom
          </span>
        </button>

        <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-cream/85 px-3 py-1.5 text-[0.6875rem] tabular-nums tracking-[0.14em] text-wine-700 backdrop-blur-sm">
          {active + 1} / {images.length}
        </span>
      </div>

      {open ? (
        <ImageLightbox
          images={images}
          name={name}
          index={active}
          onIndex={setActive}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </div>
  );
}
