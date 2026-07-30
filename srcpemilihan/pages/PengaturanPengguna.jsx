"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Edit, Trash2, Save, X, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
  getAllRegions,
} from "../utils/firestore";

export default function PengaturanPengguna() {
  const [panitiaList, setPanitiaList] = useState([]);
  const [wilayahList, setWilayahList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formData, setFormData] = useState({
    namaPanitia: "",
    level: "Ketua Panitia",
    wilayah: "",
    nomorHP: "",
    namaAkun: "",
    password: "",
    ulangPassword: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const users = await getAllUsers();
        const panitia = users.filter(
          (u) =>
            u.level === "Ketua Panitia" || u.level === "Koordinator/Anggota"
        );
        setPanitiaList(panitia);

        const regions = await getAllRegions();
        setWilayahList(regions);
      } catch (error) {
        console.error("Error loading users:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memuat data dari Firestore",
          confirmButtonColor: "#ef4444",
        });
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (formData.namaPanitia.length > 30) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Nama panitia maksimal 30 karakter",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (formData.namaAkun.length > 10) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Nama akun maksimal 10 karakter",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (formData.password.length > 15) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Password maksimal 15 karakter",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // Check password combination (must have letter and number)
    const hasLetter = /[a-zA-Z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);
    if (!hasLetter || !hasNumber) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Password harus kombinasi huruf dan angka",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (formData.password !== formData.ulangPassword) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Password dan ulang password tidak sama",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (formData.level === "Koordinator/Anggota" && !formData.wilayah) {
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Wilayah pemilihan wajib dipilih untuk Koordinator/Anggota",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      if (editingId) {
        await updateUser(editingId, {
          ...formData,
          nomorHP: `+62-${formData.nomorHP}`,
        });

        const updated = panitiaList.map((p) =>
          p.id === editingId
            ? { ...p, ...formData, nomorHP: `+62-${formData.nomorHP}` }
            : p
        );
        setPanitiaList(updated);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data panitia berhasil diupdate",
          confirmButtonColor: "#3b82f6",
        });
      } else {
        const newPanitia = {
          ...formData,
          nomorHP: `+62-${formData.nomorHP}`,
        };
        await createUser(newPanitia);

        const updated = [...panitiaList, newPanitia];
        setPanitiaList(updated);

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data panitia berhasil ditambahkan",
          confirmButtonColor: "#3b82f6",
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving panitia:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menyimpan panitia: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDelete = async (panitia) => {
    try {
      const result = await Swal.fire({
        title: "Hapus Panitia?",
        text: `Apakah Anda yakin ingin menghapus ${panitia.namaPanitia}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await deleteUser(panitia.id);

        const updated = panitiaList.filter((p) => p.id !== panitia.id);
        setPanitiaList(updated);

        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data panitia berhasil dihapus",
          confirmButtonColor: "#3b82f6",
        });
      }
    } catch (error) {
      console.error("Error deleting panitia:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menghapus panitia: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleEdit = (panitia) => {
    setEditingId(panitia.id);
    const nomorHP = panitia.nomorHP
      ? String(panitia.nomorHP).replace("+62-", "")
      : "";
    setFormData({
      namaPanitia: panitia.namaPanitia || "",
      level: panitia.level || "Ketua Panitia",
      wilayah: panitia.wilayah || "",
      nomorHP,
      namaAkun: panitia.namaAkun || "",
      password: panitia.password || "",
      ulangPassword: panitia.password || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      namaPanitia: "",
      level: "Ketua Panitia",
      wilayah: "",
      nomorHP: "",
      namaAkun: "",
      password: "",
      ulangPassword: "",
    });
    setEditingId(null);
    setShowModal(false);
    setShowPassword(false);
    setShowPasswordConfirm(false);
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
            <div className="p-2 rounded-lg bg-orange-500/10 flex-shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                Pengaturan Pengguna
              </h1>
              <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                Kelola data panitia pemilihan
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transition-all touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Panitia</span>
            <span className="sm:hidden">Tambah</span>
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
            <thead className="bg-gradient-to-r from-slate-50 to-orange-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Nama Panitia
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Level
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Nama Akun
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Wilayah
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Nomor HP
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-[var(--color-text-primary)]">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {panitiaList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Users className="w-12 h-12 text-gray-300" />
                      <p className="text-sm text-[var(--color-text-muted)]">
                        Belum ada data panitia
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                panitiaList.map((panitia, index) => (
                  <motion.tr
                    key={panitia.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-orange-50/50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-[var(--color-text-primary)]">
                      {panitia.namaPanitia}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          panitia.level === "Ketua Panitia"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {panitia.level}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {panitia.namaAkun}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {panitia.wilayah || "-"}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-[var(--color-text-secondary)]">
                      {panitia.nomorHP}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(panitia)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(panitia)}
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-2xl my-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)]">
                  {editingId ? "EDIT" : "TAMBAH"} PANITIA
                </h3>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Level Panitia */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Level Panitia
                  </label>
                  <select
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        level: e.target.value,
                        wilayah: "",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Ketua Panitia">Ketua Panitia</option>
                    <option value="Koordinator/Anggota">
                      Koordinator/Anggota
                    </option>
                  </select>
                </div>

                {/* Wilayah - only show if Koordinator/Anggota */}
                {formData.level === "Koordinator/Anggota" && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                      Wilayah Pemilihan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.wilayah}
                      onChange={(e) =>
                        setFormData({ ...formData, wilayah: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">-- Pilih Wilayah --</option>
                      {wilayahList.map((w) => (
                        <option key={w.id} value={w.wilayahPemilih}>
                          {w.wilayahPemilih}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Nama Panitia */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Nama Panitia{" "}
                    <span className="text-xs text-gray-500">
                      (maks. 30 karakter)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaPanitia}
                    onChange={(e) =>
                      setFormData({ ...formData, namaPanitia: e.target.value })
                    }
                    maxLength={30}
                    placeholder="Nama lengkap panitia"
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Nomor HP */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Nomor HP{" "}
                    <span className="text-xs text-gray-500">
                      (diisi tanpa angka 0)
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg">
                      +62-
                    </span>
                    <input
                      type="text"
                      value={formData.nomorHP}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nomorHP: e.target.value.replace(/[^0-9]/g, ""),
                        })
                      }
                      placeholder="8123456789"
                      className="flex-1 px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Nama Akun */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Nama Akun{" "}
                    <span className="text-xs text-gray-500">
                      (maks. 10 karakter)
                    </span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaAkun}
                    onChange={(e) =>
                      setFormData({ ...formData, namaAkun: e.target.value })
                    }
                    maxLength={10}
                    placeholder="username"
                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Password{" "}
                    <span className="text-xs text-gray-500">
                      (kombinasi huruf dan angka, maks. 15)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      maxLength={15}
                      placeholder="Abc123"
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Ulang Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Ulang Password{" "}
                    <span className="text-xs text-gray-500">
                      (harus sama dengan password)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      value={formData.ulangPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ulangPassword: e.target.value,
                        })
                      }
                      maxLength={15}
                      placeholder="Abc123"
                      className="w-full px-4 py-2.5 pr-12 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPasswordConfirm(!showPasswordConfirm)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswordConfirm ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Simpan
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
