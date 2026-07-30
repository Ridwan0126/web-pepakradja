"use client"

import { ArrowLeft, Printer, Download } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import dataService from "../services/dataService"

const PABDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = () => {
      const decodedId = decodeURIComponent(id)
      console.log("Fetching PAB receipt with ID:", decodedId)
      const result = dataService.getPaymentReceiptById(decodedId)
      if (result.success && result.data.type === "PAB") {
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
      filename: `TBP-PAB-${receipt.id}.pdf`,
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
          <p className="text-gray-600">Memuat bukti pembayaran PAB...</p>
        </div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Bukti pembayaran PAB tidak ditemukan untuk ID: {decodeURIComponent(id)}</p>
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
            margin: 0.4in;
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
                    Detail Bukti Pembayaran PAB
                  </h1>
                  <span className="px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide bg-purple-100 text-purple-800 border border-purple-200 self-start">
                    PAB
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
                {/* PAGE 1 - TANDA BUKTI PEMBAYARAN */}
                <div className="print-page">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-shrink-0">
                      <img src="/images/logo-jateng-official.png" alt="Logo Jawa Tengah" className="w-20 h-20" />
                    </div>
                    <div className="flex-1 text-center ml-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">PEMERINTAH PROVINSI JAWA TENGAH</h2>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        BADAN PENGELOLA PENDAPATAN DAERAH PROVINSI JAWA TENGAH
                      </h3>
                      <h4 className="text-base font-semibold text-gray-800 mb-1">{receipt.uppd}</h4>
                      <p className="text-sm text-gray-600">{receipt.alamatUppd}</p>
                    </div>
                  </div>

                  <div className="border-t-2 border-black mb-1"></div>
                  <div className="border-t border-black mb-6"></div>

                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">TANDA BUKTI PEMBAYARAN PAJAK ALAT BERAT</h4>
                    <p className="text-sm">{receipt.id}</p>
                  </div>

                  <div className="mb-6 text-sm space-y-2">
                    <p className="font-semibold mb-3">Telah Terima Dari :</p>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">1.</div>
                      <div className="col-span-4">Nama Wajib Pajak</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-6 font-semibold">{receipt.payerName}</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">2.</div>
                      <div className="col-span-4">NPWPD</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-6">{receipt.npwpd || ""}</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">3.</div>
                      <div className="col-span-4">Alamat</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-6">{receipt.address}</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">4.</div>
                      <div className="col-span-4">Nomor/Tanggal Ketetapan</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-6">terlampir</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">5.</div>
                      <div className="col-span-4">Jumlah Uang</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-6 font-semibold">Rp. {formatCurrency(receipt.amount)}</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1"></div>
                      <div className="col-span-4">Terbilang</div>
                      <div className="col-span-1">:</div>
                      <div className="col-span-6 font-semibold">{receipt.amountInWords}</div>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">6.</div>
                      <div className="col-span-11">Untuk membayar Pajak Alat Berat Provinsi Jawa Tengah</div>
                    </div>
                    <div className="ml-6 space-y-1">
                      <p>Merk: {receipt.equipmentDetails?.merk}</p>
                      <p>Jenis: {receipt.equipmentDetails?.jenis}</p>
                      <p>Tipe: {receipt.equipmentDetails?.tipe}</p>
                      <p>Tahun Buat : {receipt.equipmentDetails?.tahunBuat}</p>
                      <p>No. Seri Alat Berat: {receipt.equipmentDetails?.noSeriAlat}</p>
                      <p>No. Registrasi Alat Berat: {receipt.equipmentDetails?.noRegistrasi}</p>
                      <p>NOPD: {receipt.equipmentDetails?.nopd}</p>
                    </div>
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-1">7.</div>
                      <div className="col-span-4">Foto Unit</div>
                      <div className="col-span-7">: {receipt.equipmentDetails?.fotoUnit}</div>
                    </div>
                  </div>

                  <div className="signature-section">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                      <div>
                        <p className="font-semibold mb-2">Catatan :</p>
                        {receipt.catatan?.map((note, index) => (
                          <p key={index} className="mb-2">
                            {index + 1}. {note}
                          </p>
                        ))}
                      </div>
                      <div className="flex justify-end">
                        <div className="text-center min-w-[250px]">
                          <p className="text-sm mb-1">
                            {receipt.location.replace("KABUPATEN ", "")}, {formatDate(receipt.date)}
                          </p>
                          <p className="text-sm mb-1">Petugas Penerima</p>
                          <p className="text-sm font-semibold mb-4">BENDAHARA PENERIMAAN PEMBANTU</p>
                          <p className="text-sm font-semibold mb-12">{receipt.uppd}</p>
                          <div className="border-b border-black w-full mb-4"></div>
                          <div className="text-center">
                            <p className="text-sm font-semibold">{receipt.bendahara?.nama}</p>
                            <p className="text-sm">NIP. {receipt.bendahara?.nip}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">
                      dicetak oleh : SUPERADMIN pada: {formatDate(receipt.date)}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">Sistem Informasi Pajak Alat Berat Provinsi Jawa Tengah</p>
                    <p className="text-xs text-gray-600">Halaman 1 dari 2</p>
                  </div>
                </div>

                {/* PAGE 2 - LAMPIRAN */}
                <div className="print-page">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-shrink-0">
                      <img src="/images/logo-jateng-official.png" alt="Logo Jawa Tengah" className="w-20 h-20" />
                    </div>
                    <div className="flex-1 text-center ml-4">
                      <h2 className="text-xl font-bold text-gray-900 mb-1">LAMPIRAN TBP {receipt.id}</h2>
                      <p className="text-sm text-gray-600 mb-1">
                        No. Reg Alat Berat : {receipt.equipmentDetails?.noRegistrasi} / {receipt.equipmentDetails?.nopd}{" "}
                        / {receipt.equipmentDetails?.noSeriAlat}
                      </p>
                      <p className="text-sm text-gray-600">Tanggal Pembayaran : {formatDate(receipt.date)}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-base font-bold text-gray-900 mb-4">Rincian Pembayaran :</h4>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold mb-2">I. Pokok Pajak Alat Berat</h5>
                      <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
                        <thead>
                          <tr>
                            <th className="border border-gray-400 px-3 py-2 text-left">Masa Pajak</th>
                            <th className="border border-gray-400 px-3 py-2 text-left">SKPD</th>
                            <th className="border border-gray-400 px-3 py-2 text-right">Jumlah</th>
                          </tr>
                          <tr>
                            <th className="border border-gray-400 px-3 py-2 text-left"></th>
                            <th className="border border-gray-400 px-3 py-2 text-left">Nomor</th>
                            <th className="border border-gray-400 px-3 py-2 text-left">Tanggal</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">{receipt.taxPeriod}</td>
                            <td className="border border-gray-400 px-3 py-2">{receipt.skpdNumber}</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">
                              Rp. {formatCurrency(receipt.amount)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2"></td>
                            <td className="border border-gray-400 px-3 py-2">{formatDate(receipt.skpdDate)}</td>
                            <td className="border border-gray-400 px-3 py-2"></td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 font-semibold" colSpan="2">
                              JUMLAH
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-right font-semibold">
                              Rp. {formatCurrency(receipt.amount)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold mb-2">II. Denda Pajak</h5>
                      <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">Masa Pajak</td>
                            <td className="border border-gray-400 px-3 py-2">Terlambat Daftar</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">Jumlah</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">{receipt.taxPeriod}</td>
                            <td className="border border-gray-400 px-3 py-2">-</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">Rp. 0</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 font-semibold" colSpan="2">
                              JUMLAH
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-right font-semibold">Rp. 0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mb-4">
                      <h5 className="text-sm font-semibold mb-2">III. Pembebasan / Keringanan</h5>
                      <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">Masa Pajak</td>
                            <td className="border border-gray-400 px-3 py-2">TBP</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">Pembebasan/Keringanan</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2"></td>
                            <td className="border border-gray-400 px-3 py-2">Nomor</td>
                            <td className="border border-gray-400 px-3 py-2">Tanggal</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">{receipt.taxPeriod}</td>
                            <td className="border border-gray-400 px-3 py-2">-</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">Rp. 0</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 font-semibold" colSpan="2">
                              JUMLAH
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-right font-semibold">Rp. 0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="mb-6">
                      <h5 className="text-sm font-semibold mb-2">IV. Jumlah Dibayar</h5>
                      <table className="w-full border-collapse border border-gray-400 text-sm">
                        <tbody>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">I. Pokok Pajak</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">
                              Rp. {formatCurrency(receipt.amount)}
                            </td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">II. Denda Pajak</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">Rp. 0</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2">III. Pembebasan / Keringanan</td>
                            <td className="border border-gray-400 px-3 py-2 text-right">Rp. 0</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-400 px-3 py-2 font-bold">
                              Jumlah Dibayar ( I + II ) - III
                            </td>
                            <td className="border border-gray-400 px-3 py-2 text-right font-bold">
                              Rp. {formatCurrency(receipt.amount)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="signature-section">
                    <div className="flex justify-end">
                      <div className="text-center min-w-[250px]">
                        <p className="text-sm mb-1">
                          {receipt.location.replace("KABUPATEN ", "")}, {formatDate(receipt.date)}
                        </p>
                        <p className="text-sm mb-1">Petugas Penerima</p>
                        <p className="text-sm font-semibold mb-4">BENDAHARA PENERIMAAN PEMBANTU</p>
                        <p className="text-sm font-semibold mb-12">{receipt.uppd}</p>
                        <div className="border-b border-black w-full mb-4"></div>
                        <div className="text-center">
                          <p className="text-sm font-semibold">{receipt.bendahara?.nama}</p>
                          <p className="text-sm">NIP. {receipt.bendahara?.nip}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 pt-4 text-center">
                    <p className="text-xs text-gray-600 mb-1">
                      dicetak oleh : SUPERADMIN pada: {formatDate(receipt.date)}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">Sistem Informasi Pajak Alat Berat Provinsi Jawa Tengah</p>
                    <p className="text-xs text-gray-600">Halaman 2 dari 2</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PABDetailPage
