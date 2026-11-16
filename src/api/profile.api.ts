import { apiClient } from '@/lib/api-client'
import { ensureMockDomain } from '@/lib/mock-runtime'
import type {
  PasswordUpdateContract,
  ProfileContract,
  ProfileUpdateContract,
} from '@/types/user.contracts'

export async function getProfile(signal?: AbortSignal) {
  await ensureMockDomain('profile')
  const { data } = await apiClient.get<ProfileContract>('/profile', { signal })
  return data
}

export async function updateProfile(profile: ProfileUpdateContract) {
  await ensureMockDomain('profile')
  const { data } = await apiClient.put<ProfileContract>('/profile', profile)
  return data
}

export async function updateProfilePassword(password: PasswordUpdateContract) {
  await ensureMockDomain('profile')
  const { data } = await apiClient.put<{ updated: boolean }>('/profile/password', password)
  return data
}
