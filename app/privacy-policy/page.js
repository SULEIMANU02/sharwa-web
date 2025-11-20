'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PrivacyPolicy() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-lg' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="font-bold text-xl text-gray-900">sharwa data</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => router.push('/')}
                className="font-medium text-gray-700 hover:text-[#0a59d0] transition-colors"
              >
                Back to Home
              </button>
              <button 
                onClick={() => router.push('/auth/register/step-1')}
                className="bg-[#0a59d0] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0847a8] transition-colors"
              >
                Get Started
              </button>
            </div>

            <button className="md:hidden">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your privacy matters to us at sharwa data. Learn how we protect your data.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className={`prose prose-lg max-w-none transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            
            <div className="bg-gray-50 rounded-2xl p-8 mb-12 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">sharwa data Privacy Policy</h2>
              <p className="text-gray-600"><strong>Last Updated:</strong> November 19, 2025</p>
            </div>

            {/* Section 1 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">1. Introduction</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                sharwa data is a Virtual Top-Up (VTU) application for airtime, data, and bill payments in Nigeria. 
                We are committed to safeguarding your privacy and ensuring your personal information is protected. 
                This Privacy Policy explains how we collect, use, and store your data when you create an account 
                and use our app. By using sharwa data, you agree to the practices described herein.
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">2. Age Restriction</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                sharwa data is intended for users aged 18 and older. We do not knowingly collect personal 
                information from individuals under 18. If we discover that a user under 18 has created an 
                account, we will terminate the account and delete all associated data. If you are a parent 
                or guardian and believe your child has provided us with data, please contact us at 
                <span className="text-[#0a59d0] font-medium"> info@sharwadata.com</span>.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">3. Account Creation</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To use sharwa data, you must create an account, as our app requires login for all services, 
                including airtime top-ups, data purchases, and bill payments. During account creation, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Full name, phone number, email address, and a secure password.</li>
              </ul>
              <p className="text-gray-700 mt-4 leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and 
                notifying us immediately of any unauthorized access.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">4. Information We Collect</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We collect the following data to provide our services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Account Information:</strong> Data provided during registration, as described above.</li>
                <li><strong>Transaction Data:</strong> Details of your airtime top-ups, data purchases, and bill payments, including network provider, amount, and timestamp.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">5. How We Use Your Information</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We use your data solely to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Facilitate account creation and login.</li>
                <li>Process transactions for airtime, data, and bill payments.</li>
                <li>Provide customer support and respond to your inquiries.</li>
                <li>Enhance app functionality and user experience through analytics.</li>
                <li>Send transactional notifications (e.g., payment confirmations).</li>
                <li>Detect and prevent fraud, unauthorized access, or security breaches.</li>
                <li>Comply with legal obligations under the Nigeria Data Protection Regulation (NDPR) and other applicable laws.</li>
              </ul>
            </div>

            {/* Section 6 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">6. Data Sharing and Disclosure</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We do not share, sell, or disclose your personal information to any third parties, except as 
                required by law. For example, we may disclose data to legal authorities if compelled by a 
                court order or to protect our rights, safety, or property. All transactions are processed 
                directly through secure payment gateways, and we do not share your payment details with 
                external entities.
              </p>
            </div>

            {/* Section 7 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">7. Data Security</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We employ industry-standard security measures, including encryption, secure servers, and 
                access controls, to protect your data. However, no system is entirely secure. We recommend 
                using a strong, unique password and enabling two-factor authentication (if available) to 
                enhance your account security.
              </p>
            </div>

            {/* Section 8 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">8. Your Rights</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Under the NDPR, you have the following rights regarding your personal data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
                <li><strong>Correction:</strong> Update inaccurate or incomplete data.</li>
                <li><strong>Deletion:</strong> Request deletion of your data, subject to legal retention requirements.</li>
                <li><strong>Objection:</strong> Object to certain data processing activities.</li>
                <li><strong>Complaint:</strong> Lodge a complaint with the National Information Technology Development Agency (NITDA).</li>
              </ul>
              <p className="text-gray-700 mt-4 leading-relaxed">
                To exercise these rights, contact us at 
                <span className="text-[#0a59d0] font-medium"> info@sharwadata.com</span>.
              </p>
            </div>

            {/* Section 10 */}
            <div className="mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">10. Changes to This Policy</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. 
                Updates will be communicated via email or in-app notifications. Continued use of the app 
                after changes implies acceptance of the revised policy.
              </p>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-br from-[#0a59d0]/5 to-[#C2F4A4]/5 rounded-2xl p-8 border border-[#0a59d0]/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h3>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="text-[#0a59d0] font-medium">
                Email: info@sharwadata.com
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0a59d0] to-[#0847a8] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#C2F4A4]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of users enjoying seamless VTU services today
          </p>
          <button 
            onClick={() => router.push('/auth/register/step-1')}
            className="bg-white text-[#0a59d0] px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] rounded-xl flex items-center justify-center">
                  <span className="font-bold text-xl">A</span>
                </div>
                <span className="font-bold text-xl">sharwa data</span>
              </div>
              <p className="text-gray-400">Nigeria's leading VTU platform for all your digital needs.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Buy Data</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Buy Airtime</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pay Bills</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Education</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li>
                  <button 
                    onClick={() => router.push('/privacy-policy')}
                    className="hover:text-white transition-colors text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2024 sharwa data. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}