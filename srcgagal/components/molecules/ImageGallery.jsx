"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react"

export default function ImageGallery({ images, alt }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const placeholderImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"

  // Ensure we have at least one image (placeholder if needed)
  const displayImages = images && images.length > 0 ? images : [placeholderImage]

  // Hide navbar when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden"
      const navbar = document.querySelector(".navbar-container")
      if (navbar) {
        navbar.style.display = "none"
      }
    } else {
      document.body.style.overflow = "unset"
      const navbar = document.querySelector(".navbar-container")
      if (navbar) {
        navbar.style.display = "block"
      }
    }

    return () => {
      document.body.style.overflow = "unset"
      const navbar = document.querySelector(".navbar-container")
      if (navbar) {
        navbar.style.display = "block"
      }
    }
  }, [isModalOpen])

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
  }

  const selectImage = (index) => {
    setCurrentIndex(index)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image - Ukuran diperbesar dan gambar tidak terpotong */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          <div className="relative h-80 bg-gray-100 cursor-pointer" onClick={openModal}>
            <img
              src={displayImages[currentIndex] || placeholderImage}
              alt={alt}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
            />

            {/* Expand Icon */}
            <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Expand size={20} />
            </div>

            {/* Navigation Arrows - Only show if more than 1 image */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Image Counter */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {displayImages.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Grid - Only show if more than 1 image */}
        {displayImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {displayImages.map((image, index) => (
              <motion.button
                key={index}
                onClick={() => selectImage(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-gray-100 ${
                  index === currentIndex
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <img
                  src={image || placeholderImage}
                  alt={`${alt} ${index + 1}`}
                  className="w-full h-full object-contain"
                />
                {/* Active indicator */}
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-6xl max-h-full">
            <img
              src={displayImages[currentIndex] || placeholderImage}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
            >
              <X size={24} />
            </button>

            {/* Navigation in Modal */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prevImage()
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    nextImage()
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Counter in Modal */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {currentIndex + 1} / {displayImages.length}
              </div>
            )}

            {/* Thumbnail Strip in Modal */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                <div className="flex space-x-2 bg-black/50 p-2 rounded-full max-w-md overflow-x-auto">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        selectImage(index)
                      }}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 bg-gray-100 ${
                        index === currentIndex ? "border-white" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image || placeholderImage}
                        alt={`${alt} ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  )
}
