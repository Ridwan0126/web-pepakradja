"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Share, MessageCircle, Facebook, Twitter, Linkedin, Send } from "lucide-react"
import { useState } from "react"

const ShareModal = ({ isOpen, onClose, object }) => {
  const [copied, setCopied] = useState(false)

  if (!object) return null

  const shareUrl = `https://penak-busiti.vercel.app/objects/${object.id_gen_obyek || object.id}`
  const shareText = `${object.obyek_retribusi || object.nama} - ${shareUrl}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-sky-400 hover:bg-sky-500",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Telegram",
      icon: Send,
      color: "bg-blue-500 hover:bg-blue-600",
      url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(object.obyek_retribusi || object.nama)}`,
    },
  ]

  const handleShare = (url) => {
    window.open(url, "_blank", "width=600,height=400")
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: object.obyek_retribusi || object.nama,
          text: `Lihat detail ${object.obyek_retribusi || object.nama}`,
          url: shareUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-4 text-white relative">
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X size={18} />
              </button>
              <h3 className="text-lg font-semibold mb-1">Bagikan Halaman</h3>
              <p className="text-pink-100 text-sm">Pilih platform untuk berbagi</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Object Info */}
              <div className="flex items-center space-x-3 mb-6 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {object.obyek_retribusi?.substring(0, 30) + "..." || "-- Air Bersih, Air Minum, Air Bada..."}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{shareUrl}</p>
                </div>
              </div>

              {/* Copy Link */}
              <div className="mb-6">
                <button
                  onClick={copyToClipboard}
                  className="w-full flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Copy size={16} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {copied ? "Link Tersalin!" : "Klik untuk menyalin link"}
                  </span>
                </button>
              </div>

              {/* Social Media Options */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {shareOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <button
                      key={option.name}
                      onClick={() => handleShare(option.url)}
                      className={`${option.color} text-white p-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 transform`}
                    >
                      <IconComponent size={20} />
                      <span className="text-sm font-semibold">{option.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Share More */}
              <button
                onClick={handleNativeShare}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white p-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:scale-105 transform"
              >
                <Share size={18} />
                <span>Share Lainnya</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ShareModal
