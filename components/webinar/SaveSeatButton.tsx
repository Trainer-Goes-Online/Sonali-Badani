'use client';

import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRegistration } from './RegistrationProvider';
import { CTA } from '@/lib/webinar-content';
import { trackAddToCart } from '@/lib/events';

/**
 * The one CTA on the landing page. Every instance opens the same stepwise
 * registration modal, so there is no scroll-to-form jump and no separate inline
 * form to fall out of sync.
 *
 * The label varies by placement (see CTA.labels) so six buttons do not read as
 * the same button six times, while the destination stays identical. The primary
 * promise is long, so it steps down to shorter forms on narrow phones rather
 * than wrapping to three lines inside the pill.
 */
export default function SaveSeatButton({
  label,
  shortLabel,
  className,
  showArrow = true,
}: {
  /** Full label, used from `sm` up. Defaults to the primary promise. */
  label?: string;
  /** Optional shorter label for phones. Falls back to the shared short form. */
  shortLabel?: string;
  className?: string;
  showArrow?: boolean;
}) {
  const { open } = useRegistration();
  const full = label ?? CTA.primary;
  const short = shortLabel ?? (label ? label : CTA.primaryShort);

  // Meta AddToCart the moment she commits to the form, before it opens. Fired
  // through the Conversions API, so an ad blocker on the pixel does not lose it.
  const handleClick = () => {
    trackAddToCart();
    open();
  };

  return (
    <button type="button" onClick={handleClick} className={cn('btn-primary', className)}>
      <span className="relative z-[3] sm:hidden">{short}</span>
      <span className="relative z-[3] hidden sm:inline">{full}</span>
      {showArrow && <ArrowRight className="relative z-[3] h-5 w-5 shrink-0" />}
    </button>
  );
}

/**
 * The three objections this audience actually has, answered in one line under
 * every button: being seen, being exposed, and needing him to agree first.
 */
export function CtaReassurance({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-2 gap-y-1',
        className
      )}
    >
      {CTA.reassurance.map((item, i) => (
        <li key={item} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Free · Live on Zoom · 90 minutes · Camera off */
export function CtaDetails({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-2 gap-y-1',
        className
      )}
    >
      {CTA.details.map((item, i) => (
        <li key={item} className="flex items-center gap-2">
          {i > 0 && (
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
          )}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
