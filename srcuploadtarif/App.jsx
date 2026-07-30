import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, updateDoc, getDocs, collection, deleteDoc } from 'firebase/firestore';
import { Edit, Trash2, Download, Check, X, Trash } from 'lucide-react';
import { utils, writeFile } from 'xlsx';
import UploadExcel from './components/UploadExcel';

export default function App() {
  const [listData, setListData] = useState([]);
  const [activeData, setActiveData] = useState(null);
  const [editingInfo, setEditingInfo] = useState(null);
  const [pencermatanText, setPencermatanText] = useState("");
  const [editingName, setEditingName] = useState(null);

  const loadList = async () => {
    const snapshot = await getDocs(collection(db, "retribusi_data"));
    setListData(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => { loadList(); }, []);

  const handleRename = async (id, newName) => {
    await updateDoc(doc(db, "retribusi_data", id), { name: newName });
    setEditingName(null);
    loadList();
  };

  const deleteSingle = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Hapus data ini?")) {
      await deleteDoc(doc(db, "retribusi_data", id));
      if (activeData?.id === id) setActiveData(null);
      loadList();
    }
  };

  const deleteAll = async () => {
    if (window.confirm("Hapus SEMUA data?")) {
      for (let d of listData) await deleteDoc(doc(db, "retribusi_data", d.id));
      setActiveData(null); loadList();
    }
  };

  const exportToExcel = () => {
    const flatData = activeData.groups.flatMap(g => g.items.map(i => ({ Kategori: g.title, ...i })));
    const ws = utils.json_to_sheet(flatData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Data");
    writeFile(wb, `${activeData.name}.xlsx`);
  };

  const updatePencermatan = async () => {
    const { groupIdx, itemIdx } = editingInfo;
    const newGroups = [...activeData.groups];
    newGroups[groupIdx].items[itemIdx].hasilPencermatan = pencermatanText;
    await updateDoc(doc(db, "retribusi_data", activeData.id), { groups: newGroups });
    setActiveData({ ...activeData, groups: newGroups });
    setEditingInfo(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 text-sm">
      {/* Sidebar Ramping */}
      <div className="w-64 bg-white border-r p-3 flex flex-col">
        <UploadExcel onUploadSuccess={loadList} />
        <button onClick={deleteAll} className="mt-2 text-red-500 flex items-center gap-1 text-xs"><Trash size={14}/> Hapus Semua</button>
        <div className="mt-4 flex-1 overflow-y-auto">
          {listData.map(d => (
            <div key={d.id} className="p-2 border-b hover:bg-gray-100 flex justify-between items-center cursor-pointer">
              {editingName === d.id ? (
                <input defaultValue={d.name} onBlur={(e) => handleRename(d.id, e.target.value)} className="w-full border p-1" autoFocus />
              ) : (
                <>
                  <span onClick={() => setActiveData(d)} className="truncate flex-1">{d.name}</span>
                  <div className="flex gap-1">
                    <Edit size={14} className="text-gray-400" onClick={() => setEditingName(d.id)} />
                    <Trash2 size={14} className="text-red-400" onClick={(e) => deleteSingle(e, d.id)} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeData && (
          <>
            <button onClick={exportToExcel} className="mb-4 bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1"><Download size={16}/> Export Excel</button>
            {activeData.groups.map((group, gIdx) => (
              <div key={gIdx} className="mb-6 bg-white p-4 shadow rounded">
                <h3 className="font-bold text-blue-800 mb-2">{group.title}</h3>
                <table className="w-full border-collapse border">
                  <thead><tr className="bg-gray-100"><th>No</th><th>Uraian</th><th>Tarif</th><th>Hasil</th><th>Aksi</th></tr></thead>
                  <tbody>
                    {group.items.map((item, iIdx) => (
                      <tr key={iIdx} className="border-b">
                        <td className="p-2 border">{item.noUrut}</td>
                        <td className="p-2 border">{item.Uraian}</td>
                        <td className="p-2 border">{item.TarifUsulan}</td>
                        <td className="p-2 border text-blue-700 italic">{item.hasilPencermatan || "-"}</td>
                        <td className="p-2 border text-center">
                          <button onClick={() => { setEditingInfo({groupIdx: gIdx, itemIdx: iIdx}); setPencermatanText(item.hasilPencermatan); }} className="bg-blue-500 text-white px-2 py-1 rounded text-xs">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Edit Sidebar */}
      {editingInfo && (
        <div className="w-80 bg-white border-l p-6 shadow-xl">
          <h3 className="font-bold mb-4">Edit Pencermatan</h3>
          <textarea className="w-full h-32 border p-2" value={pencermatanText} onChange={e => setPencermatanText(e.target.value)}/>
          <button onClick={updatePencermatan} className="w-full bg-green-500 text-white py-2 mt-2">Simpan</button>
        </div>
      )}
    </div>
  );
}