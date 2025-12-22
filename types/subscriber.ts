// 📄 types/subscriber.ts

export interface Subscriber {
  _id: string
  email: string
  createdAt: string
  updatedAt: string
  __v?: number
}

export interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface SubscribersResponse {
  status: boolean
  message: string
  data: {
    subscribers: Subscriber[]
    pagination: PaginationData
  }
}

export interface SingleSubscriberResponse {
  status: boolean
  message: string
  data: Subscriber
}

export interface BroadcastEmailPayload {
  subject: string
  html: string
}

export interface SpecificEmailPayload {
  email: string
  subject: string
  html: string
}
