"use client"

import { motion } from "framer-motion"
import Card from "../atoms/Card"

export default function StatCard({ icon: Icon, value, label, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center"
    >
      <Card className="p-8">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Icon className="text-white" size={24} />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">{value}</h3>
        <p className="text-gray-600">{label}</p>
      </Card>
    </motion.div>
  )
}
