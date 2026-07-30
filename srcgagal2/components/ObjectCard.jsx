"use client"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { MapPin, Building, Eye, Hash } from "lucide-react"
import { formatCurrency } from "../utils/formatters"

const ObjectCard = ({ object, index }) => {
  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"
  const objectImage = object.foto || fallbackImage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 h-full flex flex-col"
    >
      <div className="relative shadow-sm">
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-green-500 text-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">Aktif</span>
        </div>

        <img
          src={objectImage || "/placeholder.svg"}
          alt={object.obyek_retribusi || "Tidak ada data"}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 shadow-sm"
          onError={(e) => {
            e.target.src = fallbackImage
          }}
        />

        {/* Image overlay when using fallback */}
        {(!object.foto || object.foto === fallbackImage) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-400">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium">No Image Available</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="h-14 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 leading-tight">
            {object.obyek_retribusi || "Tidak ada data"}
          </h3>
        </div>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <Hash size={16} className="mt-0.5 flex-shrink-0 text-orange-500" />
            <span className="font-medium">ID-{object.id_gen_obyek || "Tidak ada data"}</span>
          </div>
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <MapPin size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
            <span className="line-clamp-1">{object.kota?.kab_kota || "Tidak ada data"}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Building size={16} className="flex-shrink-0 text-green-500" />
            <span className="line-clamp-1">{object.uppd?.nama || object.opd?.nama || "Tidak ada data"}</span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 mb-4 shadow-sm">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">Tarif Retribusi</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(object.tariftbl?.tarif) || "Rp 0"}</p>
            <p className="text-xs text-gray-500">
              {object.tariftbl?.satuan?.satuan ? `per ${object.tariftbl.satuan.satuan}` : " "}
            </p>
          </div>
        </div>

        <Link
          to={`/obyek/${object.id_gen_obyek}`}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 group mt-auto shadow-md hover:shadow-lg"
        >
          <Eye size={16} />
          <span>Lihat Detail</span>
        </Link>
      </div>
    </motion.div>
  )
}

export default ObjectCard
