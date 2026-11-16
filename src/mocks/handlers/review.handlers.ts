import { delay, http, HttpResponse } from 'msw'
import type { ApiErrorContract } from '@/types/user.contracts'
import { reviewFixtures } from '@/mocks/fixtures/review.fixtures'
import { getNft } from '@/mocks/state/nft.store'

export const reviewHandlers = [
  http.get('/api/nfts/:nftId/reviews', async ({ params }) => {
    await delay(300)
    const nftId = String(params.nftId)
    if (!getNft(nftId)) {
      const error: ApiErrorContract = {
        code: 'NFT_NOT_FOUND',
        message: 'NFT não encontrado.',
      }
      return HttpResponse.json(error, { status: 404 })
    }

    const items = reviewFixtures
      .filter((review) => review.nftId === nftId)
      .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    const ratingTotal = items.reduce((sum, review) => sum + review.rating, 0)

    return HttpResponse.json({
      nftId,
      items,
      total: items.length,
      averageRating: items.length ? Number((ratingTotal / items.length).toFixed(1)) : 0,
    })
  }),
]
