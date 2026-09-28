import { Helmet } from 'react-helmet-async'
import { SITE_ORIGIN } from '../utils/site'

/** Re-exported for existing callers; the value lives in utils/site.ts so the
 *  sitemap generator and these canonical tags share one origin. */
export const SITE_BASE_URL = SITE_ORIGIN
const SITE_NAME = 'High Flyer Trading CO LTD'
const DEFAULT_DESC =
  "Uganda's most trusted home appliance showroom. Genuine products, expert advice, and reliable after-sales service. Visit us at Aponye Shopping Centre, Kampala."
const DEFAULT_IMG = `${SITE_BASE_URL}/home1.jpg`

interface SEOProps {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: 'website' | 'product'
  noIndex?: boolean
}

export default function SEO({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMG,
  path = '',
  type = 'website',
  noIndex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Premium Home Appliances in Uganda`
  const canonical = `${SITE_BASE_URL}${path}`
  const ogImage = image.startsWith('http') ? image : `${SITE_BASE_URL}${image}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="en_UG" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
