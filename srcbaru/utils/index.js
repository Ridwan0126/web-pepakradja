import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combine class names with Tailwind merge
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format currency to Indonesian Rupiah
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format date to Indonesian locale
export function formatDate(date, options = {}) {
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  return new Date(date).toLocaleDateString('id-ID', { ...defaultOptions, ...options })
}

// Format date time
export function formatDateTime(date) {
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Generate random ID
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}${timestamp}${random}`.toUpperCase()
}

// Validate email
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

// Validate phone number (Indonesian format)
export function isValidPhone(phone) {
  const regex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/
  return regex.test(phone.replace(/\s/g, ''))
}

// Validate NIK (Indonesian ID number)
export function isValidNIK(nik) {
  return /^\d{16}$/.test(nik)
}

// Validate NPWP
export function isValidNPWP(npwp) {
  const cleanNpwp = npwp.replace(/[.\-]/g, '')
  return /^\d{15}$/.test(cleanNpwp)
}

// Truncate text
export function truncateText(text, maxLength = 100) {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Debounce function
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Capitalize first letter
export function capitalizeFirst(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

// Get initials from name
export function getInitials(name) {
  if (!name) return ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

// Calculate age from birth date
export function calculateAge(birthDate) {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Sleep function for async/await
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}
