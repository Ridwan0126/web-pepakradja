"use client";

import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";
import { resetAllData } from "../utils/firestore";

export default function ResetData() {
  const [resetType, setResetType] = useState("all");

  const handleReset = async () => {
    let title = "";
    let text = "";
    let resetTypeValue = "";

    if (resetType === "all") {
      title = "Reset Seluruh Data?";
      text = "Semua data akan dihapus dan tidak dapat dikembalikan!";
      resetTypeValue = "all";
    } else if (resetType === "pemilih") {
      title = "Reset Data Pemilih?";
      text = "Data pemilih dan hasil pemilihan akan dihapus!";
      resetTypeValue = "pemilih";
    } else if (resetType === "hasil") {
      title = "Reset Hasil Pemilihan?";
      text = "Hanya data hasil pemilihan yang akan dihapus!";
      resetTypeValue = "hasil";
    }

    const result = await Swal.fire({
      title,
      text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Reset!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await resetAllData(resetTypeValue);

        // If resetting all, also logout
        if (resetTypeValue === "all") {
          window.location.href = "/login";
        }

        Swal.fire({
          icon: "success",
          title: "Reset Berhasil!",
          text: "Data telah direset sesuai pilihan Anda",
          confirmButtonColor: "#10b981",
        });
      } catch (error) {
        console.error("Error resetting data:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal mereset data: " + error.message,
          confirmButtonColor: "#ef4444",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Trash2 className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Reset Data
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Hapus data sesuai kebutuhan Anda
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
      >
        <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-800">Peringatan!</p>
            <p className="text-sm text-yellow-700">
              Data yang sudah dihapus tidak dapat dikembalikan. Pastikan Anda
              telah membackup data penting sebelum melakukan reset.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
            Pilih Jenis Reset
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-4 border-2 border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all">
              <input
                type="radio"
                name="resetType"
                value="all"
                checked={resetType === "all"}
                onChange={(e) => setResetType(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Seluruh Data / All
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Hapus semua data termasuk pengaturan, calon, wilayah, pemilih,
                  hasil, dan pengguna
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border-2 border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all">
              <input
                type="radio"
                name="resetType"
                value="pemilih"
                checked={resetType === "pemilih"}
                onChange={(e) => setResetType(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Data Pemilih
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Hapus data pemilih dan otomatis menghapus hasil pemilihan
                  (online & offline)
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 border-2 border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all">
              <input
                type="radio"
                name="resetType"
                value="hasil"
                checked={resetType === "hasil"}
                onChange={(e) => setResetType(e.target.value)}
                className="mt-1"
              />
              <div>
                <p className="font-semibold text-[var(--color-text-primary)]">
                  Hasil Pemilihan
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Hapus hanya data hasil pemilihan (online & offline), data
                  pemilih tetap ada
                </p>
              </div>
            </label>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleReset}
            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
          >
            <Trash2 className="w-5 h-5" />
            Reset Data
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <h3 className="font-semibold text-blue-900 mb-3">Catatan Penting:</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Reset "Seluruh Data" akan menghapus SEMUA data dan Anda akan
              logout otomatis
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Reset "Data Pemilih" akan menghapus data pemilih dan hasil
              pemilihan secara otomatis
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>
              Reset "Hasil Pemilihan" hanya menghapus data voting, data pemilih
              tetap tersimpan
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 font-bold">•</span>
            <span>Lakukan backup data penting sebelum melakukan reset</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}
