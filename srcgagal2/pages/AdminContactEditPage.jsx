"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Save, Mail, Phone, MessageCircle } from "lucide-react"
import firebaseService from "../services/firebaseService"
import Swal from "sweetalert2"

const AdminContactEditPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [contact, setContact] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const isAddMode = !id || id === "add"
  const isViewMode = window.location.pathname.includes("/view/")

  const [whatsappError, setWhatsappError] = useState("")
  const [emailError, setEmailError] = useState("")

  const [contactForm, setContactForm] = useState({
    apiIdOpd: "",
    apiIdUppd: "",
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    type: "OPD",
    opdUppdId: "",
    opdUppdName: "",
  })

  useEffect(() => {
    if (!firebaseService.isSessionValid()) {
      navigate("/admin")
      return
    }

    if (isAddMode) {
      setIsLoading(false)
    } else {
      loadContact()
    }
  }, [id, navigate, isAddMode])

  const loadContact = async () => {
    setIsLoading(true)
    try {
      const result = await firebaseService.getContactInfo(id)
      if (result.success) {
        setContact(result.data)
        setContactForm({
          apiIdOpd: result.data.apiIdOpd || "",
          apiIdUppd: result.data.apiIdUppd || "",
          name: result.data.name || "",
          email: result.data.email || "",
          phone: result.data.phone || "",
          whatsapp: result.data.whatsapp || "",
          type: result.data.type || "OPD",
          opdUppdId: result.data.opdUppdId || "",
          opdUppdName: result.data.opdUppdName || "",
        })
      } else {
        await Swal.fire({
          icon: "error",
          title: "Contact Tidak Ditemukan",
          text: "Data kontak tidak dapat ditemukan",
          confirmButtonColor: "#3b82f6",
        })
      }
    } catch (error) {
      console.error("Error loading contact:", error)
      await Swal.fire({
        icon: "error",
        title: "Error Loading Contact",
        text: "Terjadi kesalahan saat memuat data kontak",
        confirmButtonColor: "#3b82f6",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const validateWhatsApp = (value) => {
    if (!value) {
      setWhatsappError("")
      return true
    }

    const trimmedValue = value.trim()

    // Cek awalan yang dilarang
    if (trimmedValue.startsWith("0") || trimmedValue.startsWith("62") || trimmedValue.startsWith("+62")) {
      setWhatsappError("DITOLAK! Tidak boleh awalan 0, 62, atau +62")
      return false
    }

    // Harus dimulai dengan 8
    if (!trimmedValue.startsWith("8")) {
      setWhatsappError("DITOLAK! Nomor harus dimulai dengan angka 8")
      return false
    }

    // Hanya boleh angka
    if (!/^\d+$/.test(trimmedValue)) {
      setWhatsappError("DITOLAK! Hanya boleh berisi angka")
      return false
    }

    // Panjang harus 9-13 digit
    if (trimmedValue.length < 9 || trimmedValue.length > 13) {
      setWhatsappError("DITOLAK! Panjang harus 9-13 digit")
      return false
    }

    setWhatsappError("")
    return true
  }

  const validateEmail = (value) => {
    if (!value) {
      setEmailError("")
      return true
    }

    const trimmedValue = value.trim()
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!emailRegex.test(trimmedValue)) {
      setEmailError("DITOLAK! Format email salah - harus ada @domain.com")
      return false
    }

    setEmailError("")
    return true
  }

  const handleWhatsAppChange = (e) => {
    const value = e.target.value

    // Blokir karakter terlarang di awal
    if (value.length === 1 && (value === "0" || value === "6" || value === "+")) {
      setWhatsappError("DITOLAK! Tidak boleh awalan 0, 62, atau +62")
      return
    }

    // Blokir jika dimulai dengan 62
    if (value.length === 2 && value === "62") {
      setWhatsappError("DITOLAK! Tidak boleh awalan 62")
      return
    }

    // Hanya izinkan angka
    if (value && !/^\d*$/.test(value)) {
      setWhatsappError("DITOLAK! Hanya boleh berisi angka")
      return
    }

    setContactForm({ ...contactForm, whatsapp: value })
    validateWhatsApp(value)
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setContactForm({ ...contactForm, email: value })
    validateEmail(value)
  }

  const handleWhatsAppKeyDown = (e) => {
    const value = e.target.value
    const key = e.key

    // Blokir karakter terlarang di awal
    if (value.length === 0 && (key === "0" || key === "6" || key === "+")) {
      e.preventDefault()
      setWhatsappError("DITOLAK! Tidak boleh awalan 0, 62, atau +62")
      return
    }

    // Blokir jika akan membentuk "62"
    if (value === "6" && key === "2") {
      e.preventDefault()
      setWhatsappError("DITOLAK! Tidak boleh awalan 62")
      return
    }

    // Hanya izinkan angka dan tombol navigasi
    if (!/\d/.test(key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(key)) {
      e.preventDefault()
    }
  }

  const handleWhatsAppPaste = (e) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")

    if (pastedText.startsWith("0") || pastedText.startsWith("62") || pastedText.startsWith("+62")) {
      setWhatsappError("DITOLAK! Tidak boleh paste nomor dengan awalan 0, 62, atau +62")
      return
    }

    if (!/^\d+$/.test(pastedText)) {
      setWhatsappError("DITOLAK! Hanya boleh berisi angka")
      return
    }

    setContactForm({ ...contactForm, whatsapp: pastedText })
    validateWhatsApp(pastedText)
  }

  const handleSave = async () => {
    const email = contactForm.email?.trim()
    const whatsapp = contactForm.whatsapp?.trim()

    console.log("[v0] Pre-save validation - Email:", email, "WhatsApp:", whatsapp)

    if (isAddMode) {
      if (!contactForm.name.trim()) {
        await Swal.fire({
          icon: "error",
          title: "Data Tidak Lengkap",
          text: "Nama organisasi harus diisi",
          confirmButtonColor: "#ef4444",
        })
        return
      }

      if (!contactForm.apiIdOpd.trim()) {
        await Swal.fire({
          icon: "error",
          title: "Data Tidak Lengkap",
          text: "API ID OPD harus diisi",
          confirmButtonColor: "#ef4444",
        })
        return
      }
    }

    // VALIDASI EMAIL - WAJIB FORMAT BENAR
    if (email && !validateEmail(email)) {
      await Swal.fire({
        icon: "error",
        title: "Format Email Salah!",
        text: "Email harus menggunakan format yang benar dengan @domain.com",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    // VALIDASI WHATSAPP - TIDAK BOLEH AWALAN 0, 62, +62
    if (whatsapp && !validateWhatsApp(whatsapp)) {
      await Swal.fire({
        icon: "error",
        title: "Format WhatsApp Salah!",
        text: "WhatsApp tidak boleh menggunakan awalan 0, 62, atau +62. Contoh yang benar: 895330823300",
        confirmButtonColor: "#ef4444",
      })
      return
    }

    const result = await Swal.fire({
      title: isAddMode ? "Simpan Data Kontak?" : "Simpan Perubahan?",
      text: isAddMode
        ? "Apakah Anda yakin ingin menyimpan data kontak baru ini?"
        : "Apakah Anda yakin ingin menyimpan perubahan data kontak ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    })

    if (!result.isConfirmed) return

    setIsSaving(true)

    try {
      let saveResult

      if (isAddMode) {
        const contactData = {
          apiIdOpd: contactForm.apiIdOpd,
          apiIdUppd: contactForm.apiIdUppd || "",
          name: contactForm.name,
          email: contactForm.email || "",
          phone: contactForm.phone || "",
          whatsapp: contactForm.whatsapp || "",
          type: contactForm.type,
          id: contactForm.apiIdOpd,
          opdUppdId: contactForm.apiIdOpd,
          opdUppdName: contactForm.name,
          whatsappUrl: contactForm.whatsapp ? `https://wa.me/62${contactForm.whatsapp}` : "",
          updatedAt: new Date().toISOString(),
        }

        saveResult = await firebaseService.saveContact(contactData)
      } else {
        saveResult = await firebaseService.saveContactInfo(id, {
          ...contactForm,
          whatsappUrl: firebaseService.formatWhatsAppUrl(contactForm.whatsapp),
        })
      }

      if (saveResult.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: isAddMode ? "Data kontak berhasil ditambahkan" : "Data kontak berhasil diperbarui",
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
        })
        navigate("/admin/contacts")
      } else {
        await Swal.fire({
          icon: "error",
          title: "Gagal Menyimpan",
          text: "Terjadi kesalahan saat menyimpan data kontak",
          confirmButtonColor: "#ef4444",
        })
      }
    } catch (error) {
      console.error("Error saving contact:", error)
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan data kontak",
        confirmButtonColor: "#ef4444",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = async () => {
    const result = await Swal.fire({
      title: "Batalkan Perubahan?",
      text: "Perubahan yang belum disimpan akan hilang",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Batalkan",
      cancelButtonText: "Lanjut Edit",
    })

    if (result.isConfirmed) {
      navigate("/admin/contacts")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact...</p>
        </div>
      </div>
    )
  }

  const isFormValid = !whatsappError && !emailError

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/admin/contacts")}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isAddMode ? "Tambah Kontak" : isViewMode ? "Lihat Kontak" : "Edit Contact"}
            </h1>
            <p className="text-gray-600">{isAddMode ? "Tambah data kontak baru" : contact?.name}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={handleEmailChange}
                  disabled={isViewMode}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 ${
                    emailError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="email@example.com"
                />
              </div>
              {emailError && <p className="text-red-600 text-sm mt-1 font-medium">{emailError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  disabled={isViewMode}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="08123456789"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (tanpa 0 atau +62)</label>
              <div className="relative">
                <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={contactForm.whatsapp}
                  onChange={handleWhatsAppChange}
                  onKeyDown={handleWhatsAppKeyDown}
                  onPaste={handleWhatsAppPaste}
                  disabled={isViewMode}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-100 ${
                    whatsappError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="8123456789"
                />
              </div>
              {whatsappError && <p className="text-red-600 text-sm mt-1 font-medium">{whatsappError}</p>}
              <p className="text-xs text-gray-500 mt-1">Akan menjadi: https://wa.me/62{contactForm.whatsapp}</p>
            </div>

            {!isViewMode && (
              <div className="md:col-span-2 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !isFormValid}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={20} />
                  {isSaving ? "Menyimpan..." : isAddMode ? "Simpan Kontak" : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminContactEditPage
