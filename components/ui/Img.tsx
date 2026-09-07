import NextImage, { type ImageProps } from 'next/image';
import { BLUR } from '@/lib/utils';

/**
 * Drop-in replacement for next/image with the project's defaults baked in:
 * a blush blur placeholder (so a slot never reads as empty white space while
 * the photo streams in) and a quality setting tuned for soft, low-contrast
 * photography where 90+ buys nothing but bytes.
 *
 * Works in both server and client components — no directive on purpose.
 */
export default function Img({ quality = 70, ...props }: ImageProps) {
  return <NextImage placeholder="blur" blurDataURL={BLUR} quality={quality} {...props} />;
}
