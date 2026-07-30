"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Vote, CheckCircle, AlertCircle, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { storage } from "../utils/storage";

export default function VotingPage() {
  const [step, setStep] = useState(1); // 1: Login, 2: Pilih, 3: Sukses
  const [nik, setNik] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [pemilih, setPemilih] = useState(null);
  const [calon, setCalon] = useState([]);
  const [selectedCalon, setSelectedCalon] = useState(null);

  useEffect(() => {
    const savedCalon = storage.get("calon", []);
    setCalon(savedCalon);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const allPemilih = storage.get("pemilih", []);
    const found = allPemilih.find((p) => p.nik === nik && p.token === token);

    if (!found) {
      setError("NIK atau Token tidak valid");
      return;
    }

    if (found.sudahMemilih) {
      setError("Anda sudah melakukan voting sebelumnya");
      return;
    }

    // Check periode pemilihan
    const pengaturan = storage.get("pengaturan", {});
    if (pengaturan.tanggalMulai && pengaturan.tanggalSelesai) {
      const now = new Date();
      const start = new Date(pengaturan.tanggalMulai);
      const end = new Date(pengaturan.tanggalSelesai);

      if (now < start) {
        setError("Pemilihan belum dimulai");
        return;
      }

      if (now > end) {
        setError("Pemilihan sudah berakhir");
        return;
      }
    }

    setPemilih(found);
    setStep(2);
  };

  const handleVote = () => {
    if (!selectedCalon) {
      setError("Pilih salah satu calon");
      return;
    }

    // Save vote
    const votes = storage.get("votes", []);
    votes.push({
      pemilihId: pemilih.id,
      calonId: selectedCalon.id,
      timestamp: new Date().toISOString(),
    });
    storage.set("votes", votes);

    // Update pemilih status
    const allPemilih = storage.get("pemilih", []);
    const updated = allPemilih.map((p) =>
      p.id === pemilih.id ? { ...p, sudahMemilih: true } : p
    );
    storage.set("pemilih", updated);

    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setNik("");
    setToken("");
    setError("");
    setPemilih(null);
    setSelectedCalon(null);
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Login */}
          {step === 1 && (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-[var(--color-surface)] rounded-xl p-8 border border-[var(--color-border)]"
            >
              <div className="text-center mb-8">
                <div className="inline-flex p-4 rounded-full bg-blue-500/10 mb-4">
                  <Vote className="w-12 h-12 text-blue-500" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                  Halaman Voting
                </h1>
                <p className="text-[var(--color-text-secondary)]">
                  Masukkan NIK dan Token untuk melakukan voting
                </p>
              </div>

              <form
                onSubmit={handleLogin}
                className="space-y-6 max-w-md mx-auto"
              >
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-500">{error}</p>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    NIK
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="Masukkan 16 digit NIK"
                    maxLength={16}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--color-text-primary)]">
                    Token
                  </label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Masukkan token dari SMS/WhatsApp"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--color-background)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all"
                >
                  Lanjutkan
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Step 2: Pilih Calon */}
          {step === 2 && (
            <motion.div
              key="vote"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
                  Selamat Datang
                </h2>
                <p className="text-[var(--color-text-secondary)]">
                  Halo,{" "}
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {pemilih?.nama}
                  </span>
                  . Pilih calon Anda di bawah ini.
                </p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {calon.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCalon(item)}
                    className={`bg-[var(--color-surface)] rounded-xl overflow-hidden border-2 transition-all ${
                      selectedCalon?.id === item.id
                        ? "border-[var(--color-primary)] shadow-lg"
                        : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50"
                    }`}
                  >
                    {/* Photo */}
                    <div className="relative h-56 bg-gradient-to-br from-blue-500 to-purple-500">
                      {item.foto ? (
                        <img
                          src={item.foto || "/placeholder.svg"}
                          alt={item.namaKetua}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-white text-7xl font-bold">
                            {item.nomorUrut}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white text-[var(--color-primary)] px-4 py-2 rounded-lg font-bold shadow-lg">
                        No. {item.nomorUrut}
                      </div>
                      {selectedCalon?.id === item.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 bg-[var(--color-primary)] p-2 rounded-full shadow-lg"
                        >
                          <CheckCircle className="w-6 h-6 text-white" />
                        </motion.div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 text-left space-y-4">
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                          Ketua
                        </p>
                        <p className="text-xl font-bold text-[var(--color-text-primary)]">
                          {item.namaKetua}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                          Wakil
                        </p>
                        <p className="text-lg font-semibold text-[var(--color-text-primary)]">
                          {item.namaWakil}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[var(--color-text-secondary)] mb-1">
                          Visi
                        </p>
                        <p className="text-sm text-[var(--color-text-primary)] line-clamp-2">
                          {item.visi}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleVote}
                disabled={!selectedCalon}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Vote className="w-5 h-5" />
                Konfirmasi Pilihan Saya
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 3 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[var(--color-surface)] rounded-xl p-12 border border-[var(--color-border)] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="inline-flex p-6 rounded-full bg-green-500/10 mb-6"
              >
                <CheckCircle className="w-20 h-20 text-green-500" />
              </motion.div>

              <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-4">
                Voting Berhasil!
              </h2>
              <p className="text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto">
                Terima kasih telah menggunakan hak pilih Anda. Suara Anda telah
                berhasil direkam dan tidak dapat diubah.
              </p>

              <div className="bg-[var(--color-background)] rounded-xl p-6 max-w-md mx-auto mb-8">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">
                      Pemilih:
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      {pemilih?.nama}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">
                      Pilihan:
                    </span>
                    <span className="font-semibold text-[var(--color-text-primary)]">
                      No. {selectedCalon?.nomorUrut} -{" "}
                      {selectedCalon?.namaKetua}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleReset}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-all"
              >
                Kembali ke Halaman Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
