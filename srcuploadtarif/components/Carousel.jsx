import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlay, setAutoPlay] = useState(true)

  const imageUrl = 'https://ak-d.tripcdn.com/images/0HJ0r12000gmn1f5596C0_C_670_376_Q70.webp?proc=source%2ftrip'
  
  const carouselItems = [
    {
      id: 1,
      title: 'Entertainment Hub',
      subtitle: 'Endless entertainment',
      image: `url(${imageUrl})`,
      badge: 'Watch now',
      description: 'Movies • Shows • More',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: 'Premium Streaming',
      subtitle: 'Premium content',
      image: `url(${imageUrl})`,
      badge: 'Stream now',
      description: 'Comedy • Getting it Together. Together.',
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      id: 3,
      title: 'Music Experience',
      subtitle: 'Your favorite songs',
      image: `url(${imageUrl})`,
      badge: 'Listen now',
      description: 'Thriller • Who can you trust when it\'s all on the line',
      gradient: 'from-cyan-500 to-blue-400'
    },
    {
      id: 4,
      title: 'Fitness Journey',
      subtitle: 'Get fit together',
      image: `url(${imageUrl})`,
      badge: 'Watch now',
      description: 'HIIT with Anja',
      gradient: 'from-blue-400 to-slate-500'
    },
    {
      id: 5,
      title: 'Music Legends',
      subtitle: 'Premium audio',
      image: `url(${imageUrl})`,
      badge: 'Learn more',
      description: 'Sabrina Carpenter & Zadie Lowe',
      gradient: 'from-slate-600 to-blue-500'
    },
    {
      id: 6,
      title: 'Pop Culture Vibes',
      subtitle: 'Latest trends',
      image: `url(${imageUrl})`,
      badge: 'Explore',
      description: 'A-List Pop',
      gradient: 'from-cyan-400 to-blue-600'
    }
  ]

  // Auto-play carousel every 5 seconds
  useEffect(() => {
    if (!autoPlay) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [autoPlay, carouselItems.length])

  const handlePrev = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length)
  }

  const handleNext = () => {
    setAutoPlay(false)
    setCurrentIndex((prev) => (prev + 1) % carouselItems.length)
  }

  const goToSlide = (index) => {
    setAutoPlay(false)
    setCurrentIndex(index)
  }

  return (
    <section className="w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50 to-gray-50 relative overflow-hidden">
      {/* Neon background elements */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{
          background: 'linear-gradient(135deg, #a8d8f0, #00ffff)',
          filter: 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.3))'
        }}
        animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{
          background: 'linear-gradient(135deg, #6eb5d9, #5fa8d3)',
          filter: 'drop-shadow(0 0 30px rgba(110, 181, 217, 0.3))'
        }}
        animate={{ y: [0, -40, 0], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Title with neon glow */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-14"
          style={{
            textShadow: '0 0 15px rgba(168, 216, 240, 0.3)'
          }}
        >
          Endless entertainment.
        </motion.h2>

        {/* Carousel Container */}
        <div className="relative w-full mb-12">
          {/* Featured Slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="w-full h-96 md:h-[500px] bg-cover bg-center relative group rounded-3xl overflow-hidden"
              style={{
                backgroundImage: carouselItems[currentIndex].image,
                backgroundColor: '#f3f4f6'
              }}
            >
              {/* Multiple gradient overlays for neon effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
              <div className={`absolute inset-0 bg-gradient-to-br ${carouselItems[currentIndex].gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Neon border effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-cyan-400 opacity-0 group-hover:opacity-50 transition-all duration-300"
                style={{
                  boxShadow: 'inset 0 0 20px rgba(0, 255, 255, 0.3)'
                }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12">
                {/* Top - Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                >
                  <span className="text-xs md:text-sm text-cyan-300 font-bold tracking-widest uppercase">
                    {carouselItems[currentIndex].subtitle}
                  </span>
                </motion.div>

                {/* Bottom - Description and CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {carouselItems[currentIndex].title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-200 mb-6 max-w-md">
                    {carouselItems[currentIndex].description}
                  </p>
                  <motion.button
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(168, 216, 240, 0.6)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-7 py-3 rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
                  >
                    {carouselItems[currentIndex].badge}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows with neon glow */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-blue-500/30 hover:bg-blue-500/50 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300"
            style={{
              boxShadow: 'inset 0 0 15px rgba(168, 216, 240, 0.3)'
            }}
          >
            <ChevronLeft size={28} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-blue-500/30 hover:bg-blue-500/50 text-white p-3 rounded-full backdrop-blur-md transition-all duration-300"
            style={{
              boxShadow: 'inset 0 0 15px rgba(168, 216, 240, 0.3)'
            }}
          >
            <ChevronRight size={28} />
          </motion.button>
        </div>

        {/* Thumbnail Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-10">
          {carouselItems.map((item, index) => (
            <motion.div
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.05, y: -4 }}
              className={`relative h-32 md:h-40 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 ${
                index === currentIndex 
                  ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-white' 
                  : 'ring-1 ring-gray-300 hover:ring-blue-400'
              }`}
              style={{
                backgroundImage: carouselItems[index].image,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: index === currentIndex 
                  ? '0 0 20px rgba(168, 216, 240, 0.5)' 
                  : 'none'
              }}
            >
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Card content */}
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <p className="text-xs md:text-sm font-bold text-white truncate">
                  {item.title}
                </p>
              </div>

              {/* Hover gradient effect */}
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* Pagination Dots with neon style */}
        <div className="flex justify-center gap-3 flex-wrap">
          {carouselItems.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 w-8'
                  : 'bg-gray-400 w-3 hover:bg-blue-400'
              }`}
              style={{
                boxShadow: index === currentIndex 
                  ? '0 0 15px rgba(168, 216, 240, 0.6)' 
                  : 'none'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Carousel
