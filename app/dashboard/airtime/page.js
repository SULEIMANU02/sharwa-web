'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

export default function AirtimePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const number2 = searchParams.get('number2')
  
  const [recently, setRecently] = useState(false)
  const [plansvisible, setPlansvisible] = useState(false)
  const [summary, setSummary] = useState(false)
  const [lowBalance, setLowBalance] = useState(false)
  const [data, setData] = useState([])
  
  // Operation states
  const [username, setUsername] = useState('')
  const [balance, setBalance] = useState('')
  const [phone, setPhone] = useState(number2 || '')
  const [numberValid, setNumberValid] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [amount, setAmount] = useState('')

  // Predefined airtime amounts
  const activePlans = [50, 100, 200, 300, 400, 500, 600, 700, 1000]

  // Network icons
  const networkIcons = {
    0: '/assets/networks/mtn.png',
    1: '/assets/networks/airtel.png', 
    2: '/assets/networks/glo.png',
    3: '/assets/networks/9mobile.png'
  }

  // Number validation
  const validateNumber = useCallback(() => {
    const mtnPrefixes = ['0703', '0706', '0803', '0806', '0810', '0813', '0814', '0816', '0903', '0906', '0913', '0916']
    const airtelPrefixes = ['0701', '0708', '0802', '0808', '0812', '0817', '0818', '0902', '0907', '0912']
    const nineMobilePrefixes = ['0809', '0817', '0818', '0908', '0912']
    const gloPrefixes = ['0705', '0805', '0811', '0815', '0905', '0915']

    if (phone.length !== 11) {
      setSelectedIndex(null)
      setNumberValid(false)
      return
    }

    if (mtnPrefixes.some(prefix => phone.startsWith(prefix))) {
      setSelectedIndex(0)
      setNumberValid(true)
    } else if (airtelPrefixes.some(prefix => phone.startsWith(prefix))) {
      setSelectedIndex(1)
      setNumberValid(true)
    } else if (gloPrefixes.some(prefix => phone.startsWith(prefix))) {
      setSelectedIndex(2)
      setNumberValid(true)
    } else if (nineMobilePrefixes.some(prefix => phone.startsWith(prefix))) {
      setSelectedIndex(3)
      setNumberValid(true)
    } else {
      setSelectedIndex(null)
      setNumberValid(false)
    }
  }, [phone])

  useEffect(() => {
    validateNumber()
  }, [validateNumber])

  const fetchData = async () => {
    try {
      const email = localStorage.getItem('email')
      if (email) {
        const response = await fetch(`https://sharwadata.com.ng/api/plans/user?email=${email}`)
        const data = await response.json()
        setBalance(data.data.balance)
      }
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  const viewHandler = () => {
    if ((selectedIndex || selectedIndex === 0) && numberValid) {
      setPlansvisible(true)
    } else {
      setPlansvisible(false)
    }
  }

  useEffect(() => {
    viewHandler()
  }, [selectedIndex, numberValid])

  useEffect(() => {
    fetchData()
  }, [])

  const handleSelectNetwork = () => {
    if (!numberValid && selectedIndex !== null) {
      alert('Please input a valid beneficiary phone number')
      setSelectedIndex(null)
    }
  }

  useEffect(() => {
    handleSelectNetwork()
  }, [numberValid, selectedIndex])

  const handleProceed = () => {
    const amountNum = Number(amount)
    if (balance < amountNum) {
      setLowBalance(true)
      alert('Insufficient balance. Please fund your wallet.')
    } else {
      router.push(`/dashboard/airtime/pin?network=${selectedIndex}&phone=${phone}&amount=${amountNum}&username=${username}`)
    }
  }

  const getNetworkName = (index) => {
    const names = ['MTN', 'Airtel', 'GLO', '9mobile']
    return names[index] || ''
  }

  const handleQuickAmountSelect = (quickAmount) => {
    setAmount(quickAmount.toString())
    setSummary(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center relative">
            <button 
              onClick={() => router.back()}
              className="absolute left-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
            >
              <span className="text-2xl">←</span>
            </button>
            <h1 className="text-xl font-semibold text-blue-600">Airtime</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-3 shadow-sm">
            <input
              type="tel"
              placeholder="Phone Number"
              className="flex-1 outline-none text-gray-800 placeholder-gray-500"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
            {/* <button 
              onClick={() => router.push('/contacts?previous=Airtime')}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <span className="text-xl">👥</span>
            </button> */}
          </div>
        </div>

        {/* Network Selection */}
        <div className="flex justify-between mb-6">
          {[0, 1, 2, 3].map((index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`p-3 rounded-xl transition-all duration-200 ${
                selectedIndex === index 
                  ? 'bg-blue-600 shadow-lg transform scale-105' 
                  : 'bg-white shadow-sm hover:shadow-md'
              }`}
            >
              <div className="w-12 h-12 relative">
                <Image
                  src={networkIcons[index]}
                  alt={getNetworkName(index)}
                  width={48}
                  height={48}
                  className="rounded-lg object-contain"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Quick Amount Selection */}
        {plansvisible && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-3">Quick Select Amount</label>
            <div className="grid grid-cols-3 gap-3">
              {activePlans.map((quickAmount, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAmountSelect(quickAmount)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    amount === quickAmount.toString()
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <span className={`font-bold text-lg ${
                    amount === quickAmount.toString() ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    ₦{quickAmount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Custom Amount Input */}
        {plansvisible && (
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Or Enter Custom Amount</label>
            <div className="bg-white border border-gray-300 rounded-lg px-3 py-3 shadow-sm">
              <input
                type="number"
                placeholder="₦50 - ₦5000"
                className="w-full outline-none text-gray-800 placeholder-gray-500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="50"
                max="5000"
              />
            </div>
            
            {/* Proceed Button */}
            <button
              onClick={() => amount ? setSummary(true) : setSummary(false)}
              disabled={!amount}
              className={`w-full mt-4 py-4 rounded-xl font-semibold transition-all duration-200 ${
                amount
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              PROCEED
            </button>
          </div>
        )}

        {/* Summary Modal */}
        {summary && (
          <>
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
              onClick={() => {
                setSummary(false)
                setAmount('')
              }}
            ></div>
            
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => {
                    setSummary(false)
                    setAmount('')
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-gray-900">Transaction Summary</h2>
                <div className="w-8"></div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Network</span>
                  <span className="font-semibold text-gray-900">{getNetworkName(selectedIndex)}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-gray-900">₦{amount}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-semibold text-gray-900">{phone}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Wallet Balance</span>
                  <span className="font-semibold text-gray-900">₦{balance}</span>
                </div>
                
                {balance < Number(amount) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-red-600 text-sm font-medium text-center">
                      Insufficient balance. Please fund your wallet.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleProceed}
                disabled={balance < Number(amount)}
                className={`w-full py-4 rounded-xl font-semibold transition-colors duration-200 ${
                  balance < Number(amount)
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                PROCEED TO PAYMENT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}