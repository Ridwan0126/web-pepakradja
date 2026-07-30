import { Search, Sliders, X } from 'lucide-react'
import { useState } from 'react'

export default function ProductFilter({ onFilterChange, onSearch }) {
  const [filters, setFilters] = useState({
    search: '',
    objectType: '',
    city: '',
    manager: '',
    category: '',
  })

  const [showMobileFilter, setShowMobileFilter] = useState(false)

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleSearch = (value) => {
    handleFilterChange('search', value)
    onSearch?.(value)
  }

  const handleReset = () => {
    setFilters({
      search: '',
      objectType: '',
      city: '',
      manager: '',
      category: '',
    })
    onFilterChange?.({
      search: '',
      objectType: '',
      city: '',
      manager: '',
      category: '',
    })
  }

  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Cari Obyek
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Masukkan nama obyek..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Lokasi
        </label>
        <select
          value={filters.city}
          onChange={(e) => handleFilterChange('city', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Pilih Lokasi</option>
          <option value="semarang">Semarang</option>
          <option value="jakarta">Jakarta</option>
          <option value="bandung">Bandung</option>
          <option value="surabaya">Surabaya</option>
        </select>
      </div>

      {/* Manager */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Pengelola
        </label>
        <select
          value={filters.manager}
          onChange={(e) => handleFilterChange('manager', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Pilih Pengelola</option>
          <option value="bapenda">Bapenda</option>
          <option value="satpol">Satpol PP</option>
          <option value="dinas">Dinas Terkait</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Kategori
        </label>
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Semua Kategori</option>
          <option value="pajak">Pajak</option>
          <option value="retribusi">Retribusi</option>
          <option value="izin">Izin & Pendaftaran</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <button
          onClick={() => {}}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-smooth active:scale-95"
        >
          Cari
        </button>
        <button
          onClick={handleReset}
          className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-smooth"
        >
          Reset
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden md:block bg-white rounded-2xl p-6 border border-gray-200 mb-8 animate-slide-in-up">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Filter</h3>
        <FilterContent />
      </div>

      {/* Mobile Filter Button */}
      <div className="md:hidden mb-6 flex gap-3">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl font-semibold text-gray-900 hover:border-blue-500 transition-colors"
        >
          <Sliders className="w-5 h-5" />
          Filter
        </button>
      </div>

      {/* Mobile Filter Panel */}
      {showMobileFilter && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur"
            onClick={() => setShowMobileFilter(false)}
          />

          {/* Panel */}
          <div className="relative bg-white rounded-t-3xl p-6 mt-20 animate-slide-in-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Filter</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-smooth"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <FilterContent />
          </div>
        </div>
      )}
    </>
  )
}
