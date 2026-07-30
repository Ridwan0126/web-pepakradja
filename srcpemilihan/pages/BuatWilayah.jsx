"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Plus, Edit, Trash2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getKelompokPemilih,
  getAllRegions,
  createRegion,
  updateRegion,
  deleteRegion,
  checkRegionHasVoters,
} from "../utils/firestore";

export default function BuatWilayah() {
  const [wilayahList, setWilayahList] = useState([]);
  const [kelompokPemilih, setKelompokPemilih] = useState("RW");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nomorWilayah: "",
    jumlahPemilih: "",
    saksi1: "",
    saksi2: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const kelompok = await getKelompokPemilih();
        setKelompokPemilih(kelompok);

        const regions = await getAllRegions();
        setWilayahList(regions);
      } catch (error) {
        console.error("Error loading regions:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memuat data wilayah dari Firestore",
          confirmButtonColor: "#ef4444",
        });
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wilayahPemilih = `${kelompokPemilih}-${formData.nomorWilayah.padStart(
      2,
      "0",
    )}`;

    // Check if exists
    const exists = wilayahList.some(
      (w) => w.wilayahPemilih === wilayahPemilih && w.id !== editingId,
    );

    if (exists) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: `Wilayah ${wilayahPemilih} sudah ada!`,
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      if (editingId) {
        await updateRegion(editingId, {
          wilayahPemilih,
          jumlahPemilih: Number.parseInt(formData.jumlahPemilih),
          saksi1: formData.saksi1,
          saksi2: formData.saksi2,
        });

        const updated = wilayahList.map((w) =>
          w.id === editingId
            ? {
                ...w,
                wilayahPemilih,
                jumlahPemilih: Number.parseInt(formData.jumlahPemilih),
              }
            : w,
        );
        setWilayahList(updated);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Wilayah pemilihan berhasil diupdate",
          confirmButtonColor: "#3b82f6",
        });
      } else {
        const newRegion = await createRegion({
          wilayahPemilih,
          jumlahPemilih: Number.parseInt(formData.jumlahPemilih),
          saksi1: formData.saksi1,
          saksi2: formData.saksi2,
        });

        const updated = [...wilayahList, newRegion];
        setWilayahList(updated);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Wilayah pemilihan berhasil ditambahkan",
          confirmButtonColor: "#3b82f6",
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving wilayah:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menyimpan wilayah: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDelete = async (wilayah) => {
    try {
      const hasPemilih = await checkRegionHasVoters(wilayah.wilayahPemilih);

      if (hasPemilih) {
        Swal.fire({
          icon: "error",
          title: "Tidak Bisa Dihapus!",
          text: "Wilayah ini tidak bisa dihapus karena sudah ada data pemilih",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Hapus Wilayah?",
        text: `Apakah Anda yakin ingin menghapus ${wilayah.wilayahPemilih}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await deleteRegion(wilayah.id);

        const updated = wilayahList.filter((w) => w.id !== wilayah.id);
        setWilayahList(updated);

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Wilayah pemilihan berhasil dihapus",
          confirmButtonColor: "#3b82f6",
        });
      }
    } catch (error) {
      console.error("Error deleting wilayah:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menghapus wilayah: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleEdit = (wilayah) => {
    setEditingId(wilayah.id);
    const nomorMatch = wilayah.wilayahPemilih.match(/\d+$/);

    setFormData({
      nomorWilayah: nomorMatch ? nomorMatch[0] : "",
      jumlahPemilih: wilayah.jumlahPemilih.toString(),
      saksi1: wilayah.saksi1 || "",
      saksi2: wilayah.saksi2 || "",
    });

    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      nomorWilayah: "",
      jumlahPemilih: "",
      saksi1: "",
      saksi2: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                Buat Wilayah Pemilihan
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Kelompok:{" "}
                <span className="font-semibold text-blue-600">
                  {kelompokPemilih}
                </span>
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Buat Wilayah</span>
            <span className="sm:hidden">Buat</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-blue-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  ID
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Wilayah Pemilih
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Jumlah Pemilih
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold">
                  Saksi
                </th>

                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {wilayahList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <MapPin className="w-12 h-12 text-gray-300" />
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Belum ada wilayah pemilihan
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                wilayahList.map((wilayah, index) => (
                  <motion.tr
                    key={wilayah.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {index + 1}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
                      {wilayah.wilayahPemilih}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {wilayah.jumlahPemilih} Pemilih
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col">
                        <span>Saksi 1: {wilayah.saksi1 || "-"}</span>
                        <span>Saksi 2: {wilayah.saksi2 || "-"}</span>
                      </div>
                    </td>

                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(wilayah)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(wilayah)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                  {editingId ? "Edit" : "Pembuatan"} Wilayah Pemilih
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Wilayah Pemilih
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2.5 bg-blue-100 text-blue-700 font-semibold rounded-lg">
                      {kelompokPemilih}
                    </span>
                    <span className="text-xl font-bold">-</span>
                    <input
                      type="number"
                      value={formData.nomorWilayah}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nomorWilayah: e.target.value,
                        })
                      }
                      placeholder="999"
                      min="1"
                      max="999"
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Jumlah Pemilih
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.jumlahPemilih}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jumlahPemilih: e.target.value,
                        })
                      }
                      placeholder="9999"
                      min="1"
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <span className="px-4 py-2.5 text-sm text-[var(--color-text-secondary)]">
                      Pemilih
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Saksi 1</label>
                  <input
                    type="text"
                    value={formData.saksi1}
                    onChange={(e) =>
                      setFormData({ ...formData, saksi1: e.target.value })
                    }
                    placeholder="Nama Saksi 1"
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Saksi 2</label>
                  <input
                    type="text"
                    value={formData.saksi2}
                    onChange={(e) =>
                      setFormData({ ...formData, saksi2: e.target.value })
                    }
                    placeholder="Nama Saksi 2"
                    className="w-full px-4 py-2.5 rounded-lg border focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    SIMPAN
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
