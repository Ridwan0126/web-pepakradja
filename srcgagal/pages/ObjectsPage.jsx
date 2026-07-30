"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, AlertCircle, Search, Database, TrendingUp, X } from "lucide-react"
import { useLocation } from "react-router-dom"
import Container from "../components/atoms/Container"
import Heading from "../components/atoms/Heading"
import ObjectsList from "../components/organisms/ObjectsList"
import Pagination from "../components/molecules/Pagination"
import Button from "../components/atoms/Button"
import Input from "../components/atoms/Input"
import ApiConnectionStatus from "../components/atoms/ApiConnectionStatus"
import FilterGroup from "../components/molecules/FilterGroup"
import { useObjects } from "../hooks/useObjects"

export default function ObjectsPage() {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedOPD, setSelectedOPD] = useState("")
  const [selectedJenisLayanan, setSelectedJenisLayanan] = useState("")
  const [filterLoading, setFilterLoading] = useState(false)
  const [urlParamsApplied, setUrlParamsApplied] = useState(false)

  // SCROLL TO TOP ON PAGE LOAD - ALWAYS
  useEffect(() => {
    console.log("📄 ObjectsPage loaded - scrolling to top")
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [])

  // Use custom hook for data objects - Updated for 12 items per page
  const {
    objects,
    loading,
    error,
    totalObjects,
    currentPage,
    totalPages,
    totalLoaded,
    hasMore,
    isFiltering,
    filters,
    setSearchTerm: updateSearchTerm,
    setLocationFilter,
    setOPDFilter,
    setJenisLayananFilter,
    setCurrentPage: updateCurrentPage,
    resetFilters,
    refreshData,
  } = useObjects(12) // 12 items per page

  // Parse URL parameters on component mount
  useEffect(() => {
    if (urlParamsApplied) return // Prevent multiple applications

    const params = new URLSearchParams(location.search)
    const search = params.get("search") || ""
    const locationParam = params.get("location") || ""
    const opdParam = params.get("opd") || ""
    const jenisLayananParam = params.get("jenisLayanan") || ""

    console.log("🔗 URL Parameters detected:", {
      search,
      location: locationParam,
      opd: opdParam,
      jenisLayanan: jenisLayananParam,
    })

    // Set local state immediately
    if (search) setSearchTerm(search)
    if (locationParam) setSelectedLocation(locationParam)
    if (opdParam) setSelectedOPD(opdParam)
    if (jenisLayananParam) setSelectedJenisLayanan(jenisLayananParam)

    // Apply filters if any URL params exist
    if (search || locationParam || opdParam || jenisLayananParam) {
      console.log("🎯 Applying filters from URL...")

      // Apply filters immediately after component mounts
      setTimeout(() => {
        if (search) updateSearchTerm(search)
        if (locationParam) setLocationFilter(locationParam)
        if (opdParam) setOPDFilter(opdParam)
        if (jenisLayananParam) setJenisLayananFilter(jenisLayananParam)
        setUrlParamsApplied(true)
      }, 500)
    } else {
      setUrlParamsApplied(true)
    }
  }, [location.search, updateSearchTerm, setLocationFilter, setOPDFilter, setJenisLayananFilter, urlParamsApplied])

  // Handle search changes - INDEPENDEN DARI FILTER
  const handleSearchChange = (value) => {
    console.log("🔍 Search changed:", value)
    setSearchTerm(value)

    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout)
    }

    // Set new timeout for debouncing
    window.searchTimeout = setTimeout(() => {
      setFilterLoading(true)
      updateSearchTerm(value)
      setTimeout(() => setFilterLoading(false), 1000)
    }, 500)
  }

  // Handle search clear
  const handleSearchClear = () => {
    console.log("🔍 Search cleared")
    setSearchTerm("")
    setFilterLoading(true)
    updateSearchTerm("")
    setTimeout(() => setFilterLoading(false), 1000)
  }

  // Handle filter changes - INDEPENDEN DARI SEARCH
  const handleLocationChange = (value) => {
    console.log("📍 Location changed:", value)
    setSelectedLocation(value)
    setFilterLoading(true)
    setLocationFilter(value)
    setTimeout(() => setFilterLoading(false), 1000)
  }

  const handleOPDChange = (value) => {
    console.log("🏢 OPD changed:", value)
    setSelectedOPD(value)
    setFilterLoading(true)
    setOPDFilter(value)
    setTimeout(() => setFilterLoading(false), 1000)
  }

  const handleJenisLayananChange = (value) => {
    console.log("📄 Jenis layanan changed:", value)
    setSelectedJenisLayanan(value)
    setFilterLoading(true)
    setJenisLayananFilter(value)
    setTimeout(() => setFilterLoading(false), 1000)
  }

  // RESET SEMUA - KEMBALI KE DATA AWAL YANG SUDAH DIURUTKAN ABJAD
  const handleResetFilters = () => {
    console.log("🔄 Resetting all filters and search - back to alphabetical order")
    setSearchTerm("")
    setSelectedLocation("")
    setSelectedOPD("")
    setSelectedJenisLayanan("")
    setFilterLoading(true)

    // Reset filters and go back to page 1 with alphabetical order
    resetFilters()

    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)

    // Scroll to top when resetting
    window.scrollTo({ top: 0, behavior: "smooth" })

    setTimeout(() => setFilterLoading(false), 1000)
  }

  // SCROLL TO TOP ON PAGE CHANGE - ALWAYS
  const handlePageChange = (page) => {
    console.log(`📄 Page changed to: ${page} - scrolling to top`)

    // ALWAYS SCROLL TO TOP ON PAGE CHANGE
    window.scrollTo({ top: 0, behavior: "smooth" })

    updateCurrentPage(page)
  }

  // Get active filter count
  const activeFilterCount = [searchTerm, selectedLocation, selectedOPD, selectedJenisLayanan].filter(Boolean).length

  // Safe number formatting
  const formatNumber = (num) => {
    if (typeof num === "number" && !isNaN(num)) {
      return num.toLocaleString()
    }
    return "0"
  }

  // Loading state - show progress for initial 50 data loading
  if (loading && objects.length === 0) {
    return (
      <div className="page-container">
        <ApiConnectionStatus />
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="loading-spinner mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Memuat Data Awal</h3>
              <p className="text-gray-600 mb-4">
                Mengambil 60 data obyek retribusi untuk tampilan awal (urutan abjad)...
              </p>

              <div className="text-sm text-gray-500 space-y-1">
                <div className="flex items-center justify-center space-x-1">
                  <TrendingUp size={14} />
                  <span>Batch loading: 60 data awal, load more saat halaman 5</span>
                </div>
                <p>Filter menggunakan 5000 data (OPTIMIZED untuk kecepatan)</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  // Error state
  if (error && objects.length === 0) {
    return (
      <div className="page-container">
        <ApiConnectionStatus />
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md mx-auto px-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gagal Memuat Data</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button onClick={refreshData} variant="primary" icon={<RefreshCw size={18} />}>
                  Coba Lagi
                </Button>
                <p className="text-xs text-gray-500">
                  Pastikan koneksi internet Anda stabil dan server API dapat diakses
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* API Connection Status */}
      <ApiConnectionStatus />

      <Container>
        {/* Header Section - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center section-spacing px-4"
        >
          <Heading level={1}>Obyek Retribusi Daerah</Heading>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mt-4">
            Temukan dan jelajahi berbagai obyek retribusi daerah di Jawa Tengah
          </p>

          {/* Performance Stats - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mt-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Database size={16} className="text-blue-500" />
              <span className="text-blue-600 font-medium">60 Data Awal (Abjad)</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-green-600 font-medium">12 Item Per Halaman</span>
            </div>
            <div className="flex items-center space-x-1">
              <Search size={16} className="text-purple-500" />
              <span className="text-purple-600 font-medium">Filter 5000 Data (OPTIMIZED)</span>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="content-spacing px-4"
        >
          <div className="glass-effect rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Pencarian Obyek Retribusi
                  <span className="ml-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                    {isFiltering ? `Search dari filter data` : `Search dari ${formatNumber(totalLoaded)} data (abjad)`}
                  </span>
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    type="text"
                    placeholder="Cari berdasarkan nama obyek, lokasi, atau OPD..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-12 py-3 w-full"
                  />
                  {searchTerm && (
                    <button
                      onClick={handleSearchClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}
                  {(loading || filterLoading) && searchTerm && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <RefreshCw className="animate-spin text-blue-500" size={16} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Filter & Kategori
                  <span className="ml-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    OPTIMIZED: Dropdown dari 5000 data (cepat & lengkap)
                  </span>
                </label>
                <FilterGroup
                  selectedLocation={selectedLocation}
                  onLocationChange={handleLocationChange}
                  selectedOPD={selectedOPD}
                  onOPDChange={handleOPDChange}
                  selectedJenisLayanan={selectedJenisLayanan}
                  onJenisLayananChange={handleJenisLayananChange}
                  onReset={handleResetFilters}
                  showFilterLoading={filterLoading}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Section - Responsive */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="content-spacing px-4"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <p className="text-gray-600 font-medium">
                Menampilkan <span className="font-bold text-blue-600">{objects.length}</span> dari{" "}
                <span className="font-bold">{formatNumber(totalObjects)}</span> obyek retribusi
                {activeFilterCount > 0 && (
                  <span className="text-sm text-gray-500 ml-2 block sm:inline">({activeFilterCount} filter aktif)</span>
                )}
              </p>

              {(loading || filterLoading) && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <RefreshCw className="animate-spin" size={14} />
                  <span className="text-sm">Memuat...</span>
                </div>
              )}
            </div>

            {/* Performance indicator - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
              <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                {isFiltering ? "Filter Mode" : "Display Mode (Abjad)"}
              </div>
              <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Page {currentPage} of {totalPages}
              </div>
            </div>
          </div>

          {/* Dataset Info Banner - Responsive */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Database className="text-blue-600 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-blue-800">Smart Loading Strategy (OPTIMIZED)</h4>
                <p className="text-sm text-blue-700">
                  {isFiltering
                    ? "Mode Filter: Menggunakan up to 8000 data untuk hasil yang akurat & cepat"
                    : "Mode Display: Menampilkan 60 data awal (urutan abjad), 12 item per halaman"}
                  <span className="text-green-600 font-medium"> ✓ Dropdown 5000 Data (OPTIMIZED)</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Objects Grid - Responsive */}
        <div className="content-container px-4">
          {filterLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Memfilter Data</h3>
                <p className="text-gray-600">
                  {isFiltering
                    ? "Mencari data dari filter data (up to 8000 objects)..."
                    : `Mencari data dari ${formatNumber(totalLoaded)} objects (urutan abjad)...`}
                </p>
              </div>
            </div>
          ) : (
            <ObjectsList objects={objects} loading={loading} />
          )}
        </div>

        {/* Pagination - Responsive */}
        {!loading && !error && !filterLoading && totalPages > 1 && (
          <div className="px-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalObjects}
              itemsPerPage={12}
            />
          </div>
        )}

        {/* No data state - Responsive */}
        {!loading && !error && !filterLoading && objects.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <AlertCircle size={96} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada objek ditemukan</h3>
            <p className="text-gray-600 mb-4">
              Tidak ditemukan obyek retribusi yang sesuai dengan filter yang dipilih.
            </p>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Semua Filter & Search
            </Button>
          </div>
        )}
      </Container>
    </div>
  )
}
