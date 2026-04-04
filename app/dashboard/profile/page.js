'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '@/lib/firebase'
import {
  ChevronRightIcon,
  DocumentTextIcon,
  EyeIcon,
  EyeSlashIcon,
  KeyIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline'

const API_USER_ROLES = {
  docs: ['api', 'admin', 'api-user'],
  key: ['api user', 'admin', 'api-user']
}

export default function SettingsPage() {
  const router = useRouter()
  const [userData, setUserData] = useState({
    firstName: '',
    email: '',
    role: '',
    apiKey: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)
  const [apiKeyPassword, setApiKeyPassword] = useState('')
  const [isVerifyingApiKey, setIsVerifyingApiKey] = useState(false)
  const [apiKeyError, setApiKeyError] = useState('')
  const [copiedApiKey, setCopiedApiKey] = useState(false)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const email = (localStorage.getItem('email') || '').toLowerCase()
      if (!email) {
        setError('Please log in to view settings')
        return
      }

      const firstName = localStorage.getItem('firstName') || ''
      const role = localStorage.getItem('role') || ''

      const response = await fetch(`https://sharwadata.com.ng/api/plans/user?email=${encodeURIComponent(email)}`)
      const data = await response.json()
      const apiKey = data?.data?.apikey || data?.data?.apiKey || ''
      const resolvedRole = data?.data?.role || role

      setUserData({
        firstName,
        email,
        role: resolvedRole,
        apiKey
      })
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError('Unable to load settings. Please reload or try again later.')
    } finally {
      setLoading(false)
    }
  }

  const openApiKeyModal = () => {
    setShowApiKeyModal(true)
    setShowApiKey(false)
    setApiKeyPassword('')
    setApiKeyError('')
  }

  const closeApiKeyModal = () => {
    setShowApiKeyModal(false)
    setShowApiKey(false)
    setApiKeyPassword('')
    setApiKeyError('')
  }

  const verifyPasswordAndShowApiKey = async () => {
    if (!apiKeyPassword) {
      setApiKeyError('Password is required')
      return
    }

    setIsVerifyingApiKey(true)
    setApiKeyError('')

    try {
      const auth = getAuth(app)
      await signInWithEmailAndPassword(auth, userData.email, apiKeyPassword)
      setShowApiKey(true)
    } catch (err) {
      console.error('Invalid password', err)
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setApiKeyError('Incorrect password')
      } else if (err.code === 'auth/too-many-requests') {
        setApiKeyError('Too many attempts. Try again later.')
      } else {
        setApiKeyError('Failed to verify password')
      }
    } finally {
      setIsVerifyingApiKey(false)
    }
  }

  const copyToClipboard = async (text) => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopiedApiKey(true)
      setTimeout(() => setCopiedApiKey(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  const formatApiKey = (key, reveal = false) => {
    if (!key) return 'Not available'
    if (reveal) return key
    const start = key.substring(0, 4)
    const end = key.substring(key.length - 4)
    return `${start}••••${end}`
  }

  const handleOpenApiDocs = () => {
    if (typeof window !== 'undefined') {
      window.open('/dashboard/api-docs', '_blank')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  const normalizedRole = (userData.role || '').toLowerCase()
  const canViewDocs = API_USER_ROLES.docs.includes(normalizedRole)
  const canViewKey = API_USER_ROLES.key.includes(normalizedRole)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <ChevronRightIcon className="h-5 w-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-sm text-gray-500">Manage API access and account preferences</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xl">
                {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">Signed in as</p>
              <h2 className="text-2xl font-semibold text-gray-800">{userData.email || 'User'}</h2>
              <p className="text-sm text-gray-500">
                Role: <span className="font-medium text-gray-700">{userData.role || 'User'}</span>
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Your API key unlocks programmatic access. Keep it safe and rotate it if you suspect it is compromised.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Actions</h3>
          <div className="space-y-3">
            {canViewDocs && (
              <button
                onClick={handleOpenApiDocs}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group border border-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">API Documentation</p>
                    <p className="text-sm text-gray-500">Developer resources</p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              </button>
            )}

            {canViewKey && (
              <button
                onClick={openApiKeyModal}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group border border-transparent"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <KeyIcon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-800">API Key</p>
                    <p className="text-sm text-gray-500">{formatApiKey(userData.apiKey)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {showApiKey ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </div>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <ExclamationCircleIcon className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>

      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md border border-gray-100 shadow-lg">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Your API Key</h3>
              <button
                onClick={closeApiKeyModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {!showApiKey ? (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto">
                      <KeyIcon className="h-8 w-8 text-amber-600" />
                    </div>
                    <p className="text-gray-600">Enter your password to view your API key</p>
                    <p className="text-sm text-gray-500">This is required for security reasons</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={apiKeyPassword}
                      onChange={(e) => setApiKeyPassword(e.target.value)}
                      className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>
                  {apiKeyError && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                      <ExclamationCircleIcon className="h-5 w-5" />
                      <p className="text-sm">{apiKeyError}</p>
                    </div>
                  )}
                  <button
                    onClick={verifyPasswordAndShowApiKey}
                    disabled={isVerifyingApiKey}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isVerifyingApiKey ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Verifying...
                      </>
                    ) : (
                      'Show API Key'
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-medium text-gray-700">API Key</span>
                      <button
                        onClick={() => copyToClipboard(userData.apiKey || '')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        {copiedApiKey ? (
                          <>
                            <ClipboardDocumentCheckIcon className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <ClipboardDocumentIcon className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="font-mono text-sm bg-white p-3 rounded border break-all text-black">
                      {userData.apiKey}
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Keep this key secure. Do not share it publicly.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Security Notice</h4>
                        <p className="text-sm text-amber-700">
                          Your API key provides full access to your account. Never expose it on the client or in public repositories.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={closeApiKeyModal}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
