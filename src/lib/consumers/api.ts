import { ConsumerProfile, UpdateProfileData } from "./types"

export async function getProfile(): Promise<ConsumerProfile> {
  const token = localStorage.getItem('token')
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