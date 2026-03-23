import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, ChevronDown, Loader2 } from 'lucide-react'
import { categories } from '../utils/products'
import { useGetAllProductsQuery, useGetAllCategoriesQuery } from '../store/api/sanityApi'
import type { FilterState, ProductCategory, SortOption } from '../utils/types'
import ProductCard from '../components/ProductCard'
import clsx from 'clsx'

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const MAX_PRICE = 7_000_000

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const { data: products = [], isLoading: productsLoading } = useGetAllProductsQuery()
  const { data: allCategories = [], isLoading: categoriesLoading } = useGetAllCategoriesQuery()
  const loading = productsLoading || categoriesLoading

  const [filters, setFilters] = useState<FilterState>({
    category: (searchParams.get('category') as ProductCategory) || 'all',
    minPrice: 0,
    maxPrice: MAX_PRICE,
    inStockOnly: false,
    sort: 'newest',
    search: '',
  })

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filtered = useMemo(() => {
    let result = [...products]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      )
    }

    if (filters.category !== 'all') {
      result = result.filter((p) => p.category.slug === filters.category)
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
  }, [filters, products])

  const clearFilters = () => {
    setFilters({
      category: 'all',
      minPrice: 0,
      maxPrice: MAX_PRICE,
      inStockOnly: false,
      sort: 'newest',
      search: '',
    })
    setSearchParams({})
  }

  const hasActiveFilters =
    filters.category !== 'all' ||
    filters.minPrice > 0 ||
    filters.maxPrice < MAX_PRICE ||
    filters.inStockOnly ||
    filters.search !== ''

  return (
    <div className="pt-[112px] min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-12 md:py-16">
          <span className="section-label">Our Collection</span>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4 tracking-tight">Shop All Products</h1>
          <p className="text-slate-500 font-medium">
            Explore {filtered.length} premium product{filtered.length !== 1 ? 's' : ''} available in our Kampala showroom.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* ── Sidebar Filters ── */}
          <aside
            className={clsx(
              'w-72 shrink-0 space-y-10',
              'hidden lg:block',
              showFilters && '!block fixed inset-0 z-[100] bg-white p-8 overflow-y-auto'
            )}
          >
            {/* Mobile close */}
            {showFilters && (
              <div className="flex items-center justify-between lg:hidden mb-8">
                <h2 className="font-display font-bold text-2xl">Filters</h2>
                <button onClick={() => setShowFilters(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <X size={24} />
                </button>
              </div>
            )}

            {/* Search (Moved to sidebar for desktop) */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Search</h3>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="input-field w-full pl-12 py-3"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 ml-1">Categories</h3>
              <div className="space-y-1 card p-2 bg-white/50">
                <button
                  onClick={() => updateFilter('category', 'all')}
                  className={clsx(
                    'w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group',
                    filters.category === 'all'
                      ? 'bg-teal-50 text-brand-teal font-bold'
                      : 'text-slate-600 hover:bg-slate-50 font-medium'
                  )}
                >
                  <span>All Appliances</span>
                  {filters.category === 'all' && <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />}
                </button>
                <div className="h-[1px] bg-slate-100 my-1 mx-2" />
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilter('category', cat.id as ProductCategory)}
                    className={clsx(
                      'w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center gap-3 group',
                      filters.category === cat.id
                        ? 'bg-teal-50 text-brand-teal font-bold'
                        : 'text-slate-600 hover:bg-slate-50 font-medium'
                    )}
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-slate-100 group-hover:scale-110 transition-transform">
                      {cat.image ? (
                        <img src={cat.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xs">{cat.icon}</div>
                      )}
                    </div>
                    <span className="flex-1">{cat.label}</span>
                    <span className={clsx(
                      "text-[10px] px-2 py-0.5 rounded-md transition-colors",
                      filters.category === cat.id ? "bg-brand-teal text-white" : "bg-slate-100 text-slate-400"
                    )}>{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 ml-1">Price Range</h3>
              <div className="px-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <span>UGX 0</span>
                  <span className="text-brand-teal">MAX: {(filters.maxPrice / 1_000_000).toFixed(1)}M</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={MAX_PRICE}
                  step={100_000}
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand-teal mb-6"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">MIN</span>
                    <input
                      type="number"
                      value={filters.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', Number(e.target.value))}
                      className="input-field w-full pl-10 py-2 text-xs font-bold"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">MAX</span>
                    <input
                      type="number"
                      value={filters.maxPrice === MAX_PRICE ? '' : filters.maxPrice}
                      onChange={(e) =>
                        updateFilter('maxPrice', e.target.value ? Number(e.target.value) : MAX_PRICE)
                      }
                      className="input-field w-full pl-10 py-2 text-xs font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="pt-4 border-t border-slate-100">
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-bold text-slate-700">In Stock Only</span>
                <div
                  onClick={() => updateFilter('inStockOnly', !filters.inStockOnly)}
                  className={clsx(
                    'w-11 h-6 rounded-full transition-all duration-300 relative cursor-pointer p-1',
                    filters.inStockOnly ? 'bg-brand-teal' : 'bg-slate-200'
                  )}
                >
                  <div
                    className={clsx(
                      'w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300',
                      filters.inStockOnly ? 'translate-x-5' : 'translate-x-0'
                    )}
                  />
                </div>
              </label>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full py-3 rounded-xl border-2 border-slate-100 text-xs font-bold text-slate-400 hover:text-red-500 hover:border-red-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <X size={14} /> Reset Filters
              </button>
            )}

            {/* CTA in sidebar */}
            {showFilters && (
              <button 
                onClick={() => setShowFilters(false)}
                className="btn btn-primary w-full py-4 mt-8"
              >
                Show Results
              </button>
            )}
          </aside>

          {/* ── Product Grid ── */}
          <div className="flex-1 min-w-0">
            {/* Top Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden btn bg-white border border-slate-200 text-slate-700 px-4 py-2.5 text-sm gap-2"
                >
                  <SlidersHorizontal size={16} />
                  Filters
                </button>
                {hasActiveFilters && (
                  <div className="hidden sm:flex gap-2">
                    {filters.category !== 'all' && (
                      <span className="px-3 py-1.5 bg-teal-50 text-brand-teal text-[10px] font-bold uppercase tracking-wider rounded-lg border border-teal-100 flex items-center gap-2">
                        {allCategories.find((c) => c.id === filters.category)?.label || categories.find((c) => c.id === filters.category)?.label}
                        <X size={12} className="cursor-pointer" onClick={() => updateFilter('category', 'all')} />
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="relative w-full sm:w-auto min-w-[200px]">
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter('sort', e.target.value as SortOption)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 appearance-none cursor-pointer focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sort by: {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <Loader2 size={48} className="animate-spin mb-4 text-brand-teal" />
                <p className="font-medium">Loading products...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="card bg-white p-16 text-center">
                <div className="text-7xl mb-8 grayscale opacity-50">🔍</div>
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-4">
                  No appliances found
                </h3>
                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                  We couldn't find any products matching your current filters. Try adjusting your search or category.
                </p>
                <button onClick={clearFilters} className="btn btn-primary px-10 py-4 shadow-xl shadow-brand-teal/20">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}