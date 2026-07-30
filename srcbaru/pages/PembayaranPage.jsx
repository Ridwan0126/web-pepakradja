import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, QrCode, Wallet, CheckCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function PembayaranPage() {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState(15000);

  const paymentMethods = [
    {
      id: "qris",
      name: "QRIS",
      icon: QrCode,
      description: "Scan QR untuk pembayaran",
    },
    {
      id: "va",
      name: "Virtual Account",
      icon: CreditCard,
      description: "Transfer ke rekening virtual",
    },
    {
      id: "ewallet",
      name: "E-Wallet",
      icon: Wallet,
      description: "GCash, OVO, Dana, dll",
    },
  ];

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
              Pembayaran SKRD
            </h1>

            {/* Amount */}
            <div className="bg-card rounded-2xl border border-border p-8 mb-8">
              <p className="text-muted-foreground mb-2">Total Pembayaran</p>
              <h2 className="text-4xl font-bold text-primary">
                Rp {amount.toLocaleString()}
              </h2>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-foreground">
                Pilih Metode Pembayaran
              </h3>
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  whileHover={{ scale: 1.02 }}
                  className={`w-full p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedMethod === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl ${
                        selectedMethod === method.id ? "bg-primary" : "bg-muted"
                      }`}
                    >
                      <method.icon
                        className={`w-6 h-6 ${
                          selectedMethod === method.id
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">
                        {method.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Pay Button */}
            {selectedMethod && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Lanjutkan Pembayaran
              </motion.button>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
