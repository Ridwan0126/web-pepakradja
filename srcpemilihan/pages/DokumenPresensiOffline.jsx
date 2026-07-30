"use client";

import { useState, useEffect } from "react";
import { Download, FileText, Search } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getDb, getPengaturan } from "../utils/firestore";
import { onSnapshot, collection } from "firebase/firestore";

export default function DokumenPresensiOffline() {
  const [pemilih, setPemilih] = useState([]);
  const [pengaturan, setPengaturan] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWilayah, setSelectedWilayah] = useState("");
  const [allWilayah, setAllWilayah] = useState([]);
  const [allPemilih, setAllPemilih] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [suaraOnline, setSuaraOnline] = useState([]);
  const [votesOffline, setVotesOffline] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [hasilWilayah, setHasilWilayah] = useState([]);
  const [filterCaraMemilih, setFilterCaraMemilih] = useState("");

  useEffect(() => {
    let mounted = true;
    const unsubscribers = [];

    const initSnapshot = async () => {
      const db = await getDb();

      // PEMILIH
      unsubscribers.push(
        onSnapshot(collection(db, "pemilih"), (snap) => {
          if (!mounted) return;
          setPemilih(
            snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          );
        }),
      );

      // SUARA ONLINE
      unsubscribers.push(
        onSnapshot(collection(db, "suaraOnline"), (snap) => {
          if (!mounted) return;
          setSuaraOnline(
            snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          );
        }),
      );

      // VOTE OFFLINE
      unsubscribers.push(
        onSnapshot(collection(db, "votesOffline"), (snap) => {
          if (!mounted) return;
          setVotesOffline(
            snap.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })),
          );
        }),
      );
    };

    initSnapshot();

    return () => {
      mounted = false;
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);
  useEffect(() => {
    if (
      pemilih.length > 0 ||
      suaraOnline.length > 0 ||
      votesOffline.length > 0
    ) {
      setLoading(false);
    }
  }, [pemilih, suaraOnline, votesOffline]);
  useEffect(() => {
    if (!pemilih.length) return;

    const wilayahUnik = [
      ...new Set(pemilih.map((p) => p.wilayahPemilih).filter(Boolean)),
    ];

    setAllWilayah(wilayahUnik);
  }, [pemilih]);
  useEffect(() => {
    if (!pemilih.length) return;

    const wilayahUnik = [
      ...new Set(pemilih.map((p) => p.wilayahPemilih).filter(Boolean)),
    ];

    setAllWilayah(wilayahUnik);
  }, [pemilih]);
  useEffect(() => {
    const loadPengaturan = async () => {
      try {
        const data = await getPengaturan();
        if (data) {
          setPengaturan(data);
        }
      } catch (err) {
        console.error("Gagal load pengaturan:", err);
      }
    };

    loadPengaturan();
  }, []);

  // useEffect(() => {
  //   loadHasil();
  // }, [pemilih, suaraOnline, votesOffline, selectedWilayah]);

  // const filteredPemilih = dataPresensi
  //   .filter((p) => {
  //     if (!selectedWilayah) return true;
  //     return p.wilayahPemilih === selectedWilayah;
  //   })
  //   .filter((p) =>
  //     (p.nama || "").toLowerCase().includes(searchTerm.toLowerCase()),
  //   )
  //   .sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

  // const getTotalPages = () => Math.ceil(filteredPemilih.length / rowsPerPage);

  // const getPaginatedData = () => {
  //   const startIndex = (currentPage - 1) * rowsPerPage;
  //   const endIndex = startIndex + rowsPerPage;
  //   return filteredPemilih.slice(startIndex, endIndex);
  // };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number.parseInt(e.target.value));
    setCurrentPage(1);
  };

  const getVoterWhoHaveVoted = (suaraOnline, votesOffline) => {
    const set = new Set();

    suaraOnline.forEach((v) => {
      if (v.pemilihId) set.add(v.pemilihId);
    });

    votesOffline.forEach((v) => {
      if (v.pemilihId) set.add(v.pemilihId);
    });

    return set;
  };

  const mergePemilihStatus = (pemilih, suaraOnline, votesOffline) => {
    const onlineMap = new Map();
    const offlineMap = new Map();

    suaraOnline.forEach((v) => {
      if (v.pemilihId) onlineMap.set(v.pemilihId, v);
    });

    votesOffline.forEach((v) => {
      if (v.pemilihId) offlineMap.set(v.pemilihId, v);
    });

    return pemilih.map((p) => {
      let sudahMemilih = false;
      let waktuMemilih = null;
      let statusSuara = "Belum memilih";

      if (onlineMap.has(p.id)) {
        sudahMemilih = true;
        waktuMemilih =
          onlineMap.get(p.id).timestamp || onlineMap.get(p.id).waktuMemilih;
        statusSuara = "Online";
      }

      if (offlineMap.has(p.id)) {
        sudahMemilih = true;
        waktuMemilih =
          offlineMap.get(p.id).timestamp || offlineMap.get(p.id).waktuMemilih;
        statusSuara = "Offline";
      }

      return {
        ...p,
        sudahMemilih,
        waktuMemilih,
        statusSuara,
      };
    });
  };

  const dataPresensi = pemilih.map((p) => {
    let waktuMemilih = null;
    let sudahMemilih = false;

    if (p.caraMemilih === "online") {
      const onlineVote = suaraOnline.find((v) => v.pemilihId === p.id);
      if (onlineVote) {
        sudahMemilih = true;
        waktuMemilih = onlineVote.timestamp || onlineVote.waktuMemilih || null;
      }
    }

    if (p.caraMemilih === "offline") {
      const offlineVote = votesOffline.find((v) => v.pemilihId === p.id);
      if (offlineVote) {
        sudahMemilih = true;
        waktuMemilih =
          offlineVote.timestamp || offlineVote.waktuMemilih || null;
      }
    }

    return {
      ...p,
      sudahMemilih,
      waktuMemilih,
      statusSuara:
        p.caraMemilih === "online"
          ? "Online"
          : p.caraMemilih === "offline"
            ? "Offline"
            : "-",
    };
  });

  const filteredPresensi = dataPresensi
    // filter sudah / belum memilih
    .filter((p) => {
      if (filterStatus === "sudah") return p.sudahMemilih === true;
      if (filterStatus === "belum") return p.sudahMemilih === false;
      return true;
    })
    // filter online / offline
    .filter((p) => {
      if (!filterCaraMemilih) return true;
      return p.caraMemilih === filterCaraMemilih;
    });

  const filteredPemilih = filteredPresensi
    .filter((p) => {
      if (!selectedWilayah) return true;
      return p.wilayahPemilih === selectedWilayah;
    })
    .filter((p) =>
      (p.nama || "").toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => (a.nama || "").localeCompare(b.nama || ""));

  const loadHasil = () => {
    if (!pemilih.length || !allWilayah.length) return;

    const voterWhoHaveVoted = getVoterWhoHaveVoted(suaraOnline, votesOffline);

    const hasilWilayah = allWilayah.map((namaWilayah) => {
      const pemilihWilayah = pemilih.filter(
        (p) => p.wilayahPemilih === namaWilayah,
      );

      const sudah = pemilihWilayah.filter((p) =>
        voterWhoHaveVoted.has(p.id),
      ).length;

      return {
        wilayah: namaWilayah,
        total: pemilihWilayah.length,
        sudah,
      };
    });

    setHasilWilayah(hasilWilayah);
  };
  const getTotalPages = () => Math.ceil(filteredPemilih.length / rowsPerPage);

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredPemilih.slice(startIndex, startIndex + rowsPerPage);
  };
  const getJudulPresensi = () => {
    if (filterCaraMemilih === "online") return "PRESENSI PEMILIH ONLINE";
    if (filterCaraMemilih === "offline") return "PRESENSI PEMILIH OFFLINE";
    return "PRESENSI PEMILIH (SEMUA)";
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
      doc.text(getJudulPresensi(), pageWidth / 2, currentY + 7, {
        align: "center",
      });

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
        voter.jenisKelamin || "-",
        "",
      ]);

      autoTable(doc, {
        head: [
          ["No", "Nama", "Alamat", "No Rumah", "Jenis Kelamin", "Tanda Tangan"],
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
          5: { halign: "center", cellWidth: 25 },
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

      doc.save("Presensi-Offline.pdf");
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
        [getJudulPresensi()],
        [pengaturan?.judul || "PEMILIHAN"],
        [pengaturan?.judul2 || "KELURAHAN"],
        [pengaturan?.judul3 || ""],
        [`WILAYAH PEMILIHAN ${selectedWilayah || "."}`],
        [],
        ["No", "Nama", "Alamat", "No Rumah", "Jenis Kelamin", "Tanda Tangan"],
        ...filteredPemilih.map((voter, index) => [
          index + 1,
          voter.nama || "-",
          voter.alamatJalan || "-",
          voter.nomorRumah || "-",
          voter.jenisKelamin || "-",
          "",
        ]),
        [],
        ["Disahkan di Semarang"],
        ["Pada : .............................."],
        [],
        [pengaturan?.namaKetuaPanitia || "Ketua Panitia"],
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
        { wch: 25 },
      ];
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Presensi Offline");
      XLSX.writeFile(wb, "Presensi-Offline.xlsx");
    } catch (err) {
      console.error("Error exporting Excel:", err);
      alert("Gagal export Excel. Coba lagi.");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg">
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
          value={filterCaraMemilih}
          onChange={(e) => {
            setFilterCaraMemilih(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Semua</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Filter Status Memilih
        </label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">Semua</option>
          <option value="sudah">Sudah Memilih</option>
          <option value="belum">Belum Memilih</option>
        </select>
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
        <div className="bg-green-500 text-white p-4 text-center font-bold">
          {getJudulPresensi()}
        </div>

        <div className="bg-gray-50 p-4 text-center text-sm border-b">
          <p className="font-semibold">{pengaturan?.judul || "PEMILIHAN"}</p>
          <p className="font-semibold">{pengaturan?.judul2 || "KELURAHAN"}</p>
          <p className="font-semibold">{pengaturan?.judul3 || ""}</p>
          <p className="font-semibold">
            WILAYAH PEMILIHAN {selectedWilayah || "....."}
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="border p-3 w-10">No</th>
                <th className="border p-3">Nama</th>
                <th className="border p-3">Alamat</th>
                <th className="border p-3 w-24">No Rumah</th>
                <th className="border p-3 w-28">Jenis Kelamin</th>
                <th className="border p-3 w-28">Status Suara</th>
                <th className="border p-3 w-32">Waktu Memilih</th>
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
                    {voter.jenisKelamin || "-"}
                  </td>
                  <td className="border p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold
      ${
        voter.statusSuara === "Online"
          ? "bg-blue-100 text-blue-700"
          : "bg-green-100 text-green-700"
      }`}
                    >
                      {voter.statusSuara}
                    </span>
                  </td>

                  <td className="border p-2 text-center">
                    {voter.waktuMemilih
                      ? new Date(
                          voter.waktuMemilih.seconds
                            ? voter.waktuMemilih.seconds * 1000
                            : voter.waktuMemilih,
                        ).toLocaleString("id-ID")
                      : ""}
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
              <p>{pengaturan?.namaKetuaPanitia || "Ketua Panitia"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
