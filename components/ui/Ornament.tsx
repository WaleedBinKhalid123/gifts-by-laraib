import { cn } from '@/lib/utils';

/** Small brand motifs lifted from the logo: heart outline, rule-with-dot, ribbon curve. */

export function HeartMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 22" fill="none" aria-hidden className={cn('h-4 w-4', className)}>
      <path
        d="M12 20.5S1.8 14.4 1.8 7.9A5.6 5.6 0 0 1 12 4.6a5.6 5.6 0 0 1 10.2 3.3c0 6.5-10.2 12.6-10.2 12.6Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The logo's signature divider: two hairlines with a dot between them. */
export function DottedRule({ className, width = 220 }: { className?: string; width?: number }) {
  return (
    <svg
      viewBox="0 0 220 8"
      width={width}
      height={8}
      fill="none"
      aria-hidden
      className={cn('text-rose-300', className)}
      preserveAspectRatio="none"
    >
      <path d="M0 4h92" stroke="currentColor" strokeWidth="1" />
      <circle cx="110" cy="4" r="2.6" fill="currentColor" />
      <path d="M128 4h92" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={cn('h-3 w-3', className)}>
      <path
        d="M10 0c.6 5.2 4.2 8.8 10 10-5.8 1.2-9.4 4.8-10 10-.6-5.2-4.2-8.8-10-10C5.8 8.8 9.4 5.2 10 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Flowing ribbon used to connect the "How it works" steps. */
export function RibbonPath({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      aria-hidden
      preserveAspectRatio="none"
      className={cn('h-[120px] w-full text-blush-300', className)}
    >
      <path
        d="M0 84C140 84 170 20 310 20s170 84 310 84 170-84 310-84 130 64 270 64"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="5 7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Big soft background wash.
 *
 * Uses a multi-stop radial gradient rather than `filter: blur()`. A 700px blur
 * radius on an element this large forces the compositor to re-rasterise a huge
 * surface on every scroll frame, which is one of the quickest ways to make an
 * otherwise light page feel sluggish. A gradient is free.
 */
export function Wash({
  className,
  from = '250,227,236',
  opacity = 0.9,
}: {
  className?: string;
  /** "r,g,b" */
  from?: string;
  opacity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute -z-10 rounded-full', className)}
      style={{
        background: `radial-gradient(closest-side, rgba(${from},${opacity}) 0%, rgba(${from},${opacity * 0.55}) 38%, rgba(${from},${opacity * 0.2}) 62%, rgba(${from},0) 80%)`,
      }}
    />
  );
}

export function FloatingHearts({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 -z-10', className)}>
      {[
        { l: '6%', t: '18%', s: 22, o: 0.35, d: '0s' },
        { l: '88%', t: '30%', s: 16, o: 0.28, d: '1.4s' },
        { l: '78%', t: '72%', s: 26, o: 0.22, d: '2.6s' },
        { l: '14%', t: '78%', s: 14, o: 0.3, d: '0.8s' },
      ].map((h, i) => (
        <span
          key={i}
          className="absolute animate-drift text-blush-300 motion-reduce:animate-none"
          style={{ left: h.l, top: h.t, opacity: h.o, animationDelay: h.d }}
        >
          <svg viewBox="0 0 24 22" width={h.s} height={h.s} fill="currentColor">
            <path d="M12 20.5S1.8 14.4 1.8 7.9A5.6 5.6 0 0 1 12 4.6a5.6 5.6 0 0 1 10.2 3.3c0 6.5-10.2 12.6-10.2 12.6Z" />
          </svg>
        </span>
      ))}
    </div>
  );
}
