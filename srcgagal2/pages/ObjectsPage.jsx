"use client"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { Package, RefreshCw } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import FilterBar from "../components/FilterBar"
import ObjectCard from "../components/ObjectCard"
import Pagination from "../components/Pagination"
import SplashScreen from "../components/SplashScreen"

const ObjectsPage = () => {
  const { loading, objects, currentFilters, pagination, updateFilters, syncData } = useData()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Handle URL parameters from homepage filter
    const urlFilters = {}
    if (searchParams.get("search")) urlFilters.search = searchParams.get("search")
    if (searchParams.get("location")) urlFilters.location = searchParams.get("location")
    if (searchParams.get("opd")) urlFilters.opd = searchParams.get("opd")
    if (searchParams.get("service")) urlFilters.serviceType = searchParams.get("service")

    // Apply URL filters if any exist
    if (Object.keys(urlFilters).length > 0) {
      updateFilters({ ...urlFilters, page: 1 })
    }

    // Sync data on page load if needed
    const checkAndSync = async () => {
      await syncData(false) // Auto sync if needed
    }
    checkAndSync()
  }, [searchParams])

  const handleFilterChange = (newFilters) => {
    updateFilters({ ...newFilters, page: 1 })
  }

  const handlePageChange = (page) => {
    updateFilters({ page })
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleManualSync = async () => {
    await syncData(true) // Force sync
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      {loading && <SplashScreen />}

      <div className="min-h-screen bg-gray-50 pt-24">
        {/* Header Section */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Package className="text-blue-600" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Obyek Retribusi</h1>
                  <p className="text-gray-600">Temukan informasi aset daerah Jawa Tengah</p>
                </div>
              </div>
              {/* <button
                onClick={handleManualSync}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                <span>Sinkronisasi Data</span>
              </button> */}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FilterBar onFilterChange={handleFilterChange} currentFilters={currentFilters} showCategory={true} />

          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
              <div>
                <p className="text-lg font-semibold text-gray-900">{pagination.total} Obyek Ditemukan</p>
                <p className="text-sm text-gray-600">
                  Halaman {pagination.currentPage} dari {pagination.totalPages}
                </p>
              </div>
              {pagination.total > 0 && (
                <div className="text-sm text-gray-600">
                  Menampilkan {Math.min((pagination.currentPage - 1) * 10 + 1, pagination.total)} -{" "}
                  {Math.min(pagination.currentPage * 10, pagination.total)} dari {pagination.total} hasil
                </div>
              )}
            </div>
          </motion.div>

          {/* Objects Grid */}
          {objects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {objects.map((object, index) => (
                <ObjectCard key={object.id_gen_obyek} object={object} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-xl shadow-sm"
            >
              <Package className="mx-auto text-gray-400 mb-4" size={64} />
              {pagination.hasActiveFilters ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Tidak Ada Data Ditemukan</h3>
                  <p className="text-gray-600 mb-6">
                    Tidak ada data yang sesuai dengan filter yang dipilih. Coba ubah atau hapus beberapa filter untuk
                    melihat lebih banyak hasil.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum Ada Data</h3>
                  <p className="text-gray-600 mb-6">
                    Belum ada data obyek retribusi yang tersedia. Silakan sinkronisasi data untuk memuat data terbaru.
                  </p>
                </>
              )}
              <button
                onClick={handleManualSync}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
              >
                Sinkronisasi Data
              </button>
            </motion.div>
          )}

          {/* Pagination */}
          {objects.length > 0 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.total}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ObjectsPage
