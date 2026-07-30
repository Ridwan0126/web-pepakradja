"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, X, RefreshCw } from "lucide-react"

export default function Select({
  value,
  onChange,
  options = [],
  placeholder = "Pilih opsi...",
  loading = false,
  disabled = false,
  className = "",
  showClearButton = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const selectRef = useRef(null)
  const searchInputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  // Filter options based on search term
  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get display value
  const displayValue = value || placeholder

  // Handle option selection
  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm("")
  }

  // Handle clear
  const handleClear = (e) => {
    e.stopPropagation()
    onChange("")
    setSearchTerm("")
  }

  // Handle dropdown toggle
  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {/* Select Button */}
      <div
        onClick={handleToggle}
        className={`
        w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-xl
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        transition-all duration-200 flex items-center justify-between cursor-pointer
        ${disabled || loading ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400"}
        ${isOpen ? "border-blue-500 ring-2 ring-blue-500" : ""}
      `}
      >
        <span className={`truncate ${!value ? "text-gray-500" : "text-gray-900"}`}>{displayValue}</span>

        <div className="flex items-center space-x-2">
          {/* Clear Button */}
          {showClearButton && value && !loading && !disabled && (
            <div
              onClick={handleClear}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Hapus pilihan"
            >
              <X size={14} />
            </div>
          )}

          {/* Loading Spinner */}
          {loading && <RefreshCw className="animate-spin text-blue-500" size={16} />}

          {/* Dropdown Arrow */}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          {options.length > 10 && (
            <div className="p-3 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`
                  w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 cursor-pointer
                  ${value === option ? "bg-blue-100 text-blue-900 font-medium" : "text-gray-900"}
                  ${index === 0 ? "" : "border-t border-gray-100"}
                `}
                >
                  <span className="truncate block">{option}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                {searchTerm ? "Tidak ada hasil ditemukan" : "Tidak ada opsi tersedia"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
