'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// TransactionItem Component
const TransactionItem = ({ item }) => {
  const router = useRouter()
  
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date"
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return "Invalid Date"
      
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    } catch {
      return "Invalid Date"
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'successful':
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'pending':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTransactionIcon = (type) => {
    const icons = {
      deposit: '💰',
      transfer: '💸',
      airtime: '📞',
      data: '📊',
      electricity: '⚡',
      cable: '📺',
      withdrawal: '🏧',
      default: '💳'
    }
    return icons[type?.toLowerCase()] || icons.default
  }

  const getTransactionLabel = (type, item) => {
    if (type === 'deposit') return 'Transfer Received'
    if (type === 'transfer') return 'Money Transfer'
    if (type === 'airtime') return 'Airtime Purchase'
    if (type === 'data') return 'Data Purchase'
    if (type === 'electricity') return 'Electricity Bill'
    if (type === 'cable') return 'TV Subscription'
    if (type === 'withdrawal') return 'Withdrawal'
    return 'Transaction'
  }

  const getCounterparty = (item) => {
    if (item.senderName) return `from ${item.senderName}`
    if (item.phone_number) return `to ${item.phone_number}`
    if (item.beneficiary) return `to ${item.beneficiary}`
    return ''
  }

  return (
    <div 
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-200"
      onClick={() => router.push(`/dashboard/receipt?id=${item.id}`)}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{getTransactionIcon(item.type)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-gray-900 font-semibold text-sm truncate">
                {getTransactionLabel(item.type, item)}
              </span>
            </div>
            <p className="text-gray-500 text-sm truncate">
              {getCounterparty(item)}
            </p>
          </div>
        </div>
        
        <div className="text-right flex-shrink-0 ml-3">
          <p className={`font-bold text-lg ${
            item.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
          }`}>
            {item.type === 'deposit' ? '+' : '-'}₦{parseInt(item.amount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-gray-500 text-sm">
          {formatDate(item.created_at)}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown'}
        </span>
      </div>
    </div>
  )
}

// Filter Tabs Component
const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All Transactions' },
    { key: 'success', label: 'Successful' },
    { key: 'pending', label: 'Pending' },
    { key: 'failed', label: 'Failed' }
  ]

  return (
    <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-200 ${
            activeFilter === filter.key
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

// Main History Component
export default function HistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  
  const [email, setEmail] = useState("")
  const [history, setHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // Filter transactions based on active filter
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredHistory(history)
    } else {
      const filtered = history.filter(item => 
        item.status?.toLowerCase().includes(activeFilter)
      )
      setFilteredHistory(filtered)
    }
  }, [history, activeFilter])

  const fetchHistory = async () => {
    setLoading(true)
    const savedEmail = localStorage.getItem("email")
    if (savedEmail) {
      setEmail(savedEmail)
    }

    try {
      const response = await fetch(
        `https://sharwadata.com.ng/api/plans/history?email=${userId ? userId : savedEmail}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('History response:', data)

      if (data.success) {
        const sortedTransactions = data.data.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : new Date(0)
          const dateB = b.created_at ? new Date(b.created_at) : new Date(0)
          return dateB - dateA
        })
        
        setHistory(sortedTransactions)
        setError("")
      } else {
        throw new Error(data.error || 'Failed to fetch history')
      }
    } catch (error) {
      console.error("Error fetching history:", error.message)
      setError("Failed to load transaction history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await fetchHistory()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const getStats = () => {
    const total = history.length
    const successful = history.filter(item => 
      item.status?.toLowerCase().includes('success')
    ).length
    const pending = history.filter(item => 
      item.status?.toLowerCase().includes('pending')
    ).length
    const failed = history.filter(item => 
      item.status?.toLowerCase().includes('failed')
    ).length

    return { total, successful, pending, failed }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <span className="text-2xl">←</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
                <p className="text-gray-600 text-sm">View all your transactions</p>
              </div>
            </div>
            
            <button
              onClick={onRefresh}
              disabled={refreshing}
              className="p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors duration-200"
            >
              <span className={`text-lg ${refreshing ? 'animate-spin' : ''}`}>
                🔄
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">Successful</p>
            <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-gray-600 text-sm mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <FilterTabs 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-red-600 text-lg">⚠️</span>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredHistory.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-gray-400">💳</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {activeFilter === 'all' 
                ? "You haven't made any transactions yet." 
                : `No ${activeFilter} transactions found.`
              }
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Make Your First Transaction
            </button>
          </div>
        )}

        {/* Transactions List */}
        {!loading && filteredHistory.length > 0 && (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <TransactionItem key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Load More (if needed) */}
        {filteredHistory.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchHistory}
              disabled={refreshing}
              className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {refreshing ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}