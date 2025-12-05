import type { ReactNode } from 'react'
import Sidebar from '@/components/Sidebar'
import '../globals.css'
import UserHeader from '@/components/reusable/UserHeader'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Dashboard',
  description: 'Manage your products, orders, and customers all in one place.',
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await auth()

  if (!session?.user || session?.user?.role.toLowerCase() !== 'admin') {
    redirect('/signin')
  }

  console.log('admin-dashboard session:', session)

  return (
    <div className="bg-[#F8F9FC] min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <UserHeader />

        {/* Page Content */}
        <div className="flex-1 px-8 pt-4">{children}</div>
      </main>
    </div>
  )
}
