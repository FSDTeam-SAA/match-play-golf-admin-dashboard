import type { Metadata } from 'next'
<<<<<<< HEAD
import { Inter } from 'next/font/google'
=======
import { Open_Sans } from 'next/font/google'
>>>>>>> origin/main
import './globals.css'
import { Providers } from './providers'
import { Toaster } from 'sonner'

<<<<<<< HEAD
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
=======
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
>>>>>>> origin/main
})

export const metadata: Metadata = {
  title: 'Golfko Dashboard',
  description:
    'Manage your matches, tournaments, and players all in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
<<<<<<< HEAD
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
=======
    <html lang="en" suppressHydrationWarning className={openSans.variable}>
      <body suppressHydrationWarning={true}>
>>>>>>> origin/main
        <Providers>{children}</Providers>
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
