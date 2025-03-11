const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Zone {
  _id: string;
  name: string;
  deliveryPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getDeliveryZones(): Promise<Zone[]> {
  const response = await fetch(`${API_URL}/api/zones`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch delivery zones');
  }
  return data.data;
} 