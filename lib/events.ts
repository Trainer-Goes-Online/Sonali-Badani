import { MASTERCLASS_NAME } from './webinar-config';
/**
 * Funnel analytics events, in one place.
 *
 * Per the build spec, section 6. Every event is fired to Meta (browser pixel)
 * and to GA4 where both are loaded. Each call is defensive: if a tag has not
 * loaded, or an ad blocker removed it, the funnel carries on silently. Nothing
 * here ever blocks navigation.
 *
 *   PageView        P1 load                    (fired by the pixel snippet)
 *   ViewContent     P1 load, after 3 seconds
 *   Lead            registration form success  <- the optimisation event
 *   AddToCart       P2 clicks YES
 *   Purchase        Razorpay/TagMango webhook, server side
 *   oto_decline     P2 clicks NO               (custom)
 *   whatsapp_join   any WhatsApp button click  (custom)
 */

type Params = Record<string, unknown>;

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[] };
type Gtag = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === 'undefined') return null;
  const f = (window as unknown as { fbq?: Fbq }).fbq;
  return typeof f === 'function' ? f : null;
}

function gtag(): Gtag | null {
  if (typeof window === 'undefined') return null;
  const g = (window as unknown as { gtag?: Gtag }).gtag;
  return typeof g === 'function' ? g : null;
}

/** A Meta standard event (PageView, ViewContent, Lead, AddToCart, Purchase). */
export function trackStandard(name: string, params: Params = {}, eventId?: string) {
  try {
    fbq()?.('track', name, params, eventId ? { eventID: eventId } : undefined);
  } catch {
    /* never let a tag break the funnel */
  }
  try {
    gtag()?.('event', name, params);
  } catch {
    /* same */
  }
}

/** A custom event (oto_decline, whatsapp_join, registration_step). */
export function trackCustom(name: string, params: Params = {}) {
  try {
    fbq()?.('trackCustom', name, params);
  } catch {
    /* noop */
  }
  try {
    gtag()?.('event', name, params);
  } catch {
    /* noop */
  }
}

/** P1 load, after a 3 second dwell. */
export const trackViewContent = () =>
  trackStandard('ViewContent', { content_name: `${MASTERCLASS_NAME} registration` });

/** Registration succeeded. This is the campaign optimisation event. */
export const trackLead = (eventId?: string) =>
  trackStandard(
    'Lead',
    { content_name: `${MASTERCLASS_NAME} registration`, currency: 'INR', value: 0 },
    eventId
  );

/** The OTO "yes" click, before the hop to checkout. */
export const trackAddToCart = (value: number, withAddon: boolean) =>
  trackStandard('AddToCart', {
    content_name: withAddon
      ? 'The One Partner Reset + Love Legacy Visualization'
      : 'The One Partner Reset',
    content_type: 'product',
    currency: 'INR',
    value,
  });

/** The OTO "no thank you" click. */
export const trackOtoDecline = () => trackCustom('oto_decline');

/** Any WhatsApp group button, on either thank-you page. */
export const trackWhatsappJoin = (page: string, group = 'masterclass') =>
  trackCustom('whatsapp_join', { page, group });

/** Which step of the registration modal the woman reached. */
export const trackRegistrationStep = (step: number) =>
  trackCustom('registration_step', { step });
