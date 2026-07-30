"use client"

import { motion } from "framer-motion"

export default function Heading({ children, level = 1, gradient = true, className = "", animate = true, ...props }) {
  const Tag = `h${level}`

  const baseClasses = {
    1: "text-4xl md:text-5xl font-bold mb-4",
    2: "text-3xl md:text-4xl font-bold mb-3",
    3: "text-2xl font-bold mb-2",
    4: "text-xl font-semibold mb-2",
  }

  const gradientClass = gradient ? "bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent" : ""

  const content = (
    <Tag className={`${baseClasses[level]} ${gradientClass} ${className}`} {...props}>
      {children}
    </Tag>
  )

  if (animate) {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        {content}
      </motion.div>
    )
  }

  return content
}
