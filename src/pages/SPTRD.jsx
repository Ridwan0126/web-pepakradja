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
  Share2,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SPTRD() {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // SEARCH STATES
  const searchRef = useRef(null);
  const [keyword, setKeyword] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [obyekList, setObyekList] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // DETAIL & PREVIEW STATES (Menyamakan ProductDetail.jsx)
  const [selectedObyek, setSelectedObyek] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

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
    if (item?.foto_2) photos.push(item.foto_2);
    if (item?.foto_3) photos.push(item.foto_3);
    if (item?.foto_4) photos.push(item.foto_4);
    return photos.filter(Boolean).map((p) =>
      p.startsWith("http")
        ? p
        : `https://rpp.bapenda.jatengprov.go.id/penatausahaan/storage/${p}`
    );
  };

  const handlePreviewSPTRD = (targetObyek) => {
    if (!targetObyek) return;

    if (targetObyek?.is_laku) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Obyek retribusi ini sudah disewa/digunakan.",
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (!wr?.nama) {
      Swal.fire({
        icon: "warning",
        title: "Belum Login",
        text: "Silakan login terlebih dahulu untuk membuat SPTRD.",
        confirmButtonText: "Login",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    setFormData({
      nomor: `SPTRD-${Date.now()}`,
      tanggal: formatDate(new Date()),
      nama: wr?.nama || "-",
      alamat: wr?.alamat || "-",
      nik: wr?.nik_npwp || "-",
      npwrd: wr?.npwrd || "-",
      telepon: wr?.telepon || "-",
      email: wr?.email || "-",
      jenis: targetObyek?.golongan?.golongan || "Jasa",
      rincian: targetObyek?.obyek_retribusi || "Sewa",
      pelayanan:
        targetObyek?.jenis?.jenis_retribusi ||
        targetObyek?.tariftbl?.penerimaan ||
        "-",
      obyek: targetObyek?.obyek_retribusi || "-",
      lokasi: targetObyek?.alamat || "-",
      keterangan: targetObyek?.keterangan || "-",
      opd: targetObyek?.opd?.nama || "-",
      uppd: targetObyek?.uppd?.nama || "-",
      tarif: targetObyek?.tariftbl?.tarif || 0,
      satuan: targetObyek?.tariftbl?.satuan?.satuan || "-",
      kota: targetObyek?.kota?.kab_kota || "JAWA TENGAH",
      qr: JSON.stringify({
        wr: wr?.npwrd,
        obyek: targetObyek?.id,
      }),
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
            Cari dan pilih objek retribusi di bawah ini untuk melihat detail lengkap
            dan membuat SPTRD secara instan.
          </p>
        </div>

        {/* SEARCH BAR SECTION */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 relative">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
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
        </div>

        {/* SECTION HASIL PENCARIAN BERBENTUK CARD DI BAWAH (BUKAN DROPDOWN) */}
        {searchOpen && keyword.trim() && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-slate-900">
                Hasil Pencarian Objek Retribusi
              </h2>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {obyekList.length} Data Ditemukan
              </span>
            </div>

            {loadingSearch ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 shadow-md">
                Sedang mencari data objek retribusi...
              </div>
            ) : obyekList.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-slate-500 shadow-md">
                Tidak ada objek retribusi yang cocok dengan kata kunci "{keyword}".
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {obyekList.map((item, index) => {
                  const photos = getAllPhotos(item);
                  const mainPhoto = photos[0] || "/images/logopepakraja.png";
                  return (
                    <motion.div
                      key={`${item.id}-${index}`}
                      whileHover={{ y: -4 }}
                      onClick={() => {
                        setSelectedObyek(item);
                        setActiveImage(0);
                        setShowDetailModal(true);
                      }}
                      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-48 bg-slate-100 overflow-hidden">
                        <img
                          src={mainPhoto}
                          alt={item.obyek_retribusi}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 flex gap-2">
                          
                          {item.is_laku ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                              Tersewa
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              Tersedia
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                            {item?.opd?.nama || "-"}
                          </p>
                          <h3 className="font-bold text-slate-900 text-base line-clamp-2 mb-2">
                            {item.obyek_retribusi}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{item.alamat || "-"}</span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-gray-400 block">Tarif</span>
                            <span className="text-sm font-bold text-green-600">
                              Rp {rupiah(item?.tariftbl?.tarif)} / {item?.tariftbl?.satuan?.satuan || "Unit"}
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <ArrowRight size={16} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  disabled={isFetchingMore}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md"
                >
                  {isFetchingMore ? "Memuat..." : "Tampilkan Lebih Banyak"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* DETAIL MODAL (INFORMASI LENGKAP SAMA SEPERTI PRODUCT DETAIL) */}
        {showDetailModal && selectedObyek && (() => {
          const images = getAllPhotos(selectedObyek);
          const finalImages = images.length > 0 ? images : ["/images/logopepakraja.png"];
          
          let lat = null;
          let lng = null;
          if (typeof selectedObyek?.lat_long === "string" && selectedObyek.lat_long.includes(",")) {
            const split = selectedObyek.lat_long.split(",").map((v) => v.trim());
            lat = parseFloat(split[0]);
            lng = parseFloat(split[1]);
          }

          return (
            <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-20 bg-white border-b px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-slate-900">Detail Lengkap Obyek Retribusi</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* SLIDER GAMBAR */}
                  <div className="relative w-full h-[320px] md:h-[400px] rounded-2xl overflow-hidden bg-slate-900 group">
                    {finalImages.length > 1 && (
                      <>
                        {activeImage > 0 && (
                          <button
                            onClick={() => setActiveImage((prev) => prev - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/50 text-white rounded-full hover:bg-black/75 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        )}
                        {activeImage < finalImages.length - 1 && (
                          <button
                            onClick={() => setActiveImage((prev) => prev + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-black/50 text-white rounded-full hover:bg-black/75 transition-all"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    )}
                    <img
                      src={finalImages[activeImage]}
                      alt="Detail Obyek"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                      <h1 className="text-xl md:text-2xl font-bold text-white">
                        {selectedObyek.obyek_retribusi}
                      </h1>
                    </div>
                  </div>

                  {/* THUMBNAILS */}
                  {finalImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {finalImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImage(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                            activeImage === idx ? "border-blue-600 scale-105" : "border-transparent opacity-60"
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* INFO GRID */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                      <h3 className="font-bold text-slate-800 text-base border-b pb-2">Informasi Umum</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">ID Barang / Jasa</p>
                          <p className="font-semibold text-slate-800">{selectedObyek.id_gen_obyek}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Jenis Retribusi</p>
                          <p className="font-semibold text-slate-800">{selectedObyek?.jenis?.jenis_retribusi || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Keterangan / Judul Penawaran</p>
                          <p className="font-semibold text-slate-800">{selectedObyek.keterangan || selectedObyek.judul_penawaran || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status Ketersediaan</p>
                          <div className="flex gap-2 mt-1">
                            {selectedObyek.is_laku ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Tersewa</span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Tersedia</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                      <h3 className="font-bold text-slate-800 text-base border-b pb-2">Tarif & Lokasi</h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Tarif Retribusi</p>
                          <p className="font-bold text-green-600 text-lg">
                            Rp {rupiah(selectedObyek?.tariftbl?.tarif)} <span className="text-xs font-normal text-slate-600">/ {selectedObyek?.tariftbl?.satuan?.satuan || "-"}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Alamat Lokasi</p>
                          <p className="font-semibold text-slate-800">{selectedObyek.alamat || "-"}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Wilayah</p>
                          <p className="font-semibold text-slate-800">
                            Kec. {selectedObyek?.kecamatan?.kecamatan || "-"}, Kab/Kota {selectedObyek?.kota?.kab_kota || "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* INSTANSI PENGELOLA */}
                  <div className="bg-blue-50/60 rounded-2xl p-5 border border-blue-100">
                    <h3 className="font-bold text-slate-800 text-base mb-3">Instansi Pengelola</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">OPD</p>
                        <p className="font-semibold text-slate-800">{selectedObyek?.opd?.nama || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">UPPD / Balai</p>
                        <p className="font-semibold text-slate-800">{selectedObyek?.uppd?.nama || "-"}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Kontak Pengelola</p>
                        <p className="font-semibold text-green-600">{selectedObyek?.no_wa_pengelola || selectedObyek?.no_telp_pengelola || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {/* GOOGLE MAPS */}
                  {lat && lng && (
                    <div className="bg-gray-50 rounded-2xl p-5">
                      <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" /> Lokasi Peta
                      </h3>
                      <iframe
                        src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
                        className="w-full h-56 rounded-xl border"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 z-20 border-t p-5 bg-white flex justify-end gap-3 shadow-lg">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-slate-700 rounded-xl text-sm font-semibold transition-all"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      handlePreviewSPTRD(selectedObyek);
                    }}
                    disabled={selectedObyek?.is_laku}
                    className={`px-8 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center gap-2 ${
                      selectedObyek?.is_laku
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-green-600 to-teal-500 hover:scale-105"
                    }`}
                  >
                    {selectedObyek?.is_laku ? "Obyek Tersewa" : "Buat SPTRD Sekarang"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

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