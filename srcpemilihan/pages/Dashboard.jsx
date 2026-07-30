"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  UserX,
  UsersRound,
  Vote,
  BarChart3,
  Settings,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllVoters,
  getAllCandidates,
  getAllOfflineVotes,
  getAllOnlineVotes,
  getDb,
  getPengaturan,
} from "../utils/firestore";
import { collection, onSnapshot, query } from "firebase/firestore";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function Dashboard({ setCurrentPage }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalPemilih: 0,
    sudahMemilih: 0,
    belumMemilih: 0,

    totalOnline: 0,
    totalOffline: 0,

    sudahMemilihOnline: 0,
    sudahMemilihOffline: 0,

    belumMemilihOnline: 0,
    belumMemilihOffline: 0,

    totalCalon: 0,
  });

  const [pengaturan, setPengaturan] = useState(null);
  const [loading, setLoading] = useState(true);

  const filterDataByWilayah = (voters, offlineVotes, onlineVotes) => {
    if (user?.role === "koordinator" && user?.wilayah) {
      const filteredVoters =
        voters?.filter((v) => v.wilayahPemilih === user.wilayah) || [];
      const filteredOfflineVotes =
        offlineVotes?.filter((v) => {
          const voteWilayah = v.wilayahNama || v.wilayahId;
          return voteWilayah === user.wilayah;
        }) || [];
      const filteredOnlineVotes =
        onlineVotes?.filter((v) => {
          const voteWilayah = v.wilayahNama || v.wilayahId;
          return voteWilayah === user.wilayah;
        }) || [];
      return { filteredVoters, filteredOfflineVotes, filteredOnlineVotes };
    }
    return {
      filteredVoters: voters,
      filteredOfflineVotes: offlineVotes,
      filteredOnlineVotes: onlineVotes,
    };
  };

  useEffect(() => {
    const loadPengaturan = async () => {
      try {
        const data = await getPengaturan();
        setPengaturan(data);
      } catch (error) {
        console.error("[v0] Error loading pengaturan:", error);
      }
    };
    loadPengaturan();

    const unsubscribers = [];

    const setupListeners = async () => {
      try {
        const [voters, candidates, offlineVotes, onlineVotes] =
          await Promise.all([
            getAllVoters(),
            getAllCandidates(),
            getAllOfflineVotes(),
            getAllOnlineVotes(),
          ]);

        const { filteredVoters, filteredOfflineVotes, filteredOnlineVotes } =
          filterDataByWilayah(voters, offlineVotes, onlineVotes);

        const updateStats = (v, c, ov, ov2) => {
          const voters = v || [];
          const offlineVotes = ov || [];
          const onlineVotes = ov2 || [];

          const allVotes = [...offlineVotes, ...onlineVotes];
          const voterWhoHaveVoted = new Set(allVotes.map((v) => v.pemilihId));

          const pemilihOnline = voters.filter(
            (p) => p.caraMemilih === "online",
          );
          const pemilihOffline = voters.filter(
            (p) => p.caraMemilih === "offline",
          );

          const sudahOnline = pemilihOnline.filter((p) =>
            voterWhoHaveVoted.has(p.id),
          );

          const sudahOffline = pemilihOffline.filter((p) =>
            voterWhoHaveVoted.has(p.id),
          );

          setStats({
            totalPemilih: voters.length,
            sudahMemilih: voterWhoHaveVoted.size,
            belumMemilih: voters.length - voterWhoHaveVoted.size,

            totalOnline: pemilihOnline.length,
            totalOffline: pemilihOffline.length,

            sudahMemilihOnline: sudahOnline.length,
            sudahMemilihOffline: sudahOffline.length,

            belumMemilihOnline: pemilihOnline.length - sudahOnline.length,
            belumMemilihOffline: pemilihOffline.length - sudahOffline.length,

            totalCalon: c?.length || 0,
          });
        };

        updateStats(
          filteredVoters,
          candidates,
          filteredOfflineVotes,
          filteredOnlineVotes,
        );
        setLoading(false);

        const firebaseDb = await getDb();

        const dataPemilihQuery = query(collection(firebaseDb, "dataPemilih"));
        const unsubPemilih = onSnapshot(dataPemilihQuery, async () => {
          const [v, c, ov, ov2] = await Promise.all([
            getAllVoters(),
            getAllCandidates(),
            getAllOfflineVotes(),
            getAllOnlineVotes(),
          ]);
          const { filteredVoters, filteredOfflineVotes, filteredOnlineVotes } =
            filterDataByWilayah(v, ov, ov2);
          updateStats(
            filteredVoters,
            c,
            filteredOfflineVotes,
            filteredOnlineVotes,
          );
        });
        unsubscribers.push(unsubPemilih);

        const votesOfflineQuery = query(collection(firebaseDb, "votesOffline"));
        const unsubOffline = onSnapshot(votesOfflineQuery, async () => {
          const [v, c, ov, ov2] = await Promise.all([
            getAllVoters(),
            getAllCandidates(),
            getAllOfflineVotes(),
            getAllOnlineVotes(),
          ]);
          const { filteredVoters, filteredOfflineVotes, filteredOnlineVotes } =
            filterDataByWilayah(v, ov, ov2);
          updateStats(
            filteredVoters,
            c,
            filteredOfflineVotes,
            filteredOnlineVotes,
          );
        });
        unsubscribers.push(unsubOffline);

        const suaraOnlineQuery = query(collection(firebaseDb, "suaraOnline"));
        const unsubOnline = onSnapshot(suaraOnlineQuery, async () => {
          const [v, c, ov, ov2] = await Promise.all([
            getAllVoters(),
            getAllCandidates(),
            getAllOfflineVotes(),
            getAllOnlineVotes(),
          ]);
          const { filteredVoters, filteredOfflineVotes, filteredOnlineVotes } =
            filterDataByWilayah(v, ov, ov2);
          updateStats(
            filteredVoters,
            c,
            filteredOfflineVotes,
            filteredOnlineVotes,
          );
        });
        unsubscribers.push(unsubOnline);
      } catch (error) {
        console.error("[v0] Error setting up dashboard listeners:", error);
        setLoading(false);
      }
    };

    setupListeners();

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [user?.role, user?.wilayah]);

  const statsCards = [
    ...(user?.role !== "koordinator"
      ? [
          {
            title: "Total Calon",
            icon: UsersRound,
            gradient: "from-purple-500 to-pink-500",
            bgColor: "from-purple-50 to-pink-50",
            iconBg: "from-purple-500 to-pink-500",
            mainValue: stats.totalCalon,
            subItems: [],
          },
        ]
      : []),

    {
      title: "Total Pemilih",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      iconBg: "from-blue-500 to-cyan-500",
      mainValue: stats.totalPemilih,
      subItems: [
        { label: "Sudah memilih", value: stats.sudahMemilih },
        { label: "Belum memilih", value: stats.belumMemilih },
      ],
    },
    {
      title: "Pemilih Online",
      icon: Users,
      gradient: "from-indigo-500 to-blue-500",
      bgColor: "from-indigo-50 to-blue-50",
      iconBg: "from-indigo-500 to-blue-500",
      mainValue: stats.totalOnline,
      subItems: [
        { label: "Sudah memilih", value: stats.sudahMemilihOnline },
        { label: "Belum memilih", value: stats.belumMemilihOnline },
      ],
    },
    {
      title: "Pemilih Offline",
      icon: Users,
      gradient: "from-rose-500 to-red-500",
      bgColor: "from-rose-50 to-red-50",
      iconBg: "from-rose-500 to-red-500",
      mainValue: stats.totalOffline,
      subItems: [
        { label: "Sudah memilih", value: stats.sudahMemilihOffline },
        { label: "Belum memilih", value: stats.belumMemilihOffline },
      ],
    },
  ];

  const formatDateTime = (datetime) => {
    if (!datetime) return "";
    try {
      const date = new Date(datetime);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return datetime;
    }
  };

  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Kelola Pemilih",
        description: "Tambah atau edit data pemilih",
        icon: Users,
        gradient: "from-green-500 to-emerald-500",
        action: () => setCurrentPage("data-pemilih"),
        dateInfo: pengaturan
          ? `${formatDateTime(pengaturan.tanggalMulai)} s.d. ${formatDateTime(
              pengaturan.tanggalSelesai,
            )}`
          : null,
      },
      {
        title: "Lihat Hasil",
        description: "Lihat hasil pemilihan real-time",
        icon: BarChart3,
        gradient: "from-purple-500 to-pink-500",
        action: () => setCurrentPage("hasil"),
      },
    ];

    if (user?.role === "koordinator") {
      return [
        ...baseActions,
        {
          title: "Suara Offline",
          description: "Input suara pemilihan offline",
          icon: Vote,
          gradient: "from-orange-500 to-amber-500",
          action: () => setCurrentPage("suara-offline"),
          dateInfo: pengaturan
            ? `${formatDateTime(
                pengaturan.tanggalMulaiSuaraOffline,
              )} s.d. ${formatDateTime(pengaturan.tanggalSelesaiSuaraOffline)}`
            : null,
        },
        {
          title: "Rekap Suara",
          description: "Lihat rekap hasil pemilihan",
          icon: TrendingUp,
          gradient: "from-indigo-500 to-blue-500",
          action: () => setCurrentPage("laporan-rekap"),
        },
      ];
    }

    return [
      {
        title: "Kelola Calon",
        description: "Tambah atau edit data calon",
        icon: UsersRound,
        gradient: "from-blue-500 to-cyan-500",
        action: () => setCurrentPage("pengaturan-calon"),
      },
      ...baseActions,
      {
        title: "Pengaturan",
        description: "Atur judul dan periode pemilihan",
        icon: Settings,
        gradient: "from-orange-500 to-amber-500",
        action: () => setCurrentPage("pengaturan-judul"),
      },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[var(--color-text-secondary)]">
          {user?.role === "koordinator"
            ? `Selamat datang Koordinator ${user?.wilayah}`
            : "Selamat datang di Sistem E-Voting"}
        </p>
      </motion.div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-3 sm:gap-4 md:gap-6">
        {statsCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white shadow-lg hover:shadow-xl transition-all`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-2 sm:space-y-3 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-[var(--color-text-secondary)] truncate">
                  {stat.title}
                </p>

                {/* ANGKA BESAR */}
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {stat.mainValue}
                </h2>

                {/* REDAKSI BAWAH */}
                {stat.subItems?.length > 0 && (
                  <div className="space-y-1 text-sm text-gray-600">
                    {stat.subItems.map((item, i) => (
                      <p key={i}>
                        {item.label}:{" "}
                        <span className="font-semibold text-gray-900">
                          {item.value}
                        </span>
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-1 text-green-600 pt-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-medium">Live</span>
                </div>
              </div>

              <div
                className={`p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${stat.iconBg} shadow-lg flex-shrink-0`}
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
          {user?.role === "koordinator" ? "Menu Akses" : "Quick Actions"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {quickActions.map((action, index) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[var(--color-border)] hover:shadow-xl transition-all text-left group overflow-hidden relative touch-manipulation"
            >
              <div className="flex items-start gap-3 sm:gap-4 relative z-10">
                <div
                  className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}
                >
                  <action.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="space-y-1 sm:space-y-2 min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-bold text-[var(--color-text-primary)]">
                    {action.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                    {action.description}
                  </p>
                  {action.dateInfo && (
                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      <span className="text-xs sm:text-xs text-gray-600">
                        {action.dateInfo}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
              ></div>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-white/10 rounded-full blur-3xl"></div>

        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 relative z-10">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg flex-shrink-0">
            <Vote className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
          </div>
          <div className="space-y-1 sm:space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Sistem E-Voting Aktif
            </h3>
            <p className="text-xs sm:text-sm text-blue-50 leading-relaxed">
              Sistem pemungutan suara elektronik siap digunakan. Pastikan semua
              data calon dan pemilih telah diatur dengan benar sebelum memulai
              pemilihan.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
