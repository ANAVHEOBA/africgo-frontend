import { 
  ConsumerProfile, 
  UpdateProfileData,
  AnalyticsOverview,
  OrderAnalytics,
  SpendingAnalytics,
  PreferencesAnalytics 
} from "./types"

export async function getProfile(): Promise<ConsumerProfile> {
  const token = localStorage.getItem('token')
  const userType = localStorage.getItem('userType')

  // Check if user is a consumer
  if (userType !== 'consumer') {
    throw new Error('Consumer access required')
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch profile')
  }
  return data.data
}

export async function updateProfile(profileData: UpdateProfileData): Promise<ConsumerProfile> {
  const token = localStorage.getItem('token')
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  })
  const data = await response.json()
  if (!data.success) {
    throw new Error(data.message || 'Failed to update profile')
  }
  return data.data
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/analytics/overview`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch analytics overview');
  }
  return data.data;
}

export async function getOrderAnalytics(timeframe: string = 'month'): Promise<OrderAnalytics> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/analytics/orders?timeframe=${timeframe}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch order analytics');
  }
  return data.data;
}

export async function getSpendingAnalytics(period: string = '6months'): Promise<SpendingAnalytics> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/analytics/spending?period=${period}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch spending analytics');
  }
  return data.data;
}

export async function getPreferencesAnalytics(): Promise<PreferencesAnalytics> {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/consumers/analytics/preferences`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch preferences analytics');
  }
  return data.data;
} 