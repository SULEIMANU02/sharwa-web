import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  // Optionally attach token from storage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('arg_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err)
  }
)

export default api
