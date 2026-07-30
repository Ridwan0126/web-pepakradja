"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin, AlertCircle } from "lucide-react"

export default function MapView({ latitude, longitude, objectName, className = "" }) {
  const mapRef = useRef(null)
  const [mapError, setMapError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Parse coordinates safely
  const parseCoordinate = (coord) => {
    if (!coord) return null

    // Handle string coordinates
    if (typeof coord === "string") {
      const parsed = Number.parseFloat(coord.replace(",", "."))
      return isNaN(parsed) ? null : parsed
    }

    // Handle number coordinates
    if (typeof coord === "number") {
      return isNaN(coord) ? null : coord
    }

    return null
  }

  const lat = parseCoordinate(latitude)
  const lng = parseCoordinate(longitude)

  // Check if coordinates are valid
  const hasValidCoordinates = lat !== null && lng !== null && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180

  useEffect(() => {
    if (!hasValidCoordinates) {
      setMapError(true)
      setIsLoading(false)
      return
    }

    // Initialize map
    const initMap = () => {
      try {
        if (window.google && window.google.maps) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 15,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
          })

          // Add marker
          new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: objectName || "Lokasi Obyek Retribusi",
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#ef4444" stroke="#dc2626" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" fill="white"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 32),
              anchor: new window.google.maps.Point(16, 32),
            },
          })

          setIsLoading(false)
          setMapError(false)
        } else {
          throw new Error("Google Maps not loaded")
        }
      } catch (error) {
        console.error("❌ Error initializing map:", error)
        setMapError(true)
        setIsLoading(false)
      }
    }

    // Load Google Maps if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO_BcqzKOqiMSM&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.onerror = () => {
        console.error("❌ Failed to load Google Maps")
        setMapError(true)
        setIsLoading(false)
      }
      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [lat, lng, objectName, hasValidCoordinates])

  // Show error state if no valid coordinates
  if (!hasValidCoordinates) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Tidak Tersedia</h3>
          <p className="text-gray-600 text-sm">Koordinat lokasi tidak tersedia atau tidak valid untuk obyek ini.</p>
          <div className="mt-4 text-xs text-gray-500 bg-gray-100 rounded p-2">
            <div>Latitude: {latitude || "Tidak tersedia"}</div>
            <div>Longitude: {longitude || "Tidak tersedia"}</div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Memuat Map</h3>
          <p className="text-gray-600 text-sm">Sedang memuat peta lokasi...</p>
        </div>
      </div>
    )
  }

  // Show error state if map failed to load
  if (mapError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-8 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="text-red-500" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Tidak Dapat Dimuat</h3>
          <p className="text-gray-600 text-sm mb-4">
            Terjadi kesalahan saat memuat peta. Silakan coba refresh halaman.
          </p>
          <div className="text-xs text-gray-500 bg-gray-100 rounded p-2">
            <div>
              Koordinat: {lat}, {lng}
            </div>
            <div>Status: Error loading Google Maps</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-64 rounded-lg border border-gray-200" style={{ minHeight: "256px" }} />

      {/* Coordinate Info */}
      <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded px-2 py-1 text-xs text-gray-600 shadow">
        {lat.toFixed(6)}, {lng.toFixed(6)}
      </div>
    </div>
  )
}
