'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const distributors = [
  { id: 3, name: 'IKEJA ELECTRIC' },
  { id: 4, name: 'EKO ELECTRIC' },
  { id: 5, name: 'ABUJA' },
  { id: 6, name: 'KANO ELECTRIC' },
  { id: 7, name: 'PORT HARCOURT ELECTRIC' },
  { id: 8, name: 'JOS ELECTRIC' },
  { id: 9, name: 'KADUNA ELECTRIC' },
  { id: 10, name: 'IBADAN ELECTRIC' },
  { id: 11, name: 'BENIN ELECTRICITY' },
  { id: 13, name: 'YOLA ELECTRIC DISCO' },
  { id: 14, name: 'ABA ELECTRIC' },
  { id: 15, name: 'ENUGU ELECTRICITY' },
]

export default function NepaPage() {
  const router = useRouter()
  const [provider, setProvider] = useState('')
  const [meterNumber, setMeterNumber] = useState('')
  const [meterType, setMeterType] = useState('')
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(false)
  const [customerName, setCustomerName] = useState('')
  const [address, setAddress] = useState('')
  const [balance, setBalance] = useState('0')

  useEffect(() => {
    const email = localStorage.getItem('email')
    if (!email) return
    fetch(`https://sharwadata.com.ng/api/plans/user?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => setBalance(data?.data?.balance || '0'))
      .catch(() => {})
  }, [])

  const selectedProvider = useMemo(
    () => distributors.find((d) => String(d.id) === provider),
    [provider]
  )

  const validateAndProceed = async () => {
    if (!provider || !meterNumber || !meterType || !amount) {
      alert('Please fill all fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`https://legitdataway.com/api/bill/bill-validation?meter_number=${encodeURIComponent(meterNumber)}&disco=${encodeURIComponent(provider)}&meter_type=${encodeURIComponent(meterType)}`)
      const data = await response.json()
      if (data?.status === 'fail') {
        alert('Cannot verify meter number. Please check and try again.')
        return
      }
      setCustomerName(data?.name || '')
      setAddress(data?.address || '')
      setSummary(true)
    } catch (error) {
      alert('Error validating meter. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-blue-700">Electricity</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block mb-2 text-sm text-gray-600">Distributor</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          >
            <option value="">Select distributor</option>
            {distributors.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-600">Meter Number</label>
          <input
            value={meterNumber}
            onChange={(e) => setMeterNumber(e.target.value.trim())}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Enter meter number"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-600">Meter Type</label>
          <select
            value={meterType}
            onChange={(e) => setMeterType(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
          >
            <option value="">Select meter type</option>
            <option value="prepaid">Prepaid</option>
            <option value="postpaid">Postpaid</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 text-sm text-gray-600">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Enter amount"
          />
        </div>

        <button
          onClick={validateAndProceed}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3"
        >
          {loading ? 'Validating...' : 'Validate & Proceed'}
        </button>
      </div>

      {summary && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-gray-900">Transaction Summary</h2>
          <div className="flex justify-between"><span className="text-gray-500">Provider</span><span>{selectedProvider?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Customer Name</span><span>{customerName}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Address</span><span className="text-right ml-4">{address}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Meter Type</span><span className="capitalize">{meterType}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Amount</span><span>₦{amount}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Wallet Balance</span><span>₦{balance}</span></div>
          {Number(balance) < Number(amount) && (
            <p className="text-red-600 text-sm">Insufficient balance. Please fund your wallet.</p>
          )}
          <button
            disabled={Number(balance) < Number(amount)}
            onClick={() => router.push(`/dashboard/nepa/pin?disco=${encodeURIComponent(provider)}&meterNumber=${encodeURIComponent(meterNumber)}&type=${encodeURIComponent(meterType)}&amount=${encodeURIComponent(amount)}`)}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl py-3"
          >
            Confirm Payment
          </button>
        </div>
      )}
    </div>
  )
}
