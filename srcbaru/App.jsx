import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LupaPasswordPage from './pages/LupaPasswordPage'
import SetPasswordPage from './pages/SetPasswordPage'
import ObyekDetailPage from './pages/ObyekDetailPage'
import SKRDPage from './pages/SKRDPage'
import PembayaranPage from './pages/PembayaranPage'
import ScanQRPage from './pages/ScanQRPage'
import KeranjangPage from './pages/KeranjangPage'
import RiwayatPage from './pages/RiwayatPage'
import ProfilPage from './pages/ProfilPage'
import BantuanPage from './pages/BantuanPage'
import TentangPage from './pages/TentangPage'
import NotifikasiPage from './pages/NotifikasiPage'
import PengaturanPage from './pages/PengaturanPage'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lupa-password" element={<LupaPasswordPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/obyek/:id" element={<ObyekDetailPage />} />
        <Route path="/skrd" element={<SKRDPage />} />
        <Route path="/pembayaran" element={<PembayaranPage />} />
        <Route path="/scan-qr" element={<ScanQRPage />} />
        <Route path="/keranjang" element={<KeranjangPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/profil" element={<ProfilPage />} />
        <Route path="/bantuan" element={<BantuanPage />} />
        <Route path="/tentang" element={<TentangPage />} />
        <Route path="/notifikasi" element={<NotifikasiPage />} />
        <Route path="/pengaturan" element={<PengaturanPage />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
