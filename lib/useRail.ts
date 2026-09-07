'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Horizontal scroll rail behaviour, shared by the occasion and testimonial carousels.
 *
 * Two deliberate decisions:
 *
 * 1. **No wheel hijacking.** An earlier version translated vertical wheel into
 *    horizontal movement, which meant scrolling down with the cursor over a
 *    carousel moved the carousel instead of the page — indistinguishable from
 *    "the page won't scroll". A vertical gesture always scrolls the page now.
 *    Sideways movement comes from touch swipe, native horizontal trackpad
 *    gestures, click-and-drag, and the arrows.
 * 2. **Measure with ResizeObserver, not just on scroll.** Measuring only on
 *    scroll meant the "next" arrow could be born disabled and stay that way once
 *    images changed the layout.
 */
export function useRail<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [scrollable, setScrollable] = useState(false);
  const [index, setIndex] = useState(0);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const can = max > 4;

    setScrollable(can);
    setProgress(can ? el.scrollLeft / max : 0);
    setAtStart(el.scrollLeft <= 8);
    setAtEnd(!can || el.scrollLeft >= max - 8);

    const children = Array.from(el.children) as HTMLElement[];
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    children.forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setIndex(best);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    measure();
    const raf = requestAnimationFrame(measure);
    const settle = window.setTimeout(measure, 600);

    el.addEventListener('scroll', measure, { passive: true });

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);

    /* ---- Click-and-drag, mouse only ---- */
    let down = false;
    let startX = 0;
    let startLeft = 0;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      moved = false;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 5) {
        moved = true;
        el.style.cursor = 'grabbing';
        el.style.scrollSnapType = 'none';
      }
      if (moved) {
        e.preventDefault();
        el.scrollLeft = startLeft - dx;
      }
    };
    const endDrag = () => {
      if (!down) return;
      down = false;
      el.style.cursor = '';
      el.style.scrollSnapType = '';
      if (moved) {
        // Swallow the click that follows a real drag so cards don't navigate.
        const swallow = (ev: MouseEvent) => {
          ev.preventDefault();
          ev.stopPropagation();
        };
        el.addEventListener('click', swallow, { capture: true, once: true });
        window.setTimeout(() => el.removeEventListener('click', swallow, { capture: true }), 0);
      }
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      el.removeEventListener('scroll', measure);
      el.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
      ro.disconnect();
    };
  }, [measure]);

  /** Page the rail by roughly one screenful. */
  const page = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const step = Math.max(240, Math.min(el.clientWidth * 0.8, 720));
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }, []);

  /** Bring a specific child into view. */
  const goTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[Math.max(0, Math.min(el.children.length - 1, i))] as
      | HTMLElement
      | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - 24, behavior: 'smooth' });
  }, []);

  const railProps = { ref } as const;

  return { ref, railProps, progress, atStart, atEnd, scrollable, index, page, goTo };
}
