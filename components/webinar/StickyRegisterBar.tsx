'use client';

import { ArrowRight } from 'lucide-react';
import { STICKY } from '@/lib/webinar-content';
import { useRegistration } from './RegistrationProvider';
import { useStickyOffset } from './useStickyOffset';

/**
 * Persistent bottom CTA bar.
 *
 * Present from the very first paint, with no scroll threshold and no entrance
 * animation. It used to wait until the hero had scrolled past, which meant the
 * offer was invisible for the first screen, exactly where a cold visitor
 * decides whether to stay. Now it is simply always there.
 *
 * The one time it hides is while the registration modal is open, so it can
 * never sit on top of the modal's own submit button.
 */
export default function StickyRegisterBar() {
  const { open, isOpen } = useRegistration();
  // Reserves footer room so the bar never covers the legal links (see hook).
  const barRef = useStickyOffset<HTMLDivElement>();

  return (
    <div
      ref={barRef}
      aria-hidden={isOpen}
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-navy/10 bg-white/95 shadow-[0_-12px_34px_-16px_rgba(32,63,92,0.45)] backdrop-blur ${
        isOpen ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="container-page flex items-center gap-3 py-2.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 shrink leading-tight">
          <p className="truncate font-body text-[13px] font-bold text-navy sm:text-[14px]">
            {STICKY.title}
          </p>
          <p className="truncate font-body text-[11.5px] text-navy/55 sm:text-[12.5px]">
            {STICKY.sub}
          </p>
        </div>

        <button
          type="button"
          onClick={open}
          tabIndex={isOpen ? -1 : 0}
          className="btn-primary ml-auto min-h-[48px] shrink-0 px-5 py-2.5 text-[14px] sm:px-7"
        >
          <span className="relative z-[3]">{STICKY.cta}</span>
          <ArrowRight className="relative z-[3] h-4 w-4 shrink-0" />
        </button>
      </div>
    </div>
  );
}
