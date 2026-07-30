import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Lock, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PengaturanPage() {
  const [settings, setSettings] = useState({
    emailNotification: true,
    pushNotification: false,
    twoFactor: false,
    publicProfile: false,
  });

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Pengaturan
            </h1>

            {/* Notifications */}
            <div className="bg-card rounded-2xl border border-border p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">
                  Notifikasi
                </h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">
                      Notifikasi Email
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi melalui email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotification}
                    onChange={() => handleToggle("emailNotification")}
                    className="w-6 h-6 rounded-lg"
                  />
                </label>

                <label className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">
                      Notifikasi Push
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Terima notifikasi push di browser
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.pushNotification}
                    onChange={() => handleToggle("pushNotification")}
                    className="w-6 h-6 rounded-lg"
                  />
                </label>
              </div>
            </div>

            {/* Security */}
            <div className="bg-card rounded-2xl border border-border p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Keamanan</h2>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer">
                  <div>
                    <p className="font-medium text-foreground">
                      Autentikasi Dua Faktor
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tingkatkan keamanan akun Anda
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactor}
                    onChange={() => handleToggle("twoFactor")}
                    className="w-6 h-6 rounded-lg"
                  />
                </label>

                <button className="w-full p-4 text-left hover:bg-muted/50 rounded-xl transition-colors border border-transparent hover:border-primary/20">
                  <p className="font-medium text-foreground">Ubah Password</p>
                  <p className="text-sm text-muted-foreground">
                    Perbarui password akun Anda
                  </p>
                </button>
              </div>
            </div>

            {/* Privacy */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-foreground">Privasi</h2>
              </div>

              <label className="flex items-center justify-between p-4 hover:bg-muted/50 rounded-xl transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-foreground">Profil Publik</p>
                  <p className="text-sm text-muted-foreground">
                    Izinkan orang lain melihat profil Anda
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.publicProfile}
                  onChange={() => handleToggle("publicProfile")}
                  className="w-6 h-6 rounded-lg"
                />
              </label>
            </div>

            {/* Save Button */}
            <button className="w-full mt-8 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
              Simpan Perubahan
            </button>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
