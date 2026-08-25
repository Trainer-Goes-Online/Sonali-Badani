/**
 * Production gate.
 *
 * Meta events and both Pabbly webhooks fire ONLY on the real site. Everywhere
 * else, and that means localhost, every Vercel preview deployment, and any
 * staging domain, they are skipped entirely.
 *
 * Without this, a developer clicking through the funnel, or a preview build
 * opened to review copy, writes junk rows into the CRM and poisons the pixel's
 * learning with conversions that never happened. Those events cannot be
 * retracted once Meta has them.
 *
 * The allowed hosts are configurable so the domain is not welded into the code:
 *
 *   NEXT_PUBLIC_PRODUCTION_HOSTS="www.sonalibadani.com,sonalibadani.com"
 *
 * The apex is included by default alongside the canonical www, so a woman who
 * somehow lands on the bare domain is still counted.
 */

const DEFAULT_HOSTS = ['www.sonalibadani.com', 'sonalibadani.com'];

/** The hosts on which tracking is allowed to fire, lowercased and portless. */
export function productionHosts(): string[] {
  const configured = (process.env.NEXT_PUBLIC_PRODUCTION_HOSTS || '')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return configured.length > 0 ? configured : DEFAULT_HOSTS;
}

/** True when `hostname` is one of the production hosts. Port is ignored. */
export function isProductionHost(hostname: string | null | undefined): boolean {
  if (!hostname) return false;
  // Strip any port, and the brackets an IPv6 authority carries.
  const host = hostname.trim().toLowerCase().replace(/:\d+$/, '').replace(/^\[|\]$/g, '');
  return productionHosts().includes(host);
}

/**
 * Browser-side check. Used to suppress Meta events and both webhooks on
 * localhost and preview builds before a single request leaves the page.
 */
export function isProductionBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  return isProductionHost(window.location.hostname);
}
