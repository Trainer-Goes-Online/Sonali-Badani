'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Logo from './ui/Logo';
import AccessButton from './AccessButton';
import ScrollProgress from './ui/ScrollProgress';

/**
 * Minimal sticky header with a coral scroll-progress bar pinned above it.
 * Real stacked wordmark left, single CTA right. On mobile the wordmark centers
 * (the sticky bottom bar carries the CTA there). Once the page is scrolled the
 * bar condenses and lifts with a soft shadow, so it recedes while reading.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b border-navy/10 backdrop-blur-md transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'bg-white/90 shadow-soft' : 'bg-white/80'
      }`}
    >
      <ScrollProgress />
      <div
        className={`container-page flex items-center justify-center transition-[height] duration-300 sm:justify-between ${
          scrolled ? 'h-14' : 'h-16'
        }`}
      >
        <Link href="/" aria-label="Sonali Badani, home" className="flex items-center">
          <Logo height={46} />
        </Link>
        <div className="hidden sm:block">
          <AccessButton
            label="Get Instant Access"
            showArrow={false}
            className="min-h-[44px] px-6 py-2.5 text-[15px]"
          />
        </div>
      </div>
    </header>
  );
}
