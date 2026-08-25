import type { Metadata } from 'next';
import LegalPageLayout from '@/components/LegalPageLayout';
import { COURSE_PRICE_LABEL, VISUALIZATION_PRICE_LABEL } from '@/lib/pricing';
import {
  WEBINAR,
  DATE_AT_TIME_IST,
  MASTERCLASS_PROSE,
  MASTERCLASS_PROSE_CAP,
} from '@/lib/webinar-config';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Sonali Badani',
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms & Conditions" updated="August 2026">
      <p>
        By registering for {MASTERCLASS_PROSE}, or by purchasing The One Partner Reset, you
        agree to these terms. Please read them carefully.
      </p>

      <h2>The masterclass</h2>
      <p>
        {MASTERCLASS_PROSE_CAP} is a live coaching session hosted by Sonali Badani on Zoom, on{' '}
        {DATE_AT_TIME_IST}, running approximately {WEBINAR.duration} plus live questions.
        It is free to attend. Seats in the live room are limited and registration closes when the
        room fills.
      </p>
      <p>
        Cameras stay off for attendees and only your first name is visible to the room. If you cannot
        attend live, we will send a replay for a limited window, though the live question and answer
        portion is only available in the room.
      </p>
      <p>
        At the end of the session we will describe the programme we run. You are entirely free to
        ignore it and take the session for what it is.
      </p>

      <h2>Registration details</h2>
      <p>
        You agree that the details you give us at registration are your own and are accurate. Your
        Zoom link and reminders are sent to the WhatsApp number and email address you provide, so an
        incorrect number or address may mean you miss the session.
      </p>
      <p>
        We may change the date or time of the session if circumstances require it. If that happens we
        will tell you in the WhatsApp group and by email as early as we can.
      </p>

      <h2>The One Partner Reset</h2>
      <p>
        The One Partner Reset is a private, self-paced digital experience that includes the 45 minute
        Reset Experience, the One Partner Blueprint, the supporting workbooks and playbooks, the named
        bonuses, and access to the private community. It is offered for a one time fee of{' '}
        {COURSE_PRICE_LABEL}. The Love Legacy
        Visualization is an optional add-on at {VISUALIZATION_PRICE_LABEL}.
      </p>
      <p>
        The price shown on the offer page applies to that page only and may not be available
        afterwards.
      </p>

      <h2>Not therapy or medical advice</h2>
      <p>
        This work is educational and is{' '}
        <strong>not therapy, counselling, or medical advice</strong>, and it is not a substitute for
        professional care. If you are experiencing abuse or are concerned about your safety, please
        seek direct professional and local support. This work is for a marriage that has gone quiet,
        not one that has become dangerous, and it is not designed for crisis situations.
      </p>

      <h2>Results</h2>
      <p>
        Individual results vary and depend on personal circumstances and effort. We make no guarantee
        of any specific outcome in your relationship.
      </p>

      <h2>Licence and use</h2>
      <ul>
        <li>Your access is for personal, non-commercial use only.</li>
        <li>
          You may not record, copy, resell, redistribute, or share the session or the materials.
        </li>
        <li>Access is granted to you as the registered or enrolled individual.</li>
      </ul>

      <h2>Privacy in the room</h2>
      <p>
        Anything shared in the live session or the WhatsApp group is shared in confidence. Please do
        not screenshot, record, or repeat what another woman says. We hold the same standard: nothing
        you share is published without your written permission.
      </p>

      <h2>Payments</h2>
      <p>
        Payments are processed securely through our payment partners, including Razorpay and
        TagMango. By completing checkout you authorise the charge shown at the point of purchase.
      </p>

      <h2>Refunds</h2>
      <p>
        The masterclass is free, so there is nothing to refund. Purchases of The One Partner Reset are
        covered by our 14 day guarantee. See our <a href="/refund-policy">Refund Policy</a> for
        details.
      </p>

      <h2>Contact</h2>
      <p>
        For any questions, email{' '}
        <a href="mailto:connect@sonalibadani.com">connect@sonalibadani.com</a>.
      </p>
    </LegalPageLayout>
  );
}
