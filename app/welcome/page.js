'use client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with Logo */}
      <div className="flex-[0.3] flex items-center justify-center px-5 pt-10">
        <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center">
          <div className="relative w-24 h-24">
            <Image
              src="/assets/icon.png"
              alt="sharwa data Logo"
              width={96}
              height={96}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-[0.7] bg-white rounded-t-[60px] -mt-5 px-4 pt-16 shadow-[0_-2px_10px_rgba(0,0,0,0.1)]">
        <div className="max-w-md mx-auto">
          <h1 className="text-[6.5vw] md:text-3xl font-bold text-center text-[#0a59d0] mb-4">
            Get Started with sharwa data
          </h1>
          
          <p className="text-[4vw] md:text-base text-center text-gray-600 mb-20">
            Your gateway to fast, secure, and seamless VTU transactions. Manage your payments, bills, and more with ease.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-[#0a59d0] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Login
            </button>

            <button
              onClick={() => router.push('/auth/register/step-1')}
              className="w-full bg-[#0a59d0] text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}