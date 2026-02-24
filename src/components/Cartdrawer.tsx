import { useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag, MessageCircle, Mail } from 'lucide-react'
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

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
  } = useCartStore()

  const [step, setStep] = useState<'cart' | 'customer' | 'confirm'>('cart')
  const [customer, setCustomer] = useState<CustomerInfo>(defaultCustomer)
  const [errors, setErrors] = useState<Partial<CustomerInfo>>({})

  const total = totalPrice()

  const validate = () => {
    const e: Partial<CustomerInfo> = {}
    if (!customer.name.trim()) e.name = 'Name is required'
    if (!customer.phone.trim()) e.phone = 'Phone number is required'
    if (!customer.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email))
      e.email = 'Enter a valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleOrderWhatsApp = () => {
    if (!validate()) return
    openWhatsAppOrder(items, customer, total)
    clearCart()
    setStep('cart')
    setCustomer(defaultCustomer)
    closeCart()
  }

  const handleOrderEmail = () => {
    if (!validate()) return
    openEmailOrder(items, customer, total)
    clearCart()
    setStep('cart')
    setCustomer(defaultCustomer)
    closeCart()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-[420px] bg-white z-[70] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-brand-teal">
              <ShoppingBag size={20} />
            </div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              {step === 'cart' ? 'Your Cart' : 'Checkout'}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex px-8 py-2 gap-3 mb-4">
          {['cart', 'customer'].map((s, i) => {
            const isActive = step === s || (step === 'confirm' && i === 1);
            const isPast = (step === 'customer' && i === 0);
            return (
              <div
                key={s}
                className={clsx(
                  'flex-1 h-1.5 rounded-full transition-all duration-500',
                  isActive || isPast ? 'bg-brand-teal' : 'bg-slate-100'
                )}
              />
            );
          })}
        </div>

        {/* ── STEP 1: Cart Items ── */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                  <div className="text-7xl opacity-20">🛒</div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900 text-xl mb-2">Your cart is empty</h3>
                    <p className="text-sm text-slate-500 max-w-[200px] mx-auto leading-relaxed">Looks like you haven't added any appliances yet.</p>
                  </div>
                  <button onClick={closeCart} className="btn btn-primary px-8 py-3">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 group"
                    >
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <div className="flex justify-between gap-2 mb-1">
                          <h4 className="text-[15px] font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-brand-teal transition-colors">
                            {item.product.name}
                          </h4>
                          <p className="text-[15px] font-bold text-brand-teal shrink-0">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                        <p className="text-xs text-slate-400 mb-3 font-medium uppercase tracking-wider">{item.product.warranty || '1 Year Warranty'}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:text-brand-teal transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} strokeWidth={3} />
                            </button>
                            <span className="text-xs font-bold w-8 text-center text-slate-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-md bg-white shadow-sm flex items-center justify-center hover:text-brand-teal transition-colors"
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-8 py-8 border-t border-slate-100 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <div className="space-y-3 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-bold text-slate-400">{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <span className="text-slate-900 font-bold text-lg">Order Total</span>
                    <span className="font-display font-bold text-brand-teal text-2xl">{formatPrice(total)}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl leading-relaxed mt-4">
                    ✨ <span className="font-bold text-slate-600">Note:</span> Delivery costs and special discounts will be confirmed by our team after you place the order.
                  </p>
                </div>
                <button
                  onClick={() => setStep('customer')}
                  className="btn btn-primary w-full py-4 text-base shadow-lg shadow-brand-teal/20 gap-3"
                >
                  Place Order <Plus size={18} />
                </button>
              </div>
            )}
          </>
        )}

        {/* ── STEP 2: Customer Info ── */}
        {step === 'customer' && (
          <>
            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Delivery Details</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Grace Nakato"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className={clsx('input-field w-full py-3', errors.name && 'border-red-500 ring-2 ring-red-500/10')}
                    />
                    {errors.name && <p className="text-[10px] text-red-500 mt-1.5 font-bold uppercase ml-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +256 700 000000"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className={clsx('input-field w-full py-3', errors.phone && 'border-red-500 ring-2 ring-red-500/10')}
                    />
                    {errors.phone && <p className="text-[10px] text-red-500 mt-1.5 font-bold uppercase ml-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. grace@email.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className={clsx('input-field w-full py-3', errors.email && 'border-red-500 ring-2 ring-red-500/10')}
                    />
                    {errors.email && <p className="text-[10px] text-red-500 mt-1.5 font-bold uppercase ml-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                      Location / Address
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ntinda, Kampala"
                      value={customer.address}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      className="input-field w-full py-3"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block ml-1">
                      Order Notes
                    </label>
                    <textarea
                      placeholder="Anything else we should know?"
                      rows={3}
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="input-field w-full py-3 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-8 border-t border-slate-100 bg-white space-y-4">
              <button
                onClick={handleOrderWhatsApp}
                className="btn btn-orange w-full py-4 text-base shadow-lg shadow-orange-500/20 gap-3"
              >
                <MessageCircle size={20} />
                Order via WhatsApp
              </button>
              <button
                onClick={handleOrderEmail}
                className="btn w-full py-4 text-base bg-white border-2 border-brand-teal text-brand-teal hover:bg-teal-50 gap-3"
              >
                <Mail size={20} />
                Order via Email
              </button>
              <button
                onClick={() => setStep('cart')}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors w-full text-center py-2 uppercase tracking-widest"
              >
                ← Back to Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}