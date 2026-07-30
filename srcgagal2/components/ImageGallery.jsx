"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"

const ImageGallery = ({ images, objectName }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"

  const imageList = images && images.length > 0 ? images : [fallbackImage]

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % imageList.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + imageList.length) % imageList.length)
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="relative">
        {/* Main Image */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          <img
            src={imageList[currentImage] || fallbackImage}
            alt={`${objectName || "Objek"} - Gambar ${currentImage + 1}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = fallbackImage
            }}
          />

          {/* Zoom Button */}
          <button
            onClick={openModal}
            className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
          >
            <ZoomIn size={20} />
          </button>

          {/* Navigation Arrows */}
          {imageList.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
            {currentImage + 1} / {imageList.length}
          </div>

          {imageList[currentImage] === fallbackImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-gray-700 font-medium">Foto tidak tersedia</p>
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {imageList.length > 1 && (
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {imageList.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                  index === currentImage ? "border-primary-500" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <img
                  src={image || fallbackImage}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = fallbackImage
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageList[currentImage] || fallbackImage}
                alt={`${objectName || "Objek"} - Gambar ${currentImage + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = fallbackImage
                }}
              />

              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-colors duration-200"
              >
                <X size={24} />
              </button>

              {imageList.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-200"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-colors duration-200"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery
