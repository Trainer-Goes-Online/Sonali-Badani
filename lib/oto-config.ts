/**
 * One-Time Offer (OTO) page configuration.
 *
 * The OTO presents one product with one optional add-on. Where the buyer lands
 * depends only on whether the add-on is kept:
 *   - The One Partner Reset only     ->  productOnly        (link 1)
 *   - The Reset + the Visualization  ->  productPlusAddon   (link 2)
 *
 * Both links come from the environment so they can be swapped without a code
 * change, matching how the prices are handled:
 *   NEXT_PUBLIC_OTO_LINK_PRODUCT_ONLY
 *   NEXT_PUBLIC_OTO_LINK_PRODUCT_ADDON
 *
 * After a successful payment TagMango redirects the buyer to /welcome-reset,
 * which is where the post-purchase webhook fires.
 */
import { COURSE_PRICE_RUPEES, VISUALIZATION_PRICE_RUPEES } from './pricing';

function link(value: string | undefined, fallback: string): string {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : fallback;
}

export const OTO_CONFIG = {
  links: {
    /** link 1 — buyer chose the Reset only. */
    productOnly: link(
      process.env.NEXT_PUBLIC_OTO_LINK_PRODUCT_ONLY,
      'https://coaching.sonalibadani.com/l/4d9bdfcd60'
    ),
    /** link 2 — buyer chose the Reset plus the Visualization. */
    productPlusAddon: link(
      process.env.NEXT_PUBLIC_OTO_LINK_PRODUCT_ADDON,
      'https://coaching.sonalibadani.com/l/c8bde5394b'
    ),
  },
  /**
   * The add-on starts UNSELECTED. She opts in deliberately rather than opting
   * out of something that was ticked for her, which is the same trust rule that
   * governs the decline button on this page.
   */
  addonDefaultSelected: false,
  pricing: {
    productRupees: COURSE_PRICE_RUPEES,
    addonRupees: VISUALIZATION_PRICE_RUPEES,
  },
  images: {
    /**
     * The header creative on /masterclass/upgrade: Sonali with the full
     * product suite and the price badge.
     *
     * Served as the WebP built by scripts/optimize-image.js, not the 2.1 MB
     * PNG export it came from. The page loads this one eagerly, so its weight
     * is felt directly. Re-run that script if the artwork is ever replaced.
     */
    hero: '/Section-Images/sonali-new-oto-image.webp',
    product: '/Section-Images/section-image9.png',
    addon: '/Solani Bonuses/visualization.jpeg',
  },
  /**
   * Prefill the TagMango checkout from the details captured at registration, so
   * the buyer never retypes them.
   *
   * Only `name`, `email` and `phone` work. Verified against the live checkout:
   * TagMango reads exactly those three from the URL. There is deliberately no
   * `city` key, because City is one of TagMango's CUSTOM fields, and no custom
   * field is prefillable from a query string by any spelling. See
   * docs/TAGMANGO-ATTRIBUTION-AUDIT.md. She types City at the checkout instead.
   */
  prefill: {
    enabled: true,
    keys: {
      name: 'name',
      email: 'email',
      phone: 'phone',
      countryCode: 'country_code',
    },
  },
} as const;

export function otoTotalRupees(withAddon: boolean) {
  const { productRupees, addonRupees } = OTO_CONFIG.pricing;
  return productRupees + (withAddon ? addonRupees : 0);
}
