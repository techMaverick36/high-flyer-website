import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  Mail,
  ArrowLeft,
  Shield,
  Check,
  ChevronRight,
} from 'lucide-react'
import { useCartStore } from '../store/Cartstore'
import { formatPrice, openWhatsAppOrder, openEmailOrder } from '../utils'
import type { CustomerInfo } from '../utils/types'
import clsx from 'clsx'

const defaultCustomer: CustomerInfo = {
  name: '',
  phone: '',
  email: '',
  address: '',
  notes: '',
}

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCartStore()
  const [step, setStep] = useState<'cart' | 'details'>('cart')
  const [customer, setCustomer] = useState<CustomerInfo>(defaultCustomer)
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})
  const [sent, setSent] = useState(false)

  const total = totalPrice()

  const validate = () => {
    const e: Partial<CustomerInfo> = {}
    if (!customer.name.trim()) e.name = 'Required'
    if (!customer.phone.trim()) e.phone = 'Required'
    if (!customer.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleWhatsApp = () => {
    if (!validate()) return
    openWhatsAppOrder(items, customer, total)
    clearCart()
    setSent(true)
  }

  const handleEmail = () => {
    if (!validate()) return
    openEmailOrder(items, customer, total)
    clearCart()
    setSent(true)
  }

  if (sent) {
    return (
      <div className="pt-[112px] min-h-screen bg-background flex items-center justify-center">
        <div className="section-container">
          <div className="card max-w-xl mx-auto p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-green-500/5 blur-[80px] rounded-full" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-green-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-green-100 shadow-lg shadow-green-500/10">
                <Check size={48} className="text-green-500" strokeWidth={3} />
              </div>
              <h2 className="font-display font-bold text-4xl text-slate-900 mb-4 tracking-tight">Order Sent!</h2>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                Congratulations! Your order has been received. Our team will contact you shortly via WhatsApp or Phone to confirm delivery details.
              </p>
              <Link to="/shop" className="btn btn-primary px-10 py-4 shadow-xl shadow-brand-teal/20 gap-3 group">
                <ShoppingBag size={20} />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-[112px] min-h-screen bg-background">
      <div className="section-container py-12 md:py-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-brand-teal transition-all uppercase tracking-widest mb-4">
              <ArrowLeft size={16} strokeWidth={3} />
              Back to Shop
            </Link>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-slate-900 tracking-tight flex items-center gap-4">
              {step === 'cart' ? 'Your Shopping Cart' : 'Finalize Your Order'}
            </h1>
          </div>

          {/* Step indicator */}
          <div className="flex items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            {[
              { num: 1, label: 'Cart', step: 'cart' },
              { num: 2, label: 'Details', step: 'details' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center">
                {i > 0 && <div className="w-8 h-[2px] bg-slate-100 mx-2" />}
                <div className={clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300",
                  step === s.step ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" : "text-slate-400"
                )}>
                  <div className={clsx(
                    "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black",
                    step === s.step ? "bg-white text-brand-teal" : "bg-slate-100 text-slate-400"
                  )}>
                    {step === 'details' && s.step === 'cart' ? <Check size={12} strokeWidth={4} /> : s.num}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest leading-none">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {items.length === 0 && !sent ? (
          <div className="card bg-white p-20 text-center max-w-2xl mx-auto shadow-2xl shadow-slate-200/50">
            <div className="text-8xl mb-8 opacity-20">🛒</div>
            <h2 className="font-display font-bold text-3xl text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">Looks like you haven't added any premium appliances to your cart yet.</p>
            <Link to="/shop" className="btn btn-primary px-10 py-4 shadow-xl shadow-brand-teal/20">Browse Collection</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Items / Form */}
            <div className="lg:col-span-8 space-y-8">
              {step === 'cart' ? (
                <div className="card bg-white overflow-hidden shadow-2xl shadow-slate-200/50">
                  <div className="divide-y divide-slate-50">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex flex-col sm:flex-row gap-6 p-8 group">
                        <Link to={`/product/${item.product.slug}`} className="shrink-0 relative">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-32 h-32 object-cover rounded-[24px] bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                          <div className="flex justify-between items-start gap-4 mb-2">
                            <Link
                              to={`/product/${item.product.slug}`}
                              className="font-display font-bold text-slate-900 hover:text-brand-teal transition-colors text-xl leading-tight"
                            >
                              {item.product.name}
                            </Link>
                            <p className="font-display font-bold text-brand-teal text-xl">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Shield size={14} className="text-brand-teal" />
                            {item.product.warranty || '1 Year Warranty'}
                          </p>
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center bg-slate-100 rounded-xl p-1">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:text-brand-teal transition-all disabled:opacity-50"
                                disabled={item.quantity <= 1}
                              >
                                <Minus size={14} strokeWidth={3} />
                              </button>
                              <span className="w-10 text-center font-display font-bold text-slate-700">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center hover:text-brand-teal transition-all"
                              >
                                <Plus size={14} strokeWidth={3} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-xs font-bold text-red-400 hover:text-red-600 transition-all uppercase tracking-widest flex items-center gap-2 group/btn"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover/btn:bg-red-500 group-hover/btn:text-white transition-all">
                                <Trash2 size={14} />
                              </div>
                              Remove Item
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex justify-end">
                    <button
                      onClick={clearCart}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-2 uppercase tracking-widest"
                    >
                      <Trash2 size={14} /> Clear Entire Cart
                    </button>
                  </div>
                </div>
              ) : (
                /* Customer Details Form */
                <div className="card bg-white p-10 shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-brand-teal shadow-inner">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-2xl text-slate-900 leading-none mb-1">
                        Contact Information
                      </h2>
                      <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">Final step to place your order</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Grace Nakato"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        className={clsx('input-field w-full py-4 text-base font-bold', errors.name && 'border-red-500 ring-2 ring-red-500/10')}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+256 700 000000"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className={clsx('input-field w-full py-4 text-base font-bold', errors.phone && 'border-red-500 ring-2 ring-red-500/10')}
                      />
                    </div>
                  </div>
                  <div className="mb-8">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="grace@email.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className={clsx('input-field w-full py-4 text-base font-bold', errors.email && 'border-red-500 ring-2 ring-red-500/10')}
                    />
                  </div>
                  <div className="mb-8">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Delivery Address</label>
                    <input
                      type="text"
                      placeholder="e.g. Plot 12, Ntinda Road, Kampala"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="input-field w-full py-4 text-base font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block ml-1">Order Notes</label>
                    <textarea
                      rows={4}
                      placeholder="Preferred delivery time, special requests..."
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="input-field w-full py-4 text-base font-bold resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="card bg-white p-8 sticky top-[136px] shadow-2xl shadow-slate-200/50 border-2 border-slate-50">
                <h3 className="font-display font-bold text-2xl text-slate-900 mb-8 tracking-tight">Order Summary</h3>
                
                <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-start group">
                      <div className="min-w-0">
                        <p className="font-bold text-slate-700 text-sm leading-tight truncate group-hover:text-brand-teal transition-colors">
                          {item.product.name}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm shrink-0 ml-4">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-8 border-t-2 border-slate-50">
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-sm font-bold uppercase tracking-widest">Subtotal</span>
                    <span className="font-bold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-500">
                    <span className="text-sm font-bold uppercase tracking-widest">Delivery</span>
                    <span className="text-brand-teal font-black text-xs uppercase tracking-tighter">Calculated Later</span>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t-2 border-slate-50">
                    <span className="font-display font-bold text-xl text-slate-900">Total Price</span>
                    <span className="font-display font-bold text-3xl text-brand-teal tracking-tight">{formatPrice(total)}</span>
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  {step === 'cart' ? (
                    <button
                      onClick={() => setStep('details')}
                      className="btn btn-primary w-full py-5 text-lg shadow-xl shadow-brand-teal/20 gap-3 group"
                    >
                      <span className="uppercase tracking-widest font-black">Continue</span>
                      <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={handleWhatsApp}
                        className="btn btn-orange flex-col py-6 gap-3 shadow-xl shadow-orange-500/20 group h-auto"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center transition-transform group-hover:rotate-12">
                          <MessageCircle size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">WhatsApp</span>
                      </button>
                      <button
                        onClick={handleEmail}
                        className="btn bg-white border-2 border-brand-teal text-brand-teal flex-col py-6 gap-3 h-auto hover:bg-teal-50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center transition-transform group-hover:-rotate-12">
                          <Mail size={28} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">Email Order</span>
                      </button>
                    </div>
                  )}

                  {step === 'details' && (
                    <button
                      onClick={() => setStep('cart')}
                      className="w-full py-2 text-[10px] font-black text-slate-400 hover:text-slate-600 transition-all uppercase tracking-[0.2em]"
                    >
                      ← Back to Cart
                    </button>
                  )}
                </div>

                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-brand-teal shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                      No online payment required. Place your order and our team will contact you for payment on delivery.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}