'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const providers = [
  { id: 1, name: 'GOTV' },
  { id: 2, name: 'DSTV' },
  { id: 3, name: 'STARTIMES' },
]

export default function CablePage() {
  const router = useRouter()
  const [providerId, setProviderId] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loadingPlans, setLoadingPlans] = useState(false)
  const [loadingValidation, setLoadingValidation] = useState(false)
  const [summary, setSummary] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [balance, setBalance] = useState('0')

  useEffect(() => {
    const email = localStorage.getItem('email')
    if (!email) return
    fetch(`https://sharwadata.com.ng/api/plans/user?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => setBalance(data?.data?.balance || '0'))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!providerId) {
      setPlans([])
      setSelectedPlan(null)
      return
    }

    const selectedProvider = providers.find((item) => String(item.id) === providerId)
    if (!selectedProvider) return

    setLoadingPlans(true)
    fetch('https://sharwadata.com.ng/api/plans/cable')
      .then((res) => res.json())
      .then((data) => {
        const filtered = (data?.data || []).filter((item) => item.provider === selectedProvider.name)
        setPlans(filtered)
      })
      .catch(() => setPlans([]))
      .finally(() => setLoadingPlans(false))
  }, [providerId])

  const selectedProvider = useMemo(
    () => providers.find((item) => String(item.id) === providerId),
    [providerId]
  )

  const validateAndProceed = async () => {
    if (!providerId || !cardNumber || !selectedPlan) {
      alert('Please select provider, card number, and plan')
      return
    }

    setLoadingValidation(true)
    try {
      const response = await fetch(`https://legitdataway.com/api/cable/cable-validation?iuc=${encodeURIComponent(cardNumber)}&cable=${encodeURIComponent(providerId)}`)
      const data = await response.json()
      if (data?.status === 'fail') {
        alert('Cannot verify card number. Please check and try again.')
        return
      }
      setCustomerName(data?.customer_name || data?.name || '')
      setSummary(true)
    } catch (error) {
      alert('Error validating card. Please try again.')
    } finally {
      setLoadingValidation(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-blue-700">Cable TV</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block mb-2 text-sm text-gray-600">TV Provider</label>
          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          >
            <option value="">Select provider</option>
            {providers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-600">Smart Card Number</label>
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value.trim())}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Enter smart card number"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-600">Subscription Plan</label>
          {loadingPlans && <p className="text-sm text-gray-500">Loading plans...</p>}
          {!loadingPlans && plans.length === 0 && (
            <p className="text-sm text-gray-500">Select a provider to view plans.</p>
          )}
          {!loadingPlans && plans.length > 0 && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {plans.map((plan) => (
                <button
                  key={plan.cableId}
                  onClick={() => setSelectedPlan(plan)}
                  className={`w-full text-left border rounded-xl px-4 py-3 ${
                    selectedPlan?.cableId === plan.cableId
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{plan.name}</div>
                  <div className="text-sm text-gray-600">₦{plan.price}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={validateAndProceed}
          disabled={loadingValidation}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3"
        >
          {loadingValidation ? 'Validating...' : 'Validate & Proceed'}
        </button>
      </div>

      {summary && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-gray-900">Transaction Summary</h2>
          <div className="flex justify-between"><span className="text-gray-500">Provider</span><span>{selectedProvider?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Customer Name</span><span>{customerName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Card Number</span><span>{cardNumber}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Plan</span><span className="text-right ml-4">{selectedPlan?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Amount</span><span>₦{selectedPlan?.price}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Wallet Balance</span><span>₦{balance}</span></div>
          {Number(balance) < Number(selectedPlan?.price || 0) && (
            <p className="text-red-600 text-sm">Insufficient balance. Please fund your wallet.</p>
          )}
          <button
            disabled={Number(balance) < Number(selectedPlan?.price || 0)}
            onClick={() => router.push(`/dashboard/cable/pin?provider=${encodeURIComponent(providerId)}&cardNumber=${encodeURIComponent(cardNumber)}&plan=${encodeURIComponent(selectedPlan?.cableId || '')}&amount=${encodeURIComponent(selectedPlan?.price || '')}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3"
          >
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  )
}
