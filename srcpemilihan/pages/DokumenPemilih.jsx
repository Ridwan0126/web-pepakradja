"use client";

import { useState, useEffect } from "react";
import { getAllVoters, getPengaturan } from "../utils/firestore";
import { Download } from "lucide-react";
import html2pdf from "html2pdf.js";

export default function DokumenPemilih() {
  const [voters, setVoters] = useState([]);
  const [pengaturan, setPengaturan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [votersData, settingsData] = await Promise.all([
        getAllVoters(),
        getPengaturan(),
      ]);
      setVoters(votersData || []);
      setPengaturan(settingsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const element = document.getElementById("pemilih-table");
    const opt = {
      margin: 10,
      filename: "dokumen-pemilih.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: "landscape", unit: "mm", format: "a4" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const filteredVoters = voters.filter(
    (v) =>
      v.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.noTelepon?.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dokumen Pemilih</h1>
        <button
          onClick={generatePDF}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      {pengaturan && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {pengaturan.judulPemilihan}
          </h2>
          <p className="text-gray-600 mt-1">{pengaturan.deskripsi}</p>
          <p className="text-sm text-gray-500 mt-2">
            Periode: {pengaturan.periode}
          </p>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <input
          type="text"
          placeholder="Cari berdasarkan nama atau no telepon..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div id="pemilih-table" className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <tr>
                <th className="p-3 text-left border">No</th>
                <th className="p-3 text-left border">Nama</th>
                <th className="p-3 text-left border">Alamat</th>
                <th className="p-3 text-left border">No Telepon</th>
                <th className="p-3 text-left border">Wilayah</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoters.map((voter, idx) => (
                <tr key={voter.id} className="hover:bg-gray-50 border-b">
                  <td className="p-3 border">{idx + 1}</td>
                  <td className="p-3 border font-medium">{voter.nama}</td>
                  <td className="p-3 border text-sm">{voter.alamat || "-"}</td>
                  <td className="p-3 border">{voter.noTelepon || "-"}</td>
                  <td className="p-3 border text-sm">
                    {voter.wilayahPemilih || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-right">
        Total: {filteredVoters.length} pemilih
      </p>
    </div>
  );
}
