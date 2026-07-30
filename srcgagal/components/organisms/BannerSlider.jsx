"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const banners = [
  {
    id: 1,
    image: "/images/banner-1.png",
    title: "Sistem Informasi Retribusi Daerah",
    subtitle: "Jawa Tengah",
    description: "Platform digital untuk transparansi dan kemudahan akses informasi retribusi daerah",
  },
  {
    id: 2,
    image: "/images/banner-2.png",
    title: "Layanan Digital Terpadu",
    subtitle: "Pemerintah Provinsi Jawa Tengah",
    description: "Mewujudkan pelayanan publik yang efisien dan transparan melalui teknologi digital",
  },
  {
    id: 3,
    image: "/images/banner-3.png",
    title: "Inovasi Pelayanan Publik",
    subtitle: "Menuju Jawa Tengah Digital",
    description: "Transformasi digital untuk meningkatkan kualitas pelayanan kepada masyarakat",
  },
]

export default function BannerSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  return (
    <div
      className="relative w-full overflow-hidden bg-white"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Banner Container */}
      <div className="relative h-[200px] sm:h-[280px] md:h-[360px] lg:h-[480px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={banners[currentSlide].image || "/placeholder.svg"}
                alt={banners[currentSlide].title}
                className="w-full h-full object-cover object-center"
              />
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            </div>

            {/* Content Overlay - Apple Style */}
            <div className="relative z-10 h-full flex items-center justify-start">
              <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-700 text-black leading-tight mb-4 md:mb-6">
                    {banners[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 mb-4 font-500">
                    {banners[currentSlide].subtitle}
                  </p>
                  <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
                    {banners[currentSlide].description}
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - Subtle */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 md:p-3 rounded-full transition-all duration-200 backdrop-blur-sm group"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 md:p-3 rounded-full transition-all duration-200 backdrop-blur-sm group"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators - Minimalist */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToSlide(index)}
            whileHover={{ scale: 1.2 }}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-black w-8 h-2" 
                : "bg-black/40 w-2 h-2 hover:bg-black/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Subtle Progress Line */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black/10">
        <motion.div
          className="h-full bg-black"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={currentSlide}
        />
      </div>
    </div>
  )
}
