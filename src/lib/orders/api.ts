import { Order, CreateOrderData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://logistics-backend-1-s91j.onrender.com";

// Helper to safely access localStorage (only in browser)
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

export async function placeOrder(orderData: CreateOrderData): Promise<Order> {
  const token = getToken();
  
  if (!orderData.storeId) {
    throw new Error("Store ID is required");
  }
  
  console.log('API URL:', API_URL);
  console.log('Sending order to API:', JSON.stringify(orderData, null, 2));
  console.log('Authorization token exists:', !!token);
  
  try {
    const response = await fetch(`${API_URL}/api/orders/consumer/place-order`, {
      method: "POST",
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    
    console.log('API response status:', response.status);
    
    const data = await response.json();
    console.log('API response data:', JSON.stringify(data, null, 2));
    
    if (!data.success) {
      const errorMessage = data.message || "Failed to place order";
      console.error('API error details:', {
        message: data.message,
        errors: data.errors,
        data: data.data
      });
      throw new Error(errorMessage);
    }
    return data.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

interface PaginatedResponse<T> {
  success: boolean;
  data: {
    orders: T[];
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  message?: string;
}

interface OrdersQueryParams {
  page?: number;
  limit?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED';
  startDate?: string;
  endDate?: string;
}

export async function getOrders(params: OrdersQueryParams = {}): Promise<PaginatedResponse<Order>> {
  const token = getToken();
  
  // Build query string from params
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.status) queryParams.append('status', params.status);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  
  const queryString = queryParams.toString();
  const url = `${API_URL}/api/orders/consumer/orders${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store'
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch orders");
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
}

export async function getOrderById(orderId: string): Promise<Order> {
  const token = getToken();
  
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  
  console.log('Fetching order details with token:', !!token);
  console.log('Order ID:', orderId);
  
  try {
    const response = await fetch(
      `${API_URL}/api/orders/consumer/orders/${orderId}`,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: 'no-store'
      }
    );

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch order");
    }

    // Add validation for payment instructions
    if (!data.data.paymentInstructions) {
      console.warn('Order found but no payment instructions:', data.data);
    }

    return data.data;
  } catch (error) {
    console.error('Error in getOrderById:', error);
    throw error;
  }
}

export async function trackOrder(trackingNumber: string): Promise<Order> {
  try {
    const response = await fetch(
      `${API_URL}/api/orders/track/${trackingNumber}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store'
      }
    );

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to track order");
    }
    return data.data;
  } catch (error) {
    console.error('Order tracking error:', error);
    throw error;
  }
}

export async function confirmOrderPayment(
  orderId: string,
  amount: number
): Promise<Order> {
  const token = getToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  if (!amount || amount <= 0) {
    throw new Error('Valid payment amount is required');
  }
  
  try {
    console.log('Confirming payment for order:', orderId, 'amount:', amount);
    
    const response = await fetch(
      `${API_URL}/api/orders/consumer/mark-payment/${orderId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "BANK_TRANSFER",
          amount: amount
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to confirm payment');
    }

    const data = await response.json();
    console.log('Payment confirmation response:', data);

    if (!data.success) {
      throw new Error(data.message || "Failed to confirm payment");
    }
    
    return data.data.order;
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw error;
  }
}