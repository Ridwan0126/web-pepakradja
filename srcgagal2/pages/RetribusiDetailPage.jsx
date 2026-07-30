"use client"

import { ArrowLeft, Printer, Download } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import dataService from "../services/dataService"

const RetribusiDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = () => {
      const decodedId = decodeURIComponent(id)
      console.log("Fetching RETRIBUSI receipt with ID:", decodedId)
      const result = dataService.getPaymentReceiptById(decodedId)
      if (result.success && result.data.type === "RETRIBUSI") {
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
      filename: `Bukti-Pembayaran-Retribusi-${receipt.id}.pdf`,
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
          <p className="text-gray-600">Memuat bukti pembayaran...</p>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Bukti pembayaran retribusi tidak ditemukan untuk ID: {decodeURIComponent(id)}
          </p>
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
                    Detail Bukti Pembayaran Retribusi
                  </h1>
                  <span className="px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide bg-green-100 text-green-800 border border-green-200 self-start">
                    RETRIBUSI
                  </span>
                </div>
                <p className="text-sm sm:text-base text-gray-600 mt-1 truncate">No: {receipt.id}</p>
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

          <div className="relative">
            <div
              id="receipt-content"
              className="bg-white shadow-xl rounded-lg overflow-hidden print-content"
              style={{
                transformOrigin: "top left",
                minHeight: "297mm", // A4 height
                width: "100%",
                maxWidth: "210mm", // A4 width
                margin: "0 auto",
                position: "relative",
                overflow: "auto",
                border: "1px solid #e5e7eb",
              }}
            >
              <div className="p-4 sm:p-6 lg:p-8 overflow-x-auto">
                <div className="watermark">PENAK BUSITI JANE</div>

                <div className="flex items-start justify-between mb-6">
                  <div className="flex-shrink-0">
                    <img src="/images/logo-jateng-official.png" alt="Logo Jawa Tengah" className="w-20 h-20" />
                  </div>
                  <div className="flex-1 text-center ml-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-1">PEMERINTAH PROVINSI JAWA TENGAH</h2>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">SEKRETARIAT DAERAH</h3>
                    <p className="text-sm text-gray-600 mb-1">
                      Jalan Pahlawan No. 9 Semarang Kode Pos 50243 Telepon 024-8311173 (20 saluran)
                    </p>
                    <p className="text-sm text-gray-600 mb-1">Faksimile 024-8311266 Laman http://jatengprov.go.id</p>
                    <p className="text-sm text-gray-600">Surat Elektronik setda@jatengprov.go.id</p>
                  </div>
                </div>

                <div className="border-t-2 border-black mb-1"></div>
                <div className="border-t border-black mb-6"></div>

                <div className="grid grid-cols-2 gap-8 mb-6 text-sm">
                  <div>
                    <p className="mb-1">Nomor: {receipt.receiptNumber}</p>
                    <p className="mb-1">Sifat: Resmi</p>
                    <p className="mb-1">Lampiran: -</p>
                    <p>Hal: Bukti Pembayaran Retribusi Daerah</p>
                  </div>
                  <div className="text-right">
                    <p className="mb-4">Semarang, {formatDate(receipt.date)}</p>
                    <div>
                      <p className="mb-1">Kepada</p>
                      <p className="mb-1">Yth. {receipt.payerName}</p>
                      <p className="mb-1">di -</p>
                      <p>TEMPAT</p>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <h4 className="text-lg font-bold text-gray-900 underline">BUKTI PEMBAYARAN RETRIBUSI DAERAH</h4>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-700 mb-4">
                    Dengan ini kami sampaikan bahwa telah diterima pembayaran retribusi daerah dari Saudara dengan
                    rincian sebagai berikut:
                  </p>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full border-collapse border border-gray-400 text-sm">
                      <thead>
                        <tr>
                          <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">No.</th>
                          <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">Uraian</th>
                          <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">
                            Keterangan
                          </th>
                          <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">
                            Jumlah (Rp)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-400 px-3 py-2">1.</td>
                          <td className="border border-gray-400 px-3 py-2">Nama Pembayar</td>
                          <td className="border border-gray-400 px-3 py-2">{receipt.payerName}</td>
                          <td className="border border-gray-400 px-3 py-2 text-right">-</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-3 py-2">2.</td>
                          <td className="border border-gray-400 px-3 py-2">Obyek Retribusi</td>
                          <td className="border border-gray-400 px-3 py-2">{receipt.objectName}</td>
                          <td className="border border-gray-400 px-3 py-2 text-right">-</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-3 py-2">3.</td>
                          <td className="border border-gray-400 px-3 py-2">Jenis Obyek</td>
                          <td className="border border-gray-400 px-3 py-2">Aula</td>
                          <td className="border border-gray-400 px-3 py-2 text-right">-</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-3 py-2">4.</td>
                          <td className="border border-gray-400 px-3 py-2">Tanggal Pembayaran</td>
                          <td className="border border-gray-400 px-3 py-2">{formatDate(receipt.date)}</td>
                          <td className="border border-gray-400 px-3 py-2 text-right">-</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-3 py-2">5.</td>
                          <td className="border border-gray-400 px-3 py-2">Jumlah Retribusi</td>
                          <td className="border border-gray-400 px-3 py-2">Sewa aula untuk acara seminar nasional</td>
                          <td className="border border-gray-400 px-3 py-2 text-right">
                            {formatCurrency(receipt.amount)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-3 py-2">6.</td>
                          <td className="border border-gray-400 px-3 py-2">Biaya Administrasi</td>
                          <td className="border border-gray-400 px-3 py-2">Biaya admin sistem</td>
                          <td className="border border-gray-400 px-3 py-2 text-right">
                            {formatCurrency(receipt.adminFee)}
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 px-3 py-2 font-semibold" colSpan="3">
                            JUMLAH TOTAL
                          </td>
                          <td className="border border-gray-400 px-3 py-2 text-right font-bold">
                            {formatCurrency(receipt.totalAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">
                    Pembayaran dilakukan melalui {receipt.paymentMethod} dengan nomor {receipt.accountNumber} dan telah
                    dinyatakan <strong>LUNAS</strong>.
                  </p>

                  <p className="text-sm text-gray-700 mb-6">
                    Demikian bukti pembayaran ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
                  </p>
                </div>

                <div className="signature-section mb-6">
                  <div className="flex justify-between items-start gap-8">
                    <div className="flex-1 text-center">
                      <p className="text-sm mb-1">Mengetahui,</p>
                      <p className="text-sm font-semibold mb-16">Kepala Bidang Retribusi Daerah</p>
                      <div className="border-b border-black w-48 mb-4 mx-auto"></div>
                      <div className="text-center">
                        <p className="text-sm font-semibold">Drs. Ahmad Wijaya, M.Si</p>
                        <p className="text-sm">NIP. 196505121990031002</p>
                      </div>
                    </div>
                    <div className="flex-1 text-center">
                      <p className="text-sm mb-1">Semarang, {formatDate(receipt.date)}</p>
                      <p className="text-sm font-semibold mb-16">Petugas Verifikasi</p>
                      <div className="border-b border-black w-48 mb-4 mx-auto"></div>
                      <div className="text-center">
                        <p className="text-sm font-semibold">Sri Wahyuni, S.E</p>
                        <p className="text-sm">NIP. 197803152005012001</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-300 pt-4 text-center">
                  <p className="text-xs text-gray-600 mb-1">
                    Dokumen ini dicetak secara otomatis oleh Sistem Penak Busiti
                  </p>
                  <p className="text-xs text-gray-600 mb-1">
                    Untuk verifikasi keaslian dokumen, silakan kunjungi: www.penakbusiti.go.id/verify dengan kode:{" "}
                    {receipt.verificationCode || receipt.id}
                  </p>
                  <p className="text-xs text-gray-600">
                    © 2025 Pemerintah Provinsi Jawa Tengah. Semua hak dilindungi undang-undang.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RetribusiDetailPage
