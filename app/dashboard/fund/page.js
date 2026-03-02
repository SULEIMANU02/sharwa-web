'use client'

import { useEffect, useState } from 'react'

export default function FundWalletPage() {
  const [loading, setLoading] = useState(false)
  const [accountNumber, setAccountNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    const load = async () => {
      const storedAccount = localStorage.getItem('accountNumber')
      const email = localStorage.getItem('email')
      setFirstName(localStorage.getItem('firstName') || '')
      setLastName(localStorage.getItem('lastName') || '')

      if (storedAccount) {
        setAccountNumber(storedAccount)
        return
      }

      if (!email) return

      setLoading(true)
      try {
        const response = await fetch(`https://sharwadata.com.ng/api/plans/generateaza?email=${encodeURIComponent(email)}`)
        const data = await response.json()
        const generated = data?.data?.accountNumber
        if (data?.success && generated) {
          setAccountNumber(generated)
          localStorage.setItem('accountNumber', generated)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Fund Wallet</h1>
        <p className="text-gray-600">
          Fund your wallet with zero charges. Transfer to the account below and your balance updates automatically.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Account Number</span>
          <span className="font-semibold text-blue-700">{accountNumber || 'Loading...'}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Bank Name</span>
          <span className="font-semibold text-blue-700">Nombank MFB</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-500">Account Name</span>
          <span className="font-semibold text-blue-700">Data/{`${firstName} ${lastName}`.trim() || 'User'}</span>
        </div>
        <button
          disabled={!accountNumber}
          onClick={() => navigator.clipboard.writeText(accountNumber)}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3"
        >
          Copy Account Number
        </button>
        {loading && <p className="text-sm text-gray-500 text-center">Generating virtual account...</p>}
      </div>
    </div>
  )
}
