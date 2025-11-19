'use client'
import Lottie from 'lottie-react'

export default function LottieSafe({ animationData, className, loop = true, autoplay = true, fallback = null }) {
  const valid = !!animationData && Array.isArray(animationData.layers)
  if (!valid) return fallback || null
  return <Lottie animationData={animationData} loop={loop} autoplay={autoplay} className={className} />
}
