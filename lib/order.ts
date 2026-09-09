import { site } from '@/lib/site';
import { formatPKR } from '@/lib/utils';
import type { BuilderSelection, Product } from '@/lib/types';

/**
 * Every ordering flow funnels through here. The site never posts to a server —
 * it composes a clean, readable order summary that the customer sends as an
 * Instagram DM.
 *
 * Instagram has no way to pre-fill a message the way WhatsApp's wa.me links do,
 * so the pattern is: copy the summary to the clipboard, then open the DM. The
 * customer pastes. It is one extra keystroke for them and it keeps every order
 * arriving in one place, already written out.
 *
 * That also means no asterisk-bold — Instagram shows the asterisks. Plain text,
 * laid out so it stays readable in a chat bubble.
 */

const BULLET = '•';

/** Opens a direct-message thread. Works in the app and on the web. */
export const instagramDM = () => `https://ig.me/m/${site.instagram.handle}`;

/** The profile itself — for "follow us" links, not for ordering. */
export const instagramProfile = () => site.instagram.url;

const compose = (lines: string[]) => lines.filter((l) => l !== null).join('\n').replace(/\n{3,}/g, '\n\n').trim();

export const generalEnquiryText = () =>
  `Hi ${site.name.split(' ')[0]}! I'd love to ask about a gift basket.`;

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

export function productOrderText(input: ProductOrderInput) {
  const {
    product, size, unitPrice, quantity, message, recipientName,
    senderName, deliveryCity, deliveryDate, notes, total,
  } = input;

  return compose([
    `NEW ORDER — ${site.name}`,
    '',
    `Basket: ${product.name}`,
    size ? `Size: ${size}` : '',
    `Quantity: ${quantity}${unitPrice && quantity > 1 ? ` × ${formatPKR(unitPrice)}` : ''}`,
    `Estimated total: ${formatPKR(total)}`,
    '',
    recipientName ? `For: ${recipientName}` : '',
    senderName ? `From: ${senderName}` : '',
    message ? `Card message:\n"${message}"` : '',
    '',
    deliveryCity ? `Deliver to: ${deliveryCity}` : '',
    deliveryDate ? `Needed by: ${deliveryDate}` : '',
    notes ? `Notes: ${notes}` : '',
    '',
    `${site.url}/shop/${product.slug}`,
  ]);
}

export function customBasketText(s: BuilderSelection, total: number) {
  const chosen = s.items.map((i) => `${BULLET} ${i.name} — ${formatPKR(i.price)}`);

  return compose([
    `CUSTOM BASKET — ${site.name}`,
    '',
    `Size: ${s.size.name} (up to ${s.size.itemAllowance} items)`,
    s.theme ? `Theme: ${s.theme.name}` : '',
    `Wrapping: ${s.wrap.name}`,
    '',
    'Items chosen:',
    ...(chosen.length ? chosen : [`${BULLET} (still deciding — please advise)`]),
    '',
    `Estimated total: ${formatPKR(total)}`,
    '',
    s.recipientName ? `For: ${s.recipientName}` : '',
    s.senderName ? `From: ${s.senderName}` : '',
    s.message ? `Card message:\n"${s.message}"` : '',
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

export function enquiryText(e: EnquiryInput) {
  return compose([
    `ENQUIRY — ${site.name}`,
    '',
    `Name: ${e.name}`,
    e.phone ? `Phone: ${e.phone}` : '',
    e.occasion ? `Occasion: ${e.occasion}` : '',
    e.budget ? `Budget: ${e.budget}` : '',
    e.date ? `Needed by: ${e.date}` : '',
    '',
    e.details ? `What I'm imagining:\n${e.details}` : '',
  ]);
}

/**
 * Put the summary on the clipboard and open the DM.
 *
 * The clipboard API needs a secure context and a real user gesture, and it can
 * still be refused. When it is, we fall back to a hidden textarea + execCommand,
 * and if that fails too we open the DM anyway — the customer can describe the
 * order themselves, which is better than a dead button.
 */
export async function copyThenOpenDM(text: string): Promise<boolean> {
  let copied = false;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      copied = true;
    }
  } catch {
    /* fall through */
  }

  if (!copied) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      copied = document.execCommand('copy');
      document.body.removeChild(ta);
    } catch {
      copied = false;
    }
  }

  window.open(instagramDM(), '_blank', 'noopener,noreferrer');
  return copied;
}
