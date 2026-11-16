import { apiClient } from '@/lib/api-client'
import type { NftReviewsContract } from '@/types/review.contracts'

export async function getNftReviews(nftId: string, signal?: AbortSignal) {
  const { data } = await apiClient.get<NftReviewsContract>(`/nfts/${nftId}/reviews`, { signal })
  return data
}
