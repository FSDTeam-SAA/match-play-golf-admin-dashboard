'use client'

import { ActivityChart } from './activity-charts'
import { DashboardCards } from './dashboard-cards'
import { RecentTournaments } from './recent-tournaments'
import { RecentRegistrations } from './recents-players-regitration'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Cards */}
      <DashboardCards />

      {/* Activity Chart */}
      <ActivityChart />

      {/* Recent Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-6 pb-6">
        <RecentTournaments />
        <RecentRegistrations />
      </div>
    </div>
  )
}
