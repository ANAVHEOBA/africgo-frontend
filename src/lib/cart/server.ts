import { Cart, CartResponse } from "./types";
import { headers } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://logistics-backend-1-s91j.onrender.com";

export async function getServerCart(): Promise<Cart> {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader : `Bearer ${authHeader}`;
    
    console.log('Fetching cart with token:', !!token);
    
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: {
        ...(token ? { Authorization: token } : {}),
        "Content-Type": "application/json",
      },
      cache: 'no-store'
    });

    const data: CartResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch cart");
    }
    
    return data.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
} 