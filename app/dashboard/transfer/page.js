'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function Transfer() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bank = searchParams.get('bank')
  const code = searchParams.get('code')

  const [recipientAccount, setRecipientAccount] = useState('')
  const [selectedBank, setSelectedBank] = useState(null)
  const [summary, setSummary] = useState(false)
  const [bankCode, setBankCode] = useState(null)
  const [accountName, setAccountName] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [validating, setValidating] = useState(false)
  const [amount, setAmount] = useState('')
  const [narration, setNarration] = useState('')
  const [balance, setBalance] = useState('')
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [validated, setValidated] = useState(false)
  const [lowBalance, setLowBalance] = useState(false)
  const [level, setLevel] = useState(false)
  const [dailyTransferSum, setDailyTransferSum] = useState(0)
  const [exceedsLimit, setExceedsLimit] = useState(false)
  const numericAmount = parseFloat(amount.replace(/,/g, '')) || 0

  // Define daily transfer limits based on user level
  const getDailyLimit = (userLevel) => {
    switch(userLevel) {
      case 1: return 50000
      case 2: return 200000
      case 3: return 5000000
      default: return 50000
    }
  }

  // Helper function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date()
    const date = new Date(dateString)
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  useEffect(() => {
    if (bank !== null) {
      setSelectedBank(bank)
      setBankCode(code)
      console.log('banks', bankCode, selectedBank)
    }
    if (recipientAccount.length !== 10) {
      setValidating(false)
      setValidated(false)
    } 
    if (validated && amount && !exceedsLimit) {
      setButtonDisabled(false)
    } else {
      setButtonDisabled(true)
    }
    if (balance < numericAmount) {
      setLowBalance(true)
    } else {
      setLowBalance(false)
    }

    if (numericAmount && level) {
      const dailyLimit = getDailyLimit(level)
      const totalWithCurrentTransfer = dailyTransferSum + numericAmount
      setExceedsLimit(totalWithCurrentTransfer > dailyLimit)
    }
  })

  const fetchData = async () => {
    try {
      const email = typeof window !== 'undefined' ? localStorage.getItem('email') : null
      if (email) {
        const response = await fetch(`https://sharwadata.com.ng/api/plans/user?email=${email}`)
        const data = await response.json()
        setBalance(data.data.balance)
        setLevel(data.data.level)
        console.log('email', email)
        console.log('balancer', data.data.balance)
        
        // Fetch transaction history and calculate today's transfer sum
        const fetchHistory = await fetch(`https://sharwadata.com.ng/api/plans/history?email=${email}`)
        const historyData = await fetchHistory.json()

        if (historyData.data) {
          // Filter transfers for today and calculate sum
          const todayTransfers = historyData.data.filter(transaction => 
            transaction.type === 'Transfer' && transaction.status === 'successful' && isToday(transaction.created_at)
          )
         console.log('bayanai', todayTransfers)
          
          const todaySum = todayTransfers.reduce((sum, transaction) => 
            sum + parseFloat(transaction.amount || 0), 0
          )
          
          setDailyTransferSum(todaySum)
          console.log('Today\'s transfer sum:', todaySum)
          console.log('User level:', data.data.level)
          console.log('Daily limit:', getDailyLimit(data.data.level))
        }
      } 
    } 
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if ((recipientAccount.length !== 10 && !bankCode) || bankCode === '000') return
    
    const fetchBanks = async () => {
      const url = 'https://sharwadata.com.ng/api/plans/banklookup'
      if (recipientAccount.length === 10) {
        setValidating(true)
        setAccountName(
          <div className="flex items-center my-4 ml-7">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
            <span className="text-gray-600 font-medium">Validating account number...</span>
          </div>
        )
        
        try {
          const options = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: `{"recipientAccount": "${recipientAccount}","bankCode": "${bankCode}"}`
          })
          const response = await options.json()
          
          if (response.data.data) {
            console.log('name', response)
            setAccountName(
              <div className="flex items-center my-4 ml-7">
                <span className="text-green-600 mr-2">✓</span>
                <span className="text-gray-600 font-medium">{response.data.data.accountName}</span>
              </div>
            )
            setBeneficiary(response.data.data.accountName)
            setValidated(true)
          } else {
            console.log('no bank', response)
            setAccountName(
              <div className="flex items-center my-4 ml-7">
                <span className="text-red-600 mr-2">✗</span>
                <span className="text-red-600 font-medium">Invalid account number!</span>
              </div>
            )
            setValidated(false)
          }
        }
        catch (error){
          console.error('error', error.message)
          alert('An error occurred please try again')
        }
      }
    }
    
    fetchBanks()
  }, [recipientAccount, bankCode])
  
  const handleContinue = () => {
    if (numericAmount < 50) {
      alert('Minimum transfer amount is ₦50')
      return
    }
    
    if (exceedsLimit) {
      const dailyLimit = getDailyLimit(level)
      const remainingLimit = dailyLimit - dailyTransferSum
      alert(`Daily transfer limit exceeded! Your daily limit is ₦${dailyLimit.toLocaleString()}. You have ₦${remainingLimit.toLocaleString()} remaining today.`)
      return
    }
    
    setSummary(true)
  }

  const handleProceed = () => {
    router.push(`/transfer-pin?bank=${selectedBank}&code=${bankCode}&account=${recipientAccount}&amount=${numericAmount}&beneficiary=${beneficiary}&narration=${narration}`)
  }

  const formatAmount = (text) => {
    // Remove non-numeric characters except decimal
    let numericValue = text.replace(/[^0-9.]/g, '')
    
    // Prevent multiple decimals
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('')
    }

    // Format integer part with commas
    let [integer, decimal] = numericValue.split('.')
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

    return decimal !== undefined ? `${integer}.${decimal}` : integer
  }

  // Get remaining daily limit for display
  const getRemainingLimit = () => {
    const dailyLimit = getDailyLimit(level)
    return dailyLimit - dailyTransferSum
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <span className="text-2xl text-blue-600">←</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">Transfer</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Select Bank */}
          <div className="space-y-2">
            <label className="text-gray-600 font-bold text-sm">Select Bank</label>
            <Link 
              href="/dashboard/transfer/banks"
              className="flex items-center justify-between border border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <span className="text-gray-900 font-bold">{selectedBank || 'Select Bank'}</span>
              <span className="text-gray-600">▼</span>
            </Link>
          </div>

          {/* Recipient Account Number */}
          <div className="space-y-2">
            <label className="text-gray-600 font-bold text-sm">Recipient account number</label>
            <input
              type="text"
              placeholder={selectedBank === 'paymodest' ? "Enter 10 digits paymodest ID" : "Enter 10 digits account number"}
              className="w-full border border-gray-300 rounded-lg p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={recipientAccount}
              maxLength={10}
              onChange={(e) => setRecipientAccount(e.target.value)}
            />
          </div>

          {/* Account Validation */}
          {validating && accountName}

          {/* Amount */}
          <div className="space-y-2">
            <label className="text-gray-600 font-bold text-sm">Amount</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-4 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500">
              <span className="text-gray-900 text-xl mr-2">₦</span>
              <input
                type="text"
                placeholder="Enter amount"
                className="w-full bg-transparent focus:outline-none text-xl font-normal"
                value={amount}
                onChange={(e) => setAmount(formatAmount(e.target.value))}
              />
            </div>
            {level && (
              <p className="text-blue-600 text-sm font-medium mt-2">
                Daily limit: ₦{getDailyLimit(level).toLocaleString()} | Remaining: ₦{getRemainingLimit().toLocaleString()}
              </p>
            )}
            {exceedsLimit && (
              <p className="text-red-600 text-sm font-medium mt-2">
                Amount exceeds daily transfer limit!
              </p>
            )}
          </div>

          {/* Narration */}
          <div className="space-y-2">
            <label className="text-gray-600 font-bold text-sm">Narration (optional)</label>
            <input
              type="text"
              placeholder="Enter narration"
              className="w-full border border-gray-300 rounded-lg p-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={buttonDisabled}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-colors duration-200 ${
              buttonDisabled 
                ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Continue
          </button>
        </div>
      </div>

      {/* Summary Modal */}
      {summary && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSummary(false)} />
          
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setSummary(false)}
                className="text-gray-500 text-2xl"
              >
                ×
              </button>
              <h2 className="text-lg font-bold text-gray-900">Transaction Summary</h2>
              <div className="w-8" /> {/* Spacer for balance */}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-bold">Bank</span>
                <span className="text-gray-900">{selectedBank}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-bold">Account number</span>
                <span className="text-gray-900">{recipientAccount}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-bold">Beneficiary</span>
                <span className="text-gray-900 text-right flex-1 ml-2">{beneficiary}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-bold">Amount</span>
                <span className="text-gray-900">₦{amount}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-bold">Wallet balance</span>
                <span className="text-gray-900">₦{balance}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 font-bold">Daily limit remaining</span>
                <span className="text-gray-900">₦{getRemainingLimit().toLocaleString()}</span>
              </div>
              
              {balance < numericAmount && (
                <div className="py-2">
                  <p className="text-red-600 font-bold text-center">Insufficient balance please fund Wallet</p>
                </div>
              )}
              
              {exceedsLimit && (
                <div className="py-2">
                  <p className="text-red-600 font-bold text-center">Amount exceeds daily transfer limit!</p>
                </div>
              )}
            </div>

            <button
              onClick={handleProceed}
              disabled={lowBalance || exceedsLimit}
              className={`w-full py-4 rounded-lg font-bold mt-6 transition-colors duration-200 ${
                lowBalance || exceedsLimit
                  ? 'bg-blue-100 text-blue-600 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              PROCEED
            </button>
          </div>
        </>
      )}
    </div>
  )
}