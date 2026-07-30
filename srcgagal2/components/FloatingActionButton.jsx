"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import firebaseService from "../services/firebaseService"

const FloatingActionButton = () => {
  const [fabSettings, setFabSettings] = useState({
    logo: "/logo-app.svg",
    whatsappNumber1: "",
    whatsappNumber2: "",
    isEnabled: true,
  })
  const [loading, setLoading] = useState(true)
  const [isCustomLogo, setIsCustomLogo] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    loadFabSettings()
  }, [])

  const loadFabSettings = async () => {
    try {
      console.log("[v0] Loading FAB settings from Firebase...")
      const result = await firebaseService.getAppSettings()
      console.log("[v0] Firebase result:", result)

      if (result.success && result.data?.fabSettings) {
        const fabData = {
          logo: result.data.fabSettings.logo || "/logo-app.svg",
          whatsappNumber1: result.data.fabSettings.whatsappNumber1 || "",
          whatsappNumber2: result.data.fabSettings.whatsappNumber2 || "",
          isEnabled: result.data.fabSettings.isEnabled !== false,
        }
        console.log("[v0] FAB settings loaded:", fabData)
        setFabSettings(fabData)

        const isCustom = fabData.logo && fabData.logo.startsWith("data:")
        console.log("[v0] Is custom logo:", isCustom)
        setIsCustomLogo(isCustom)
      } else {
        console.log("[v0] No FAB settings found, using defaults")
      }
    } catch (error) {
      console.error("[v0] Error loading FAB settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleWhatsAppClick = (number) => {
    if (number) {
      let whatsappUrl
      const cleanNumber = number.replace(/\D/g, "")

      if (cleanNumber.startsWith("62")) {
        whatsappUrl = `https://wa.me/${cleanNumber}`
      } else if (cleanNumber.startsWith("8")) {
        whatsappUrl = `https://wa.me/62${cleanNumber}`
      } else {
        whatsappUrl = `https://wa.me/62${cleanNumber}`
      }

      console.log("[v0] Opening WhatsApp URL:", whatsappUrl)
      window.open(whatsappUrl, "_blank")
      setShowOptions(false)
    }
  }

  const handleMainClick = () => {
    console.log("[v0] Main button clicked")
    console.log("[v0] WhatsApp Number 1:", fabSettings.whatsappNumber1)
    console.log("[v0] WhatsApp Number 2:", fabSettings.whatsappNumber2)
    console.log("[v0] Current showOptions state:", showOptions)

    if (fabSettings.whatsappNumber1 && fabSettings.whatsappNumber2) {
      console.log("[v0] Both numbers available, toggling options")
      setShowOptions(!showOptions)
    } else if (fabSettings.whatsappNumber1) {
      console.log("[v0] Only number 1 available, opening directly")
      handleWhatsAppClick(fabSettings.whatsappNumber1)
    } else if (fabSettings.whatsappNumber2) {
      console.log("[v0] Only number 2 available, opening directly")
      handleWhatsAppClick(fabSettings.whatsappNumber2)
    } else {
      console.log("[v0] No WhatsApp numbers configured")
    }
  }

  if (loading || !fabSettings.isEnabled) {
    return null
  }

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 0.5,
      }}
    >
      <AnimatePresence>
        {(showOptions || (!fabSettings.whatsappNumber1 && !fabSettings.whatsappNumber2)) && (
          <motion.div
            className="mb-4 space-y-2"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={() => handleWhatsAppClick(fabSettings.whatsappNumber1 || "081234567890")}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:bg-gray-50 min-w-[140px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <span className="text-gray-700 font-medium">
                Help Desk 1 
              </span>
            </motion.button>

            <motion.button
              onClick={() => handleWhatsAppClick(fabSettings.whatsappNumber2 || "081234567891")}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:bg-gray-50 min-w-[140px]"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-gray-700 font-medium">
                Help Desk 2 
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleMainClick}
        className={`relative transition-all duration-300 flex items-center justify-center group ${
          isCustomLogo ? "" : "w-20 h-20 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl"
        }`}
        style={{
          width: isCustomLogo ? "auto" : "80px",
          height: isCustomLogo ? "auto" : "80px",
        }}
        whileHover={{ scale: isCustomLogo ? 1.05 : 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={
          isCustomLogo
            ? {}
            : {
                boxShadow: [
                  "0 4px 20px rgba(34, 197, 94, 0.3)",
                  "0 4px 30px rgba(34, 197, 94, 0.5)",
                  "0 4px 20px rgba(34, 197, 94, 0.3)",
                ],
              }
        }
        transition={{
          boxShadow: {
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          },
        }}
      >
        {!isCustomLogo && (
          <motion.div
            className="absolute inset-0 rounded-full bg-green-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}

        <motion.img
          src={fabSettings.logo}
          alt="WhatsApp"
          className={
            isCustomLogo
              ? "w-20 h-20 sm:w-24 sm:h-24 object-contain"
              : "w-10 h-10 object-contain filter brightness-0 invert relative z-10"
          }
          animate={
            isCustomLogo
              ? {}
              : {
                  rotate: [0, 3, -3, 0],
                }
          }
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          onError={(e) => {
            console.log("[v0] FAB logo error, falling back to default")
            e.target.src = "/logo-app.svg"
            setIsCustomLogo(false)
          }}
          onLoad={(e) => {
            console.log("[v0] FAB logo loaded successfully:", fabSettings.logo.substring(0, 50))
          }}
        />

        {!isCustomLogo && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Pilih Help Desk
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </motion.button>

      <motion.div
        className="mt-2 text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded-full shadow-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.3 }}
      >
        Help Desk
      </motion.div>
    </motion.div>
  )
}

export default FloatingActionButton
