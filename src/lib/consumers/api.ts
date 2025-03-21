import { ConsumerProfile, UpdateProfileData } from "./types"
import { tokenStorage } from '@/lib/auth/tokenStorage'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

// Helper function to get auth headers
function getAuthHeaders() {
  const token = tokenStorage.getToken()
  
  if (!token) {
    throw new Error('Authentication required')
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json()
  
  if (!response.ok) {
    if (response.status === 401) {
      tokenStorage.clearToken()
      throw new Error('Authentication required')
    }
    throw new Error(data.message || 'API request failed')
  }
  
  return data.data
}

export async function getProfile(): Promise<ConsumerProfile> {
  try {
    const response = await fetch(
      `${API_URL}/api/consumers/profile`, 
      {
        headers: getAuthHeaders(),
      }
    )
    return handleResponse(response)
  } catch (error) {
    console.error('Get profile error:', error)
    throw error
  }
}

export async function updateProfile(profileData: UpdateProfileData): Promise<ConsumerProfile> {
  try {
    const response = await fetch(
      `${API_URL}/api/consumers/profile`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      }
    )
    return handleResponse(response)
  } catch (error) {
    console.error('Update profile error:', error)
    throw error
  }
} 