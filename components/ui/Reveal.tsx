import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Scroll reveals — server components, zero client JavaScript.
 *
 * These render plain markup carrying `data-reveal` and a class. The inline
 * engine in app/layout.tsx (lib/reveal-engine.ts) does the rest. Because the
 * hidden state lives behind `html.js`, content is always visible if that engine
 * is absent for any reason.
 *
 * `delay` is in seconds, matching the old animation-library call sites.
 */

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'span' | 'article' | 'figure';
}

const delayStyle = (delay: number): React.CSSProperties | undefined =>
  delay ? { transitionDelay: `${Math.round(delay * 1000)}ms` } : undefined;

export function Reveal({ children, className, delay = 0, as: Tag = 'div' }: RevealProps) {
  return (
    <Tag data-reveal className={cn('reveal', className)} style={delayStyle(delay)}>
      {children}
    </Tag>
  );
}

/**
 * Word-by-word masked reveal for editorial headings.
 * The full string stays available to screen readers via aria-label.
 */
export function RevealText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.04,
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p';
}) {
  const words = text.split(' ');

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden data-reveal className="reveal-words inline">
        {words.map((w, i) => (
          <span key={`${w}-${i}`} className="rw">
            <span
              className={wordClassName}
              style={{
                transitionDelay: `${Math.round((delay + Math.min(i * stagger, 0.32)) * 1000)}ms`,
              }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}

/** Image that uncovers itself and settles from a slight over-scale. */
export function RevealImage({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      data-reveal
      className={cn('reveal-clip overflow-hidden', className)}
      style={delayStyle(delay)}
    >
      <div className="h-full w-full">{children}</div>
    </div>
  );
}
