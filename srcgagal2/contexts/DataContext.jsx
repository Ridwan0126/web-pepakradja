"use client"
import { createContext, useContext, useState, useEffect } from "react"
import dataService from "../services/dataService"

export const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

export const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [objects, setObjects] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    opds: [],
    serviceTypes: [],
  })
  const [currentFilters, setCurrentFilters] = useState({
    search: "",
    location: "",
    opd: "",
    serviceType: "",
    page: 1,
    limit: 12, // Changed from 10 to 12 items per page
  })
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    hasActiveFilters: false,
  })

  // Load filter options on mount
  useEffect(() => {
    loadFilterOptions()
  }, [])

  // Load objects when filters change
  useEffect(() => {
    loadObjects()
  }, [currentFilters])

  const loadFilterOptions = () => {
    const options = dataService.getFilterOptions()
    setFilterOptions(options)
  }

  const loadObjects = async () => {
    setLoading(true)
    try {
      const hasActiveFilters =
        currentFilters.search || currentFilters.location || currentFilters.opd || currentFilters.serviceType

      const result = await dataService.getObjects(currentFilters)
      if (result.success) {
        setObjects(result.data)
        setPagination({
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.page,
          hasActiveFilters,
        })
      }
    } catch (error) {
      console.error("Error loading objects:", error)
    } finally {
      setLoading(false)
    }
  }

  const syncData = async (forceSync = false) => {
    setLoading(true)
    try {
      const result = await dataService.syncAllData(forceSync)
      if (result.success) {
        loadFilterOptions()
        await loadObjects()
      }
      return result
    } catch (error) {
      console.error("Error syncing data:", error)
      return { success: false, message: "Gagal sinkronisasi data" }
    } finally {
      setLoading(false)
    }
  }

  const updateFilters = (newFilters) => {
    setCurrentFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }))
  }

  const resetFilters = () => {
    const resetFilters = {
      search: "",
      location: "",
      opd: "",
      serviceType: "",
      page: 1,
      limit: 12, // Changed from 10 to 12 items per page
    }
    setCurrentFilters(resetFilters)
  }

  const value = {
    loading,
    objects,
    filterOptions,
    currentFilters,
    pagination,
    loadObjects,
    syncData,
    updateFilters,
    resetFilters,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}
