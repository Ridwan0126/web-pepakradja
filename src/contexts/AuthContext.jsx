import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationPending, setVerificationPending] = useState(false)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setIsLoading(true)
      setError(null)
      // Replace with your actual API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      const newToken = data.token
      const newUser = data.user
      
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) throw new Error('Registration failed')
      
      const data = await response.json()
      const newToken = data.token
      const newUser = data.user
      
      setToken(newToken)
      setUser(newUser)
      localStorage.setItem('authToken', newToken)
      localStorage.setItem('user', JSON.stringify(newUser))
      
      return newUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const sendVerificationEmail = async (email) => {
    try {
      setIsLoading(true)
      setError(null)
      setVerificationPending(true)
      
      // Mock: In production, call actual API
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/send-verification-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // })
      
      // Mock implementation
      console.log(`[v0] Verification email would be sent to: ${email}`)
      return { success: true, message: 'Email verifikasi telah dikirim' }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const verifyEmail = async (email, code) => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Mock: In production, call actual API
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, code }),
      // })
      
      // Mock implementation - accept any 6-digit code
      if (code && code.length === 6) {
        setEmailVerified(true)
        setVerificationPending(false)
        if (user) {
          const updatedUser = { ...user, emailVerified: true, verifiedAt: new Date().toISOString() }
          setUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
        return { success: true, message: 'Email berhasil diverifikasi' }
      } else {
        throw new Error('Kode verifikasi tidak valid')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setEmailVerified(false)
    setVerificationPending(false)
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    token,
    isLoading,
    error,
    emailVerified,
    verificationPending,
    login,
    register,
    logout,
    sendVerificationEmail,
    verifyEmail,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
