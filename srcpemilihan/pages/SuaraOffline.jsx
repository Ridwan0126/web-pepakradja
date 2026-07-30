"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Users, Download, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllVoters,
  getAllCandidates,
  getAllRegions,
  getPengaturan,
  getAllOfflineVotes,
  createOfflineVote,
  updateOfflineVote,
  deleteOfflineVote,
  getPengesahanOffline,
  savePengesahanOffline,
  deletePengesahanOffline,
} from "../utils/firestore";

export default function SuaraOffline() {
  const [pemilih, setPemilih] = useState([]);
  const [calon, setCalon] = useState([]);
  const [wilayahList, setWilayahList] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [panitiaList, setPanitiaList] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState("*");
  const [saksi1, setSaksi1] = useState("");
  const [saksi2, setSaksi2] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPemilih, setEditingPemilih] = useState(null);
  const [editingVoteId, setEditingVoteId] = useState(null);
  const [formData, setFormData] = useState({
    statusSuara: "SAH",
    pilihanCalon: "",
    wilayahPemilih: "",
  });
  // const [offlineVotes, setOfflineVotes] = useState([]);
  const [tanggalPengesahan, setTanggalPengesahan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isWithinOfflineVoteTimeWindow, setIsWithinOfflineVoteTimeWindow] =
    useState(true);
  const [offlineVoteTimeWindowMessage, setOfflineVoteTimeWindowMessage] =
    useState("");
  const [globalLockedAt, setGlobalLockedAt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [offlinePemilih, setOfflinePemilih] = useState([]);
  const [offlineVotes, setOfflineVotes] = useState([]);

  const { user } = useAuth();
  const isKetuaPanitia = user?.level === "Ketua Panitia";
  const isKoordinator = user?.role === "koordinator";

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        firestorePemilih,
        firestoreCalon,
        firestoreWilayah,
        firestorePengaturan,
        firestoreVotesOffline,
        firestorePengesahan,
      ] = await Promise.all([
        getAllVoters(),
        getAllCandidates(),
        getAllRegions(),
        getPengaturan(),
        getAllOfflineVotes(),
        getPengesahanOffline(),
      ]);

      console.log("[v0] Loaded offline votes:", firestoreVotesOffline);
      console.log(
        "[v0] Total offline votes:",
        firestoreVotesOffline?.length || 0,
      );

      setPemilih(firestorePemilih || []);
      setCalon(firestoreCalon || []);
      setWilayahList(firestoreWilayah || []);
      setPengaturan(firestorePengaturan || {});
      setOfflineVotes(firestoreVotesOffline || []);

      const offlinePemilihList = (firestorePemilih || []).filter(
        (p) => p.caraMemilih === "offline",
      );

      setOfflinePemilih(
        offlinePemilihList.sort((a, b) =>
          (a.nama || "").localeCompare(b.nama || ""),
        ),
      );

      setTanggalPengesahan(firestorePengesahan?.tanggal || "");

      if (firestorePengesahan?.globalLockedAt) {
        setGlobalLockedAt(firestorePengesahan.globalLockedAt);
      }

      checkOfflineVoteTimeWindow(firestorePengaturan);
    } catch (error) {
      console.error("Error loading offline votes data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat data: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isKoordinator && user?.wilayah && wilayahList.length > 0) {
      setSelectedWilayah(user.wilayah);
    }
  }, [isKoordinator, user?.wilayah, wilayahList]);

  useEffect(() => {
    loadData();
  }, []);

  const checkOfflineVoteTimeWindow = (pengaturan) => {
    const now = new Date();

    const tanggalMulai = pengaturan.tanggalMulaiSuaraOffline;
    const tanggalSelesai = pengaturan.tanggalSelesaiSuaraOffline;

    console.log("[v0] Checking time window:", {
      tanggalMulai,
      tanggalSelesai,
      currentTime: now.toISOString(),
    });

    if (!tanggalMulai || !tanggalSelesai) {
      setIsWithinOfflineVoteTimeWindow(true);
      setOfflineVoteTimeWindowMessage("");
      return; // Jika belum di-set, biarkan input
    }

    // Convert datetime-local strings to Date objects for proper comparison
    const startDateTime = new Date(tanggalMulai);
    const endDateTime = new Date(tanggalSelesai);

    console.log("[v0] Converted dates:", {
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
      now: now.toISOString(),
    });

    const isWithinTimeWindow = now >= startDateTime && now <= endDateTime;

    console.log("[v0] Within time window:", isWithinTimeWindow);

    setIsWithinOfflineVoteTimeWindow(isWithinTimeWindow);

    if (!isWithinTimeWindow) {
      const startDate = startDateTime.toLocaleString("id-ID");
      const endDate = endDateTime.toLocaleString("id-ID");
      const message =
        now < startDateTime
          ? `Waktu input suara offline belum dimulai. Mulai: ${startDate}`
          : `Waktu input suara offline telah berakhir. Selesai: ${endDate}`;

      setOfflineVoteTimeWindowMessage(message);

      Swal.fire({
        icon: "warning",
        title: "Di Luar Jam Input",
        html: `
          <div class="text-left">
            <p class="mb-3">Input suara offline hanya bisa dilakukan pada waktu berikut:</p>
            <p><strong>Mulai:</strong> ${startDate}</p>
            <p><strong>Selesai:</strong> ${endDate}</p>
            <p class="mt-3 text-sm text-gray-600">Waktu saat ini: ${now.toLocaleString(
              "id-ID",
            )}</p>
          </div>
        `,
        confirmButtonColor: "#f97316",
      });
    } else {
      setOfflineVoteTimeWindowMessage("");
    }
  };

  const saveSaksi = () => {
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data saksi berhasil disimpan",
      confirmButtonColor: "#10b981",
      timer: 2000,
    });
  };

  const filteredOfflinePemilih = offlinePemilih
    .filter(
      (p) => selectedWilayah === "*" || p.wilayahPemilih === selectedWilayah,
    )
    .sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

  const stats = {
    offline: filteredOfflinePemilih.length,
  };

  const handleVote = (selectedPemilih) => {
    // Check if all data is locked
    if (globalLockedAt) {
      Swal.fire({
        icon: "error",
        title: "Data Terkunci",
        text: "Semua data suara offline telah dikunci dan tidak dapat diubah",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!isWithinOfflineVoteTimeWindow) {
      Swal.fire({
        icon: "error",
        title: "Tidak Bisa Input",
        text: offlineVoteTimeWindowMessage,
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (tanggalPengesahan) {
      Swal.fire({
        icon: "warning",
        title: "Voting Ditutup",
        text: "Data suara offline sudah disahkan. Tidak dapat menambah data lagi.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (!selectedPemilih.verifikasiTanggal) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Divalidasi",
        text: "Pemilih harus divalidasi terlebih dahulu sebelum memilih",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const hasVoted = offlineVotes.find(
      (v) => v.pemilihId === selectedPemilih.id,
    );

    if (hasVoted) {
      Swal.fire({
        icon: "info",
        title: "Sudah Memilih",
        text: "Pemilih ini sudah melakukan voting offline",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    setEditingPemilih(selectedPemilih);
    // Auto-fill wilayah from pemilih data, and lock for koordinator
    setFormData({
      statusSuara: "SAH",
      pilihanCalon: "",
      wilayahPemilih: selectedPemilih.wilayahPemilih,
    });
    setShowModal(true);
  };

  const handleEdit = (voteData) => {
    if (globalLockedAt) {
      Swal.fire({
        icon: "error",
        title: "Data Terkunci",
        text: "Data suara offline telah dikunci dan tidak dapat diubah",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (tanggalPengesahan) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Diedit",
        text: "Data suara offline sudah disahkan. Tidak dapat diedit lagi.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    const foundPemilih = pemilih.find((p) => p.id === voteData.pemilihId);
    setEditingPemilih(foundPemilih);
    setEditingVoteId(voteData.id);
    setFormData({
      statusSuara: voteData.statusSuara,
      pilihanCalon: voteData.calonId ? String(voteData.calonId) : "",
      wilayahPemilih: voteData.wilayahPemilih,
    });
    setShowModal(true);
  };

  const handleDeleteVote = (voteId) => {
    if (globalLockedAt) {
      Swal.fire({
        icon: "error",
        title: "Data Terkunci",
        text: "Data suara offline telah dikunci dan tidak dapat dihapus",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (tanggalPengesahan) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Dihapus",
        text: "Data suara offline sudah disahkan. Tidak dapat dihapus lagi.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    Swal.fire({
      title: "Hapus Suara?",
      text: "Data suara akan dihapus secara permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOfflineVote(voteId);
          const updated = offlineVotes.filter((v) => v.id !== voteId);
          setOfflineVotes(updated);

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Suara offline berhasil dihapus",
            confirmButtonColor: "#10b981",
            timer: 2000,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Gagal menghapus suara: " + error.message,
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.wilayahPemilih ||
      !formData.statusSuara ||
      (formData.statusSuara === "SAH" && !formData.pilihanCalon)
    ) {
      Swal.fire({
        icon: "warning",
        title: "Validasi Gagal",
        text: "Semua field harus diisi!",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      const selectedCandidate =
        formData.statusSuara === "SAH"
          ? calon.find((c) => String(c.id) === String(formData.pilihanCalon))
          : null;

      if (formData.statusSuara === "SAH" && !selectedCandidate) {
        console.error(
          "[v0] Candidate not found for ID:",
          formData.pilihanCalon,
        );
        throw new Error("Kandidat tidak ditemukan");
      }

      const newVote = {
        pemilihId: editingPemilih.id,
        namaPemilih: editingPemilih.nama,
        alamatPemilih: `${editingPemilih.alamatJalan} Nomor ${editingPemilih.nomorRumah}`,
        nomorTelepon: editingPemilih.nomorHP,
        wilayahPemilih: formData.wilayahPemilih,
        wilayahId: formData.wilayahPemilih,
        jenisKelamin: editingPemilih.jenisKelamin,
        statusSuara: formData.statusSuara,
        pantarlih: "Admin System",
        timestamp: new Date().toISOString(), // ✅ FIX
      };

      if (formData.statusSuara === "SAH") {
        Object.assign(newVote, {
          calonId: selectedCandidate.id,
          nomorUrut: selectedCandidate.nomorUrut,
          calonNama: selectedCandidate.namaKetua,
          namaKetua: selectedCandidate.namaKetua,
          namaWakil: selectedCandidate.namaWakil,
        });
      }

      if (editingVoteId) {
        await updateOfflineVote(editingVoteId, newVote);
        const updatedVotes = offlineVotes.map((v) =>
          v.id === editingVoteId ? { ...newVote, id: editingVoteId } : v,
        );
        setOfflineVotes(updatedVotes);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Suara offline berhasil diperbarui",
          confirmButtonColor: "#10b981",
          timer: 2000,
        });
      } else {
        const created = await createOfflineVote(newVote);
        const updatedVotes = [...offlineVotes, { ...newVote, id: created.id }];
        setOfflineVotes(updatedVotes);

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Suara offline berhasil direkam",
          confirmButtonColor: "#10b981",
          timer: 2000,
        });
      }

      setShowModal(false);
      setEditingPemilih(null);
      setEditingVoteId(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan suara: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const getVoteStatus = (pemilihId) => {
    return offlineVotes.find((v) => v.pemilihId === pemilihId);
  };

  const getSaksiByWilayah = () => {
    if (selectedWilayah === "*") {
      return { saksi1: "-", saksi2: "-" };
    }

    const wilayah = wilayahList.find(
      (w) => w.wilayahPemilih === selectedWilayah,
    );

    return {
      saksi1: wilayah?.saksi1 || "-",
      saksi2: wilayah?.saksi2 || "-",
    };
  };

  const exportPDF = () => {
    console.log("[v0] Exporting PDF for Suara Offline...");

    try {
      const doc = new jsPDF("landscape");
      const pageWidth = doc.internal.pageSize.width;

      const header1 = pengaturan.judul1 || "";
      const header2 = pengaturan.judul2 || "";
      const header3 = pengaturan.judul3 || "";
      const ketuaPanitia = pengaturan.namaKetuaPanitia || "";

      let yPos = 20;

      /* ================= HEADER ================= */
      if (header1) {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(header1, pageWidth / 2, yPos, { align: "center" });
        yPos += 7;
      }

      if (header2) {
        doc.setFontSize(12);
        doc.text(header2, pageWidth / 2, yPos, { align: "center" });
        yPos += 7;
      }

      if (header3) {
        doc.setFontSize(12);
        doc.text(header3, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;
      }

      if (ketuaPanitia) {
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Ketua Panitia: ${ketuaPanitia}`, pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 8;
      }

      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("REKAM DATA SUARA OFFLINE", pageWidth / 2, yPos, {
        align: "center",
      });
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(
        `Wilayah Pemilih: ${
          selectedWilayah === "*" ? "Semua Wilayah" : selectedWilayah
        }`,
        14,
        yPos,
      );
      yPos += 5;
      doc.text(
        `Jumlah Pemilih Offline: ${filteredOfflinePemilih.length}
`,
        14,
        yPos,
      );
      yPos += 6;
      const { saksi1, saksi2 } = getSaksiByWilayah();

      doc.setFontSize(10);
      doc.text(`Saksi 1: ${saksi1}`, 14, yPos);
      yPos += 5;
      doc.text(`Saksi 2: ${saksi2}`, 14, yPos);
      yPos += 10;

      /* ================= BODY DATA ================= */
      const bodyRows = filteredOfflinePemilih.map((p, i) => {
        const voteData = offlineVotes.find((v) => v.pemilihId === p.id);

        return [
          i + 1,
          // p.nama,
          // `${p.alamatJalan} Nomor ${p.nomorRumah}`,
          // p.nomorHP || "-",
          voteData?.statusSuara || "-",
          voteData?.statusSuara === "SAH" ? voteData.calonNama : "-",
          voteData?.pantarlih || "-",
          voteData
            ? new Date(voteData.timestamp || voteData.tanggal).toLocaleString(
                "id-ID",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )
            : "-",
        ];
      });

      /* ================= TABEL ================= */
      autoTable(doc, {
        startY: yPos,

        /* ===== MULTI HEADER ===== */
        head: [
          [
            { content: "No", rowSpan: 2 },
            // { content: "Nama", rowSpan: 2 },
            // { content: "Alamat", rowSpan: 2 },
            // { content: "No Telepon", rowSpan: 2 },
            { content: "Status Suara", rowSpan: 2 },
            { content: "Pilihan", rowSpan: 2 },
            { content: "Rekam Data", colSpan: 2 },
          ],
          ["Pantarlih", "Tanggal / Jam"],
        ],

        body:
          bodyRows.length > 0
            ? bodyRows
            : [["", "Tidak ada pemilih offline", "", "", "", "", "", ""]],

        /* ===== STYLE UMUM ===== */
        styles: {
          fontSize: 9,
          cellPadding: 3,
          valign: "middle",
          lineColor: [200, 200, 200],
          lineWidth: 0.2,
        },

        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          halign: "center",
          fontStyle: "bold",
        },

        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },

        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { halign: "center", cellWidth: 25 },
          5: { cellWidth: 35 },
          6: { cellWidth: 30 },
          7: { cellWidth: 40 },
        },

        margin: { left: 14, right: 14 },

        /* ===== FOOTER OTOMATIS ===== */
        didDrawPage: () => {
          const pageHeight = doc.internal.pageSize.height;
          doc.setFontSize(8);
          doc.setFont(undefined, "normal");
          doc.text(
            "Perangkat Lunak Ini Disediakan Oleh manasukatour.com Semarang © 2025",
            14,
            pageHeight - 15,
          );
          doc.text("Untuk Kemajuan Negeri", 14, pageHeight - 10);
        },
      });

      /* ================= SAVE ================= */
      const fileName = `Suara-Offline-${
        selectedWilayah === "*" ? "Semua-Wilayah" : selectedWilayah
      }-${new Date().toISOString().split("T")[0]}.pdf`;

      doc.save(fileName);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "PDF berhasil diexport",
        confirmButtonColor: "#10b981",
        timer: 2000,
      });
    } catch (error) {
      console.error("[v0] Error exporting PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Export PDF",
        text: error.message || "Terjadi kesalahan saat membuat PDF.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleSavePengesahan = async () => {
    if (!tanggalPengesahan) {
      Swal.fire({
        icon: "error",
        title: "Pilih Tanggal",
        text: "Silakan pilih tanggal pengesahan",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    try {
      await savePengesahanOffline({ tanggal: tanggalPengesahan });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data suara offline berhasil disahkan",
        confirmButtonColor: "#10b981",
        timer: 2000,
      });

      loadData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menyimpan pengesahan: " + error.message,
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleClearPengesahan = () => {
    Swal.fire({
      title: "Hapus Pengesahan?",
      text: "Voting dapat ditambah kembali",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deletePengesahanOffline();

          setTanggalPengesahan("");

          Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Pengesahan dihapus",
            confirmButtonColor: "#10b981",
            timer: 2000,
          });

          loadData();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.message,
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
  };

  const handleLockAllData = async () => {
    const isUnlock = globalLockedAt;
    const title = isUnlock ? "Batalkan Kunci Data?" : "Kunci Semua Data?";
    const text = isUnlock
      ? "Data suara offline akan dapat diubah kembali"
      : "Semua pemilih tidak akan dapat melakukan voting atau perubahan data setelah ini";
    const confirmButtonText = isUnlock ? "Ya, Batalkan" : "Ya, Kunci";

    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isUnlock ? "#ef4444" : "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (isUnlock) {
            await deletePengesahanOffline();
            setGlobalLockedAt(null);
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Kunci data dibatalkan. Voting dapat dilanjutkan.",
              confirmButtonColor: "#10b981",
              timer: 2000,
            });
          } else {
            const lockTimestamp = new Date().toISOString();
            await savePengesahanOffline({ globalLockedAt: lockTimestamp });
            setGlobalLockedAt(lockTimestamp);
            Swal.fire({
              icon: "success",
              title: "Berhasil",
              text: "Semua data suara offline telah dikunci",
              confirmButtonColor: "#10b981",
              timer: 2000,
            });
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: error.message,
            confirmButtonColor: "#ef4444",
          });
        }
      }
    });
  };

  const getPaginatedOfflineData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredOfflinePemilih.slice(startIndex, endIndex);
  };

  const getTotalOfflinePages = () => {
    return Math.ceil(filteredOfflinePemilih.length / rowsPerPage);
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                Rekam Data Suara Offline
              </h1>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                Rekam suara pemilih offline
              </p>
              {selectedWilayah !== "*" && (
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <strong>Saksi 1:</strong> {getSaksiByWilayah().saksi1}
                  </p>
                  <p>
                    <strong>Saksi 2:</strong> {getSaksiByWilayah().saksi2}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleLockAllData}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-white transition-colors ${
                globalLockedAt
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-amber-500 hover:bg-amber-600"
              }`}
            >
              <span className="hidden sm:inline">
                {globalLockedAt ? "Batalkan" : "Kunci"}
              </span>
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          </div>
        </div>

        {globalLockedAt && (
          <div className="mt-2 text-sm text-amber-600 font-medium">
            Dikunci pada: {new Date(globalLockedAt).toLocaleString("id-ID")}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 space-y-6"
      >
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wilayah Pemilih
              </label>
              <select
                value={selectedWilayah}
                onChange={(e) => setSelectedWilayah(e.target.value)}
                disabled={isKoordinator}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  isKoordinator
                    ? "bg-gray-100 opacity-75 cursor-not-allowed"
                    : "bg-white"
                }`}
              >
                {isKoordinator ? (
                  <option>
                    {user?.wilayah} (Terkunci ke {user?.wilayah})
                  </option>
                ) : (
                  <>
                    <option value="*">Semua Wilayah</option>
                    {wilayahList.map((w) => (
                      <option key={w.wilayahPemilih} value={w.wilayahPemilih}>
                        {w.wilayahPemilih}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {isKoordinator && (
                <p className="text-xs text-gray-500 mt-1">
                  Wilayah terkunci ke {user?.wilayah}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-xs md:text-sm text-blue-600">
              Jumlah Pemilih Offline
            </p>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">
              {stats.offline}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <p className="text-xs md:text-sm text-green-600">Status</p>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              Aktif
            </p>
          </div>
        </div>

        {offlineVoteTimeWindowMessage && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              {offlineVoteTimeWindowMessage}
            </p>
          </div>
        )}

        {tanggalPengesahan && (
          <div className="bg-green-100/50 rounded-lg p-3 md:p-4 border border-green-500/30">
            <p className="text-xs md:text-sm text-green-600 font-semibold">
              Data Suara Offline Sudah Disahkan pada{" "}
              {new Date(tanggalPengesahan).toLocaleDateString("id-ID")}
            </p>
            <p className="text-xs md:text-sm text-green-600">
              Voting tidak dapat ditambah atau diedit lagi.
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow p-4 sm:p-6 mt-6 border border-gray-200"
      >
        {/* Show data dropdown at TOP */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700">Tampilkan</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">data per halaman</span>
          </div>
          <span className="text-sm text-gray-600">
            Total: {filteredOfflinePemilih.length} data
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900">
                  No
                </th>
                {/* <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900">
                  Nama
                </th> */}
                {/* <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900">
                  Alamat
                </th> */}
                {/* <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900">
                  No Telepon
                </th> */}
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900">
                  Status Suara
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-left font-semibold text-gray-900">
                  Pilihan
                </th>
                <th
                  colSpan={2}
                  className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-gray-900"
                >
                  Rekam Data
                </th>
                <th className="px-2 md:px-4 py-2 md:py-3 text-right font-semibold text-gray-900">
                  Aksi
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th colSpan={3}></th>
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-gray-600">
                  Pantarlih
                </th>
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-gray-600">
                  Tanggal / Jam
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedOfflineData().length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    Belum ada data suara offline
                  </td>
                </tr>
              ) : (
                getPaginatedOfflineData().map((pemilih, index) => {
                  const voteStatus = getVoteStatus(pemilih.id);

                  return (
                    <tr
                      key={voteStatus?.id || pemilih.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-2 md:px-4 py-2 md:py-3 text-sm text-gray-900">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </td>

                      <td className="px-2 md:px-4 py-2 md:py-3 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            voteStatus?.statusSuara === "SAH"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {voteStatus?.statusSuara || "-"}
                        </span>
                      </td>

                      <td className="px-2 md:px-4 py-2 md:py-3 text-sm text-gray-900">
                        {voteStatus?.calonNama || "-"}
                      </td>

                      <td className="px-2 md:px-4 py-2 md:py-3 text-xs text-gray-600">
                        {voteStatus?.timestamp
                          ? new Date(voteStatus.timestamp).toLocaleString(
                              "id-ID",
                            )
                          : "-"}
                      </td>

                      <td className="px-2 md:px-4 py-2 md:py-3 text-right">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleVote(pemilih)}
                            disabled={
                              !!voteStatus ||
                              !isWithinOfflineVoteTimeWindow ||
                              globalLockedAt
                            }
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                              voteStatus ||
                              !isWithinOfflineVoteTimeWindow ||
                              globalLockedAt
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            }`}
                          >
                            {voteStatus ? "Selesai" : "Vote"}
                          </button>

                          {voteStatus && (
                            <>
                              <button
                                onClick={() => handleEdit(voteStatus)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-yellow-500 text-white hover:bg-yellow-600"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDeleteVote(voteStatus.id)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-red-500 text-white hover:bg-red-600"
                              >
                                Hapus
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination at BOTTOM */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">
            Halaman {currentPage} dari {getTotalOfflinePages() || 1}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <button
              onClick={() =>
                setCurrentPage(
                  Math.min(getTotalOfflinePages(), currentPage + 1),
                )
              }
              disabled={currentPage === getTotalOfflinePages()}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </motion.div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Rekam Data Suara Offline
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Pemilih Info */}
                {/* <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm font-medium text-gray-700">Pemilih</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {editingPemilih?.nama}
                  </p>
                  <p className="text-xs text-gray-600">
                    {editingPemilih?.wilayahPemilih}
                  </p>
                </div> */}

                {/* Wilayah - Locked for Koordinator */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wilayah Pemilih{" "}
                    {isKoordinator && "(Terkunci ke " + user?.wilayah + ")"}
                  </label>
                  <select
                    name="wilayahPemilih"
                    value={formData.wilayahPemilih}
                    onChange={handleChange}
                    disabled={isKoordinator}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      isKoordinator
                        ? "bg-gray-100 opacity-75 cursor-not-allowed"
                        : "bg-white"
                    }`}
                  >
                    <option value="">Pilih Wilayah</option>
                    {wilayahList
                      .filter(
                        (w) =>
                          !isKoordinator || w.wilayahPemilih === user?.wilayah,
                      )
                      .map((w) => (
                        <option key={w.wilayahPemilih} value={w.wilayahPemilih}>
                          {w.wilayahPemilih}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Status Suara */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Suara
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="statusSuara"
                        value="SAH"
                        checked={formData.statusSuara === "SAH"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">SAH</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="statusSuara"
                        value="TIDAK SAH"
                        checked={formData.statusSuara === "TIDAK SAH"}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        TIDAK SAH
                      </span>
                    </label>
                  </div>
                </div>

                {/* Pilihan Calon */}
                {formData.statusSuara === "SAH" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilihan Suara
                    </label>
                    <select
                      name="pilihanCalon"
                      value={formData.pilihanCalon}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Pilih Calon</option>
                      {calon.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.nomorUrut}. {c.namaKetua}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
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
