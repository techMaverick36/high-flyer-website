import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '../utils/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void

  // Computed
  totalItems: () => number
  totalPrice: () => number
}

const getProductKey = (product: Partial<Product>): string =>
  product.id || product.slug || product.name || ''

const normalizeQuantity = (quantity: number): number =>
  Math.max(1, Math.floor(Number(quantity) || 1))

const normalizeProduct = (product: Product): Product => ({
  ...product,
  id: product.id || product.slug || product.name,
  images: Array.isArray(product.images)
    ? product.images
        .map((image) =>
          typeof image === 'string'
            ? { url: image, alt: product.name }
            : { ...image, url: image?.url || '', alt: image?.alt || product.name }
        )
        .filter((image) => image.url)
    : [],
})

const normalizeCartItems = (items: unknown): CartItem[] => {
  if (!Array.isArray(items)) return []

  const merged = new Map<string, CartItem>()

  for (const entry of items) {
    if (!entry || typeof entry !== 'object' || !('product' in entry)) continue

    const rawProduct = (entry as CartItem).product
    if (!rawProduct || typeof rawProduct !== 'object') continue

    const product = normalizeProduct(rawProduct as Product)
    const key = getProductKey(product)
    const quantity = normalizeQuantity((entry as CartItem).quantity)

    if (!key) continue

    const existing = merged.get(key)
    merged.set(
      key,
      existing
        ? { ...existing, quantity: existing.quantity + quantity }
        : { product, quantity }
    )
  }

  return [...merged.values()]
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1) => {
        const normalizedProduct = normalizeProduct(product)
        const normalizedQuantity = normalizeQuantity(quantity)
        const productKey = getProductKey(normalizedProduct)
        const existing = get().items.find(
          (i) => getProductKey(i.product) === productKey
        )

        if (existing) {
          set({
            items: get().items.map((i) =>
              getProductKey(i.product) === productKey
                ? { ...i, quantity: i.quantity + normalizedQuantity }
                : i
            ),
          })
        } else {
          set({
            items: [
              ...get().items,
              { product: normalizedProduct, quantity: normalizedQuantity },
            ],
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((i) => getProductKey(i.product) !== productId),
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        set({
          items: get().items.map((i) =>
            getProductKey(i.product) === productId
              ? { ...i, quantity: normalizeQuantity(quantity) }
              : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'high-flyer-cart',
      version: 1,
      migrate: (persistedState) => {
        const state =
          persistedState && typeof persistedState === 'object'
            ? (persistedState as Partial<CartStore>)
            : {}

        return {
          ...state,
          items: normalizeCartItems(state.items),
        }
      },
      partialize: (state) => ({ items: state.items }),
    }
  )
)
