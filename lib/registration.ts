/**
 * Registration dispatch — the new Pabbly webhook for form submissions.
 *
 * Two webhooks now run on this funnel and they are deliberately separate:
 *
 *   NEXT_PUBLIC_PABBLY_REGISTRATION_WEBHOOK_URL   fires here, on form submit,
 *     for every woman who registers for the masterclass (buyer or not).
 *
 *   NEXT_PUBLIC_PABBLY_WEBHOOK_URL                unchanged. Still fires only
 *     after a successful purchase, on /welcome-reset, with the same payload it
 *     sends today.
 *
 * Rule from the spec, section 3.9: if the write fails, the woman is still sent
 * onward to the OTO. She is never blocked on our infrastructure. Failed sends
 * are queued in localStorage and retried on the next page load.
 */
import { buildHashedFields } from './meta-capi';
import { isProductionBrowser } from './production-gate';
import {
  emptyLead,
  mergeCachedLead,
  readCachedLead,
  resolveFbIdentifiers,
  fetchClientIp,
  newLeadId,
  REGISTERED_FLAG_KEY,
} from './tracking';

const REGISTRATION_WEBHOOK_URL = process.env.NEXT_PUBLIC_PABBLY_REGISTRATION_WEBHOOK_URL;

/** localStorage key holding registration payloads whose POST did not land. */
const RETRY_QUEUE_KEY = 'FUNNEL_REGISTRATION_RETRY';

export type RegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  /** Dial code including the plus, e.g. "+91". */
  dialCode: string;
  /** ISO country code, e.g. "IN". */
  countryIso: string;
  /** National number, digits only. */
  phone: string;
  city: string;
  /** One of FORM.fields.duration.options. */
  duration: string;
};

/**
 * Build the full registration payload: the woman's details, the cached ad
 * attribution, Meta's click/browser identifiers, the SHA-256 versions Meta CAPI
 * needs, and the live environment fields. Also writes the merged lead back to
 * localStorage so the OTO and the thank-you pages can read it.
 */
async function buildPayload(input: RegistrationInput): Promise<Record<string, string>> {
  const cached = readCachedLead();
  const email = input.email.trim();
  const normalizedEmail = email.toLowerCase();

  const details: Record<string, string> = {
    lead_id: cached.lead_id || newLeadId(),
    created_at: new Date().toISOString(),
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    email,
    // external_id is derived from the normalised email, so it exists from the
    // moment she registers and stays identical across both webhooks.
    external_id: normalizedEmail,
    phone: input.phone.replace(/\D/g, ''),
    country_code: input.dialCode,
    country: input.countryIso.toLowerCase(),
    city: input.city.trim(),
    marriage_struggle_duration: input.duration,
  };

  // Persist first, so the details survive even if the network call fails.
  const lead = mergeCachedLead(details);

  const [hashed, clientIp] = await Promise.all([
    buildHashedFields(lead),
    fetchClientIp(),
  ]);

  const { fbc, fbp } = resolveFbIdentifiers(lead.fbclid);
  const cleanUrl =
    typeof window !== 'undefined'
      ? window.location.origin + window.location.pathname
      : '';

  return {
    ...emptyLead(),
    ...lead,
    ...hashed,
    fbc: fbc || lead.fbc || '',
    fbp: fbp || lead.fbp || '',
    client_ip_address: clientIp,
    client_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    event_source_url: cleanUrl,
    // Names the funnel step so one Pabbly workflow can branch on it if needed.
    event_name: 'webinar_registration',
    tag: 'webinar_registrant',
  };
}

/** Push a payload onto the retry queue (capped, so it can never grow unbounded). */
function queueForRetry(payload: unknown) {
  try {
    const raw = localStorage.getItem(RETRY_QUEUE_KEY);
    const queue = raw ? (JSON.parse(raw) as unknown[]) : [];
    queue.push(payload);
    localStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(queue.slice(-5)));
  } catch {
    /* nothing more we can do; the lead is still in the CRM-bound cache */
  }
}

async function post(payload: unknown): Promise<boolean> {
  if (!REGISTRATION_WEBHOOK_URL) return false;
  // Production only, so a preview build never writes a junk lead into the CRM.
  if (!isProductionBrowser()) return false;
  try {
    const res = await fetch(REGISTRATION_WEBHOOK_URL, {
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
 * Send the registration. Resolves to the lead_id regardless of whether the POST
 * landed, because the caller must move the woman on to the OTO either way.
 */
export async function submitRegistration(input: RegistrationInput): Promise<string> {
  const payload = await buildPayload(input);

  try {
    sessionStorage.setItem(REGISTERED_FLAG_KEY, '1');
  } catch {
    /* the OTO gate degrades to open; better than blocking a real registrant */
  }

  if (!REGISTRATION_WEBHOOK_URL) {
    // No webhook configured (local dev, or the env var is not set yet). The
    // lead is cached and the funnel continues; nothing is silently lost.
    return payload.lead_id;
  }

  const ok = await post(payload);
  if (!ok) queueForRetry(payload);

  return payload.lead_id;
}

/**
 * Drain the retry queue. Called once on the pages after the form so a webhook
 * that was down during the submit still receives the lead a moment later.
 */
export async function flushRegistrationRetries(): Promise<void> {
  if (!REGISTRATION_WEBHOOK_URL) return;
  let queue: unknown[];
  try {
    const raw = localStorage.getItem(RETRY_QUEUE_KEY);
    if (!raw) return;
    queue = JSON.parse(raw) as unknown[];
  } catch {
    localStorage.removeItem(RETRY_QUEUE_KEY);
    return;
  }
  if (!Array.isArray(queue) || queue.length === 0) return;

  const failed: unknown[] = [];
  for (const payload of queue) {
    // Sequential on purpose: a queue this small never needs parallelism, and it
    // keeps ordering intact for whoever reads the Pabbly log.
    const ok = await post(payload);
    if (!ok) failed.push(payload);
  }

  try {
    if (failed.length > 0) localStorage.setItem(RETRY_QUEUE_KEY, JSON.stringify(failed));
    else localStorage.removeItem(RETRY_QUEUE_KEY);
  } catch {
    /* noop */
  }
}
