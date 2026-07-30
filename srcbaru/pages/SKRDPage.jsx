import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Eye, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const sampleSKRD = [
  {
    id: 1,
    nomor: "SKRD-2024-001",
    objek: "Wisata Lawang Sewu",
    tarif: 15000,
    status: "Lunas",
    tglUpload: "2024-01-15",
  },
  {
    id: 2,
    nomor: "SKRD-2024-002",
    objek: "Museum Ronggowarsito",
    tarif: 10000,
    status: "Belum Lunas",
    tglUpload: "2024-02-10",
  },
];

export default function SKRDPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredSKRD = sampleSKRD.filter((skrd) => {
    const matchSearch =
      skrd.nomor.includes(searchQuery) || skrd.objek.includes(searchQuery);
    const matchStatus =
      filterStatus === "all" || skrd.status.includes(filterStatus);
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-8">
              SKRD Saya
            </h1>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari SKRD..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-muted rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">Semua Status</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum">Belum Lunas</option>
              </select>
            </div>

            {/* Table */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Nomor SKRD
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Objek
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Tarif
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSKRD.map((skrd) => (
                      <tr
                        key={skrd.id}
                        className="border-t border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">
                          {skrd.nomor}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {skrd.objek}
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          Rp {skrd.tarif.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              skrd.status === "Lunas"
                                ? "bg-green-500/20 text-green-600"
                                : "bg-yellow-500/20 text-yellow-600"
                            }`}
                          >
                            {skrd.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-primary" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Download className="w-4 h-4 text-primary" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredSKRD.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Tidak ada SKRD yang ditemukan
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
