"use client"

import { useState, useEffect } from "react"
import { getAllOfflineVotes, getPengaturan } from "../utils/firestore"
import { Download, Search } from "lucide-react"
import html2pdf from "html2pdf.js"

export default function DokumenJurnalOffline() {
  const [votes, setVotes] = useState([])
  const [pengaturan, setPengaturan] = useState({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("*")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [votesData, settingsData] = await Promise.all([getAllOfflineVotes(), getPengaturan()])
      setVotes(votesData || [])
      setPengaturan(settingsData || {})
    } catch (error) {
      console.error("Error loading data:", error)
      setVotes([])
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = () => {
    const element = document.getElementById("jurnal-table")
    const opt = {
      margin: 10,
      filename: `Jurnal-Suara-Offline-${pengaturan?.judulPemilihan || "Pemilihan"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
    }
    html2pdf().set(opt).from(element).save()
  }

  const filteredVotes = votes.filter((v) => {
    const matchSearch =
      v.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.alamat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.nomorTelepon?.includes(searchTerm)
    const matchStatus = selectedStatus === "*" || v.statusSuara === selectedStatus
    return matchSearch && matchStatus
  })

  const statusStats = {
    SAH: votes.filter((v) => v.statusSuara === "SAH").length,
    TIDAK_SAH: votes.filter((v) => v.statusSuara === "TIDAK_SAH").length,
    TOTAL: votes.length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Jurnal Suara Offline</h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            {pengaturan?.judulPemilihan || "Detail Suara Pemilihan Offline"}
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      {pengaturan?.judulPemilihan && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{pengaturan.judulPemilihan}</h2>
          {pengaturan.deskripsi && <p className="text-gray-600 dark:text-gray-400 mt-1">{pengaturan.deskripsi}</p>}
          {pengaturan.periode && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Periode: {pengaturan.periode}</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">Suara Sah</p>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300">{statusStats.SAH}</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">Suara Tidak Sah</p>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">{statusStats.TIDAK_SAH}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Suara</p>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{statusStats.TOTAL}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cari Suara</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, alamat atau no telepon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter Status</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="*">Semua Status</option>
            <option value="SAH">Sah</option>
            <option value="TIDAK_SAH">Tidak Sah</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div id="jurnal-table" className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="p-3 text-left border">No</th>
                <th className="p-3 text-left border">Nama</th>
                <th className="p-3 text-left border">Alamat</th>
                <th className="p-3 text-left border">No Telepon</th>
                <th className="p-3 text-center border">Status Suara</th>
                <th className="p-3 text-left border">Suara</th>
                <th className="p-3 text-left border">Petugas</th>
                <th className="p-3 text-center border">Tanggal / Jam</th>
              </tr>
            </thead>
            <tbody>
              {filteredVotes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-gray-500 dark:text-gray-400">
                    Tidak ada data suara offline
                  </td>
                </tr>
              ) : (
                filteredVotes.map((vote, idx) => (
                  <tr key={vote.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b">
                    <td className="p-3 border text-gray-900 dark:text-white font-medium">{idx + 1}</td>
                    <td className="p-3 border text-gray-900 dark:text-white">{vote.nama || "-"}</td>
                    <td className="p-3 border text-gray-700 dark:text-gray-300">{vote.alamat || "-"}</td>
                    <td className="p-3 border text-gray-700 dark:text-gray-300">{vote.nomorTelepon || "-"}</td>
                    <td className="p-3 border text-center">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          vote.statusSuara === "SAH"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {vote.statusSuara === "SAH" ? "Sah" : "Tidak Sah"}
                      </span>
                    </td>
                    <td className="p-3 border text-gray-900 dark:text-white font-medium">{vote.pilihanCalon || "-"}</td>
                    <td className="p-3 border text-gray-700 dark:text-gray-300">{vote.petugas || "-"}</td>
                    <td className="p-3 border text-center text-gray-700 dark:text-gray-300">
                      {vote.tanggalRekam
                        ? new Date(vote.tanggalRekam).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 text-right">
        Total: <span className="font-bold">{filteredVotes.length}</span> suara
      </p>
    </div>
  )
}
