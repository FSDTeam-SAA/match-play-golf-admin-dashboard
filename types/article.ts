// 📄 src/lib/types/article.types.ts

export interface Article {
  _id: string
  title: string
  description: string
  type: string
<<<<<<< HEAD
  status: string
=======
>>>>>>> origin/main
  coverImage: string
  createdBy: {
    _id: string
    fullName: string
    role: string
    profileImage: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ArticlesResponse {
  success: boolean
  message: string
  data: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface SingleArticleResponse {
  success: boolean
  message: string
  data: Article
}

export interface ArticleFormData {
  title: string
  description: string
  type: string
<<<<<<< HEAD
  status: string
=======
>>>>>>> origin/main
  coverImage: File | string
}
