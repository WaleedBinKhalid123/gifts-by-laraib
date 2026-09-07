import type { Occasion } from '@/lib/types';

/**
 * Occasions drive both the homepage discovery rail and /occasions/[slug].
 * Swap this array for a CMS query later — nothing else needs to change.
 */
export const occasions: Occasion[] = [
  {
    slug: 'birthday',
    name: 'Birthday',
    line: 'Make the whole day feel like the moment',
    blurb:
      'Confetti-bright, sweet and a little indulgent. Birthday baskets built around the things they actually love — not just what looked good in the shop.',
    emoji: '🎂',
    accent: 'rose',
    image: { id: 'photo-1759607574688-af5711054087', alt: 'Pink balloons and a birthday cake set for a celebration' },
  },
  {
    slug: 'anniversary',
    name: 'Anniversary',
    line: 'For the years, and the ones still coming',
    blurb:
      'Quiet luxury for two. Candlelight, something sweet, and a handwritten note that says what a card never quite manages.',
    emoji: '💍',
    accent: 'wine',
    image: { id: 'photo-1509024102370-fd7802f4a7a7', alt: 'A book tied with ribbon beside a lit tealight candle' },
  },
  {
    slug: 'wedding',
    name: 'Wedding',
    line: 'Gifts the couple will actually remember',
    blurb:
      'From mehndi favours to a showstopping wedding-day hamper. We can match your palette and scale to any guest count.',
    emoji: '💐',
    accent: 'gold',
    image: { id: 'photo-1755493872657-258e83e22279', alt: 'A decorated wedding table with white flowers and candles' },
  },
  {
    slug: 'bridal-shower',
    name: 'Bridal Shower',
    line: 'Soft, glowing and made for photos',
    blurb:
      'Pamper-first baskets for the bride and her people. Silk, scent, sugar and a little sparkle.',
    emoji: '🌸',
    accent: 'blush',
    image: { id: 'photo-1525772764200-be829a350797', alt: 'Three slim white taper candles against a pale backdrop' },
  },
  {
    slug: 'valentines',
    name: "Valentine's Day",
    line: 'Say it properly this year',
    blurb:
      'Roses, chocolate and something they can keep long after the day is over. Pre-order opens every January.',
    emoji: '💗',
    accent: 'rose',
    image: { id: 'photo-1623284060556-37e5ff559dd3', alt: 'A heart-shaped box of chocolate-dipped strawberries' },
  },
  {
    slug: 'eid',
    name: 'Eid',
    line: 'For the people you always send something to',
    blurb:
      'Elegant Eid hampers with dates, dry fruit, chocolate and a keepsake — ready to send to family across the country.',
    emoji: '🌙',
    accent: 'gold',
    image: { id: 'photo-1780744973119-efad58730706', alt: 'Two decorative crescent moons on a warm wooden surface' },
  },
  {
    slug: 'mothers-day',
    name: "Mother's Day",
    line: 'She never asks for anything',
    blurb:
      'The gift she would never buy herself. Skincare, a candle worth lighting and flowers that last past the week.',
    emoji: '🤍',
    accent: 'blush',
    image: { id: 'photo-1680563899402-26c3a712831f', alt: 'A bouquet of pink roses wrapped in blush paper' },
  },
  {
    slug: 'graduation',
    name: 'Graduation',
    line: 'Four years. One very good basket',
    blurb:
      'Celebratory, grown-up and a little bit congratulatory. Personalise it with their name, degree and colours.',
    emoji: '🎓',
    accent: 'wine',
    image: { id: 'photo-1672575007490-8b4764e43e68', alt: 'A gift wrapped in gold and white ribbon' },
  },
  {
    slug: 'corporate',
    name: 'Corporate Gifting',
    line: 'Bulk, branded, beautifully done',
    blurb:
      'Client and team hampers from 10 to 500 units. Custom ribbon, printed cards and a single invoice.',
    emoji: '🏢',
    accent: 'gold',
    image: { id: 'photo-1760804876134-a8089aaeccca', alt: 'A white gift box finished with gold detailing' },
  },
  {
    slug: 'just-because',
    name: 'Just Because',
    line: 'No reason needed',
    blurb:
      'The best gifts often arrive on an ordinary Tuesday. Small, thoughtful and completely unexpected.',
    emoji: '💌',
    accent: 'rose',
    image: { id: 'photo-1594320207823-405209d4a92b', alt: 'A pink floral ribbon resting on a sheet of writing paper' },
  },
];

export const getOccasion = (slug: string) => occasions.find((o) => o.slug === slug);
