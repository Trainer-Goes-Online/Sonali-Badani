import Link from 'next/link';
import Logo from './ui/Logo';
import { MASTERCLASS_NAME, MASTERCLASS_TAGLINE } from '@/lib/webinar-config';

/**
 * Footer on navy. White logo card (the coral accents stay warm on dark), a
 * short honest disclaimer about what the masterclass is and is not, and the
 * standard legal links.
 */
export default function Footer() {
  return (
    /*
     * `--sticky-h` is published by useStickyOffset when a page renders a fixed
     * sticky CTA bar. Padding the footer by that amount keeps the navy running
     * behind the bar, so the legal links and copyright are never covered. On
     * pages with no sticky bar the variable is unset and this resolves to 0px.
     */
    <footer
      className="bg-navy text-white/75"
      style={{ paddingBottom: 'var(--sticky-h, 0px)' }}
    >
      <div className="container-reading py-12 text-center sm:py-14">
        <div className="flex justify-center">
          <span className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-soft">
            <Logo height={38} />
          </span>
        </div>

        {/* The brand lockup: the name and its sub-heading, on every page. */}
        <p className="mt-6 font-serif text-[15px] font-semibold uppercase tracking-[0.04em] text-white sm:text-[16.5px]">
          {MASTERCLASS_NAME}
        </p>
        <p className="mt-1.5 font-body text-[10.5px] font-bold uppercase tracking-[0.18em] text-coral sm:text-[11.5px]">
          {MASTERCLASS_TAGLINE}
        </p>

        <p className="mx-auto mt-6 max-w-reading font-body text-[13px] leading-relaxed text-white/65">
          {MASTERCLASS_NAME} is a live coaching session from Sonali Badani and The Soul
          Space. It is not therapy, medical advice, or a substitute for professional care, and
          individual results vary. If your situation feels unsafe, please reach out to someone who
          can help you directly. You deserve real support, and this is not a substitute for it.
        </p>

        <nav
          aria-label="Legal"
          className="mt-7 flex flex-nowrap items-center justify-center gap-x-2.5 whitespace-nowrap font-body text-[12px] font-medium text-white sm:gap-x-5 sm:text-[14px]"
        >
          <Link href="/privacy-policy" className="transition-colors hover:text-coral">
            Privacy Policy
          </Link>
          <span aria-hidden="true" className="text-white/30">
            ·
          </span>
          <Link href="/terms-and-conditions" className="transition-colors hover:text-coral">
            Terms &amp; Conditions
          </Link>
          <span aria-hidden="true" className="text-white/30">
            ·
          </span>
          <Link href="/refund-policy" className="transition-colors hover:text-coral">
            Refund Policy
          </Link>
        </nav>

        <p className="mt-6 font-body text-[12.5px] text-white/55">
          © {new Date().getFullYear()} Sonali Badani · The Soul Space. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
