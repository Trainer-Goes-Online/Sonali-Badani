import Image from 'next/image';
import { CalendarDays, Clock, Video, Users } from 'lucide-react';

import Logo from '@/components/ui/Logo';
import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import Countdown from '@/components/webinar/Countdown';
import SaveSeatButton, { CtaDetails, CtaReassurance } from '@/components/webinar/SaveSeatButton';
import { HERO, CTA } from '@/lib/webinar-content';
import { MASTERCLASS_NAME } from '@/lib/webinar-config';

const TILE_ICONS = [CalendarDays, Clock, Video, Users];

/**
 * P1 hero. Everything needed to decide sits here: the promise, the three
 * recognition lines, who is hosting, when it runs, what it costs, and the one
 * button. Everything below the fold exists only to catch the woman who scrolled
 * instead of deciding.
 *
 * One DOM, two layouts, so there is never a duplicated heading:
 *
 *   Desktop (lg+)  Two columns. Copy and the button on the left, the portrait
 *                  with the event details on the right, both starting at the
 *                  same top line.
 *   Mobile         A single column reordered with flex `order`: the promise,
 *                  then her face, then when and where, then the button, then
 *                  the supporting copy. She sees who is hosting and when it
 *                  runs before she has to read anything else.
 *
 * Built on navy-deep with a soft coral bloom, so coral is never a large flat
 * background block (locked palette rule).
 */
