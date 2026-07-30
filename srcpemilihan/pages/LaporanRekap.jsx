"use client";

import { motion } from "framer-motion";
import { FileText, Download, FileSpreadsheet } from "lucide-react";
import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import {
  getPengaturan,
  getAllRegions,
  getAllVoters,
  getAllOnlineVotes,
  getAllOfflineVotes,
} from "../utils/firestore";
import { collection, onSnapshot, query } from "firebase/firestore";
import { getDb } from "../utils/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function LaporanRekap() {
  const [pengaturan, setPengaturan] = useState({});
  const [wilayahList, setWilayahList] = useState([]);
  const [pemilih, setPemilih] = useState([]);
  const [votesOnline, setVotesOnline] = useState([]);
  const [votesOffline, setVotesOffline] = useState([]);
  const [rekap, setRekap] = useState([]);
  const [selectedWilayah, setSelectedWilayah] = useState("");

  const { user } = useAuth();
  const isKoordinator = user?.role === "koordinator";

  useEffect(() => {
    if (isKoordinator && user?.wilayah) {
      setSelectedWilayah(user.wilayah);
    }
  }, [isKoordinator, user?.wilayah]);

  useEffect(() => {
    const unsubscribers = [];

    const loadData = async () => {
      try {
        const savedPengaturan = await getPengaturan();
        const savedWilayah = await getAllRegions();
        const savedPemilih = await getAllVoters();
        const vOnline = await getAllOnlineVotes();
        const vOffline = await getAllOfflineVotes();

        setPengaturan(savedPengaturan || {});
        setWilayahList(savedWilayah || []);
        setPemilih(savedPemilih || []);
        setVotesOnline(vOnline || []);
        setVotesOffline(vOffline || []);

        const rekapData = savedWilayah.map((w) => {
          const pemilihWilayah = savedPemilih.filter(
            (p) => p.wilayahPemilih === w.wilayahPemilih,
          );
          const jumlahPemilih = pemilihWilayah.length;

          const vOnlineWilayah = vOnline.filter((v) => {
            const pemilih = savedPemilih.find((p) => p.id === v.pemilihId);
            return pemilih?.wilayahPemilih === w.wilayahPemilih;
          });

          const vOfflineWilayah = vOffline.filter(
            (v) =>
              v.wilayahPemilih === w.wilayahPemilih ||
              v.wilayahNama === w.wilayahPemilih ||
              v.wilayahId === w.wilayahPemilih,
          );

          const onlineSah = vOnlineWilayah.filter(
            (v) =>
              v.statusSuara === "SAH" || (v.calonId !== null && !v.statusSuara),
          ).length;
          const onlineTidakSah = vOnlineWilayah.filter(
            (v) =>
              v.statusSuara === "TIDAK SAH" ||
              (v.calonId === null && !v.statusSuara),
          ).length;
          const offlineSah = vOfflineWilayah.filter(
            (v) => v.statusSuara === "SAH",
          ).length;
          const offlineTidakSah = vOfflineWilayah.filter(
            (v) => v.statusSuara === "TIDAK SAH",
          ).length;

          const suaraMasuk =
            onlineSah + onlineTidakSah + offlineSah + offlineTidakSah;
          const tidakMemilih = jumlahPemilih - suaraMasuk;

          console.log(
            `[v0] Wilayah ${w.wilayahPemilih} - Online: ${vOnlineWilayah.length}, Offline: ${vOfflineWilayah.length}, Total: ${suaraMasuk}`,
          );

          return {
            wilayah: w.wilayahPemilih,
            jumlahPemilih,
            onlineSah,
            onlineTidakSah,
            offlineSah,
            offlineTidakSah,
            suaraMasuk,
            tidakMemilih,
          };
        });

        const displayRekap = isKoordinator
          ? rekapData.filter((r) => r.wilayah === user?.wilayah)
          : rekapData;

        setRekap(displayRekap);
      } catch (error) {
        console.error("[v0] Error loading data from Firestore:", error);
      }
    };

    loadData();

    const initListeners = async () => {
      const firebaseDb = await getDb();

      const votesOfflineQuery = query(collection(firebaseDb, "votesOffline"));
      const unsubOffline = onSnapshot(votesOfflineQuery, () => {
        loadData();
      });
      unsubscribers.push(unsubOffline);

      const suaraOnlineQuery = query(collection(firebaseDb, "suaraOnline"));
      const unsubOnline = onSnapshot(suaraOnlineQuery, () => {
        loadData();
      });
      unsubscribers.push(unsubOnline);
    };

    initListeners();

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [isKoordinator, user?.wilayah]);

  const exportPDF = () => {
    console.log("[v0] Exporting PDF for Laporan Rekap...");

    try {
      const doc = new jsPDF("landscape");
      const pageWidth = doc.internal.pageSize.width;

      const header1 = pengaturan.judul1 || "";
      const header2 = pengaturan.judul2 || "";
      const header3 = pengaturan.judul3 || "";
      const ketuaPanitia = pengaturan.namaKetuaPanitia || "";

      let yPos = 20;

      /* ================= HEADER ================= */
      if (header1) {
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(header1, pageWidth / 2, yPos, { align: "center" });
        yPos += 7;
      }

      if (header2) {
        doc.setFontSize(12);
        doc.text(header2, pageWidth / 2, yPos, { align: "center" });
        yPos += 7;
      }

      if (header3) {
        doc.setFontSize(12);
        doc.text(header3, pageWidth / 2, yPos, { align: "center" });
        yPos += 10;
      }

      if (ketuaPanitia) {
        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Ketua Panitia: ${ketuaPanitia}`, pageWidth / 2, yPos, {
          align: "center",
        });
        yPos += 8;
      }

      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("LAPORAN REKAP SUARA", pageWidth / 2, yPos, { align: "center" });
      yPos += 10;

      /* ================= DATA ================= */
      const bodyRows = rekap.map((r) => [
        r.wilayah,
        r.jumlahPemilih,
        r.onlineSah,
        r.onlineTidakSah,
        r.offlineSah,
        r.offlineTidakSah,
        r.suaraMasuk,
        r.tidakMemilih,
      ]);

      /* TOTAL ROW */
      bodyRows.push([
        "TOTAL",
        total.jumlahPemilih,
        total.onlineSah,
        total.onlineTidakSah,
        total.offlineSah,
        total.offlineTidakSah,
        total.suaraMasuk,
        total.tidakMemilih,
      ]);

      /* ================= TABEL ================= */
      autoTable(doc, {
        startY: yPos,

        /* ===== MULTI HEADER ===== */
        head: [
          [
            { content: "Wilayah Pemilihan", rowSpan: 2 },
            { content: "Jumlah Pemilih", rowSpan: 2 },
            { content: "Suara Online", colSpan: 2 },
            { content: "Suara Offline", colSpan: 2 },
            { content: "Suara Masuk", rowSpan: 2 },
            { content: "Tidak Memilih", rowSpan: 2 },
          ],
          ["Sah", "Tidak Sah", "Sah", "Tidak Sah"],
        ],

        body: bodyRows,

        /* ===== STYLE UMUM ===== */
        styles: {
          fontSize: 9,
          cellPadding: 3,
          valign: "middle",
          halign: "center",
          lineColor: [200, 200, 200], // BONUS: garis tabel
          lineWidth: 0.2,
        },

        /* ===== HEADER STYLE ===== */
        headStyles: {
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },

        /* ===== ZEBRA ROW ===== */
        alternateRowStyles: {
          fillColor: [245, 247, 250],
        },

        /* ===== KOLOM ===== */
        columnStyles: {
          0: { halign: "left", cellWidth: 40 },
          1: { cellWidth: 28 },
          2: { cellWidth: 24 },
          3: { cellWidth: 28 },
          4: { cellWidth: 24 },
          5: { cellWidth: 28 },
          6: { cellWidth: 26 },
          7: { cellWidth: 30 },
        },

        /* ===== TOTAL ROW STYLE ===== */
        didParseCell: (data) => {
          if (data.row.index === bodyRows.length - 1) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor = [219, 234, 254]; // biru muda
          }
        },

        margin: { left: 14, right: 14 },

        /* ===== FOOTER OTOMATIS ===== */
        didDrawPage: () => {
          const pageHeight = doc.internal.pageSize.height;
          doc.setFontSize(8);
          doc.setFont(undefined, "normal");
          doc.text(
            "Perangkat Lunak Ini Disediakan Oleh manasukatour.com Semarang © 2025",
            14,
            pageHeight - 15,
          );
          doc.text("Untuk Kemajuan Negeri", 14, pageHeight - 10);
        },
      });

      /* ================= SAVE ================= */
      const fileName = `Laporan-Rekap-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      doc.save(fileName);

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "PDF berhasil diexport",
        confirmButtonColor: "#10b981",
        timer: 2000,
      });
    } catch (error) {
      console.error("[v0] Error exporting PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Export PDF",
        text: error.message || "Terjadi kesalahan saat membuat PDF.",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const exportExcel = () => {
    let csvContent =
      "Wilayah Pemilihan,Jumlah Pemilih,Online Sah,Online Tidak Sah,Offline Sah,Offline Tidak Sah,Suara Masuk,Tidak Memilih\n";

    rekap.forEach((r) => {
      csvContent += `${r.wilayah},${r.jumlahPemilih},${r.onlineSah},${r.onlineTidakSah},${r.offlineSah},${r.offlineTidakSah},${r.suaraMasuk},${r.tidakMemilih}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Laporan-Rekap-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.click();

    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Excel berhasil diexport",
      confirmButtonColor: "#10b981",
      timer: 2000,
    });
  };

  const total = rekap.reduce(
    (acc, r) => ({
      jumlahPemilih: acc.jumlahPemilih + r.jumlahPemilih,
      onlineSah: acc.onlineSah + r.onlineSah,
      onlineTidakSah: acc.onlineTidakSah + r.onlineTidakSah,
      offlineSah: acc.offlineSah + r.offlineSah,
      offlineTidakSah: acc.offlineTidakSah + r.offlineTidakSah,
      suaraMasuk: acc.suaraMasuk + r.suaraMasuk,
      tidakMemilih: acc.tidakMemilih + r.tidakMemilih,
    }),
    {
      jumlahPemilih: 0,
      onlineSah: 0,
      onlineTidakSah: 0,
      offlineSah: 0,
      offlineTidakSah: 0,
      suaraMasuk: 0,
      tidakMemilih: 0,
    },
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-text-primary)]">
                Laporan Rekap Suara
              </h1>
              <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
                Ringkasan perolehan suara per wilayah
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm"
            >
              <Download className="w-4 h-4 md:w-5 md:h-5" />
              PDF
            </button>
            <button
              onClick={exportExcel}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm"
            >
              <FileSpreadsheet className="w-4 h-4 md:w-5 md:h-5" />
              EXCEL
            </button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] overflow-hidden"
      >
        <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-[var(--color-border)]">
          {pengaturan.judul1 && (
            <h2 className="text-lg md:text-xl font-bold text-[var(--color-text-primary)]">
              {pengaturan.judul1}
            </h2>
          )}
          {pengaturan.judul2 && (
            <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
              {pengaturan.judul2}
            </p>
          )}
          {pengaturan.judul3 && (
            <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
              {pengaturan.judul3}
            </p>
          )}
          {pengaturan.namaKetuaPanitia && (
            <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
              Ketua Panitia: {pengaturan.namaKetuaPanitia}
            </p>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-[var(--color-surface-hover)]">
              <tr>
                <th
                  rowSpan={2}
                  className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border)]"
                >
                  Wilayah
                  <br />
                  Pemilihan
                </th>
                <th
                  rowSpan={2}
                  className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border)]"
                >
                  Jumlah
                  <br />
                  Pemilih
                </th>
                <th
                  colSpan={2}
                  className="px-2 md:px-4 py-2 text-center font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border)]"
                >
                  <div className="text-center font-bold mb-1">Jumlah</div>
                  Suara Online
                </th>
                <th
                  colSpan={2}
                  className="px-2 md:px-4 py-2 text-center font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border)]"
                >
                  <div className="text-center font-bold mb-1">Jumlah</div>
                  Suara Offline
                </th>
                <th
                  rowSpan={2}
                  className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border)]"
                >
                  Suara
                  <br />
                  Masuk
                </th>
                <th
                  rowSpan={2}
                  className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-[var(--color-text-primary)]"
                >
                  Tidak
                  <br />
                  Memilih
                </th>
              </tr>
              <tr className="bg-[var(--color-surface-hover)]">
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)] border-r border-[var(--color-border)]">
                  Sah
                </th>
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)] border-r border-[var(--color-border)]">
                  Tidak Sah
                </th>
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)] border-r border-[var(--color-border)]">
                  Sah
                </th>
                <th className="px-2 md:px-4 py-1 md:py-2 text-center text-[10px] md:text-xs font-medium text-[var(--color-text-secondary)] border-r border-[var(--color-border)]">
                  Tidak Sah
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {rekap.map((r, index) => (
                <tr
                  key={index}
                  className="hover:bg-[var(--color-surface-hover)] transition-colors"
                >
                  <td className="px-2 md:px-4 py-2 md:py-3 text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                    {r.wilayah}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                    {r.jumlahPemilih}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                    {r.onlineSah}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                    {r.onlineTidakSah}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                    {r.offlineSah}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                    {r.offlineTidakSah}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center font-semibold text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                    {r.suaraMasuk}
                  </td>
                  <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)]">
                    {r.tidakMemilih}
                  </td>
                </tr>
              ))}
              <tr className="bg-blue-500/10 font-bold">
                <td
                  colSpan={1}
                  className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]"
                >
                  TOTAL
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                  {total.jumlahPemilih}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                  {total.onlineSah}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                  {total.onlineTidakSah}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                  {total.offlineSah}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                  {total.offlineTidakSah}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)] border-r border-[var(--color-border)]">
                  {total.suaraMasuk}
                </td>
                <td className="px-2 md:px-4 py-2 md:py-3 text-center text-[var(--color-text-primary)]">
                  {total.tidakMemilih}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
