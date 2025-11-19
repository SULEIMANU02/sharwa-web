'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function DashboardNav() {
  const pathname = usePathname()
  const items = [
    { href: '/dashboard', label: 'Home' },
    { href: '/dashboard/airtime', label: 'Airtime' },
    { href: '/dashboard/data', label: 'Data' },
    { href: '/dashboard/cable', label: 'Cable' },
    { href: '/dashboard/nepa', label: 'NEPA' },
    { href: '/dashboard/transfer', label: 'Transfer' },
    { href: '/dashboard/verification', label: 'Verification' },
    { href: '/dashboard/history', label: 'History' },
    { href: '/dashboard/profile', label: 'Profile' },
    { href: '/dashboard/support', label: 'Support' },
    { href: '/dashboard/upgrade', label: 'Upgrade' },
  ]
  return (
    <nav className="flex flex-wrap gap-2 text-sm">
      {items.map(i => (
        <Link key={i.href} href={i.href} className={clsx('btn-secondary', pathname===i.href && 'bg-primary')}>
          {i.label}
        </Link>
      ))}
    </nav>
  )
}
