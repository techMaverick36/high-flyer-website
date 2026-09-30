/**
 * Customer-facing policy facts, confirmed by the business. The Delivery,
 * Returns and FAQ pages all read from here so they can never contradict
 * each other — change a policy here, not in the page copy.
 */
export const policies = {
  delivery: {
    area: 'Kampala, the rest of Uganda, and across East Africa',
    fees: 'Delivery fees depend on the destination and the size of the item. We confirm the exact fee with you before your order is dispatched.',
    timing: 'Delivery dates are agreed with you when we confirm your order, based on your location and the items ordered.',
  },
  returns: {
    days: 7,
    /** ISO country codes the return policy applies to, for Google's
     *  MerchantReturnPolicy markup. Add others (e.g. 'KE', 'TZ', 'RW')
     *  if the same policy applies to customers there. */
    countries: ['UG'],
    conditions: ['The item is unused', 'It is returned in its original packaging'],
  },
  payment: {
    methods: [
      { name: 'Cash on delivery', detail: 'Pay in cash when your order arrives.' },
      { name: 'Mobile Money', detail: 'Pay by Mobile Money — we share the payment details when confirming your order.' },
      { name: 'Bank transfer (EFT)', detail: 'Pay by electronic funds transfer — account details are shared on confirmation.' },
      { name: 'At the showroom', detail: 'Pay in person at our Aponye Shopping Centre showroom.' },
    ],
  },
} as const

/** Help pages, in the order they appear in the side menu and footer. */
export const helpPages = [
  { path: '/delivery', label: 'Delivery & Payment' },
  { path: '/returns', label: 'Returns & Warranty' },
  { path: '/faq', label: 'FAQ' },
] as const
