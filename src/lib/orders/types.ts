export interface OrderItem {
  productId: string;
  quantity: number;
  price?: number; // Add price field to OrderItem
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  recipientName: string;
  recipientPhone: string;
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
  items: [{
    productId: string;
    quantity: number;
  }];
  specialInstructions?: string;
  deliveryAddress: {
    type: string;
    manualAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      recipientName: string;
      recipientPhone: string;
    };
  };
  pickupAddress: {
    type: string;
    manualAddress: {
      street: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      recipientName: string;
      recipientPhone: string;
    };
  };
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  isFragile: boolean;
  isExpressDelivery: boolean;
  zoneId: string;  // This comes from the selected delivery zone
}