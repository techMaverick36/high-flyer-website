import { Helmet } from 'react-helmet-async'
import type { Product } from '../utils/types'
import { SITE_ORIGIN, categoryPath } from '../utils/site'
import { policies } from '../utils/policies'

interface ProductSchemaProps {
  product: Product
}

/**
 * Product + BreadcrumbList JSON-LD for a product detail page.
 *
 * Drives price, availability and star ratings in Google results. Everything
 * here comes from Sanity — nothing is invented, and optional blocks are
 * omitted entirely when the underlying data is missing, because emitting an
 * empty or zeroed `aggregateRating` is a structured-data violation rather
 * than a harmless no-op.
 */
export default function ProductSchema({ product }: ProductSchemaProps) {
  const url = `${SITE_ORIGIN}/product/${product.slug}`

  const images = (product.images ?? [])
    .map((img) => img?.url)
    .filter((u): u is string => typeof u === 'string' && u.length > 0)

  const productSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    url,
    ...(images.length > 0 && { image: images }),
    ...(product.shortDescription && { description: product.shortDescription }),
    // Slug is stable and unique — a usable merchant identifier.
    sku: product.slug,
    ...(product.category?.title && {
      category: product.category.title,
    }),
    // Brand and model number are Google's "global identifiers" — only
    // emitted when entered in Sanity, never guessed from the product name.
    ...(product.brand?.trim() && {
      brand: { '@type': 'Brand', name: product.brand.trim() },
    }),
    ...(product.model?.trim() && { mpn: product.model.trim() }),
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'UGX',
      price: product.price,
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'High Flyer Trading CO LTD',
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: policies.returns.countries,
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: policies.returns.days,
        // Only unused items in original packaging are accepted back.
        itemCondition: 'https://schema.org/NewCondition',
        refundType: ['https://schema.org/FullRefund', 'https://schema.org/ExchangeRefund'],
      },
      // No shippingDetails: fees are quoted per order, and Google's
      // shippingRate needs a fixed amount — a made-up rate would be worse
      // than the "missing field" suggestion.
    },
  }

  // Google rejects an aggregateRating without at least one review, so this
  // block appears only when both numbers are real.
  if (product.rating > 0 && product.reviewCount > 0) {
    productSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Home › Shop › Category › Product, skipping the category if it's missing.
  const crumbs: { name: string; item: string }[] = [
    { name: 'Home', item: `${SITE_ORIGIN}/home` },
    { name: 'Shop', item: `${SITE_ORIGIN}/` },
  ]
  if (product.category?.slug && product.category.title) {
    crumbs.push({
      name: product.category.title,
      item: `${SITE_ORIGIN}${categoryPath(product.category.slug)}`,
    })
  }
  crumbs.push({ name: product.name, item: url })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(productSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
    </Helmet>
  )
}
