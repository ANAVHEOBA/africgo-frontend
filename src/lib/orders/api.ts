import { Order, CreateOrderData } from "./types";
import { tokenStorage } from '@/lib/auth/tokenStorage';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://logistics-backend-1-s91j.onrender.com";

// Helper function to get auth headers
function getAuthHeaders() {
  const token = tokenStorage.getToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }
  
  // Log the headers being sent
  const headers = {
    'Authorization': `Bearer ${token.trim()}`,
    'Content-Type': 'application/json'
  }
  console.log('Request headers:', headers)
  return headers
}

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.clearToken()
      throw new Error('Authentication required')
    }
    throw new Error(data.message || 'API request failed')
  }
  
  return data.data as T
}

export async function placeOrder(orderData: CreateOrderData): Promise<Order> {
  try {
    const response = await fetch(`${API_URL}/api/orders/consumer/place-order`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    
    return handleResponse<Order>(response);
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    console.log('Fetching orders from:', `${API_URL}/api/orders/consumer/orders`)
    
    const headers = getAuthHeaders()
    const response = await fetch(`${API_URL}/api/orders/consumer/orders`, {
      headers,
      cache: 'no-store'
    });

    console.log('Orders response status:', response.status)
    const data = await response.json()
    console.log('Orders response data:', data)

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch orders')
    }

    // The API returns { data: { orders: [...] } }
    if (data.data && Array.isArray(data.data.orders)) {
      console.log('Parsed orders:', data.data.orders)
      return data.data.orders
    }

    console.warn('Unexpected response format:', data)
    return []
  } catch (error) {
    console.error('Error fetching orders:', error)
    throw error
  }
}

export async function getOrderById(orderId: string): Promise<Order> {
  const token = tokenStorage.getToken();
  
  if (!token) {
    throw new Error("Authentication required");
  }
  
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  
  try {
    const response = await fetch(
      `${API_URL}/api/orders/consumer/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        cache: 'no-store'
      }
    );

    return handleResponse<Order>(response);
  } catch (error) {
    console.error("Error fetching order:", error);
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

export async function confirmOrderPayment(orderId: string, amount: number): Promise<Order> {
  const token = tokenStorage.getToken();
  
  if (!amount || amount <= 0) {
    console.error('Invalid payment amount:', amount);
    throw new Error("Valid payment amount is required");
  }
  
  try {
    console.log('Confirming payment:', { orderId, amount });
    
    const response = await fetch(
      `${API_URL}/api/orders/consumer/mark-payment/${orderId}`,
      {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod: "BANK_TRANSFER",
          amount: amount
        }),
      }
    );

    const data = await response.json();
    console.log('Payment confirmation response:', data);

    if (!data.success) {
      throw new Error(data.message || "Failed to confirm payment");
    }
    
    if (!data.data.order) {
      console.error('Invalid response format:', data);
      throw new Error("Invalid response from server");
    }
    
    return data.data.order;
  } catch (error) {
    console.error('Payment confirmation error:', error);
    throw error;
  }
}