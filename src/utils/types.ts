export interface SanityImage {
  url: string;
  alt: string;
  lqip?: string;
}

// ─── Product ───────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  category: {
    title: string;
    slug: string;
    icon?: string;
  }
  price: number
  originalPrice?: number
  description: any[]
  shortDescription: string
  features: string[]
  images: SanityImage[]
  badge?: string
  featured?: boolean
  inStock: boolean
  warranty: string
  rating: number
  reviewCount: number
  tags: string[]
  createdAt: string
}

export type ProductCategory =
  | 'refrigerators'
  | 'washing-machines'
  | 'televisions'
  | 'air-conditioners'
  | 'microwaves'
  | 'water-dispensers'
  | 'blenders'
  | 'fans'
  | 'cookers'
  | 'air-fryers'
  | 'rice-cookers'
  | 'small-appliances'
  | 'extension-cords'

// ─── Cart ──────────────────────────────────────────────────
export interface CartItem {
  product: Product
  quantity: number
}

export interface CustomerInfo {
  name: string
  phone: string
  email: string
  address?: string
  notes?: string
}

// ─── Order Message ─────────────────────────────────────────
export interface OrderMessage {
  items: CartItem[]
  customer: CustomerInfo
  total: number
  date: string
}

// ─── Filter / Sort ─────────────────────────────────────────
export type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating'

export interface FilterState {
  category: ProductCategory | 'all'
  minPrice: number
  maxPrice: number
  inStockOnly: boolean
  sort: SortOption
  search: string
}

// ─── Testimonial ───────────────────────────────────────────
export interface Testimonial {
  id: string
  name: string
  location: string
  rating: number
  text: string
  product?: string
  avatar?: string
}

// ─── Category ──────────────────────────────────────────────
export interface CategoryMeta {
  id: ProductCategory
  label: string
  icon: string
  image: string
  description: string
  count: number
}