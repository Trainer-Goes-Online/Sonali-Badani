'use client';

import { useEffect, useRef, useState } from 'react';

function format(n: number, decimals: number, separator: string) {
  const fixed = n.toFixed(decimals);
  if (!separator) return fixed;
  const [int, dec] = fixed.split('.');
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return dec ? `${withSep}.${dec}` : withSep;
}

/**
 * Counts from `start` to `end` once the element scrolls into view, then settles
 * on `finalLabel` if provided (used for the "4–5 hrs" range — it sweeps 0→5 like
 * the others, then resolves into the exact range). Honours reduced-motion.
 */
export default function CountUp({
  end,
  start = 0,
  durationMs = 1600,
  decimals = 0,
  separator = '',
  prefix = '',
  suffix = '',
  finalLabel,
  className,
}: {
  end: number;
  start?: number;
  durationMs?: number;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  finalLabel?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(
    () => `${prefix}${format(start, decimals, separator)}${suffix}`
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const finalText = finalLabel ?? `${prefix}${format(end, decimals, separator)}${suffix}`;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(finalText);
      return;
    }

    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const p = Math.min((now - t0) / durationMs, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          if (p < 1) {
            const val = start + (end - start) * eased;
            setDisplay(`${prefix}${format(val, decimals, separator)}${suffix}`);
            requestAnimationFrame(step);
          } else {
            setDisplay(finalText);
          }
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, start, durationMs, decimals, separator, prefix, suffix, finalLabel]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
