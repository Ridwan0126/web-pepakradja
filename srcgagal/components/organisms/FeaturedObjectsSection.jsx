"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"
import Container from "../atoms/Container"
import Button from "../atoms/Button"
import ObjectCard from "../molecules/ObjectCard"
import apiService from "../../services/api"

export default function FeaturedObjectsSection() {
  const [featuredObjects, setFeaturedObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadFeaturedObjects = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load initial data
        const result = await apiService.loadInitialData()

        if (result.success) {
          // Get first 6 objects as featured
          const featured = result.data.slice(0, 6)
          setFeaturedObjects(featured)
        } else {
          throw new Error(result.message || "Failed to load featured objects")
        }
      } catch (err) {
        console.error("Error loading featured objects:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedObjects()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <RefreshCw className="animate-spin" size={20} />
              <span>Memuat obyek unggulan...</span>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center">
            <p className="text-red-600">Gagal memuat obyek unggulan: {error}</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-700 text-black mb-6">Obyek Retribusi Unggulan</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Temukan berbagai obyek retribusi daerah yang tersedia di Jawa Tengah dengan informasi lengkap dan terpercaya
          </p>
        </motion.div>

        {/* Object Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredObjects.map((object, index) => (
            <motion.div
              key={object.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <ObjectCard object={object} />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link to="/objects">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-black text-white rounded-full font-600 transition-all duration-200 hover:shadow-lg"
            >
              <span>Lihat Semua Obyek Retribusi</span>
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}
