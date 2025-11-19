'use client'
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '@/lib/firebase'
import { createSession, sendTokenToBackend, getStoredEmail } from '@/lib/sessionManager'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()
  const router = useRouter()
  
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [buttonDisabled, setButtonDisabled] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

  // Check if user already has a session on component mount
  useEffect(() => {
    const checkExistingSession = () => {
      const email = getStoredEmail()
      if (email) {
        // User has logged in before, redirect to passcode
        console.log('Existing session found, redirecting to passcode...')
        router.replace('/auth/passcode')
      } else {
        setIsCheckingSession(false)
      }
    }

    checkExistingSession()
  }, [router])

  // Handle back button for web
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

  const checkDb = async (email, password) => {
    try {
      // Check network connection
      if (!navigator.onLine) {
        setLoading(false)
        setErrorModal(true)
        setMessage('You are offline! Please connect to the internet to proceed.')
        return false
      }

      // Use Firebase authentication
      const auth = getAuth(app)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      return true
    } catch (error) {
      console.error('Login Error:', error)
      setLoading(false)
      
      // Check specific Firebase error codes
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || 
          error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        setErrorModal(true)
        setMessage('Either Email or Password is incorrect!')
      } else if (error.code === 'auth/network-request-failed') {
        setErrorModal(true)
        setMessage('Network error. Please check your connection and try again.')
      } else if (error.code === 'auth/too-many-requests') {
        setErrorModal(true)
        setMessage('Too many failed attempts. Please try again later.')
      } else {
        setErrorModal(true)
        setMessage('Login failed. Please try again.')
      }
      return false
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setButtonDisabled(true)

    try {
      if (!data.email) {
        setErrorModal(true)
        setMessage('Email is required')
        setLoading(false)
        setButtonDisabled(false)
        return
      } else if (!data.password) {
        setErrorModal(true)
        setMessage('Password is required')
        setLoading(false)
        setButtonDisabled(false)
        return
      }

      // Step 1: Firebase authentication
      const firebaseSuccess = await checkDb(data.email, data.password)
      if (!firebaseSuccess) {
        setButtonDisabled(false)
        return
      }

      // Step 2: Fetch user data from API
      const response = await fetch(`https://sharwadata.com.ng/api/plans/user?email=${data.email}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }

      const userData = await response.json()
      console.log('User data:', userData)

      // Step 3: Create session with user data
      createSession({
        email: data.email,
        firstName: userData.data.firstname || '',
        lastName: userData.data.lastname || '',
        phoneNumber: userData.data.phoneNumber || '',
        pin: userData.data.pin || '',
        accountNumber: userData.data.account || '',
        role: userData.data.role || ''
      })

      // Step 4: Send token to backend
      await sendTokenToBackend(data.email)

      // Step 5: Show success and navigate to passcode
      setSuccessModal(true)
      setLoading(false)
    } catch (error) {
      console.error('Error in login process:', error)
      setErrorModal(true)
      setMessage('An unexpected error occurred. Please try again later.')
      setLoading(false)
      setButtonDisabled(false)
    }
  }

  const handleContinue = () => {
    setSuccessModal(false)
    // Redirect to passcode page after successful login
    router.replace('/dashboard')
  }

  const closeErrorModal = () => {
    setErrorModal(false)
    setLoading(false)
    setButtonDisabled(false)
  }

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
          <p className="text-white font-semibold">Checking session...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo Container */}
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-20 h-20 relative">
                <Image 
                  src="/assets/icon.png"
                  alt="App Logo"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              Secure login.
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Email Input */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">
                      📧
                    </div>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-200 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Enter Password"
                      className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 pr-12"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    >
                      {passwordVisible ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-200 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={buttonDisabled || loading}
                className="w-full bg-[#0a59d0] hover:bg-[#094bb0] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : (
                  'Continue'
                )}
              </button>

              {/* Forgot Password */}
              <div className="text-center mt-6">
                <Link 
                  href="/auth/reset-password" 
                  className="text-white text-lg font-normal hover:underline transition-colors duration-200"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-8">
                <span className="text-white text-lg font-bold">
                  Don't have an Account?{' '}
                </span>
                <Link 
                  href="/auth/register" 
                  className="text-white text-lg font-black hover:underline transition-colors duration-200"
                >
                  sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {errorModal && (
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
                onClick={closeErrorModal}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 w-full"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                🔓 Welcome Back! You're Successfully Logged In! 🚀
              </p>
              <button
                onClick={handleContinue}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 w-full"
              >
                Continue 
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
              <p className="text-gray-700 font-semibold">Logging you in...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}