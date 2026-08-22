import Image from 'next/image';
import { Maximize2, Quote } from 'lucide-react';

import Sparkle from '@/components/ui/Sparkle';

export type Testimonial = {
  src: string;
  width: number;
  height: number;
  /** Tiny inline blur, so a card is never an empty navy rectangle. */
  blurDataURL: string;
  attribution: string;
  pull: string;
  summary: string;
};

/**
 * One real client message, framed to belong on the page.
 *
 * The screenshots are WhatsApp dark mode, so they sit inside a navy card rather
 * than dropped raw onto the cream background. That reads as deliberate instead
 * of pasted, and the dark frame around a dark screenshot removes the hard
 * rectangle edge that makes screenshots look cheap.
 *
 * ── Why every card is the same height ─────────────────────────────────────
 * The card is a flex column: the quote and the attribution are fixed, and the
 * screenshot is the only part that flexes. Dropped into a grid (desktop) or a
 * flex track (mobile) the cards all stretch to the tallest, and the images
 * absorb the difference instead of the cards ending at ragged heights. The
 * quote block also reserves two lines, so a one-line quote does not shorten
 * its card. Tapping any card opens the full, uncropped message.
 *
 * `summary` is the alt text, so the proof still exists for a screen reader or
 * when an image fails to load.
 */
export default function TestimonialCard({
  item,
  sizes,
  onOpen,
}: {
  item: Testimonial;
  sizes: string;
  /** Opens the full screenshot. Card becomes a button when provided. */
  onOpen?: () => void;
}) {
  const body = (
    <figure className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-navy-deep p-4 text-left shadow-card ring-1 ring-navy/[0.08] sm:p-5">
      <Sparkle
        twinkle
        className="absolute right-4 top-4 h-3.5 w-3.5 text-gold/70 sm:right-5 sm:top-5"
      />

      {/* min-h reserves two lines so a short quote cannot shrink its card */}
      <figcaption className="flex min-h-[44px] shrink-0 items-start gap-2.5 pr-6">
        <Quote className="mt-0.5 h-4 w-4 shrink-0 text-coral" strokeWidth={2.4} />
        <p className="font-serif text-[14.5px] italic leading-snug text-white sm:text-[15.5px]">
          {item.pull}
        </p>
      </figcaption>

      {/* Fixed height, so every card in the grid ends at exactly the same line */}
      <div className="relative mt-3.5 h-[240px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10 lg:h-[300px]">
        <Image
          src={item.src}
          alt={item.summary}
          width={item.width}
          height={item.height}
          sizes={sizes}
          placeholder="blur"
          blurDataURL={item.blurDataURL}
          className="h-full w-full object-cover object-top"
        />
        {/* Fade, so a capped screenshot ends deliberately rather than abruptly */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy-deep to-transparent"
        />
      </div>

      <div className="mt-3.5 flex shrink-0 items-center justify-between gap-3">
        <p className="font-body text-[9.5px] font-bold uppercase leading-tight tracking-[0.12em] text-coral/90 sm:text-[10px]">
          {item.attribution}
        </p>
        {onOpen && (
          <span className="flex shrink-0 items-center gap-1.5 font-body text-[10px] font-semibold text-white/50">
            <Maximize2 className="h-3 w-3" strokeWidth={2.4} />
            Read full
          </span>
        )}
      </div>
    </figure>
  );

  if (!onOpen) return body;

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Read the full message from this ${item.attribution}`}
      className="block h-full w-full rounded-3xl text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/40"
    >
      {body}
    </button>
  );
}
