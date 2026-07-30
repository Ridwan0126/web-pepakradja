"use client";

import { motion } from "framer-motion";
import { Lock, User, Eye, EyeOff, Vote } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getUserByUsername, seedInitialUsers } from "../utils/firestore";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFirebaseLogin = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal!",
        text: "Username harus diisi",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!password.trim()) {
      Swal.fire({
        icon: "error",
        title: "Login Gagal!",
        text: "Password harus diisi",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setLoading(true);

    try {
      const userFromDb = await getUserByUsername(username.trim());

      if (!userFromDb) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal!",
          text: "Username tidak ditemukan",
          confirmButtonColor: "#ef4444",
        });
        setLoading(false);
        return;
      }

      if (userFromDb.password !== password) {
        Swal.fire({
          icon: "error",
          title: "Login Gagal!",
          text: "Password salah",
          confirmButtonColor: "#ef4444",
        });
        setLoading(false);
        return;
      }

      const userData = {
        id: userFromDb.id,
        namaPanitia: userFromDb.namaPanitia,
        namaAkun: userFromDb.namaAkun,
        level: userFromDb.level,
        wilayah: userFromDb.wilayah || "",
        nomorHP: userFromDb.nomorHP || "",
        role: userFromDb.role,
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));
      localStorage.setItem("userRole", userFromDb.role);

      console.log("[v0] Login successful - User data saved:", userData);

      Swal.fire({
        icon: "success",
        title: "Login Berhasil!",
        text: `Selamat datang ${userFromDb.namaPanitia}`,
        confirmButtonColor: "#3b82f6",
        timer: 1500,
        didClose: () => {
          navigate("/dashboard");
        },
      });
    } catch (error) {
      console.error("Firebase login error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Terjadi kesalahan saat login",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedUsers = async () => {
    setSeedLoading(true);
    try {
      const result = await seedInitialUsers();
      Swal.fire({
        icon: "success",
        title: "Seed Data Berhasil!",
        html: `
          <div class="text-left">
            <p>Total User Dibuat: <strong>${result.success}</strong></p>
            <p>Total User Gagal: <strong>${result.failed}</strong></p>
            ${
              result.errors.length > 0
                ? `
              <p class="mt-3 text-sm text-red-600">Errors:</p>
              <ul class="text-xs text-red-600">
                ${result.errors
                  .map((e) => `<li>${e.username}: ${e.error}</li>`)
                  .join("")}
              </ul>
            `
                : ""
            }
          </div>
        `,
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      console.error("Seed error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal seed data user",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setSeedLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Vote className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">SIPOLINEe</h1>
            <p className="text-blue-100">Sistem Pemungutan Suara Elektronik</p>
          </div>

          {/* Form */}
          <form onSubmit={handleFirebaseLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Login"}
            </motion.button>

            {/* <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleSeedUsers}
              disabled={seedLoading}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {seedLoading ? "Seeding..." : "📤 Seed Initial Users ke Firebase"}
            </motion.button> */}

            {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 font-semibold mb-2">
                Akun Default:
              </p>
              <div className="space-y-1 text-xs text-gray-500">
                <p>
                  Ketua Panitia:{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    admin / admin123
                  </span>
                </p>
                <p>
                  Koordinator:{" "}
                  <span className="font-mono bg-white px-2 py-1 rounded">
                    koordinator / koord123
                  </span>
                </p>
              </div>
            </div> */}
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-gray-500">
              Sistem SIPOLINEe v1.0 &copy; 2025
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Klik tombol hijau di atas untuk membuat data user ke Firestore
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
