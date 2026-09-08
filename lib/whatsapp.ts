import { site } from '@/lib/site';
import { formatPKR } from '@/lib/utils';
import type { BuilderSelection, Product } from '@/lib/types';

/**
 * All ordering flows funnel through here. The site never posts to a server —
 * it composes a clean, human-readable WhatsApp message the owner can act on
 * directly. Swapping in a real checkout later means changing only the callers.
 */

const BULLET = '•';

function encode(lines: string[]) {
  const body = lines.filter(Boolean).join('\n');
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(body)}`;
}

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export const waGeneral = () =>
  waLink(`Hi ${site.name.split(' ')[0]}! I'd love to ask about a gift basket.`);

export interface ProductOrderInput {
  product: Product;
  /** Variant name, e.g. "Deluxe" */
  size?: string;
  unitPrice?: number;
  quantity: number;
  message?: string;
  recipientName?: string;
  senderName?: string;
  deliveryCity?: string;
  deliveryDate?: string;
  notes?: string;
  total: number;
}

export function waProductOrder(input: ProductOrderInput) {
  const {
    product, size, unitPrice, quantity, message, recipientName,
    senderName, deliveryCity, deliveryDate, notes, total,
  } = input;

  return encode([
    `*New order — ${site.name}*`,
    '',
    `*Basket:* ${product.name}`,
    size ? `*Size:* ${size}` : '',
    `*Quantity:* ${quantity}${unitPrice && quantity > 1 ? ` × ${formatPKR(unitPrice)}` : ''}`,
    `*Estimated total:* ${formatPKR(total)}`,
    '',
    recipientName ? `*For:* ${recipientName}` : '',
    senderName ? `*From:* ${senderName}` : '',
    message ? `*Card message:*\n"${message}"` : '',
    '',
    deliveryCity ? `*Deliver to:* ${deliveryCity}` : '',
    deliveryDate ? `*Needed by:* ${deliveryDate}` : '',
    notes ? `*Notes:* ${notes}` : '',
    '',
    `Link: ${site.url}/shop/${product.slug}`,
  ]);
}

export function waCustomBasket(s: BuilderSelection, total: number) {
  const grouped = s.items.map((i) => `${BULLET} ${i.name} — ${formatPKR(i.price)}`);

  return encode([
    `*Custom basket — ${site.name}*`,
    '',
    `*Size:* ${s.size.name} (up to ${s.size.itemAllowance} items)`,
    s.theme ? `*Theme:* ${s.theme.name}` : '',
    `*Wrapping:* ${s.wrap.name}`,
    '',
    '*Items chosen:*',
    ...(grouped.length ? grouped : [`${BULLET} (still deciding — please advise)`]),
    '',
    `*Estimated total:* ${formatPKR(total)}`,
    '',
    s.recipientName ? `*For:* ${s.recipientName}` : '',
    s.senderName ? `*From:* ${s.senderName}` : '',
    s.message ? `*Card message:*\n"${s.message}"` : '',
    '',
    `Built at ${site.url}/customize`,
  ]);
}

export interface EnquiryInput {
  name: string;
  phone?: string;
  occasion?: string;
  budget?: string;
  date?: string;
  details?: string;
}

export function waEnquiry(e: EnquiryInput) {
  return encode([
    `*Enquiry — ${site.name}*`,
    '',
    `*Name:* ${e.name}`,
    e.phone ? `*Phone:* ${e.phone}` : '',
    e.occasion ? `*Occasion:* ${e.occasion}` : '',
    e.budget ? `*Budget:* ${e.budget}` : '',
    e.date ? `*Needed by:* ${e.date}` : '',
    '',
    e.details ? `*What I'm imagining:*\n${e.details}` : '',
  ]);
}
