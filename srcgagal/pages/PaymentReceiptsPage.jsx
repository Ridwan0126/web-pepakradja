"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import { useLocation } from "react-router-dom"
import Heading from "../components/atoms/Heading"
import SearchBar from "../components/molecules/SearchBar"
import FilterGroup from "../components/molecules/FilterGroup"
import ReceiptCard from "../components/molecules/ReceiptCard"
import ReceiptDetailModal from "../components/molecules/ReceiptDetailModal"
import Card from "../components/atoms/Card"
import { mockReceipts } from "../data/mockData"
import { generateOfficialReceiptPDF } from "../utils/pdfGenerator"

export default function PaymentReceiptsPage() {
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Parse URL parameters on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const search = params.get("search")

    if (search) setSearchTerm(search)
  }, [location.search])

  const types = [...new Set(mockReceipts.map((receipt) => receipt.type))]
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]

  const filteredReceipts = useMemo(() => {
    return mockReceipts.filter((receipt) => {
      const matchesSearch =
        receipt.objectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.payerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = !selectedType || receipt.type === selectedType

      let matchesMonth = true
      if (selectedMonth) {
        const monthMap = {
          Januari: "01",
          Februari: "02",
          Maret: "03",
          April: "04",
          Mei: "05",
          Juni: "06",
          Juli: "07",
          Agustus: "08",
          September: "09",
          Oktober: "10",
          November: "11",
          Desember: "12",
        }
        matchesMonth = monthMap[selectedMonth] === receipt.paymentDate.split("-")[1]
      }

      return matchesSearch && matchesType && matchesMonth
    })
  }, [searchTerm, selectedType, selectedMonth])

  const handleViewDetail = (receipt) => {
    setSelectedReceipt(receipt)
    setIsModalOpen(true)
  }

  const handleDownload = (receipt) => {
    generateOfficialReceiptPDF(receipt)
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedType("")
    setSelectedMonth("")
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  return (
    <div className="page-container">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center section-spacing"
      >
        <Heading level={1}>Bukti Pembayaran</Heading>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-4">
          Download bukti pembayaran retribusi daerah Anda dengan mudah
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="content-spacing"
      >
        <div className="glass-effect rounded-3xl p-8 shadow-xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Pencarian Bukti Pembayaran</label>
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari berdasarkan nama, obyek, atau nomor bukti..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Filter & Kategori</label>
              <FilterGroup
                typeOptions={types}
                selectedType={selectedType}
                onTypeChange={(e) => setSelectedType(e.target.value)}
                locationOptions={[]}
                selectedLocation=""
                onLocationChange={() => {}}
                monthOptions={months}
                selectedMonth={selectedMonth}
                onMonthChange={(e) => setSelectedMonth(e.target.value)}
                onReset={resetFilters}
                showMonthFilter={true}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="content-spacing"
      >
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 font-medium">
            Menampilkan <span className="font-bold text-blue-600">{filteredReceipts.length}</span> dari{" "}
            <span className="font-bold">{mockReceipts.length}</span> bukti pembayaran
          </p>
          {filteredReceipts.length > 0 && (
            <div className="text-sm text-gray-500">Diurutkan berdasarkan tanggal terbaru</div>
          )}
        </div>
      </motion.div>

      {/* Receipts List */}
      {filteredReceipts.length > 0 ? (
        <div className="space-y-4">
          {filteredReceipts.map((receipt, index) => (
            <motion.div
              key={receipt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ReceiptCard receipt={receipt} onDownload={handleDownload} onViewDetail={handleViewDetail} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={48} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Tidak Ada Bukti Pembayaran</h3>
          <p className="text-gray-600">Coba ubah kata kunci atau filter pencarian Anda</p>
        </motion.div>
      )}

      {/* Payment Summary */}
      {filteredReceipts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <Card className="p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ringkasan Pembayaran</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">{filteredReceipts.length}</div>
                <p className="text-gray-600 font-medium">Total Transaksi</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  Rp {filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0).toLocaleString("id-ID")}
                </div>
                <p className="text-gray-600 font-medium">Total Pembayaran</p>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl">
                <div className="text-3xl font-bold text-cyan-600 mb-2">
                  {filteredReceipts.filter((r) => r.status === "Lunas").length}
                </div>
                <p className="text-gray-600 font-medium">Pembayaran Lunas</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Receipt Detail Modal */}
      <ReceiptDetailModal
        receipt={selectedReceipt}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  )
}
