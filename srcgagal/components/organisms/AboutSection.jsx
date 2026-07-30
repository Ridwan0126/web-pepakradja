"use client"

import { motion } from "framer-motion"
import { Shield, ArrowRight, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function AboutSection() {
  const features = [
    { icon: Shield, title: "Keamanan Data", description: "Perlindungan data terjamin dengan enkripsi tingkat tinggi" },
    { icon: CheckCircle, title: "Akurat & Transparan", description: "Informasi selalu terkini dan dapat dipercaya" },
  ]

  return (
    <div className="relative py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-700 text-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Tentang Penak Busiti
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Penak Busiti adalah sistem informasi modern yang dirancang khusus untuk memudahkan masyarakat Jawa Tengah dalam mengakses informasi pajak dan retribusi daerah dengan mudah, cepat, dan terpercaya.
            </motion.p>

            <motion.p
              className="text-lg text-gray-600 leading-relaxed mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Dengan teknologi terdepan dan antarmuka yang intuitif, platform ini menyediakan akses mudah untuk mencari obyek retribusi dan mengunduh bukti pembayaran, semua dalam satu ekosistem yang aman dan terpercaya.
            </motion.p>

            {/* Feature List */}
            <motion.div
              className="space-y-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <Icon className="text-black flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h3 className="font-600 text-black">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                )
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/about">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-black text-white rounded-full font-600 transition-all duration-200 hover:shadow-lg"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={18} />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right - Visual Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl transform rotate-3 opacity-10 blur-2xl"></div>
              <div className="relative w-full h-96 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl flex items-center justify-center border border-gray-200 overflow-hidden shadow-lg">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative z-10"
                >
                  <Shield size={120} className="text-gray-900 mb-6" />
                  <motion.h3
                    className="text-2xl font-700 text-black text-center"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    Sistem Terpercaya
                  </motion.h3>
                  <p className="text-gray-600 text-center mt-2">Keamanan Data Terjamin</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
