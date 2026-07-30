import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Star, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { retributiAPI_Endpoints } from '../services/api'
import SkeletonLoader from './SkeletonLoader'

export default function ProductGrid({ filters = {}, searchTerm = '' }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(20)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    fetchProducts(currentPage)
  }, [currentPage, itemsPerPage, filters, searchTerm])

  const fetchProducts = async (page) => {
    try {
      setLoading(true)
      const response = await retributiAPI_Endpoints.getProducts(page, itemsPerPage, {
        search: searchTerm || filters.search || '',
        ...filters,
      })

      if (response.data.success && response.data.data) {
        setProducts(response.data.data.data || response.data.data)
        setTotalItems(response.data.data.total || response.data.data.length || 0)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage + 1
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 animate-slide-in-up">
        <div>
          <p className="text-sm text-gray-600">
            Menampilkan{' '}
            <span className="font-semibold text-gray-900">
              {startIndex} - {endIndex}
            </span>{' '}
            dari{' '}
            <span className="font-semibold text-gray-900">{totalItems}</span> hasil
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Items Per Page */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-700">Tampilkan:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(parseInt(e.target.value))
                setCurrentPage(1)
              }}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors font-semibold"
            >
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(20)].map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
          {products.map((product, idx) => (
            <Link
              key={product.id || idx}
              to={`/products/${product.id}`}
              className="group rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-blue-500 transition-smooth hover:shadow-xl animate-scale-in"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden flex items-center justify-center">
                <div className="text-6xl opacity-20">📋</div>

                {/* Status Badge */}
                {product.is_laku && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    Aktif
                  </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                  {product.jenis?.jenis_retribusi?.slice(0, 8)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {product.obyek_retribusi}
                </h3>

                {/* Location */}
                <div className="flex items-start gap-1 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {product.alamat || product.kecamatan?.kecamatan}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-3 pb-3 border-b border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Tarif</p>
                  <p className="text-lg font-bold text-blue-600">
                    Rp {parseInt(product.tariftbl?.tarif || 0).toLocaleString('id-ID')}
                  </p>
                </div>

                {/* Manager */}
                <p className="text-xs text-gray-600 truncate">
                  {product.opd?.nama}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-900">4.8</span>
                  <span className="text-xs text-gray-500">(128)</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-2xl text-gray-600 mb-4">Tidak ada produk ditemukan</p>
          <p className="text-gray-500">Coba ubah filter atau cari dengan keyword lain</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 animate-fade-in">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = idx + 1
              } else if (currentPage <= 3) {
                pageNum = idx + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + idx
              } else {
                pageNum = currentPage - 2 + idx
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-smooth ${
                    currentPage === pageNum
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'border-2 border-gray-200 text-gray-700 hover:border-blue-500'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
