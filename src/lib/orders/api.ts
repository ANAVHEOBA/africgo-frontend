import { Order, CreateOrderData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function placeOrder(orderData: CreateOrderData): Promise<Order> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/orders/consumer/place-order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to place order");
  }
  return data.data;
}

export async function getOrders(): Promise<Order[]> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_URL}/api/orders/consumer/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch orders");
  }
  return data.data;
}

export async function getOrderById(orderId: string): Promise<Order> {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_URL}/api/orders/consumer/orders/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch order");
  }
  return data.data;
}
