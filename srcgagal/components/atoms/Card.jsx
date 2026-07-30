"use client"

import { motion } from "framer-motion"

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -10 } : {}}
      className={`modern-card rounded-3xl transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}
