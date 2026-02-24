import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Star } from 'lucide-react'
import type { Product } from '../utils/types'
import { useCartStore } from '../store/Cartstore'
import { formatPrice, getDiscountPercent } from '../utils'
import clsx from 'clsx'

interface ProductCardProps {
  product: Product
  className?: string
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  const discount =
    product.originalPrice
      ? getDiscountPercent(product.originalPrice, product.price)
      : 0

  return (
    <div className={clsx('group card card-hover overflow-hidden flex flex-col', className)}>
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        {!imgError ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-slate-100">
            🏠
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2.5 py-1 bg-brand-teal text-white text-[10px] font-bold uppercase tracking-wide rounded-md shadow-sm">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide rounded-md shadow-sm">
              Save {discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="px-2.5 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wide rounded-md shadow-sm">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick view — subtle, not dramatic */}
        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-center justify-center">
          <div className="bg-white text-brand-teal p-3 rounded-full shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-250">
            <Eye size={18} />
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={11}
                fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                strokeWidth={2}
                className={i < Math.floor(product.rating) ? '' : 'text-slate-200'}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-400">({product.reviewCount})</span>
        </div>

        {/* Name */}
        <Link to={`/product/${product.slug}`} className="mb-2">
          <h3 className="font-display font-bold text-slate-900 text-sm md:text-base leading-snug hover:text-brand-teal transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="flex items-baseline gap-2.5 mb-4">
          <span className="font-display font-bold text-brand-teal text-lg">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={clsx(
            'btn w-full py-2.5 text-sm gap-2 transition-all duration-200 active:scale-[0.98]',
            added
              ? 'bg-green-500 text-white'
              : product.inStock
              ? 'btn-primary'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          )}
        >
          {added ? (
            <span className="flex items-center gap-2">✓ Added to cart</span>
          ) : (
            <>
              <ShoppingCart size={15} />
              <span className="font-semibold">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
