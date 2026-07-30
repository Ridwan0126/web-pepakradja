import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  // 1. Tampilkan loading saat AuthContext sedang memuat data dari localStorage
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">Loading...</div>
      </div>
    )
  }

  // 2. Jika token tidak ada (belum login), arahkan ke /login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // 3. Pengecekan role (Opsional)
  // Pastikan properti role ada di objek user Anda (misal: user.role atau user.level).
  // Jika backend tidak mengirim role, Anda bisa menghapus blok kode ini.
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  // 4. Jika lolos semua validasi, tampilkan halaman yang dituju
  return children
}