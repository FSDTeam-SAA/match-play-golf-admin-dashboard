// ==================== FILE: types/auth.ts ====================
export interface User {
  _id: string
  email: string
  role: string
  profileImage?: string
}

export interface AuthData {
  accessToken: string
  refreshToken: string
  user: User
}

export interface AuthResponse {
  status: boolean
  message: string
  data: AuthData
}
