"use client";

import { motion } from "framer-motion";
import { MapPin, Save } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getKelompokPemilih, saveKelompokPemilih } from "../utils/firestore";

export default function SetWilayah() {
  const [kelompokPemilih, setKelompokPemilih] = useState("RW");

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedKelompok = await getKelompokPemilih();
        setKelompokPemilih(savedKelompok);
      } catch (error) {
        console.error("Error loading kelompok:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memuat kelompok pemilih dari Firestore",
          confirmButtonColor: "#ef4444",
        });
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveKelompokPemilih(kelompokPemilih);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: `Kelompok pemilih berhasil diatur menjadi ${kelompokPemilih}`,
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      console.error("Error saving kelompok:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menyimpan kelompok pemilih: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const kelompokOptions = ["TPS", "RT", "RW", "Desa", "Lurah"];

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10 flex-shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
              Set Wilayah Pemilih
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Tentukan kelompok wilayah pemilihan
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-4 sm:p-6 md:p-8 border border-[var(--color-border)]"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="block text-base sm:text-lg font-semibold text-[var(--color-text-primary)]">
              Pilihlah Kelompok Pemilih
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {kelompokOptions.map((option) => (
                <label
                  key={option}
                  className={`relative flex items-center justify-center p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                    kelompokPemilih === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="kelompok"
                    value={option}
                    checked={kelompokPemilih === option}
                    onChange={(e) => setKelompokPemilih(e.target.value)}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div
                      className={`text-lg sm:text-xl font-bold ${
                        kelompokPemilih === option
                          ? "text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      {option}
                    </div>
                  </div>
                  {kelompokPemilih === option && (
                    <motion.div
                      layoutId="radio"
                      className="absolute inset-0 border-2 border-blue-500 rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all touch-manipulation"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            Simpan Pengaturan
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-blue-500/10 rounded-xl p-4 sm:p-6 border border-blue-500/20"
      >
        <h3 className="font-semibold text-sm sm:text-base text-[var(--color-text-primary)] mb-2">
          Informasi
        </h3>
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Kelompok pemilih yang dipilih akan digunakan sebagai basis untuk
          membuat wilayah pemilihan. Contoh: jika memilih RW, maka wilayah
          pemilihan akan berupa RW-01, RW-02, dst.
        </p>
      </motion.div>
    </div>
  );
}
