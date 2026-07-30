"use client"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Share2, MapPin, Phone, Mail, Globe, Info, FileText, Users, ArrowLeft } from "lucide-react"
import { formatCurrency } from "../utils/formatters"
import dataService from "../services/dataService"
import firebaseService from "../services/firebaseService"
import SplashScreen from "../components/SplashScreen" // Changed from LoadingSpinner to SplashScreen
import ImageGallery from "../components/ImageGallery"
import MapView from "../components/MapView"
import ShareModal from "../components/ShareModal"

const ObjectDetailPage = () => {
  const { id } = useParams()
  const [object, setObject] = useState(null)
  const [contactInfo, setContactInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("deskripsi")
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    loadObjectDetail()
  }, [id])

  const loadObjectDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const objectResult = await dataService.getObjectById(id)
      if (objectResult.success) {
        setObject(objectResult.data)

        const objectData = objectResult.data
        const uppdId = objectData.id_uppd // API format: "01.11"
        const opdId = objectData.id_opd // API format: "01"

        console.log("ObjectDetail: Looking for contact info with exact API IDs:", { opdId, uppdId })
        console.log("ObjectDetail: Object data:", objectData)

        const contactResult = await firebaseService.getContactByOpdUppdId(opdId, uppdId)
        if (contactResult.success) {
          console.log("ObjectDetail: Contact info found:", contactResult.data)
          setContactInfo(contactResult.data)
        } else {
          console.log("ObjectDetail: No contact info found, using default")
          setContactInfo({
            phone: "Data tidak tersedia",
            email: "Data tidak tersedia",
            whatsapp: "Data tidak tersedia",
          })
        }
      } else {
        setError("Data obyek tidak ditemukan")
      }
    } catch (err) {
      console.error("Error loading object detail:", err)
      setError("Terjadi kesalahan saat memuat data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <SplashScreen /> // Use SplashScreen for data loading
  }

  if (error || !object) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-6">{error || "Obyek yang Anda cari tidak tersedia"}</p>
          <Link
            to="/obyek"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Kembali ke Daftar Obyek
          </Link>
        </div>
      </div>
    )
  }

  const fallbackImage =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"
  const images = object?.foto ? [object.foto] : []

  const tabs = [
    { id: "deskripsi", label: "Deskripsi", icon: FileText },
    { id: "spesifikasi", label: "Spesifikasi", icon: Info },
    { id: "organisasi", label: "Organisasi", icon: Users },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "deskripsi":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi</h3>
            <p className="text-gray-600 leading-relaxed">{object?.keterangan || "Tidak Tersedia"}</p>
          </div>
        )
      case "spesifikasi":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Spesifikasi</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Jenis Retribusi</h4>
                <p className="text-gray-600">{object?.jenis?.jenis_retribusi || "Tidak ada data"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Status</h4>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {object?.status === 1 ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Dasar Pengenaan</h4>
                <p className="text-gray-600">{object?.dasar_pengenaan || "Tidak ada data"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Dasar Penetapan</h4>
                <p className="text-gray-600">{object?.dasar_penetapan || "Tidak ada data"}</p>
              </div>
            </div>
          </div>
        )
      case "organisasi":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organisasi</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Pengelola</h4>
                <p className="text-gray-600">{object?.opd?.nama || "DINAS KESEHATAN"}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">UPPD/Balai/Cabdin/Unit Kerja</h4>
                <p className="text-gray-600">
                  {object?.uppd?.nama || "BALAI LABORATORIUM KESEHATAN DAN PENGUJIAN ALAT KESEHATAN"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Wilayah</h4>
                <p className="text-gray-600">{object?.kota?.kab_kota || "KOTA SEMARANG"}</p>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 pt-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link
          to="/obyek"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span>Kembali ke Daftar Obyek</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Object Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-600 mb-4">
                      {object?.obyek_retribusi ||
                        "-- Air Bersih, Air Minum, Air Badan Air - Air Kolam Renang, Organolepsis - Kimia - Laboratorium - Pelayanan Kesehatan Pada Balai Laboratorium Kesehatan dan Pengujian Alat Kesehatan - Rasa"}
                    </h1>
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm font-medium inline-block mb-4">
                      {object?.jenis?.jenis_retribusi || "Jenis Pelayanan: Retribusi Pelayanan Kesehatan"}
                    </div>
                  </div>
                  <div className="flex justify-start sm:justify-end">
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex mb-8 items-center space-x-2 bg-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-600 transition-colors duration-200 w-full sm:w-auto justify-center"
                    >
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-start space-x-2 text-gray-600">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <p>{`${object?.kota?.kab_kota || "KOTA SEMARANG"}, Kecamatan ${object?.kecamatan?.kecamatan || "Tidak tersedia"}, Kabupaten ${object?.kota?.kab_kota || "KOTA SEMARANG"}`}</p>
                </div>
              </div>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <ImageGallery images={images} objectName={object?.obyek_retribusi} />
            </motion.div>

            <MapView
              latLong={object?.lat_long}
              objectName={object?.obyek_retribusi}
              address={object?.alamat}
              focusOnLocation={true}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Tariff Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-green-50 rounded-xl shadow-sm p-6 border border-green-200"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-left">Tarif</h3>
              <div className="text-left">
                <div className="mb-2">
                  <span className="text-3xl font-bold text-green-600">
                    {formatCurrency(object?.tariftbl?.tarif) || "Rp 15.000"}
                  </span>
                  <span className="text-lg text-gray-600 ml-1">
                    /{object?.tariftbl?.satuan?.satuan || "pemeriksaan"}
                  </span>
                </div>
                <p className="text-sm text-gray-600 text-left">ID-{object?.id_gen_obyek || "2634"}</p>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              {/* Tab Headers */}
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                        activeTab === tab.id
                          ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <Icon size={16} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50">{renderTabContent()}</div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Phone className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">Informasi Kontak</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Pengelola</p>
                  <p className="font-medium text-gray-900">
                    {object?.uppd?.nama || object?.opd?.nama || "BADAN PENGELOLA PENDAPATAN DAERAH"}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Telepon</p>
                    {contactInfo?.phone && contactInfo.phone !== "Data tidak tersedia" ? (
                      <a
                        href={`tel:${contactInfo.phone}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        {contactInfo.phone}
                      </a>
                    ) : (
                      <p className="text-gray-600">{contactInfo?.phone || "Data tidak tersedia"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Alamat</p>
                    <p className="text-gray-600">{object?.alamat || "Jl. Soekarno Hatta No 185, Padurangan"}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    {contactInfo?.email && contactInfo.email !== "Data tidak tersedia" ? (
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                      >
                        {contactInfo.email}
                      </a>
                    ) : (
                      <p className="text-gray-600">{contactInfo?.email || "Data tidak tersedia"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="text-gray-400" size={16} />
                  <div>
                    <p className="text-sm text-gray-500">WhatsApp</p>
                    {contactInfo?.whatsapp && contactInfo.whatsapp !== "Data tidak tersedia" ? (
                      <a
                        href={
                          contactInfo.whatsappUrl ||
                          (contactInfo.whatsapp.startsWith("http")
                            ? contactInfo.whatsapp
                            : `https://wa.me/62${contactInfo.whatsapp}`)
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 hover:underline cursor-pointer"
                      >
                        {contactInfo.whatsapp.startsWith("http") ? "Chat WhatsApp" : `+62${contactInfo.whatsapp}`}
                      </a>
                    ) : (
                      <p className="text-gray-600">{contactInfo?.whatsapp || "Data tidak tersedia"}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} object={object} />
    </motion.div>
  )
}

export default ObjectDetailPage
