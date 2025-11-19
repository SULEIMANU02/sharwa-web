'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getSession, isSessionValid, getStoredEmail } from '@/lib/sessionManager'

export default function AuthGuard({ children, role }) {
  const router = useRouter()
  const pathname = usePathname()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const session = getSession()
    const email = getStoredEmail()
    const sessionValid = isSessionValid()
    const authed = !!session?.token && sessionValid
    const user = session?.user

    // If session expired but email exists, redirect to passcode
    if (!authed && email && (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin'))) {
      router.replace('/auth/passcode')
    } else if (!authed && !email && (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin'))) {
      router.replace('/auth/login')
    } else if (role === 'admin' && user?.role !== 'admin') {
      router.replace('/dashboard')
    } else {
      setReady(true)
    }
  }, [router, pathname, role])

  if (!ready) return null
  return children
}
