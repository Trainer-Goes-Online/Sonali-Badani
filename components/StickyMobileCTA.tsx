'use client';

import { useEffect, useState } from 'react';
import AccessButton from './AccessButton';

/**
 * Mobile-only sticky checkout bar (a footer bar, not a header). Navy with the
 * founding price + a coral CTA, so the offer is always one tap away on the
 * device most cold traffic lands on. Reference: finish-strong sticky bar.
 */
export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Reveal once the reader has scrolled roughly past the first viewport (the
    // hero), so the threshold scales with the device instead of a fixed pixel.
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-coral/20 bg-navy/95 backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="shrink-0 leading-tight">
          <p className="font-body text-[9.5px] font-bold uppercase tracking-[0.12em] text-coral">
            Founding price
          </p>
          <p className="font-body text-white">
            <span className="text-[12px] text-white/40 line-through">₹997</span>{' '}
            <span className="text-[17px] font-bold">₹497</span>
          </p>
        </div>
        <AccessButton
          label="Get Instant Access"
          showArrow={false}
          className="min-h-[48px] flex-1 py-2.5 text-[15px]"
        />
      </div>
    </div>
  );
}