export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-navy-deep">
      {/* Ambient warmth. Radial coral at very low alpha, never a flat block. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-[520px] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(245,144,117,0.20),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-coral/10 blur-3xl"
      />

      <div className="container-page relative pb-14 pt-7 sm:pb-16 sm:pt-8 lg:pt-5">
        {/* Wordmark. Centred on a phone, aligned with the copy on desktop.
            Tight above and below on desktop: the announcement bar already sits
            directly over it, so a large cushion here just pushed the headline
            and the portrait further down the first screen. */}
        <Reveal className="flex justify-center lg:justify-start">
          <span className="inline-flex rounded-2xl bg-white px-5 py-2.5 shadow-soft lg:px-4 lg:py-2">
            <Logo height={34} />
          </span>
        </Reveal>

        {/*
          Two column grid on desktop.
          `grid-rows-[auto_auto_1fr]` pins the first two rows to their content
          so the copy, the price and the button stay stacked tightly together,
          and lets the last row absorb any slack. `items-stretch` (the default)
          plus `h-full` on the card makes the portrait column exactly as tall as
          the copy column, with the photo flexing to take up the difference.
        */}
        <div className="mx-auto mt-8 flex max-w-[640px] flex-col sm:mt-10 lg:mt-5 lg:grid lg:max-w-none lg:grid-cols-[1.04fr_0.96fr] lg:grid-rows-[auto_auto_1fr] lg:gap-x-12 xl:gap-x-16">
          {/* ── 1 · The promise ──────────────────────────────────────────── */}
          <div className="order-1 text-center lg:col-start-1 lg:row-start-1 lg:text-left">
            <Reveal className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 rounded-pill border border-coral/35 bg-coral/10 px-4 py-2 text-center font-body text-[10.5px] font-bold uppercase leading-tight tracking-[0.12em] text-coral sm:px-5 sm:text-[11.5px] lg:py-1.5 lg:text-[10.5px] lg:tracking-[0.1em] lg:text-left">
                <Sparkle twinkle className="hidden h-3 w-3 shrink-0 text-gold sm:block" />
                {HERO.eyebrow}
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="mt-6 font-serif text-[34px] font-semibold uppercase leading-[1.08] tracking-[-0.015em] text-white sm:text-[46px] lg:mt-4 lg:text-[40px] xl:text-[46px]">
                {HERO.headline.before}
                <span className="hl">{HERO.headline.highlight}</span>
                {HERO.headline.after}
              </h1>
            </Reveal>

            <Reveal delay={150}>
              <p className="mx-auto mt-5 max-w-[560px] font-body text-[15.5px] leading-[1.62] text-white/80 sm:text-[17px] lg:mx-0 lg:mt-3.5 lg:text-[15px] lg:leading-[1.58]">
                {HERO.deck}
              </p>
            </Reveal>
          </div>

          {/* ── 2 · Her face, when it runs, and the countdown ─────────────
              On mobile this sits directly under the promise, so the decision
              details arrive before any supporting copy. On desktop it is the
              whole right column. */}
          <div className="order-2 mt-8 sm:mt-10 lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:mt-0">
            {/*
              No `lg:h-full` any more. It existed so the image could flex to
              make this column match the copy beside it, but with the image
              locked to 16:9 nothing can absorb the extra height, so stretching
              the card would only open a gap under the countdown. The card now
              sizes to its content and the grid aligns it at the top.
            */}
            <Reveal variant="scale" className="mx-auto max-w-[560px] lg:max-w-none">
              <div className="overflow-hidden rounded-[26px] border border-white/12 bg-white/[0.05] shadow-card backdrop-blur-sm">
                {/*
                  ONE aspect at every width, and it is the artwork's own 16:9.

                  This frame used to adapt (4:3 on phones, 16:9 on tablets, free
                  flex on desktop) because the source was a 4:5 photograph of
                  Sonali, where cropping the edges cost nothing. The creative
                  that replaced it carries baked-in text, so any crop slices
                  words: at 390px the 4:3 frame cut "Zoom" to "oom" and "bring"
                  to "g" down the left edge, and the desktop flex trimmed about
                  5% off the sides.

                  Matching the frame to the image means object-cover fits exactly
                  and nothing is ever cropped, on any device. If the artwork is
                  ever replaced with a different ratio, change this to match it.
                */}
                <div className="relative aspect-[16/9] w-full overflow-hidden">
                  {/*
                    The true 16:9 shot this frame was built for: 1672x941 native,
                    so at the `sm` breakpoint it fills the frame with no crop at
                    all. Centred rather than pulled to the top, because the old
                    `object-[center_12%]` existed only to keep a face in view when
                    the source was a 4:5 portrait being cropped hard.

                    Served as the 130kb WebP from scripts/optimize-image.js, not
                    the 2.1 MB PNG export it came from. This is the LCP image on
                    P1 and it is marked `priority`, so its weight is felt on the
                    first paint of every ad click. Re-run that script if the
                    artwork is ever replaced.
                  */}
                  <Image
                    src="/Hero-Image/new-hero-image.webp"
                    alt={`Sonali Badani, host of ${MASTERCLASS_NAME}`}
                    fill
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 46vw"
                    className="object-cover object-center"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-deep via-navy-deep/75 to-transparent lg:h-2/5"
                  />

                  <span className="absolute left-3.5 top-3.5 rounded-pill bg-coral px-3 py-1.5 font-body text-[9.5px] font-bold uppercase tracking-[0.12em] text-navy shadow-soft sm:text-[10.5px]">
                    {HERO.lockup.chip}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    {/* The name stands alone. There is no sub-heading under it. */}
                    <p className="font-serif text-[17px] font-semibold uppercase leading-tight tracking-[0.01em] text-white sm:text-[20px]">
                      {HERO.lockup.title}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 p-4 sm:p-5 lg:p-4">
                  {/* 2x2 info tiles: date, time, where, who it is for */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    {HERO.tiles.map((tile, i) => {
                      const Icon = TILE_ICONS[i];
                      return (
                        <div
                          key={tile.label}
                          className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 transition-colors duration-300 hover:border-coral/30 hover:bg-white/[0.09] sm:p-3.5"
                        >
                          <span className="grid h-7 w-7 place-items-center rounded-lg bg-coral/15 text-coral">
                            <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
                          </span>
                          <p className="mt-2 font-body text-[9.5px] font-bold uppercase tracking-[0.12em] text-coral sm:text-[10px]">
                            {tile.label}
                          </p>
                          <p className="mt-0.5 font-body text-[13px] font-semibold leading-snug text-white sm:text-[14px]">
                            {tile.value}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <Countdown className="mt-4 border-t border-white/10 pt-4" />
                </div>
              </div>
            </Reveal>
          </div>

          {/* ── 3 · The free badge, the button, and the reassurance ───────── */}
          <div className="order-3 mt-8 text-center lg:col-start-1 lg:row-start-2 lg:mt-5 lg:text-left">
            <Reveal>
              <div className="flex items-center justify-center lg:justify-start">
                <span className="rounded-pill bg-coral px-5 py-2 font-body text-[12.5px] font-bold uppercase tracking-[0.12em] text-navy sm:text-[13.5px]">
                  {HERO.price.pill}
                </span>
              </div>

              <div className="mx-auto mt-4 max-w-[560px] lg:mx-0 lg:mt-3.5 lg:max-w-[440px]">
                <SaveSeatButton
                  label={CTA.labels.hero}
                  className="w-full !px-5 text-[14.5px] leading-tight sm:text-[16px]"
                />
              </div>

              <CtaDetails className="mt-3.5 font-body text-[11.5px] text-white/70 sm:text-[12.5px] lg:justify-start" />
              <CtaReassurance className="mt-1.5 font-body text-[11px] text-white/45 sm:text-[12px] lg:justify-start" />
            </Reveal>
          </div>

          {/* ── 4 · Who is hosting ──────────────────────────────────────────
              The three recognition lines that used to sit here now open the
              pain section instead. Said once, they land harder, and the hero
              stays a promise rather than a second list of symptoms. */}
          <div className="order-4 mt-8 text-center lg:col-start-1 lg:row-start-3 lg:mt-6 lg:text-left">
            <Reveal className="mt-2">
              <span
                aria-hidden="true"
                className="mx-auto block h-px w-16 bg-coral/50 lg:mx-0"
              />
              <div className="mt-4 space-y-1">
                {HERO.credential.map((line) => (
                  <p
                    key={line}
                    className="font-body text-[12px] leading-relaxed text-white/60 sm:text-[13px]"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Scarcity bar, on the coral tint */}
      <div className="relative border-t border-coral/20 bg-coral/[0.14]">
        <p className="container-page py-3 text-center font-body text-[12.5px] font-semibold leading-snug text-white sm:text-[13.5px]">
          {HERO.scarcity}
        </p>
      </div>
    </section>
  );
}
