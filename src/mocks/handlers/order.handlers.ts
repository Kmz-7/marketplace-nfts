import { delay, http, HttpResponse } from 'msw'
import type { ApiErrorContract } from '@/types/user.contracts'
import type { CreateOrderRequestContract } from '@/types/order.contracts'
import { getMockSession } from '@/mocks/state/auth.store'
import { broadcastOrderUpdated } from '@/mocks/socket/socket.server'
import {
  createMockOrder,
  getMockCommerceScenario,
  getMockOrder,
  setMockCommerceScenario,
  setMockOrderStatus,
} from '@/mocks/state/commerce.store'

function errorResponse(code: string, message: string, status: number) {
  const error: ApiErrorContract = { code, message }
  return HttpResponse.json(error, { status })
}

function readSession(request: Request) {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? null
  return getMockSession(token)
}

export const orderHandlers = [
  http.get('/api/orders/:orderId', async ({ params, request }) => {
    await delay(350)
    const session = readSession(request)
    if (!session.authenticated || !session.user) {
      return errorResponse('UNAUTHENTICATED', 'Entre na sua conta para consultar o pedido.', 401)
    }
    const order = getMockOrder(String(params.orderId))
    if (!order) {
      return errorResponse('ORDER_NOT_FOUND', 'Pedido não encontrado.', 404)
    }
    if (order.userId !== session.user.id) {
      return errorResponse('ORDER_FORBIDDEN', 'Este pedido não pertence à sua conta.', 403)
    }
    return HttpResponse.json(order)
  }),

  http.post('/api/orders', async ({ request }) => {
    await delay(350)
    const session = readSession(request)
    if (!session.authenticated || !session.user) {
      return errorResponse('UNAUTHENTICATED', 'Entre na sua conta para concluir o pedido.', 401)
    }
    const body = (await request.json()) as Partial<CreateOrderRequestContract>
    const idempotencyKey = request.headers.get('Idempotency-Key')?.trim()
    if (!idempotencyKey || idempotencyKey.length > 128) {
      return errorResponse('IDEMPOTENCY_KEY_REQUIRED', 'A tentativa de compra precisa de um identificador.', 422)
    }
    if (
      typeof body.quoteId !== 'string' ||
      !['metamask', 'walletconnect', 'coinbase'].includes(String(body.wallet)) ||
      !['ethereum', 'polygon', 'solana'].includes(String(body.network))
    ) {
      return errorResponse('ORDER_INVALID', 'Revise a cotação, a carteira e a rede selecionadas.', 422)
    }
    const result = createMockOrder(
      session.user.id,
      body as CreateOrderRequestContract,
      idempotencyKey,
    )
    if (result.error === 'IDEMPOTENCY_CONFLICT') {
      return errorResponse('IDEMPOTENCY_CONFLICT', 'A mesma chave foi usada com dados diferentes.', 409)
    }
    if (result.error === 'QUOTE_EXPIRED') {
      return errorResponse('QUOTE_EXPIRED', 'A cotação expirou. Solicite uma nova cotação.', 409)
    }
    if (result.error === 'QUOTE_CHANGED') {
      return errorResponse('QUOTE_CHANGED', 'Preço, disponibilidade ou taxa mudaram; revise a nova cotação.', 409)
    }
    if (!result.order) return errorResponse('ORDER_NOT_FOUND', 'Não foi possível recuperar o pedido.', 404)
    if (result.event) broadcastOrderUpdated(result.event)
    if (getMockCommerceScenario() === 'timeout-after-create' && !result.replayed) {
      return errorResponse('ORDER_TIMEOUT', 'A resposta do pedido demorou. Reenvie a mesma tentativa para recuperar o resultado.', 504)
    }
    return HttpResponse.json(result.order, { status: result.replayed ? 200 : 201 })
  }),

  http.post('/api/mock/commerce-scenario', async ({ request }) => {
    const body = (await request.json()) as { scenario?: unknown }
    const scenarios = ['normal', 'payment-declined', 'payment-pending', 'timeout-after-create'] as const
    if (!scenarios.includes(body.scenario as (typeof scenarios)[number])) {
      return errorResponse('SCENARIO_INVALID', `Cenários aceitos: ${scenarios.join(', ')}.`, 422)
    }
    setMockCommerceScenario(body.scenario as (typeof scenarios)[number])
    return HttpResponse.json({ scenario: body.scenario })
  }),

  http.post('/api/mock/orders/:orderId/status', async ({ params, request }) => {
    const session = readSession(request)
    if (!session.authenticated || !session.user) {
      return errorResponse('UNAUTHENTICATED', 'Entre na sua conta para atualizar o pedido.', 401)
    }
    const orderId = String(params.orderId)
    const current = getMockOrder(orderId)
    if (!current) return errorResponse('ORDER_NOT_FOUND', 'Pedido não encontrado.', 404)
    if (current.userId !== session.user.id) {
      return errorResponse('ORDER_FORBIDDEN', 'Este pedido não pertence à sua conta.', 403)
    }
    const body = (await request.json()) as { status?: unknown }
    if (body.status !== 'confirmed' && body.status !== 'declined') {
      return errorResponse('ORDER_STATUS_INVALID', 'Use o estado confirmed ou declined.', 422)
    }
    const result = setMockOrderStatus(orderId, body.status)
    if (result.error === 'ORDER_NOT_FOUND') {
      return errorResponse(result.error, 'Pedido não encontrado.', 404)
    }
    if (result.error === 'ORDER_ALREADY_FINAL') {
      return errorResponse(result.error, 'O pedido já tem um estado final.', 409)
    }
    if (!result.event) return errorResponse('ORDER_UPDATE_FAILED', 'Não foi possível atualizar o pedido.', 500)
    broadcastOrderUpdated(result.event)
    return HttpResponse.json(result.event)
  }),
]
