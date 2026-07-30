"use client"
import { useState, useContext, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  ChevronDown,
  Building,
  FileText,
  CreditCard,
  Users,
  Shield,
  BadgeIcon as IdCard,
  Trash2,
  Search,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { DataContext } from "../contexts/DataContext"
import dataService from "../services/dataService"

const QuickServices = () => {
  const navigate = useNavigate()
  const { filterOptions } = useContext(DataContext)
  const [activeTab, setActiveTab] = useState("obyek")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedOPD, setSelectedOPD] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [locationSearch, setLocationSearch] = useState("")
  const [opdSearch, setOpdSearch] = useState("")
  const [serviceSearch, setServiceSearch] = useState("")
  const [openDropdown, setOpenDropdown] = useState(null)

  const [billingId, setBillingId] = useState("")
  const [selectedPaymentType, setSelectedPaymentType] = useState("")
  const [isSearchingPayment, setIsSearchingPayment] = useState(false)
  const [paymentSearchError, setPaymentSearchError] = useState("")

  const services = [
    {
      icon: Building,
      title: "Obyek",
      subtitle: "Retribusi",
      count: "50 tersedia",
      countColor: "text-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: FileText,
      title: "Bukti Bayar",
      subtitle: "Download",
      count: "6 tersedia",
      countColor: "text-blue-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: CreditCard,
      title: "SPTRD",
      subtitle: "Permohonan",
      count: "Segera Hadir",
      countColor: "text-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      icon: Shield,
      title: "SKPD/SKRD",
      subtitle: "Penerbitan Ulang",
      count: "Segera Hadir",
      countColor: "text-orange-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      title: "PAP",
      subtitle: "Pendaftaran WP",
      count: "Segera Hadir",
      countColor: "text-orange-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: IdCard,
      title: "NPWPD",
      subtitle: "Penerbitan",
      count: "Segera Hadir",
      countColor: "text-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  const paymentTypes = [
    { value: "retribusi", label: "Retribusi" },
    { value: "pap", label: "PAP" },
    { value: "pab", label: "PAB" },
  ]

  const handleSearch = () => {
    const hasActiveFilters = searchTerm || selectedLocation || selectedOPD || selectedService

    if (!hasActiveFilters) {
      alert("Silakan pilih minimal satu filter untuk melakukan pencarian!")
      return
    }

    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (selectedLocation) params.set("location", selectedLocation)
    if (selectedOPD) params.set("opd", selectedOPD)
    if (selectedService) params.set("service", selectedService)

    navigate(`/obyek?${params.toString()}`)
  }

  const handlePaymentSearch = async () => {
    const hasPaymentFilters = billingId || selectedPaymentType

    if (!hasPaymentFilters) {
      alert("Silakan masukkan ID Billing atau pilih jenis pembayaran untuk melakukan pencarian!")
      return
    }

    if (!billingId.trim()) {
      setPaymentSearchError("Masukkan ID Billing")
      return
    }

    if (!selectedPaymentType) {
      setPaymentSearchError("Pilih jenis pembayaran")
      return
    }

    setIsSearchingPayment(true)
    setPaymentSearchError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const receipts = dataService.getPaymentReceipts()
      if (receipts.success) {
        const foundReceipt = receipts.data.find(
          (receipt) =>
            receipt.id.toLowerCase().includes(billingId.toLowerCase()) &&
            receipt.type.toLowerCase() === selectedPaymentType.toLowerCase(),
        )

        if (foundReceipt) {
          const encodedId = encodeURIComponent(foundReceipt.id)
          const routeMap = {
            retribusi: `/unduh-bukti-bayar/retribusi/${encodedId}`,
            pap: `/unduh-bukti-bayar/pap/${encodedId}`,
            pab: `/unduh-bukti-bayar/pab/${encodedId}`,
          }

          const route = routeMap[selectedPaymentType]
          if (route) {
            navigate(route)
          }
        } else {
          setPaymentSearchError("Data tidak ditemukan. Periksa kembali ID Billing dan jenis pembayaran.")
        }
      }
    } catch (error) {
      setPaymentSearchError("Terjadi kesalahan saat mencari data. Silakan coba lagi.")
    } finally {
      setIsSearchingPayment(false)
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setSelectedLocation("")
    setSelectedOPD("")
    setSelectedService("")
    setLocationSearch("")
    setOpdSearch("")
    setServiceSearch("")
    setOpenDropdown(null)
    setBillingId("")
    setSelectedPaymentType("")
    setPaymentSearchError("")
  }

  const handleServiceClick = (service) => {
    switch (service.title) {
      case "Obyek":
        navigate("/obyek")
        break
      case "Bukti Bayar":
        navigate("/unduh-bukti-bayar")
        break
      case "SPTRD":
      case "SKPD/SKRD":
      case "PAP":
      case "NPWPD":
        navigate("/coming-soon")
        break
      default:
        break
    }
  }

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "search":
        setSearchTerm("")
        break
      case "location":
        setSelectedLocation("")
        break
      case "opd":
        setSelectedOPD("")
        break
      case "service":
        setSelectedService("")
        break
      case "billingId":
        setBillingId("")
        break
      case "paymentType":
        setSelectedPaymentType("")
        break
    }
  }

  const hasActiveFilters = searchTerm || selectedLocation || selectedOPD || selectedService
  const hasPaymentFilters = billingId || selectedPaymentType

  const locationDropdownRef = useRef(null)
  const opdDropdownRef = useRef(null)
  const serviceDropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        if (openDropdown === "location") setOpenDropdown(null)
      }
      if (opdDropdownRef.current && !opdDropdownRef.current.contains(event.target)) {
        if (openDropdown === "opd") setOpenDropdown(null)
      }
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(event.target)) {
        if (openDropdown === "service") setOpenDropdown(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [openDropdown])

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Quick Services */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Layanan Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    onClick={() => handleServiceClick(service)}
                    className={`${service.bgColor} rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                  >
                    <div className="w-12 h-12 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className={service.iconColor} size={24} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{service.subtitle}</p>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${service.countColor} bg-white`}>
                      {service.count}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Filter</h2>

            {/* {activeTab === "obyek" && !hasActiveFilters && (
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-800">
                  <Search size={16} />
                  <p className="text-sm font-medium">Anda belum memilih data filter dan search</p>
                </div>
                <p className="text-xs text-amber-600 mt-1">
                  Silakan pilih minimal satu kriteria pencarian seperti kata kunci, lokasi, pengelola, atau jenis
                  layanan untuk memfilter data.
                </p>
              </div>
            )} */}

            {activeTab === "bukti-bayar" && !hasPaymentFilters && (
              <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center space-x-2 text-amber-800">
                  <Search size={16} />
                  <p className="text-sm font-medium">Anda belum memilih data filter dan search</p>
                </div>
                <p className="text-xs text-amber-600 mt-1">
                  Silakan masukkan ID Billing atau pilih jenis pembayaran untuk mencari bukti pembayaran.
                </p>
              </div>
            )}

            {((activeTab === "obyek" && hasActiveFilters) || (activeTab === "bukti-bayar" && hasPaymentFilters)) && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Filter aktif:</p>
                <div className="flex flex-wrap gap-2">
                  {activeTab === "obyek" && (
                    <>
                      {searchTerm && (
                        <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          <span>Pencarian: "{searchTerm}"</span>
                          <button
                            onClick={() => removeFilter("search")}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                      {selectedLocation && (
                        <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          <span>Lokasi: {selectedLocation}</span>
                          <button
                            onClick={() => removeFilter("location")}
                            className="hover:bg-green-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                      {selectedOPD && (
                        <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          <span>Pengelola: {selectedOPD}</span>
                          <button
                            onClick={() => removeFilter("opd")}
                            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                      {selectedService && (
                        <span className="inline-flex items-center space-x-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                          <span>Layanan: {selectedService}</span>
                          <button
                            onClick={() => removeFilter("service")}
                            className="hover:bg-orange-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                    </>
                  )}
                  {activeTab === "bukti-bayar" && (
                    <>
                      {billingId && (
                        <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          <span>ID Billing: "{billingId}"</span>
                          <button
                            onClick={() => removeFilter("billingId")}
                            className="hover:bg-blue-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                      {selectedPaymentType && (
                        <span className="inline-flex items-center space-x-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                          <span>Jenis: {paymentTypes.find((p) => p.value === selectedPaymentType)?.label}</span>
                          <button
                            onClick={() => removeFilter("paymentType")}
                            className="hover:bg-purple-200 rounded-full p-0.5 transition-colors duration-200"
                          >
                            <Trash2 size={12} />
                          </button>
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("obyek")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "obyek" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Obyek
              </button>
              <button
                onClick={() => setActiveTab("bukti-bayar")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "bukti-bayar"
                    ? "bg-white text-green-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Bukti Bayar
              </button>
            </div>

            {activeTab === "obyek" ? (
              <>
                {/* Search Input */}
                <div className="mb-6">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Obyek</h3>
                    <p className="text-sm text-gray-600 mb-3">Kata Kunci Obyek</p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Masukkan kata kunci obyek..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Filter Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div ref={locationDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi ({filterOptions?.locations?.length || 38})
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === "location" ? null : "location")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-left flex items-center justify-between"
                      >
                        <span className={selectedLocation ? "text-gray-900" : "text-gray-500"}>
                          {selectedLocation || "Pilih Lokasi"}
                        </span>
                        <ChevronDown size={20} className="text-gray-400" />
                      </button>
                      {openDropdown === "location" && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Cari..."
                              value={locationSearch}
                              onChange={(e) => setLocationSearch(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {(filterOptions?.locations || [])
                              .filter((location) => location.toLowerCase().includes(locationSearch.toLowerCase()))
                              .map((location, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSelectedLocation(location)
                                    setOpenDropdown(null)
                                    setLocationSearch("")
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50"
                                >
                                  {location}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div ref={opdDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pengelola ({filterOptions?.opds?.length || 24})
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === "opd" ? null : "opd")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-left flex items-center justify-between"
                      >
                        <span className={selectedOPD ? "text-gray-900" : "text-gray-500"}>
                          {selectedOPD || "Pilih Pengelola"}
                        </span>
                        <ChevronDown size={20} className="text-gray-400" />
                      </button>
                      {openDropdown === "opd" && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Cari..."
                              value={opdSearch}
                              onChange={(e) => setOpdSearch(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {(filterOptions?.opds || [])
                              .filter((opd) => opd.toLowerCase().includes(opdSearch.toLowerCase()))
                              .map((opd, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSelectedOPD(opd)
                                    setOpenDropdown(null)
                                    setOpdSearch("")
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50"
                                >
                                  {opd}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div ref={serviceDropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Layanan/Jasa ({filterOptions?.serviceTypes?.length || 10})
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === "service" ? null : "service")}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-left flex items-center justify-between"
                      >
                        <span className={selectedService ? "text-gray-900" : "text-gray-500"}>
                          {selectedService || "Pilih Jenis Layanan"}
                        </span>
                        <ChevronDown size={20} className="text-gray-400" />
                      </button>
                      {openDropdown === "service" && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                          <div className="p-2">
                            <input
                              type="text"
                              placeholder="Cari..."
                              value={serviceSearch}
                              onChange={(e) => setServiceSearch(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                          <div className="max-h-48 overflow-y-auto">
                            {(filterOptions?.serviceTypes || [])
                              .filter((service) => service.toLowerCase().includes(serviceSearch.toLowerCase()))
                              .map((service, index) => (
                                <button
                                  key={index}
                                  onClick={() => {
                                    setSelectedService(service)
                                    setOpenDropdown(null)
                                    setServiceSearch("")
                                  }}
                                  className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50"
                                >
                                  {service}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                    <div className="relative">
                      <select
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                      >
                        <option value="">Segera Hadir</option>
                      </select>
                      <div className="absolute top-2 right-8 bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full font-medium">
                        Coming Soon
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSearch}
                    disabled={!hasActiveFilters}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                      hasActiveFilters
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={!hasActiveFilters ? "Pilih minimal satu filter untuk melakukan pencarian" : ""}
                  >
                    Cari
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </>
            ) : activeTab === "bukti-bayar" ? (
              <>
                {/* ID Billing Input */}
                <div className="mb-6">
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bukti Bayar</h3>
                    <p className="text-sm text-gray-600 mb-3">ID Billing</p>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Masukkan ID Billing (contoh: BPR-2024-001)"
                        value={billingId}
                        onChange={(e) => setBillingId(e.target.value)}
                        className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {billingId && (
                        <button
                          onClick={() => setBillingId("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Type Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pembayaran</label>
                  <div className="flex flex-wrap gap-3">
                    {paymentTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedPaymentType(selectedPaymentType === type.value ? "" : type.value)}
                        className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                          selectedPaymentType === type.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handlePaymentSearch}
                    disabled={!hasPaymentFilters || isSearchingPayment}
                    className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2 ${
                      hasPaymentFilters && !isSearchingPayment
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    title={!hasPaymentFilters ? "Masukkan ID Billing atau pilih jenis pembayaran" : ""}
                  >
                    {isSearchingPayment ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Mencari...
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Cari Bukti Pembayaran
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isSearchingPayment}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset
                  </button>
                </div>

                {/* Error Message Display */}
                {paymentSearchError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
                  >
                    <AlertCircle size={20} />
                    <span>{paymentSearchError}</span>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
                  <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="text-orange-600" size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bukti Bayar</h3>
                  <p className="text-gray-600 mb-4">Fitur download bukti pembayaran</p>
                  <span className="inline-block bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full font-medium">
                    Segera Hadir
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default QuickServices
