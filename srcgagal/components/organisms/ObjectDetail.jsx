"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Building,
  Phone,
  Mail,
  Camera,
  ArrowLeft,
  AlertCircle,
  DollarSign,
  Hash,
  FileText,
  ExternalLink,
} from "lucide-react"
import { Link, useParams } from "react-router-dom"
import Container from "../atoms/Container"
import Card from "../atoms/Card"
import Button from "../atoms/Button"
import Badge from "../atoms/Badge"
import apiService from "../../services/api"

const DEFAULT_IMAGE_URL =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png"

export default function ObjectDetail() {
  const { id } = useParams()
  const [object, setObject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("deskripsi")
  const [imageError, setImageError] = useState(false)
  const [copiedField, setCopiedField] = useState("")

  useEffect(() => {
    const fetchObject = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await apiService.getObjectById(id)
        if (result.success) {
          setObject(result.data)
        } else {
          setError(result.message || "Object not found")
        }
      } catch (err) {
        setError(err.message || "Failed to fetch object details")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchObject()
    }
  }, [id])

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageSrc = () => {
    if (imageError || !object) {
      return DEFAULT_IMAGE_URL
    }

    // Try different image fields from API
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

  const formatDate = (dateString) => {
    if (!dateString) return "Tidak tersedia"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch {
      return dateString
    }
  }

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(""), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const openInMaps = () => {
    const lat = object?.latitude || object?.lat
    const lng = object?.longitude || object?.lng || object?.long

    if (lat && lng) {
      const url = `https://www.google.com/maps?q=${lat},${lng}`
      window.open(url, "_blank")
    } else {
      const address = object?.alamat || object?.lokasi || object?.obyek_retribusi
      if (address) {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
        window.open(url, "_blank")
      }
    }
  }

  const showPhoto = () => {
    const imageUrl = getImageSrc()
    if (imageUrl !== DEFAULT_IMAGE_URL) {
      window.open(imageUrl, "_blank")
    }
  }

  const getTarif = () => {
    return object?.tarif || object?.tarif_retribusi || object?.besaran_tarif || object?.potensi_retribusi?.potensi || 0
  }

  // Safe render functions to prevent object rendering errors
  const renderText = (value, fallback = "Tidak tersedia") => {
    if (!value) return fallback
    if (typeof value === "string") return value
    if (typeof value === "object" && value.nama) return value.nama
    if (typeof value === "object" && value.kab_kota) return value.kab_kota
    if (typeof value === "object" && value.jenis_retribusi) return value.jenis_retribusi
    return fallback
  }

  const tabs = [
    { id: "deskripsi", name: "Deskripsi", icon: FileText },
    { id: "spesifikasi", name: "Spesifikasi", icon: Hash },
    { id: "organisasi", name: "Organisasi", icon: Building },
  ]

  if (loading) {
    return (
      <div className="page-container">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Memuat Detail Obyek</h3>
              <p className="text-gray-600">Mengambil informasi detail obyek retribusi...</p>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (error || !object) {
    return (
      <div className="page-container">
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Obyek Tidak Ditemukan</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link to="/objects">
                <Button variant="primary" icon={<ArrowLeft size={18} />}>
                  Kembali ke Daftar Obyek
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-container">
      <Container>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <Link to="/objects">
            <Button variant="outline" icon={<ArrowLeft size={18} />} className="mb-4">
              Kembali ke Daftar Obyek
            </Button>
          </Link>
        </motion.div>

        {/* Main Content - Layout sesuai gambar referensi */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Image & Location (2 kolom) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header dengan nama obyek */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-blue-600 mb-3">
                *{renderText(object.obyek_retribusi, "Nama obyek tidak tersedia")}*
              </h1>

              {/* Badge Jenis Pelayanan */}
              <div className="mb-4">
                <Badge variant="success" className="text-sm px-4 py-2">
                  Jenis Pelayanan: {renderText(object.jenis, "Retribusi Pemanfaatan Aset Daerah")}
                </Badge>
              </div>

              {/* Location Info */}
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin size={16} className="mr-2" />
                <span>
                  {renderText(object.kota, "Lokasi tidak tersedia")}, Kecamatan{" "}
                  {renderText(object.kecamatan, "Tidak tersedia")}, Kabupaten{" "}
                  {renderText(object.kota, "Tidak tersedia")}
                </span>
              </div>
            </div>

            {/* Image Section */}
            <Card className="p-0 overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {getImageSrc() === DEFAULT_IMAGE_URL ? (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <Camera size={64} className="mb-3" />
                    <p className="text-lg font-medium">No Image Available</p>
                  </div>
                ) : (
                  <img
                    src={getImageSrc() || "/placeholder.svg"}
                    alt={renderText(object.obyek_retribusi, "Object Image")}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                )}
              </div>
            </Card>

            {/* Location Card */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="text-gray-400 mr-3" size={24} />
                <h3 className="text-lg font-semibold text-gray-800">Lokasi Tidak Tersedia</h3>
              </div>
              <p className="text-gray-600 mb-4">
                {object.latitude && object.longitude
                  ? `Koordinat lokasi tersedia untuk objek ini`
                  : "Koordinat lokasi tidak ditentukan untuk objek ini"}
              </p>
              <Button variant="outline" onClick={openInMaps} icon={<ExternalLink size={16} />} className="w-full">
                Buka di Google Maps
              </Button>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tarif Box */}
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="flex items-center mb-2">
                <DollarSign className="text-green-600 mr-2" size={20} />
                <span className="text-sm font-medium text-green-600">Tarif</span>
              </div>
              <div className="text-2xl font-bold text-green-800 mb-1">{formatCurrency(getTarif())}</div>
              <p className="text-sm text-green-600">Sekali Aksi</p>
            </Card>

            {/* Tab Navigation */}
            <Card className="p-0 overflow-hidden">
              <div className="flex border-b">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={16} />
                      <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "deskripsi" && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Deskripsi</h4>
                    <p className="text-gray-600 leading-relaxed">
                      {renderText(object.keterangan || object.deskripsi || object.obyek_retribusi, "COCOK TANAM")}
                    </p>
                  </div>
                )}

                {activeTab === "spesifikasi" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Spesifikasi</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Jenis Retribusi</p>
                        <p className="text-sm text-gray-800">{renderText(object.jenis, "Tidak tersedia")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Status</p>
                        <p className="text-sm text-gray-800">{object.status === 1 ? "Aktif" : "Tidak Aktif"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Tarif</p>
                        <p className="text-sm text-gray-800">{formatCurrency(getTarif())}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "organisasi" && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Organisasi</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">OPD Pengelola</p>
                        <p className="text-sm text-gray-800">{renderText(object.opd, "Tidak tersedia")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">UPPD</p>
                        <p className="text-sm text-gray-800">{renderText(object.uppd, "Tidak tersedia")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Wilayah</p>
                        <p className="text-sm text-gray-800">{renderText(object.kota, "Tidak tersedia")}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Informasi Kontak */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <Phone className="text-gray-400 mr-3" size={20} />
                <h4 className="font-semibold text-gray-800">Informasi Kontak</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Building className="text-gray-400 mt-1" size={16} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Penyelenggara</p>
                    <p className="text-sm text-gray-800">
                      {renderText(object.opd, "DINAS PEKERJAAN UMUM, SUMBER DAYA AIR DAN PENATAAN RUANG")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="text-gray-400 mt-1" size={16} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Telepon</p>
                    <p className="text-sm text-gray-800">{renderText(object.telepon, "Data tidak tersedia")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="text-gray-400 mt-1" size={16} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Alamat</p>
                    <p className="text-sm text-gray-800">{renderText(object.alamat, "Data tidak tersedia")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="text-gray-400 mt-1" size={16} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Email</p>
                    <p className="text-sm text-gray-800">{renderText(object.email, "Data tidak tersedia")}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <ExternalLink className="text-gray-400 mt-1" size={16} />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    <p className="text-sm text-gray-800">{renderText(object.website, "Data tidak tersedia")}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </Container>
    </div>
  )
}
