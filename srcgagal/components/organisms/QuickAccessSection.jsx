"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { MapPin, Building, Search } from "lucide-react"
import Container from "../atoms/Container"
import Card from "../atoms/Card"
import Button from "../atoms/Button"
import apiService from "../../services/api"

// Custom SearchableSelect component for Quick Access - MENGGUNAKAN 1000 DATA (FAST)
function QuickSearchableSelect({
  options = [],
  value = "",
  onChange = () => {},
  placeholder = "Select an option",
  icon,
  className = "",
  disabled = false,
  loading = false,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)
  const triggerRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const selectedOption = options.find((option) => option.value === value)
  const filteredOptions =
    searchTerm.trim() === ""
      ? options
      : options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSelect = (selectedValue) => {
    onChange(selectedValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleClear = () => {
    onChange("")
    setIsOpen(false)
    setSearchTerm("")
  }

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ zIndex: isOpen ? 1000 : 1 }} {...props}>
      <div
        ref={triggerRef}
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        className={`w-full ${
          icon ? "pl-10" : "pl-4"
        } pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer text-sm ${
          disabled || loading ? "opacity-50 cursor-not-allowed bg-gray-100" : ""
        }`}
      >
        {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">{icon}</div>}
        <span className={selectedOption ? "text-gray-900 font-medium" : "text-gray-500"}>
          {loading ? "Memuat..." : selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {loading ? (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && !disabled && !loading && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
          style={{ zIndex: 999999 }}
        >
          <div className="p-3 border-b border-gray-100 bg-gray-50 sticky top-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            <div
              onClick={() => handleClear()}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-500 text-sm border-b border-gray-100"
            >
              {placeholder}
            </div>

            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={`${option.value}-${index}`}
                  onClick={() => handleSelect(option.value)}
                  className={`px-4 py-3 hover:bg-blue-50 cursor-pointer text-sm ${
                    value === option.value ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-700"
                  }`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-sm text-gray-500 text-center">
                <div className="mb-2">{searchTerm ? "🔍 Tidak ditemukan" : "📋 Tidak ada data"}</div>
                {searchTerm && <div className="text-xs text-gray-400">Coba kata kunci lain</div>}
              </div>
            )}
          </div>
        </div>
        </div>
      </Container>
    </div>
  )
}

export default function QuickAccessSection() {
  const [activeService, setActiveService] = useState("obyek")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedOPD, setSelectedOPD] = useState("")
  const [selectedJenisLayanan, setSelectedJenisLayanan] = useState("")
  const [objectCount, setObjectCount] = useState(0)
  const [dropdownOptions, setDropdownOptions] = useState({
    locations: [],
    opds: [],
    jenisLayanan: [],
  })
  const [dropdownLoading, setDropdownLoading] = useState(false)
  const navigate = useNavigate()

  // Load dropdown options dari 1000 data representatif (FAST)
  useEffect(() => {
    let isMounted = true

    const loadDropdownOptions = async () => {
      try {
        if (!isMounted) return

        setDropdownLoading(true)

        // Check if already cached
        const cachedResult = apiService.getDropdownOptions()
        if (cachedResult.success && isMounted) {
          console.log("📋 Using cached dropdown options for QuickAccess from 1000 representative data")
          setDropdownOptions({
            locations: cachedResult.data.locations,
            opds: cachedResult.data.opds,
            jenisLayanan: cachedResult.data.jenisLayanan,
          })
          setDropdownLoading(false)
          return
        }

        if (!isMounted) return

        // Load from API (1000 representative data - FAST)
        console.log("🚀 Loading dropdown options for QuickAccess from 1000 representative data (FAST)...")
        const result = await apiService.loadDropdownOptions()

        if (!isMounted) return

        if (result.success) {
          setDropdownOptions({
            locations: result.data.locations,
            opds: result.data.opds,
            jenisLayanan: result.data.jenisLayanan,
          })
          console.log("✅ QuickAccess dropdown loaded from 1000 representative data:", {
            locations: result.data.locations.length,
            opds: result.data.opds.length,
            jenisLayanan: result.data.jenisLayanan.length,
          })
        }
      } catch (error) {
        console.error("❌ Error loading dropdown options for QuickAccess:", error)
      } finally {
        if (isMounted) {
          setDropdownLoading(false)
        }
      }
    }

    loadDropdownOptions()

    return () => {
      isMounted = false
    }
  }, [])

  // Get object count from API
  useEffect(() => {
    const fetchObjectCount = async () => {
      try {
        const stats = apiService.getCacheStats()
        if (stats.displayLoaded > 0) {
          setObjectCount(stats.displayLoaded)
        } else {
          // Load initial data to get count
          const result = await apiService.loadInitialData()
          if (result.success) {
            setObjectCount(result.totalLoaded)
          }
        }
      } catch (error) {
        console.error("❌ Error getting object count:", error)
        setObjectCount(0)
      }
    }

    fetchObjectCount()
  }, [])

  const categoryItems = [
    {
      id: "obyek",
      name: "Obyek",
      subtitle: "Retribusi",
      icon: "🏛️",
      count: objectCount,
      path: "/objects",
    },
    {
      id: "bukti-bayar",
      name: "Bukti Bayar",
      subtitle: "Download",
      icon: "📄",
      count: 6,
      path: "/payment-receipts",
    },
    {
      id: "sptrd",
      name: "SPTRD",
      subtitle: "Permohonan",
      icon: "📋",
      count: 0,
      path: "/coming-soon",
      comingSoon: true,
    },
    {
      id: "penerbitan-ulang",
      name: "Penerbitan Ulang",
      subtitle: "SKP/Retribusi",
      icon: "🔄",
      count: 0,
      path: "/coming-soon",
      comingSoon: true,
    },
    {
      id: "pendaftaran-wp",
      name: "Pendaftaran WP",
      subtitle: "PAP",
      icon: "👤",
      count: 0,
      path: "/coming-soon",
      comingSoon: true,
    },
    {
      id: "npwpd",
      name: "NPWPD",
      subtitle: "Penerbitan",
      icon: "🆔",
      count: 0,
      path: "/coming-soon",
      comingSoon: true,
    },
  ]

  const quickServices = [
    { id: "obyek", name: "Obyek", path: "/objects" },
    { id: "bukti-bayar", name: "Bukti Bayar", path: "/payment-receipts" },
  ]

  const handleSearch = () => {
    if (activeService === "obyek") {
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      if (selectedLocation) params.set("location", selectedLocation)
      if (selectedOPD) params.set("opd", selectedOPD)
      if (selectedJenisLayanan) params.set("jenisLayanan", selectedJenisLayanan)
      navigate(`/objects?${params.toString()}`)
    } else {
      const params = new URLSearchParams()
      if (searchTerm) params.set("search", searchTerm)
      navigate(`/payment-receipts?${params.toString()}`)
    }
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedLocation("")
    setSelectedOPD("")
    setSelectedJenisLayanan("")
  }

  return (
    <div className="relative py-20 md:py-28 bg-white">
      <Container>
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section - Category Selection */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Kategori Pilihan</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categoryItems.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <Link to={category.path}>
                      <motion.div
                        whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        className={`bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-300 h-full group ${
                          category.comingSoon ? "opacity-60" : ""
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-4">{category.icon}</div>
                          <h4 className="font-600 text-gray-900 text-base mb-1">{category.name}</h4>
                          <p className="text-sm text-gray-500 mb-4">{category.subtitle}</p>
                          <span
                            className={`text-xs px-3 py-1 rounded-full font-500 ${
                              category.comingSoon 
                                ? "bg-gray-200 text-gray-600" 
                                : "bg-black text-white"
                            }`}
                          >
                            {category.comingSoon ? "Segera Hadir" : `${category.count} tersedia`}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Section - Quick Services */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Layanan Cepat</h3>
                <span className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                  {dropdownLoading ? "Loading Fast Data..." : "Fast Data Ready (1000)"}
                </span>
              </div>

              {/* Tab-like navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
                {quickServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setActiveService(service.id)}
                    className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                      activeService === service.id
                        ? "bg-white text-green-600 shadow-sm border-b-2 border-green-500"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    {service.name}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <div className="space-y-4">
                {/* Search Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeService === "obyek" ? "Kata Kunci Obyek" : "Kata Kunci Bukti Bayar"}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder={
                        activeService === "obyek"
                          ? "Masukkan kata kunci obyek..."
                          : "Masukkan kata kunci bukti bayar..."
                      }
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Filters - Only show for obyek */}
                {activeService === "obyek" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Lokasi ({dropdownOptions.locations.length})
                          {dropdownLoading && <span className="text-yellow-600 ml-1">⏳</span>}
                        </label>
                        <QuickSearchableSelect
                          options={dropdownOptions.locations}
                          value={selectedLocation}
                          onChange={setSelectedLocation}
                          placeholder="Pilih Lokasi"
                          icon={<MapPin size={18} />}
                          loading={dropdownLoading}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          OPD Pengelola ({dropdownOptions.opds.length})
                          {dropdownLoading && <span className="text-yellow-600 ml-1">⏳</span>}
                        </label>
                        <QuickSearchableSelect
                          options={dropdownOptions.opds}
                          value={selectedOPD}
                          onChange={setSelectedOPD}
                          placeholder="Pilih OPD"
                          icon={<Building size={18} />}
                          loading={dropdownLoading}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Jenis Layanan ({dropdownOptions.jenisLayanan.length})
                          {dropdownLoading && <span className="text-yellow-600 ml-1">⏳</span>}
                        </label>
                        <QuickSearchableSelect
                          options={dropdownOptions.jenisLayanan}
                          value={selectedJenisLayanan}
                          onChange={setSelectedJenisLayanan}
                          placeholder="Pilih Jenis Layanan"
                          icon={<Building size={18} />}
                          loading={dropdownLoading}
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                        <div className="relative">
                          <select
                            disabled
                            className="w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                          >
                            <option>Segera Hadir</option>
                          </select>
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-600 animate-pulse">
                              Coming Soon
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button variant="primary" className="flex-1" onClick={handleSearch}>
                    Cari
                  </Button>
                  {activeService === "obyek" && (
                    <Button variant="secondary" onClick={resetFilters}>
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </Container>
    </div>
  )
}
