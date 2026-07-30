"use client";

import { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Search, Edit2, Trash2, X, Save } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDb } from "../utils/firestore";

const MAX_VOTERS_PER_AREA = 50; // Example limit

function DataPemilihPage() {
  const [pemilih, setPemilih] = useState([]);
  const [wilayahList, setWilayahList] = useState([]);
  const [wilayahQuotaMap, setWilayahQuotaMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const AuthContextValue = useContext(AuthContext);
  const user = AuthContextValue?.user || {
    wilayah: "Jakarta Pusat",
    role: "koordinator",
  };
  const isKoordinator =
    user?.role === "koordinator" || user?.role === "anggota";
  const isAdmin = user?.role === "admin";
  const [selectedWilayah, setSelectedWilayah] = useState(
    isKoordinator ? user?.wilayah || "*" : "*"
  );
  const [selectedCaraMemilih, setSelectedCaraMemilih] = useState("*");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    wilayahPemilih: "",
    nama: "",
    alamatJalan: "",
    nomorRumah: "",
    jenisKelamin: "Laki-Laki",
    caraMemilih: "online",
    nomorHP: "",
    pantarlih: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [db, setDb] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const loadPemilih = async () => {
      try {
        setLoading(true);
        const dbInstance = await getDb();
        setDb(dbInstance);
        const pemilihSnapshot = await getDocs(
          collection(dbInstance, "pemilih")
        );
        const pemilihData = pemilihSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPemilih(pemilihData);
      } catch (error) {
        console.error("Error loading pemilih:", error);
        setPemilih([]);
      } finally {
        setLoading(false);
      }
    };
    loadPemilih();
  }, []);

  useEffect(() => {
    const loadWilayah = async () => {
      try {
        const wilayahSnapshot = await getDocs(collection(db, "wilayah"));
        const wilayahData = wilayahSnapshot.docs.map((doc) => ({
          id: doc.id,
          wilayahPemilih: doc.data().wilayahPemilih,
          jumlahPemilih: doc.data().jumlahPemilih || 0,
        }));
        setWilayahList(wilayahData);

        const quotaMap = {};
        wilayahData.forEach((w) => {
          quotaMap[w.wilayahPemilih] = w.jumlahPemilih;
        });
        console.log("[v0] Wilayah quota map loaded:", quotaMap);
        setWilayahQuotaMap(quotaMap);
      } catch (error) {
        console.error("[v0] Error loading wilayah:", error);
        setWilayahList([]);
      }
    };
    if (db) {
      loadWilayah();
    }
  }, [db]);

  const getFilteredPemilih = () => {
    const wilayahFilter = isKoordinator ? user?.wilayah : selectedWilayah;

    return pemilih
      .filter(
        (p) =>
          (wilayahFilter === "*" || p.wilayahPemilih === wilayahFilter) &&
          (selectedCaraMemilih === "*" ||
            p.caraMemilih === selectedCaraMemilih) &&
          p.nama.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const addressCompare = (a.alamatJalan || "").localeCompare(
          b.alamatJalan || ""
        );
        if (addressCompare !== 0) return addressCompare;
        const numA = Number.parseInt(a.nomorRumah) || 0;
        const numB = Number.parseInt(b.nomorRumah) || 0;
        return numA - numB;
      });
  };

  const getPaginatedData = () => {
    const filtered = getFilteredPemilih();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredPemilih().length / rowsPerPage);
  };

  const getQuotaInfo = () => {
    const wilayahFilter = isKoordinator ? user?.wilayah : selectedWilayah;

    if (wilayahFilter === "*") {
      // Show aggregate totals for all wilayah when "Semua Wilayah" selected
      const totalQuota = Object.values(wilayahQuotaMap).reduce(
        (sum, val) => sum + val,
        0
      );
      const inputCount = pemilih.length;
      const remaining = totalQuota - inputCount;
      return { quota: totalQuota, inputCount, remaining };
    }

    const quota = wilayahQuotaMap[wilayahFilter] || 0;
    const inputCount = pemilih.filter(
      (p) => p.wilayahPemilih === wilayahFilter
    ).length;
    const remaining = quota - inputCount;

    return { quota, inputCount, remaining };
  };

  const handleOpenModal = () => {
    setEditingId(null);
    setFormData({
      wilayahPemilih: isAdmin ? "" : isKoordinator ? user.wilayah : "",
      nama: "",
      alamatJalan: "",
      nomorRumah: "",
      jenisKelamin: "Laki-Laki",
      caraMemilih: "online",
      nomorHP: "",
      pantarlih: "",
    });
    setShowModal(true);
  };

  const handleEdit = (voter) => {
    setEditingId(voter.id);
    setFormData({ ...voter });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data pemilih ini?")) {
      deleteDoc(doc(db, "pemilih", id))
        .then(() => {
          console.log("[v0] Document deleted from Firebase:", id);
          setPemilih(pemilih.filter((p) => p.id !== id));
        })
        .catch((error) => {
          console.error("[v0] Error deleting pemilih:", error);
          alert("Gagal menghapus data pemilih: " + error.message);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // === TAMBAHKAN DI ATAS COMPONENT / ATAU DI ATAS handleSubmit ===
  const normalizePhone = (phone) => {
    if (!phone) return "";
    const clean = phone.replace(/\s+/g, "");

    if (clean.startsWith("+62")) return clean;
    if (clean.startsWith("62")) return "+" + clean;
    if (clean.startsWith("0")) return "+62" + clean.slice(1);

    return "+62" + clean;
  };

  // === GANTI handleSubmit KAMU DENGAN YANG INI ===
  const handleSubmit = async (e) => {
    if (!editingId && isQuotaFull) {
      alert("Kuota pemilih untuk wilayah ini sudah penuh.");
      return;
    }

    e.preventDefault();

    try {
      if (editingId) {
        const docRef = doc(db, "pemilih", editingId);
        await updateDoc(docRef, {
          ...formData,
          nomorHP: normalizePhone(formData.nomorHP),
          pantarlih: user?.nama || "Admin System",
          updatedAt: new Date().toISOString(),
          tanggalRekam: new Date().toISOString(),
        });

        setPemilih(
          pemilih.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  ...formData,
                  nomorHP: normalizePhone(formData.nomorHP),
                  pantarlih: user?.nama || "Admin System",
                  tanggalRekam: new Date().toISOString(),
                }
              : p
          )
        );
      } else {
        const dataToSave = {
          ...formData,
          nomorHP: normalizePhone(formData.nomorHP),
          pantarlih: user?.nama || "Admin System",
          wilayahPemilih: formData.wilayahPemilih || user?.wilayah,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tanggalRekam: new Date().toISOString(),
          sudahMemilih: false,
          verifikasiSesuai: false,
          token: "",
          tokenCreatedAt: "",
        };

        const docRef = await addDoc(collection(db, "pemilih"), dataToSave);
        setPemilih([...pemilih, { ...dataToSave, id: docRef.id }]);
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error("[v0] Error saving pemilih:", error);
      alert("Gagal menyimpan data pemilih: " + error.message);
    }
  };

  const canAddMore = () => {
    const wilayah = isKoordinator ? user.wilayah : selectedWilayah;

    if (!wilayah || wilayah === "*") return true;

    const quota = wilayahQuotaMap[wilayah] || 0;

    const inputCount = pemilih.filter(
      (p) => p.wilayahPemilih === wilayah
    ).length;

    return inputCount < quota;
  };
  const isQuotaFull = !canAddMore();

  const resetForm = () => {
    setFormData({
      wilayahPemilih: "",
      nama: "",
      alamatJalan: "",
      nomorRumah: "",
      jenisKelamin: "Laki-Laki",
      caraMemilih: "online",
      nomorHP: "",
      pantarlih: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Data Pemilih
              </h1>
              <p className="text-sm text-gray-600">Kelola data pemilih</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wilayah Pemilih
                {isKoordinator && !isAdmin && (
                  <span className="text-red-500">
                    {" "}
                    (Terkunci ke {user?.wilayah})
                  </span>
                )}
              </label>
              <select
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.target.value)}
                disabled={isKoordinator}
                className={`px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isKoordinator ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                }`}
              >
                {!isKoordinator && <option value="*">Semua Wilayah</option>}
                {wilayahList.map((w) => (
                  <option key={w.id} value={w.wilayahPemilih}>
                    {w.wilayahPemilih}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cara Memilih
              </label>
              <select
                value={selectedCaraMemilih}
                onChange={(e) => setSelectedCaraMemilih(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="*">Semua</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {getQuotaInfo() && (
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">
                    Kuota Pemilih
                  </p>
                  <p className="text-2xl font-bold text-orange-700">
                    {getQuotaInfo().quota}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-orange-600 mb-1">
                    Sudah Input:{" "}
                    <span className="font-bold">
                      {getQuotaInfo().inputCount}
                    </span>
                  </p>
                  <p className="text-xs text-orange-600">
                    Sisa:{" "}
                    <span className="font-bold">
                      {getQuotaInfo().remaining}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">Pemilih Online</p>
              <p className="text-3xl font-bold text-blue-600">
                {
                  getFilteredPemilih().filter((p) => p.caraMemilih === "online")
                    .length
                }
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
              <p className="text-sm text-green-600 mb-1">Pemilih Offline</p>
              <p className="text-3xl font-bold text-green-600">
                {
                  getFilteredPemilih().filter(
                    (p) => p.caraMemilih === "offline"
                  ).length
                }
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <button
            onClick={!isQuotaFull ? handleOpenModal : undefined}
            disabled={isQuotaFull}
            className={`px-6 py-2.5 rounded-xl shadow-lg transition-all font-medium flex items-center gap-2
    ${
      isQuotaFull
        ? "bg-red-100 text-red-700 cursor-not-allowed border border-red-300"
        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
    }
  `}
          >
            {isQuotaFull ? (
              <>
                <X className="w-5 h-5" />
                Kuota Pemilih Penuh
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Tambah
              </>
            )}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Alamat
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    No Telepon
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Cara Memilih
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Pantarlih
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Tanggal Rekam
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : getPaginatedData().length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      Tidak ada data pemilih
                    </td>
                  </tr>
                ) : (
                  getPaginatedData().map((voter, index) => {
                    const isVerified = voter.verifikasiSesuai === true;
                    return (
                      <tr
                        key={voter.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {(currentPage - 1) * rowsPerPage + index + 1}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${
                            isVerified
                              ? "text-gray-400 cursor-not-allowed"
                              : "text-blue-600 cursor-pointer hover:underline"
                          }`}
                          onClick={() => {
                            if (!isVerified) handleEdit(voter);
                          }}
                        >
                          {voter.nama}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {voter.alamatJalan}
                          {voter.nomorRumah && ` No. ${voter.nomorRumah}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {voter.nomorHP || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              voter.caraMemilih === "online"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {voter.caraMemilih === "online"
                              ? "Online"
                              : "Offline"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {voter.pantarlih || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {voter.tanggalRekam
                            ? new Date(voter.tanggalRekam).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              disabled={isVerified}
                              onClick={() => !isVerified && handleEdit(voter)}
                              className={`p-2 rounded-lg transition-colors ${
                                isVerified
                                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                  : "text-blue-600 hover:bg-blue-50"
                              }`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              disabled={isVerified}
                              onClick={() =>
                                !isVerified && handleDelete(voter.id)
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                isVerified
                                  ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                                  : "text-red-600 hover:bg-red-50"
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Tampilkan</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-700">data per halaman</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-700">
                Halaman {currentPage} dari {getTotalPages()}
              </span>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(getTotalPages(), currentPage + 1))
                }
                disabled={currentPage === getTotalPages()}
                className="px-3 py-1.5 border border-gray-300 rounded-lg bg-white text-gray-900 disabled:opacity-50 hover:bg-gray-100 transition-colors"
              >
                Next →
              </button>
            </div>

            <div className="text-sm text-gray-700">
              Total: {getFilteredPemilih().length} data
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {showModal && (
            <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <motion.div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingId ? "Edit Pemilih" : "Tambah Pemilih"}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Wilayah *
                    </label>
                    <select
                      name="wilayahPemilih"
                      value={formData.wilayahPemilih}
                      onChange={handleChange}
                      disabled={isAdmin ? false : isKoordinator}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Pilih Wilayah</option>
                      {wilayahList.map((w) => (
                        <option key={w.id} value={w.wilayahPemilih}>
                          {w.wilayahPemilih}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Pemilih *
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Masukkan nama"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Jalan
                    </label>
                    <input
                      type="text"
                      name="alamatJalan"
                      value={formData.alamatJalan}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Masukkan alamat jalan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Rumah
                    </label>
                    <input
                      type="text"
                      name="nomorRumah"
                      value={formData.nomorRumah}
                      onChange={(e) =>
                        setFormData({ ...formData, nomorRumah: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan nomor rumah (contoh: 1, 1A, 1B)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Kelamin
                    </label>
                    <select
                      name="jenisKelamin"
                      value={formData.jenisKelamin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="Laki-Laki">Laki-Laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cara Memilih
                    </label>
                    <select
                      name="caraMemilih"
                      value={formData.caraMemilih}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor HP{" "}
                      {formData.caraMemilih === "online" ? "*" : "(Opsional)"}
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-gray-50">
                      <span className="px-3 py-2 text-gray-700 font-medium bg-gray-100 border-r border-gray-300">
                        +62
                      </span>
                      <input
                        type="tel"
                        name="nomorHP"
                        value={formData.nomorHP}
                        onChange={handleChange}
                        required={formData.caraMemilih === "online"}
                        className="flex-1 px-3 py-2 bg-gray-50 border-0 focus:ring-0 text-gray-900 outline-none"
                        placeholder="Masukkan nomor HP (misal: 81234567890)"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center justify-center gap-2"
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
      </motion.div>
    </div>
  );
}

export default DataPemilihPage;
