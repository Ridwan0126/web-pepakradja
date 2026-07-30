import { motion } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const notifications = [
  {
    id: 1,
    type: "success",
    title: "Pembayaran Berhasil",
    message: "SKRD-2024-001 telah berhasil dibayar",
    time: "2 jam lalu",
  },
  {
    id: 2,
    type: "warning",
    title: "Pembayaran Menunggu",
    message: "SKRD-2024-002 menunggu konfirmasi",
    time: "5 jam lalu",
  },
  {
    id: 3,
    type: "info",
    title: "Informasi Layanan",
    message: "Sistem maintenance dilakukan malam ini",
    time: "1 hari lalu",
  },
];

export default function NotifikasiPage() {
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return CheckCircle;
      case "warning":
        return AlertCircle;
      case "info":
        return Info;
      default:
        return Bell;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "success":
        return "text-green-600 bg-green-500/20";
      case "warning":
        return "text-yellow-600 bg-yellow-500/20";
      case "info":
        return "text-blue-600 bg-blue-500/20";
      default:
        return "text-primary bg-primary/20";
    }
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
              Notifikasi
            </h1>

            <div className="space-y-4">
              {notifications.map((notif) => {
                const Icon = getIcon(notif.type);
                return (
                  <motion.div
                    key={notif.id}
                    className="bg-card rounded-2xl border border-border p-6 flex gap-4 hover:shadow-lg transition-shadow"
                  >
                    <div className={`p-3 rounded-xl ${getColor(notif.type)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {notif.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notif.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada notifikasi</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
