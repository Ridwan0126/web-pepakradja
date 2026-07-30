"use client"

import { ArrowLeft, Printer, Download } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import dataService from "../services/dataService"

const PAPDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = () => {
      const decodedId = decodeURIComponent(id)
      console.log("Fetching PAP receipt with ID:", decodedId)
      const result = dataService.getPaymentReceiptById(decodedId)
      if (result.success && result.data.type === "PAP") {
        setReceipt(result.data)
      } else {
        console.error("Receipt not found or wrong type:", result)
      }
      setLoading(false)
    }
    fetchReceipt()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    const element = document.getElementById("receipt-content")
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: `TBP-PAP-${receipt.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      },
      jsPDF: {
        unit: "in",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    }

    const html2pdf = (await import("html2pdf.js")).default
    html2pdf().set(opt).from(element).save()
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat bukti pembayaran PAP...</p>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Bukti pembayaran PAP tidak ditemukan untuk ID: {decodeURIComponent(id)}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            color: black !important;
            font-family: 'Times New Roman', serif !important;
          }
          
          body * {
            visibility: hidden !important;
          }
          
          #receipt-content,
          #receipt-content * {
            visibility: visible !important;
          }
          
          #receipt-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            color: black !important;
            font-size: 10px !important;
            line-height: 1.3 !important;
            padding: 15px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          @page {
            margin: 0.3in;
            size: A4;
            background: white;
          }
          
          .print-page {
            min-height: 95vh !important;
            page-break-after: always !important;
            break-after: page !important;
            position: relative !important;
            padding-bottom: 40px !important;
          }
          
          .print-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
            min-height: auto !important;
          }
          
          .signature-section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-top: 40px !important;
            padding-top: 50px !important;
            min-height: 140px !important;
          }
          
          .signature-grid {
            display: flex !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            gap: 2rem !important;
          }
          
          .signature-grid > div {
            flex: 1 !important;
            text-align: center !important;
          }
          
          table, th, td {
            border: 1px solid black !important;
            border-collapse: collapse !important;
          }
          
          .border-b {
            border-bottom: 1px solid black !important;
          }
          
          .border-t-2 {
            border-top: 2px solid black !important;
          }
          
          .border-t {
            border-top: 1px solid black !important;
          }
          
          .watermark {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) rotate(-45deg) !important;
            opacity: 0.1 !important;
            z-index: -1 !important;
            font-size: 48px !important;
            font-weight: bold !important;
            color: #666 !important;
            pointer-events: none !important;
          }
        }
      `}</style>

      {/* ... existing code continues unchanged ... */}
      <div className="min-h-screen bg-gray-50 pt-24 no-print">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8 gap-4 no-print">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors shadow-sm flex-shrink-0"
              >
                <ArrowLeft size={20} className="sm:w-6 sm:h-6 text-gray-600" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                    Detail Bukti Pembayaran PAP
                  </h1>
                  <span className="px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide bg-blue-100 text-blue-800 border border-blue-200 self-start">
                    PAP
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">No TBP: {receipt.id}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base flex-1 sm:flex-none"
              >
                <Printer size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg text-sm sm:text-base flex-1 sm:flex-none"
              >
                <Download size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>

          {/* ... existing code continues unchanged ... */}
        </div>
      </div>
    </>
  )
}

export default PAPDetailPage
