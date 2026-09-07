import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';
import { cn } from '@/lib/utils';

/**
 * The mark is the supplied brand badge — never redrawn, never recoloured.
 * On larger screens it sits beside a spaced serif lockup for legibility at small sizes.
 */
export function Logo({
  className,
  size = 44,
  withWordmark = true,
  tone = 'dark',
}: {
  className?: string;
  size?: number;
  withWordmark?: boolean;
  tone?: 'dark' | 'light';
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn('group inline-flex items-center gap-3', className)}
    >
      <span
        className="relative shrink-0 transition-transform duration-700 ease-expo group-hover:rotate-[6deg]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.png"
          alt=""
          width={size * 2}
          height={size * 2}
          priority
          className="h-full w-full object-contain"
        />
      </span>

      {withWordmark ? (
        <span className="hidden sm:flex flex-col leading-none">
          <span
            className={cn(
              'font-display text-[0.95rem] font-medium uppercase tracking-[0.28em]',
              tone === 'light' ? 'text-cream' : 'text-wine-700',
            )}
          >
            Gifts by Laraib
          </span>
          <span
            className={cn(
              'mt-[5px] text-[0.5rem] uppercase tracking-[0.34em]',
              tone === 'light' ? 'text-blush-300/80' : 'text-ink-muted',
            )}
          >
            Customized gift baskets
          </span>
        </span>
      ) : null}
    </Link>
  );
}
