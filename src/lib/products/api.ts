import { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductFilters, 
  PaginatedProducts 
} from './types'
import { tokenStorage } from '@/lib/auth/tokenStorage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Add request cache to prevent duplicate requests
const requestCache = new Map<string, Promise<any>>()

// Helper function to get auth headers
function getAuthHeaders() {
  const token = tokenStorage.getToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }
  
  return {
    'Authorization': `Bearer ${token.trim()}`,
    'Content-Type': 'application/json'
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.clearToken()
      throw new Error('Authentication required')
    }
    throw new Error(data.message || 'API request failed')
  }
  
  // Make sure we're returning the data property from the response
  return data.data as T
}

// Get all products for the merchant's store
export async function getStoreProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  try {
    const token = tokenStorage.getToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const queryParams = new URLSearchParams()
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })

    // First get the merchant's store
    const storeResponse = await fetch(`${API_URL}/api/stores/my-store`, {
      headers: getAuthHeaders(),
    })

    const storeData = await handleResponse<{ _id: string; slug: string }>(storeResponse)
    
    if (!storeData || !storeData.slug) {
      throw new Error('Store not found')
    }

    // Then get the store's products using the store slug
    const response = await fetch(
      `${API_URL}/api/stores/${storeData.slug}/products?${queryParams.toString()}`,
      {
        headers: getAuthHeaders(),
        cache: 'no-store',
      }
    )

    const data = await handleResponse<PaginatedProducts>(response)
    return data

  } catch (error) {
    console.error('Get store products error:', error)
    throw error
  }
}

// Create a new product
export async function createProduct(productData: CreateProductData): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/api/products/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    })

    return handleResponse<Product>(response)
  } catch (error) {
    console.error('Create product error:', error)
    throw error
  }
}

// Update an existing product
export async function updateProduct(productId: string, updateData: UpdateProductData): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    })

    return handleResponse<Product>(response)
  } catch (error) {
    console.error('Update product error:', error)
    throw error
  }
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    return handleResponse<void>(response)
  } catch (error) {
    console.error('Delete product error:', error)
    throw error
  }
}

// Get a single product by ID
export async function getProductById(productId: string): Promise<Product> {
  try {
    const response = await fetch(`${API_URL}/api/products/${productId}`, {
      headers: getAuthHeaders()
    })

    return handleResponse<Product>(response)
  } catch (error) {
    console.error('Get product error:', error)
    throw error
  }
}

// Search products
export async function searchProducts(query: string, filters: ProductFilters = {}): Promise<PaginatedProducts> {
  try {
    const queryParams = new URLSearchParams({ query })
    
    if (filters.page) queryParams.append('page', filters.page.toString())
    if (filters.limit) queryParams.append('limit', filters.limit.toString())
    if (filters.category) queryParams.append('category', filters.category)

    const response = await fetch(
      `${API_URL}/api/products/search?${queryParams.toString()}`,
      {
        headers: getAuthHeaders()
      }
    )

    return handleResponse<PaginatedProducts>(response)
  } catch (error) {
    console.error('Search products error:', error)
    throw error
  }
}

// Get products by store slug
export async function getProductsByStore(storeSlug: string): Promise<PaginatedProducts> {
  try {
    const cacheKey = `store-products-${storeSlug}`
    
    if (requestCache.has(cacheKey)) {
      return requestCache.get(cacheKey)!
    }

    const response = await fetch(
      `${API_URL}/api/stores/${storeSlug}/products`,
      {
        headers: getAuthHeaders(),
        cache: 'no-store',
      }
    )

    const data = await handleResponse<PaginatedProducts>(response)
    requestCache.set(cacheKey, Promise.resolve(data))
    return data

  } catch (error) {
    console.error('Get store products error:', error)
    throw error
  }
} 