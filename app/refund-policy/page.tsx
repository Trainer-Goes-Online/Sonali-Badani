import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { COURSE_PRICE_LABEL, VISUALIZATION_PRICE_LABEL } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Refund Policy | Sonali Badani',
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund Policy" updated="August 2026">
      <h2>The masterclass is free</h2>
      <p>
        There is nothing to pay to attend The Love Legacy Masterclass, so there is nothing to refund.
        If you cannot make the live session, simply do not attend. You are welcome to leave the
        WhatsApp group at any time.
      </p>

      <h2>The Full Reset Guarantee</h2>
      <p>
        If you purchase The One Partner Reset ({COURSE_PRICE_LABEL}), you have fourteen days. Go
        through it. Do the work. Sit on your call. If it does not give you something you can use,
        write to us and we will return your money. No forms, no explanation needed.
      </p>
      <p>
        The same fourteen days apply to the Love Legacy Visualization ({VISUALIZATION_PRICE_LABEL}) if
        you added it to your order.
      </p>

      <h2>How to request a refund</h2>
      <ul>
        <li>
          Email <a href="mailto:connect@sonalibadani.com">connect@sonalibadani.com</a> within 14 days
          of your purchase.
        </li>
        <li>Use the same email address you used at checkout.</li>
        <li>No forms. No arguments. No stress.</li>
      </ul>

      <h2>Processing</h2>
      <p>
        Approved refunds are issued to your original payment method through the processor that took
        the payment. Depending on your bank, it may take 5 to 10 business days for the amount to
        reflect in your account.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about a refund? Email{' '}
        <a href="mailto:connect@sonalibadani.com">connect@sonalibadani.com</a>.
      </p>
    </LegalPageLayout>
  );
}
