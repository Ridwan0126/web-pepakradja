import { motion } from "framer-motion";
import { Building2, Users, Target, Heart } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Tentang PEPAK RAJA
            </h1>

            <p className="text-lg text-muted-foreground mb-12">
              Platform e-commerce layanan pajak dan retribusi daerah Provinsi
              Jawa Tengah
            </p>

            {/* Vision and Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-8"
              >
                <Target className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-4">Visi</h3>
                <p className="text-muted-foreground">
                  Menjadi platform terdepan dalam pelayanan pajak dan retribusi
                  daerah yang modern, transparan, dan mudah diakses oleh semua
                  masyarakat Jawa Tengah.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="bg-card rounded-2xl border border-border p-8"
              >
                <Heart className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-4">Misi</h3>
                <p className="text-muted-foreground">
                  Memberikan layanan pajak dan retribusi yang berkualitas,
                  cepat, dan transparan melalui teknologi digital untuk
                  mendukung pembangunan daerah.
                </p>
              </motion.div>
            </div>

            {/* Values */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Nilai-Nilai Kami
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Mudah",
                    desc: "Layanan yang mudah diakses oleh semua kalangan",
                  },
                  { title: "Cepat", desc: "Proses yang efisien dan responsif" },
                  {
                    title: "Transparan",
                    desc: "Informasi yang jelas dan dapat dipercaya",
                  },
                ].map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl border border-border p-6 text-center"
                  >
                    <h3 className="font-bold text-foreground mb-2">
                      {value.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {value.desc}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Team */}
            <div className="bg-card rounded-2xl border border-border p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Tim Kami
              </h2>
              <div className="flex items-center gap-4">
                <Building2 className="w-8 h-8 text-primary" />
                <div>
                  <p className="font-bold text-foreground">
                    BAPENDA Jawa Tengah
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Badan Pendapatan Daerah Provinsi Jawa Tengah
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
