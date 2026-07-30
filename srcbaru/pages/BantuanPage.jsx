import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, ChevronDown, Mail } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const faqs = [
  {
    q: "Bagaimana cara mendaftar?",
    a: "Klik tombol Daftar dan isi form dengan data diri Anda secara lengkap.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima pembayaran melalui QRIS, Virtual Account, dan E-Wallet.",
  },
  {
    q: "Berapa lama proses pembayaran?",
    a: "Proses pembayaran biasanya selesai dalam waktu 1-2 jam kerja.",
  },
  {
    q: "Bagaimana jika saya lupa password?",
    a: 'Klik "Lupa Password" di halaman login dan ikuti petunjuk yang diberikan.',
  },
];

export default function BantuanPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Pusat Bantuan
            </h1>
            <p className="text-muted-foreground mb-12">
              Temukan jawaban atas pertanyaan Anda di sini
            </p>

            {/* FAQ */}
            <div className="space-y-4 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Pertanyaan Umum
              </h2>
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="bg-card rounded-2xl border border-border overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenIndex(openIndex === index ? null : index)
                    }
                    className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                  >
                    <p className="font-semibold text-foreground text-left">
                      {faq.q}
                    </p>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                  </button>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border px-6 py-4 bg-muted/30"
                    >
                      <p className="text-muted-foreground">{faq.a}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Contact */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Hubungi Kami
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground">
                      support@pepakraja.id
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">WhatsApp</p>
                    <p className="text-muted-foreground">+62 274-123-4567</p>
                  </div>
                </div>
              </div>

              <button className="w-full mt-8 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Kirim Pertanyaan
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
