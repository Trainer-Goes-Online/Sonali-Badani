import type { Metadata } from 'next';

import Footer from '@/components/Footer';
import LiveRoom from '@/components/webinar/LiveRoom';
import MeetSonali from '@/components/webinar/sections/MeetSonali';
import SurvivingToDesigning from '@/components/webinar/sections/SurvivingToDesigning';
import Outcome from '@/components/webinar/sections/Outcome';
import { MASTERCLASS_NAME } from '@/lib/webinar-config';

export const metadata: Metadata = {
  title: `Live room | ${MASTERCLASS_NAME}`,
  robots: { index: false, follow: false },
};

/**
 * /live · the recorded masterclass, played as if live.
 *
 * Set by two env values: NEXT_PUBLIC_REPLAY_DATETIME (when the room opens) and
 * NEXT_PUBLIC_REPLAY_VIDEO_URL (the recording). Everything time based happens
 * in the browser, inside LiveRoom, so the page itself is fully static.
 *
 * The sections below the waiting room player are the landing page's own, in
 * this order: who she is about to hear from, the shift, and what she leaves
 * with. They show only while the start is more than five minutes away.
 */
export default function LivePage() {
  return (
    <LiveRoom
      sections={
        <>
          <MeetSonali />
          <SurvivingToDesigning />
          <Outcome />
        </>
      }
      footer={<Footer />}
    />
  );
}
