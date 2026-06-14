import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyMobileCTA from '@/components/StickyMobileCTA';

import Hero from '@/components/sections/Hero';
import BrandBand from '@/components/sections/BrandBand';
import SoundLikeYou from '@/components/sections/SoundLikeYou';
import TheWomanBecoming from '@/components/sections/TheWomanBecoming';
import TheLoop from '@/components/sections/TheLoop';
import Mechanism from '@/components/sections/Mechanism';
import ThirdOption from '@/components/sections/ThirdOption';
import AnotherVersion from '@/components/sections/AnotherVersion';
import Community from '@/components/sections/Community';
import Testimonials from '@/components/sections/Testimonials';
import WhatHappensNext from '@/components/sections/WhatHappensNext';
import OfferStack from '@/components/sections/OfferStack';
import MeetSonali from '@/components/sections/MeetSonali';
import Guarantee from '@/components/sections/Guarantee';
import WhoFor from '@/components/sections/WhoFor';
import FAQ from '@/components/sections/FAQ';
import FinalClose from '@/components/sections/FinalClose';
import { SHOW_WHO_FOR } from '@/lib/flags';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />              {/* 1 · Hero */}
        <BrandBand />         {/* 1b · Brand line */}
        <SoundLikeYou />      {/* 2 · Does this sound like you */}
        <TheWomanBecoming />  {/* 3b · The woman you've been becoming */}
        <TheLoop />           {/* 4 · The loop nobody showed you */}
        <Mechanism />         {/* 5 · What if you didn't need him to change */}
        <ThirdOption />       {/* 6 · You were never meant to just survive it */}
        <AnotherVersion />    {/* 7 · There's another version of this */}
        <Community />         {/* 8 · You won't do this alone */}
        <Testimonials />      {/* 9 · The women who stopped waiting */}
        <WhatHappensNext />   {/* 9b · What happens next */}
        <OfferStack />        {/* 10 · Everything inside */}
        <MeetSonali />        {/* 11 · Meet Sonali */}
        <Guarantee />         {/* 12 · The Full Reset Guarantee */}
        {SHOW_WHO_FOR && <WhoFor />} {/* 13 · Who this is for (optional) */}
        <FAQ />               {/* 14 · Questions women ask */}
        <FinalClose />        {/* 15 · Before you decide */}
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
