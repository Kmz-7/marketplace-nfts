export const AUTH_TOKEN_STORAGE_KEY = 'kurio.auth.token.v1'

export function getAuthToken() {
  return globalThis.localStorage?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? null
}

export function setAuthToken(token: string) {
  globalThis.localStorage?.setItem(AUTH_TOKEN_STORAGE_KEY, token)
}

export function clearAuthToken() {
  globalThis.localStorage?.removeItem(AUTH_TOKEN_STORAGE_KEY)
}
