import { Order, CreateOrderData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Helper to safely access localStorage (only in browser)
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

export async function placeOrder(orderData: CreateOrderData): Promise<Order> {
  const token = getToken();
  
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
      console.error('API error details:', {
        message: data.message,
        errors: data.errors,
        data: data.data
      });
      throw new Error(data.message || "Failed to place order");
    }
    return data.data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
}

export async function getOrders(): Promise<Order[]> {
  const token = getToken();
  const response = await fetch(`${API_URL}/api/orders/consumer/orders`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store'
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch orders");
  }
  return data.data;
}

export async function getOrderById(orderId: string): Promise<Order> {
  const token = getToken();
  
  if (!orderId) {
    throw new Error("Order ID is required");
  }
  
  const response = await fetch(
    `${API_URL}/api/orders/consumer/orders/${orderId}`,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store'
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch order");
  }
  return data.data;
}