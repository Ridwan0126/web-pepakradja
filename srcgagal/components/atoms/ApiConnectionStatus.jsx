"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"
import apiService from "../../services/api"

export default function ApiConnectionStatus() {
  const [connectionStatus, setConnectionStatus] = useState({
    isConnected: false,
    isChecking: true,
    message: "Memeriksa koneksi API...",
  })

  const checkConnection = async () => {
    setConnectionStatus((prev) => ({ ...prev, isChecking: true }))

    try {
      const result = await apiService.checkConnection()

      if (result.success) {
        setConnectionStatus({
          isConnected: true,
          isChecking: false,
          message: "Terhubung ke API - Data real-time tersedia",
        })
      } else {
        setConnectionStatus({
          isConnected: false,
          isChecking: false,
          message: `Koneksi API gagal: ${result.message}`,
        })
      }
    } catch (error) {
      setConnectionStatus({
        isConnected: false,
        isChecking: false,
        message: `Error koneksi: ${error.message}`,
      })
    }
  }

  useEffect(() => {
    checkConnection()

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    if (connectionStatus.isChecking) {
      return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    }

    if (connectionStatus.isConnected) {
      return <CheckCircle className="text-green-600" size={16} />
    }

    return <AlertCircle className="text-red-600" size={16} />
  }

  const getStatusColor = () => {
    if (connectionStatus.isChecking) return "bg-blue-50 border-blue-200 text-blue-700"
    if (connectionStatus.isConnected) return "bg-green-50 border-green-200 text-green-700"
    return "bg-red-50 border-red-200 text-red-700"
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg border text-sm font-medium shadow-lg ${getStatusColor()}`}
    >
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span>{connectionStatus.message}</span>
        {!connectionStatus.isChecking && (
          <button onClick={checkConnection} className="ml-2 text-xs underline hover:no-underline">
            Refresh
          </button>
        )}
      </div>
    </div>
  )
}
