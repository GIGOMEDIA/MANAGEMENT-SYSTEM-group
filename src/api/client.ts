import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.storems.dev/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const raw = localStorage.getItem('auth-storage')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        const token = parsed?.state?.token
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch {
        // ignore
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Global response error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
