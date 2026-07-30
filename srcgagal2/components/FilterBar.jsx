"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, MapPin, Building, Briefcase, RotateCcw, ChevronDown, Trash2 } from "lucide-react"
import { useData } from "../contexts/DataContext"

const SearchableDropdown = ({ label, value, onChange, options, placeholder, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef(null)

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} ({options.length}) <span className="text-green-500">✓ {options.length}</span>
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white text-left"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
        </button>
        <ChevronDown
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          size={16}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Cari..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto">
              <div className="p-2 text-sm text-gray-600 bg-gray-50 border-b">Pilih {label}</div>
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      onChange(option)
                      setIsOpen(false)
                      setSearchTerm("")
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-gray-900"
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">Tidak ada data ditemukan</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FilterBar = ({ onFilterChange, currentFilters, showCategory = false }) => {
  const { filterOptions } = useData()
  const [isExpanded, setIsExpanded] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    search: "",
    location: "",
    opd: "",
    serviceType: "",
    category: "", // Added category filter
  })

  useEffect(() => {
    setLocalFilters({
      search: currentFilters.search || "",
      location: currentFilters.location || "",
      opd: currentFilters.opd || "",
      serviceType: currentFilters.serviceType || "",
      category: currentFilters.category || "", // Added category filter
    })
  }, [currentFilters])

  const handleInputChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value,
    }
    setLocalFilters(newFilters)

    onFilterChange(newFilters)
  }

  const handleSearch = () => {
    if (!hasActiveFilters) {
      return
    }
    onFilterChange(localFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      search: "",
      location: "",
      opd: "",
      serviceType: "",
      category: "",
    }
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some((value) => value !== "")

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Filter & Kategori</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
        >
          <span>{isExpanded ? "Tutup" : "Buka"} Filter</span>
          <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <Filter size={16} />
          </motion.div>
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : "auto" }}
        className={`${isExpanded ? "block" : "hidden"} lg:block`}
      >
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Pencarian Obyek Retribusi</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama obyek, lokasi, atau OPD..."
              value={localFilters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 shadow-sm"
            />
            {localFilters.search && (
              <button
                onClick={() => handleInputChange("search", "")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSearch()
          }}
        >
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${showCategory ? "4" : "3"} gap-4 mb-6`}>
            {/* Location Filter */}
            <SearchableDropdown
              label="Lokasi"
              value={localFilters.location}
              onChange={(value) => handleInputChange("location", value)}
              options={filterOptions.locations}
              placeholder="Pilih Lokasi"
              icon={MapPin}
            />

            {/* OPD Filter */}
            <SearchableDropdown
              label="Pengelola"
              value={localFilters.opd}
              onChange={(value) => handleInputChange("opd", value)}
              options={filterOptions.opds}
              placeholder="Pilih OPD"
              icon={Building}
            />

            {/* Service Type Filter */}
            <SearchableDropdown
              label="Jenis Layanan"
              value={localFilters.serviceType}
              onChange={(value) => handleInputChange("serviceType", value)}
              options={filterOptions.serviceTypes}
              placeholder="Pilih Jenis Layanan"
              icon={Briefcase}
            />

            {showCategory && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-orange-500 text-xs">(Coming Soon)</span>
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <button
                    type="button"
                    disabled
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed text-left shadow-sm"
                  >
                    Segera Hadir
                  </button>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                    size={16}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={!hasActiveFilters}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md ${
                hasActiveFilters
                  ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Search size={16} />
              <span>{hasActiveFilters ? "Cari" : "Pilih filter terlebih dahulu"}</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!hasActiveFilters}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 shadow-sm ${
                hasActiveFilters
                  ? "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:shadow-md"
                  : "border-2 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              <RotateCcw size={16} />
              <span>{hasActiveFilters ? "Reset" : "Tidak ada filter aktif"}</span>
            </button>
          </div>
        </form>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <p className="text-sm text-gray-600 mb-2">Filter aktif:</p>
            <div className="flex flex-wrap gap-2">
              {localFilters.search && (
                <span className="inline-flex items-center space-x-1 bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span>Pencarian: "{localFilters.search}"</span>
                  <button
                    onClick={() => handleInputChange("search", "")}
                    className="hover:bg-primary-200 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              )}
              {localFilters.location && (
                <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span>Lokasi: {localFilters.location}</span>
                  <button
                    onClick={() => handleInputChange("location", "")}
                    className="hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              )}
              {localFilters.opd && (
                <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span>Pengelola: {localFilters.opd}</span>
                  <button
                    onClick={() => handleInputChange("opd", "")}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              )}
              {localFilters.serviceType && (
                <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span>Layanan: {localFilters.serviceType}</span>
                  <button
                    onClick={() => handleInputChange("serviceType", "")}
                    className="hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              )}
              {localFilters.category && (
                <span className="inline-flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm shadow-sm">
                  <span>Kategori: {localFilters.category}</span>
                  <button
                    onClick={() => handleInputChange("category", "")}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors duration-200"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              )}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

export default FilterBar
