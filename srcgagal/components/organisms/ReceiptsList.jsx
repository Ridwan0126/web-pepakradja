"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import Container from "../atoms/Container"
import ReceiptCard from "../molecules/ReceiptCard"

export default function ReceiptsList({ receipts, onDownload }) {
  return (
    <Container>
      {receipts.length > 0 ? (
        <div className="space-y-6">
          {receipts.map((receipt, index) => (
            <ReceiptCard key={receipt.id} receipt={receipt} onDownload={onDownload} />
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
    </Container>
  )
}
