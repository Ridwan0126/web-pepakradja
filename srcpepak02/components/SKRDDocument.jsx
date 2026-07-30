import { Download, Printer } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function SKRDDocument({ skrdData }) {
  const handlePrintSKRD = () => {
    const printWindow = window.open("", "", "height=800,width=900");
    const content = document.getElementById("skrd-document");
    printWindow.document.write(content.innerHTML);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 250);
  };

  const handleDownloadSKRD = async () => {
    const element = document.getElementById("skrd-document");

    try {
      // Dynamic import html2pdf
      const html2pdf = (await import("html2pdf.js")).default;

      if (!html2pdf) {
        console.error("html2pdf library not found");
        return;
      }

      const opt = {
        margin: 10,
        filename: `SKRD-${skrdData.skrdNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait", unit: "mm", format: "a4" },
      };

      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to print dialog
      window.print();
    }
  };

  return (
    <div className="space-y-6">
      {/* SKRD Document */}
      <div
        id="skrd-document"
        className="bg-white border-4 border-blue-600 rounded-lg p-8 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center border-b-4 border-blue-600 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">
            SURAT KETETAPAN RETRIBUSI DAERAH
          </h1>
          <p className="text-gray-600 mt-2">Provinsi Jawa Tengah</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Nomor SKRD */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600 font-semibold">Nomor SKRD</p>
              <p className="text-lg font-bold text-blue-700">
                {skrdData.skrdNumber}
              </p>
            </div>
            <div>
              <p className="text-gray-600 font-semibold">Tanggal Terbit</p>
              <p className="text-lg font-bold">{skrdData.issueDate}</p>
            </div>
          </div>

          {/* Wajib Retribusi */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-600 mb-3">Wajib Retribusi</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Nama:</span>{" "}
                {skrdData.taxpayerName}
              </p>
              <p>
                <span className="font-semibold">NPWP/NIK:</span>{" "}
                {skrdData.taxpayerTIN}
              </p>
              <p>
                <span className="font-semibold">Alamat:</span>{" "}
                {skrdData.address}
              </p>
            </div>
          </div>

          {/* Rincian Retribusi */}
          <div>
            <h3 className="font-bold text-blue-600 mb-3">Rincian Retribusi</h3>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b bg-blue-50">
                    <td className="p-3 font-semibold">Objek Retribusi</td>
                    <td className="p-3 text-right">{skrdData.objectName}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">Masa Retribusi</td>
                    <td className="p-3 text-right">{skrdData.period}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">Dasar Pengenaan</td>
                    <td className="p-3 text-right">{skrdData.area || "-"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-semibold">Tarif</td>
                    <td className="p-3 text-right">
                      Rp {skrdData.rate?.toLocaleString("id-ID")}
                    </td>
                  </tr>
                  <tr className="bg-blue-100">
                    <td className="p-3 font-bold">Jumlah Ketetapan</td>
                    <td className="p-3 text-right font-bold text-blue-600">
                      Rp {skrdData.totalAmount?.toLocaleString("id-ID")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Jatuh Tempo */}
          <div className="bg-red-50 border-l-4 border-red-600 p-4">
            <p className="text-sm text-gray-600 mb-1">Batas Waktu Pembayaran</p>
            <p className="text-xl font-bold text-red-600">{skrdData.dueDate}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-6 border-t-2 border-blue-600">
            <div className="bg-white p-4 border-4 border-blue-600 rounded-lg">
              <QRCodeCanvas
                value={skrdData.qrCode}
                size={150}
                level="H"
                includeMargin={true}
                fgColor="#1e40af"
              />
              <p className="text-center text-xs font-bold mt-2">
                Kode Pembayaran Non Tunai
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-blue-600 pt-6 text-xs text-gray-600 space-y-2">
            <p>
              <strong>Catatan:</strong> Pembayaran dapat dilakukan melalui:
            </p>
            <ul className="ml-4 space-y-1 list-disc">
              <li>Transfer Bank ke rekening retribusi daerah</li>
              <li>Scan QRIS menggunakan aplikasi e-wallet</li>
              <li>Datang langsung ke kantor retribusi</li>
            </ul>
            <p className="mt-4">
              <strong>Disposisi:</strong> Dokumen ini adalah ketetapan resmi
              yang mengikat secara hukum.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          onClick={handleDownloadSKRD}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-bold hover:shadow-lg transition-smooth active:scale-95"
        >
          <Download className="w-5 h-5" />
          Unduh SKRD (PDF)
        </button>
        <button
          onClick={handlePrintSKRD}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-lg font-bold hover:bg-blue-50 transition-smooth active:scale-95"
        >
          <Printer className="w-5 h-5" />
          Cetak SKRD
        </button>
      </div>
    </div>
  );
}
