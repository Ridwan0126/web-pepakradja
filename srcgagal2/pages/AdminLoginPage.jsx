"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, User, Lock, AlertCircle, Loader2 } from "lucide-react"
import firebaseService from "../services/firebaseService"
import SplashScreen from "../components/SplashScreen"

const AdminLoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username || !formData.password) {
      setError("Username dan password harus diisi")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const userResult = await firebaseService.getUser(formData.username)

      if (!userResult.success) {
        setError("Username tidak ditemukan")
        setIsLoading(false)
        return
      }

      const user = userResult.data

      // Check password
      if (user.password !== formData.password) {
        setError("Password salah")
        setIsLoading(false)
        return
      }

      firebaseService.setUserSession({
        username: user.username,
        role: user.role,
        name: user.name,
        opdUppdId: user.opdUppdId,
        opdUppdName: user.opdUppdName,
        type: user.type,
      })

      // Navigate to admin dashboard
      navigate("/admin/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setError("Terjadi kesalahan saat login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInitializeUsers = async () => {
    setIsLoading(true)
    try {
      const result = await firebaseService.initializeDefaultUsers()
      if (result.success) {
        alert("Users initialized successfully!")
      } else {
        alert("Error initializing users: " + result.error)
      }
    } catch (error) {
      alert("Error: " + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="text-blue-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Masuk ke panel administrasi</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username (Nama OPD/UPPD atau "admin")
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Masukkan username"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Masuk...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
          <p className="text-xs text-gray-500">Admin: username "admin", password "admin123"</p>
          <p className="text-xs text-gray-500">User: username sesuai nama OPD/UPPD, password "user123"</p>

          <button
            onClick={handleInitializeUsers}
            disabled={isLoading}
            className="mt-3 w-full text-xs bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Initialize Demo Users (First Time Setup)
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLoginPage
