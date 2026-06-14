import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sonali Badani',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="June 2026">
      <p>
        This Privacy Policy explains how Sonali Badani (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects,
        uses, and protects your information when you visit this website or purchase The Marriage
        Pattern Self-Reset.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you enrol, we collect the details you provide — such as your name, email address, and
        phone number — together with the payment confirmation returned by our payment processor. We do
        not store your card or banking details.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To deliver your course access, workbook, and related emails.</li>
        <li>To provide customer support and respond to your requests.</li>
        <li>To process refunds under our 14-day guarantee.</li>
        <li>To send relevant updates about your purchase. You can opt out at any time.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Payments are processed securely by <strong>Razorpay</strong>. Your transaction is handled on
        their PCI-DSS compliant infrastructure; we receive only a confirmation of payment.
      </p>

      <h2>Third-party tools</h2>
      <p>
        We use trusted services such as TagMango (course delivery) and Calendly (call scheduling) to
        operate this offer. These providers process only the data needed to perform their function.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data at any time by
        writing to <a href="mailto:support@thesoulspace.in">support@thesoulspace.in</a>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{' '}
        <a href="mailto:support@thesoulspace.in">support@thesoulspace.in</a>.
      </p>
    </LegalPageLayout>
  );
}
