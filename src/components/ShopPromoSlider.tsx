import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
  Shield,
  Star,
  Home,
} from 'lucide-react'
import type { Product } from '../utils/types'
import { formatPrice, getDiscountPercent } from '../utils'
import { useCartStore } from '../store/Cartstore'
import { shopPromoConfig, type SlideKind } from '../utils/promo'
import clsx from 'clsx'

interface Slide {
  product: Product
  kind: SlideKind
  discount: number
}

interface ShopPromoSliderProps {
  products: Product[]
  isLoading?: boolean
}

const hasRealDiscount = (p: Product) =>
  typeof p.originalPrice === 'number' && p.originalPrice > p.price

/** Builds the slide list from real product data per the configured mode. */
function buildSlides(products: Product[]): Slide[] {
  const { mode, maxSlides } = shopPromoConfig
  if (mode === 'off') return []

  const inStock = products.filter((p) => p.inStock && p.images?.[0]?.url)

  // Best discount first — the strongest offer leads.
  const promotions = inStock
    .filter(hasRealDiscount)
    .sort(
      (a, b) =>
        getDiscountPercent(b.originalPrice!, b.price) -
        getDiscountPercent(a.originalPrice!, a.price)
    )

  const featured = inStock.filter((p) => p.featured)

  const newest = [...inStock].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  let pool: Product[]
  switch (mode) {
    case 'promotions':
      pool = promotions
      break
    case 'featured':
      pool = featured
      break
    case 'newest':
      pool = newest
      break
    case 'auto':
    default:
      // Fall through the tiers so the slider is never empty.
      pool = promotions.length ? promotions : featured.length ? featured : newest
  }

  return pool.slice(0, maxSlides).map((product) => ({
    product,
    // Kind is decided per slide, so a discounted product still reads as an
    // offer even when the pool came from the featured tier.
    kind: hasRealDiscount(product)
      ? 'promotion'
      : product.featured
      ? 'featured'
      : 'newest',
    discount: hasRealDiscount(product)
      ? getDiscountPercent(product.originalPrice!, product.price)
      : 0,
  }))
}

export default function ShopPromoSlider({ products, isLoading }: ShopPromoSliderProps) {
  const [rawIndex, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  // Tracks WHICH product was added rather than a boolean, so moving to another
  // slide clears the confirmation on its own — no effect needed to reset it.
  const [addedId, setAddedId] = useState<string | null>(null)
  const { addItem, openCart } = useCartStore()

  const slides = useMemo(() => buildSlides(products), [products])
  const count = slides.length

  // Derived, not synced — stays valid when the product list changes underneath.
  const index = count === 0 ? 0 : rawIndex % count

  const go = useCallback(
    (delta: number) => setIndex((i) => (count === 0 ? 0 : (i + delta + count) % count)),
    [count]
  )

  const { autoplayMs } = shopPromoConfig
  useEffect(() => {
    if (count <= 1 || paused || autoplayMs <= 0) return
    // Respect the OS reduce-motion setting (WCAG 2.2.2 also wants the pause
    // affordance, which hover/focus below provides).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(() => go(1), autoplayMs)
    return () => clearInterval(timer)
  }, [count, paused, autoplayMs, go])

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-[#152033] h-[420px] md:h-[300px] animate-pulse" />
    )
  }

  if (count === 0) return null

  const slide = slides[index]
  const { product, kind, discount } = slide
  const image = product.images?.[0]

  const added = addedId === product.id

  const handleAdd = () => {
    addItem(product)
    setAddedId(product.id)
    openCart()
  }

  const eyebrow = shopPromoConfig.labels[kind]

  return (
    <section
      className="relative rounded-2xl bg-[#152033] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Highlighted products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Soft brand glow instead of a stretched photo backdrop */}
      <div className="absolute -top-24 -right-16 w-80 h-80 rounded-full bg-brand-teal/20 blur-3xl pointer-events-none" />

      <div
        className="relative grid md:grid-cols-[300px_1fr] lg:grid-cols-[340px_1fr] gap-6 md:gap-8 p-5 md:p-7"
        aria-live="polite"
      >
        {/* ── Image tile: contained, never stretched or cropped ── */}
        <Link
          to={`/product/${product.slug}`}
          className="group relative block rounded-xl bg-white overflow-hidden aspect-4/3 md:aspect-auto md:min-h-[240px]"
        >
          {image?.url ? (
            <img
              src={image.url}
              alt={image.alt || product.name}
              // object-contain + padding keeps the appliance whole and
              // correctly proportioned whatever the source crop is.
              className="absolute inset-0 w-full h-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]"
              loading="eager"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
              <Home size={40} className="text-slate-300" />
            </div>
          )}

          {discount > 0 && (
            <span className="absolute top-3 left-3 rounded-md bg-red-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white shadow-sm">
              Save {discount}%
            </span>
          )}
        </Link>

        {/* ── Details: fills the remaining width ── */}
        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span
              className={clsx(
                'rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider',
                kind === 'promotion'
                  ? 'bg-brand-orange text-white'
                  : 'bg-white/10 text-teal-300'
              )}
            >
              {eyebrow}
            </span>
            {product.badge && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {product.badge}
              </span>
            )}
            {product.rating > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
                <Star size={12} className="text-amber-400" fill="currentColor" strokeWidth={0} />
                {product.rating.toFixed(1)}
              </span>
            )}
          </div>

          <h2 className="font-display font-bold text-white text-2xl lg:text-3xl leading-tight mb-2 line-clamp-2">
            <Link to={`/product/${product.slug}`} className="hover:text-teal-300 transition-colors">
              {product.name}
            </Link>
          </h2>

          {product.shortDescription && (
            <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4 max-w-xl">
              {product.shortDescription}
            </p>
          )}

          <div className="flex items-baseline gap-3 flex-wrap mb-5">
            <span className="font-display font-bold text-teal-300 text-2xl lg:text-3xl tabular-nums">
              {formatPrice(product.price)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-slate-400 line-through tabular-nums">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
            <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Shield size={13} className="text-teal-300" />
              {product.warranty || '1 Year Warranty'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAdd}
              className={clsx(
                'btn px-5 py-2.5 text-sm gap-2 transition-all',
                added ? 'bg-green-500 text-white' : 'btn-primary'
              )}
            >
              {added ? <Check size={16} strokeWidth={3} /> : <ShoppingCart size={16} />}
              {added ? 'Added to cart' : 'Add to Cart'}
            </button>
            <Link
              to={`/product/${product.slug}`}
              className="btn px-5 py-2.5 text-sm gap-2 bg-white/10 text-white border border-white/20 hover:bg-white/18 group"
            >
              View details
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Controls ── */}
      {count > 1 && (
        <div className="relative flex items-center justify-between gap-4 px-5 md:px-7 pb-5">
          <div className="flex gap-2" role="tablist" aria-label="Choose slide">
            {slides.map((s, i) => (
              <button
                key={s.product.id}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show ${s.product.name}`}
                onClick={() => setIndex(i)}
                className={clsx(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index ? 'w-7 bg-teal-300' : 'w-2.5 bg-white/25 hover:bg-white/40'
                )}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tabular-nums text-slate-400 mr-1">
              {index + 1} / {count}
            </span>
            <button
              onClick={() => go(-1)}
              aria-label="Previous product"
              className="w-9 h-9 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next product"
              className="w-9 h-9 rounded-lg bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
