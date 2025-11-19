'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'

const API_BASE_URL = 'https://sharwadata.com.ng/api/plans'

export default function DataPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const number2 = searchParams.get('number2')
  
  const [recently, setRecently] = useState(false)
  const [plansvisible, setPlansvisible] = useState(false)
  const [typesVisible, setTypeVisible] = useState(false)
  const [summary, setSummary] = useState(false)
  const [lowBalance, setLowBalance] = useState(false)
  const [data, setData] = useState([])
  
  // Operation states
  const [username, setUsername] = useState('')
  const [balance, setBalance] = useState('')
  const [phone, setPhone] = useState(number2 || '')
  const [numberValid, setNumberValid] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [activeTypes, setActiveTypes] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [activePlans, setActivePlans] = useState(null)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [price, setPrice] = useState('')

  // Services states
  const [mtntype, setMtntype] = useState(null)
  const [mtnsme, setMtnsme] = useState(null)
  const [mtncorporate, setMtncorporate] = useState(null)
  const [mtngifting, setMtngifting] = useState(null)
  const [airteltype, setAirteltype] = useState(null)
  const [airtelsme, setAirtelsme] = useState(null)
  const [airtelcorporate, setAirtelcorporate] = useState(null)
  const [airtelgifting, setAirtelgifting] = useState(null)
  const [glotype, setGlotype] = useState(null)
  const [glosme, setGlosme] = useState(null)
  const [glocorporate, setGlocorporate] = useState(null)
  const [glogifting, setGlogifting] = useState(null)
  const [ninemobiletype, setNinemobiletype] = useState(null)
  const [ninemobilesme, setNinemobilesme] = useState(null)
  const [ninemobilecorporate, setNinemobilecorporate] = useState(null)
  const [ninemobilegifting, setNinemobilegifting] = useState(null)

  // Network icons
  const networkIcons = {
    0: '/assets/networks/mtn.png',
    1: '/assets/networks/airtel.png', 
    2: '/assets/networks/glo.png',
    3: '/assets/networks/9mobile.png',
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
      setLoading(true)
      
      // Fetch user balance
      const email = localStorage.getItem('email')
      if (email) {
        const response = await fetch(`${API_BASE_URL}/user?email=${email}`)
        const data = await response.json()
        setBalance(data.data.balance)
      }

      // Fetch data plans
      const plansResponse = await fetch(`${API_BASE_URL}/data`)
      const plansData = await plansResponse.json()

      // Fetch network types status
      const typeResponse = await fetch(`${API_BASE_URL}/datatype`)
      const types = await typeResponse.json()

      // Process networks
      const networks = [
        { id: 0, name: 'mtn', setTypes: setMtntype, setSme: setMtnsme, setCorporate: setMtncorporate, setGifting: setMtngifting },
        { id: 1, name: 'airtel', setTypes: setAirteltype, setSme: setAirtelsme, setCorporate: setAirtelcorporate, setGifting: setAirtelgifting },
        { id: 2, name: 'glo', setTypes: setGlotype, setSme: setGlosme, setCorporate: setGlocorporate, setGifting: setGlogifting },
        { id: 3, name: '9mobile', setTypes: setNinemobiletype, setSme: setNinemobilesme, setCorporate: setNinemobilecorporate, setGifting: setNinemobilegifting }
      ]

      for (const network of networks) {
        try {
          const result = types.data.find(item => item.network === network.id)
          const activeTypes = []
          if (result?.smestatus) activeTypes.push('sme')
          if (result?.corporatestatus) activeTypes.push('corporate')
          if (result?.giftingstatus) activeTypes.push('gifting')
          network.setTypes(activeTypes)

          // Process plans for each type
          if (activeTypes.includes('sme')) {
            const smePlans = plansData.data.filter(item => 
              item.network === network.name && item.type === "sme"
            ).map(doc => ({
              label: doc.name,
              price: doc.price,
              id: doc.planid
            }))
            network.setSme(smePlans)
          }

          if (activeTypes.includes('corporate')) {
            const corporatePlans = plansData.data.filter(item => 
              item.network === network.name && item.type === "corporate"
            ).map(doc => ({
              label: doc.name,
              price: doc.price,
              id: doc.planid
            }))
            network.setCorporate(corporatePlans)
          }

          if (activeTypes.includes('gifting')) {
            const giftingPlans = plansData.data.filter(item => 
              item.network === network.name && item.type === "gifting"
            ).map(doc => ({
              label: doc.name,
              price: doc.price,
              id: doc.planid
            }))
            network.setGifting(giftingPlans)
          }
        } catch (error) {
          console.error(`Error processing ${network.name} data:`, error)
          network.setSme([])
          network.setCorporate([])
          network.setGifting([])
        }
      }
    } catch (error) {
      console.error('Error in fetchData:', error)
    } finally {
      setLoading(false)
    }
  }

  const viewHandler = useCallback(() => {
    const networkPlans = {
      mtn: { types: mtntype, sme: mtnsme, corporate: mtncorporate, gifting: mtngifting },
      airtel: { types: airteltype, sme: airtelsme, corporate: airtelcorporate, gifting: airtelgifting },
      glo: { types: glotype, sme: glosme, corporate: glocorporate, gifting: glogifting },
      nineMobile: { types: ninemobiletype, sme: ninemobilesme, corporate: ninemobilecorporate, gifting: ninemobilegifting }
    }

    const networkKeys = ['mtn', 'airtel', 'glo', 'nineMobile']
    const currentNetwork = networkKeys[selectedIndex]

    if (currentNetwork === undefined) {
      setActivePlans(null)
      return null
    }

    const network = networkPlans[currentNetwork]
    setActiveTypes(network.types)

    let planType
    if (selectedType === 0 && network.types?.includes("sme")) {
      planType = "sme"
    } else if (selectedType === 1 && network.types?.includes("corporate")) {
      planType = "corporate"
    } else if (selectedType === 2 && network.types?.includes("gifting")) {
      planType = "gifting"
    } else if (selectedType === 0 && network.types?.includes("corporate")) {
      planType = "corporate"
    } else if (selectedType === 1 && network.types?.includes("gifting")) {
      planType = "gifting"
    }

    if (planType && network[planType]) {
      const sortedPlans = network[planType].slice().sort((a, b) => a.price - b.price)
      setActivePlans(sortedPlans)
      setPlansvisible(true)
      return sortedPlans
    }

    setActivePlans(null)
    return null
  }, [selectedIndex, selectedType, mtntype, mtnsme, mtncorporate, mtngifting, airteltype, airtelsme, airtelcorporate, airtelgifting, glotype, glosme, glocorporate, glogifting, ninemobiletype, ninemobilesme, ninemobilecorporate, ninemobilegifting])

  useEffect(() => {
    viewHandler()
  }, [viewHandler])

  useEffect(() => {
    fetchData()
  }, [])

  const handleSelectNetwork = () => {
    if (numberValid && selectedIndex !== null) {
      setTypeVisible(true)
    } else if (!numberValid && selectedIndex !== null) {
      alert('Please input a valid beneficiary phone number')
      setSelectedIndex(null)
    }
  }

  useEffect(() => {
    handleSelectNetwork()
  }, [numberValid, selectedIndex])

  const resetStatesOnNetworkChange = (index) => {
    if (index === 0) {
      setActiveTypes(mtntype)
    } else if (index === 1) {
      setActiveTypes(airteltype)
    } else if (index === 2) {
      setActiveTypes(glotype)
    } else if (index === 3) {
      setActiveTypes(ninemobiletype)
    }
    setActivePlans(null)
    setPlansvisible(false)
  }

  const handleProceed = () => {
    const selectedPlanPrice = Number(activePlans[selectedPlan]?.price)
    
    if (!selectedPlanPrice) {
      alert('Please select a valid plan')
      return
    }

    if (balance < selectedPlanPrice) {
      setLowBalance(true)
      alert(`Insufficient balance. Please fund your wallet.`)
    } else {
      router.push(`/dashboard/data/pin?network=${selectedIndex}&phone=${phone}&planId=${activePlans[selectedPlan]?.id}&type=${activeTypes[selectedType]}&amount=${selectedPlanPrice}&plan=${encodeURIComponent(activePlans[selectedPlan]?.label)}&username=${username}`)
    }
  }

  const getNetworkName = (index) => {
    const names = ['MTN', 'Airtel', 'GLO', '9mobile']
    return names[index] || ''
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
            <h1 className="text-xl font-semibold text-blue-600">Data</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Input Section */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-medium mb-2">Phone Number</label>
          <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-3 shadow-sm">
            <input
              type="tel"
              placeholder="Phone Number"
              className="flex-1 outline-none text-gray-800"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={11}
            />
            {/* <button 
              onClick={() => router.push('/contacts?previous=Data')}
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
              onClick={() => {
                setSelectedIndex(index)
                resetStatesOnNetworkChange(index)
              }}
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
                  className="rounded-lg"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Data Type Selection */}
        {typesVisible && activeTypes && (
          <div className="flex justify-around mb-6">
            {activeTypes.map((type, index) => (
              <button
                key={index}
                onClick={() => setSelectedType(index)}
                className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                  selectedType === index
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-green-100 text-blue-600 hover:bg-green-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        )}

        {/* Data Plans */}
        {plansvisible && activePlans && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-1 gap-3">
              {activePlans.map((plan, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedPlan(index)
                    numberValid && setSummary(true)
                  }}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedPlan === index
                      ? 'border-blue-600 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-400 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-bold ${
                      selectedPlan === index ? 'text-blue-600' : 'text-blue-600'
                    }`}>
                      {plan.label}
                    </span>
                    <span className={`font-bold ${
                      selectedPlan === index ? 'text-gray-900' : 'text-gray-900'
                    }`}>
                      ₦{plan.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Summary Modal */}
        {summary && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSummary(false)}></div>
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={() => setSummary(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
                <h2 className="text-xl font-bold text-gray-900">Transaction Summary</h2>
                <div className="w-8"></div> {/* Spacer for centering */}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Network</span>
                  <span className="font-semibold text-gray-900">{getNetworkName(selectedIndex)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Data Type</span>
                  <span className="font-semibold text-gray-900 capitalize">{activeTypes[selectedType]}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className="font-semibold text-gray-900">{activePlans[selectedPlan]?.label}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold text-gray-900">₦{activePlans[selectedPlan]?.price}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-semibold text-gray-900">{phone}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Wallet Balance</span>
                  <span className="font-semibold text-gray-900">₦{balance}</span>
                </div>
                {balance < Number(activePlans[selectedPlan]?.price) && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm font-medium text-center">
                      Insufficient balance. Please fund your wallet.
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleProceed}
                disabled={balance < Number(activePlans[selectedPlan]?.price)}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl mt-6 transition-colors duration-200"
              >
                PROCEED
              </button>
            </div>
          </>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-700 font-semibold">Loading plans...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}