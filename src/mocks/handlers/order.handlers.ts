import { delay, http, HttpResponse } from 'msw'
import type { ApiErrorContract } from '@/types/user.contracts'
import { orderFixtures } from '../fixtures/order.fixtures'

export const orderHandlers = [
  http.get('/api/orders/:orderId', async ({ params }) => {
    await delay(350)
    const order = orderFixtures.find((fixture) => fixture.id === params.orderId)
    if (!order) {
      const error: ApiErrorContract = { code: 'ORDER_NOT_FOUND', message: 'Pedido não encontrado.' }
      return HttpResponse.json(error, { status: 404 })
    }
    return HttpResponse.json(order)
  }),
]
