/**
 * Shop page promo slider.
 *
 * The slider is driven by real product data, never by hand-written sale copy —
 * so it can't advertise a discount that isn't actually configured in Sanity.
 *
 *   - A slide is a PROMOTION when the product has an `originalPrice` higher
 *     than its `price`. The discount percentage is computed from those two
 *     numbers, so it is always truthful.
 *   - A slide is FEATURED when the product is flagged `featured` in Sanity.
 *   - Otherwise the newest in-stock products are used, so the slider is never
 *     empty and the shop page never looks blank.
 *
 * To run a sale: set `originalPrice` on the relevant products in Sanity. To
 * curate the slider by hand instead: set `mode: 'featured'` and tick the
 * `featured` flag on the products you want.
 */
export type PromoMode = 'auto' | 'promotions' | 'featured' | 'newest' | 'off'

export interface ShopPromoConfig {
  /**
   * 'auto'       — promotions if any exist, else featured, else newest
   * 'promotions' — only genuinely discounted products
   * 'featured'   — only products flagged `featured` in Sanity
   * 'newest'     — most recently added products
   * 'off'        — hide the slider entirely
   */
  mode: PromoMode
  /** How many slides at most. Keep small — this sits above the product grid. */
  maxSlides: number
  /** Autoplay interval in ms. Set 0 to disable autoplay. */
  autoplayMs: number
  /** Eyebrow label per slide kind. */
  labels: {
    promotion: string
    featured: string
    newest: string
  }
}

export const shopPromoConfig: ShopPromoConfig = {
  mode: 'auto',
  maxSlides: 5,
  autoplayMs: 7000,
  labels: {
    promotion: 'Special Offer',
    featured: 'Featured',
    newest: 'New Arrival',
  },
}

export type SlideKind = 'promotion' | 'featured' | 'newest'
