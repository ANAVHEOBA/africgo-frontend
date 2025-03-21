export interface OrderItem {
  _id: string;
  productId: string;
  storeId: string;
  quantity: number;
  price: number;
  variantData?: Array<{
    name: string;
    value: string;
    _id: string;
  }>;
}

export interface Address {
  type?: string;
  manualAddress?: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail?: string;
  };
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
}

export interface PaymentInstructions {
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  amount: number;
  deliveryFee: number;
  subtotal: number;
  currency: string;
  instructions: string;
  paymentReference?: string;
  paymentStatus?: 'PENDING' | 'CONFIRMED' | 'FAILED';
  paymentDate?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  pickupAddress: Address;
  deliveryAddress: Address;
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  status: 'PENDING' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED';
  price: number;
  isFragile: boolean;
  isExpressDelivery: boolean;
  requiresSpecialHandling: boolean;
  specialInstructions?: string;
  deliveryZone?: string;
  zonePrice?: number;
  trackingNumber: string;
  estimatedWeight?: number;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
  paymentInstructions?: PaymentInstructions;
}

export interface CreateOrderData {
  storeId: string;
  items: [{
    productId: string;
    quantity: number;
    variantData?: Array<{
      name: string;
      value: string;
    }>;
  }];
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
      recipientEmail?: string;
    };
  };
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
  isFragile: boolean;
  isExpressDelivery: boolean;
  specialInstructions?: string;
  zoneId: string;
  paymentMethod: 'BANK_TRANSFER';
}