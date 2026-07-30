// Utility functions for formatting data

export const formatCurrency = (amount) => {
  if (!amount) return "Rp 0"

  const numAmount = typeof amount === "string" ? Number.parseInt(amount) : amount
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount)
}

export const formatDate = (dateString) => {
  if (!dateString) return "-"

  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export const formatDateTime = (dateString) => {
  if (!dateString) return "-"

  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ""
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export const getStatusText = (status) => {
  return status === 1 ? "Aktif" : "Tidak Aktif"
}

export const getStatusColor = (status) => {
  return status === 1 ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
}

export const extractCoordinates = (latLong) => {
  if (!latLong) return null

  try {
    const coords = latLong.split(",").map((coord) => Number.parseFloat(coord.trim()))
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return { lat: coords[0], lng: coords[1] }
    }
  } catch (error) {
    console.error("Error parsing coordinates:", error)
  }

  return null
}

export const generateMapUrl = (latLong, name = "") => {
  const coords = extractCoordinates(latLong)
  if (!coords) return null

  const encodedName = encodeURIComponent(name)
  return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&t=m&z=15&hl=id&gl=ID&mapclient=embed&cid=${encodedName}`
}

export const generateShareUrl = (objectId, objectName) => {
  const baseUrl = window.location.origin
  const encodedName = encodeURIComponent(objectName)
  return `${baseUrl}/obyek/${objectId}?name=${encodedName}`
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea")
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand("copy")
      document.body.removeChild(textArea)
      return true
    } catch (fallbackError) {
      document.body.removeChild(textArea)
      return false
    }
  }
}
