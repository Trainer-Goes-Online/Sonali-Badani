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
    product: '/Section-Images/section-image9.png',
    addon: '/Solani Bonuses/visualization.jpeg',
  },
  /**
   * Prefill the TagMango checkout from the details captured at registration, so
   * the buyer never retypes them. `keys` are the query-param names TagMango's
   * checkout reads. Verify against a real TagMango checkout and adjust here if
   * the fields do not populate (only this block needs changing).
   */
  prefill: {
    enabled: true,
    keys: {
      name: 'name',
      email: 'email',
      phone: 'phone',
      countryCode: 'country_code',
      city: 'city',
    },
  },
} as const;

export function otoTotalRupees(withAddon: boolean) {
  const { productRupees, addonRupees } = OTO_CONFIG.pricing;
  return productRupees + (withAddon ? addonRupees : 0);
}
