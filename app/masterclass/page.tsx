import type { Metadata } from 'next';

import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import AnnouncementBar from '@/components/webinar/AnnouncementBar';
import LandingTracker from '@/components/webinar/LandingTracker';
import RegistrationProvider from '@/components/webinar/RegistrationProvider';
import StickyRegisterBar from '@/components/webinar/StickyRegisterBar';

import Hero from '@/components/webinar/sections/Hero';
import Recognition from '@/components/webinar/sections/Recognition';
import WhoThisIsFor from '@/components/webinar/sections/WhoThisIsFor';
import RealProblem from '@/components/webinar/sections/RealProblem';
import WhatWeCover from '@/components/webinar/sections/WhatWeCover';
import Method from '@/components/webinar/sections/Method';
import AfterNinety from '@/components/webinar/sections/AfterNinety';
import NotThis from '@/components/webinar/sections/NotThis';
import MeetSonali from '@/components/webinar/sections/MeetSonali';
import Proof from '@/components/webinar/sections/Proof';
import FAQ from '@/components/webinar/sections/FAQ';
import FinalClose from '@/components/webinar/sections/FinalClose';

export const metadata: Metadata = {
  title: 'The Love Legacy Masterclass | Sonali Badani',
  description:
    'A live 90 minute session for married women. See the pattern quietly ruining your marriage, and the first shift you can make from your side alone.',
  alternates: { canonical: '/masterclass' },
  openGraph: {
    type: 'website',
    title: 'The Love Legacy Masterclass | Sonali Badani',
    description:
      'A live 90 minute session for married women. See the pattern quietly ruining your marriage, and the first shift you can make from your side alone.',
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
        <Hero />
        <Recognition />
        <WhoThisIsFor />
        <RealProblem />
        <Method />
        <WhatWeCover />
        <AfterNinety />
        <Proof />
        <MeetSonali />
        <NotThis />
        <FAQ />
        <FinalClose />
      </main>

      <Footer />
      <StickyRegisterBar />
    </RegistrationProvider>
  );
}
