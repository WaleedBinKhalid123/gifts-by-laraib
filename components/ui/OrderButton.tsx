'use client';

import * as React from 'react';
import { Button, type ButtonProps } from '@/components/ui/Button';
import { copyThenOpenDM } from '@/lib/order';

interface OrderButtonProps extends Omit<ButtonProps, 'href' | 'external' | 'onClick'> {
  /** The order summary that lands on the clipboard. */
  text: string;
  /** Return false to cancel — used by the contact form for validation. */
  onBeforeSend?: () => boolean;
  children?: React.ReactNode;
}

/**
 * The single ordering control. Copies the summary, opens the Instagram DM, and
 * says which of those actually happened — because "Copied" is a promise the
 * customer will check, and clipboard writes are refused often enough to matter.
 */
export function OrderButton({
  text,
  onBeforeSend,
  children = 'Order on Instagram',
  ...rest
}: OrderButtonProps) {
  const [state, setState] = React.useState<'idle' | 'copied' | 'manual'>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  async function send() {
    if (onBeforeSend && !onBeforeSend()) return;
    const copied = await copyThenOpenDM(text);
    setState(copied ? 'copied' : 'manual');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 6000);
  }

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <Button {...rest} variant={rest.variant ?? 'ig'} onClick={send}>
        {state === 'copied' ? 'Copied — now paste it' : children}
      </Button>

      <span aria-live="polite" className="text-[0.8125rem] leading-snug text-ink-faint">
        {state === 'copied'
          ? 'Your order is on the clipboard. Paste it into the message box.'
          : state === 'manual'
            ? 'We could not reach your clipboard — copy the summary below by hand.'
            : null}
      </span>
    </span>
  );
}
