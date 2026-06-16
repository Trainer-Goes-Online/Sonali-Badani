/**
 * One-Time Offer (OTO) page configuration.
 *
 * The OTO presents the main product with an optional add-on. Where the buyer
 * lands depends only on whether the add-on is selected:
 *   - main product ONLY  ->  productOnly        (link 1)
 *   - main product + add-on -> productPlusAddon (link 2)
 *
 * ▼▼▼  REPLACE THE TWO PLACEHOLDER URLS BELOW WITH YOUR REAL LINKS  ▼▼▼
 */
export const OTO_CONFIG = {
  links: {
    /** link 1 — buyer chose the main product only. */
    productOnly: 'https://coaching.sonalibadani.com/l/4d9bdfcd60',
    /** link 2 — buyer chose the main product + the companion. */
    productPlusAddon: 'https://coaching.sonalibadani.com/l/c8bde5394b',
  },
  /** Add-on is pre-selected so the recommended path is product + add-on. */
  addonDefaultSelected: true,
  pricing: {
    productRupees: 497,
    addonRupees: 199,
  },
  images: {
    product: '/Section-Images/section-image9.png',
    addon: '/Solani Bonuses/visualization.jpeg',
  },
  /**
   * Prefill the TagMango checkout from the OTO form so the buyer does not retype.
   * `keys` are the query-param names TagMango's checkout reads. These are a best
   * guess — VERIFY against a real TagMango checkout and adjust here if the fields
   * do not populate (only this block needs changing).
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
