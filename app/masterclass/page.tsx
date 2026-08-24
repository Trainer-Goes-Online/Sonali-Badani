import type { Metadata } from 'next';

import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import AnnouncementBar from '@/components/webinar/AnnouncementBar';
import LandingTracker from '@/components/webinar/LandingTracker';
import RegistrationProvider from '@/components/webinar/RegistrationProvider';
import StickyRegisterBar from '@/components/webinar/StickyRegisterBar';

import Hero from '@/components/webinar/sections/Hero';
import SurvivingToDesigning from '@/components/webinar/sections/SurvivingToDesigning';
import WhoThisIsFor from '@/components/webinar/sections/WhoThisIsFor';
import RealProblem from '@/components/webinar/sections/RealProblem';
import WhatWeCover from '@/components/webinar/sections/WhatWeCover';
import Method from '@/components/webinar/sections/Method';
import NotThis from '@/components/webinar/sections/NotThis';
import MeetSonali from '@/components/webinar/sections/MeetSonali';
import Proof from '@/components/webinar/sections/Proof';
import FAQ from '@/components/webinar/sections/FAQ';
import FinalClose from '@/components/webinar/sections/FinalClose';
import { MASTERCLASS_NAME } from '@/lib/webinar-config';

export const metadata: Metadata = {
  title: `${MASTERCLASS_NAME} | Sonali Badani`,
  description:
    'A free live masterclass for married women. Stop surviving your marriage and start designing it. Discover the hidden pattern keeping it stuck, and the first shift you can make without waiting for him to change.',
  alternates: { canonical: '/masterclass' },
  openGraph: {
    type: 'website',
    title: `${MASTERCLASS_NAME} | Sonali Badani`,
    description:
      'A free live masterclass for married women. Stop surviving your marriage and start designing it. Discover the hidden pattern keeping it stuck, and the first shift you can make without waiting for him to change.',
    siteName: 'Sonali Badani · The Soul Space',
    url: '/masterclass',
  },
  robots: { index: true, follow: true },
};

/**
 * P1 · Registration landing page.
 *
 * One job: convert cold Meta traffic into a registration. Everything needed to
 * decide sits in the hero; every section below it exists to catch the woman who
 * scrolled instead of deciding. Every CTA opens the same stepwise registration
 * modal, which routes straight to the OTO on success.
 */
export default function MasterclassPage() {
  return (
    <RegistrationProvider>
      <LandingTracker />
      <ScrollProgress />
      <AnnouncementBar />

      <main>
        {/* 01 · Hook            The promise */}
        <Hero />
        {/* 02 · The shift       Surviving to designing, and the mechanism */}
        <SurvivingToDesigning />
        {/* 03 · Pain            Four houses */}
        <WhoThisIsFor />
        {/* 04 · Reframe         The crack is in the foundation */}
        <RealProblem />
        {/* 05 · Method          The Rewired Love Method */}
        <Method />
        {/* 06 · Learn + outcome Five teaching points, then what she leaves with */}
        <WhatWeCover />
        {/* 07 · Proof           Four real client messages */}
        <Proof />
        {/* 08 · Sonali          Why she cares, why to trust her */}
        <MeetSonali />
        {/* 09 · Expectations    This is not / This is */}
        <NotThis />
        {/* 10 · FAQ */}
        <FAQ />
        {/* 11 · Register        Stop surviving. Start designing. */}
        <FinalClose />
      </main>

      <Footer />
      <StickyRegisterBar />
    </RegistrationProvider>
  );
}
