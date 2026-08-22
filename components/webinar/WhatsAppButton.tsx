'use client';

import { ArrowRight, MessageCircle } from 'lucide-react';
import { WEBINAR } from '@/lib/webinar-config';
import { trackWhatsappJoin } from '@/lib/events';

/**
 * The single most important click on either thank-you page: the group is where
 * the Zoom link and the reminders go, and show up rate is won there. So it is
 * deliberately the loudest thing on the page, a full-width coral CTA sitting in
 * its own glow, well above anything else on the card.
 *
 * The link comes from NEXT_PUBLIC_WHATSAPP_COMMUNITY_URL. When that is not set
 * the button keeps its shape and weight but is visibly, honestly disabled, so a
 * missing env var can never look like a working button that goes nowhere.
 */
export default function WhatsAppButton({
  label,
  page,
  className = '',
  url = WEBINAR.whatsappUrl,
  group = 'masterclass',
  variant = 'primary',
}: {
  label: string;
  /** Which page the click came from, sent along with the event. */
  page: string;
  className?: string;
  /** Defaults to the masterclass group; buyers also get the Reset community. */
  url?: string;
  /** Named in the analytics event so the two groups can be told apart. */
  group?: string;
  /** 'primary' is the loud coral CTA; 'secondary' is the quieter outline. */
  variant?: 'primary' | 'secondary';
}) {

  if (!url) {
    return (
      <div className={className}>
        <div
          role="button"
          aria-disabled="true"
          className="flex min-h-[60px] w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-pill border-2 border-dashed border-coral/45 bg-coral/[0.10] px-5 py-4 text-center font-body text-[15px] font-bold text-coral-dark sm:text-[16.5px]"
        >
          <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2.4} />
          {label}
        </div>
        <p className="mt-2.5 text-center font-body text-[12.5px] leading-relaxed text-navy/60">
          The group link is being set up. Your Zoom link will also reach you on WhatsApp and by
          email, so your seat is safe either way.
        </p>
      </div>
    );
  }

  // Secondary: the second group on a page that already has a loud coral CTA.
  // Two competing primaries would leave her unsure which one actually matters.
  if (variant === 'secondary') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappJoin(page, group)}
        className={`flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-pill border-2 border-coral/50 bg-white px-5 py-3 text-center font-body text-[14px] font-bold text-coral-dark transition-colors duration-200 hover:border-coral hover:bg-coral/[0.08] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-coral/30 sm:text-[15px] ${className}`}
      >
        <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2.4} />
        <span>{label}</span>
        <ArrowRight className="h-4 w-4 shrink-0" />
      </a>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Warm halo, so the eye lands here before anything else on the page. */}
      <span
        aria-hidden="true"
        className="halo pointer-events-none absolute -inset-2 -z-10 rounded-pill bg-coral/25 blur-xl"
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsappJoin(page, group)}
        className="btn-primary w-full !min-h-[60px] !py-4 text-[15px] sm:text-[16.5px]"
      >
        <MessageCircle className="relative z-[3] h-5 w-5 shrink-0" strokeWidth={2.4} />
        <span className="relative z-[3]">{label}</span>
        <ArrowRight className="relative z-[3] h-5 w-5 shrink-0" />
      </a>
    </div>
  );
}
