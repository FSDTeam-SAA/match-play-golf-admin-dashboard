import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ClientDashboardLayout from './clientDashboardLayout'

export const metadata = {
  title: 'Dashboard',
  description: 'Manage your products, orders, and customers all in one place.',
}

export default async function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Server-side authentication check
  if (!session?.user || session.user.role.toLowerCase() !== 'admin') {
    redirect('/signin')
  }

  return <ClientDashboardLayout>{children}</ClientDashboardLayout>
}
