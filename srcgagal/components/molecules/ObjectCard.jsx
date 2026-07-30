"use client"

import { MapPin, Eye, Building, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { motion } from "framer-motion"

const DEFAULT_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"

export default function ObjectCard({ object }) {
  const [imageError, setImageError] = useState(false)

  if (!object) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl">
        <p className="text-gray-500 text-sm">Data tidak tersedia</p>
      </div>
    )
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageSrc = () => {
    if (imageError) {
      return DEFAULT_IMAGE_URL
    }

    const imageFields = [
      object.gambar_1,
      object.gambar_2,
      object.foto_1,
      object.foto_2,
      object.image,
      object.foto,
      object.gambar,
    ]

    for (const field of imageFields) {
      if (field && field !== "null" && field !== "" && typeof field === "string") {
        if (field.startsWith("/")) {
          return `https://rpp.bapenda.jatengprov.go.id${field}`
        }
        if (field.startsWith("http")) {
          return field
        }
        return field
      }
    }

    return DEFAULT_IMAGE_URL
  }

  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return "Rp 0"
    const numAmount = typeof amount === "string" ? Number.parseInt(amount) : amount
    if (isNaN(numAmount)) return "Rp 0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numAmount)
  }

  const getTarif = () => {
    return object.tarif || object.tarif_retribusi || object.besaran_tarif || object.potensi_retribusi?.potensi || 0
  }

  const getLokasiName = () => {
    return object.kota?.kab_kota || object.lokasi || "Lokasi tidak tersedia"
  }

  const getOPDName = () => {
    return object.opd?.nama || object.nama_opd || "OPD tidak tersedia"
  }

  const objectId = object.id || object.id_gen_obyek

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="group h-full flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200/50 hover:border-gray-300 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image Section */}
      <div className="relative overflow-hidden bg-gray-100 h-56">
        <img
          src={getImageSrc() || "/placeholder.svg"}
          alt={object.obyek_retribusi || "Object Image"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`px-3 py-1 rounded-full text-xs font-600 backdrop-blur-sm ${
              object.status === 1 
                ? "bg-black/40 text-white" 
                : "bg-gray-500/40 text-white"
            }`}
          >
            {object.status === 1 ? "Aktif" : "Tidak Aktif"}
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col space-y-4">
        {/* Title */}
        <h3 className="text-lg font-600 text-black line-clamp-2 leading-tight">
          {object.obyek_retribusi || "Nama obyek tidak tersedia"}
        </h3>

        {/* Info Section */}
        <div className="space-y-2 text-sm">
          {/* Location */}
          <div className="flex items-start space-x-2">
            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 line-clamp-1">{getLokasiName()}</span>
          </div>

          {/* OPD */}
          <div className="flex items-start space-x-2">
            <Building size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <span className="text-gray-600 line-clamp-1">{getOPDName()}</span>
          </div>
        </div>

        {/* Tarif Box */}
        <div className="bg-gray-100 p-4 rounded-xl mt-auto">
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-gray-600" />
            <div>
              <p className="text-xs text-gray-500 font-500">Tarif Retribusi</p>
              <p className="text-base font-600 text-black">{formatCurrency(getTarif())}</p>
            </div>
          </div>
        </div>

        {/* Detail Button */}
        <Link to={`/objects/${objectId}`}>
          <motion.button
            whileHover={{ backgroundColor: "#000" }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-black text-white font-500 text-sm transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Eye size={16} />
            <span>Lihat Detail</span>
          </motion.button>
        </Link>
      </div>
    </motion.div>
  )
}
