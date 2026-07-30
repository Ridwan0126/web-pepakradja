"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import BannerSlider from "../components/BannerSlider"
import QuickServices from "../components/QuickServices"
import FeaturedProducts from "../components/FeaturedProducts"
import { ArrowRight, Shield } from "lucide-react"
import firebaseService from "../services/firebaseService"

const HomePage = () => {
  const [appSettings, setAppSettings] = useState({
    appName: "Penak Busiti Jane",
    appSubtitle: "Pelayanan Pajak dan Retribusi Jawa Tengah Online",
    heroImageUrl: "/heroic-figure.png",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAppSettings()
  }, [])

  const loadAppSettings = async () => {
    try {
      const result = await firebaseService.getAppSettings()
      if (result.success && result.data) {
        setAppSettings({
          appName: result.data.appName || "Penak Busiti Jane",
          appSubtitle: result.data.appSubtitle || "Pelayanan Pajak dan Retribusi Jawa Tengah Online",
          heroImageUrl: result.data.heroImageUrl || "/heroic-figure.png",
        })
      }
    } catch (error) {
      console.error("Error loading app settings:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Banner Slider */}
      <section className="relative bg-gradient-to-b from-blue-50 to-white">
        <div className="container pt-16 mx-auto px-4 sm:px-6 lg:px-8">
          <BannerSlider />
        </div>

        {/* Hero Content Below Slider */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-600 mb-4">{appSettings.appName}</h1>
              <p className="text-xl text-gray-700 mb-4">{appSettings.appSubtitle}</p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sistem Pelayanan Pajak dan Retribusi Daerah Jawa Tengah yang modern, murah, cepat, dan mudah untuk
                melayani masyarakat.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl">
                <img
                  src={appSettings.heroImageUrl || "/placeholder.svg"}
                  alt="Penak Busiti Illustration"
                  className="w-full h-auto object-contain"
                  style={{
                    backgroundColor: "transparent",
                    imageRendering: "crisp-edges",
                    mixBlendMode: "normal",
                    minHeight: "300px",
                    maxHeight: "500px",
                  }}
                  onError={(e) => {
                    e.target.src = "/heroic-figure.png"
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <QuickServices />

      {/* Featured Products Section */}
      <FeaturedProducts />

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6">Tentang {appSettings.appName}</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {appSettings.appName} adalah sistem informasi modern yang dirancang khusus untuk memudahkan masyarakat
                Jawa Tengah dalam mengakses informasi pajak dan retribusi daerah. Dengan teknologi terdepan dan
                antarmuka yang user-friendly, kami berkomitmen memberikan pelayanan terbaik.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Platform ini menyediakan akses mudah untuk mencari obyek retribusi dan mengunduh bukti pembayaran, semua
                dalam satu tempat yang aman dan terpercaya.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 mx-auto lg:mx-0"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight size={20} />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="bg-gradient-to-br from-blue-500 to-teal-400 rounded-2xl p-8 text-white text-center max-w-md w-full shadow-xl">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-white" size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Sistem Terpercaya</h3>
                <p className="text-blue-100 mb-4">Keamanan Data Terjamin</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold">24/7</div>
                    <div className="text-blue-100">Layanan</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-blue-100">Aman</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
