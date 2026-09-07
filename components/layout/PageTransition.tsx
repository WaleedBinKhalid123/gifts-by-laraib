'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { releaseAllScrollLocks } from '@/lib/useOverlay';

/**
 * A short CSS fade-and-rise, re-keyed on the pathname so it replays per route.
 * No exit animation on purpose — waiting for one delays navigation, which is the
 * opposite of premium.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Safety valve: whatever happened on the previous page, a new route always
  // starts scrollable. Overlays close on navigation, so nothing legitimate is
  // holding a lock at this point.
  useEffect(() => {
    releaseAllScrollLocks();
  }, [pathname]);

  return (
    <div key={pathname} className="page-in">
      {children}
    </div>
  );
}
