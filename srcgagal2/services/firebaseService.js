import { db } from "../config/firebase"
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc } from "firebase/firestore"

class FirebaseService {
  async compressImageSmart(dataUrl, maxSizeKB = 300) {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        const maxDimension = 800 // Turunkan dari 1920 ke 800
        let { width, height } = img

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width
            width = maxDimension
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height
            height = maxDimension
          }
        }

        canvas.width = width
        canvas.height = height

        // Gunakan rendering berkualitas tinggi
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"

        // Untuk gambar dengan transparansi, jangan isi background
        if (dataUrl.includes("data:image/png") || dataUrl.includes("data:image/svg")) {
          ctx.clearRect(0, 0, width, height)
        }

        ctx.drawImage(img, 0, 0, width, height)

        // Tentukan format dan kualitas berdasarkan jenis gambar
        let format = "image/jpeg"
        let quality = 0.85 // Turunkan kualitas awal dari 0.92 ke 0.85

        // Untuk PNG atau SVG, pertahankan format PNG untuk transparansi
        if (dataUrl.includes("data:image/png") || dataUrl.includes("data:image/svg")) {
          format = "image/png"
          quality = 0.9 // Turunkan dari 0.95 ke 0.9
        }

        // Coba kompresi dengan kualitas tinggi terlebih dahulu
        let compressedDataUrl = canvas.toDataURL(format, quality)

        if (this.getDataUrlSizeKB(compressedDataUrl) > maxSizeKB) {
          // Coba dengan kualitas 70%
          quality = 0.7
          compressedDataUrl = canvas.toDataURL(format, quality)

          // Jika masih terlalu besar, resize lebih kecil lagi
          if (this.getDataUrlSizeKB(compressedDataUrl) > maxSizeKB) {
            const smallerMaxDimension = 500 // Turunkan dari 1200 ke 500
            if (width > height) {
              if (width > smallerMaxDimension) {
                height = (height * smallerMaxDimension) / width
                width = smallerMaxDimension
              }
            } else {
              if (height > smallerMaxDimension) {
                width = (width * smallerMaxDimension) / height
                height = smallerMaxDimension
              }
            }

            canvas.width = width
            canvas.height = height
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"

            if (dataUrl.includes("data:image/png") || dataUrl.includes("data:image/svg")) {
              ctx.clearRect(0, 0, width, height)
            }

            ctx.drawImage(img, 0, 0, width, height)
            compressedDataUrl = canvas.toDataURL(format, 0.65) // Turunkan kualitas ke 65%

            if (this.getDataUrlSizeKB(compressedDataUrl) > maxSizeKB) {
              const verySmallDimension = 300
              if (width > height) {
                if (width > verySmallDimension) {
                  height = (height * verySmallDimension) / width
                  width = verySmallDimension
                }
              } else {
                if (height > verySmallDimension) {
                  width = (width * verySmallDimension) / height
                  height = verySmallDimension
                }
              }

              canvas.width = width
              canvas.height = height
              ctx.imageSmoothingEnabled = true
              ctx.imageSmoothingQuality = "high"

              if (dataUrl.includes("data:image/png") || dataUrl.includes("data:image/svg")) {
                ctx.clearRect(0, 0, width, height)
              }

              ctx.drawImage(img, 0, 0, width, height)
              compressedDataUrl = canvas.toDataURL(format, 0.5) // Kualitas 50% untuk ukuran minimal
            }
          }
        }

        console.log(
          `Kompresi gambar: ${this.getDataUrlSizeKB(dataUrl)}KB → ${this.getDataUrlSizeKB(compressedDataUrl)}KB`,
        )
        resolve(compressedDataUrl)
      }

      img.src = dataUrl
    })
  }

  getDataUrlSizeKB(dataUrl) {
    const base64 = dataUrl.split(",")[1]
    const bytes = (base64.length * 3) / 4
    return Math.round(bytes / 1024)
  }

  // Contact Information Management
  async getContactInfo(opdUppdId) {
    try {
      const docRef = doc(db, "contacts", opdUppdId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() }
      } else {
        return { success: false, message: "Contact not found" }
      }
    } catch (error) {
      console.error("Error getting contact info:", error)
      return { success: false, error: error.message }
    }
  }

  async saveContactInfo(opdUppdId, contactData) {
    try {
      console.log("Firebase: Saving contact for ID:", opdUppdId)

      const apiData = this.getLocalData("all_objects") || []
      let matchingData = null
      let validatedId = null

      // Search through API data to find matching OPD/UPPD using exact ID format from API
      for (const item of apiData) {
        // Check UPPD first (priority) - exact match with API id_uppd format
        if (item.id_uppd && item.id_uppd === opdUppdId) {
          matchingData = {
            id: item.id_uppd,
            name: item.uppd?.nama || "Unknown UPPD",
            type: "UPPD",
            apiData: item,
          }
          validatedId = item.id_uppd
          console.log("Firebase: Found matching UPPD in API:", matchingData)
          break
        }
        // Then check OPD - exact match with API id_opd format
        else if (item.id_opd && item.id_opd === opdUppdId) {
          matchingData = {
            id: item.id_opd,
            name: item.opd?.nama || "Unknown OPD",
            type: "OPD",
            apiData: item,
          }
          validatedId = item.id_opd
          console.log("Firebase: Found matching OPD in API:", matchingData)
          break
        }
      }

      if (!matchingData || !validatedId) {
        console.error("Firebase: OPD/UPPD ID not found in API data:", opdUppdId)
        return {
          success: false,
          error: "OPD/UPPD ID not found in API data. Please ensure the ID matches the API format.",
        }
      }

      const docRef = doc(db, "contacts", validatedId)
      const contactDoc = {
        name: matchingData.name,
        email: contactData.email || "",
        phone: contactData.phone || "",
        whatsapp: contactData.whatsapp || "",
        whatsappUrl: this.formatWhatsAppUrl(contactData.whatsapp),
        id: validatedId,
        opdUppdId: validatedId,
        opdUppdName: matchingData.name,
        type: matchingData.type,
        apiIdOpd: matchingData.apiData.id_opd,
        apiIdUppd: matchingData.apiData.id_uppd,
        updatedAt: new Date().toISOString(),
      }

      console.log("Firebase: Saving contact document:", contactDoc)
      await setDoc(docRef, contactDoc, { merge: true })

      return { success: true, message: "Contact information saved successfully", data: contactDoc }
    } catch (error) {
      console.error("Error saving contact info:", error)
      return { success: false, error: error.message }
    }
  }

  async getAllContacts() {
    try {
      const querySnapshot = await getDocs(collection(db, "contacts"))
      const contacts = []

      querySnapshot.forEach((doc) => {
        contacts.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, data: contacts }
    } catch (error) {
      console.error("Error getting all contacts:", error)
      return { success: false, error: error.message }
    }
  }

  async deleteContact(id) {
    try {
      const docRef = doc(db, "contacts", id)
      await deleteDoc(docRef)
      return { success: true, message: "Contact deleted successfully" }
    } catch (error) {
      console.error("Error deleting contact:", error)
      return { success: false, error: error.message }
    }
  }

  // User Management
  async createUser(userData) {
    try {
      const docRef = doc(db, "users", userData.username)
      await setDoc(docRef, {
        ...userData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      return { success: true, message: "User created successfully" }
    } catch (error) {
      console.error("Error creating user:", error)
      return { success: false, error: error.message }
    }
  }

  async getUser(username) {
    try {
      const docRef = doc(db, "users", username)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() }
      } else {
        return { success: false, message: "User not found" }
      }
    } catch (error) {
      console.error("Error getting user:", error)
      return { success: false, error: error.message }
    }
  }

  async getAllUsers() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"))
      const users = []

      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() })
      })

      return { success: true, data: users }
    } catch (error) {
      console.error("Error getting all users:", error)
      return { success: false, error: error.message }
    }
  }

  async updateUser(username, userData) {
    try {
      const docRef = doc(db, "users", username)
      const updateData = { ...userData, updatedAt: new Date().toISOString() }

      if (!userData.password) {
        delete updateData.password
      }

      await updateDoc(docRef, updateData)
      return { success: true, message: "User updated successfully" }
    } catch (error) {
      console.error("Error updating user:", error)
      return { success: false, error: error.message }
    }
  }

  async deleteUser(username) {
    try {
      const docRef = doc(db, "users", username)
      await deleteDoc(docRef)
      return { success: true, message: "User deleted successfully" }
    } catch (error) {
      console.error("Error deleting user:", error)
      return { success: false, error: error.message }
    }
  }

  // App Settings Management (logos, images, app name)
  async getAppSettings() {
    try {
      const basicDocRef = doc(db, "settings", "app")
      const logoDocRef = doc(db, "settings", "navbar-logo")
      const footerLogoDocRef = doc(db, "settings", "footer-logo")
      const heroDocRef = doc(db, "settings", "hero-image")
      const sliderDocRef = doc(db, "settings", "slider-images")

      const [basicSnap, logoSnap, footerLogoSnap, heroSnap, sliderSnap] = await Promise.all([
        getDoc(basicDocRef),
        getDoc(logoDocRef),
        getDoc(footerLogoDocRef),
        getDoc(heroDocRef),
        getDoc(sliderDocRef),
      ])

      const defaultSettings = {
        appName: "Penak Busiti Jane",
        appSubtitle: "Pelayanan Pajak dan Retribusi Jawa Tengah Online",
        logoUrl: "/abstract-logo.png",
        footerLogoUrl: "/footer-logo.png",
        heroImageUrl: "/abstract-geometric-hero.png",
        sliderImages: ["/banner-1.png", "/banner-2.png", "/banner-3.png"],
        fabSettings: {
          logo: "/logo-app.svg",
          whatsappNumber: "",
          isEnabled: true,
        },
      }

      const settings = { ...defaultSettings }

      if (basicSnap.exists()) {
        Object.assign(settings, basicSnap.data())
      }

      if (logoSnap.exists()) {
        Object.assign(settings, logoSnap.data())
      }

      if (footerLogoSnap.exists()) {
        Object.assign(settings, footerLogoSnap.data())
      }

      if (heroSnap.exists()) {
        Object.assign(settings, heroSnap.data())
      }

      if (sliderSnap.exists()) {
        Object.assign(settings, sliderSnap.data())
      }

      return { success: true, data: settings }
    } catch (error) {
      console.error("Error getting app settings:", error)
      const defaultSettings = {
        appName: "Penak Busiti Jane",
        appSubtitle: "Pelayanan Pajak dan Retribusi Jawa Tengah Online",
        logoUrl: "/abstract-logo.png",
        footerLogoUrl: "/footer-logo.png",
        heroImageUrl: "/abstract-geometric-hero.png",
        sliderImages: ["/banner-1.png", "/banner-2.png", "/banner-3.png"],
        fabSettings: {
          logo: "/logo-app.svg",
          whatsappNumber: "",
          isEnabled: true,
        },
      }
      return { success: true, data: defaultSettings }
    }
  }

  async saveAppSettings(settingsData) {
    try {
      const basicSettings = {
        appName: settingsData.appName,
        appSubtitle: settingsData.appSubtitle,
        fabSettings: settingsData.fabSettings || {
          logo: "/logo-app.svg",
          whatsappNumber: "",
          isEnabled: true,
        },
        updatedAt: new Date().toISOString(),
      }

      // Save basic settings with FAB settings
      const basicDocRef = doc(db, "settings", "app")
      await setDoc(basicDocRef, basicSettings, { merge: true })

      if (settingsData.fabSettings?.logo && settingsData.fabSettings.logo.startsWith("data:")) {
        const compressedFabLogo = await this.compressImageSmart(settingsData.fabSettings.logo, 200)
        basicSettings.fabSettings.logo = compressedFabLogo
        await setDoc(basicDocRef, basicSettings, { merge: true })
      }

      if (settingsData.logoUrl && settingsData.logoUrl.startsWith("data:")) {
        const compressedLogo = await this.compressImageSmart(settingsData.logoUrl, 200) // Turunkan dari 400KB ke 200KB
        const logoDocRef = doc(db, "settings", "navbar-logo")
        await setDoc(logoDocRef, {
          logoUrl: compressedLogo,
          updatedAt: new Date().toISOString(),
        })
      }

      if (settingsData.footerLogoUrl && settingsData.footerLogoUrl.startsWith("data:")) {
        const compressedFooterLogo = await this.compressImageSmart(settingsData.footerLogoUrl, 200) // Turunkan dari 400KB ke 200KB
        const footerLogoDocRef = doc(db, "settings", "footer-logo")
        await setDoc(footerLogoDocRef, {
          footerLogoUrl: compressedFooterLogo,
          updatedAt: new Date().toISOString(),
        })
      }

      if (settingsData.heroImageUrl && settingsData.heroImageUrl.startsWith("data:")) {
        const compressedHero = await this.compressImageSmart(settingsData.heroImageUrl, 300) // Turunkan dari 600KB ke 300KB
        const heroDocRef = doc(db, "settings", "hero-image")
        await setDoc(heroDocRef, {
          heroImageUrl: compressedHero,
          updatedAt: new Date().toISOString(),
        })
      }

      if (settingsData.sliderImages && Array.isArray(settingsData.sliderImages)) {
        const compressedSliderImages = []
        for (let i = 0; i < settingsData.sliderImages.length; i++) {
          const image = settingsData.sliderImages[i]
          if (image && image.startsWith("data:")) {
            const compressedSlider = await this.compressImageSmart(image, 300) // Turunkan dari 600KB ke 300KB
            compressedSliderImages.push(compressedSlider)
          } else {
            compressedSliderImages.push(image) // Keep existing URLs
          }
        }

        const sliderDocRef = doc(db, "settings", "slider-images")
        await setDoc(sliderDocRef, {
          sliderImages: compressedSliderImages,
          updatedAt: new Date().toISOString(),
        })
      }

      return {
        success: true,
        message: "Pengaturan aplikasi berhasil disimpan dengan kompresi gambar yang dioptimalkan",
      }
    } catch (error) {
      console.error("Error saving app settings:", error)
      return { success: false, error: error.message }
    }
  }

  // File Upload to Data URL Conversion Helper
  async convertFileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async uploadFileToUrl(file) {
    try {
      if (!file) {
        return { success: false, error: "No file provided" }
      }

      const dataUrl = await this.convertFileToDataUrl(file)
      const compressedDataUrl = await this.compressImageSmart(dataUrl, 250) // Turunkan dari 600KB ke 250KB
      const sizeKB = this.getDataUrlSizeKB(compressedDataUrl)
      console.log(`File berhasil dikompresi: ${this.getDataUrlSizeKB(dataUrl)}KB → ${sizeKB}KB`)

      return {
        success: true,
        url: compressedDataUrl,
        message: `Gambar berhasil diupload dengan kualitas yang dioptimalkan (${sizeKB}KB)`,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      return { success: false, error: error.message }
    }
  }

  // Get all OPD/UPPD data for admin management
  getAllOPDUPPD() {
    const opdData = [
      { id: "01", name: "DINAS PENDIDIKAN DAN KEBUDAYAAN", type: "OPD", abbrev: "DISDIKBUD" },
      { id: "02", name: "DINAS KESEHATAN", type: "OPD", abbrev: "DINKES" },
      { id: "03", name: "DINAS PEKERJAAN UMUM BINA MARGA DAN CIPTA KARYA", type: "OPD", abbrev: "DPUBMCK" },
      { id: "04", name: "DINAS PEKERJAAN UMUM, SUMBER DAYA AIR DAN PENATAAN RUANG", type: "OPD", abbrev: "DPUSDAPR" },
      { id: "05", name: "BADAN PENGELOLA PENDAPATAN DAERAH", type: "OPD", abbrev: "BAPENDA" },
      { id: "06", name: "BADAN PERENCANAAN PEMBANGUNAN DAERAH", type: "OPD", abbrev: "BAPPEDA" },
      { id: "07", name: "DINAS PERHUBUNGAN", type: "OPD", abbrev: "DISHUB" },
      { id: "08", name: "DINAS LINGKUNGAN HIDUP DAN KEHUTANAN", type: "OPD", abbrev: "DLHK" },
      { id: "09", name: "DINAS SOSIAL", type: "OPD", abbrev: "DINSOS" },
      { id: "10", name: "DINAS TENAGAKERJA DAN TRANSMIGRASI", type: "OPD", abbrev: "DISNAKERTRANS" },
      { id: "11", name: "DINAS KOPERASI, USAHA KECIL DAN MENENGAH", type: "OPD", abbrev: "DISKOPUKM" },
      { id: "12", name: "DINAS KEPEMUDAAN, OLAHRAGA DAN PARIWISATA", type: "OPD", abbrev: "DISPORAPAR" },
      { id: "13", name: "BIRO UMUM SETDA PROV. JATENG", type: "OPD", abbrev: "BIRUM" },
      { id: "14", name: "SEKRETARIAT DPRD", type: "OPD", abbrev: "SETDPRD" },
      { id: "15", name: "BADAN PENGHUBUNG", type: "OPD", abbrev: "BANHUB" },
      { id: "16", name: "BADAN PENGEMBANGAN SUMBER DAYA MANUSIA DAERAH", type: "OPD", abbrev: "BPSDMD" },
      { id: "17", name: "DINAS KEARSIPAN DAN PERPUSTAKAAN", type: "OPD", abbrev: "DISPUSIP" },
      { id: "18", name: "DINAS PERTANIAN DAN PERKEBUNAN", type: "OPD", abbrev: "DISTANBUN" },
      { id: "19", name: "DINAS PETERNAKAN DAN KESEHATAN HEWAN", type: "OPD", abbrev: "DISPETNAKKESWAN" },
      { id: "20", name: "DINAS ENERGI DAN SUMBER DAYA MINERAL", type: "OPD", abbrev: "DESDM" },
      { id: "21", name: "DINAS KELAUTAN DAN PERIKANAN", type: "OPD", abbrev: "DKP" },
      { id: "22", name: "DINAS PERINDUSTRIAN DAN PERDAGANGAN", type: "OPD", abbrev: "DISPERINDAG" },
      { id: "23", name: "BADAN KEPEGAWAIAN DAERAH", type: "OPD", abbrev: "BKD" },
      { id: "24", name: "DINAS KETAHANAN PANGAN", type: "OPD", abbrev: "DKP2" },
      { id: "25", name: "RUMAH SAKIT UMUM DAERAH Dr. MOEWARDI", type: "OPD", abbrev: "RSUDMWS" },
      { id: "26", name: "RUMAH SAKIT UMUM DAERAH Prof. Dr. MARGONO SOEKARJO", type: "OPD", abbrev: "RSUDMSP" },
      { id: "27", name: "RUMAH SAKIT UMUM DAERAH Dr. ADHYATMA, MPH", type: "OPD", abbrev: "RSUDASM" },
      { id: "28", name: "RUMAH SAKIT UMUM DAERAH dr. REHATTA", type: "OPD", abbrev: "RSUDRJ" },
      { id: "29", name: "RUMAH SAKIT JIWA DAERAH Dr. AMINO GONDOHUTOMO", type: "OPD", abbrev: "RSJDAGS" },
      { id: "30", name: "RUMAH SAKIT JIWA DAERAH dr. ARIF ZAINUDDIN", type: "OPD", abbrev: "RSJDAZS" },
      { id: "31", name: "RUMAH SAKIT JIWA DAERAH Dr. RM. SOEDJARWADI", type: "OPD", abbrev: "RSUDRSK" },
    ]

    const uppdData = [
      { id: "01.01", id_opd: "01", name: "BP2MK WILAYAH SEMARANG", type: "UPPD", abbrev: "BP2MKSMG" },
      { id: "01.02", id_opd: "01", name: "BP2MK WILAYAH PATI", type: "UPPD", abbrev: "BP2MKPTI" },
      { id: "01.03", id_opd: "01", name: "BP2MK SURAKARTA", type: "UPPD", abbrev: "BP2MKSKT" },
      { id: "01.04", id_opd: "01", name: "BP2MK WILAYAH MAGELANG", type: "UPPD", abbrev: "BP2MKMGL" },
      { id: "01.05", id_opd: "01", name: "BP2MK WILAYAH BANYUMAS", type: "UPPD", abbrev: "BP2MKBMS" },
      { id: "01.06", id_opd: "01", name: "BP2MK WILAYAH PEKALONGAN", type: "UPPD", abbrev: "BP2MKPKL" },
      {
        id: "01.07",
        id_opd: "01",
        name: "BPTIK (BALAI PENGEMBANGAN TEKNOLOGI INFORMASI DAN KOMUNIKASI)",
        type: "UPPD",
        abbrev: "BPTIK",
      },
      {
        id: "01.08",
        id_opd: "01",
        name: "BPM DIKJUR ( BALAI PENGEMBANGAN MUTU PENDIDIKAN KEJURUAN)",
        type: "UPPD",
        abbrev: "BPMDIKJUR",
      },
      {
        id: "01.09",
        id_opd: "01",
        name: "BALAI PENGEMBANGAN PENDIDIKAN KHUSUS DAN LAYANAN KHUSUS",
        type: "UPPD",
        abbrev: "BPPKLK",
      },
      { id: "01.10", id_opd: "01", name: "TAMAN BUDAYA JAWA TENGAH", type: "UPPD", abbrev: "TBJT" },
      { id: "01.11", id_opd: "01", name: "MUSEUM JAWA TENGAH RONGGOWARSITO", type: "UPPD", abbrev: "MJTRW" },
      {
        id: "01.12",
        id_opd: "01",
        name: "BALAI PENGEMBANGAN SENI BUDAYA DAN BAHASA DAERAH",
        type: "UPPD",
        abbrev: "BPSBBD",
      },
      { id: "01.13", id_opd: "01", name: "CABANG DINAS PENDIDIKAN II", type: "UPPD", abbrev: "CADISDIK2" },
      { id: "01.14", id_opd: "01", name: "CABANG DINAS PENDIDIKAN Iv", type: "UPPD", abbrev: "CADISDIK4" },
      { id: "01.15", id_opd: "01", name: "CABANG DINAS PENDIDIKAN V", type: "UPPD", abbrev: "CADISDIK5" },
      { id: "01.16", id_opd: "01", name: "CABANG DINAS PENDIDIKAN VI", type: "UPPD", abbrev: "CADISDIK6" },
      { id: "01.17", id_opd: "01", name: "CABANG DINAS PENDIDIKAN VII", type: "UPPD", abbrev: "CADISDIK7" },
      { id: "01.18", id_opd: "01", name: "CABANG DINAS PENDIDIKAN VIII", type: "UPPD", abbrev: "CADISDIK8" },
      { id: "01.19", id_opd: "01", name: "CABANG DINAS PENDIDIKAN IX", type: "UPPD", abbrev: "CADISDIK9" },
      { id: "01.20", id_opd: "01", name: "CABANG DINAS PENDIDIKAN X", type: "UPPD", abbrev: "CADISDIK10" },
      { id: "01.21", id_opd: "01", name: "CABANG DINAS PENDIDIKAN XI", type: "UPPD", abbrev: "CADISDIK11" },
      { id: "01.22", id_opd: "01", name: "CABANG DINAS PENDIDIKAN XII", type: "UPPD", abbrev: "CADISDIK12" },
      { id: "01.23", id_opd: "01", name: "CABANG DINAS PENDIDIKAN XIII", type: "UPPD", abbrev: "CADISDIK13" },
      { id: "01.24", id_opd: "01", name: "CABANG DINAS PENDIDIKAN I", type: "UPPD", abbrev: "CADISDIK1" },
      { id: "01.25", id_opd: "01", name: "CABANG DINAS PENDIDIKAN III", type: "UPPD", abbrev: "CADISDIK3" },
      { id: "02.01", id_opd: "02", name: "BALAI KESEHATAN MASYARAKAT SEMARANG", type: "UPPD", abbrev: "BKMSMG" },
      { id: "02.02", id_opd: "02", name: "BALAI KESEHATAN MASYARAKAT AMBARAWA", type: "UPPD", abbrev: "BKMAMB" },
      { id: "02.03", id_opd: "02", name: "BALAI KESEHATAN MASYARAKAT MAGELANG", type: "UPPD", abbrev: "BKMMGL" },
      { id: "02.04", id_opd: "02", name: "BALAI KESEHATAN MASYARAKAT KLATEN", type: "UPPD", abbrev: "BKMKLT" },
      { id: "02.05", id_opd: "02", name: "BALAI KESEHATAN MASYARAKAT PATI", type: "UPPD", abbrev: "BKMPTI" },
      {
        id: "02.06",
        id_opd: "02",
        name: "BALAI LABORATORIUM KESEHATAN DAN PENGUJIAN ALAT KESEHATAN",
        type: "UPPD",
        abbrev: "BLKPAK",
      },
      { id: "02.07", id_opd: "02", name: "BALAI PELATIHAN KESEHATAN", type: "UPPD", abbrev: "BPK" },
      { id: "05.01", id_opd: "05", name: "UPPD Kota Semarang I", type: "UPPD", abbrev: "UPPDSMG1" },
      { id: "05.02", id_opd: "05", name: "UPPD Kota Semarang II", type: "UPPD", abbrev: "UPPDSMG2" },
      { id: "05.03", id_opd: "05", name: "UPPD Kota Semarang III", type: "UPPD", abbrev: "UPPDSMG3" },
      { id: "05.04", id_opd: "05", name: "UPPD Kota Salatiga", type: "UPPD", abbrev: "UPPDSTG" },
      { id: "05.05", id_opd: "05", name: "UPPD Kabupaten Semarang", type: "UPPD", abbrev: "UPPDKSMG" },
      { id: "05.06", id_opd: "05", name: "UPPD Kabupaten Kendal", type: "UPPD", abbrev: "UPPDKDL" },
      { id: "05.07", id_opd: "05", name: "UPPD Kabupaten Demak", type: "UPPD", abbrev: "UPPDDMK" },
      { id: "05.08", id_opd: "05", name: "UPPD Kabupaten Grobogan", type: "UPPD", abbrev: "UPPDGBG" },
      { id: "05.09", id_opd: "05", name: "UPPD Kota Surakarta", type: "UPPD", abbrev: "UPPDSKT" },
      { id: "05.10", id_opd: "05", name: "UPPD Kabupaten Sukoharjo", type: "UPPD", abbrev: "UPPDSKH" },
      { id: "05.11", id_opd: "05", name: "UPPD Kabupaten Klaten", type: "UPPD", abbrev: "UPPDKLT" },
      { id: "05.12", id_opd: "05", name: "UPPD Kabupaten Boyolali", type: "UPPD", abbrev: "UPPDBYL" },
      { id: "05.13", id_opd: "05", name: "UPPD Kabupaten Sragen", type: "UPPD", abbrev: "UPPDSRG" },
      { id: "05.14", id_opd: "05", name: "UPPD Kabupaten Karanganyar", type: "UPPD", abbrev: "UPPDKRA" },
      { id: "05.15", id_opd: "05", name: "UPPD Kabupaten Wonogiri", type: "UPPD", abbrev: "UPPDWNG" },
      { id: "05.16", id_opd: "05", name: "UPPD Kabupaten Pati", type: "UPPD", abbrev: "UPPDPTI" },
      { id: "05.17", id_opd: "05", name: "UPPD Kabupaten Kudus", type: "UPPD", abbrev: "UPPDKDS" },
      { id: "05.18", id_opd: "05", name: "UPPD Kabupaten Jepara", type: "UPPD", abbrev: "UPPDJPR" },
      { id: "05.19", id_opd: "05", name: "UPPD Kabupaten Rembang", type: "UPPD", abbrev: "UPPDRMBG" },
      { id: "05.20", id_opd: "05", name: "UPPD Kabupaten Blora", type: "UPPD", abbrev: "UPPDBLR" },
      { id: "05.21", id_opd: "05", name: "UPPD Kota Pekalongan", type: "UPPD", abbrev: "UPPDPKL" },
      { id: "05.22", id_opd: "05", name: "UPPD Kabupaten Pekalongan", type: "UPPD", abbrev: "UPPDKPKL" },
      { id: "05.23", id_opd: "05", name: "UPPD Kabupaten Batang", type: "UPPD", abbrev: "UPPDBTN" },
      { id: "05.24", id_opd: "05", name: "UPPD Kabupaten Pemalang", type: "UPPD", abbrev: "UPPDPML" },
      { id: "05.25", id_opd: "05", name: "UPPD Kota Tegal", type: "UPPD", abbrev: "UPPDTGL" },
      { id: "05.26", id_opd: "05", name: "UPPD Kabupaten Tegal", type: "UPPD", abbrev: "UPPDKTGL" },
      { id: "05.27", id_opd: "05", name: "UPPD Kabupaten Brebes", type: "UPPD", abbrev: "UPPDBBS" },
      { id: "05.28", id_opd: "05", name: "UPPD Kabupaten Banyumas", type: "UPPD", abbrev: "UPPDBMS" },
      { id: "05.29", id_opd: "05", name: "UPPD Kabupaten Cilacap", type: "UPPD", abbrev: "UPPDCLP" },
      { id: "05.30", id_opd: "05", name: "UPPD Kabupaten Purbalingga", type: "UPPD", abbrev: "UPPDPBL" },
      { id: "05.31", id_opd: "05", name: "UPPD Kabupaten Banjarnegara", type: "UPPD", abbrev: "UPPDBNJR" },
      { id: "05.32", id_opd: "05", name: "UPPD Kota Magelang", type: "UPPD", abbrev: "UPPDMGL" },
      { id: "05.33", id_opd: "05", name: "UPPD Kabupaten Magelang", type: "UPPD", abbrev: "UPPDKMGL" },
      { id: "05.34", id_opd: "05", name: "UPPD Kabupaten Purworejo", type: "UPPD", abbrev: "UPPDPWR" },
      { id: "05.35", id_opd: "05", name: "UPPD Kabupaten Kebumen", type: "UPPD", abbrev: "UPPDKBM" },
      { id: "05.36", id_opd: "05", name: "UPPD Kabupaten Temanggung", type: "UPPD", abbrev: "UPPDTMG" },
      { id: "05.37", id_opd: "05", name: "UPPD Kabupaten Wonosobo", type: "UPPD", abbrev: "UPPDWSB" },
    ]

    return [...opdData, ...uppdData]
  }

  // Initialize default users (OPD and UPPD)
  async initializeDefaultUsers() {
    try {
      const allData = this.getAllOPDUPPD()

      // Create admin user
      await this.createUser({
        username: "admin",
        email: "admin@retribusi-bapenda.com",
        password: "admin123",
        role: "admin",
        name: "Administrator",
        opdUppdId: null,
        opdUppdName: null,
      })

      // Create users for all OPD/UPPD
      for (const item of allData) {
        await this.createUser({
          username: item.abbrev,
          email: `${item.abbrev.toLowerCase()}@retribusi-bapenda.com`,
          password: "user123",
          role: "user",
          name: item.name,
          opdUppdId: item.id,
          opdUppdName: item.name,
          type: item.type,
        })
      }

      return { success: true, message: "Default users initialized successfully" }
    } catch (error) {
      console.error("Error initializing default users:", error)
      return { success: false, error: error.message }
    }
  }

  // Helper function to format WhatsApp URL
  formatWhatsAppUrl(phoneNumber) {
    if (!phoneNumber) return ""

    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, "")

    // Add 62 prefix if it doesn't start with 62
    const formattedNumber = cleanNumber.startsWith("62") ? cleanNumber : `62${cleanNumber}`

    return `https://wa.me/${formattedNumber}`
  }

  async getContactByOpdUppdId(opdId, uppdId) {
    try {
      console.log("Firebase: Looking for contact with IDs:", { opdId, uppdId })

      // First try to get UPPD contact info from Firebase using exact API format
      if (uppdId) {
        console.log("Firebase: Trying UPPD ID:", uppdId)
        const uppdResult = await this.getContactInfo(uppdId)
        if (uppdResult.success) {
          console.log("Firebase: Found UPPD contact:", uppdResult.data)
          return { success: true, data: uppdResult.data }
        }
      }

      // If no UPPD contact found, try OPD from Firebase using exact API format
      if (opdId) {
        console.log("Firebase: Trying OPD ID:", opdId)
        const opdResult = await this.getContactInfo(opdId)
        if (opdResult.success) {
          console.log("Firebase: Found OPD contact:", opdResult.data)
          return { success: true, data: opdResult.data }
        }
      }

      console.log("Firebase: No contact information found for IDs:", { opdId, uppdId })
      return { success: false, message: "No contact information found" }
    } catch (error) {
      console.error("Error getting contact by OPD/UPPD ID:", error)
      return { success: false, error: error.message }
    }
  }

  // Session Management
  setUserSession(userData) {
    const sessionData = {
      ...userData,
      loginTime: Date.now(),
      expiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    }
    localStorage.setItem("currentUser", JSON.stringify(sessionData))
  }

  isSessionValid() {
    const userData = localStorage.getItem("currentUser")
    if (!userData) return false

    try {
      const session = JSON.parse(userData)
      return Date.now() < session.expiresAt
    } catch (error) {
      return false
    }
  }

  clearSession() {
    localStorage.removeItem("currentUser")
  }

  getLocalData(key) {
    try {
      const data = localStorage.getItem(key)
      return data ? JSON.parse(data) : null
    } catch (error) {
      console.error("Error getting local data:", error)
      return null
    }
  }
}

export const firebaseService = new FirebaseService()
export default firebaseService
