"use client"

import { motion } from "framer-motion"

export default function Section({ children, className = "", animate = true, ...props }) {
  if (animate) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={`py-16 ${className}`}
        {...props}
      >
        {children}
      </motion.section>
    )
  }

  return (
    <section className={`py-16 ${className}`} {...props}>
      {children}
    </section>
  )
}
