import crypto from 'node:crypto';

/**
 * Meta Conversions API sender. SERVER ONLY.
 *
 * Every Meta event on this funnel except `PageView` is fired from here, through
 * `/api/capi`. The browser pixel exists only to set the first-party `_fbp` and
 * `_fbc` cookies, which are the two biggest Event Match Quality levers and which
 * the browser then hands to this route.
 *
 * The access token lives in `META_CAPI_ACCESS_TOKEN`, deliberately WITHOUT the
 * `NEXT_PUBLIC_` prefix, so Next.js can never inline it into a client bundle.
 */

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || 'v21.0';
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';
/** Set while smoke testing so events route to Events Manager > Test Events. */
const TEST_EVENT_CODE = process.env.META_CAPI_TEST_EVENT_CODE || '';

/** SHA-256 as lowercase hex, which is the only form Meta accepts. */
function sha256(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

const digits = (s: string | undefined) => (s || '').replace(/\D/g, '');

/**
 * Normalise per Meta's rules, then hash. An empty source value stays absent
 * rather than becoming the hash of an empty string, which would otherwise be a
 * constant that matches every other empty record.
 */
function hashed(value: string | undefined): string | undefined {
  const v = (value || '').trim().toLowerCase();
  return v ? sha256(v) : undefined;
}

/** The raw customer fields the browser sends us. */
export type RawUserData = {
  email?: string;
  phone?: string;
  /** Dial code including the plus, e.g. "+91". Joined to `phone` for Meta. */
  country_code?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  /** ISO country, e.g. "in". */
  country?: string;
  /** Meta's click and browser cookies, sent unhashed. */
  fbc?: string;
  fbp?: string;
  /** Stable per-person id. We use the normalised email. Hashed before sending. */
  external_id?: string;
};

/**
 * Build Meta's `user_data`. The hashed parameters are hashed here and here only,
 * so the funnel can never drift into two implementations that disagree by a
 * `.trim()` and silently stop matching.
 *
 * `client_ip_address` and `client_user_agent` are read from the real request in
 * the route, never from the client body, because a browser can trivially lie
 * about both and Meta weights them heavily.
 */
export function buildUserData(
  raw: RawUserData,
  ip: string,
  userAgent: string
): Record<string, unknown> {
  const phoneDigits = digits(raw.country_code) + digits(raw.phone);

  const out: Record<string, unknown> = {};
  const put = (key: string, value: string | undefined) => {
    if (value) out[key] = value;
  };

  put('em', hashed(raw.email));
  put('ph', phoneDigits ? sha256(phoneDigits) : undefined);
  put('fn', hashed(raw.first_name));
  put('ln', hashed(raw.last_name));
  // Meta wants city with all whitespace stripped, not just trimmed.
  put('ct', hashed((raw.city || '').replace(/\s+/g, '')));
  put('country', hashed(raw.country));
  put('external_id', hashed(raw.external_id || raw.email));

  // Explicitly NOT hashed, per Meta's spec.
  put('fbc', raw.fbc);
  put('fbp', raw.fbp);
  put('client_ip_address', ip);
  put('client_user_agent', userAgent);

  return out;
}

export type CapiEvent = {
  event_name: string;
  /** Deterministic, so a retry or a page reload can never double count. */
  event_id: string;
  event_source_url: string;
  user_data: Record<string, unknown>;
  custom_data?: Record<string, unknown>;
  /** Seconds since epoch. Defaults to now. */
  event_time?: number;
};

export type CapiResult = { ok: boolean; status: number; body: string };

/** True when the funnel has everything it needs to fire server-side events. */
export function capiConfigured(): boolean {
  return Boolean(PIXEL_ID && ACCESS_TOKEN);
}

/**
 * POST one event to Meta. Never throws: a Meta outage, a rotated token or a
 * network blip must never surface as a 500 to the browser, because on the
 * purchase pages that would look to the caller like the sale failed.
 */
export async function sendCapiEvent(event: CapiEvent): Promise<CapiResult> {
  if (!capiConfigured()) {
    return { ok: false, status: 0, body: 'CAPI not configured' };
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: event.event_name,
        event_time: event.event_time ?? Math.floor(Date.now() / 1000),
        event_id: event.event_id,
        action_source: 'website',
        event_source_url: event.event_source_url,
        user_data: event.user_data,
        ...(event.custom_data ? { custom_data: event.custom_data } : {}),
      },
    ],
  };
  if (TEST_EVENT_CODE) payload.test_event_code = TEST_EVENT_CODE;

  const url =
    `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events` +
    `?access_token=${encodeURIComponent(ACCESS_TOKEN)}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });
    const body = await res.text();
    if (!res.ok) {
      console.error(`[capi] ${event.event_name} failed ${res.status}: ${body}`);
    }
    return { ok: res.ok, status: res.status, body };
  } catch (err) {
    console.error(`[capi] ${event.event_name} threw`, err);
    return { ok: false, status: 0, body: String(err) };
  }
}

/** Read the buyer's real IP from the proxy headers Vercel sets. */
export function clientIpFrom(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  return (
    (forwarded ? forwarded.split(',')[0].trim() : '') ||
    headers.get('x-real-ip') ||
    ''
  );
}
