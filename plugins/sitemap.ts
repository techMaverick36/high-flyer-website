import type { Plugin } from 'vite'
import { createClient } from '@sanity/client'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

const BASE_URL = 'https://highflyertrading.co.ug'

const STATIC_ROUTES = [
  { path: '/',        priority: '1.0', changefreq: 'weekly'  },
  { path: '/shop',    priority: '0.9', changefreq: 'daily'   },
  { path: '/about',   priority: '0.7', changefreq: 'monthly' },
  { path: '/contact', priority: '0.6', changefreq: 'monthly' },
]

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

      let productRoutes: { path: string; priority: string; changefreq: string }[] = []
      try {
        const slugs: string[] = await client.fetch(
          `*[_type == "product" && defined(slug.current)][].slug.current`
        )
        productRoutes = slugs.map((slug) => ({
          path: `/product/${slug}`,
          priority: '0.8',
          changefreq: 'weekly',
        }))
        console.log(`[sitemap] Fetched ${slugs.length} product slug(s) from Sanity`)
      } catch (err) {
        console.warn('[sitemap] Could not fetch product slugs from Sanity:', err)
      }

      const today = new Date().toISOString().split('T')[0]
      const allRoutes = [...STATIC_ROUTES, ...productRoutes]

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...allRoutes.map(
          (r) =>
            `  <url>\n    <loc>${BASE_URL}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
        ),
        '</urlset>',
      ].join('\n')

      writeFileSync(resolve('dist/sitemap.xml'), xml, 'utf-8')
      console.log(`[sitemap] Generated sitemap with ${allRoutes.length} URL(s) → dist/sitemap.xml`)
    },
  }
}
