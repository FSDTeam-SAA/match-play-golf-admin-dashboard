// src/app/api/auth/[...nextauth]/auth.config.ts
import CredentialsProvider from 'next-auth/providers/credentials'
import type { AuthOptions } from 'next-auth'

export const authConfig: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          }
        )

        console.log('auth response: ', res)

        const data = await res.json()
        console.log('auth response data:', data)
        if (!res.ok || !data?.data) return null

        return {
          id: data.data.user._id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          profileImage: data.data.user.profileImage,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.role = user.role
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.profileImage = user.profileImage
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        profileImage: token.profileImage,
      }
      return session
    },
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
