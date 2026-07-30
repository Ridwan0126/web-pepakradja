"use client"

import { motion } from "framer-motion"

export default function Hero() {
  return (
    <div className="relative pt-24 pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-32">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Section - Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-700 text-black mb-6 leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              Penak Busiti
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-gray-700 mb-4 font-500 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Sistem Informasi Pajak dan Retribusi Daerah Jawa Tengah
            </motion.p>

            <motion.p
              className="text-lg text-gray-500 mb-10 font-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Mudah. Cepat. Terpercaya.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.a
                href="/objects"
                whileHover={{ scale: 1.02, backgroundColor: "#000" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-black text-white rounded-full font-600 text-center transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Jelajahi Obyek
              </motion.a>
              <motion.a
                href="#features"
                whileHover={{ backgroundColor: "#f3f4f6" }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gray-100 text-black rounded-full font-600 text-center transition-all duration-200 border border-gray-200 hover:border-gray-300"
              >
                Pelajari Lebih Lanjut
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Logo Section - Right */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center lg:justify-end"
          >
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
              className="w-full max-w-sm lg:max-w-md"
            >
              <img
                src="/images/logo-app.svg"
                alt="Penak Busiti Logo"
                className="w-full h-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
