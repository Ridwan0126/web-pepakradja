"use client";

import { motion } from "framer-motion";
import { CheckCircle, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  getAllVoters,
  updateVoter,
  getAllRegions,
  getPengaturan,
} from "../utils/firestore";

export default function VerifikasiData() {
  const [pemilih, setPemilih] = useState([]);
  const [wilayahList, setWilayahList] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState("*");
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterCaraMemilih, setFilterCaraMemilih] = useState("all");
  // all | online | offline
  const [sortAlamat, setSortAlamat] = useState("asc");
  // asc | desc

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [firestorePemilih, firestoreWilayah, firestorePengaturan] =
        await Promise.all([getAllVoters(), getAllRegions(), getPengaturan()]);

      setPemilih(firestorePemilih || []);
      setWilayahList(firestoreWilayah || []);
      setPengaturan(firestorePengaturan || {});
    } catch (error) {
      console.error("Error loading data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data dari Firestore: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredPemilih = pemilih
    .filter(
      (p) => selectedWilayah === "*" || p.wilayahPemilih === selectedWilayah
    )
    .filter((p) => {
      if (filterCaraMemilih === "all") return true;
      return p.caraMemilih === filterCaraMemilih;
    })
    .sort((a, b) => {
      const alamatA = `${a.alamatJalan || ""}`.toLowerCase();
      const alamatB = `${b.alamatJalan || ""}`.toLowerCase();

      if (alamatA !== alamatB) {
        return sortAlamat === "asc"
          ? alamatA.localeCompare(alamatB)
          : alamatB.localeCompare(alamatA);
      }

      // Jika jalan sama → bandingkan nomor rumah (angka)
      const noA = parseInt(a.nomorRumah || "0", 10);
      const noB = parseInt(b.nomorRumah || "0", 10);

      return sortAlamat === "asc" ? noA - noB : noB - noA;
    });

  const stats = {
    online: filteredPemilih.filter((p) => p.caraMemilih === "online").length,
    offline: filteredPemilih.filter((p) => p.caraMemilih === "offline").length,
  };

  const handleVerify = async (id) => {
    const pengaturan_obj = pengaturan;
    const tanggalPencoblosan = new Date(pengaturan_obj.tanggalPencoblosan);
    const jamMulai = pengaturan_obj.jamPencoblosanMulai || "08:00";

    const [jamM, menitM] = jamMulai.split(":").map(Number);
    const pencoblosanDayStart = new Date(tanggalPencoblosan);
    pencoblosanDayStart.setHours(jamM, menitM, 0, 0);

    const today = new Date();

    if (today >= pencoblosanDayStart) {
      Swal.fire({
        icon: "error",
        title: "Tidak Dapat Verifikasi",
        text: "Verifikasi tidak dapat dilakukan karena waktu pencoblosan sudah dimulai",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      const updatedVoter = {
        verifikasiSesuai: !pemilih.find((p) => p.id === id).verifikasiSesuai,
        verifikasiTanggal: !pemilih.find((p) => p.id === id).verifikasiSesuai
          ? new Date().toISOString()
          : null,
      };

      await updateVoter(id, updatedVoter);

      const updated = pemilih.map((voter) => {
        if (voter.id === id) {
          return { ...voter, ...updatedVoter };
        }
        return voter;
      });

      setPemilih(updated);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Status verifikasi berhasil diupdate",
        confirmButtonColor: "#10b981",
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal update verifikasi: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const canVerify = () => {
    const pengaturan_obj = pengaturan;
    const tanggalPencoblosanStr = pengaturan_obj.tanggalPencoblosan;

    if (!tanggalPencoblosanStr) return true;

    const tanggalPencoblosan = new Date(tanggalPencoblosanStr);
    const jamMulai = pengaturan_obj.jamPencoblosanMulai || "08:00";
    const jamSelesai = pengaturan_obj.jamPencoblosanSelesai || "17:00";

    const [jamM, menitM] = jamMulai.split(":").map(Number);
    const [jamS, menitS] = jamSelesai.split(":").map(Number);
    const pencoblosanDayStart = new Date(tanggalPencoblosan);
    pencoblosanDayStart.setHours(jamM, menitM, 0, 0);
    const pencoblosanDayEnd = new Date(tanggalPencoblosan);
    pencoblosanDayEnd.setHours(jamS, menitS, 59, 999);

    const today = new Date();
    return today < pencoblosanDayStart && today < pencoblosanDayEnd;
  };

  const getVerifyMessage = () => {
    const pengaturan_obj = pengaturan;
    const tanggalPencoblosanStr = pengaturan_obj.tanggalPencoblosan;

    if (!tanggalPencoblosanStr) return null;

    const tanggalPencoblosan = new Date(tanggalPencoblosanStr);
    const jamMulai = pengaturan_obj.jamPencoblosanMulai || "08:00";
    const jamSelesai = pengaturan_obj.jamPencoblosanSelesai || "17:00";

    const [jamM, menitM] = jamMulai.split(":").map(Number);
    const [jamS, menitS] = jamSelesai.split(":").map(Number);
    const pencoblosanDayStart = new Date(tanggalPencoblosan);
    pencoblosanDayStart.setHours(jamM, menitM, 0, 0);
    const pencoblosanDayEnd = new Date(tanggalPencoblosan);
    pencoblosanDayEnd.setHours(jamS, menitS, 59, 999);

    const today = new Date();

    if (today > pencoblosanDayEnd) {
      return "Pemilihan telah selesai - Verifikasi sudah ditutup";
    }

    if (today >= pencoblosanDayStart) {
      return "Pemilihan sedang berlangsung - Verifikasi tidak dapat dilakukan";
    }
    return null;
  };

  const getVerifiedPemilih = () => {
    return filteredPemilih;
  };

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return getVerifiedPemilih().slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getVerifiedPemilih().length / rowsPerPage);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
              Verifikasi Data Pemilih
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              Verifikasi data pemilih sebelum pemilihan dimulai
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter & Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[var(--color-text-secondary)]" />
            <h3 className="font-semibold text-[var(--color-text-primary)]">
              Filter
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Wilayah Pemilih
              </label>
              <select
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
              >
                <option value="*">Keseluruhan</option>
                {wilayahList.map((wilayah) => (
                  <option key={wilayah.id} value={wilayah.wilayahPemilih}>
                    {wilayah.wilayahPemilih}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                Cara Memilih
              </label>
              <select
                value={filterCaraMemilih}
                onChange={(e) => {
                  setFilterCaraMemilih(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)]"
              >
                <option value="all">Keseluruhan</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
              <p className="text-sm text-blue-500">Jumlah Pemilih Online</p>
              <p className="text-3xl font-bold text-blue-500">{stats.online}</p>
            </div>
            <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
              <p className="text-sm text-green-500">Jumlah Pemilih Offline</p>
              <p className="text-3xl font-bold text-green-500">
                {stats.offline}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {!canVerify() && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4"
        >
          <p className="text-red-500 text-sm font-medium">
            🔒 {getVerifyMessage()}
          </p>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-surface-hover)]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  No
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Nama
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer select-none"
                  onClick={() =>
                    setSortAlamat(sortAlamat === "asc" ? "desc" : "asc")
                  }
                >
                  Alamat
                  <span className="ml-1 text-xs">
                    {sortAlamat === "asc" ? "▲" : "▼"}
                  </span>
                </th>

                <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--color-text-primary)]">
                  Wilayah Pemilih
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-primary)]"
                  colSpan={2}
                >
                  Rekam Data
                </th>
                <th
                  className="px-4 py-3 text-center text-sm font-semibold text-[var(--color-text-primary)]"
                  colSpan={2}
                >
                  Verifikasi
                </th>
              </tr>
              <tr className="bg-[var(--color-surface-hover)]">
                <th colSpan={4}></th>
                <th className="px-4 py-2 text-center text-xs font-medium text-[var(--color-text-secondary)]">
                  Pantarlih
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-[var(--color-text-secondary)]">
                  Tanggal / Jam
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-[var(--color-text-secondary)]">
                  Sesuai
                </th>
                <th className="px-4 py-2 text-center text-xs font-medium text-[var(--color-text-secondary)]">
                  Tanggal / Jam
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {getPaginatedData().length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="px-4 py-8 text-center text-gray-600 dark:text-gray-400"
                  >
                    Tidak ada data pemilih terverifikasi
                  </td>
                </tr>
              ) : (
                getPaginatedData().map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[var(--color-surface-hover)] transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {(currentPage - 1) * rowsPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)] font-medium">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)]">
                      {item.alamatJalan} Nomor {item.nomorRumah}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-primary)]">
                      {item.wilayahPemilih}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] text-center">
                      {item.pantarlih || "-"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] text-center">
                      {item.tanggalRekam
                        ? new Date(item.tanggalRekam).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={item.verifikasiSesuai || false}
                        onChange={() => handleVerify(item.id)}
                        disabled={!canVerify()}
                        className="w-5 h-5 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-text-secondary)] text-center">
                      {item.verifikasiTanggal ? (
                        <span className="text-green-500 font-medium">
                          {new Date(item.verifikasiTanggal).toLocaleString(
                            "id-ID"
                          )}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Pagination Controls */}
      <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              Tampilkan
            </label>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              data per halaman
            </span>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            Total: {getVerifiedPemilih().length} data
          </div>
        </div>
      </div>

      {getTotalPages() > 1 && (
        <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Halaman {currentPage} dari {getTotalPages()}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(getTotalPages(), currentPage + 1))
              }
              disabled={currentPage === getTotalPages()}
              className="px-3 py-1.5 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
