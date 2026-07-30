"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function ServiceBadge({ children, className = "", ...props }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if text is long (more than 50 characters)
  const isLongText = children && children.length > 50
  const displayText = isLongText && !isExpanded ? `${children.substring(0, 50)}...` : children

  return (
    <div className={`inline-block ${className}`} {...props}>
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="text-xs font-medium text-emerald-600 mb-1">Jenis Pelayanan</div>
            <div className="text-sm font-semibold text-emerald-800 leading-relaxed">{displayText}</div>
          </div>

          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-emerald-100 transition-colors"
              title={isExpanded ? "Tampilkan lebih sedikit" : "Tampilkan selengkapnya"}
            >
              {isExpanded ? (
                <ChevronUp size={16} className="text-emerald-600" />
              ) : (
                <ChevronDown size={16} className="text-emerald-600" />
              )}
            </button>
          )}
        </div>

        {isLongText && (
          <div className="mt-2 text-xs text-emerald-600">
            {isExpanded ? "Klik untuk menyembunyikan" : "Klik untuk melihat selengkapnya"}
          </div>
        )}
      </div>
    </div>
  )
}
