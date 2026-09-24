/**
 * Site suspension switch.
 *
 * When `suspended` is true, App.tsx renders the notice page instead of the
 * whole application — every URL, including deep links, shows the notice.
 * Nothing else in the site is modified, so flipping this back to false
 * restores everything exactly as it was.
 *
 * To restore the site: set `suspended` to false and redeploy.
 */
export interface SiteStatusConfig {
  /** Master switch. false = site behaves normally. */
  suspended: boolean
  headline: string
  /** Neutral, customer-facing explanation. */
  message: string
  /**
   * Whether to publicly state the billing reason. Set false to show only
   * `message` and keep the dispute off the public page.
   */
  showReason: boolean
  reason: string
}

export const siteStatus: SiteStatusConfig = {
  suspended: true,

  headline: 'This site is temporarily unavailable',

  message:
    'The High Flyer Trading CO LTD website has been taken offline temporarily and is not currently accepting orders.',

  showReason: true,
  reason:
    'The site has been suspended by its developer pending settlement of an outstanding balance for completed work. It will be restored as soon as the account is settled.',
}
