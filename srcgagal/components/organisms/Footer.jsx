"use client"

import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Container from "../atoms/Container"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ]

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Obyek Retribusi", href: "/objects" },
    { name: "Bukti Pembayaran", href: "/payment-receipts" },
    { name: "Tentang Kami", href: "#" },
    { name: "Kontak", href: "#" },
    { name: "FAQ", href: "#" },
  ]

  const services = [
    "Pencarian Obyek Retribusi",
    "Download Bukti Pembayaran",
    "Informasi Tarif",
    "Panduan Pembayaran",
    "Layanan Konsultasi",
    "Laporan Keuangan",
  ]

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src="/images/logo-app.svg" alt="Penak Busiti" className="w-full h-full object-contain invert" />
              </div>
              <span className="text-xl font-600">Penak Busiti</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              Sistem Informasi Pajak dan Retribusi Daerah Jawa Tengah yang modern, mudah, dan terpercaya.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.15, backgroundColor: "#ffffff" }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-gray-800 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:text-black"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-sm font-600 text-white mb-6 tracking-wider uppercase opacity-50">Menu Cepat</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-sm font-600 text-white mb-6 tracking-wider uppercase opacity-50">Layanan Kami</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-400 text-sm">
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-sm font-600 text-white mb-6 tracking-wider uppercase opacity-50">Kontak Kami</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="text-gray-400 mt-0.5 flex-shrink-0" size={16} />
                <p className="text-gray-400 leading-relaxed">
                  Jl. Pahlawan No. 1<br />
                  Semarang, Jawa Tengah 50132
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="text-gray-400 flex-shrink-0" size={16} />
                <p className="text-gray-400">(024) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="text-gray-400 flex-shrink-0" size={16} />
                <p className="text-gray-400">info@penakbusiti.go.id</p>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="text-gray-400 flex-shrink-0" size={16} />
                <p className="text-gray-400">www.penakbusiti.go.id</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Penak Busiti. Semua hak dilindungi.
            </p>
            <div className="flex space-x-8 text-sm">
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Syarat & Ketentuan
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors duration-200">
                Bantuan
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
