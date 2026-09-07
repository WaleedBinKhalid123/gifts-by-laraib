import { cn } from '@/lib/utils';
import { DottedRule } from '@/components/ui/Ornament';
import { Reveal, RevealText } from '@/components/ui/Reveal';

interface Props {
  eyebrow?: string;
  title: string;
  /** Trailing words rendered in the script accent face */
  script?: string;
  lede?: string;
  align?: 'left' | 'center';
  className?: string;
  as?: 'h1' | 'h2';
  tone?: 'dark' | 'light';
}

export function SectionHeading({
  eyebrow,
  title,
  script,
  lede,
  align = 'left',
  className,
  as = 'h2',
  tone = 'dark',
}: Props) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'max-w-3xl',
        centered && 'mx-auto flex flex-col items-center text-center',
        className,
      )}
    >
      {eyebrow ? (
        <Reveal delay={0.02}>
          <div className={cn('flex items-center gap-3', centered && 'justify-center')}>
            <span
              className={cn(
                'text-label uppercase tracking-[0.24em]',
                tone === 'light' ? 'text-blush-300' : 'text-rose-600',
              )}
            >
              {eyebrow}
            </span>
          </div>
        </Reveal>
      ) : null}

      <RevealText
        as={as}
        text={title}
        delay={0.06}
        className={cn(
          'mt-4 font-display font-light',
          as === 'h1' ? 'text-display-lg' : 'text-display-md',
          tone === 'light' ? 'text-cream' : 'text-wine-800',
        )}
      />

      {script ? (
        <Reveal delay={0.28}>
          <span
            className={cn(
              'mt-1 block font-script text-[clamp(2rem,1.2rem+2.6vw,3.4rem)] leading-[1.15]',
              tone === 'light' ? 'text-blush-300' : 'text-rose-500',
            )}
          >
            {script}
          </span>
        </Reveal>
      ) : null}

      <Reveal delay={0.22}>
        <DottedRule
          width={centered ? 200 : 160}
          className={cn('mt-5 opacity-80', tone === 'light' && 'text-blush-400/70')}
        />
      </Reveal>

      {lede ? (
        <Reveal delay={0.3}>
          <p
            className={cn(
              'mt-5 max-w-prose text-[1.0625rem] leading-[1.75]',
              tone === 'light' ? 'text-blush-200/85' : 'text-ink-soft',
            )}
          >
            {lede}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
