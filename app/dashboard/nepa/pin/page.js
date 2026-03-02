'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function NepaPinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)

  const payload = useMemo(() => ({
    email: typeof window !== 'undefined' ? localStorage.getItem('email') : '',
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : '',
    disco: searchParams.get('disco') || '',
    amount: searchParams.get('amount') || '',
    meter_number: searchParams.get('meterNumber') || '',
    meter_type: searchParams.get('type') || '',
  }), [searchParams])

  const submit = async () => {
    const storedPin = localStorage.getItem('pin')
    if (!storedPin) {
      alert('No transaction pin found. Please set your pin in profile/settings.')
      return
    }
    if (pin.length !== 4 || pin !== storedPin) {
      alert('Please enter correct pin')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('https://sharwadata.com.ng/purchase/nepa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (result?.success) {
        router.push(`/dashboard/success?success=success&type=nepa&amount=${encodeURIComponent(payload.amount)}&time=${Date.now()}`)
        return
      }

      if (result?.error === 'invalid_token') {
        localStorage.removeItem('token')
        localStorage.removeItem('email')
        localStorage.removeItem('pin')
        router.push('/auth/login')
        return
      }

      if (result?.error === 'insufficient_balance') {
        alert('Insufficient balance. Kindly fund your wallet to continue.')
        return
      }

      router.push(`/dashboard/success?success=failed&type=nepa&amount=${encodeURIComponent(payload.amount)}&time=${Date.now()}`)
    } catch (error) {
      alert('Unable to complete electricity payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h1 className="text-xl font-bold text-blue-700 mb-2">Transaction Pin</h1>
      <p className="text-sm text-gray-600 mb-5">Enter your 4-digit pin to authorize electricity payment.</p>

      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg tracking-[0.4em] text-center"
        placeholder="••••"
      />

      <button
        onClick={submit}
        disabled={loading || pin.length !== 4}
        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3"
      >
        {loading ? 'Processing...' : 'Confirm Payment'}
      </button>
    </div>
  )
}
