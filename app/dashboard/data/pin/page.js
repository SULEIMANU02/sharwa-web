// app/dashboard/data/pin/page.js
'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function DataPinPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get parameters from URL
  const network = searchParams.get('network')
  const phone = searchParams.get('phone')
  const planId = searchParams.get('planId')
  const type = searchParams.get('type')
  const amount = searchParams.get('amount')
  const plan = searchParams.get('plan')
  const username = searchParams.get('username')

  const [passcode, setPasscode] = useState('')
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [networks, setNetworks] = useState('')

  // Map network codes
  useEffect(() => {
    if (network === '0') {
      setNetworks('1')
    } else if (network === '1') {
      setNetworks('4')
    } else if (network === '2') {
      setNetworks('2')
    } else {
      setNetworks('3')
    }
  }, [network])

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    try {
      const savedPin = localStorage.getItem('pin')
      const codeToken = localStorage.getItem('token')
      const saveEmail = localStorage.getItem('email')
      
      if (savedPin) setPin(savedPin)
      if (codeToken) setToken(codeToken)
      if (saveEmail) setEmail(saveEmail)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  console.log('datas token:', token)

  const datas = {
    email: email,
    token: token,
    network: networks, 
    number: phone,
    planid: planId, 
    plan: plan,
    amount: amount,
    datatype: type,
    Ported_number: true,
  }

  const checkDb = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('https://sharwadata.com.ng/purchase/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datas)
      })

      const result = await response.json()
      console.log('Purchase result:', result)

      if (result.success) {
        router.push(`/dashboard/success?network=${networks}&phone=${phone}&success=success&type=data&datatype=${type}&amount=${amount}&plan=${encodeURIComponent(plan)}&time=${new Date().getTime()}`)
      } else {
        if (result.error === 'invalid_token') {
          // Handle session expiry
          await handleLogout()
        } else if (result.error === 'insufficient_balance') {
          alert('Insufficient Balance. Kindly fund your wallet to continue.')
        } else {
          router.push(`/dashboard/success?network=${networks}&phone=${phone}&success=failed&type=data&datatype=${type}&amount=${amount}&plan=${encodeURIComponent(plan)}&time=${new Date().getTime()}`)
        }
      }
    } catch (error) {
      console.error('Error in purchase:', error)
      alert('Transaction failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const userChoice = confirm('Session Expired. Please login again.')
    
    if (userChoice) {
      // Clear all stored data
      localStorage.removeItem('firstName')
      localStorage.removeItem('lastName')
      localStorage.removeItem('email')
      localStorage.removeItem('phoneNumber')
      localStorage.removeItem('pin')
      localStorage.removeItem('passcode')
      localStorage.removeItem('accountNumber')
      localStorage.removeItem('token')
      
      // Redirect to login
      router.replace('/auth/login')
    }
  }

  const handleConfirm = async () => {
    if (passcode.length === 4) {
      if (passcode === pin) {
        await checkDb()
      } else {
        alert('Please enter correct PIN! Or reset in settings.')
        setPasscode('')
      }
    }
  }

  useEffect(() => {
    if (passcode.length === 4) {
      handleConfirm()
    }
  }, [passcode])

  const handlePress = (number) => {
    if (passcode.length < 4) {
      setPasscode(prev => prev + number)
    }
  }

  const handleDelete = () => {
    setPasscode(prev => prev.slice(0, -1))
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Back Button */}
      <button 
        onClick={handleBack}
        className="absolute top-6 left-6 p-3 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
      >
        <span className="text-2xl">←</span>
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Transaction PIN</h1>
        
        {/* Dots Indicator */}
        <div className="flex justify-center space-x-4 mb-8">
          {Array(4).fill(0).map((_, index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 border-blue-600 transition-colors duration-200 ${
                passcode.length > index ? 'bg-blue-600' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg max-w-sm mx-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Network:</span>
              <span className="font-medium">{network === '0' ? 'MTN' : network === '1' ? 'Airtel' : network === '2' ? 'GLO' : '9mobile'}</span>
            </div>
            <div className="flex justify-between">
              <span>Plan:</span>
              <span className="font-medium">{plan}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">₦{amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span className="font-medium">{phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <button
            key={number}
            onClick={() => handlePress(number.toString())}
            className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold text-blue-600 hover:bg-blue-50 active:scale-95 transition-all duration-200"
          >
            {number}
          </button>
        ))}
        
        <button
          onClick={handleDelete}
          className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center text-blue-600 hover:bg-red-50 active:scale-95 transition-all duration-200"
        >
          <span className="text-xl">⌫</span>
        </button>
        
        <button
          onClick={() => handlePress('0')}
          className="aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold text-blue-600 hover:bg-blue-50 active:scale-95 transition-all duration-200"
        >
          0
        </button>
        
        {/* Biometric placeholder - you can implement this later */}
        <button
          onClick={() => {/* Implement biometric */}}
          className="aspect-square bg-blue-600 rounded-2xl shadow-lg flex items-center justify-center text-white hover:bg-blue-700 active:scale-95 transition-all duration-200"
        >
          <span className="text-xl">👆</span>
        </button>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-700 font-semibold">Processing transaction...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}