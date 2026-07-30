"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Settings,
  Users,
  BarChart3,
  Vote,
  LogOut,
  FileText,
  UserPlus,
  MapPin,
  UserCog,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function BottomNav({ currentPage, setCurrentPage }) {
  const { logout, hasAccess } = useAuth();
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleLogout = () => {
    logout();
    window.location.href = "/closing-ad";
  };

  // ===== MENU + SUBMENU =====
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      page: "dashboard",
    },
    {
      id: "pengaturan",
      label: "Pengaturan",
      icon: Settings,
      submenu: [
        {
          id: "pengaturan-judul",
          label: "Judul Pemilihan",
          icon: FileText,
          page: "pengaturan-judul",
        },
        {
          id: "pengaturan-calon",
          label: "Data Calon",
          icon: UserPlus,
          page: "pengaturan-calon",
        },
        {
          id: "set-wilayah",
          label: "Set Wilayah",
          icon: MapPin,
          page: "set-wilayah",
        },
        {
          id: "buat-wilayah",
          label: "Buat Wilayah Pemilihan",
          icon: MapPin,
          page: "buat-wilayah",
        },
        {
          id: "pengaturan-pengguna",
          label: "Pengguna",
          icon: UserCog,
          page: "pengaturan-pengguna",
        },
        {
          id: "reset-data",
          label: "Reset Data",
          icon: Trash2,
          page: "reset-data",
        },
      ],
    },
    {
      id: "pemilih",
      label: "Pemilih",
      icon: Users,
      submenu: [
        {
          id: "data-pemilih",
          label: "Kelola Pemilih",
          icon: Users,
          page: "data-pemilih",
        },
        {
          id: "verifikasi-data",
          label: "Verifikasi",
          icon: CheckCircle,
          page: "verifikasi-data",
        },
        {
          id: "suara-offline",
          label: "Suara Offline",
          icon: FileText,
          page: "suara-offline",
        },
      ],
    },
    {
      id: "voting",
      label: "Voting",
      icon: Vote,
      page: "voting",
    },
    {
      id: "hasil",
      label: "Hasil",
      icon: BarChart3,
      submenu: [
        {
          id: "hasil-pemilihan",
          label: "Lihat Hasil",
          icon: BarChart3,
          page: "hasil",
        },
        {
          id: "laporan-rekap",
          label: "Rekap",
          icon: FileText,
          page: "laporan-rekap",
        },
        {
          id: "laporan-jurnal",
          label: "Jurnal",
          icon: FileText,
          page: "laporan-jurnal",
        },
      ],
    },
  ];

  // ===== FILTER AKSES =====
  const filteredMenu = menuItems.filter((menu) => {
    if (menu.page) return hasAccess(menu.page);
    return menu.submenu?.some((sub) => hasAccess(sub.page));
  });

  const totalCols = filteredMenu.length + 1; // + logout

  return (
    <>
      {/* BACKDROP – klik di luar nutup submenu */}
      <AnimatePresence>
        {openMenuId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenMenuId(null)}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-xl lg:hidden safe-bottom">
        {/* SUBMENU */}
        <AnimatePresence>
          {openMenuId && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="
              absolute bottom-20 left-1/2 -translate-x-1/2
              w-[95%] max-w-md
              rounded-3xl
              bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600
              shadow-2xl
              p-4
              max-h-[70vh] overflow-y-auto
              z-50
            "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid gap-2">
                {filteredMenu
                  .find((m) => m.id === openMenuId)
                  ?.submenu?.filter((s) => hasAccess(s.page))
                  .map((sub) => {
                    const isActive = currentPage === sub.page;

                    return (
                      <motion.button
                        key={sub.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setCurrentPage(sub.page);
                          setOpenMenuId(null);
                        }}
                        className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                        backdrop-blur-md transition-all
                        ${
                          isActive
                            ? "bg-white/30 text-white shadow-lg"
                            : "bg-white/15 text-white hover:bg-white/25"
                        }
                      `}
                      >
                        <sub.icon className="w-4 h-4" />
                        <span className="flex-1 text-left">{sub.label}</span>
                      </motion.button>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN NAV */}
        <div
          className="grid h-16"
          style={{
            gridTemplateColumns: `repeat(${totalCols}, minmax(0,1fr))`,
          }}
        >
          {filteredMenu.map((menu) => {
            const Icon = menu.icon;
            const isActive =
              currentPage === menu.page ||
              menu.submenu?.some((s) => s.page === currentPage);

            return (
              <motion.button
                key={menu.id}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (menu.submenu) {
                    setOpenMenuId(openMenuId === menu.id ? null : menu.id);
                  } else {
                    setOpenMenuId(null);
                    if (menu.page === "voting") {
                      window.open(`/vote`, "_blank");
                    } else {
                      setCurrentPage(menu.page);
                    }
                  }
                }}
                className={`
                relative flex flex-col items-center justify-center gap-1
                transition-all
                ${
                  isActive
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }
              `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] text-center leading-tight">
                  {menu.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                  />
                )}
              </motion.button>
            );
          })}

          {/* LOGOUT */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setOpenMenuId(null);
              handleLogout();
            }}
            className="flex flex-col items-center justify-center gap-1 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px]">Keluar</span>
          </motion.button>
        </div>
      </div>
    </>
  );
}
