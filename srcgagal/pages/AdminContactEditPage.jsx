"use client"

import { useMemo, useState } from "react"
import { saveContactInfo } from "../services/firebaseService"
import { opdList } from "../data/mockData.jsx"

// Catatan:
// - Halaman ini contoh yang "tahan-gagal": mewajibkan ID sebelum simpan.
// - Jika Anda sudah punya halaman AdminContactEditPage sendiri, ambil bagian handleSave & validasinya saja.

export default function AdminContactEditPage() {
  // Tipe target: 'opd' atau 'uppd'
  const [type, setType] = useState("opd")
  // Entity ID yang WAJIB ada saat menyimpan
  const [entityId, setEntityId] = useState("")
  // Optional: pilih by nama OPD (supaya user tidak harus hafal ID)
  const [selectedOpdId, setSelectedOpdId] = useState("")
  const [email, setEmail] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Saat user memilih nama OPD dari dropdown, kita otomatis set entityId = id OPD tersebut
  const opdOptions = useMemo(() => opdList.map((o) => ({ value: o.id, label: o.nama })), [])

  async function handleSave(e) {
    e?.preventDefault?.()
    setMessage("")

    // Sumber ID:
    // - Jika type = 'opd' dan user memilih dari dropdown -> pakai selectedOpdId
    // - Jika user mengetik manual di kolom ID -> pakai entityId (prioritas manual)
    const finalId = (entityId && String(entityId).trim()) || (type === "opd" ? selectedOpdId : "")

    console.log("[v0] Pre-save validation - Email:", email, "WhatsApp:", whatsapp, "Type:", type, "FinalId:", finalId)

    if (!finalId) {
      setMessage("Gagal menyimpan: Anda harus memilih/mengetik ID OPD/UPPD terlebih dahulu.")
      return
    }

    try {
      setSaving(true)
      await saveContactInfo({
        entityId: finalId,
        type,
        email,
        whatsapp,
      })
      setMessage("Kontak berhasil disimpan.")
    } catch (err) {
      console.error("[v0] Save contact error:", err)
      setMessage(err?.message || "Terjadi kesalahan saat menyimpan kontak.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-semibold mb-4">Edit Kontak OPD/UPPD</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="mb-1 font-medium">Tipe Target</span>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value)
                  // Reset pilihan terkait jika tipe berubah
                  setSelectedOpdId("")
                }}
                className="border rounded px-3 py-2"
              >
                <option value="opd">OPD</option>
                <option value="uppd">UPPD</option>
              </select>
            </label>

            {type === "opd" ? (
              <label className="flex flex-col">
                <span className="mb-1 font-medium">Pilih OPD</span>
                <select
                  value={selectedOpdId}
                  onChange={(e) => setSelectedOpdId(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="">— Pilih OPD —</option>
                  {opdOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="text-xs text-gray-500 mt-1">
                  Atau isi ID secara manual di kolom "ID OPD/UPPD" di bawah.
                </span>
              </label>
            ) : (
              <div className="flex items-end text-sm text-gray-600">
                Karena daftar UPPD tidak tersedia di data statis, silakan isi ID UPPD secara manual di kolom berikutnya.
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex flex-col md:col-span-1">
              <span className="mb-1 font-medium">ID OPD/UPPD</span>
              <input
                type="text"
                value={entityId}
                onChange={(e) => setEntityId(e.target.value)}
                placeholder="Contoh: 21 atau UPPD-01"
                className="border rounded px-3 py-2"
              />
              <span className="text-xs text-gray-500 mt-1">
                Wajib terisi (pilih OPD atau isi manual). Nilai ini yang dipakai sebagai ID dokumen di Firebase.
              </span>
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@domain.com"
                className="border rounded px-3 py-2"
              />
            </label>

            <label className="flex flex-col">
              <span className="mb-1 font-medium">WhatsApp</span>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="border rounded px-3 py-2"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded bg-emerald-600 text-white disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan Kontak"}
            </button>
            {message && <span className="text-sm">{message}</span>}
          </div>
        </form>
      </div>
    </main>
  )
}
