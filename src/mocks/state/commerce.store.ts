import type {
  CartContract,
  CartItemInputContract,
  CartLineContract,
  CartQuoteContract,
} from '@/types/cart.contracts'
import type {
  CreateOrderRequestContract,
  OrderContract,
  OrderItemContract,
  OrderUpdatedEventContract,
} from '@/types/order.contracts'
import { orderFixtures } from '@/mocks/fixtures/order.fixtures'
import { formatEth, parseEth } from '@/lib/eth'
import { getNft } from './nft.store'

const COMMERCE_STORAGE_KEY = 'kurio.mock.commerce.v1'

type IdempotencyRecord = { fingerprint: string; orderId: string }
type CommerceState = {
  carts: Record<string, CartItemInputContract[]>
  cartVersions: Record<string, number>
  orders: OrderContract[]
  idempotency: Record<string, IdempotencyRecord>
  orderVersions: Record<string, number>
}
export type MockCommerceScenario = 'normal' | 'payment-declined' | 'payment-pending' | 'timeout-after-create'

type StoredQuote = CartQuoteContract & { ownerId: string; network: string }
let latestQuotes = new Map<string, StoredQuote>()
let commerceScenario: MockCommerceScenario = 'normal'

function copyOrder(order: OrderContract): OrderContract {
  return { ...order, items: order.items.map((item) => ({ ...item })) }
}

function initialState(): CommerceState {
  return {
    carts: {},
    cartVersions: {},
    orders: orderFixtures.map(copyOrder),
    idempotency: {},
    orderVersions: Object.fromEntries(orderFixtures.map((order) => [order.id, 1])),
  }
}

function readState(): CommerceState {
  try {
    const stored = globalThis.localStorage?.getItem(COMMERCE_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<CommerceState>
      if (parsed && parsed.carts && parsed.cartVersions && parsed.orders && parsed.idempotency) {
        return {
          ...(parsed as CommerceState),
          orderVersions:
            parsed.orderVersions ??
            Object.fromEntries(parsed.orders.map((order) => [order.id, 1])),
        }
      }
    }
  } catch {
    // Private browsing can disable persistent storage; the mock continues in memory for this request.
  }
  return initialState()
}

