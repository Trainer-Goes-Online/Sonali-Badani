'use client';

import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import Sparkle from '@/components/ui/Sparkle';
import { HERO } from '@/lib/content';

const START_SECONDS = 15 * 60; // 15 minutes

function format(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Sticky urgency bar (landing hero, top of page). Navy strip with the founding
 * price anchor (coral live price) plus a 15-minute countdown that loops back to
 * 15:00 when it hits zero. Pinned to the top so the scarcity stays in view.
 * `seconds` starts at START on both server and client, so the first paint
 * matches and there is no hydration mismatch; the interval runs client-side.
 */
export default function AnnouncementBar() {
  const [seconds, setSeconds] = useState(START_SECONDS);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? START_SECONDS : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Split so the live price ("₹499") can be tinted coral while the rest stays white.
  const [pricePart, ...restParts] = HERO.urgency.split(' ');
  const rest = restParts.join(' ');

  return (
    <div className="sticky top-0 z-40 border-b border-white/10 bg-navy text-white">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 py-2 text-center">
        <p className="flex items-center gap-1.5 font-body text-[12px] font-semibold leading-tight sm:text-[13.5px]">
          <Sparkle twinkle className="h-3 w-3 shrink-0 text-gold" aria-hidden="true" />
          <span>
            <span className="text-coral">{pricePart}</span> {rest}
          </span>
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/10 px-2.5 py-0.5 font-body text-[12px] font-bold tabular-nums leading-tight text-white sm:text-[13px]">
          <Clock className="h-3.5 w-3.5 shrink-0 text-coral" aria-hidden="true" />
          <span className="hidden sm:inline">Ends in</span> {format(seconds)}
        </span>
      </div>
    </div>
  );
}
