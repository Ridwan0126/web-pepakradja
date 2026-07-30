"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Type, Save, Plus, Trash2, Phone } from "lucide-react"
import firebaseService from "../services/firebaseService"
import SplashScreen from "../components/SplashScreen"
import Swal from "sweetalert2"

const SettingsPage = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState({})

  // App settings form state
  const [settingsForm, setSettingsForm] = useState({
    appName: "",
    appSubtitle: "",
    logoUrl: "",
    footerLogoUrl: "",
    heroImageUrl: "",
    sliderImages: ["", "", ""],
    fabSettings: {
      logo: "/logo-app.svg",
      whatsappNumber1: "",
      whatsappNumber2: "",
      isEnabled: true,
    },
  })

  const [whatsappError1, setWhatsappError1] = useState("")
  const [whatsappError2, setWhatsappError2] = useState("")

  const validateWhatsApp = (number, setError) => {
    if (!number) {
      setError("")
      return true // Allow empty for optional fields
    }

    if (number.startsWith("0") || number.startsWith("62") || number.startsWith("+62")) {
      setError("Format salah! Jangan gunakan awalan 0, 62, atau +62. Contoh yang benar: 8123456789")
      return false
    }

    if (!number.startsWith("8") || number.length < 9 || number.length > 13) {
      setError("Nomor harus dimulai dengan 8 dan memiliki panjang 9-13 digit")
      return false
    }

    if (!/^\d+$/.test(number)) {
      setError("Nomor hanya boleh berisi angka")
      return false
    }

    setError("")
    return true
  }

  useEffect(() => {
    const userData = localStorage.getItem("currentUser")
    if (!userData || !firebaseService.isSessionValid()) {
      navigate("/admin")
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== "admin") {
      navigate("/admin/dashboard")
      return
    }

    setCurrentUser(user)
    loadSettings()
  }, [navigate])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const result = await firebaseService.getAppSettings()
      if (result.success) {
        setSettingsForm({
          appName: result.data.appName || "",
          appSubtitle: result.data.appSubtitle || "",
          logoUrl: result.data.logoUrl || "",
          footerLogoUrl: result.data.footerLogoUrl || "",
          heroImageUrl: result.data.heroImageUrl || "",
          sliderImages: result.data.sliderImages || ["", "", ""],
          fabSettings: result.data.fabSettings || {
            logo: "/logo-app.svg",
            whatsappNumber1: "",
            whatsappNumber2: "",
            isEnabled: true,
          },
        })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Gagal memuat pengaturan aplikasi",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file, field, index = null) => {
    const uploadKey = index !== null ? `${field}_${index}` : field
    setUploadingFiles((prev) => ({ ...prev, [uploadKey]: true }))

    try {
      console.log(`[v0] Starting upload for ${field}:`, file.name)
      const result = await firebaseService.uploadFileToUrl(file)
      console.log(`[v0] Upload result for ${field}:`, result)

      if (result.success && result.url) {
        if (index !== null) {
          // For slider images
          const newSliderImages = [...settingsForm.sliderImages]
          newSliderImages[index] = result.url
          setSettingsForm((prev) => ({ ...prev, sliderImages: newSliderImages }))
        } else {
          if (field === "fabLogo") {
            setSettingsForm((prev) => ({
              ...prev,
              fabSettings: { ...prev.fabSettings, logo: result.url },
            }))
            console.log(`[v0] FAB logo updated successfully:`, result.url.substring(0, 50) + "...")
          } else {
            setSettingsForm((prev) => ({ ...prev, [field]: result.url }))
          }
        }

        Swal.fire({
          icon: "success",
          title: "Upload Berhasil",
          text: "Gambar berhasil diupload",
          timer: 1500,
          showConfirmButton: false,
        })
      } else {
        console.error(`[v0] Upload failed for ${field}:`, result)
        throw new Error(
          result.error || `Upload failed - ${result.success ? "no data returned" : "upload unsuccessful"}`,
        )
      }
    } catch (error) {
      console.error(`[v0] Error uploading ${field}:`, error)
      Swal.fire({
        icon: "error",
        title: "Error Upload",
        text: `Gagal mengupload file: ${error.message}`,
      })
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [uploadKey]: false }))
    }
  }

  const handleSaveSettings = async () => {
    const isValid1 = validateWhatsApp(settingsForm.fabSettings.whatsappNumber1, setWhatsappError1)
    const isValid2 = validateWhatsApp(settingsForm.fabSettings.whatsappNumber2, setWhatsappError2)

    if (settingsForm.fabSettings.isEnabled && (!isValid1 || !isValid2)) {
      Swal.fire({
        icon: "error",
        title: "Format WhatsApp Salah",
        text: "Periksa format nomor WhatsApp yang dimasukkan",
      })
      return
    }

    if (
      settingsForm.fabSettings.isEnabled &&
      !settingsForm.fabSettings.whatsappNumber1 &&
      !settingsForm.fabSettings.whatsappNumber2
    ) {
      Swal.fire({
        icon: "error",
        title: "Nomor WhatsApp Diperlukan",
        text: "Minimal satu nomor WhatsApp harus diisi jika tombol diaktifkan",
      })
      return
    }

    const result = await Swal.fire({
      title: "Konfirmasi Simpan Pengaturan",
      text: "Apakah Anda yakin ingin menyimpan pengaturan aplikasi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, Simpan!",
      cancelButtonText: "Batal",
    })

    if (!result.isConfirmed) return

    setIsSaving(true)
    try {
      const cleanedSettings = {
        ...settingsForm,
        appName: settingsForm.appName || "",
        appSubtitle: settingsForm.appSubtitle || "",
        logoUrl: settingsForm.logoUrl || "",
        footerLogoUrl: settingsForm.footerLogoUrl || "",
        heroImageUrl: settingsForm.heroImageUrl || "",
        sliderImages: settingsForm.sliderImages.filter((img) => img && img.trim() !== ""),
        fabSettings: {
          logo: settingsForm.fabSettings.logo || "/logo-app.svg",
          whatsappNumber1: settingsForm.fabSettings.whatsappNumber1 || "",
          whatsappNumber2: settingsForm.fabSettings.whatsappNumber2 || "",
          isEnabled: Boolean(settingsForm.fabSettings.isEnabled),
        },
      }

      console.log("[v0] Saving FAB settings:", cleanedSettings.fabSettings)
      console.log("[v0] FAB logo is data URL:", cleanedSettings.fabSettings.logo.startsWith("data:"))
      console.log("[v0] Complete settings to save:", cleanedSettings)

      const saveResult = await firebaseService.saveAppSettings(cleanedSettings)
      if (saveResult.success) {
        console.log("[v0] Settings saved successfully to Firebase")
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pengaturan aplikasi berhasil disimpan",
        })
      } else {
        throw new Error(saveResult.error || "Gagal menyimpan pengaturan")
      }
    } catch (error) {
      console.error("[v0] Error saving settings:", error)
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Gagal menyimpan pengaturan: ${error.message}`,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addSliderImage = () => {
    setSettingsForm((prev) => ({
      ...prev,
      sliderImages: [...prev.sliderImages, ""],
    }))
  }

  const removeSliderImage = async (index) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus gambar slider ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    })

    if (result.isConfirmed) {
      const newSliderImages = settingsForm.sliderImages.filter((_, i) => i !== index)
      setSettingsForm((prev) => ({ ...prev, sliderImages: newSliderImages }))

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Gambar slider berhasil dihapus",
      })
    }
  }

  if (isLoading) {
    return <SplashScreen />
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pengaturan Aplikasi</h1>
            <p className="text-gray-600">Kelola pengaturan dan tampilan aplikasi</p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Kembali ke Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-6">
            {/* App Name & Subtitle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Aplikasi</label>
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={settingsForm.appName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, appName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Penak Busiti Jane"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle Aplikasi</label>
                <input
                  type="text"
                  value={settingsForm.appSubtitle}
                  onChange={(e) => setSettingsForm({ ...settingsForm, appSubtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Pelayanan Pajak dan Retribusi Jawa Tengah Online"
                />
              </div>
            </div>

            {/* Logos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Navbar</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) handleFileUpload(file, "logoUrl")
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">Format: PNG, JPG, JPEG, SVG, WebP, GIF</p>
                  {uploadingFiles.logoUrl && <div className="text-sm text-blue-600">Uploading...</div>}
                  {settingsForm.logoUrl && (
                    <div className="mt-2">
                      <img
                        src={settingsForm.logoUrl || "/placeholder.svg"}
                        alt="Logo Navbar Preview"
                        className="h-12 w-auto"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Footer</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) handleFileUpload(file, "footerLogoUrl")
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">Format: PNG, JPG, JPEG, SVG, WebP, GIF</p>
                  {uploadingFiles.footerLogoUrl && <div className="text-sm text-blue-600">Uploading...</div>}
                  {settingsForm.footerLogoUrl && (
                    <div className="mt-2">
                      <img
                        src={settingsForm.footerLogoUrl || "/placeholder.svg"}
                        alt="Logo Footer Preview"
                        className="h-12 w-auto"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo Tombol WhatsApp</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        handleFileUpload(file, "fabLogo")
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">Format: PNG, JPG, JPEG, SVG, WebP, GIF</p>
                  {uploadingFiles.fabLogo && (
                    <div className="text-sm text-blue-600 flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Uploading...
                    </div>
                  )}
                  {settingsForm.fabSettings.logo && (
                    <div className="mt-2">
                      <img
                        src={settingsForm.fabSettings.logo || "/placeholder.svg"}
                        alt="Logo WhatsApp Preview"
                        className="h-12 w-auto object-contain border border-gray-200 rounded-lg p-2"
                        onError={(e) => {
                          e.target.src = "/logo-app.svg"
                        }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {settingsForm.fabSettings.logo.startsWith("data:") ? "Logo kustom" : "Logo default"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Hero</label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) handleFileUpload(file, "heroImageUrl")
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">Format: PNG, JPG, JPEG, SVG, WebP, GIF</p>
                {uploadingFiles.heroImageUrl && <div className="text-sm text-blue-600">Uploading...</div>}
                {settingsForm.heroImageUrl && (
                  <div className="mt-2">
                    <img
                      src={settingsForm.heroImageUrl || "/placeholder.svg"}
                      alt="Hero Image Preview"
                      className="h-32 w-auto"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Slider Images */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">Gambar Slider</label>
                <button
                  onClick={addSliderImage}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus size={16} />
                  Tambah Banner
                </button>
              </div>
              <div className="space-y-4">
                {settingsForm.sliderImages.map((image, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900">Slider {index + 1}</h4>
                      {settingsForm.sliderImages.length > 1 && (
                        <button
                          onClick={() => removeSliderImage(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) handleFileUpload(file, "sliderImages", index)
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500">Format: PNG, JPG, JPEG, SVG, WebP, GIF</p>
                      {uploadingFiles[`sliderImages_${index}`] && (
                        <div className="text-sm text-blue-600">Uploading...</div>
                      )}
                      {image && (
                        <div className="mt-2">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Slider ${index + 1} Preview`}
                            className="h-24 w-auto"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Tombol WhatsApp</h3>

              <div className="space-y-4">
                {/* Enable/Disable FAB */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fabEnabled"
                    checked={settingsForm.fabSettings.isEnabled}
                    onChange={(e) =>
                      setSettingsForm((prev) => ({
                        ...prev,
                        fabSettings: { ...prev.fabSettings, isEnabled: e.target.checked },
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fabEnabled" className="ml-2 block text-sm text-gray-900">
                    Aktifkan tombol WhatsApp mengambang
                  </label>
                </div>

                {settingsForm.fabSettings.isEnabled && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor WhatsApp Help Desk 1 (tanpa 0 atau +62)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={settingsForm.fabSettings.whatsappNumber1}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            setSettingsForm((prev) => ({
                              ...prev,
                              fabSettings: { ...prev.fabSettings, whatsappNumber1: value },
                            }))
                            validateWhatsApp(value, setWhatsappError1)
                          }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            whatsappError1 ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="8123456789"
                        />
                      </div>
                      {whatsappError1 && <p className="mt-1 text-sm text-red-600">{whatsappError1}</p>}
                      {settingsForm.fabSettings.whatsappNumber1 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Akan menjadi: https://wa.me/62{settingsForm.fabSettings.whatsappNumber1}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nomor WhatsApp Help Desk 2 (tanpa 0 atau +62) - Opsional
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={settingsForm.fabSettings.whatsappNumber2}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            setSettingsForm((prev) => ({
                              ...prev,
                              fabSettings: { ...prev.fabSettings, whatsappNumber2: value },
                            }))
                            validateWhatsApp(value, setWhatsappError2)
                          }}
                          className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            whatsappError2 ? "border-red-500 bg-red-50" : "border-gray-300"
                          }`}
                          placeholder="8987654321"
                        />
                      </div>
                      {whatsappError2 && <p className="mt-1 text-sm text-red-600">{whatsappError2}</p>}
                      {settingsForm.fabSettings.whatsappNumber2 && (
                        <p className="mt-1 text-xs text-gray-500">
                          Akan menjadi: https://wa.me/62{settingsForm.fabSettings.whatsappNumber2}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving || (settingsForm.fabSettings.isEnabled && (whatsappError1 || whatsappError2))}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={20} />
                {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
