import { Types } from 'mongoose'

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED'
}

export interface ProductVariant {
  name: string
  options: string[]
  prices?: number[]
}

export interface ShippingInfo {
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  requiresSpecialHandling: boolean
}

export interface Product {
  _id: string
  storeId: Types.ObjectId | string
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  specifications?: {
    [key: string]: string
  }
  variants?: ProductVariant[]
  status: ProductStatus
  isPublished: boolean
  guestOrderEnabled: boolean
  minOrderQuantity: number
  maxOrderQuantity: number
  shippingInfo?: ShippingInfo
  createdAt: Date
  updatedAt: Date
}

export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  status?: ProductStatus
  search?: string
}

export interface PaginatedProducts {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

export interface CreateProductData {
  name: string
  description: string
  price: number
  category: string
  images: string[]
  stock: number
  specifications?: {
    material?: string
    size?: string
    color?: string
    [key: string]: string | undefined
  }
  variants?: ProductVariant[]
  isPublished: boolean
  guestOrderEnabled: boolean
  minOrderQuantity: number
  maxOrderQuantity: number
  shippingInfo?: ShippingInfo
  status?: ProductStatus
}

export interface UpdateProductData extends Partial<CreateProductData> {} 