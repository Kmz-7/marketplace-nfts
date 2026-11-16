import { delay, http, HttpResponse } from 'msw'
import type { ApiErrorContract } from '@/types/user.contracts'
import type { NftQueryParams } from '@/types/nft.contracts'
import { broadcastNftUpdated } from '@/mocks/socket/socket.server'
import {
  getNetworkScenario,
  getNft,
  getNfts,
  resetNftStore,
  setNetworkScenario,
  updateNft,
  type MockNetworkScenario,
} from '@/mocks/state/nft.store'

function readNumber(value: string | null, fallback: number) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : fallback
}

function networkFailure() {
  const scenario = getNetworkScenario()
  if (scenario === 'offline') return HttpResponse.error()
  if (scenario === 'server-error')
    return HttpResponse.json(
      { code: 'MOCK_UNAVAILABLE', message: 'Falha simulada do serviço.' },
      { status: 503 },
    )
  return undefined
}

async function applyDelay(request: Request, fallback = 350) {
  const delayHeader = request.headers.get('x-mock-delay')
  const configuredDelay = delayHeader === null ? Number.NaN : Number(delayHeader)
  const delayMs = Number.isFinite(configuredDelay)
    ? Math.min(Math.max(configuredDelay, 0), 5000)
    : getNetworkScenario() === 'slow'
      ? 1800
      : fallback
  await delay(delayMs)
}

export const nftHandlers = [
  http.get('/api/nfts', async ({ request }) => {
    const failure = networkFailure()
    if (failure) return failure
    const url = new URL(request.url)
    const query: NftQueryParams = {
      q: url.searchParams.get('q') ?? undefined,
      page: readNumber(url.searchParams.get('page'), 1),
      pageSize: Math.min(readNumber(url.searchParams.get('pageSize'), 9), 24),
      sort: (url.searchParams.get('sort') as NftQueryParams['sort']) ?? 'recent',
      collection: url.searchParams.get('collection') ?? undefined,
      network: url.searchParams.get('network') ?? undefined,
      minPrice: url.searchParams.get('minPrice') ?? undefined,
      maxPrice: url.searchParams.get('maxPrice') ?? undefined,
    }

    await applyDelay(request)

    const search = query.q?.trim().toLocaleLowerCase('pt-BR')
    let results = getNfts().filter(
      (nft) =>
        (!search ||
          `${nft.name} ${nft.creator} ${nft.collection}`
            .toLocaleLowerCase('pt-BR')
            .includes(search)) &&
        (!query.collection || nft.collection === query.collection) &&
        (!query.network || nft.network === query.network) &&
        (!query.minPrice || Number(nft.priceEth) >= Number(query.minPrice)) &&
        (!query.maxPrice || Number(nft.priceEth) <= Number(query.maxPrice)),
    )

    if (query.sort === 'price-asc')
      results = [...results].sort((a, b) => Number(a.priceEth) - Number(b.priceEth))
    if (query.sort === 'recommended')
      results = [...results].sort((a, b) => Number(a.priceEth) - Number(b.priceEth))
    if (query.sort === 'price-desc')
      results = [...results].sort((a, b) => Number(b.priceEth) - Number(a.priceEth))
    if (query.sort === 'trending')
      results = [...results].sort((a, b) => Number(b.priceEth) - Number(a.priceEth))

    const total = results.length
    const totalPages = Math.max(1, Math.ceil(total / query.pageSize!))
    const page = Math.min(query.page!, totalPages)
    const start = (page - 1) * query.pageSize!

    return HttpResponse.json({
      items: results.slice(start, start + query.pageSize!),
      total,
      page,
      pageSize: query.pageSize,
      totalPages,
    })
  }),

  http.get('/api/nfts/:nftId', async ({ params, request }) => {
    const failure = networkFailure()
    if (failure) return failure
    await applyDelay(request, 250)
    const nft = getNft(String(params.nftId))
    if (!nft) {
      const error: ApiErrorContract = { code: 'NFT_NOT_FOUND', message: 'NFT não encontrado.' }
      return HttpResponse.json(error, { status: 404 })
    }
    return HttpResponse.json(nft)
  }),

  http.post('/api/mock/nfts/:nftId/update', async ({ params, request }) => {
    const body = (await request.json()) as { priceEth?: unknown; available?: unknown }
    if (
      (body.priceEth !== undefined &&
        (typeof body.priceEth !== 'string' || !/^\d+(\.\d{1,8})?$/.test(body.priceEth))) ||
      (body.available !== undefined && typeof body.available !== 'boolean') ||
      (body.priceEth === undefined && body.available === undefined)
    ) {
      const error: ApiErrorContract = {
        code: 'VALIDATION_ERROR',
        message: 'Preço ou disponibilidade inválidos.',
      }
      return HttpResponse.json(error, { status: 422 })
    }
    const changes = {
      ...(body.priceEth === undefined ? {} : { priceEth: body.priceEth as string }),
      ...(body.available === undefined ? {} : { available: body.available as boolean }),
    }
    const event = updateNft(String(params.nftId), changes)
    if (!event) {
      const error: ApiErrorContract = { code: 'NFT_NOT_FOUND', message: 'NFT não encontrado.' }
      return HttpResponse.json(error, { status: 404 })
    }
    broadcastNftUpdated(event)
    return HttpResponse.json(event)
  }),

  http.post('/api/mock/reset', () => {
    resetNftStore()
    return HttpResponse.json({ reset: true })
  }),

  http.post('/api/mock/scenario', async ({ request }) => {
    const body = (await request.json()) as { scenario?: unknown }
    const scenarios: MockNetworkScenario[] = ['normal', 'slow', 'offline', 'server-error']
    if (!scenarios.includes(body.scenario as MockNetworkScenario)) {
      const error: ApiErrorContract = {
        code: 'VALIDATION_ERROR',
        message: `Cenários aceitos: ${scenarios.join(', ')}.`,
      }
      return HttpResponse.json(error, { status: 422 })
    }
    setNetworkScenario(body.scenario as MockNetworkScenario)
    return HttpResponse.json({ scenario: body.scenario })
  }),
]
