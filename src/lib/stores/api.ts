import { Store, StoreFilters, PaginatedStores, ProductFilters, PaginatedProducts, StoreRating, CreateStoreRatingData, PaginatedStoreOrders, StoreOrder, StoreDashboardData } from './types'

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

export async function getStoreOrders(page: number = 1, limit: number = 10): Promise<PaginatedStoreOrders> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(
      `${API_URL}/api/stores/orders?page=${page}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch store orders');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching store orders:', error);
    throw error;
  }
}

export async function getStoreOrderById(orderId: string): Promise<StoreOrder> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(
      `${API_URL}/api/stores/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch order details');
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
}

export async function markOrderAsReady(orderId: string): Promise<StoreOrder> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(
      `${API_URL}/api/stores/orders/${orderId}/ready`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to mark order as ready');
    }

    return data.data;
  } catch (error) {
    console.error('Error marking order as ready:', error);
    throw error;
  }
}

export async function getStoreDashboard(): Promise<StoreDashboardData> {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await fetch(
      `${API_URL}/api/stores/dashboard`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to fetch dashboard data');
    }

    // Format numbers to ensure they're all numeric
    const formattedData = {
      ...data.data,
      stats: {
        ...data.data.stats,
        revenue: {
          ...data.data.stats.revenue,
          total: Number(data.data.stats.revenue.total),
          today: Number(data.data.stats.revenue.today),
          yesterday: Number(data.data.stats.revenue.yesterday),
          thisWeek: Number(data.data.stats.revenue.thisWeek),
          thisMonth: Number(data.data.stats.revenue.thisMonth),
          dailyAverage: Number(data.data.stats.revenue.dailyAverage)
        }
      }
    };

    return formattedData;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
} 