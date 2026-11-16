import { apiClient } from '@/lib/api-client'
import type { UserContract } from '@/types/user.contracts'

export async function getUsers(signal?: AbortSignal) {
  const { data } = await apiClient.get<UserContract[]>('/users', { signal })
  return data
}
