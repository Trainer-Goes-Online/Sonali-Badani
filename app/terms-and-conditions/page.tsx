import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { COURSE_PRICE_LABEL } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sonali Badani',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" updated="June 2026">
      <p>
        By purchasing or accessing The One Partner Reset, you agree to these terms. Please
        read them carefully.
      </p>

      <h2>The offer</h2>
      <p>
        The One Partner Reset is a private, self-paced experience that includes the core modules, a
        blueprint and workbook, supporting bonuses, a private community, and a 15-minute Marriage
        Assessment Call with Sonali, delivered digitally for a one-time fee of {COURSE_PRICE_LABEL}.
      </p>

      <h2>Not therapy or medical advice</h2>
      <p>
        This program is educational and is <strong>not therapy, counselling, or medical advice</strong>,
        and it is not a substitute for professional care. If you are experiencing abuse or are
        concerned about your safety, please seek direct professional and local support. This program
        is not designed for crisis situations.
      </p>

      <h2>Results</h2>
      <p>
        Individual results vary and depend on personal circumstances and effort. We make no guarantee
        of any specific outcome in your relationship.
      </p>

      <h2>Licence &amp; use</h2>
      <ul>
        <li>Your access is for personal, non-commercial use only.</li>
        <li>You may not copy, resell, redistribute, or share the materials.</li>
        <li>Access is granted to you as the enrolled individual.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Payments are processed securely through Razorpay. By completing checkout you authorise the
        charge shown at the point of purchase.
      </p>

      <h2>Refunds</h2>
      <p>
        Purchases are covered by our 14-day money-back guarantee. See our{' '}
        <a href="/refund-policy">Refund Policy</a> for details.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions, email{' '}
        <a href="mailto:connect@sonalibadani.com">connect@sonalibadani.com</a>.
      </p>
    </LegalPageLayout>
  );
}
