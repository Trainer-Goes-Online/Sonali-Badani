'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import AccessButton from './AccessButton';
import { COURSE_PRICE_LABEL } from '@/lib/pricing';

/**
 * Mobile-only sticky checkout bar (a footer bar, not a header). Navy with the
 * founding-price scarcity, strikethrough price, a guarantee line and a coral
 * CTA, plus a dismiss control — so the offer is always one tap away on the
 * device most cold traffic lands on. (Hierarchy ref only; our palette + copy.)
 */
export default function StickyMobileCTA() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Reveal once the reader has scrolled roughly past the first viewport (the
    // hero), so the threshold scales with the device instead of a fixed pixel.
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visible = show && !dismissed;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-coral/30 bg-navy/95 shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.5)] backdrop-blur transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        {/* Scarcity + price + guarantee */}
        <div className="shrink-0 leading-tight">
          <p className="font-body text-[9.5px] font-bold uppercase tracking-[0.14em] text-coral">
            First 100 members only
          </p>
          <p className="mt-0.5 font-body text-white">
            <span className="text-[12px] text-white/40 line-through">₹997</span>{' '}
            <span className="text-[19px] font-bold">{COURSE_PRICE_LABEL}</span>
          </p>
          <p className="font-body text-[10px] text-white/45">14-day money-back guarantee</p>
        </div>

        <AccessButton
          label="Get Instant Access"
          showArrow={false}
          className="min-h-[48px] flex-1 py-2 text-[14.5px]"
        />

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss this bar"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/20 text-white/55 transition-colors hover:border-white/40 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
