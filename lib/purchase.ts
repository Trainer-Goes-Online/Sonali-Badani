import { buildHashedFields } from './meta-capi';
import { toMeta, currentUserData } from './events';
import { isProductionBrowser } from './production-gate';
import {
  emptyLead,
  readCachedLead,
  mergeCachedLead,
  resolveFbIdentifiers,
  fetchClientIp,
  newLeadId,
} from './tracking';

/**
 * Post purchase dispatch, fired once from /welcome-reset and /welcome-reset-plus.
 *
 * WHY IT LIVES IN THE BROWSER. TagMango's "New Order" trigger on Pabbly is gated
 * behind their Pro Plus plan, so there is no server to server signal telling us a
 * payment succeeded. The landing page after checkout is the only moment we hear
 * about the sale at all.
 *
 * WHAT THAT COSTS, stated plainly: the page cannot verify that money moved. A
 * reload, a shared link or a team member opening the URL is indistinguishable
 * from a buyer. Three defences below reduce that to something small, but only a
 * server to server webhook removes it, so this should be revisited if the plan
 * is ever upgraded.
 *
 *   1. REGISTRATION GATE. Nothing fires unless a cached lead with an email
 *      exists. Someone who never went through the funnel has no cache, so the
 *      team opening either page to check it fires nothing at all. This is also
 *      the honest gate: without an email there is no external_id and no match
 *      key, so the row and the Meta event would both be worthless anyway.
 *
 *   2. LOCAL DEDUPE. The purchase id is written to localStorage the instant it
 *      is claimed, before any network call. A reload, a back button, or React
 *      re-mounting in Strict Mode all find the claim and stop.
 *
 *   3. META DEDUPE. `event_id` is deterministic, derived from the purchase id
 *      minted when she clicked through to checkout. Even if the same event were
 *      sent twice from two devices, Meta collapses matching
 *      event_name + event_id for 48 hours.
 *
 * Pabbly should still carry its own duplicate filter on email. These defences
 * are layered, not alternatives.
 */

const PABBLY_WEBHOOK_URL = process.env.NEXT_PUBLIC_PABBLY_WEBHOOK_URL;

/** localStorage key holding the purchase ids already dispatched, most recent last. */
const FIRED_KEY = 'FUNNEL_PURCHASE_FIRED';

/** How many past purchase ids to remember. Small: one buyer, maybe two products. */
const FIRED_MAX = 10;

function readFired(): string[] {
  try {
    const raw = localStorage.getItem(FIRED_KEY);
    const list = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(list) ? list.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function claimFired(id: string): boolean {
  const fired = readFired();
  if (fired.includes(id)) return false;
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify([...fired, id].slice(-FIRED_MAX)));
  } catch {
    // Private mode or quota. Better to send a possible duplicate, which Meta and
    // the Pabbly filter both absorb, than to drop a real sale.
  }
  return true;
}

/**
 * The purchase id, which is also the Meta `event_id` and the CRM's
 * `purchase_event_id`. Minted when she clicks through to checkout (see
 * UpgradeClient) so it is stable across the TagMango round trip and every
 * subsequent reload. Falls back to minting here only if that never happened.
 */
export function ensurePurchaseEventId(): string {
  const lead = readCachedLead();
  if (lead.purchase_event_id) return lead.purchase_event_id;
  const minted = `pur_${newLeadId()}`;
  mergeCachedLead({ purchase_event_id: minted });
  return minted;
}

export type PurchaseResult =
  | { fired: true; purchaseEventId: string; webhookOk: boolean }
  | { fired: false; reason: 'no-lead' | 'already-fired' | 'no-window' | 'not-production' };

/**
 * Fire Purchase and sales to Meta, then POST the full row to Pabbly.
 *
 * Order matters: Meta first, Pabbly second. A CAPI failure is logged and
 * swallowed rather than aborting, because a sale that reports late to Meta is
 * recoverable but a sale missing from the CRM is not.
 *
 * @param amount  Rupees actually paid. Taken from which page rendered, not from
 *                the cache, because the page is the one thing TagMango decided.
 */
