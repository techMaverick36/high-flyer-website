import { Helmet } from 'react-helmet-async'
import type { Product } from '../utils/types'
import { SITE_ORIGIN, categoryPath } from '../utils/site'

interface CategorySchemaProps {
  slug: string
  label: string
  products: Product[]
}

/**
 * BreadcrumbList + ItemList JSON-LD for a category landing page.
 *
 * The ItemList only carries product URLs (a "summary page" list), which is
 * what Google expects for category pages — full Product markup belongs on
 * the product pages themselves.
 */
export default function CategorySchema({ slug, label, products }: CategorySchemaProps) {
  const url = `${SITE_ORIGIN}${categoryPath(slug)}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/home` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_ORIGIN}/` },
      { '@type': 'ListItem', position: 3, name: label, item: url },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: label,
    url,
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_ORIGIN}/product/${p.slug}`,
    })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      {products.length > 0 && (
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      )}
    </Helmet>
  )
}
