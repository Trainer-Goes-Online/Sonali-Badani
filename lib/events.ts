import { MASTERCLASS_NAME } from './webinar-config';
import { readCachedLead, resolveFbIdentifiers, newLeadId } from './tracking';
import { isProductionBrowser } from './production-gate';

/**
 * Funnel analytics, in one place.
 *
 * TRANSPORT RULE, and it is the whole point of this file:
 *
 *   Meta  ->  Conversions API, server side, via `/api/capi`.
 *             The browser pixel fires `PageView` and NOTHING else. Its only
 *             other job is setting the first-party `_fbp` / `_fbc` cookies,
 *             which we read back here and hand to the server for matching.
 *
 *   GA4   ->  browser side, via gtag, mirroring every Meta event under the same
 *             name, EXCEPT `Purchase` and `sales`, which are Meta only.
 *
 * The event table:
 *
 *   PageView             every page load          pixel (see MetaPixel.tsx)
 *   ViewContent          P1, after a 3s dwell     CAPI + GA4
 *   AddToCart            P1, a CTA is tapped      CAPI + GA4
 *   CompleteRegistration form submitted           CAPI + GA4
 *   Lead                 form submitted           CAPI + GA4   (kept for any
 *                                                 campaign still optimising to it)
 *   oto_reset_plus_add   P2, add-on switched on   CAPI + GA4
 *   oto_reset_cta        P2, yes at the base price     CAPI + GA4
 *   oto_reset_plus_cta   P2, yes with the add-on       CAPI + GA4
 *   oto_decline          P2, "no thank you"       CAPI + GA4
 *   whatsapp_join        any WhatsApp button      CAPI + GA4
 *   registration_step    modal step reached       GA4 only (noise on Meta)
 *   Purchase             P3 purchase pages        CAPI only  (see lib/purchase.ts)
 *   sales                P3 purchase pages        CAPI only  (see lib/purchase.ts)
 *
 * Every call is defensive. If a tag is missing, an ad blocker removed it, or the
 * network is down, the funnel carries on silently. Nothing here ever blocks
 * navigation or throws into a click handler.
 */

type Params = Record<string, unknown>;
type Gtag = (...args: unknown[]) => void;

function gtag(): Gtag | null {
  if (typeof window === 'undefined') return null;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof g === 'function' ? g : null;
}

/** GA4 only. Same event name as Meta, so the two reports line up one to one. */
function toGa4(name: string, params: Params = {}) {
  try {
    gtag()?.('event', name, params);
  } catch {
    /* never let a tag break the funnel */
  }
}

/** The page URL without its query string, so Meta never receives the UTMs. */
function cleanUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.origin + window.location.pathname;
}

/**
 * The customer fields for Meta matching, assembled from the cached lead plus the
 * live `_fbp` / `_fbc` cookies. The cookies matter more than anything else here:
 * they are read fresh on every call rather than trusted from the cache, because
 * the cache may predate the pixel having set them.
 */
export function currentUserData(): Record<string, string> {
  const lead = readCachedLead();
  const { fbc, fbp } = resolveFbIdentifiers(lead.fbclid);
  return {
    email: lead.email || '',
    phone: lead.phone || '',
    country_code: lead.country_code || '',
    first_name: lead.first_name || '',
    last_name: lead.last_name || '',
    city: lead.city || '',
    country: lead.country || '',
    external_id: (lead.external_id || lead.email || '').trim().toLowerCase(),
    fbc: fbc || lead.fbc || '',
    fbp: fbp || lead.fbp || '',
  };
}

/**
 * Fire one Meta event through our own server. `keepalive` so an event fired on a
 * click that immediately navigates away still leaves the browser.
 */
