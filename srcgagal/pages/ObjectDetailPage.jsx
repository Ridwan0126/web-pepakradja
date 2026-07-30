"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"
import Container from "../components/atoms/Container"
import Button from "../components/atoms/Button"
import ObjectDetail from "../components/organisms/ObjectDetail"
import ApiConnectionStatus from "../components/atoms/ApiConnectionStatus"
import apiService from "../services/api"

export default function ObjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [object, setObject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch object data with better error handling
  useEffect(() => {
    const fetchObject = async () => {
      if (!id) {
        setError("ID obyek tidak valid")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        console.log("🔍 Fetching object detail for ID:", id)
        const result = await apiService.getObjectById(id)

        if (result.success && result.data) {
          console.log("✅ Object detail loaded successfully")
          setObject(result.data)
        } else {
          console.warn("⚠️ Object not found:", result.message)
          setError(result.message || "Obyek tidak ditemukan")
        }
      } catch (err) {
        console.error("❌ Error fetching object:", err)

        let errorMessage = "Terjadi kesalahan saat memuat data obyek"
        if (err.message.includes("timeout")) {
          errorMessage = "Request timeout - Server tidak merespons"
        } else if (err.message.includes("Network Error")) {
          errorMessage = "Network error - Tidak dapat terhubung ke server"
        }

        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchObject()
  }, [id])

  // Retry function
  const handleRetry = () => {
    setError(null)
    setLoading(true)
    // Re-trigger the effect by updating a dependency
    window.location.reload()
  }

  // Loading state
  if (loading) {
    return (
      <div className="page-container">
        <ApiConnectionStatus />
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat detail obyek retribusi...</p>
              <p className="text-sm text-gray-500 mt-2">ID: {id}</p>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="page-container">
        <ApiConnectionStatus />
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Gagal Memuat Detail</h3>
              <p className="text-gray-600 mb-2">{error}</p>
              <p className="text-sm text-gray-500 mb-4">ID: {id}</p>
              <div className="space-y-2">
                <Button onClick={handleRetry} variant="primary" icon={<RefreshCw size={18} />}>
                  Coba Lagi
                </Button>
                <Button onClick={() => navigate("/objects")} variant="outline">
                  Kembali ke Daftar Obyek
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  // No object found
  if (!object) {
    return (
      <div className="page-container">
        <ApiConnectionStatus />
        <Container>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="text-yellow-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Obyek Tidak Ditemukan</h3>
              <p className="text-gray-600 mb-2">Obyek dengan ID "{id}" tidak ditemukan dalam sistem</p>
              <div className="space-y-2">
                <Button onClick={handleRetry} variant="primary" icon={<RefreshCw size={18} />}>
                  Coba Lagi
                </Button>
                <Button onClick={() => navigate("/objects")} variant="outline">
                  Kembali ke Daftar Obyek
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className="page-container">
      <ApiConnectionStatus />

      {/* Back Button */}
      <Container>
        <div className="mb-6">
          <Button
            onClick={() => navigate("/objects")}
            variant="outline"
            icon={<ArrowLeft size={18} />}
            className="mb-4"
          >
            Kembali ke Daftar Obyek
          </Button>
        </div>
      </Container>

      {/* Object Detail */}
      <ObjectDetail object={object} />
    </div>
  )
}
