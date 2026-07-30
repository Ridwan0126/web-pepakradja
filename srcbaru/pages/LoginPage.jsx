import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Home
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' })

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  useEffect(() => {
    generateCaptcha()
  }, [])

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    setCaptcha({ num1, num2, answer: '' })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleCaptchaChange = (e) => {
    setCaptcha({ ...captcha, answer: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (parseInt(captcha.answer) !== captcha.num1 + captcha.num2) {
      setError('Jawaban captcha tidak benar')
      generateCaptcha()
      return
    }

    if (!formData.email || !formData.password) {
      setError('Email/NPWPD dan password harus diisi')
      return
    }

    setIsLoading(true)

    try {
      login({ email: formData.email, name: formData.email })
      setSuccess('Login berhasil! Mengalihkan...')
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (err) {
      setError('Email/NPWPD atau password salah')
      generateCaptcha()
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Back to Home */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <Home className="w-4 h-4" />
            Kembali ke Beranda
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-primary rounded-xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">PR</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">PEPAK RAJA</h1>
              <p className="text-sm text-muted-foreground">Masuk ke akun Anda</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600"
              >
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{success}</p>
              </motion.div>
            )}

            {/* Email/NPWPD Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email atau 6 Digit NPWPD
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@contoh.com atau NPWPD"
                  className="w-full pl-12 pr-4 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full pl-12 pr-12 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Captcha: Berapa {captcha.num1} + {captcha.num2}?
              </label>
              <input
                type="number"
                value={captcha.answer}
                onChange={handleCaptchaChange}
                placeholder="Jawaban"
                className="w-full px-4 py-3.5 bg-muted rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/lupa-password"
                className="text-sm text-primary hover:underline"
              >
                Lupa Password?
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Register Link */}
          <p className="mt-8 text-center text-muted-foreground">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Daftar Sekarang
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative bg-primary">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold text-primary-foreground mb-4">
              Selamat Datang Kembali!
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-md">
              Masuk untuk mengakses semua layanan pajak dan retribusi daerah Jawa Tengah
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
