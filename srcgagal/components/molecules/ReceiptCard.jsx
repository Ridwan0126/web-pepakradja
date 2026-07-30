"use client"

import { Calendar, DollarSign, FileText, Download, Eye } from "lucide-react"
import Card from "../atoms/Card"
import Badge from "../atoms/Badge"
import Button from "../atoms/Button"

export default function ReceiptCard({ receipt, onDownload, onViewDetail }) {
  if (!receipt) return null

  return (
    <Card>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Receipt Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                <FileText className="text-white" size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{receipt.objectName}</h3>
                <p className="text-gray-600">{receipt.payerName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>No: {receipt.receiptNumber}</span>
              <Badge variant="success">{receipt.status}</Badge>
            </div>
          </div>

          {/* Payment Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar size={16} />
              <span>{receipt.paymentDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign size={16} className="text-green-600" />
              <span className="text-xl font-bold text-green-600">Rp {receipt.amount.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="info" onClick={() => onViewDetail && onViewDetail(receipt)} icon={<Eye size={18} />}>
              Detail
            </Button>
            <Button variant="success" onClick={() => onDownload && onDownload(receipt)} icon={<Download size={18} />}>
              Download
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
