/**
 * Resized, modern-format URLs for Sanity CDN images.
 *
 * Sanity serves the original upload by default (often 1–3 MB PNG/JPG at
 * 1500px+). On Ugandan mobile data that is the single biggest cost of a page,
 * so every Sanity image is requested at the size it's displayed:
 *  - w        target width in px
 *  - auto     WebP/AVIF when the browser supports it
 *  - fit=max  never upscale small originals
 *
 * Non-Sanity URLs (local /public files) are returned unchanged.
 */
const SANITY_CDN = 'https://cdn.sanity.io/images/'

const isSanity = (url: string | undefined): url is string =>
  typeof url === 'string' && url.startsWith(SANITY_CDN)

export function sanityImg(url: string | undefined, width: number, quality = 75): string | undefined {
  if (!isSanity(url)) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}w=${width}&q=${quality}&auto=format&fit=max`
}

/** `srcSet` so the browser picks the smallest copy that is still sharp. */
export function sanitySrcSet(url: string | undefined, widths: number[]): string | undefined {
  if (!isSanity(url)) return undefined
  return widths.map((w) => `${sanityImg(url, w)} ${w}w`).join(', ')
}
