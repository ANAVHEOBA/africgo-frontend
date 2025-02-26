import { ProductStatus } from '@/lib/products/types'

export interface Store {
  _id: string
  storeName: string
  description: string
  category: string
  status: string
  slug: string
  storeUrl: string
  contactInfo: {
    email: string
    phone: string
    whatsapp: string
  }
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  socialLinks?: {
    instagram: string
    facebook: string
  }
  businessInfo?: {
    registrationNumber: string
  }
  settings: {
    isVerified: boolean
    isFeaturedStore: boolean
    allowRatings: boolean
  }
  metrics: {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
  }
  createdAt: string
  updatedAt: string
}

export interface StoreFilters {
  page?: number
  limit?: number
  category?: string
  city?: string
  state?: string
  country?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  minRating?: number
}

export interface PaginatedStores {
  stores: Store[]
  pagination: {
    total: number
    page: number
    totalPages: number
    hasMore: boolean
  }
}

export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface ShippingDimensions {
  length: number
  width: number
  height: number
}

interface ShippingInfo {
  dimensions: ShippingDimensions
  weight: number
  requiresSpecialHandling: boolean
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  storeId: string
  stock: number
  status: ProductStatus
  isPublished: boolean
  createdAt: Date | string
  updatedAt: Date | string
  guestOrderEnabled: boolean
  minOrderQuantity: number
  maxOrderQuantity: number
  specifications?: {
    material?: string
    size?: string
    color?: string
  }
  variants?: Array<any>
  shippingInfo?: ShippingInfo
}

export interface PaginatedProducts {
  products: Product[]
  pagination: {
    total: number
    page: number
    totalPages: number
    hasMore: boolean
  }
} 