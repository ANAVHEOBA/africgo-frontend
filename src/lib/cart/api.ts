import { Cart, CartResponse, AddToCartData, UpdateCartItemData } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://logistics-backend-1-s91j.onrender.com";

// Helper to safely access localStorage (only in browser)
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper to get headers with authentication
const getHeaders = () => {
  const token = getToken();
  if (!token) {
    throw new Error("No authentication token found");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export async function getCart(): Promise<Cart> {
  try {
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: getHeaders(),
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

export async function addToCart(cartData: AddToCartData): Promise<Cart> {
  try {
    const response = await fetch(`${API_URL}/api/cart/items`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        productId: cartData.productId,
        quantity: cartData.quantity
      }),
    });

    const data: CartResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to add item to cart");
    }
    
    return data.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function updateCartItem(itemId: string, updateData: UpdateCartItemData): Promise<Cart> {
  try {
    const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });

    const data: CartResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to update cart item");
    }
    
    return data.data;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

export async function removeCartItem(itemId: string): Promise<Cart> {
  try {
    const response = await fetch(`${API_URL}/api/cart/items/${itemId}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const data: CartResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to remove cart item");
    }
    
    return data.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
}

export async function clearCart(): Promise<Cart> {
  try {
    const response = await fetch(`${API_URL}/api/cart`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    const data: CartResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.message || "Failed to clear cart");
    }
    
    return data.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
} 