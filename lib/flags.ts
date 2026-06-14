/**
 * Launch flags. Per the build spec these are A/B tests wired in from day one
 * but switched centrally. Flip these constants (or later read them from an
 * experiment service) to change what renders. Version B is the launch target.
 */

// Hero headline. 'A' = pain control, 'B' = Sonali's relief + pattern line.
export const HEADLINE_VARIANT: 'A' | 'B' = 'B';

// Offer block. 'B' = grouped tiers (launch). 'A' = itemised value-stack table.
export const OFFER_VARIANT: 'A' | 'B' = 'B';

// Section 11 "Who this is for" is optional per spec — include if true.
export const SHOW_WHO_FOR = true;
