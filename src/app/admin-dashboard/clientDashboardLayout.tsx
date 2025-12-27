// /admin-dashboard/client-layout.tsx
'use client'

import Sidebar from '@/components/Sidebar'
import UserHeader from '@/components/UserHeader'

export default function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      suppressHydrationWarning
      className="bg-[#F8F9FC] min-h-screen flex overflow-hidden"
    >
      {/* Sidebar (fixed height, no scroll) */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header (fixed) */}
        <div className="shrink-0">
          <UserHeader />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-4">{children}</div>
      </main>
    </div>
  )
}
