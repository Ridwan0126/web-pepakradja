"use client"

// Mock data untuk development
const MOCK_OBJECTS = [
  {
    id: 1,
    id_gen_obyek: "OBJ001",
    obyek_retribusi: "Pasar Tradisional Johar",
    alamat: "Jl. Pemuda No. 1, Semarang",
    lokasi: "Semarang",
    kota: { kab_kota: "Kota Semarang" },
    opd: { nama: "Dinas Perdagangan" },
    nama_opd: "Dinas Perdagangan",
    jenis: { jenis_retribusi: "Retribusi Pelayanan Pasar" },
    jenis_retribusi: "Retribusi Pelayanan Pasar",
    tarif: 50000,
    tarif_retribusi: 50000,
    status: 1,
    gambar_1: "/images/pasar-johar.jpg",
  },
  {
    id: 2,
    id_gen_obyek: "OBJ002",
    obyek_retribusi: "Terminal Bus Terboyo",
    alamat: "Jl. Kaligawe, Semarang",
    lokasi: "Semarang",
    kota: { kab_kota: "Kota Semarang" },
    opd: { nama: "Dinas Perhubungan" },
    nama_opd: "Dinas Perhubungan",
    jenis: { jenis_retribusi: "Retribusi Terminal" },
    jenis_retribusi: "Retribusi Terminal",
    tarif: 25000,
    tarif_retribusi: 25000,
    status: 1,
    gambar_1: "/images/terminal-terboyo.jpg",
  },
  // Add more mock data as needed...
]

// Generate more mock data
const generateMockData = (count = 100) => {
  const locations = ["Semarang", "Solo", "Magelang", "Pekalongan", "Tegal", "Purwokerto", "Kudus", "Salatiga"]
  const opds = [
    "Dinas Perdagangan",
    "Dinas Perhubungan",
    "Dinas Kesehatan",
    "Dinas Pendidikan",
    "Dinas Pariwisata",
    "Dinas Lingkungan Hidup",
  ]
  const jenisLayanan = [
    "Retribusi Pelayanan Pasar",
    "Retribusi Terminal",
    "Retribusi Parkir",
    "Retribusi Kesehatan",
    "Retribusi Pendidikan",
    "Retribusi Pariwisata",
  ]

  const mockData = []
  for (let i = 1; i <= count; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)]
    const opd = opds[Math.floor(Math.random() * opds.length)]
    const jenis = jenisLayanan[Math.floor(Math.random() * jenisLayanan.length)]

    mockData.push({
      id: i,
      id_gen_obyek: `OBJ${String(i).padStart(3, "0")}`,
      obyek_retribusi: `Obyek Retribusi ${i} - ${location}`,
      alamat: `Jl. Contoh No. ${i}, ${location}`,
      lokasi: location,
      kota: { kab_kota: `Kota ${location}` },
      opd: { nama: opd },
      nama_opd: opd,
      jenis: { jenis_retribusi: jenis },
      jenis_retribusi: jenis,
      tarif: Math.floor(Math.random() * 100000) + 10000,
      tarif_retribusi: Math.floor(Math.random() * 100000) + 10000,
      status: Math.random() > 0.2 ? 1 : 0,
      gambar_1: `/placeholder.svg?height=200&width=300&text=Object${i}`,
    })
  }
  return mockData
}

// Cache untuk menyimpan data
const dataCache = {
  initialData: null,
  filterData: null,
  allData: generateMockData(8000), // Generate 8000 mock objects
  lastFetch: null,
}

class ApiService {
  constructor() {
    this.baseURL = "https://rpp.bapenda.jatengprov.go.id/api"
    this.timeout = 10000
  }

  // Load initial data (60 items for display)
  async loadInitialData(limit = 60) {
    try {
      console.log(`🔄 Loading initial ${limit} data...`)

      // Sort alphabetically and take first 60
      const sortedData = dataCache.allData
        .sort((a, b) => (a.obyek_retribusi || "").localeCompare(b.obyek_retribusi || ""))
        .slice(0, limit)

      dataCache.initialData = sortedData
      dataCache.lastFetch = Date.now()

      return {
        success: true,
        data: sortedData,
        hasMore: dataCache.allData.length > limit,
        totalLoaded: sortedData.length,
      }
    } catch (error) {
      console.error("❌ Error loading initial data:", error)
      return {
        success: false,
        message: error.message,
        data: [],
      }
    }
  }

  // Load more data for pagination
  async loadMoreData(currentCount) {
    try {
      console.log(`🔄 Loading more data from ${currentCount}...`)

      const batchSize = 60
      const sortedData = dataCache.allData.sort((a, b) =>
        (a.obyek_retribusi || "").localeCompare(b.obyek_retribusi || ""),
      )

      const newData = sortedData.slice(currentCount, currentCount + batchSize)

      return {
        success: true,
        data: newData,
        hasMore: currentCount + batchSize < dataCache.allData.length,
      }
    } catch (error) {
      console.error("❌ Error loading more data:", error)
      return {
        success: false,
        message: error.message,
        data: [],
      }
    }
  }

