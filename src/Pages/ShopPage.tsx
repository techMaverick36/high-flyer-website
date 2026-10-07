import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
  Check,
  ChevronRight,
} from 'lucide-react'
import { useGetAllProductsQuery, useGetAllCategoriesQuery } from '../store/api/sanityApi'
import type { FilterState, SortOption } from '../utils/types'
import ProductCard from '../components/ProductCard'
import ShopPromoSlider from '../components/ShopPromoSlider'
import SEO from '../components/SEO'
import CategorySchema from '../components/CategorySchema'
import NotFoundPage from './NotFound'
import { categoryPath } from '../utils/site'
import { sanityImg } from '../utils/image'
import clsx from 'clsx'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const MAX_PRICE = 7_000_000

/** 4 columns x 6 rows — one "page" of the infinite scroll. */
const BATCH_SIZE = 24

/** The category comes from the URL (/category/:slug), not from filter state,
 *  so each category is a real, crawlable page. */
type ShopFilters = Omit<FilterState, 'category'>

const DEFAULT_FILTERS: ShopFilters = {
  minPrice: 0,
  maxPrice: MAX_PRICE,
  inStockOnly: false,
  sort: 'newest',
  search: '',
}

export default function ShopPage() {
  const { slug } = useParams<{ slug: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [showFilters, setShowFilters] = useState(false)
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE)

  const { data: products = [], isLoading: productsLoading } = useGetAllProductsQuery()
  const {
    data: allCategories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetAllCategoriesQuery()
  const loading = productsLoading || categoriesLoading

  const activeCategory = slug ?? 'all'
  const category = slug ? allCategories.find((c) => c.id === slug) : undefined

  const [filters, setFilters] = useState<ShopFilters>(DEFAULT_FILTERS)

  // Any filter change restarts the infinite scroll from the first batch.
  const updateFilter = <K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setVisibleCount(BATCH_SIZE)
  }

  // Moving between categories reuses this component, so restart the
  // infinite scroll there too (adjusting state during render, not in an effect).
  const [prevSlug, setPrevSlug] = useState(slug)
  if (slug !== prevSlug) {
    setPrevSlug(slug)
    setVisibleCount(BATCH_SIZE)
  }

  const categoryProducts = useMemo(
    () => (slug ? products.filter((p) => p.category?.slug === slug) : products),
    [products, slug]
  )

  const filtered = useMemo(() => {
    let result = [...categoryProducts]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.shortDescription?.toLowerCase() ?? '').includes(q) ||
          (p.tags ?? []).some((t) => t?.toLowerCase().includes(q))
      )
    }

    result = result.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice
    )

    if (filters.inStockOnly) {
      result = result.filter((p) => p.inStock)
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return result
  }, [filters, categoryProducts])

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS)
    setVisibleCount(BATCH_SIZE)
    if (slug) navigate('/')
  }

  // ── Infinite scroll ──────────────────────────────────────
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const loadMore = useCallback(() => {
    setVisibleCount((c) => Math.min(c + BATCH_SIZE, filtered.length))
  }, [filtered.length])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !hasMore || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore()
      },
      // Start loading before the sentinel is actually on screen so the grid
      // keeps filling without the user hitting a visible gap.
      { rootMargin: '600px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  // Old ?category= links (bookmarks, links Google already knows) move to the
  // category's own URL.
  const legacyCategory = searchParams.get('category')
  if (!slug && legacyCategory) {
    return <Navigate to={categoryPath(legacyCategory)} replace />
  }

  // An unknown slug is a real 404, not an empty listing Google would flag as
  // a soft 404. Skipped on a fetch error so an outage doesn't 404 the catalogue.
  if (slug && !categoriesLoading && !categoriesError && !category) {
    return <NotFoundPage />
  }

  const hasActiveFilters =
    activeCategory !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < MAX_PRICE ||
    filters.inStockOnly ||
    filters.search !== ''

  // Categories with nothing in them are dead ends — keep them out of the rail.
  const visibleCategories = allCategories.filter((c) => (c.count ?? 0) > 0)

  // While categories load, fall back to a label built from the slug so the
  // title and canonical never briefly point at the shop root.
  const activeCategoryLabel =
    category?.label ??
    (slug ? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : undefined)

  const categoryRail = (
    <div className="space-y-1">
      <Link
        to="/"
        aria-current={activeCategory === 'all' ? 'page' : undefined}
        className={clsx(
          'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-between',
          activeCategory === 'all'
            ? 'bg-teal-50 text-brand-teal font-semibold'
            : 'text-slate-600 hover:bg-slate-50 font-medium'
        )}
      >
        <span>All Appliances</span>
        <span className="text-[10px] tabular-nums text-slate-400">{products.length}</span>
      </Link>

      {visibleCategories.map((cat) => (
        <Link
          key={cat.id}
          to={categoryPath(cat.id)}
          aria-current={activeCategory === cat.id ? 'page' : undefined}
          className={clsx(
            'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3',
            activeCategory === cat.id
              ? 'bg-teal-50 text-brand-teal font-semibold'
              : 'text-slate-600 hover:bg-slate-50 font-medium'
          )}
        >
          <span className="w-8 h-8 rounded-md overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
            {cat.image ? (
              <img src={sanityImg(cat.image, 96)} alt="" loading="lazy" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-[10px] font-semibold text-slate-400">
                {cat.label.charAt(0)}
              </span>
            )}
          </span>
          <span className="flex-1 min-w-0 truncate">{cat.label}</span>
          <span
            className={clsx(
              'text-[10px] tabular-nums px-1.5 py-0.5 rounded',
              activeCategory === cat.id
                ? 'bg-brand-teal text-white'
                : 'bg-slate-100 text-slate-400'
            )}
          >
            {cat.count}
          </span>
        </Link>
      ))}
    </div>
  )

  const categoryDescription = category?.description?.trim()

  return (
    <div className="pt-24 md:pt-28 min-h-screen bg-background">
      {slug ? (
        <>
          <SEO
            title={`${activeCategoryLabel} in Kampala, Uganda`}
            path={categoryPath(slug)}
            description={
              categoryDescription ||
              `Shop genuine ${activeCategoryLabel?.toLowerCase()} at High Flyer Trading CO LTD in Kampala. Manufacturer warranty and expert advice — visit our showroom or order via WhatsApp.`
            }
            image={category?.image || undefined}
            // An empty category is thin content; keep it out of the index
            // until products are added (the sitemap skips it too).
            noIndex={category?.count === 0}
          />
          {category && !productsLoading && (
            <CategorySchema slug={slug} label={category.label} products={categoryProducts} />
          )}
        </>
      ) : (
        <SEO
          title="Home Appliances in Kampala, Uganda"
          path="/"
          description="Shop genuine home appliances in Uganda — TVs, washing machines, blenders, air fryers and sound systems from Hisense, Midea, TCL and Philips. Cash on delivery."
        />
      )}

      {/* ══ Search + filter toolbar (sticky, marketplace style) ══ */}
      <div className="sticky top-24 md:top-28 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="section-container py-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 min-w-0">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                type="search"
                aria-label="Search appliances"
                placeholder="Search appliances, brands, models…"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="input-field w-full pl-12 pr-4 py-3 text-sm"
              />
            </div>

            <div className="relative shrink-0 hidden sm:block">
              <select
                aria-label="Sort products"
                value={filters.sort}
                onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
                className="input-field appearance-none cursor-pointer py-3 pl-4 pr-10 text-sm font-medium text-slate-700"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sort: {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
              className={clsx(
                'btn shrink-0 px-4 py-3 text-sm gap-2 border',
                showFilters || hasActiveFilters
                  ? 'bg-teal-50 border-teal-100 text-brand-teal'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              )}
            >
              <SlidersHorizontal size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap mt-3">
              {activeCategory !== 'all' && activeCategoryLabel && (
                <Link
                  to="/"
                  aria-label={`Remove ${activeCategoryLabel} filter`}
                  className="px-3 py-1.5 bg-teal-50 text-brand-teal text-[11px] font-semibold uppercase tracking-wider rounded-lg border border-teal-100 flex items-center gap-2"
                >
                  {activeCategoryLabel}
                  <X size={12} />
                </Link>
              )}
              {filters.search && (
                <button
                  onClick={() => updateFilter('search', '')}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-semibold rounded-lg flex items-center gap-2"
                >
                  &ldquo;{filters.search}&rdquo;
                  <X size={12} />
                </button>
              )}
              {filters.inStockOnly && (
                <button
                  onClick={() => updateFilter('inStockOnly', false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2"
                >
                  In stock
                  <X size={12} />
                </button>
              )}
              {filters.maxPrice < MAX_PRICE && (
                <button
                  onClick={() => updateFilter('maxPrice', MAX_PRICE)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-wider rounded-lg flex items-center gap-2"
                >
                  Under {(filters.maxPrice / 1_000_000).toFixed(1)}M
                  <X size={12} />
                </button>
              )}
              <button
                onClick={clearFilters}
                className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:text-red-500 transition-colors ml-1"
              >
                Reset all
              </button>
            </div>
          )}

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <p className="label-caps text-xs text-slate-400 mb-3">Max Price</p>
                <input
                  type="range"
                  aria-label="Maximum price"
                  min={0}
                  max={MAX_PRICE}
                  step={100_000}
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-teal"
                />
                <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
                  <span>UGX 0</span>
                  <span className="text-brand-teal tabular-nums">
                    {(filters.maxPrice / 1_000_000).toFixed(1)}M
                  </span>
                </div>
              </div>

              <div>
                <p className="label-caps text-xs text-slate-400 mb-3">Price Range</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    aria-label="Minimum price"
                    placeholder="Min"
                    value={filters.minPrice || ''}
                    onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                    className="input-field w-full py-2.5 text-sm"
                  />
                  <input
                    type="number"
                    aria-label="Maximum price"
                    placeholder="Max"
                    value={filters.maxPrice === MAX_PRICE ? '' : filters.maxPrice}
                    onChange={(e) =>
                      updateFilter('maxPrice', e.target.value ? Number(e.target.value) : MAX_PRICE)
                    }
                    className="input-field w-full py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="label-caps text-xs text-slate-400">Availability</p>
                <button
                  onClick={() => updateFilter('inStockOnly', !filters.inStockOnly)}
                  aria-pressed={filters.inStockOnly}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700 w-fit"
                >
                  <span
                    className={clsx(
                      'w-5 h-5 rounded-md border flex items-center justify-center transition-colors',
                      filters.inStockOnly
                        ? 'bg-brand-teal border-brand-teal text-white'
                        : 'border-slate-300 bg-white'
                    )}
                  >
                    {filters.inStockOnly && <Check size={13} strokeWidth={3} />}
                  </span>
                  In stock only
                </button>

                {/* Sort lives here on mobile, where the toolbar select is hidden */}
                <div className="relative sm:hidden">
                  <select
                    aria-label="Sort products"
                    value={filters.sort}
                    onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
                    className="input-field w-full appearance-none cursor-pointer py-2.5 pl-4 pr-10 text-sm"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        Sort: {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ══ Categories (left) + promo slider (right) ══ */}
      <div className="section-container pt-6 pb-8">
        <div className="grid lg:grid-cols-[250px_1fr] xl:grid-cols-[280px_1fr] gap-5">
          {/* Desktop rail */}
          <aside className="hidden lg:block card bg-white p-3 self-start max-h-[440px] overflow-y-auto custom-scrollbar">
            <h2 className="label-caps text-[11px] text-slate-400 px-3 pt-1 pb-2">Categories</h2>
            {categoryRail}
          </aside>

          {/* Mobile: horizontal category chips */}
          <div className="lg:hidden -mx-5 px-5 overflow-x-auto">
            <div className="flex gap-2 w-max pb-1">
              <Link
                to="/"
                aria-current={activeCategory === 'all' ? 'page' : undefined}
                className={clsx(
                  'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors',
                  activeCategory === 'all'
                    ? 'bg-brand-teal text-white border-brand-teal'
                    : 'bg-white text-slate-600 border-slate-200'
                )}
              >
                All
              </Link>
              {visibleCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={categoryPath(cat.id)}
                  aria-current={activeCategory === cat.id ? 'page' : undefined}
                  className={clsx(
                    'px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap border transition-colors',
                    activeCategory === cat.id
                      ? 'bg-brand-teal text-white border-brand-teal'
                      : 'bg-white text-slate-600 border-slate-200'
                  )}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <ShopPromoSlider products={products} isLoading={loading} />
        </div>
      </div>

      {/* ══ Product grid — full width, 4 across, infinite scroll ══ */}
      <div className="section-container pb-20">
        {slug && (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex items-center gap-2 text-sm font-medium">
              <li>
                <Link to="/" className="text-slate-400 hover:text-brand-teal transition-colors">
                  Shop
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight size={14} className="text-slate-300" />
              </li>
              <li aria-current="page" className="text-slate-700">
                {activeCategoryLabel}
              </li>
            </ol>
          </nav>
        )}
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h1 className="font-display font-bold text-xl md:text-2xl text-slate-900">
            {activeCategory === 'all' ? 'Home Appliances in Uganda' : activeCategoryLabel}
          </h1>
          {!loading && (
            <p className="text-sm text-slate-500 tabular-nums">
              {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {categoryDescription && (
          <p className="text-slate-600 leading-relaxed max-w-3xl -mt-2 mb-6">
            {categoryDescription}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-square bg-slate-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
                  <div className="h-8 bg-slate-100 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card bg-white p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-8">
              <Search size={32} className="text-slate-400" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">
              No appliances found
            </h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
              We couldn't find any products matching your current filters. Try adjusting your
              search or category.
            </p>
            <button onClick={clearFilters} className="btn btn-primary px-10 py-4">
              Reset All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Infinite-scroll sentinel. The button below is the accessible
                fallback and covers cases where the observer never fires. */}
            <div ref={sentinelRef} className="h-px" aria-hidden="true" />

            {hasMore ? (
              <div className="flex flex-col items-center gap-3 pt-10">
                <Loader2 size={24} className="animate-spin text-brand-teal" aria-hidden="true" />
                <button
                  onClick={loadMore}
                  className="text-sm font-semibold text-slate-500 hover:text-brand-teal transition-colors"
                >
                  Load more products
                </button>
              </div>
            ) : (
              <p className="text-center text-sm text-slate-400 pt-10">
                You&rsquo;ve seen all {filtered.length} product
                {filtered.length !== 1 ? 's' : ''}.
              </p>
            )}

            <p className="sr-only" aria-live="polite">
              Showing {visible.length} of {filtered.length} products
            </p>
          </>
        )}
      </div>
    </div>
  )
}
