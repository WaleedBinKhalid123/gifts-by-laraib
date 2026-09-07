'use client';

import { useEffect, useState } from 'react';

/**
 * One rAF-throttled scroll listener for the whole app, shared by the navbar,
 * the floating WhatsApp button and every parallax layer.
 *
 * Registering a listener per component is what makes a page with a dozen
 * scroll-linked effects stutter. This keeps it to a single listener and a single
 * frame of work regardless of how many subscribers there are.
 */

type Subscriber = (y: number) => void;

const subs = new Set<Subscriber>();
let frame = 0;
let bound = false;

function run() {
  frame = 0;
  const y = window.scrollY || window.pageYOffset || 0;
  subs.forEach((fn) => fn(y));
}

function schedule() {
  if (frame) return;
  frame = requestAnimationFrame(run);
}

export function subscribeScroll(fn: Subscriber) {
  subs.add(fn);
  if (!bound) {
    bound = true;
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
  fn(window.scrollY || 0);

  return () => {
    subs.delete(fn);
    if (subs.size === 0 && bound) {
      bound = false;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      frame = 0;
    }
  };
}

/** True once the page has scrolled past `threshold`. Re-renders only on change. */
export function useScrolledPast(threshold: number) {
  const [past, setPast] = useState(false);

  useEffect(
    () =>
      subscribeScroll((y) => {
        const next = y > threshold;
        setPast((prev) => (prev === next ? prev : next));
      }),
    [threshold],
  );

  return past;
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
