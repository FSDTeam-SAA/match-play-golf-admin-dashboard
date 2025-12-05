export interface Contract {
  _id: string
  fullName: string
  email: string
  phoneNumber: string
  occupation: string
  message: string
  status: "New" | "Respond" | "Pending" | string // optional extension if other statuses exist
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalData: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ContractsResponse {
  status: boolean
  message: string
  data: {
    contracts: Contract[]
    pagination: Pagination
  }
}
