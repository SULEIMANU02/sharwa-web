'use client'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Constants
const API_BASE_URL = 'https://sharwadata.com.ng/api/plans'
const BACKGROUND_FETCH_INTERVAL = 30000

// Custom hooks
const useUserData = () => {
  const [userData, setUserData] = useState({
    balance: '',
    firstName: '',
    accountNumber: '',
    accountNumber1: '',
    level: '',
  })
  const [loading, setLoading] = useState(false)
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [copied, setCopied] = useState('')

  const fetchUserData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true)
    
    try {
      const email = localStorage.getItem('email')
      const firstName = localStorage.getItem('firstName')
      
      if (firstName) {
        setUserData(prev => ({ ...prev, firstName }))
      }

      if (!email) throw new Error('No email found')

      const response = await fetch(`${API_BASE_URL}/user?email=${email}`)
      const responseData = await response.json()

      if (responseData?.data) {
        const { data } = responseData        
        localStorage.setItem('balance', data.balance?.toString() || '0')
        localStorage.setItem('level', data.level?.toString() || '0')

        setUserData(prev => ({
          ...prev,
          balance: data.balance || '0',
          level: data.level || '0',
          accountNumber: data.accountNumber || prev.accountNumber,
          accountNumber1: data.account || prev.accountNumber1,
        }))

        if (!data.account || !data.accountNumber) {
          await generateMissingAccounts(email, data)
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      
      const cachedBalance = localStorage.getItem('balance') || '0'
      const cachedLevel = localStorage.getItem('level') || '0'
      
      setUserData(prev => ({
        ...prev,
        balance: cachedBalance,
        level: cachedLevel, 
      }))
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [])

  const generateMissingAccounts = async (email, userData) => {
    if (!userData.accountNumber) {
      try {
        const response = await fetch(`${API_BASE_URL}/generatepaymentpoint?email=${email}`)
        const data = await response.json()
        if (data?.success && data?.data?.accountNumber) {
          setUserData(prev => ({ ...prev, accountNumber: data.data.accountNumber }))
        }
      } catch (error) {
        console.error('Error generating PalmPay account:', error)
      }
    }
    if (!userData.accountNumber1) {
      try {
        const response = await fetch(`${API_BASE_URL}/generateAza?email=${email}`)
        const data = await response.json()
        if (data?.success && data?.data?.accountNumber) {
          setUserData(prev => ({ ...prev, accountNumber1: data.data.accountNumber }))
        }
      } catch (error) {
        console.error('Error generating PalmPay account:', error)
      }
    }
  }

  return {
    userData,
    loading,
    balanceVisible,
    setBalanceVisible,
    fetchUserData,
    copied,
    setCopied
  }
}

// Utility functions
const formatBalance = (balance) => {
  const balanceDecimal = parseFloat(balance || 0).toFixed(2)
  return Number(balanceDecimal).toLocaleString('en-US')
}

const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function DashboardHome() {
  const router = useRouter()
  const { userData, loading, balanceVisible, setBalanceVisible, fetchUserData, copied, setCopied } = useUserData()

  useEffect(() => {
    fetchUserData()
    
    const backgroundInterval = setInterval(() => {
      fetchUserData(false)
    }, BACKGROUND_FETCH_INTERVAL)

    return () => clearInterval(backgroundInterval)
  }, [fetchUserData])

  const formattedBalance = useMemo(() => formatBalance(userData.balance), [userData.balance])
  const greeting = useMemo(() => getGreeting(), [])

  const services = [
    { 
      icon: "📱", 
      label: "Buy Data", 
      description: "All Networks",
      route: "data", 
      gradient: "from-blue-500 to-blue-600"
    },
    { 
      icon: "📞", 
      label: "Airtime", 
      description: "VTU Topup",
      route: "airtime", 
      gradient: "from-green-500 to-green-600"
    },
    { 
      icon: "⚡", 
      label: "Electricity", 
      description: "Pay Bills",
      route: "electricity", 
      gradient: "from-yellow-500 to-orange-500"
    },
    { 
      icon: "📺", 
      label: "Cable TV", 
      description: "Subscription",
      route: "cable", 
      gradient: "from-purple-500 to-purple-600"
    },
  ]

  const copyToClipboard = async (text, type) => {
    if (!text || text === 'Loading...') return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(''), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Elegant Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-transform">
                  <span className="text-white font-black text-xl">S</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{greeting} 👋</p>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {userData.firstName || 'User'}
                </h1>
              </div>
            </div>
            
         
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Premium Balance Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-3xl shadow-2xl overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full -translate-y-48 translate-x-48"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-white rounded-full translate-y-40 -translate-x-40"></div>
              <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white rounded-full"></div>
            </div>

            <div className="relative z-10 p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                    <p className="text-blue-100 text-sm font-semibold tracking-wide">TOTAL BALANCE</p>
                  </div>
                  <h2 className="text-6xl font-black text-white mb-3 tracking-tight">
                    {balanceVisible ? `₦${formattedBalance}` : '₦••••••'}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <p className="text-white text-xs font-bold">Level {userData.level || '1'} Account</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center transition-all border border-white/20 group"
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {balanceVisible ? '👁️' : '👁️‍🗨️'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => router.push('/dashboard/history')}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group">                  
                  <span className="text-xl group-hover:scale-110 transition-transform">📊</span>
                  <span>History</span>
                </button>
                <button
                   onClick={() => router.push('/dashboard/transfer')}
                   className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold py-4 px-6 rounded-2xl transition-all border border-white/30 flex items-center justify-center space-x-2 group">
                  <span className="text-xl group-hover:scale-110 transition-transform">💸</span>
                  <span>Transfer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Funding Instructions Banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">💰</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">Fund Your Wallet Instantly</h3>
              <p className="text-emerald-100 text-sm">Transfer to any of the accounts below and get credited automatically within seconds</p>
            </div>
          </div>
        </div>

        {/* Premium Virtual Accounts */}
        <div className="space-y-4">
          {/* Mobile Horizontal Scroll */}
          <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            <div className="flex gap-4" style={{minWidth: 'max-content'}}>
              {/* PalmPay Mobile */}
              <div className="relative group" style={{width: '320px'}}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-50"></div>
                  
                  <div className="relative z-10 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">🏦</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">PRIMARY</p>
                          <p className="text-gray-900 font-bold text-sm">PalmPay MFB</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-blue-100 rounded-full">
                        <p className="text-blue-700 text-xs font-bold">⭐</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 mb-3 shadow-lg">
                      <p className="text-blue-100 text-xs font-semibold mb-1 tracking-wide">ACCOUNT NUMBER</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-black text-2xl tracking-wider">
                          {userData.accountNumber || 'Loading...'}
                        </p>
                        <button
                          onClick={() => copyToClipboard(userData.accountNumber, 'palmpay')}
                          className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                        >
                          <span className="text-sm">{copied === 'palmpay' ? '✓' : '📋'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-600 text-xs font-semibold mb-0.5">ACCOUNT NAME</p>
                      <p className="text-gray-900 font-bold text-sm">
                        {userData.firstName ? `${userData.firstName} - Sharwa` : 'Loading...'}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-1 text-blue-600">
                        <span className="text-xs">⚡</span>
                        <p className="text-xs font-bold">Instant Auto-Credit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nombank Mobile */}
              <div className="relative group" style={{width: '320px'}}>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-gray-600 rounded-3xl blur opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 opacity-50"></div>
                  
                  <div className="relative z-10 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-xl">💳</span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">ALTERNATIVE</p>
                          <p className="text-gray-900 font-bold text-sm">Nombank MFB</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-gray-100 rounded-full">
                        <p className="text-gray-700 text-xs font-bold">💼</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-4 mb-3 shadow-lg">
                      <p className="text-slate-200 text-xs font-semibold mb-1 tracking-wide">ACCOUNT NUMBER</p>
                      <div className="flex items-center justify-between">
                        <p className="text-white font-black text-2xl tracking-wider">
                          {userData.accountNumber1 || 'Loading...'}
                        </p>
                        <button
                          onClick={() => copyToClipboard(userData.accountNumber1, 'nombank')}
                          className="w-9 h-9 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                        >
                          <span className="text-sm">{copied === 'nombank' ? '✓' : '📋'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-600 text-xs font-semibold mb-0.5">ACCOUNT NAME</p>
                      <p className="text-gray-900 font-bold text-sm">
                        {userData.firstName ? `${userData.firstName} - Sharwa` : 'Loading...'}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-center space-x-1 text-gray-600">
                        <span className="text-xs">⚡</span>
                        <p className="text-xs font-bold">Instant Auto-Credit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 gap-6">
            {/* PalmPay Desktop */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-50"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">🏦</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">PRIMARY ACCOUNT</p>
                        <p className="text-gray-900 font-bold text-lg">PalmPay MFB</p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-blue-100 rounded-full">
                      <p className="text-blue-700 text-xs font-bold">Recommended</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 mb-4 shadow-lg">
                    <p className="text-blue-100 text-xs font-semibold mb-2 tracking-wide">ACCOUNT NUMBER</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-black text-3xl tracking-wider">
                        {userData.accountNumber || 'Loading...'}
                      </p>
                      <button
                        onClick={() => copyToClipboard(userData.accountNumber, 'palmpay')}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all"
                      >
                        <span className="text-lg">{copied === 'palmpay' ? '✓' : '📋'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-600 text-xs font-semibold mb-1">ACCOUNT NAME</p>
                    <p className="text-gray-900 font-bold">
                      {userData.firstName ? `${userData.firstName} - Sharwa Data` : 'Loading...'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <span className="text-sm">⚡</span>
                      <p className="text-xs font-bold">Instant Auto-Credit • 24/7 Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Nombank Desktop */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600 to-gray-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-slate-50 opacity-50"></div>
                
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">💳</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">ALTERNATIVE ACCOUNT</p>
                        <p className="text-gray-900 font-bold text-lg">Nombank MFB</p>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-gray-100 rounded-full">
                      <p className="text-gray-700 text-xs font-bold">Backup</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl p-5 mb-4 shadow-lg">
                    <p className="text-slate-200 text-xs font-semibold mb-2 tracking-wide">ACCOUNT NUMBER</p>
                    <div className="flex items-center justify-between">
                      <p className="text-white font-black text-3xl tracking-wider">
                        {userData.accountNumber1 || 'Loading...'}
                      </p>
                      <button
                        onClick={() => copyToClipboard(userData.accountNumber1, 'nombank')}
                        className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center transition-all"
                      >
                        <span className="text-lg">{copied === 'nombank' ? '✓' : '📋'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-gray-600 text-xs font-semibold mb-1">ACCOUNT NAME</p>
                    <p className="text-gray-900 font-bold">
                      {userData.firstName ? `${userData.firstName} - Sharwa Data` : 'Loading...'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-2 text-gray-600">
                      <span className="text-sm">⚡</span>
                      <p className="text-xs font-bold">Instant Auto-Credit • 24/7 Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Services Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Quick Services</h2>
              <p className="text-gray-500 text-sm">Access all services with just one tap</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map((service, index) => (
              <button
                onClick={() => router.push(`/dashboard/${service.route}`)}
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-bold text-sm mb-0.5">{service.label}</p>
                    <p className="text-gray-500 text-xs font-medium">{service.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Premium Support Section */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-3xl">🎯</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-xl mb-1">Need Assistance?</h3>
                  <p className="text-purple-100 text-sm">Our dedicated support team is available 24/7 to help you</p>
                </div>
              </div>
              <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-purple-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 whitespace-nowrap">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 shadow-2xl max-w-sm mx-4">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-2 border-4 border-purple-400 rounded-full border-t-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
              </div>
              <div className="text-center">
                <p className="text-gray-900 font-black text-xl mb-2">Loading...</p>
                <p className="text-gray-500 text-sm">Getting your data ready</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}