"use client"
import { ArrowLeft, Printer, Download } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import dataService from "../services/dataService"

const PaymentReceiptDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReceipt = () => {
      console.log("Fetching receipt with ID:", id)
      const result = dataService.getPaymentReceiptById(id)
      console.log("Fetch result:", result)
      if (result.success) {
        setReceipt(result.data)
        console.log("Receipt data:", result.data)
      } else {
        console.error("Failed to fetch receipt:", result.error)
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
      margin: 0.5,
      filename: `Bukti-Pembayaran-${receipt.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    }

    // Import html2pdf dynamically
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

  const renderReceiptContent = () => {
    if (!receipt) return null

    switch (receipt.type) {
      case "PAP":
        return renderPAPReceipt()
      case "PAB":
        return renderPABReceipt()
      default:
        return renderRetribusiReceipt()
    }
  }

  const renderRetribusiReceipt = () => (
    <>
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
          Dengan ini kami sampaikan bahwa telah diterima pembayaran retribusi daerah dari Saudara dengan rincian sebagai
          berikut:
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">No.</th>
                <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">Uraian</th>
                <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">Keterangan</th>
                <th className="border border-gray-400 px-3 py-2 text-left font-semibold bg-white">Jumlah (Rp)</th>
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
                <td className="border border-gray-400 px-3 py-2 text-right">{formatCurrency(receipt.amount)}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2">6.</td>
                <td className="border border-gray-400 px-3 py-2">Biaya Administrasi</td>
                <td className="border border-gray-400 px-3 py-2">Biaya admin sistem</td>
                <td className="border border-gray-400 px-3 py-2 text-right">{formatCurrency(receipt.adminFee)}</td>
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
          Pembayaran dilakukan melalui {receipt.paymentMethod} dengan nomor {receipt.accountNumber} dan telah dinyatakan{" "}
          <strong>LUNAS</strong>.
        </p>

        <p className="text-sm text-gray-700 mb-6">
          Demikian bukti pembayaran ini dibuat untuk dapat dipergunakan sebagaimana mestinya.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="text-center">
          <p className="text-sm mb-1">Mengetahui,</p>
          <p className="text-sm font-semibold mb-16">Kepala Bidang Retribusi Daerah</p>
          <div className="border-b border-black w-48 mb-2 mx-auto"></div>
          <div className="text-center">
            <p className="text-sm font-semibold">Drs. Ahmad Wijaya, M.Si</p>
            <p className="text-sm">NIP. 196505121990031002</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm mb-1">Semarang, {formatDate(receipt.date)}</p>
          <p className="text-sm font-semibold mb-16">Petugas Verifikasi</p>
          <div className="border-b border-black w-48 mb-2 mx-auto"></div>
          <div className="text-center">
            <p className="text-sm font-semibold">Sri Wahyuni, S.E</p>
            <p className="text-sm">NIP. 197803152005012001</p>
          </div>
        </div>
      </div>
    </>
  )

  const renderPAPReceipt = () => (
    <>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-shrink-0">
          <img src="/images/logo-jateng-official.png" alt="Logo Jawa Tengah" className="w-20 h-20" />
        </div>
        <div className="flex-1 text-center ml-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">PEMERINTAH PROVINSI JAWA TENGAH</h2>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">BADAN PENGELOLA PENDAPATAN DAERAH</h3>
          <h4 className="text-base font-semibold text-gray-800 mb-1">UNIT PENGELOLAAN PENDAPATAN DAERAH ( UPPD )</h4>
          <h4 className="text-base font-semibold text-gray-800 mb-2">{receipt.uppd}</h4>
        </div>
      </div>

      <div className="border-t-2 border-black mb-1"></div>
      <div className="border-t border-black mb-6"></div>

      <div className="text-center mb-6">
        <h4 className="text-lg font-bold text-gray-900 mb-2">TANDA BUKTI PEMBAYARAN (TBP)</h4>
        <h4 className="text-lg font-bold text-gray-900 mb-4">PAJAK AIR PERMUKAAN</h4>
        <p className="text-sm">No TBP : {receipt.id}</p>
      </div>

      <div className="mb-6 text-sm space-y-2">
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">1.</div>
          <div className="col-span-5">Telah diterima dari:</div>
          <div className="col-span-6 font-semibold">{receipt.payerName}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">2.</div>
          <div className="col-span-5">Alamat:</div>
          <div className="col-span-6">{receipt.address}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">3.</div>
          <div className="col-span-5">Nama Perusahaan/Obyek:</div>
          <div className="col-span-6 font-semibold">{receipt.companyName}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">4.</div>
          <div className="col-span-5">Alamat Perusahaan/Obyek:</div>
          <div className="col-span-6">{receipt.companyAddress}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">5.</div>
          <div className="col-span-5">Nomor Kohir / SKPD:</div>
          <div className="col-span-6">{receipt.skpdNumber}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">6.</div>
          <div className="col-span-5">Tanggal SKPD:</div>
          <div className="col-span-6">{formatDate(receipt.skpdDate)}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">7.</div>
          <div className="col-span-5">Masa Pajak:</div>
          <div className="col-span-6">{receipt.taxPeriod}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">8.</div>
          <div className="col-span-5">Jatuh Tempo Pembayaran:</div>
          <div className="col-span-6">{formatDate(receipt.dueDate)}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">9.</div>
          <div className="col-span-5">Tanggal Pembayaran:</div>
          <div className="col-span-6">{formatDate(receipt.date)}</div>
        </div>
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-1">10.</div>
          <div className="col-span-5">Terlambat:</div>
          <div className="col-span-6">{receipt.lateDays}</div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold mb-3">11. Rincian Pembayaran:</p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-400 px-3 py-2 text-center font-semibold bg-white" colSpan="2">
                  Ketetapan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2">1. Pokok Pajak Air Permukaan</td>
                <td className="border border-gray-400 px-3 py-2 text-right">
                  Rp {formatCurrency(receipt.principalTax)}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2">2. Sanksi Terlambat</td>
                <td className="border border-gray-400 px-3 py-2 text-right">Rp {formatCurrency(receipt.penalty)}</td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 font-semibold">I. Jumlah Tagihan</td>
                <td className="border border-gray-400 px-3 py-2 text-right font-semibold">
                  Rp {formatCurrency(receipt.totalBill)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              <tr>
                <th className="border border-gray-400 px-3 py-2 text-center font-semibold bg-white" colSpan="2">
                  Keringanan
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-3 py-2">1. Pokok Pajak Air Permukaan</td>
                <td className="border border-gray-400 px-3 py-2 text-right">
                  Rp {formatCurrency(receipt.exemptionPrincipal)}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2">2. Sanksi Terlambat</td>
                <td className="border border-gray-400 px-3 py-2 text-right">
                  Rp {formatCurrency(receipt.exemptionPenalty)}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 font-semibold">II. Jumlah Keringanan</td>
                <td className="border border-gray-400 px-3 py-2 text-right font-semibold">
                  Rp {formatCurrency(receipt.totalExemption)}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-400 px-3 py-2 font-bold">III. Jumlah Yang Dibayar (I-II)</td>
                <td className="border border-gray-400 px-3 py-2 text-right font-bold">
                  Rp {formatCurrency(receipt.finalAmount)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-12 gap-2 text-sm">
          <div className="col-span-1">12.</div>
          <div className="col-span-5">Terbilang:</div>
          <div className="col-span-6 font-semibold">{receipt.amountInWords}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="text-center">
          <p className="text-sm font-semibold mb-16">Penyetor,</p>
          <p className="text-sm font-semibold mb-2">{receipt.companyName}</p>
          <div className="border-b border-black w-48 mb-2 mx-auto"></div>
          <div className="text-center">
            <p className="text-sm font-semibold">{receipt.payerName}</p>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm mb-1">
            {receipt.location.replace("KABUPATEN ", "")}, {formatDate(receipt.date)}
          </p>
          <p className="text-sm font-semibold mb-16">BENDAHARA PENERIMAAN PEMBANTU</p>
          <div className="border-b border-black w-48 mb-2 mx-auto"></div>
          <div className="text-center">
            <p className="text-sm font-semibold">{receipt.bendahara?.nama}</p>
            <p className="text-sm">NIP. {receipt.bendahara?.nip}</p>
          </div>
        </div>
      </div>
    </>
  )

  const renderPABReceipt = () => (
    <>
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

      <div className="mb-6 text-sm">
        <p className="font-semibold mb-2">Catatan :</p>
        {receipt.catatan?.map((note, index) => (
          <p key={index} className="mb-2">
            {index + 1}. {note}
          </p>
        ))}
      </div>

      <div className="flex justify-end mb-6">
        <div className="text-center">
          <p className="text-sm mb-1">
            {receipt.location.replace("KABUPATEN ", "")}, {formatDate(receipt.date)}
          </p>
          <p className="text-sm mb-1">Petugas Penerima</p>
          <p className="text-sm font-semibold mb-16">BENDAHARA PENERIMAAN PEMBANTU</p>
          <p className="text-sm font-semibold mb-1">{receipt.uppd}</p>
          <div className="border-b border-black w-48 mb-2 mx-auto"></div>
          <div className="text-center">
            <p className="text-sm font-semibold">{receipt.bendahara?.nama}</p>
            <p className="text-sm">NIP. {receipt.bendahara?.nip}</p>
          </div>
        </div>
      </div>
    </>
  )

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
          <p className="text-gray-600 mb-4">Bukti pembayaran tidak ditemukan</p>
          <p className="text-sm text-gray-500 mb-4">ID yang dicari: {id}</p>
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
      <style jsx global>{`
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
          
          /* Hide everything except print content */
          body * {
            visibility: hidden !important;
          }
          
          /* Show only the receipt content */
          #receipt-content,
          #receipt-content * {
            visibility: visible !important;
          }
          
          /* Position the receipt content properly */
          #receipt-content {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            color: black !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
            padding: 20px !important;
            margin: 0 !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          
          @page {
            margin: 0.5in;
            size: A4;
            background: white;
          }
          
          /* Ensure table borders are visible */
          table, th, td {
            border: 1px solid black !important;
            border-collapse: collapse !important;
          }
          
          /* Ensure signature lines are visible */
          .border-b {
            border-bottom: 1px solid black !important;
          }
          
          /* Ensure double lines are visible */
          .border-t-2 {
            border-top: 2px solid black !important;
          }
          
          .border-t {
            border-top: 1px solid black !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gray-50 pt-24 no-print">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header - Hidden during print */}
          <div className="flex items-center justify-between mb-8 no-print">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors shadow-sm"
              >
                <ArrowLeft size={24} className="text-gray-600" />
              </button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">Detail Bukti Pembayaran</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
                      receipt.type === "PAP"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : receipt.type === "PAB"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-green-100 text-green-800 border border-green-200"
                    }`}
                  >
                    {receipt.type}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">No: {receipt.id}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Printer size={20} />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Download size={20} />
                Download PDF
              </button>
            </div>
          </div>

          {/* Receipt Content - Printable area */}
          <div id="receipt-content" className="bg-white shadow-xl rounded-lg p-8 print-content">
            {renderReceiptContent()}

            <div className="border-t border-gray-300 pt-4 text-center">
              <p className="text-xs text-gray-600 mb-1">
                {receipt.type === "PAB"
                  ? `dicetak oleh : SUPERADMIN pada: ${formatDate(receipt.date)}`
                  : "Dokumen ini dicetak secara otomatis oleh Sistem Penak Busiti"}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                {receipt.type === "PAB"
                  ? "Sistem Informasi Pajak Alat Berat Provinsi Jawa Tengah"
                  : `Untuk verifikasi keaslian dokumen, silakan kunjungi: www.penakbusiti.go.id/verify dengan kode: ${receipt.verificationCode || receipt.id}`}
              </p>
              {receipt.type !== "PAB" && (
                <p className="text-xs text-gray-600">
                  © 2025 Pemerintah Provinsi Jawa Tengah. Semua hak dilindungi undang-undang.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PaymentReceiptDetailPage
