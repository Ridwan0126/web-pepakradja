import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SearchDropdown({ isOpen = false, onClose = () => {} }) {
  const [searchInput, setSearchInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()

  // Sample search suggestions
  const sampleSuggestions = [
    'Retribusi Parkir',
    'Pajak Properti',
    'Izin Mendirikan Bangunan',
    'Pajak Air Tanah',
    'Retribusi Kebersihan',
    'Izin Usaha Perdagangan',
    'Retribusi Pemakaian Kekayaan Daerah',
    'Bea Perolehan Hak atas Tanah dan Bangunan',
  ]

  useEffect(() => {
    if (!searchInput.trim()) {
      setSuggestions([])
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      const filtered = sampleSuggestions.filter((s) =>
        s.toLowerCase().includes(searchInput.toLowerCase())
      )
      setSuggestions(filtered)
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  const handleSelectSuggestion = (suggestion) => {
    navigate(`/products?search=${encodeURIComponent(suggestion)}`)
    setSearchInput('')
    setSuggestions([])
    onClose?.()
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchInput)}`)
      setSearchInput('')
      setSuggestions([])
      onClose?.()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="relative max-w-3xl mx-auto mt-24 mx-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          {/* Search Input */}
          <div className="relative bg-white rounded-2xl shadow-2xl border-2 border-blue-200 focus-within:border-blue-500">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari obyek retribusi, pajak, atau layanan..."
              className="w-full pl-12 pr-12 py-4 text-lg outline-none rounded-2xl font-medium"
              autoFocus
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  setSuggestions([])
                  searchRef.current?.focus()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Suggestions Dropdown */}
          {(searchInput || suggestions.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-blue-100 overflow-hidden">
              {loading ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Sedang mencari...
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-600">
                      Saran Pencarian
                    </p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectSuggestion(suggestion)}
                        className="w-full px-6 py-3 text-left hover:bg-blue-50 transition flex items-center gap-3 group"
                      >
                        <Search className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition" />
                        <span className="text-gray-700 group-hover:text-blue-600 transition font-medium">
                          {suggestion}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : searchInput ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  Tidak ada hasil untuk "{searchInput}"
                </div>
              ) : null}
            </div>
          )}
        </form>

        {/* Quick Links */}
        {!searchInput && (
          <div className="mt-6 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
            <p className="text-sm font-semibold text-gray-600 mb-4">
              Pencarian Populer
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleSuggestions.slice(0, 6).map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="px-4 py-2 text-left bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-md transition text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
