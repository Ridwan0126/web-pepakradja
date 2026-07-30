"use client";

import { motion } from "framer-motion";
import { Users, Vote, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-6xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            SIPOLINe
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">
            Sistem Pemungutan Suara Online
          </p>
          <div className="h-1 w-24 bg-white mx-auto mt-6 rounded-full"></div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card Pemungutan Suara */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="cursor-pointer"
            onClick={() => navigate("/vote")}
          >
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: 0.2,
                  }}
                >
                  <Vote className="w-16 h-16 text-white" />
                </motion.div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Halaman PEMILIH
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Halaman untuk pemilih melakukan :
                </p>

                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Pastikan Nomer Whatsapp Anda sudah terdaftar.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Password/TOKEN akan dikirim melalui No Whatsapp.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Memberikan Suara secara Online (Khusus Pemilih Online).
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Melihat Hasil Pemilihan.
                  </li>
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  Masuk sebagai PEMILIH
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Card Panitia */}
          <motion.div
            variants={cardVariants}
            whileHover="hover"
            className="cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <div className="h-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Users className="w-16 h-16 text-white" />
                </motion.div>
              </div>

              <div className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">
                  Panitia Pemilihan
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Halaman untuk panitia pemilihan dalam penatausahaan
                  pelaksanaan pemilihan.
                </p>

                <ul className="space-y-2 mb-8">
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Rekam data calon pemilih.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Verifikasi data pemilih.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Cetak dokumen pemilihan.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Rekam data surat suara Offline.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Melihat hasil pemilihan.
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Pelaporan
                  </li>
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  Masuk Sebagai Panitia
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-blue-100 text-sm">SIPOLINe v1.0 &copy; 2025</p>
          <p className="text-blue-200 text-xs mt-2">
            Sistem Pemungutan Suara Elektronik yang Aman dan Terpercaya
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
