import { apiClient } from '@/lib/api-client'
import type { ScanResolveContract, ScanResolveRequest } from '@/types/scan.contracts'

export async function resolveScanCode(payload: ScanResolveRequest, signal?: AbortSignal) {
  const { data } = await apiClient.post<ScanResolveContract>('/scan/resolve', payload, { signal })
  return data
}
