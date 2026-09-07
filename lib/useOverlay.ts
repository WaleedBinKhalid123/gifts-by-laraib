'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Body scroll locking, reference-counted.
 *
 * The naïve version — save `body.style.overflow`, restore it on unmount — breaks
 * the moment two overlays overlap: the second saves "hidden" as the previous
 * value and restores it, leaving the page permanently unscrollable.
 */
let locks = 0;
let savedOverflow = '';
let savedPaddingRight = '';

function lockScroll() {
  if (locks === 0) {
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    savedOverflow = document.body.style.overflow;
    savedPaddingRight = document.body.style.paddingRight;
    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;
  }
  locks += 1;
}

function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
  }
}

/** Last-resort valve, wired to route changes: clears any lock left behind. */
export function releaseAllScrollLocks() {
  locks = 0;
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

/**
 * Overlay plumbing: scroll lock, Escape to close, focus trap, and a CSS exit
 * animation that finishes before the component unmounts.
 *
 * Note the empty dependency array. An earlier version listed `dismiss`, which is
 * recreated when `exiting` flips — so calling dismiss() re-ran the effect, and
 * its cleanup cancelled the very timeout that was about to unmount the overlay.
 * The panel stayed mounted, the scroll lock was never released, and the page
 * became unscrollable until a hard refresh. Everything mutable lives in refs now,
 * and the timer is only cleared on real unmount.
 */
export function useOverlay({
  onClose,
  exitMs = 300,
}: {
  onClose: () => void;
  exitMs?: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [exiting, setExiting] = useState(false);

  const timer = useRef<number | null>(null);
  const exitingRef = useRef(false);
  const onCloseRef = useRef(onClose);
  const exitMsRef = useRef(exitMs);

  onCloseRef.current = onClose;
  exitMsRef.current = exitMs;

  const dismiss = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    setExiting(true);
    timer.current = window.setTimeout(() => {
      timer.current = null;
      onCloseRef.current();
    }, exitMsRef.current);
  }, []);

  useEffect(() => {
    lockScroll();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        dismiss();
        return;
      }
      if (e.key !== 'Tab') return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      if (timer.current) window.clearTimeout(timer.current);
      unlockScroll();
    };
    // Intentionally empty: see the note above. `dismiss` is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { panelRef, exiting, dismiss };
}
