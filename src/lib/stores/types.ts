import { ProductStatus } from '@/lib/products/types'

export interface Store {
  _id: string
  storeName: string
  description: string
  category: string
  status: string
  slug: string
  storeUrl: string
  contactInfo: {
    email: string
    phone: string
    whatsapp: string
  }
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  socialLinks?: {
    instagram: string
    facebook: string
  }
  businessInfo?: {
    registrationNumber: string
  }
  settings: {
    isVerified: boolean
    isFeaturedStore: boolean
    allowRatings: boolean
    isActive: boolean
  }
  metrics: {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
  }
  createdAt: string
  updatedAt: string
  image?: {
    url: string
    publicId: string
  }
  logo?: string
  coverImage?: string
  rating?: number
  reviewCount?: number
}

export interface StoreFilters {
  page?: number
  limit?: number
  category?: string
  city?: string
  state?: string
  country?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  minRating?: number
}

export interface PaginatedStores {
  stores: Store[]
  pagination: {
    total: number
    page: number
    totalPages: number
    hasMore: boolean
  }
}

export interface ProductFilters {
  page?: number
  limit?: number
  category?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

interface ShippingDimensions {
  length: number
  width: number
  height: number
}

interface ShippingInfo {
  dimensions: ShippingDimensions
  weight: number
  requiresSpecialHandling: boolean
}

export interface Product {
  _id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  storeId: string
  stock: number
  status: ProductStatus
  isPublished: boolean
  createdAt: Date | string
  updatedAt: Date | string
  guestOrderEnabled: boolean
  minOrderQuantity: number
  maxOrderQuantity: number
  specifications?: {
    material?: string
    size?: string
    color?: string
  }
  variants?: Array<any>
  shippingInfo?: ShippingInfo
}

export interface PaginatedProducts {
  products: Product[]
  pagination: {
    total: number
    page: number
    totalPages: number
    hasMore: boolean
  }
}

export interface StoreRating {
  _id: string;
  consumerId: string;
  storeId: string;
  rating: number;
  review: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreRatingData {
  storeId: string;
  rating: number;
  review: string;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'CANCELLED' 
  | 'FAILED_DELIVERY';

export interface StoreOrder {
  _id: string;
  orderId: string;
  trackingNumber: string;
  status: OrderStatus;
  paymentStatus: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  price: number;
  isExpressDelivery: boolean;
  requiresSpecialHandling: boolean;
  estimatedDeliveryDate: string;
  estimatedWeight: number;
  deliveryZone: string;
  zonePrice: number;
  items: Array<{
    productId: string;
    storeId: string;
    quantity: number;
    price: number;
    productName: string;
    productImage: string[];
    variantData?: Array<{
      name: string;
      value: string;
      _id: string;
    }>;
    _id: string;
  }>;
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
      recipientEmail: string;
    };
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    recipientName: string;
    recipientPhone: string;
    recipientEmail: string;
  };
  specialInstructions: string | null;
  isFragile: boolean;
  packageSize: 'SMALL' | 'MEDIUM' | 'LARGE';
}

export interface PaginatedStoreOrders {
  orders: StoreOrder[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface StoreDashboardStats {
  revenue: {
    total: number;
    today: number;
    yesterday: number;
    thisWeek: number;
    thisMonth: number;
    dailyAverage: number;
  };
  orders: number;
}

export interface StoreDashboardData {
  stats: StoreDashboardStats;
  recentOrders: StoreOrder[];
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    revenue: number;
  }>;
}

export interface StoreCustomer {
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  consumerId: string | null;
  name: string | null;
  email: string | null;
}

export interface PaginatedStoreCustomers {
  customers: StoreCustomer[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StoreAddress {
  _id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreAddressData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
}

export interface UpdateStoreAddressData extends CreateStoreAddressData {
  addressId: string;
}

export interface Address {
  _id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressData {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  label: string;
}

export interface UpdateAddressData extends Partial<CreateAddressData> {
  addressId: string;
}

export interface StoreImage {
  url: string;
  publicId: string;
}

export interface StoreImageUploadResponse {
  success: boolean;
  data: {
    image: StoreImage;
  };
}

export interface UpdateStoreData {
  storeName?: string;
  description?: string;
  category?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
  businessInfo?: {
    registrationNumber?: string;
  };
  logo?: string;
}

export interface StorePaymentDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
}

export interface UpdatePaymentDetailsData {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
} 