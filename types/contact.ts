// ============================================
// 📄 src/lib/types/contact.types.ts
// ============================================

export interface Contact {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  consent: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ContactsResponse {
  success: boolean
  message: string
  data: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleContactResponse {
  success: boolean
  message: string
  data: Contact
}
