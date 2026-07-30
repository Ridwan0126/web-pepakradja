import { apiEndpoints, handleApiError } from "./api"
import firebaseService from "./firebaseService.js" // Import Firebase service

class DataService {
  constructor() {
    this.lastSyncKey = "lastDataSync"
    this.objectsKey = "all_objects"
    this.contactsKey = "contact_info"
    this.paymentReceiptsKey = "payment_receipts"
    this.dataExpiryHours = 24 // Data expires after 24 hours (1 day)

    this.setupMidnightSync()
  }

  setupMidnightSync() {
    const now = new Date()
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0) // Next midnight

    const msUntilMidnight = midnight.getTime() - now.getTime()

    console.log(`[AUTO SYNC] Sistem sinkronisasi otomatis diaktifkan`)
    console.log(`[AUTO SYNC] Sinkronisasi pertama akan dilakukan pada: ${midnight.toLocaleString("id-ID")}`)
    console.log(`[AUTO SYNC] Waktu tunggu hingga midnight: ${Math.round(msUntilMidnight / 1000 / 60)} menit`)

    setTimeout(() => {
      console.log(`[AUTO SYNC] Memulai sinkronisasi otomatis pada ${new Date().toLocaleString("id-ID")}`)
      this.syncAllData(true, true) // Pass true for automatic sync

      // Set up daily interval after first midnight sync
      setInterval(
        () => {
          console.log(`[AUTO SYNC] Memulai sinkronisasi harian otomatis pada ${new Date().toLocaleString("id-ID")}`)
          this.syncAllData(true, true) // Pass true for automatic sync
        },
        24 * 60 * 60 * 1000,
      ) // Every 24 hours
    }, msUntilMidnight)
  }

  isDataExpired() {
    const lastSync = this.getLocalData(this.lastSyncKey)
    if (!lastSync) return true

    const now = new Date()
    const lastSyncDate = new Date(lastSync)
    const hoursDiff = (now - lastSyncDate) / (1000 * 60 * 60)

    return hoursDiff >= this.dataExpiryHours
  }

  needsSync() {
    return this.isDataExpired()
  }

  // Get data from localStorage
  getLocalData(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error getting local data:", error)
      return null
    }
  }

  // Save data to localStorage
  setLocalData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      return true
    } catch (error) {
      console.error("Error saving local data:", error)
      return false
    }
  }

  async syncAllData(forceSync = false, isAutomatic = false) {
    if (!forceSync && !this.needsSync()) {
      if (isAutomatic) {
        console.log(`[AUTO SYNC] Data masih up-to-date, sinkronisasi dibatalkan`)
      }
      return { success: true, message: "Data masih up-to-date" }
    }

    try {
      let allData = []
      const syncType = isAutomatic ? "[AUTO SYNC]" : "[MANUAL SYNC]"
      console.log(`${syncType} Mulai sinkronisasi data dari API...`)

      try {
        const response = await apiEndpoints.getAllObjectsNoPagination({ limit: 10000 })

        if (response.data.success && response.data.data) {
          const responseData = Array.isArray(response.data.data) ? response.data.data : [response.data.data]
          allData = responseData
          console.log(`${syncType} Berhasil mengambil ${allData.length} data dalam satu request`)
        }
      } catch (error) {
        console.log(`${syncType} Gagal mengambil semua data sekaligus, mencoba dengan pagination...`)

        // Fallback to pagination
        let page = 1
        let hasMoreData = true
        const maxPages = 50

        while (hasMoreData && page <= maxPages) {
          try {
            const response = await apiEndpoints.getAllObjects({ page, limit: 1000 })

            if (response.data.success && response.data.data) {
              const pageData = Array.isArray(response.data.data) ? response.data.data : [response.data.data]
              allData = [...allData, ...pageData]

              console.log(`${syncType} Halaman ${page}: ${pageData.length} data`)
              hasMoreData = pageData.length === 1000
              page++
            } else {
              hasMoreData = false
            }
          } catch (pageError) {
            console.error(`${syncType} Error pada halaman ${page}:`, pageError)
            hasMoreData = false
          }

          await new Promise((resolve) => setTimeout(resolve, 200))
        }
      }

      // Remove duplicates and filter active data
      const uniqueData = allData.filter(
        (item, index, self) => index === self.findIndex((t) => t.id_gen_obyek === item.id_gen_obyek),
      )
      const activeData = uniqueData.filter((item) => item.status === 1)

      console.log(`${syncType} Total data unik: ${uniqueData.length}, Data aktif: ${activeData.length}`)

      // Store in localStorage with timestamp
      this.setLocalData(this.objectsKey, activeData)
      this.setLocalData(this.lastSyncKey, new Date().toISOString())

      const successMessage = `Berhasil sinkronisasi ${activeData.length} data aktif dari ${uniqueData.length} total data`
      console.log(`${syncType} ${successMessage}`)

      if (isAutomatic) {
        console.log(`[AUTO SYNC] Sinkronisasi otomatis selesai pada ${new Date().toLocaleString("id-ID")}`)
        console.log(
          `[AUTO SYNC] Sinkronisasi berikutnya akan dilakukan pada ${new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString("id-ID")}`,
        )
      }

      return {
        success: true,
        message: successMessage,
        count: activeData.length,
        total: uniqueData.length,
        isAutomatic,
      }
    } catch (error) {
      const syncType = isAutomatic ? "[AUTO SYNC]" : "[MANUAL SYNC]"
      console.error(`${syncType} Sync error:`, error)

      if (isAutomatic) {
        console.error(
          `[AUTO SYNC] Sinkronisasi otomatis gagal pada ${new Date().toLocaleString("id-ID")}:`,
          error.message,
        )
      }

      return handleApiError(error)
    }
  }

  async getObjects(filters = {}) {
    try {
      // Check if data is expired and sync if needed
      if (this.isDataExpired()) {
        console.log("Data kadaluarsa, melakukan sinkronisasi...")
        await this.syncAllData(true)
      }

      const data = this.getLocalData(this.objectsKey) || []

      // If still no data after sync attempt, return empty
      if (data.length === 0) {
        return {
          success: true,
          data: [],
          total: 0,
          page: filters.page || 1,
          limit: filters.limit || 10,
          totalPages: 0,
        }
      }

      // Apply filters
      let filteredData = data

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredData = filteredData.filter(
          (item) =>
            item.obyek_retribusi?.toLowerCase().includes(searchTerm) ||
            item.alamat?.toLowerCase().includes(searchTerm) ||
            item.uppd?.nama?.toLowerCase().includes(searchTerm),
        )
      }

      // Location filter
      if (filters.location) {
        filteredData = filteredData.filter((item) =>
          item.kota?.kab_kota?.toLowerCase().includes(filters.location.toLowerCase()),
        )
      }

      // OPD filter
      if (filters.opd) {
        filteredData = filteredData.filter((item) => item.opd?.nama?.toLowerCase().includes(filters.opd.toLowerCase()))
      }

      // Service type filter
      if (filters.serviceType) {
        filteredData = filteredData.filter((item) =>
          item.jenis?.jenis_retribusi?.toLowerCase().includes(filters.serviceType.toLowerCase()),
        )
      }

      // Sort data alphabetically
      filteredData.sort((a, b) => (a.obyek_retribusi || "").localeCompare(b.obyek_retribusi || ""))

      // Pagination
      const page = filters.page || 1
      const limit = filters.limit || 10
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filteredData.slice(startIndex, endIndex)

      return {
        success: true,
        data: paginatedData,
        total: filteredData.length,
        page,
        limit,
        totalPages: Math.ceil(filteredData.length / limit),
      }
    } catch (error) {
      console.error("Get objects error:", error)
      return handleApiError(error)
    }
  }

  // Get object by ID
  async getObjectById(id) {
    try {
      // Try localStorage first
      const allData = this.getLocalData(this.objectsKey) || []
      const localObject = allData.find((item) => item.id_gen_obyek.toString() === id.toString())

      if (localObject) {
        return { success: true, data: localObject }
      }

      // If not found locally, try API
      const response = await apiEndpoints.getObjectById(id)
      if (response.data.success) {
        return { success: true, data: response.data.data }
      }

      return { success: false, message: "Data tidak ditemukan" }
    } catch (error) {
      console.error("Get object by ID error:", error)
      return handleApiError(error)
    }
  }

  async getContactInfo(objectId) {
    try {
      // First get the object to extract OPD/UPPD IDs
      const objectResult = await this.getObjectById(objectId)

      if (!objectResult.success || !objectResult.data) {
        return {
          success: false,
          data: {
            telepon: "Data tidak tersedia",
            email: "Data tidak tersedia",
            website: "Data tidak tersedia",
            whatsapp: "Data tidak tersedia",
          },
        }
      }

      const object = objectResult.data
      const idOpd = object.id_opd
      const idUppd = object.id_uppd

      // Priority: UPPD first, then OPD
      const contactResult = await firebaseService.getContactByOpdUppdId(idOpd, idUppd)

      if (contactResult.success && contactResult.data) {
        const contact = contactResult.data
        return {
          success: true,
          data: {
            telepon: contact.telepon || contact.phone || "Data tidak tersedia",
            email: contact.email || "Data tidak tersedia",
            website: contact.website || "Data tidak tersedia",
            whatsapp: contact.whatsapp || "Data tidak tersedia",
            opdUppdName: contact.opdUppdName || "Data tidak tersedia",
            type: contact.type || "Data tidak tersedia",
          },
        }
      }

      // Return default if no contact found
      return {
        success: true,
        data: {
          telepon: "Data tidak tersedia",
          email: "Data tidak tersedia",
          website: "Data tidak tersedia",
          whatsapp: "Data tidak tersedia",
        },
      }
    } catch (error) {
      console.error("Get contact info error:", error)
      return {
        success: false,
        data: {
          telepon: "Data tidak tersedia",
          email: "Data tidak tersedia",
          website: "Data tidak tersedia",
          whatsapp: "Data tidak tersedia",
        },
      }
    }
  }

  // Update contact info for an object in localStorage
  updateContactInfo(objectId, contactData) {
    try {
      const contactsData = this.getLocalData(this.contactsKey) || {}
      contactsData[objectId.toString()] = {
        ...contactData,
        updated_at: new Date().toISOString(),
      }

      this.setLocalData(this.contactsKey, contactsData)
      return { success: true, message: "Informasi kontak berhasil diperbarui" }
    } catch (error) {
      console.error("Update contact info error:", error)
      return { success: false, message: "Error updating contact info" }
    }
  }

  // Get unique filter options
  getFilterOptions() {
    const data = this.getLocalData(this.objectsKey) || []

    const locations = [...new Set(data.map((item) => item.kota?.kab_kota).filter(Boolean))]
    const opds = [...new Set(data.map((item) => item.opd?.nama).filter(Boolean))]
    const serviceTypes = [...new Set(data.map((item) => item.jenis?.jenis_retribusi).filter(Boolean))]

    return {
      locations: locations.sort(),
      opds: opds.sort(),
      serviceTypes: serviceTypes.sort(),
    }
  }

  // Clear all local data
  clearLocalData() {
    try {
      localStorage.removeItem(this.objectsKey)
      localStorage.removeItem(this.contactsKey)
      localStorage.removeItem(this.lastSyncKey)
      localStorage.removeItem(this.paymentReceiptsKey)
      return { success: true, message: "Data lokal berhasil dihapus" }
    } catch (error) {
      console.error("Clear local data error:", error)
      return { success: false, message: "Error clearing local data" }
    }
  }

  // Payment Receipt Methods
  getPaymentReceipts(filters = {}) {
    try {
      const paymentReceipts = [
        // RETRIBUSI Data
        {
          id: "BPR-2024-001",
          type: "RETRIBUSI",
          objectName: "Aula Museum Siang",
          payerName: "PT. Sinar Jaya",
          date: "2024-01-15",
          amount: 8000000,
          adminFee: 5000,
          totalAmount: 8005000,
          status: "Lunas",
          location: "KOTA SEMARANG",
          opd: "DINAS KESEHATAN",
          address: "Jl. Pahlawan No. 9 Semarang",
          paymentMethod: "Transfer Bank BCA",
          accountNumber: "1234567890",
          receiptNumber: "BPR-2024-001/SETDA/2024",
          verificationCode: "BPR-2024-001",
        },
        {
          id: "BPR-2024-002",
          type: "RETRIBUSI",
          objectName: "Kios Art Museum 1",
          payerName: "CV. Karya Mandiri",
          date: "2024-01-16",
          amount: 2000000,
          adminFee: 5000,
          totalAmount: 2005000,
          status: "Lunas",
          location: "KOTA SEMARANG",
          opd: "DINAS PARIWISATA",
          address: "Jl. Pemuda No. 15 Semarang",
          paymentMethod: "Transfer Bank BRI",
          accountNumber: "9876543210",
          receiptNumber: "BPR-2024-002/SETDA/2024",
          verificationCode: "BPR-2024-002",
        },
        {
          id: "BPR-2024-003",
          type: "RETRIBUSI",
          objectName: "Gedung Serbaguna Simpang Lima",
          payerName: "PT. Maju Sejahtera",
          date: "2024-01-17",
          amount: 5000000,
          adminFee: 5000,
          totalAmount: 5005000,
          status: "Lunas",
          location: "KOTA SEMARANG",
          opd: "DINAS KEBUDAYAAN",
          address: "Jl. Simpang Lima No. 1 Semarang",
          paymentMethod: "Transfer Bank Mandiri",
          accountNumber: "5555666677",
          receiptNumber: "BPR-2024-003/SETDA/2024",
          verificationCode: "BPR-2024-003",
        },
        // PAP Data - Complete details from provided document
        {
          id: "8026/TBP-PAP.06/12/2024",
          type: "PAP",
          objectName: "Pajak Air Permukaan PLTMH",
          payerName: "ACHMAD RUBIANTO SYAFEI",
          companyName: "PT. CAHAYA SEMESTA ENERGI",
          address: "JL. KEMANG SELATAN IV NO. 79/O-1",
          companyAddress: "DESA GETASBLAWONG DAN GONDOHARUM KEC. PAGERUYUNG KENDAL 51361",
          date: "2024-12-10",
          skpdNumber: "06.0151.1.001.00635.1.02.2024",
          skpdDate: "2024-02-15",
          taxPeriod: "Januari 2024",
          dueDate: "2024-03-15",
          lateDays: "0 tahun 8 bulan 26 hari",
          principalTax: 526000,
          penalty: 47350,
          totalBill: 573350,
          exemptionPrincipal: 131500,
          exemptionPenalty: 47350,
          totalExemption: 178850,
          finalAmount: 394500,
          amountInWords: "Tiga Ratus Sembilan Puluh Empat Ribu Lima Ratus Rupiah",
          status: "Lunas",
          location: "KABUPATEN KENDAL",
          opd: "BADAN PENGELOLA PENDAPATAN DAERAH",
          uppd: "UPPD Kabupaten Kendal",
          peruntukan: "PLTMH",
          bendahara: {
            nama: "ADE KHAIRANI",
            nip: "19851001 200312 2 002",
          },
          kepalaUppd: {
            nama: "RETNO PANTJA INDAH WIJANI, SH, MH.",
            nip: "19670627 199403 2 003",
          },
        },
        {
          id: "8027/TBP-PAP.07/12/2024",
          type: "PAP",
          objectName: "Pajak Air Permukaan Industri",
          payerName: "SITI NURHALIZA",
          companyName: "PT. INDAH KARYA MANDIRI",
          address: "JL. SUDIRMAN NO. 45 SEMARANG",
          companyAddress: "KAWASAN INDUSTRI KENDAL BLOK A-15 KENDAL 51361",
          date: "2024-12-11",
          skpdNumber: "06.0151.1.001.00636.1.02.2024",
          skpdDate: "2024-02-16",
          taxPeriod: "Februari 2024",
          dueDate: "2024-03-16",
          lateDays: "0 tahun 8 bulan 25 hari",
          principalTax: 750000,
          penalty: 67500,
          totalBill: 817500,
          exemptionPrincipal: 0,
          exemptionPenalty: 0,
          totalExemption: 0,
          finalAmount: 817500,
          amountInWords: "Delapan Ratus Tujuh Belas Ribu Lima Ratus Rupiah",
          status: "Lunas",
          location: "KABUPATEN KENDAL",
          opd: "BADAN PENGELOLA PENDAPATAN DAERAH",
          uppd: "UPPD Kabupaten Kendal",
          peruntukan: "Industri Tekstil",
          bendahara: {
            nama: "ADE KHAIRANI",
            nip: "19851001 200312 2 002",
          },
          kepalaUppd: {
            nama: "RETNO PANTJA INDAH WIJANI, SH, MH.",
            nip: "19670627 199403 2 003",
          },
        },
        {
          id: "8028/TBP-PAP.08/12/2024",
          type: "PAP",
          objectName: "Pajak Air Permukaan Hotel",
          payerName: "BAMBANG SUTRISNO",
          companyName: "PT. HOTEL MEWAH JAYA",
          address: "JL. PEMUDA NO. 88 SEMARANG",
          companyAddress: "JL. PANDANARAN NO. 100 SEMARANG 50134",
          date: "2024-12-12",
          skpdNumber: "06.0151.1.001.00637.1.02.2024",
          skpdDate: "2024-02-17",
          taxPeriod: "Maret 2024",
          dueDate: "2024-03-17",
          lateDays: "0 tahun 8 bulan 24 hari",
          principalTax: 1200000,
          penalty: 108000,
          totalBill: 1308000,
          exemptionPrincipal: 300000,
          exemptionPenalty: 54000,
          totalExemption: 354000,
          finalAmount: 954000,
          amountInWords: "Sembilan Ratus Lima Puluh Empat Ribu Rupiah",
          status: "Lunas",
          location: "KOTA SEMARANG",
          opd: "BADAN PENGELOLA PENDAPATAN DAERAH",
          uppd: "UPPD Kota Semarang",
          peruntukan: "Hotel & Resort",
          bendahara: {
            nama: "ADE KHAIRANI",
            nip: "19851001 200312 2 002",
          },
          kepalaUppd: {
            nama: "RETNO PANTJA INDAH WIJANI, SH, MH.",
            nip: "19670627 199403 2 003",
          },
        },
        // PAB Data - Complete details from provided document
        {
          id: "0177/140725",
          type: "PAB",
          objectName: "Pajak Alat Berat Forklift",
          payerName: "PT DELTA MERLIN SANDANG TEKSTIL",
          npwpd: "",
          address:
            "Jl. Raya Timur Km 10, Desa Bumiaji, Kecamatan Gondang, Kabupaten Sragen, Gondang, Sragen, Provinsi Jawa Tengah",
          date: "2025-07-14",
          amount: 189000,
          amountInWords: "seratus delapan puluh sembilan ribu rupiah",
          equipmentDetails: {
            merk: "MITSUBISHI",
            jenis: "Forklift",
            tipe: "FD30ND",
            tahunBuat: "2016",
            noSeriAlat: "F14E-13431",
            noRegistrasi: "SGN-0177-25",
            nopd: "25-00000300",
            fotoUnit: "-TIDAK ADA FOTO-",
          },
          skpdDetails: {
            nomor: "34.1011.00.SKPD.15.125.0177",
            tanggal: "2025-07-10",
            masaPajak: "2025-07-10 s.d 2026-07-10",
            pokok: 189000,
            denda: 0,
            jumlah: 189000,
            pembebasan: 0,
          },
          status: "Lunas",
          location: "KABUPATEN SRAGEN",
          opd: "BADAN PENGELOLA PENDAPATAN DAERAH",
          uppd: "Unit Pengelola Pendapatan Daerah (UPPD) Kabupaten Sragen",
          alamatUppd: "JL.Raya Barat Sukowatil Km. 02 No.17,Sragen, Telp. 0271-891260",
          bendahara: {
            nama: "Ari Widodo Edijanto, S.E.",
            nip: "19671230 200701 1 00",
          },
          catatan: [
            "Surat Ketetapan Pajak Daerah (SKPD) dapat diunduh melalui link sbb:",
            "atau scan QR berikut:",
            "Input token SKPD untuk unduh SKPD pada link tersebut.",
          ],
          printInfo: {
            dicetakOleh: "SUPERADMIN",
            tanggalCetak: "2025-08-13 06:12",
            sistem: "Sistem Informasi Pajak Alat Berat Provinsi Jawa Tengah",
            halaman: "1 dari 2",
          },
        },
        {
          id: "0176/140725",
          type: "PAB",
          objectName: "Pajak Alat Berat Forklift",
          payerName: "PT DELTA MERLIN SANDANG TEKSTIL",
          npwpd: "",
          address:
            "Jl. Raya Timur Km 10, Desa Bumiaji, Kecamatan Gondang, Kabupaten Sragen, Gondang, Sragen, Provinsi Jawa Tengah",
          date: "2025-07-14",
          amount: 189000,
          amountInWords: "seratus delapan puluh sembilan ribu rupiah",
          equipmentDetails: {
            merk: "MITSUBISHI",
            jenis: "Forklift",
            tipe: "FD30ND",
            tahunBuat: "2016",
            noSeriAlat: "F14E-13430",
            noRegistrasi: "SGN-0176-25",
            nopd: "25-00000299",
            fotoUnit: "-TIDAK ADA FOTO-",
          },
          skpdDetails: {
            nomor: "34.1011.00.SKPD.15.125.0176",
            tanggal: "2025-07-10",
            masaPajak: "2025-07-10 s.d 2026-07-10",
            pokok: 189000,
            denda: 0,
            jumlah: 189000,
            pembebasan: 0,
          },
          status: "Lunas",
          location: "KABUPATEN SRAGEN",
          opd: "BADAN PENGELOLA PENDAPATAN DAERAH",
          uppd: "Unit Pengelola Pendapatan Daerah (UPPD) Kabupaten Sragen",
          alamatUppd: "JL.Raya Barat Sukowatil Km. 02 No.17,Sragen, Telp. 0271-891260",
          bendahara: {
            nama: "Ari Widodo Edijanto, S.E.",
            nip: "19671230 200701 1 00",
          },
          catatan: [
            "Surat Ketetapan Pajak Daerah (SKPD) dapat diunduh melalui link sbb:",
            "atau scan QR berikut:",
            "Input token SKPD untuk unduh SKPD pada link tersebut.",
          ],
          printInfo: {
            dicetakOleh: "SUPERADMIN",
            tanggalCetak: "2025-08-13 06:12",
            sistem: "Sistem Informasi Pajak Alat Berat Provinsi Jawa Tengah",
            halaman: "1 dari 2",
          },
        },
        {
          id: "0178/140725",
          type: "PAB",
          objectName: "Pajak Alat Berat Excavator",
          payerName: "PT KONSTRUKSI BANGUNAN JAYA",
          npwpd: "P.2.15.0000123.4-532.000",
          address: "Jl. Raya Solo-Yogya Km 25, Klaten, Provinsi Jawa Tengah",
          date: "2025-07-15",
          amount: 350000,
          amountInWords: "tiga ratus lima puluh ribu rupiah",
          equipmentDetails: {
            merk: "CATERPILLAR",
            jenis: "Excavator",
            tipe: "320D",
            tahunBuat: "2018",
            noSeriAlat: "CAT320D-15678",
            noRegistrasi: "KLT-0178-25",
            nopd: "25-00000301",
            fotoUnit: "-TIDAK ADA FOTO-",
          },
          skpdDetails: {
            nomor: "34.1011.00.SKPD.15.125.0178",
            tanggal: "2025-07-15",
            masaPajak: "2025-07-15 s.d 2026-07-15",
            pokok: 350000,
            denda: 0,
            jumlah: 350000,
            pembebasan: 0,
          },
          status: "Lunas",
          location: "KABUPATEN KLATEN",
          opd: "BADAN PENGELOLA PENDAPATAN DAERAH",
          uppd: "Unit Pengelola Pendapatan Daerah (UPPD) Kabupaten Klaten",
          alamatUppd: "JL. Ahmad Yani No. 25, Klaten, Telp. 0272-321456",
          bendahara: {
            nama: "Sari Indah Lestari, S.E.",
            nip: "19801215 200512 2 001",
          },
          catatan: [
            "Surat Ketetapan Pajak Daerah (SKPD) dapat diunduh melalui link sbb:",
            "atau scan QR berikut:",
            "Input token SKPD untuk unduh SKPD pada link tersebut.",
          ],
          printInfo: {
            dicetakOleh: "SUPERADMIN",
            tanggalCetak: "2025-08-13 06:15",
            sistem: "Sistem Informasi Pajak Alat Berat Provinsi Jawa Tengah",
            halaman: "1 dari 2",
          },
        },
      ]

      let filtered = paymentReceipts

      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filtered = filtered.filter(
          (receipt) =>
            receipt.objectName.toLowerCase().includes(searchTerm) ||
            receipt.payerName.toLowerCase().includes(searchTerm) ||
            receipt.id.toLowerCase().includes(searchTerm),
        )
      }

      if (filters.location) {
        filtered = filtered.filter((receipt) => receipt.location === filters.location)
      }

      if (filters.opd) {
        filtered = filtered.filter((receipt) => receipt.opd === filters.opd)
      }

      if (filters.type) {
        filtered = filtered.filter((receipt) => receipt.type.toLowerCase() === filters.type.toLowerCase())
      }

      return {
        success: true,
        data: filtered,
        total: filtered.length,
      }
    } catch (error) {
      console.error("Get payment receipts error:", error)
      return { success: false, message: "Error getting payment receipts" }
    }
  }

  getPaymentReceiptById(id) {
    try {
      const receipts = this.getPaymentReceipts()
      const receipt = receipts.data.find((r) => r.id === id)

      if (receipt) {
        return { success: true, data: receipt }
      }

      return { success: false, message: "Bukti pembayaran tidak ditemukan" }
    } catch (error) {
      console.error("Get payment receipt by ID error:", error)
      return { success: false, message: "Error getting payment receipt" }
    }
  }
}

export default new DataService()
