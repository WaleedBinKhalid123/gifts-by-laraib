import type { BuilderItem, BuilderSize, BuilderTheme, BuilderWrap } from '@/lib/types';

export const builderSizes: BuilderSize[] = [
  { id: 'mini', name: 'Mini', itemAllowance: 4, basePrice: 2200, description: 'A small gesture, beautifully made' },
  { id: 'classic', name: 'Classic', itemAllowance: 7, basePrice: 3600, description: 'Our most popular size' },
  { id: 'deluxe', name: 'Deluxe', itemAllowance: 10, basePrice: 5400, description: 'Generous, layered, memorable' },
  { id: 'luxury', name: 'Luxury', itemAllowance: 14, basePrice: 8200, description: 'The full experience, wax seal included' },
];

export const builderThemes: BuilderTheme[] = [
  {
    id: 'romantic',
    name: 'Romantic',
    description: 'Deep rose, preserved blooms, candlelight',
    palette: ['#7A0F3C', '#E4578F', '#FAE3EC'],
    image: { id: 'photo-1523693916903-027d144a2b7d', alt: 'A bouquet of pink and white roses' },
  },
  {
    id: 'self-care',
    name: 'Self-Care',
    description: 'Soft neutrals, scent, slowness',
    palette: ['#C6A15B', '#EDB2C9', '#FDF1F5'],
    image: { id: 'photo-1552046122-03184de85e08', alt: 'Skincare jar, serum and sheet mask' },
  },
  {
    id: 'birthday',
    name: 'Birthday',
    description: 'Bright, sweet, a little bit loud',
    palette: ['#E4578F', '#F19CBE', '#FFF8FB'],
    image: { id: 'photo-1759607574688-af5711054087', alt: 'Pink balloons and birthday cake' },
  },
  {
    id: 'bridal',
    name: 'Bridal',
    description: 'Ivory, pearl, blush and silk',
    palette: ['#F7EDE5', '#EEDCB8', '#F5CFDE'],
    image: { id: 'photo-1525772764200-be829a350797', alt: 'Three white taper candles' },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Restrained, premium, gender-neutral',
    palette: ['#2A1620', '#C6A15B', '#F7EDE5'],
    image: { id: 'photo-1760804876134-a8089aaeccca', alt: 'A white gift box with gold detailing' },
  },
  {
    id: 'eid',
    name: 'Eid',
    description: 'Gold foil, dates, crescent keepsakes',
    palette: ['#A98543', '#DFC48D', '#FFFCFA'],
    image: { id: 'photo-1780744973119-efad58730706', alt: 'Decorative crescent moons on wood' },
  },
];

export const builderItems: BuilderItem[] = [
  { id: 'candle', name: 'Scented candle', price: 1200, group: 'Pamper', image: { id: 'photo-1572726729207-a78d6feb18d7', alt: 'Amber glass candle jars' } },
  { id: 'hand-cream', name: 'Shea hand cream', price: 850, group: 'Pamper', image: { id: 'photo-1620916566398-39f1143ab7be', alt: 'A tube of body lotion on white fabric' } },
  { id: 'skincare', name: 'Skincare duo', price: 1900, group: 'Pamper', image: { id: 'photo-1580870069867-74c57ee1bb07', alt: 'Skincare bottles with pink petals' } },
  { id: 'bath', name: 'Bath salts', price: 700, group: 'Pamper', image: { id: 'photo-1451443700141-5ddb6d85a8fc', alt: 'Bath essentials on a wooden crate' } },
  { id: 'perfume', name: 'Perfume rollerball', price: 2400, group: 'Pamper', image: { id: 'photo-1595425959632-34f2822322ce', alt: 'A perfume bottle with pink petals' } },

  { id: 'chocolate', name: 'Artisan chocolate bar', price: 600, group: 'Sweet', image: { id: 'photo-1481391319762-47dff72954d9', alt: 'Chocolates beside their box' } },
  { id: 'truffles', name: 'Belgian truffle box', price: 1800, group: 'Sweet', image: { id: 'photo-1548741487-18d363dc4469', alt: 'An open box of chocolates' } },
  { id: 'dates', name: 'Medjool dates', price: 1400, group: 'Sweet', image: { id: 'photo-1526081715791-7c538f86060e', alt: 'A tray of confectionery' } },
  { id: 'tea', name: 'Loose-leaf tea tin', price: 950, group: 'Sweet', image: { id: 'photo-1664849271854-26ed0d81d813', alt: 'A book beside two cups of tea' } },

  { id: 'scrunchie', name: 'Satin scrunchie', price: 400, group: 'Keepsake', image: { id: 'photo-1535551393484-1a1907f51759', alt: 'Pink and cream lace ribbons' } },
  { id: 'mug', name: 'Ceramic mug', price: 1300, group: 'Keepsake', image: { id: 'photo-1595246007497-15e0ed4b8d96', alt: 'A kraft presentation box' } },
  { id: 'jewellery', name: 'Delicate jewellery piece', price: 3200, group: 'Keepsake', image: { id: 'photo-1716540103530-cc33cdd20cde', alt: 'A dark presentation box with gold emblem' } },
  { id: 'plush', name: 'Plush toy', price: 1600, group: 'Keepsake', image: { id: 'photo-1585645187037-a27267194293', alt: 'A polka dot gift box' } },
  { id: 'notebook', name: 'Leather notebook', price: 1700, group: 'Keepsake', image: { id: 'photo-1543769657-fcf1236421bc', alt: 'Handwritten script on paper' } },

  { id: 'roses', name: 'Preserved rose stems', price: 2600, group: 'Bloom', image: { id: 'photo-1680563094046-5d846e2c59d1', alt: 'Pink roses wrapped in paper' } },
  { id: 'peony', name: 'Preserved peony', price: 2100, group: 'Bloom', image: { id: 'photo-1579664872746-55e2a805d705', alt: 'Three pink peonies' } },
  { id: 'bouquet', name: 'Fresh mini bouquet', price: 1900, group: 'Bloom', image: { id: 'photo-1612072355657-43c049417126', alt: 'Pink roses on a white table' } },
];

export const builderWraps: BuilderWrap[] = [
  { id: 'classic', name: 'Classic', price: 0, description: 'Kraft box, tissue, single satin ribbon' },
  { id: 'elegant', name: 'Elegant', price: 600, description: 'Rigid box, printed tissue, double ribbon' },
  { id: 'romantic', name: 'Romantic', price: 900, description: 'Blush wrap, dried floral sprig, wax seal' },
  { id: 'luxury', name: 'Luxury', price: 1500, description: 'Hard box, silk lining, gold foil, wax seal' },
];

export const itemGroups = ['Pamper', 'Sweet', 'Keepsake', 'Bloom'] as const;
