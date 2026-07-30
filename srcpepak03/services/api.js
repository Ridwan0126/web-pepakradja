import axios from 'axios'

// API untuk Retribusi (Real API)
const retributiAPI = axios.create({
  baseURL: 'https://rpp.bapenda.jatengprov.go.id/penatausahaan/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

// API lokal untuk Auth & Orders (Mock/Backend)
const localAPI = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to local API requests
localAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle local API responses
localAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Retribusi API endpoints
export const retributiAPI_Endpoints = {
  // Get list of retribusi objects
  getProducts: (page = 1, limit = 20, filters = {}) => {
    const params = {
      limit,
      page,
      search: filters.search || '',
      id_kota: filters.id_kota || '3374', // Default: Kota Semarang
      id_opd: filters.id_opd || '05',
      sort_by: 'created_at',
      sort_order: 'desc',
    }
    return retributiAPI.get('/penakbusiti/obyek-retribusi', { params })
  },

  // Get single retribusi object detail
  getProduct: (id) => retributiAPI.get(`/penakbusiti/obyek-retribusi/${id}`),
}

// Local Auth API endpoints
export const authAPI = {
  login: (credentials) => localAPI.post('/auth/login', credentials),
  register: (userData) => localAPI.post('/auth/register', userData),
  logout: () => localAPI.post('/auth/logout'),
}

// Local Product API endpoints (fallback)
export const productAPI = {
  getProducts: (page = 1, limit = 20, filters = {}) =>
    retributiAPI_Endpoints.getProducts(page, limit, filters),
  getProduct: (id) => retributiAPI_Endpoints.getProduct(id),
  createProduct: (data) => localAPI.post('/products', data),
  updateProduct: (id, data) => localAPI.put(`/products/${id}`, data),
  deleteProduct: (id) => localAPI.delete(`/products/${id}`),
}

// Order API endpoints
export const orderAPI = {
  getOrders: () => localAPI.get('/orders'),
  getOrder: (id) => localAPI.get(`/orders/${id}`),
  createOrder: (data) => localAPI.post('/orders', data),
  updateOrder: (id, data) => localAPI.put(`/orders/${id}`, data),
}

// User API endpoints
export const userAPI = {
  getProfile: () => localAPI.get('/users/profile'),
  updateProfile: (data) => localAPI.put('/users/profile', data),
  getUsers: (page = 1, limit = 20) =>
    localAPI.get('/users', { params: { page, limit } }),
}

// Payment API endpoints
export const paymentAPI = {
  createPaymentIntent: (amount) =>
    localAPI.post('/payments/create-intent', { amount }),
  confirmPayment: (paymentIntentId) =>
    localAPI.post('/payments/confirm', { paymentIntentId }),
}

export { localAPI as default }
