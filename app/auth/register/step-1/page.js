'use client'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterStep1() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleBackPress = (e) => {
      e.preventDefault()
      if (window.confirm('Do you want to exit?')) {
        window.close()
      }
    }

    window.addEventListener('beforeunload', handleBackPress)
    return () => window.removeEventListener('beforeunload', handleBackPress)
  }, [])

  const checkDb = async (data) => {
    try {
      setLoading(true)
      
      // Check network connection
      if (!navigator.onLine) {
        setModal(true)
        setMessage('No internet connection. Please check your connection and try again.')
        return false
      }

      const email2 = data.email.toLowerCase()
      const response = await fetch('https://sharwadata.com.ng/api/plans/register', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', 
        },
        body: JSON.stringify({ 
          email: email2, 
          phoneNumber: data.phoneNumber 
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const result = await response.json()

      if (result.emailExists) {
        setModal(true)
        setMessage('This email already exists.')
        return false
      } else if (result.phoneNumberExists) {
        setModal(true)
        setMessage('This phone number already exists.')
        return false
      }
      
      return true
    } catch (error) {
      if (error.message === 'Failed to fetch' || error.message.includes('Network')) {
        setModal(true)
        setMessage('No internet connection. Please check your connection and try again.')
      } else {
        setModal(true)
        setMessage('An unexpected error occurred. Please try again later.')
      }
      return false
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    // Validate phone number format
    if (data.phoneNumber.length !== 11 || !data.phoneNumber.startsWith('0')) {
      setModal(true)
      setMessage('Please enter a valid Phone number (11 digits starting with 0)')
      return
    }

    // Validate email format
    if (!data.email.includes('@') || !data.email.includes('.')) {
      setModal(true)
      setMessage('Please enter a valid Email address')
      return
    }

    const isValid = await checkDb(data)
    if (isValid) {
      // Navigate to step 2 with data
      const params = new URLSearchParams(data).toString()
      router.push(`/auth/register/step-2?${params}`)
    }
  }

  const closeModal = () => {
    setModal(false)
    setLoading(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h1 className="text-3xl font-bold text-white text-center mb-2">
              Create new Account
            </h1>
            <p className="text-white/80 text-center mb-8 text-lg">
              Sign Up to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-black"
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  {errors.firstName && (
                    <p className="text-red-200 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    LAST NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-black"
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  {errors.lastName && (
                    <p className="text-red-200 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-black"
                    {...register('email', { 
                      required: 'Email address is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="text-red-200 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    PHONE NUMBER
                  </label>
                  <input
                    type="tel"
                    placeholder="08012345678"
                    maxLength={11}
                    className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-black"
                    {...register('phoneNumber', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^0\d{10}$/,
                        message: 'Please enter a valid phone number (11 digits starting with 0)'
                      }
                    })}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-200 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    REFERRAL CODE
                  </label>
                  <input
                    type="text"
                    placeholder="(Optional)"
                    className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 text-black"
                    {...register('referral')}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full bg-[#0a59d0] hover:bg-[#094bb0] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="ml-2">Processing...</span>
                  </div>
                ) : (
                  'Continue'
                )}
              </button>

              <div className="text-center mt-6">
                <p className="text-white font-semibold">
                  Have an Account?{' '}
                  <Link 
                    href="/auth/login" 
                    className="text-white font-black underline hover:text-blue-200 transition-colors duration-200"
                  >
                    LOGIN
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">!</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {message}
              </p>
              <button
                onClick={closeModal}
                className="bg-[#0a59d0] hover:bg-[#094bb0] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a59d0] mb-4"></div>
              <p className="text-gray-700 font-semibold">Processing...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}