import axios from 'axios'
import { getAuthToken } from '@/lib/auth-token'
import { waitForMockWorker } from '@/lib/mock-runtime'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 10_000,
})

apiClient.interceptors.request.use(async (config) => {
  if (import.meta.env.VITE_ENABLE_MOCKS === 'true') await waitForMockWorker()
  const token = getAuthToken()
  if (token) config.headers.set('Authorization', `Bearer ${token}`)
  else config.headers.delete('Authorization')
  return config
})
