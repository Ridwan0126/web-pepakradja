"use client"

import { motion } from "framer-motion"
import { Shield, CheckCircle, Phone, Mail, MapPin } from "lucide-react"
import Card from "../components/atoms/Card"
import Heading from "../components/atoms/Heading"

export default function AboutPage() {
  const features = [
    "Sistem keamanan berlapis untuk melindungi data pengguna",
    "Interface yang user-friendly dan mudah digunakan",
    "Akses 24/7 untuk kemudahan masyarakat",
    "Integrasi dengan sistem pembayaran digital",
    "Laporan dan analitik yang komprehensif",
    "Dukungan customer service yang responsif",
  ]

  return (
    <div className="page-container">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center section-spacing"
      >
        <Heading level={1}>Tentang Penak Busiti</Heading>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4">
          Sistem Informasi Pajak dan Retribusi Daerah Jawa Tengah yang hadir untuk memberikan kemudahan akses informasi
          dan layanan kepada masyarakat
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="content-spacing"
      >
        <Card className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Sejarah dan Latar Belakang</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Penak Busiti dikembangkan sebagai respons terhadap kebutuhan digitalisasi layanan publik di era modern.
                Sistem ini lahir dari komitmen Pemerintah Provinsi Jawa Tengah untuk memberikan pelayanan yang lebih
                baik, transparan, dan mudah diakses oleh masyarakat.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Dengan memanfaatkan teknologi informasi terkini, Penak Busiti hadir sebagai solusi komprehensif untuk
                mengelola dan mengakses informasi pajak dan retribusi daerah di seluruh wilayah Jawa Tengah.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md h-80 bg-gradient-to-br from-blue-400 via-cyan-500 to-green-500 rounded-3xl flex items-center justify-center">
                <div className="text-white text-center">
                  <Shield size={80} className="mx-auto mb-4" />
                  <h3 className="text-2xl font-bold">Sistem Terpercaya</h3>
                  <p className="text-blue-100">Melayani Masyarakat Jawa Tengah</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="content-spacing"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Keunggulan Sistem</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fitur-fitur unggulan yang membuat Penak Busiti menjadi pilihan terbaik untuk layanan pajak dan retribusi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="flex items-center space-x-3 p-4 bg-green-50 rounded-2xl"
              >
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <span className="text-gray-700">{feature}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Contact */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="content-spacing"
      >
        <Card className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Hubungi Kami</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami siap membantu Anda dengan pertanyaan atau masukan terkait sistem Penak Busiti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Phone className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Telepon</h3>
              <p className="text-gray-600">(024) 123-4567</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600">info@penakbusiti.go.id</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Alamat</h3>
              <p className="text-gray-600">Jl. Pahlawan No. 1, Semarang, Jawa Tengah</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
