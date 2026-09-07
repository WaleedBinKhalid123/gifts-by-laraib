import { HeartMark } from '@/components/ui/Ornament';

const ITEMS = [
  'Hand-packed in Lahore',
  'Free nationwide delivery over Rs 8,000',
  'Every note written by hand',
  'Same-day dispatch in Lahore',
  'Fully customizable baskets',
  'Corporate orders from 10 units',
];

export function TrustBar() {
  return (
    <div className="relative overflow-hidden border-y border-blush-200 bg-blush-50 py-3.5">
      <div className="flex w-max animate-marquee-x items-center gap-0 motion-reduce:animate-none">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {ITEMS.map((item) => (
              <span key={`${dup}-${item}`} className="flex items-center whitespace-nowrap">
                <span className="px-6 text-[0.75rem] uppercase tracking-[0.2em] text-wine-700/75">
                  {item}
                </span>
                <HeartMark className="h-3 w-3 shrink-0 text-rose-300" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
