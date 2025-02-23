import { 
  Product, 
  CreateProductData, 
  UpdateProductData, 
  ProductFilters, 
  PaginatedProducts 
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
  const queryParams = new URLSearchParams()
  
  if (filters.page) queryParams.append('page', filters.page.toString())
  if (filters.limit) queryParams.append('limit', filters.limit.toString())
  if (filters.category) queryParams.append('category', filters.category)
  if (filters.status) queryParams.append('status', filters.status)
  if (filters.search) queryParams.append('search', filters.search)

  const response = await fetch(
    `${API_URL}/api/products/store?${queryParams.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
  )

  return handleResponse<PaginatedProducts>(response)
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