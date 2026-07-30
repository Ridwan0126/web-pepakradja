"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()

  // Track scroll position for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const menuItems = [
    { name: "Beranda", path: "/" },
    { name: "Obyek", path: "/objects" },
    { name: "Bukti Bayar", path: "/payment-receipts" },
    { name: "Tentang Kami", path: "/about" },
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-2xl border-b border-gray-200/50" 
          : "bg-white/40 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 flex items-center justify-center"
          >
            <img src="/images/logo-app.svg" alt="Logo" className="w-full h-full object-contain" />
          </motion.div>
          <span className="text-lg font-600 text-black tracking-tight group-hover:text-gray-600 transition-colors">
            <span className="hidden sm:inline">Penak Busiti</span>
            <span className="sm:hidden">Penak</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ backgroundColor: "#f3f4f6" }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-500 ${
                    isActive 
                      ? "text-black bg-gray-100" 
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item.name}
                </motion.div>
              </Link>
            )
          })}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={20} className="text-black" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu size={20} className="text-black" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-100"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path
                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className={`px-4 py-3 rounded-lg transition-all duration-200 text-sm font-500 ${
                        isActive 
                          ? "text-black bg-gray-100" 
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
