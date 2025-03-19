const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface Zone {
  _id: string;
  name: string;
  deliveryPrice: number;
  description: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getDeliveryZones(): Promise<Zone[]> {
  console.log('Fetching zones from:', `${API_URL}/api/zones/active`);
  
  const response = await fetch(`${API_URL}/api/zones/active`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  console.log('Zones response:', data);
  
  if (!data.success) {
    throw new Error(data.message || 'Failed to fetch delivery zones');
  }
  return data.data;
} 