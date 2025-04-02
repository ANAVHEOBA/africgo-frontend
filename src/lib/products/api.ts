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
    console.log('API - Products data received:', data); // Log the received products data
    if (!data.success) {
      throw new Error(data.message || 'API request failed')
    }
    console.log('API - Product images in response:', data.data.products?.map((p: Product) => p.images)); // Log images specifically
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
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Authentication token not found');

  const formData = new FormData();

  // Add basic fields
  formData.append('name', productData.name);
  formData.append('description', productData.description);
  formData.append('price', productData.price.toString());
  formData.append('category', productData.category);
  formData.append('stock', productData.stock.toString());

  // Handle images - Reverted to use 'images' key
  if (Array.isArray(productData.images)) {
    for (const image of productData.images) {
      try {
        if (image.url.startsWith('blob:')) {
          const response = await fetch(image.url);
          const blob = await response.blob();
          
          // Create a File object with the original filename
          const filename = image.alt || 'product-image.png';
          const file = new File([blob], filename, { type: blob.type });
          
          // --- REVERTED CHANGE: Append with 'images' key ---
          // This matches the standard and the working curl command
          formData.append('images', file); 
          
          // Debug log
          console.log('Appending image file:', filename, file.type, 'with key images'); // Updated log
        }
      } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Failed to process image');
      }
    }
  }

  // Add specifications
  if (productData.specifications) {
    Object.entries(productData.specifications).forEach(([key, value]) => {
      if (value) formData.append(`specifications[${key}]`, value);
    });
  }

  // Add variants
  if (Array.isArray(productData.variants)) {
    productData.variants.forEach((variant, index) => {
      formData.append(`variants[${index}][name]`, variant.name);
      variant.options.forEach((option, optIndex) => {
        formData.append(`variants[${index}][options][${optIndex}]`, option);
      });
      if (variant.prices) {
        variant.prices.forEach((price, priceIndex) => {
          formData.append(`variants[${index}][prices][${priceIndex}]`, price.toString());
        });
      }
    });
  }

  // Add other fields
  formData.append('isPublished', productData.isPublished.toString());
  formData.append('guestOrderEnabled', productData.guestOrderEnabled.toString());
  formData.append('minOrderQuantity', productData.minOrderQuantity.toString());
  formData.append('maxOrderQuantity', productData.maxOrderQuantity.toString());

  // Add shipping info
  if (productData.shippingInfo) {
    formData.append('shippingInfo[weight]', productData.shippingInfo.weight.toString());
    formData.append('shippingInfo[dimensions][length]', productData.shippingInfo.dimensions.length.toString());
    formData.append('shippingInfo[dimensions][width]', productData.shippingInfo.dimensions.width.toString());
    formData.append('shippingInfo[dimensions][height]', productData.shippingInfo.dimensions.height.toString());
    formData.append('shippingInfo[requiresSpecialHandling]', productData.shippingInfo.requiresSpecialHandling.toString());
  }

  // Debug: Log all FormData entries
  for (const [key, value] of formData.entries()) {
    console.log(`FormData: ${key} = ${value}`);
  }

  const targetUrl = `${API_URL}/api/products/create`;
  console.log('Sending create product request to:', targetUrl); // Log the target URL

  try { // Wrap the fetch call and response handling in a try block
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // No 'Content-Type' header needed for FormData; browser sets it with boundary
      },
      body: formData
    });

    // Attempt to get response body regardless of status for debugging
    let responseData;
    let responseText = '';
    try {
      // First try cloning and parsing as JSON, as it's the expected format
      const clonedResponse = response.clone(); 
      responseData = await clonedResponse.json();
      console.log('API Response Status:', response.status);
      console.log('API Response Data (JSON):', responseData);
    } catch (jsonError) {
      // If JSON fails, read as text (original response can only be read once)
      responseText = await response.text();
      console.log('API Response Status:', response.status);
      console.error('API Error: Response was not valid JSON. Text Response:', responseText);
      // Assign the text to responseData.message for consistent error handling below
      responseData = { message: `Server returned non-JSON response: ${responseText.substring(0, 200)}...` };
    }

    if (!response.ok) {
      // Log the detailed error from the backend if available in JSON or the text response
      console.error('API Error Details:', responseData || responseText);
      // Prioritize message from parsed JSON, fallback to generic message or text response
      throw new Error(responseData?.message || `Failed to create product. Status: ${response.status}`);
    }

    // Even if response.ok, check the success flag in the JSON data if it exists
    if (responseData && responseData.success === false) {
       console.error('API Error (Success False):', responseData);
       throw new Error(responseData.message || 'API request indicated failure but returned status 2xx');
    }
    
    // Assuming success if response.ok and no explicit success:false flag
    if (!responseData || !responseData.data) {
        console.error('API Error: Successful status but missing data in response:', responseData);
        throw new Error('API returned successful status but response format was unexpected.');
    }

    return responseData.data;

  } catch (error) { // Catch fetch errors or errors thrown from response handling
    console.error('Create Product Fetch/Processing Error:', error);
    // Re-throw the error to be caught by the form handler
    // Ensure the error message is informative
    if (error instanceof Error) {
        throw error; // Keep the specific error message from previous steps
    } else {
        throw new Error('An unknown error occurred during product creation.');
    }
  }
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

// Add this new function to get products by store slug
export async function getProductsByStore(storeSlug: string): Promise<PaginatedProducts> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (!token) {
    throw new Error('Authentication token not found')
  }

  const cacheKey = `store-products-${storeSlug}`
  
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!
  }

  const request = fetch(
    `${API_URL}/api/stores/${storeSlug}/products`,
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
        throw new Error('Authentication token expired')
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