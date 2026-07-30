"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, ExternalLink, Navigation } from "lucide-react"
import { extractCoordinates } from "../utils/formatters"

const MapView = ({ latLong, objectName, address, focusOnLocation = false }) => {
  const [mapError, setMapError] = useState(false)
  const coordinates = extractCoordinates(latLong)

  if (!coordinates) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
      >
        <div className="text-center">
          <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">Koordinat lokasi tidak tersedia</p>
        </div>
      </motion.div>
    )
  }

  const handleDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
    window.open(directionsUrl, "_blank")
  }

  const handleViewOnMaps = () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`
    window.open(mapsUrl, "_blank")
  }

  const handleViewOnOpenStreetMap = () => {
    const osmUrl = `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}&zoom=15`
    window.open(osmUrl, "_blank")
  }

  const zoomLevel = focusOnLocation ? 16 : 15
  const bboxOffset = focusOnLocation ? 0.005 : 0.01

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Lokasi</h3>
              <p className="text-sm text-gray-600">
                Koordinat: {coordinates.lat}, {coordinates.lng}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        {!mapError ? (
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - bboxOffset},${coordinates.lat - bboxOffset},${coordinates.lng + bboxOffset},${coordinates.lat + bboxOffset}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            onError={() => setMapError(true)}
            className="w-full"
          />
        ) : (
          <div className="h-72 bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">Tidak dapat memuat peta</p>
              <div className="space-y-2">
                <button onClick={handleViewOnMaps} className="block text-blue-600 hover:text-blue-700 font-medium">
                  Buka di Google Maps
                </button>
                <button
                  onClick={handleViewOnOpenStreetMap}
                  className="block text-blue-600 hover:text-blue-700 font-medium"
                >
                  Buka di OpenStreetMap
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 mb-1">Alamat Lengkap</p>
          <p className="text-gray-600">{address || "Alamat tidak tersedia"}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleViewOnMaps}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <ExternalLink size={16} />
            <span>Google Maps</span>
          </button>
          <button
            onClick={handleViewOnOpenStreetMap}
            className="flex-1 border-2 border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <MapPin size={16} />
            <span>OpenStreetMap</span>
          </button>
          <button
            onClick={handleDirections}
            className="flex-1 border-2 border-blue-600 text-blue-600 py-2 px-4 rounded-lg font-medium hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Navigation size={16} />
            <span>Petunjuk Arah</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default MapView
