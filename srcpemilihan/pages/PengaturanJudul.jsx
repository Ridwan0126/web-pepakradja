"use client";

import { motion } from "framer-motion";
import { Save, FileText, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getPengaturan, savePengaturan } from "../utils/firestore";

export default function PengaturanJudul() {
  const [formData, setFormData] = useState({
    judul1: "",
    judul2: "",
    judul3: "",
    deskripsi: "",
    tanggalMulai: "",
    tanggalSelesai: "",
    tanggalPemungutanSuara: "",
    jamPemungutanSuaraSelesai: "17:00",
    namaKetuaPanitia: "",
    tanggalMulaiSuaraOffline: "",
    tanggalSelesaiSuaraOffline: "",
    pengumuman: "",
  });

  useEffect(() => {
    // Load existing data from Firestore
    const loadData = async () => {
      try {
        const savedData = await getPengaturan();
        if (savedData) {
          setFormData((prevState) => ({
            ...prevState,
            judul1: savedData.judul1 || "",
            judul2: savedData.judul2 || "",
            judul3: savedData.judul3 || "",
            deskripsi: savedData.deskripsi || "",
            tanggalMulai: savedData.tanggalMulai || "",
            tanggalSelesai: savedData.tanggalSelesai || "",
            tanggalPemungutanSuara: savedData.tanggalPemungutanSuara || "",
            jamPemungutanSuaraSelesai:
              savedData.jamPemungutanSuaraSelesai || "17:00",
            namaKetuaPanitia: savedData.namaKetuaPanitia || "",
            tanggalMulaiSuaraOffline: savedData.tanggalMulaiSuaraOffline || "",
            tanggalSelesaiSuaraOffline:
              savedData.tanggalSelesaiSuaraOffline || "",
            pengumuman: savedData.pengumuman || "",
          }));
        }
      } catch (error) {
        console.error("Error loading pengaturan:", error);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSave = {
        ...formData,
        judul: formData.judul1,
        tanggalPencoblosan: formData.tanggalPemungutanSuara,
        jamPencoblosanSelesai: formData.jamPemungutanSuaraSelesai,
      };

      await savePengaturan(dataToSave);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pengaturan berhasil disimpan!",
        confirmButtonColor: "#3b82f6",
      });
    } catch (error) {
      console.error("Error saving pengaturan:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menyimpan pengaturan: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 flex-shrink-0">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
              Pengaturan Judul Pemilihan
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
              Atur informasi dasar pemilihan
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-4 sm:p-6 border border-[var(--color-border)]"
      >
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Judul Pemilihan */}
          <div className="space-y-2">
            <label
              htmlFor="judul1"
              className="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Judul Pemilihan 1
            </label>
            <input
              type="text"
              id="judul1"
              name="judul1"
              value={formData.judul1}
              onChange={handleChange}
              placeholder="Contoh: Pemilihan Kepala Desa 2025"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="judul2"
              className="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Judul Pemilihan 2{" "}
              <span className="text-xs text-gray-500">(opsional)</span>
            </label>
            <input
              type="text"
              id="judul2"
              name="judul2"
              value={formData.judul2}
              onChange={handleChange}
              placeholder="Contoh: Periode 2025-2030"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="judul3"
              className="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Judul Pemilihan 3{" "}
              <span className="text-xs text-gray-500">(opsional)</span>
            </label>
            <input
              type="text"
              id="judul3"
              name="judul3"
              value={formData.judul3}
              onChange={handleChange}
              placeholder="Contoh: Desa Sukamaju"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Deskripsi
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              placeholder="Masukkan deskripsi pemilihan..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
              required
            />
          </div>

          {/* Nama Ketua Panitia */}
          <div className="space-y-2">
            <label
              htmlFor="namaKetuaPanitia"
              className="block text-sm font-medium text-[var(--color-text-primary)]"
            >
              Nama Ketua Panitia <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaKetuaPanitia"
              name="namaKetuaPanitia"
              value={formData.namaKetuaPanitia}
              onChange={handleChange}
              placeholder="Masukkan nama ketua panitia pemilihan"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Akan dicantumkan di laporan dan dokumen pemilu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="tanggalMulai"
                className="block text-sm font-medium text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Mulai Pemilihan (Registrasi)
                </div>
              </label>
              <input
                type="datetime-local"
                id="tanggalMulai"
                name="tanggalMulai"
                value={formData.tanggalMulai}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Pemilih bisa login dan melihat calon, tapi belum bisa memilih
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="tanggalSelesai"
                className="block text-sm font-medium text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal Selesai Pemilihan (Registrasi)
                </div>
              </label>
              <input
                type="datetime-local"
                id="tanggalSelesai"
                name="tanggalSelesai"
                value={formData.tanggalSelesai}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Pemilih tidak bisa login setelah tanggal ini
              </p>
            </div>

            {/* Tanggal & Waktu Mulai Pemungutan Suara */}
            <div className="space-y-2">
              <label
                htmlFor="tanggalPemungutanSuara"
                className="block text-sm font-medium text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Tanggal & Waktu Mulai Pemungutan Suara (Voting)
                </div>
              </label>
              <input
                type="datetime-local"
                id="tanggalPemungutanSuara"
                name="tanggalPemungutanSuara"
                value={formData.tanggalPemungutanSuara}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Hanya hari ini pemilih bisa memilih dari jam ini
              </p>
            </div>

            {/* Jam Selesai Pemungutan Suara */}
            <div className="space-y-2">
              <label
                htmlFor="jamPemungutanSuaraSelesai"
                className="block text-sm font-medium text-[var(--color-text-primary)]"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Jam Selesai Pemungutan Suara
                </div>
              </label>
              <input
                type="time"
                id="jamPemungutanSuaraSelesai"
                name="jamPemungutanSuaraSelesai"
                value={formData.jamPemungutanSuaraSelesai}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Pengumuman */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="pengumuman"
                className="block text-sm font-medium text-[var(--color-text-primary)]"
              >
                Pengumuman{" "}
                <span className="text-xs text-gray-500">(opsional)</span>
              </label>
              <textarea
                id="pengumuman"
                name="pengumuman"
                value={formData.pengumuman}
                onChange={handleChange}
                placeholder="Masukkan pengumuman yang akan ditampilkan kepada pemilih setelah mereka memilih..."
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-500">
                Pengumuman akan ditampilkan di halaman voting setelah pemilih
                melakukan pemilihan
              </p>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 sm:pt-6 mt-4 sm:mt-6">
            <h3 className="text-base sm:text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Waktu Input Suara Offline
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mb-4">
              Tentukan tanggal dan jam mulai serta tanggal dan jam selesai untuk
              input data suara offline. Diluar waktu ini, petugas tidak bisa
              input suara.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="tanggalMulaiSuaraOffline"
                  className="block text-sm font-medium text-[var(--color-text-primary)]"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal & Jam Mulai Input Suara Offline
                  </div>
                </label>
                <input
                  type="datetime-local"
                  id="tanggalMulaiSuaraOffline"
                  name="tanggalMulaiSuaraOffline"
                  value={formData.tanggalMulaiSuaraOffline}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tanggalSelesaiSuaraOffline"
                  className="block text-sm font-medium text-[var(--color-text-primary)]"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Tanggal & Jam Selesai Input Suara Offline
                  </div>
                </label>
                <input
                  type="datetime-local"
                  id="tanggalSelesaiSuaraOffline"
                  name="tanggalSelesaiSuaraOffline"
                  value={formData.tanggalSelesaiSuaraOffline}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium text-sm sm:text-base hover:opacity-90 transition-all touch-manipulation"
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
        <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] leading-relaxed mb-3">
          Pengaturan ini akan menentukan informasi dasar pemilihan yang akan
          ditampilkan kepada pemilih.
        </p>
        <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text-secondary)]">
          <p>
            <strong>Tanggal Mulai - Selesai:</strong> Periode waktu pemilih bisa
            login dan registrasi (bisa lihat calon tapi belum bisa vote)
          </p>
          <p>
            <strong>Tanggal & Waktu Pemungutan Suara:</strong> Waktu spesifik
            ketika voting dimulai. Pemilih hanya bisa memilih dari jam ini
            hingga jam selesai yang ditentukan!
          </p>
          <p>
            <strong>Jam Selesai:</strong> Jam ketika voting berakhir pada
            tanggal pemungutan suara.
          </p>
          <p>
            <strong>Jam Input Suara Offline:</strong> Waktu yang ditentukan
            untuk input suara offline.
          </p>
          <p>
            <strong>Pengumuman:</strong> Informasi yang akan ditampilkan kepada
            pemilih setelah mereka memilih.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
