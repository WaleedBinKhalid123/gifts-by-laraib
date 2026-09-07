'use client';

import { useEffect, useRef } from 'react';
import { subscribeScroll, prefersReducedMotion } from '@/lib/scroll';

/**
 * Transform-only parallax, driven by the shared scroll ticker.
 *
 * Progress runs 0 → 1 as the container travels from "entering the viewport" to
 * "leaving it". Layers are written straight to `style.transform`, so there is no
 * React re-render per frame — the old approach re-rendered a motion component
 * on every scroll tick, which is why the hero felt heavy.
 */

export interface Layer {
  /** Vertical travel across the full range, in percent of the element's height. */
  y?: [number, number];
  /** Scale across the full range. */
  scale?: [number, number];
  /** Opacity across the full range. */
  opacity?: [number, number];
  /** Only apply while the viewport is at least this wide (px). */
  minWidth?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function useParallax<T extends HTMLElement = HTMLDivElement>(layers: Layer[]) {
  const containerRef = useRef<T>(null);
  const layerRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (prefersReducedMotion()) return;

    let width = window.innerWidth;
    const onResize = () => {
      width = window.innerWidth;
    };
    window.addEventListener('resize', onResize, { passive: true });

    const unsub = subscribeScroll(() => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight || 800;

      // 0 when the container's top hits the viewport top, 1 when its bottom leaves it.
      const total = rect.height + vh;
      const raw = (vh - rect.top) / total;
      const p = Math.max(0, Math.min(1, raw));

      layers.forEach((layer, i) => {
        const el = layerRefs.current[i];
        if (!el) return;

        if (layer.minWidth && width < layer.minWidth) {
          el.style.transform = '';
          el.style.opacity = '';
          return;
        }

        const parts: string[] = [];
        if (layer.y) parts.push(`translate3d(0, ${lerp(layer.y[0], layer.y[1], p).toFixed(3)}%, 0)`);
        if (layer.scale) parts.push(`scale(${lerp(layer.scale[0], layer.scale[1], p).toFixed(4)})`);
        el.style.transform = parts.length ? parts.join(' ') : '';

        if (layer.opacity) {
          el.style.opacity = String(
            Math.max(0, Math.min(1, lerp(layer.opacity[0], layer.opacity[1], p))).toFixed(3),
          );
        }
      });
    });

    return () => {
      unsub();
      window.removeEventListener('resize', onResize);
    };
    // layers is a literal defined at the call site; identity churn is harmless here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLayer = (i: number) => (el: HTMLElement | null) => {
    layerRefs.current[i] = el;
  };

  return { containerRef, setLayer };
}
