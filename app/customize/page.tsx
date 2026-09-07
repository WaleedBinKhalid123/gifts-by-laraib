import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { BasketBuilder } from '@/components/builder/BasketBuilder';
import { HowItWorks } from '@/components/home/HowItWorks';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Build Your Own Gift Basket',
  description:
    'Design a customized gift basket piece by piece — choose the size, theme, contents, wrapping and a handwritten message. Sent straight to us on WhatsApp.',
  alternates: { canonical: '/customize' },
  openGraph: {
    title: `Build Your Own Gift Basket · ${site.name}`,
    description: 'Choose the size, theme, contents, wrapping and your handwritten note.',
    url: `${site.url}/customize`,
  },
};

export default function CustomizePage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Customize' }]}
        eyebrow="The configurator"
        title="Make it uniquely"
        script="theirs."
        lede="Five steps, no forms to fight with. Build the basket as you'd like to receive it and we'll take it from there."
      />

      <section className="bg-cream pb-section">
        <div className="shell">
          <BasketBuilder />
        </div>
      </section>

      <HowItWorks />
    </>
  );
}
