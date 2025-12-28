'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

/**
 * Header rule type
 */
type HeaderRule = {
  title: string
  desc: string
  showBack: boolean
  backPath?: string
  exact?: string[]
  match?: string[]
}

export default function UserHeader() {
  const pathname = usePathname()
  const router = useRouter()

  /**
   * Header rules
   */
  const rules: HeaderRule[] = [
    // Dashboard Home
    {
      exact: ['/admin-dashboard', '/admin-dashboard/'],
      title: 'Welcome back, Michael',
      desc: 'Ready to compete in your next match?',
      showBack: false,
    },

    // Contact Management
    {
      match: ['/admin-dashboard/contact'],
      title: 'Contact Management',
      desc: 'Manage user messages and inquiries.',
      showBack: false,
    },

    // Settings
    {
      match: ['/admin-dashboard/settings'],
      title: 'Profile & Settings',
      desc: 'Manage your account information and preferences.',
      showBack: false,
    },

    // Subscriber Management
    {
      match: ['/admin-dashboard/subscriber-management'],
      title: 'Subscriber Management',
      desc: 'Manage your subscribers.',
      showBack: false,
    },

    // Tournaments Management (Main)
    {
      exact: ['/admin-dashboard/tournaments-management'],
      title: 'Tournaments Management',
      desc: 'Manage all golf tournaments.',
      showBack: false,
    },

    // Create Tournament
    {
      exact: ['/admin-dashboard/tournaments-management/create-tournament'],
      title: 'Create Tournament',
      desc: 'Create and manage a new tournament.',
      showBack: true,
      backPath: '/admin-dashboard/tournaments-management',
    },

    // Tournament Details (Dynamic ID support)
    {
      match: ['/admin-dashboard/tournaments-management/'],
      title: 'Tournament Details',
      desc: 'View and manage tournament information.',
      showBack: true,
      backPath: '/admin-dashboard/tournaments-management',
    },

    // Players Management
    {
      exact: ['/admin-dashboard/players-management'],
      title: 'Players Management',
      desc: 'Manage all registered players.',
      showBack: false,
    },

    // Matches Management
    {
      exact: ['/admin-dashboard/matches-management'],
      title: 'Matches Management',
      desc: 'Manage all tournament matches.',
      showBack: false,
    },

    // Team Management
    {
      exact: ['/admin-dashboard/team-management'],
      title: 'Team Management',
      desc: 'Manage all teams.',
      showBack: false,
    },

    // Article Management
    {
      exact: ['/admin-dashboard/article-management'],
      title: 'Article Management',
      desc: 'Manage articles and content.',
      showBack: false,
    },
  ]

  /**
   * Get page content based on pathname
   */
  const getPageContent = (): HeaderRule => {
    // Exact match first
    for (const rule of rules) {
      if (rule.exact && rule.exact.includes(pathname)) {
        return rule
      }
    }

    // startsWith match for dynamic routes
    for (const rule of rules) {
      if (rule.match && rule.match.some((path) => pathname.startsWith(path))) {
        return rule
      }
    }

    // Fallback
    return {
      title: 'Dashboard',
      desc: 'Manage your system efficiently.',
      showBack: false,
    }
  }

  const { title, desc, showBack, backPath } = getPageContent()

  const handleBack = () => {
    if (backPath) {
      router.push(backPath)
    } else {
      router.back()
    }
  }

  return (
    <header className="bg-white px-8 py-[13px] flex items-center space-x-4">
      {showBack && (
        <button
          onClick={handleBack}
          className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} className="text-[#0C2661]" />
        </button>
      )}

      <div className="flex flex-col space-y-1">
        <h1 className="text-[22px] font-semibold text-[#0C2661]">{title}</h1>
        <p className="text-sm text-gray-600">{desc}</p>
      </div>
    </header>
  )
}
