// Session management utilities for web
import { storage } from './storage'

/**
 * Generate a unique session token for web
 * This replaces the Expo push notification token for web sessions
 */
export function generateWebToken() {
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(2, 15)
  const randomStr2 = Math.random().toString(36).substring(2, 15)
  return `web_${timestamp}_${randomStr}${randomStr2}`
}

/**
 * Create a new session
 */
export function createSession(userData, token = null) {
  const sessionToken = token || generateWebToken()
  
  const session = {
    token: sessionToken,
    user: userData,
    createdAt: Date.now(),
    lastActive: Date.now()
  }
  
  storage.set('session', session)
  storage.set('token', sessionToken)
  storage.set('email', userData.email)
  
  // Store individual user fields for compatibility
  if (userData.firstName) storage.set('firstName', userData.firstName)
  if (userData.lastName) storage.set('lastName', userData.lastName)
  if (userData.phoneNumber) storage.set('phoneNumber', userData.phoneNumber)
  if (userData.pin) storage.set('pin', userData.pin)
  if (userData.accountNumber) storage.set('accountNumber', userData.accountNumber)
  if (userData.role) storage.set('role', userData.role)
  
  return session
}

/**
 * Get current session
 */
export function getSession() {
  return storage.get('session', null)
}

/**
 * Update session last active time
 */
export function updateSessionActivity() {
  const session = getSession()
  if (session) {
    session.lastActive = Date.now()
    storage.set('session', session)
  }
}

/**
 * Check if session is valid
 */
export function isSessionValid() {
  const session = getSession()
  if (!session || !session.token) return false
  
  // Check if session is older than 30 days
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000
  const sessionAge = Date.now() - session.createdAt
  
  return sessionAge < thirtyDaysInMs
}

/**
 * Clear session (logout)
 */
export function clearSession() {
  storage.remove('session')
  storage.remove('token')
  storage.remove('email')
  storage.remove('firstName')
  storage.remove('lastName')
  storage.remove('phoneNumber')
  storage.remove('pin')
  storage.remove('accountNumber')
  storage.remove('role')
}

/**
 * Get stored email (for returning users)
 */
export function getStoredEmail() {
  return storage.get('email', null)
}

/**
 * Check if user has completed onboarding
 */
export function hasCompletedOnboarding() {
  return storage.get('onboarded', '0') === '1'
}

/**
 * Mark onboarding as complete
 */
export function completeOnboarding() {
  storage.set('onboarded', '1')
}

/**
 * Send token to backend
 */
export async function sendTokenToBackend(email) {
  try {
    const token = storage.get('token', null)
    if (!token) {
      console.warn('No token found to send')
      return
    }

    const response = await fetch('https://sharwadata.com.ng/register/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_login: email,
        token: token
      })
    })

    const result = await response.json()
    console.log('Token sent to backend:', result)
    return result
  } catch (error) {
    console.error('Error sending token to backend:', error)
    throw error
  }
}