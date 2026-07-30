"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import { useState, useEffect } from "react"
import { firebaseService } from "../services/firebaseService"

const Footer = () => {
  const [appSettings, setAppSettings] = useState(null)
  const currentYear = new Date().getFullYear()

  useEffect(() => {
    const loadAppSettings = async () => {
      const settings = await firebaseService.getAppSettings()
      if (settings.success) {
        setAppSettings(settings.data)
      }
    }
    loadAppSettings()
  }, [])

  const menuSections = [
    {
      title: "Menu Cepat",
      links: [
        { label: "Beranda", path: "/" },
        { label: "Obyek Retribusi", path: "/obyek" },
        { label: "Bukti Pembayaran", path: "/unduh-bukti-bayar" },
        { label: "Tentang Kami", path: "/tentang-kami" },
        { label: "Kontak", path: "/tentang-kami#kontak" },
        { label: "FAQ", path: "/coming-soon" },
      ],
    },
    {
      title: "Layanan Kami",
      links: [
        { label: "Pencarian Obyek Retribusi", path: "/obyek" },
        { label: "Download Bukti Pembayaran", path: "/unduh-bukti-bayar" },
        { label: "Informasi Tarif", path: "/obyek" },
        { label: "Panduan Pembayaran", path: "/coming-soon" },
        { label: "Layanan Konsultasi", path: "/coming-soon" },
        { label: "Laporan Keuangan", path: "/coming-soon" },
      ],
    },
  ]

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "Youtube" },
  ]

  return (
    <footer className="bg-gradient-to-r from-blue-900 to-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-transparent rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {appSettings?.footerLogoUrl ? (
                    <img
                      src={appSettings.footerLogoUrl || "/placeholder.svg"}
                      alt="Footer Logo"
                      className="w-full h-full object-contain"
                      style={{
                        backgroundColor: "transparent",
                        imageRendering: "crisp-edges",
                        mixBlendMode: "normal",
                        minWidth: "48px",
                        minHeight: "48px",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none"
                        e.target.parentNode.querySelector(".fallback-logo").style.display = "flex"
                      }}
                    />
                  ) : null}
                  <span
                    className="fallback-logo text-blue-900 font-bold text-sm sm:text-lg lg:text-xl flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white rounded-full"
                    style={{ display: appSettings?.footerLogoUrl ? "none" : "flex" }}
                  >
                    PB
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl lg:text-lg font-bold truncate">
                    {appSettings?.appName || "Penak Busiti Jane"}
                  </h3>
                  <p className="text-blue-200 text-xs sm:text-sm lg:text-sm leading-tight">
                    {appSettings?.appSubtitle || "Pelayanan Pajak dan Retribusi Jawa Tengah Online"}
                  </p>
                </div>
              </div>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Sistem Informasi Pajak dan Retribusi Daerah Jawa Tengah yang modern, mudah, cepat, dan terpercaya untuk
                melayani masyarakat.
              </p>
              <div className="flex space-x-2 sm:space-x-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-800 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-blue-700 transition-colors duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label={social.label}
                    >
                      <Icon size={16} className="sm:w-[18px] sm:h-[18px] lg:w-5 lg:h-5" />
                    </motion.a>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {menuSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-3 sm:space-y-4"
            >
              <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white">{section.title}</h4>
              <ul className="space-y-1 sm:space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-blue-200 hover:text-white transition-colors duration-200 text-xs sm:text-sm lg:text-base block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3 sm:space-y-4"
          >
            <h4 className="text-base sm:text-lg lg:text-xl font-semibold text-white">Kontak Kami</h4>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm lg:text-base">
              <div className="flex items-start space-x-3">
                <MapPin size={14} className="mt-1 flex-shrink-0 text-blue-300 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <div className="text-blue-100">
                  <p>Jl. Pahlawan No. 1, Semarang</p>
                  <p>Jawa Tengah 50132</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={14} className="flex-shrink-0 text-blue-300 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="text-blue-100">(024) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={14} className="flex-shrink-0 text-blue-300 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="text-blue-100">info@penakbusiti.go.id</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin size={14} className="flex-shrink-0 text-blue-300 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="text-blue-100">www.penakbusiti.go.id</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 sm:mt-12 lg:mt-16 pt-6 sm:pt-8 border-t border-blue-700"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-blue-200 text-xs sm:text-sm lg:text-base">
                © {currentYear} {appSettings?.appName || "Penak Busiti Jane"}. By Bidang Retribusi dan Pendapatan Lain
                BAPENDA Jateng
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end space-x-3 sm:space-x-4 lg:space-x-6 text-xs sm:text-sm lg:text-base">
              <Link to="/coming-soon" className="text-blue-200 hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
              <Link to="/coming-soon" className="text-blue-200 hover:text-white transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link to="/coming-soon" className="text-blue-200 hover:text-white transition-colors">
                Bantuan
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
