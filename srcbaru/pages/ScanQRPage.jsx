import { motion } from "framer-motion";
import { QrCode, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ScanQRPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-8">
              Scan QR SKRD
            </h1>

            <div className="bg-card rounded-2xl border border-border p-8">
              <div className="bg-muted rounded-2xl aspect-square flex items-center justify-center mb-8">
                <div className="text-center">
                  <QrCode className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Kamera diperlukan untuk scan QR
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900 mb-1">
                    Fitur Scan QR
                  </p>
                  <p className="text-sm text-blue-800">
                    Arahkan kamera ke QR code pada SKRD Anda untuk melihat
                    detail dan status pembayaran.
                  </p>
                </div>
              </div>

              <button className="w-full mt-8 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Mulai Scan
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
