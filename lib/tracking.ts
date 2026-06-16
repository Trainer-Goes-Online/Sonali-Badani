/**
 * Funnel tracking contract.
 *
 * The fields below ride along the landing URL (e.g. from a Facebook ad), get
 * cached in localStorage on the landing page, and survive the TagMango checkout
 * hop (which strips custom params) so the Welcome page can forward them to the
 * Pabbly webhook. Kept here as the single source of truth so the 23 field names
 * are never duplicated across the capture (landing) and dispatch (welcome) steps.
 */
export const TRACKING_FIELDS = [
  'lead_id',
  'created_at',
  'first_name',
  'last_name',
  'email',
  'phone',
  'city',
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

/**
 * Contact fields the buyer enters at the TagMango checkout. TagMango appends
 * these to the post-payment redirect, so on the Welcome page their redirect
 * values take precedence over anything cached on the landing page. TagMango
 * exposes a single full `name` (split into first_name/last_name on Welcome),
 * so only email/phone/city map one-to-one here.
 */
export const CHECKOUT_FIELDS = ['email', 'phone', 'city'] as const;

/** localStorage key holding the captured lead data between funnel steps. */
export const FUNNEL_STORAGE_KEY = 'FUNNEL_LEAD_DATA';

/** Shape of the cached lead: every tracking field mapped to its string value. */
export type FunnelLeadData = Record<(typeof TRACKING_FIELDS)[number], string>;
