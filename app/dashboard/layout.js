'use client'
import { useEffect, useState } from 'react'
import AuthGuard from '@/components/AuthGuard'
import DashboardNav from '@/components/Layout/DashboardNav'
import { updateSessionActivity } from '@/lib/sessionManager'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Update session activity on mount and periodically
  useEffect(() => {
    updateSessionActivity()
    
    const interval = setInterval(() => {
      updateSessionActivity()
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname?.includes('/history')) return 'Transaction History'
    if (pathname?.includes('/settings')) return 'Account Settings'
    if (pathname?.includes('/dashboard')) return 'Dashboard'
    return 'sharwadata'
  }

  // Get page description based on current path
  const getPageDescription = () => {
    if (pathname?.includes('/history')) return 'View and manage your transaction history'
    if (pathname?.includes('/settings')) return 'Manage your account preferences'
    if (pathname?.includes('/dashboard')) return ''
    return ''
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        {/* Enhanced Header - ALWAYS SHOWS NOW */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/60 sticky top-0 z-40">
          <div className="container mx-auto px-4">
            {/* Mobile Header */}
            <div className="lg:hidden">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
                  >
                    <div className="w-5 h-5 flex flex-col justify-between">
                      <span className={`w-full h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                      <span className={`w-full h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                      <span className={`w-full h-0.5 bg-blue-600 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </div>
                  </button>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{getPageTitle()}</h1>
                    <p className="text-sm text-gray-500">{getPageDescription()}</p>
                  </div>
                </div>
                
                {/* Mobile Navigation Toggle */}
                {/* <DashboardNav /> */}
              </div>

              {/* Collapsible Mobile Menu */}
              {isMobileMenuOpen && (
                <div className="pb-4 border-t border-gray-200/60 animate-in slide-in-from-top duration-300">
                  <nav className="grid gap-2 pt-4">
                    <a
                      href="/dashboard"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span className="text-lg">🏠</span>
                      <span className="font-medium">Dashboard</span>
                    </a>
                    <a
                      href="/dashboard/history"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span className="text-lg">📊</span>
                      <span className="font-medium">Transaction History</span>
                    </a>
                    <a
                      href="/dashboard/settings"
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      <span className="text-lg">⚙️</span>
                      <span className="font-medium">Settings</span>
                    </a>
                  </nav>
                </div>
              )}
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between py-6">
                <div className="flex items-center space-x-6">
                  {/* Logo/Brand */}
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">AD</span>
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                      <p className="text-gray-500 text-sm mt-1">{getPageDescription()}</p>
                    </div>
                  </div>

                  {/* Breadcrumb Navigation */}
                  <nav className="flex items-center space-x-1 text-sm">
                    <a href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                      Dashboard
                    </a>
                    {pathname !== '/dashboard' && (
                      <>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-700 font-medium">{getPageTitle()}</span>
                      </>
                    )}
                  </nav>
                </div>

                {/* Desktop Navigation */}
                <div className="flex items-center space-x-4">
                  {/* Settings and History Navigation */}
                  <nav className="flex items-center space-x-1 bg-gray-100/80 rounded-xl p-1">
                    <a
                      href="/dashboard/history"
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pathname?.includes('/history') 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      History
                    </a>
                    <a
                      href="/dashboard/settings"
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        pathname?.includes('/settings') 
                          ? 'bg-white text-blue-600 shadow-sm' 
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      Settings
                    </a>
                  </nav>
                  
                  {/* <DashboardNav /> */}
                  
                  {/* Quick Stats */}
                  <div className="flex items-center space-x-6">
                    {/* <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">Current Page</p>
                      <p className="text-sm font-semibold text-gray-900">{getPageTitle()}</p>
                    </div> */}
                    
                    {/* User Status Indicator */}
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Online"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>

        {/* Background Decoration */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </AuthGuard>
  )
}