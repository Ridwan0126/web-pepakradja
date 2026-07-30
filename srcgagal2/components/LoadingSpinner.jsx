"use client"
import { motion } from "framer-motion"

const LoadingSpinner = ({ message = "Memuat data..." }) => {
  return (
    <div className="loading-overlay">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        />
        <motion.p
          className="text-gray-600 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  )
}

export default LoadingSpinner
