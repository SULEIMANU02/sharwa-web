'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get parameters from URL
  const network = searchParams.get('network')
  const phoneNumber = searchParams.get('phone')
  const success = searchParams.get('success')
  const type = searchParams.get('type')
  const datatype = searchParams.get('datatype')
  const amount = searchParams.get('amount')
  const plan = searchParams.get('plan')
  const time = searchParams.get('time')

  const [status, setStatus] = useState(false)
  const [message, setMessage] = useState('')
  const [networks, setNetworks] = useState('')

  // Handle browser back button
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

  const verifyData = () => {
    // Map network codes to names
    if (network === '1') {
      setNetworks('MTN')
    } else if (network === '4') {
      setNetworks('AIRTEL')
    } else if (network === '2') {
      setNetworks('GLO')
    } else {
      setNetworks('9MOBILE')
    }

    // Set status and message based on success/failure
    if (success === "success") {
      setStatus(true)
      if (type === 'data') {
        setMessage(`Congratulations! You have sent ${networks} ${plan} data to ${phoneNumber}`)
      }
      if (type === 'airtime') {
        setMessage(`Congratulations! You have sent ${networks} ₦${amount} airtime to ${phoneNumber}`)
      }
    }
    
    if (success === "failed") {
      setStatus(false)
      if (type === 'data' || type === 'airtime') {
        setMessage('Sorry, your transaction could not be completed due to network issues')
      }
    }
  }

  useEffect(() => {
    verifyData()
  }, [success, type, network, plan, phoneNumber])

  const handleDismiss = () => {
    router.push('/dashboard')
  }

  const handleViewHistory = () => {
    router.push('/dashboard/history')
  }



  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Animated Circles */}
      <div className="relative mb-12">
        {/* Outer Circle */}
        <div 
          className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${
            status 
              ? 'bg-blue-100 animate-pulse' 
              : 'bg-red-100'
          }`}
        >
          {/* Middle Circle */}
          <div 
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${
              status 
                ? 'bg-blue-200' 
                : 'bg-red-200'
            }`}
          >
            {/* Inner Circle */}
            <div 
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                status 
                  ? 'bg-blue-600 shadow-lg' 
                  : 'bg-red-600 shadow-lg'
              }`}
            >
              {/* Icon */}
              <span className={`text-2xl font-bold text-white ${
                status ? 'animate-bounce' : 'animate-pulse'
              }`}>
                {status ? '✓' : '✕'}
              </span>
            </div>
          </div>
        </div>

        {/* Floating particles for success */}
        {status && (
          <>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-green-400 rounded-full animate-ping animation-delay-300"></div>
            <div className="absolute -top-4 left-8 w-2 h-2 bg-blue-400 rounded-full animate-ping animation-delay-500"></div>
          </>
        )}
      </div>

      {/* Title */}
      <h1 className={`text-3xl font-bold mb-4 text-center transition-colors duration-300 ${
        status ? 'text-gray-900' : 'text-red-600'
      }`}>
        Transaction {status ? 'Successful' : 'Failed'}
      </h1>

      {/* Message */}
      <p className={`text-lg text-center mb-12 max-w-md leading-relaxed transition-colors duration-300 ${
        status ? 'text-gray-600' : 'text-red-500'
      }`}>
        {message}
      </p>

      {/* Transaction Details */}
      {status && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 w-full max-w-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Transaction Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Network:</span>
              <span className="font-medium text-gray-800">{networks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Type:</span>
              <span className="font-medium text-gray-800 capitalize">{type}</span>
            </div>
            {plan && (
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium text-gray-800">{plan}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-gray-800">₦{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium text-gray-800">{phoneNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time:</span>
              <span className="font-medium text-gray-800">
                {time ? new Date(parseInt(time)).toLocaleTimeString() : 'Just now'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="w-full max-w-sm space-y-4">
        {status && (
          // Success state buttons
          <>
            <button
              onClick={handleViewHistory}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all duration-200 shadow-sm"
            >
              View History
            </button>
          </>
        )}

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className={`w-full font-semibold py-4 rounded-xl active:scale-95 transition-all duration-200 shadow-lg ${
            status 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Additional success elements */}
      {status && (
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <span className="text-lg">🎉</span>
            <p className="text-sm font-medium">Transaction completed successfully!</p>
          </div>
        </div>
      )}
    </div>
  )
}