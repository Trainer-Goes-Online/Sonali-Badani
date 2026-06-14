'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Calendly inline embed. The widget script is loaded lazily only when the embed
 * scrolls into view, so it never blocks initial page load or hurts Lighthouse.
 * Set NEXT_PUBLIC_CALENDLY_URL in the environment to activate it.
 */
export default function CalendlyEmbed() {
  const url = process.env.NEXT_PUBLIC_CALENDLY_URL;
  const ref = useRef<HTMLDivElement | null>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setLoad(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!load || !url) return;
    const existing = document.querySelector<HTMLScriptElement>('script[data-calendly]');
    if (existing) return;
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.dataset.calendly = 'true';
    document.body.appendChild(script);
  }, [load, url]);

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-navy/[0.12] bg-white shadow-soft"
    >
      {url ? (
        <div
          className="calendly-inline-widget"
          data-url={url}
          style={{ minWidth: '320px', height: '720px' }}
        />
      ) : (
        // Graceful placeholder so the layout reserves the right space before
        // the real scheduling URL is configured.
        <div className="grid h-[520px] place-items-center px-6 text-center">
          <div>
            <p className="font-serif text-xl text-navy">Booking calendar loads here</p>
            <p className="lede mt-3 text-[15px]">
              Set <code className="rounded bg-navy/[0.06] px-1.5 py-0.5 text-navy">NEXT_PUBLIC_CALENDLY_URL</code>{' '}
              to embed Sonali&rsquo;s live Calendly scheduler.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
