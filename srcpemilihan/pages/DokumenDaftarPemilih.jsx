"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getAllVoters, getPengaturan } from "../utils/firestore";

export default function DokumenDaftarPemilih() {
  const [pemilih, setPemilih] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWilayah, setSelectedWilayah] = useState("");
  const [allWilayah, setAllWilayah] = useState([]);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterMemilih, setFilterMemilih] = useState("semua");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [data, settings] = await Promise.all([
          getAllVoters(),
          getPengaturan(),
        ]);
        setPemilih(data || []);
        setPengaturan(settings || {});

        const uniqueWilayah = [
          ...new Set(data?.map((v) => v.wilayahPemilih).filter(Boolean)),
        ];
        setAllWilayah(uniqueWilayah.sort());
        // if (uniqueWilayah.length > 0) {
        //   setSelectedWilayah(uniqueWilayah[0]);
        // }
      } catch (err) {
        console.error("Error loading voters:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredPemilih = pemilih
    .filter((p) => {
      // 🔥 SEMUA WILAYAH
      if (!selectedWilayah) return true;
      return p.wilayahPemilih === selectedWilayah;
    })
    .filter((p) => p.verifikasiSesuai === true)
    .filter((p) => {
      if (filterStatus === "semua") return true;
      return (p.caraMemilih || "").toLowerCase() === filterStatus;
    })
    .filter((p) =>
      (p.nama || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

  const getTotalPages = () => Math.ceil(filteredPemilih.length / rowsPerPage);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredPemilih.slice(startIndex, endIndex);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number.parseInt(e.target.value));
    setCurrentPage(1);
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let currentY = margin;

      doc.setFillColor(34, 197, 94);
      doc.rect(margin, currentY, pageWidth - 2 * margin, 12, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(255, 255, 255);
      const filterLabel = getFilterLabel();

      doc.text(
        `DAFTAR PEMILIH${filterLabel ? " - " + filterLabel : ""}`,
        pageWidth / 2,
        currentY + 7,
        { align: "center" },
      );

      currentY += 15;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(pengaturan?.judul || "PEMILIHAN", pageWidth / 2, currentY, {
        align: "center",
      });
      currentY += 5;
      doc.setFontSize(9);
      doc.text(pengaturan?.judul2 || "KELURAHAN", pageWidth / 2, currentY, {
        align: "center",
      });
      currentY += 5;
      doc.text(pengaturan?.judul3 || "", pageWidth / 2, currentY, {
        align: "center",
      });
      currentY += 8;
      doc.setFontSize(10);
      doc.text(
        `WILAYAH PEMILIHAN ${selectedWilayah || "...."}`,
        pageWidth / 2,
        currentY,
        { align: "center" },
      );
      currentY += 10;

      const tableData = filteredPemilih.map((voter, index) => [
        index + 1,
        voter.nama || "-",
        voter.alamatJalan || "-",
        voter.nomorRumah || "-",
        voter.jenisKelamin === "Laki-Laki"
          ? "Laki-laki"
          : voter.jenisKelamin === "Perempuan"
            ? "Perempuan"
            : "-",
        voter.caraMemilih || "",
        voter.nomorHP || "-",
      ]);

      autoTable(doc, {
        head: [
          [
            "No",
            "Nama KK",
            "Alamat",
            "No Rumah",
            "Jenis Kelamin",
            "Cara Memilih",
            "Nomor Handphone",
          ],
        ],
        body: tableData,
        startY: currentY,
        margin: margin,
        styles: {
          font: "helvetica",
          fontSize: 9,
          halign: "center",
          valign: "middle",
        },
        headStyles: {
          fillColor: [51, 51, 51],
          textColor: 255,
          fontStyle: "bold",
        },
        columnStyles: {
          0: { halign: "center", cellWidth: 10 },
          1: { halign: "left" },
          2: { halign: "left" },
          3: { halign: "center", cellWidth: 15 },
          4: { halign: "center", cellWidth: 15 },
          5: { halign: "center", cellWidth: 15 },
          6: { halign: "center", cellWidth: 18 },
        },
      });

      const finalY = doc.lastAutoTable
        ? doc.lastAutoTable.finalY + 15
        : currentY + 15;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      const now = new Date();
      const printDate =
        now.toLocaleDateString("id-ID") + " " + now.toLocaleTimeString("id-ID");
      const printBy = localStorage.getItem("userName") || "Admin System";

      doc.text(
        `Dicetak melalui: Aplikasi Pemilihan Online`,
        margin,
        pageHeight - 10,
      );
      doc.text(`Tanggal & Waktu: ${printDate}`, margin, pageHeight - 6);
      doc.text(
        `Dicetak oleh: ${printBy}`,
        pageWidth - margin - 60,
        pageHeight - 10,
      );

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Disahkan di Semarang", pageWidth - margin - 60, finalY);
      doc.text(
        "Pada : ..............................",
        pageWidth - margin - 60,
        finalY + 8,
      );
      doc.line(
        pageWidth - margin - 60,
        finalY + 16,
        pageWidth - margin - 10,
        finalY + 16,
      );
      doc.text(
        pengaturan?.namaKetuaPanitia || "Ketua Panitia",
        pageWidth - margin - 60,
        finalY + 20,
      );

      doc.save("Daftar-Pemilih.pdf");
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("Gagal export PDF. Coba lagi.");
    }
  };

  const exportExcel = () => {
    try {
      const now = new Date();
      const printDate =
        now.toLocaleDateString("id-ID") + " " + now.toLocaleTimeString("id-ID");
      const printBy = localStorage.getItem("userName") || "Admin System";

      const ws = XLSX.utils.aoa_to_sheet([
        [`DAFTAR PEMILIH${getFilterLabel() ? " - " + getFilterLabel() : ""}`],

        [pengaturan?.judul || "PEMILIHAN"],
        [pengaturan?.judul2 || "KELURAHAN"],
        [pengaturan?.judul3 || ""],
        [`WILAYAH PEMILIHAN ${selectedWilayah || "."}`],
        [],
        [
          "No",
          "Nama KK",
          "Alamat",
          "No Rumah",
          "Jenis Kelamin",
          "Cara Memilih",
          "Nomor Handphone",
        ],
        ...filteredPemilih.map((voter, index) => [
          index + 1,
          voter.nama || "-",
          voter.alamatJalan || "-",
          voter.nomorRumah || "-",
          voter.jenisKelamin === "Laki-Laki"
            ? "Laki-laki"
            : voter.jenisKelamin === "Perempuan"
              ? "Perempuan"
              : "-",
          voter.caraMemilih || "",
          voter.nomorHP || "-",
        ]),
        [],
        ["Disahkan di Semarang"],
        ["Pada : .............................."],
        [],
        [pengaturan?.namaKetuaPanitia || "Ketua RT"],
        [],
        [`Dicetak melalui: Aplikasi Pemilihan Online`],
        [`Tanggal & Waktu: ${printDate}`],
        [`Dicetak oleh: ${printBy}`],
      ]);

      ws["!cols"] = [
        { wch: 5 },
        { wch: 25 },
        { wch: 30 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Daftar Pemilih");
      XLSX.writeFile(wb, "Daftar-Pemilih.xlsx");
    } catch (err) {
      console.error("Error exporting Excel:", err);
      alert("Gagal export Excel. Coba lagi.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  const getFilterLabel = () => {
    if (filterStatus === "online") return "ONLINE";
    if (filterStatus === "offline") return "OFFLINE";
    return "";
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Filter Wilayah Pemilihan
          </label>
          <select
            value={selectedWilayah}
            onChange={(e) => {
              setSelectedWilayah(e.target.value);
              setCurrentPage(1);
              setSearchTerm("");
            }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Semua Wilayah</option>
            {allWilayah.map((wilayah) => (
              <option key={wilayah} value={wilayah}>
                {wilayah}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Filter Cara Memilih
          </label>
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="semua">Semua (Online & Offline)</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <FileText size={18} />
          Export PDF
        </button>
        <button
          onClick={exportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Download size={18} />
          Export Excel
        </button>
      </div>

      <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg border border-gray-300">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Tampilkan</label>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-600">data per halaman</span>
        </div>
        <span className="text-sm text-gray-600">
          Total: {filteredPemilih.length} data
        </span>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-green-500 text-white p-4 text-center font-bold text-lg">
          DAFTAR PEMILIH
          {getFilterLabel() && (
            <span className="ml-2 font-bold text-lg">- {getFilterLabel()}</span>
          )}
        </div>

        <div className="bg-gray-50 p-4 text-center text-sm border-b">
          <p className="font-semibold">
            {pengaturan?.judul || "PEMILIHAN"}{" "}
            {pengaturan?.judul2 || "KELURAHAN"} {pengaturan?.judul3 || ""}
          </p>
          <p className="font-semibold">
            WILAYAH PEMILIHAN {selectedWilayah || "....."}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-3 w-10">No</th>
                <th className="border p-3">Nama KK</th>
                <th className="border p-3">Alamat</th>
                <th className="border p-3 w-24">No Rumah</th>
                <th className="border p-3 w-28">Jenis Kelamin</th>
                <th className="border p-3 w-24">Cara Memilih</th>
                <th className="border p-3 w-28">Nomor Handphone</th>
              </tr>
            </thead>
            <tbody>
              {getPaginatedData().map((voter, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border p-3 text-center">
                    {(currentPage - 1) * rowsPerPage + idx + 1}
                  </td>
                  <td className="border p-3">{voter.nama || "-"}</td>
                  <td className="border p-3">{voter.alamatJalan || "-"}</td>
                  <td className="border p-3 text-center">
                    {voter.nomorRumah || "-"}
                  </td>
                  <td className="border p-3 text-center">
                    {voter.jenisKelamin === "Laki-Laki"
                      ? "Laki-laki"
                      : voter.jenisKelamin === "Perempuan"
                        ? "Perempuan"
                        : "-"}
                  </td>
                  <td className="border p-3 text-center">
                    {voter.caraMemilih || "_______"}
                  </td>
                  <td className="border p-3 text-center">
                    {voter.nomorHP || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white p-4 border-t flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">
              Halaman {currentPage} dari {getTotalPages()}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Sebelumnya
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(getTotalPages(), currentPage + 1))
              }
              disabled={currentPage === getTotalPages()}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Selanjutnya
            </button>
          </div>
        </div>

        <div className="bg-white p-6 text-sm">
          <div className="flex justify-end w-full">
            <div className="w-56">
              <p className="mb-1">Disahkan di Semarang</p>
              <p className="mb-8">Pada : ..............................</p>
              <div className="border-t border-gray-800 mb-2"></div>
              <p>{pengaturan?.namaKetuaPanitia || "Ketua RT"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
