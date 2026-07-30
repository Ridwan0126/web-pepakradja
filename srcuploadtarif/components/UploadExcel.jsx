import React from 'react';
import { Upload } from 'lucide-react';
import { read, utils } from 'xlsx';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function UploadExcel({ onUploadSuccess }) {
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = utils.sheet_to_json(sheet, { header: 1 });

    let groupedData = [];
    let currentGroup = null;

    rawData.forEach((row) => {
    // 1. Deteksi Judul Utama / Sub-Header
    if (row[0] && !row[1] && !row[2]) {
      currentGroup = { title: row[0], items: [] };
      groupedData.push(currentGroup);
    } 
    // 2. Deteksi baris data, tapi BUANG baris yang isinya sama dengan judul kolom
    else if (currentGroup && row[1] && row[1] !== "Uraian") { 
      currentGroup.items.push({
        noUrut: row[0] || "",
        Uraian: row[1] || "",
        Satuan: row[2] || "",
        TarifSemula: row[3] || 0,
        TarifUsulan: row[4] || 0,
        Persen: row[5] || "",
        hasilPencermatan: "" 
      });
    }
  });

    await setDoc(doc(db, "retribusi_data", `data_${Date.now()}`), {
      name: workbook.SheetNames[0],
      groups: groupedData
    });

    onUploadSuccess();
    alert("Data berhasil diunggah!");
  };

  return (
    <label className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 w-max">
      <Upload size={20} /> Upload Excel
      <input type="file" className="hidden" onChange={handleFileUpload} accept=".xlsx" />
    </label>
  );
}