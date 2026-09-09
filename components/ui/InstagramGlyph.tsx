/** The Instagram mark. One definition, so every button draws it identically. */
export function InstagramGlyph({ className = 'h-[18px] w-[18px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.3" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4.05" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.35" cy="6.65" r="1.3" fill="currentColor" />
    </svg>
  );
}
