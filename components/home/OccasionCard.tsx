import Image from '@/components/ui/Img';
import Link from 'next/link';
import type { Occasion } from '@/lib/types';
import { photo } from '@/lib/utils';

export function OccasionCard({ occasion, index }: { occasion: Occasion; index: number }) {
  return (
    <Link
      href={`/occasions/${occasion.slug}`}
      className="group relative block w-[68vw] shrink-0 snap-start sm:w-[19rem] lg:w-[17.5rem]"
    >
      <div className="relative overflow-hidden rounded-[9rem_9rem_1.25rem_1.25rem] bg-blush-100 shadow-petal transition-[transform,box-shadow] duration-[600ms] ease-expo group-hover:-translate-y-2 group-hover:shadow-lift">
        <div className="relative aspect-[3/4.1]">
          <Image
            src={photo(occasion.image.id, 560)}
            alt={occasion.image.alt}
            fill
            loading={index < 3 ? 'eager' : 'lazy'}
            sizes="(max-width: 640px) 68vw, (max-width: 1024px) 40vw, 280px"
            className="object-cover transition-transform duration-[1100ms] ease-expo group-hover:scale-[1.08]"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-wine-900/78 via-wine-900/12 to-transparent"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-rose-700/0 transition-colors duration-700 group-hover:bg-rose-700/12"
          />

          {/* Emoji chip */}
          <span className="absolute left-4 top-5 grid h-10 w-10 place-items-center rounded-full bg-cream/92 text-[1.05rem] shadow-petal backdrop-blur-sm transition-transform duration-700 ease-expo group-hover:scale-110">
            <span aria-hidden>{occasion.emoji}</span>
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-[1.5rem] font-light leading-tight text-cream">
              {occasion.name}
            </h3>

            {/* Rule that draws across, then the line fades up */}
            <span
              aria-hidden
              className="mt-2.5 block h-px w-8 origin-left bg-blush-300/70 transition-transform duration-[700ms] ease-expo group-hover:scale-x-[4]"
            />
            <p className="mt-2 max-h-0 overflow-hidden text-[0.8125rem] leading-snug text-blush-200/0 transition-all duration-[600ms] ease-expo group-hover:max-h-16 group-hover:text-blush-200/90">
              {occasion.line}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
