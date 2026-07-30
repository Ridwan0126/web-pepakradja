"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Vote, CheckCircle, ChevronRight, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import {
  getPengaturan,
  getAllCandidates,
  getAllVoters,
  updateVoter,
  createOnlineVote,
  getAllOfflineVotes,
  getAllRegions,
  getAllOnlineVotes,
} from "../utils/firestore";

const SUPERADMIN = {
  nomorHP: "08999999999",
  token: "SUPERADMIN2024",
};

export default function VotingStandalone() {
  const [step, setStep] = useState(1);
  const [nomorHP, setNomorHP] = useState("");
  const [nomorRumah, setNomorRumah] = useState("");
  const [pemilih, setPemilih] = useState(null);
  const [calon, setCalon] = useState([]);
  const [selectedCalon, setSelectedCalon] = useState(null);
  const [pengaturan, setPengaturan] = useState({});
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [votingStatus, setVotingStatus] = useState("");
  const [canVote, setCanVote] = useState(false);
  const [wilayahList, setWilayahList] = useState([]);
  const [allPemilih, setAllPemilih] = useState([]);
  const [votingPeriodStatus, setVotingPeriodStatus] = useState("");
  const [pencoblosanStatus, setPencoblosanStatus] = useState("");
  const [votesOffline, setVotesOffline] = useState([]);
  const [votesOnline, setVotesOnline] = useState([]);
  const [results, setResults] = useState({});
  const [offlineLocked, setOfflineLocked] = useState(false);
  const [detailCalon, setDetailCalon] = useState(null);
  const [userVoted, setUserVoted] = useState(false);
  const navigate = useNavigate();
  const [offlinePeriodStatus, setOfflinePeriodStatus] = useState("before");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          pengaturanData,
          calonData,
          wilayahData,
          pemilihData,
          votesOfflineData,
          votesOnlineData,
        ] = await Promise.all([
          getPengaturan(),
          getAllCandidates(),
          getAllRegions(),
          getAllVoters(),
          getAllOfflineVotes(),
          getAllOnlineVotes(),
        ]);

        setPengaturan(pengaturanData || {});
        setCalon(calonData || []);
        setWilayahList(wilayahData || []);
        setAllPemilih(pemilihData || []);
        setVotesOffline(votesOfflineData || []);
        setVotesOnline(votesOnlineData || []);

        const hasOfflineLock = pengaturanData?.offlineLockedAt ? true : false;
        setOfflineLocked(hasOfflineLock);

        console.log("[v0] Loaded pengaturan from Firestore:", pengaturanData);
      } catch (error) {
        console.error("[v0] Error loading data from Firestore:", error);
        // Fallback to showing error
        Swal.fire({
          icon: "error",
          title: "Error Loading Data",
          text: "Gagal memuat data dari Firestore. Silakan refresh halaman.",
          confirmButtonColor: "#ef4444",
        });
      }
    };

    loadData();
  }, []);
  useEffect(() => {
    if (
      !pengaturan?.tanggalMulaiSuaraOffline ||
      !pengaturan?.tanggalSelesaiSuaraOffline
    ) {
      setOfflinePeriodStatus("before");
      return;
    }

    const now = new Date();
    const offlineStart = new Date(pengaturan.tanggalMulaiSuaraOffline);
    const offlineEnd = new Date(pengaturan.tanggalSelesaiSuaraOffline);

    if (now < offlineStart) {
      setOfflinePeriodStatus("before");
    } else if (now >= offlineStart && now <= offlineEnd) {
      setOfflinePeriodStatus("during");
    } else {
      setOfflinePeriodStatus("after");
    }
  }, [pengaturan]);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimers(pengaturan);
    }, 1000);

    return () => clearInterval(interval);
  }, [pengaturan]);

  const updateTimers = (settings) => {
    if (
      !settings.tanggalPemungutanSuara ||
      !settings.jamPemungutanSuaraSelesai
    ) {
      setCountdown("");
      setVotingPeriodStatus("before");
      return;
    }

    const now = new Date();
    const votingStart = new Date(settings.tanggalPemungutanSuara);

    // Parse jam selesai
    const jamSelesai = settings.jamPemungutanSuaraSelesai || "17:00";
    const [jamS, menitS] = jamSelesai.split(":").map(Number);

    const votingEnd = new Date(votingStart);
    votingEnd.setHours(jamS, menitS, 59, 999);

    if (now < votingStart) {
      setVotingPeriodStatus("before");
      const diff = votingStart - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `Pemilihan dimulai dalam ${days}h ${hours}j ${minutes}m ${seconds}s`,
      );
    } else if (now >= votingStart && now <= votingEnd) {
      setVotingPeriodStatus("during");
      const diff = votingEnd - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `Pemilihan berakhir dalam ${hours}h ${minutes}m ${seconds}s`,
      );
    } else {
      setVotingPeriodStatus("after");
      setCountdown("Pemilihan telah berakhir");
    }
  };

  useEffect(() => {
    if (votingPeriodStatus === "after" && pemilih) {
      setStep(4);
    }
  }, [votingPeriodStatus, pemilih]);

  const handleLogin = (e) => {
    e.preventDefault();

    const normalizedNomorHP = nomorHP.startsWith("+62")
      ? nomorHP
      : "+62" + nomorHP.replace(/^0/, "");

    if (normalizedNomorHP === SUPERADMIN.nomorHP && nomorRumah === "999999") {
      setIsSuperAdmin(true);
      setPemilih({ nama: "SuperAdmin", nomorHP: SUPERADMIN.nomorHP });
      setStep(2);
      Swal.fire({
        icon: "info",
        title: "Mode SuperAdmin",
        text: "Anda login sebagai SuperAdmin. Anda hanya dapat melihat tampilan, tidak dapat melakukan voting.",
        confirmButtonText: "OK",
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    const found = allPemilih.find(
      (p) =>
        p.nomorHP === normalizedNomorHP &&
        String(p.nomorRumah) === String(nomorRumah),
    );

    if (!found) {
      Swal.fire({
        icon: "error",
        title: "Data Tidak Ditemukan",
        text: "Nomor HP atau Nomor Rumah tidak sesuai. Hubungi Panitia Pemilihan di wilayah Anda.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!found.verifikasiSesuai) {
      Swal.fire({
        icon: "error",
        title: "Data pemilih tidak terverifikasi",
        text: "Hubungi Panitia Pemilihan di wilayah Anda.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    // 🚫 BLOKIR PEMILIH OFFLINE
    if (found.caraMemilih === "offline") {
      Swal.fire({
        icon: "info",
        title: "Pemilih Offline",
        text: "Anda terdaftar sebagai pemilih offline. Silakan melakukan pemungutan suara secara langsung di TPS.",
        confirmButtonColor: "#3b82f6",
      });

      setPemilih(found);
      setUserVoted(false); // agar UI terkunci
      setStep(2);
      return;
    }
    const hasOnlineVote = votesOnline.some((v) => v.pemilihId === found.id);

    if (hasOnlineVote) {
      Swal.fire({
        icon: "warning",
        title: "Anda Sudah Memilih",
        text: "Data menunjukkan Anda sudah memberikan suara secara online.",
        confirmButtonColor: "#f59e0b",
      });
      setUserVoted(true);
      setPemilih(found);
      setStep(2);
      return;
    }

    const hasOfflineVote = votesOffline.some((v) => v.pemilihId === found.id);
    if (hasOfflineVote) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Voting Online",
        text: "Anda sudah tercatat sebagai pemilih offline. Anda tidak dapat memberikan suara secara online.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (found.sudahMemilih === true) {
      setUserVoted(true);
    } else {
      setUserVoted(false);
    }

    if (pengaturan.jamPemungutanSuaraSelesai) {
      const now = new Date();
      const votingStart = new Date(pengaturan.tanggalPemungutanSuara);
      const [jamS, menitS] = pengaturan.jamPemungutanSuaraSelesai
        .split(":")
        .map(Number);
      const votingEnd = new Date(votingStart);
      votingEnd.setHours(jamS, menitS, 59, 999);

      if (now > votingEnd) {
        Swal.fire({
          icon: "info",
          title: "Waktu pemungutan suara sudah selesai",
          text: "Anda tidak bisa memberikan suara lagi.",
          confirmButtonColor: "#3b82f6",
        });
        setPemilih(found);
        setStep(4);
        return;
      }
    }

    setPemilih(found);
    setIsSuperAdmin(false);
    setStep(2);
  };

  const handleVote = async (calonData) => {
    if (pemilih?.caraMemilih === "offline") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Pemilih offline tidak diperbolehkan melakukan voting online.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (votingPeriodStatus !== "during") {
      let message = "";
      if (votingPeriodStatus === "before") {
        message =
          "Waktu voting belum dimulai. Silakan tunggu hingga tanggal yang ditentukan.";
      } else if (votingPeriodStatus === "after") {
        message =
          "Waktu voting sudah berakhir. Terima kasih atas partisipasi Anda.";
      }

      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Voting",
        text: message,
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (isSuperAdmin) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Dapat Voting",
        text: "SuperAdmin tidak dapat melakukan voting. Anda hanya dapat melihat tampilan.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (!calonData) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Calon",
        text: "Silakan pilih salah satu calon terlebih dahulu.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      await createOnlineVote({
        pemilihId: pemilih.id,
        namaPemilih: pemilih.nama,
        nomorTelepon: pemilih.nomorHP,
        wilayahId: pemilih.wilayahPemilih || pemilih.wilayahId,
        wilayahNama: pemilih.wilayahPemilih || pemilih.wilayah,

        calonId: calonData.id,
        nomorUrut: calonData.nomorUrut,
        calonNama: calonData.namaKetua,
        namaKetua: calonData.namaKetua,
        namaWakil: calonData.namaWakil,

        statusSuara: "SAH",
        timestamp: new Date().toISOString(),
      });

      console.log("[v0] Vote saved successfully to Firestore");

      await updateVoter(pemilih.id, { sudahMemilih: true });

      console.log("[v0] Voter updated as sudahMemilih");

      setSelectedCalon(calonData);
      setStep(3);

      Swal.fire({
        icon: "success",
        title: "Suara berhasil disimpan!",
        html: '<p style="font-style: italic; margin-top: 16px;">"Terima kasih telah turut berperan serta dalam pemilihan dan menentukan masa depan"</p>',
        confirmButtonColor: "#10b981",
      }).then(() => {
        setTimeout(() => {
          setStep(4);
        }, 1000);
      });
    } catch (error) {
      console.error("Error saving vote:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Menyimpan Suara",
        text:
          error.message ||
          "Terjadi kesalahan saat menyimpan suara Anda. Silakan coba lagi.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleDirectVote = async (calonData) => {
    if (pemilih?.caraMemilih === "offline") {
      Swal.fire({
        icon: "error",
        title: "Akses Ditolak",
        text: "Pemilih offline tidak dapat melakukan voting online.",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (!pemilih) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Data pemilih tidak ditemukan",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    if (votingPeriodStatus !== "during") {
      Swal.fire({
        icon: "warning",
        title: "Belum Waktunya",
        text: "Waktu voting belum dimulai atau sudah berakhir",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    if (!calonData) {
      Swal.fire({
        icon: "warning",
        title: "Pilih Calon",
        text: "Silakan pilih salah satu calon terlebih dahulu.",
        confirmButtonColor: "#f59e0b",
      });
      return;
    }

    try {
      await createOnlineVote({
        pemilihId: pemilih.id,
        calonId: calonData.id,
        timestamp: new Date(),
        nomorHP: pemilih.nomorHP,
        nomorRumah: pemilih.nomorRumah,
        namaPemilih: pemilih.nama,
        wilayahId: pemilih.wilayahPemilih || pemilih.wilayahId,
        wilayahNama: pemilih.wilayahPemilih || pemilih.wilayah,

        calonNama: calonData.namaKetua,
        namaKetua: calonData.namaKetua,
        namaWakil: calonData.namaWakil,
        nomorUrut: calonData.nomorUrut,
        statusSuara: "SAH",
      });

      await updateVoter(pemilih.id, { sudahMemilih: true });

      setSelectedCalon(calonData);
      setUserVoted(true);

      Swal.fire({
        icon: "success",
        title: "Suara Anda Tercatat",
        text: `Anda telah memilih ${
          calonData.namaKetua || calonData.nomorUrut
        }`,
        confirmButtonColor: "#10b981",
      });
    } catch (error) {
      console.error("[v0] Error voting:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Memilih",
        text: error.message || "Terjadi kesalahan saat mencatat suara Anda",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleShowDetail = (item, e) => {
    e.stopPropagation();
    setDetailCalon(item);
  };

  // Calculate results for display
  const getResults = async () => {
    const offlineVotesArray = votesOffline || [];
    const onlineVotesArray = votesOnline || [];
    const allVotesArray = [...offlineVotesArray, ...onlineVotesArray];
    const allPemilihList = allPemilih || [];
    const allWilayahList = wilayahList || [];
    const allCalonList = calon || [];

    console.log("[v0] Debug getResults:");
    console.log("[v0] allPemilihList.length:", allPemilihList.length);
    console.log(
      "[v0] allPemilihList:",
      allPemilihList.map((p) => ({
        id: p.id,
        nama: p.nama,
        wilayah: p.wilayahPemilih,
      })),
    );
    console.log("[v0] onlineVotesArray.length:", onlineVotesArray.length);
    console.log(
      "[v0] onlineVotesArray pemilihId:",
      onlineVotesArray.map((v) => ({
        pemilihId: v.pemilihId,
        nama: v.pemilihNama,
      })),
    );
    console.log("[v0] offlineVotesArray.length:", offlineVotesArray.length);
    console.log(
      "[v0] offlineVotesArray pemilihId:",
      offlineVotesArray.map((v) => ({
        pemilihId: v.pemilihId,
        nama: v.pemilihNama,
      })),
    );

    const voterWhoHaveVoted = new Set();
    onlineVotesArray.forEach((v) => {
      if (v.pemilihId) voterWhoHaveVoted.add(v.pemilihId);
    });
    offlineVotesArray.forEach((v) => {
      if (v.pemilihId) voterWhoHaveVoted.add(v.pemilihId);
    });

    console.log("[v0] voterWhoHaveVoted.size:", voterWhoHaveVoted.size);

    const totalPemilih = allPemilihList.length;
    const totalSuaraMasuk = allVotesArray.length;
    const suaraSah = allVotesArray.filter(
      (v) => v.statusSuara === "SAH",
    ).length;
    const suaraTidakSah = allVotesArray.filter(
      (v) => v.statusSuara === "TIDAK SAH",
    ).length;
    const tidakMemilih = totalPemilih - voterWhoHaveVoted.size;

    console.log(
      "[v0] tidakMemilih calculation: totalPemilih(" +
        totalPemilih +
        ") - voterWhoHaveVoted(" +
        voterWhoHaveVoted.size +
        ") = " +
        tidakMemilih,
    );

    const calonResults = allCalonList.map((c) => {
      const offlineVotesCount = offlineVotesArray.filter(
        (v) =>
          (v.calonId === c.id || v.pilihanCalon === c.id) &&
          v.statusSuara === "SAH",
      ).length;
      const onlineVotesCount = onlineVotesArray.filter(
        (v) =>
          (v.calonId === c.id || v.pilihanCalon === c.id) &&
          v.statusSuara === "SAH",
      ).length;
      const total = offlineVotesCount + onlineVotesCount;
      const percentage =
        suaraSah > 0 ? ((total / suaraSah) * 100).toFixed(2) : 0;

      return {
        ...c,
        votes: total,
        percentage,
      };
    });

    const sortedCalonResults = (calonResults || []).sort(
      (a, b) => b.votes - a.votes,
    );

    const wilayahStats = (wilayahList || []).map((w) => {
      const normalizeWilayah = (str) => {
        if (!str) return "";
        return str.toUpperCase().replace(/\s+/g, "").replace(/-/g, "");
      };

      const wilayahNormalized = normalizeWilayah(w.nama);

      console.log(
        "[v0] Processing wilayah:",
        w.nama,
        "normalized:",
        wilayahNormalized,
      );

      // Count total votes (online + offline) in this wilayah
      const votesInWilayah = allVotesArray.filter((v) => {
        let voteWilayah = "";

        // Try from pemilih data first
        const pemilih = allPemilihList.find((p) => p.id === v.pemilihId);
        if (pemilih && pemilih.wilayahPemilih) {
          voteWilayah = pemilih.wilayahPemilih;
        }
        // Fallback to wilayahNama directly from vote data
        else if (v.wilayahNama) {
          voteWilayah = v.wilayahNama;
        }

        if (!voteWilayah) {
          console.log("[v0] No wilayah found for vote:", {
            pemilihId: v.pemilihId,
            wilayahNama: v.wilayahNama,
          });
          return false;
        }

        const voteWilayahNormalized = normalizeWilayah(voteWilayah);
        const isMatch = voteWilayahNormalized === wilayahNormalized;

        console.log("[v0] Vote matching:", {
          voteWilayah,
          voteWilayahNormalized,
          wilayahNormalized,
          isMatch,
        });

        return isMatch;
      });

      const totalVotesInWilayah = votesInWilayah.length;
      const percentage =
        totalSuaraMasuk > 0
          ? ((totalVotesInWilayah / totalSuaraMasuk) * 100).toFixed(1)
          : 0;

      console.log("[v0] Wilayah vote count:", {
        nama: w.nama,
        votes: totalVotesInWilayah,
        percentage,
        totalSuaraMasuk,
      });

      return {
        nama: w.nama,
        votes: totalVotesInWilayah,
        percentage,
      };
    });

    console.log("[v0] Final wilayahStats:", wilayahStats);

    return {
      totalPemilih,
      totalSuaraMasuk,
      suaraSah,
      suaraTidakSah,
      tidakMemilih,
      candidates: sortedCalonResults,
      wilayahStats,
    };
  };

  useEffect(() => {
    const fetchResults = async () => {
      const resultsData = await getResults();
      setResults(resultsData);
    };

    fetchResults();
  }, [votesOffline, votesOnline, allPemilih, calon, wilayahList]);

  const handleReset = () => {
    setStep(1);
    setNomorHP("");
    setNomorRumah("");
    setPemilih(null);
    setSelectedCalon(null);
    setIsSuperAdmin(false);
  };

  const handleFinishVoting = () => {
    navigate("/closing-ad");
  };

  const handleLogout = () => {
    navigate("/closing-ad");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="text-center space-y-1">
            {pengaturan.judul1 && (
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                {pengaturan.judul1}
              </h1>
            )}
            {pengaturan.judul2 && (
              <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300">
                {pengaturan.judul2}
              </h2>
            )}
            {pengaturan.judul3 && (
              <h3 className="text-xs sm:text-sm md:text-base font-medium text-gray-600 dark:text-gray-400">
                {pengaturan.judul3}
              </h3>
            )}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 italic mt-2">
              Suara Anda Menentukan Kemajuan Wilayah, Pastikan Suaramu Tercatat.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Login */}
          {step === 1 && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
                    <Vote className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Login Pemilih
                  </h2>
                  <div className="space-y-1 mb-4">
                    {pengaturan.judul1 && (
                      <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                        {pengaturan.judul1}
                      </p>
                    )}
                    {pengaturan.judul2 && (
                      <p className="text-sm sm:text-base font-semibold text-blue-500 dark:text-blue-400">
                        {pengaturan.judul2}
                      </p>
                    )}
                    {pengaturan.judul3 && (
                      <p className="text-xs sm:text-sm font-medium text-blue-400 dark:text-blue-500">
                        {pengaturan.judul3}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Masukkan Nomor HP dan Nomor Rumah Anda untuk login
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nomor HP
                    </label>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                      <span className="px-4 py-3 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium border-r border-gray-300 dark:border-gray-500">
                        +62
                      </span>
                      <input
                        type="tel"
                        value={nomorHP}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setNomorHP(value);
                        }}
                        placeholder="Contoh: 81234567890"
                        className="flex-1 px-4 py-3 bg-transparent text-gray-900 dark:text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nomor Rumah
                    </label>
                    <input
                      type="text"
                      value={nomorRumah}
                      onChange={(e) => setNomorRumah(e.target.value)}
                      placeholder="Contoh: 12 atau 12A"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <span>Login</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* Step 2: Pilih Calon - UPDATED WITH NEW MESSAGING */}
          {step === 2 && (
            <motion.div
              key="vote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Logout Button */}
              <div className="flex justify-end">
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="
      flex items-center gap-2
      px-6 py-3
      text-base font-semibold
      text-white
      bg-gradient-to-r from-red-500 to-rose-600
      hover:from-red-600 hover:to-rose-700
      rounded-full
      shadow-lg hover:shadow-xl
      transition-all
    "
                >
                  <span>Keluar</span>
                </motion.button>
              </div>

              {userVoted ? (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="text-sm sm:text-base font-medium">
                      Terima Kasih telah Memilih
                    </p>
                  </div>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
                    {pengaturan.pengumuman ||
                      "Suara Anda telah tercatat. Tunggu hingga pemilihan selesai."}
                  </p>
                  {votingPeriodStatus === "during" && countdown && (
                    <p className="text-sm sm:text-base mt-3">
                      Sisa waktu: {countdown}
                    </p>
                  )}
                </div>
              ) : votingPeriodStatus === "before" ? (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="text-sm sm:text-base font-medium">
                      Belum saatnya pemungutan suara,
                    </p>
                  </div>

                  <p className="text-base sm:text-lg md:text-xl font-semibold">
                    Pemungutan Suara dilaksanakan pada :
                  </p>

                  <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1">
                    {new Date(
                      pengaturan?.tanggalPencoblosan,
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    Jam{" "}
                    {new Date(
                      pengaturan?.tanggalPencoblosan,
                    ).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}{" "}
                    s.d. {pengaturan?.jamPencoblosanSelesai} WIB
                  </p>

                  <p className="text-sm sm:text-base mt-3 italic opacity-90">
                    Pastikan pilihanmu dengan mengenali Visi & Misi Para
                    Kandidat.
                  </p>
                </div>
              ) : votingPeriodStatus === "during" && countdown ? (
                <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 sm:p-6 text-center shadow-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    <p className="text-sm sm:text-base font-medium">
                      Silahkan Tentukan Pilihan Anda:
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold">
                    Jangan sampai berakhir pada{" "}
                    {new Date(
                      pengaturan?.tanggalPemungutanSuara,
                    ).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    jam {pengaturan?.jamPemungutanSuaraSelesai}
                  </p>
                  <p className="text-sm sm:text-base mt-3">
                    Sisa waktu: {countdown}
                  </p>
                </div>
              ) : null}

              {/* Candidate cards section - only show if not voted or voting still ongoing */}
              {votingPeriodStatus !== "after" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                  {calon &&
                    calon.length > 0 &&
                    calon.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                      >
                        <motion.button
                          onClick={() => handleDirectVote(item)}
                          disabled={
                            isSuperAdmin ||
                            userVoted ||
                            votingPeriodStatus !== "during" ||
                            pemilih?.caraMemilih === "offline" // ⬅️ TAMBAHAN
                          }
                          className={`flex-1 relative overflow-hidden ${
                            userVoted || votingPeriodStatus !== "during"
                              ? "cursor-not-allowed opacity-60"
                              : ""
                          }`}
                        >
                          {item.foto && (
                            <div className="aspect-square relative overflow-hidden bg-gray-200 dark:bg-gray-700">
                              <img
                                src={item.foto || "/placeholder.svg"}
                                alt={item.namaKetua}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded-full font-bold text-lg">
                                No. {item.nomorUrut}
                              </div>
                            </div>
                          )}

                          <div className="p-4 sm:p-5 text-left space-y-3">
                            <div>
                              <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1">
                                KETUA
                              </p>
                              <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                {item.namaKetua}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {item.alamatKetua}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mb-1">
                                WAKIL
                              </p>
                              <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                                {item.namaWakil}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {item.alamatWakil}
                              </p>
                            </div>
                            {item.jargon && (
                              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 italic text-center">
                                  "{item.jargon}"
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: userVoted ? 1 : 1.02 }}
                          whileTap={{ scale: userVoted ? 1 : 0.98 }}
                          onClick={(e) => {
                            if (votingPeriodStatus === "before") {
                              handleShowDetail(item, e);
                            } else if (
                              votingPeriodStatus === "during" &&
                              !userVoted
                            ) {
                              handleDirectVote(item);
                            }
                          }}
                          disabled={isSuperAdmin || userVoted}
                          className={`w-full py-2.5 sm:py-3 rounded-b-2xl font-semibold transition-all border-2 border-t-0 ${
                            votingPeriodStatus === "before"
                              ? "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-100"
                              : votingPeriodStatus === "during" && !userVoted
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          } ${
                            isSuperAdmin || userVoted
                              ? "opacity-75 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {votingPeriodStatus === "before"
                            ? "Visi & Misi"
                            : votingPeriodStatus === "during"
                              ? userVoted
                                ? "Sudah Memilih"
                                : "Pilih"
                              : "Voting Selesai"}
                        </motion.button>
                      </motion.div>
                    ))}
                </div>
              )}

              {/* Detail modal for visi & misi */}
              {detailCalon && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                  >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-4 sm:p-6 flex justify-between items-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        Calon #{detailCalon.nomorUrut}
                      </h3>
                      <button
                        onClick={() => setDetailCalon(null)}
                        className="text-white hover:bg-white/20 p-2 rounded-lg transition"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            src={
                              detailCalon.foto ||
                              "/placeholder.svg?height=280&width=280&query=candidate+photo"
                            }
                            alt={detailCalon.namaKetua}
                            className="w-64 h-64 object-cover rounded-xl shadow-lg border-4 border-gray-200 dark:border-gray-700"
                          />
                        </div>
                      </div>

                      {detailCalon.jargon && (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg border-l-4 border-blue-500">
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                            Jargon
                          </p>
                          <p className="text-lg font-bold text-gray-900 dark:text-white italic">
                            "{detailCalon.jargon}"
                          </p>
                        </div>
                      )}

                      <div className="space-y-5">
                        {/* Ketua */}
                        <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-lg">
                          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-3">
                            Ketua
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {detailCalon.namaKetua || "Belum ada data"}
                          </p>
                          {detailCalon.alamatKetua && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {detailCalon.alamatKetua}
                            </p>
                          )}
                        </div>

                        {detailCalon.namaWakil && (
                          <div className="bg-gray-50 dark:bg-gray-700/30 p-5 rounded-lg">
                            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide mb-3">
                              Wakil
                            </p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {detailCalon.namaWakil}
                            </p>
                            {detailCalon.alamatWakil && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {detailCalon.alamatWakil}
                              </p>
                            )}
                          </div>
                        )}

                        {detailCalon.dataDiri && (
                          <div className="bg-sky-50 dark:bg-sky-900/20 p-5 rounded-lg border-l-4 border-sky-500">
                            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wide mb-3">
                              Data Diri
                            </p>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                              {detailCalon.dataDiri}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-900/20 p-5 rounded-lg border-l-4 border-amber-500">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-3">
                          Alamat
                        </p>
                        <p className="text-gray-700 dark:text-gray-300">
                          {detailCalon.alamatKetua || "Belum ada data"}
                        </p>
                      </div>

                      <div className="space-y-5">
                        {/* Visi */}
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border-l-4 border-green-500">
                          <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-3">
                            Visi
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {detailCalon.visi || "Belum ada data"}
                          </p>
                        </div>

                        {/* Misi */}
                        <div className="bg-green-50 dark:bg-green-900/20 p-5 rounded-lg border-l-4 border-green-500">
                          <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide mb-3">
                            Misi
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {detailCalon.misi || "Belum ada data"}
                          </p>
                        </div>
                      </div>
                      {detailCalon.programKerja && (
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg border-l-4 border-indigo-500">
                          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mb-3">
                            Program Kerja
                          </p>
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            {detailCalon.programKerja}
                          </p>
                        </div>
                      )}

                      {/* Close Button */}
                      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => setDetailCalon(null)}
                          className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}

              {isSuperAdmin && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 px-6 py-3 sm:py-4 bg-gray-600 text-white rounded-xl font-medium hover:bg-gray-700 shadow-lg transition-all text-sm sm:text-base"
                >
                  Kembali ke Login
                </motion.button>
              )}
            </motion.div>
          )}

          {/* Step 3: Success Message */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="inline-flex p-4 sm:p-6 rounded-full bg-green-100 dark:bg-green-900/30 mb-4 sm:mb-6"
                >
                  <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-600 dark:text-green-400" />
                </motion.div>

                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Suara Berhasil Disimpan!
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-4 italic">
                  "Terima kasih telah turut berperan serta dalam pemilihan dan
                  menentukan masa depan"
                </p>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 sm:p-6 max-w-md mx-auto mb-6 sm:mb-8">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600 dark:text-gray-400">
                        Pemilih:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {pemilih?.nama}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600 dark:text-gray-400">
                        Pilihan:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        No. {selectedCalon?.nomorUrut} -{" "}
                        {selectedCalon?.namaKetua}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base">
                      <span className="text-gray-600 dark:text-gray-400">
                        Waktu:
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {new Date().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Menuju halaman hasil...
                </p>
              </div>
            </motion.div>
          )}

          {/* Step 4: Results - UPDATED WITH LOCK STATUS CHECK */}
          {step === 4 && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {votingPeriodStatus === "before" &&
                    "BELUM ADA HASIL PEMUNGUTAN SUARA"}
                  {votingPeriodStatus === "during" && "HASIL SEMENTARA"}
                  {votingPeriodStatus === "after" &&
                    offlineLocked &&
                    "HASIL AKHIR PEMUNGUTAN SUARA"}
                  {votingPeriodStatus === "after" &&
                    !offlineLocked &&
                    "HASIL SEMENTARA"}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {votingPeriodStatus === "before" &&
                    "Pemungutan suara belum dimulai"}
                  {votingPeriodStatus === "during" &&
                    "Pemilihan selesai dan status penghitungan belum final"}
                  {votingPeriodStatus === "after" &&
                    offlineLocked &&
                    "Pemilihan selesai dan status penghitungan sudah final"}
                  {votingPeriodStatus === "after" &&
                    !offlineLocked &&
                    "proses perhitungan suara masih berjalan"}
                </p>
              </div>

              {/* Hasil per Calon */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.candidates.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center"
                  >
                    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {item.nomorUrut}
                    </div>
                    {item.foto && (
                      <img
                        src={item.foto || "/placeholder.svg"}
                        alt={item.namaKetua}
                        className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                      />
                    )}
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {item.namaKetua}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {item.namaWakil}
                    </p>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {item.votes}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      suara ({item.percentage}%)
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Suara Masuk per Wilayah */}
              {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Suara Masuk per Wilayah
                </h3>
                <div className="space-y-3">
                  {results.wilayahStats.map((wilayah, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {wilayah.nama}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {wilayah.votes} suara ({wilayah.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full"
                          style={{ width: `${wilayah.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Total Statistics */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Ringkasan
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {results.totalPemilih}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Total Pemilih
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {results.totalSuaraMasuk}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Suara Masuk
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {results.suaraSah}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Suara Sah
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {results.suaraTidakSah}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Suara Tidak Sah
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                      {results.tidakMemilih}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Tidak Memberi Suara
                    </p>
                  </div>
                </div>
              </div>

              {/* Finish Voting Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFinishVoting}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 shadow-lg transition-all text-sm sm:text-base"
              >
                Selesai
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-1">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Perangkat Lunak Ini Disediakan Oleh{" "}
            <a
              href="https://manasukatour.com"
              className="text-blue-600 hover:underline font-medium"
            >
              manasukatour.com
            </a>{" "}
            Semarang © 2025
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 italic">
            Untuk Kemajuan Negeri
          </p>
        </div>
      </div>
    </div>
  );
}
