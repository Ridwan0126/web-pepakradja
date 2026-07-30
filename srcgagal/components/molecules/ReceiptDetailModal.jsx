"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { X, Calendar, DollarSign, CreditCard, User, FileText, Download } from "lucide-react"
import Button from "../atoms/Button"
import Card from "../atoms/Card"
import Badge from "../atoms/Badge"
import { generateOfficialReceiptPDF } from "../../utils/pdfGenerator"

export default function ReceiptDetailModal({ receipt, isOpen, onClose, onDownload }) {
  // Hide navbar when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      const navbar = document.querySelector(".navbar-container")
      if (navbar) {
        navbar.style.display = "none"
      }
    } else {
      document.body.style.overflow = "unset"
      const navbar = document.querySelector(".navbar-container")
      if (navbar) {
        navbar.style.display = "block"
      }
    }

    return () => {
      document.body.style.overflow = "unset"
      const navbar = document.querySelector(".navbar-container")
      if (navbar) {
        navbar.style.display = "block"
      }
    }
  }, [isOpen])

  if (!isOpen || !receipt) return null

  const handleDownloadPDF = () => {
    generateOfficialReceiptPDF(receipt)
    if (onDownload) onDownload(receipt)
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4"
      style={{ zIndex: 999999 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
        style={{ zIndex: 1000000 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl flex items-center justify-between p-6 border-b border-gray-200 z-10">
          <h2 className="text-2xl font-bold text-gray-800">Detail Bukti Pembayaran</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Receipt Header */}
          <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <FileText className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{receipt.receiptNumber}</h3>
                  <p className="text-gray-600">Bukti Pembayaran Retribusi</p>
                </div>
              </div>
              <Badge variant="success">{receipt.status}</Badge>
            </div>
          </Card>

          {/* Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <User className="mr-2" size={18} />
                Informasi Pembayar
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Nama:</span>
                  <p className="font-medium">{receipt.payerName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Obyek:</span>
                  <p className="font-medium">{receipt.objectName}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tipe:</span>
                  <p className="font-medium">{receipt.type}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Calendar className="mr-2" size={18} />
                Informasi Tanggal
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Tanggal Jatuh Tempo:</span>
                  <p className="font-medium">{receipt.dueDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tanggal Pembayaran:</span>
                  <p className="font-medium">{receipt.paymentDate}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tanggal Lunas:</span>
                  <p className="font-medium">{receipt.paidDate}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Details */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <DollarSign className="mr-2" size={18} />
              Rincian Pembayaran
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Jumlah Retribusi:</span>
                <span className="font-medium">Rp {receipt.amount.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin:</span>
                <span className="font-medium">Rp {receipt.adminFee.toLocaleString("id-ID")}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Pembayaran:</span>
                  <span className="text-green-600">
                    Rp {(receipt.amount + receipt.adminFee).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
              <CreditCard className="mr-2" size={18} />
              Metode Pembayaran
            </h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Metode:</span>
                <p className="font-medium">{receipt.paymentMethod}</p>
              </div>
              <div>
                <span className="text-gray-600">Bank/Provider:</span>
                <p className="font-medium">{receipt.bankName}</p>
              </div>
              <div>
                <span className="text-gray-600">No. Rekening/HP:</span>
                <p className="font-medium">{receipt.accountNumber}</p>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card className="p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Deskripsi</h4>
            <p className="text-gray-600">{receipt.description}</p>
          </Card>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white rounded-b-3xl flex justify-end space-x-4 p-6 border-t border-gray-200">
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="success" onClick={handleDownloadPDF} icon={<Download size={18} />}>
            Download PDF
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
