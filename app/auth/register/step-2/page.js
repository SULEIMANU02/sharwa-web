'use client'

import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAuth, createUserWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { app } from '@/lib/firebase'
import { Suspense } from 'react'

// Create a separate component that uses useSearchParams
function RegisterStep2Content() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Get data from previous step
  const firstName = searchParams.get('firstName') || ''
  const lastName = searchParams.get('lastName') || ''
  const email = searchParams.get('email') || ''
  const phoneNumber = searchParams.get('phoneNumber') || ''
  const referral = searchParams.get('referral') || ''

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [errorModal, setErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [validation, setValidation] = useState({
    uppercase: false,
    lowercase: false,
    number: false,
    characters: false,
    passwordMatch: false
  })

  const watchPassword = watch('password', '')
  const watchConfirmPassword = watch('confirmPassword', '')
  const watchPin = watch('pin', '')

  // Validate password in real-time
  useEffect(() => {
    const validatePassword = () => {
      const hasUpperCase = /[A-Z]/.test(watchPassword)
      const hasLowerCase = /[a-z]/.test(watchPassword)
      const hasNumber = /[0-9]/.test(watchPassword)
      const hasMinLength = watchPassword.length >= 8
      const passwordsMatch = watchPassword === watchConfirmPassword && watchPassword !== ''

      setValidation({
        uppercase: hasUpperCase,
        lowercase: hasLowerCase,
        number: hasNumber,
        characters: hasMinLength,
        passwordMatch: passwordsMatch
      })
    }

    validatePassword()
  }, [watchPassword, watchConfirmPassword])

  const isFormValid = () => {
    return validation.uppercase && 
           validation.lowercase && 
           validation.number && 
           validation.characters && 
           validation.passwordMatch && 
           watchPin?.length === 4
  }

  const showError = (message) => {
    setErrorMessage(message)
    setErrorModal(true)
  }

  const submitData = async (data) => {
    if (!isFormValid()) {
      showError('Please meet all password requirements and enter a 4-digit PIN')
      return
    }

    setLoading(true)
    let firebaseUser = null
    
    try {
      // Step 1: Create user in Firebase
      const auth = getAuth(app)
      const userCredential = await createUserWithEmailAndPassword(auth, email, data.password)
      firebaseUser = userCredential.user
      console.log('Firebase user created:', firebaseUser.uid)

      // Step 2: Only send to endpoint if Firebase registration is successful
      const userData = {
        uid: firebaseUser.uid,
        firstName,
        lastName,
        email: firebaseUser.email,
        phoneNumber,
        pin: data.pin,
        referral: referral || ''
      }
      
      const response = await fetch('https://sharwadata.com.ng/register/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      })
      
      const result = await response.json()
      console.log('Backend response:', result)
      
      if (result.success) {
        setSuccessModal(true)
        setLoading(false)
      } else {
        // Backend failed, delete Firebase user
        console.log('Backend registration failed, deleting Firebase user...')
        
        if (firebaseUser) {
          await deleteUser(firebaseUser)
          console.log('Firebase user deleted successfully')
        }
        
        setLoading(false)
        showError('Registration Failed: ' + (result.message || 'An error occurred during registration. Please try again.'))
      }
      
    } catch (error) {
      setLoading(false)
      console.error('Error during registration:', error)
      
      // If Firebase user was created but something else failed, delete it
      if (firebaseUser) {
        try {
          await deleteUser(firebaseUser)
          console.log('Firebase user deleted after error')
        } catch (deleteError) {
          console.error('Error deleting Firebase user:', deleteError)
        }
      }
      
      // Handle specific Firebase errors
      let errorMsg = 'Could not complete registration. Please try again or contact support.'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please use a different email or login.'
      } else if (error.code === 'auth/weak-password') {
        errorMsg = 'Password is too weak. Please use a stronger password.'
      } else if (error.code === 'auth/network-request-failed') {
        errorMsg = 'Network error. Please check your internet connection and try again.'
      } else if (error.code === 'auth/invalid-email') {
        errorMsg = 'Invalid email address. Please check your email and try again.'
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMsg = 'Email/password accounts are not enabled. Please contact support.'
      }
      
      showError(errorMsg)
    }
  }

  const closeSuccessModal = () => {
    setSuccessModal(false)
    router.push('/auth/login')
  }

  const closeErrorModal = () => {
    setErrorModal(false)
  }

  const ValidationItem = ({ isValid, text }) => (
    <div className="flex items-center space-x-2 mb-2">
      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
        isValid ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <span className="text-white text-xs">
          {isValid ? '✓' : '✗'}
        </span>
      </div>
      <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
        {text}
      </span>
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button 
            onClick={() => router.back()}
            className="mb-4 text-white text-4xl font-bold hover:text-blue-200 transition-colors duration-200"
          >
            ←
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <h1 className="text-2xl font-bold text-white text-center mb-2">
              Create Secure Access
            </h1>
            <p className="text-white/80 text-center mb-8 text-lg">
              Create a Strong Password and PIN
            </p>

            <form onSubmit={handleSubmit(submitData)} className="space-y-6">
              <div className="space-y-4">
                {/* Transaction PIN */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    TRANSACTION PIN
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="4 digits PIN"
                      maxLength={4}
                      className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 pr-12 text-black"
                      {...register('pin', {
                        required: 'Transaction PIN is required',
                        pattern: {
                          value: /^\d{4}$/,
                          message: 'PIN must be exactly 4 digits'
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
                  {errors.pin && (
                    <p className="text-red-200 text-sm mt-1">{errors.pin.message}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Password"
                      className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 pr-12 text-black"
                      {...register('password', {
                        required: 'Password is required'
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
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-white text-sm font-semibold mb-2 uppercase tracking-wide">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full px-4 py-3 rounded-lg bg-white/90 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 pr-12 text-black"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password'
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
                </div>

                {/* Password Validation */}
                <div className="bg-white/20 rounded-lg p-4 space-y-2">
                  <h3 className="text-white font-semibold mb-2">Password Requirements:</h3>
                  <ValidationItem isValid={validation.uppercase} text="At least one uppercase letter" />
                  <ValidationItem isValid={validation.lowercase} text="At least one lowercase letter" />
                  <ValidationItem isValid={validation.number} text="At least one number" />
                  <ValidationItem isValid={validation.characters} text="Minimum 8 characters" />
                  <ValidationItem isValid={validation.passwordMatch} text="Passwords must match" />
                  <ValidationItem isValid={watchPin?.length === 4} text="4-digit PIN required" />
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid() || loading || isSubmitting}
                className="w-full bg-[#0a59d0] hover:bg-[#094bb0] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="ml-2">Creating Account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white text-2xl font-bold">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                🎊 "Welcome! Your Account is Ready to Use!"
              </p>
              <button
                onClick={closeSuccessModal}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 w-full"
              >
                Proceed to Login
              </button>
            </div>
          </div>
        </div>
      )}

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
                {errorMessage}
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

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-8 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0a59d0] mb-4"></div>
              <p className="text-gray-700 font-semibold">Creating your account...</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Main component with Suspense boundary
export default function RegisterStep2() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <RegisterStep2Content />
    </Suspense>
  )
}