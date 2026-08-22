'use client';

import { useEffect, useState } from 'react';
import { deadlineMs } from '@/lib/webinar-config';
import { HERO } from '@/lib/webinar-content';

type Parts = { days: string; hours: string; mins: string; secs: string };

const PAD = (n: number) => String(n).padStart(2, '0');

/** Clamps at zero, so the block can never show a negative number. */
function partsFrom(remainingMs: number): Parts {
  const total = Math.max(0, Math.floor(remainingMs / 1000));
  return {
    days: PAD(Math.floor(total / 86400)),
    hours: PAD(Math.floor((total % 86400) / 3600)),
    mins: PAD(Math.floor((total % 3600) / 60)),
    secs: PAD(total % 60),
  };
}

const BLANK: Parts = { days: '00', hours: '00', mins: '00', secs: '00' };

/**
 * Countdown to the moment the room opens (NEXT_PUBLIC_WEBINAR_DATETIME).
 *
 * Renders zeros on the server and on first paint, then starts ticking after
 * mount, so the server and client markup always match and there is no hydration
 * warning. When the deadline passes, the whole block is replaced by the
 * closing line rather than counting into negatives.
 */
export default function Countdown({ className = '' }: { className?: string }) {
  const [parts, setParts] = useState<Parts>(BLANK);
  const [expired, setExpired] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const target = deadlineMs();
    if (target === null) {
      // No usable deadline configured: show nothing rather than a wrong number.
      setExpired(true);
      setReady(true);
      return;
    }

    const tick = () => {
      const remaining = target - Date.now();
      if (remaining <= 0) {
        setExpired(true);
        setParts(BLANK);
        return true;
      }
      setParts(partsFrom(remaining));
      return false;
    };

    setReady(true);
    if (tick()) return;

    const id = window.setInterval(() => {
      if (tick()) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (ready && expired) {
    return (
      <div className={className}>
        <p className="text-center font-body text-[15px] font-bold uppercase tracking-[0.16em] text-coral sm:text-[17px]">
          {HERO.countdownClosed}
        </p>
      </div>
    );
  }

  const cells: { value: string; label: string }[] = [
    { value: parts.days, label: 'Days' },
    { value: parts.hours, label: 'Hrs' },
    { value: parts.mins, label: 'Min' },
    { value: parts.secs, label: 'Sec' },
  ];

  return (
    <div className={className}>
      <p className="text-center font-body text-[11px] font-bold uppercase tracking-[0.2em] text-coral">
        {HERO.countdownLabel}
      </p>

      <div className="mx-auto mt-3 grid max-w-[420px] grid-cols-4 gap-2 sm:gap-3">
        {cells.map((cell) => (
          <div
            key={cell.label}
            className="rounded-xl border border-coral/35 bg-white/[0.06] px-1 py-3 text-center backdrop-blur-sm transition-colors sm:rounded-2xl sm:py-4"
          >
            <span className="block font-serif text-[24px] font-semibold leading-none tabular-nums text-white sm:text-[30px]">
              {cell.value}
            </span>
            <span className="mt-1.5 block font-body text-[9px] font-bold uppercase tracking-[0.14em] text-white/50 sm:text-[10px]">
              {cell.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
