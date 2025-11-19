'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/transactions', label: 'Transactions' },
  { href: '/admin/services', label: 'Services' },
  { href: '/admin/api-balance', label: 'API Balance' },
  { href: '/admin/apisettings', label: 'API Settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-full md:w-60 shrink-0 md:sticky top-4 h-max">
      <div className="card"> 
        <nav className="flex md:flex-col gap-2">
          {links.map(l => (
            <Link key={l.href} href={l.href} className={clsx('btn-secondary w-full text-left', pathname===l.href && 'bg-primary')}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}
