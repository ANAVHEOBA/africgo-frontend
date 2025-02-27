import { Store, StoreFilters, PaginatedStores, ProductFilters, PaginatedProducts } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }
  
  return data.data
}

// Get all stores with filters
export async function getStores(filters: StoreFilters = {}): Promise<PaginatedStores> {
  const queryParams = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const response = await fetch(
    `${API_URL}/api/stores/list?${queryParams.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return handleResponse<PaginatedStores>(response)
}

// Get single store by slug
export async function getStoreBySlug(slug: string): Promise<Store> {
  const response = await fetch(
    `${API_URL}/api/stores/${slug}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return handleResponse<Store>(response)
}

// Get store products
export async function getStoreProducts(storeSlug: string, filters: ProductFilters = {}): Promise<PaginatedProducts> {
  if (!storeSlug) {
    throw new Error('Store slug is required')
  }

  const queryParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const response = await fetch(
    `${API_URL}/api/stores/${storeSlug}/products?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )

  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch products')
  }

  // Match the response structure from your API
  return {
    products: data.data.products.map((product: any) => ({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    })),
    pagination: {
      total: data.data.total,
      page: data.data.page,
      totalPages: data.data.totalPages,
      hasMore: data.data.page < data.data.totalPages
    }
  }
} 