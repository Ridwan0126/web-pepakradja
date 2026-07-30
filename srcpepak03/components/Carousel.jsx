import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Carousel({ slides = [] }) {
  const [current, setCurrent] = useState(0)
  const [autoplay, setAutoplay] = useState(true)

  useEffect(() => {
    if (!autoplay || slides.length === 0) return

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [autoplay, slides.length])

  const prev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
    setAutoplay(false)
  }

  const next = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
    setAutoplay(false)
  }

  if (!slides || slides.length === 0) return null

  return (
    <div className="relative w-full h-60 md:h-72 lg:h-80 overflow-hidden rounded-2xl group bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-400">
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === current ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
            
            {/* Content */}
            <div className="relative h-full flex items-center px-6 md:px-12">
              <div className="max-w-2xl animate-fade-in">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur rounded-full mb-4">
                  <p className="text-sm font-semibold text-white">{slide.badge}</p>
                </div>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                  {slide.title}
                </h2>
                <p className="text-white/90 text-base md:text-lg mb-6 max-w-lg">
                  {slide.description}
                </p>
                <button className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:shadow-2xl transition-smooth hover:scale-105 active:scale-95">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-smooth backdrop-blur opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 transition-smooth backdrop-blur opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCurrent(idx)
              setAutoplay(false)
            }}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? 'w-8 h-2 bg-white'
                : 'w-2 h-2 bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
