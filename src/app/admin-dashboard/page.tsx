import { auth } from '@/auth'
import { redirect } from 'next/navigation'
// import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await auth()
  console.log('users role::', session)

  if (!session?.user?.accessToken) {
  return redirect('/signin')
}
 

return (
  <div>
    <h2>dashboard overview</h2>
  </div>
)

}
