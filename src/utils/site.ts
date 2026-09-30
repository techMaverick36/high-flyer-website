/**
 * Canonical origin for the live site — the single source of truth.
 *
 * Imported by the SEO component (canonical + Open Graph tags) and by the
 * build-time sitemap generator, so those can never disagree. A mismatch
 * between sitemap URLs and canonical tags is a common cause of Search
 * Console dropping pages.
 *
 * No trailing slash: paths are appended directly.
 */
export const SITE_ORIGIN = 'https://highflyertadingltd.com'

/**
 * Routes that exist as real pages, in the order they matter for crawling.
 * Must stay in sync with the <Routes> in src/App.tsx.
 *
 * `/cart` is deliberately excluded — robots.txt disallows it. Category and
 * product pages are added by the sitemap plugin from Sanity.
 */
export const STATIC_ROUTES: {
  path: string
  priority: string
  changefreq: string
}[] = [
  // The shop is the site root.
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/home', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/delivery', priority: '0.5', changefreq: 'monthly' },
  { path: '/returns', priority: '0.5', changefreq: 'monthly' },
]

/** Path of a category landing page. Links, schema and the sitemap all use it. */
export const categoryPath = (slug: string): string => `/category/${slug}`

/** Escapes the five characters that are not legal raw inside XML text. */
export const escapeXml = (value: string): string =>
  value.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      default:
        return '&apos;'
    }
  })
