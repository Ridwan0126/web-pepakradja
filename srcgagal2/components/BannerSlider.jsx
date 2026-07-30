"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import firebaseService from "../services/firebaseService"

const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [banners, setBanners] = useState([])
  const [isHovered, setIsHovered] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const result = await firebaseService.getAppSettings()
        if (result.success && result.data?.sliderImages && result.data.sliderImages.length > 0) {
          const bannerData = result.data.sliderImages
            .filter((image) => image && image.trim() !== "")
            .map((image, index) => ({
              id: index + 1,
              image: image,
            }))
          setBanners(bannerData)
        } else {
          // Fallback to default banners
          setBanners([
            { id: 1, image: "/celebratory-banner.png" },
            { id: 2, image: "/heroic-figure.png" },
            { id: 3, image: "/celebratory-banner.png" },
          ])
        }
      } catch (error) {
        console.error("Error loading banners:", error)
        setBanners([
          { id: 1, image: "/celebratory-banner.png" },
          { id: 2, image: "/heroic-figure.png" },
          { id: 3, image: "/celebratory-banner.png" },
        ])
      }
    }
    loadBanners()
  }, [])

  useEffect(() => {
    if (!isHovered && banners.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length)
      }, 8000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isHovered, banners.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const handlePrevHover = () => {
    prevSlide()
  }

  const handleNextHover = () => {
    nextSlide()
  }

  if (banners.length === 0) {
    return (
      <div className="w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl mt-16 sm:mt-20 flex items-center justify-center mx-4 sm:mx-0">
        <div className="text-center text-white px-4">
          <div className="text-xl sm:text-2xl font-bold mb-2">Penak Busiti Jane</div>
          <div className="text-blue-100 text-sm sm:text-base">Pelayanan Pajak dan Retribusi Jawa Tengah Online</div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl shadow-xl mx-auto mt-16 sm:mt-20 px-4 sm:px-0"
      style={{
        maxWidth: "1208px",
        aspectRatio: "1208/302",
      }}
      onMouseEnter={() => {
        setIsHovered(true)
        setShowControls(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowControls(false)
      }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black/20 to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-black/20 to-transparent z-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={banners[currentSlide].image || "/placeholder.svg"}
            alt={`Banner ${currentSlide + 1}`}
            className="w-full h-full"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              backgroundColor: "transparent",
              imageRendering: "high-quality",
              WebkitImageRendering: "high-quality",
              MozImageRendering: "crisp-edges",
              msImageRendering: "high-quality",
            }}
            onError={(e) => {
              e.target.src = "/celebratory-banner.png"
            }}
          />
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showControls && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={prevSlide}
              onMouseEnter={handlePrevHover}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm text-gray-800 p-2 sm:p-3 rounded-full hover:bg-white hover:shadow-xl transition-all duration-200"
            >
              <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={nextSlide}
              onMouseEnter={handleNextHover}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm text-gray-800 p-2 sm:p-3 rounded-full hover:bg-white hover:shadow-xl transition-all duration-200"
            >
              <ChevronRight size={20} className="sm:w-6 sm:h-6" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-1 sm:space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide ? "bg-white shadow-md" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default BannerSlider
