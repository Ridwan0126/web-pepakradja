"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Filter, RotateCcw, RefreshCw, X, MapPin, Building, FileText } from "lucide-react"
import Select from "../atoms/Select"
import Button from "../atoms/Button"
import apiService from "../../services/api"

export default function FilterGroup({
  selectedLocation,
  onLocationChange,
  selectedOPD,
  onOPDChange,
  selectedJenisLayanan,
  onJenisLayananChange,
  onReset,
  showFilterLoading = false,
}) {
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    opds: [],
    jenisLayanan: [],
  })
  const [optionsLoading, setOptionsLoading] = useState(true)
  const [optionsError, setOptionsError] = useState(null)

  // Load filter options on component mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setOptionsLoading(true)
        setOptionsError(null)

        console.log("🔄 Loading filter options from 5000 data...")

        const result = await apiService.loadFilterData()

        if (result.success) {
          setFilterOptions({
            locations: result.locations || [],
            opds: result.opds || [],
            jenisLayanan: result.jenisLayanan || [],
          })

          console.log("✅ Filter options loaded:", {
            locations: result.locations?.length || 0,
            opds: result.opds?.length || 0,
            jenisLayanan: result.jenisLayanan?.length || 0,
          })
        } else {
          throw new Error(result.message || "Failed to load filter options")
        }
      } catch (err) {
        console.error("❌ Error loading filter options:", err)
        setOptionsError(err.message)
      } finally {
        setOptionsLoading(false)
      }
    }

    loadFilterOptions()
  }, [])

  // Clear individual filters
  const handleLocationClear = () => {
    onLocationChange("")
  }

  const handleOPDClear = () => {
    onOPDChange("")
  }

  const handleJenisLayananClear = () => {
    onJenisLayananChange("")
  }

  // Get active filter count
  const activeFilterCount = [selectedLocation, selectedOPD, selectedJenisLayanan].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Filter Controls Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Location Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <MapPin size={14} className="text-blue-500" />
            <span>Lokasi/Kab/Kota</span>
            {selectedLocation && (
              <button
                onClick={handleLocationClear}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Hapus filter lokasi"
              >
                <X size={12} />
              </button>
            )}
          </label>
          <Select
            value={selectedLocation}
            onChange={onLocationChange}
            options={filterOptions.locations}
            placeholder="Pilih lokasi..."
            loading={optionsLoading}
            disabled={showFilterLoading}
            showClearButton={true}
          />
        </div>

        {/* OPD Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <Building size={14} className="text-green-500" />
            <span>OPD</span>
            {selectedOPD && (
              <button
                onClick={handleOPDClear}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Hapus filter OPD"
              >
                <X size={12} />
              </button>
            )}
          </label>
          <Select
            value={selectedOPD}
            onChange={onOPDChange}
            options={filterOptions.opds}
            placeholder="Pilih OPD..."
            loading={optionsLoading}
            disabled={showFilterLoading}
            showClearButton={true}
          />
        </div>

        {/* Jenis Layanan Filter */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText size={14} className="text-purple-500" />
            <span>Jenis Layanan</span>
            {selectedJenisLayanan && (
              <button
                onClick={handleJenisLayananClear}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Hapus filter jenis layanan"
              >
                <X size={12} />
              </button>
            )}
          </label>
          <Select
            value={selectedJenisLayanan}
            onChange={onJenisLayananChange}
            options={filterOptions.jenisLayanan}
            placeholder="Pilih jenis layanan..."
            loading={optionsLoading}
            disabled={showFilterLoading}
            showClearButton={true}
          />
        </div>
      </div>

      {/* Filter Status & Actions - Responsive */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Active Filters Count */}
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-500" />
            <span className="text-sm text-gray-600">
              {activeFilterCount > 0 ? (
                <span className="font-medium text-blue-600">{activeFilterCount} filter aktif</span>
              ) : (
                "Tidak ada filter aktif"
              )}
            </span>
          </div>

          {/* Loading Indicator */}
          {(optionsLoading || showFilterLoading) && (
            <div className="flex items-center space-x-2 text-blue-600">
              <RefreshCw className="animate-spin" size={14} />
              <span className="text-sm">{optionsLoading ? "Memuat opsi filter..." : "Memfilter data..."}</span>
            </div>
          )}

          {/* Error State */}
          {optionsError && (
            <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">Error: {optionsError}</div>
          )}
        </div>

        {/* Reset Button */}
        {activeFilterCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              icon={<RotateCcw size={14} />}
              disabled={showFilterLoading}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            >
              Reset Semua Filter
            </Button>
          </motion.div>
        )}
      </div>

      {/* Filter Performance Info */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
          <span>
            ✅ Filter options loaded from <span className="font-medium text-blue-600">5000 data</span> (OPTIMIZED)
          </span>
          <span>
            📊 {filterOptions.locations.length} lokasi, {filterOptions.opds.length} OPD,{" "}
            {filterOptions.jenisLayanan.length} jenis layanan
          </span>
        </div>
      </div>
    </div>
  )
}
