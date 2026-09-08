import type { BuilderItem, BuilderSize, BuilderTheme, BuilderWrap } from '@/lib/types';
import { builderItemList } from '@/lib/content/builder.data';

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

/**
 * Materials customers can add in the configurator. Generated from
 * content/items.csv by `npm run content:import`.
 */
export const builderItems: BuilderItem[] = builderItemList;

export const builderWraps: BuilderWrap[] = [
  { id: 'classic', name: 'Classic', price: 0, description: 'Kraft box, tissue, single satin ribbon' },
  { id: 'elegant', name: 'Elegant', price: 600, description: 'Rigid box, printed tissue, double ribbon' },
  { id: 'romantic', name: 'Romantic', price: 900, description: 'Blush wrap, dried floral sprig, wax seal' },
  { id: 'luxury', name: 'Luxury', price: 1500, description: 'Hard box, silk lining, gold foil, wax seal' },
];

export const itemGroups = ['Pamper', 'Sweet', 'Keepsake', 'Bloom'] as const;
