"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Users, Settings, Phone, LogOut } from "lucide-react"
import firebaseService from "../services/firebaseService"
import Swal from "sweetalert2"

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData || !firebaseService.isSessionValid()) {
      navigate("/admin")
      return
    }

    const user = JSON.parse(userData)
    setCurrentUser(user)
    setIsLoading(false)
  }, [navigate])

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
    })

    if (result.isConfirmed) {
      firebaseService.logout()
      localStorage.removeItem("currentUser")

      Swal.fire({
        icon: "success",
        title: "Berhasil Logout",
        text: "Anda telah berhasil keluar dari sistem",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        navigate("/admin")
      })
    }
  }

  if (isLoading) {
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
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">
              Selamat datang, {currentUser?.name} ({currentUser?.role})
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contact Management */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/admin/contacts")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Phone className="text-blue-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Informasi Kontak</h3>
                <p className="text-gray-600 text-sm">Kelola kontak organisasi</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Tambah, edit, dan hapus informasi kontak untuk setiap OPD/UPPD</p>
          </motion.div>

          {/* User Management - Admin Only */}
          {currentUser?.role === "admin" && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/admin/users")}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Manajemen User</h3>
                  <p className="text-gray-600 text-sm">Kelola akun pengguna</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Tambah, edit, dan hapus akun pengguna sistem</p>
            </motion.div>
          )}

          {/* Settings - Admin Only */}
          {currentUser?.role === "admin" && (
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate("/admin/settings")}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Settings className="text-purple-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pengaturan Aplikasi</h3>
                  <p className="text-gray-600 text-sm">Kelola tampilan aplikasi</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm">Atur logo, gambar, dan pengaturan tampilan aplikasi</p>
            </motion.div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Statistik Cepat</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Kontak</p>
                  <p className="text-2xl font-bold text-gray-900">-</p>
                </div>
                <Phone className="text-blue-600" size={32} />
              </div>
            </div>

            {currentUser?.role === "admin" && (
              <>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Total User</p>
                      <p className="text-2xl font-bold text-gray-900">-</p>
                    </div>
                    <Users className="text-green-600" size={32} />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Pengaturan</p>
                      <p className="text-2xl font-bold text-gray-900">Aktif</p>
                    </div>
                    <Settings className="text-purple-600" size={32} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
