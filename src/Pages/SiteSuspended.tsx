import { Helmet } from 'react-helmet-async'
import { Wrench } from 'lucide-react'
import { siteStatus } from '../utils/siteStatus'

/**
 * Shown in place of the entire app while `siteStatus.suspended` is true.
 * Deliberately self-contained — no header, footer, router or data fetching —
 * so it renders even if the CMS or any other dependency is unreachable.
 */
export default function SiteSuspended() {
  const { headline, message, showReason, reason } = siteStatus

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-5 py-16">
      <Helmet>
        <title>Temporarily Unavailable | High Flyer Trading CO LTD</title>
        {/* Keeps the notice out of search results so it can't replace the real
            listings while the site is down. */}
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="This site is temporarily unavailable." />
      </Helmet>

      <main className="card bg-white w-full max-w-xl p-8 md:p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-7">
          <Wrench size={28} className="text-slate-400" aria-hidden="true" />
        </div>

        <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-900 leading-tight mb-4">
          {headline}
        </h1>

        <p className="text-slate-600 leading-relaxed">{message}</p>

        {showReason && (
          <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 border border-slate-100 rounded-xl p-4 mt-6 text-left">
            {reason}
          </p>
        )}
      </main>
    </div>
  )
}
