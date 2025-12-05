export interface MonthlyActiveUsersResponse {
  status: boolean
  message: string
  data: MonthlyUserData[]
}

export interface MonthlyUserData {
  month: string
  totalUsers: number
}

export interface AdminDashboardResponse {
  status: boolean
  message: string
  data: AdminDashboardData
}

export interface AdminDashboardData {
  totalUsers: number
  totalMessages: number
  totalBlogs: number
  messages: AdminMessage[]
}

export interface AdminMessage {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  occupation: string
  message: string
  status: "New" | "Respond" | string
  createdAt: string
  updatedAt: string
}
