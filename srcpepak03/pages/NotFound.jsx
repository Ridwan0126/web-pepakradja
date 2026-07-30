import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Sorry, the page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            <Home className="w-5 h-5" />
            Go Back Home
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  )
}
