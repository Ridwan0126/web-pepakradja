"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Settings,
  Users,
  BarChart3,
  Vote,
  FileText,
  UserPlus,
  ChevronDown,
  MapPin,
  UserCog,
  CheckCircle,
  Trash2,
  File,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar({ isOpen, currentPage, setCurrentPage }) {
  const [openMenus, setOpenMenus] = useState({
    pengaturan: false,
    pemilih: false,
    dokumen: false,
    hasil: false,
  });
  const { hasAccess } = useAuth();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => {
      // If clicking the same menu, close it; otherwise, close all and open the clicked one
      if (prev[menu]) {
        return { ...prev, [menu]: false };
      }
      // Close all menus, then open only the clicked one
      const newState = {
        pengaturan: false,
        pemilih: false,
        dokumen: false,
        hasil: false,
      };
      newState[menu] = true;
      return newState;
    });
  };

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
      label: "Data Pemilih",
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
      id: "dokumen",
      label: "Dokumen",
      icon: File,
      submenu: [
        {
          id: "dokumen-calon-pemilih",
          label: "Daftar Calon Pemilih",
          icon: FileText,
          page: "dokumen-calon-pemilih",
        },
        {
          id: "dokumen-daftar-pemilih",
          label: "Daftar Pemilih",
          icon: FileText,
          page: "dokumen-daftar-pemilih",
        },
        {
          id: "dokumen-presensi-offline",
          label: "Presensi",
          icon: FileText,
          page: "dokumen-presensi-offline",
        },
        {
          id: "dokumen-jurnal-suara-offline",
          label: "Jurnal Suara Offline",
          icon: FileText,
          page: "dokumen-jurnal-suara-offline",
        },
      ],
    },
    {
      id: "hasil",
      label: "Hasil Pemilihan",
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

  const filteredMenuItems = menuItems
    .map((item) => {
      if (item.submenu) {
        const filteredSubmenu = item.submenu.filter((sub) =>
          hasAccess(sub.page),
        );
        if (filteredSubmenu.length === 0) return null;
        return { ...item, submenu: filteredSubmenu };
      }
      return hasAccess(item.page) ? item : null;
    })
    .filter(Boolean);

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed z-50 h-screen w-[280px] lg:w-64 bg-white border-r border-[var(--color-border)] overflow-hidden shadow-2xl lg:shadow-lg"
      >
        <div className="flex flex-col h-full">
          <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-purple-600">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Vote className="w-5 h-5 flex-shrink-0 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  SIPOLLIN
                </h2>
                <p className="text-xs text-blue-100">Sistem Pemilihan</p>
              </div>
            </motion.div>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 sm:p-4">
            <ul className="space-y-1.5 sm:space-y-2">
              {filteredMenuItems.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-[var(--color-text-secondary)] hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-[var(--color-primary)] transition-all font-medium active:scale-95 touch-manipulation"
                      >
                        <div className="flex items-center gap-2.5 sm:gap-3">
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span className="font-medium text-sm sm:text-base">
                            {item.label}
                          </span>
                        </div>
                        <motion.div
                          animate={{ rotate: openMenus[item.id] ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4 flex-shrink-0" />
                        </motion.div>
                      </button>

                      <AnimatePresence>
                        {openMenus[item.id] && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-2 sm:ml-4 mt-1 space-y-1 overflow-hidden"
                          >
                            {item.submenu.map((subitem) => (
                              <li key={subitem.id}>
                                <button
                                  onClick={() => setCurrentPage(subitem.page)}
                                  className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-2.5 rounded-lg transition-all active:scale-95 touch-manipulation ${
                                    currentPage === subitem.page
                                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                                      : "text-[var(--color-text-secondary)] hover:bg-blue-50 hover:text-[var(--color-primary)]"
                                  }`}
                                >
                                  <subitem.icon className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm font-medium">
                                    {subitem.label}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (item.page === "voting") {
                          window.open(`/vote`, "_blank");
                        } else {
                          setCurrentPage(item.page);
                        }
                      }}
                      className={`w-full flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all font-medium active:scale-95 touch-manipulation ${
                        currentPage === item.page
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                          : "text-[var(--color-text-secondary)] hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-[var(--color-primary)]"
                      }`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </button>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="p-3 sm:p-4 bg-gradient-to-br from-slate-50 to-blue-50 border-t border-[var(--color-border)]">
            <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white border border-blue-100 shadow-sm">
              <p className="text-xs font-medium text-[var(--color-text-secondary)] leading-relaxed">
                SIPOLINe v1.0
              </p>
              <p className="text-[10px] sm:text-xs text-[var(--color-text-muted)] mt-1">
                &copy; 2025 Semua Hak Dilindungi
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
