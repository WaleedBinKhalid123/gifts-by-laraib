import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { DottedRule, FloatingHearts, Wash } from '@/components/ui/Ornament';

export default function NotFound() {
  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden bg-cream py-section">
      <Wash className="left-1/2 top-0 h-[38rem] w-[38rem] -translate-x-1/2" />
      <FloatingHearts />

      <div className="shell relative text-center">
        <p className="text-label uppercase tracking-[0.24em] text-rose-600">Error 404</p>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-display-md font-light text-wine-800">
          This one seems to have been delivered elsewhere.
        </h1>
        <p className="mt-2 font-script text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] text-rose-500">
          Let&apos;s find you another.
        </p>

        <div className="mt-8 flex justify-center">
          <DottedRule width={180} />
        </div>

        <p className="mx-auto mt-7 max-w-md text-[1rem] leading-relaxed text-ink-soft">
          The page you were after has moved or never existed. The baskets, thankfully, are all still
          where we left them.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/shop" size="lg" magnetic>
            Browse the collection
          </Button>
          <Button href="/customize" variant="outline" size="lg">
            Build your own
          </Button>
        </div>

        <p className="mt-8 text-[0.875rem] text-ink-muted">
          Or head back{' '}
          <Link href="/" className="link-underline text-wine-700">
            home
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
