import Link from 'next/link';
import Logo from './ui/Logo';

/**
 * Footer on navy. White logo (coral accents drop to white via filter on dark),
 * a short honest disclaimer, and standard legal links. No phone or promo URL.
 */
export default function Footer() {
  return (
    <footer className="bg-navy text-white/75">
      <div className="container-reading py-12 text-center sm:py-14">
        <div className="flex justify-center">
          <span className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-soft">
            <Logo height={38} />
          </span>
        </div>

        <p className="mx-auto mt-6 max-w-reading text-[13px] leading-relaxed text-white/65">
          The One Partner Reset is a private, self-paced experience from Sonali Badani and The Soul
          Space. It is not therapy, medical advice, or a substitute for professional care, and
          individual results vary. If your situation feels unsafe, please reach out to someone who
          can help you directly. You deserve real support, and this is not a substitute for it.
        </p>

        <nav
          aria-label="Legal"
          className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[14px] font-medium text-white"
        >
          <Link href="/privacy-policy" className="transition-colors hover:text-coral">
            Privacy Policy
          </Link>
          <span aria-hidden="true" className="text-white/30">·</span>
          <Link href="/terms-and-conditions" className="transition-colors hover:text-coral">
            Terms &amp; Conditions
          </Link>
          <span aria-hidden="true" className="text-white/30">·</span>
          <Link href="/refund-policy" className="transition-colors hover:text-coral">
            Refund Policy
          </Link>
        </nav>

        <p className="mt-6 text-[12.5px] text-white/55">
          © {new Date().getFullYear()} Sonali Badani · The Soul Space. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
