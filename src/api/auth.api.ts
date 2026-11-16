import { apiClient } from '@/lib/api-client'
import { clearAuthToken, setAuthToken } from '@/lib/auth-token'
import type {
  AuthCredentialsContract,
  AuthResponseContract,
  RegisterAccountContract,
  SessionContract,
} from '@/types/user.contracts'

export async function getSession(signal?: AbortSignal) {
  const { data } = await apiClient.get<SessionContract>('/session', { signal })
  if (!data.authenticated) clearAuthToken()
  return data
}

export async function loginAccount(credentials: AuthCredentialsContract) {
  const { data } = await apiClient.post<AuthResponseContract>('/auth/login', credentials)
  setAuthToken(data.accessToken)
  return data
}

export async function registerAccount(account: RegisterAccountContract) {
  const { data } = await apiClient.post<AuthResponseContract>('/auth/register', account)
  setAuthToken(data.accessToken)
  return data
}

export async function logoutAccount() {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    clearAuthToken()
  }
  return { authenticated: false, user: null } satisfies SessionContract
}
