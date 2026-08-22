import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { COURSE_PRICE_LABEL, VISUALIZATION_PRICE_LABEL } from '@/lib/pricing';

export const metadata: Metadata = {
  title: 'Privacy Policy | Sonali Badani',
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="August 2026">
      <p>
        This Privacy Policy explains how Sonali Badani and The Soul Space (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collect, use, and protect your information when you visit this website,
        register for The Love Legacy Masterclass, or purchase The One Partner Reset.
      </p>

      <h2>Information we collect</h2>
      <p>
        When you register for the masterclass, we collect the details you enter on the registration
        form: your first name, last name, email address, WhatsApp number, and city. If you go on to
        purchase The One Partner Reset, we also receive a payment confirmation from our payment
        processor. We do not store your card or banking details at any point.
      </p>
      <p>
        We also collect standard technical information that your browser sends automatically, such as
        your IP address, browser type, and the page you arrived from, together with any campaign
        parameters in the link you clicked.
      </p>

      <h2>How we use your information</h2>
      <ul>
        <li>To send you the Zoom link, reminders, and the replay for the masterclass.</li>
        <li>To add you to the WhatsApp group where the session details are shared.</li>
        <li>
          To deliver your access to The One Partner Reset ({COURSE_PRICE_LABEL}) and the Love Legacy
          Visualization ({VISUALIZATION_PRICE_LABEL}) if you purchase them.
        </li>
        <li>To provide support and respond to your questions.</li>
        <li>To process refunds under our 14 day guarantee.</li>
        <li>
          To measure how our advertising performs, so we can reach more women who need this session.
          You can opt out of marketing messages at any time.
        </li>
      </ul>

      <h2>WhatsApp</h2>
      <p>
        The number you give us is used to send you the Zoom link, session reminders, and the group
        invite. We will only message you about this session and the programmes we run. You can leave
        the group or ask us to stop messaging you at any time, and we will action it the same day.
      </p>

      <h2>Advertising and measurement</h2>
      <p>
        We use the Meta Pixel and the Meta Conversions API, Google Analytics 4, and Microsoft Clarity
        to understand how this page performs. Where we share event data with Meta for measurement,
        identifying fields such as your email address and phone number are hashed with SHA-256 before
        they leave your browser, so the raw values are never transmitted to the advertising platform.
      </p>
      <p>
        You can limit this by using your browser or device privacy settings, or by adjusting your ad
        preferences with the platform directly.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed securely by our payment partners, including{' '}
        <strong>Razorpay</strong> and <strong>TagMango</strong>. Your transaction is handled on their
        PCI-DSS compliant infrastructure. We receive only a confirmation that payment succeeded.
      </p>

      <h2>Third-party tools</h2>
      <p>
        We use trusted services to operate this funnel: TagMango for course delivery and checkout,
        Zoom for the live session, WhatsApp for the group and reminders, and Pabbly for connecting
        these systems together. Each provider processes only the data needed to perform its function.
      </p>

      <h2>How long we keep your data</h2>
      <p>
        We keep registration and purchase records for as long as we need them to deliver what you
        signed up for, to meet our tax and accounting obligations, and to answer any question you may
        raise later. You can ask us to delete your data sooner at any time.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data at any time by
        writing to <a href="mailto:connect@sonalibadani.com">connect@sonalibadani.com</a>. We will
        respond within a reasonable period.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{' '}
        <a href="mailto:connect@sonalibadani.com">connect@sonalibadani.com</a>.
      </p>
    </LegalPageLayout>
  );
}
