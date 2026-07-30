"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowLeft, Clock, CheckCircle, Star } from "lucide-react"
import Container from "../components/atoms/Container"
import Button from "../components/atoms/Button"

export default function ComingSoonPage() {
  const [currentFeature, setCurrentFeature] = useState(0)

  const upcomingFeatures = [
    {
      id: 1,
      title: "Permohonan Wajib Retribusi (SPTRD)",
      description: "Ajukan permohonan surat pemberitahuan retribusi daerah secara online",
      icon: "📋",
      status: "Dalam Pengembangan",
      progress: 75,
    },
    {
      id: 2,
      title: "Penerbitan Ulang Surat Ketetapan Pajak/Retribusi",
      description: "Minta penerbitan ulang surat ketetapan dengan mudah dan cepat",
      icon: "🔄",
      status: "Dalam Pengembangan",
      progress: 60,
    },
    {
      id: 3,
      title: "Pendaftaran WP PAP",
      description: "Daftarkan diri sebagai wajib pajak/retribusi PAP",
      icon: "👤",
      status: "Perencanaan",
      progress: 40,
    },
    {
      id: 4,
      title: "Penerbitan NPWPD",
      description: "Dapatkan nomor pokok wajib pajak daerah secara digital",
      icon: "🆔",
      status: "Perencanaan",
      progress: 30,
    },
  ]

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % upcomingFeatures.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [upcomingFeatures.length])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Container className="py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Animated Thumbs Up */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
            className="mb-8"
          >
            <div className="text-8xl mb-4">
              <motion.span
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
                className="inline-block"
              >
                👍
              </motion.span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Segera Hadir!</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Fitur-fitur baru sedang dalam pengembangan untuk memberikan pelayanan yang lebih baik dan lengkap
            </p>
          </motion.div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            {upcomingFeatures.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentFeature ? "bg-blue-600 scale-125" : "bg-gray-300"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Feature Showcase */}
          <motion.div
            key={currentFeature}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-2xl mx-auto"
          >
            <div className="text-6xl mb-4">{upcomingFeatures[currentFeature].icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{upcomingFeatures[currentFeature].title}</h3>
            <p className="text-gray-600 mb-6">{upcomingFeatures[currentFeature].description}</p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progress Pengembangan</span>
                <span className="text-sm text-blue-600 font-semibold">
                  {upcomingFeatures[currentFeature].progress}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${upcomingFeatures[currentFeature].progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>

            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Clock size={16} className="mr-1" />
              {upcomingFeatures[currentFeature].status}
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-xl p-6 shadow-md border-2 transition-all duration-300 cursor-pointer ${
                  index === currentFeature ? "border-blue-300 shadow-lg" : "border-gray-100 hover:border-blue-200"
                }`}
                onClick={() => setCurrentFeature(index)}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-600 font-medium">{feature.status}</span>
                  <div className="flex items-center">
                    <Star size={14} className="text-yellow-400 mr-1" />
                    <span className="text-xs text-gray-500">{feature.progress}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/">
              <Button variant="primary" className="px-8 py-3">
                <CheckCircle size={20} className="mr-2" />
                Kembali ke Beranda
              </Button>
            </Link>
            <Link to="/objects">
              <Button variant="secondary" className="px-8 py-3">
                Jelajahi Objek Retribusi
              </Button>
            </Link>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-12 bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto"
          >
            <h4 className="font-semibold text-blue-900 mb-2">Pemberitahuan</h4>
            <p className="text-blue-700 text-sm">
              Fitur-fitur ini sedang dalam tahap pengembangan dan akan segera tersedia. Kami berkomitmen untuk terus
              meningkatkan layanan digital demi kemudahan masyarakat Jawa Tengah.
            </p>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
