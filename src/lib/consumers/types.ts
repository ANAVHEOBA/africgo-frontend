export interface ConsumerProfile {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

// New Analytics Types
export interface AnalyticsOverview {
  totalOrders: number;
  totalSpent: number;
  favoriteStore: {
    storeName: string;
    orderCount: number;
  };
  mostOrderedProduct: {
    productName: string;
    orderCount: number;
  };
  recentActivity: {
    lastOrderDate: string;
  };
}

export interface OrderAnalytics {
  totalOrders: number;
  ordersByStatus: {
    DELIVERED: number;
    PENDING: number;
    IN_TRANSIT: number;
    READY_FOR_PICKUP: number;
    CONFIRMED: number;
  };
  averageOrderValue: number;
  orderFrequency: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  packageSizeDistribution: {
    MEDIUM: number;
    SMALL: number;
  };
}

export interface SpendingAnalytics {
  totalSpent: number;
  monthlySpending: Array<{
    month: string;
    amount: number;
    orderCount: number;
  }>;
  averageMonthlySpend: number;
  paymentMethods: Array<{
    method: string | null;
    count: number;
    total: number;
  }>;
  deliveryFees: {
    total: number;
    average: number;
  };
}

export interface PreferencesAnalytics {
  favoriteStores: Array<{
    storeId: string;
    orderCount: number;
    totalSpent: number;
    lastOrderDate: string;
  }>;
  categoryPreferences: Array<{
    category: string;
    orderCount: number;
    totalSpent: number;
  }>;
  deliveryPreferences: {
    commonAddresses: Array<{
      address: string;
      useCount: number;
    }>;
    expressDeliveryRate: number;
    preferredPackageSizes: Array<{
      size: string;
      count: number;
    }>;
  };
  productPreferences: Array<{
    productId: string;
    productName: string;
    orderCount: number;
    lastOrdered: string;
  }>;
} 