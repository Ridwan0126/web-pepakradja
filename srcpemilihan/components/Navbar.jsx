"use client";

import { motion } from "framer-motion";
import { Menu, Bell, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ toggleSidebar, sidebarOpen }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/closing-ad";
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-[var(--color-border)] px-3 sm:px-4 md:px-6 py-3 sm:py-4 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="hidden lg:block p-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all touch-manipulation flex-shrink-0"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent truncate">
              SIPOLINe
            </h1>
            <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] truncate">
              {user?.nama || "Panel Administrasi"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all touch-manipulation"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg touch-manipulation"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline text-xs sm:text-sm font-medium">
              {user?.level || "Admin"}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="hidden lg:flex p-2 rounded-xl bg-red-50 text-red-500 hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 hover:text-white transition-all touch-manipulation"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
