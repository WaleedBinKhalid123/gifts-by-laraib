'use client';

import Link from 'next/link';
import * as React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'wa';
type Size = 'sm' | 'md' | 'lg';

const base =
  'group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden ' +
  'font-sans font-medium tracking-[0.02em] rounded-full ' +
  'transition-[transform,box-shadow,background-color,color] duration-300 ease-expo ' +
  'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45';

const variants: Record<Variant, string> = {
  primary:
    'bg-wine-700 text-cream shadow-petal hover:shadow-lift hover:bg-wine-600',
  outline:
    'border border-wine-700/25 text-wine-700 hover:border-wine-700/60 hover:bg-wine-700/[0.04]',
  ghost: 'text-wine-700 hover:bg-wine-700/[0.06]',
  wa: 'bg-[#1FA855] text-white shadow-petal hover:shadow-lift hover:bg-[#188F47]',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-[0.8rem]',
  md: 'h-11 px-6 text-[0.875rem]',
  lg: 'h-[3.25rem] px-8 text-[0.9375rem]',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  loading?: boolean;
  /** Subtle cursor attraction on pointer-fine devices only */
  magnetic?: boolean;
}

/** Sheen sweep — one shared decorative layer, not per-instance CSS. */
function Sheen() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 -translate-x-[120%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-[900ms] ease-expo group-hover/btn:translate-x-[220%] motion-reduce:hidden"
    />
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = 'primary', size = 'md', href, external, loading, magnetic, children, ...props },
  ref,
) {
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const classes = cn(base, variants[variant], sizes[size], className);

  React.useEffect(() => {
    if (!magnetic) return;
    const el = wrapRef.current;
    if (!el) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * 0.18;
      const y = (e.clientY - (r.top + r.height / 2)) * 0.24;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = 'translate3d(0,0,0)';
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [magnetic]);

  const inner = (
    <>
      <Sheen />
      <span className="relative z-10 inline-flex items-center gap-2">
        {loading ? (
          <span
            aria-hidden
            className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
          />
        ) : null}
        {children}
      </span>
    </>
  );

  const node = href ? (
    external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {inner}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    )
  ) : (
    <button ref={ref} className={classes} aria-busy={loading || undefined} {...props}>
      {inner}
    </button>
  );

  if (!magnetic) return node;

  return (
    <span
      ref={wrapRef}
      className="inline-block transition-transform duration-500 ease-expo will-change-transform"
    >
      {node}
    </span>
  );
});
