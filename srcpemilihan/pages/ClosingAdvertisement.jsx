"use client";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function ClosingAdvertisement() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const handleDeveloperClick = (url) => {
    window.open(url, "_blank");
  };

  const handleSponsorClick = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-900 mb-2">SIPOLINe</h1>
          <p className="text-lg text-purple-600 font-medium">
            Sistem Informasi Pemilihan Online
          </p>
        </div>

        {/* Description */}
        <div className="text-center space-y-4 mb-8">
          <p className="text-gray-700 text-base leading-relaxed">
            Dibangun sebagai sumbangsih untuk kemajuan masyarakat Republik
            Indonesia.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-gray-800 font-medium mb-2">
              Rancang Bangun Oleh:
            </p>
            <div className="space-y-2">
              <button
                onClick={() =>
                  handleDeveloperClick(
                    "https://www.instagram.com/w.gunawan.tama?igsh=cnpha2w5YzZ4b2hs"
                  )
                }
                className="block w-full text-blue-600 hover:text-blue-800 hover:underline transition"
              >
                Wawan Gunawan Utama - Semarang
              </button>
              <button
                onClick={() => handleDeveloperClick("https://instagram.com")}
                className="block w-full text-blue-600 hover:text-blue-800 hover:underline transition"
              >
                Muhammad Nur Ridwan – Grobogan
              </button>
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="mb-8">
          <p className="text-center text-gray-700 font-medium mb-6">
            Didukung oleh:
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Manasuka Tour */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSponsorClick("https://manasukatour.com")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/images/logomanasuka.png"
                  alt="Manasuka Tour Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">manasukatour.com</p>
                <p className="text-xs text-gray-600">biro perjalanan wisata</p>
              </div>
            </motion.button>

            {/* AMPRO Semarang */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSponsorClick("https://amprotravel.com")}
              className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                <img
                  src="/images/logoampro.png"
                  alt="AMPRO Semarang Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-gray-900">AMPRO Semarang</p>
                <p className="text-xs text-gray-600">Travel Haji & Umroh</p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClose}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
        >
          <X className="w-5 h-5" />
          CLOSE
        </motion.button>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © 2025 Semua Hak Dilindungi
        </p>
      </motion.div>
    </div>
  );
}
