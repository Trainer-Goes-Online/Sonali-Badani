import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import Reveal from '@/components/ui/Reveal';
import Sparkle from '@/components/ui/Sparkle';
import { WELCOME } from '@/lib/webinar-content';

/**
 * A small gift box whose lid pops open and lets the light out, on a loop.
 * Coral box, gold ribbon: gold here is decoration, never the action.
 */
function GiftBox({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className={className}>
      <ellipse cx="48" cy="89" rx="28" ry="3.5" fill="rgba(0,0,0,0.28)" />

      {/* Light spilling out of the open box */}
      <path className="gift-light" d="M26 47 L14 10 L82 10 L70 47 Z" fill="url(#gift-beam)" />

      <g className="gift-box">
        <rect x="18" y="46" width="60" height="40" rx="6" fill="#E5795C" />
        <rect x="18" y="46" width="60" height="9" fill="#15293C" opacity="0.18" />
        <rect x="43" y="46" width="10" height="40" fill="#C2A36B" />
      </g>

      <g className="gift-lid">
        <rect x="12" y="34" width="72" height="14" rx="5" fill="#F59075" />
        <rect x="43" y="34" width="10" height="14" fill="#C2A36B" />
        {/* Bow */}
        <path
          d="M48 34 C40 22 26 22 30 30 C32 34 40 34 48 34 Z"
          fill="#C2A36B"
        />
        <path
          d="M48 34 C56 22 70 22 66 30 C64 34 56 34 48 34 Z"
          fill="#C2A36B"
        />
        <circle cx="48" cy="33" r="4" fill="#C2A36B" stroke="#FBF7F1" strokeOpacity="0.5" strokeWidth="1.5" />
      </g>

      <defs>
        <linearGradient id="gift-beam" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FBF7F1" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FBF7F1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/**
 * The gift section on /welcome. It sits under the WhatsApp card and gives the
 * floating gift card something fuller to point at. Leads to
 * /masterclass/upgrade.
 */
export default function GiftSection() {
  const { gift } = WELCOME;

  return (
    <Reveal delay={120} variant="scale" className="pt-3">
      <section id="gift" className="gift-frame rounded-[28px]">
        <div className="relative overflow-hidden rounded-[26px] bg-navy-deep px-5 pb-6 pt-7 text-center sm:px-8 sm:pb-8 sm:pt-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-[radial-gradient(60%_70%_at_50%_0%,rgba(245,144,117,0.28),transparent_70%)]"
          />

          <div className="relative mx-auto w-fit">
            <GiftBox className="h-[92px] w-[92px] sm:h-[104px] sm:w-[104px]" />
            <Sparkle twinkle className="absolute -left-5 top-3 h-4 w-4 text-gold" />
            <Sparkle
              twinkle
              className="absolute -right-4 top-0 h-3 w-3 text-coral [animation-delay:1.1s]"
            />
            <Sparkle
              twinkle
              className="absolute -right-6 bottom-6 h-3.5 w-3.5 text-gold [animation-delay:2s]"
            />
          </div>

          <p className="relative mt-4 font-body text-[10.5px] font-bold uppercase tracking-[0.18em] text-coral sm:text-[11.5px]">
            {gift.eyebrow}
          </p>
          <h2 className="relative mt-2 font-serif text-[28px] font-semibold leading-[1.15] text-white sm:text-[34px]">
            {gift.heading}
          </h2>
          <p className="relative mx-auto mt-3 max-w-[440px] font-body text-[16px] font-semibold leading-snug text-coral sm:text-[17.5px]">
            {gift.body}
          </p>
          <p className="relative mx-auto mt-3 max-w-[460px] font-body text-[14px] leading-[1.7] text-white/70 sm:text-[15px]">
            {gift.detail}
          </p>

          <ul className="relative mx-auto mt-5 max-w-[420px] space-y-2.5 text-left">
            {gift.points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 font-body text-[14px] leading-snug text-white/90 sm:text-[15px]"
              >
                <span className="mt-px grid h-5 w-5 shrink-0 place-items-center rounded-full bg-coral/20">
                  <Check className="h-3 w-3 text-coral" strokeWidth={3} />
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/masterclass/upgrade"
            id="gift-cta"
            className="btn-primary gift-cta cta-wobble relative mt-7 w-full !text-[16px] sm:!text-[17px]"
          >
            <span className="relative z-[3]">{gift.cta}</span>
            <ArrowRight className="relative z-[3] h-5 w-5 shrink-0" />
          </Link>
          <p className="relative mt-3 font-body text-[12px] text-white/50 sm:text-[12.5px]">
            {gift.note}
          </p>
        </div>
      </section>
    </Reveal>
  );
}
