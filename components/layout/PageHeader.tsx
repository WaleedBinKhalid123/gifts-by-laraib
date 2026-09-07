import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DottedRule, Wash } from '@/components/ui/Ornament';
import { Reveal, RevealText } from '@/components/ui/Reveal';

export interface Crumb {
  label: string;
  href?: string;
}

export function PageHeader({
  eyebrow,
  title,
  script,
  lede,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  script?: string;
  lede?: string;
  crumbs?: Crumb[];
}) {
  return (
    <header className="paper relative overflow-hidden pb-[clamp(2rem,1.5rem+2vw,3rem)] pt-[calc(var(--nav-h)+clamp(1.75rem,1rem+3vw,3.25rem))]">
      <Wash className="left-[-15%] top-[-25%] h-[36rem] w-[36rem]" />

      <div className="shell relative">
        {crumbs.length > 0 ? (
          <Reveal>
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-[0.75rem] text-ink-faint">
                <li>
                  <Link href="/" className="link-underline hover:text-wine-700">
                    Home
                  </Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3 w-3 text-blush-400" strokeWidth={1.6} />
                    {c.href ? (
                      <Link href={c.href} className="link-underline hover:text-wine-700">
                        {c.label}
                      </Link>
                    ) : (
                      <span className="text-ink-muted">{c.label}</span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </Reveal>
        ) : null}

        {eyebrow ? (
          <Reveal delay={0.04}>
            <p className="mt-6 text-label uppercase tracking-[0.24em] text-rose-600">{eyebrow}</p>
          </Reveal>
        ) : null}

        <RevealText
          as="h1"
          text={title}
          delay={0.08}
          className="mt-4 max-w-4xl font-display text-display-lg font-light leading-[0.98] text-wine-800"
        />

        {script ? (
          <Reveal delay={0.24}>
            <p className="mt-1 font-script text-[clamp(2rem,1.2rem+2.8vw,3.6rem)] leading-[1.1] text-rose-500">
              {script}
            </p>
          </Reveal>
        ) : null}

        <Reveal delay={0.28}>
          <DottedRule width={160} className="mt-7" />
        </Reveal>

        {lede ? (
          <Reveal delay={0.32}>
            <p className="mt-6 max-w-2xl text-[1.0625rem] leading-[1.8] text-ink-soft">{lede}</p>
          </Reveal>
        ) : null}
      </div>
    </header>
  );
}
