'use client'

import { usePathname } from 'next/navigation'

export default function UserHeader() {
  const pathname = usePathname()

  const getPageContent = () => {
    const rules = [
      {
        match: ['/admin-dashboard', '/admin-dashboard'],
        title: 'Welcome back, Michael',
        desc: 'Ready to compete in your next match?',
      },
      {
        match: ['/admin-dashboard/grant-management'],
        title: 'Grants Management',
        desc: 'Manage all grants in the system.',
      },
      {
        match: ['/admin-dashboard/user-management'],
        title: 'User Management',
        desc: 'Manage all users and their subscription details.',
      },
      {
        match: ['/admin-dashboard/calendar'],
        title: 'Grant Calendar',
        desc: 'Track deadlines and saved grants easily.',
      },
      {
        match: ['/admin-dashboard/subscription/recent-transactions'],
        title: 'Transactions Management',
        desc: 'Manage and view transaction history.',
      },
      {
        match: [
          '/admin-dashboard/subscription',
          '/admin-dashboard/subscription-management',
        ],
        title: 'Subscription Management',
        desc: 'Manage subscription plans and view history.',
      },
      {
        match: ['/admin-dashboard/contact-management'],
        title: 'Contact Management',
        desc: 'Manage user messages and inquiries.',
      },
      {
        match: ['/admin-dashboard/settings'],
        title: 'Settings',
        desc: 'Customize your preferences and dashboard settings.',
      },
    ]

    for (const rule of rules) {
      if (rule.match.some(path => pathname.includes(path))) {
        return [rule.title, rule.desc]
      }
    }

    return ['Dashboard', 'Manage your system efficiently.']
  }

  const [title, description] = getPageContent()

  return (
    <header className="bg-white px-8 py-[13px] flex flex-col space-y-1 justify-center">
      <h1 className="text-[22px] font-semibold text-[#0C2661]">{title}</h1>
      <p className="text-sm text-gray-600">{description}</p>
    </header>
  )
}
