import axios from 'axios'
import { getAuthToken } from '@/lib/auth-token'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 10_000,
})

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  else config.headers.delete('Authorization')
  return config
})
