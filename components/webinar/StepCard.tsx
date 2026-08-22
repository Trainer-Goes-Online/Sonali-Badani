import type { ReactNode } from 'react';
import Reveal from '@/components/ui/Reveal';

/**
 * One numbered "do this now" card on a thank-you page.
 *
 * `highlight` is reserved for the WhatsApp step. That card gets a coral border,
 * a ring and a warm tint so it reads as the one thing that actually matters on
 * the page, and the quieter steps below it never compete for the same attention.
 */
export default function StepCard({
  n,
  title,
  body,
  delay = 0,
  highlight = false,
  children,
}: {
  n: string;
  title: string;
  body: string;
  delay?: number;
  highlight?: boolean;
  children?: ReactNode;
}) {
  return (
    <Reveal
      delay={delay}
      className={
        highlight
          ? 'rounded-3xl border-2 border-coral bg-white p-5 shadow-[0_18px_60px_-28px_rgba(245,144,117,0.75)] ring-4 ring-coral/15 sm:p-6'
          : 'rounded-3xl border border-navy/10 bg-white p-5 shadow-card sm:p-6'
      }
    >
      <div className="flex items-center gap-3">
        <span
          className={
            highlight
              ? 'grid h-9 w-9 shrink-0 place-items-center rounded-full bg-coral font-serif text-[17px] font-semibold leading-none text-navy'
              : 'font-serif text-[22px] font-semibold leading-none text-coral sm:text-[26px]'
          }
        >
          {n}
        </span>
        {highlight && (
          <span className="rounded-pill bg-coral/15 px-3 py-1 font-body text-[9.5px] font-bold uppercase tracking-[0.14em] text-coral-dark sm:text-[10.5px]">
            Do this first
          </span>
        )}
      </div>

      <h2 className="mt-3 font-body text-[13.5px] font-bold uppercase tracking-[0.1em] text-navy sm:text-[15px]">
        {title}
      </h2>
      <p className="mt-2.5 font-body text-[14.5px] leading-[1.65] text-navy/75 sm:text-[15.5px]">
        {body}
      </p>

      {children}
    </Reveal>
  );
}
