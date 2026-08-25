'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Meta Pixel — browser-side PageView ONLY.
 *
 * Every other Meta event on this funnel fires server-side through /api/capi.
 * Do not add fbq('track', ...) calls here or anywhere else: a browser event and
 * a server event for the same thing would double count unless they share an
 * event_id, and the whole point of the CAPI design is that an ad blocker on the
 * pixel cannot cost us a conversion.
 *
 * Loading the pixel is what sets the first-party `_fbp` cookie (and `_fbc` when
 * the landing URL carries `fbclid`). Those cookies ride along through the funnel
 * and are read back into every CAPI call (see lib/events.ts currentUserData) and
 * into the purchase webhook payload, so the server events land with high Event
 * Match Quality.
 *
 * The pixel id comes from NEXT_PUBLIC_META_PIXEL_ID (set in .env / Vercel) — it
 * is never hardcoded. If the env var is unset, the component renders nothing.
 *
 * Turn on "Automatic Advanced Matching" for this pixel in Events Manager to lift
 * the browser PageView's EMQ too (no code needed).
 */
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function MetaPixel() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  // The base snippet fires the first PageView; fire one on each client-side
  // route change after that (Next.js <Link> navigations don't reload the page).
  useEffect(() => {
    if (!PIXEL_ID) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    const w = window as unknown as { fbq?: (...args: unknown[]) => void };
    if (typeof w.fbq === 'function') w.fbq('track', 'PageView');
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
