"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Phone, Mail, MessageCircle, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import firebaseService from "../services/firebaseService"
import SplashScreen from "../components/SplashScreen"
import Swal from "sweetalert2"

const ContactManagementPage = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [whatsappError, setWhatsappError] = useState("")
  const [emailError, setEmailError] = useState("")

  // Contact form state
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

  const [showAddForm, setShowAddForm] = useState(false)

  const validateWhatsApp = (value) => {
    if (!value) return true
    if (value.startsWith("0") || value.startsWith("62") || value.startsWith("+62")) {
      return false
    }
    if (!/^\d+$/.test(value)) {
      return false
    }
    if (!value.startsWith("8")) {
      return false
    }
    if (value.length < 9 || value.length > 13) {
      return false
    }
    return true
  }

  const validateEmail = (value) => {
    if (!value) return true
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(value)
  }

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData || !firebaseService.isSessionValid()) {
      navigate("/admin")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)
    loadContacts()
  }, [navigate])

  useEffect(() => {
    // Filter contacts based on search term
    const filtered = contacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.whatsapp.includes(searchTerm),
    )
    setFilteredContacts(filtered)
    setCurrentPage(1) // Reset to first page when searching
  }, [contacts, searchTerm])

  const loadContacts = async () => {
    setIsLoading(true)
    try {
      const result = await firebaseService.getAllContacts()
      if (result.success) {
        setContacts(result.data || [])
      }
    } catch (error) {
      console.error("Error loading contacts:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data kontak",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveContact = async () => {
    if (!contactForm.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Lengkap",
        text: "Nama organisasi harus diisi",
      })
      return
    }

    if (!contactForm.apiIdOpd.trim()) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Lengkap",
        text: "API ID OPD harus diisi",
      })
      return
    }

    // Validasi email
    if (contactForm.email && !validateEmail(contactForm.email)) {
      Swal.fire({
        icon: "error",
        title: "Format Email Salah",
        text: "Email harus menggunakan format yang valid (contoh: user@gmail.com)",
      })
      return
    }

    // Validasi WhatsApp
    if (contactForm.whatsapp && !validateWhatsApp(contactForm.whatsapp)) {
      Swal.fire({
        icon: "error",
        title: "Format WhatsApp Salah",
        text: "WhatsApp tidak boleh menggunakan awalan 0, 62, atau +62. Contoh yang benar: 895330823300",
      })
      return
    }

    // Konfirmasi sebelum menyimpan
    const confirmResult = await Swal.fire({
      title: "Konfirmasi Simpan",
      text: "Apakah Anda yakin ingin menyimpan data kontak ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    })

    if (!confirmResult.isConfirmed) {
      return
    }

    try {
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

      console.log("[v0] Saving contact data:", contactData)
      const result = await firebaseService.saveContact(contactData)

      if (result.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data kontak berhasil disimpan",
          timer: 2000,
          showConfirmButton: false,
        })

        // Reset form
        setContactForm({
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
        setShowAddForm(false)
        setWhatsappError("")
        setEmailError("")
        await loadContacts()
      } else {
        throw new Error(result.error || "Gagal menyimpan data")
      }
    } catch (error) {
      console.error("[v0] Error saving contact:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Gagal menyimpan data: ${error.message}`,
      })
    }
  }

  const handleDeleteContact = async (contactId, contactName) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus kontak ${contactName}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    })

    if (result.isConfirmed) {
      try {
        const deleteResult = await firebaseService.deleteContact(contactId)
        if (deleteResult.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Kontak berhasil dihapus",
          })
          loadContacts()
        } else {
          throw new Error("Gagal menghapus kontak")
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus kontak",
        })
      }
    }
  }

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentContacts = filteredContacts.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Kontak</h1>
            <p className="text-gray-600">Kelola informasi kontak organisasi</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddForm(!showAddForm)
                if (!showAddForm) {
                  // Reset form saat membuka form tambah
                  setContactForm({
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
                  setWhatsappError("")
                  setEmailError("")
                }
              }}
              className={`px-6 py-2 rounded-lg transition-colors font-medium ${
                showAddForm ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {showAddForm ? "❌ Batal Tambah" : "➕ Tambah Kontak Baru"}
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ⬅️ Kembali ke Dashboard
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-xl shadow-lg mb-6 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">+</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Tambah Kontak Baru</h2>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Form Tambah Data
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API ID OPD <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactForm.apiIdOpd}
                  onChange={(e) => setContactForm({ ...contactForm, apiIdOpd: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: 01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API ID UPPD</label>
                <input
                  type="text"
                  value={contactForm.apiIdUppd}
                  onChange={(e) => setContactForm({ ...contactForm, apiIdUppd: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: 01.11"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Organisasi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Contoh: DINAS PENDIDIKAN DAN KEBUDAYAAN"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => {
                    setContactForm({ ...contactForm, email: e.target.value })
                    setEmailError(validateEmail(e.target.value) ? "" : "Format email tidak valid")
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    emailError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="contoh@gmail.com"
                />
                {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telepon</label>
                <input
                  type="text"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nomor telepon"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp (tanpa 0 atau +62)</label>
                <input
                  type="text"
                  value={contactForm.whatsapp}
                  onKeyDown={(e) => {
                    // Block 0, 6, + at the beginning
                    if (contactForm.whatsapp.length === 0 && (e.key === "0" || e.key === "6" || e.key === "+")) {
                      e.preventDefault()
                      setWhatsappError("WhatsApp tidak boleh dimulai dengan 0, 62, atau +62")
                      return
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value
                    setContactForm({ ...contactForm, whatsapp: value })
                    setWhatsappError(validateWhatsApp(value) ? "" : "Format WhatsApp tidak valid")
                  }}
                  onPaste={(e) => {
                    const pastedText = e.clipboardData.getData("text")
                    if (pastedText.startsWith("0") || pastedText.startsWith("62") || pastedText.startsWith("+62")) {
                      e.preventDefault()
                      setWhatsappError("WhatsApp tidak boleh dimulai dengan 0, 62, atau +62")
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    whatsappError ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="8123456789"
                />
                {whatsappError && <p className="text-red-500 text-sm mt-1">{whatsappError}</p>}
                <p className="text-gray-500 text-sm mt-1">Akan menjadi: https://wa.me/62{contactForm.whatsapp}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
                <select
                  value={contactForm.type}
                  onChange={(e) => setContactForm({ ...contactForm, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="OPD">OPD</option>
                  <option value="UPPD">UPPD</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveContact}
                disabled={whatsappError || emailError}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Simpan Kontak
              </button>
            </div>
          </div>
        )}

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari kontak..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Tampilkan:</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daftar Kontak</h2>
              <div className="text-sm text-gray-600">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredContacts.length)} dari{" "}
                {filteredContacts.length} data
              </div>
            </div>

            {currentContacts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "Tidak ada kontak yang sesuai dengan pencarian" : "Belum ada data kontak"}
              </div>
            ) : (
              <div className="space-y-4">
                {currentContacts.map((contact) => (
                  <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{contact.name}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail size={16} />
                            <span>{contact.email || "Tidak tersedia"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{contact.phone || "Tidak tersedia"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageCircle size={16} />
                            <span>{contact.whatsapp ? `+62${contact.whatsapp}` : "Tidak tersedia"}</span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          ID: {contact.opdUppdId} | Type: {contact.type} | {contact.opdUppdName}
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => navigate(`/admin/contact/edit/${contact.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id, contact.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg ${
                          currentPage === pageNum ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactManagementPage
