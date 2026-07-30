"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Clock, ArrowLeft, Bell, Calendar } from "lucide-react"

const ComingSoonPage = ({
  title = "Fitur Segera Hadir",
  description = "Kami sedang mengembangkan fitur ini untuk memberikan pengalaman yang lebih baik.",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <Clock className="text-primary-600" size={48} />
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            {title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-gray-600 mb-8 leading-relaxed"
          >
            {description}
          </motion.p>

          {/* Features Coming Soon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Bell className="text-primary-600" size={20} />
              <span className="text-gray-700">Notifikasi Real-time</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="text-primary-600" size={20} />
              <span className="text-gray-700">Integrasi Kalender</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span>Kembali ke Beranda</span>
            </Link>
            <Link
              to="/obyek"
              className="inline-flex items-center space-x-2 border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200"
            >
              <span>Lihat Obyek Retribusi</span>
            </Link>
          </motion.div>

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500">
              Estimasi peluncuran: <span className="font-semibold text-primary-600">Q2 2024</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default ComingSoonPage
