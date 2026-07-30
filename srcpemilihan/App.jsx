"use client";

import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import PengaturanJudul from "./pages/PengaturanJudul";
import PengaturanCalon from "./pages/PengaturanCalon";
import DataPemilih from "./pages/DataPemilih";
import VotingPage from "./pages/VotingPage";
import HasilPemilihan from "./pages/HasilPemilihan";
import VotingStandalone from "./pages/VotingStandalone";
import SetWilayah from "./pages/SetWilayah";
import BuatWilayah from "./pages/BuatWilayah";
import PengaturanPengguna from "./pages/PengaturanPengguna";
import VerifikasiData from "./pages/VerifikasiData";
import SuaraOffline from "./pages/SuaraOffline";
import LaporanRekap from "./pages/LaporanRekap";
import LaporanJurnal from "./pages/LaporanJurnal";
import ResetData from "./pages/ResetData";
import DokumenPresensi from "./pages/DokumenPresensi";
import DokumenPemilih from "./pages/DokumenPemilih";
import DokumenCalon from "./pages/DokumenCalon";
import DokumenJurnalOffline from "./pages/DokumenJurnalOffline";
import DokumenCalonPemilih from "./pages/DokumenCalonPemilih";
import DokumenDaftarPemilih from "./pages/DokumenDaftarPemilih";
import DokumenPresensiOffline from "./pages/DokumenPresensiOffline";
import DokumenJurnalSuaraOffline from "./pages/DokumenJurnalSuaraOffline";
import LandingPage from "./pages/LandingPage";
import ClosingAdvertisement from "./pages/ClosingAdvertisement";
import { useSessionTimeout } from "./hooks/useSessionTimeout";
import { motion } from "framer-motion";

function AdminLayout() {
  useSessionTimeout();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const navigate = useNavigate();
  const { user, hasAccess } = useAuth();

  useEffect(() => {
    if (currentPage === "dashboard") {
      navigate("/dashboard");
    } else {
      navigate(`/${currentPage}`);
    }
  }, [currentPage, navigate, user, hasAccess]);

  const renderPage = () => {
    if (!hasAccess(currentPage)) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Akses Ditolak
            </h2>
            <p className="text-gray-600">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case "dashboard":
        return <Dashboard setCurrentPage={setCurrentPage} />;
      case "pengaturan-judul":
        return <PengaturanJudul />;
      case "pengaturan-calon":
        return <PengaturanCalon />;
      case "set-wilayah":
        return <SetWilayah />;
      case "buat-wilayah":
        return <BuatWilayah />;
      case "pengaturan-pengguna":
        return <PengaturanPengguna />;
      case "reset-data":
        return <ResetData />;
      case "data-pemilih":
        return <DataPemilih />;
      case "verifikasi-data":
        return <VerifikasiData />;
      case "voting":
        return <VotingPage />;
      case "dokumen-presensi":
        return <DokumenPresensi />;
      case "dokumen-pemilih":
        return <DokumenPemilih />;
      case "dokumen-calon":
        return <DokumenCalon />;
      case "dokumen-jurnal-offline":
        return <DokumenJurnalOffline />;
      case "hasil":
        return <HasilPemilihan />;
      case "suara-offline":
        return <SuaraOffline />;
      case "laporan-rekap":
        return <LaporanRekap />;
      case "laporan-jurnal":
        return <LaporanJurnal />;
      case "dokumen-calon-pemilih":
        return <DokumenCalonPemilih />;
      case "dokumen-daftar-pemilih":
        return <DokumenDaftarPemilih />;
      case "dokumen-presensi-offline":
        return <DokumenPresensiOffline />;
      case "dokumen-jurnal-suara-offline":
        return <DokumenJurnalSuaraOffline />;
      case "closing-ad":
        return <ClosingAdvertisement />;
      default:
        return <Dashboard setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* SIDEBAR FIXED */}
      <Sidebar
        isOpen={sidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* MAIN CONTENT */}
      <motion.div
        animate={{
          paddingLeft: sidebarOpen ? 256 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="flex flex-col h-full"
      >
        <Navbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 overflow-y-auto bg-[var(--color-background)] p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {renderPage()}
        </main>

        <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </motion.div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vote" element={<VotingStandalone />} />
        <Route path="/closing-ad" element={<ClosingAdvertisement />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/:page"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
