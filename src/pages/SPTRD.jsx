import { useState, useMemo } from "react";
import {
  FileText,
  Search,
  Download,
  Printer,
  X,
  Building2,
  MapPin,
  Landmark,
  Phone,
  Mail,
  User,
  ArrowRight,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Swal from "sweetalert2";

import Header from "../components/Header";
import Footer from "../components/Footer";

export default function SPTRD() {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [obyekList, setObyekList] = useState([]);

  const [selectedObyek, setSelectedObyek] = useState(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [formData, setFormData] = useState({});

  const session =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wr_session")) || {}
      : {};

  const wr = session?.user || {};

  const loginUser = wr?.nama || "USER";

  const printDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());

  const rupiah = (val) => Number(val || 0).toLocaleString("id-ID");

  const formatDate = (date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));

  const today = formatDate(new Date());

  const filteredData = useMemo(() => {
    if (!keyword) return obyekList;

    return obyekList.filter(
      (item) =>
        item.obyek_retribusi?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.alamat?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.opd?.nama?.toLowerCase().includes(keyword.toLowerCase()),
    );
  }, [keyword, obyekList]);

  const handleSearch = async () => {
    setLoadingSearch(true);

    try {
      const res = await fetch("/bapenda/pepakraja/obyek?limit=50&page=1", {
        headers: {
          token: "xV3nKd8QpL5rTyHuWc2MfZaJbE7sRt1",
          Accept: "application/json",
        },
      });

      const result = await res.json();

      if (!result.success) {
        Swal.fire("Gagal", "Data obyek tidak ditemukan", "error");
        return;
      }

      const keywordLower = keyword.toLowerCase();

      const filtered = (result.data || []).filter((item) =>
        item.obyek_retribusi?.toLowerCase().includes(keywordLower),
      );

      setObyekList(filtered);
    } catch (err) {
      console.error(err);

      Swal.fire("Error", "Gagal mengambil data obyek", "error");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleChooseObyek = (obyek) => {
    setSelectedObyek(obyek);

    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleCreateSPTRD = async () => {
    if (!selectedObyek) {
      Swal.fire(
        "Pilih Obyek",
        "Silakan pilih obyek retribusi terlebih dahulu",
        "warning",
      );
      return;
    }

    setLoadingCreate(true);

    try {
      setFormData({
        nomor: `SPTRD-${Date.now()}`,

        tanggal: today,

        nama: wr?.nama || "-",

        alamat: wr?.alamat || "-",

        nik: wr?.nik_npwp || "-",

        npwrd: wr?.npwrd || "-",

        telepon: wr?.telepon || "-",

        email: wr?.email || "-",

        pelayanan:
          selectedObyek?.jenis?.jenis_retribusi ||
          selectedObyek?.tariftbl?.penerimaan ||
          "-",

        namaPelayanan: selectedObyek?.obyek_retribusi || "-",

        alamatPelayanan: selectedObyek?.alamat || "-",

        opd: selectedObyek?.opd?.nama,

        uppd: selectedObyek?.uppd?.nama,

        keterangan: selectedObyek?.keterangan || "-",

        dasarPengenaan: selectedObyek?.dasar_pengenaan || "-",

        dasarPenetapan: selectedObyek?.dasar_penetapan || "-",

        tarif: selectedObyek?.tariftbl?.tarif || 0,

        satuan: selectedObyek?.tariftbl?.satuan?.satuan || "-",

        jenisRetribusi: selectedObyek?.jenis?.jenis_retribusi || "-",

        qr: JSON.stringify({
          wr: wr?.npwrd,
          obyek: selectedObyek?.id,
        }),
      });

      setShowPreviewModal(true);
    } catch (err) {
      console.error(err);

      Swal.fire("Error", "Gagal membuat SPTRD", "error");
    } finally {
      setLoadingCreate(false);
    }
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

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
        },

        jsPDF: {
          unit: "mm",
          format: [330, 210],
          orientation: "portrait",
        },
      })
      .from(element)
      .save();
  };
  const handlePreviewSPTRD = () => {
    if (!selectedObyek) {
      Swal.fire(
        "Pilih Obyek",
        "Silakan pilih obyek retribusi terlebih dahulu",
        "warning",
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
        selectedObyek?.jenis?.jenis_retribusi ||
        selectedObyek?.tariftbl?.penerimaan ||
        "-",

      obyek: selectedObyek?.obyek_retribusi || "-",

      lokasi: selectedObyek?.alamat || "-",

      keterangan:
        selectedObyek?.keterangan || selectedObyek?.judul_penawaran || "-",

      opd: selectedObyek?.opd?.nama || "-",

      uppd: selectedObyek?.uppd?.nama || "-",

      tarif: selectedObyek?.tariftbl?.tarif || 0,

      satuan: selectedObyek?.tariftbl?.satuan?.satuan || "-",

      kota: selectedObyek?.kota?.kab_kota || "JAWA TENGAH",

      qr: `SPTRD-${selectedObyek.id}`,
    });

    setShowPreviewModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4">
        {/* INFO */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Surat Pemberitahuan Retribusi Daerah (SPTRD)
          </h1>

          <p className="opacity-90">
            Jika belum memiliki SKRD, silakan membuat SPTRD terlebih dahulu
            untuk diajukan ke OPD terkait.
          </p>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Cari nama obyek retribusi..."
              className="flex-1 border rounded-xl px-4 py-3"
            />

            <button
              onClick={handleSearch}
              disabled={loadingSearch}
              className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Search size={18} />
              {loadingSearch ? "Loading..." : "Cari"}
            </button>
          </div>
        </div>

        {/* RESULT */}
        {obyekList.length > 0 && (
          <>
            <h2 className="font-bold text-xl mb-5">Hasil Pencarian</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {obyekList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedObyek(item);
                    setShowDetailModal(true);
                  }}
                  className={`cursor-pointer rounded-3xl bg-white shadow-lg p-5 transition hover:-translate-y-1 hover:shadow-2xl border-2 ${
                    selectedObyek?.id === item.id
                      ? "border-blue-600"
                      : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between mb-3">
                    <Building2 size={34} className="text-blue-600" />

                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {item.id}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg mb-2">
                    {item.obyek_retribusi}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">{item.alamat}</p>

                  <div className="text-sm">
                    <div>
                      OPD :
                      <span className="font-semibold ml-1">
                        {item.opd?.nama}
                      </span>
                    </div>

                    <div>
                      Tarif :
                      <span className="font-semibold ml-1 text-green-600">
                        Rp {rupiah(item.tariftbl?.tarif)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* DETAIL */}
        {showDetailModal && selectedObyek && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden">
              {/* HEADER */}
              <div className="bg-blue-700 text-white p-5 flex justify-between items-center">
                <h2 className="text-xl font-bold">Detail Obyek Retribusi</h2>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="hover:bg-white/20 p-2 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              {/* BODY */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="font-semibold text-gray-500">
                      ID Obyek
                    </label>

                    <p>{selectedObyek.id}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-500">
                      Jenis Retribusi
                    </label>

                    <p>{selectedObyek?.jenis?.jenis_retribusi}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-500">
                      Obyek Retribusi
                    </label>

                    <p>{selectedObyek.obyek_retribusi}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-500">Tarif</label>

                    <p className="text-green-600 font-bold">
                      Rp {rupiah(selectedObyek?.tariftbl?.tarif)}
                    </p>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-500">
                      Lokasi
                    </label>

                    <p>{selectedObyek.alamat}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-500">
                      Satuan
                    </label>

                    <p>{selectedObyek?.tariftbl?.satuan?.satuan || "-"}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-500">OPD</label>

                    <p>{selectedObyek?.opd?.nama}</p>
                  </div>

                  <div>
                    <label className="font-semibold text-gray-500">UPPD</label>

                    <p>{selectedObyek?.uppd?.nama}</p>
                  </div>
                </div>

                {selectedObyek.keterangan && (
                  <div className="mt-6">
                    <label className="font-semibold text-gray-500">
                      Keterangan
                    </label>

                    <div className="bg-gray-50 p-4 rounded-xl mt-2">
                      {selectedObyek.keterangan}
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}
              <div className="border-t p-5 flex justify-end gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-5 py-2 bg-gray-200 rounded-xl"
                >
                  Tutup
                </button>

                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handlePreviewSPTRD();
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
                >
                  Buat SPTRD
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* MODAL PREVIEW SPTRD */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto">
          <div className="sticky top-0 z-50 bg-black/70 backdrop-blur-lg p-4 flex justify-center gap-3 print:hidden">
            <button
              onClick={handleDownloadPDF}
              className="btn-action bg-blue-700"
            >
              <Download size={18} />
              Download PDF
            </button>

            <button onClick={handlePrint} className="btn-action bg-gray-700">
              <Printer size={18} />
              Print
            </button>

            <button
              onClick={() => setShowPreviewModal(false)}
              className="btn-action bg-red-600"
            >
              <X size={18} />
              Tutup
            </button>
          </div>

          <div className="flex justify-center py-10 print:p-0">
            <div id="sptrd-document" className="sptrd-paper-jtg">
              {/* HEADER */}

              <div className="header-jtg">
                <img
                  src="/images/logo-jateng-official.png"
                  alt="logo"
                  className="logo-jtg"
                />

                <div className="header-center">
                  <h2>PEMERINTAH PROVINSI JAWA TENGAH</h2>
                  <h3>{formData.opd}</h3>
                  <div className="">{formData.uppd}</div>
                </div>
              </div>

              <div className="header-line"></div>

              <h1 className="title-jtg">
                SURAT PEMBERITAHUAN RETRIBUSI DAERAH (SPTRD)
              </h1>

              {/* TUJUAN */}
              <div className="tujuan-box">
                <p>Kepada Yth:</p>
                <p>Kepala {formData.opd}</p>
                <p>Di</p>
                <p>TEMPAT</p>
              </div>

              <p className="intro-text">
                Yang bertanda tangan dibawah ini, kami:
              </p>

              {/* I IDENTITAS */}
              <div className="section-jtg">
                <div className="section-title-jtg">
                  I. Identitas Wajib Retribusi :
                </div>

                <table className="table-jtg">
                  <tbody>
                    <tr>
                      <td>Nama</td>
                      <td>:</td>
                      <td>{formData.nama}</td>
                    </tr>

                    <tr>
                      <td>Alamat</td>
                      <td>:</td>
                      <td>{formData.alamat}</td>
                    </tr>

                    <tr>
                      <td>Nomor Induk Kependudukan</td>
                      <td>:</td>
                      <td>{formData.nik}</td>
                    </tr>

                    <tr>
                      <td>Nomor Induk Berusaha</td>
                      <td>:</td>
                      <td>{formData.npwrd}</td>
                    </tr>

                    <tr>
                      <td>Nomor Telepon</td>
                      <td>:</td>
                      <td>{formData.telepon}</td>
                    </tr>

                    <tr>
                      <td>Alamat Surat Elektronik</td>
                      <td>:</td>
                      <td>{formData.email}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* II PELAYANAN */}
              <div className="section-jtg">
                <div className="section-title-jtg">
                  II. Pelayanan Retribusi yang dimohon:
                </div>

                <table className="table-jtg">
                  <tbody>
                    <tr>
                      <td>Jenis Retribusi</td>
                      <td>:</td>
                      <td>{formData.pelayanan}</td>
                    </tr>

                    <tr>
                      <td>Objek Retribusi</td>
                      <td>:</td>
                      <td>{formData.obyek}</td>
                    </tr>

                    <tr>
                      <td>Rincian Objek Retribusi</td>
                      <td>:</td>
                      <td>{formData.keterangan}</td>
                    </tr>

                    <tr>
                      <td>Detail Rincian Objek</td>
                      <td>:</td>
                      <td>{formData.opd}</td>
                    </tr>

                    <tr>
                      <td>Uraian Deskripsi / Volume</td>
                      <td>:</td>
                      <td>
                        Tarif Rp {rupiah(formData.tarif)} / {formData.satuan}
                      </td>
                    </tr>

                    <tr>
                      <td>Lokasi</td>
                      <td>:</td>
                      <td>{formData.lokasi}</td>
                    </tr>

                    <tr>
                      <td>Tarif</td>
                      <td>:</td>
                      <td>Rp {rupiah(formData.tarif)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* III JANGKA WAKTU */}
              <div className="section-jtg">
                <div className="section-title-jtg">
                  III. Jangka waktu Retribusi :
                </div>

                <div className="lampiran-jtg">
                  <p>Sebagai bahan pertimbangan, berikut kami lampirkan :</p>

                  <p>a. Fotokopi KTP;</p>
                  <p>b. Fotokopi NIB bagi Wajib Retribusi Badan Usaha;</p>
                  <p>
                    c. Surat Kuasa bagi Wajib Retribusi yang tidak
                    menandatangani SPTRD sendiri.
                  </p>
                </div>
              </div>

              {/* PERNYATAAN */}
              <div className="pernyataan-jtg">
                <p>
                  Apabila permohonan dikabulkan kami sanggup membayar Retribusi
                  serta menanggung sanksi administratif atas keterlambatan
                  pembayaran Retribusi sesuai ketentuan peraturan
                  perundang-undangan yang berlaku atas kuasa saya.
                </p>

                <p>
                  Saya menyatakan bahwa yang kami beritahukan tersebut beserta
                  lampirannya benar, lengkap dan jelas.
                </p>
              </div>

              {/* FOOTER */}
              <div className="signature-jtg">
                <div></div>

                <div className="signature-right">
                  <p>Tempat, {formData.tanggal}</p>

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

        .sptrd-paper {
          width: 210mm;
          min-height: 330mm;
          background: white;
          padding: 12mm;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);
          position: relative;
        }

        .header-wrap {
          display: flex;
          justify-content: space-between;
        }

        .logo-img {
          width: 70px;
        }

        .title-side {
          flex: 1;
          text-align: center;
        }

        .title-side h1,
        .title-side h2,
        .title-side h3 {
          margin: 0;
        }

        .doc-title {
          text-align: center;
          margin-top: 20px;
        }

        .line-top {
          margin-top: 10px;
        }

        .section {
          display: flex;
          margin-top: 18px;
        }

        .section-title {
          width: 30px;
          font-weight: bold;
        }

        .section-content {
          flex: 1;
        }

        .table-detail {
          width: 100%;
        }

        .table-detail td {
          padding: 4px 0;
          vertical-align: top;
        }

        .table-detail td:first-child {
          width: 220px;
        }

        .footer-area {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }

        .ttd-side {
          text-align: center;
          width: 40%;
        }

        .ttd-space {
          height: 90px;
        }

        .ttd-name {
          font-weight: bold;
          text-decoration: underline;
        }

        .bottom-print {
          position: absolute;
          bottom: 10mm;
          left: 12mm;
          font-size: 11px;
        }

        @page {
          size: 210mm 330mm;
          margin: 0;
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
            min-height: 330mm;
            box-shadow: none;
          }

          .print\\:hidden {
            display: none !important;
          }
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

        .top-format {
          font-weight: bold;
          margin-bottom: 10px;
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

        .dots-line {
          border-bottom: 1px dotted #000;
          margin-top: 8px;
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

        .qr-mini {
          text-align: right;
        }
      `}</style>
    </div>
  );
}
