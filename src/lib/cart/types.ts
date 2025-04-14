export interface CartItem {
  _id: string;
  productId: string;
  storeId: string;
  storeSlug: string;
  name: string;
  price: number;
  quantity: number;
  variantData: Array<{
    name: string;
    value: string;
  }>;
  addedAt: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartResponse {
  success: boolean;
  data: Cart;
  message?: string;
} 