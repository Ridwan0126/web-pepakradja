"use client"

import { motion } from "framer-motion"
import Container from "../atoms/Container"
import Card from "../atoms/Card"

export default function PaymentSummary({ receipts }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mt-12"
    >
      <Container>
        <Card className="p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Ringkasan Pembayaran</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{receipts.length}</div>
              <p className="text-gray-600">Total Transaksi</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                Rp {receipts.reduce((sum, receipt) => sum + receipt.amount, 0).toLocaleString("id-ID")}
              </div>
              <p className="text-gray-600">Total Pembayaran</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {receipts.filter((r) => r.status === "Lunas").length}
              </div>
              <p className="text-gray-600">Pembayaran Lunas</p>
            </div>
          </div>
        </Card>
      </Container>
    </motion.div>
  )
}
