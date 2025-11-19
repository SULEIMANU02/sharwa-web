'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { app } from '@/lib/firebase'
import { storage } from '@/lib/storage'
import { getStoredEmail, clearSession, sendTokenToBackend } from '@/lib/sessionManager'

export default function PasscodePage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Load user data
    const storedEmail = getStoredEmail()
    const storedFirstName = storage.get('firstName', '')
    
    if (!storedEmail) {
      // No stored email, redirect to welcome
      router.replace('/')
      return
    }

    setEmail(storedEmail)
    setFirstName(storedFirstName)
  }, [router])

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (window.confirm('Do you want to exit?')) {
        return
      }
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    
    if (!password) {
      setError('Password is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Check network connection
      if (!navigator.onLine) {
        setError('You are offline! Please connect to the internet to proceed.')
        setLoading(false)
        return
      }

      // Firebase authentication
      const auth = getAuth(app)
      await signInWithEmailAndPassword(auth, email, password)

      // Send token to backend
      await sendTokenToBackend(email)

      // Navigate to dashboard
      router.replace('/dashboard')
    } catch (error) {
      console.error('Login Error:', error)
      setError('Incorrect Password!')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) {
      return
    }

    try {
      const auth = getAuth(app)
      await signOut(auth)
      clearSession()
      router.replace('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password')
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a59d0]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-lg mb-4">
            <svg className="w-16 h-16 text-[#0a59d0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-light text-gray-600 mb-1">Welcome back</h2>
          <h1 className="text-3xl font-semibold text-gray-900">{firstName}</h1>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wider">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 rounded-xl bg-white border border-gray-200 focus:border-[#0a59d0] focus:ring-2 focus:ring-[#0a59d0]/20 outline-none transition-all duration-200"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}

              <button
                type="button"
                onClick={handleForgotPassword}
                className="mt-2 text-sm text-[#0a59d0] hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={!password || loading}
              className="w-full bg-[#0a59d0] hover:bg-[#094bb0] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-[#0a59d0]/20"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                'CONTINUE'
              )}
            </button>
          </form>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-12 text-[#0a59d0] font-bold text-sm hover:underline"
          >
            Not {firstName}? Log out
          </button>
        </div>
      </div>

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
    </div>
  )
}