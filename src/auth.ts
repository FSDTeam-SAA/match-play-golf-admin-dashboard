import { getServerSession } from 'next-auth'
import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config'

export function auth() {
  return getServerSession(authConfig)
}
<<<<<<< HEAD
=======

// import { getServerSession } from 'next-auth'
// import { authConfig } from '@/app/api/auth/[...nextauth]/auth.config'

// export function auth() {
//   return getServerSession(authConfig)
// }
>>>>>>> origin/main
