"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import firebaseService from "../services/firebaseService"
import { Plus, Edit, Eye, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import Swal from "sweetalert2"

const AdminContactListPage = () => {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [allOPDUPPD, setAllOPDUPPD] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (userData) {
      setCurrentUser(JSON.parse(userData))
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [contactsResult, opdUppdData] = await Promise.all([
        firebaseService.getAllContacts(),
        Promise.resolve(firebaseService.getAllOPDUPPD()),
      ])

      const contactsData = contactsResult?.success
        ? contactsResult.data || []
        : Array.isArray(contactsResult)
          ? contactsResult
          : []
      const opdData = Array.isArray(opdUppdData) ? opdUppdData : []

      setContacts(contactsData)
      setAllOPDUPPD(opdData)
    } catch (error) {
      console.error("Error loading data:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data kontak",
      })
      setContacts([])
      setAllOPDUPPD([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Apakah Anda yakin ingin menghapus kontak ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    })

    if (result.isConfirmed) {
      try {
        const deleteResult = await firebaseService.deleteContact(id)
        if (deleteResult?.success) {
          setContacts(contacts.filter((c) => c.id !== id))
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Kontak berhasil dihapus",
          })
        } else {
          throw new Error("Gagal menghapus kontak")
        }
      } catch (error) {
        console.error("Error deleting contact:", error)
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus kontak",
        })
      }
    }
  }

  const filteredData = Array.isArray(allOPDUPPD)
    ? allOPDUPPD.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number.parseInt(value))
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Kontak</h1>
              <p className="text-gray-600">Kelola kontak OPD/UPPD</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Kembali ke Dashboard
              </button>
              <button
                onClick={() => navigate("/admin/contacts/add")}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Tambah Kontak
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari OPD/UPPD..."
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

          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredData.length)} dari {filteredData.length} data
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Tipe</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status Kontak</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data OPD/UPPD"}
                    </td>
                  </tr>
                ) : (
                  currentData.map((item) => {
                    const hasContact = Array.isArray(contacts) ? contacts.find((c) => c.id === item.id) : null
                    return (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.id}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              item.type === "OPD" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              hasContact ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {hasContact ? "Ada Kontak" : "Belum Ada Kontak"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/admin/contacts/view/${item.id}`)}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                              title="Lihat"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => navigate(`/admin/contacts/edit/${item.id}`)}
                              className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            {hasContact && currentUser?.role === "admin" && (
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                title="Hapus"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

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
  )
}

export default AdminContactListPage
