'use client';

import { useState } from 'react';

import TestimonialCard, { type Testimonial } from './TestimonialCard';
import TestimonialModal from './TestimonialModal';
import { PROOF } from '@/lib/webinar-content';

/**
 * The testimonials, one list, two presentations.
 *
 *   Mobile   A continuously sliding marquee. The track holds two identical
 *            copies of the four testimonials and slides exactly -50%, which
 *            lands on the duplicate of the first card, so it loops forever
 *            without ever rewinding.
 *   Desktop  A two column grid with every card the same height. Nothing hidden.
 *
 * ── Why a CSS marquee and not a scroll carousel ───────────────────────────
 * The previous version stepped one card every few seconds with `scrollTo`,
 * which reads as a jerk on arrival and fights the page scroll on a phone. This
 * is a single linear transform animation running on the compositor: it never
 * touches layout, so it stays smooth even while the page is being scrolled,
 * and it pauses under a finger so a card can be read. Dots and arrows are gone
 * with it; there is nothing to step through when the motion is constant.
 *
 * The duplicated slides cost nothing: they point at the same four image URLs,
 * already in cache, and they are `lg:hidden` so the desktop grid still shows
 * exactly four cards.
 *
 * There is deliberately no scroll-reveal wrapper anywhere in this section. The
 * `.reveal` class animates `filter: blur()`, and blurring four tall screenshots
 * as they cross the viewport was what made scrolling stutter here.
 */
export default function Testimonials() {
  const [open, setOpen] = useState<Testimonial | null>(null);
  const items = PROOF.items;
  const slides = [...items, ...items];

  return (
    <div>
      {/*
        Mask: lets the track bleed to the screen edge on mobile without giving
        the page a horizontal scrollbar.

        The track spaces cards with a right margin, not a CSS gap. With a gap,
        eight cards have only seven gaps between them, so half the track is one
        set MINUS half a gap and the -50% loop point lands slightly short,
        producing a small visible hitch on every cycle. A trailing margin on
        every card makes each half exactly one set wide, so the wrap is truly
        invisible.
      */}
      <div className="-mx-5 overflow-hidden px-5 sm:-mx-7 sm:px-7 lg:mx-0 lg:overflow-visible lg:px-0">
        <ul className="testimonial-marquee flex items-stretch lg:grid lg:auto-rows-fr lg:grid-cols-2 lg:gap-5">
          {slides.map((item, i) => {
            const isClone = i >= items.length;
            return (
              <li
                key={`${item.src}-${i}`}
                aria-hidden={isClone}
                className={`mr-3.5 w-[80vw] max-w-[330px] shrink-0 lg:mr-0 lg:w-auto lg:max-w-none ${
                  isClone ? 'lg:hidden' : ''
                }`}
              >
                <TestimonialCard
                  item={item}
                  sizes="(max-width: 1024px) 80vw, 400px"
                  onOpen={() => setOpen(item)}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-4 text-center font-body text-[12px] text-navy/45 lg:hidden">
        Tap any message to read it in full
      </p>

      <TestimonialModal item={open} onClose={() => setOpen(null)} />
    </div>
  );
}
