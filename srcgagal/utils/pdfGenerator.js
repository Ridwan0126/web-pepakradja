// Utility function untuk generate PDF dengan format yang konsisten
export const generateOfficialReceiptPDF = (receipt) => {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const receiptDate = new Date(receipt.paymentDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  // Menggunakan logo resmi Jawa Tengah
  const logoUrl = `${window.location.origin}/images/logo-jateng-official.png`

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Bukti Pembayaran Retribusi ${receipt.receiptNumber}</title>
        <style>
            @page {
                size: A4;
                margin: 25mm 20mm 20mm 20mm;
            }
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .no-print { display: none !important; }
            }
            body {
                font-family: 'Times New Roman', serif;
                line-height: 1.4;
                color: #000;
                margin: 0;
                padding: 0;
                font-size: 12pt;
            }
            
            /* Official Letterhead */
            .letterhead {
                text-align: center;
                margin-bottom: 20px;
                border-bottom: 3px solid #000;
                padding-bottom: 15px;
            }
            .letterhead-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                margin-bottom: 10px;
            }
            .logo {
                width: 80px;
                height: 80px;
                flex-shrink: 0;
            }
            .logo img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            .letterhead-text {
                text-align: center;
            }
            .letterhead h1 {
                font-size: 16pt;
                font-weight: bold;
                margin: 0 0 5px 0;
                letter-spacing: 1px;
            }
            .letterhead h2 {
                font-size: 14pt;
                font-weight: bold;
                margin: 0 0 10px 0;
                letter-spacing: 0.5px;
            }
            .letterhead p {
                font-size: 10pt;
                margin: 2px 0;
                line-height: 1.2;
            }
            
            /* Letter Details */
            .letter-details {
                margin: 25px 0;
                display: flex;
                justify-content: space-between;
            }
            .letter-left {
                width: 45%;
            }
            .letter-right {
                width: 45%;
                text-align: right;
            }
            .detail-row {
                margin: 5px 0;
                display: flex;
            }
            .detail-label {
                width: 80px;
                font-weight: normal;
            }
            .detail-colon {
                width: 20px;
                text-align: center;
            }
            .detail-value {
                flex: 1;
            }
            
            /* Document Title */
            .document-title {
                text-align: center;
                margin: 30px 0;
                font-size: 14pt;
                font-weight: bold;
                text-decoration: underline;
            }
            
            /* Content */
            .content {
                text-align: justify;
                line-height: 1.6;
                margin: 25px 0;
            }
            .content p {
                margin: 15px 0;
                text-indent: 30px;
            }
            
            /* Payment Table */
            .payment-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                font-size: 11pt;
            }
            .payment-table th,
            .payment-table td {
                border: 1px solid #000;
                padding: 8px;
                text-align: left;
            }
            .payment-table th {
                background-color: #f0f0f0;
                font-weight: bold;
                text-align: center;
            }
            .payment-table .amount {
                text-align: right;
            }
            .payment-table .total-row {
                font-weight: bold;
                background-color: #f8f8f8;
            }
            
            /* Signatures */
            .signatures {
                margin-top: 50px;
                display: flex;
                justify-content: space-between;
            }
            .signature-box {
                width: 200px;
                text-align: center;
            }
            .signature-box p {
                margin: 5px 0;
                font-size: 11pt;
            }
            .signature-line {
                border-bottom: 1px solid #000;
                margin: 60px 0 10px 0;
            }
            .signature-name {
                font-weight: bold;
                text-decoration: underline;
            }
            .signature-nip {
                font-size: 10pt;
            }
            
            /* Footer */
            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 9pt;
                color: #666;
                border-top: 1px solid #ccc;
                padding-top: 15px;
            }

            /* Print Controls */
            .print-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                z-index: 1000;
            }
            .print-controls button {
                margin: 0 5px;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
            }
            .print-btn {
                background: #007bff;
                color: white;
            }
            .close-btn {
                background: #6c757d;
                color: white;
            }
        </style>
    </head>
    <body>
        <!-- Print Controls -->
        <div class="print-controls no-print">
            <button class="print-btn" onclick="window.print()">🖨️ Print</button>
            <button class="close-btn" onclick="window.close()">✖️ Tutup</button>
        </div>

        <!-- Official Letterhead -->
        <div class="letterhead">
            <div class="letterhead-content">
                <div class="logo">
                    <img src="${logoUrl}" alt="Logo Jawa Tengah" crossorigin="anonymous" />
                </div>
                <div class="letterhead-text">
                    <h1>PEMERINTAH PROVINSI JAWA TENGAH</h1>
                    <h2>SEKRETARIAT DAERAH</h2>
                    <p>Jalan Pahlawan No. 9 Semarang Kode Pos 50243 Telepon 024-8311173 (20 saluran)</p>
                    <p>Faksimile 024-8311266 Laman http://jatengprov.go.id</p>
                    <p>Surat Elektronik setda@jatengprov.go.id</p>
                </div>
            </div>
        </div>

        <!-- Letter Details -->
        <div class="letter-details">
            <div class="letter-left">
                <div class="detail-row">
                    <span class="detail-label">Nomor</span>
                    <span class="detail-colon">:</span>
                    <span class="detail-value">${receipt.receiptNumber}/SETDA/2024</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Sifat</span>
                    <span class="detail-colon">:</span>
                    <span class="detail-value">Resmi</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Lampiran</span>
                    <span class="detail-colon">:</span>
                    <span class="detail-value">-</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Hal</span>
                    <span class="detail-colon">:</span>
                    <span class="detail-value">Bukti Pembayaran Retribusi Daerah</span>
                </div>
            </div>
            <div class="letter-right">
                <p>Semarang, ${currentDate}</p>
                <br>
                <p>Kepada</p>
                <p>Yth. ${receipt.payerName}</p>
                <p>di -</p>
                <p style="margin-left: 20px;"><strong>TEMPAT</strong></p>
            </div>
        </div>

        <!-- Document Title -->
        <div class="document-title">
            BUKTI PEMBAYARAN RETRIBUSI DAER
        </div>

        <!-- Content -->
        <div class="content">
            <p>Dengan ini kami sampaikan bahwa telah diterima pembayaran retribusi daerah dari Saudara dengan rincian sebagai berikut:</p>
            
            <table class="payment-table">
                <thead>
                    <tr>
                        <th style="width: 5%;">No.</th>
                        <th style="width: 45%;">Uraian</th>
                        <th style="width: 25%;">Keterangan</th>
                        <th style="width: 25%;">Jumlah (Rp)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="text-align: center;">1.</td>
                        <td>Nama Pembayar</td>
                        <td>${receipt.payerName}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">2.</td>
                        <td>Obyek Retribusi</td>
                        <td>${receipt.objectName}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">3.</td>
                        <td>Jenis Obyek</td>
                        <td>${receipt.type}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">4.</td>
                        <td>Tanggal Pembayaran</td>
                        <td>${receiptDate}</td>
                        <td>-</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">5.</td>
                        <td>Jumlah Retribusi</td>
                        <td>${receipt.description}</td>
                        <td class="amount">${receipt.amount.toLocaleString("id-ID")}</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">6.</td>
                        <td>Biaya Administrasi</td>
                        <td>Biaya admin sistem</td>
                        <td class="amount">${receipt.adminFee.toLocaleString("id-ID")}</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3" style="text-align: center;"><strong>JUMLAH TOTAL</strong></td>
                        <td class="amount"><strong>${(receipt.amount + receipt.adminFee).toLocaleString("id-ID")}</strong></td>
                    </tr>
                </tbody>
            </table>

            <p>Pembayaran dilakukan melalui ${receipt.paymentMethod} ${receipt.bankName} dengan nomor ${receipt.accountNumber} dan telah dinyatakan <strong>${receipt.status.toUpperCase()}</strong>.</p>
            
            <p>Demikian bukti pembayaran ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
        </div>

        <!-- Signatures -->
        <div class="signatures">
            <div class="signature-box">
                <p>Mengetahui,</p>
                <p><strong>Kepala Bidang Retribusi Daerah</strong></p>
                <div class="signature-line"></div>
                <p class="signature-name">Drs. Ahmad Wijaya, M.Si</p>
                <p class="signature-nip">NIP. 196505121990031002</p>
            </div>
            <div class="signature-box">
                <p>Semarang, ${currentDate}</p>
                <p><strong>Petugas Verifikasi</strong></p>
                <div class="signature-line"></div>
                <p class="signature-name">Sri Wahyuni, S.E</p>
                <p class="signature-nip">NIP. 197803152005012001</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Dokumen ini dicetak secara otomatis oleh Sistem Penak Busiti</p>
            <p>Untuk verifikasi keaslian dokumen, silakan kunjungi: www.penakbusiti.go.id/verify dengan kode: ${receipt.receiptNumber}</p>
            <p>© ${new Date().getFullYear()} Pemerintah Provinsi Jawa Tengah. Semua hak dilindungi undang-undang.</p>
        </div>
    </body>
    </html>
  `

  // Buka tab baru untuk print (bukan jendela baru)
  const printWindow = window.open("", "_blank")

  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Focus ke tab print
    printWindow.focus()

    // Auto print setelah konten dimuat
    printWindow.onload = () => {
      setTimeout(() => {
        // Bisa langsung print atau biarkan user memilih
        // printWindow.print()
      }, 500)
    }
  } else {
    alert("Pop-up diblokir! Silakan izinkan pop-up untuk website ini.")
  }
}
