export interface OrderItem {
  productId: string;
  storeId: string;
  quantity: number;
  price: number;
  variantData: any[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  recipientName?: string;
  recipientPhone?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  pickupAddress: Address;
  deliveryAddress: Address;
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';
  price: number;
  isFragile: boolean;
  isExpressDelivery: boolean;
  requiresSpecialHandling: boolean;
  specialInstructions?: string;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  storeId: string;
  items: { productId: string; quantity: number; }[];
  deliveryAddress: {
    type: 'manual';
    manualAddress: Address;
  };
  pickupAddress: {
    type: 'manual';
    manualAddress: Address;
  };
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  isFragile: boolean;
  isExpressDelivery: boolean;
  requiresSpecialHandling: boolean;
  specialInstructions?: string;
} 