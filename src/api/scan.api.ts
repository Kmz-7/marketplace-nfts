import { apiClient } from '@/lib/api-client'
import { ensureMockDomain } from '@/lib/mock-runtime'
import type { ScanResolveContract, ScanResolveRequest } from '@/types/scan.contracts'

export async function resolveScanCode(payload: ScanResolveRequest, signal?: AbortSignal) {
  await ensureMockDomain('scan')
  const { data } = await apiClient.post<ScanResolveContract>('/scan/resolve', payload, { signal })
  return data
}
