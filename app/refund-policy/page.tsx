import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Refund Policy | Sonali Badani',
  robots: { index: true, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout title="Refund Policy" updated="June 2026">
      <h2>14-Day Money Back Guarantee</h2>
      <p>
        Go through everything. Do the work. Sit on your call. If within 14 days of purchase you feel
        it wasn&rsquo;t right for you, simply email us and we&rsquo;ll refund your ₹497 in full.
      </p>

      <h2>How to request a refund</h2>
      <ul>
        <li>
          Email <a href="mailto:support@thesoulspace.in">support@thesoulspace.in</a> within 14 days
          of your purchase.
        </li>
        <li>Use the same email address you used at checkout.</li>
        <li>No forms. No arguments. No stress.</li>
      </ul>

      <h2>Processing</h2>
      <p>
        Approved refunds are issued to your original payment method via Razorpay. Depending on your
        bank, it may take 5 to 10 business days for the amount to reflect.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about a refund? Email{' '}
        <a href="mailto:support@thesoulspace.in">support@thesoulspace.in</a>.
      </p>
    </LegalPageLayout>
  );
}
