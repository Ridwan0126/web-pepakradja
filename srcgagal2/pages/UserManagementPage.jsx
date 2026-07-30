"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Edit, Trash2, Eye, EyeOff, Search, ChevronLeft, ChevronRight } from "lucide-react"
import firebaseService from "../services/firebaseService"
import SplashScreen from "../components/SplashScreen"
import Swal from "sweetalert2"

const UserManagementPage = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showPassword, setShowPassword] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  // User form state
  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    name: "",
    opdUppdName: "",
  })

  const validateUserEmail = (value) => {
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
    if (user.role !== "admin") {
      navigate("/admin/dashboard")
      return
    }

    setCurrentUser(user)
    loadUsers()
  }, [navigate])

  useEffect(() => {
    // Filter users based on search term
    const filtered = users.filter(
      (user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.opdUppdName.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
    setCurrentPage(1)
  }, [users, searchTerm])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const result = await firebaseService.getAllUsers()
      if (result.success) {
        setUsers(result.data || [])
      }
    } catch (error) {
      console.error("Error loading users:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data user",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveUser = async () => {
    const result = await Swal.fire({
      title: editingUser ? "Konfirmasi Update User" : "Konfirmasi Tambah User",
      text: editingUser ? `Update data user ${userForm.username}?` : `Tambah user baru ${userForm.username}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: editingUser ? "Ya, Update!" : "Ya, Tambah!",
      cancelButtonText: "Batal",
    })

    if (!result.isConfirmed) return

    if (!validateUserEmail(userForm.email)) {
      Swal.fire({
        icon: "error",
        title: "Format Email Salah",
        text: "Email harus menggunakan format yang valid",
      })
      return
    }

    try {
      let saveResult
      if (editingUser) {
        saveResult = await firebaseService.updateUser(editingUser, userForm)
      } else {
        saveResult = await firebaseService.createUser(userForm)
      }

      if (saveResult.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: editingUser ? "User berhasil diupdate" : "User berhasil ditambahkan",
        })
        setEditingUser(null)
        setUserForm({
          username: "",
          email: "",
          password: "",
          role: "user",
          name: "",
          opdUppdName: "",
        })
        loadUsers()
      } else {
        throw new Error(saveResult.error || "Gagal menyimpan user")
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Gagal menyimpan user: ${error.message}`,
      })
    }
  }

  const handleDeleteUser = async (username, name) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus User",
      text: `Apakah Anda yakin ingin menghapus user ${name} (${username})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    })

    if (result.isConfirmed) {
      try {
        const deleteResult = await firebaseService.deleteUser(username)
        if (deleteResult.success) {
          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "User berhasil dihapus",
          })
          loadUsers()
        } else {
          throw new Error("Gagal menghapus user")
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Gagal menghapus user",
        })
      }
    }
  }

  const handleEditUser = (user) => {
    setEditingUser(user.username)
    setUserForm({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      name: user.name,
      opdUppdName: user.opdUppdName,
    })
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

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
            <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
            <p className="text-gray-600">Kelola akun pengguna sistem</p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>

        {/* User Form */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">{editingUser ? "Edit User" : "Tambah User Baru"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={userForm.username}
                onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={editingUser}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={editingUser ? "Kosongkan jika tidak ingin mengubah password" : "Masukkan password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
              <input
                type="text"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OPD/UPPD</label>
              <input
                type="text"
                value={userForm.opdUppdName}
                onChange={(e) => setUserForm({ ...userForm, opdUppdName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveUser}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingUser ? "Update User" : "Tambah User"}
            </button>
            {editingUser && (
              <button
                onClick={() => {
                  setEditingUser(null)
                  setUserForm({
                    username: "",
                    email: "",
                    password: "",
                    role: "user",
                    name: "",
                    opdUppdName: "",
                  })
                }}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari user..."
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

        {/* User List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Daftar User</h2>
              <div className="text-sm text-gray-600">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} dari {filteredUsers.length} data
              </div>
            </div>

            {currentUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? "Tidak ada user yang sesuai dengan pencarian" : "Belum ada data user"}
              </div>
            ) : (
              <div className="space-y-4">
                {currentUsers.map((user) => (
                  <div key={user.username} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{user.name}</h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.role === "admin" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Username:</span> {user.username}
                          </div>
                          <div>
                            <span className="font-medium">Email:</span> {user.email}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">OPD/UPPD:</span> {user.opdUppdName || "Tidak tersedia"}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.username, user.name)}
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

export default UserManagementPage