export async function dispatchPurchase(amount: number): Promise<PurchaseResult> {
  if (typeof window === 'undefined') return { fired: false, reason: 'no-window' };

  // Production only, and checked BEFORE the localStorage claim so a preview
  // build cannot burn the claim and leave the real site unable to fire.
  if (!isProductionBrowser()) return { fired: false, reason: 'not-production' };

  const lead = readCachedLead();

  // Defence 1: no registration, no fire. This is what keeps the team's own
  // visits, and anyone who opens a shared link, out of Meta and out of the CRM.
  if (!lead.email) return { fired: false, reason: 'no-lead' };

  const purchaseEventId = ensurePurchaseEventId();

  // Defence 2: claim synchronously, before a single await, so two concurrent
  // mounts cannot both get past this line.
  if (!claimFired(purchaseEventId)) {
    return { fired: false, reason: 'already-fired' };
  }

  // Record the amount actually paid before anything can fail.
  mergeCachedLead({ amount: String(amount), purchase_event_id: purchaseEventId });

  const customData = {
    content_name: 'The One Partner Reset',
    content_type: 'product',
    currency: 'INR',
    value: amount,
  };

  // Defence 3: deterministic event ids. `sales` gets its own suffix so the two
  // events never collide with each other while each stays self-deduplicating.
  // Meta only. GA4 deliberately receives neither, per the spec.
  await Promise.all([
    toMeta('Purchase', purchaseEventId, customData),
    toMeta('sales', `${purchaseEventId}_sales`, customData),
  ]);

  const webhookOk = await postToPabbly(amount, purchaseEventId);
  return { fired: true, purchaseEventId, webhookOk };
}

/**
 * The CRM row. Every field is always present, `''` rather than omitted: a key
 * that disappears when empty silently unmaps its sheet column and shifts every
 * later row.
 *
 * Both forms of each Meta parameter are sent. The raw value drives nurturing and
 * manual work; the `<field>_sha256` hash is what any downstream Meta call needs.
 */
async function postToPabbly(amount: number, purchaseEventId: string): Promise<boolean> {
  if (!PABBLY_WEBHOOK_URL) return false;

  const lead = readCachedLead();
  const user = currentUserData();
  const { fbc, fbp } = resolveFbIdentifiers(lead.fbclid);

  // The two environment values a browser cannot know about itself. The IP comes
  // from our own route reading the real request; the user agent is read live.
  const clientIp = await fetchClientIp();
  const cleanUrl = window.location.origin + window.location.pathname;

  const base: Record<string, string> = {
    ...emptyLead(),
    ...lead,
    // Identity
    lead_id: lead.lead_id || purchaseEventId,
    created_at: lead.created_at || new Date().toISOString(),
    external_id: user.external_id,
    purchase_event_id: purchaseEventId,
    // The sale
    amount: String(amount),
    currency: 'INR',
    // Meta match keys, resolved live rather than trusted from the cache
    fbc: fbc || lead.fbc || '',
    fbp: fbp || lead.fbp || '',
    client_ip_address: clientIp,
    client_user_agent: navigator.userAgent,
    event_source_url: cleanUrl,
    is_test: lead.is_test || '',
  };

  const hashed = await buildHashedFields(base);

  const ok = await post({ ...base, ...hashed });
  if (!ok) {
    // Release the claim so the next load of this page retries. The Pabbly
    // duplicate filter on email is the backstop if it half landed.
    releaseClaim(purchaseEventId);
  }
  return ok;
}

function releaseClaim(id: string) {
  try {
    localStorage.setItem(
      FIRED_KEY,
      JSON.stringify(readFired().filter((v) => v !== id))
    );
  } catch {
    /* nothing more we can do */
  }
}

async function post(payload: unknown): Promise<boolean> {
  try {
    const res = await fetch(PABBLY_WEBHOOK_URL as string, {
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
