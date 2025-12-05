export interface UserProfile {
  _id?: string
  name: string // backend এর name
  userName: string
  email: string
  businessName?: string
  phoneNumber?: string // backend এর phoneNumber
  dateOfBirth?: string // backend এর dateOfBirth
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say'
  addressLine1?: string // backend এর addressLine1
  addressLine2?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  profileImage?: string
  role?: 'admin' | 'user' | 'seller'
  verified?: boolean
  createdAt?: string
  updatedAt?: string
  password?: string
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}
