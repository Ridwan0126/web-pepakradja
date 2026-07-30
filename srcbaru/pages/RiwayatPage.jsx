import { motion } from "framer-motion";
import { History, Calendar } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sampleHistory = [
  {
    id: 1,
    nomor: "TRX-001",
    objek: "Wisata Lawang Sewu",
    harga: 15000,
    status: "Berhasil",
    tanggal: "2024-02-15",
  },
  {
    id: 2,
    nomor: "TRX-002",
    objek: "Museum Ronggowarsito",
    harga: 10000,
    status: "Berhasil",
    tanggal: "2024-02-10",
  },
  {
    id: 3,
    nomor: "TRX-003",
    objek: "Candi Gedong Songo",
    harga: 20000,
    status: "Menunggu",
    tanggal: "2024-02-05",
  },
];

export default function RiwayatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Riwayat Transaksi
            </h1>

            <div className="space-y-4">
              {sampleHistory.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Nomor Transaksi
                      </p>
                      <p className="font-bold text-foreground">{item.nomor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Objek
                      </p>
                      <p className="font-bold text-foreground">{item.objek}</p>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground mb-1">
                          Harga
                        </p>
                        <p className="font-bold text-primary">
                          Rp {item.harga.toLocaleString()}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === "Berhasil"
                            ? "bg-green-500/20 text-green-600"
                            : "bg-yellow-500/20 text-yellow-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {item.tanggal}
                  </div>
                </motion.div>
              ))}
            </div>

            {sampleHistory.length === 0 && (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Belum ada riwayat transaksi
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
