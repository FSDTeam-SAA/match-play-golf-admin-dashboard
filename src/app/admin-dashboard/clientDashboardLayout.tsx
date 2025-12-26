// /admin-dashboard/client-layout.tsx
'use client'

import Sidebar from '@/components/Sidebar'
import UserHeader from '@/components/reusable/UserHeader'

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-[#F8F9FC] min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <UserHeader />
        <div className="flex-1 px-4 pt-4">{children}</div>
      </main>
    </div>
  )
}
