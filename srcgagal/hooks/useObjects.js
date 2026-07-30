"use client"

import { useState, useEffect, useCallback } from "react"
import apiService from "../services/api"

export function useObjects(itemsPerPage = 12) {
  // State management
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalObjects, setTotalObjects] = useState(0)
  const [totalLoaded, setTotalLoaded] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [opdFilter, setOPDFilter] = useState("")
  const [jenisLayananFilter, setJenisLayananFilter] = useState("")

  // Data storage
  const [allData, setAllData] = useState([]) // For display mode (alphabetical)
  const [filteredData, setFilteredData] = useState([]) // For filter mode

  // Calculate total pages
  const totalPages = Math.ceil(totalObjects / itemsPerPage)

  // Load initial data (60 items, alphabetically sorted)
  const loadInitialData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔄 Loading initial 60 data (alphabetical order)...")

      const result = await apiService.loadInitialData(60) // Load 60 items for 5 pages of 12 items each

      if (result.success) {
        const sortedData = result.data.sort((a, b) => {
          const nameA = (a.obyek_retribusi || "").toLowerCase()
          const nameB = (b.obyek_retribusi || "").toLowerCase()
          return nameA.localeCompare(nameB)
        })

        setAllData(sortedData)
        setTotalLoaded(sortedData.length)
        setTotalObjects(sortedData.length)
        setHasMore(result.hasMore)

        // Display first page
        const startIndex = 0
        const endIndex = itemsPerPage
        setObjects(sortedData.slice(startIndex, endIndex))

        console.log("✅ Initial data loaded:", {
          total: sortedData.length,
          displayed: sortedData.slice(startIndex, endIndex).length,
          hasMore: result.hasMore,
        })
      } else {
        throw new Error(result.message || "Failed to load initial data")
      }
    } catch (err) {
      console.error("❌ Error loading initial data:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [itemsPerPage])

  // Load more data when needed (for pagination beyond initial 60)
  const loadMoreData = useCallback(async () => {
    if (!hasMore || isFiltering) return

    try {
      setLoading(true)
      console.log("🔄 Loading more data...")

      const result = await apiService.loadMoreData(allData.length)

      if (result.success) {
        const newData = [...allData, ...result.data]
        const sortedData = newData.sort((a, b) => {
          const nameA = (a.obyek_retribusi || "").toLowerCase()
          const nameB = (b.obyek_retribusi || "").toLowerCase()
          return nameA.localeCompare(nameB)
        })

        setAllData(sortedData)
        setTotalLoaded(sortedData.length)
        setTotalObjects(sortedData.length)
        setHasMore(result.hasMore)

        console.log("✅ More data loaded:", {
          total: sortedData.length,
          hasMore: result.hasMore,
        })
      }
    } catch (err) {
      console.error("❌ Error loading more data:", err)
    } finally {
      setLoading(false)
    }
  }, [allData, hasMore, isFiltering])

  // Apply filters - FIXED TO USE CORRECT API METHOD
  const applyFilters = useCallback(async () => {
    const hasActiveFilters = searchTerm || locationFilter || opdFilter || jenisLayananFilter

    if (!hasActiveFilters) {
      // No filters - use display mode with alphabetical data
      setIsFiltering(false)
      setTotalObjects(allData.length)

      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      setObjects(allData.slice(startIndex, endIndex))

      console.log("📄 Display mode - showing alphabetical data")
      return
    }

    // Has filters - use filter mode
    try {
      setLoading(true)
      setIsFiltering(true)

      console.log("🔍 Applying filters:", {
        search: searchTerm,
        location: locationFilter,
        opd: opdFilter,
        jenisLayanan: jenisLayananFilter,
      })

      // Use the correct API method that exists
      const result = await apiService.getObjects(currentPage, itemsPerPage, {
        search: searchTerm,
        location: locationFilter,
        opd: opdFilter,
        jenisLayanan: jenisLayananFilter,
      })

      if (result.success) {
        setObjects(result.data)
        setTotalObjects(result.totalRows)
        setFilteredData(result.data)

        console.log("✅ Filters applied:", {
          totalFound: result.totalRows,
          displayed: result.data.length,
        })
      } else {
        throw new Error(result.message || "Failed to apply filters")
      }
    } catch (err) {
      console.error("❌ Error applying filters:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [searchTerm, locationFilter, opdFilter, jenisLayananFilter, currentPage, itemsPerPage, allData])

  // Handle page changes
  const handlePageChange = useCallback(
    (page) => {
      setCurrentPage(page)

      // Check if we need to load more data (for display mode)
      if (!isFiltering && page >= 5 && allData.length < page * itemsPerPage) {
        loadMoreData()
      }
    },
    [isFiltering, allData.length, itemsPerPage, loadMoreData],
  )

  // Reset all filters
  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setLocationFilter("")
    setOPDFilter("")
    setJenisLayananFilter("")
    setCurrentPage(1)
    setIsFiltering(false)
    setError(null)

    // Return to display mode
    setTotalObjects(allData.length)
    setObjects(allData.slice(0, itemsPerPage))

    console.log("🔄 All filters reset - back to alphabetical display mode")
  }, [allData, itemsPerPage])

  // Refresh data
  const refreshData = useCallback(() => {
    setCurrentPage(1)
    loadInitialData()
  }, [loadInitialData])

  // Load initial data on mount
  useEffect(() => {
    loadInitialData()
  }, [loadInitialData])

  // Apply filters when they change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Update objects when page changes
  useEffect(() => {
    if (isFiltering) {
      // Filter mode - use filtered data
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      setObjects(filteredData.slice(startIndex, endIndex))
    } else {
      // Display mode - use all data (alphabetical)
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      setObjects(allData.slice(startIndex, endIndex))
    }
  }, [currentPage, isFiltering, filteredData, allData, itemsPerPage])

  return {
    // Data
    objects,
    loading,
    error,
    totalObjects,
    currentPage,
    totalPages,
    totalLoaded,
    hasMore,
    isFiltering,

    // Filters
    filters: {
      search: searchTerm,
      location: locationFilter,
      opd: opdFilter,
      jenisLayanan: jenisLayananFilter,
    },

    // Actions
    setSearchTerm,
    setLocationFilter,
    setOPDFilter,
    setJenisLayananFilter,
    setCurrentPage: handlePageChange,
    resetFilters,
    refreshData,
  }
}
