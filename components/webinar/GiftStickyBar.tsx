'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, Gift, Moon, Sparkles } from 'lucide-react';

import { WELCOME } from '@/lib/webinar-content';
import { useStickyOffset } from './useStickyOffset';

const TRUST_ICONS = [Moon, Clock, Sparkles];

/**
 * The floating gift card on /welcome.
 *
 * A card that hovers above the bottom edge rather than a full width bar, with
 * a running light around its border, a breathing glow, and a CTA that wobbles
 * every couple of seconds. From 1400px wide it floats in the bottom right
 * corner, clear of the centred column. It slides away while the gift section's
 * own button is on screen, so the same button never shows twice at once.
 *
 * Once the footer is on screen it stops floating and docks flush to the bottom
 * edge as a full width bar, at every width, so the footer never ends in an
 * empty band where the card used to be. From `lg` up the docked bar lays out
 * as a row: the copy on the left, the button on the right.
 */
export default function GiftStickyBar() {
  // Keeps the footer clear of the fixed card (see useStickyOffset).
  const stickyRef = useStickyOffset<HTMLDivElement>();
  const [ctaInView, setCtaInView] = useState(false);
  const [docked, setDocked] = useState(false);
  // The return-to-floating animation only plays after a first dock, so it
  // never doubles up with the entrance on page load.
  const [hasDocked, setHasDocked] = useState(false);

  useEffect(() => {
    const target = document.getElementById('gift-cta');
    if (!target) return;
    const io = new IntersectionObserver(([entry]) => setCtaInView(entry.isIntersecting), {
      threshold: 0.6,
    });
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => {
      setDocked(entry.isIntersecting);
      if (entry.isIntersecting) setHasDocked(true);
    });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  const hidden = ctaInView && !docked;
  const { gift } = WELCOME;

  const dockAnim = docked ? 'gift-dock-in' : hasDocked ? 'gift-undock' : '';

  return (
    <div
      ref={stickyRef}
      className={`pointer-events-none fixed bottom-0 z-50 transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${dockAnim} ${
        docked
          ? 'inset-x-0 px-0 pb-0'
          : 'inset-x-0 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-5 min-[1400px]:inset-x-auto min-[1400px]:right-6 min-[1400px]:px-0 min-[1400px]:pb-6'
      }`}
    >
      <div
        className={`gift-float-in mx-auto w-full transition-[max-width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          docked ? 'max-w-full' : 'max-w-[560px] min-[1400px]:w-[360px]'
        }`}
      >
        <div
          data-hidden={hidden}
          aria-hidden={hidden}
          className={`gift-float gift-frame gift-glow pointer-events-auto ${
            docked ? 'rounded-b-none rounded-t-[22px] !pb-0' : 'rounded-[22px]'
          }`}
        >
          <div
            className={`bg-navy-deep px-3.5 pt-3.5 transition-[border-radius,padding] duration-500 sm:px-4 sm:pt-4 ${
              docked
                ? 'rounded-b-none rounded-t-[20px] pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:py-4'
                : 'rounded-[20px] pb-3'
            }`}
          >
            <div
              className={
                docked
                  ? 'mx-auto max-w-[560px] lg:grid lg:max-w-[1000px] lg:grid-cols-[1fr_380px] lg:items-center lg:gap-x-10'
                  : ''
              }
            >
              <div className="flex items-center gap-3">
                <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-coral text-navy shadow-[0_8px_20px_-8px_rgba(245,144,117,0.9)]">
                  <Gift className="gift-wiggle h-[22px] w-[22px]" strokeWidth={2.2} />
                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-navy-deep bg-coral" />
                  </span>
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="font-body text-[9.5px] font-bold uppercase tracking-[0.16em] text-coral sm:text-[10.5px]">
                    {gift.floatLabel}
                  </p>
                  <p className="mt-1 font-serif text-[18px] font-semibold text-white sm:text-[20px]">
                    {gift.heading}
                  </p>
                  <p className="mt-0.5 font-body text-[12px] leading-snug text-white/65 sm:text-[13px]">
                    {gift.body}
                  </p>
                </div>
              </div>

              <div>
                <Link
                  href="/masterclass/upgrade"
                  tabIndex={hidden ? -1 : undefined}
                  className={`btn-primary gift-cta cta-wobble mt-3 !min-h-[50px] w-full !py-3 !text-[15px] sm:!text-[16px] ${
                    docked ? 'lg:mt-0' : ''
                  }`}
                >
                  <span className="relative z-[3]">{gift.cta}</span>
                  <ArrowRight className="relative z-[3] h-[18px] w-[18px] shrink-0" />
                </Link>

                <ul
                  className={`mt-2.5 flex items-center justify-center gap-x-2 font-body text-[10.5px] text-white/55 sm:gap-x-3 sm:text-[11.5px] ${
                    docked ? '' : 'min-[1400px]:gap-x-2 min-[1400px]:text-[11px]'
                  }`}
                >
                  {gift.trust.map((t, i) => {
                    const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
                    return (
                      <li
                        key={t}
                        className={`flex items-center gap-x-2 sm:gap-x-3 ${
                          docked ? '' : 'min-[1400px]:gap-x-2'
                        }`}
                      >
                        {i > 0 && (
                          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/25" />
                        )}
                        <span className="flex items-center gap-1 whitespace-nowrap">
                          <Icon className="h-3 w-3 text-coral" strokeWidth={2.2} />
                          {t}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
