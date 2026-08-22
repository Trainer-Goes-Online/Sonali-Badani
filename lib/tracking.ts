/**
 * Funnel tracking contract.
 *
 * The fields below ride along the landing URL (e.g. from a Facebook ad), get
 * cached in localStorage on the landing page, and survive the TagMango checkout
 * hop (which strips custom params) so the post-purchase page can forward them to
 * the Pabbly webhook. Kept here as the single source of truth so the field names
 * are never duplicated across the capture (landing), registration (form) and
 * dispatch (welcome) steps.
 */
export const TRACKING_FIELDS = [
  'lead_id',
  'created_at',
  'first_name',
  'last_name',
  'email',
  'phone',
  'city',
  // How long she has been struggling. Segments the list for nurturing, and
  // tells Sonali who is in the room before she opens it.
  'marriage_struggle_duration',
  'country',
  'country_code',
  'fbc',
  'fbp',
  'client_ip_address',
  'client_user_agent',
  'external_id',
  'event_source_url',
  'amount',
  'is_test',
  'purchase_event_id',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
] as const;

/** localStorage key holding the captured lead data between funnel steps. */
export const FUNNEL_STORAGE_KEY = 'FUNNEL_LEAD_DATA';

/**
 * sessionStorage flag set the moment a registration succeeds. The OTO page is
 * meant to be reachable only after registering, so it checks this before
 * rendering and bounces direct visits back to /masterclass.
 */
export const REGISTERED_FLAG_KEY = 'FUNNEL_REGISTERED';

/** Shape of the cached lead: every tracking field mapped to its string value. */
export type FunnelLeadData = Record<(typeof TRACKING_FIELDS)[number], string>;

/** An empty lead with every field present, so payload shape is always stable. */
export function emptyLead(): Record<string, string> {
  return Object.fromEntries(TRACKING_FIELDS.map((f) => [f, ''])) as Record<string, string>;
}

/** Read the cached lead, or an empty object when there is nothing usable. */
export function readCachedLead(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(FUNNEL_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

/** Merge new values over the cached lead and write it back. Returns the merge. */
export function mergeCachedLead(patch: Record<string, string>): Record<string, string> {
  const merged = { ...emptyLead(), ...readCachedLead(), ...patch };
  try {
    localStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    /* private mode / quota: the funnel still works, tracking degrades */
  }
  return merged;
}

/**
 * Split a single full name into first/last for the payload (first token is the
 * first name, the remainder is the last name). Kept for any surface that still
 * collects one combined name field.
 */
export function splitName(fullName: string): { first_name: string; last_name: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { first_name: parts[0] ?? '', last_name: parts.slice(1).join(' ') };
}

/** Read a cookie value by name (browser only; '' on the server or if absent). */
function readCookie(name: string): string {
  if (typeof document === 'undefined') return '';
  const escaped = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');
  const match = document.cookie.match(new RegExp('(?:^|; )' + escaped + '=([^;]*)'));
  return match ? decodeURIComponent(match[1]) : '';
}

/**
 * Resolve Meta's click/browser identifiers for high Event Match Quality. These
 * are the biggest EMQ levers and are NOT URL params: the Meta Pixel sets them as
 * first-party cookies (`_fbp` always; `_fbc` when the landing URL has `fbclid`).
 * We read those cookies; if `_fbc` is missing but an fbclid is known, we
 * reconstruct it in Meta's documented `fb.1.<ts>.<fbclid>` format. Never
 * fabricates — returns '' when there is genuinely nothing to send.
 */
export function resolveFbIdentifiers(fbclid?: string): { fbc: string; fbp: string } {
  const fbp = readCookie('_fbp');
  let fbc = readCookie('_fbc');
  if (!fbc && fbclid) fbc = `fb.1.${Date.now()}.${fbclid}`;
  return { fbc, fbp };
}

/** Ask our own API route for the caller's IP (the browser cannot read it). */
export async function fetchClientIp(): Promise<string> {
  try {
    const res = await fetch('/api/ip', { cache: 'no-store' });
    if (!res.ok) return '';
    const data = (await res.json()) as { ip?: string };
    return typeof data.ip === 'string' ? data.ip : '';
  } catch {
    return '';
  }
}

/**
 * A reasonably unique lead id, used to tie the registration webhook to the
 * later purchase webhook for the same woman. `crypto.randomUUID` where it
 * exists, with a timestamp + random fallback for older in-app browsers (the
 * Instagram browser is the one that breaks most often).
 */
export function newLeadId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `lead_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
