'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import LogoutDialog from './LogoutDialog'

import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  MailIcon,
  Bell,
  Trophy,
  Users,
  Swords,
  BookOpen,
} from 'lucide-react'

const PRIMARY = '#DF1020'

const sidebarItems = [
  {
    icon: <LayoutDashboard size={20} color={PRIMARY} />,
    text: 'Dashboard Overview',
    href: '/admin-dashboard/',
  },
  {
    icon: <Trophy size={20} color={PRIMARY} />,
    text: 'Tournaments Management',
    href: '/admin-dashboard/tournamments-management',
  },
  {
    icon: <Users size={20} color={PRIMARY} />,
    text: 'Players Management',
    href: '/admin-dashboard/players-management',
  },
  {
    icon: <Swords size={20} color={PRIMARY} />,
    text: 'Matches Management',
    href: '/admin-dashboard/atches-management',
  },
  {
    icon: <MessageSquare size={20} color={PRIMARY} />,
    text: 'Tournament Draw',
    href: '/admin-dashboard/tournament-draw',
  },
  {
    icon: <BookOpen size={20} color={PRIMARY} />,
    text: 'Article Management',
    href: '/admin-dashboard/artical-management',
  },
  {
    icon: <MailIcon size={20} color={PRIMARY} />,
    text: 'Contact Management',
    href: '/admin-dashboard/contact',
  },
  {
    icon: <Bell size={20} color={PRIMARY} />,
    text: 'Subscriber Management',
    href: '/admin-dashboard/subscriber',
  },
  {
    icon: <Settings size={20} color={PRIMARY} />,
    text: 'Settings',
    href: '/admin-dashboard/settings',
  },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SidebarItem({ icon, text, href, active }: any) {
  return (
    <Link href={href}>
      <div
        className={`flex items-center gap-6 px-5 py-[14px] rounded-lg cursor-pointer transition-all mb-3
          ${
            active
              ? 'bg-red-50 text-[#DF1020] font-semibold shadow-md'
              : 'text-[#DF1020] hover:bg-red-50'
          }`}
      >
        {icon}
        <span className="text-base">{text}</span>
      </div>
    </Link>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    if (pathname === href) return true

    const pathSegments = pathname.split('/').filter(Boolean)
    const hrefSegments = href.split('/').filter(Boolean)

    return pathSegments[1] === hrefSegments[1]
  }

  return (
    <aside className="w-[320px] bg-white  min-h-screen flex flex-col ">
      {/* Logo */}
      <div className="h-[80px] flex items-center px-8">
        <Link href="/admin-dashboard/dashboard">
          <Image
            src="/images/auth-logo.png"
            alt="logo"
            width={150}
            height={45}
            className="object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex gap-2 px-4 pt-6 pb-2 ">
        <div className="w-full space-y-3">
          {sidebarItems.map(item => (
            <SidebarItem
              key={item.text}
              {...item}
              active={isActiveLink(item.href)}
            />
          ))}
        </div>
      </nav>

      {/* Logout */}
      <div className="mt-auto pb-5 px-4">
        <div className="text-[#DF1020]">
          <LogoutDialog />
        </div>
      </div>
    </aside>
  )
}
