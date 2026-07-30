"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const WARNING_TIME = 55 * 60 * 1000; // 55 minutes - show warning 5 minutes before timeout

export function useSessionTimeout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const timeoutRef = useRef(null);
  const warningRef = useRef(null);
  const lastActivityRef = useRef(Date.now());

  const handleLogout = () => {
    Swal.fire({
      icon: "warning",
      title: "Session Timeout",
      text: "Sesi Anda telah berakhir. Silakan login kembali.",
      confirmButtonColor: "#3b82f6",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didClose: () => {
        logout();
        navigate("/login");
      },
    });
  };

  const showWarning = () => {
    Swal.fire({
      icon: "info",
      title: "Peringatan Session",
      text: "Sesi Anda akan berakhir dalam 5 menit. Silakan lakukan aktivitas untuk melanjutkan.",
      confirmButtonText: "OK",
      confirmButtonColor: "#f59e0b",
      allowOutsideClick: false,
      didClose: () => {
        lastActivityRef.current = Date.now();
        resetTimers();
      },
    });
  };

  const resetTimers = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    warningRef.current = setTimeout(() => {
      showWarning();
    }, WARNING_TIME);

    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);

    console.log("[v0] Session timers reset - logout in 60 minutes");
  };

  const handleActivity = () => {
    lastActivityRef.current = Date.now();
    resetTimers();
  };

  useEffect(() => {
    if (!user) return;

    const activityEvents = [
      "click",
      "keydown",
      "scroll",
      "mousemove",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    resetTimers();

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user]);
}
