'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LottieSafe from '@/components/LottieSafe'
import welcome from '@/public/assets/animations/welcome.json'
import history from '@/public/assets/animations/history.json'
import started from '@/public/assets/animations/started.json'
import { completeOnboarding } from '@/lib/sessionManager'

const slides = [
  {
    animation: welcome,
    title: 'Welcome to sharwa data',
    subtitle: 'The future of fast and secure VTU payments.',
    bgColor: 'from-[#667eea] to-[#764ba2]'
  },
  {
    animation: history,
    title: 'Seamless Transactions',
    subtitle: 'Instant deposits, withdrawals, and bill payments.',
    bgColor: 'from-[#764ba2] to-[#667eea]'
  },
  {
    animation: started,
    title: 'Get Started Now',
    subtitle: 'Enjoy a smooth and futuristic experience!',
    bgColor: 'from-[#667eea] to-[#764ba2]'
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      handleDone()
    }
  }

  const handleSkip = () => {
    handleDone()
  }

  const handleDone = () => {
    completeOnboarding()
    router.push('/')
  }

  const slide = slides[currentSlide]
  const isLastSlide = currentSlide === slides.length - 1

  return (
    <div className={`min-h-screen bg-gradient-to-br ${slide.bgColor} flex flex-col`}>
      {/* Animation */}
      <div className="flex-1 flex items-center justify-center px-8 pt-16">
        <div className="w-full max-w-md aspect-square">
          <LottieSafe animationData={slide.animation} />
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-20">
        <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
          {slide.title}
        </h1>
        <p className="text-lg text-white/90 text-center mb-12">
          {slide.subtitle}
        </p>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'w-8 bg-white' 
                  : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleSkip}
            className="text-white font-medium text-lg px-6 py-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            Skip
          </button>

          <button
            onClick={handleNext}
            className="bg-white text-[#667eea] font-semibold text-lg px-8 py-3 rounded-full hover:bg-white/90 transition-all transform hover:scale-105"
          >
            {isLastSlide ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}