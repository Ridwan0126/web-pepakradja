"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import dataService from "../services/dataService"
import SplashScreen from "./SplashScreen"
import ObjectCard from "./ObjectCard"
import Pagination from "./Pagination"

const FeaturedProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 12

  useEffect(() => {
    loadFeaturedProducts()
  }, [currentPage])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      const result = await dataService.getObjects({
        limit: itemsPerPage,
        page: currentPage,
      })
      if (result.success) {
        setProducts(result.data)
        setTotalPages(Math.ceil(result.total / itemsPerPage))
        setTotalItems(result.total)
      }
    } catch (error) {
      console.error("Error loading featured products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="py-16">
        <SplashScreen />
      </div>
    )
  }

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Obyek Dan Jasa Pelayanan Pemerintah Provinsi Jawa Tengah</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temukan dan manfaatkan aset/jasa/layanan yang anda perlukan, dengan cepat, mudah dan murah disini.
          </p>
        </motion.div>

        {/* Results Summary */}
        {totalItems > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-lg">
              {/* <div>
                <p className="text-lg font-semibold text-gray-900">{totalItems} Obyek Retribusi</p>
                <p className="text-sm text-gray-600">
                  Halaman {currentPage} dari {totalPages}
                </p>
              </div> */}
              <div className="text-sm text-gray-600">
                Menampilkan {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
                {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems} hasil
              </div>
            </div>
          </motion.div>
        )}

        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ObjectCard key={product.id_gen_obyek} object={product} index={index} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <p className="text-gray-500 text-lg">Belum ada produk unggulan yang tersedia</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/obyek"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Lihat Semua Produk</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default FeaturedProducts