function writeState(state: CommerceState) {
  try {
    globalThis.localStorage?.setItem(COMMERCE_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing can disable persistent storage; the mock continues in memory for this session.
  }
}

function editionPrice(nftId: string, editionId: string) {
  const nft = getNft(nftId)
  return nft?.editionPricesEth?.[editionId] ?? (nft?.edition === editionId ? nft.priceEth : undefined)
}

function availableEditionQuantity(nftId: string, editionId: string) {
  const nft = getNft(nftId)
  if (!nft?.available || !editionPrice(nftId, editionId)) return 0
  if (editionId === '1/1') return 1
  if (editionId === 'ABERTA') return 100
  const editionCount = Number(editionId.split('/')[1])
  if (!Number.isInteger(editionCount) || editionCount <= 1) return 0
  return Math.min(25, editionCount - 1)
}

function lineFromInput(input: CartItemInputContract): CartLineContract | undefined {
  const nft = getNft(input.nftId)
  if (!nft) return undefined
  const price = editionPrice(input.nftId, input.editionId)
  const availableQuantity = availableEditionQuantity(input.nftId, input.editionId)
  return {
    id: `${input.nftId}::${input.editionId}`,
    nftId: nft.id,
    editionId: input.editionId,
    quantity: input.quantity,
    tokenId: `#${nft.id.match(/(\d+)$/)?.[1]?.padStart(4, '0') ?? nft.id}`,
    name: nft.name,
    creator: nft.creator,
    collection: nft.collection,
    imageUrl: nft.imageUrl,
    unitPriceEth: price ?? nft.priceEth,
    availableQuantity,
    available: availableQuantity > 0,
  }
}

function getCartInputs(state: CommerceState, ownerId: string) {
  return state.carts[ownerId] ?? []
}

export function getMockCart(ownerId: string): CartContract {
  const state = readState()
  let ownerItems = getCartInputs(state, ownerId)
  if (ownerId !== 'guest' && (state.carts.guest?.length ?? 0) > 0) {
    const merged = new Map(ownerItems.map((item) => [`${item.nftId}::${item.editionId}`, item]))
    for (const item of state.carts.guest) {
      const key = `${item.nftId}::${item.editionId}`
      const existing = merged.get(key)
      merged.set(key, { ...item, quantity: item.quantity + (existing?.quantity ?? 0) })
    }
    ownerItems = [...merged.values()]
    state.carts[ownerId] = ownerItems
    state.carts.guest = []
    state.cartVersions[ownerId] = (state.cartVersions[ownerId] ?? 0) + 1
    state.cartVersions.guest = (state.cartVersions.guest ?? 0) + 1
    writeState(state)
  }
  return {
    items: ownerItems.map(lineFromInput).filter((item): item is CartLineContract => Boolean(item)),
    version: state.cartVersions[ownerId] ?? 0,
  }
}

export function replaceMockCart(ownerId: string, items: CartItemInputContract[]): CartContract {
  const state = readState()
  state.carts[ownerId] = items.map((item) => ({ ...item }))
  state.cartVersions[ownerId] = (state.cartVersions[ownerId] ?? 0) + 1
  writeState(state)
  latestQuotes.delete(ownerId)
  return getMockCart(ownerId)
}

export function validateMockCartItems(items: CartItemInputContract[]) {
  for (const item of items) {
    const nft = getNft(item.nftId)
    if (!nft) return 'NFT_NOT_FOUND' as const
    const line = lineFromInput(item)
    if (!line?.available) return 'EDITION_UNAVAILABLE' as const
    if (item.quantity > line.availableQuantity) return 'QUANTITY_UNAVAILABLE' as const
  }
  return undefined
}

function quoteFor(ownerId: string, request: { couponCode?: string; network?: string }, id: string) {
  const cart = getMockCart(ownerId)
  const lines = cart.items
  const subtotalUnits = lines.reduce(
    (sum, item) => sum + parseEth(item.unitPriceEth) * BigInt(item.quantity),
    0n,
  )
  const couponCode = request.couponCode?.trim().toLocaleUpperCase('en-US') || null
  const discountUnits = couponCode === 'KURIO10' ? subtotalUnits / 10n : 0n
  const fee = request.network?.toLocaleLowerCase('en-US') === 'polygon' ? '0.004' :
    request.network?.toLocaleLowerCase('en-US') === 'solana' ? '0.002' : '0.016'
  const feeUnits = lines.length ? parseEth(fee) : 0n
  const quote: CartQuoteContract = {
    id,
    cartVersion: cart.version,
    items: lines,
    couponCode,
    subtotalEth: formatEth(subtotalUnits),
    discountEth: formatEth(discountUnits),
    networkFeeEth: formatEth(feeUnits),
    totalEth: formatEth(subtotalUnits - discountUnits + feeUnits),
    expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
  }
  return { quote, fee }
}

export function createMockCartQuote(
  ownerId: string,
  request: { couponCode?: string; network?: string },
): { quote: CartQuoteContract; error?: 'EMPTY_CART' | 'INVALID_COUPON' | 'EXPIRED_COUPON' | 'EDITION_UNAVAILABLE' } {
  const cart = getMockCart(ownerId)
  if (cart.items.length === 0) return { quote: quoteFor(ownerId, request, '').quote, error: 'EMPTY_CART' }
  if (request.couponCode?.trim() && !['KURIO10', 'EXPIRED10'].includes(request.couponCode.trim().toLocaleUpperCase('en-US'))) {
    return { quote: quoteFor(ownerId, request, '').quote, error: 'INVALID_COUPON' }
  }
  if (request.couponCode?.trim().toLocaleUpperCase('en-US') === 'EXPIRED10') {
    return { quote: quoteFor(ownerId, request, '').quote, error: 'EXPIRED_COUPON' }
  }
  const unavailable = cart.items.some((item) => !item.available || item.quantity > item.availableQuantity)
  if (unavailable) return { quote: quoteFor(ownerId, request, '').quote, error: 'EDITION_UNAVAILABLE' }
  const { quote } = quoteFor(ownerId, request, crypto.randomUUID())
  latestQuotes.set(ownerId, { ...quote, ownerId, network: request.network ?? 'ethereum' })
  return { quote }
}

export function createMockOrder(
  ownerId: string,
  request: CreateOrderRequestContract,
  idempotencyKey: string,
): {
  order?: OrderContract
  event?: OrderUpdatedEventContract
  error?: 'IDEMPOTENCY_CONFLICT' | 'QUOTE_EXPIRED' | 'QUOTE_CHANGED'
  replayed: boolean
} {
  const state = readState()
  const fingerprint = JSON.stringify(request)
  const scopedIdempotencyKey = `${ownerId}:${idempotencyKey}`
  const prior = state.idempotency[scopedIdempotencyKey]
  if (prior) {
    if (prior.fingerprint !== fingerprint) return { error: 'IDEMPOTENCY_CONFLICT', replayed: true }
    const existing = state.orders.find((order) => order.id === prior.orderId)
    return { order: existing ? copyOrder(existing) : undefined, replayed: true }
  }
  const quote = latestQuotes.get(ownerId)
  if (!quote || quote.id !== request.quoteId || Date.parse(quote.expiresAt) <= Date.now()) {
    return { error: 'QUOTE_EXPIRED', replayed: false }
  }
  const currentQuote = quoteFor(ownerId, { couponCode: quote.couponCode ?? undefined, network: request.network }, quote.id).quote
  const currentCart = getMockCart(ownerId)
  const unavailable = currentCart.items.some(
    (item) => !item.available || item.quantity > item.availableQuantity,
  )
  if (
    unavailable ||
    currentQuote.cartVersion !== quote.cartVersion ||
    currentQuote.subtotalEth !== quote.subtotalEth ||
    currentQuote.discountEth !== quote.discountEth ||
    currentQuote.networkFeeEth !== quote.networkFeeEth ||
    currentQuote.totalEth !== quote.totalEth
  ) {
    return { error: 'QUOTE_CHANGED', replayed: false }
  }
  const now = new Date().toISOString()
  const status = commerceScenario === 'payment-declined'
    ? 'declined'
    : commerceScenario === 'payment-pending'
      ? 'pending'
      : 'confirmed'
  const orderItems: OrderItemContract[] = quote.items.map((item) => ({
    nftId: item.nftId,
    editionId: item.editionId,
    name: item.name,
    imageUrl: item.imageUrl,
    unitPriceEth: item.unitPriceEth,
    quantity: item.quantity,
  }))
  const order: OrderContract = {
    id: `order-${crypto.randomUUID()}`,
    userId: ownerId,
    status,
    wallet:
      request.wallet === 'metamask'
        ? 'MetaMask'
        : request.wallet === 'walletconnect'
          ? 'WalletConnect'
          : 'Coinbase Wallet',
    network: request.network === 'polygon' ? 'Polygon' : request.network === 'solana' ? 'Solana' : 'Ethereum',
    items: orderItems,
    subtotalEth: quote.subtotalEth,
    discountEth: quote.discountEth,
    networkFeeEth: quote.networkFeeEth,
    totalEth: quote.totalEth,
    transactionReference: status === 'confirmed' ? `0x${crypto.randomUUID().replaceAll('-', '').slice(0, 24)}` : null,
    createdAt: now,
    updatedAt: now,
  }
  state.orders.push(order)
  state.idempotency[scopedIdempotencyKey] = { fingerprint, orderId: order.id }
  state.orderVersions[order.id] = 1
  if (status === 'confirmed') {
    state.carts[ownerId] = []
    state.cartVersions[ownerId] = (state.cartVersions[ownerId] ?? 0) + 1
  }
  writeState(state)
  return {
    order: copyOrder(order),
    event: {
      eventId: `order.updated:${order.id}:1`,
      version: 1,
      resource: 'order',
      order: copyOrder(order),
    },
    replayed: false,
  }
}

export function setMockOrderStatus(orderId: string, status: 'confirmed' | 'declined') {
  const state = readState()
  const orderIndex = state.orders.findIndex((candidate) => candidate.id === orderId)
  if (orderIndex < 0) return { error: 'ORDER_NOT_FOUND' as const }
  const current = state.orders[orderIndex]
  if (current.status !== 'pending') return { error: 'ORDER_ALREADY_FINAL' as const }

  const now = new Date().toISOString()
  const order: OrderContract = {
    ...current,
    status,
    transactionReference:
      status === 'confirmed'
        ? current.transactionReference ?? `0x${crypto.randomUUID().replaceAll('-', '').slice(0, 24)}`
        : null,
    updatedAt: now,
  }
  state.orders[orderIndex] = order
  const version = (state.orderVersions[order.id] ?? 0) + 1
  state.orderVersions[order.id] = version

  if (status === 'confirmed') {
    const purchased = new Map(
      order.items.map((item) => [`${item.nftId}::${item.editionId}`, item.quantity]),
    )
    const remaining = (state.carts[order.userId] ?? []).flatMap((item) => {
      const key = `${item.nftId}::${item.editionId}`
      const remainingQuantity = item.quantity - (purchased.get(key) ?? 0)
      purchased.delete(key)
      return remainingQuantity > 0 ? [{ ...item, quantity: remainingQuantity }] : []
    })
    state.carts[order.userId] = remaining
    state.cartVersions[order.userId] = (state.cartVersions[order.userId] ?? 0) + 1
  }
  writeState(state)
  return {
    event: {
      eventId: `order.updated:${order.id}:${version}`,
      version,
      resource: 'order' as const,
      order: copyOrder(order),
    },
  }
}

export function getMockOrder(orderId: string) {
  const state = readState()
  const order = state.orders.find((candidate) => candidate.id === orderId)
  return order ? copyOrder(order) : undefined
}

export function setMockCommerceScenario(scenario: MockCommerceScenario) {
  commerceScenario = scenario
}

export function getMockCommerceScenario() {
  return commerceScenario
}

export function resetMockCommerce() {
  writeState(initialState())
  latestQuotes = new Map()
  commerceScenario = 'normal'
}
