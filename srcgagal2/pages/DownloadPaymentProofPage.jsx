"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Search, AlertCircle, Loader2 } from "lucide-react"
import dataService from "../services/dataService"

const DownloadPaymentProofPage = () => {
  const navigate = useNavigate()
  const [billingId, setBillingId] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState("")

  const paymentTypes = [
    { value: "retribusi", label: "Retribusi" },
    { value: "pap", label: "PAP" },
    { value: "pab", label: "PAB" },
  ]

  const handleSearch = async () => {
    if (!billingId.trim()) {
      setSearchError("Masukkan ID Billing")
      return
    }

    if (!selectedType) {
      setSearchError("Pilih jenis pembayaran")
      return
    }

    setIsSearching(true)
    setSearchError("")

    try {
      // Simulate API search delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const receipts = dataService.getPaymentReceipts()
      if (receipts.success) {
        const foundReceipt = receipts.data.find(
          (receipt) =>
            receipt.id.toLowerCase().includes(billingId.toLowerCase()) &&
            receipt.type.toLowerCase() === selectedType.toLowerCase(),
        )

        if (foundReceipt) {
          const encodedId = encodeURIComponent(foundReceipt.id)
          const routeMap = {
            retribusi: `/unduh-bukti-bayar/retribusi/${encodedId}`,
            pap: `/unduh-bukti-bayar/pap/${encodedId}`,
            pab: `/unduh-bukti-bayar/pab/${encodedId}`,
          }

          const route = routeMap[selectedType]
          if (route) {
            navigate(route)
          }
        } else {
          setSearchError("Data tidak ditemukan. Periksa kembali ID Billing dan jenis pembayaran.")
        }
      }
    } catch (error) {
      setSearchError("Terjadi kesalahan saat mencari data. Silakan coba lagi.")
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Pencarian Bukti Pembayaran</h1>
          <p className="text-gray-600">Masukkan ID Billing dan pilih jenis pembayaran untuk mencari bukti pembayaran</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-6"
        >
          {/* Billing ID Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">ID Billing</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Masukkan ID Billing (contoh: BPR-2024-001)"
                value={billingId}
                onChange={(e) => setBillingId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSearching}
              />
            </div>
          </div>

          {/* Payment Type Filter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Pembayaran</label>
            <div className="flex flex-wrap gap-3">
              {paymentTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(selectedType === type.value ? "" : type.value)}
                  disabled={isSearching}
                  className={`px-6 py-3 rounded-lg border transition-colors font-medium ${
                    selectedType === type.value
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } ${isSearching ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isSearching || !billingId.trim() || !selectedType}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSearching ? (
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

          {/* Error Message */}
          {searchError && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
            >
              <AlertCircle size={20} />
              <span>{searchError}</span>
            </motion.div>
          )}
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-blue-50 rounded-xl p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Petunjuk Pencarian</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Masukkan ID Billing yang tertera pada bukti pembayaran Anda</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Pilih jenis pembayaran: Retribusi, PAP (Pajak Air Permukaan), atau PAB (Pajak Alat Berat)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Klik tombol "Cari Bukti Pembayaran" atau tekan Enter untuk mencari</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Jika data ditemukan, Anda akan langsung diarahkan ke halaman detail bukti pembayaran</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}

export default DownloadPaymentProofPage
