import { apiClient } from '@/lib/api-client'
import type { NftContract, NftListContract, NftQueryParams, NftUpdatedEvent } from '@/types/nft.contracts'

export async function getNfts(params: NftQueryParams = {}, signal?: AbortSignal) {
  const { data } = await apiClient.get<NftListContract>('/nfts', { params, signal })
  return data
}

export async function getNft(id: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<NftContract>(`/nfts/${id}`, { signal })
  return data
}

export async function updateMockNft(id: string, changes: Partial<Pick<NftContract, 'priceEth' | 'available'>>) {
  const { data } = await apiClient.post<NftUpdatedEvent>(`/mock/nfts/${id}/update`, changes)
  return data
}

export async function resetMockApi() {
  const { data } = await apiClient.post<{ reset: boolean }>('/mock/reset')
  return data
}
