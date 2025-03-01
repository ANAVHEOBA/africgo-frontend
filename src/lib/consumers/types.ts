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