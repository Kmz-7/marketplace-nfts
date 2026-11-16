import { delay, http, HttpResponse } from 'msw'
import type { CartItemInputContract, CartQuoteRequestContract } from '@/types/cart.contracts'
import type { ApiErrorContract } from '@/types/user.contracts'
import { getMockSession } from '@/mocks/state/auth.store'
import {
  getMockCart,
  replaceMockCart,
  validateMockCartItems,
  createMockCartQuote,
} from '@/mocks/state/commerce.store'

function readOwnerId(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null
  const session = getMockSession(token)
  return session.authenticated && session.user ? session.user.id : 'guest'
}

function errorResponse(code: string, message: string, status: number) {
  const error: ApiErrorContract = { code, message }
  return HttpResponse.json(error, { status })
}

function isCartItem(value: unknown): value is CartItemInputContract {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CartItemInputContract>
  return (
    typeof item.nftId === 'string' &&
    typeof item.editionId === 'string' &&
    Number.isInteger(item.quantity) &&
    Number(item.quantity) >= 1 &&
    Number(item.quantity) <= 100
  )
}

export const cartHandlers = [
  http.get('/api/cart', async ({ request }) => {
    await delay(180)
    return HttpResponse.json(getMockCart(readOwnerId(request)))
  }),

  http.put('/api/cart', async ({ request }) => {
    await delay(180)
    const body = (await request.json()) as { items?: unknown }
    if (!Array.isArray(body.items) || body.items.length > 24 || !body.items.every(isCartItem)) {
      return errorResponse('CART_INVALID', 'Revise os itens do carrinho e suas quantidades.', 422)
    }
    const validationError = validateMockCartItems(body.items)
    if (validationError === 'NFT_NOT_FOUND') {
      return errorResponse('NFT_NOT_FOUND', 'Um item do carrinho não foi encontrado.', 404)
    }
    if (validationError === 'EDITION_UNAVAILABLE') {
      return errorResponse('EDITION_UNAVAILABLE', 'Uma edição do carrinho não está disponível.', 409)
    }
    if (validationError === 'QUANTITY_UNAVAILABLE') {
      return errorResponse('QUANTITY_UNAVAILABLE', 'A quantidade excede as edições disponíveis.', 409)
    }
    return HttpResponse.json(replaceMockCart(readOwnerId(request), body.items))
  }),

  http.post('/api/cart/quote', async ({ request }) => {
    await delay(220)
    const body = (await request.json()) as Partial<CartQuoteRequestContract>
    if (
      (body.couponCode !== undefined && typeof body.couponCode !== 'string') ||
      (body.network !== undefined && !['ethereum', 'polygon', 'solana'].includes(body.network))
    ) {
      return errorResponse('QUOTE_INVALID', 'Cupom ou rede inválidos.', 422)
    }
    const { quote, error } = createMockCartQuote(readOwnerId(request), {
      couponCode: body.couponCode,
      network: body.network,
    })
    if (error === 'EMPTY_CART') return errorResponse(error, 'O carrinho está vazio.', 422)
    if (error === 'INVALID_COUPON') return errorResponse(error, 'O código promocional não é válido.', 422)
    if (error === 'EXPIRED_COUPON') return errorResponse(error, 'O código promocional expirou.', 422)
    if (error === 'EDITION_UNAVAILABLE') {
      return errorResponse(error, 'Uma edição não está mais disponível na quantidade selecionada.', 409)
    }
    return HttpResponse.json(quote)
  }),
]
