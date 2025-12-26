import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DashboardPage from './_components/dashboard-overview'
// import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  console.log('users role::', session)

  if (!session?.user?.accessToken) {
    return redirect('/signin')
  }

  return (
    <>
      <DashboardPage />
    </>
  )
}
