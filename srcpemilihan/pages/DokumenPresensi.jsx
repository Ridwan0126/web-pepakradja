"use client";

import { useState, useEffect } from "react";
import {
  getAllVoters,
  getAllOnlineVotes,
  getAllOfflineVotes,
} from "../utils/firestore";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function DokumenPresensi() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [votesOffline, votesOnline, votersData] = await Promise.all([
        getAllOfflineVotes(),
        getAllOnlineVotes(),
        getAllVoters(),
      ]);

      const allVotes = [...(votesOffline || []), ...(votesOnline || [])];
      const voterIds = new Set(
        allVotes.map((v) => v.pemilihId || v.pemilihNama),
      );

      const votersWithStatus = votersData.map((voter) => ({
        ...voter,
        sudahMemilih: voterIds.has(voter.id) || voterIds.has(voter.nama),
      }));

      setVoters(votersWithStatus);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const element = document.getElementById("presensi-table");
    const opt = {
      margin: 10,
      filename: "dokumen-presensi.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const hadir = voters.filter((v) => v.sudahMemilih).length;
  const tidakHadir = voters.length - hadir;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dokumen Presensi</h1>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-gray-600 text-sm">Total Pemilih</p>
          <p className="text-3xl font-bold text-blue-600">{voters.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-gray-600 text-sm">Hadir</p>
          <p className="text-3xl font-bold text-green-600">{hadir}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-gray-600 text-sm">Tidak Hadir</p>
          <p className="text-3xl font-bold text-red-600">{tidakHadir}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div id="presensi-table" className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="p-3 text-left border">No</th>
                <th className="p-3 text-left border">Nama</th>
                <th className="p-3 text-left border">Alamat</th>
                <th className="p-3 text-left border">No Telepon</th>
                <th className="p-3 text-left border">Wilayah</th>
                <th className="p-3 text-center border">Status</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter, idx) => (
                <tr key={voter.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 border">{idx + 1}</td>
                  <td className="p-3 border font-medium">{voter.nama}</td>
                  <td className="p-3 border text-sm">{voter.alamat || "-"}</td>
                  <td className="p-3 border">{voter.noTelepon || "-"}</td>
                  <td className="p-3 border text-sm">
                    {voter.wilayahPemilih || "-"}
                  </td>
                  <td className="p-3 border text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        voter.sudahMemilih
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {voter.sudahMemilih ? "Hadir" : "Tidak Hadir"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
