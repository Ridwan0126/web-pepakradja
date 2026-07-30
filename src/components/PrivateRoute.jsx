import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  // 1. Tampilkan loading indicator saat AuthContext masih memuat data dari localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  // 2. Jika tidak terssasaautentikasi, arahkan ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 3. Pengecekan role (Pastikan properti role ada pada objek user, 
  // atau ganti user?.role dengan properti lain yang mendefinisikan hak akses)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  // 4. Jika lolos semua validasi, render komponen anak
  return children
}