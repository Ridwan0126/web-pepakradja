"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  UserPlus,
  Users,
  ImageIcon,
} from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getAllCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  checkCandidateHasVotes,
} from "../utils/firestore";

export default function PengaturanCalon() {
  const [calon, setCalon] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    nomorUrut: "",
    namaKetua: "",
    alamatKetua: "",
    namaWakil: "",
    alamatWakil: "",
    jargon: "",
    visi: "",
    misi: "",
    foto: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const candidates = await getAllCandidates();
        setCalon(candidates);
      } catch (error) {
        console.error("Error loading candidates:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Gagal memuat data calon dari Firestore",
          confirmButtonColor: "#ef4444",
        });
      }
    };
    loadData();
  }, []);

  const hasVotes = async (candidateId) => {
    try {
      return await checkCandidateHasVotes(candidateId);
    } catch (error) {
      console.error("Error checking votes:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.alamatKetua.length > 200) {
      Swal.fire({
        icon: "error",
        title: "Alamat Ketua Terlalu Panjang",
        text: "Alamat ketua maksimal 200 karakter",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (formData.alamatWakil && formData.alamatWakil.length > 200) {
      Swal.fire({
        icon: "error",
        title: "Alamat Wakil Terlalu Panjang",
        text: "Alamat wakil maksimal 200 karakter",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (formData.jargon && formData.jargon.length > 50) {
      Swal.fire({
        icon: "error",
        title: "Jargon Terlalu Panjang",
        text: "Jargon maksimal 50 karakter",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      if (editingId !== null) {
        const votes = await hasVotes(editingId);
        if (votes) {
          Swal.fire({
            icon: "error",
            title: "Tidak Dapat Mengubah",
            text: "Calon yang sudah memiliki suara tidak dapat diubah",
            confirmButtonColor: "#ef4444",
          });
          return;
        }

        await updateCandidate(editingId, formData);

        const updated = calon.map((item) =>
          item.id === editingId ? { ...formData, id: editingId } : item
        );
        setCalon(updated);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Data calon berhasil diupdate",
          confirmButtonColor: "#10b981",
          timer: 2000,
        });
      } else {
        const newCandidate = await createCandidate(formData);
        const updated = [...calon, newCandidate];
        setCalon(updated);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Calon baru berhasil ditambahkan",
          confirmButtonColor: "#10b981",
          timer: 2000,
        });
      }

      resetForm();
    } catch (error) {
      console.error("Error saving candidate:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menyimpan calon: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleEdit = (item) => {
    if (hasVotes(item.id)) {
      Swal.fire({
        icon: "error",
        title: "Tidak Dapat Mengubah",
        text: "Calon yang sudah memiliki suara tidak dapat diubah",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setFormData(item);
    setEditingId(item.id);
    setImagePreview(item.foto);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const votes = await hasVotes(id);
      if (votes) {
        Swal.fire({
          icon: "error",
          title: "Tidak Dapat Menghapus",
          text: "Calon yang sudah memiliki suara tidak dapat dihapus",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      const result = await Swal.fire({
        title: "Hapus Calon?",
        text: "Data calon akan dihapus permanen!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await deleteCandidate(id);

        const updated = calon.filter((item) => item.id !== id);
        setCalon(updated);

        Swal.fire({
          icon: "success",
          title: "Terhapus",
          text: "Data calon berhasil dihapus",
          confirmButtonColor: "#10b981",
          timer: 2000,
        });
      }
    } catch (error) {
      console.error("Error deleting candidate:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Gagal menghapus calon: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.foto && !editingId) {
        Swal.fire({
          icon: "warning",
          title: "Foto Sudah Ada",
          text: "Hapus foto yang ada terlebih dahulu sebelum mengunggah foto baru",
          confirmButtonColor: "#f59e0b",
        });
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "File Terlalu Besar",
          text: "Ukuran file maksimal 2MB",
          confirmButtonColor: "#ef4444",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          foto: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData({
      ...formData,
      foto: "",
    });
  };

  const resetForm = () => {
    setFormData({
      nomorUrut: "",
      namaKetua: "",
      alamatKetua: "",
      namaWakil: "",
      alamatWakil: "",
      jargon: "",
      visi: "",
      misi: "",
      foto: "",
    });
    setImagePreview(null);
    setEditingId(null);
    setShowModal(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                Data Calon
              </h1>
              <p className="text-[var(--color-text-secondary)]">
                Kelola data calon ketua dan wakil
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-5 h-5" />
            Tambah Calon
          </motion.button>
        </div>
      </motion.div>

      {/* Calon List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calon.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full bg-[var(--color-surface)] rounded-xl p-12 border border-[var(--color-border)] text-center"
          >
            <UserPlus className="w-16 h-16 text-[var(--color-text-muted)] mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)]">
              Belum ada calon yang ditambahkan
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-2">
              Klik tombol "Tambah Calon" untuk mulai
            </p>
          </motion.div>
        ) : (
          calon.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[var(--color-surface)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg transition-all"
            >
              {/* Photo */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500">
                {item.foto ? (
                  <img
                    src={item.foto || "/placeholder.svg"}
                    alt={item.namaKetua}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-white text-6xl font-bold">
                      {item.nomorUrut}
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white text-[var(--color-primary)] px-4 py-2 rounded-lg font-bold">
                  No. {item.nomorUrut}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Ketua
                  </p>
                  <p className="font-bold text-[var(--color-text-primary)]">
                    {item.namaKetua}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Alamat Ketua
                  </p>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {item.alamatKetua}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Wakil
                  </p>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {item.namaWakil}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Alamat Wakil
                  </p>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {item.alamatWakil}
                  </p>
                </div>
                {item.jargon && (
                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Jargon
                    </p>
                    <p className="text-sm italic text-[var(--color-text-primary)]">
                      "{item.jargon}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEdit(item)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      hasVotes(item.id)
                        ? "bg-gray-500/10 text-gray-400 cursor-not-allowed"
                        : "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                    }`}
                    disabled={hasVotes(item.id)}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(item.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      hasVotes(item.id)
                        ? "bg-gray-500/10 text-gray-400 cursor-not-allowed"
                        : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    }`}
                    disabled={hasVotes(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[var(--color-surface)] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                  {editingId ? "Edit Calon" : "Tambah Calon"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Nomor Urut
                  </label>
                  <input
                    type="number"
                    name="nomorUrut"
                    value={formData.nomorUrut}
                    onChange={handleChange}
                    placeholder="1"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Nama Ketua
                  </label>
                  <input
                    type="text"
                    name="namaKetua"
                    value={formData.namaKetua}
                    onChange={handleChange}
                    placeholder="Nama lengkap calon ketua"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Alamat Ketua (Maks. 200 karakter)
                  </label>
                  <textarea
                    name="alamatKetua"
                    value={formData.alamatKetua}
                    onChange={handleChange}
                    placeholder="Alamat lengkap calon ketua"
                    maxLength={200}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                    required
                  />
                  <p className="text-xs text-[var(--color-text-muted)] text-right">
                    {formData.alamatKetua.length}/200
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Nama Wakil{" "}
                    <span className="text-[var(--color-text-muted)]">
                      (Opsional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="namaWakil"
                    value={formData.namaWakil}
                    onChange={handleChange}
                    placeholder="Nama lengkap calon wakil"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Alamat Wakil (Maks. 200 karakter){" "}
                    <span className="text-[var(--color-text-muted)]">
                      (Opsional)
                    </span>
                  </label>
                  <textarea
                    name="alamatWakil"
                    value={formData.alamatWakil}
                    onChange={handleChange}
                    placeholder="Alamat lengkap calon wakil"
                    maxLength={200}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] text-right">
                    {formData.alamatWakil.length}/200
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Jargon / Slogan (Maks. 50 karakter){" "}
                    <span className="text-[var(--color-text-muted)]">
                      (Opsional)
                    </span>
                  </label>
                  <input
                    type="text"
                    name="jargon"
                    value={formData.jargon}
                    onChange={handleChange}
                    placeholder="Contoh: Bersama Membangun Negeri"
                    maxLength={50}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                  />
                  <p className="text-xs text-[var(--color-text-muted)] text-right">
                    {formData.jargon.length}/50
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Visi{" "}
                    <span className="text-[var(--color-text-muted)]">
                      (Opsional)
                    </span>
                  </label>
                  <textarea
                    name="visi"
                    value={formData.visi}
                    onChange={handleChange}
                    placeholder="Visi calon..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Misi{" "}
                    <span className="text-[var(--color-text-muted)]">
                      (Opsional)
                    </span>
                  </label>
                  <textarea
                    name="misi"
                    value={formData.misi}
                    onChange={handleChange}
                    placeholder="Misi calon..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Foto{" "}
                    <span className="text-[var(--color-text-muted)]">
                      (Opsional, Maks. 2MB)
                    </span>
                  </label>
                  <div className="space-y-3">
                    {imagePreview ? (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-[var(--color-border)]">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 px-4 py-12 border-2 border-dashed border-[var(--color-border)] rounded-lg cursor-pointer hover:bg-[var(--color-surface-hover)] transition-all">
                        <ImageIcon className="w-6 h-6 text-[var(--color-text-secondary)]" />
                        <div className="text-center">
                          <span className="block text-sm text-[var(--color-text-secondary)] font-medium">
                            Pilih Gambar
                          </span>
                          <span className="block text-xs text-[var(--color-text-muted)] mt-1">
                            JPG, PNG, GIF (Maks. 2MB)
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetForm}
                    className="flex-1 px-4 py-3 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-all"
                  >
                    Batal
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    <Save className="w-5 h-5" />
                    {editingId ? "Update" : "Simpan"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
