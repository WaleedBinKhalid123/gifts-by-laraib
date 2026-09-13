'use client';

import * as React from 'react';
import { createPortal } from 'react-dom';
import Image from '@/components/ui/Img';
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { useOverlay } from '@/lib/useOverlay';
import { cn, photo } from '@/lib/utils';
import type { ProductImage } from '@/lib/types';

/**
 * Full-screen photo viewer with zoom.
 *
 * The zoom is written by hand rather than pulled from a library, for the same
 * reason the rest of this site has no animation dependency: the whole behaviour
 * is three numbers — scale, x, y — and every input (wheel, pinch, drag,
 * buttons, keyboard, double-tap) is just a different way of changing them.
 *
 * The one rule that makes zooming feel right is that the point under the
 * cursor or between the fingers must stay put. That is `zoomAt` below.
 */

const MIN = 1;
const MAX = 4.5;
const STEP = 1.6;

interface View {
  scale: number;
  x: number;
  y: number;
}

const RESET: View = { scale: 1, x: 0, y: 0 };

export function ImageLightbox({
  images,
  name,
  index,
  onIndex,
  onClose,
}: {
  images: ProductImage[];
  name: string;
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const { panelRef, exiting, dismiss } = useOverlay({ onClose, exitMs: 240 });

  /**
   * Rendered into <body>. The gallery sits inside the page-transition wrapper,
   * which animates `transform` — and a transformed ancestor turns `position:
   * fixed` into "fixed relative to that ancestor", which would clip the viewer.
   */
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const stageRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const [view, setView] = React.useState<View>(RESET);
  const [glide, setGlide] = React.useState(true);
  const viewRef = React.useRef(view);
  viewRef.current = view;

  /** Natural pixels of the photo currently shown — set on load. */
  const natural = React.useRef({ w: 0, h: 0 });

  const current = images[index];
  const zoomed = view.scale > 1.001;

  React.useEffect(() => {
    closeRef.current?.focus();
  }, [mounted]);

  /* Every image change starts fresh. */
  React.useEffect(() => {
    setGlide(false);
    setView(RESET);
    natural.current = { w: 0, h: 0 };
  }, [index]);

  /**
   * How large the photo actually renders at scale 1: `object-contain` inside
   * the stage. Panning is clamped to this box, not to the stage, so a portrait
   * photo cannot be dragged sideways into empty letterbox space.
   */
  const fitted = React.useCallback(() => {
    const stage = stageRef.current;
    const { w, h } = natural.current;
    if (!stage || !w || !h) return { w: 0, h: 0 };
    const k = Math.min(stage.clientWidth / w, stage.clientHeight / h);
    return { w: w * k, h: h * k };
  }, []);

  const clamp = React.useCallback(
    (v: View): View => {
      const stage = stageRef.current;
      const box = fitted();
      if (!stage || !box.w) return v;
      const maxX = Math.max(0, (box.w * v.scale - stage.clientWidth) / 2);
      const maxY = Math.max(0, (box.h * v.scale - stage.clientHeight) / 2);
      return {
        scale: v.scale,
        x: Math.min(maxX, Math.max(-maxX, v.x)),
        y: Math.min(maxY, Math.max(-maxY, v.y)),
      };
    },
    [fitted],
  );

  /**
   * Change the scale while holding one point of the image still. `cx`/`cy` are
   * viewport coordinates — the cursor, or the midpoint between two fingers.
   * Omit them to zoom about the centre (the buttons and the keyboard do).
   */
  const zoomAt = React.useCallback(
    (next: number, cx?: number, cy?: number) => {
      const stage = stageRef.current;
      if (!stage) return;
      const rect = stage.getBoundingClientRect();
      const v = viewRef.current;
      const scale = Math.min(MAX, Math.max(MIN, next));

      // Pointer position relative to the stage centre.
      const px = (cx ?? rect.left + rect.width / 2) - (rect.left + rect.width / 2);
      const py = (cy ?? rect.top + rect.height / 2) - (rect.top + rect.height / 2);

      const k = scale / v.scale;
      const moved: View = {
        scale,
        x: px - (px - v.x) * k,
        y: py - (py - v.y) * k,
      };
      setView(clamp(scale === MIN ? { ...RESET } : moved));
    },
    [clamp],
  );

  /* ---------------- wheel ---------------- */
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    // Registered by hand because React's onWheel is passive — it cannot
    // preventDefault, and without that the page behind scrolls as you zoom.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setGlide(false);
      const factor = Math.exp(-e.deltaY * 0.0022);
      zoomAt(viewRef.current.scale * factor, e.clientX, e.clientY);
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [zoomAt, mounted]);

  /* ---------------- drag + pinch ---------------- */
  const pointers = React.useRef(new Map<number, { x: number; y: number }>());
  const pinch = React.useRef<{ dist: number; scale: number } | null>(null);
  const drag = React.useRef<{ x: number; y: number; from: View } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setGlide(false);

    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), scale: viewRef.current.scale };
      drag.current = null;
    } else if (zoomed) {
      drag.current = { x: e.clientX, y: e.clientY, from: viewRef.current };
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch.current.dist > 0) {
        zoomAt(
          (pinch.current.scale * dist) / pinch.current.dist,
          (a.x + b.x) / 2,
          (a.y + b.y) / 2,
        );
      }
      return;
    }

    if (drag.current) {
      const d = drag.current;
      setView(clamp({ ...d.from, x: d.from.x + (e.clientX - d.x), y: d.from.y + (e.clientY - d.y) }));
    }
  }

  function onPointerUp(e: React.PointerEvent) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 0) drag.current = null;
  }

  /* ---------------- keyboard ---------------- */
  const step = React.useCallback(
    (dir: 1 | -1) => {
      setGlide(true);
      zoomAt(dir === 1 ? viewRef.current.scale * STEP : viewRef.current.scale / STEP);
    },
    [zoomAt],
  );

  const go = React.useCallback(
    (delta: number) => {
      if (images.length < 2) return;
      onIndex((index + delta + images.length) % images.length);
    },
    [images.length, index, onIndex],
  );

  React.useEffect(() => {
    // Escape, Tab and the scroll lock are handled by useOverlay.
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); step(1); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); step(-1); }
      else if (e.key === '0') { e.preventDefault(); setGlide(true); setView(RESET); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, step]);

  /* A resize can leave the photo panned outside its new bounds. */
  React.useEffect(() => {
    const onResize = () => setView((v) => clamp(v));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [clamp]);

  function onDoubleClick(e: React.MouseEvent) {
    setGlide(true);
    if (zoomed) setView(RESET);
    else zoomAt(2.4, e.clientX, e.clientY);
  }

  if (!mounted) return null;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${name} — photo viewer`}
      className={cn(
        'fixed inset-0 z-[70] flex flex-col bg-ink/95 backdrop-blur-sm',
        exiting ? 'overlay-exit pointer-events-none' : 'overlay-enter',
      )}
    >
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <p className="min-w-0 truncate text-[0.8125rem] tracking-[0.14em] text-cream/70">
          <span className="uppercase">{name}</span>
          <span className="px-2 text-cream/35">/</span>
          <span className="tabular-nums">{index + 1} of {images.length}</span>
        </p>

        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close viewer"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cream/20 text-cream transition-colors duration-300 hover:border-cream/50 hover:bg-cream/10"
        >
          <X className="h-5 w-5" strokeWidth={1.4} />
        </button>
      </div>

      {/* Stage */}
      <div
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        className={cn(
          'relative flex-1 touch-none select-none overflow-hidden',
          zoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in',
        )}
      >
        <div
          className={cn('absolute inset-0', glide && 'transition-transform duration-500 ease-expo')}
          style={{
            transform: `translate3d(${view.x}px, ${view.y}px, 0) scale(${view.scale})`,
          }}
        >
          <Image
            key={current.id}
            src={photo(current.id, 2000)}
            alt={`${name} — ${current.alt}`}
            fill
            quality={82}
            sizes="100vw"
            priority
            draggable={false}
            onLoad={(e) => {
              const el = e.currentTarget;
              natural.current = { w: el.naturalWidth, h: el.naturalHeight };
            }}
            className="object-contain"
          />
        </div>

        {/* Arrows — outside the transformed layer so zoom never moves them. */}
        {images.length > 1 ? (
          <>
            <Arrow side="left" onClick={() => go(-1)} />
            <Arrow side="right" onClick={() => go(1)} />
          </>
        ) : null}
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 px-4 pb-5 pt-3 sm:gap-5 sm:px-6">
        <div className="flex items-center gap-1 rounded-full border border-cream/15 bg-cream/[0.06] p-1">
          <Control onClick={() => step(-1)} disabled={view.scale <= MIN + 0.001} label="Zoom out">
            <Minus className="h-4 w-4" strokeWidth={1.6} />
          </Control>

          <span className="w-14 text-center text-[0.75rem] tabular-nums text-cream/75">
            {Math.round(view.scale * 100)}%
          </span>

          <Control onClick={() => step(1)} disabled={view.scale >= MAX - 0.001} label="Zoom in">
            <Plus className="h-4 w-4" strokeWidth={1.6} />
          </Control>

          <Control
            onClick={() => { setGlide(true); setView(RESET); }}
            disabled={!zoomed}
            label="Reset zoom"
          >
            <RotateCcw className="h-4 w-4" strokeWidth={1.6} />
          </Control>
        </div>

        {images.length > 1 ? (
          <ul className="flex gap-2">
            {images.map((img, i) => (
              <li key={img.id}>
                <button
                  type="button"
                  onClick={() => onIndex(i)}
                  aria-label={`Photo ${i + 1}`}
                  aria-current={i === index}
                  className={cn(
                    'relative h-12 w-12 overflow-hidden rounded-md ring-1 transition-all duration-400 ease-expo',
                    i === index
                      ? 'ring-2 ring-cream'
                      : 'opacity-50 ring-cream/25 hover:opacity-90',
                  )}
                >
                  <Image src={photo(img.id, 200)} alt="" fill sizes="48px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="hidden text-[0.75rem] text-cream/45 lg:block">
          Scroll or pinch to zoom · drag to move · double-click to reset
        </p>
      </div>
    </div>,
    document.body,
  );
}

function Control({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 place-items-center rounded-full text-cream transition-colors duration-300 hover:bg-cream/15 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function Arrow({ side, onClick }: { side: 'left' | 'right'; onClick: () => void }) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous photo' : 'Next photo'}
      className={cn(
        'absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full',
        'border border-cream/20 bg-ink/40 text-cream backdrop-blur-sm',
        'transition-colors duration-300 hover:border-cream/50 hover:bg-ink/70',
        side === 'left' ? 'left-3 sm:left-6' : 'right-3 sm:right-6',
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.5} />
    </button>
  );
}
