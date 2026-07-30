import { useEffect, useState } from 'react'

export default function SplashScreen({ onFinish }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onFinish, 500)
    }, 2500)

    return () => clearTimeout(timer)
  }, [onFinish])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-600 via-green-500 to-teal-600 flex items-center justify-center z-50 animate-fade-in">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-glow" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-glow" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-glow" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Logo container */}
        <div className="mb-6 animate-scale-in">
          <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              PR
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-white mb-2 animate-slide-in-down">
          PEPAK RAJA
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-green-100 mb-8 animate-slide-in-up">
          Marketplace Retribusi & Pajak
        </p>

        {/* Loading animation */}
        <div className="flex gap-2 justify-center items-center">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  )
}
