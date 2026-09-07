'use client';

import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

/** Minimal, dependency-free toast. One message at a time is plenty here. */
export function useToast(duration = 2600) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(() => setMessage(null), duration);
    return () => window.clearTimeout(id);
  }, [message, duration]);

  return { message, toast: setMessage };
}

export function Toast({ message }: { message: string | null }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-4"
    >
      {message ? (
        <div className="pop-in flex items-center gap-2.5 rounded-full bg-wine-800 px-5 py-3 text-[0.875rem] text-cream shadow-float">
          <Check className="h-4 w-4 text-blush-300" strokeWidth={2} />
          {message}
        </div>
      ) : null}
    </div>
  );
}
