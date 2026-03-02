'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const network = searchParams.get('network')
  const phoneNumber = searchParams.get('phone')
  const success = searchParams.get('success')
  const type = searchParams.get('type')
  const amount = searchParams.get('amount')
  const plan = searchParams.get('plan')
  const time = searchParams.get('time')

  const [status, setStatus] = useState(false)
  const [message, setMessage] = useState('')
  const [networkName, setNetworkName] = useState('')

  useEffect(() => {
    const handleBackPress = (e) => {
      e.preventDefault()
      router.push('/dashboard')
      return false
    }

    window.addEventListener('beforeunload', handleBackPress)
    window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handleBackPress)

    return () => {
      window.removeEventListener('beforeunload', handleBackPress)
      window.removeEventListener('popstate', handleBackPress)
    }
  }, [router])

  useEffect(() => {
    if (network === '1') setNetworkName('MTN')
    else if (network === '4') setNetworkName('AIRTEL')
    else if (network === '2') setNetworkName('GLO')
    else if (network === '3') setNetworkName('9MOBILE')
    else setNetworkName('')

    const isSuccess = success === 'success'
    setStatus(isSuccess)

    if (isSuccess) {
      if (type === 'data') setMessage(`Congratulations! You have sent ${networkName} ${plan} data to ${phoneNumber}`)
      else if (type === 'airtime') setMessage(`Congratulations! You have sent ${networkName} N${amount} airtime to ${phoneNumber}`)
      else if (type === 'transfer') setMessage('Congratulations! Your transfer was completed successfully.')
      else if (type === 'nepa') setMessage('Congratulations! Your electricity payment was completed successfully.')
      else if (type === 'cable') setMessage('Congratulations! Your cable subscription was completed successfully.')
      else setMessage('Transaction completed successfully.')
      return
    }

    if (type === 'transfer') setMessage('Sorry, your transfer could not be completed.')
    else if (type === 'nepa') setMessage('Sorry, your electricity payment could not be completed.')
    else if (type === 'cable') setMessage('Sorry, your cable payment could not be completed.')
    else setMessage('Sorry, your transaction could not be completed due to network issues.')
  }, [success, type, network, plan, phoneNumber, amount, networkName])

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="relative mb-10">
        <div className={`w-28 h-28 rounded-full flex items-center justify-center ${status ? 'bg-blue-100' : 'bg-red-100'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${status ? 'bg-blue-600' : 'bg-red-600'}`}>
            <span className="text-3xl font-bold text-white">{status ? '✓' : '✕'}</span>
          </div>
        </div>
      </div>

      <h1 className={`text-3xl font-bold mb-3 text-center ${status ? 'text-gray-900' : 'text-red-600'}`}>
        Transaction {status ? 'Successful' : 'Failed'}
      </h1>

      <p className={`text-lg text-center mb-8 max-w-md ${status ? 'text-gray-600' : 'text-red-500'}`}>
        {message}
      </p>

      {status && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 w-full max-w-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Transaction Details</h3>
          <div className="space-y-3 text-sm">
            {networkName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Network</span>
                <span className="font-medium text-gray-800">{networkName}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium text-gray-800 capitalize">{type}</span>
            </div>
            {plan && (
              <div className="flex justify-between">
                <span className="text-gray-600">Plan</span>
                <span className="font-medium text-gray-800">{plan}</span>
              </div>
            )}
            {amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-gray-800">N{amount}</span>
              </div>
            )}
            {phoneNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium text-gray-800">{phoneNumber}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-medium text-gray-800">
                {time ? new Date(parseInt(time, 10)).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm space-y-4">
        {status && (
          <button
            onClick={() => router.push('/dashboard/history')}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50"
          >
            View History
          </button>
        )}
        <button
          onClick={() => router.push('/dashboard')}
          className={`w-full font-semibold py-4 rounded-xl text-white ${status ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'}`}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
