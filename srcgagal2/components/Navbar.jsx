"use client"
import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import firebaseService from "../services/firebaseService"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [appSettings, setAppSettings] = useState({
    appName: "Penak Busiti Jane",
    appSubtitle: "Pelayanan Pajak dan Retribusi Jawa Tengah Online",
    logoUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-QtWzkcYfVXeJpcP24PikUq0v0PmkUI.png",
  })

  useEffect(() => {
    loadAppSettings()
  }, [])

  const loadAppSettings = async () => {
    try {
      const result = await firebaseService.getAppSettings()
      if (result.success) {
        setAppSettings(result.data)
      }
    } catch (error) {
      console.error("Error loading app settings:", error)
    }
  }

  const navItems = [
    { path: "/", label: "Beranda" },
    { path: "/obyek", label: "Obyek" },
    { path: "/unduh-bukti-bayar", label: "Bukti Bayar" },
    { path: "/tentang-kami", label: "Tentang Kami" },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="fixed top-2 sm:top-4 left-2 sm:left-4 right-2 sm:right-4 z-50">
      <nav className="bg-white/95 backdrop-blur-md shadow-lg rounded-xl sm:rounded-2xl border border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 min-w-0">
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-transparent flex-shrink-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={appSettings.logoUrl || "/placeholder.svg"}
                  alt="Penak Busiti Logo"
                  className="w-full h-full object-contain"
                  style={{
                    backgroundColor: "transparent",
                    imageRendering: "auto",
                    mixBlendMode: "normal",
                  }}
                  onError={(e) => {
                    e.target.src = "/abstract-logo.png"
                  }}
                />
              </motion.div>
              <div className="hidden sm:block min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{appSettings.appName}</h1>
                <p className="text-xs text-gray-600 -mt-1 truncate">{appSettings.appSubtitle}</p>
              </div>
            </Link>

            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 xl:px-6 py-2 rounded-full text-xs xl:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive(item.path)
                      ? "text-white bg-blue-600 shadow-lg"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
            >
              {isOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden border-t border-gray-200"
              >
                <div className="py-2 space-y-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        isActive(item.path)
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  )
}

export default Navbar