  // Get objects with filters and pagination
  async getObjects(page = 1, limit = 12, filters = {}) {
    try {
      console.log("🔄 Getting objects with filters:", filters, "Page:", page)

      let filteredData = [...dataCache.allData]

      // Apply filters
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        filteredData = filteredData.filter(
          (obj) =>
            (obj.obyek_retribusi || "").toLowerCase().includes(searchTerm) ||
            (obj.alamat || "").toLowerCase().includes(searchTerm) ||
            (obj.lokasi || "").toLowerCase().includes(searchTerm) ||
            (obj.kota?.kab_kota || "").toLowerCase().includes(searchTerm) ||
            (obj.opd?.nama || obj.nama_opd || "").toLowerCase().includes(searchTerm),
        )
      }

      if (filters.location) {
        filteredData = filteredData.filter((obj) =>
          (obj.kota?.kab_kota || obj.lokasi || "").toLowerCase().includes(filters.location.toLowerCase()),
        )
      }

      if (filters.opd) {
        filteredData = filteredData.filter((obj) =>
          (obj.opd?.nama || obj.nama_opd || "").toLowerCase().includes(filters.opd.toLowerCase()),
        )
      }

      if (filters.jenisLayanan) {
        filteredData = filteredData.filter((obj) =>
          (obj.jenis?.jenis_retribusi || obj.jenis_retribusi || "")
            .toLowerCase()
            .includes(filters.jenisLayanan.toLowerCase()),
        )
      }

      // Sort alphabetically
      filteredData.sort((a, b) => (a.obyek_retribusi || "").localeCompare(b.obyek_retribusi || ""))

      // Pagination
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedData = filteredData.slice(startIndex, endIndex)

      const hasActiveFilters = filters.search || filters.location || filters.opd || filters.jenisLayanan

      return {
        success: true,
        data: paginatedData,
        currentPage: page,
        totalPages: Math.ceil(filteredData.length / limit),
        totalRows: filteredData.length,
        totalLoaded: dataCache.allData.length,
        hasMore: dataCache.allData.length > 8000,
        isFiltering: hasActiveFilters,
      }
    } catch (error) {
      console.error("❌ Error getting objects:", error)
      return {
        success: false,
        message: error.message,
        data: [],
        currentPage: 1,
        totalPages: 0,
        totalRows: 0,
      }
    }
  }

  // Load filter data (dropdown options)
  async loadFilterData() {
    try {
      console.log("🔄 Loading filter data from 5000 objects...")

      if (dataCache.filterData) {
        console.log("✅ Using cached filter data")
        return dataCache.filterData
      }

      // Use first 5000 objects for filter options (OPTIMIZED)
      const filterDataSource = dataCache.allData.slice(0, 5000)

      // Extract unique values
      const locations = [
        ...new Set(filterDataSource.map((obj) => obj.kota?.kab_kota || obj.lokasi || "").filter(Boolean)),
      ].sort()

      const opds = [
        ...new Set(filterDataSource.map((obj) => obj.opd?.nama || obj.nama_opd || "").filter(Boolean)),
      ].sort()

      const jenisLayanan = [
        ...new Set(
          filterDataSource.map((obj) => obj.jenis?.jenis_retribusi || obj.jenis_retribusi || "").filter(Boolean),
        ),
      ].sort()

      const result = {
        success: true,
        locations,
        opds,
        jenisLayanan,
        totalProcessed: filterDataSource.length,
      }

      // Cache the result
      dataCache.filterData = result

      console.log("✅ Filter data loaded:", {
        locations: locations.length,
        opds: opds.length,
        jenisLayanan: jenisLayanan.length,
        totalProcessed: filterDataSource.length,
      })

      return result
    } catch (error) {
      console.error("❌ Error loading filter data:", error)
      return {
        success: false,
        message: error.message,
        locations: [],
        opds: [],
        jenisLayanan: [],
      }
    }
  }

  // Get object by ID
  async getObjectById(id) {
    try {
      console.log(`🔄 Getting object by ID: ${id}`)

      const object = dataCache.allData.find((obj) => obj.id == id || obj.id_gen_obyek == id)

      if (!object) {
        throw new Error("Object not found")
      }

      return {
        success: true,
        data: object,
      }
    } catch (error) {
      console.error("❌ Error getting object by ID:", error)
      return {
        success: false,
        message: error.message,
        data: null,
      }
    }
  }

  // Clear cache
  clearCache() {
    console.log("🗑️ Clearing cache...")
    dataCache.filterData = null
    dataCache.lastFetch = null
  }

  // Get connection status
  async getConnectionStatus() {
    try {
      // Simulate API check
      await new Promise((resolve) => setTimeout(resolve, 100))
      return {
        success: true,
        status: "connected",
        message: "API connection successful",
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        status: "disconnected",
        message: error.message,
        timestamp: new Date().toISOString(),
      }
    }
  }
}

// Export singleton instance
const apiService = new ApiService()
export default apiService
