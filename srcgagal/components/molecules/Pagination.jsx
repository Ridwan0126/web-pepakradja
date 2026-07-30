"use client"

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Button from "../atoms/Button"

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  totalItems = 0,
  itemsPerPage = 10,
  className = "",
}) {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...")
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = totalPages > 1 ? getVisiblePages() : [1]

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  if (totalPages <= 1) return null

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-6 ${className}`}>
      {/* Results info - Responsive */}
      <div className="text-sm text-gray-700 order-2 sm:order-1">
        <span className="block sm:inline">
          Menampilkan <span className="font-medium">{startItem}</span> sampai{" "}
          <span className="font-medium">{endItem}</span>
        </span>
        <span className="block sm:inline sm:ml-1">
          dari <span className="font-medium">{totalItems.toLocaleString()}</span> hasil
        </span>
      </div>

      {/* Pagination controls - Responsive */}
      <div className="flex items-center space-x-1 order-1 sm:order-2">
        {/* Previous button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center space-x-1 px-2 sm:px-3"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Button>

        {/* Page numbers - Responsive */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`dots-${index}`} className="px-2 py-1 text-gray-500">
                  <MoreHorizontal size={16} />
                </span>
              )
            }

            return (
              <Button
                key={page}
                variant={currentPage === page ? "primary" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={`min-w-[32px] sm:min-w-[40px] px-2 sm:px-3 ${
                  currentPage === page ? "bg-blue-600 text-white border-blue-600" : "text-gray-700 hover:bg-gray-50"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            )
          })}
        </div>

        {/* Next button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center space-x-1 px-2 sm:px-3"
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
