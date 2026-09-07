import { DottedRule, HeartMark } from '@/components/ui/Ornament';
import { cn } from '@/lib/utils';

/** The note card preview. Shown in the builder and the homepage teaser. */
export function HandwrittenCard({
  message,
  to,
  from,
  className,
  compact = false,
}: {
  message: string;
  to?: string;
  from?: string;
  className?: string;
  compact?: boolean;
}) {
  const body = message.trim();

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-cream-100 shadow-lift ring-1 ring-blush-200',
        compact ? 'p-5' : 'p-6 sm:p-8',
        className,
      )}
      style={{
        backgroundImage:
          'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(253,248,244,0.9)), radial-gradient(60% 40% at 20% 0%, rgba(250,227,236,0.55), rgba(255,255,255,0))',
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-blush-100/70 blur-xl"
      />

      <div className="relative flex items-center justify-between">
        <span className="text-[0.5625rem] uppercase tracking-[0.28em] text-rose-500">
          Gifts by Laraib
        </span>
        <HeartMark className="h-3.5 w-3.5 text-rose-300" />
      </div>

      <DottedRule width={90} className="mt-3 opacity-70" />

      {to ? (
        <p className={cn('mt-4 font-script text-rose-600', compact ? 'text-[1.25rem]' : 'text-[1.5rem]')}>
          Dear {to},
        </p>
      ) : null}

      <p
        className={cn(
          'mt-2 whitespace-pre-wrap font-script leading-[1.55] text-wine-800',
          compact ? 'text-[1.15rem]' : 'text-[1.375rem] sm:text-[1.5rem]',
          !body && 'text-ink-faint/70',
        )}
      >
        {body || 'Your message will appear here, written out by hand on a card tucked inside the basket.'}
      </p>

      {from ? (
        <p
          className={cn(
            'mt-4 text-right font-script text-rose-600',
            compact ? 'text-[1.15rem]' : 'text-[1.375rem]',
          )}
        >
          — {from}
        </p>
      ) : null}
    </div>
  );
}
