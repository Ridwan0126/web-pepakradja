import axios from "axios"

const BASE_URL = "https://rpp.bapenda.jatengprov.go.id/penatausahaan/api/penakbusiti"

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// API endpoints
export const apiEndpoints = {
  // Get all objects with pagination and filters
  getAllObjects: (params = {}) => {
    const defaultParams = {
      search: "",
      sort_by: "created_at",
      sort_order: "desc",
      limit: params.limit || 1000, // Much higher limit to get more data per request
      page: params.page || 1,
      ...params,
    }

    const queryString = new URLSearchParams(defaultParams).toString()
    return api.get(`/obyek-retribusi?${queryString}`)
  },

  getAllObjectsNoPagination: (params = {}) => {
    const searchParams = {
      search: params.search || "",
      sort_by: "created_at",
      sort_order: "desc",
      // Try to get maximum possible data
      limit: 10000, // Very high limit to get all data
      page: 1,
      ...params,
    }

    const queryString = new URLSearchParams(searchParams).toString()
    return api.get(`/obyek-retribusi?${queryString}`)
  },

  // Get object by ID
  getObjectById: (id) => {
    return api.get(`/obyek-retribusi/${id}`)
  },
}

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error("API Error:", error)

  if (error.response) {
    // Server responded with error status
    return {
      success: false,
      message: error.response.data?.message || "Terjadi kesalahan pada server",
      status: error.response.status,
    }
  } else if (error.request) {
    // Request was made but no response received
    return {
      success: false,
      message: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
      status: 0,
    }
  } else {
    // Something else happened
    return {
      success: false,
      message: "Terjadi kesalahan yang tidak terduga",
      status: -1,
    }
  }
}

export default api
