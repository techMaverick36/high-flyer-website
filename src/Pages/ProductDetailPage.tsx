import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import {
  ShoppingCart,
  MessageCircle,
  Phone,
  Shield,
  Truck,
  MapPin,
  ChevronRight,
  Check,
  Minus,
  Plus,
} from 'lucide-react'
import { getProductBySlug, getRelatedProducts } from '../utils/products'
import { useCartStore } from '../store/Cartstore'
import { companyInfo } from '../utils/company'
import { formatPrice, getDiscountPercent } from '../utils'
import StarRating from '../components/StarRating'
import ProductCard from '../components/ProductCard'
import clsx from 'clsx'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const product = getProductBySlug(slug || '')

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem, openCart } = useCartStore()

  if (!product) return <Navigate to="/shop" replace />

  const related = getRelatedProducts(product)
  const discount = product.originalPrice
    ? getDiscountPercent(product.originalPrice, product.price)
    : 0

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2500)
  }

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in the *${product.name}* (${formatPrice(product.price)}). Could you give me more details?`
  )

  return (
    <div className="pt-[112px] min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-100">
        <div className="section-container py-4 flex items-center gap-3 text-sm font-medium">
          <Link to="/" className="text-slate-400 hover:text-brand-teal transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <Link to="/shop" className="text-slate-400 hover:text-brand-teal transition-colors">Shop</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="section-container py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24">
          {/* ── Images ── */}
          <div className="space-y-6">
            {/* Main image */}
            <div className="aspect-square rounded-[32px] overflow-hidden bg-white border border-slate-100 shadow-card group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={clsx(
                      "w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 p-1 bg-white",
                      selectedImage === i
                        ? 'border-brand-teal shadow-lg shadow-brand-teal/10'
                        : 'border-slate-100 hover:border-teal-200'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover rounded-xl" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex items-center gap-3 mb-6">
              {product.badge && (
                <span className="px-3 py-1 bg-brand-orange text-white text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-orange-500/20">
                  {product.badge}
                </span>
              )}
              {product.inStock ? (
                <span className="px-3 py-1 bg-teal-50 text-brand-teal text-[10px] font-bold uppercase tracking-wider rounded-lg border border-teal-100 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-teal animate-pulse" />
                  In Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                  Out of Stock
                </span>
              )}
            </div>

            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 mb-4 leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size={18}
              />
              <div className="h-4 w-[1px] bg-slate-200" />
              <span className="text-sm font-bold text-brand-teal uppercase tracking-widest">{product.category}</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-10 p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner">
              <span className="font-display font-bold text-4xl text-brand-teal">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <span className="text-lg text-slate-400 line-through font-medium leading-none mb-1">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-tighter">Save {discount}%</span>
                </div>
              )}
            </div>

            <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">{product.description}</p>

            {/* Features */}
            <div className="mb-10">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 ml-1">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-4 p-4 bg-white border border-slate-50 rounded-2xl shadow-sm group hover:border-brand-teal/30 transition-all">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-brand-teal shrink-0 group-hover:bg-brand-teal group-hover:text-white transition-all">
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold text-slate-700 leading-tight">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex flex-wrap items-center gap-8 mb-10 pt-10 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Qty</span>
                <div className="flex items-center bg-slate-100 rounded-2xl p-1.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:text-brand-teal transition-all disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} strokeWidth={3} />
                  </button>
                  <span className="w-12 text-center font-display font-bold text-lg text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center hover:text-brand-teal transition-all"
                  >
                    <Plus size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
              <div className="flex-1 text-right sm:text-left">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Price</p>
                <p className="text-2xl font-display font-bold text-slate-900">{formatPrice(product.price * quantity)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={clsx(
                  "btn py-5 text-lg gap-3 shadow-xl transform active:scale-95",
                  added
                    ? 'bg-green-500 text-white'
                    : product.inStock
                    ? 'btn-primary shadow-brand-teal/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                )}
              >
                {added ? <Check size={24} strokeWidth={3} /> : <ShoppingCart size={22} />}
                <span className="uppercase tracking-widest font-bold">{added ? 'Added!' : 'Add to Cart'}</span>
              </button>
              <a
                href={`https://wa.me/${companyInfo.whatsapp.replace(/\D/g, '')}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-orange py-5 text-lg gap-3 shadow-xl shadow-orange-500/20 transform active:scale-95"
              >
                <MessageCircle size={22} />
                <span className="uppercase tracking-widest font-bold">Enquire Now</span>
              </a>
            </div>

            {/* Trust box */}
            <div className="bg-teal-50/50 rounded-3xl p-8 border border-teal-100/50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: Shield, text: product.warranty, title: 'Warranty' },
                  { icon: MapPin, text: 'Visit Our Showroom', title: 'Location' },
                  { icon: Truck, text: 'Express Delivery', title: 'Shipping' },
                  { icon: Phone, text: companyInfo.phone, title: 'Support' },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <item.icon size={18} className="text-brand-teal" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{item.title}</p>
                      <p className="text-sm font-bold text-slate-700 leading-tight">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="pt-24 border-t border-slate-100">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <span className="section-label">Explore More</span>
                <h2 className="font-display font-bold text-4xl text-slate-900 tracking-tight">You Might Also Like</h2>
              </div>
              <Link to="/shop" className="btn px-8 py-3 bg-white border-2 border-slate-100 text-slate-600 font-bold hover:border-brand-teal hover:text-brand-teal">
                View All Collection
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}