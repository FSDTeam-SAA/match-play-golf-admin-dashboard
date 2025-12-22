'use client'

import { usePathname } from 'next/navigation'

export default function UserHeader() {
  const pathname = usePathname()

  const getPageContent = () => {
    const rules = [
      // 🎯 Exact match — dashboard home only
      {
        exact: ['/admin-dashboard', '/admin-dashboard/'],
        title: 'Welcome back, Michael',
        desc: 'Ready to compete in your next match?',
      },

      {
        match: ['/admin-dashboard/contact'],
        title: 'Contact Management',
        desc: 'Manage user messages and inquiries.',
      },
      {
        match: ['/admin-dashboard/settings'],
        title: 'Profile & Settings',
        desc: 'Manage your account information and preferences.',
      },
      {
        match: ['/admin-dashboard/subscriber-management'],
        title: 'Subscriber Management',
        desc: 'Manage your subscribers.',
      },
    ]

    // First check exact matches
    for (const rule of rules) {
      if (rule.exact && rule.exact.includes(pathname)) {
        return [rule.title, rule.desc]
      }
    }

    // Then check startsWith matches
    for (const rule of rules) {
      if (rule.match && rule.match.some(path => pathname.startsWith(path))) {
        return [rule.title, rule.desc]
      }
    }

    // fallback
    return ['Dashboard', 'Manage your system efficiently.']
  }

  const [title, description] = getPageContent()

  return (
    <header className="bg-white px-8 py-[13px] flex flex-col space-y-1">
      <h1 className="text-[22px] font-semibold text-[#0C2661]">{title}</h1>
      <p className="text-sm text-gray-600">{description}</p>
    </header>
  )
}
