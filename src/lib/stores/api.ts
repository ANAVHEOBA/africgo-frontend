import { Store, StoreFilters, PaginatedStores, ProductFilters, PaginatedProducts, StoreRating, CreateStoreRatingData } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    console.error('API Error:', {
      status: response.status,
      data
    })
    throw new Error(data.message || 'API request failed')
  }
  
  return data.data
}

// Get all stores with optional filters
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
  if (!slug) {
    throw new Error('Store slug is required')
  }

  console.log('Making API request to:', `${API_URL}/api/stores/${slug}`) // Debug log

  const response = await fetch(
    `${API_URL}/api/stores/${slug}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  const data = await response.json()
  console.log('API Response:', data) // Debug log

  if (!response.ok) {
    console.error('API Error:', {
      status: response.status,
      data
    })
    throw new Error(data.message || 'API request failed')
  }
  
  return data.data.store // Make sure we're accessing the correct path
}

// Get store products
export async function getStoreProducts(
  storeSlug: string, 
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  const queryParams = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const response = await fetch(
    `${API_URL}/api/stores/${storeSlug}/products?${queryParams.toString()}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch products')
  }

  return {
    products: data.data.products.map((product: any) => ({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock)
    })),
    pagination: {
      total: data.data.total,
      page: data.data.page,
      totalPages: data.data.totalPages,
      hasMore: data.data.page < data.data.totalPages
    }
  }
}

export async function rateStore(ratingData: CreateStoreRatingData): Promise<StoreRating> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${API_URL}/api/consumers/rate-store`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ratingData),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to rate store')
  }
  return data.data
} 