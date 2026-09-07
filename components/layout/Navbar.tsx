'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import { Logo } from '@/components/layout/Logo';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { site } from '@/lib/site';
import { waGeneral } from '@/lib/whatsapp';
import { useScrolledPast } from '@/lib/scroll';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const condensed = useScrolledPast(28);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            'border-b transition-[background-color,box-shadow,border-color] duration-500 ease-expo',
            condensed
              ? 'border-blush-200 bg-cream/95 shadow-[0_1px_0_rgba(122,15,60,0.05)] supports-[backdrop-filter]:bg-cream/80 supports-[backdrop-filter]:backdrop-blur-md'
              : 'border-transparent bg-transparent',
          )}
        >
          <nav
            aria-label="Primary"
            className={cn(
              'shell flex items-center justify-between transition-[height] duration-500 ease-expo',
              condensed ? 'h-[62px]' : 'h-[80px]',
            )}
          >
            <Logo size={condensed ? 36 : 44} />

            <ul className="hidden items-center gap-1 lg:flex">
              {site.nav.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'relative inline-flex items-center rounded-full px-4 py-2 text-[0.8125rem] tracking-[0.06em] transition-colors duration-300',
                        active ? 'text-wine-700' : 'text-ink-soft hover:text-wine-700',
                      )}
                    >
                      {item.label}
                      <span
                        aria-hidden
                        className={cn(
                          'absolute inset-x-3 -bottom-[2px] h-px origin-left bg-rose-500 transition-transform duration-500 ease-expo',
                          active ? 'scale-x-100' : 'scale-x-0',
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search gift baskets"
                className="grid h-10 w-10 place-items-center rounded-full text-wine-700 transition-colors duration-300 hover:bg-wine-700/[0.06]"
              >
                <Search className="h-[18px] w-[18px]" strokeWidth={1.4} />
              </button>

              <a
                href={waGeneral()}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden h-10 items-center rounded-full bg-wine-700 px-5 text-[0.8125rem] font-medium text-cream shadow-petal transition-all duration-300 ease-expo hover:bg-wine-600 hover:shadow-lift sm:inline-flex"
              >
                Order on WhatsApp
              </a>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="grid h-10 w-10 place-items-center rounded-full text-wine-700 transition-colors duration-300 hover:bg-wine-700/[0.06] lg:hidden"
              >
                <Menu className="h-[19px] w-[19px]" strokeWidth={1.4} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {menuOpen ? <MobileMenu onClose={() => setMenuOpen(false)} /> : null}
      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}