export function toMeta(
  eventName: string,
  eventId: string,
  customData: Params = {}
): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  // Production only. A preview build or a developer clicking through must never
  // report a conversion that did not happen; Meta cannot un-learn one.
  if (!isProductionBrowser()) return Promise.resolve();
  return fetch('/api/capi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event_name: eventName,
      event_id: eventId,
      event_source_url: cleanUrl(),
      user_data: currentUserData(),
      custom_data: customData,
    }),
  })
    .then(() => undefined)
    .catch(() => undefined);
}

/**
 * A deterministic event id. Ties the event to this specific woman and this
 * specific step, so a double click or a re-render can never double count: Meta
 * dedupes on event_name + event_id for 48 hours.
 */
function eventId(suffix: string): string {
  const lead = readCachedLead();
  const base = lead.lead_id || lead.external_id || lead.email || newLeadId();
  return `${base}_${suffix}`;
}

/** Meta via CAPI plus GA4 under the same name. */
function track(eventName: string, suffix: string, params: Params = {}) {
  void toMeta(eventName, eventId(suffix), params);
  toGa4(eventName, params);
}

/**
 * A one-off custom event, Meta via CAPI plus GA4 under the same name. For the
 * small engagement signals that do not warrant their own named helper, such as
 * `add_to_calendar`. Prefer a named helper below for anything the funnel
 * actually optimises on.
 */
export const trackCustom = (name: string, params: Params = {}) =>
  track(name, name.replace(/[^a-z0-9]+/gi, '_'), params);

/* ── P1, the landing page ─────────────────────────────────────────────────── */

/** Fired after a 3 second dwell, so a bounce is not counted as interest. */
export const trackViewContent = () =>
  track('ViewContent', 'vc', { content_name: `${MASTERCLASS_NAME} registration` });

/** A registration CTA was tapped and the modal opened. */
export const trackAddToCart = () =>
  track('AddToCart', 'atc', {
    content_name: `${MASTERCLASS_NAME} registration`,
    content_type: 'product',
    currency: 'INR',
    value: 0,
  });

/** Which step of the modal she reached. GA4 only: too noisy for Meta. */
export const trackRegistrationStep = (step: number) =>
  toGa4('registration_step', { step });

/**
 * Registration succeeded. Fires BOTH events on purpose:
 * `CompleteRegistration` is the semantically correct one, and `Lead` is kept so
 * any campaign already optimising toward Lead keeps its delivery.
 */
export function trackRegistration(leadId?: string) {
  const base = leadId || eventId('reg').replace(/_reg$/, '');
  const params = {
    content_name: `${MASTERCLASS_NAME} registration`,
    currency: 'INR',
    value: 0,
  };
  void toMeta('CompleteRegistration', `${base}_creg`, params);
  void toMeta('Lead', `${base}_lead`, params);
  toGa4('CompleteRegistration', params);
  toGa4('Lead', params);
}

/* ── P2, the upgrade page ─────────────────────────────────────────────────── */

/** The Love Legacy Visualization add-on was switched ON. */
export const trackOtoAddonAdded = (value: number) =>
  track('oto_reset_plus_add', 'otoadd', { currency: 'INR', value });

/** "Yes" at the base price, add-on not taken. */
export const trackOtoResetCta = (value: number) =>
  track('oto_reset_cta', 'otoreset', {
    content_name: 'The One Partner Reset',
    currency: 'INR',
    value,
  });

/** "Yes" with the add-on kept. */
export const trackOtoResetPlusCta = (value: number) =>
  track('oto_reset_plus_cta', 'otoresetplus', {
    content_name: 'The One Partner Reset + Love Legacy Visualization',
    currency: 'INR',
    value,
  });

/** "No thank you, I will just take my seat". */
export const trackOtoDecline = () => track('oto_decline', 'otodecline');

/* ── P3, the thank you pages ──────────────────────────────────────────────── */

/** Any WhatsApp group button, on any thank you page. */
export const trackWhatsappJoin = (page: string, group = 'masterclass') =>
  track('whatsapp_join', `wa_${page}_${group}`, { page, group });
