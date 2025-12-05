// ============================================
// 📄 src/lib/types/team.types.ts
// ============================================

export interface TeamMember {
  _id: string
  memberName: string
  designation: string
  image: string
  description: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface TeamResponse {
  success: boolean
  count: number
  data: TeamMember[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleTeamResponse {
  success: boolean
  data: TeamMember
}

export interface TeamFormData {
  memberName: string
  designation: string
  description: string
  image: File | string
}
