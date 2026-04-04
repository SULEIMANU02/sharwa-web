'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
  DocumentTextIcon,
  LockClosedIcon,
  CreditCardIcon,
  ChevronRightIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { signOut, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
    apiKey: '',
    balance: '0',
    level: '1',
    accountNumber: '',
    accountNumber1: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // PIN Change Modal States
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [password, setPassword] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [pinError, setPinError] = useState('');
  
  // API Key Modal States
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyPassword, setApiKeyPassword] = useState('');
  const [isVerifyingApiKey, setIsVerifyingApiKey] = useState(false);
  const [apiKeyError, setApiKeyError] = useState('');
  
  // Account Copy States
  const [copiedAccount, setCopiedAccount] = useState('');
  const [copiedApiKey, setCopiedApiKey] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      // Load user data from localStorage
      const firstName = localStorage.getItem('firstName') || '';
      const lastName = localStorage.getItem('lastName') || '';
      const email = localStorage.getItem('email') || '';
      const phoneNumber = localStorage.getItem('phoneNumber') || '';
      const role = localStorage.getItem('role') || '';
      const balance = localStorage.getItem('balance') || '0';
      const level = localStorage.getItem('level') || '1';
      const accountNumber = localStorage.getItem('accountNumber') || '';
      const accountNumber1 = localStorage.getItem('accountNumber1') || '';

      const userDetails  = fetch(`https://sharwadata.com.ng/api/plans/user?email=${email}`)
      const response = await userDetails;
      const data = await response.json();
      console.log('Fetched user data:', data.data);
      
      const apiKey = data.data.apikey || 'nulllll';

      setUserData({
        firstName,
        lastName,
        email: email.toLowerCase(),
        phoneNumber,
        role,
        apiKey,
        balance,
        level,
        accountNumber,
        accountNumber1
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setError('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to log out?')) {
      try {
        const auth = getAuth(app);
        await signOut(auth);
        
        // Clear all user data from localStorage
        const itemsToRemove = [
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'pin',
          'passcode',
          'accountNumber',
          'accountNumber1',
          'role',
          'apiKey',
          'token',
          'balance',
          'level'
        ];
        
        itemsToRemove.forEach(item => localStorage.removeItem(item));
        
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
        alert('Failed to log out. Please try again.');
      }
    }
  };

  const openPinModal = () => {
    setShowPinModal(true);
    setNewPin('');
    setPassword('');
    setPinError('');
  };

  const closePinModal = () => {
    setShowPinModal(false);
    setNewPin('');
    setPassword('');
    setPinError('');
  };

  const handleChangePin = async () => {
    if (!newPin || newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinError('PIN must be exactly 4 digits');
      return;
    }

    if (!password) {
      setPinError('Password is required');
      return;
    }

    setIsChangingPin(true);
    setPinError('');

    try {
      const auth = getAuth(app);
      const token = localStorage.getItem('token') || '';
      
      // Validate password with Firebase
      await signInWithEmailAndPassword(auth, userData.email, password);
      
      // Send PIN change request to your API
      const response = await fetch('https://sharwadata.com.ng/api/plans/changepin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          pin: newPin,
          token: token
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem('pin', newPin);
        alert('PIN changed successfully!');
        closePinModal();
      } else {
        if (result.error === 'invalid_token') {
          handleSessionExpired();
        } else {
          setPinError(result.message || 'Failed to update PIN');
        }
      }
    } catch (error) {
      console.error('Error changing PIN:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setPinError('Incorrect password');
      } else if (error.code === 'auth/too-many-requests') {
        setPinError('Too many failed attempts. Please try again later.');
      } else {
        setPinError('Failed to validate password');
      }
    } finally {
      setIsChangingPin(false);
    }
  };

  const handleSessionExpired = async () => {
    if (confirm('Session expired. Please login again.')) {
      try {
        const auth = getAuth(app);
        await signOut(auth);
        
        const itemsToRemove = [
          'firstName',
          'lastName',
          'email',
          'phoneNumber',
          'pin',
          'passcode',
          'accountNumber',
          'accountNumber1',
          'role',
          'apiKey',
          'token',
          'balance',
          'level'
        ];
        
        itemsToRemove.forEach(item => localStorage.removeItem(item));
        
        router.push('/');
      } catch (error) {
        console.error('Error during session expiration:', error);
        alert('Failed to sign out properly. Please try again.');
      }
    }
  };

  const openApiKeyModal = () => {
    setShowApiKeyModal(true);
    setApiKeyPassword('');
    setShowApiKey(false);
    setApiKeyError('');
  };

  const closeApiKeyModal = () => {
    setShowApiKeyModal(false);
    setApiKeyPassword('');
    setShowApiKey(false);
    setApiKeyError('');
  };

  const verifyPasswordAndShowApiKey = async () => {
    if (!apiKeyPassword) {
      setApiKeyError('Password is required');
      return;
    }

    setIsVerifyingApiKey(true);
    setApiKeyError('');

    try {
      const auth = getAuth(app);
      
      // Verify password with Firebase
      await signInWithEmailAndPassword(auth, userData.email, apiKeyPassword);
      
      // Password verified successfully
      setShowApiKey(true);
    } catch (error) {
      console.error('Error verifying password:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setApiKeyError('Incorrect password');
      } else if (error.code === 'auth/too-many-requests') {
        setApiKeyError('Too many failed attempts. Please try again later.');
      } else {
        setApiKeyError('Failed to verify password');
      }
    } finally {
      setIsVerifyingApiKey(false);
    }
  };

  const copyToClipboard = async (text, type) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'apiKey') {
        setCopiedApiKey(true);
        setTimeout(() => setCopiedApiKey(false), 2000);
      } else {
        setCopiedAccount(type);
        setTimeout(() => setCopiedAccount(''), 2000);
      }
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const formatApiKey = (key, show) => {
    if (!key) return 'Not available';
    if (show) return key;
    return '•'.repeat(Math.min(key.length, 32));
  };

  const formatBalance = (balance) => {
    const balanceDecimal = parseFloat(balance || '0').toFixed(2);
    return Number(balanceDecimal).toLocaleString('en-US');
  };

  const fullName = `${userData.firstName} ${userData.lastName}`.trim();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                <ChevronRightIcon className="h-5 w-5 rotate-180" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile</h1>
                <p className="text-sm text-gray-500">Manage your account settings</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <span className="text-white text-3xl font-bold">
                      {fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {userData.role === 'admin' && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white">
                      <ShieldCheckIcon className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-800 capitalize">
                    {fullName || 'User'}
                  </h2>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <EnvelopeIcon className="h-5 w-5" />
                      <span>{userData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <PhoneIcon className="h-5 w-5" />
                      <span>{userData.phoneNumber || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Level {userData.level}
                      </div>
                      {userData.role && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userData.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700'
                            : userData.role === 'api'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {userData.role.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Balance Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Balance</p>
                    <p className="text-2xl font-bold text-gray-800">₦{formatBalance(userData.balance)}</p>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Actions */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Settings</h3>
              <div className="space-y-3">
                {/* Change PIN */}
                <button
                  onClick={openPinModal}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <LockClosedIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Change PIN</p>
                      <p className="text-sm text-gray-500">Update your transaction PIN</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </button>

                {/* Upgrade Account */}
                <button
                  onClick={() => router.push('/dashboard/upgrade')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCardIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Upgrade Account</p>
                      <p className="text-sm text-gray-500">Unlock more features</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                </button>

                {/* Admin Dashboard */}
                {userData.role === 'admin' && (
                  <button
                    onClick={() => router.push('/dashboard/admin')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ShieldCheckIcon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">Admin Dashboard</p>
                        <p className="text-sm text-gray-500">Manage platform</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
                  </button>
                )}

                {/* API Documentation */}
                {(userData.role === 'api' || userData.role === 'admin') && (
                  <button
                    onClick={() => window.open('/dashboard/api-docs', '_blank')}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
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
                {/* API Key */}
                {(userData.role === 'api user' || userData.role === 'admin') && (
                  <button
                    onClick={openApiKeyModal}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                        <KeyIcon className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-800">API Key</p>
                        <p className="text-sm text-gray-500">
                          {userData.apiKey ? formatApiKey(userData.apiKey, false) : 'Not available'}
                        </p>
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
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Change PIN</h3>
              <button
                onClick={closePinModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New PIN (4 digits)
                  </label>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-xl tracking-widest font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-black w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                </div>

                {pinError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <ExclamationCircleIcon className="h-5 w-5" />
                    <p className="text-sm">{pinError}</p>
                  </div>
                )}

                <button
                  onClick={handleChangePin}
                  disabled={isChangingPin}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isChangingPin ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Changing PIN...
                    </>
                  ) : (
                    'Change PIN'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-800">Your API Key</h3>
              <button
                onClick={closeApiKeyModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {!showApiKey ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <KeyIcon className="h-8 w-8 text-amber-600" />
                    </div>
                    <p className="text-gray-600 mb-2">
                      Enter your password to view your API key
                    </p>
                    <p className="text-sm text-gray-500">
                      This is required for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
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
                        onClick={() => copyToClipboard(userData.apiKey || '', 'apiKey')}
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
                      🔒 Keep this key secure. Do not share it publicly.
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                        {userData.apiKey}
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <ExclamationCircleIcon className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-amber-800 mb-1">Security Notice</h4>
                        <p className="text-sm text-amber-700">
                          Your API key provides full access to your account. Never expose it in client-side code or public repositories.
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

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}