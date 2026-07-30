"use client";

import { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapLevelToRole = (level) => {
    if (!level) return "user";
    if (level.includes("Ketua") || level.includes("Admin")) return "ketua";
    if (level.includes("Koordinator") || level.includes("Anggota"))
      return "koordinator";
    return "user";
  };

  useEffect(() => {
    const loadUser = () => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          const mappedUser = {
            id: userData.id,
            nama: userData.namaPanitia,
            username: userData.namaAkun,
            level: userData.level,
            wilayah: userData.wilayah || "",
            role: mapLevelToRole(userData.level),
            loginTime: userData.loginTime || Date.now(),
          };
          setUser(mappedUser);
        } catch (error) {
          console.error("Error parsing saved user:", error);
          localStorage.removeItem("currentUser");
        }
      }
      setLoading(false);
    };

    loadUser();

    const interval = setInterval(() => {
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          const mappedUser = {
            id: userData.id,
            nama: userData.namaPanitia,
            username: userData.namaAkun,
            level: userData.level,
            wilayah: userData.wilayah || "",
            role: mapLevelToRole(userData.level),
            loginTime: userData.loginTime || Date.now(),
          };
          setUser((prevUser) => {
            if (!prevUser || prevUser.id !== mappedUser.id) {
              return mappedUser;
            }
            return prevUser;
          });
        } catch (error) {
          console.error("Error parsing user:", error);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    console.log("[v0] User logged out - session ended");
  };

  const hasAccess = (page) => {
    if (!user) return false;

    const role = user.role || "user";

    if (role === "ketua" || role === "admin") {
      return true;
    }

    if (role === "koordinator") {
      const allowedPages = [
        "dashboard",
        "data-pemilih",
        "suara-offline",
        "laporan-rekap",
        "laporan-jurnal",
        "hasil",
        "voting",
      ];
      return allowedPages.includes(page);
    }

    return false;
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading, hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
