import { useState, useEffect, useRef } from "react";
import {
  FileText,
  Search,
  Download,
  Printer,
  X,
  XCircle,
  Building2,
  MapPin,
  Landmark,
  Phone,
  Mail,
  User,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SPTRD() {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // SEARCH STATES (Mengikuti Header.jsx)
  const searchRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [obyekList, setObyekList] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [selectedObyek, setSelectedObyek] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeImage, setActiveImage] = useState("");

  const session =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wr_session")) || {}
      : {};

  const wr = session?.user || {};

  const rupiah = (val) => Number(val || 0).toLocaleString("id-ID");

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const today = formatDate(new Date());

  // =========================
  // CLICK OUTSIDE SEARCH PANEL
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // =========================
  // AUTO SEARCH (DEBOUNCE 500ms)
  // =========================
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (keyword.trim()) {
        handleSearch(keyword, 1, false);
      } else {
        setObyekList([]);
        setSearchOpen(false);
      }
    }, 500);

    return () => clearTimeout(debounce);
  }, [keyword]);

  const handleSearch = async (
    keywordSearch = keyword,
    pageNumber = 1,
    isLoadMore = false
  ) => {
    try {
      const query = keywordSearch.toLowerCase().trim();
      if (!query) return;

      if (!isLoadMore) {
        setLastSearch(keywordSearch);
        setLoadingSearch(true);
        setObyekList([]);
        setPage(1);
      } else {
        setIsFetchingMore(true);
      }

      setSearchOpen(true);

      // Ganti URL langsung ke path proxy /api-bapenda/
      const res = await fetch(
        `/bapenda/pepakraja/obyek?page=${pageNumber}&limit=20&search=${encodeURIComponent(query)}`,
        {
          headers: {
            token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
            Accept: "application/json",
          },
        }
      );

      const result = await res.json();
      const apiData = result?.data || [];

      setHasMore(apiData.length === 20);

      if (isLoadMore) {
        setObyekList((prev) => [...prev, ...apiData]);
      } else {
        setObyekList(apiData);
      }
    } catch (err) {
      console.error("SEARCH ERROR:", err);
    } finally {
      setLoadingSearch(false);
      setIsFetchingMore(false);
    }
  };


  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    handleSearch(lastSearch, nextPage, true);
  };

  const getAllPhotos = (item) => {
    const photos = [];
    if (item?.foto) photos.push(item.foto);
    if (item?.foto2) photos.push(item.foto2);
    if (item?.foto3) photos.push(item.foto3);
    if (item?.foto4) photos.push(item.foto4);
    return [...new Set(photos)];
  };

  const handlePreviewSPTRD = (obyekData) => {
    const targetObyek = obyekData || selectedObyek;
    if (!targetObyek) {
      Swal.fire(
        "Pilih Obyek",
        "Silakan pilih obyek retribusi terlebih dahulu",
        "warning"
      );
      return;
    }

    setFormData({
      nomor: `SPTRD/${new Date().getTime()}`,
      tanggal: formatDate(new Date()),
      nama: wr.nama || "-",
      alamat: wr.alamat || "-",
      nik: wr.nik_npwp || "-",
      npwrd: wr.npwrd || "-",
      telepon: wr.telepon || "-",
      email: wr.email || "-",
      pelayanan:
        targetObyek?.jenis?.jenis_retribusi ||
        targetObyek?.tariftbl?.penerimaan ||
        "-",
      obyek: targetObyek?.obyek_retribusi || "-",
      lokasi: targetObyek?.alamat || "-",
      keterangan:
        targetObyek?.keterangan || targetObyek?.judul_penawaran || "-",
      opd: targetObyek?.opd?.nama || "-",
      uppd: targetObyek?.uppd?.nama || "-",
      tarif: targetObyek?.tariftbl?.tarif || 0,
      satuan: targetObyek?.tariftbl?.satuan?.satuan || "-",
      kota: targetObyek?.kota?.kab_kota || "JAWA TENGAH",
      qr: `SPTRD-${targetObyek.id}`,
    });

    setShowPreviewModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("sptrd-document");

    html2pdf()
      .set({
        margin: 0,
        filename: `SPTRD-${formData.nomor}.pdf`,
        image: { type: "jpeg", quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: [330, 210], orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased tracking-tight">
      <Header />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        {/* INFO */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Surat Pemberitahuan Retribusi Daerah (SPTRD)
          </h1>
          <p className="opacity-90">
            Cari dan pilih objek retribusi di bawah ini untuk membuat SPTRD
            secara instan dan diajukan ke OPD terkait.
          </p>
        </div>

        {/* SEARCH BAR SECTION (Mengadopsi struktur Header.jsx) */}
        <div ref={searchRef} className="relative bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onFocus={() => {
                  if (keyword.trim()) setSearchOpen(true);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(keyword, 1, false)}
                placeholder="Cari nama obyek retribusi atau alamat..."
                className="w-full pl-12 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100/80 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {keyword && (
                <button
                  onClick={() => {
                    setKeyword("");
                    setObyekList([]);
                    setSearchOpen(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-slate-400 hover:text-slate-600"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={() => handleSearch(keyword, 1, false)}
              disabled={loadingSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <Search size={18} />
              {loadingSearch ? "Memuat..." : "Cari Objek"}
            </button>
          </div>

          {/* DROPDOWN / FLOATING RESULT PANEL (Persis seperti Header.jsx) */}
          <AnimatePresence>
            {searchOpen && keyword.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.99 }}
                transition={{ duration: 0.2 }}
                className="absolute left-0 right-0 mt-3 z-50 px-6"
              >
                <div className="rounded-[28px] border border-white/80 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden max-h-[450px]">
                  <div className="px-5 py-4 border-b border-gray-200/40 bg-white/50 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-black text-slate-900 tracking-tight">
                        Hasil Pencarian Objek Retribusi
                      </h2>
                      <p className="text-[11px] text-slate-500 font-bold uppercase mt-0.5">
                        {obyekList.length} Data Ditemukan
                      </p>
                    </div>
                    <button
                      onClick={() => setSearchOpen(false)}
                      className="w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {loadingSearch ? (
                      <div className="py-10 text-center text-xs text-slate-500 font-bold">
                        Sedang mencari data...
                      </div>
                    ) : obyekList.length === 0 ? (
                      <div className="py-10 text-center">
                        <p className="text-slate-500 font-medium text-xs">
                          Tidak ada objek retribusi yang cocok.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {obyekList.map((item, index) => {
                            const photo = getAllPhotos(item)[0];
                            return (
                              <motion.div
                                key={`${item.id}-${index}`}
                                whileHover={{ y: -2, scale: 1.01 }}
                                onClick={() => {
                                  setSelectedObyek(item);
                                  setActiveImage(photo);
                                  setSearchOpen(false);
                                  setShowDetailModal(true);
                                }}
                                className="flex items-center gap-3.5 p-3 rounded-2xl border border-gray-200/80 bg-white hover:bg-blue-50/40 hover:border-blue-500/40 shadow-sm transition-all cursor-pointer"
                              >
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-gray-200 flex-shrink-0">
                                  {photo ? (
                                    <img
                                      src={`https://rpp.bapenda.jatengprov.go.id/penatausahaan/storage/${photo}`}
                                      alt="foto"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
                                      <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                                    {item?.obyek_retribusi}
                                  </h3>
                                  <p className="text-[10px] text-blue-600 font-bold truncate uppercase mt-0.5">
                                    {item?.opd?.nama || "-"}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600 font-medium">
                                    <div className="flex items-center gap-0.5 truncate max-w-[50%]">
                                      <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                                      <span className="truncate">
                                        {item?.kota?.kab_kota || "-"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-emerald-600 font-bold flex-shrink-0">
                                      <Wallet className="w-3 h-3 text-emerald-500" />
                                      Rp {rupiah(item?.tariftbl?.tarif)}
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>

                        {hasMore && (
                          <div className="p-3 text-center">
                            <button
                              onClick={loadMore}
                              disabled={isFetchingMore}
                              className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                            >
                              {isFetchingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* DETAIL MODAL */}
        {showDetailModal && selectedObyek && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">
              <div className="bg-blue-700 text-white p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold">Detail Obyek Retribusi</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="hover:bg-white/20 p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">ID Obyek</label>
                    <p className="font-medium text-slate-800">{selectedObyek.id}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">Jenis Retribusi</label>
                    <p className="font-medium text-slate-800">{selectedObyek?.jenis?.jenis_retribusi}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">Obyek Retribusi</label>
                    <p className="font-medium text-slate-800">{selectedObyek.obyek_retribusi}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">Tarif</label>
                    <p className="text-green-600 font-bold">Rp {rupiah(selectedObyek?.tariftbl?.tarif)}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">Lokasi</label>
                    <p className="font-medium text-slate-800">{selectedObyek.alamat}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">Satuan</label>
                    <p className="font-medium text-slate-800">{selectedObyek?.tariftbl?.satuan?.satuan || "-"}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">OPD</label>
                    <p className="font-medium text-slate-800">{selectedObyek?.opd?.nama}</p>
                  </div>
                  <div>
                    <label className="font-semibold text-gray-500 text-xs">UPPD</label>
                    <p className="font-medium text-slate-800">{selectedObyek?.uppd?.nama}</p>
                  </div>
                </div>

                {selectedObyek.keterangan && (
                  <div className="mt-6">
                    <label className="font-semibold text-gray-500 text-xs">Keterangan</label>
                    <div className="bg-gray-50 p-4 rounded-xl mt-1 text-sm text-slate-700">
                      {selectedObyek.keterangan}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t p-5 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-xl text-sm font-semibold"
                >
                  Tutup
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handlePreviewSPTRD(selectedObyek);
                  }}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold flex items-center gap-2"
                >
                  Buat SPTRD <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL PREVIEW SPTRD */}
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto">
            <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg p-4 flex justify-center gap-3 print:hidden">
              <button onClick={handleDownloadPDF} className="btn-action bg-blue-700">
                <Download size={18} /> Download PDF
              </button>
              <button onClick={handlePrint} className="btn-action bg-gray-700">
                <Printer size={18} /> Print
              </button>
              <button onClick={() => setShowPreviewModal(false)} className="btn-action bg-red-600">
                <X size={18} /> Tutup
              </button>
            </div>

            <div className="flex justify-center py-10 print:p-0">
              <div id="sptrd-document" className="sptrd-paper-jtg">
                <div className="header-jtg">
                  <img
                    src="/images/logo-jateng-official.png"
                    alt="logo"
                    className="logo-jtg"
                  />
                  <div className="header-center">
                    <h2>PEMERINTAH PROVINSI JAWA TENGAH</h2>
                    <h3>{formData.opd}</h3>
                    <div>{formData.uppd}</div>
                  </div>
                </div>

                <div className="header-line"></div>

                <h1 className="title-jtg">
                  SURAT PEMBERITAHUAN RETRIBUSI DAERAH (SPTRD)
                </h1>

                <div className="tujuan-box">
                  <p>Kepada Yth:</p>
                  <p>Kepala {formData.opd}</p>
                  <p>Di</p>
                  <p>TEMPAT</p>
                </div>

                <p className="intro-text">Yang bertanda tangan dibawah ini, kami:</p>

                <div className="section-jtg">
                  <div className="section-title-jtg">I. Identitas Wajib Retribusi :</div>
                  <table className="table-jtg">
                    <tbody>
                      <tr><td>Nama</td><td>:</td><td>{formData.nama}</td></tr>
                      <tr><td>Alamat</td><td>:</td><td>{formData.alamat}</td></tr>
                      <tr><td>Nomor Induk Kependudukan</td><td>:</td><td>{formData.nik}</td></tr>
                      <tr><td>Nomor Induk Berusaha</td><td>:</td><td>{formData.npwrd}</td></tr>
                      <tr><td>Nomor Telepon</td><td>:</td><td>{formData.telepon}</td></tr>
                      <tr><td>Alamat Surat Elektronik</td><td>:</td><td>{formData.email}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="section-jtg">
                  <div className="section-title-jtg">II. Pelayanan Retribusi yang dimohon:</div>
                  <table className="table-jtg">
                    <tbody>
                      <tr><td>Jenis Retribusi</td><td>:</td><td>{formData.pelayanan}</td></tr>
                      <tr><td>Objek Retribusi</td><td>:</td><td>{formData.obyek}</td></tr>
                      <tr><td>Rincian Objek Retribusi</td><td>:</td><td>{formData.keterangan}</td></tr>
                      <tr><td>Uraian Deskripsi / Volume</td><td>:</td><td>Tarif Rp {rupiah(formData.tarif)} / {formData.satuan}</td></tr>
                      <tr><td>Lokasi</td><td>:</td><td>{formData.lokasi}</td></tr>
                      <tr><td>Tarif</td><td>:</td><td>Rp {rupiah(formData.tarif)}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="section-jtg">
                  <div className="section-title-jtg">III. Jangka waktu Retribusi :</div>
                  <div className="lampiran-jtg">
                    <p>Sebagai bahan pertimbangan, berikut kami lampirkan :</p>
                    <p>a. Fotokopi KTP;</p>
                    <p>b. Fotokopi NIB bagi Wajib Retribusi Badan Usaha;</p>
                    <p>c. Surat Kuasa bagi Wajib Retribusi yang tidak menandatangani SPTRD sendiri.</p>
                  </div>
                </div>

                <div className="pernyataan-jtg">
                  <p>
                    Apabila permohonan dikabulkan kami sanggup membayar Retribusi serta menanggung sanksi administratif atas keterlambatan pembayaran Retribusi sesuai ketentuan peraturan perundang-undangan yang berlaku atas kuasa saya.
                  </p>
                  <p>
                    Saya menyatakan bahwa yang kami beritahukan tersebut beserta lampirannya benar, lengkap dan jelas.
                  </p>
                </div>

                <div className="signature-jtg">
                  <div></div>
                  <div className="signature-right">
                    <p>{formData.kota}, {formData.tanggal}</p>
                    <p>Wajib Retribusi / Kuasa</p>
                    <div className="ttd-space-jtg"></div>
                    <p>.........................................</p>
                  </div>
                </div>

                <div className="footer-note">
                  <span>*Coret yang tidak perlu</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        .btn-action {
          color: white;
          border: none;
          padding: 12px 18px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
        }
        .sptrd-paper-jtg {
          width: 210mm;
          min-height: 297mm;
          background: white;
          padding: 18mm;
          font-family: "Times New Roman", serif;
          font-size: 12px;
          color: #000;
        }
        .header-jtg {
          display: flex;
          align-items: flex-start;
        }
        .logo-jtg {
          width: 70px;
          margin-right: 15px;
        }
        .header-center {
          flex: 1;
          text-align: center;
        }
        .header-center h2 {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
        }
        .header-center h3 {
          margin: 3px 0;
          font-size: 15px;
        }
        .header-line {
          border-bottom: 4px solid #000;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .title-jtg {
          text-align: center;
          font-size: 15px;
          font-weight: bold;
          margin-bottom: 25px;
        }
        .tujuan-box {
          width: 250px;
          margin-left: auto;
          text-align: left;
          margin-bottom: 20px;
        }
        .tujuan-box p {
          margin: 2px 0;
        }
        .intro-text {
          margin-bottom: 12px;
        }
        .section-jtg {
          margin-bottom: 15px;
        }
        .section-title-jtg {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .table-jtg {
          width: 100%;
          border-collapse: collapse;
        }
        .table-jtg td {
          padding: 2px 0;
          vertical-align: top;
        }
        .table-jtg td:first-child {
          width: 220px;
        }
        .table-jtg td:nth-child(2) {
          width: 20px;
        }
        .lampiran-jtg p {
          margin: 3px 0;
        }
        .pernyataan-jtg {
          text-align: justify;
          margin-top: 15px;
          line-height: 1.5;
        }
        .signature-jtg {
          display: flex;
          justify-content: space-between;
          margin-top: 40px;
        }
        .signature-right {
          text-align: left;
          width: 250px;
        }
        .ttd-space-jtg {
          height: 50px;
        }
        .footer-note {
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
          align-items: end;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          #sptrd-document,
          #sptrd-document * {
            visibility: visible;
          }
          #sptrd-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            box-shadow: none;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}