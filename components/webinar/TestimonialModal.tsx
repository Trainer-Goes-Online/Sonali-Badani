'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';

import type { Testimonial } from './TestimonialCard';
import { pauseSmoothScroll, resumeSmoothScroll } from '@/lib/smooth-scroll';

/**
 * The full, uncropped client message.
 *
 * The cards cap the screenshot so every card is the same height; this is where
 * the whole message is actually readable. The image is shown at its natural
 * ratio and the panel scrolls, so even the 894 by 1600 screenshot is legible
 * end to end on a phone.
 */
export default function TestimonialModal({
  item,
  onClose,
}: {
  item: Testimonial | null;
  onClose: () => void;
}) {
  // Portalled to <body> deliberately. This modal is rendered deep inside the
  // testimonial list, which sits inside a `Reveal` wrapper, and `.reveal`
  // carries `will-change: transform`. That makes it a containing block for
  // `position: fixed`, so without the portal the "full screen" overlay was
  // confined to the card and the scrim never covered the page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!item) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    // Lock the page behind the modal, compensating for the scrollbar so the
    // layout underneath does not shift on desktop. The overflow lock alone is
    // not enough: Lenis moves the page itself, so it has to be stopped too.
    pauseSmoothScroll();
    const { overflow, paddingRight } = document.body.style;
    const rootOverflow = document.documentElement.style.overflow;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    // Both elements, not just body: html is the scrolling element here, so
    // locking body alone left the page free to move behind the overlay.
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = rootOverflow;
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      resumeSmoothScroll();
    };
  }, [item, onClose]);

  if (!item || !mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Client message"
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-[fade-in_200ms_ease-out] bg-navy/75 backdrop-blur-sm"
      />

      <div className="reg-panel relative flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-[26px] bg-navy-deep shadow-card">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-5 py-4">
          <p className="font-body text-[10.5px] font-bold uppercase tracking-[0.14em] text-coral">
            {item.attribution}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 text-white/60 transition-colors hover:border-white/50 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5"
        >
          <Image
            src={item.src}
            alt={item.summary}
            width={item.width}
            height={item.height}
            sizes="(max-width: 640px) 92vw, 480px"
            placeholder="blur"
            blurDataURL={item.blurDataURL}
            className="h-auto w-full rounded-2xl ring-1 ring-white/10"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
