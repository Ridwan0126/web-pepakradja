import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, MapPin, DollarSign, Share2, Heart, Loader, ArrowLeft, CheckCircle } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useCartStore } from '../stores/cartStore'
import { retributiAPI_Endpoints } from '../services/api'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCartStore()
  
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAddedNotif, setShowAddedNotif] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await retributiAPI_Endpoints.getProduct(id)
        
        if (response.data.success && response.data.data) {
          setProduct(response.data.data)
        } else {
          setError('Produk tidak ditemukan')
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError('Gagal memuat detail produk. Silakan coba lagi.')
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem({
          id: product.id,
          name: product.obyek_retribusi,
          price: parseFloat(product.tariftbl?.tarif || 0),
          description: product.alamat,
        })
      }
      setShowAddedNotif(true)
      setTimeout(() => setShowAddedNotif(false), 3000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader className="w-16 h-16 text-green-600 animate-spin-slow" strokeWidth={1.5} />
            <p className="text-gray-600 text-lg">Memuat detail produk...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{error || 'Produk Tidak Ditemukan'}</h2>
            <p className="text-gray-600 mb-6">Produk yang Anda cari tidak dapat ditemukan atau telah dihapus.</p>
            <Link 
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-smooth"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-green-600 transition-colors">Katalog</Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold line-clamp-1">{product.obyek_retribusi}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Product Image & Gallery */}
          <div className="lg:col-span-1 animate-slide-in-down">
            <div className="sticky top-24 space-y-4">
              <div className="relative bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl overflow-hidden h-96 flex items-center justify-center shadow-lg">
                <div className="text-8xl opacity-30">📋</div>
                {product.is_laku && (
                  <div className="absolute top-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Aktif
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-smooth font-semibold"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  {isFavorite ? 'Disukai' : 'Sukai'}
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-xl hover:border-green-600 hover:bg-green-50 transition-smooth font-semibold text-gray-700">
                  <Share2 className="w-5 h-5" />
                  Bagikan
                </button>
              </div>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="lg:col-span-2 animate-slide-in-up">
            {/* Status & Type */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                {product.jenis?.jenis_retribusi}
              </span>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {product.opd?.nama}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.obyek_retribusi}</h1>
            
            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-gray-600">(128 ulasan)</span>
              <span className="text-sm text-green-600 font-semibold">Terpercaya</span>
            </div>

            {/* Details */}
            <div className="space-y-6 mb-8">
              {/* Lokasi */}
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600 mt-1" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Lokasi</p>
                  <p className="text-lg font-semibold text-gray-900">{product.alamat}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.kecamatan?.kecamatan}, {product.kota?.kab_kota}
                  </p>
                </div>
              </div>

              {/* Department Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Pengelola:</p>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">{product.opd?.nama}</p>
                  <p className="text-sm text-gray-600">{product.uppd?.nama}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-200 rounded-xl p-6">
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Tarif</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-green-600">
                        Rp {parseInt(product.tariftbl?.tarif || 0).toLocaleString('id-ID')}
                      </span>
                      <span className="text-gray-600">/ {product.tariftbl?.satuan?.satuan}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Basis Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Dasar Pengenaan</p>
                  <p className="font-semibold text-gray-900">{product.dasar_pengenaan}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">Dasar Penetapan</p>
                  <p className="font-semibold text-gray-900">{product.dasar_penetapan}</p>
                </div>
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6 sticky bottom-4">
              {/* Quantity Selector */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-3 font-semibold">Jumlah</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-smooth font-semibold"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center border border-gray-300 rounded-lg py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg hover:bg-gray-100 transition-smooth font-semibold"
                  >
                    +
                  </button>
                  <p className="text-sm text-gray-600 ml-auto">
                    Total: <span className="font-bold text-green-600">Rp {(parseInt(product.tariftbl?.tarif || 0) * quantity).toLocaleString('id-ID')}</span>
                  </p>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-smooth active:scale-95 flex items-center justify-center gap-2"
              >
                🛒 Tambah ke Keranjang
              </button>

              {/* Notification */}
              {showAddedNotif && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center gap-2 animate-slide-in-up">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Berhasil ditambahkan ke keranjang!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Services */}
        <div className="mt-20 py-12 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Layanan Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link key={i} to="/products" className="group">
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-smooth p-4 h-full border border-gray-100 hover:border-green-200">
                  <div className="bg-gradient-to-br from-green-300 to-teal-400 rounded-lg h-40 mb-4 flex items-center justify-center">
                    <span className="text-5xl opacity-30">📋</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">Layanan Retribusi {i}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">Deskripsi layanan terkait untuk membantu kebutuhan Anda</p>
                  <p className="font-bold text-green-600">Rp 500.000</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
