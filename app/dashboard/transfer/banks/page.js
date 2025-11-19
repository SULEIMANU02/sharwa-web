'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function BankListScreen() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [filteredBanks, setFilteredBanks] = useState([])
  const [bankList, setBankList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true)
      const url = 'https://sharwadata.com.ng/api/plans/banks'
      try {
        const options = await fetch(url)
        const response = await options.json()
        if (response.data) {
          setBankList(response.data.data)
          setFilteredBanks(response.data.data)
          setLoading(false)
        }
      }
      catch (error) {
        console.error('error', error.message)
        alert('An error occurred please try again')
      } finally {
        setLoading(false)
      }
    }
    fetchBanks()
  }, [])

  // Handle search filtering
  const handleSearch = (text) => {
    setSearch(text)
    const filtered = bankList.filter((bank) =>
      bank.name.toLowerCase().includes(text.toLowerCase())
    )
    setFilteredBanks(filtered)
  }

  const handleBankSelect = (bank) => {
    router.push(`/transfer?bank=${encodeURIComponent(bank.name)}&code=${encodeURIComponent(bank.code)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-blue-600 pb-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
              >
                <span className="text-2xl text-blue-600">←</span>
              </button>
              <h1 className="text-xl font-semibold text-blue-600">Select Bank</h1>
            </div>
          </div>
          
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for a bank"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 rounded-lg border border-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        {loading ? (
          // Loading State
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBanks.length > 0 ? (
          // Banks List
          <div className="space-y-3">
            {filteredBanks.map((item, index) => (
              <button
                key={item.id || index}
                onClick={() => handleBankSelect(item)}
                className="w-full flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden mr-4 flex-shrink-0">
                  {item.name === 'paymodest' ? (
                    <Image
                      src="/assets/icon.png"
                      alt={item.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={item.logo || 'https://firebasestorage.googleapis.com/v0/b/business-banking-93cc1.appspot.com/o/bankLogos%2FEmpty%20Bank%20Logo.png?alt=media&token=c800752e-e3f0-41cf-a4bc-de2d4017ca16'}
                      alt={item.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://firebasestorage.googleapis.com/v0/b/business-banking-93cc1.appspot.com/o/bankLogos%2FEmpty%20Bank%20Logo.png?alt=media&token=c800752e-e3f0-41cf-a4bc-de2d4017ca16'
                      }}
                    />
                  )}
                </div>
                <span className="text-lg font-medium text-gray-900 text-left">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-2xl text-gray-400">🏦</span>
            </div>
            <p className="text-gray-600">
              {search ? "Bank not found, enter the correct bank name and try again!" : "No banks available"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}