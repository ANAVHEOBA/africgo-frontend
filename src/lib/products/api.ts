import { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductFilters, 
  PaginatedProducts 
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Add request cache to prevent duplicate requests
const requestCache = new Map<string, Promise<any>>()

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed')
  }
  
  return data.data
}

// Get all products for the store
export async function getStoreProducts(filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (!token) {
    throw new Error('Authentication token not found')
  }

  const queryParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value.toString())
    }
  })

  const cacheKey = `products-${queryParams.toString()}`
  
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!
  }

  const request = fetch(
    `${API_URL}/api/products/store?${queryParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }
  )
  .then(async (response) => {
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token')
        throw new Error('Authentication token not found')
      }
      const errorData = await response.json()
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
  .then(data => {
    if (!data.success) {
      throw new Error(data.message || 'API request failed')
    }
    return data.data
  })
  .finally(() => {
    // Remove from cache after request is complete
    setTimeout(() => requestCache.delete(cacheKey), 0)
  })

  requestCache.set(cacheKey, request)
  return request
}

// Create a new product
export async function createProduct(productData: CreateProductData): Promise<Product> {
  // Log the request body for debugging
  console.log('Creating product with data:', productData)

  const response = await fetch(`${API_URL}/api/products/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(productData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error('API Error:', errorData)
    throw new Error(errorData.message || 'Failed to create product')
  }

  return handleResponse<Product>(response)
}

// Update an existing product
export async function updateProduct(productId: string, updateData: UpdateProductData): Promise<Product> {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(updateData)
  })

  return handleResponse<Product>(response)
}

// Delete a product
export async function deleteProduct(productId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  return handleResponse<void>(response)
}

// Get a single product by ID
export async function getProductById(productId: string): Promise<Product> {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })

  return handleResponse<Product>(response)
}

// Search products
export async function searchProducts(query: string, filters: ProductFilters = {}): Promise<PaginatedProducts> {
  const queryParams = new URLSearchParams({ query })
  
  if (filters.page) queryParams.append('page', filters.page.toString())
  if (filters.limit) queryParams.append('limit', filters.limit.toString())
  if (filters.category) queryParams.append('category', filters.category)

  const response = await fetch(
    `${API_URL}/api/products/search?${queryParams.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  )

  return handleResponse<PaginatedProducts>(response)
} 