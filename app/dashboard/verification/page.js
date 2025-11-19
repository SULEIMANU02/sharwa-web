import Link from 'next/link'

export default function VerificationHome() {
  const links = [
    { href: '/dashboard/verification/ninverify', label: 'NIN Verification' },
    { href: '/dashboard/verification/bvnverify', label: 'BVN Verification' },
    { href: '/dashboard/verification/cards/basic', label: 'Card - Basic' },
    { href: '/dashboard/verification/cards/standard', label: 'Card - Standard' },
    { href: '/dashboard/verification/cards/premium', label: 'Card - Premium' },
    { href: '/dashboard/verification/cards/slip', label: 'Card - Slip' },
    { href: '/dashboard/verification/transactions', label: 'Verification Transactions' },
  ]
  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Verification</h2>
      <ul className="list-disc list-inside space-y-1">
        {links.map(l => (
          <li key={l.href}><Link className="underline" href={l.href}>{l.label}</Link></li>
        ))}
      </ul>
    </div>
  )
}
