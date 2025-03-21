import { Store, StoreFilters, PaginatedStores, ProductFilters, PaginatedProducts, StoreRating, CreateStoreRatingData, StoreOrder, PaginatedStoreOrders } from './types'
import { tokenStorage } from '@/lib/auth/tokenStorage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Helper function to safely access localStorage
function getLocalStorage() {
  if (typeof window !== 'undefined') {
    return window.localStorage
  }
  return null
}

// Helper function to get auth headers
function getAuthHeaders() {
  const token = tokenStorage.getToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    if (response.status === 401) {
      // Clear invalid token
      tokenStorage.clearToken()
      throw new Error('Authentication required')
    }
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

  console.log('Making API request to:', `${API_URL}/api/stores/${slug}`)

  const response = await fetch(
    `${API_URL}/api/stores/${slug}`,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  const data = await response.json()
  console.log('API Response:', data)

  if (!response.ok || !data.success) {
    console.error('API Error:', {
      status: response.status,
      data
    })
    throw new Error(data.message || 'API request failed')
  }
  
  // Handle both response formats (direct store or nested store object)
  const storeData = data.data.store || data.data
  if (!storeData) {
    throw new Error('Invalid store data received')
  }
  
  return storeData
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
  const response = await fetch(`${API_URL}/api/consumers/rate-store`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(ratingData),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to rate store')
  }
  return data.data
}

// Get store orders
export async function getStoreOrders(page = 1, limit = 10): Promise<PaginatedStoreOrders> {
  const response = await fetch(
    `${API_URL}/api/stores/orders?page=${page}&limit=${limit}`,
    {
      headers: getAuthHeaders(),
      credentials: 'include'
    }
  )
  return handleResponse<PaginatedStoreOrders>(response)
}

// Get single store order
export async function getStoreOrder(orderId: string): Promise<StoreOrder> {
  const response = await fetch(
    `${API_URL}/api/stores/orders/${orderId}`,
    {
      headers: getAuthHeaders(),
      credentials: 'include'
    }
  )
  return handleResponse<StoreOrder>(response)
}

// Mark order as ready for pickup
export async function markOrderAsReady(orderId: string): Promise<StoreOrder> {
  const response = await fetch(
    `${API_URL}/api/stores/orders/${orderId}/ready`,
    {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include'
    }
  )
  return handleResponse<StoreOrder>(response)
} 