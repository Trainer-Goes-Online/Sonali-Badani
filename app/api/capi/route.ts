import { NextResponse, type NextRequest } from 'next/server';
import {
  buildUserData,
  sendCapiEvent,
  capiConfigured,
  clientIpFrom,
  type RawUserData,
} from '@/lib/meta-capi-server';

/**
 * The single entry point for every Meta event on this funnel except `PageView`.
 *
 * The browser posts the event name, a deterministic event id, the customer
 * fields it holds and Meta's `_fbp` / `_fbc` cookie values. This route adds the
 * two things only a server can be trusted for, the real client IP and the real
 * user agent, hashes the customer fields, and forwards to the Conversions API.
 *
 * It always answers 200. Analytics must never be able to look like a failure to
 * the page that called it, least of all on the post purchase pages.
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Cap every string so a malformed or hostile body cannot bloat the payload. */
const cap = (v: unknown, max = 512): string =>
  typeof v === 'string' ? v.slice(0, max).replace(/[\r\n]+/g, ' ').trim() : '';

type Body = {
  event_name?: string;
  event_id?: string;
  event_source_url?: string;
  user_data?: RawUserData;
  custom_data?: Record<string, unknown>;
};

export async function POST(request: NextRequest) {
  if (!capiConfigured()) {
    // Local dev without a token, or the env var is not set yet. Not an error:
    // the funnel keeps working and nothing is silently retried forever.
    return NextResponse.json({ ok: false, skipped: 'not-configured' });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: 'bad-json' });
  }

  const eventName = cap(body.event_name, 64);
  const eventId = cap(body.event_id, 128);
  if (!eventName || !eventId) {
    return NextResponse.json({ ok: false, error: 'missing-event-name-or-id' });
  }

  const raw = body.user_data ?? {};
  const userData = buildUserData(
    {
      email: cap(raw.email, 254),
      phone: cap(raw.phone, 32),
      country_code: cap(raw.country_code, 8),
      first_name: cap(raw.first_name, 100),
      last_name: cap(raw.last_name, 100),
      city: cap(raw.city, 100),
      country: cap(raw.country, 8),
      fbc: cap(raw.fbc, 255),
      fbp: cap(raw.fbp, 255),
      external_id: cap(raw.external_id, 254),
    },
    // The real buyer, read off THIS request. Never taken from the body.
    clientIpFrom(request.headers),
    request.headers.get('user-agent') || ''
  );

  const result = await sendCapiEvent({
    event_name: eventName,
    event_id: eventId,
    // Sent without a query string, so Meta is never handed the UTMs and fbclid
    // on every single event.
    event_source_url: cap(body.event_source_url, 512),
    user_data: userData,
    custom_data: body.custom_data,
  });

  return NextResponse.json({ ok: result.ok });
}
