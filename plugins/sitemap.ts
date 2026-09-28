import type { Plugin } from 'vite'
import { createClient } from '@sanity/client'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { SITE_ORIGIN, STATIC_ROUTES, escapeXml } from '../src/utils/site'

interface Route {
  path: string
  priority: string
  changefreq: string
}

/**
 * Set to true to let the build succeed with a products-less sitemap when
 * Sanity is unreachable. Left false on purpose: a sitemap that silently
 * drops every product page is worse than a failed build, because it looks
 * fine and quietly removes the catalogue from search results.
 */
const ALLOW_SITEMAP_WITHOUT_PRODUCTS = false

export function sitemapPlugin(): Plugin {
  return {
    name: 'vite-plugin-sitemap',
    apply: 'build',
    async closeBundle() {
      const client = createClient({
        projectId: 'cbvvi9ba',
        dataset: 'production',
        apiVersion: '2024-01-01',
        useCdn: true,
      })

      let productRoutes: Route[] = []
      try {
        const slugs: string[] = await client.fetch(
          `*[_type == "product" && defined(slug.current)][].slug.current`
        )

        productRoutes = slugs
          // A blank slug would emit a bare /product/ URL that 404s.
          .filter((slug) => typeof slug === 'string' && slug.trim() !== '')
          .map((slug) => ({
            path: `/product/${slug.trim()}`,
            priority: '0.8',
            changefreq: 'weekly',
          }))

        console.log(`[sitemap] Fetched ${productRoutes.length} product slug(s) from Sanity`)
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        if (!ALLOW_SITEMAP_WITHOUT_PRODUCTS) {
          throw new Error(
            `[sitemap] Could not fetch product slugs from Sanity: ${message}\n` +
              'Refusing to write a sitemap with no product URLs. Fix the connection, ' +
              'or set ALLOW_SITEMAP_WITHOUT_PRODUCTS = true in plugins/sitemap.ts.'
          )
        }
        console.warn(`[sitemap] Could not fetch product slugs from Sanity: ${message}`)
      }

      if (productRoutes.length === 0 && !ALLOW_SITEMAP_WITHOUT_PRODUCTS) {
        throw new Error(
          '[sitemap] Sanity returned no product slugs. Refusing to write a sitemap ' +
            'with no product URLs. Set ALLOW_SITEMAP_WITHOUT_PRODUCTS = true in ' +
            'plugins/sitemap.ts if this is expected.'
        )
      }

      const today = new Date().toISOString().split('T')[0]
      const allRoutes: Route[] = [...STATIC_ROUTES, ...productRoutes]

      // Duplicate <loc> values are a validation error; keep the first of each.
      const seen = new Set<string>()
      const uniqueRoutes = allRoutes.filter((r) => {
        if (seen.has(r.path)) return false
        seen.add(r.path)
        return true
      })

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...uniqueRoutes.map((r) =>
          [
            '  <url>',
            `    <loc>${escapeXml(SITE_ORIGIN + r.path)}</loc>`,
            `    <lastmod>${today}</lastmod>`,
            `    <changefreq>${r.changefreq}</changefreq>`,
            `    <priority>${r.priority}</priority>`,
            '  </url>',
          ].join('\n')
        ),
        '</urlset>',
        '',
      ].join('\n')

      writeFileSync(resolve('dist/sitemap.xml'), xml, 'utf-8')
      console.log(
        `[sitemap] Generated sitemap with ${uniqueRoutes.length} URL(s) → dist/sitemap.xml`
      )
    },
  }
}
