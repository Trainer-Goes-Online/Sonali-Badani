/**
 * The opt-in on /live: who is in the room for the recorded session.
 *
 * Remembered per browser, per session. Every record carries the session's own
 * key (its start moment, from NEXT_PUBLIC_REPLAY_DATETIME), so the moment a new
 * date is set and deployed, every stored opt-in stops matching and everybody
 * sees the form again. Nothing has to be cleared by hand, on anyone's device.
 *
 * Stored twice, a cookie and a localStorage copy, because either one alone can
 * be wiped (a cookie cleaner, a private tab that keeps one but not the other).
 * The cookie expires a day after the start on its own.
 *
 * The data goes to its own Pabbly webhook,
 * NEXT_PUBLIC_PABBLY_RECORDED_WEBINAR_WEBHOOK_URL, kept separate from the
 * masterclass registration webhook. Production hosts only, like the others,
 * and a failed send is retried on the next visit.
 */
import { isProductionBrowser } from './production-gate';
import { readCachedLead } from './tracking';
import { REPLAY } from './webinar-config';

const WEBHOOK_URL = process.env.NEXT_PUBLIC_PABBLY_RECORDED_WEBINAR_WEBHOOK_URL;

/**
 * Lets THIS webhook fire from any host (localhost, a Vercel preview) so the
 * team can test it before going live. Affects nothing else: Meta events and the
 * other two webhooks stay production only. Set it in .env.local, never in the
 * Vercel production settings.
 */
const ANY_HOST = process.env.NEXT_PUBLIC_RECORDED_WEBINAR_WEBHOOK_TEST === 'true';

const canSend = () => Boolean(WEBHOOK_URL) && (ANY_HOST || isProductionBrowser());

const COOKIE = 'live_optin';
const STORE_KEY = 'LIVE_OPTIN';
const RETRY_KEY = 'LIVE_OPTIN_RETRY';

export type OptinInput = {
  name: string;
  email: string;
  /** Dial code including the plus, e.g. "+91". */
  dialCode: string;
  /** ISO country code, e.g. "IN". */
  countryIso: string;
  /** National number, digits only. */
  phone: string;
};

/** The current session's key. Changes whenever the date in the env changes. */
export function sessionKey(): string | null {
  return REPLAY.startMs === null ? null : String(REPLAY.startMs);
}

function readCookie(): string | null {
  const hit = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE}=`));
  return hit ? decodeURIComponent(hit.slice(COOKIE.length + 1)) : null;
}

/** True when this browser has already opted in to THIS session. */
export function hasOptedIn(): boolean {
  const key = sessionKey();
  if (key === null) return false;

  let stored: string | null = null;
  try {
    stored = readCookie();
  } catch {
    /* cookies blocked */
  }
  if (stored !== key) {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      stored = raw ? (JSON.parse(raw) as { session?: string }).session ?? null : null;
    } catch {
      stored = null;
    }
  }

  if (stored === key) return true;

  // An opt-in left over from an earlier session: clear it, so it can never be
  // mistaken for this one.
  forget();
  return false;
}

function forget() {
  try {
    document.cookie = `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
  } catch {
    /* noop */
  }
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* noop */
  }
}

function remember(input: OptinInput) {
  const key = sessionKey();
  if (key === null) return;

  // A day past the start covers any recording length, then it expires itself.
  const expires = new Date(Number(key) + 24 * 3600_000).toUTCString();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  try {
    document.cookie = `${COOKIE}=${encodeURIComponent(key)}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
  } catch {
    /* noop */
  }
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ session: key, name: input.name.trim(), email: input.email.trim() })
    );
  } catch {
    /* noop */
  }
}

/** Name and email already known from the masterclass registration, if any. */
export function knownDetails(): { name: string; email: string } {
  try {
    const lead = readCachedLead();
    return {
      name: [lead.first_name, lead.last_name].filter(Boolean).join(' '),
      email: lead.email || '',
    };
  } catch {
    return { name: '', email: '' };
  }
}

/** "5 November 2026, 12:04 PM IST", always in India time whatever the phone's zone. */
function istLabel(ms: number): string {
  const d = new Date(ms);
  const date = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(d)
    .replace(/\s*(am|pm)$/i, (_m, p: string) => ` ${p.toUpperCase()}`);
  return `${date}, ${time} IST`;
}

function buildPayload(input: OptinInput): Record<string, string> {
  const digits = input.phone.replace(/\D/g, '');
  const lead = (() => {
    try {
      return readCachedLead();
    } catch {
      return {} as Record<string, string>;
    }
  })();

  return {
    event_name: 'recorded_webinar_optin',
    // Machine timestamp, UTC, as the registration webhook sends it (the Pabbly
    // workflow formats it). The _ist fields beside it are for reading.
    created_at: new Date().toISOString(),
    submitted_at_ist: istLabel(Date.now()),
    name: input.name.trim(),
    email: input.email.trim(),
    phone: digits,
    country_code: input.dialCode,
    country: input.countryIso.toLowerCase(),
    phone_e164: `${input.dialCode}${digits}`,
    // The session she opted in to, so every row in the sheet names its date.
    webinar_date: REPLAY.date,
    webinar_time: REPLAY.time ? `${REPLAY.time} IST` : '',
    webinar_datetime: sessionKey() ? new Date(Number(sessionKey())).toISOString() : '',
    webinar_datetime_ist: sessionKey() ? istLabel(Number(sessionKey())) : '',
    // Carried over from the masterclass registration when she came that way.
    utm_source: lead.utm_source || '',
    utm_medium: lead.utm_medium || '',
    utm_campaign: lead.utm_campaign || '',
    utm_content: lead.utm_content || '',
    event_source_url: window.location.origin + window.location.pathname,
    client_user_agent: navigator.userAgent,
  };
}

async function post(payload: unknown): Promise<boolean> {
  if (!canSend()) return false;
  try {
    const res = await fetch(WEBHOOK_URL as string, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Save the opt-in and send it. She is let into the room straight away whether
 * or not the webhook answers: a failed send is queued and retried next visit.
 */
export async function submitOptin(input: OptinInput): Promise<void> {
  remember(input);
  if (!canSend()) return;

  const payload = buildPayload(input);
  if (!(await post(payload))) {
    try {
      localStorage.setItem(RETRY_KEY, JSON.stringify(payload));
    } catch {
      /* noop */
    }
  }
}

/** Send any opt-in whose first attempt did not land. */
export async function flushOptinRetry(): Promise<void> {
  let payload: unknown;
  try {
    const raw = localStorage.getItem(RETRY_KEY);
    if (!raw) return;
    payload = JSON.parse(raw);
  } catch {
    return;
  }
  if (await post(payload)) {
    try {
      localStorage.removeItem(RETRY_KEY);
    } catch {
      /* noop */
    }
  }
}
