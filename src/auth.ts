import { getServerSession } from 'next-auth'
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config'

export function auth() {
  return getServerSession(authConfig)
}
