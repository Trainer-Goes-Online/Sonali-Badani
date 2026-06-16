/**
 * Meta Conversions API hashing helpers.
 *
 * Meta requires SHA-256 (lowercase hex) for the customer-information parameters
 * it marks "Hashed": email, phone, first name, surname, town/city, country. For
 * each of those we send BOTH versions to Pabbly:
 *   - the raw value            -> nurturing sequences / manual use
 *   - the `<field>_sha256` hash -> forwarded to Meta CAPI
 *
 * Fields Meta marks "no hash required" (IP, user agent, fbp, fbc, external_id)
 * and everything else (UTMs, lead_id, amount, order_id, ...) stay raw.
 */

/** SHA-256 of a string as lowercase hex (Web Crypto, available in the browser). */
export async function sha256Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Normalise the hashed parameters per Meta's rules, then SHA-256 each. Returns
 * `{ email_sha256, phone_sha256, first_name_sha256, last_name_sha256,
 *    city_sha256, country_sha256 }`. An empty source value stays '' (we never
 * hash an empty string, which would otherwise produce a misleading constant).
 */
export async function buildHashedFields(lead: Record<string, string>) {
  const digits = (s: string | undefined) => (s || '').replace(/\D/g, '');
  // Phone for Meta = country calling code + national number, digits only.
  const normalized: Record<string, string> = {
    email: (lead.email || '').trim().toLowerCase(),
    first_name: (lead.first_name || '').trim().toLowerCase(),
    last_name: (lead.last_name || '').trim().toLowerCase(),
    city: (lead.city || '').trim().toLowerCase().replace(/\s+/g, ''),
    country: (lead.country || '').trim().toLowerCase(),
    phone: digits(lead.country_code) + digits(lead.phone),
  };

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(normalized)) {
    out[`${key}_sha256`] = value ? await sha256Hex(value) : '';
  }
  return out;
}
