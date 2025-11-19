'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100)
    
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: '📱',
      title: 'Mobile Data',
      description: 'Instant data top-up for all networks',
      price: 'From ₦50'
    },
    {
      icon: '💳',
      title: 'Bill Payments',
      description: 'Pay electricity, cable TV & more',
      price: 'All Utilities'
    },
    {
      icon: '📞',
      title: 'Airtime VTU',
      description: 'Quick airtime recharge instantly',
      price: 'All Networks'
    },
    {
      icon: '🎓',
      title: 'Education',
      description: 'WAEC, NECO, JAMB pins',
      price: 'All Exams'
    }
  ]

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '₦2B+', label: 'Transactions' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Support' }
  ]

  const testimonials = [
    {
      name: 'Chinedu Okafor',
      role: 'Business Owner',
      content: 'sharwa data has transformed how I manage my business transactions. Fast, reliable, and incredibly affordable!',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: 'Aisha Mohammed',
      role: 'Student',
      content: 'The best VTU platform I\'ve used. Quick data purchases and instant delivery every time.',
      avatar: '👩‍🎓',
      rating: 5
    },
    {
      name: 'David Adeleke',
      role: 'Entrepreneur',
      content: 'Their API integration is seamless. I\'ve built my own reselling business on their platform.',
      avatar: '👨‍💻',
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className={`font-bold text-xl ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`}>sharwa data</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`font-medium transition-colors ${scrollY > 50 ? 'text-gray-700 hover:text-[#0a59d0]' : 'text-white/90 hover:text-white'}`}>Features</a>
              <a href="#pricing" className={`font-medium transition-colors ${scrollY > 50 ? 'text-gray-700 hover:text-[#0a59d0]' : 'text-white/90 hover:text-white'}`}>Pricing</a>
              <a href="#about" className={`font-medium transition-colors ${scrollY > 50 ? 'text-gray-700 hover:text-[#0a59d0]' : 'text-white/90 hover:text-white'}`}>About</a>
              <button 
                  onClick={() => router.push('/auth/register/step-1')}
                  className="bg-[#0a59d0] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#0847a8] transition-colors">
                Get Started
              </button>
            </div>

            <button className="md:hidden">
              <svg className={`w-6 h-6 ${scrollY > 50 ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-[#0a59d0] via-[#0a59d0] to-[#0847a8] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C2F4A4]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                🎉 Nigeria's #1 VTU Platform
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Fast, Reliable
                <span className="block bg-gradient-to-r from-[#C2F4A4] to-white bg-clip-text text-transparent">
                  VTU Services
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Buy data, airtime, pay bills and manage your digital transactions seamlessly. Join thousands of satisfied users today.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button 
                  onClick={() => router.push('/auth/register/step-1')}
                  className="bg-white text-[#0a59d0] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Create Free Account
                </button>
                <button
                  onClick={() => router.push('/auth/login')}
                   className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/30">
                  Login
                </button>
              </div>

              <div className="flex items-center space-x-8">
                <div>
                  <div className="flex items-center space-x-1 mb-1">
                    {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">⭐</span>)}
                  </div>
                  <p className="text-white/80 text-sm">4.9/5 from 10,000+ reviews</p>
                </div>
              </div>
            </div>

            {/* Hero Image/Cards */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-gray-500 text-sm">Available Balance</p>
                      <p className="text-3xl font-bold text-gray-900">₦45,250.00</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] rounded-xl"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-[#0a59d0] to-[#0847a8] rounded-2xl p-4 text-white">
                      <p className="text-sm opacity-90 mb-1">This Month</p>
                      <p className="text-2xl font-bold">₦125K</p>
                    </div>
                    <div className="bg-gradient-to-br from-[#C2F4A4] to-[#a8e67a] rounded-2xl p-4 text-gray-900">
                      <p className="text-sm opacity-90 mb-1">Savings</p>
                      <p className="text-2xl font-bold">₦8.5K</p>
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Transaction</p>
                      <p className="text-sm font-bold text-gray-900">Successful</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl animate-float" style={{animationDelay: '1s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">⚡</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Instant</p>
                      <p className="text-sm font-bold text-gray-900">Delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 text-white">
            <path fill="currentColor" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center transform hover:scale-110 transition-all duration-300">
                <div className="text-4xl md:text-5xl font-bold text-[#0a59d0] mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in One Place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access all your essential services with just a few clicks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#0a59d0]/10 to-[#C2F4A4]/10 rounded-2xl flex items-center justify-center mb-6 text-3xl">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="text-[#0a59d0] font-bold">{feature.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-600">See what our users are saying</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#0a59d0] to-[#C2F4A4] rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
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
          <button className="bg-white text-[#0a59d0] px-12 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
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
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
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

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}